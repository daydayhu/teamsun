export const cloudData = {
    tableHeader: [{
        label: '名称',
        key: 'alias_name',
    }, {
        label: '版本',
        key: 'cloud_version',
    }, {
        label: '资源环境',
        key: 'cloud_env',
    }, {
        label: '域名/IP',
        key: 'cloud_ip',
    }, {
        label: '端口',
        key: 'cloud_port',
    }, {
        label: '用户名',
        key: 'user_name',
    }, {
        label: '连接状态',
        key: 'is_connect',
    }, {
        label: '同步状态',
        key: 'sync_status',
    }, {
        label: '上次同步时间',
        key: 'sync_time',
    }, {
        label: '创建时间',
        key: 'create_time',
    }, {
        label: '描述',
        key: 'remarks',
    }],
    tableData: [{
        id: 1,
        name: 'vCenters1',
        type: '20版本',
        resource: 'mac',
        ip: '127.0.0.1',
        por: '8080',
        user_name: 'zhuxiujuan',
        connect_status: '已连接',
        status: '同步中',
        time: '2020-3-18',
        create_time: '2020-3-18',
        remark: 'dddd'
    }, {
        id: 2,
        name: 'vCenters1',
        type: '20版本',
        resource: 'mac',
        ip: '127.0.0.1',
        por: '8080',
        user_name: 'zhuxiujuan',
        connect_status: '已连接',
        status: '同步中',
        time: '2020-3-18',
        create_time: '2020-3-18',
        remark: 'dddd'
    }],
};
export const cloud_type = {
    options: [{
        value: 6.0,
        label: '6.0'
    }, {
        value: 6.5,
        label: '6.5',
    }, {
        value: 6.7,
        label: '6.7',
    },
    {
        value: 7.0,
        label: '7.0',
    }, {
        value: 7.5,
        label: '7.5'
    }],
    value: []
};
export const driver_type = {
    options: [{
        value: 1,
        label: 'AWX'
    }, {
        value: 2,
        label: 'Saltstack',
    }, {
        value: 3,
        label: 'Puppet',
    }],
    value: []
};
