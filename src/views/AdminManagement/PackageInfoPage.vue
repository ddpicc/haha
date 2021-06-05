<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <v-card
          class="mx-auto"
          rounded
        >
					<div class="overline ml-4">发货单基本信息</div>
					<v-simple-table>
    				<template v-slot:default>
							<tbody class="text-center">
								<tr>
									<td>小蚂蚁单号</td>
									<td>{{userPackage[0].litlleant_tracking_number}}
										<v-btn
											small
											plain
											@click="printBarcode()"
										>
											打印
										</v-btn>
									</td>
									<td>是否分拆</td>
									<td>
										{{isPackageSplit}}
									</td>
								</tr>
								<tr>
									<td>包裹描述</td>
									<td>{{userPackage[0].package_description}}</td>
									<td>包裹备注</td>
									<td>{{userPackage[0].package_comment}}</td>
								<tr>
									<td>渠道</td>
									<td>{{userPackage[0].vendor}}</td>
									<td>总重量(lb)</td>
									<td>{{userPackage[0].total_weight}}</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</v-card>
			</v-col>
			<v-col v-show="false" cols="12">
				<v-card
					class="mx-auto"
					rounded
				>
					<div ref="print"><svg id="barcode"></svg></div>
				</v-card>
			</v-col>
				
			<v-col cols="12">
        <v-card
          class="mx-auto"
          rounded
        >
					<div class="overline ml-4">收件人信息</div>
					<v-simple-table>
    				<template v-slot:default>
							<thead>
								<tr>
									<th class="text-center">
										姓名
									</th>
									<th class="text-center">
										地址
									</th>
									<th class="text-center">
										电话
									</th>
									<th class="text-center">
										身份证
									</th>
								</tr>
							</thead>
							<tbody class="text-center">
								<td>{{userPackage[0].to_name}}</td>
								<td>{{userPackage[0].to_state}}{{userPackage[0].to_city}}{{userPackage[0].to_address}}</td>
								<td>{{userPackage[0].to_phone}}</td>
								<td>{{userPackage[0].to_identity_card}}</td>
							</tbody>
						</template>
					</v-simple-table>
				</v-card>
			</v-col>
			<v-col v-for="item in userPackage" cols="12">
        <v-card
          class="mx-auto"
          rounded
        >
					<div class="overline ml-4">分包裹信息</div>
					<v-simple-table>
    				<template v-slot:default>
							<tbody class="text-center">
								<tr>
									<td>单号</td>
									<td>{{item.child_tracking_number}}
									</td>
									<td>面单单号</td>
									<td>
										{{item.vendor_tracking_number}}
									</td>
								</tr>
								<tr>
									<td>邮袋组</td>
									<td>{{item.bag_id}}</td>
									<td>重量</td>
									<td>{{item.weight}}</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
					<v-simple-table>
    				<template v-slot:default>
							<thead>
								<tr>
									<th class="text-center">
										名称
									</th>
									<th class="text-center">
										品牌
									</th>
									<th class="text-center">
										数量
									</th>
									<th class="text-center">
										单价
									</th>
								</tr>
							</thead>
							<tbody class="text-center">
								<tr
									
								>
									<td>{{item.item_name}}</td>
									<td>{{item.brand}}</td>
									<td>{{item.unit}}</td>
									<td>{{item.price}}</td>
								</tr>
							</tbody>
						</template>
					</v-simple-table>
				</v-card>
			</v-col>
			<v-col cols="12" class="d-inline-flex justify-end">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="goback">返回</v-btn>
      </v-col>
		</v-row>
	</v-container>
</template>

<script>
	import jsbarcode from 'jsbarcode'
	export default {
		data () {
      return {
				userPackage: [],
				packageId: '',
				isPackageSplit: '整个包裹',
			}
		},

		methods: {
			printBarcode: function(){
        this.$print(this.$refs.print);
      },

			getInfo: function(){
					this.$http.get('/api/searchInfoByPackageId',{
						params: {
							package_Id : this.packageId,
						}
					}).then( (res) => {
						this.userPackage = res.data;
						if(this.userPackage.length > 1){
							this.isPackageSplit = '分拆包裹';
						}
						jsbarcode(
              '#barcode',
              this.userPackage[0].litlleant_tracking_number,
              {
                displayValue: true // 是否在条形码下方显示文字
              }
            )
					})
			
			},

			goback: function(){
				this.$router.push({ path: '/finishpackage_list' });
			}
		},

		mounted: function() {
			this.getInfo();
    },

    created() {
			this.packageId = this.$route.query.packageId;
    },

  }
</script>
