// import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";

export let tableHeader = [
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
];
export let vgTable = [
  { key: "vg_name", label: "VG名称" },
  { key: "pv_number", label: "磁盘数量(个)" },
  { key: "vg_size", label: "总容量(GB)" }
];
export let logTable = [
  { key: "log_type", label: "日志类型" },
  { key: "log_version", label: "程序版本" },
  { key: "log_out_type", label: "日志输出方式" },
  { key: "log_loop_type", label: "日志轮询方式" },
  { key: "log_path", label: "日志路径" },
  { key: "log_user", label: "责任人" },
  { key: "log_formater", label: "日志格式说明" },
  { key: "log_alarm", label: "告警规则说明" }
];
export let lvTable = [
  { key: "lv_name", label: "LV名称" },
  { key: "vg_name", label: "所属VG" },
  { key: "lv_size", label: "容量(GB)" },
  { key: "stripe_size", label: "条带数" },
  { key: "file_system", label: "文件系统" },
  { key: "mount_point", label: "挂节点" },
  { key: "mount_user", label: "挂接属主:属组" },
  { key: "mount_auth", label: "挂接权限" },
  { key: "is_last", label: "最后分配组是否使用VG剩余容量" }
];

export const portTabHeader = [
  {
    key: "port",
    label: "端口",
    subHeader: [
      { key: "address", label: "MAC地址" },
      { key: "pxe_enabled", label: "PXE启用" },
      { key: "net_card_name", label: "网卡名" },
      { key: "physical_network", label: "物理网络" },
      { key: "port_group", label: "端口组" },
      { key: "network_type_name", label: "网络类型" }
    ]
  },
  {
    key: "portArr",
    label: "端口组",
    subHeader: [
      { key: "uuid", label: "UUID" },
      { key: "name", label: "名称" },
      { key: "mode", label: "模式" },
      { key: "network_type_name", label: "网络类型" }
    ]
  }
];
