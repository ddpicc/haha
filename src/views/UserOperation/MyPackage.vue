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
          <v-toolbar
						color="blue"
						dark
						flat
					>
						<v-text-field
              solo-inverted
              flat
              hide-details
              label="Search"
              clearable
              v-model="searchStr"
              prepend-inner-icon="mdi-magnify"
              @click:prepend-inner="filterSearch"
              @keyup.enter.native="filterSearch"
            ></v-text-field>
            <v-spacer></v-spacer>

            <v-btn text @click="selectSendMethod()">发货</v-btn>

						<template v-slot:extension>
							<v-tabs
								v-model="tab"
								fixed-tabs
							>
								<v-tabs-slider color="black"></v-tabs-slider>

								<v-tab>
									已入库包裹
								</v-tab>
								<v-tab>
									待处理包裹
								</v-tab>
                <v-tab>
									已打包包裹
								</v-tab>
							</v-tabs>
						</template>
					</v-toolbar>

					<v-tabs-items v-model="tab">
						<v-tab-item class='mt-6 mb-2'>
              <v-row>
                <v-col 
                  v-for="myPackage in thirdPartyPackageList"
                  :key="myPackage.id"
                  cols="12"
                  lg="6"
                >
                  <v-card>
                    <div v-if="ifPassDateLimit" class="overline red--text ml-4">已超过最长仓储时间45天</div>
                    <v-expansion-panels>
                      <v-expansion-panel>
                        <v-expansion-panel-header>
                          {{myPackage.tracking}}
                          <v-spacer></v-spacer>
                          入库: {{myPackage.in_store_date}}
                        </v-expansion-panel-header>
                        <v-expansion-panel-content>

                          <v-data-table
                            dense
                            v-model="selected"
                            :headers="itemHeaders"
                            :items="myPackage.items"
                            hide-default-footer
                            item-key="split_time"
                            show-select
                            class="elevation-1"
                          >
                            <template v-slot:item.action="{ item }">
                              <v-tooltip v-if="item.item_count > 1" bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                    small
                                    v-bind="attrs"
                                    v-on="on"
                                    @click="splitItems(myPackage, item)"
                                  >
                                    mdi-shuffle
                                  </v-icon>
                                </template>
                                <span>分拆物品</span>
                              </v-tooltip>
                              <v-tooltip bottom>
                                <template v-slot:activator="{ on, attrs }">
                                  <v-icon
                                    small
                                    v-bind="attrs"
                                    v-on="on"
                                    class="ml-2"
                                    @click="gotoPackageInfo(item)"
                                  >
                                    mdi-image
                                  </v-icon>
                                </template>
                                <span>显示图片</span>
                              </v-tooltip>
                            </template>
                          </v-data-table>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item class='mt-6 mb-2'>
              <v-row>
                <v-col 
                  v-for="waitPackage in waitPackageList"
                  :key="waitPackage.id"
                  cols="12"
                  lg="6"
                >
                  <v-card class="mx-auto" outlined>
                    <v-row>
                      <v-col cols="5" class="mt-3">
                        <span class="ml-6">
                          {{waitPackage.litlleant_tracking_number}}
                          <span v-if="waitPackage.package_type == '大货'">(大货)</span>
                        </span>
                      </v-col>
                      <v-col cols="3" class="mt-3">
                        <span>{{waitPackage.created_at}}</span>
                      </v-col>
                      <v-col cols="4">
                        <v-btn
                          class="ml-8"
                          @click="jumpToPackageDetail(waitPackage.id)"
                          text
                        >
                          详情
                        </v-btn>              
                      </v-col>
                      <v-col cols="12" class="ml-6 text-caption">
                        <tr v-if="waitPackage.admin_comment">
                          <td style="color: red">{{waitPackage.admin_comment}}</td>
                          <td>
                            <v-chip
                              class="ml-4"
                              outlined
                              small
                              @click="clearError(waitPackage)"
                            >
                              <v-icon left>
                                mdi-card-plus
                              </v-icon>
                              错误已处理
                            </v-chip>
                          </td>
                        </tr>
                        <tr v-if="waitPackage.total_weight">
                          <td>重量: {{waitPackage.total_weight}} lb &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>运费: {{waitPackage.total_price}} 美元</td>
                        </tr>
                        <tr>
                          <td >收件人: {{waitPackage.to_name}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                          <td>地址: {{waitPackage.to_state}}&nbsp;&nbsp;{{waitPackage.to_city}}&nbsp;&nbsp;{{waitPackage.to_address}}</td>            
                        </tr>               
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>
              </v-row>
            </v-tab-item>
            <v-tab-item class='mt-6 mb-2'>
              <v-data-table
                dense
                :headers="headers"
                :items="packedPackageList"
                item-key="id"
                :items-per-page="15"
                :search="searchStr"
                :custom-filter="filterText"
                show-expand
                single-expand
                :expanded.sync="expanded"
              >
              <template v-slot:top>
                <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
              </template>
              <template v-slot:item.action="{ item }">
                <v-icon
                  small
                  class="mr-2"
                  @click="gotoPackageInfo(item)"
                >
                  mdi-pencil
                </v-icon>
              </template>
              <template v-slot:expanded-item="{ item }">
                <td :colspan="3">
                  <h5>收件人： {{item.to_name}}</h5>
                </td>
                <td :colspan="3">
                  <h5>电话: {{item.to_country_code}} {{item.to_phone}}</h5>
                </td>
                <td :colspan="4">
                  <h5>地址: {{item.to_state}}&nbsp;&nbsp;{{item.to_city}}&nbsp;&nbsp;{{item.to_address}}</h5>
                </td>
              </template>
              </v-data-table>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-col>          
    </v-row>
    <v-dialog v-model="splitItemDialog" max-width="400px">
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
    <v-dialog v-model="sentMethodDialog" max-width="600px">
      <v-card
        class="mx-auto"
        rounded
      >
        <v-card-title class="text-h5 grey lighten-2">
          选择发货方式
        </v-card-title>
        <v-card-text>
          <v-select
            class='mt-8'
            :items="sendoutMethodList"
            v-model="sendoutMethod"
            label="发货方式"
            outlined
          ></v-select>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="jumpToSendPackage()"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {getNowTimeFormatDate} from '../../utils/helpFunction';
  export default {
    data: () => ({
      tab: null,
      backupWaitPackageList: [],
      backupPackedPackageList: [],
      backupThirdPartyList: [],
      thirdPartyPackageList: [],
      packedPackageList: [],
      waitPackageList: [],
      searchStr: '',
      headers: [
        {
          sortable: false,
          text: '小蚂蚁单号',
          value: 'litlleant_tracking_number'
        },
        {
          sortable: true,
          text: '提交时间',
          value: 'created_at',
        },
        {
          sortable: true,
          text: '重量',
          value: 'total_weight',
        },
        {
          sortable: true,
          text: '运费',
          value: 'total_price',
        },
        {
          sortable: true,
          text: '状态',
          value: 'status',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      expanded: [],
      ifPassDateLimit: false,

      selected: [],
      itemHeaders: [
        {
          text: '名称',
          value: 'item_name',
        },
        {
          sortable: true,
          text: '价钱',
          value: 'price',
        },
        {
          sortable: true,
          text: '品牌',
          value: 'brand',
        },
        {
          sortable: true,
          text: '数量',
          value: 'item_count',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      splitItemDialog: false,
      splitAmount: 0,
      splitIndex: -1,

      backupPackageItems: [],
      packageIndex: -1,
      splitOutItem: {},
      splitTime: 0,

      sentMethodDialog: false,
      sendoutMethodList: ['发往中国','美国境内','仓库自提'],
      sendoutMethod: '发往中国',
    }),

    methods: {
      focus(event) {
        event.currentTarget.select();
      },

      itemCountRule: function(number){
        let ruleArray = [];
        ruleArray.push(value => value <= number || '选择的数量超出');
        ruleArray.push(value => value > 0 || '选择的数量至少为1');
        return ruleArray;
      },

      //搜索
      filterSearch () {
        if(!this.searchStr){
          this.thirdPartyPackageList = this.backupThirdPartyList;
          this.packedPackageList = this.backupPackedPackageList;
          this.waitPackageList = this.backupWaitPackageList;
          return;
        }
        this.waitPackageList = this.backupWaitPackageList;
        this.waitPackageList = this.waitPackageList.filter((item) => {
          return item.litlleant_tracking_number.toString().indexOf(this.searchStr) !== -1 ||
          item.to_name.toString().indexOf(this.searchStr) !== -1
        })
        this.packedPackageList = this.backupPackedPackageList;
        this.packedPackageList = this.packedPackageList.filter((item) => {
          return item.litlleant_tracking_number.toString().indexOf(this.searchStr) !== -1 ||
          item.to_name.toString().indexOf(this.searchStr) !== -1
        })
        this.thirdPartyPackageList = this.backupThirdPartyList;
        this.thirdPartyPackageList = this.thirdPartyPackageList.filter((item) => {
          return item.tracking.toString().indexOf(this.searchStr) !== -1;
        })
      },

      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },


      clearError: function(_package){
        this.$http.post('/api/setAdminComment',{
          admin_comment: null,
          packageId: _package.id,
        }).then( (res) => {
          this.getAll();
        })
      },

      selectSendMethod: function(){
        this.sentMethodDialog = true;
      },

      jumpToSendPackage: function(){
        let selectedContent = {};
        selectedContent.method = this.sendoutMethod;
        selectedContent.items = this.selected;
        selectedContent.selectedPackages = [];
        selectedContent.partPackages = [];
        let package_selected_no = 0;
        let needSplit = 0;
        let packageSelected = false;
        let partPackageSelected = false;
        for(let myPackage of this.thirdPartyPackageList){
          for(let item of myPackage.items){
            if(this.selected.indexOf(item) != -1){
              packageSelected = true;
            }else if(this.selected.indexOf(item) == -1){
              partPackageSelected = true;
            }
          }
          if(packageSelected && !partPackageSelected){
            package_selected_no = package_selected_no + 1;
            selectedContent.selectedPackages.push({
              id: myPackage.id,
              tracking: myPackage.tracking,
            });
          }else if(packageSelected && partPackageSelected){
            needSplit = 1;
            selectedContent.partPackages.push({
              id: myPackage.id,
              tracking: myPackage.tracking,
            });
          }
          //合并多拆分的同一种物品

        }
        if(needSplit == 0 && package_selected_no == 1){ //表示不需要拆箱
          selectedContent.needSplit = 0;
        }else{        //需要拆箱或合箱          是否拆箱对美国境内转运的收费标准不一样
          needSplit = 1;
          selectedContent.needSplit = 1;
        }
        if(selectedContent.items.length != 0){
          //alert(JSON.stringify(selectedContent));
          this.$router.push({ name: '我要发货', params: {_selectedContent: selectedContent}});
        }else{
          alert('请至少选择一个物品');
        } 
        /* 
        selectedContent.isLargeVolume = 0;
        selectedContent.items = [];
        selectedContent.selectedPackages = [];
        selectedContent.partPackages = [];
        let package_selected_no = 0;
        let needSplit = 0;
        //alert(JSON.stringify(this.packageList));
        //如果有且只有一个package checkbox被选了，就是不拆箱也不合箱
        //如果其他情况，算拆箱处理
        for(let myPackage of this.thirdPartyPackageList){
          if(myPackage.checkbox == true){
            package_selected_no = package_selected_no + 1;
            selectedContent.selectedPackages.push({
              id: myPackage.id,
              tracking: myPackage.tracking,
            });
            myPackage.items.map((item,index)=>{    //  把原数组循环一下
              selectedContent.items.push(item);
            })
          }else{
            for(let item of myPackage.items){
              if(item.checkbox1 == true){
                needSplit = 1;
                selectedContent.items.push(item);
                selectedContent.partPackages.push({
                  id: myPackage.id,
                  tracking: myPackage.tracking,
                });
              }
            }
          }
        }
        
        if(needSplit == 0 && package_selected_no == 1){ //表示不需要拆箱
          selectedContent.needSplit = 0;
        }else{        //需要拆箱或合箱          是否拆箱对美国境内转运的收费标准不一样
          needSplit = 1;
          selectedContent.needSplit = 1;
        }
        if(selectedContent.items.length != 0){
          //alert(JSON.stringify(selectedContent));
          this.$router.push({ name: '我要发货', params: {_selectedContent: selectedContent}});
        }else{
          alert('请至少选择一个物品');
        } */
        
      },

      jumpToPackageDetail: function(package_id){
        this.$router.push({ path: '/package/detail', query: {packageId: package_id}});
      },

      gotoPackageInfo: function(item){
        this.$router.push({ path: '/package/detail', query: {packageId: item.id}});
      },

      getAll: function(){
        this.$http.get('/api/package/getThirdPartyPackageByUser',{
          params: {
            storage_number : this.$store.state.user.storage_number,
          }
        }).then( (res) => {
          this.thirdPartyPackageList = res.data;
          let today = getNowTimeFormatDate();
          today = Date.parse(today);
          for(let onePackage of this.thirdPartyPackageList){            
            this.$http.get('/api/item/getItemsByThirdPartyPackageId',{
              params: {
                packageId : onePackage.id,
              }
            }).then( (resSec) => {
              this.$set(onePackage,'items',resSec.data);
              for(let k of onePackage.items){
                this.$set(k,'total_unit',k.item_count);
                this.$set(k,'split_time',0);
              }
              this.backupPackageItems = onePackage.items;
            })
            
            let instoredate = onePackage.in_store_date;            
            instoredate = Date.parse(instoredate);
            let dateSpan = instoredate - today;
            dateSpan = Math.abs(dateSpan);
            let iDays = Math.floor(dateSpan / (24 * 3600 * 1000)) + 1;
            if(iDays > 45){
              this.ifPassDateLimit = true;
            }            
          }          
          this.backupThirdPartyList = this.thirdPartyPackageList;
        })

        this.$http.get('/api/package/getUserPackageByUser',{
          params: {
            userId : this.$store.state.user.user_id,            
					}
        }).then( (res) => {
          for(let item of res.data){
            if(item.status == '待处理'){
              this.waitPackageList.push(item);
            }else{
              this.packedPackageList.push(item);
            }
          }
        })
        this.backupWaitPackageList = this.waitPackageList;
        this.backupPackedPackageList = this.packedPackageList;
      },

      previewImg: function(url){
        this.$hevueImgPreview('https://image.endlessflora.com/' + url);
      },


      splitItems: function(myPackage,item){
        this.splitTime = this.splitTime + 1;
        this.packageIndex = this.thirdPartyPackageList.indexOf(myPackage);
        this.backupPackageItems = myPackage.items;
        this.splitItemDialog = true;
        this.splitOutItem = {
          id: item.id,
          barcode: item.barcode,
          third_party_packageId: item.third_party_packageId,
          itemTemplate_Id: item.itemTemplate_Id,
          type : item.type,
          item_name : item.item_name,
          price : item.price,
          item_count : 0,
          brand : item.brand,
          total_unit: item.total_unit,
          split_time: this.splitTime,
        }
        this.splitIndex = this.backupPackageItems.indexOf(item);
      },

      confirmAmount: function(){
        if(this.splitAmount == 0 || this.splitAmount > this.backupPackageItems[this.splitIndex].item_count - 1){
          alert('分拆数量不合法');
          return;
        }
        this.splitItemDialog = false;
        
        //alert(JSON.stringify(this.splitOutItem));
        let changeUnit = this.backupPackageItems[this.splitIndex].item_count - this.splitAmount;
        this.backupPackageItems[this.splitIndex].item_count = changeUnit;
        //this.backupItemsWaitForPacking[this.splitIndex].item_count = changeUnit;
        this.splitOutItem.item_count = this.splitAmount;
        this.backupPackageItems.splice(this.splitIndex,0,this.splitOutItem);
        //this.backupItemsWaitForPacking.splice(this.splitIndex,0,this.splitOutItem);
        this.splitAmount = 0;
        
        this.splitIndex = -1;
      },
    },

    mounted: function() {
      this.getAll();
		}
    
  }
</script>
