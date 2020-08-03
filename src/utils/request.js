import axios from 'axios'
import store from '@/store'
import storage from 'store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'
import { ACCESS_TOKEN } from '@/store/mutation-types'

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL: process.env.VUE_APP_API_BASE_URL,
  timeout: 6000 // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error) => {
  if (error.response) {
    const data = error.response.data
    // 从 localstorage 获取 token
    const token = storage.get(ACCESS_TOKEN)
    if (error.response.status === 403) {
      notification.error({
        message: 'Forbidden',
        description: data.message
      })
    }
    if (error.response.status === 401 && !(data.result && data.result.isLogin)) {
      notification.error({
        message: 'Unauthorized',
        description: 'Authorization verification failed'
      })
      if (token) {
        store.dispatch('Logout').then(() => {
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        })
      }
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  const token = storage.get(ACCESS_TOKEN)
  // 如果 token 存在
  // 让每个请求携带自定义 token 请根据实际情况自行修改
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  return config
}, error => {
  return Promise.reject(error)
})

// response interceptor
request.interceptors.response.use((response) => {
  const ret = response.data
  const code = ret.code
  if(code === 401) {
    store.dispatch('user/resetToken')
    if (location.href.indexOf('login') !== -1) {
      // window.location.reload()// 为了重新实例化vue-router对象 避免bug
    } else {
      this.$confirm({
        title: '系统提示',
        content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
        okText: '重新登录',
        cancelText: '取消',
        onOk() {
          window.location.reload()
        }
      });
    }
  } else if (code === 6401) {
    store.dispatch('user/resetToken')
    this.$confirm({
      title: '系统提示',
      content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
      okText: '重新登录',
      cancelText: '取消',
      onOk() {
        window.location.reload()
      }
    });
    return false
  }
    // else if (code === 400 || code === 403) {
    //   notification.error({
    //     message: ret.msg
    //   })
  // }
  else if (code !== 200) {
    notification.error({
      message: ret.msg
    })
    return Promise.reject('error')
  } else {
    return ret
  }
}, error => {
  if (error.message === 'Network Error') {
    notification.error({
      message: '服务器连接异常，请检查服务器！',
    })
    return false
  }
  notification.error({
    message: error.message
  })
  return Promise.reject(error)
})

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, request)
  }
}

export default request

export {
  installer as VueAxios,
  request as axios
}
