<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
			<v-col cols="4">
        <material-card>
					<div class="overline mb-4">
						交易记录(默认显示最近500条交易记录)
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
					<v-radio-group
						v-model="type"
						row
					>
						<v-radio
							label="充值"
							value="deposit"
						></v-radio>
						<v-radio
							label="运费"
							value="charge"
						></v-radio>
						<v-radio
							label="全部"
							value="all"
						></v-radio>
					</v-radio-group>
					<v-autocomplete
						outlined
						label="用户"
						:items="cacheAllUser"
						:filter="customFilter"
						clearable
						chips
						:item-text="displayText"
						item-value="storage_number"
						v-model="selectedUser"
						multiple
						dense
					>
					<template v-slot:item="data">
						<template>
							<v-list-item-content>
								<v-list-item-title>{{data.item.storage_number}}</v-list-item-title>
								<v-list-item-subtitle>
									姓名: {{data.item.name}}&nbsp;&nbsp;&nbsp;&nbsp;电话: {{data.item.user_phone}}&nbsp;&nbsp;&nbsp;&nbsp;邮箱: {{data.item.email}}
								</v-list-item-subtitle>
							</v-list-item-content>
						</template>
					</template>
					</v-autocomplete>
					<v-col cols="12" class="d-inline-flex justify-end">
						<v-btn color="blue" text @click="confirmSearch">确定</v-btn>
					</v-col>
				</material-card>
			</v-col>
      <v-col cols="8">
        <material-card>
					<v-list
						subheader
						two-line
					>
						<div class="overline mb-4">
							交易记录
						</div>

						<v-list-item
							v-for="invoice in invoiceList"
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

								<v-list-item-subtitle v-html="getText(invoice)"></v-list-item-subtitle>
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
  export default {
    data: () => ({
			invoiceList: [],
			backupList: [],
			type: 'all',
			cacheAllUser: [],
      selectedUser: '',
		}),

		methods: {
			getText: function(invoice){
				let str = '';
				if(invoice.invoice_type == '充值'){
					str = str + ' -- ' + invoice.user_sotrageNm + ' -- ' + invoice.created_at;
					str = str + '</br>' + invoice.memo;
				}else{
					str = invoice.tracking_number + ' -- ' + invoice.user_sotrageNm + ' -- ' + invoice.created_at;
					str = str + '</br>' + invoice.memo;
				}
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
			
			load500Invoices: function(){
				this.$http.get('/api/invoice/getAllInvoices500Limits').then( (res) => {
          this.invoiceList = res.data;
					this.backupList = this.invoiceList;
        })
			},

			loadAll: function(){
				this.$http.get('/api/invoice/getAllInvoices').then( (res) => {
          this.invoiceList = res.data;
					this.backupList = this.invoiceList;
        })
			},

			confirmSearch: function(){
				this.invoiceList = this.backupList;
				let _type = '';
				if(this.type == 'deposit'){
					_type = '充值';
				}else if(this.type == 'charge'){
					_type = '运费';
				}else{
					_type = 'all';
				}
				if(_type != 'all'){
					this.invoiceList = this.invoiceList.filter((item) => {
						return item.invoice_type == _type;
					})
				}
				if(this.selectedUser.length != 0){
					let resultList = [];
					for(let _storageNm of this.selectedUser){
						resultList = resultList.concat(
							this.invoiceList.filter((item) => {
								return item.user_sotrageNm == _storageNm;
							})
						)
					}
					this.invoiceList = resultList;
				}
				
			},

			typeChanged: function(type){
				this.invoiceList = this.backupList;
				let _type = '';
				if(type == 'deposit'){
					_type = '充值';
				}else if(type == 'charge'){
					_type = '运费';
				}else{
					_type = '';
					return;
				}
				this.invoiceList = this.invoiceList.filter((item) => {
          return item.invoice_type == _type;
        })
			},

			displayText: function(item){
        return item.storage_number + ' (' + item.name  + '    ' + item.email + ')';
      },

			customFilter (item, queryText, itemText) {
        const hasValue = val => val != null ? val : '';
        const query = hasValue(queryText).toUpperCase();

        //if(queryText.length < 2) return false;
        const textOne = item.storage_number;
        return textOne.indexOf(query) > -1;
      },

			getAllUser: function(){
        this.$http.get('/api/getAllUser').then( (res) => {
          this.cacheAllUser = res.data;
        })
      }
		},

		mounted: function(){
			this.load500Invoices();
			this.getAllUser();
		}
	}
</script>