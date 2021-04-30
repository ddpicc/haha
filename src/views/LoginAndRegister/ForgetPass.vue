<template>
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
			<v-spacer />

      <v-toolbar-items>
        <v-row
          align="center"
        >
					<v-btn
						text
						to="/login"
					>
						{{ $t('lang.login_menu')}}
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
							<v-stepper v-model="e1">
								<v-stepper-header>
									<v-stepper-step
										:complete="e1 > 1"
										step="1"
									>
										验证信息
									</v-stepper-step>

									<v-divider></v-divider>

									<v-stepper-step
										:complete="e1 > 2"
										step="2"
									>
										设置密码
									</v-stepper-step>
								</v-stepper-header>

								<v-stepper-items>
									<v-stepper-content step="1">
										<v-card
											class="mb-12"
										>
											<v-card-text>
												<v-form ref="verifyCodeForm" lazy-validation>
														请填写注册时预留的手机号码
														<v-col cols="12" class="phone-row">
															<v-select v-model="phoneCode"
																:items="phoneCodeList"
																label="Code"
																dense outlined
																class="phone-row-code"
															></v-select>                      
															<v-text-field 
																outlined dense
																label="手机号码" 
																v-model="phoneNumber"
																:rules="[v => !!v   || 'phone number is required']"
															></v-text-field>
														</v-col>
														<v-col cols="12">
															<div class="captcha-row">
															 <v-text-field outlined dense v-model="verificationCode" class="captcha-input" label="验证码"/>
															 <div v-if="showtime===null" class="captcha-button" @click="send" style="cursor: pointer;">
															  获取验证码
															 </div>
			                           <div v-else class="captcha-button">
			                             {{showtime}}
			                           </div>
			                          </div>
														</v-col>
                    		</v-form>
											</v-card-text>
										</v-card>

										<v-btn
											color="primary"
											@click="nextStep"
										>
											继续
										</v-btn>
									</v-stepper-content>

									<v-stepper-content step="2">
										<v-card
											class="mb-12"
										>
											<v-card-text>
												<v-form ref="registerForm" lazy-validation>
													<v-row>
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
													</v-row>
													<v-row>
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
													</v-row>
                    		</v-form>
											</v-card-text>
										</v-card>

										<v-btn
											color="primary"
											@click="confirm"
										>
											确认
										</v-btn>
									</v-stepper-content>
								</v-stepper-items>
							</v-stepper>
            </v-card-text>
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
</template>

<script>
	import md5 from 'js-md5';
  export default {
    data: () => ({
			snackbar: false,
			snackbarColor: '',
			notification: '',
			snackbarTimeout: 3000,
			e1: 1,
			phoneCode: 'China +86',
			phoneCodeList: ['China +86', 'USA +1'],
			phoneNumber: '',
			verificationCode: '',
			password: '',
			repeatPassword: '',
			timeCounter: null,  // null 则显示按钮 秒数则显示读秒
      showtime: null,
			passwordRules: [
				v => !!v || 'Password is required',
				v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/.test(v) || '至少包含一个大写字母，一个小写字母，一个数字'
			],
			storage_number: '',
		}),
		
		methods: {
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

      send() {
				if(this.$refs.verifyCodeForm.validate()){
					this.countDown(60);
					this.sendCode();
				}
      },
			
			sendCode: function(){
				if(this.phoneNumber == ''){
					alert('请输入注册时预留的电话号码');
					return;
				}
				let phone = this.phoneCode.split(' ')[1] + this.phoneNumber;
        this.$http.get('/api/existUserPhone',{
          params: {
            phone: phone,
          }
        }).then( (res) => {
          if(res.data.length != 0){
						this.storage_number = res.data[0].storage_number;
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
            alert('这个电话号码还没有注册');
          }
        })
      },

			nextStep: function(){
				//验证所有信息
        if(this.verificationCode == ''){
          alert('请输入验证码')
        }
        if(this.$refs.verifyCodeForm.validate()){
          let phone = this.phoneCode.split(' ')[1] + this.phoneNumber;
          this.$http.post('/api/verifyPhoneCode',{
            code: this.verificationCode,
            phoneNm: phone,
          }).then(async (res) => {
            if(res.data.code == 0){
              alert('验证码错误，请重试');
              return;
            }else{
              this.e1 = 2;
            }
          })
        }
			},

			confirm: function(){
				if(this.$refs.registerForm.validate()){
					//alert(this.password);
					let md5Password = md5(this.password);
					this.$http.post('/api/updatePassword',{  
						storage_number: this.storage_number,
						password : md5Password,
					}).then( (res) => {
						this.snackbar = true;
            this.notification = '修改成功';
            this.snackbarColor = 'green';
						setTimeout( () => {this.$router.push({ path: '/login' });},2000);
					})
				}else{
					return;
				}
			}
		}
  }
</script>
<style scoped>
  .phone-row{
    display: flex;
  }
  .captcha-row{
    display: flex;
  }
  .captcha-button{
    background: #048fff;
    color: white;
    display: flex;
    justify-content: center;
    padding: 1% 8%;
    height: 40px;
    border-radius: 4px;

  }


</style>