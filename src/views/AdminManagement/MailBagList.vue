<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
          <v-toolbar
						color="blue"
						dark
						flat
					>
						<v-btn @click="createMailBag()" text outlined>新增邮袋</v-btn>

						<template v-slot:extension>
							<v-tabs
								v-model="tab"
								fixed-tabs
							>
								<v-tabs-slider color="black"></v-tabs-slider>

								<v-tab>
									处理中
								</v-tab>
								<v-tab>
									运往机场
								</v-tab>
                <v-tab>
									发往中国
								</v-tab>
                <v-tab>
									开始清关
								</v-tab>
                <v-tab>
									清关完成
								</v-tab>
							</v-tabs>
						</template>
					</v-toolbar>

					<v-tabs-items v-model="tab">
						<v-tab-item>
							<v-card flat>
								<v-card-text>
									<v-data-table
										:headers="headers"
										:items="processingMailBagList"
										dense
										item-key="id"
										:items-per-page="15"
										:search="searchStr"
										:custom-filter="filterText"
									>
										<template v-slot:top>
											<v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
										</template>
										<template v-slot:item.action="{ item }">
											<v-btn @click="jumpToMailBagOperation(item.id, item.name, item.vendor, item.status)" text outlined>打开</v-btn>
                      <v-btn @click="deleteComfirmDialogClick(item.id)" text outlined class="ml-2">删除</v-btn>
										</template>
          				</v-data-table>
								</v-card-text>
							</v-card>
						</v-tab-item>
						<v-tab-item>
							<v-card flat>
								<v-card-text>
									<v-data-table
										:headers="headers"
										:items="toAirMailBagList"
										dense
										item-key="id"
										:items-per-page="15"
										:search="searchStr"
										:custom-filter="filterText"
									>
										<template v-slot:top>
											<v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
										</template>
										<template v-slot:item.action="{ item }">
                      <v-btn @click="jumpToMailBagOperation(item.id, item.name, item.vendor, item.status)" text outlined>打开</v-btn>
                      <v-btn @click="updateStatus(item)" text outlined class="ml-2">更新状态</v-btn>
										</template>
          				</v-data-table>
								</v-card-text>
							</v-card>
						</v-tab-item>
            <v-tab-item>
							<v-card flat>
								<v-card-text>
									<v-data-table
										:headers="headers"
										:items="inAirMailBagList"
										dense
										item-key="id"
										:items-per-page="15"
										:search="searchStr"
										:custom-filter="filterText"
									>
										<template v-slot:top>
											<v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
										</template>
										<template v-slot:item.action="{ item }">
                      <v-btn @click="jumpToMailBagOperation(item.id, item.name, item.vendor, item.status)" text outlined>打开</v-btn>
											<v-btn @click="updateStatus(item)" text outlined class="ml-2">更新状态</v-btn>
										</template>
          				</v-data-table>
								</v-card-text>
							</v-card>
						</v-tab-item>
            <v-tab-item>
							<v-card flat>
								<v-card-text>
									<v-data-table
										:headers="headers"
										:items="atCustomerMailBagList"
										dense
										item-key="id"
										:items-per-page="15"
										:search="searchStr"
										:custom-filter="filterText"
									>
										<template v-slot:top>
											<v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
										</template>
										<template v-slot:item.action="{ item }">
                      <v-btn @click="jumpToMailBagOperation(item.id, item.name, item.vendor, item.status)" text outlined>打开</v-btn>
											<v-btn @click="updateStatus(item)" text outlined class="ml-2">更新状态</v-btn>
										</template>
          				</v-data-table>
								</v-card-text>
							</v-card>
						</v-tab-item>
            <v-tab-item>
							<v-card flat>
								<v-card-text>
									<v-data-table
										:headers="headers"
										:items="afterCustomerMailBagList"
										dense
										item-key="id"
										:items-per-page="15"
										:search="searchStr"
										:custom-filter="filterText"
									>
										<template v-slot:top>
											<v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
										</template>
                    <template v-slot:item.action="{ item }">
                      <v-btn @click="jumpToMailBagOperation(item.id, item.name, item.vendor, item.status)" text outlined>打开</v-btn>
										</template>
          				</v-data-table>
								</v-card-text>
							</v-card>
						</v-tab-item>
					</v-tabs-items>
				</material-card>
			</v-col>
		</v-row>
    <v-dialog v-model="createMailBagDialog" scrollable max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">新建邮袋</span>
        </v-card-title>
        <v-card-text>
          <v-col cols="12">
            <v-text-field
              class="ma-4"
              dense
              outlined
              v-model="bagName"
              label="名称"
            ></v-text-field>
            <v-select
              class="ma-4"
              outlined
              dense
              v-model="vendor"
              :items="vendorList"
              label="渠道"
            ></v-select>
          </v-col>
						
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
    <v-dialog
      v-model="deleteComfirmDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">
          删除当前邮袋
        </v-card-title>
        <v-card-text>
          确认删除这个邮袋？邮袋中的包裹会恢复未添加到邮袋的状态
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteMailBag()"
          >
            确定
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
	</v-container>
