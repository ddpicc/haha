<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>          
          <div class="overline mb-4">包裹信息</div>
          <h3 style="display: inline">小蚂蚁单号：{{selectedPackage.litlleant_tracking_number}}</h3>
          <v-btn
            small
            plain
            @click="printBarcode()"
          >
            打印
          </v-btn>
          <tr>
            <td>类型: {{selectedPackage.package_type}}</td>
          </tr>
          <tr>
            <td>包裹描述：{{selectedPackage.package_description}}</td>
          </tr>
          <tr>
            <td>包裹备注: {{selectedPackage.package_comment}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
          </tr>
          <tr>
            <td>创建于: {{selectedPackage.created_at}}</td>
            <td>第三方单号: {{trdPartyTrackingList}}</td>
          </tr>
          <tr>
            <td>仓位号: {{selectedPackage.storage_number}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
            <td>账户余额: {{selectedPackage.balance}}美元</td>
          </tr>
          <br>
          <div>
            <h3>收件人信息 </h3>
            <tr>
              <td>收件人: {{selectedPackage.to_name}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
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
            :items="packageItemList"
            hide-default-footer
          >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col v-if="itemList.length" cols="12">
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
			<v-col v-if="selectedPackage.package_type == '发往中国'" cols="12">
        <v-stepper
          v-model="eStepper"
          vertical
        >
          <v-stepper-step
            step="1"
            :complete="eStepper > 1"
          >
            分配渠道
            <span v-if="showVendor" style="color: blue">预分配渠道： {{vendor}}</span>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card
              class="mx-auto"
              rounded
            >
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="assignVendor()"
              >
                <v-icon left>
                  mdi-card-plus
                </v-icon>
                完成分配渠道
              </v-chip>
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="openErrorDialog()"
              >
                <v-icon left>
                  mdi-card-plus
                </v-icon>
                遇到错误，暂不处理此包裹
              </v-chip>

              <v-select
                class="ma-4"
                outlined
                dense
                v-model="vendor"
                :items="vendorList"
                label="渠道"
              ></v-select>
            </v-card>
          </v-stepper-content>
          <v-stepper-step
            step="2"
            :complete="eStepper > 2"
          >
            计费
            <span v-if="showRate" style="color: blue">预分配费率： {{rate}}</span>
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card
              class="mx-auto"
              rounded
            >
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="assignRate()"
                
              >
                <v-icon left>
                  mdi-card-plus
                </v-icon>
                确定计费
              </v-chip>
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="goBack(2)"
                
              >
                <v-icon left>
                  mdi-card-minus
                </v-icon>
                返回上一步
              </v-chip>

              <v-select
                class="ma-4"
                outlined
                dense
                v-model="rate"
                :items="rateList"
                label="费率"
              ></v-select>
              <v-row>
                <v-col cols="8">
                  <v-select
                    class="ml-4"
                    outlined
                    dense
                    v-model="extraCharge"
                    :items="extraChargeList"
                    label="额外收费"
                  ></v-select>
                </v-col>
                <v-col cols="2" class="d-flex justify-end">
                  <div class="text--primary pt-2">份数 ：</div>
                </v-col>
                <v-col cols="2">
                  <v-text-field
                    dense
                    v-model="extraChargeCount"
                    :max="20"
                    :min="0"
                    class="mr-4"
                    type="number"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card>
          </v-stepper-content>
          <v-stepper-step
              step="3"
              :complete="eStepper > 3"
            >
              打包本地发货单
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="pack()"
                
              >
                <v-icon left>
                  mdi-card-plus
                </v-icon>
                打包
              </v-chip>
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="goBack(3)"
                
              >
                <v-icon left>
                  mdi-card-minus
                </v-icon>
                返回上一步
              </v-chip>
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="openErrorDialog()"
              >
                <v-icon left>
                  mdi-card-plus
                </v-icon>
                遇到错误，暂不处理此包裹
              </v-chip>
              <v-row>
                <v-col cols="6">
                  <v-card
                    class="mx-auto"
                    rounded
                  >
                    <v-data-table
                      show-select
                      :single-select="false"
                      v-model="selected"
                      :headers="headers"
                      :items="itemsWaitForPacking"
                      item-key="id"
                      no-data-text="当前还未申报物品"
                      hide-default-footer
                    >
                      <template v-slot:item.action="{ item }">
                        <v-btn
                          v-if="item.item_count > 1"
                          small
                          class="ml-2"
                          @click="splitItems(item)"
                        >
                          分拆
                        </v-btn>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
                <v-col cols="6">
                  <v-card
                    class="mx-auto"
                    rounded
                  >
                    <v-data-table
                      :headers="packedHeader"
                      :items="packedItemList"
                      item-key="itemName"
                      no-data-text="请在左侧列表选择要打包的物品"
                      hide-default-footer
                    >
                      <template v-slot:item.action="{ item }">
                        <v-btn
                          v-if="item.weight != '无'"
                          small
                          @click="returnItem(item)"
                        >
                          退回
                        </v-btn>
                      </template>
                      <template v-slot:item.vendorTracking="{ item }">
                        <v-text-field
                          ref="mark2"
                          :disabled="trackingDisabled(item)"
                          dense
                          v-model="item.vendorTracking"
                          @focus="focus($event)"
                        ></v-text-field>
                      </template>
                    </v-data-table>
                  </v-card>
                </v-col>
              </v-row>
              <v-btn
                v-if="isFinished()"
                block
                @click="processFinished"
              >
                <v-icon color="blue">
                  mdi-check
                </v-icon>
                <span style="color:#3399ff;">打包完成</span>
              </v-btn>
            </v-stepper-content>
        
         <v-stepper-step
            step="4"
            :complete="eStepper > 4"
          >
            打印单号
          </v-stepper-step>
          <v-stepper-content step="4">
            <v-card
              class="mx-auto"
              rounded
            >
              <tr v-for="(item,i) in littleant_trackingList">
                <td>{{item}}</td>
                <td>
                  <v-btn
                    small
                    plain
                    @click="printBarcode(item)"
                  >
                    打印
                  </v-btn>
                </td>
              </tr>
              <td v-show="false"><div ref="print"><svg style="height: 80px" id="barcode"></svg></div></td>
            </v-card>
            <v-btn
              block
              @click="finishAndClose"
            >
              <v-icon color="blue">
                mdi-check
              </v-icon>
              <span style="color:#3399ff;">关闭窗口</span>
            </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-col>
      <v-col v-if="selectedPackage.package_type == '美国境内'" cols="12">
        <material-card>
          <v-form
            ref="adminForm"
            v-model="valid"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="inUSVendorTracking"
                    label="服务商单号"
                  ></v-text-field>   
                </v-col>
                <v-col cols="6">    
                  <v-select
                    v-model="inUSvendor"
                    :items="inUSvendorList"
                    label="服务商"
                  ></v-select>
                </v-col>
                <v-col cols="6">    
                  <v-text-field
                    v-model="inUSactualWeight"
                    label="实际重量"
                    suffix="lbs"
                    @focus="focus($event)"
                  ></v-text-field>
                </v-col>                
                <v-col cols="6">      
                  <v-text-field
                    v-model="inUSchargePrice"
                    label="实际运费"
                    suffix="美元"
                    @focus="focus($event)"
                  ></v-text-field> 
                </v-col>
                <v-btn
                  v-if="checkUSFinished()"
                  block
                  @click="finishUSPackage()"
                >
                  <v-icon color="blue">
                    mdi-check
                  </v-icon>
                  <span style="color:#3399ff;">打包完成</span>
                </v-btn>
              </v-row>
            </v-container>
          </v-form>
        </material-card>
      </v-col>
      <v-col v-if="selectedPackage.package_type == '仓库自提'" cols="12">
        <v-stepper
          v-model="eStepper"
          vertical
        >
          <v-stepper-step
            step="1"
            :complete="eStepper > 1"
          >
            按内件物品打包
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-chip
              class="mb-4 ml-2"
              outlined
              small
              @click="packageComplete()"
            >
              <v-icon left>
                mdi-check
              </v-icon>
              打包完成
            </v-chip>
          </v-stepper-content>
          <v-stepper-step
            step="2"
            :complete="eStepper > 2"
          >
            打印清单
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card
              class="mx-auto"
              rounded
            >
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="assignRate()"
              >
                <v-icon left>
                  mdi-check
                </v-icon>
                打印
              </v-chip>
              <v-chip
                class="mb-4 ml-2"
                outlined
                small
                @click="goBack(2)"
                
              >
                <v-icon left>
                  mdi-card-minus
                </v-icon>
                返回上一步
              </v-chip>
            </v-card>
            <v-btn
                block
                @click="processFinished"
              >
                <v-icon color="blue">
                  mdi-check
                </v-icon>
                <span style="color:#3399ff;">打包完成</span>
              </v-btn>
          </v-stepper-content>
        </v-stepper>
      </v-col>
    </v-row>
    <v-dialog v-model="getWeightDialog" persistent max-width="400px">
      <v-card
        class="mx-auto"
        rounded
      >
        <div class="title ml-2">
          手工填写称重
        </div>
        <v-text-field
          outlined
          autofocus
          @focus="focus($event)"
          v-model="weight"
          label="重量/lb"
          class="ma-4"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="confirmWeight"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="splitItemDialog" persistent max-width="400px">
      <v-card
        class="mx-auto"
        rounded
      >
        <div class="title ml-2">
          填写分拆数量
        </div>
        <v-text-field
          outlined
          autofocus
          @focus="focus($event)"
          v-model="splitAmount"
          label="数量"
          class="ma-4"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="confirmAmount"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="errorDialog" max-width="400px">
      <v-card
        class="mx-auto"
        rounded
      >
        <div class="title ml-2">
          遇到错误，暂不处理此包裹
        </div>
        <v-select
          class="ma-4"
          outlined
          dense
          v-model="errorInfo"
          :items="errorList"
        ></v-select>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="confirmError"
          >
            确认
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
  </v-container>
</template>

<script>
  import {getNowTimeFormatDate, getNowFormatDate} from '../../utils/helpFunction';
  import jsbarcode from 'jsbarcode'

  export default {
    data: () => ({
      valid: true,
      selectedPackage: {},
      selectedPackageId: '',
      packageItemList: [],
      itemsWaitForPacking: [],
      backupItemsWaitForPacking: [],
      overlay: false,
      eStepper: 1,

      errorDialog: false,
      errorInfo: '',
      errorList: ['身份证有误','余额不足','收件人信息有误','申报信息有误'],
      
      vendorList: ['新元快递','TST速运通','青岛中通','沈阳圆通'],
      vendor: '',
      showVendor: false,

			rateList: [],
			rate: '',
      showRate: false,

      extraChargeList: ['加固打包2美元', '手表额外收取，每份5美元'],
      extraCharge: '',
      extraChargeCount: 1,

      selected: [],

      snackbar: false,
      snackbarColor: '',
      notification: '',

      headers: [
        {
          sortable: false,
          text: 'UPC码',
          value: 'barcode'
        },
        {
          sortable: false,
          text: '物品描述',
          value: 'item_name'
        },
        {
          sortable: false,
          text: '单价',
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
        {
          sortable: false,
          text: '操作',
          value: 'action',
        }
      ],

      packedHeader: [
        {
          sortable: false,
          text: '快递单号',
          width: "30%",
          value: 'vendorTracking'
        },
        {
          sortable: false,
          text: '重量',
          width: "10%",
          value: 'weight',
        },
        {
          sortable: true,
          text: '货物详细信息',
          width: "50%",
          value: 'description',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        }
      ],
      packedItemList: [],
      isPackAll: false,
      vendorTracking: '',
      splitOutItem: {},
      splitTime: 0,

      //进阶用户管理员上传的商品
      itemList: [],
      trdPartyTrackingList: [],
      allPackedList: [],

      splitItemDialog: false,
      splitAmount: 0,
      splitIndex: -1,

      getWeightDialog: false,
      weight: 0,

      totalWeight: 0,
      totalPrice: 0,
      
      littleant_trackingList: [],
      inUSVendorTracking: '',
      inUSvendor: '',
      inUSvendorList: ['UPS','USPS','FEDEX'],
      inUSactualWeight: 0,
      inUSchargePrice: '',
      inboundRate: 0,
      userBalance: -1,
    }),

    methods: {
      focus(event) {
        event.currentTarget.select();
      },

      printBarcode: function(item){
        jsbarcode(
          '#barcode',
          item,
          {
            displayValue: true // 是否在条形码下方显示文字
          }
        )
        this.$print(this.$refs.print);
      },

      assignVendor: function(){
        //余额不足3美元无法分配
        if(this.selectedPackage.balance < 3){
          this.snackbar = true;
          this.notification = '该用户余额不足';
          this.snackbarColor = 'red';
          return;
        }
        if(!this.vendor){
          this.snackbar = true;
          this.notification = '选择一个渠道';
          this.snackbarColor = 'red';
          return;
        }
        this.eStepper = 2;
        this.showVendor = true;
      },

      assignRate: function(){
        if(!this.rate){
          this.snackbar = true;
          this.notification = '选择费率';
          this.snackbarColor = 'red';
          return;
        }
        this.showRate = true;
        this.eStepper = 3;
      },

      openErrorDialog: function(){
        this.errorInfo = '';
        this.errorDialog = true;
      },

      confirmError: function(){
        this.$http.post('/api/setAdminComment',{
          admin_comment: this.errorInfo,
          packageId: this.selectedPackageId,
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '即将关闭窗口';
          this.snackbarColor = 'green';
          setTimeout( () => {this.closeWindow();},2000);
        })
      },

      goBack: function(step){
        if(step == 2){
          this.eStepper = 1;
        }else if(step == 3){
          this.eStepper = 2;
        }
      },

      pack: function(){
        this.getWeightDialog = true;
      },

      splitItems: function(item){
        this.splitTime = this.splitTime + 1;
        this.splitItemDialog = true;
        this.splitOutItem = {
          id: item.id + 'temp' + this.splitTime,
          package_Id : this.selectedPackageId,
          barcode: item.barcode,
          itemTemplate_Id: item.itemTemplate_Id,
          type : item.type,
          item_name : item.item_name,
          price : item.price,
          item_count : 0,
          brand : item.brand,
        }      

        this.splitIndex = this.itemsWaitForPacking.indexOf(item);
      },

      confirmAmount: function(){
        if(this.splitAmount == 0 || this.splitAmount > this.itemsWaitForPacking[this.splitIndex].item_count - 1){
          alert('分拆数量不合法');
          return;
        }
        this.splitItemDialog = false;
        
        //alert(JSON.stringify(this.packageItemList[this.splitIndex]));
        let changeUnit = this.itemsWaitForPacking[this.splitIndex].item_count - this.splitAmount;
        this.itemsWaitForPacking[this.splitIndex].item_count = changeUnit;
        this.backupItemsWaitForPacking[this.splitIndex].item_count = changeUnit;
        this.splitOutItem.item_count = this.splitAmount;
        this.itemsWaitForPacking.splice(this.splitIndex,0,this.splitOutItem);
        this.backupItemsWaitForPacking.splice(this.splitIndex,0,this.splitOutItem);
        this.splitAmount = 0;
        
        this.splitIndex = -1;
      },


      returnItem: function(item){
        const index = this.packedItemList.findIndex(text => text.includeId === item.includeId);
        this.packedItemList.splice(index, 1);
        for(let str of item.includeId){
          //str是对应的id，拿id去搜索原始拆分过的item
          var beforePackItem = this.backupItemsWaitForPacking.find(function(p){
            return p.id === str;
          })
          if(typeof(beforePackItem) != 'undefined'){
            //找到拆分之后的原始item之后，添加回itemsWaitForPacking
            this.itemsWaitForPacking.push(beforePackItem);
          }
        }
      },

      trackingDisabled: function(item){
        if(item.weight == '无'){
          return true;
        }else
          return false;
      },
      
      confirmWeight: function(){
        this.getWeightDialog = false;
        let description = '';
        let includeId = [];
        for(let item of this.selected){
          let deleteIndex = this.itemsWaitForPacking.indexOf(item);
          this.itemsWaitForPacking.splice(deleteIndex,1);
          description = description + item.brand + ' ' + item.item_name + ' ' + item.item_count + ';';
          includeId.push(item.id);
        }
        this.packedItemList.push({
          includeId: includeId,
          weight: this.weight,
          description: description,
        })
        this.selected = [];
      },

      isFinished: function(){
        if(this.itemsWaitForPacking.length === 0)
          return true;
        else
          return false;
      },

      checkUSFinished: function(){
        //检查账户余额

        if(this.selectedPackage.to_country_code == 'USA +1'){
          if(this.inUSVendorTracking != '' && this.inUSvendor != '' && this.inUSchargePrice != ''){
            return true;
          }
        }else{
          return false;
        }
      },

      finishUSPackage: async function(){
        this.confirmDialog = false;
        this.overlay = true;
        let result = [];
        //生成child order
        let insertChildOrderResult = new Promise((resolve, reject) => {
          this.$http.post('/api/package/insertUSChildOrder',{
            litlleant_package_id: this.selectedPackageId,
            litlleant_package_number: this.selectedPackage.litlleant_tracking_number,
            vendor: this.inUSvendor,
            weight: this.inUSactualWeight,
            vendor_tracking_number: this.inUSVendorTracking,
          }).then( (res) => {
            for(let item of this.packageItemList){
              this.$http.post('/api/item/updateReportItemWithChildOrder',{
                childPackage_Id: res.data.insertId,
                id: item.id,
                item_count: item.item_count,
              }).then( (resk) => {
                resolve(str);
              })
            }
          })
        })
        result.push(insertChildOrderResult);

        //charge运费
        let chargeAmount = Math.floor(this.inUSchargePrice * (100 + parseFloat(this.inboundRate))) / 100 + 8;        
        let chargeResult = new Promise((resolve, reject) => {
          this.$http.post('/api/manualCharge',{
            trackingNm: this.selectedPackage.litlleant_tracking_number,
            chargeAmount: -1 * chargeAmount,
            prev_balance: this.selectedPackage.balance,
            comment: '发货时自动扣费',
            storage_number : this.selectedPackage.storage_number,
            type: '运费',
            created_at: getNowFormatDate(),
          }).then( (res) => {
            resolve(20);
          })
        })
        result.push(chargeResult);

        //更新tla package信息
        let updateTlaPackageResult = new Promise((resolve, reject) => {
          this.$http.post('/api/setPackageWeightandStatus',{
            status: '已处理',
            total_weight: this.inUSactualWeight? this.inUSactualWeight : 0 ,
            finishprocess_time: getNowTimeFormatDate(),
            total_price: chargeAmount,
            packageId: this.selectedPackage.id,
          }).then( (res) => {
            resolve(21);
          })
        })
        result.push(updateTlaPackageResult);
        let promiseResult = await Promise.all(result);
        this.overlay = false;
        this.snackbar = true;
        this.notification = '处理成功';
        this.snackbarColor = 'green';
        setTimeout( () => {
          var userAgent = navigator.userAgent;
          if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
              window.location.href="about:blank";
              window.close();
          }
        },2000);

      },

      getChargeWeight: function(weight){
        let chargeWeight = 0;
        if(weight <= 1){
          chargeWeight = 1;
        }else{
          let before = parseInt(weight);
          let after = weight.split('.')[1];
          if(!after){
            after = '0';
          }
          else if(after.length === 1){
            after = after + '0';
          }else{
            after = after.substr(0,2);
          }
          
          if(after < 10){
            chargeWeight =  before;
          }else if(after >= 10 && after < 60){
            chargeWeight =  before + 0.5;
          }else{
            chargeWeight =  before + 1;
          }
        }
        return chargeWeight;
      },


      processFinished: async function(){
        this.overlay = true;
        let result = [];
        //获取rate
        var _rate = this.rate.match(/\d+(.\d+)?/g)[0];
        var _totalWeight = 0;
        var _totalPrice = 0;
        //获取extra charge
        if(this.extraCharge != ''){
          var _extraCharge = this.extraCharge.match(/\d+(.\d+)?/g)[0];
          var _totalExtraCharge = _extraCharge * this.extraChargeCount;
        }else{
          var _totalExtraCharge = 0;
        }

        for(let item of this.packedItemList){
          
          _totalWeight = _totalWeight + parseFloat(item.weight);
        }
        _totalWeight = _totalWeight.toFixed(2);
        _totalPrice = (parseFloat((this.getChargeWeight(_totalWeight) * _rate).toFixed(2)) + _totalExtraCharge).toFixed(2);


        if(this.selectedPackage.balance < _totalPrice){
          this.snackbar = true;
          this.notification = '该用户余额不足';
          this.snackbarColor = 'red';
          this.overlay = false;
          return;
        }
        
        //生成child order
        let index = 0;
        let childOrderDescription = '全部打包';
        let litlleant_package_number = this.selectedPackage.litlleant_tracking_number;
        for(let item of this.packedItemList){
          index = index + 1;
          if(this.packedItemList.length > 1){
            childOrderDescription = '分拆包裹';
            litlleant_package_number = this.selectedPackage.litlleant_tracking_number + index;
          }

          let insertChildOrderResult = new Promise((resolve, reject) => {
            //第一步，添加child order
            this.$http.post('/api/package/insertChildOrder',{
              litlleant_package_id: this.selectedPackageId,
              litlleant_package_number: litlleant_package_number,
              vendor: this.vendor,
              weight: item.weight,
              report_item_description: childOrderDescription,
            }).then( (res) => {
              for(let str of item.includeId){
                //str是对应的id，拿id去搜索原始拆分过的item
                var beforePackItem = this.backupItemsWaitForPacking.find(function(p){
                  return p.id === str;
                })
                if(typeof(beforePackItem) != 'undefined'){
                  //找到拆分之后的原始item之后，如果id不带temp，就可以直接更新count；如果带temp，则新添加item
                  if(str.toString().indexOf('temp') == -1){
                    this.$http.post('/api/item/updateReportItemWithChildOrder',{
                      childPackage_Id: res.data.insertId,
                      id: str,
                      item_count: beforePackItem.item_count,
                    }).then( (resk) => {
                      resolve(str);
                    })
                  }else{
                    this.$http.post('/api/item/copyItemInsertChildPackageId',{
                      packageId : this.selectedPackageId,
                      childPackageId: res.data.insertId,
                      itemTemplate_Id : beforePackItem.itemTemplate_Id,
                      item_count : beforePackItem.item_count,
                    }).then( (resk) => {
                      resolve(str);
                    })
                  }
                }
              }
            })
          })
          result.push(insertChildOrderResult);
          this.totalWeight = this.totalWeight + parseFloat(item.weight);
          this.littleant_trackingList.push(litlleant_package_number);
        }
        this.totalWeight = this.totalWeight.toFixed(2);
        this.totalPrice = (parseFloat((this.getChargeWeight(this.totalWeight) * _rate).toFixed(2)) + _totalExtraCharge).toFixed(2);

        //charge运费
        let chargeResult = new Promise((resolve, reject) => {
          this.$http.post('/api/manualCharge',{
            trackingNm: this.selectedPackage.litlleant_tracking_number,
            chargeAmount: -1 * this.totalPrice,
            prev_balance: this.selectedPackage.balance,
            comment: '发货时自动扣费',
            storage_number : this.selectedPackage.storage_number,
            type: '运费',
            created_at: getNowFormatDate(),
          }).then( (res) => {
            resolve(20);
          })
        })
        result.push(chargeResult);

        //更新tla package信息
        let updateTlaPackageResult = new Promise((resolve, reject) => {
          this.$http.post('/api/package/setPackageWeightandStatus',{
            status: '已处理',
            total_weight: this.totalWeight,
            finishprocess_time: getNowTimeFormatDate(),
            total_price: this.totalPrice,
            packageId: this.selectedPackageId,
          }).then( (res) => {
            resolve(21);
          })
        })
        result.push(updateTlaPackageResult);
        let promiseResult = await Promise.all(result);
        this.overlay = false;
        this.eStepper = 4;
      },

      closeWindow: function(){
        var userAgent = navigator.userAgent;
        if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
            window.location.href="about:blank";
            window.close();
        }
      },

      finishAndClose: function(){
        this.snackbar = true;
        this.notification = '处理成功,即将关闭窗口';
        this.snackbarColor = 'green';
        setTimeout( () => {this.closeWindow();},1000);
      },

      packageComplete: function(){
        //检查账户余额
        //获取rate
        var _rate = this.rate.match(/\d+(.\d+)?/g)[0];
        var _totalWeight = 0;
        var _totalPrice = 0;
        //获取extra charge
        if(this.extraCharge != ''){
          var _extraCharge = this.extraCharge.match(/\d+(.\d+)?/g)[0];
          var _totalExtraCharge = _extraCharge * this.extraChargeCount;
        }else{
          var _totalExtraCharge = 0;
        }
        
        for(let item of this.packedItemList){
          _totalWeight = _totalWeight + parseFloat(item.weight);
        }
        _totalWeight = _totalWeight.toFixed(2);
        _totalPrice = (parseFloat((this.getChargeWeight(_totalWeight) * _rate).toFixed(2)) + _totalExtraCharge).toFixed(2);

        if(this.selectedPackage.balance < _totalPrice){
          this.snackbar = true;
          this.notification = '该用户余额不足';
          this.snackbarColor = 'red';
          return;
        }

        this.eStepper = 2;
      },

      getAll: function(){
        if(this.selectedPackageId){
          this.$http.get('/api/getPackageInfoById',{
            params: {
              packageId : this.selectedPackageId,
            }
          }).then( (res) => {
            this.selectedPackage = res.data[0];
            if(this.selectedPackage.finishprocess_time != null){
              alert('当前包裹已经处理过了，请返回检查并刷新页面');
              return;
            }

            //get user rate
            this.$http.get('/api/getUserRateByStorageNm',{
              params: {
                storage_number : this.selectedPackage.storage_number,
              }
            }).then( (res) => {
              let rateTable = res.data[0];
              this.rateList.push('A类 ' + rateTable.classA_rate + '美元/lb');
              this.rateList.push('B类 ' + rateTable.classB_rate + '美元/lb');
              this.rateList.push('C类 ' + rateTable.classC_rate + '美元/lb');
              this.rateList.push('D类 ' + rateTable.classD_rate + '美元/lb');
              this.inboundRate = rateTable.inbound_rate;
              this.userBalance = rateTable.balance;
            })

            this.$http.get('/api/item/getItemsByPackageId',{
              params: {
                packageId : this.selectedPackageId,
              }
            }).then( (resk) => {
              this.packageItemList = resk.data;
              this.itemsWaitForPacking = JSON.parse(JSON.stringify(this.packageItemList));
              this.backupItemsWaitForPacking = JSON.parse(JSON.stringify(this.packageItemList));
              if(this.packageItemList.length != 0){
                for(let item of this.packageItemList){
                  this.$http.get('/api/package/getTrackingByThirdPartyPackageId',{
                    params: {
                      packageId : item.third_party_packageId,
                    }
                  }).then( (res) => {
                    this.trdPartyTrackingList.push(res.data[0].tracking);
                  })
                }
              }
            })
          })
        }else{
          this.$router.push({ path: '/package/mypackage' });
        }

        
      },

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

