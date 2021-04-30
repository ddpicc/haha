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
					<div class="overline ml-4">快递单基本信息</div>
					<v-simple-table>
    				<template v-slot:default>
							<tbody class="text-center">
								<tr>
									<td>快递单号</td>
									<td>{{childPackage[0].vendor_tracking_number}}</td>
									<td>发货单号</td>
									<td style= "cursor:pointer; color:blue" @click="toLtaInfo">{{childPackage[0].litlleant_tracking_number}}</td>
								</tr>
								<tr>
									<td>渠道</td>
									<td>{{childPackage[0].vendor}}</td>
									<td>重量</td>
									<td>{{childPackage[0].weight}}</td>
								</tr>
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
								<td>{{childPackage[0].to_name}}</td>
								<td>{{childPackage[0].to_state}}{{childPackage[0].to_city}}{{childPackage[0].to_address}}</td>
								<td>{{childPackage[0].to_phone}}</td>
								<td>{{childPackage[0].to_identity_card}}</td>
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
									v-for="item in childPackage"
									:key="item.id"
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
		</v-row>
	</v-container>
</template>

<script>
	export default {
		data () {
      return {
				childPackageId: '',
				childPackage: [],
			}
		},

		methods: {
			getInfo: function(){
				this.$http.get('/api/searchInfoByChildPackageId',{
					params: {
						childPackage_Id : this.childPackageId,
					}
				}).then( (res) => {
					this.childPackage = res.data;
				})
			},

			toLtaInfo: function(){
				this.$router.push({ path: '/admin/package_info', query: {packageId: this.childPackage[0].litlleant_package_id}});
			}
		},

		mounted: function() {
			this.getInfo();
    },

    created() {
      this.childPackageId = this.$route.query.childPackageId;
    },

  }
</script>
