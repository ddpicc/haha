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
            :headers="headers"
            :items="packages"
            item-key="id"
            :items-per-page="15"
            :search="searchStr"
            :custom-filter="filterText"
            show-expand
            single-expand
            :expanded.sync="expanded"
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" clearable label="搜索..." class="mx-4"></v-text-field>
          </template>
          <template v-slot:item.storage_number="{ item }">
            <v-chip outlined color='green' @click="filterUser(item.storage_number)">{{ item.storage_number }}</v-chip>
          </template>
          <template v-slot:expanded-item="{ item }">
            <td :colspan="8">
              <v-simple-table>
                <template v-slot:default>
                  <tbody>
                    <tr v-for="kitem in item.itemList" :key="kitem.id">
                      <td style="width:25%">{{kitem.item_name}} ({{kitem.item_count}}件)
                      <td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + kitem.pic1_url' dark max-width="70"></v-img></td>
                      <td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + kitem.pic2_url' dark max-width="70"></v-img></td>
                      <td style="width:25%"><v-img :src='"https://image.endlessflora.com/" + kitem.pic3_url' dark max-width="70"></v-img></td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </td>
          </template>
          <template v-slot:item.action="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editPackage(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              v-if="item.status == '已入库'"
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
  </v-container>
</template>

<script>
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
          text: '邮箱',
          value: 'email'
        },
        {
          sortable: false,
          text: '第三方单号',
          value: 'user_defined_tracking'
        },
        {
          sortable: true,
          text: '入库时间',
          value: 'in_store_date',
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
      expanded: [],
      deleteComfirm: false,
      theDeletePackage: {}
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
        this.$http.get('/api/getAllThirdPartyPackage').then( (res) => {
          this.packages = res.data;
          for(let kk of this.packages){
            this.$http.get('/api/getItemsByPackageId',{
              params: {
                packageId : kk.id,
              }
            }).then( (resSec) => {
              kk.itemList = resSec.data;
            })
          }
        })
      },

      deleteDialog: function(item){
        this.deleteComfirm = true;
        this.theDeletePackage = item;
      },

      deletePackage: function(id){
        this.$http.delete('/api/deleteThirdPartyPackagebyId',{
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
        
      }
    },

    mounted: function() {
			this.getAll();
		}

    
  }
</script>
