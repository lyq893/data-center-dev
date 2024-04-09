const os = require('os');
const path = require('path');

const minimist = require('minimist');
const express = require('express');
const bodyParser = require('body-parser');
const {StaticPool} = require('node-worker-threads-pool');

const log = require('./log');

/********************************* 全局常量 **********************************/

// 默认端口号
const DEFAULT_PORT = 8989;

// 默认常量池大小上下界
const DEFAULT_POOL_SIZE_MIN = 2;
const DEFAULT_POOL_SIZE_MAX = 4;

// 参数解析配置
const argvParseConfig = {
    number: [
        'port', // 监听端口
        'pool', // 线程池大小
    ],
    boolean: [
        'prebuild', // 启动时开始默认编译
        'warmup',   // 启动时预热各个线程
        'measure',  // 启用性能分析
    ],
    string: [
        'mode',      // 使用模式，可选项 build/import，默认 build
        'output',    // 默认编译的输出路径
        'error-log', // 错误日志输出路径
    ],
};

// 参数默认值
const defaultsArgs = {
    'port': DEFAULT_PORT,
    'pool': Math.max(Math.min(os.cpus().length, DEFAULT_POOL_SIZE_MAX), DEFAULT_POOL_SIZE_MIN),
    'mode': 'build',
    'output': path.join(__dirname, '..', '..', 'nginx', 'html'),
    'error-log': path.join(__dirname, '..', 'package-error.log'),
};

// 解析命令行参数
const args = parseArgs();

/********************************* 全局对象 **********************************/

// 线程池
const pool = new StaticPool({
    size: args.pool,
    task: path.resolve(__dirname, 'task.js'),
    workerData: {
        mode: args.mode,
        projectPath: path.resolve(__dirname, '..'),
        defaultOutput: args['output'],
        workaroundUmask: process.umask(),
        measure: !!args.measure,
    },
});

// 服务配置
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.raw());

// 编译状态记录
const records = {
    latest: undefined,
    status: {},
};

/********************************* 配置路由 **********************************/

// 单页面编译入口
app.post('/buildEntry', async (req, res) => {
    const result = await pool.exec({
        method: 'buildEntry',
        params: {
            ...req.body,
        },
    });
    if (!result.succeed) {
        log.error(result.msg);
    }
    res.json(result);
});

// 默认编译入口
app.post('/buildDefault', async (req, res) => {
    const result = await pool.exec({
        method: 'buildDefault',
        params: {
            ...req.body,
        },
    });
    if (!result.succeed) {
        log.error(result.msg);
    }
    res.json(result);
});

// 生产环境导入操作的全量编译
app.post('/compile', async (req, res) => {
    const compileId = req.body.compileId != null ? req.body.compileId : `anonymous-${Number(new Date())}`;

    records.latest = records.status[compileId] = null;
    pool.exec({
        method: 'buildCompile',
        params: {
            ...req.body,
            compileId,
        },
    }).then(result => {
        records.latest = records.status[compileId] = result;
        if (!result.succeed) {
            log.error(result.msg);
        }
    }).catch(err => {
        const msg = String(err);
        records.latest = records.status[compileId] = {succeed: false, code: 500, msg: msg, data: null};
        log.error(msg);
    });
    res.json({succeed: true, code: 200});
});

// 生产环境导入操作的编译轮询
app.post("/compilingCheck", async (req, res) => {
    // 查找任务结果
    let result;
    const compileId = req.body.compileId;
    if (compileId == null) {
        result = records.latest;
    } else {
        result = records.status[compileId];
    }

    let data;
    if (result === undefined) {
        // 任务不存在
        data = {succeed: false, code: 500, data: {finished: false, msg: null}};
    } else if (result === null) {
        // 任务未结束
        data = {succeed: false, code: 200, data: {finished: false, msg: null}};
    } else if (result.succeed) {
        // 任务成功
        data = {succeed: true, code: 200, data: {finished: true, msg: null}};
    } else {
        // 任务失败
        data = {succeed: false, code: 200, data: {finished: true, msg: result.msg}};
    }
    res.json(data);
});

/********************************* 服务启动 **********************************/

/**
 * 服务启动入口。
 */
function main() {
    // 初始化日志
    log.init(args['error-log']);

    // 启动时编译默认配置并预热线程
    let warmupRepeat = args.pool;
    let startupTasks = [];
    if (args.prebuild) {
        startupTasks.push(pool.exec({
            method: 'buildDefault',
            params: {},
        }));
        warmupRepeat -= 1;
    }
    if (args.warmup) {
        for (let i = 0; i < warmupRepeat; i++) {
            startupTasks.push(pool.exec({
                method: 'warmup',
                params: {},
            }));
        }
    }
    Promise.all(startupTasks).then(function () {
        console.log(`Build server: all ${args.pool} threads were ready to work`);
    }, function () {
        console.error('Build server: failed to run warmup or prebuild task on some of the threads');
    });

    // 启动服务
    app.listen(args.port, () => {
        console.info(`Build server listening at http://localhost:${args.port}`)
    });
}

/**
 * 解析命令行参数。
 *
 * @returns {Object} 命令行解析结果
 */
function parseArgs() {
    // 解析命令行并设置默认值
    const args = minimist(process.argv.slice(2), argvParseConfig);
    for (const key in defaultsArgs) {
        if (args[key] == null) {
            args[key] = defaultsArgs[key];
        }
    }

    // 进一步处理命令行参数的逻辑
    args.mode = String(args.mode).toLowerCase();
    switch (args.mode) {
        case 'import':
            console.log(`build server is running in import mode, forbid prebuild and warmup, limit pool size to 1`);
            args.pool = 1;
            args.prebuild = false;
            args.warmup = false;
            break;
        case 'build':
            break;
        default:
            console.warn(`unrecognized build server mode: ${args.mode}, use build mode`);
            args.mode = 'build';
    }

    // 显示服务的运行参数
    console.log('Build server configurations:');
    for (const key of Object.keys(args)) {
        if (key !== '_') {
            console.log(`${key} = ${args[key]}`);
        }
    }
    console.log();

    return args;
}

// 启动服务
main();
