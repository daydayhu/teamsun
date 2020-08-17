// const Mock = require("mockjs");
import Mock from 'mockjs'

// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
    timeout: '300-600'
})


let data = Mock.mock({
    "data|100": [ //生成100条数据 数组
        {
            "shopId|+1": 1,//生成商品id，自增1
            "shopMsg": "@ctitle(10)", //生成商品信息，长度为10个汉字
            "shopName": "@cname",//生成商品名 ， 都是中国人的名字
            "shopTel": /^1(5|3|7|8)[0-9]{9}$/,//生成随机电话号
            "shopAddress": "@county(true)", //随机生成地址
            "shopStar|1-5": "", //随机生成1-5个星星
            "salesVolume|30-1000": 30, //随机生成商品价格 在30-1000之间
            "shopLogo": "@Image(‘100x40‘,‘#c33‘, ‘#ffffff‘,‘小北鼻‘)", //生成随机图片，大小/背景色/字体颜色/文字信息
            "food|7": [ //每个商品中再随机生成七个food
                {
                    "foodName": "@cname", //food的名字
                    "foodPic": "@Image(‘100x40‘,‘#c33‘, ‘#ffffff‘,‘小可爱‘)",//生成随机图片，大小/背景色/字体颜色/文字信息
                    "foodPrice|1-100": 20,//生成1-100的随机数
                    "aname|14": [
                        { 
                            "aname": "@cname", 
                            "aprice|30-60": 20 
                        }
                    ]
                }
            ]
        }
    ]
})

let organizationTreeData = Mock.mock({
    "data|20": [ //生成100条数据 数组
        {
            "id|+1": 1,//生成商品id，自增1
            "label": "@cname",//生成商品名 ， 都是中国人的名字
            "description": "职能部门",//
            "nums|3-100": 20, //随机生成商品价格 在30-1000之间
            "operate": 'double',
            "children|3": [ //每个商品中再随机生成七个food
                {
                    "label": "@cname",//生成商品名 ， 都是中国人的名字
                    "description": "职能部门",//
                    "nums|3-100": 20, //随机生成商品价格 在30-1000之间
                    "operate": 'double',
                    "children|9": [
                        { 
                            "label": "@cname",//生成商品名 ， 都是中国人的名字
                            "description": "职能部门",//
                            "nums|3-100": 20, //随机生成商品价格 在30-1000之间
                            "operate": 'single',
                        }
                    ]
                }
            ]
        }
    ]
})

Mock.mock(/goods\/goodAll/, 'post', () => { //三个参数。第一个路径，第二个请求方式post/get，第三个回调，返回值
    return data
})

// 组织 树形表格 treatable
// organizationTreeList
Mock.mock(/\/certOrgan\/organizationTreeList/, 'post', () => { //三个参数。第一个路径，第二个请求方式post/get，第三个回调，返回值
    return organizationTreeData
})