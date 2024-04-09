// 规避工作线程限制
setupWorkarounds();
const fs = require('fs');
const os = require('os');
const nodePath = require('path');
const {parentPort, workerData, threadId} = require('worker_threads');

const rimraf = require('rimraf');

const {createCompiler, executeCompiler} = require('./webpack');

/********************************* 日志常量 **********************************/

const LOG_LEVEL_TRACE = 1;
const LOG_LEVEL_DEBUG = 2;
const LOG_LEVEL_INFO = 3;
const LOG_LEVEL_WARN = 4;
const LOG_LEVEL_ERROR = 5;

const LOG_LEVEL_DEFAULT = 0;
const LOG_LEVEL_VERBOSE = 0;
const LOG_LEVEL_QUIET = 99;

/********************************* 业务代码 **********************************/

/**
 * 业务初始化。
 */
function init() {
}

/**
 * 线程业务入口。
 */
async function main(arg) {
    const {method, params} = arg;
    switch (method) {
        case 'warmup':
            return await warmup.call(this, params);
        case 'buildEntry':
            return await buildEntry.call(this, params);
        case 'buildDefault':
            return await buildDefault.call(this, params);
        case 'buildCompile':
            return await buildCompile.call(this, params);
        default:
            throw new Error(`method not support: ${method}`);
    }
}

/**
 * 预热线程，走一遍编译来加载模块、建立缓存、预热 JIT。
 *
 * @returns {Promise<void>} 预热结果
 */
async function warmup() {
    console.info('thread warmup started');

    // 日志等级调整到静默
    const level = console.level();
    console.level(LOG_LEVEL_QUIET);

    // 执行一次全量编译，输出到临时文件夹
    const tmp = await mkdtemp(`warmup-${threadId}`);
    await buildDefault({output: tmp});
    await rmdir(tmp);

    // 还原日志等级
    console.level(level);
}

/**
 * 单页面编译业务。
 *
 * @param {{ name: string, path: string, entry: string, template: string, output: string }} params 单页面编译参数
 */
async function buildEntry(params) {
    // 处理参数
    const {name, path, entry, template, output} = params;

    // 创建编译器
    const startTime = timestamp();
    const compiler = createCompiler({
        name: name,
        page: name,
        entry: nodePath.resolve(entry),
        template: nodePath.resolve(template),
        filename: name + '.html',
    }, {
        projectPath: workerData.projectPath,
        allowMinimize: false,
    });
    const configTime = timestamp();
    console.info(`configured in ${elapsed(startTime, configTime)}`);

    // 开始编译
    await executeCompiler(compiler, {
        outputPath: nodePath.resolve(output),
        publicPath: './',
        noFilenameRewrite: false,
        entryClass: new Date().getTime(),
        chunkClass: name,
    });
    const compileTime = timestamp();
    console.info(`compiled in ${elapsed(configTime, compileTime)}`);
}

/**
 * 默认编译业务。
 *
 * @param {{output?: string, path?: string}} params 默认编译参数
 */
async function buildDefault(params) {
    // 处理参数
    let {output, path} = params;
    output = output || nodePath.resolve(workerData.defaultOutput);
    path = path || './';

    const startTime = timestamp();
    const compiler = createCompiler(undefined, {
        projectPath: workerData.projectPath,
        allowMinimize: false,
        copyVfg: true,
        copyPublic: true,
        copyTheme: true,
        copyHussarConfig: true
    });
    const configTime = timestamp();
    console.info(`default configured in ${elapsed(startTime, configTime)}`);

    // 开始编译
    await executeCompiler(compiler, {
        outputPath: nodePath.resolve(output),
        publicPath: path,
        noFilenameRewrite: false,
    });
    const compileTime = timestamp();
    console.info(`default compiled in ${elapsed(configTime, compileTime)}`);
}

/**
 * 生产环境导入操作的全量编译。
 *
 * @param {{output?: string, path?: string}} params 默认编译参数
 */
async function buildCompile(params) {
    // 处理参数
    let {output, path} = params;
    output = output || nodePath.resolve(workerData.defaultOutput);
    path = path || './';

    const startTime = timestamp();
    const compiler = createCompiler(undefined, {
        projectPath: workerData.projectPath,
        allowMinimize: true,
    });
    const configTime = timestamp();
    console.info(`default configured in ${elapsed(startTime, configTime)}`);

    // 开始编译
    await executeCompiler(compiler, {
        outputPath: nodePath.resolve(output),
        publicPath: path,
        noFilenameRewrite: true,
    });
    const compileTime = timestamp();
    console.info(`default compiled in ${elapsed(configTime, compileTime)}`);
}

