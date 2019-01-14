const path = require('path')

// 拼接路径
function resolve(dir) {
  return path.join(__dirname, dir)
}

// 基础路径 注意发布之前要先修改这里
let baseUrl = '/mt/'
// 演示项目自动构建使用
if (process.env.VUE_APP_TRAVIS === 'TRUE') baseUrl = '/'

module.exports = {
  baseUrl: baseUrl, // 根据你的实际情况更改这里
  lintOnSave: true,
  devServer: {
    publicPath: baseUrl // 和 baseUrl 保持一致
    ,
    proxy: { // 在这里配置如下代码
      '/login': {
        target: 'http://127.0.0.1:8080/mt/loginCross', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  // 路径重写，
          '^/login': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可。
        }
      },
      '/users': {
        target: 'http://127.0.0.1:8080/mt/sysuser/list', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        ws:true,
        pathRewrite: {  // 路径重写，
          '^/users': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可。
        }
      },
      '/userAdd': {
        target: 'http://127.0.0.1:8080/mt/sysuser/add', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  // 路径重写，
          '^/userAdd': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可。
        }
      },
      '/userDelete': {
        target: 'http://127.0.0.1:8080/mt/sysuser/delete', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  // 路径重写，
          '^/userDelete': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可。
        }
      },
      '/userUpdate': {
        target: 'http://127.0.0.1:8080/mt/sysuser/update', // 你请求的第三方接口
        changeOrigin: true, // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        pathRewrite: {  // 路径重写，
          '^/userUpdate': ''  // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可。
        }
      },
      '/roles': {
        target: 'http://127.0.0.1:8080/mt/sysrole/list',
        changeOrigin: true,
        pathRewrite: {
          '^/roles': ''
        }
      },
      '/roleAdd': {
        target: 'http://127.0.0.1:8080/mt/sysrole/add',
        changeOrigin: true,
        pathRewrite: {
          '^/roleAdd': ''
        }
      },
      '/roleDelete': {
        target: 'http://127.0.0.1:8080/mt/sysrole/delete',
        changeOrigin: true,
        pathRewrite: {
          '^/roleDelete': ''
        }
      },
      '/sysmenu/list': {
        target: 'http://127.0.0.1:8080/mt/sysmenu/list',
        changeOrigin: true,
        pathRewrite: {
          '/sysmenus/list': ''
        }
      },
      '/sysmenu/getTree': {
        target: 'http://127.0.0.1:8080/mt/sysmenu/getTree',
        changeOrigin: true,
        pathRewrite: {
          '^/sysmenu/getTree': ''
        }
      },
      '/sysmenu/add': {
        target: 'http://127.0.0.1:8080/mt/sysmenu/add',
        changeOrigin: true,
        pathRewrite: {
          '/sysmenu/add': ''
        }
      },
      '/sysmenuDelete': {
        target: 'http://127.0.0.1:8080/mt/sysmenu/delete',
        changeOrigin: true,
        pathRewrite: {
          '^/sysmenuDelete': ''
        }
      },
      '/sysdept/getTree': {
        target: 'http://127.0.0.1:8080/mt/sysdept/getTree',
        changeOrigin: true,
        pathRewrite: {
          '/sysdept/getTree': ''
        }
      },
      '/sysdept/add': {
        target: 'http://127.0.0.1:8080/mt/sysdept/add',
        changeOrigin: true,
        pathRewrite: {
          '/sysdept/add': ''
        }
      },
      '/sysdeptDelete': {
        target: 'http://127.0.0.1:8080/mt/sysdept/delete',
        changeOrigin: true,
        pathRewrite: {
          '^/sysdeptDelete': ''
        }
      }



    }

  },
  // 默认设置: https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-service/lib/config/base.js
  chainWebpack: config => {
    // 解决 cli3 热更新失效 https://github.com/vuejs/vue-cli/issues/1559
    config.resolve
      .symlinks(true)
    // markdown
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('text-loader')
      .loader('text-loader')
      .end()
    // i18n
    config.module
      .rule('i18n')
      .resourceQuery(/blockType=i18n/)
      .use('i18n')
      .loader('@kazupon/vue-i18n-loader')
      .end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'd2-[name]'
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude
      .add(resolve('src/assets/svg-icons/icons'))
      .end()
    // 重新设置 alias
    config.resolve.alias
      .set('@', resolve('src'))
    // babel-polyfill 加入 entry
    const entry = config.entry('app')
    entry
      .add('babel-polyfill')
      .end()
  }
}
