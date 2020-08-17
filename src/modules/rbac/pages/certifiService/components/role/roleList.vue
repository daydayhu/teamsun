<template>
	<div class="app-overview">
		<div class="ts-content-wrap" style='padding: 10px 0;margin-top: 0'>
			<slot name="search"></slot>
			<div class="table-container" style="margin-top: 0;padding: 0">
				<el-table
						ref="multipleTable"
						:data="tableInfo.tableData"
						tooltip-effect="dark"
						style="width: 100%"
						v-loading="loading"
            empty-text=" "
						@selection-change="handleSelectionChange">
          <template slot="empty">
            <empty-in-table v-if="tableInfo.tableData.length<1&&!loading"></empty-in-table>
          </template>
					<el-table-column
							type="selection"
							v-if="isMultiple"
              :selectable="selectable"
              width="55">
					</el-table-column>
					<el-table-column
							v-for="(item,index) in tableInfo.tableHeader" :key="index"
							:prop="item.key"
							:label="item.label"
							:width="item.width">
						<!--<template slot-scope="scope">-->
						<!--<el-button  @click="clickRoleName(scope.row)" type="text" size="small">{{ scope.row[item.key] }}</el-button>-->
						<!--</template>-->
						<template slot-scope="scope">
							<!--<el-button v-if="item.key === 'name' || item.key === 'menu_name'" @click="clickRoleName(scope.row)" type="text" size="small">{{ scope.row[item.key] }}</el-button>-->
							<el-button v-if="item.key === 'role_name'" @click="clickRoleName(scope.row)" type="text" size="small">{{ scope.row[item.key] }}</el-button>
							<el-button v-if="item.key === 'user_name'" @click="showUserDetails(scope.row)" type="text" size="small">{{ scope.row[item.key] }}</el-button>
              <span v-if="item.key === 'remarks'">{{ scope.row[item.key] ? scope.row[item.key] : '-'}}</span>
							<span v-if="item.key === 'previous_server'" @click="clickUserGroupsName(scope.row)" type="text" size="small">{{ scope.row[item.key].name }}</span>
							<span v-else>{{ item.key === 'role_type' || item.key === 'user_name'|| item.key==='role_name' ?scope.row[item.key].name : scope.row[item.key]  }}</span>
						</template>
					</el-table-column>
					<slot name="operate"></slot>
				</el-table>
				<slot name="button"></slot>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			tableInfo: {},
			currentTable: {
				type: Array,
				default() {
					return []
				}

			},
			tagKey: {},
			isMultiple: {
				type: Boolean,
				default: true
			},
			loading: {
				type: Boolean
			},
			drawerChecked: {
				type: Array
			}
		},
		data() {
			return {
				multipleSelection: [2],
				maxHeight: '400px'
			}
		},
		// watch: {
		// 	'tableInfo.tableData': {
		// 		handler(newVal) {
		// 			if (newVal.length) {
		// 				this.$nextTick(() => {
		// 					this.getTableRow()
		// 				})
		// 			}
		// 		},
		// 		deep: true
		// 	}
		// },
		mounted: function () {
		  this.getTableRow()
			this.$nextTick(() => {
				if (this.tagKey == 'user') {
					let flowHeight = document.body.clientHeight - 170 - 60
					this.maxHeight = flowHeight + 'px'
				}else if(this.tagKey == 'role') {
					let flowHeight = document.body.clientHeight - 170
					this.maxHeight = flowHeight + 'px'
				}
			})
			window.onresize = () => {
				return (() => {
					if (this.tagKey == 'user') {
						let flowHeight = document.body.clientHeight - 170 - 50
						this.maxHeight = flowHeight + 'px'
					}else if(this.tagKey == 'role') {
						let flowHeight = document.body.clientHeight - 170
						this.maxHeight = flowHeight + 'px'
					}
				})()
			}
		},
		destroyed(){
			window.onresize = null;
		},
		methods: {
			showUserDetails(data) {
            	let res = JSON.stringify({ user_id: data.user_id })
            	this.$router.push({ name: 'userDetails', query: { res } })
			},
			clickRoleName(data) {
            	const { role_id } = data;
            	this.$router.push({ name: 'roleDetails', query: { role_id } })
        	},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this.$emit('checkbox-info', val);
			},
			getTableRow() {
				const tag = this.tagKey === 'role' ? 'role_id' : 'user_id';
				this.tableInfo.tableData.filter(item => {
          item.disabled = this.currentTable.some(state => state[tag] === item[tag])
				  return item
        });
			},
      selectable (row,index) {
        const tag = this.tagKey === 'role' ? 'role_id' : 'user_id';
        // console.log(this.tableInfo.tableData)
        if (this.currentTable.some(state => state[tag] === row[tag])) {
          return false
        }else {
          return true
        }
      }
		}
	}
</script>

<style lang="less" scoped>
	.ts-content-wrap {
		margin-top: 16px;
		background: #ffffff;

		.el-tabs__nav-wrap {
			margin-left: 12px;

			.el-tabs__active-bar, .el-tabs__item {
				width: 80px !important;
				text-align: center;
			}
		}

		.ts-add-user {
			margin-left: 12px;
		}
	}

	.table-container {
		margin-top: 10px;
		padding: 10px;
		background: #fff;
		border-radius: 2px;

		/*.el-table th {*/
			/*padding: 4px 0;*/
			/*font-family: 'Roboto Regular', 'Roboto';*/
			/*font-weight: 400;*/
			/*font-style: normal;*/
			/*color: #333333;*/
			/*background-color: rgba(235, 237, 242, 0.996078431372549);*/
			/*border-right: 1px solid #fff;*/
		/*}*/

		/*.el-table td {*/
			/*padding: 6px 0;*/
		/*}*/

		.ts-column-blue {
			color: #1890FF;
		}
	}

	.ts-user-avatar {
		margin: 22px;
	}
</style>
