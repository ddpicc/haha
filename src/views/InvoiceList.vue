<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
					<v-list
						subheader
						two-line
					>
						<div class="overline mb-4">
							交易记录(默认显示最近7天的交易记录)
							<v-chip
								class="ml-8"
								@click="loadAll"
							>
								<v-icon left>
									mdi-sync
								</v-icon>
								读取全部
							</v-chip>
						</div>

						<v-list-item
							v-for="invoice in invloceList"
							:key="invoice.id"
						>
							<v-list-item-avatar>
								<v-icon
									class="grey lighten-1"
									dark
								>
									mdi-receipt
								</v-icon>
							</v-list-item-avatar>

							<v-list-item-content>
								<v-list-item-title v-text="invoice.invoice_type"></v-list-item-title>

								<v-list-item-subtitle v-text="getText(invoice)"></v-list-item-subtitle>
							</v-list-item-content>

							<v-list-item-action>
								{{invoice.total}}元
								<span v-text="balanceText(invoice)"></span>
							</v-list-item-action>
						</v-list-item>
					</v-list>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
	import { dateToString } from '../utils/helpFunction';
  export default {
    data: () => ({
			invloceList: [],
			isSuperAdmin: 0,
		}),

		methods: {
			getAll: function() {
				var end = dateToString(new Date());
        var start = dateToString(new Date(new Date().setDate(new Date().getDate()-6)));
        this.$http.get('/api/invoice/getInvoiceByUserDateRange',{
					params: {
						user_sotrageNm : this.$store.state.user.storage_number,
						startDate: start,
						endDate: end,
					}
				}).then( (res) => {
          this.invloceList = res.data;
        })
			},

			getText: function(invoice){
				let str = '';
				if(invoice.invoice_type == '充值'){
					str = str + invoice.created_at;
				}else{
					str = invoice.tracking_number + ' -- ' + invoice.created_at;
				}
				if(this.isSuperAdmin)
					str = str + ' ------- ' + invoice.user_sotrageNm + ' (' + invoice.memo + ')';
				return str;
			},

			balanceText: function(invoice) {
				if(invoice.prev_balance == 0){
					return '';
				}
				let str = '余额: '
				let balance = invoice.prev_balance + invoice.total;
				str = str + balance + '元'
				return str;
			},
			
			loadAll: function(){
				this.$http.get('/api/invoice/getAllInvoiceByUser',{
					params: {
						user_sotrageNm : this.$store.state.user.storage_number,
					}
				}).then( (res) => {
          this.invloceList = res.data;
        })
			}
		},

		mounted: function(){
			this.getAll();
		}
	}
</script>