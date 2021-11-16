<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-btn text @click="scanAddItemDialog = true">添加或修改物品</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="12">
        <material-card>
          <v-data-table
            dense
            :headers="headers"
            :items="items"
            item-key="id"
            :items-per-page="15"
            :search="searchStr"
            :custom-filter="filterText"
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              @click="deleteDialog(item)"
            >
              mdi-close
            </v-icon>
          </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>

    <v-dialog
			max-width="800"
			persistent
			v-model="scanAddItemDialog"
		>
			<template v-slot:default="dialog">
				<v-card>
					<v-toolbar
						color="blue"
						dark
					>扫描物品条形码</v-toolbar>
					<v-card-text>
						<v-text-field
							v-model="scaned_itemUPC"
							label="Barcode# (扫描物品UPC)"
							class='mt-4'
							@keyup.enter.native="scanItemFinish"
						></v-text-field>

						<div v-if="!findItem" class="text-center title text-uppercase mt-6 red">
							没有匹配到物品信息
						</div>
						<div v-if="findItem" class="text-center title text-uppercase mt-6 green">
							匹配到物品信息
						</div>
						<v-row>
							<v-col
								cols="6"
								md="3"
							>
								<v-select
									v-model="itemType"
									:items="itemTypeList"
									label="类别"
								></v-select>
							</v-col>
							<v-col
								cols="6"
								md="4"
							>
								<v-text-field
									v-model="itemName"
									label="物品描述"
								></v-text-field>
							</v-col>
							<v-col
								cols="6"
								md="3"
							>
								<v-text-field
									v-model="itemBrand"
									label="品牌"
								></v-text-field>
							</v-col>
							<v-col
								cols="6"
								md="2"
							>
								<v-text-field
									v-model="itemPrice"
									label="申报单价(USD)"
								></v-text-field>
							</v-col>                
						</v-row>
					</v-card-text>
					<v-card-actions class="justify-end">
						<v-btn
							text
							@click="addItem"
						>{{editOrAddTitle}}</v-btn>
						<v-btn
							text
							@click="closeScanAddItemDialog"
						>关闭</v-btn>
					</v-card-actions>
				</v-card>
			</template>
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
    <v-dialog
      v-model="deleteComfirm"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">
          删除物品
        </v-card-title>
        <v-card-text>
          确认删除这个物品？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteItem()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      searchStr: '',
      headers: [
        {
          sortable: false,
          text: 'barcode',
          value: 'barcode'
        },
        {
          sortable: false,
          text: '类别',
          value: 'type'
        },
        {
          sortable: false,
          text: '名称',
          value: 'item_name'
        },
        {
          sortable: false,
          text: '价钱',
          value: 'price'
        },
        {
          sortable: true,
          text: '品牌',
          value: 'brand',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      items: [],
      snackbar: false,
      snackbarColor: '',
      notification: '',
      deleteComfirm: false,
      theDeleteTemplate: {},

      itemType: '',
      itemTypeList: ['鞋类','奶粉','保健品','零食','日用品','衣服','玩具','化妆品','箱包','电子产品','手表'],
      itemName: '',
      itemPrice: '',
      itemBrand: '',
      findItemTemplateId: '',
      editOrAddTitle: '添加',


			scanAddItemDialog: false,
			scaned_itemUPC: '',
      findItem: false,
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

      // 获取所有包裹
      getAll: function() {
        this.$http.get('/api/item/getAllItemTemplate').then( (res) => {
          this.items = res.data;
        })
      },

      deleteDialog: function(item){
        this.deleteComfirm = true;
        this.theDeleteTemplate = item;
      },

      deleteItem: function(){
        this.$http.delete('/api/deletePackagebybyId',{
          params: {
						packageId : this.theDeleteTemplate.id
					}
        }).then( (res) => {
          this.deleteComfirm = false;
          this.getAll();
        })
      },


			closeScanAddItemDialog: function(){
				this.scanAddItemDialog = false;
				this.itemType = '';
        this.itemName = '';
        this.itemPrice = '';
        this.itemBrand = '';
				this.findItemTemplateId = '';
			},

			scanItemFinish: function(){
				if(this.scaned_itemUPC == ''){
          this.findItem = false;
          return;
        }
        this.$http.get('/api/item/existItemByUPC',{
          params: {
            upcBarcode: this.scaned_itemUPC.trim(),
          }
        }).then( (res) => {
          if(res.data.length === 0){
						this.findItem = false;
					}else{
						this.findItem = true;
            this.editOrAddTitle = '修改';
						this.findItemTemplateId = res.data[0].id;
						this.itemType = res.data[0].type;
        		this.itemName = res.data[0].item_name;
        		this.itemPrice = res.data[0].price;
        		this.itemBrand = res.data[0].brand;
					}
				})
			},

      addItem: function(){
				//check有效性
				if(this.scaned_itemUPC == ''){
          alert('请输入物品upc code');
					return;
        }
				if(this.itemType == '' || this.itemName == '' || this.itemPrice == '' || this.itemBrand == ''){
          alert('请补充完整物品信息');
					return;
        }

				if(this.findItemTemplateId){
          //修改物品模板
					this.$http.post('/api/item/updateItemTemplate',{
						itemType : this.itemType,
						itemName : this.itemName,
						itemPrice : parseFloat(this.itemPrice),
						itemBrand : this.itemBrand,
            id: this.findItemTemplateId,
					}).then( (res) => {
						//clear 
            this.snackbar = true;
            this.notification = '修改完成';
            this.snackbarColor = 'green';
						this.itemType = '';
						this.itemName = '';
						this.itemPrice = '';
						this.itemBrand = '';
						this.scaned_itemUPC = '';						
					})
				}else{
          //添加物品模板
					this.$http.post('/api/item/insertItemTemplate',{
						barcode : this.scaned_itemUPC,
						itemType : this.itemType,
						itemName : this.itemName,
						itemPrice : parseFloat(this.itemPrice),
						itemBrand : this.itemBrand,
					}).then( (res) => {
            this.snackbar = true;
            this.notification = '新增一条物品模板';
            this.snackbarColor = 'green';
            //clear 
            this.itemType = '';
            this.itemName = '';
            this.itemPrice = '';
            this.itemBrand = '';
            this.scaned_itemUPC = '';						
					})
				}
			},
    },

    mounted: function() {
      this.getAll();
		}

    
  }
</script>
