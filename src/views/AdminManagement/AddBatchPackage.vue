<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>          
          <v-form
            ref="packageForm"
            v-model="valid"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col cols="12" md="6">
									<v-text-field
                    v-model="instoreDate"
                    label="入库时间"
                    required
                  ></v-text-field>
                </v-col>
								<v-col cols="12" md="6">
									<v-autocomplete
                    label="用户"
                    :items="cacheAllUser"
                    :filter="customFilter"
                    clearable
                    @update:search-input="searchChanged"
                    :item-text="displayText"
                    item-value="id"
                    v-model="selectedUser"
                    :rules="[v => !!v || 'user is required']"
                  >
										<template v-slot:item="data">
											<template>
												<v-list-item-content>
													<v-list-item-title>{{data.item.storage_number}}</v-list-item-title>
													<v-list-item-subtitle>
														姓名: {{data.item.name}}&nbsp;&nbsp;&nbsp;&nbsp;电话: {{data.item.user_phone}}&nbsp;&nbsp;&nbsp;&nbsp;邮箱: {{data.item.email}}
													</v-list-item-subtitle>
												</v-list-item-content>
											</template>
										</template>
                  </v-autocomplete>
								</v-col>
								<v-col>
                  <v-text-field
                    v-model="user_defined_tracking"
                    label="快递单号"
                    required
                    @keyup.enter.native="pushToTable"
                    @focus="focus($event)"
                  ></v-text-field>
								</v-col>
              </v-row>
            </v-container>
          </v-form>        
        </material-card>
      </v-col>
      <v-col cols="12">
        <material-card>
          <div class="overline mb-4 d-inline-flex">
            包裹单号
          </div>              
					<v-data-table
            :headers="headers"
            :items="packageList"
            item-key="packageTracking"
            no-data-text="还未添加包裹"
            hide-default-footer
						hide-default-header
          >
						<template v-slot:item.action="{ item }">
							<v-btn color="blue darken-1" text @click="deletePackage(item)">删除</v-btn>
						</template>
          </v-data-table>
        </material-card>
      </v-col>
      <v-col cols="12" class="d-inline-flex justify-end">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-col>
    </v-row>
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="5000"
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
  import {getNowFormatDate, generateUniqueString} from '../../utils/helpFunction';
  export default {
    data: () => ({
      valid: true,
      user_defined_tracking: '',
      courierList: ['USPS','UPS','Amazon','Fedex','DHL'],
      courier: '',
      cacheAllUser: [],
      selectedUser: '',
      instoreDate: '',
      snackbar: false,
      snackbarColor: '',
      notification: '',
			headers: [
				{
          sortable: false,
          text: '快递单号',
          value: 'tracking',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      packageList: [],
      overlay: false,
    }),

    methods: {
      focus(event) {
        event.currentTarget.select();
			},
      
      displayText: function(item){
        return item.storage_number + ' (' + item.name  + '    ' + item.email + ')';
      },

      searchChanged: function(queryText){

      },

      customFilter (item, queryText, itemText) {
        const hasValue = val => val != null ? val : '';
        const query = hasValue(queryText).toUpperCase();

        //if(queryText.length < 2) return false;
        const textOne = item.storage_number;
        return textOne.indexOf(query) > -1;
      },

      save: async function(){
        let result = [];
        this.overlay = true;
        for(let item of this.packageList){
          let batchPackageResult = new Promise((resolve, reject) => {
            this.$http.post('/api/insertThirdPartyBatchPackage',{
              user_id : this.selectedUser,
              user_defined_tracking : item.tracking,
              package_type : '大货',
              status : '已入库',
              instore_date : this.instoreDate,
            }).then( (res) => {
              resolve(1);
            })
          })
          result.push(batchPackageResult);
        }
        let promiseResult = await Promise.all(result);
        this.overlay = false;
        this.snackbar = true;
        this.notification = '大货发货单录入完毕';
        this.snackbarColor = 'green';
        this.packageList = [];
        this.selectedUser = '';
        
      },

      pushToTable: function(){
        if(this.selectedUser == ''){
          alert('请先选择用户');
          return;
        }
        if(this.user_defined_tracking == ''){
          alert('运单号不能为空');
          return;
        }
        this.packageList.push(
          {
            tracking: this.user_defined_tracking
          }
        );
        this.user_defined_tracking = '';
      },

      deletePackage: function(item){
        var index = this.packageList.indexOf(item);
        this.packageList.splice(index, 1);
      },

      getBatchUser: function(){
        this.$http.get('/api/getBatchUser').then( (res) => {
          this.cacheAllUser = res.data;
        })
      }
    },

    mounted: function() {      
        this.getBatchUser();
        this.instoreDate = getNowFormatDate();
    },
  }
</script>

