<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col
				cols="12"
				sm="8"
				md="8"
			>
        <v-card class="mx-auto">
					<v-col>
						目前国内充值渠道不稳定，充值请联系客服<br>
						quickpay或者paypal到账号admin@thelittleant.com
					</v-col>
					<v-row>
						<v-col cols="3">
							<v-subheader>充值账户</v-subheader>
						</v-col>
						<v-col cols="8">
							<v-text-field
								label="名称"
								:value="accountStr()"
								readonly
							></v-text-field>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="3">
							<v-subheader>自定义金额$</v-subheader>
						</v-col>
						<v-col cols="8">
							<v-text-field
								label="金额"
								v-model="depositAmount"
								suffix="美元"
								@focus="focus($event)"
							></v-text-field>
						</v-col>
					</v-row>

					<v-row>
						<v-col cols="3">
							<v-subheader>支付方式</v-subheader>
						</v-col>
						<v-col cols="8">
							<v-select v-model="paymentMethod" 
								:items="paymentMethodList"
							></v-select>
						</v-col>
					</v-row>
					<v-card-actions>
						<v-btn block color="blue" @click.stop="deposit()">点击充值</v-btn>
					</v-card-actions>
        </v-card>
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
    data: () => ({
			paymentMethodList: ['Nihao Pay(微信支付)', 'Nihao Pay(银联支付)'],
			paymentMethod: 'Nihao Pay(微信支付)',
			depositAmount: 0,
			snackbar: false,
			snackbarColor: '',
			notification: '',			
		}),

		methods:{
			focus(event) {
        event.currentTarget.select();
			},

			accountStr: function(){
				return this.$store.state.user.name + '  (' + this.$store.state.user.storage_number + ')';
			},

			checkIsNumber: function(val) {
		　　if (parseFloat(val).toString() == "NaN") {		　　　　
					return false;
				} else {
					return true;
				}
			},

			deposit: function(){
				/* let routerData = this.$router.resolve({path:'/payit',
					query:{
						amount: this.depositAmount,
						method: this.paymentMethod,
					}
				});
				window.open(routerData.href,'_blank'); */
				if(this.checkIsNumber(this.depositAmount)){
					this.$router.push({ name: 'nihaoPay', params: 
						{
							amount: this.depositAmount * 100,
							method: this.paymentMethod,
							storageNm: this.$store.state.user.storage_number,
						}
					});
				}else{
					alert('请输入有效数字');
				}
				
			}
		},
		mounted() {
			if(this.$route.query.status === 'success'){
				this.snackbar = true;
				this.notification = '充值成功';
				this.snackbarColor = 'green';
			}
		}
	}
</script>