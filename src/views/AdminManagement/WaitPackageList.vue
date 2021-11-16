<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-chip @click="filterPackage('发往中国')" class="mr-3">发往中国:  {{waitChinaPackageNm}}</v-chip>
            <v-chip @click="filterPackage('美国境内')" class="mr-3">美国境内:  {{waitUSPackageNm}}</v-chip>
            <v-chip @click="filterPackage('仓库自提')" class="mr-3">仓库自提:  {{waitSelfPackageNm}}</v-chip>
            <v-spacer></v-spacer>
            <v-chip @click="filterUserPackage(1)"  dark class="mr-3">小蚂蚁用户</v-chip>            
            <v-chip @click="filterUserPackage(2)"  dark class="mr-3">sherry用户</v-chip>    
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="12">
        <material-card>
          <v-data-table
            dense
            :headers="headers"
            :items="items"
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
              @click="editOrder(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteDialog(item)"
            >
              mdi-close
            </v-icon>
          </template>
          <template v-slot:item.storage_number="{ item }">
            <v-chip :color="getColor(item.role)" dark>{{ item.storage_number }}</v-chip>
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
        </material-card>
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
            @click="deletePackage()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    inject: ['reload'],
    data: () => ({
      searchStr: '',
      headers: [
        {
          sortable: true,
          text: '类型',
          value: 'package_type'
        },
        {
          sortable: false,
          text: '仓位号',
          value: 'storage_number'
        },
        {
          sortable: false,
          text: '小蚂蚁单号',
          value: 'litlleant_tracking_number'
        },
        {
          sortable: false,
          text: '包裹描述',
          value: 'package_description'
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
      items: [],
      backupItems: [],
      expanded: [],
      snackbar: false,
      snackbarColor: '',
      notification: '',
      deleteComfirm: false,
      theDeletePackage: {},
      waitUSPackageNm: 0,
      waitChinaPackageNm: 0,
      waitSelfPackageNm: 0,
    }),

    methods: {
      getColor: function(role){
        if(role == 'batch user'){
          return 'lime darken-2';
        }else if(role == 'premium'){
          return 'deep-purple lighten-2';
        }else{
          return 'blue lighten-2';
        }        
      },


      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

      // 获取所有包裹
      getAll: function() {
        this.$http.get('/api/package/getAllWaitPackage').then( (res) => {
          this.items = res.data;
          for(let item of this.items){
            if(item.package_description.length > 50){
              item.package_description = item.package_description.substr(0,50);
            }
            
          }
          this.backupItems = this.items;
          for(let item of this.items){

            if(item.package_type == '美国境内'){
              this.waitUSPackageNm = this.waitUSPackageNm + 1;
            }else if(item.package_type == '仓库自提'){
              this.waitSelfPackageNm = this.waitSelfPackageNm + 1;
            }else{
              this.waitChinaPackageNm = this.waitChinaPackageNm + 1;
            }
            if(item.admin_comment != null){
              item.status = item.admin_comment;
            }
          }
        })
      },

      gotoPackageInfo: function(item){
        this.$router.push({ path: '/admin/package_info', query: {packageId: item.id}});
      },

      editOrder: function(packageItem){
        //this.$router.push({ name: '包裹详情', params: {selectedPackage: packageItem}});

        var newpage = this.$router.resolve({path: '/admin/process_package', query: {packageId: packageItem.id}})
        
        window.open(newpage.href,'_blank')
      },

      deleteDialog: function(item){
        this.deleteComfirm = true;
        this.theDeletePackage = item;
      },

      deletePackage: function(){
        this.$http.delete('/api/deletePackagebybyId',{
          params: {
						packageId : this.theDeletePackage.id
					}
        }).then( (res) => {
          this.deleteComfirm = false;
          this.getAll();
        })
      },

      filterPackage: function(searchStr){
        this.searchStr = searchStr;
      },

      filterUserPackage: function(type){
        this.items = this.backupItems;
        if(type == 1){
          this.items = this.items.filter((item) => {
            return item.rateTable_id == 1 || item.rateTable_id == 3
          })
        }else{
          this.items = this.items.filter((item) => {
            return item.rateTable_id == 2
          })
        }
        
      }
    },

    mounted: function() {
      this.getAll();
		}

    
  }
</script>