</template>

<script>
  import {getNowTimeFormatDate} from '../../utils/helpFunction';
  export default {
    data () {
      return {
        tab: null,
        searchStr: '',
        snackbar: false,
        snackbarColor: '',
        notification: '',
        createMailBagDialog: false,
        bagName: '',
        processingMailBagList: [],
        toAirMailBagList: [],
        inAirMailBagList: [],
        atCustomerMailBagList: [],
        afterCustomerMailBagList: [],
        headers: [
        {
          sortable: false,
          text: '名称',
          value: 'name'
        },
        {
          sortable: false,
          text: '快递单数量',
          value: 'amount'
        },
        {
          sortable: false,
          text: '渠道',
          value: 'vendor'
        },
				{
          sortable: true,
          text: '状态',
          value: 'status',
        },
        {
          sortable: false,
          text: '创建时间',
          value: 'created_at'
        },        
        {
          sortable: false,
          width: '20%',
          text: '操作',
          value: 'action',
        },
      ],
        vendorList: ['新元快递','TST速运通','青岛中通','沈阳圆通'],
        vendor: '',
        deleteComfirmDialog: false,
        needDeleteMailBagId: '',
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

      createMailBag: function(){
        this.bagName = '';
        this.createMailBagDialog = true;
      },

      confirm: function(){
				this.$http.post('/api/createMailBag',{
          name: this.bagName,
          status: '处理中',
          vendor: this.vendor,
          created_at: getNowTimeFormatDate(),
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '创建成功';
          this.snackbarColor = 'green';
          this.createMailBagDialog = false;
          this.vendor = '';
          this.bagName = '';
          this.getAllBatch();
        })
			},

			cancel: function(){
				this.createMailBagDialog = false;
			},

      jumpToMailBagOperation: function(mailBag_id, mailBag_name, mailBag_vendor, mailBag_status){
        this.$router.push({ path: '/admin/mailbag_operation', query: {mailBagId: mailBag_id, mailBagName: mailBag_name, mailBagVendor: mailBag_vendor, mailBagStatus: mailBag_status}});
      },

      deleteComfirmDialogClick: function(mailBagId){
        this.deleteComfirmDialog = true;
        this.needDeleteMailBagId = mailBagId;
      },

      deleteMailBag: function(){
        //把child order里的bag id清空
        this.$http.post('/api/setMailbagIdToNull',{
          bag_id: this.needDeleteMailBagId,
        }).then( (res) => {
          this.$http.delete('/api/deleteMailBag',{
            params: {
              bag_id : this.needDeleteMailBagId
            }
          }).then( (res) => {
            this.deleteComfirmDialog = false;
            this.snackbar = true;
            this.notification = '删除成功';
            this.snackbarColor = 'green';
            this.getAllBatch();
          })
        })
      },

      updateStatus: function(mailBag){
        if(mailBag.status == '运往机场'){					
					this.$http.post('/api/updateMailBagStatus',{
						status: '发往中国',
            stautsCol : 'flyToChina_at',
            changeTime : getNowTimeFormatDate(),
            mailBag_id : mailBag.id,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '更新成功';
            this.snackbarColor = 'green';
						this.mailBag_status = '发往中国';
            this.getAllBatch();
          })

				}else if(mailBag.status == '发往中国'){
					this.$http.post('/api/updateMailBagStatus',{
						status: '开始清关',
            stautsCol : 'beginCustomerClear_at',
            changeTime : getNowTimeFormatDate(),
            mailBag_id : mailBag.id,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '更新成功';
            this.snackbarColor = 'green';
						this.mailBag_status = '开始清关';
            this.getAllBatch();
          })
				}else if(mailBag.status == '开始清关'){
					this.$http.post('/api/updateMailBagStatus',{
						status: '清关完成',
            stautsCol : 'customerFinish_at',
            changeTime : getNowTimeFormatDate(),
            mailBag_id : mailBag.id,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '更新成功';
            this.snackbarColor = 'green';
						this.mailBag_status = '清关完成';
            this.getAllBatch();
          })
				}
      },

      getAllBatch: function(){
        this.processingMailBagList = [];
        this.toAirMailBagList = [];
        this.inAirMailBagList = [];
        this.atCustomerMailBagList = [];
        this.afterCustomerMailBagList = [];
        this.$http.get('/api/getAllMailBag').then( (res) => {
          for(let item of res.data){
            if(item.status == '处理中'){
              this.processingMailBagList.push(item);
            }else if(item.status == '运往机场'){
              this.toAirMailBagList.push(item);
            }else if(item.status == '发往中国'){
              this.inAirMailBagList.push(item);
            }else if(item.status == '开始清关'){
              this.atCustomerMailBagList.push(item);
            }else if(item.status == '清关完成'){
              this.afterCustomerMailBagList.push(item);
            }
            this.$http.get('/api/countChildPackageNmInBag',{
              params: {
                bag_id : item.id,
              }
            }).then( (res) =>{
              item.amount = res.data[0]['count(1)'];
            })
          }
        })
      }
		},

    mounted: function() {
      this.getAllBatch();
		}
	}
</script>