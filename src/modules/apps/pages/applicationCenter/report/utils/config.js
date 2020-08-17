export const filterKey = [
    {key: 'app_base_env', name: '所属环境'},
    {key: 'bus_name', name: '业务组'},
    {key: 'app_base_type', name: '应用类型'},
    {key: 'app_base_level', name: '灾备等级'},
    {key: 'app_name', name: '应用系统'},
    {key: 'create_time', name: '创建时间'},
    {key: 'remarks', name: '备注'},
    {key: 'ticket_name', name: '标题'},
    {key: 'ticket_number', name: '编号'},

]
// export const paramKey = [
//     {
//     key: 'ironic', name: '软件-裸机', data: [
//         {
//             key: 'base_info',
//             name: '基本信息',
//             content: [
//                 {
//                     key: 'hostname',
//                     name: 'OS主机名（hostname)'
//                 },
//                 {key: 'name', name: '云主机名称'},
//                 {key: 'description', name: '备注'},
//                 {key: 'os_version', name: '操作系统'},
//             ]
//         },
//         {
//             key: 'volume_info',
//             name: '容量信息',
//             content: [
//                 {
//                     key: 'resource_pool_description',
//                     name: '资源池'
//                 },
//                 {
//                     key: 'memory_mb',
//                     name: '内存(GB)'
//                 },
//                 {key: 'local_gb', name: '存储(GB)'},
//                 {key: 'cpus', name: 'CPU数量'},
//
//
//             ]
//         },
//     ]
// },
//     {
//         key: 'vmware', name: '软件-VM', data: [
//             {
//                 key: 'base_info',
//                 name: '基本信息',
//                 content: [
//                     {
//                         key: 'hostname',
//                         name: 'OS主机名（hostname)'
//                     },
//                     {
//                         key: 'description',
//                         name: '备注'
//                     },
//                     {
//                         key: 'os_version',
//                         name: '操作系统'
//                     },
//                 ]
//             },
//             {
//                 key: 'volume_info',
//                 name: '容量信息',
//                 content: [
//                     {
//                         key: 'vcpu',
//                         name: 'OS主机名（hostname)'
//                     },
//                     {
//                         key: 'resource_pool_description',
//                         name: '备注'
//                     },
//                     {
//                         key: 'memory_gb',
//                         name: '内存(GB)'
//                     },
//                     {
//                         key: 'storage_gb',
//                         name: '存储(GB)'
//                     },
//
//                 ]
//             },
//             {
//                 key: 'vm_info',
//                 name: '虚拟机名称',
//                 content: [
//                     {key: 'name', name: '虚拟机名称'},
//                 ]
//             }
//         ]
//     },
//     {
//         key: 'strategy', name: '软件-网络策略', data: [
//             {
//                 key: 'base_info',
//                 name: '基本信息',
//                 content: [
//                     {
//                         key: 'hostname',
//                         name: '业务主机'
//                     },
//                     {
//                         key: 'source_ip',
//                         name: '源IP'
//                     },
//                     {
//                         key: 'source_port',
//                         name: '源IP端口'
//                     },
//                     {
//                         key: 'source_map',
//                         name: '源IP映射'
//                     },
//                     {
//                         key: 'target_ip',
//                         name: '目标IP'
//                     },
//                     {
//                         key: 'target_port',
//                         name: '目标端口'
//                     },
//                     {
//                         key: 'target_map',
//                         name: '目标端口映射'
//                     },
//                 ]
//             }
//         ]
//     },
//     // {key:'extraProduct',name:'mysql--install',} 是一个表格形式
// ];

