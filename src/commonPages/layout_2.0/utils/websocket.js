
export default {
  data() {
      return {
          path: ":31319/api/app/ws/message",
          ws_path:"",
          socket: "",
          initTime:0,
          initFunc:0,
      }
  },
  mounted() {
      // 初始化
      // this.init()
  },
  methods: {
      init: function () {
          if (typeof (WebSocket) === "undefined") {
              alert("您的浏览器不支持socket")
          } else {
              let ws_path = this.ws_path
              if(ws_path[ws_path.length - 1] == ":") {
                  ws_path = ws_path.substr(0,ws_path.length-1)
              }
              // 实例化socket
              this.socket = new WebSocket(ws_path+this.path)
              // 监听socket连接
              this.socket.onopen = this.open
              // 监听socket错误信息
              this.socket.onerror = this.error
              // 监听socket消息
              this.socket.onmessage = this.getMessage
              // 监听socket关闭
              this.socket.onclose = this.close
          }
      },
      open: function () {
          console.log("socket连接成功")
      },
      error: function () {
          console.log("连接错误")
          if(this.initTime>10) {
              clearTimeout(this.initFunc)
              return
          }
          let that = this
          this.initFunc = setTimeout(function(){
              that.init()
              that.initTime++
          },2000)
      },
      send: function () {
          this.socket.send(params)
      },
      close: function () {
          console.log("socket已经关闭")
      }
  },
  destroyed() {
      // 销毁监听
      this.socket.close()

  }
}
