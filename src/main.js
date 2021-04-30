import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins'
import './login.js'
import vuetify from './plugins/vuetify'
import Print from './utils/print'
import i18n from './plugins/vueI18n'
import { sync } from 'vuex-router-sync'


sync(store, router)

Vue.config.productionTip = false;
Vue.use(Print);

new Vue({
  router,
  store,
  i18n,
  vuetify,
  render: h => h(App)
}).$mount('#app')
