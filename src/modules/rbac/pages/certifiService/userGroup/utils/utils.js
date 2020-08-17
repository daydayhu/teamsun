export const tabPane = [{
    key:'role',
    name:'角色',
    addName:'添加角色',
    deleteName:'移除角色',
    tableInfo:{
        currentTable:{
            tableHeader:[{
                label:'角色名称',
                key:'role_name',
            },{
                label:'角色类型',
                key:'role_type',
            },{
                label:'描述',
                key:'remarks',
            }],
            tableData:[],
        },
        drawerTable:{
            drawer: false,
            tableHeader:[{
                label:'角色名称',
                key:'role_name',
            },{
                label:'角色类型',
                key:'role_type',
            },{
                label:'描述',
                key:'remarks',
            }],
            tableData:[],
        }
    }
},{
    key:'user',
    name:'用户',
    addName:'添加用户',
    deleteName:'移除用户',
    tableInfo:{
        currentTable:{
            tableHeader:[{
                label:'用户名称',
                key:'alias_name',
            },{
                label:'创建时间',
                key:'create_time',
            },{
                label:'描述',
                key:'remarks',
            }],
            tableData:[],
        },
        drawerTable:{
            drawer: false,
            tableHeader:[{
                label:'用户名称',
                key:'alias_name',
            },{
                label:'创建时间',
                key:'create_time',
            },{
                label:'描述',
                key:'remarks',
            }],
            tableData:[],
        }
    }
}];

export const groupTable = {
    tableHeader:[{
        label:'用户组名',
        key:'group_alias',
    },{
        label:'描述',
        key:'remarks',
    },{
        label:'创建时间',
        key:'create_time',
    }],
    tableData:[],
};
