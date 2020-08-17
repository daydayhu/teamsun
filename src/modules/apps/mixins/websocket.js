import Vue from 'vue'
export default {
    created() {
        // 初始化
        this.initSocket()
    },
    data() {
        return {
            initTimes:0,
            initFunc:null
        }
    },
    methods: {
        initSocket() {
            let that = this;
            if ("WebSocket" in window) {
                let basetConfig = Vue.prototype.baseConfig
                console.log('ws_ip', basetConfig.WS_IP)
                let ws_path = basetConfig.WS_IP
                if(ws_path[ws_path.length - 1] == ":") {
                    ws_path = ws_path.substr(0,ws_path.length-1)
                }
                // that.global.ws = new WebSocket(`ws://172.16.193.20:8010/api/app/ws/message`);
                that.global.ws = new WebSocket(`${ws_path}:31319/api/app/ws/message`);
                that.global.setWs(that.global.ws);
                that.global.ws.onopen = () => {
                    console.log("socket连接成功");
                }
                that.global.ws.onerror = () => {
                    console.log("连接错误...");
                    if(that.initTimes>10) {
                        clearTimeout(that.initFunc)
                        return
                    }
                    that.initFunc = setTimeout(function(){
                        that.initSocket()
                        that.initTimes++
                    },2000)
                }
                that.global.ws.onclose = () => {
                    // 关闭 websocket
                    console.log("连接已关闭...");
                };
            } else {
                // 浏览器不支持 WebSocket
                console.log("您的浏览器不支持 WebSocket!");
            }
        },
    },
    destroyed() {
        let that = this;
        that.global.ws.close()
    }
}
