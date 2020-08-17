<template>
    <div class="layout-c">
        <el-dialog
                :visible.sync="dialogVisible"
                :title=title
                @closed="close">
            <div class="table-c">
                <el-table :data="recordList"
                          style="width: 100%"
                >
                    <el-table-column label="处理人" prop="user">
                        <template slot-scope="scope">
                            <span>{{ scope.row.user }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="处理时间" prop="processTime">
                        <template slot-scope="scope">
                            <span>{{ scope.row.processTime }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="处理事件" prop="processEvent">
                        <template slot-scope="scope">
                            <span>{{ scope.row.processEvent }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="处理后状态" prop="processStatus">
                        <template slot-scope="scope">
                            <!--<z-badge :class="statusMapColor[scope.row.pro_status.type]"></z-badge>-->
                            <span style="margin-left: 8px">{{ scope.row.processStatus }}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'processRecord',
    data() {
      return {
        title: '处理记录',
        dialogVisible: true,
        recordList: [
          {
            id: 1,
            user: '系统数据-测试数据', // 处理人
            processTime: '2020-08-04 14:00:00', // 处理时间
            processEvent: '自动创建', // 处理事件
            processStatus: '未处理', // 处理后状态
          },
          {
            id: 2,
            user: '系统数据-测试数据', // 处理人
            processTime: '2020-08-04 14:00:00', // 处理时间
            processEvent: '接单', // 处理事件
            processStatus: '未处理', // 处理后状态
          },
          {
            id: 3,
            user: '系统数据-测试数据', // 处理人
            processTime: '2020-08-04 14:00:00', // 处理时间
            processEvent: '转单', // 处理事件
            processStatus: '未处理', // 处理后状态
          },
          {
            id: 4,
            user: '系统数据-测试数据', // 处理人
            processTime: '2020-08-04 14:00:00', // 处理时间
            processEvent: '默认接单', // 处理事件
            processStatus: '已确认', // 处理后状态
          }
        ]
      }
    },
    methods: {
      close() {
        this.$emit('closeProcessRecordDialog')
      }
    }
  };
</script>

<style lang="less" scoped>
    .layout-c {

    }
</style>
