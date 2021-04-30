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

            <v-btn text @click="jumpToSendPackage()">发货</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-divider
          class="mx-4"
        ></v-divider>
        <v-subheader>
          已入库
        </v-subheader>
        <v-data-table
					v-model="selected"
					:headers="headers"
					:items="batchPackageList"
					item-key="id"
					show-select
					class="elevation-1"
					hide-default-footer
        >
        </v-data-table>
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
              <tr v-if="waitPackage.actual_weight">
                <td>重量: {{waitPackage.actual_weight}} lb &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td>运费: {{waitPackage.charge_price}} 元</td>         
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
      batchPackageList: [],
      searchStr: '',
      headers: [
        {
          sortable: false,
          text: '全选',
          value: 'user_defined_tracking',
        }
      ],
      selected: [],
      junanPackageList: [],
      waitPackageList: [],
      backupWaitPackageList: [],
      backupTlaPackageList: [],
    }),

    methods: {

      //搜索
      filterSearch () {

      },

      jumpToSendPackage: function(){
        let selectedContent = {};
        selectedContent.selectedPackages = [];
        for(let myPackage of this.selected){
          selectedContent.selectedPackages.push(myPackage.id);
        }
        if(selectedContent.length != 0){
          this.$router.push({ name: '我要发货', params: {_selectedContent: selectedContent}});
        }else{
          alert('请至少选择一个包裹');
        }
      },

      jumpToPackageDetail: function(package_id){
        this.$router.push({ path: '/package/detail', query: {packageId: package_id}});
      },

      getAll: function(){
        this.$http.get('/api/getThirdPartyPackageByUser',{
          params: {
            userId : this.$store.state.user.user_id,
            status: '已入库',
					}
        }).then( (res) => {
          this.batchPackageList = res.data;
          
        })

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
    },

    mounted: function() {
      this.getAll();
		}
    
  }
</script>
