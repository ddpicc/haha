<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
          <v-tabs
            background-color="transparent"
              color="basil"
              grow
          >
            <v-tab>
              预报包裹
            </v-tab>
            <v-tab>
              已预报但还未入库的包裹
            </v-tab>
            <v-tab-item>
              <v-divider
                class="mt-6 mb-6"
              ></v-divider>
              <v-form
                ref="forcastInfoForm"
                v-model="valid"
                lazy-validation
              >
                <v-row>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="package_tracking"
                      label="Tracking # (请尽量输入完整的购物网站追踪单号)"
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
                    <v-select
                      v-model="serviceType"
                      :items="serviceTypeList"
                      label="服务类型"
                      :rules="requiredRule"
                    ></v-select>
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-menu
                      v-model="menu2"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      min-width="auto"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="arriveDate"
                          label="预计包裹抵达仓库日期"
                          prepend-icon="mdi-calendar"
                          readonly
                          v-bind="attrs"
                          v-on="on"
                        ></v-text-field>
                      </template>
                      <v-date-picker
                        v-model="arriveDate"
                        :allowed-dates="allowedDates"
                        @input="menu2 = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                </v-row>
              </v-form>
              <v-col class="d-inline-flex justify-end">
                <v-btn color="blue" dark class="mr-2" @click="forcastCreate">确认</v-btn>
              </v-col>
            </v-tab-item>
            <v-tab-item>
              <v-divider
                class="mt-6 mb-6"
              ></v-divider>
              <v-list-item
                v-for="forcastInfo in forcastInfoList"
                :key="forcastInfo.id"
              >
                <v-list-item-avatar>
                  <v-icon
                    class="blue lighten-3"
                    dark
                    small
                    @click="deleteForcastInfo(forcastInfo.id)"
                  >
                    mdi-delete
                  </v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title v-text="forcastInfo.forcast_tracking"></v-list-item-title>
                  <v-list-item-subtitle v-text="forcastInfo.arrive_at"></v-list-item-subtitle>              
                </v-list-item-content>

                <v-list-item-action>
                  <div>
                    {{forcastInfo.comment}}
                  </div>
                </v-list-item-action>
              </v-list-item>
            </v-tab-item>
          </v-tabs>
          
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
	</v-container>
</template>

<script>
	export default {
    data() {
      return {
        package_tracking: '',
        package_comment: '',
        serviceType: '寄往国内',
        serviceTypeList: ['寄往国内','境内转运','包裹自提'],
        arriveDate: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        menu2: false,
        valid: false,
        forcastInfoList: [],

        storeNm: this.$store.state.user.storage_number,

        snackbar: false,
        snackbarColor: '',
        notification: '',
        requiredRule: [
            v => !!v || 'Item is required',
        ]
      }
    },

		methods: {
      focus(event) {
        event.currentTarget.select();
			},

      allowedDates: val => Date.parse(val) > new Date()-7*24*60*60*1000 - 8.64e7,

      forcastCreate: function(){
        if(this.$refs.forcastInfoForm.validate()){        
          this.$http.get('/api/package/existForcastPackage',{
            params: {
              forcast_tracking: this.package_tracking,
            }
          }).then( (res) => {
            if(res.data.length === 0){
              this.$http.post('/api/package/createForcastInfo',{
                forcast_tracking: this.package_tracking,
                comment: this.package_comment,
                storage_number: this.storeNm,
                service_type: this.serviceType,
                arrive_at: this.arriveDate,
              }).then( (res) => {
                this.snackbar = true;
                this.notification = '预报成功';
                this.snackbarColor = 'green';
                this.package_tracking = '';
                this.package_comment = '';
                this.getForcastInfo();
              })
            }else{
              this.snackbar = true;
              this.notification = '已经预报过该包裹';
              this.snackbarColor = 'red';
            }
          })
        }
      },

      deleteForcastInfo: function(id){
        this.$http.delete('/api/package/deleteForcastInfo',{
          params: {
						id : id
					}
        }).then( (res) => {
          this.getForcastInfo();
        })
      },

      getForcastInfo: function(){
        this.$http.get('/api/package/getForcastInfoByStorageNm',{
          params: {
            storage_number: this.storeNm,
          }
        }).then( (res) => {
          this.forcastInfoList = res.data;
        })
      },      
    },

    mounted: function() {
      this.getForcastInfo();
    },

	}
</script>