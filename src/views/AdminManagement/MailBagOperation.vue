<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row align="center">
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-subheader>邮袋名称: {{mailBag_name}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;渠道： {{mailBag_vendor}}</v-subheader>
						<v-chip
							class="ma-12"
							label
							@click="advanceStatus(mailBag_status)"
						>
						<v-icon left>
							mdi-arrow-right-bold
						</v-icon>
							{{mailBag_status}}
						</v-chip>
						<v-spacer />
						<v-menu
							open-on-hover
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									v-on="on"
									text
									outlined
								>
									导入导出
								</v-btn>
							</template>

							<v-list>
								<v-list-item
									v-for="(item, index) in excelMenu"
									:key="index"
									@click="excelClick(index)"
								>
									<v-list-item-title>{{ item.title }}</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
						<v-menu
							open-on-hover
							offset-y
						>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									v-on="on"
									text
									outlined
								>
									添加快递单
								</v-btn>
							</template>

							<v-list>
								<v-list-item
									v-for="(item, index) in addPackageMenu"
									:key="index"
									@click="addPackageClick(index)"
								>
									<v-list-item-title>{{ item.title }}</v-list-item-title>
								</v-list-item>
							</v-list>
						</v-menu>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"          
          tile
        >
          <v-data-table
						:headers="headers"
						:items="mailBagPackageList"
						dense
						class="elevation-1"
						item-key="id"
						show-expand
            single-expand
            :expanded.sync="expanded"
						:search="searchPackage"
            :custom-filter="filterText"
					>
						<template v-slot:top>
							<v-text-field v-model="searchPackage" label="搜索..." class="mx-4"></v-text-field>
						</template>
						<template v-slot:item.action="{ item }">
							<v-btn
								small
								text
								@click="deleteDialog(item)"
							>
								删除
							</v-btn>
						</template>
						<template v-slot:item.child_tracking_number="{ item }">
							<span
								class="blue--text text-decoration-underline"
								@click="toPackageInfo(item.child_tracking_number)"
							>
								{{item.child_tracking_number}}
							</span>
						</template>
						<template v-slot:item.vendor_tracking_number="{ item }">
							<v-text-field
								v-if="!item.vendor_tracking_number"
								append-icon="mdi-check"
								@click:append="saveVendorTracking(item.vendorTracking, item.id)"
								outlined
								class="pt-4"
								dense
								v-model="item.vendorTracking"
								@focus="focus($event)"
							></v-text-field>
							<v-chip
								small
								close
								v-if="item.vendor_tracking_number"
								close-icon="mdi-delete"
      					@click:close="deleteVendorTracking(item)"
							>
								{{item.vendor_tracking_number}}
							</v-chip>
						</template>
						<template v-slot:expanded-item="{ headers, item }">
							<td :colspan="headers.length">
								<v-simple-table>
									<template v-slot:default>
										<tbody>
											<tr :colspan="headers.length" v-for="userItem in item.userItems" :key="userItem.id">
												<td :colspan="headers.length">
													申报物品: {{userItem.item_name}}  数量{{userItem.item_count}} 价钱 {{userItem.price}} 品牌 {{userItem.brand}}
												</td>
											</tr>
										</tbody>
									</template>
								</v-simple-table>
							</td>
						</template>
					</v-data-table>
        </v-card>
      </v-col>
		</v-row>
		<v-dialog v-model="addPackageScanDialog" scrollable persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">添加快递单</span>
        </v-card-title>
        <v-card-text>
					<v-textarea
						outlined
						label="扫码快递面单"
						v-model="trackingArea"
					>
					</v-textarea>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
					<v-btn
						class="mr-4"
						@click="confirm"
					>
						确认
					</v-btn>
					<v-btn
						class="mr-4"
						@click="cancel"
					>
						取消
					</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addPackageOneKeyDialog" scrollable persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">添加快递单</span>
        </v-card-title>
        <v-card-text>
					<v-btn
						class="mr-4"
						@click="importNoVendorTrackingPackage()"
					>
						一键导入没有填快递单号的包裹
					</v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
					<v-btn
						class="mr-4"
						@click="addPackageOneKeyDialog = false"
					>
						取消
					</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
		<v-dialog v-model="addPackageSelectDialog" scrollable persistent max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">添加快递单</span>
        </v-card-title>
        <v-card-text>
					<v-data-table
						:headers="selectPackageheaders"
						:items="packageWithNoMailbagList"
						item-key="id"
						:search="searchStr"
            :custom-filter="filterText"
						show-select
						:single-select="false"
						v-model="selected"
						class="elevation-1"
					>
						<template v-slot:top>
							<v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
						</template>
					</v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
					<v-btn
						@click="addToMailBag(item)"
					>
						添加
					</v-btn>
					<v-btn
						class="mr-4"
						@click="cancelAddPackageSelectDialog"
					>
						取消
					</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
		<v-dialog v-model="excelExportDialog" scrollable max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">导出excel</span>
        </v-card-title>
        <v-card-text>
          <v-col cols="12">
						<v-combobox
							v-model="exportCol"
							:items="allCols"
							label="选择要导出的数据"
							multiple
							chips
						></v-combobox>
					</v-col>						
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <excel-export :filename="filename" :sheet="sheet" :manual="true" ref="excelExport">											
					</excel-export>
					<v-btn @click="exportTable">点击导出</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
		<v-dialog v-model="addPackageResultDialog" scrollable max-width="800px">
      <v-card>
        <v-card-text>
          <p class="text--primary">
						扫描快递单结果
					</p>
					<div class="text--primary">
						<ul>
							<li v-for="msg in msgList" :key="msg">{{msg}}</li>
						</ul>
					</div>
        </v-card-text>
				<v-card-actions>
          <v-btn
						class="mr-4"
						@click="closeResultDialog"
					>
						关闭
					</v-btn>
				</v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="3000"
      top
      dark
    >
      <v-icon
        color="white"
        class="mr-3"
      >
        mdi-bell-plus
      </v-icon>
      {{notification}}
      <v-btn
        icon
        @click="snackbar = false"
      >
        <v-icon>
          mdi-close-circle
        </v-icon>
      </v-btn>
    </v-snackbar>
		<v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
		<v-dialog
      v-model="deleteComfirm"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">
          从邮袋中删除包裹
        </v-card-title>
        <v-card-text>
          确认删除这个包裹？只会从邮袋中删除，包裹仍然在系统中
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteFromMailBag()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	</v-container>
</template>

<script>
  import {getNowTimeFormatDate,getNowFormatDate} from '../../utils/helpFunction';
	import {ExcelExport} from 'pikaz-excel-js'
  export default {
		components: {
			ExcelExport
		},
    data () {
      return {
				searchStr: '',
				searchPackage: '',
        snackbar: false,
        snackbarColor: '',
        notification: '',
        mailBag_id: '',
				mailBag_name: '',
				mailBag_status: '',
				mailBag_vendor: '',

				mailBagPackageList: [],
				expanded: [],
				duplicateObj: [],
				headers: [
					{
						sortable: false,
						text: '小蚂蚁单号',
						value: 'child_tracking_number'
					},
					{
						sortable: false,
						text: '快递单号',
						value: 'vendor_tracking_number'
					},
					{
						sortable: false,
						text: '描述',
						value: 'package_description'
					},
					{
						sortable: false,
						text: '重量',
						value: 'weight'
					},
					{
						sortable: false,
						text: '操作',
						value: 'action',
					}
				],
				overlay: false,
				excelMenu: [
					{ title: '导出发货单' },
				],
				addPackageMenu: [
					{title: '一键导入没有填快递单号的包裹'},
					{title: '扫描小蚂蚁单号添加'},
					{title: '根据小蚂蚁单号选择'}
				],

				//导入快递单
				addPackageOneKeyDialog: false,
				addPackageScanDialog: false,
				trackingArea: '',
				addPackageResultDialog: false,
				msgList: [],
				addPackageSelectDialog: false,
				selectPackageheaders: [
					{
						sortable: false,
						text: '小蚂蚁单号',
						value: 'child_tracking_number'
					},
					{
						sortable: false,
						text: '描述',
						value: 'package_description'
					},
					{
						sortable: false,
						text: '收件人',
						value: 'weight'
					},
				],
				packageWithNoMailbagList: [],
				selected: [],

				//导入导出excel
				excelExportDialog: false,
				exportCol: ['收件人信息','包裹重量','包裹运费','包裹申报信息','包裹描述','小蚂蚁单号','服务商单号'],
				allCols: ['收件人信息','包裹重量','包裹运费','包裹申报信息','包裹描述','小蚂蚁单号','服务商单号'],
				filename: '发货单',
				sheet:[],

				deleteComfirm: false,
				theDeletePackage: {},
      }
    },

    methods: {
			//搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

			toPackageInfo: function(child_tracking_number){
				this.$http.get('/api/existChildPackageByChildTrackingNumber',{
					params: {
						child_tracking_number: child_tracking_number,
					}
				}).then( (res) => {
					this.$router.push({ path: '/admin/package_info', query: {packageId: res.data[0].litlleant_package_id}});
				})
			},

 			//扫描单号导入add package to mailBag
      confirm: async function(){
				this.overlay = true;
				let result = [];
				//如果扫码枪扫出来带回车
				let successNm = 0;
				let trackingList = this.trackingArea.split('\n');
				for(let i=0; i<trackingList.length; i++){
					let scanPackageResult = new Promise((resolve, reject) => {
						this.$http.get('/api/existChildPackageByChildTrackingNumber',{
							params: {
								child_tracking_number: trackingList[i],
							}
						}).then( (res) => {
							if(res.data.length == 0){
								this.msgList.push(trackingList[i] + ' 该单号不存在，请检查');
								resolve(trackingList[i]);
							}else{
								this.$http.post('/api/setPackageToMailBag',{
									col: 'id',
									colValue: res.data[0].id,
									bag_id: this.mailBag_id,
								}).then( (res) => {
									if(res.data.affectedRows == 1){
										this.msgList.push(trackingList[i] + ' 成功');
									}else{
										this.msgList.push(trackingList[i] + ' 失败，请检查');
									}
									resolve(trackingList[i]);
								})
							}							
						})
					})
					result.push(scanPackageResult);
				}
				let promiseResult = await Promise.all(result);
				this.addPackageScanDialog = false;
				this.addPackageResultDialog = true;
				this.overlay = false;
			},

			closeResultDialog: function(){
				this.addPackageResultDialog = false;
				this.getPackagesInMailBag();
			},

			//一键导入
			importNoVendorTrackingPackage: function(){
				this.$http.post('/api/setNoTrackingChildPackageToMailBag',{
					bag_id: this.mailBag_id,
				}).then( (res) => {
          this.snackbar = true;
          this.notification = '导入成功';
          this.snackbarColor = 'green';
					this.addPackageOneKeyDialog = false;
          this.getPackagesInMailBag();
        })
			},

			//从table里选择
			addToMailBag: async function(){
				this.overlay = true;
				let result = [];
				for(let item of this.selected){
					let addPackageResult = new Promise((resolve, reject) => {
						this.$http.post('/api/setPackageToMailBag',{
							col: 'id',
							colValue: item.id,
							bag_id: this.mailBag_id,
						}).then( (res) => {
							resolve(item.id);
						})
					})
					result.push(addPackageResult);
				}
				let promiseResult = await Promise.all(result);
				this.addPackageSelectDialog = false;
				this.overlay = false;
				this.getPackagesInMailBag();
			},

			deleteDialog: function(item){
        this.deleteComfirm = true;
        this.theDeletePackage = item;
      },

			//delete package from mailBag
			deleteFromMailBag: function(){
				this.$http.post('/api/setPackageToMailBag',{
					col: 'id',
					colValue: this.theDeletePackage.id,
					bag_id: null,
				}).then( (res) => {
          this.snackbar = true;
          this.notification = '删除成功';
          this.snackbarColor = 'green';
					this.deleteComfirm = false;
          this.getPackagesInMailBag();
        })
			},

			cancel: function(){
				this.addPackageScanDialog = false;
				this.trackingArea = '';
			},

			cancelAddPackageSelectDialog: function(){
				this.addPackageSelectDialog = false;
				this.packageWithNoMailbagList = [];
			},

      getPackagesInMailBag: function(){
        this.$http.get('/api/getChildPackagesInMailBag',{
					params: {
						mailBag_id : this.mailBag_id,
					}
				}).then( (res) => {
          this.mailBagPackageList = res.data;
					for(let item of this.mailBagPackageList){
						this.$http.get('/api/package/getItemsByChildId',{
							params: {
								childPackage_Id : item.id,
							}
						}).then( (res) => {
							item.userItems = res.data;
						})
					}
					this.checkPackageLimits();
        })
      },

			saveVendorTracking: function(tracking, id){
				this.$http.post('/api/setVendorTrackingToChildPackage',{
					vendor_tracking_number: tracking,
					packageId: id,
				}).then( (res) => {
					this.getPackagesInMailBag();
				})
			},

			deleteVendorTracking (item) {
        item.vendor_tracking_number = '';
				
      },

			checkPackageLimits: function(){
				let dict = {};
				let duplicate = {};
				let tempArry = [];
				this.duplicateObj = [];
				for(let item of this.mailBagPackageList){
					if(dict[item.to_name] === undefined){
						dict[item.to_name] = 1;
					}else{
						dict[item.to_name] = dict[item.to_name] + 1;
					}
					if(dict[item.to_name] >=3) {
						duplicate[item.to_name] = 1;
					}
				}

				Object.keys(duplicate).forEach(name => {
					tempArry = this.mailBagPackageList.filter(item => item.to_name == name)
				})
				this.duplicateObj = this.duplicateObj.concat(tempArry);
			},

			getColor: function(item){
				if(this.duplicateObj.findIndex((p) => item.id == p.id) != -1){
					return 'red';
				}
			},

			focus(event) {
        event.currentTarget.select();
      },

			advanceStatus: function(status){
				if(status == '处理中'){

					this.$http.post('/api/updateMailBagStatus',{
						status: '运往机场',
            stautsCol : 'sendOut_at',
            changeTime : getNowTimeFormatDate(),
            mailBag_id : this.mailBag_id,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '更新成功';
            this.snackbarColor = 'green';
						this.mailBag_status = '运往机场';
          })
				}else if(status == '运往机场'){
					
					this.$http.post('/api/updateMailBagStatus',{
						status: '发往中国',
            stautsCol : 'flyToChina_at',
            changeTime : getNowTimeFormatDate(),
            mailBag_id : this.mailBag_id,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '更新成功';
            this.snackbarColor = 'green';
						this.mailBag_status = '发往中国';
          })

				}else if(status == '发往中国'){
					this.$http.post('/api/updateMailBagStatus',{
						status: '开始清关',
            stautsCol : 'beginCustomerClear_at',
            changeTime : getNowTimeFormatDate(),
            mailBag_id : this.mailBag_id,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '更新成功';
            this.snackbarColor = 'green';
						this.mailBag_status = '开始清关';
          })
				}else if(status == '开始清关'){
					this.$http.post('/api/updateMailBagStatus',{
						status: '清关完成',
            stautsCol : 'customerFinish_at',
            changeTime : getNowTimeFormatDate(),
            mailBag_id : this.mailBag_id,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '更新成功';
            this.snackbarColor = 'green';
						this.mailBag_status = '清关完成';
          })
				}
			},

			//excel操作
			excelClick: function(index){
				if(index == 0){
					this.excelExportDialog = true;
				}
			},

			//添加快递单操作
			addPackageClick: function(index){
				if(index == 0){
					this.addPackageOneKeyDialog = true;
				}					
				else if(index == 1){
					this.addPackageScanDialog = true;
				}else if(index == 2){
					this.addPackageSelectDialog = true;
					this.getSelectDialogPackage();
				}
			},

			/*获取选择dialog的包裹
				1. 有child order
				2. child order的bag id是null
			*/
			getSelectDialogPackage: function(){
				this.$http.get('/api/getTlaPackageWithChildNoMailbag').then( (res) => {
          this.packageWithNoMailbagList = res.data;
        })
			},

			exportTable () {
				this.$http.get('/api/getAllExcelInfo',{
					params: {
						bag_id : this.mailBag_id,
					}
				}).then( (resk) => {
					this.sheet.push({
						tHeader:["小蚂蚁单号","国内快递单号","渠道","重量","收件人","电话","身份证","地址","城市","省份","申报物品类型","名称","价钱","数量","品牌"],
						table: resk.data,
						keys:["child_tracking_number","vendor_tracking_number","vendor","weight","to_name","to_phone","to_identity_card","to_address","to_city","to_state","type","item_name","price","unit","brand"],
						sheetName:"发货单"
					})
					this.$refs.excelExport.pikaExportExcel()
				})
				
			},


		},

    mounted: function() {
      this.getPackagesInMailBag();
		},

		created() {
      this.mailBag_name = this.$route.query.mailBagName;
			this.mailBag_id = this.$route.query.mailBagId;
			this.mailBag_status = this.$route.query.mailBagStatus;
			this.mailBag_vendor = this.$route.query.mailBagVendor;;
    },

	}
</script>