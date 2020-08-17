
export default {
    data() {
        return {
            path: "ws://172.16.193.58:8003/api/openstack/ws/message",
            socket: ""
        }
    },
    mounted() {
        // 初始化
        this.init()
    },
    methods: {
        init: function () {
            if (typeof (WebSocket) === "undefined") {
                alert("您的浏览器不支持socket")
            } else {
                // 实例化socket
                this.socket = new WebSocket(this.path)
                // 监听socket连接
                this.socket.onopen = this.open
                // 监听socket错误信息
                this.socket.onerror = this.error
                // 监听socket消息
                this.socket.onmessage = this.getMessage
            }
        },
        open: function () {
            console.log("socket连接成功")
        },
        error: function () {
            console.log("连接错误")
            this.init();
        },
        getMessage: function (msg) {
            console.log(JSON.parse(msg.data))

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
        this.socket.onclose = this.close
    }
}