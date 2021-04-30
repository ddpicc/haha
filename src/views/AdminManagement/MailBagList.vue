<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row align="center">
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-btn @click="createMailBag" text outlined class="mx-2">新增邮袋</v-btn>
            <v-spacer />
            邮袋可选状态： 处理中
            <v-icon left>
							mdi-arrow-right-bold
						</v-icon>
            运往机场
            <v-icon left>
							mdi-arrow-right-bold
						</v-icon>
            发往中国
            <v-icon left>
							mdi-arrow-right-bold
						</v-icon>
            开始清关
            <v-icon left>
							mdi-arrow-right-bold
						</v-icon>
            清关完成
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          tile
        >
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">
                    名称
                  </th>
                  <th class="text-left">
                    快递单数量
                  </th>
                  <th class="text-left">
                    渠道
                  </th>
                  <th class="text-left">
                    状态
                  </th>
                  <th class="text-left">
                    创建时间
                  </th>
                  <th class="text-left">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="bagItem in mailBagList"
                  :key="bagItem.id"
                >
                  <td>{{ bagItem.name }}</td>
                  <td>{{ bagItem.amount }}</td>
                  <td>{{ bagItem.vendor }}</td>
                  <td>{{ bagItem.status }}</td>
                  <td>{{ bagItem.created_at }}</td>
                  <td>
                    <v-btn @click="jumpToMailBagOperation(bagItem.id, bagItem.name, bagItem.vendor, bagItem.status)" text outlined class="mx-2">管理</v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
		</v-row>
    <v-dialog v-model="createMailBagDialog" scrollable max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">新建邮袋</span>
        </v-card-title>
        <v-card-text>
          <v-col cols="12">
            <v-text-field
              class="ma-4"
              dense
              outlined
              v-model="bagName"
              label="名称"
            ></v-text-field>
            <v-select
              class="ma-4"
              outlined
              dense
              v-model="vendor"
              :items="vendorList"
              label="渠道"
            ></v-select>
          </v-col>
						
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
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
        </v-card-actions>
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
  import {getNowTimeFormatDate} from '../../utils/helpFunction';
  export default {
    data () {
      return {
        snackbar: false,
        snackbarColor: '',
        notification: '',
        createMailBagDialog: false,
        bagName: '',
        mailBagList: [],
        vendorList: ['青岛中通','沈阳圆通'],
        vendor: '',
      }
    },

    methods: {
      createMailBag: function(){
        this.bagName = '';
        this.createMailBagDialog = true;
      },

      confirm: function(){
				this.$http.post('/api/createMailBag',{
          name: this.bagName,
          status: '处理中',
          vendor: this.vendor,
          created_at: getNowTimeFormatDate(),
        }).then( (res) => {
          this.snackbar = true;
          this.notification = '创建成功';
          this.snackbarColor = 'green';
          this.createMailBagDialog = false;
          this.vendor = '';
          this.bagName = '';
          this.getAllBatch();
        })
			},

			cancel: function(){
				this.createMailBagDialog = false;
			},

      jumpToMailBagOperation: function(mailBag_id, mailBag_name, mailBag_vendor, mailBag_status){
        this.$router.push({ path: '/admin/mailbag_operation', query: {mailBagId: mailBag_id, mailBagName: mailBag_name, mailBagVendor: mailBag_vendor, mailBagStatus: mailBag_status}});
      },

      getAllBatch: function(){
        this.$http.get('/api/getAllMailBag').then( (res) => {
          this.mailBagList = res.data;
        })
      }
		},

    mounted: function() {
      this.getAllBatch();
		}
	}
</script>