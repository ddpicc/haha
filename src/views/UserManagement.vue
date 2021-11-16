<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
          <v-data-table
            :headers="headers"
            :items="items"
            item-key="id"
            :items-per-page="15"
            :search="searchStr"
            :custom-filter="filterText"
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-if="this.$store.state.user.roles == 'admin'" v-slot:item.action="{ item }">
            <v-btn
              small
              class="mr-2"
              text
              @click="changeUserRole(item.role,item.storage_number,item.rateTable_id)"
            >
              变更类型
            </v-btn>
            <v-btn
              small
              class="mr-2"
              text
              @click="chargeBalance(item.storage_number,item.balance)"
            >
              扣费
            </v-btn>
            <v-btn
              small
              class="mr-2"
              text
              @click="addBalance(item.storage_number,item.balance)"
            >
              充值
            </v-btn>
          </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="chargeDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">余额管理</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  label="单号或备注"
                  v-model="trackingNm"
                  required
                ></v-text-field>
                <v-text-field
                  :label="balanceTitle"
                  v-model="chargeAmount"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="chargeSure"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="changeDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">用户角色管理</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="10">
                <v-select
                  :items="roleList"
                  v-model="userRole"
                  label="账户角色"
                ></v-select>
              </v-col>
              <v-col cols="2">
                <v-btn
                  text
                  class="mt-4"
                  @click="saveRole"
                >
                  保存
                </v-btn>
              </v-col>
              <v-col cols="10">
                <v-autocomplete
                    label="Rate"
                    :items="rateTableList"
                    :filter="customFilter"
                    clearable
                    :item-text="displayText"
                    item-value="id"
                    v-model="selectedRate"
                  >
                    <template v-slot:item="data">
                      <template>
                        <v-list-item-content>
                          <v-list-item-title>{{data.item.alias}}</v-list-item-title>
                          <v-list-item-subtitle>
                            Class A: ${{data.item.classA_rate}}&nbsp;&nbsp;&nbsp;&nbsp;Class B: ${{data.item.classB_rate}}&nbsp;&nbsp;&nbsp;&nbsp;Class C: ${{data.item.classC_rate}}
                          </v-list-item-subtitle>
                        </v-list-item-content>
                      </template>
                    </template>
                  </v-autocomplete>
              </v-col>
              <v-col cols="2">
                <v-btn
                  text
                  class="mt-4"
                  @click="saveRate"
                >
                  保存
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
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
  </v-container>
</template>

<script>
	import { getNowFormatDate } from '../utils/helpFunction';
  export default {
    data: () => ({
      searchStr: '',
      headers: [
        {
          sortable: false,
          text: '仓位号',
          value: 'storage_number'
        },
        {
          sortable: false,
          text: '姓名',
          value: 'name'
        },
        {
          sortable: false,
          text: '邮箱',
          value: 'email'
        },
        {
          sortable: false,
          text: '电话',
          value: 'user_phone',
        },
        {
          sortable: false,
          text: '账户类型',
          value: 'role',
        },
        {
          sortable: true,
          text: 'Rate',
          value: 'alias',
        },
        {
          sortable: true,
          text: '余额',
          value: 'balance',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      items: [],
      chargeDialog: false,
      trackingNm: '',
      chargeAmount: 0,
      selectedUserNm: '',
      snackbar: false,
      snackbarColor: '',
      notification: '',
      changeDialog: false,
      userRole: '',
      roleList: ['admin','operator','default'],
      rateTableList: [],
      selectedRate: '',
      balanceTitle: '扣除费用(美元)',
      selectedUserBalance: '',
    }),

    methods: {
      displayText: function(item){
        return item.alias;
      },

      customFilter (item, queryText, itemText) {
        const hasValue = val => val != null ? val : '';
        const query = hasValue(queryText).toUpperCase();

        //if(queryText.length < 2) return false;
        const textOne = item.alias;
        return textOne.indexOf(query) > -1;
      },
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

      // 获取所有用户
      getAll: function() {
        this.$http.get('/api/getAllUser').then( (res) => {
          this.items = res.data;
        })
      },

      chargeBalance: function(storage_number,currentBalance){
        this.balanceTitle = '扣除费用(美元)';
        this.chargeDialog = true;
        this.selectedUserNm = storage_number;
        this.selectedUserBalance = currentBalance
        this.chargeAmount = 0;
        this.trackingNm = '';
      },

      addBalance: function(storage_number,currentBalance){
        this.balanceTitle = '充值数额(美元)';
        this.chargeDialog = true;
        this.selectedUserNm = storage_number;
        this.selectedUserBalance = currentBalance
        this.chargeAmount = 0;
        this.trackingNm = '';
      },

      changeUserRole: function(role,storage_number,rateId){
        this.changeDialog = true;
        this.userRole = role;
        this.selectedUserNm = storage_number;
        this.$http.get('/api/getAllRateTalbes').then( (res) => {
          this.rateTableList = res.data;
          this.selectedRate = rateId;
        })
      },

      chargeSure: function(){
        if(this.chargeAmount == 0){
          alert('请输入金额');
        }else{
          if(this.balanceTitle == '充值数额(美元)'){
            this.$http.post('/api/userDeposit',{   
              trackingNm: this.trackingNm,
              chargeAmount: this.chargeAmount,
              prev_balance: this.selectedUserBalance,
              storage_number : this.selectedUserNm,
              type: '充值',
              comment: '手动调整',
              created_at: getNowFormatDate(),
            }).then( (res) => {
              this.chargeDialog = false;
              this.getAll();
              this.snackbar = true;
              this.notification = '充值成功';
              this.snackbarColor = 'green';
            })
          }else{
            this.$http.post('/api/userDeposit',{   
              trackingNm: this.trackingNm,
              chargeAmount: -1 * this.chargeAmount,
              prev_balance: this.selectedUserBalance,
              storage_number : this.selectedUserNm,
              type: '运费',
              comment: '手动调整',
              created_at: getNowFormatDate(),
            }).then( (res) => {
              this.chargeDialog = false;
              this.getAll();
              this.snackbar = true;
              this.notification = '扣费成功';
              this.snackbarColor = 'green';
            })
          }
          
        }
      },

      saveRole: function(){
        this.$http.post('/api/updateUserRole',{
          role : this.userRole,
          storage_number : this.selectedUserNm,
          startDate: getNowFormatDate(),
        }).then((res) => {
          this.changeDialog = false;
          this.getAll();
          this.snackbar = true;
          this.notification = '修改成功';
          this.snackbarColor = 'green';
        })
      },

      saveRate: function(){
        this.$http.post('/api/updateUserRateTable',{
          rateId: this.selectedRate,
          storage_number : this.selectedUserNm,
        }).then((res) => {
          this.changeDialog = false;
          this.getAll();
          this.snackbar = true;
          this.notification = '修改成功';
          this.snackbarColor = 'green';
        })
      }
    },

    mounted: function() {
			this.getAll();
		}

    
  }
</script>
