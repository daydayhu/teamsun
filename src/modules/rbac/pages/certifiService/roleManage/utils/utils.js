export const tabPane = [{
    key:'auth',
    name:'权限',
    addName:'添加授权',
    deleteName:'解除授权',
    drawer:false,
    tableInfo:{
        currentTable:{
            tableHeader:[{
                label:'操作',
                key:'menu_name',
            },{
                label:'所属菜单',
                key:'previous_menu',
            },{
                label:'所属服务',
                key:'previous_server',
            }],
            tableData:[],
        },
    }
},{
    key:'authObject',
    name:'授权对象',
    addName:'添加授权对象',
    deleteName:'移除授权对象',
    drawer:false,
    tableInfo:{
        currentTable:{
            tableHeader:[{
                label:'授权对象',
                key:'name',
            },
                {
                    label:'授权对象类型',
                    key:'type',
                }],
            tableData:[],
        },
    }

}];

export const roleTable = {
    tableHeader:[{
        label:'角色名称',
        key:'role_name',
    },{
        label:'描述',
        key:'remarks',
    },{
        label:'角色类型',
        key:'role_type',
    }],
    tableData:[],
};

