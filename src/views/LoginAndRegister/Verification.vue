<template>
  <div id="app">
   <v-app light>
    <v-app-bar
      app
      color="white"
      height="50"
    >
      <v-avatar
        class="mr-3"
        color="grey lighten-5"
        size="50"
      >
        <v-img
          contain
          max-height="100%"
          src="../../assets/logo1.png"
          @click.stop="jumpHome"
        ></v-img>
      </v-avatar>
    	<v-spacer/>

      <v-toolbar-items>
        <v-row
          align="center"
          class="mx-0"
        >
          <v-btn
            text
            to="/login"
          >
            已有账号? 直接登录
          </v-btn>
        </v-row>
      </v-toolbar-items>

    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="8"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <p class="title text--primary text-center">
                  用户注册
                </p>
                <v-row>
                  <v-col cols="12">
                    <v-form ref="verifyCodeForm" lazy-validation>
                      <v-col cols="12">
                        <v-radio-group
													v-model="row"
													row
													>
													<v-radio
														label="Option 1"
														value="radio-1"
													></v-radio>
													<v-radio
														label="Option 2"
														value="radio-2"
													></v-radio>
												</v-radio-group>
                      </v-col>
                      <v-col cols="12">
                        <div class="captcha-row">
                         <v-text-field outlined v-model="verificationCode" class="captcha-input" label="验证码"/>
                         <div v-if="showtime===null" class="captcha-button" @click="send" style="cursor: pointer;">
                          获取验证码
                         </div>
                           <div v-else class="captcha-button">
                             {{showtime}}
                           </div>
                          </div>
                      </v-col>
                    </v-form>
                  </v-col>
                </v-row>
              </v-card-text> 
              <v-card-actions>
                <v-btn block color="blue" @click.stop="registerClick">立即注册</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          :timeout="snackbarTimeout"
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
    </v-content>
  </v-app>
  </div>
</template>

<script>
  import { generateUniqueString, randChar } from '../../utils/helpFunction';
  import md5 from 'js-md5';
  export default {
    data () {
      return {
        loginEmail: '',
        password: '',
        repeatPassword: '',
        usertName: '',
        phoneCode: 'China +86',
        phoneCodeList: ['China +86', 'USA +1'],
        phoneNumber: '',
        verificationCode: '',
        snackbar: false,
        snackbarColor: '',
        notification: '',
        snackbarTimeout: 3000,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(v) || '至少包含一个大写字母，一个小写字母，一个数字'
        ],
        timeCounter: null,  // null 则显示按钮 秒数则显示读秒
        showtime: null
      }
    },

    methods: {
      sendCode: function(){
        let phone = this.phoneCode.split(' ')[1] + this.phoneNumber;
        this.$http.get('/api/existUserPhone',{
          params: {
            phone: phone,
          }
        }).then( (res) => {
          if(res.data.length === 0){
            this.$http.get('/api/sendPhoneCode',{
              params: {
                phoneNm : phone,
              }
            }).then((res) => {
              if(res.data.code == 1){
                this.snackbar = true;
                this.notification = res.data.msg;
                this.snackbarColor = 'green';
              }
            });
          }else{
            alert('这个手机号码已经存在');
          }
        })
      },
    }
  }
</script>

<style scoped>
  .captcha-row{
    display: flex;
  }
  .captcha-button{
    background: #048fff;
    color: white;
    display: flex;
    justify-content: center;
    padding: 20px 20px;
    height: 40px;
    border-radius: 4px;

  }


</style>