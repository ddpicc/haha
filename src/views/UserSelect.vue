<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
			<v-col
				cols="12"
				sm="12"
				md="8"
			>
				<v-card
					class="mx-auto"
				>
					<v-card-text>
						<v-radio-group
							v-model="userType"
							mandatory
							dense
						>
							<v-simple-table width="600" class="planDetail">
								<tbody>
									<tr>
										<td>
										</td>
										<td>
											基础客户
										</td>
										<td>
											进阶客户
										</td>
									</tr>
									<tr>
										<td>
											费用
										</td>
										<td>
											免费
										</td>
										<td>
											<div class="overline" style="text-decoration:line-through">$10每月</div>
											<b>限时免费</b>
										</td>
									</tr>
									<tr>
										<td>
											整箱转运-美国境内物流
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
									</tr>
									<tr>
										<td>
											整箱转运-中美国际物流
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
									</tr>
									<tr>
										<td>
											线上订单管理
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
									</tr>
									<tr>
										<td>
											订单全程透明跟踪
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
									</tr>
									<tr>
										<td>
											货物30天免费仓储
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/red x.png"/>
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
									</tr>
									<tr>
										<td>
											分箱/合箱境内物流
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/red x.png"/>
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
									</tr>
									<tr>
										<td>
											分箱/合箱国际物流
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/red x.png"/>
										</td>
										<td>
											<v-img height="30" width="30" src="../assets/green check.png"/>
										</td>
									</tr>
									<tr>
										<td>
											是否需要提供货物在抵达仓库前的第三方快递单号
										</td>
										<td>
											需要
										</td>
										<td>
											不需要
										</td>
									</tr>
									<tr>
										<td>

										</td>
										<td>
											<v-radio
												:disabled='defaultReadonly()'
												:label="defaultText()"
												value="defaultUser"
											></v-radio>
										</td>
										<td>
											<v-radio
												:disabled='premiumReadonly()'
												:label="premiumText()"
												value="premiumUser"
											></v-radio>
										</td>
									</tr>
								</tbody>
							</v-simple-table>
						</v-radio-group>
						<v-btn
							block
							@click="selectPlan"
							color="blue"
						>
							更改
						</v-btn>
					</v-card-text>
				</v-card>
			</v-col>
    </v-row>
		<v-dialog
			v-model="planComfirm"
			width="500"
		>
			<v-card>
				<v-card-text>
					<p class="display-1 text--primary">
						{{dialogText1}}
					</p>
					<p class="text--primary">
						{{dialogText2}}
					</p>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						text
						@click="planComfirm = false"
					>
						取消
					</v-btn>
					<v-btn
						color="primary"
						text
						@click="selectSure()"
					>
						确定
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>
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
</template>

<script>
	import { getNowFormatDate } from '../utils/helpFunction';
  export default {
    data: () => ({
			snackbar: false,
			snackbarColor: '',
			notification: '',
			snackbarTimeout: 3000,
			userType: '',
			planComfirm: false,
			dialogText1: '',
			dialogText2: '',
		}),
		
		methods: {
			selectPlan: function(){
        this.planComfirm = true;
        if(this.userType == 'defaultUser'){
          this.dialogText1 = '更改为普通账户';
          this.dialogText2 = '即将配置账户，是否确定？';
        }else{
          this.dialogText1 = '更改为进阶账户';
          this.dialogText2 = '进阶账户每月自动扣除费用0美元(限时免费活动中)，享受我们提供的一些增值服务，是否确定？';
        }
      },
			
			selectSure: function(){
				let _role = '';
        if(this.userType == 'defaultUser'){
          _role = 'default';
        }else{
          _role = 'premium';
        }
        this.$http.post('/api/updateUserRole',{
          role : _role,
          storage_number : this.$store.state.user.storage_number,
          startDate: getNowFormatDate(),
        }).then((res) => {
          this.snackbar = true;
					this.notification = '账户配置成功，返回主界面';
					this.snackbarColor = 'green';
					setTimeout( () => {this.$router.push({ path: '/login' });},2000);
        })
      },

			defaultText: function(){
				if(this.$store.state.user.roles == 'default'){
					return '当前类型';
				}else{
					return '选择';
				}
			},

			premiumText: function(){
				if(this.$store.state.user.roles == 'default'){
					return '选择';
				}else{
					return '当前类型';
				}
			},

			defaultReadonly: function(){
				if(this.$store.state.user.roles == 'default'){
					return true;
				}else{
					return false;
				}
			},

			premiumReadonly: function(){
				if(this.$store.state.user.roles == 'default'){
					return false;
				}else{
					return true;
				}
			},
			
    },

		mounted: function() {
			if(this.$store.state.user.roles == 'default'){
				this.userType = 'defaultUser';
			}else{
				this.userType = 'premiumUser';
			}
		}
  }
</script>
<style scoped>
  .planDetail{
    border: 1px solid #000000;
  }
  .planDetail td{
    border: 1px solid #000000;
  }
</style>