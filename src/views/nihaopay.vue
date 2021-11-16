<template>
    <div class="pay" v-loading="loading">
    </div>
</template>
 
<script>	
import { generateUniqueString } from '../utils/helpFunction';
export default {
    data(){
      return {
 				loading: true
      }
    },
   	mounted(){
			const token = 'd331f10372be352ac16731c387a3477c0afae036c139a5ea2fe2d55fe62adc10';
			let vendor = 'WechatPay';
			if(this.$route.params.method == 'Nihao Pay(银联支付)'){
			//if(this.$route.query.method == 'Nihao Pay(支付宝支付)'){
				vendor = 'Unionpay';
			}
			let payData = {
				//'amount': this.$route.query.amount,
				'amount': this.$route.params.amount,
				'currency': 'USD',
				'vendor': vendor,
				'reference': generateUniqueString().toUpperCase(),
				'ipn_url': 'https://www.thelittleant.com/api/depositNotify',
				'callback_url': 'https://www.thelittleant.com/#/deposit',
				'note': this.$route.params.storageNm,
			}
			let that = this;
			this.$http.post('/payapi/transactions/securepay',payData,
			{
				headers: {
					'Authorization': 'Bearer ' + token,
				}
			}).then(function (response) {
				that.loading = false;
				that.payUrl = response.data;
				document.write(that.payUrl)
			}).catch(function (error) {
				console.log(error);
				that.loading = false;
			});
    },
    methods:{
    },
}
</script>
 
<style scoped>
.pay{
	width: 100%;
	height: 100%;
}
</style>