import axios from 'axios'
import cookie from 'vue-cookie'
import {
  Message
} from 'element-ui'
import Bus from '@/commons/js/bus.js'
class Axios {
  constructor() {
    this.init()
  }
  init() {
    let that = this
    axios.defaults.withCredentials = true
    // 添加请求拦截器
    axios.interceptors.request.use(function (config) {
      // 在发送请求之前做些什么
      return config
    }, function (error) {
      // 对请求错误做些什么
      return Promise.reject(error)
    })
    // 添加响应拦截器
    axios.interceptors.response.use(function (response) {
      // that._login(response)
      // 对响应数据做点什么
      return response
    }, function (error) {
      // 对响应错误做点什么
      that._error(error)
      return Promise.reject(error)
    })
    axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    axios.defaults.crossDomain = true
    axios.defaults.timeout = 60000
  }
  _login(res) {
    if (res.data.hasOwnProperty('is_login')) {
      if (!res.data.is_login) {
        Bus.$emit('goBack', {})
        return false
      }
    }
  }
  /**
   * 设置content-type
   * @param type
   */
  updateContentType(type) {
    if (type) {
      axios.defaults.headers['Content-Type'] = type
    } else {
      axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
  /**
   * 全局错误处理
   * @param data 传入错误的数据
   * @private
   */
  _error(e) {
    let that = this
    if (e.response) {
      // 请求已发出，但服务器使用状态代码进行响应
      let status = e.response.status
      switch (status) {
        case 401: {
          Message.error(e.response.statusText)
          break
        }
        case 403: {
          //that._jump()
          break
        }
        case 504: {
          Message.error(e.response.statusText)
          break
        }
        case 9100:
          Bus.$emit('goBack', {})
          break
      }
    } else {
      console.log('Error', e.message)
    }
  }
  httpFetch(method, url, data, contentType) {
    let that = this
    //axios.defaults.headers.common['X-CSRFToken'] = cookie.get('csrftoken')
    this.updateContentType(contentType)
    // if (url && process.env.NODE_ENV === 'production') {
    //     url = url.replace('\/v1',process.env.API_ROOT)
    // }
    this.promise = new Promise((resolve, reject) => {
      switch (method) {
          case 'get': {
          axios.get(url, {
              params: data
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e)
            })
          break
        }
          case 'getBlob' :{
              axios.get(url, {
                  params: data
              },{responseType:'blob'})
                  .then((res) => {
                      resolve(res)
                  })
                  .catch((e) => {
                      reject(e)
                  })
              break
          }
          case 'getBuffer' :{
            axios.get(url, {
                params: data,
                responseType:'arraybuffer'
            },)
                .then((res) => {
                    resolve(res)
                })
                .catch((e) => {
                    reject(e)
                })
            break
        }
        case 'delete': {
          axios.delete(url, {
              data: data
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e)
            })
          break
        }
        case 'head': {
          axios.head(url, {
              params: data
            })
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e)
            })
          break
        }
        case 'post': {
          axios.post(url, data)
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e)
            })
          break
        }
        case 'put': {
          axios.put(url, data)
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e)
            })
          break
        }
        case 'patch': {
          axios.patch(url, data)
            .then((res) => {
              resolve(res.data)
            })
            .catch((e) => {
              reject(e)
            })
          break
        }
      }
    })
    return this.promise
  }
}

export default new Axios()
