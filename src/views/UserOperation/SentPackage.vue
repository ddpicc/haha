<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12" v-if="selectedItems">
        <v-card
          class="mx-auto"
          rounded
        >          
          <div class="overline mb-4 ml-2">已选物品</div>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="item in selectedItems" :key="item.id">
                  <td v-if="item.item_count > 1"><p>{{item.item_name}} ({{item.item_count}}件)</p></td>
                  <td v-if="item.item_count == 1"><p>{{item.item_name}}</p></td>
                  <td><v-img :src='"https://image.endlessflora.com/" + item.pic1_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item.pic1_url,0)"></v-img></td>
                  <td><v-img :src='"https://image.endlessflora.com/" + item.pic2_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item.pic2_url,1)"></v-img></td>
                  <td><v-img :src='"https://image.endlessflora.com/" + item.pic3_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item.pic3_url,2)"></v-img></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
      <!-- 大货只显示包裹 -->
      <v-col cols="12" v-if="!selectedItems">
        <v-card
          class="mx-auto"
          rounded
        >          
          <div class="overline mb-4 ml-2">已选包裹</div>
          <v-simple-table>
            <template v-slot:default>
              <tbody>
                <tr v-for="item in batchPackages" :key="item.id">
                  <td> <p>{{item}}</p></td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
      
      <v-col cols="12">
        <material-card fullWidth color="grey darken-1" >
          <template v-slot:header>
            <div class="px-3">
              <div class="title font-weight-light mb-2">
                包裹内件明细
              </div>
            </div>
						<v-spacer />   
            <v-btn
              absolute
              dark
              fab
              bottom
              right
              color="amber"
              @click="openInputItem"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </template>
          <v-form
            v-if="inputItem"
            ref="itemForm"
            v-model="valid"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col
                  cols="6"
                  md="4"
                >
                  <v-select
                    v-model="itemType"
                    :items="itemTypeList"
                    label="类别"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="itemPrice"
                    :rules="[v => !!v || 'Item is required']"
                    label="申报单价(USD)"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="6"
                  md="4"
                >
                  <v-text-field
                    v-model="itemName"
                    :rules="[v => !!v || 'Item is required']"
                    label="物品描述"
                    required
                  ></v-text-field>
                  <v-text-field
                    v-model="itemCount"
                    :counter="5"
                    :rules="[v => !!v || 'Item is required']"
                    label="数量"
                    required
                  ></v-text-field>
                </v-col>
                <v-col
                  cols="6"
                  md="4"
                >
                  <v-text-field
                    v-model="itemBrand"
                    label="品牌"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div class="d-flex  mb-6">
                    <v-btn color="blue" dark class="mr-2" @click="confirm">确认</v-btn>
                    <v-btn color="blue" dark class="mr-2" @click="cancel">取消</v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
          <v-data-table
            :headers="headers"
            :items="packageItem"
            item-key="itemName"
            :items-per-page="10"
            no-data-text="当前还未申报物品"
            hide-default-footer
          >
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-close
            </v-icon>
          </template>
          </v-data-table>
        </material-card>
      </v-col>
      <v-col cols="12" md="6">
				<v-card>
					<v-card-text>
						<v-container>
							<v-textarea
								solo
								label="智能识别地址信息(当前仅支持中国地址)"
                 v-model="regAddress"
							></v-textarea>
						</v-container>
					</v-card-text>
          <v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="parseAddress">确认识别</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
      <v-col cols="12" md="6">
        <material-card dense fullWidth color="grey darken-1">
          <template v-slot:header>
            <div class="px-3">
              <div class="title font-weight-light mb-2">
                收件人地址信息
              </div>
            </div>
            <v-spacer />
            <v-btn text x-large color="blue" class="text-decoration-underline" @click="openRecipientDialog">选择收件人</v-btn>
          </template>
          <v-form
            ref="addressForm"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col cols="12" sm="12" md="4">
                <v-text-field label="姓名*" v-model="recipientName" required :rules="[v => !!v || 'Item is required']"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <v-select v-model="phoneCode" 
                  :items="phoneCodeList"
                  label="Code"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="8" md="5">
                <v-text-field label="手机号码*" v-model="recipientPhone" :rules="[v => !!v || 'Item is required']"></v-text-field>
              </v-col>
              <v-col cols="12" v-if="phoneCode == 'China +86'">
                <v-text-field label="身份证号码*" v-model="recipientIdentityCard" :rules="[v => !!v || 'Item is required']"></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field label="地址*" v-model="recipientAddress" :rules="[v => !!v || 'Item is required']"></v-text-field>
              </v-col>              
              <v-col cols="12" sm="4" md="4">
                <v-select v-model="recipientState" 
                  :items="stateList"
                  label="省/州*"
                  :rules="[v => !!v || 'Item is required']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="4" md="4">
                <v-text-field label="城市*" v-model="recipientCity" :rules="[v => !!v || 'Item is required']"></v-text-field>
              </v-col>
              <v-col cols="12" sm="4" md="4" v-if="phoneCode != 'China +86'">
                <v-text-field label="邮编" v-model="recipientZip" :rules="[v => !!v || 'Item is required']"></v-text-field>
              </v-col>                 
            </v-row>
            <small>*表示选项是必填的</small>
          </v-form>
        </material-card>
      </v-col>
    </v-row> 
    <v-row justify="center">
      <v-col cols="12">
        <material-card dense fullWidth color="grey darken-1" title="运费信息">
          <v-form
            ref="form"
            v-model="valid"
            lazy-validation
          >
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="package_description"
                  label="包裹描述"
                  large
                ></v-text-field>
                <v-text-field
                  v-model="package_comment"
                  label="包裹备注"
                  large
                ></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="forcast_total"
                  label="包裹总价值"
                  large
                  :rules="[v => /^\d+(\.\d+)?$/.test(v) || '输入不合法']"
                ></v-text-field>
                <v-text-field
                  v-model="forcast_weight"
                  label="预估重量"
                  large
                ></v-text-field>
              </v-col>
            </v-row>
            <h3>
              预估运费： {{forcast_price}} $
            </h3>
          </v-form>
        </material-card>
        <div class="text-center pt-2">
          <v-btn block color="blue" dark class="mr-2" @click="openConfirmDialog">生成转运单</v-btn>
        </div>
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
    <v-dialog v-model="selectRecipientDialog" scrollable max-width="800px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-data-table
              :headers="findRecipientHeader"
              :items="recipientItems"
              no-data-text="还未添加收件人"
            >
              <template v-slot:item.action="{ item }">
                <v-btn color="blue darken-1" text @click="chooseRecipient(item)">选择</v-btn>
              </template>
            </v-data-table>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="confirmDialog" persistent max-width="800px">
      <v-card>
        <v-card-title class="headline">
          确认发货？
        </v-card-title>
        <v-card-text>
          <div>
            <tr>
              <td>收件人: {{recipientName}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>电话: {{phoneCode}} {{recipientPhone}}&nbsp;&nbsp;&nbsp;&nbsp;</td>                
              <td>身份证: {{recipientIdentityCard}}</td>
            </tr>              
              地址: {{recipientState}}&nbsp;&nbsp;{{recipientCity}}&nbsp;&nbsp;{{recipientAddress}}
            <tr>
              <td>包裹描述：{{package_description}}</td>
            </tr>
            <tr>
              <td>包裹备注: {{package_comment}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
            </tr>
          </div>   
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="confirmDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="generateLittleAntPackage"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
  import {USStates, CNStates, littleantTracking, getNowFormatDate} from '../../utils/helpFunction'
  import AddressParse from 'zh-address-parse'
  export default {
    data: () => ({
      passedInContent: {},
      selectedItems: [],
      batchPackages: [],
      selectRecipientDialog: false,
      inputItem: false,
      valid: true,
      itemType: '',
      itemTypeList: ['鞋类','奶粉','保健品','零食','日用品','衣服','玩具','化妆品','箱包','电子产品','手表'],
      itemName: '',
      itemPrice: '',
      itemCount: '',
      itemBrand: '',
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
      recipientId: '',
      regAddress: '',
      package_description: '',
      package_comment: '',
      forcast_total: 0,
      forcast_weight: '',
      forcast_price: 0,
      snackbar: false,
      snackbarColor: '',
      notification: '',
      findRecipientHeader: [
        {
          sortable: false,
          text: '姓名',
          value: 'name'
        },
        {
          sortable: false,
          text: '手机号码',
          value: 'phone'
        },
        {
          sortable: false,
          text: '身份证号',
          value: 'identity_card'
        },
        {
          sortable: false,
          text: '地址',
          value: 'address',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      recipientItems: [],
      packageItem: [],
      headers: [
        {
          sortable: false,
          text: '类别',
          value: 'model_en'
        },
        {
          sortable: false,
          text: '物品描述',
          value: 'description'
        },
        {
          sortable: false,
          text: '申报单价',
          value: 'unit_price',
        },
        {
          sortable: false,
          text: '数量',
          value: 'amount'
        },
        {
          sortable: true,
          text: '品牌',
          value: 'brand_en',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        }
      ],
      confirmDialog: false,
      overlay: false,
    }),

    methods: {
      openInputItem: function(){
        //open item form
        this.inputItem = true;
      },

      confirm: function(){
        //if item form is valid
        if(this.$refs.itemForm.validate()){
          this.packageItem.push({
            model_en: this.itemType,
            description: this.itemName,
            unit_price: this.itemPrice,
            unit_price_currency: 'USD',
            amount: this.itemCount,
            brand_en: this.itemBrand
          })
          this.$refs.itemForm.reset();
        }              
      },

      //close item form, clear items
      cancel: function(){
        this.$refs.itemForm.reset();
        this.inputItem = false;
      },

      deleteItem: function(item){
        var index = this.packageItem.indexOf(item);
        this.packageItem.splice(index, 1);
      },

      parseAddress: function(){
        let id_cardArray = this.regAddress.match(/(\d{15}$)|(\d{18}$)|(\d{17}(\d|X|x)$)/);
        let parseStr = '';
        if(id_cardArray){
          this.recipientIdentityCard = id_cardArray[0];
          let index = this.regAddress.search(/(\d{15}$)|(\d{18}$)|(\d{17}(\d|X|x)$)/);
          parseStr = this.regAddress.substring(0,index);
        }else{
          parseStr = this.regAddress;
        }
        const options = {
          type: 0, // 哪种方式解析，0：正则，1：树查找
          textFilter: [], // 预清洗的字段
          nameMaxLength: 4, // 查找最大的中文名字长度
        }
        const parseResult = AddressParse(parseStr, options);
        this.recipientName = parseResult.name;
        this.phoneCode = 'China +86';
        this.recipientPhone = parseResult.phone;
        this.recipientAddress = parseResult.area + parseResult.detail;
        this.recipientState = parseResult.province;
        this.recipientCity = parseResult.city;
      },

      openConfirmDialog: function(){
        //verify item is typed in        
        if(this.packageItem.length == 0){
          alert('请先申报物品');
          return;
        }

        //verify address is not empty
        if(!this.$refs.addressForm.validate()){
          alert('请填写收件人信息');
          return;
        }
        this.confirmDialog = true;
      },
      
      getUseableLittleAntTracking: function(){
        var littleant_tracking = littleantTracking();
        return new Promise (( resolve, reject) => {
          this.$http.get('/api/existUserPackageByLittleAntTracking',{
            params: {
              littleant_tracking: littleant_tracking,
            }
          }).then( (res) => {
            if(res.data.length === 0){
              resolve(littleant_tracking);
            }else{
              this.getUseableLittleAntTracking();
            }
          }).catch(function (error) {
            console.log(error);
            reject(error);
          });
        })
      },

      generateLittleAntPackage: async function() {
        this.confirmDialog = false;
        this.overlay = true;
        let thirdPartyCode = this.$store.state.user.storage_number + '|' + getNowFormatDate();
        if(this.package_description == ''){
          this.package_description = thirdPartyCode;
        }else{
          this.package_description = this.$store.state.user.storage_number + '|' + this.package_description;
        }

        let litlleant_tracking_number = await this.getUseableLittleAntTracking();
        let result = [];

        this.$http.post('/api/insertUserPackage',{
            user_id: this.$store.state.user.user_id,
            litlleant_tracking_number: litlleant_tracking_number,
            created_at: getNowFormatDate(),
            package_description: this.package_description,
            package_comment: this.package_comment,
            total: this.forcast_total,
            recipientName : this.recipientName,
            countryCode : this.phoneCode,
            recipientPhone : this.recipientPhone,
            recipientIdentityCard : this.recipientIdentityCard,
            recipientAddress : this.recipientAddress,
            recipientCity : this.recipientCity,
            recipientState : this.recipientState,            
            recipientZip : this.recipientZip,
            packageStatus : "待处理",
          }).then( async (res) => {
            let insertRecipientResult = new Promise((resolve, reject) => {
              this.$http.get('/api/existRecipient',{
                params: {
                  name : this.recipientName,
                  phone : this.recipientPhone,
                  address : this.recipientAddress,
                }
              }).then((res) => {
                if(res.data.length === 0){
                  this.$http.post('/api/insertRecipient',{
                    userId : this.$store.state.user.user_id,          
                    recipientName : this.recipientName,
                    countryCode : this.phoneCode,
                    recipientPhone : this.recipientPhone,
                    recipientIdentityCard : this.recipientIdentityCard,
                    recipientAddress : this.recipientAddress,
                    recipientState : this.recipientState,
                    recipientCity : this.recipientCity,
                    recipientZip : this.recipientZip,
                  }).then( (res) => {
                    resolve(0);
                  })
                }else{
                  resolve(0);
                }
              });              
            })
            result.push(insertRecipientResult);

            if(this.selectedItems){
              for(let kitem of this.selectedItems){
                let adminItemsResult = new Promise((resolve, reject) => {
                  //insert new
                    //update old count
                  if(kitem.item_count > 0 && kitem.item_count < kitem.total_unit){
                    this.$http.post('/api/updateAdminItemCount',{
                      update_count : -1 * kitem.item_count,
                      item_id: kitem.id,
                      third_party_packageId: kitem.third_party_packageId,
                      package_Id: res.data.insertId,
                      item_name: kitem.item_name,
                      item_count: kitem.item_count,
                      pic1_url: kitem.pic1_url,
                      pic1_name: kitem.pic1_name,
                      pic2_url: kitem.pic2_url,
                      pic2_name: kitem.pic2_name,
                      pic3_url: kitem.pic3_url,
                      pic3_name: kitem.pic3_name,
                    }).then((res) => {
                      resolve(1);
                    })
                  }else{
                    this.$http.post('/api/updateAdminReportItems',{
                      packageId : res.data.insertId,
                      id: kitem.id,
                    }).then((res) => {
                      resolve(1);
                    })
                  }                
                })
                result.push(adminItemsResult);
              }
            }
            
            for(let pkgId of this.passedInContent.selectedPackages){
              let updateThirdPartyPkgResult = new Promise((resolve, reject) => {
                this.$http.post('/api/updateThirdPartyPackageStatus',{
                  status: '已全部打包',
                  third_party_packageId : pkgId,
                  user_packageId: res.data.insertId,
                }).then( (res) => {
                  resolve(2);
                })
              })
              result.push(updateThirdPartyPkgResult);
            }
            for(let item of this.packageItem) {
              let insertPackageItemsResult = new Promise((resolve, reject) => {
                this.$http.post('/api/insertPackageItems',{
                  packageId : res.data.insertId,
                  itemType : item.model_en,
                  itemName : item.description,
                  itemPrice : parseFloat(item.unit_price),
                  itemCount : item.amount,
                  itemBrand : item.brand_en,
                }).then( (res) => {
                  resolve(3);
                })
              })
              result.push(insertPackageItemsResult);
            }
            let promiseResult = await Promise.all(result);
            this.overlay = false;
            this.snackbar = true;
            this.notification = '发货单创建成功,跳转回我的包裹';
            this.snackbarColor = 'green';
            if(this.$store.state.user.roles != 'batch move user'){
              setTimeout( () => {this.$router.push({ path: '/package/mypackage' });},2000);
            }else{
              setTimeout( () => {this.$router.push({ path: '/package/batch_mypackage' });},2000);
            }
            
          })
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

      chooseRecipient: function(item){
        this.recipientName = item.name;
        this.phoneCode = item.country_code;
        this.recipientPhone = item.phone;
        this.recipientIdentityCard = item.identity_card;
        this.recipientAddress = item.address;
        this.recipientState = item.state;
        this.recipientCity = item.city;
        this.recipientZip = item.zip;
        this.recipientId = item.id;
        this.selectRecipientDialog = false;
      },

      openRecipientDialog: function(){
        this.$http.get('/api/getRecipientsByUser',{
          params: {
						userId : this.$store.state.user.user_id,
					}
        }).then( (res) => {
          this.recipientItems = res.data;
        })
        this.selectRecipientDialog = true;
      }
    },


    mounted: function() {
      if(this.passedInContent){
        this.selectedItems = this.passedInContent.items;
        //大货，只显示包裹
        if(!this.selectedItems){
          for(let third_party_packageId of this.passedInContent.selectedPackages){
            this.$http.get('/api/getDefinedTrackingById',{
              params: {
                packageId : third_party_packageId,
              }
            }).then( (res) => {
              this.batchPackages.push(res.data[0]['user_defined_tracking']);
            })
          }
        }
      }else{
        this.snackbar = true;
        this.notification = '你还没有选择物品，清先选择一个物品';
        this.snackbarColor = 'green';
        setTimeout( () => {this.$router.push({ path: '/mypackage' });},3000);
      }
    },

    created() {
      this.passedInContent = this.$route.params._selectedContent;
    },

    watch: {
      phoneCode: function(){
        if(this.phoneCode == 'China +86')
          this.stateList = CNStates;
        else{
          this.stateList = USStates;
          this.recipientCity = '';
          if(!this.passedInContent.needSplit){   //不需要拆箱
            if(this.passedInContent.totalPrice < 500){
              this.forcast_price = 7;
            }else{
              this.forcast_price = 12;
            }
          }else{           //需要拆箱
            for(let item of this.selectedItems){
              let price = item.price * item.unit;
              if(price < 500){
                this.forcast_price = this.forcast_price + 7;
              }else{
                this.forcast_price = this.forcast_price + 12;
              }
            }
          }
        }
      },

      forcast_weight: function(){
        if(this.phoneCode == 'China +86'){
          var priceBase = 5.5;
          var priceExtra = 5.5;
          if(this.forcast_weight == 0 || this.forcast_weight == ''){
            this.forcast_price = 0;
          }else if(this.forcast_weight <= 1){
            this.forcast_price = priceBase;
          }else{
            let before = parseInt(this.forcast_weight);
            let after = this.forcast_weight.split('.')[1];
            if(!after){
              after = '0';
            }
            else if(after.length === 1){
              after = after + '0';
            }else{
              after = after.substr(0,2);
            }
            
            if(after < 10){
              this.forcast_price = priceBase * before;
            }else if(after >= 10 && after < 60){
              this.forcast_price = priceBase * before + priceBase * 0.5;
            }else{
              this.forcast_price = priceBase * (before + 1);
            }
          }
        }
      }
    }

    
  }
</script>
