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
            :items="items"
            item-key="name"
            :items-per-page="15"
            :search="searchStr"
            :custom-filter="filterText"
          >
          <template v-slot:top>
            <v-text-field v-model="searchStr" label="搜索..." class="mx-4"></v-text-field>
          </template>
          </v-data-table>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      searchStr: '',
      headers: [
        {
          sortable: false,
          text: '用户仓位号',
          value: 'storage_number'
        },
        {
          sortable: false,
          text: '名字',
          value: 'name'
        },
        {
          sortable: false,
          text: '电话',
          value: 'phone'
        },
        {
          sortable: false,
          text: '地址',
          value: 'address'
        },
        {
          sortable: true,
          text: '城市',
          value: 'city',
        },
        {
          sortable: true,
          text: '省/州',
          value: 'state',
        },
        {
          sortable: false,
          text: '邮编',
          value: 'zip',
        },
      ],
      items: [],
    }),

    methods: {
      //搜索
      filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLowerCase().indexOf(search.toLowerCase()) !== -1
      },

      // 获取所有收件人
      getAll: function() {
        this.$http.get('/api/getAllRecipients').then( (res) => {
          this.items = res.data;
        })
      },
    },

    mounted: function() {
			this.getAll();
		}
  }
</script>
