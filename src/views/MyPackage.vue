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

            <v-btn v-if="this.$store.state.user.roles != 'default'" text @click="jumpToSendPackage()">发货</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col v-if="this.$store.state.user.roles != 'default'" cols="12">
        <v-divider
          class="mx-4"
        ></v-divider>
        <v-subheader>
          已入库
        </v-subheader>
      </v-col>
      <v-col 
        v-for="myPackage in thirdPartyPackageList"
        :key="myPackage.id"
        cols="12"
        lg="6"
      >
        <v-card>
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>
                <v-checkbox 
                  v-model="myPackage.checkbox"
                  @click="packageSelected(myPackage)"
                  :label="getPackageTitle(myPackage)"
                ></v-checkbox>
                入库： {{myPackage.in_store_date}}
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row
                  v-for="item in myPackage.items"
                  :key="item.id"
                >
                  <v-col cols="4">
                    <v-checkbox dense 
                      v-model="item.checkbox1"
                      @click="itemChange(myPackage)"
                      :label="itemLabel(item)"
                    ></v-checkbox>
                  </v-col>
                  <v-col cols="2">
                    <v-text-field
                      v-if="item.total_unit > 1"
                      v-model="item.item_count"
                      @change="itemCountChange(myPackage)"
                      class="mt-4 pt-0"
                      type="number"
                      :rules="itemCountRule(item.total_unit)"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="2">
                    <v-img v-if="item.pic1_url" :src='"https://image.endlessflora.com/" + item.pic1_url' dark max-width="100" style="cursor: pointer;" @click="previewImg(item.pic1_url)"></v-img>
                  </v-col>
                  <v-col cols="2">
                    <v-img v-if="item.pic2_url" :src='"https://image.endlessflora.com/" + item.pic2_url' dark max-width="100" style="cursor: pointer;" @click="previewImg(item.pic2_url)"></v-img>
                  </v-col>
                  <v-col cols="2">
                    <v-img v-if="item.pic3_url" :src='"https://image.endlessflora.com/" + item.pic3_url' dark max-width="100" style="cursor: pointer;" @click="previewImg(item.pic3_url)"></v-img>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-divider
          class="mx-4"
        ></v-divider>
        <v-subheader>
          待处理
        </v-subheader>
      </v-col>
      <v-col 
        v-for="waitPackage in waitPackageList"
        :key="waitPackage.id"
        cols="12"
        lg="6"
      >
        <v-card>
          <v-row>
            <v-col cols="5" class="mt-3">
              <span class="ml-6">
                {{waitPackage.litlleant_tracking_number}}
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
            <v-col cols="12" class="ml-6">
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
      <v-col cols="12">
        <v-divider
          class="mx-4"
        ></v-divider>
        <v-subheader>
          已打包
        </v-subheader>
      </v-col>
      <v-col 
        v-for="junanPackage in junanPackageList"
        :key="junanPackage.id"
        cols="12"
        lg="6"
      >
        <v-card>
          <v-row>
            <v-col cols="5" class="mt-3">
              <span class="ml-6">
                {{junanPackage.litlleant_tracking_number}}
              </span>
            </v-col>
            <v-col cols="3" class="mt-3">
              <span>{{junanPackage.created_at}}</span>
            </v-col>
            <v-col cols="4">
              <v-btn
                class="ml-8"
                @click="jumpToPackageDetail(junanPackage.id)"
                text
              >
                详情
              </v-btn>              
            </v-col>
            <v-col cols="12" class="ml-6">
              <tr v-if="junanPackage.actual_weight">
                <td>重量: {{junanPackage.actual_weight}} lb &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>运费: {{junanPackage.charge_price}} 元</td>         
              </tr>
              <tr>
                <td >收件人: {{junanPackage.to_name}}&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>地址: {{junanPackage.to_state}}&nbsp;&nbsp;{{junanPackage.to_city}}&nbsp;&nbsp;{{junanPackage.to_address}}</td>            
              </tr>               
            </v-col>
          </v-row>
        </v-card>
      </v-col>
        
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      backupWaitPackageList: [],
      backupTlaPackageList: [],
      backupThirdPartyList: [],
      thirdPartyPackageList: [],
      junanPackageList: [],
      waitPackageList: [],
      searchStr: '',
    }),

    methods: {
      itemLabel: function(item){
        if(item.item_count > 1){
          return item.item_name + '(' + item.total_unit + '件)';
        }else{
          return item.item_name;
        }
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
          this.junanPackageList = this.backupTlaPackageList;
          this.waitPackageList = this.backupWaitPackageList;
          return;
        }
        this.waitPackageList = this.backupWaitPackageList;
        this.waitPackageList = this.waitPackageList.filter((item) => {
          return item.litlleant_tracking_number.toString().indexOf(this.searchStr) !== -1 ||
          item.to_name.toString().indexOf(this.searchStr) !== -1
        })
        this.junanPackageList = this.backupTlaPackageList;
        this.junanPackageList = this.junanPackageList.filter((item) => {
          return item.litlleant_tracking_number.toString().indexOf(this.searchStr) !== -1 ||
          item.to_name.toString().indexOf(this.searchStr) !== -1
        })
        this.thirdPartyPackageList = this.backupThirdPartyList;
        this.thirdPartyPackageList = this.thirdPartyPackageList.filter((item) => {
          return item.user_defined_tracking.toString().indexOf(this.searchStr) !== -1;
        })
      },

      packageSelected: function(myPackage){
        //alert(JSON.stringify(myPackage));
        //bug items is added after checkbox clicked, why?
        if(myPackage.items == undefined)
          return;
        if(myPackage.checkbox == true){
          for(let item of myPackage.items){
            item.checkbox1 = true;
          }
        }else{
          for(let item of myPackage.items){
            item.checkbox1 = false;
          }
        }
      },

      clearError: function(_package){
        this.$http.post('/api/setAdminComment',{
          admin_comment: null,
          packageId: _package.id,
        }).then( (res) => {
          this.getAll();
        })
      },

      jumpToSendPackage: function(){
        let selectedContent = {};
        selectedContent.items = [];
        selectedContent.selectedPackages = [];
        let package_selected_no = 0;
        let needSplit = 0;
        //alert(JSON.stringify(this.packageList));
        //如果有且只有一个package checkbox被选了，就是不拆箱也不合箱
        //如果其他情况，算拆箱处理
        for(let myPackage of this.thirdPartyPackageList){
          if(myPackage.checkbox == true){
            package_selected_no = package_selected_no + 1;
            selectedContent.selectedPackages.push(myPackage.id);
            myPackage.items.map((item,index)=>{    //  把原数组循环一下
              selectedContent.items.push(item);
            })
          }else{
            for(let item of myPackage.items){
              if(item.checkbox1 == true){
                needSplit = 1;
                selectedContent.items.push(item);
              }
            }
          }
        }
        
        if(needSplit == 0 && package_selected_no == 1){ //表示不需要拆箱
          selectedContent.needSplit = 0;
        }else{        //需要拆箱或合箱
          needSplit = 1;
          selectedContent.needSplit = 1;
        }
        if(selectedContent.items.length != 0){
          this.$router.push({ name: '我要发货', params: {_selectedContent: selectedContent}});
        }else{
          alert('请至少选择一个物品');
        }
        
      },

      jumpToPackageDetail: function(package_id){
        this.$router.push({ path: '/package/detail', query: {packageId: package_id}});
      },

      getAll: function(){
        if(this.$store.state.user.roles != 'default'){
          this.$http.get('/api/getThirdPartyPackageByUser',{
            params: {
              userId : this.$store.state.user.user_id,
              status: '已入库',
            }
          }).then( (res) => {
            this.thirdPartyPackageList = res.data;
            for(let onePackage of this.thirdPartyPackageList){            
              this.$http.get('/api/getItemsByPackageId',{
                params: {
                  packageId : onePackage.id,
                }
              }).then( (resSec) => {
                onePackage.items = resSec.data;
                for(let k of onePackage.items){
                  k.total_unit = k.item_count;
                }
              })
            }
            this.backupThirdPartyList = this.thirdPartyPackageList;
          })
        }        

        this.$http.get('/api/getUserPackageByUser',{
          params: {
            userId : this.$store.state.user.user_id,            
					}
        }).then( (res) => {
          for(let item of res.data){
            if(item.status == '待处理'){
              this.waitPackageList.push(item);
            }else{
              this.junanPackageList.push(item);
            }
          }
        })
        this.backupWaitPackageList = this.waitPackageList;
        this.backupTlaPackageList = this.junanPackageList;
      },

      previewImg: function(url){
        this.$hevueImgPreview('https://image.endlessflora.com/' + url);
      },

      getPackageTitle: function(item){
        return item.user_defined_tracking;
      },

      itemChange: function(packageItem){
        let itemNm = packageItem.items.length;
        let isCheck = true;
        for(let i=0; i<itemNm; i++){
          if(packageItem.items[i].checkbox1 == false){
            isCheck = false;
            break;
          }
          if(packageItem.items[i].total_unit > packageItem.items[i].item_count){
            isCheck = false;
            break;
          }
        }
        packageItem.checkbox = isCheck;
      },

      itemCountChange: function(packageItem) {
        let itemNm = packageItem.items.length;
        let isCheck = true;
        for(let i=0; i<itemNm; i++){
          if(packageItem.items[i].checkbox1 == false){
            isCheck = false;
            break;
          }          
          if(packageItem.items[i].total_unit > packageItem.items[i].item_count){
            isCheck = false;
            break;
          }
        }
        packageItem.checkbox = isCheck;
      }
    },

    mounted: function() {
      this.getAll();
		}
    
  }
</script>
