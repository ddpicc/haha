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
          <div class="overline mb-4 ml-2">
            {{itemTitle()}}
          </div>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    名称
                  </th>
                  <th class="text-left">
                    品牌
                  </th>
                  <th class="text-left">
                    数量
                  </th>
                  <th class="text-left">
                    图片
                  </th>
                  <th class="text-left">
                    图片
                  </th>
                  <th class="text-left">
                    图片
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in selectedItems" :key="item.id">
                  <td><p>{{item.item_name}}</p></td>
                  <td><p>{{item.brand}}</p></td>
                  <td ><p>{{item.item_count}}件</p></td>
                  <td v-if="item.pic1_url == undefined"><v-img :src='"https://image.endlessflora.com/" + item.pic1_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,0)"></v-img></td>
                  <td v-if="item.pic2_url"><v-img :src='"https://image.endlessflora.com/" + item.pic2_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,1)"></v-img></td>
                  <td v-if="item.pic3_url"><v-img :src='"https://image.endlessflora.com/" + item.pic3_url' dark max-width="70" style="cursor: pointer;" @click="previewImg(item,2)"></v-img></td>
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
      
      <v-col cols="12" md="6" v-if="method == '发往中国'">
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
      <v-col cols="12" md="6" v-if="method == '美国境内'">
        <material-card dense fullWidth color="grey darken-1">
          <template v-slot:header>
            <div class="px-3">
              <div class="title font-weight-light mb-2">
                如果已有发货面单，请上传PDF格式的面单。如果没有，需填写收件人信息
              </div>
            </div>
          </template>
          <v-select
            v-model="inUSvendor"
            :items="inUSvendorList"
            label="服务商"
          ></v-select>
          <v-file-input
            show-size
            accept=".pdf"
            label="File input"
            v-model="chosenFile"
          ></v-file-input>
          <div>已上传 {{uploadedName}}</div>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn right @click="uploadFile">上传</v-btn>
          </v-card-actions>
        </material-card>
      </v-col>
      <v-col cols="12" md="6" v-if="method == '发往中国' || method == '美国境内'">
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
      <v-col cols="12" v-if="method == '仓库自提'">
        <material-card dense fullWidth color="grey darken-1">
          <template v-slot:header>
            <div class="px-3">
              <div class="title font-weight-light mb-2">
                自提人联系方式
              </div>
            </div>
          </template>
          <v-form
            ref="addressForm"
            v-model="valid"
            lazy-validation
          >
            <v-col cols="12" sm="12" md="6">
              <v-text-field label="姓名*" v-model="recipientName" required :rules="[v => !!v || 'Item is required']"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" md="6">
              <div> USA +1</div><v-text-field label="手机号码*" v-model="recipientPhone" :rules="[v => !!v || 'Item is required']"></v-text-field>
            </v-col>
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
      valid: true,
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
      confirmDialog: false,
      overlay: false,

      method: '',
      inUSvendor: '',
      inUSvendorList: ['UPS','USPS','FEDEX'],
      chosenFile: null,
      domain: 'https://upload-na0.qiniup.com',
    }),

    methods: {
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

        this.$http.post('/api/package/insertUserPackage',{
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
            package_type: this.method,
          }).then( async (res) => {
            //检查是否有相同的收件人，没有的话创建一个新的在数据库
            let insertRecipientResult = new Promise((resolve, reject) => {
              this.$http.get('/api/user/existRecipient',{
                params: {
                  name : this.recipientName,
                  phone : this.recipientPhone,
                  address : this.recipientAddress,
                }
              }).then((res) => {
                if(res.data.length === 0){
                  this.$http.post('/api/user/insertRecipient',{
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

            //更新包裹内物品信息
            if(this.selectedItems){
              for(let kitem of this.selectedItems){
                let updateItemsResult = new Promise((resolve, reject) => {
                  //商品的一开始清点数量记录在total_unit,item_count是用户选择发货的数量，如果没有全部打包，
                  //则应该更新本来item的数量，并创建一个新item指向这个package，orginal_itemid指向老item
                  if(kitem.item_count > 0 && kitem.item_count < kitem.total_unit){
                    this.$http.post('/api/item/createNewItemUpdateOldItem',{
                      update_count : -1 * kitem.item_count,
                      item_id: kitem.id,
                      third_party_packageId: kitem.third_party_packageId,
                      package_Id: res.data.insertId,
                      itemTemplate_Id: kitem.itemTemplate_Id,
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
                    this.$http.post('/api/item/updateItemSetPackageId',{
                      packageId : res.data.insertId,
                      id: kitem.id,
                    }).then((res) => {
                      resolve(1);
                    })
                  }                
                })
                result.push(updateItemsResult);
              }
            }
            
            //更新第三方包裹的状态
            for(let fullSelectedPackage of this.passedInContent.selectedPackages){
              let updateThirdPartyPkgResult = new Promise((resolve, reject) => {
                this.$http.post('/api/updateThirdPartyPackageStatus',{
                  status: '已全部打包',
                  third_party_packageId : fullSelectedPackage.id,
                  user_packageId: res.data.insertId,
                }).then( (res) => {
                  resolve(2);
                })
              })
              result.push(updateThirdPartyPkgResult);
            }

            //更新第三方包裹状态，对于部分打包的，只会保存最后让其达到全部打包状态的package id
            for(let partSelectedPackage of this.passedInContent.partPackages){
              let updatePartThirdPartyPkgResult = new Promise((resolve, reject) => {
                this.$http.post('/api/updateThirdPartyPackageStatus',{
                  status: '部分打包',
                  third_party_packageId : partSelectedPackage.id,
                  user_packageId: res.data.insertId,
                }).then( (res) => {
                  resolve(3);
                })
              })
              result.push(updatePartThirdPartyPkgResult);
            }

            let promiseResult = await Promise.all(result);
            this.overlay = false;
            this.snackbar = true;
            this.notification = '发货单创建成功,跳转回我的包裹';
            this.snackbarColor = 'green';
            setTimeout( () => {this.$router.push({ path: '/package/mypackage' });},2000);
            
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
      },

      itemTitle: function(){
        let str = '';
        if(this.passedInContent.selectedPackages.length > 0){
          str = str + '整个包裹: '
        }
        for(let fullSelectedPackage of this.passedInContent.selectedPackages){
          str = str +  fullSelectedPackage.tracking ;
        }

        if(this.passedInContent.partPackages.length > 0){
          str = str + '部分包裹: '
        }
        for(let partSelectedPackage of this.passedInContent.partPackages){
          str = str +  partSelectedPackage.tracking ;
        }
        if(str != ''){
          str = '(' + str + ')';
        }
        return '已选物品' + str;
      },

      uploadFile: function(){
        const config = {
          headers: {'Content-Type': 'multipart/form-data'}
        }
        //alert(this.chosenFile);
        this.$http.get('/api/qiniuToken').then(res => {
          const formData = new FormData();
          formData.append('file', this.chosenFile);
          formData.append('key', 'ds1d'); // key 文件名处理，这样的话七牛会识别文件时什么类型
          formData.append('token', res.data);
            this.$http.post(this.domain, formData, config, {

            })
        })
      },
    },


    mounted: function() {
      if(this.passedInContent){
        this.selectedItems = this.passedInContent.items;
        //合并重复的，如果有的话
        this.selectedItems = this.selectedItems.reduce((total, cur, index) => {
        　let hasValue = total.findIndex(current => { return current.id === cur.id});
        　hasValue === -1 && total.push(cur);
        　hasValue !== -1 && (total[hasValue].item_count = parseInt(total[hasValue].item_count) + parseInt(cur.item_count));
        　return total;
        }, [])
        this.method = this.passedInContent.method;
      }else{        
        this.snackbar = true;
        this.notification = '你还没有选择物品，清先选择一个物品';
        this.snackbarColor = 'green';
        setTimeout( () => {this.$router.push({ path: '/package/mypackage' });},3000);
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
