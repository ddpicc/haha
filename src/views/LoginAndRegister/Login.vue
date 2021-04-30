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
            md="4"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <p class="display-1 text--primary text-center">
                  {{$t('lang.login_title')}}
                </p>
                <p class="subtitle-1 text--primary text-center">
                  {{$t('lang.home')}}
                </p>
                <p class="caption text--primary text-center">
                  {{$t('lang.login_subtitle')}}
                </p>
                <v-form>
                  <v-text-field
                    solo
                    :label="$t('lang.login_email')"
                    :rules="emailRules"
                    prepend-inner-icon="mdi-account"
                    v-model="loginEmail"
                  ></v-text-field>
                  <v-text-field
                    solo
                    :label="$t('lang.login_password')"
                    :rules="[v => !!v || 'Password is required']"
                    prepend-inner-icon="mdi-lock"
                    type="password"
                    v-model="password"
                    @keyup.enter.native="loginClick"
                  />
                  <v-card-actions>
                    <v-btn block color="blue" @click.stop="loginClick">{{$t('lang.login_menu')}}</v-btn>
                  </v-card-actions>
                  <v-row>
                    <v-col cols="6">
                      {{$t('lang.login_notMember')}}
                      <router-link to="register" style="color:red">{{$t('lang.login_register')}}</router-link>
                    </v-col>
                    <v-col cols="6" class="d-inline-flex justify-end">
                      <router-link to="forgetPass" style="color:red">{{$t('lang.login_forgetPassword')}}</router-link>   
                      <!--a href="http://www.w3school.com.cn/" style="color:red">{{$t('lang.login_forgetPassword')}}</a -->
                    </v-col>
                  </v-row>
                </v-form>
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
  </div>
</template>

<script>
  import md5 from 'js-md5';
  export default {
    data () {
      return {
        loginEmail: '',
        password: '',
        phoneNumber: '',
        tab: null,
        loginBtnName: "登录",
        snackbar: false,
        snackbarColor: '',
        notification: '',
        snackbarTimeout: 3000,
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        ]
      }
    },

    methods: {
      loginClick: function(){
        if (this.loginEmail === '' || this.password === '') {
          alert('账号或密码不能为空');
        } else {
          let md5Password = md5(this.password);
          var userInfo = {username: this.loginEmail, password: md5Password};
          this.$store.dispatch('user/LoginByEmail', userInfo).then(() => {
            this.snackbar = true;
            this.notification = '登录成功';
            this.snackbarColor = 'green';
            
            this.$router.push({ path: '/dashboard' });
          }).catch(err => {
            this.snackbar = true;
            this.notification = '连接错误，请重试';
            console.log(err);
          });
        }         
      },

      jumpHome: function(){
        this.$router.push({ path: '/' });
      }
    }
  }
</script>