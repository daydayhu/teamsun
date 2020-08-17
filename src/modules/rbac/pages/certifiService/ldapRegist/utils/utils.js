export const cloudData = {
    tableHeader:[{
        label:'LDAP控制器',
        key:'source_name',
    },{
        label:'描述',
        key:'source_name',
    },{
        label:'访问地址',
        key:'source_ip',
    },{
        label:'登录DN',
        key:'cloud_port',
    },{
        label:'所属组织',
        key:'org_name',
    }]};
export const form_rules =   {
    source_name: [
        {
            required: true,
            message: '名称不能为空！',
            trigger: 'blur'
        }
    ],
    source_ip: [
        {
            required: true,
            message: 'ip地址不能为空',
            trigger: 'blur'
        }
    ],
    source_port: [
        {
            required: true,
            message: '端口是必填项',
            trigger: 'blur'
        }
    ],
    is_ssl: [
        {
            required: true,
            message: 'ssl为必填项',
            trigger: 'blur'
        }
    ],
    user_name: [
        {
            required: true,
            message: '登录DN为必填项',
            trigger: 'blur'
        }
    ],
    password: [
        {
            required: true,
            message: '密码为必填项',
            trigger: 'blur'
        }
    ],
    search_dn: [
        {
            required: true,
            message: '搜索DN为必填项！',
            trigger: 'blur'
        }
    ],
    user_filter: [
        {
            required: true,
            message: '用户过滤器为必填项！',
            trigger: 'blur'
        }
    ],
    user_property:[
        {
            required: true,
            message: '用户属性映射！',
            trigger: 'blur'
        }
    ],
    org_id: [
        {
            required: true,
            message: '所属组织为必填项！',
            trigger: 'blur'
        }
    ],

};

export const userTableData = {
    tableHeader:[{
        label:'用户名',
        key:'user_name',
    },{
        label:'名称',
        key:'alias_name',
    },{
        label:'电子邮件',
        key:'mail'
    },{
        label:'手机号',
        key:'phone'
    },{
        label:'固定电话',
        value:'fixed_phone'
    },{
        label:'地址',
        key:'address'
    }],
    tableData:[]
}

export const tooltipContent = {
    user_filter:'(objectClass=person)',
    user_property:'{"user_name": "cn", "alias_name": "sn"}',
}

