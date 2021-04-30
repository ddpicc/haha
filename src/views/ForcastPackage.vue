<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
          <div class="overline d-inline-flex">
            发货单信息
          </div>
          <v-form
            ref="packageInfoForm"
            v-model="valid"
            lazy-validation
          >
						<v-row>
							<v-col
								cols="12"
								md="6"
							>
								<v-text-field
									v-model="package_description"
									label="发货单号 (您自编的方便识别的包裹名称)"
									:rules="requiredRule"
                  @focus="focus($event)"
								></v-text-field>
							</v-col>
							<v-col
								cols="12"
								md="6"
							>
								<v-text-field
									v-model="package_comment"
									label="包裹备注"
                  @focus="focus($event)"
								></v-text-field>
							</v-col>
							<v-col
								cols="12"
								md="6"
							>
								<v-text-field
									v-model="forcast_weight"
									label="预估重量(lb)"
                  @focus="focus($event)"
								></v-text-field>
							</v-col>
							<v-col
								cols="12"
								md="6"
							>
								<v-text-field
									v-model="forcast_total"
									label="总价值(USD)"
                  @focus="focus($event)"
								></v-text-field>
							</v-col>
						</v-row>
					</v-form>
				</material-card>
			</v-col>
			<v-col cols="12">
        <material-card>
          <div class="overline d-inline-flex">
            智能解析
          </div>
					<v-text-field
						solo
						label="智能识别地址信息(当前仅支持中国地址)"
						v-model="regAddress"
					></v-text-field>
					<v-col cols="12" class="d-inline-flex justify-end">
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="parseAddress">开始解析</v-btn>
					</v-col>
        </material-card>
			</v-col>
			<v-col cols="12">
        <material-card>
          <div class="overline d-inline-flex">
            地址信息
            <v-chip
              class="ml-8"
              @click="openRecipientDialog"
            >
              <v-icon left>
                mdi-account-group
              </v-icon>
              选择收件人
            </v-chip>
          </div>
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
				</material-card>
			</v-col>
			<v-col cols="12">
        <material-card>
          <div class="overline d-inline-flex">
            内件明细
          </div>
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
                
                <v-col cols="12" md="4">
                  <div class="d-flex  mb-6">
                    <v-btn color="blue" dark class="mr-2" @click="addItem">确认</v-btn>
                    <v-btn color="blue" dark class="mr-2" @click="clearItem">取消</v-btn>
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
		</v-row>
    <div class="text-center pt-2">
      <v-btn block color="blue" dark class="mr-2" @click="openConfirmDialog">生成转运单</v-btn>
    </div>
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
  import {USStates, CNStates, getNowFormatDate, littleantTracking} from '../utils/helpFunction'
  import AddressParse from 'zh-address-parse'
	export default {
    data: () => ({
			package_description: '',
			package_comment: '',
			forcast_weight: '',
			forcast_total: 0,
      regAddress: '',
      valid: false,
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
      itemType: '',
      itemTypeList: ['鞋类','奶粉','保健品','零食','日用品','衣服','玩具','化妆品','箱包','电子产品','手表'],
      itemName: '',
      itemPrice: '',
      itemCount: '',
      itemBrand: '',
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
      selectRecipientDialog: false,
      overlay: false,
      requiredRule: [
          v => !!v || 'Item is required',
      ]
		}),

		methods: {
      focus(event) {
        event.currentTarget.select();
			},

      parseAddress: function(){
        let id_cardArray = this.regAddress.match(/(\d{15}$)|(\d{18}$)|(\d{17}(\d|X|x)$)/g);
        alert(id_cardArray);
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

      addItem: function(){
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

      clearItem: function(){
        this.$refs.itemForm.reset();
        this.inputItem = false;
      },

      deleteItem: function(item){
        var index = this.packageItem.indexOf(item);
        this.packageItem.splice(index, 1);
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

      openConfirmDialog: function(){
        //verify package info is not empty
        if(!this.$refs.packageInfoForm.validate()){
          alert('请填写发货单信息');
          return;
        }

        //verify address is not empty
        if(!this.$refs.addressForm.validate()){
          alert('请填写收件人信息');
          return;
        }

        //verify item is typed in        
        if(this.packageItem.length == 0){
          alert('请先申报物品');
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
        this.package_description = this.$store.state.user.storage_number + '|' + this.package_description;

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
                  resolve(1);
                })
              })
              result.push(insertPackageItemsResult);
            }
            let promiseResult = await Promise.all(result);
            this.overlay = false;
            this.snackbar = true;
            this.notification = '发货单创建成功,跳转回我的包裹';
            this.snackbarColor = 'green';
            setTimeout( () => {this.$router.push({ path: '/package/mypackage' });},2000);
          })
      },
    },

    mounted: function() {
      if(this.$store.state.user.balance < 3){
        alert('您的账户余额不足，请确保在包裹被处理时有足够的余额');
      }
    },
    
    watch: {
      phoneCode: function(){
        if(this.phoneCode == 'China +86')
          this.stateList = CNStates;
        else{
          this.stateList = USStates;
          this.recipientCity = '';
        }
      }
    }
	}
</script>