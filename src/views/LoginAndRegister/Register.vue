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
                  <v-col cols="12" sm="6" md="6">
                    <v-form 
                    ref="registerForm"
                    lazy-validation>
                      <v-col>
                        <v-text-field
                          outlined dense 
                          label="用户邮箱"
                          prepend-inner-icon="mdi-account"
                          v-model="loginEmail"
                          :rules="emailRules"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-text-field
                          outlined dense 
                          label="密码"
                          prepend-inner-icon="mdi-lock"
                          type="password"
                          v-model="password"
                          :rules="passwordRules"
                        />
                      </v-col>
                      <v-col>
                        <v-text-field
                          outlined dense 
                          label="重复密码"
                          prepend-inner-icon="mdi-lock"
                          type="password"
                          v-model="repeatPassword"
                          :rules="[v => v == this.password || '两次输入的密码不一致']"
                        />
                      </v-col>
                    </v-form>
                  </v-col>
                  <v-col cols="12" sm="6" md="6">
                    <v-form ref="verifyCodeForm" lazy-validation>
                      <v-col cols="12">
                        <v-text-field outlined dense label="姓名*" v-model="usertName" :rules="[v => !!v || 'username is required']"></v-text-field>
                      </v-col>
                      <v-col cols="12" class="phone-row">
                        <v-select v-model="phoneCode"
                          :items="phoneCodeList"
                          label="Code"
                          dense outlined
                          class="phone-row-code"
                        ></v-select>                      
                        <v-text-field 
                          outlined dense
                          label="手机号码*" 
                          v-model="phoneNumber"
                          :rules="[v => !!v   || 'phone number is required']"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <div class="captcha-row">
                         <v-text-field outlined dense v-model="verificationCode" class="captcha-input" label="验证码"/>
                         <div v-if="showtime===null" class="captcha-button" @click="openVerifyDialog" style="cursor: pointer;">
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
    <v-dialog
      v-model="verifyDialog"
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">获取验证码</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-select
                  v-model="verifyMethod"
                  :items="methods"
                  label="验证方式"
                  outlined
                ></v-select>
                <small>国内手机号有时会收不到短信验证码，请选用邮箱验证</small>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="send"
          >
            确认
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
        showtime: null,
        verifyDialog: false,
        verifyMethod: '手机验证',
        methods: ['邮箱验证','手机验证']
      }
    },

    methods: {
      sendCode: function(){
        let phone = this.phoneCode.split(' ')[1] + this.phoneNumber;
        if(this.verifyMethod == '邮箱验证'){
          this.$http.get('/api/sendMailCode',{
            params: {
              phoneNm : phone,
              email: this.loginEmail,
            }
          }).then((res) => {
            if(res.data.code == 1){
              this.snackbar = true;
              this.notification = res.data.msg;
              this.snackbarColor = 'green';
            }
          });
        }else{
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
        }
      },

      getUseableStorageNm: function(){
        var storage_nm = randChar(5);
        return new Promise (( resolve, reject) => {
          this.$http.get('/api/existStorageNumber',{
            params: {
              storage_number: storage_nm,
            }
          }).then( (res) => {
            if(res.data.length === 0){
              resolve(storage_nm);
            }else{
              this.getUseableStorageNm();
            }
          }).catch(function (error) {
            console.log(error);
            reject(error);
          });
        })
      },

      registerClick: async function(){
        //验证所有信息
        if(this.verificationCode == ''){
          alert('请输入验证码')
        }
        if(this.$refs.registerForm.validate()){
          let phone = this.phoneCode.split(' ')[1] + this.phoneNumber;
          this.$http.get('/api/existUserEmailOrPhone',{
            params: {
              email : this.loginEmail,
              phone: phone,
            }
          }).then( (res) => {
            if(res.data.length === 0){
              this.$http.post('/api/verifyPhoneCode',{
                code: this.verificationCode,
                phoneNm: phone,
              }).then(async (res) => {
                if(res.data.code == 0){
                  alert('验证码错误，请重试');
                  return;
                }else{
                  let storage_number = await this.getUseableStorageNm();
                  let md5Password = md5(this.password);
                  this.$http.post('/api/registerUser',{  
                    storage_number: storage_number,
                    email : this.loginEmail,
                    password : md5Password,
                    token : generateUniqueString(),
                    role : 'default',
                    name : this.usertName,
                    phoneNm : phone,
                  }).then( (res) => {
                    this.snackbar = true;
                    this.notification = '注册成功';
                    this.snackbarColor = 'green';
                    setTimeout( () => {this.$router.push({ path: '/register/selectplan', params: {storage_number: storage_number} });},2000);
                  })
                }
              })
            }else{
              alert('这个手机号码已经存在');
            }
          })
        }
      },

      jumpHome: function(){
        this.$router.push({ path: '/' });
      },

      countDownText(s) {
        this.showtime = `${s}s后重新获取`;
      },

      countDown(times){
        const self = this;
        const interval = 1000;
        let count = 0;
        self.timeCounter = setTimeout(countDownStart, interval);
        function countDownStart() {
          if(self.timeCounter == null){
            return false;
          }
          count++;
          self.countDownText(times - count + 1);
          if(count > times){
            clearTimeout(self.timeCounter);
            self.showtime = null;
          }else{
            self.timeCounter = setTimeout(countDownStart, interval);
          }
        }
      },

      openVerifyDialog: function(){
        if(this.$refs.registerForm.validate()){
          if(this.$refs.verifyCodeForm.validate()){
            let phone = this.phoneCode.split(' ')[1] + this.phoneNumber;
            this.$http.get('/api/existUserEmailOrPhone',{
              params: {
                email : this.loginEmail,
                phone: phone,
              }
            }).then( (res) => {
              if(res.data.length != 0){
                alert('这个手机号码或邮箱已经存在');
              }else{
                this.verifyDialog = true;
              }
            })            
          }
        }        
      },

      send() {
        this.verifyDialog = false;
        this.countDown(60);
        this.sendCode();
      }

    }
  }
</script>

<style scoped>
  .phone-row{
    display: flex;
  }
  .phone-row-code{
    width: 25%;
  }
  .captcha-row{
    display: flex;
  }
  .captcha-button{
    background: #048fff;
    color: white;
    display: flex;
    justify-content: center;
    padding: 4px 4px;
    height: 40px;
    border-radius: 4px;

  }


</style>