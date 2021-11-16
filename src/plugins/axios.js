import Vue from 'vue'
import Cookies from 'js-cookie'

// Lib imports
import axios from 'axios'

axios.interceptors.request.use(config => {
  const token = Cookies.get('Admin-Token');
	if(token){
		config.headers.Authorization = token;
	}
	return config;
})

Vue.prototype.$http = axios
