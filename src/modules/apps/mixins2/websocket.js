
export default {
    created() {
        // 初始化
        this.initSocket()
    },
    methods: {
        initSocket() {
            let that = this;
            if ("WebSocket" in window) {
                console.log("您的浏览器支持 WebSocket!");
                console.log(that.global)
                that.global.ws = new WebSocket(`ws://172.16.193.32:8003/api/openstack/ws/message`);
                that.global.setWs(that.global.ws);
                that.global.ws.onopen = () => {
                    console.log("socket连接成功");
                }
                that.global.ws.onerror = () => {
                    console.log("连接错误...");
                    setTimeout(() => {
                        that.initSocket();
                    }, 2000);
                }
                that.global.ws.onclose = () => {
                    // 关闭 websocket
                    console.log("连接已关闭...");
                    setTimeout(() => {
                        that.initSocket();
                    }, 2000);
                };
            } else {
                // 浏览器不支持 WebSocket
                console.log("您的浏览器不支持 WebSocket!");
            }
        },
    },
    destroyed() {
        let that = this;
        // 销毁监听
        that.global.ws.onclose = () => {
            console.log("已关闭")
        }
    }
}