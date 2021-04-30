<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
        >
          <v-img
            class="white--text align-end"
            height="266px"
            src="https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg?cs=srgb&dl=pexels-chanaka-906494.jpg&fm=jpg"
          >
            <v-card-title>北美免税仓</v-card-title>
          </v-img>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
          height="266px"
        >
          <v-list-item three-line>
            <v-list-item-content>
              <div class="overline mb-4">个人信息</div>
              <v-list-item-title class="headline mb-1">
                {{userName}}                
              </v-list-item-title>
              <v-divider
                class="mx-4"
              ></v-divider>
              <br>
              <br>
              <div v-if="roles == 'default'">普通用户<v-chip dark class="ml-3" @click="jumpToAccountUpgrade">升级</v-chip></div>
              <div v-if="roles == 'premium'">高级用户<v-chip dark class="ml-3" @click="jumpToAccountUpgrade">更改</v-chip></div>
              <div v-if="roles == 'admin'">管理员</div>
              <div>仓位号： {{storeNm}}</div>
              <br>
              <div>手机号码：{{phoneNm}}</div>
              <br>
              <div>账户余额： {{balance}} 美元 &nbsp;&nbsp; <span v-if="this.$store.state.user.balance < 3" style="color: red">余额不足，请尽快充值</span></div>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-btn text @click="jumpToDeposit">充值</v-btn>
            <v-btn text @click="jumpToRecipientsList">收件人管理</v-btn>
            <v-btn text @click="jumpToInvoiceList">交易记录</v-btn>
            <v-btn text @click="notify">通知仓库</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
        >
          <v-card-text class="text--primary">
            <h3 style="color: red">美国仓库地址</h3>
            <v-divider
              class="mb-3"
            ></v-divider>
            <div>First Name: 自定义&nbsp;&nbsp;&nbsp;&nbsp;Last Name: {{storeNm}}</div>
            <div>Address 1: 100 E Scotland Dr,&nbsp;&nbsp;Suite 105A</div>
            <div>Address 2: {{storeNm}}</div>
            <div>City: Bear&nbsp;&nbsp;&nbsp;&nbsp;State: DE&nbsp;&nbsp;&nbsp;&nbsp;Zip Code: 19701</div>
            <v-divider
              class="mb-3"
            ></v-divider>
            <div>如网上下单收件人必须与信用卡信息匹配 则</div>
            <div>First Name: 自定义&nbsp;&nbsp;&nbsp;&nbsp;Last Name: 自定义</div>
            <div>Address 1: 100 E Scotland Dr,&nbsp;&nbsp;Suite 105A &nbsp;{{storeNm}}</div>
            <div>City: Bear&nbsp;&nbsp;&nbsp;&nbsp;State: DE&nbsp;&nbsp;&nbsp;&nbsp;Zip Code: 19701</div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <v-card
          class="mx-auto"
          height="256px"
        >
          <v-card-text class="text--primary">
            <h3>收费标准</h3>
            <v-divider
              class="mb-3"
            ></v-divider>
            国际转运(运往中国)
            <ul>
              <li>食品保健品以及母婴用品收费$3/lb</li>
              <li>其它品类(一线大牌除外)$5.5/lb</li>
              <li>一线大牌请直接联系客服</li>
            </ul>
            美国境内转运
            <ul>
              <li>转运出仓的包裹收取处理费$8,外加UPS快递的第三方费用</li>
            </ul>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog
      v-model="notifyDialog"
      hide-overlay
      persistent
      width="600"
    >
      <material-card justify="center">
        <v-card-text >
          <strong>{{notifyMsg}}</strong>
          <div class="overline mb-4">{{notifyMsg2}}</div>          
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="notifyDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="notifyDialog = false"
          >
            确认
          </v-btn>
        </v-card-actions>
      </material-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        userName: this.$store.state.user.name,
        storeNm: this.$store.state.user.storage_number,
        balance: this.$store.state.user.balance,
        roles: this.$store.state.user.roles,
        phoneNm: '',
        address: '',
        notifyDialog: false,
        notifyMsg: "通知仓库：我有包裹将于近日抵达仓库地址",
        notifyMsg2: "注意：仓库将在收到您包裹的两日内将包裹信息上传到你的账户下。如果您在包裹显示已签收后的两日内未看到您的包裹，请及时与我们联系",
      }
    },

    methods: {
      jumpToRecipientsList: function(){
        //alert(this.$store.state.user.name);
        this.$router.push({ path: '/recipients' });
      },

      jumpToInvoiceList: function(){
        this.$router.push({ path: '/invoice' });
      },

      jumpToDeposit: function(){
        this.$router.push({ path: '/deposit' });
      },

      jumpToAccountUpgrade: function(){
        
        this.$router.push({ path: '/account/upgrade' });
      },

      notify: function(){
        this.notifyDialog = true;
      },

      getAll: function() {
        this.$http.get('/api/getUserInfoById',{
          params: {
						userId : this.$store.state.user.user_id,
					}
        }).then( (res) => {
          this.phoneNm = res.data[0].user_phone;
          this.address = res.data[0].user_address;
        })
      },

    },

    mounted: function() {
      this.getAll();
		}
  }
</script>

