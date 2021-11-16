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
      <v-text-field
          solo-inverted
          flat
          hide-details
          label="请输入运单号进行查询"
          prepend-inner-icon="mdi-magnify"
          v-model="queryPackageNm"
          @click:prepend-inner="packageTrack"
          @keyup.enter.native="packageTrack"
        ></v-text-field>
        <v-card class="mx-auto">
					<div v-if="displayTackingInfo" class="trackingSection">
						<h2
							class="font-weight-black mt-4 mb-4 text-center"
							v-text="trackingInfo.title"
						></h2>

						<div v-for="historyLine in trackingInfo.statusList"
							:key="historyLine.key"
							class="title font-weight-light mb-5 text-center"
							v-html="historyLine"
						></div>
					</div>
        </v-card>
    	</v-col>
		</v-row>
	</v-container>
</template>

<script>
  export default {
    data () {
      return {
				queryPackageNm: '',
        displayTackingInfo: false,
        trackingInfo: {
          title: '运单信息',
          statusList: []
				}
			}
		},

		methods: {
			packageTrack: function(){
        this.displayTackingInfo = true;
        this.trackingInfo.statusList = [];
        if(!this.queryPackageNm){
          return;
        }

        this.$http.get('/api/existUserPackageByLittleAntTracking',{
          params: {
            littleant_tracking: this.queryPackageNm,
          }
        }).then( (res) => {
          if(res.data.length === 0){
            this.trackingInfo.statusList.push('运单不存在');
          }else{
            let lta_id = '';
            //运单存在，先获取运单所在的batch
            this.trackingInfo.statusList.push('运单已创建，等待库房处理');
            if(res.data[0].finishprocess_time != null){
              this.trackingInfo.statusList.push('库房正在处理 (' + res.data[0].finishprocess_time + ')');
              this.trackingInfo.statusList.push('库房打包完成 (' + res.data[0].finishprocess_time + ')');
            }
            if(res.data[0].to_country_code === 'USA +1'){
              lta_id = res.data[0].id;
              this.$http.get('/api/getVendorTracking',{
                params: {
                  package_id : lta_id,
                }
              }).then( (res) => {
                this.trackingInfo.statusList.push('包裹已交付' + res.data[0].vendor + ' (' + res.data[0].vendor_tracking_number + ')');
              })
            }else{
              this.$http.get('/api/getMailBagStatusByLtaTracking',{
                params: {
                  lta_tracking : this.queryPackageNm,
                }
              }).then( (res) => {
                let displayChildOrder = false;
                lta_id = res.data[0].id;
                if(res.data[0].sendOut_at != null){
                  this.trackingInfo.statusList.push('扫入邮袋，送往机场，等待起飞 (' + res.data[0].sendOut_at + ')');
                }
                if(res.data[0].flyToChina_at != null){
                  this.trackingInfo.statusList.push('包裹发往中国 (' + res.data[0].flyToChina_at + ')');
                }
                if(res.data[0].beginCustomerClear_at != null){
                  this.trackingInfo.statusList.push('包裹到达海关，开始清关 (' + res.data[0].beginCustomerClear_at + ')');
                  displayChildOrder = true;
                }
                if(res.data[0].customerFinish_at != null){
                  this.trackingInfo.statusList.push('清关完成，开始配送 (' + res.data[0].customerFinish_at + ')');                  
                }
                
                //展示所有的child order
                if(displayChildOrder){
                  for(let item of res.data){
                    if(item.vendor_tracking_number){
                      this.trackingInfo.statusList.push('国内快递单号 (' + "<a href='https://www.baidu.com/s?wd=" + item.vendor_tracking_number + "'" + "style='color:red' target='_blank'>" + item.vendor_tracking_number + '</a>' + ')');
                    }                    
                  }
                }              

                /* if(result.data.waybill_list[0].express_tracking_number){
                  this.trackingInfo.statusList.push('国内快递单号 (' + "<a href='https://www.baidu.com/s?wd=" + result.data.waybill_list[0].express_tracking_number + "'" + "style='color:red' target='_blank'>" + result.data.waybill_list[0].express_tracking_number + '</a>' + ')');
                } */
              })
            }            
          }
        })
        
        
      }
    },
  }
</script>
