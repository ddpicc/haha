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
									<td>快递单号</td>
									<td>
										<tr
											v-for="item in userPackage"
										>
											<td style= "cursor:pointer; color:blue"  @click="toChildPackageInfo(item.id)">
												{{item.vendor_tracking_number}}
											</td>
										</tr>
									</td>
								</tr>
								<tr>
									<td>渠道</td>
									<td>{{userPackage[0].vendor}}</td>
									<td>重量(lb)</td>
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
			<v-col cols="12">
        <v-card
          class="mx-auto"
          rounded
        >
					<div class="overline ml-4">商品信息</div>
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
									v-for="item in userPackage"
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
			}
		},

		methods: {
			printBarcode: function(){
        this.$print(this.$refs.print);
      },

			getInfo: function(){
				if(this.packageId < 500){
					this.$http.get('/api/getPackageInfoById',{
            params: {
              packageId : this.packageId,
            }
          }).then( (res) => {
            if(res.data[0].status == '已处理'){
							this.$http.get('/api/searchInfo',{
								params: {
									package_Id : this.packageId,
								}
							}).then( (res) => {
								this.userPackage = res.data;
								jsbarcode(
									'#barcode',
									this.userPackage[0].litlleant_tracking_number,
									{
										displayValue: true // 是否在条形码下方显示文字
									}
								)
							})
						}
					})				
				}else{
					this.$http.get('/api/searchInfoByPackageId',{
						params: {
							package_Id : this.packageId,
						}
					}).then( (res) => {
						this.userPackage = res.data;
						jsbarcode(
              '#barcode',
              this.userPackage[0].litlleant_tracking_number,
              {
                displayValue: true // 是否在条形码下方显示文字
              }
            )
					})
				}				
			},

			toChildPackageInfo: function(id){
				this.$router.push({ path: '/admin/childpackage_info', query: {childPackageId: id}});
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