export const paramKey = [ {
    key: 'vmware', name: 'vmware表单', data: [
        {
            key: 'base_info',
            name: '基本信息',
            content: [
                {
                    key: 'prefix_name',
                    name: '虚拟机前缀'
                },
                {
                    key: 'vmware_num',
                    name: '虚拟机台数'
                },
                {
                    key: 'description',
                    name: '用途说明'
                },
                {
                    key: 'os_version',
                    name: '操作系统及版本'
                },
                {
                    key: 'osVersionNumber',
                    name: '版本'
                },
                {
                    key: 'resource_pool_id',
                    name: '资源池'
                },
                {
                    key: 'vm_folder_name',
                    name: '虚拟目录'
                },
                {
                    key: 'vcpu',
                    name: 'vCPU数量'
                },
                {
                    key: 'memory_gb',
                    name: '内存'
                },
                {
                    key: 'image_id',
                    name: '镜像'
                },
                {
                    key: 'cpu_cores',
                    name: 'CPU插槽数'
                },
                {
                    key: 'table',
                    name: 'CPU插槽数',
                    content:[
                        {key:'inputOne',name:'系统磁盘空间'},
                        {key:'inputOne',name:'数据存储空间'},
                        {key:'inputOne',name:'备份存储空间'},
                        {key:'inputOne',name:'应用存储空间'}

                    ]
                },
            ]
        },
        {
            key: 'vm_info',
            name: '云服务器IP分配',
            content: [
                {
                    key: 'name',
                    name: '虚拟机名称'
                },
                {
                    key: 'hostname',
                    name: 'OS主机名(hostname)'
                },
                {
                    key: 'host_id',
                    name: 'ip'
                },
                {
                    key: 'storage_gb',
                    name: 'NAT 策略'
                },

            ],
            tableHeader:[]
        },
    ]
}]
// vmware表单
export const vmware =  [
    {
        key: 'base_info',
        name: '基本信息',
        content: [
            {
                key: 'prefix_name',
                name: '虚拟机前缀'
            },
            {
                key: 'vmware_num',
                name: '虚拟机台数'
            },
            {
                key: 'description',
                name: '用途说明'
            },
            {
                key: 'os_version',
                name: '操作系统及版本'
            },
            {
                key: 'osVersionNumber',
                name: '版本'
            },
            {
                key: 'resource_pool_id',
                name: '资源池'
            },
            {
                key: 'vm_folder_name',
                name: '虚拟目录'
            },
            {
                key: 'vcpu',
                name: 'vCPU数量'
            },
            {
                key: 'memory_gb',
                name: '内存'
            },
            {
                key: 'image_id',
                name: '镜像'
            },
            {
                key: 'cpu_cores',
                name: 'CPU插槽数'
            },
            {
                key: 'table',
                name: 'CPU插槽数',
                content:[
                    {key:'inputOne',name:'系统磁盘空间'},
                    {key:'inputOne',name:'数据存储空间'},
                    {key:'inputOne',name:'备份存储空间'},
                    {key:'inputOne',name:'应用存储空间'}

                ]
            },
        ]
    },
    {
        key: 'vm_info',
        name: '虚拟机配置',
        content: [
            {
                key: 'name',
                name: '虚拟机名称'
            },
            {
                key: 'hostname',
                name: 'OS主机名（hostname)'
            },

            {
                key: 'memory_gb',
                name: '宿主机'
            },
            {
                key: 'storage_gb',
                name: 'IP'
            },
            {
                key: 'storage_gb',
                name: 'NAT策略'
            },

        ],
        tableHeader:[{
            label:"云硬盘名称",
            key:"disk_name"
        },{
            label:"存储池",
            key:"data_store_name"
        },{
            label:"SCSI号",
            key:"scsi_name"
        },{
            label:"磁盘格式",
            key:"disk_type_name"
        },{
            label:"大小",
            key:"capacity_gb"
        },{
            label:"备注",
            key:'description'
        }]
    },
]
export const theVgLv =  {
    lv_list:{
        name: '基本信息',
        tableHeader:[
            { key: "lv_name", label: "LV名称" },
            { key: "vg_name", label: "所属VG" },
            { key: "lv_size", label: "容量(GB)" },
            { key: "stripe_size", label: "条带数" },
            { key: "file_system", label: "文件系统" },
            { key: "mount_point", label: "挂节点" },
            { key: "mount_user", label: "挂接属主/属组" },
            { key: "mount_auth", label: "挂接权限" },
            { key: "is_last", label: "最后分配组是否使用VG剩余容量" }
        ]

    },
    vg_list:{
        name: '虚拟机配置',
        tableHeader:[
            { key: "vg_name", label: "VG名称" },
            { key: "pv_number", label: "磁盘数量(个)" },
            { key: "vg_size", label: "总容量(GB)" }
        ]
    },
};

