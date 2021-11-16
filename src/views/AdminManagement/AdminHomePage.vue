<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row align="center">
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="green"
          icon="mdi-package-variant-closed"
          title="总数"
          :value="waitPackage"
          sub-icon="mdi-calendar"
          sub-text="待入库包裹"
          @click="openPreprocess()"
        />
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="green"
          icon="mdi-package-variant-closed"
          title="总数"
          :value="waitProcessPackage"
          sub-icon="mdi-calendar"
          sub-text="待处理包裹"
          @click="openPackageprocess()"
        />
      </v-col>
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-menu
              open-on-hover
              bottom
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text 
                  outlined
                  v-bind="attrs"
                  v-on="on"
                >
                  数据管理
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="jumpToAllUsers">
                  <v-list-item-title>用户列表</v-list-item-title>
                </v-list-item>
                <v-list-item @click="jumpToAllRecipients">
                  <v-list-item-title>收件人列表</v-list-item-title>
                </v-list-item>
                <v-list-item @click="jumpToAllItems">
                  <v-list-item-title>物品列表</v-list-item-title>
                </v-list-item>
                <v-list-item @click="jumpToRateTable">
                  <v-list-item-title>计费标准</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu
              open-on-hover
              bottom
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-4"
                  text 
                  outlined
                  v-bind="attrs"
                  v-on="on"
                >
                  财务管理
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="openChargeDialog()">
                  <v-list-item-title>记录开支</v-list-item-title>
                </v-list-item>
                <v-list-item @click="jumpToAllInvoices">
                  <v-list-item-title>费用清单</v-list-item-title>
                </v-list-item>
                <v-list-item @click="jumpToIncomeDetail">
                  <v-list-item-title>数据统计</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
            <v-menu
              open-on-hover
              bottom
              offset-y
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  class="ml-4"
                  text 
                  outlined
                  v-bind="attrs"
                  v-on="on"
                >
                  文章管理
                </v-btn>
              </template>

              <v-list>
                <v-list-item @click="openCreateBlog()">
                  <v-list-item-title>编辑文章</v-list-item-title>
                </v-list-item>
                <v-list-item @click="openBlogList()">
                  <v-list-item-title>文章列表</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-toolbar>
        </v-card>
      </v-col>
		</v-row>
    <v-dialog
      v-model="chargeDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">记录开支</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  :items="chargeTypeList"
                  v-model="chargeType"
                  label="类型"
                ></v-select>
                <v-text-field
                  label="备注"
                  v-model="trackingNm"
                  required
                ></v-text-field>
                <v-text-field
                  label="总额"
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
    data () {
      return {
        snackbar: false,
        snackbarColor: '',
        notification: '',
        waitPackage: '0',
        waitProcessPackage: '0',
        chargeDialog: false,
        chargeTypeList: ['物料支出'],
        chargeType: '物料支出',
        trackingNm: '',
        chargeAmount: '',
        text: '',
      }
    },

    methods: {
      jumpToRateTable: function(){
        this.$router.push({ path: '/admin/ratetable' });
      },

      jumpToAllUsers: function(){
        this.$router.push({ path: '/user_list' });
      },

      jumpToAllInvoices: function(){
        this.$router.push({ path: '/admin/all_invoice' });
      },

      jumpToAllRecipients: function(){
        this.$router.push({ path: '/admin/all_recipients' });
      },

      jumpToIncomeDetail: function(){
        this.$router.push({ path: '/admin/income_detail' });
      },

      openPreprocess: function(){
        this.$router.push({ path: '/admin/preprocess_package' });
      },

      openPackageprocess: function(){
        this.$router.push({ path: '/waitpackage_list' });
      },

      jumpToAllItems: function(){
        this.$router.push({ path: '/admin/all_items' });
      },
      
      openCreateBlog: function(){
        this.$router.push({ path: '/admin/blog_create' });
      },

      openBlogList: function(){
        this.$router.push({ path: '/admin/blog_list' });
      },

      openChargeDialog: function(){
        this.chargeDialog = true;
      },

      chargeSure: function(){
        if(this.chargeAmount == ''){
          alert('请输入数额');
        }else{
          
        }
      },

      loadAll: function(){
        this.$http.get('/api/package/getForcastInfo').then( (res) => {
          this.waitPackage = res.data.length.toString();
        })

        this.$http.get('/api/package/getAllWaitPackage').then( (res) => {
          this.waitProcessPackage = res.data.length.toString();
        })
      },
		},

    mounted: function() {
      this.loadAll();
		}
	}
</script>