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
          <div class="overline mb-4 ml-2">内件明细</div>
          <v-data-table
            :headers="headers"
            :items="itemList"
            item-key="itemName"
            :items-per-page="10"
            no-data-text="当前还未申报物品"
            hide-default-footer
            show-expand
            single-expand
            :expanded.sync="expanded"
					>
						<template v-slot:expanded-item="{ item }">
							<td :colspan="8">
								<v-simple-table>
									<template v-slot:default>
										<tbody>
											<tr >
												<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic1_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,0)"></v-img></td>
												<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic2_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,1)"></v-img></td>
												<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic3_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,2)"></v-img></td>
											</tr>
										</tbody>
									</template>
								</v-simple-table>
							</td>
						</template>
          </v-data-table>
        </v-card>
      </v-col>

      <v-col cols="12" class="d-inline-flex justify-end">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="cancel">返回</v-btn>
        <!-- v-btn v-if="selectedPackage.status == '待处理'" color="blue darken-1" text @click="deleteDialog">删除</v-btn -->
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
        <v-card-title class="">
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
      expanded: [],
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
          value: 'item_count'
        },
        {
          sortable: true,
          text: '品牌',
          value: 'brand',
        },
      ],
      itemList: [],
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
        for(let item of this.itemList) {
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
          this.$http.get('/api/item/getItemsByPackageId',{
            params: {
              packageId : this.selectedPackageId,
            }
          }).then( (resSec) => {
            this.itemList = resSec.data;
            if(this.itemList.length != 0){
              for(let item of this.itemList){
                this.$http.get('/api/package/getTrackingByThirdPartyPackageId',{
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

