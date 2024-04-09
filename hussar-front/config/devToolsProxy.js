module.exports = {
    proxies: {
        '/hussarvfg/api': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '/hussarvfg/api': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : ''
            }
        },
        '/hussarvfg/license': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '/hussarvfg': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/hussarWeb'
            }
        },
        '/hussartheme/api': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH, // 这里对应请求的后台服务，按项目情况修改
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '/hussartheme/api': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/hussarWeb'  // 微服务相关转发
            }
        },
        '/hussarApi/hussarUnifiedLog': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi/hussarUnifiedLog': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/unifiedLog'
            }
        },
        '/hussarApi/hussarSchedule': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi/hussarSchedule': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/schedule'
            }
        },
        '/hussarApi/hussarAuth': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi/hussarAuth': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/auth'
            }
        },
        '/hussarApi/bpm': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/workflow'
            }
        },
        '/hussarApi/unified': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/unified'
            }
        },
        '/hussarApi/attachment': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/hussarFile'
            }
        },
        '/hussarApi/msg': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/message'
            }
        },
        '/hussarApi': {
            target: process.env.VUE_APP_HUSSAR_BACK_PATH,
            ws: true,
            changeOrigin: true,
            pathRewrite: {
                '^/hussarApi': process.env.VUE_APP_LOGINMETHOD === 'default' ? '' : '/hussarWeb'
            }
        }
    }
}
