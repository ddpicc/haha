<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>
          <v-data-table
            dense
            :headers="headers"
            :items="packages"
            item-key="id"
            :items-per-page="15"
            :search="searchStr"
            :custom-filter="filterText"
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-slot:item.storage_number="{ item }">
            <v-chip outlined color='green' @click="filterUser(item.storage_number)">{{ item.storage_number }}</v-chip>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-4"
              @click="openCheckDialog(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              v-if="item.status == '未清点' || item.status == '已清点'"
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
      v-model="deleteComfirm"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">
          删除包裹
        </v-card-title>
        <v-card-text>
          确认删除这个包裹？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deletePackage()"
          >
            确定
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!--内件清点 对话框 -->
			<v-dialog
				v-model="checkDialog"
				fullscreen
				hide-overlay
    	>
      <v-card>
        <v-toolbar
          dark
          color="blue"
					dense
        >
          <v-btn
            icon
            dark
            @click="cancelCheckItem()"
          >
            取消
          </v-btn>
					<v-toolbar-title>
						内件清点
					</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              text
              @click="finishCheckItem()"
            >
              保存
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

				<v-card-text>
					<div class='title mt-6' align="center">
						TRACKING: {{selectedPackage.tracking}}<br>
						备注： {{selectedPackage.comment}}<br>
						仓位号： {{selectedPackage.storage_number}} &nbsp;&nbsp;&nbsp;&nbsp; {{selectedPackage.service_type}}<br>
					</div>
					<v-divider
						class="mt-6 mb-6"
					></v-divider>
					<div class="overline mb-4 d-inline-flex">
						内件
						<v-chip
							class="ml-12"
							@click="scanAddItemDialog = true"
						>
							<v-icon left>
								mdi-image-filter-center-focus-strong
							</v-icon>
							扫描添加
						</v-chip>
					</div>
					<v-divider
						class="mt-6 mb-6"
					></v-divider>
					<v-data-table
						:headers="userItemHeader"
						:items="userItemList"
						hide-default-footer
						show-expand
            single-expand
            :expanded.sync="expanded"
					>
						<template v-slot:expanded-item="{ item }">
							<td :colspan="8">
								<v-simple-table>
									<template v-slot:default>
										<tbody>
											<tr >
												<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic1_url' dark max-width="70"></v-img></td>
												<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic2_url' dark max-width="70"></v-img></td>
												<td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + item.pic3_url' dark max-width="70"></v-img></td>
											</tr>
										</tbody>
									</template>
								</v-simple-table>
							</td>
						</template>
						<template v-slot:item.action="{ item }">
							<v-btn
								text
								@click="openUploadDialog(item)"
							>
								上传照片
							</v-btn>
							<v-btn
								class="ml-4"
								text
								@click="deleteDialog(item)"
							>
								删除
							</v-btn>
						</template>
					</v-data-table>
				</v-card-text>
			</v-card>
		</v-dialog>

		<!-- 扫描匹配内件信息 -->
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
							label="Barcode# (扫描并按回车键)"
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
								md="2"
							>
								<v-select
									v-model="itemType"
									:items="itemTypeList"
									label="类别"
								></v-select>
							</v-col>
							<v-col
								cols="6"
								md="3"
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
							<v-col
								cols="6"
								md="2"
							>
								<v-text-field
									v-model="itemCount"
									:counter="5"
									label="数量"
								></v-text-field>
							</v-col>
						</v-row>
					</v-card-text>
					<v-card-actions class="justify-end">
						<v-btn
							text
							@click="addItem"
						>添加</v-btn>
						<v-btn
							text
							@click="closeScanAddItemDialog"
						>关闭</v-btn>
					</v-card-actions>
				</v-card>
			</template>
		</v-dialog>
		<v-dialog
      v-model="uploadDialog"
      width="510px"
    >
      <material-card>
        <VueUploadImgs 
          multiple
          compress
          :before-read="beforeRead"
          :after-read="afterRead"
          :before-remove="beforeRemove"
          :limit="limit"
          :type="type"
          @preview="preview"
          @exceed="exceed"
          @oversize="oversize"
          v-model="files"
        >
        </VueUploadImgs>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="uploadDialog = false"
          >
            取消
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="uploadImg"
          >
            确认
          </v-btn>
        </v-card-actions>
      </material-card>
    </v-dialog>
    <v-dialog
      v-model="savingDialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="green"
        dark
      >
        <v-card-text>
          <strong>{{progressMsg}}</strong>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="savingDialog = false"
          >
            确认
          </v-btn>
        </v-card-actions>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { getNowTimeFormatDate } from '../../utils/helpFunction';
  export default {
    data: () => ({
      searchStr: '',
      headers: [
        {
          sortable: true,
          text: '用户仓位号',
          value: 'storage_number'
        },
        {
          sortable: false,
          text: '用户姓名',
          value: 'name'
        },
        {
          sortable: false,
          text: '类型',
          value: 'service_type'
        },
        {
          sortable: false,
          text: '第三方单号',
          value: 'tracking'
        },
        {
          sortable: true,
          text: '入库时间',
          value: 'in_store_date',
        },
        {
          sortable: true,
          text: '在库天数',
          value: 'instore_day',
        },
        {
          sortable: true,
          text: '状态',
          value: 'status',
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      packages: [],
      deleteComfirm: false,
      theDeletePackage: {},

      selectedPackage: {},

			userItemHeader: [
				{
          sortable: false,
          text: '类别',
					width: "20%",
          value: 'type'
        },
        {
          sortable: false,
          text: '物品描述',
					width: "20%",
          value: 'item_name'
        },
        {
          sortable: false,
          text: '单价',
					width: "10%",
          value: 'price',
        },
        {
          sortable: false,
          text: '数量',
					width: "10%",
          value: 'item_count'
        },
        {
          sortable: true,
          text: '品牌',
					width: "20%",
          value: 'brand',
        },
        {
          sortable: false,
          text: '操作',
					width: "20%",
          value: 'action',
        }
      ],
			expanded: [],
			userItemList: [],
			itemType: '',
      itemTypeList: ['鞋类','奶粉','保健品','零食','日用品','衣服','玩具','化妆品','箱包','电子产品','手表'],
      itemName: '',
      itemPrice: '',
      itemCount: '',
      itemBrand: '',


			scanAddItemDialog: false,
			scaned_itemUPC: '',
			findItem: false,
			findItemTemplateId: '',

			checkDialog: false,

			limit: 3,
      type: 0,
      domain: 'https://upload-na0.qiniup.com',
      uploadDialog: false,
      files: [],
      currentItem: 0,
      currentImgNm: 0,
      savingDialog: false,
      progressMsg: '',
      processStatus: 0,
      overlay: false,
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

      editPackage: function(packageItem){
        this.$router.push({ name: '添加包裹', params: {selectedPackage: packageItem}});
      },

      // 获取所有包裹
      getAll: function() {
        this.$http.get('/api/package/getAllThirdPartyPackage').then( (res) => {
          this.packages = res.data;
          for(let item of this.packages){
            let today = getNowTimeFormatDate();
            let instoredate = item.in_store_date;
            today = Date.parse(today);
            instoredate = Date.parse(instoredate);
            let dateSpan = instoredate - today;
            dateSpan = Math.abs(dateSpan);
            let iDays = Math.floor(dateSpan / (24 * 3600 * 1000)) + 1;
            this.$set(item,'instore_day',iDays);
          }
        })
      },

      deleteDialog: function(item){
        this.deleteComfirm = true;
        this.theDeletePackage = item;
      },

      deletePackage: function(id){
        this.$http.delete('/api/package/deleteThirdPartyPackagebyId',{
          params: {
						packageId : this.theDeletePackage.id
					}
        }).then( (res) => {
          this.getAll();
          this.deleteComfirm = false;
        })
      },

      filterUser: function(storage_number){
        this.searchStr = storage_number;
      },

      //内件清点
			openCheckDialog: function(item){
				this.checkDialog = true;
				this.selectedPackage = item;
				this.getItemsInPackage(this.selectedPackage.id);

			},

			closeScanAddItemDialog: function(){
				this.scanAddItemDialog = false;
				this.itemType = '';
        this.itemName = '';
        this.itemPrice = '';
        this.itemCount = '';
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
            upcBarcode: this.scaned_itemUPC,
          }
        }).then( (res) => {
          if(res.data.length === 0){
						this.findItem = false;
					}else{
						this.findItem = true;
						this.findItemTemplateId = res.data[0].id;
						this.itemType = res.data[0].type;
        		this.itemName = res.data[0].item_name;
        		this.itemPrice = res.data[0].price;
        		this.itemBrand = res.data[0].brand;
					}
				})
			},

			getItemsInPackage: function(packageId){
				this.$http.get('/api/item/getItemsByThirdPartyPackageId',{
					params: {
						packageId : packageId,
					}
				}).then( (resSec) => {
					this.userItemList = resSec.data;
				})
			},

			addItem: function(){
				//check有效性

				if(this.findItemTemplateId){
					this.$http.post('/api/item/insertPackageItem',{
						packageId : this.selectedPackage.id,
						itemCount : this.itemCount,
						itemTemplate_Id: this.findItemTemplateId,
					}).then( (res) => {
						this.getItemsInPackage(this.selectedPackage.id);
						//clear 
						this.itemType = '';
						this.itemName = '';
						this.itemPrice = '';
						this.itemCount = '';
						this.itemBrand = '';
						this.scaned_itemUPC = '';						
					})
				}else{
					this.$http.post('/api/item/insertItemTemplate',{
						barcode : this.scaned_itemUPC,
						itemType : this.itemType,
						itemName : this.itemName,
						itemPrice : parseFloat(this.itemPrice),
						itemBrand : this.itemBrand,
					}).then( (res) => {
						this.$http.post('/api/item/insertPackageItem',{
							packageId : this.selectedPackage.id,
							itemCount : this.itemCount,
							itemTemplate_Id: res.data.insertId,
						}).then( (res) => {
							this.getItemsInPackage(this.selectedPackage.id);
							//clear 
							this.itemType = '';
							this.itemName = '';
							this.itemPrice = '';
							this.itemCount = '';
							this.itemBrand = '';
							this.scaned_itemUPC = '';						
						})
					})
				}
			},

			finishCheckItem: function(){
				//更新保存照片信息
				this.$http.post('/api/package/updateThirdPartyPackage',{
					status: '已清点',
					package_Id: this.selectedPackage.id,
				}).then( (res) => {
					this.checkDialog = false;
				})
			},

			cancelCheckItem: function(){
				//删掉所有前面创建的item
				this.checkDialog = false;
			},

			//upload image
			openUploadDialog: function(item){
        this.currentItem = item;
        this.currentImgNm = 0;
        if(item.pic1_url)
          this.currentImgNm = this.currentImgNm + 1;
        if(item.pic2_url)
          this.currentImgNm = this.currentImgNm + 1;
        if(item.pic3_url)
          this.currentImgNm = this.currentImgNm + 1;
        this.limit = 3 - this.currentImgNm;
        this.files = [];
        this.uploadDialog = true;
      },

      uploadImg: function(){
        //alert(this.currentItemId);
        this.uploadDialog = false;
        this.savingDialog = true;
        this.progressMsg = '正在上传图片';
        for(let i=0; i<this.files.length; i++){
          let pic = this.files[i].url.replace(/^.*?base64,/, '')
          this.$http.get('/api/qiniuToken').then(res => {
            this.$http.post(this.domain + '/putb64/-1/', pic, {
              headers: {
                'Content-Type': 'application/octet-stream',
                'Authorization': 'UpToken ' + res.data,
              }
            }).then(res => {
              let col_pic = 'pic' + (i+1).toString() +'_url';
              let url_pic = res.data.key;
              let namecol_pic = 'pic' + (i+1).toString() + '_name';
              let name_pic = this.files[i].name;
              this.$set(this.currentItem,namecol_pic,name_pic);
              this.$set(this.currentItem,col_pic,url_pic);
              this.progressMsg = '第' + (i+1) + '张上传完成';
            })
          })
        }        
      },

      deleteImg: function(img_url){
        alert(img_url);
      },


      exceed() {
        alert(`只能上传${this.limit}张图片`)
      },

      beforeRead(files) {
        console.log('before-read')
        for (let i = 0, len = files.length; i < len; i++) {
            const file = files[i]
            if (file.type != 'image/jpeg' && file.type != 'image/png') {
                alert('只能上传jpg和png格式的图片')
                return false
            }
        }
        return true
      },

      afterRead(file) {
      },

      beforeRemove(index, file) {
        return true
      },

      preview(index, file) {
        this.$hevueImgPreview(file.url);
      },

      oversize() {},
    },

    mounted: function() {
			this.getAll();
		}

    
  }
</script>
