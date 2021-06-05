<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row align="center">
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="green"
          icon="mdi-package-variant-closed"
          title="总数"
          :value="notAssignFinishedNm"
          sub-icon="mdi-calendar"
          sub-text="已处理未分配邮袋包裹(包括拆分的包裹)"
          @click="openNotAssignChildOrder"
        />
      </v-col>
      <v-col
        cols="12"
        lg="6"
      >
        <material-stats-card
          color="green"
          icon="mdi-tag"
          title=""
          :value="processNm"
          sub-icon="mdi-calendar"
          :sub-text="todayYear()"
        />
      </v-col>
      <v-col cols="12" >
        <v-card
          color="grey lighten-4"
          flat
          tile
        >
          <v-toolbar>
            <v-btn v-if="this.$store.state.user.roles != 'default'" @click="jumpToRateTable" text outlined>Rate Table</v-btn>
            <v-btn @click="jumpToAllRecipients" text outlined class="mx-2">收件人列表</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
		</v-row>
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
    <v-dialog v-model="notAssignChildOrderSelectDialog" scrollable max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">添加快递单</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="selectPackageheaders"
            :items="childPackageWithNoMailbagList"
            item-key="id"
            :search="searchStr"
            :custom-filter="filterText"
            show-select
            :single-select="false"
            v-model="selected"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
            </template>
          </v-data-table>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
						@click="addToMailBag(item)"
					>
						分配邮袋
					</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
	</v-container>

</template>

<script>
  export default {
    data () {
      return {
        snackbar: false,
        snackbarColor: '',
        notification: '',
        processNm: 0,
        notAssignFinishedNm: '',
        notAssignChildOrderSelectDialog: false,


        childPackageWithNoMailbagList: [],
        selectPackageheaders: [
					{
						sortable: false,
						text: '单号',
						value: 'child_tracking_number'
					},
					{
						sortable: false,
						text: '收件人',
						value: 'to_name'
					},
				],
        searchStr: '',
        selected: [],
      }
    },

    methods: {
      jumpToRateTable: function(){
        this.$router.push({ path: '/admin/ratetable' });
      },

      jumpToAllRecipients: function(){
        this.$router.push({ path: '/admin/all_recipients' });
      },

      todayYear: function(){
        var myDate = new Date();
        var year=myDate.getFullYear();
        year = year + '年';
        return year;
      },

      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

      openNotAssignChildOrder: function(){
        this.notAssignChildOrderSelectDialog = true;
      },

      loadAll: function(){
        this.$http.get('/api/searchAllChildOrderWithNoMailBag').then( (res) => {
          this.notAssignFinishedNm = (res.data.length).toString();
          this.childPackageWithNoMailbagList = res.data;
        })
      }
		},

    mounted: function() {
      this.loadAll();
		}
	}
</script>