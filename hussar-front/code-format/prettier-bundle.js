// prettier配置
const prettier = require('prettier');
const styleOrder = require('prettier-plugin-style-order');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const { ESLint } = require('eslint');

const app = express();
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.text());
app.use(bodyParser.raw());
app.use(compression());

// CodeFormat服务入口
app.post('/codeFormat', async (req, res) => {
  try {
    const params = {
      ...req.body
    };
    // 使用prettier格式化html+js+css代码
    const sourceCode = params.sourceCode;
    // 获取解析器类型
    const parserType = params.parserType;
    const checkedCode = params.checkedCode;
    // prettier规则
    const options = {
      printWidth: 10000, // 单行最大长度
      tabWidth: 2, // tab缩进大小,默认为2
      parser: parserType, // 解析器
      htmlWhitespaceSensitivity: 'ignore', // 空格敏感模式
      semi: true, // 总是在语句末尾打印分号
      bracketSpacing: true, // 对象中打印空格 例如：true: {foo: bar} => true: { foo: bar }
      singleQuote: true, // 字符串使用单引号
      jsxBracketSameLine: true, // 标签尖括号放在行末，而不是下一行(对自闭元素不生效)
      arrowParens: 'always', // 在单个箭头函数参数周围加上括号
      plugins: [styleOrder], // 引入排序的插件
      styleOrder: {
        alphabetize: true // 对css样式的属性按照字母进行排序
      }
    };
    const messages = [];
    let isSucceed = true;
    // 是否存在错误
    try {
      if (checkedCode) {
        const eslint = new ESLint();
        const results = await eslint.lintText(params.sourceCode);
        results.forEach((result) => {
          if (result.fatalErrorCount > 0) {
            result.messages.forEach((message) => {
              if (message.fatal) {
                const msg = {
                  msg: message.message,
                  line: message.line,
                  column: message.column
                };
                messages.push(msg);
              }
            });
          }
        });
      }
      if (messages.length > 0) {
        isSucceed = false;
      } else {
        try {
          // 使用prettier格式化代码
          params.sourceCode = await prettier.format(sourceCode, options);
        } catch (e) {
          if (checkedCode) {
            // 格式化失败且开启了格式化校验，在报错信息中提取失败原因
            isSucceed = false;
            const msgstr = e.message;
            // 查找括号的位置
            var openParenthesisIndex = msgstr.indexOf("(") + 1;
            var closeParenthesisIndex = msgstr.indexOf(")");
            // 截取括号内的内容
            var numbersAndText = msgstr.substring(openParenthesisIndex, closeParenthesisIndex);
            var textBeforeParenthesis = msgstr.substring(0, openParenthesisIndex - 1);
            // 使用冒号分割括号内的字符串，得到行和列的数字
            var colonIndex = numbersAndText.indexOf(":");
            var line = numbersAndText.substring(0, colonIndex);
            var column = numbersAndText.substring(colonIndex + 1);
            const msg = {
              msg: textBeforeParenthesis,
              line: line,
              column: column
            };
            messages.push(msg);
          }
        }
      }
    } catch (e) {
      console.error('格式化校验失败', e);
    }
    // 生成返回对象
    const prettierResult = {
      data: {
        output: params.sourceCode,
        messages: messages,
        isSucceed: isSucceed || !checkedCode // 格式化校验未开启，格式化视为成功
      }
    };
    res.json(prettierResult);
  } catch (error) {
    console.error(`格式化失败`, error);
  }
});

function main() {
  // 解析命令行的端口号
  const port = process.argv[2].split('=')[1];
  // 启动服务
  app.listen(port, () => {
    console.info(`prettier server listening at http://localhost:${port}`);
  });
}

main();
