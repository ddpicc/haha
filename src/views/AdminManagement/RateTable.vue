<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row>
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-spacer></v-spacer>
            <v-btn text @click.stop="addRate">新增</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col
        v-for="rateTable in rateTables"
        :key="rateTable.id"
        cols="12"
        sm="6"
      >
        <v-card
					class="mx-auto"
				>
					<v-card-text>
						<p class="display-1 text--primary">
							{{rateTable.alias}}
						</p>
						<div class="text--primary">
							<ul>
								<li>A类: {{rateTable.classA_rate}}美元/lb</li>
								<li>B类: {{rateTable.classB_rate}}美元/lb</li>
								<li>C类: {{rateTable.classC_rate}}美元/lb</li>
								<li>D类: {{rateTable.classD_rate}}美元/lb</li>
								<li>美国境内费率: {{rateTable.inbound_rate}}%</li>
							</ul>
						</div>
					</v-card-text>

					<v-card-actions>
						<v-btn
							outlined
							text
							@click="editRate(rateTable)"
						>
							编辑
						</v-btn>
						<v-btn
							outlined
							text
							@click="deleteRate(rateTable.id)"
						>
							删除
						</v-btn>
					</v-card-actions>
				</v-card>
      </v-col>
    </v-row>
		<v-dialog v-model="openRateTableDialog" scrollable max-width="800px">
      <v-card>
        <v-card-text>
          <v-form
						ref="form"
						lazy-validation
					>
						<v-row>
							<v-col cols="4">
								<v-subheader>Rate名称</v-subheader>
							</v-col>
							<v-col cols="8">
								<v-text-field
									v-model="alias"
									label="名称"
									@focus="focus($event)"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="4">
								<v-subheader>Class A</v-subheader>
							</v-col>
							<v-col cols="8">
								<v-text-field
									label="Amount"
									value="0.00"
									prefix="$"
									v-model="classA_rate"
									@focus="focus($event)"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="4">
								<v-subheader>Class B</v-subheader>
							</v-col>
							<v-col cols="8">
								<v-text-field
									label="Amount"
									value="0.00"
									prefix="$"
									v-model="classB_rate"
									@focus="focus($event)"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="4">
								<v-subheader>Class C</v-subheader>
							</v-col>
							<v-col cols="8">
								<v-text-field
									label="Amount"
									value="0.00"
									prefix="$"
									v-model="classC_rate"
									@focus="focus($event)"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="4">
								<v-subheader>Class D</v-subheader>
							</v-col>
							<v-col cols="8">
								<v-text-field
									label="Amount"
									value="0.00"
									prefix="$"
									v-model="classD_rate"
									@focus="focus($event)"
								></v-text-field>
							</v-col>
						</v-row>
						<v-row>
							<v-col cols="4">
								<v-subheader>美国境内转运费率</v-subheader>
							</v-col>
							<v-col cols="8">
								<v-text-field
									label="Amount"
									value="0.00"
									suffix="%"
									v-model="inbound_rate"
									@focus="focus($event)"
								></v-text-field>
							</v-col>
						</v-row>
						<v-btn
							class="mr-4"
							@click="confirm"
						>
							确认
						</v-btn>
						<v-btn
							class="mr-4"
							@click="cancel"
						>
							取消
						</v-btn>
					</v-form>
        </v-card-text>
      </v-card>
    </v-dialog>
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
      openRateTableDialog: false,
      rateTables: [],
			snackbar: false,
      snackbarColor: '',
      notification: '',
			alias: '',
			classA_rate: 0.00,
			classB_rate: 0.00,
			classC_rate: 0.00,
			classD_rate: 0.00,
			inbound_rate: 0.00,
			rateId: '',
    }),

    methods: {
			focus(event) {
        event.currentTarget.select();
      },

      getAll: function() {
        this.$http.get('/api/getAllRateTalbes').then( (res) => {
          this.rateTables = res.data;
        })
      },

      addRate: function(){
        this.openRateTableDialog = true;
      },

      editRate: function(rateTable){
				this.openRateTableDialog = true;
        this.alias = rateTable.alias;
				this.classA_rate = rateTable.classA_rate;
				this.classB_rate = rateTable.classB_rate;
				this.classC_rate = rateTable.classC_rate;
				this.classD_rate = rateTable.classD_rate;
				this.inbound_rate = rateTable.inbound_rate;
				this.rateId = rateTable.id;
      },

			clear: function(){
				this.alias = '';
				this.classA_rate = 0;
				this.classB_rate = 0;
				this.classC_rate = 0;
				this.classD_rate = 0;
				this.inbound_rate = 0;
				this.rateId = '';
			},

      deleteRate(tableId){
        this.$http.delete('/api/deleteRateTablebyId',{
          params: {
						tableId : tableId
					}
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '删除成功';
          this.snackbarColor = 'green';
          this.getAll();
        })
      },

			confirm: function(){
				if(this.rateId){
          this.$http.post('/api/editRateTable',{   
            alias: this.alias,
						classA_rate: this.classA_rate,
						classB_rate: this.classB_rate,
						classC_rate: this.classC_rate,
						classD_rate: this.classD_rate,
						inbound_rate: this.inbound_rate,
            rateId: this.rateId,           
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '修改成功';
            this.snackbarColor = 'green';
						this.openRateTableDialog = false;
						this.clear();
						this.getAll();
          })
        }else{
          this.$http.post('/api/insertRateTable',{
            alias: this.alias,
						classA_rate: this.classA_rate,
						classB_rate: this.classB_rate,
						classC_rate: this.classC_rate,
						classD_rate: this.classD_rate,
						inbound_rate: this.inbound_rate,
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '增加成功';
            this.snackbarColor = 'green';
						this.openRateTableDialog = false;
						this.clear();
						this.getAll();
          })
        }
			},

			cancel: function(){
				this.openRateTableDialog = false;
				this.clear();
			}
    },

    mounted: function() {
			this.getAll();
		}
        
  }
</script>
