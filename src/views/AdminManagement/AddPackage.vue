<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card>          
          <v-form
            ref="packageForm"
            v-model="valid"
            lazy-validation
          >
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="user_defined_tracking"
                    label="快递单号 (留空会自动生成)"
                    required
                  ></v-text-field>
                  <v-autocomplete
                    label="用户"
                    :items="cacheAllUser"
                    :filter="customFilter"
                    clearable
                    @update:search-input="searchChanged"
                    :item-text="displayText"
                    item-value="id"
                    v-model="selectedUser"
                    :rules="[v => !!v || 'user is required']"
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
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-select
                    v-model="courier"
                    :items="courierList"
                    label="快递公司"
                    required
                  ></v-select>
                  <v-text-field
                    v-model="instoreDate"
                    label="入库时间"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-form>        
        </material-card>
      </v-col>
      <v-col cols="12">
        <material-card>
          <div class="overline mb-4 d-inline-flex">
            内件图片
            <v-chip
              class="ml-12"
              @click="addItem"
            >
              <v-icon left>
                mdi-card-plus
              </v-icon>
              添加物品
            </v-chip>
          </div>              
          <v-row v-for="item in itemList" :key="item.id" align="center">
            <v-col cols="2">
              <v-text-field 
                label="物品名称"
                v-model="item.item_name"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                v-model="item.item_count"
                class="mt-4 pt-0"
                type="number"
                @focus="focus($event)"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-img max-width="120" v-if="item.pic1_url" :src='"https://image.endlessflora.com/" + item.pic1_url'></v-img>
            </v-col>
            <v-col cols="2">
              <v-img max-width="120" v-if="item.pic2_url" :src='"https://image.endlessflora.com/" + item.pic2_url'></v-img>
            </v-col>
            <v-col cols="2">
              <v-img max-width="120" v-if="item.pic3_url" :src='"https://image.endlessflora.com/" + item.pic3_url'></v-img>
            </v-col>
            <v-col cols="2">
              <v-btn class="mx-2" text dark color="blue" @click="openUploadDialog(item)">上传照片</v-btn>
              <v-btn class="mx-2" text dark color="blue" @click="deleteItem(item)">删除</v-btn>
            </v-col> 
          </v-row>
        </material-card>
      </v-col>
      <v-col cols="12" class="d-inline-flex justify-end">
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="save">保存</v-btn>
      </v-col>
    </v-row>
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
    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      :timeout="5000"
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
    <v-overlay :value="overlay">
      <v-progress-circular
        indeterminate
        size="64"
      ></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
  import {getNowFormatDate, generateUniqueString} from '../../utils/helpFunction';
  export default {
    data: () => ({
      valid: true,
      user_defined_tracking: '',
      courierList: ['USPS','UPS','Amazon','Fedex','DHL'],
      courier: '',
      cacheAllUser: [],
      selectedUser: '',
      instoreDate: '',
      snackbar: false,
      snackbarColor: '',
      notification: '',
      itemList: [],
      limit: 3,
      type: 0,
      domain: 'https://upload-na0.qiniup.com',
      uploadDialog: false,
      files: [],
      currentItemIndex: 0,
      currentImgNm: 0,
      savingDialog: false,
      progressMsg: '',
      processStatus: 0,
      selectedPackage: {},
      overlay: false,
    }),

    methods: {
      focus(event) {
        event.currentTarget.select();
			},
      
      displayText: function(item){
        return item.storage_number + ' (' + item.name  + '    ' + item.email + ')';
      },

      searchChanged: function(queryText){
/*         if(!queryText){
          //alert(queryText);
          //this.components = [{"medname":"empty"}];
          //return;
        }
        else if(queryText.length >= 2){
          if(this.components.length == 0){
            this.components = this.cacheAllUser;
          }
        }else{
          this.components = [];
        } */
      },

      customFilter (item, queryText, itemText) {
        const hasValue = val => val != null ? val : '';
        const query = hasValue(queryText).toUpperCase();

        //if(queryText.length < 2) return false;
        const textOne = item.storage_number;
        return textOne.indexOf(query) > -1;
      },

      save: function(){
        this.overlay = true;
        if(this.$refs.packageForm.validate()){
          //修改已有包裹
          if(this.selectedPackage != undefined){
            this.$http.post('/api/updateThirdPartyPackage',{
              user_id : this.selectedUser,
              user_defined_tracking : this.user_defined_tracking,          
              courier : this.courier,
              instore_date : this.instoreDate,
              package_Id : this.selectedPackage.id,
            }).then( (res) => {
              for(let item of this.itemList) {
                this.$http.post('/api/updateReportItems',{
                      itemName : item.item_name,
                      itemCount: item.item_count,
                      item_id : item.id,
                      pic1_url: item.pic1_url,
                      pic1_name: item.pic1_name,
                      pic2_url: item.pic2_url,
                      pic2_name: item.pic2_name,
                      pic3_url: item.pic3_url,
                      pic3_name: item.pic3_name,
                }).then( (resord) => {   
                  console.log('update item id ' + item.id);
                })
                .catch( (err) =>{
                  console.log(err);
                })
              }
              this.overlay = false;
              this.snackbar = true;
              this.notification = '更新成功';
              this.snackbarColor = 'green';
              this.itemList = [];
              this.clear();
            })
          }else{
            //新添加包裹
            //通过数据库判断user id是否存在，user defined tracking是否重复
            if(this.user_defined_tracking == '')
              this.user_defined_tracking = generateUniqueString().toUpperCase();
            this.$http.post('/api/insertThirdPartyPackage',{
              user_id : this.selectedUser,
              user_defined_tracking : this.user_defined_tracking,          
              courier : this.courier,
              status : '已入库',
              instore_date : this.instoreDate,
            }).then( (res) => {
              for(let item of this.itemList) {
                this.$http.post('/api/insertAdminReportItems',{
                      packageId : res.data.insertId,
                      itemName : item.item_name,
                      itemCount: item.item_count,
                      pic1_url: item.pic1_url,
                      pic1_name: item.pic1_name,
                      pic2_url: item.pic2_url,
                      pic2_name: item.pic2_name,
                      pic3_url: item.pic3_url,
                      pic3_name: item.pic3_name,
                }).then( (resord) => {   
                  console.log('add item id ' + resord.data.insertId);
                })
                .catch( (err) =>{
                  console.log(err);
                })
              }
              this.overlay = false;
              this.snackbar = true;
              this.notification = '添加成功';
              this.snackbarColor = 'green';
              this.itemList = [];
              this.clear();
            })
          }
        }
      },

      clear: function(){
        this.user_defined_tracking = '';
        this.courier = '';
        this.selectedUser = '';
      },

      openUploadDialog: function(item){
        this.currentItemIndex = this.itemList.indexOf(item);
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
              this.$set(this.itemList[this.currentItemIndex],namecol_pic,name_pic);
              this.$set(this.itemList[this.currentItemIndex],col_pic,url_pic);
              this.progressMsg = '第' + (i+1) + '张上传完成';
            })
          })
        }        
      },

      deleteImg: function(img_url){
        alert(img_url);
      },

      addItem: function(){
        let itemNm = this.itemList.length + 1;
        this.itemList.push({
          item_name: '物品'+ itemNm.toString(),
          item_count: 1,
        })
      },

      deleteItem: function(item){
        var index = this.itemList.indexOf(item);
        this.itemList.splice(index, 1);
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

      getAllUser: function(){
        this.$http.get('/api/getAllUser').then( (res) => {
          this.cacheAllUser = res.data;
        })
      }
    },

    mounted: function() {      
      if(this.selectedPackage != undefined){
        this.user_defined_tracking = this.selectedPackage.user_defined_tracking;
        this.courier = this.selectedPackage.courier;        
        this.instoreDate = this.selectedPackage.in_store_date;
        this.$http.get('/api/getAllUser').then( (res) => {
          this.cacheAllUser = res.data;
          this.selectedUser = this.selectedPackage.user_id;
          this.$http.get('/api/getItemsByPackageId',{
            params: {
              packageId : this.selectedPackage.id,
            }
          }).then( (resSec) => {
            this.itemList = resSec.data;
          })
        })
      }else{
        this.getAllUser();
        this.instoreDate = getNowFormatDate();
      }
      
    },

    created() {
      this.selectedPackage = this.$route.params.selectedPackage;
    },
  }
</script>

