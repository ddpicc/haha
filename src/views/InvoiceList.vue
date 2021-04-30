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
							交易记录
							<v-chip
								class="ml-8"
								@click="loadAll"
								v-if="isSuperAdmin"
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
							</v-list-item-action>
						</v-list-item>
					</v-list>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
			invloceList: [],
			isSuperAdmin: 0,
		}),

		methods: {
			getAll: function() {
        this.$http.get('/api/getInvoiceByUser',{
					params: {
						user_sotrageNm : this.$store.state.user.storage_number,
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
			
			loadAll: function(){
				this.$http.get('/api/getAllInvoices',{
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
			this.$http.get('/api/getUserInfoById',{
        params: {
          userId : this.$store.state.user.user_id,
        }
      }).then( (res) => {
        this.isSuperAdmin = res.data[0].is_superadmin;
      })
		}
	}
</script>