<template>
	<div class="app-overview">
		<div class="ts-content-wrap">
			<slot name="search"></slot>
			<div class="table-container">
				<div class="table-list">
					<el-table
						ref="multipleTable"
						:data="tableInfo.tableData"
						tooltip-effect="dark"
						style="width: 100%"
						:min-height="minHeight"
						v-loading="loading"
						@selection-change="handleSelectionChange"

					>
						<el-table-column
							type="selection"
							v-if="isMultiple"
							width="55">
						</el-table-column>
						<el-table-column
							v-for="(item,index) in tableInfo.tableHeader" :key="index"
							:prop="item.key"
							:label="item.label"
							:width="item.width">
						</el-table-column>
						<slot name="operate"></slot>
					</el-table>
				</div>
				<slot name="button"></slot>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			tableInfo: {},
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
				minHeight: '300px'
			}
		},
		watch: {
        tableInfo: {
            handler (newVal) {
                if (newVal && JSON.stringify(newVal) !== '{}') {
                    this.$nextTick(() => {
											this.getTableRow()
										})
								}
						},
						immediate: true,
						deep: true
				}
		},
		mounted: function () {
      // form滚动条
      const that = this
      const HEIGHT = 230
      this.$nextTick(() => {
        let flowHeight = document.body.clientHeight - HEIGHT
        that.maxHeight = flowHeight + 'px'
        that.$refs.multipleTable.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
      })
      window.onresize = () => {
        return (() => {
          let flowHeight = document.body.clientHeight - HEIGHT
          that.maxHeight = flowHeight + 'px'
          that.$refs.multipleTable.$el.style.cssText = `overflow-y:auto;height:${flowHeight}px`
        })()
      }
    },
		destroyed(){
			window.onresize = null;
		},
		methods: {
        handleSelectionChange (val) {
            console.log('list-111--', val);
            this.multipleSelection = val;
            this.$emit('checkbox-info', val);
        },
			getTableRow() {
					let { defaultCheckedData, tableData } = this.tableInfo;
					if (!defaultCheckedData.length) return
					const tag = 'user_name';
					if(tableData.length > 0){
              let arr = tableData.filter(item => defaultCheckedData.some(state => state[tag] === item[tag]));
              if (arr.length) {
                  arr.forEach(row => {
                      this.$refs.multipleTable.toggleRowSelection(row, true);
                  });
              }
					}

			},
		}
	}
</script>

<style lang="less" scoped>
	.ts-content-wrap {
		margin-top: 16px;
		background: #ffffff;
	}

	.table-container {
		.table-list{
			padding: 10px;
		}
	}

	.ts-drawer__footer {
		position: fixed;
		bottom: 0;
		width: 100%;
		background: rgba(245, 245, 245, 1);
		height: 60px;
		line-height: 60px;
		padding-left: 30px;
		z-index: 99;
	}

	.search-tools {
		padding: 10px 10px;
		height: 3em;
		margin: 10px 0px;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;

		.groups-serach {
			flex-grow: 1;
			height: 32px;
			border: 1px solid #EBEEF5;
			line-height: 32px;
			position: relative;
			.icons-search {
				position: absolute;
				right: 0px;
				cursor: pointer;
				text-align: center;
				min-width: 50px;
				bottom: 0;
			}

			input {
				width: 100%;
				height: 26px;
				line-height: 26px;
				border: none;
				text-indent: 10px;
			}
		}


	}
</style>