/******************************** 线程初始化 *********************************/

/**
 * 线程初始化。
 */
function threadSetup() {
    // 规避工作线程限制
    setupWorkarounds();

    // 初始化日志
    setupLogging();

    // 处理任务输入
    parentPort.on('message', async function () {
        const start = timestamp();
        const method = arguments.length > 0 && arguments[0] != null ? arguments[0].method : undefined;
        console.info(`task begins, method is ${method}, timestamp is ${start}`);

        try {
            const data = await main.apply(workerData, arguments);

            const end = timestamp();
            console.info(`task succeed, elapsed time is ${elapsed(start, end)}`);
            parentPort.postMessage({succeed: true, code: 200, msg: null, data: data !== undefined ? data : null});
        } catch (err) {
            const end = timestamp();
            console.error(`task failed, elapsed time is ${elapsed(start, end)}`);
            console.error(err);
            parentPort.postMessage({succeed: false, code: 500, msg: String(err), data: null});
        }
    });

    // 捕获未处理的异步异常
    process.on('unhandledRejection', (err) => {
        throw err;
    });

    // 开始业务初始化
    console.info(`initializing thread, using: ${JSON.stringify(workerData)}`);
    init.call(workerData);
}

/**
 * 规避 NodeJS 对工作线程的一些限制。
 */
function setupWorkarounds() {
    process.umask = function () {
        return workerData.workaroundUmask != null ? workerData.workaroundUmask : 18;
    };
}

/**
 * 线程日志初始化。
 */
function setupLogging() {
    // 当前日志等级
    let currentLevel = LOG_LEVEL_DEFAULT;

    // 获取和设置日志等级
    console.level = function (level) {
        if (level != null) {
            currentLevel = level;
        }
        return currentLevel;
    };

    // 修改默认的日志输出函数
    function decorate(fn, level) {
        const prefix = `[WORKER ${threadId}]`;
        return function () {
            let args;
            if (arguments.length > 0 && typeof arguments[0] === 'string') {
                // 支持第一个参数是格式化字符串的情况
                args = [prefix + ' ' + arguments[0]];
                Array.prototype.push.apply(args, Array.from(arguments).slice(1));
            } else {
                // 其他情况直接拼接参数
                args = [prefix];
                Array.prototype.push.apply(args, arguments);
            }
            if (level >= currentLevel) {
                fn.apply(this, args);
            }
        };
    }

    console.log = decorate(console.log, LOG_LEVEL_INFO);
    console.trace = decorate(console.trace, LOG_LEVEL_TRACE);
    console.debug = decorate(console.debug, LOG_LEVEL_DEBUG);
    console.info = decorate(console.info, LOG_LEVEL_INFO);
    console.warn = decorate(console.warn, LOG_LEVEL_WARN);
    console.error = decorate(console.error, LOG_LEVEL_ERROR);
}

/**
 * 创建临时文件夹。
 *
 * @param {string} prefix 临时文件夹前缀
 * @returns {Promise<string>} 创建的临时文件夹位置
 */
function mkdtemp(prefix) {
    return new Promise(function (resolve, reject) {
        const pathPrefix = nodePath.join(os.tmpdir(), prefix || `tmp-${Number(new Date())}`);
        fs.mkdtemp(pathPrefix, {encoding: 'utf8'}, function (err, tmp) {
            if (err == null) {
                resolve(tmp);
            } else {
                reject(err);
            }
        });
    });
}

/**
 * 递归删除文件夹及其内容。
 *
 * @param dir 文件夹路径
 * @returns {Promise<null>} 文件夹删除结果
 */
function rmdir(dir) {
    return new Promise(function (resolve, reject) {
        rimraf(dir, {glob: false}, function (err) {
            if (err == null) {
                resolve(null);
            } else {
                reject(err);
            }
        });
    });
}

/**
 * 当前时间戳。
 *
 * @returns {number} 时间戳
 */
function timestamp() {
    return Number(new Date());
}

/**
 * 计算过程耗时。
 *
 * @param start 开始时间戳
 * @param end 结束时间戳
 * @returns {string}
 */
function elapsed(start, end) {
    return `${(end - start) / 1000}s`
}

// 初始化线程
threadSetup();
