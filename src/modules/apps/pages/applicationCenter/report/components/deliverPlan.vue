<template>
  <div>
      <div class="baseForm_content">
        <!-- ------------------------画布区域 --------------------->
        <div class="canvas-c" ref="canvas-c">
        </div>
      </div>

  </div>
</template>

<script>
    import '@/commons/js/HT/ht-common.js';
    import GraphView from '../utils/ht/ddb-graphView';
    import '../utils/ht/ddb-config';
    import "@/commons/js/HT/ht-edgetype.js"; // 连线类型js文件

    export default {
        // mixins:[websocket],
        data() {
            return {
                canvas_json: '',
                loading: false,
                paletteList: null,
                canvas: {
                    palette: null,
                    graphView: null,
                    toolbar: null,
                },
                is_app_canvas:0,// 1为应用画布、0为订单画布
                canvas_type:4,// 画布类型 1为应用架构图、2为部署视图我、3为数据流向图、4交付视图
            };
        },
        components: {
        },
        props: {
            canvasText:{}
        },
        computed:{
        },
        created() {

            this.createCanvas();
        },
        async mounted() {
            this.layoutCanvas();
            this.startCanvas();
            this.getCanva();
        },
        methods: {
            changCanvasScreenRate(position) {
                this.canvas.mainView.setPosition(position);
            },
            //--------------------------------画布相关--------------------------------------
            // 创建画布
            createCanvas() {
                // 1.创建拓扑组件
                let graphView = new GraphView(this);

                // 2.创建工具栏
                // let toolbar = new Toolbar(this);

                // 3.生成canvas
                this.canvas = { graphView };
            },
            // 布局画布
            layoutCanvas() {
                // 1 获取画布容器
                let containerDom = this.$refs['canvas-c'];
                // 3 创建视图
                let rightFooterView = this.$refs['service-show-c'];
                let rightView = new ht.widget.SplitView(this.canvas.graphView.$graphView, rightFooterView, 'v', -10);
                this.canvas.graphView.$graphView.getView().style.backgroundColor = '#fff';
                rightView.setDividerBackground('#E7EDF3');
                rightView.setDragOpacity('1');
                rightView.getView().className = 'canvas-style-c';
                // 6 注入容器
                containerDom.appendChild(rightView.getView());
                this.canvas.graphView.$graphView.setEditable(false);
                this.canvas.mainView = rightView;
                // 4 布局变化事件监听
                rightView.addViewListener(function (e) {
                    if (e.kind === 'layout') {
                        let splitP = mainView.getPosition();
                    }
                });
            },
            // 启动画布
            startCanvas() {
                for (let component of Object.values(this.canvas)) {
                    if (component.init) {
                        component.init();
                    }
                }
            },
            /**
             * 获取初始化画布
             */
            async getCanva(){
                this.canvas.graphView.deserialize(this.canvasText);
            },


            getJson(){
                // const json = {"v": "7.0.7-dev15", "p": {"autoAdjustIndex": true, "hierarchicalRendering": false}, "d": [{"c": "ht.Node", "i": 1001, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": -110, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Node", "i": 1002, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": 970, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Edge", "i": 1003, "p": {"source": {"__i": 1001}, "target": {"__i": 1000}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1004, "p": {"source": {"__i": 1001}, "target": {"__i": 999}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 1005, "p": {"source": {"__i": 1001}, "target": {"__i": 996}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1006, "p": {"source": {"__i": 1000}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1007, "p": {"source": {"__i": 997}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 1008, "p": {"source": {"__i": 996}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Node", "i": 1000, "p": {"name": "Network", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 100}}, "s": {"label": "Network \u2014 Apache\u5b89\u88c5", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "Network", "elementType": "node", "service_id": "None", "proType": 4, "image": null, "canva_uuid": null, "set_uuid": "e43aead7-bc48-4de0-bb11-d77735692080", "uuid": "cb92d0ee-5c53-4111-807c-e94a62bb0e1a"}}, {"c": "ht.Node", "i": 999, "p": {"name": "VMware", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 200}}, "s": {"label": "VMware \u2014 trre", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware", "elementType": "node", "service_id": "28", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "76543333334", "uuid": "88b37a25-3d7c-4992-a88f-38a0055b39e0"}}, {"c": "ht.Node", "i": 998, "p": {"name": "VMware", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 430, "y": 200}}, "s": {"label": "VMware \u2014 trre1", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware", "elementType": "node", "service_id": "28", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "765433333341", "uuid": "21c8aecb-544b-44bb-981b-a0ae3755ca50"}}, {"c": "ht.Node", "i": 997, "p": {"name": "VMware", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 700, "y": 200}}, "s": {"label": "VMware \u2014 trre1", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "VMware", "elementType": "node", "service_id": "28", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "765433333341", "uuid": "404756f1-9f92-49a7-9013-684550510809"}}, {"c": "ht.Edge", "i": 996, "p": {"source": {"__i": 999}, "target": {"__i": 998}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Edge", "i": 995, "p": {"source": {"__i": 998}, "target": {"__i": 997}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15}}, {"c": "ht.Node", "i": 996, "p": {"name": "\u88f8\u673a", "image": {"width": 230, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 230, 55], "borderWidth": 1, "borderColor": "#000000", "background": "#ffffff", "cornerRadius": 4}]}, "position": {"x": 160, "y": 300}}, "s": {"label": "\u88f8\u673a \u2014 VMware\u865a\u62df\u673a\u5b89\u88c5", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"defaultIcon": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["defaultIcon"]}}}, "a": {"name": "\u88f8\u673a", "elementType": "node", "service_id": "29", "proType": 1, "image": null, "canva_uuid": null, "set_uuid": "84c603e1-6ca9-4aa4-b4ab-ef18b1e9cdf6", "uuid": "439544f8-c8e0-451a-809a-20084a10445a"}}]};
                // const json = {"v": "7.0.7-dev15", "p": {"autoAdjustIndex": true, "hierarchicalRendering": false}, "d": [{"c": "ht.Node", "i": 1001, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": -140, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Node", "i": 1002, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": 760, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Edge", "i": 1003, "p": {"source": {"__i": 1001}, "target": {"__i": 1000}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1004, "p": {"source": {"__i": 1001}, "target": {"__i": 999}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15, "edge.type": "boundary"}}, {"c": "ht.Edge", "i": 1005, "p": {"source": {"__i": 1000}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1006, "p": {"source": {"__i": 998}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15, "edge.type": "boundary"}}, {"c": "ht.Node", "i": 1000, "p": {"name": "\u7f51\u7edc-\u81ea\u52a8", "image": {"width": 260, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 260, 55], "borderWidth": 1, "borderColor": "#000000", "background": "rgba(255,255,255,0.6)", "cornerRadius": 4}]}, "position": {"x": 160, "y": 100}}, "s": {"label": "\u7f51\u7edc-\u81ea\u52a8 \u2014 network", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u7f51\u7edc-\u81ea\u52a8-62": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u7f51\u7edc-\u81ea\u52a8-62"]}}}, "a": {"name": "\u7f51\u7edc-\u81ea\u52a8", "elementType": "node", "service_id": "62", "proType": 3, "image": "http://172.16.194.160:31318/download/imgs/alfaromeo(1)(2)(3).svg", "canva_uuid": null, "set_uuid": "9a2347bd-f895-4b21-9b2c-ba3d98f24602", "uuid": "457688f1-8435-409f-af60-b282214fa871"}}, {"c": "ht.Node", "i": 999, "p": {"name": "\u865a\u673a-\u81ea\u52a8-\u590d\u6838", "image": {"width": 260, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 260, 55], "borderWidth": 1, "borderColor": "#000000", "background": "rgba(255,255,255,0.6)", "cornerRadius": 4}]}, "position": {"x": 160, "y": 200}}, "s": {"label": "\u865a\u673a-\u81ea\u52a8-\u590d\u6838 \u2014 vm\u865a\u673a", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u865a\u673a-\u81ea\u52a8-\u590d\u6838-74": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u865a\u673a-\u81ea\u52a8-\u590d\u6838-74"]}}}, "a": {"name": "\u865a\u673a-\u81ea\u52a8-\u590d\u6838", "elementType": "node", "service_id": "74", "proType": 1, "image": "http://172.16.194.160:31318/download/imgs/audi(1)(2)(3)(4).svg", "canva_uuid": null, "set_uuid": "e4ae5e72-088a-4693-8a7c-b2e1a7758cbd", "uuid": "1f5fe655-74b9-4248-a90f-ffb73bfb16d4"}}, {"c": "ht.Node", "i": 998, "p": {"name": "\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838", "image": {"width": 260, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 260, 55], "borderWidth": 1, "borderColor": "#000000", "background": "rgba(255,255,255,0.6)", "cornerRadius": 4}]}, "position": {"x": 460, "y": 200}}, "s": {"label": "\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838 \u2014 Oracle-\u9996\u6b21", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838-75": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838-75"]}}}, "a": {"name": "\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838", "elementType": "node", "service_id": "75", "proType": 2, "image": "http://172.16.194.160:31318/download/imgs/bugatti(1)(2)(3)(4).svg", "canva_uuid": null, "set_uuid": "39f9a936-cb96-467b-9d8d-2a38ef32d2c2", "uuid": "7774b79d-eb83-4397-ae18-b120bd1fdfc9"}}, {"c": "ht.Edge", "i": 997, "p": {"source": {"__i": 999}, "target": {"__i": 998}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15, "edge.type": "boundary"}}]}
                const json = {"v": "7.0.7-dev15", "p": {"autoAdjustIndex": true, "hierarchicalRendering": false}, "d": [{"c": "ht.Node", "i": 1001, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": -140, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Node", "i": 1002, "p": {"image": {"width": 10, "height": 10, "comps": [{"type": "circle", "rect": [0, 0, 10, 10], "borderWidth": 0.5, "borderColor": "rgba(0,0,0,1)", "background": "#fff"}]}, "position": {"x": 760, "y": 200}, "width": 27, "height": 25.5}}, {"c": "ht.Edge", "i": 1003, "p": {"source": {"__i": 1001}, "target": {"__i": 1000}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "ortho"}}, {"c": "ht.Edge", "i": 1004, "p": {"source": {"__i": 1001}, "target": {"__i": 999}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15, "edge.type": "boundary"}}, {"c": "ht.Edge", "i": 1005, "p": {"source": {"__i": 1000}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.type": "h.v"}}, {"c": "ht.Edge", "i": 1006, "p": {"source": {"__i": 998}, "target": {"__i": 1002}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15, "edge.type": "boundary"}}, {"c": "ht.Node", "i": 1000, "p": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "image": {"width": 260, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 260, 55], "borderWidth": 1, "borderColor": "#000000", "background": "rgba(255,255,255,0.6)", "cornerRadius": 4}]}, "position": {"x": 160, "y": 100}}, "s": {"label": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8 \u2014 network", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8-44"]}}}, "a": {"name": "\u7f51\u7edc\u670d\u52a1-\u52ff\u52a8", "elementType": "node", "service_id": "44", "proType": 3, "image": "http://172.16.194.160:31318/download/imgs/bugatti(1)(2).svg", "canva_uuid": null, "set_uuid": "14ec0cc6-cf2e-41ea-ab30-b65a5f383e0e", "uuid": "47072261-541d-4fda-9217-7924718bcf54"}}, {"c": "ht.Node", "i": 999, "p": {"name": "\u865a\u673a-\u81ea\u52a8-\u590d\u6838", "image": {"width": 260, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 260, 55], "borderWidth": 1, "borderColor": "#000000", "background": "rgba(255,255,255,0.6)", "cornerRadius": 4}]}, "position": {"x": 160, "y": 200}}, "s": {"label": "\u865a\u673a-\u81ea\u52a8-\u590d\u6838 \u2014 vm\u865a\u673a", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u865a\u673a-\u81ea\u52a8-\u590d\u6838-74": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u865a\u673a-\u81ea\u52a8-\u590d\u6838-74"]}}}, "a": {"name": "\u865a\u673a-\u81ea\u52a8-\u590d\u6838", "elementType": "node", "service_id": "74", "proType": 1, "image": "http://172.16.194.160:31318/download/imgs/audi(1)(2)(3)(4).svg", "canva_uuid": null, "set_uuid": "8ea0ecad-c209-4a97-af4e-9fe6fabcbcab", "uuid": "eb70d323-aa54-4486-b84c-31983bf206ca"}}, {"c": "ht.Node", "i": 998, "p": {"name": "\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838", "image": {"width": 260, "height": 55, "comps": [{"type": "roundRect", "rect": [0, 0, 260, 55], "borderWidth": 1, "borderColor": "#000000", "background": "rgba(255,255,255,0.6)", "cornerRadius": 4}]}, "position": {"x": 460, "y": 200}}, "s": {"label": "\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838 \u2014 Oracle-\u9996\u6b21", "label.position": 10, "label.offset.x": 50, "label.offset.y": 20, "icons": {"\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838-75": {"position": 10, "direction": "east", "offsetX": 10, "offsetY": 15, "gap": 10, "width": 25, "height": 25, "names": ["\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838-75"]}}}, "a": {"name": "\u9644\u52a0\u4ea7\u54c1-\u81ea\u52a8-\u590d\u6838", "elementType": "node", "service_id": "75", "proType": 2, "image": "http://172.16.194.160:31318/download/imgs/bugatti(1)(2)(3)(4).svg", "canva_uuid": null, "set_uuid": "349b1baf-66f8-4c72-8055-e0d006432ca1", "uuid": "8afd8818-5341-4d00-9163-1c348fc70ba4"}}, {"c": "ht.Edge", "i": 997, "p": {"source": {"__i": 999}, "target": {"__i": 998}}, "s": {"edge.pattern": [2, 2], "edge.color": "rgba(0,0,0,1)", "edge.width": 1, "icons": {"fromArrow": {"width": 7, "height": 7, "position": 15, "keepOrien": true, "names": ["fromArrow"]}, "toArrow": {"width": 18, "height": 12, "position": 19, "keepOrien": true, "names": ["toArrow"]}}, "edge.offset": 4, "edge.source.position": 19, "edge.target.position": 15, "edge.type": "boundary"}}]}
                return json
            },

        }
    };
</script>

<style lang="less" scoped>

  .baseForm_content {
    height: 690px;
    padding-bottom: 60px;
  }
  .canvas-c {
    @flex();
    height: 100%;
    position: relative;
    /deep/ .canvas-style-c {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      + div {
        height: 100%;
      }
    }
  }



</style>
