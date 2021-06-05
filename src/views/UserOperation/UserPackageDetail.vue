<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>          
          <div class="overline mb-4">包裹信息
            <v-chip
              class="ma-2"
              outlined
              small
              v-if="selectedPackage.status == '待处理'"
              @click="openEditInfoDialog(selectedPackage)"
            >
              <v-icon left>
                mdi-pencil
              </v-icon>
              修改
            </v-chip>
          </div>
          <h3 style="display: inline">小蚂蚁单号：{{selectedPackage.litlleant_tracking_number}}</h3>
            <tr>
              <td>包裹描述：{{selectedPackage.package_description}}</td>
            </tr>
            <tr>
              <td>包裹备注: {{selectedPackage.package_comment}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>创建于: {{selectedPackage.created_at}}</td>
            </tr>
            <tr>
              <td>重量: {{selectedPackage.total_weight}}&nbsp;lb&nbsp;&nbsp;&nbsp;</td>
              <td>运费: {{selectedPackage.total_price}}&nbsp;美元</td>
            </tr> 
        </material-card>
      </v-col>
      <v-col cols="12">
        <material-card>          
          <div v-if="selectedPackage.to_name">
            <div class="overline mb-4">收件人信息
              <v-chip
                class="ma-2"
                outlined
                small
                v-if="selectedPackage.status == '待处理'"
                @click="openEditRecipientDialog(selectedPackage)"
              >
                <v-icon left>
                  mdi-pencil
                </v-icon>
                修改
              </v-chip>
            </div>
            <h3>收件人: {{selectedPackage.to_name}} </h3>
            <tr>
              <td>电话: {{selectedPackage.to_country_code}} {{selectedPackage.to_phone}}&nbsp;&nbsp;&nbsp;&nbsp;</td>                
              <td>身份证: {{selectedPackage.to_identity_card}}</td>
            </tr>              
              地址: {{selectedPackage.to_state}}&nbsp;&nbsp;{{selectedPackage.to_city}}&nbsp;&nbsp;{{selectedPackage.to_address}}
            
          </div>            
        </material-card>
      </v-col>
      <v-col cols="12">
        <v-card
          class="mx-auto"
          rounded
        >          
          <div class="overline mb-4 ml-2">申报内件明细
            <v-chip
              class="ma-2"
              outlined
              small
              v-if="selectedPackage.status == '待处理'"
              @click="openReportInfoDialog()"
            >
              <v-icon left>
                mdi-card-plus
              </v-icon>
              添加
            </v-chip>
          </div>
          <v-data-table
            :headers="headers"
            :items="userReportItemList"
            item-key="itemName"
            :items-per-page="10"
            no-data-text="当前还未申报物品"
            hide-default-footer
          >
          <template v-if="selectedPackage.status == '待处理'" v-slot:item.action="{ item }">
            <v-icon
              small
              @click="openReportInfoDialog(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              class="ml-5"
              @click="deleteReportItem(item)"
            >
              mdi-close
            </v-icon>
          </template>
          </v-data-table>
        </v-card>
      </v-col>
      <v-col v-if="this.$store.state.user.roles != 'default'" cols="12">
        <v-card
          class="mx-auto"
          rounded
        >          
          <div class="overline mb-4 ml-2">包裹内物品图片</div>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="item in itemList" :key="item.id">
                  <td><p>{{item.item_name}} ({{item.item_count}}件)</p></td>
                  <td><v-img :src='"https://image.endlessflora.com/" + item.pic1_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,0)"></v-img></td>
                  <td><v-img :src='"https://image.endlessflora.com/" + item.pic2_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,1)"></v-img></td>
                  <td><v-img :src='"https://image.endlessflora.com/" + item.pic3_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,2)"></v-img></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>

      <v-col cols="12" class="d-inline-flex justify-end">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancel">返回</v-btn>
        <v-btn v-if="selectedPackage.status == '待处理'" color="blue darken-1" text @click="deleteDialog">删除</v-btn>
      </v-col>
    </v-row>
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
    <v-dialog
      v-model="deleteComfirm"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">
          删除包裹
        </v-card-title>
        <v-card-text>
          确认删除这个包裹？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteIt()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="editInfoDialog"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">
          修改包裹信息
        </v-card-title>
        <v-card-text>
          <v-form
						ref="addressForm"
						v-model="valid"
						lazy-validation
					>
						<v-container>
							<v-row>
								<v-col	cols="12">
									<v-text-field
										v-model="packageDescription"
										label="包裹描述"
										:rules="requiredRule"
									></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-text-field
										v-model="packageComment"
										label="包裹备注"
									></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="updatePackageInfo"
          >
            更新
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="cancelPackageInfo"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="editRecipientDialog"
      width="800"
    >
      <v-card>
        <v-card-title class="headline">
          修改收件人信息
        </v-card-title>
        <v-card-text>
          <v-form
						ref="addressForm"
						v-model="valid"
						lazy-validation
					>
						<v-container>
							<v-row>
								<v-col	cols="12"	md="3">
									<v-text-field
										v-model="recipientName"
										label="收件人姓名"
										:rules="requiredRule"
									></v-text-field>
								</v-col>
								<v-col cols="12" md="2">
									<v-select v-model="phoneCode" 
										:items="phoneCodeList"
										label="Code"
									></v-select>
								</v-col>
								<v-col cols="12" md="3">
									<v-text-field label="收件人手机" v-model="recipientPhone" :rules="requiredRule"></v-text-field>
								</v-col>
								<v-col	cols="12"	md="4" v-if="phoneCode == 'China +86'">
									<v-text-field
										v-model="recipientIdentityCard"
										label="收件人身份证"
										:rules="requiredRule"
									></v-text-field>
								</v-col>
                <v-col	cols="12"	md="4" v-if="phoneCode != 'China +86'">
									<v-text-field
										v-model="recipientZip"
										label="邮编"
										:rules="requiredRule"
									></v-text-field>
								</v-col>
							</v-row>
							<v-row>
								<v-col	cols="12"	md="6">
									<v-text-field
										v-model="recipientAddress"
										label="地址"
										:rules="requiredRule"
									></v-text-field>
								</v-col>
								<v-col cols="12" sm="4" md="3">
									<v-select v-model="recipientState" 
										:items="stateList"
										label="省/州"
										:rules="requiredRule"
									></v-select>
								</v-col>
								<v-col cols="12" sm="4" md="3">
									<v-text-field label="城市" v-model="recipientCity" :rules="requiredRule"></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="updateRecipientInfo"
          >
            更新
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="cancelRecipientInfo"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="reportInfoDialog"
      width="1000"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          {{reortInfoDialogTitle}}
        </v-card-title>
        <v-card-text>
          
          <v-form
            ref="itemForm"
            v-model="valid"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col
                  cols="6"
                  md="2"
                >
                  <v-select
                    v-model="itemType"
                    :items="itemTypeList"
                    label="类别"
                    :rules="requiredRule"
                  ></v-select>
                </v-col>
                <v-col
                  cols="6"
                  md="3"
                >
                  <v-text-field
                    v-model="itemName"
                    label="物品描述"
                    :rules="requiredRule"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="6"
                  md="3"
                >
                  <v-text-field
                    v-model="itemBrand"
                    label="品牌"
                    :rules="requiredRule"
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="6"
                  md="2"
                >
                  <v-text-field
                    v-model="itemPrice"
                    :rules="requiredRule"
                    label="申报单价(USD)"
                  ></v-text-field>
                </v-col>                
                <v-col
                  cols="6"
                  md="2"
                >
                  <v-text-field
                    v-model="itemCount"
                    :counter="5"
                    :rules="requiredRule"
                    label="数量"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="updateReportInfo"
          >
            更新
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="cancelReportInfo"
          >
            取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {USStates, CNStates} from '../../utils/helpFunction'
  export default {
    data: () => ({
      snackbar: false,
      snackbarColor: '',
      notification: '',
      valid: true,
      editInfoDialog: false,
      editRecipientDialog: false,
      reportInfoDialog: false,
      headers: [
        {
          sortable: false,
          text: '类别',
          value: 'type'
        },
        {
          sortable: false,
          text: '物品描述',
          value: 'item_name'
        },
        {
          sortable: false,
          text: '申报单价',
          value: 'price',
        },
        {
          sortable: false,
          text: '数量',
          value: 'unit'
        },
        {
          sortable: true,
          text: '品牌',
          value: 'brand',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        }
      ],
      userReportItemList: [],
      //recipient
      recipientName: '',
      phoneCode: 'China +86',
      phoneCodeList: ['China +86', 'USA +1'],
      recipientPhone: '',
      recipientIdentityCard: '',
      recipientAddress: '',
      recipientState: '',
      recipientCity: '',
      stateList: CNStates,
      recipientZip: '',
      requiredRule: [
          v => !!v || 'Item is required',
      ],

      //package info
      packageDescription: '',
      packageComment: '',

      //
      itemList: [],

      //add user report items
      reortInfoDialogTitle: '添加物品申报信息',
      selectedReportItem: {},
      itemType: '',
      itemTypeList: ['鞋类','奶粉','保健品','零食','日用品','衣服','玩具','化妆品','箱包','电子产品','手表'],
      itemName: '',
      itemPrice: '',
      itemCount: '',
      itemBrand: '',


      selectedPackage: {},
      selectedPackageId: '',
      confirmDialog: false,
      allPackedList: [],
      deleteComfirm: false,
    }),

    methods: {
      focus(event) {
        event.currentTarget.select();
      },
      
      previewImg: function(item,index){
        let baseUrl = "https://image.endlessflora.com/";
        let imgList = [];
        if(item.pic1_url)
          imgList.push(baseUrl + item.pic1_url);
        if(item.pic2_url)
          imgList.push(baseUrl + item.pic2_url);
        if(item.pic3_url)
          imgList.push(baseUrl + item.pic3_url);
        this.$hevueImgPreview({
            multiple: true, // 开启多图预览模式
            nowImgIndex: index, // 多图预览，默认展示第二张图片
            imgList: imgList, // 需要预览的多图数组
        })
      },

      cancel: function(){
        this.$router.push({ path: '/package/mypackage' });
      },

      openEditInfoDialog: function(item){
        this.editInfoDialog = true;
        this.packageDescription = item.package_description.substr(6);
        this.packageComment = item.package_comment;
      },

      clearEnidInfoDialog: function(){
        this.packageDescription = '';
        this.packageComment = '';
      },

      updatePackageInfo: function(){
        this.$http.post('/api/updatePackageDescription',{
          package_description: this.$store.state.user.storage_number + '|' + this.packageDescription,
          package_comment: this.packageComment,
          id: this.selectedPackageId            
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '修改成功';
          this.snackbarColor = 'green';
          this.editInfoDialog = false;
          this.getAll();
        })
      },

      cancelPackageInfo: function(){
        this.editInfoDialog = false;
        this.clearEnidInfoDialog();
      },

      openEditRecipientDialog: function(item){
        this.editRecipientDialog = true;
        this.recipientName = item.to_name;
        this.phoneCode = item.to_country_code;
        this.recipientPhone = item.to_phone;
        this.recipientIdentityCard = item.to_identity_card;
        this.recipientAddress = item.to_address;
        this.recipientState = item.to_state;
        this.recipientCity = item.to_city;
        this.recipientZip = item.to_zip;
      },

      clearEditRecipientDialog: function(){
        this.recipientName = '';
        this.phoneCode = 'China +86';
        this.recipientPhone = '';
        this.recipientIdentityCard = '';
        this.recipientAddress = '';
        this.recipientState = '';
        this.recipientCity = '';
        this.recipientZip = '';
      },

      updateRecipientInfo: function(){
        this.$http.post('/api/updatePackageRecipient',{
          recipientName : this.recipientName,
          countryCode : this.phoneCode,
          recipientPhone : this.recipientPhone,
          recipientIdentityCard : this.recipientIdentityCard,
          recipientAddress : this.recipientAddress,
          recipientState : this.recipientState,
          recipientCity : this.recipientCity,
          recipientZip : this.recipientZip,
          id: this.selectedPackageId            
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '修改成功';
          this.snackbarColor = 'green';
          this.editRecipientDialog = false;
          this.getAll();
        })
      },

      cancelRecipientInfo: function(){
        this.editRecipientDialog = false;
        this.clearEditRecipientDialog();
      },

      openReportInfoDialog: function(item){
        this.reportInfoDialog = true;
        if(item){
          this.reortInfoDialogTitle = '修改物品申报信息';
          this.selectedReportItem = item;
          this.itemType = item.type;
          this.itemName = item.item_name;
          this.itemPrice = item.price;
          this.itemCount = item.unit;
          this.itemBrand = item.brand;
        }
      },

      clearReportInfoDialog: function(){
        this.reortInfoDialogTitle = '添加物品申报信息';
        this.selectedReportItem = {};
        this.itemType = '';
        this.itemName = '';
        this.itemPrice = '';
        this.itemCount = '';
        this.itemBrand = '';
      },

      updateReportInfo: function(){
        if(this.reortInfoDialogTitle === '修改物品申报信息'){   //修改
          this.$http.post('/api/updateUserReportItems',{
            itemType : this.itemType,
            itemName : this.itemName,
            itemPrice : parseFloat(this.itemPrice),
            itemCount : this.itemCount,
            itemBrand : this.itemBrand,
            id: this.selectedReportItem.id,            
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '修改成功';
            this.snackbarColor = 'green';
            this.reportInfoDialog = false;
            this.clearReportInfoDialog();
            this.getAll();
          })
        }else{    //增加
          this.$http.post('/api/insertPackageItems',{
            packageId : this.selectedPackageId,
            itemType : this.itemType,
            itemName : this.itemName,
            itemPrice : parseFloat(this.itemPrice),
            itemCount : this.itemCount,
            itemBrand : this.itemBrand,
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '增加成功';
            this.snackbarColor = 'green';
            this.reportInfoDialog = false;
            this.getAll();
          })
        }
      },

      cancelReportInfo: function(){
        this.reportInfoDialog = false;
        this.clearReportInfoDialog();
      },

      deleteReportItem: function(item){
        this.$http.delete('/api/deleteUserReportItem',{
          params: {
            itemId : item.id
          }
        }).then( (res) => {
          this.notification = '删除成功';
          this.snackbarColor = 'green';
          this.reportInfoDialog = false;
          this.getAll();
        })
      },

      deleteDialog: function(item){
        this.deleteComfirm = true;
      },

      deleteIt: async function(){
        if(this.selectedPackage.vendor_tracking_number){
          alert('包裹已经被仓库处理，无法删除');
          return;
        }

        this.overlay = true;
        let result = [];
        for(let kitem of this.itemList){
          let adminItemsResult = new Promise((resolve, reject) => {
            //delete current
            //update original count
            if(kitem.origiral_item_Id){
              this.$http.post('/api/deleteAdminItemAndChangeCount',{
                update_count : kitem.item_count,
                original_item_id: kitem.origiral_item_Id,
                current_item_id: kitem.id,
              }).then((res) => {
                resolve(1);
              })
            }else{
              this.$http.post('/api/updateAdminReportItems',{
                packageId : null,
                id: kitem.id,
              }).then((res) => {
                resolve(1);
              })
            }                
          })
          result.push(adminItemsResult);
        }
        for(let pkgId of this.allPackedList){
          let updateThirdPartyPkgResult = new Promise((resolve, reject) => {
            this.$http.post('/api/updateThirdPartyPackageStatus',{
              status: '已入库',
              user_packageId: null,
              third_party_packageId : pkgId,
            }).then( (res) => {
              resolve(2);
            })
          })
          result.push(updateThirdPartyPkgResult);
        }
        for(let item of this.userReportItemList) {
          let deleteUserReportItemsResult = new Promise((resolve, reject) => {
            this.$http.delete('/api/deleteUserReportItem',{
              params: {
                itemId : item.id
              }
            }).then( (res) => {
              resolve(3);
            })
          })
          result.push(deleteUserReportItemsResult);
        }
        let deletePackageResult = new Promise((resolve, reject) => {
          this.$http.delete('/api/deletePackagebybyId',{
            params: {
              packageId : this.selectedPackage.id
            }
          }).then( (res) => {
            resolve(4);
          })
        })
        result.push(deletePackageResult);
        let promiseResult = await Promise.all(result);
        this.overlay = false;
        this.deleteComfirm = false;
        this.snackbar = true;
        this.notification = '删除发货单成功,跳转回我的包裹';
        this.snackbarColor = 'green';
        setTimeout( () => {this.$router.push({ path: '/package/mypackage' });},2000);
      },

      getAll: function(){
        if(this.selectedPackageId){
          this.allPackedList = [];
          let dict = [];
          this.$http.get('/api/getUserReportItemsByPackageId',{
            params: {
              packageId : this.selectedPackageId,
            }
          }).then( (resk) => {
            this.userReportItemList = resk.data;
          })
          this.$http.get('/api/getItemsInPackage',{
            params: {
              packageId : this.selectedPackageId,
            }
          }).then( (resSec) => {
            this.itemList = resSec.data;
            if(this.itemList.length != 0){
              for(let item of this.itemList){
                this.$http.get('/api/getDefinedTrackingById',{
                  params: {
                    packageId : item.third_party_packageId,
                  }
                }).then( (res) => {
                  if(dict.indexOf(item.third_party_packageId) == -1){
                    dict.push(item.third_party_packageId);
                    if(res.data[0]['status'] == '已全部打包'){
                      this.allPackedList.push(item.third_party_packageId);
                    }
                  }              
                })
              }
            }
          })

          this.$http.get('/api/getPackageInfoById',{
            params: {
              packageId : this.selectedPackageId,
            }
          }).then( (res) => {
            this.selectedPackage = res.data[0];
            //
            this.actualWeight = this.selectedPackage.actual_weight;
            this.chargePrice = this.selectedPackage.charge_price;          
          })
        }else{
          this.$router.push({ path: '/package/mypackage' });
        }
      }
    },

    watch: {
      phoneCode: function(){
        if(this.phoneCode == 'China +86')
          this.stateList = CNStates;
        else{
          this.stateList = USStates;
        }
      }
    },

    mounted: function() {
      this.getAll();
    },

    created() {
      //todo change the way pass in params
      this.selectedPackageId = this.$route.query.packageId;
    },
  }
</script>