export const userGroup =  [
    {
        key: 'group_list',
        name: '用户组配置',
        tableHeader:[
            { key: "group_name", label: "组名" },
            { key: "group_id", label: "组ID" },
            { key: "remarks", label: "组说明" },
        ]

    },
    {
        key: 'user_list',
        name: '用户配置',
        tableHeader:[
            { key: "conf_name", label: "用户名" },
            { key: "conf_id", label: "用户ID" },
            { key: "umask", label: "主组" },
            { key: "conf_set", label: "组集" },
            { key: "conf_dir", label: "主目录" },
            { key: "description", label: "用户说明" },
        ]
    },
];
export const network =  [
    {
        key: 'area_name',
        name: '网络区域'
    },
    {
        key: 'area_type_name',
        name: '网络类型',
    },
    {
        key: 'cidr_list',
        name: '网段',
    },
];
// 网络策略
export const networkPolicy = [
    {
        key: 'source_ip',
        label: '源IP'
    },
    {
        key: 'source_server',
        label: '源服务器名称',
    },
    {
        key: 'source_map',
        label: '源IP映射',
    },
    {
        key: 'target_ip',
        label: '目标IP',
    },
    {
        key: 'target_server',
        label: '目标服务器名称',
    },
    {
        key: 'target_map',
        label: '目标IP映射',
    },
    {
        key: 'target_port',
        label: '目标端口',
    },
    {
        key: 'service_type.value',
        label: '服务类型',
    },
    {
        key:"connect_span",
        label:"连接时长"
    },
    {
        key: 'start_time',
        label: '策略开通开始时间',
    },
    {
        key: 'end_time',
        label: '策略开通结束时间',
    },
    {
        key: 'remarks',
        label: '备注',
    }];

export const fourA = [
    {
        key: 'name',
        label: '主机名称',
    },
    {
        key: 'login_auth.value',
        label: '权限使用人员及描述',
    },
    {
        key: 'host_name',
        label: '主机用户名',
    },
    {
        key: 'login_type',
        label: '远程登录方式',
    },
    {
        key: 'login_auth_user',
        label: '权限人员',
    },

]

export const backUp = [
    {
        key: 'target_hostname',
        label: '主机名称',
    },
    {
        key: 'backup_type.value',
        label: '备份类型',
    },
    {
        key: 'backup_policy.value',
        label: '备份策略',
    },
    {
        key: 'backup_time',
        label: '执行时间',
    },
    {
        key: 'backup_dir',
        label: '源日志清理策略(周)',
    },
    {
        key: 'backup_days',
        label: '保存期限',
    },
    {
        key: 'heal_policy',
        label: '本地备份文件治理策略(月)',
    },
    {
        key: 'log_policy',
        label: '归档日志清理',
    },
    {
        key: 'hot_backup_days',
        label: '带库存保存期限(天)',
    }
];

export const theLog = [
    { key: "name", label: "主机名称" },
    { key: "pro_ip", label: "生产IP" },
    { key: "outband_ip", label: "带外IP" },
    { key: "log_system", label: "所属系统" },
    { key: "log_type", label: "日志类型" },
    { key: "log_version", label: "程序版本" },
    { key: "log_out_type", label: "日志输出方式" },
    { key: "log_loop_type", label: "日志轮询方式" },
    { key: "log_path", label: "日志路径" },
    { key: "log_user", label: "责任人" },
    { key: "log_formater", label: "日志格式说明" },
    { key: "log_alarm", label: "告警规则说明" }
]

export const theMonitoring = [
    { key: "download_url", label: "下载地址" },
    { key: "create_time", label: "创建时间" },

]

export const displayType = [
    {
        key: 'ironic',
        type: 'base'
    }, {
        key: 'vmware',
        type: 'base'
    },
    {
        key: 'strategy',
        type: 'base'
    },
    {
        key: 'extraProduct',
        type: 'table'
    }, {
        key: 'deliver_view',
        type: 'item'
    }];

export const  tableHeader = [
    {
        label: '服务名称',
        key: 'node_name',
    },
    {
        label: '操作名称',
        key: 'node_set_name',
    },
    {
        label: '目标服务',
        key: 'target_service',
    },
    {
        label: '目标资源',
        key: 'target_service',
    },
    {
        label: '交付策略',
        key: 'deliver_type.value',
    },
    {
        label: '启动策略',
        key: 'start_up_type.value'},
    {
        label: '时间窗口',
        key: 'crontab',
    },
    {
        label: '交付负责人',
        key: 'deliverUser',
    },
    {
        label: '复核人',
        key: 'reviewUser',
    },
    {
        label: '复核策略',
        key: 'review_type.value',
    },
    ];
