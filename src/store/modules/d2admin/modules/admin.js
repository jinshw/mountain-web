import util from '@/libs/util.js'
import Qs from 'qs'

export default {
  namespaced: true,
  actions: {
    login ({ dispatch }, {
      vm,
      username,
      password,
      route = {
        name: 'index'
      }
    }) {
      var da1 =  Qs.stringify({
        username:username,password:password
      });
        // 开始请求登录接口
      vm.$axios({
        method: 'post',
        url: '/login',
        data: da1
      })
        .then(async res => {
          // 设置 cookie 一定要存 uuid 和 token 两个 cookie
          // 整个系统依赖这两个数据进行校验和存储
          // uuid 是用户身份唯一标识 用户注册的时候确定 并且不可改变 不可重复
          // token 代表用户当前登录状态 建议在网络请求中携带 token
          // 如有必要 token 需要定时更新，默认保存一天
          util.cookies.set('uuid',  res.data.data.uuid)
          util.cookies.set('token', res.data.data.token)
          util.cookies.set('sessionId', res.data.data.sessionId)
          console.log(res.data)
          // 设置 vuex 用户信息
          await dispatch('d2admin/user/set', {
            name: res.name
          }, { root: true })
          // 用户登录后从持久化数据加载一系列的设置
          await dispatch('load')
          // 更新路由 尝试去获取 cookie 里保存的需要重定向的页面完整地址
          const path = util.cookies.get('redirect')
          // 根据是否存有重定向页面判断如何重定向
          vm.$router.replace(path ? { path } : route)
          // 删除 cookie 中保存的重定向页面
          util.cookies.remove('redirect')
        })
        .catch(err => {
          console.group('登陆结果')
          console.log('err: ', err)
          console.groupEnd()
        })


    },
  }
}
