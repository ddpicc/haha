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
            :items="blogs"
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
              class="mr-2"
              @click="editBlog(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="openDeleteBlog(item)"
            >
              mdi-close
            </v-icon>
          </template>
          </v-data-table>
        </material-card>
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
    <v-dialog
      v-model="deleteComfirm"
      width="500"
    >
      <v-card>
        <v-card-title class="headline">
          删除公告
        </v-card-title>
        <v-card-text>
          确认删除这个公告？
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="deleteBlog()"
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
          text: '标题',
          value: 'title'
        },
        {
          sortable: false,
          text: '创建时间',
          value: 'created_at'
        },
        {
          sortable: false,
          text: '是否置顶',
          value: 'stay_top'
        },
        {
          sortable: false,
          text: '操作',
          value: 'action',
        },
      ],
      blogs: [],
      snackbar: false,
      snackbarColor: '',
      notification: '',
      deleteComfirm: false,
      theDeleteBlog: {},
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
        this.$http.get('/api/news/getAllNews').then( (res) => {
          this.blogs = res.data;
        })
      },

      editBlog: function(blog){
				this.$router.push({ path: '/admin/blog_create', query: {blogId: blog.id}});
      },

      openDeleteBlog: function(item){
        this.deleteComfirm = true;
        this.theDeleteBlog = item;
      },

      deleteBlog: function(){
        this.$http.delete('/api/news/deleteNewsById',{
          params: {
						id : this.theDeleteBlog.id
					}
        }).then( (res) => {
          this.deleteComfirm = false;
					this.snackbar = true;
					this.notification = '删除成功';
					this.snackbarColor = 'green';
          this.getAll();
        })
      },
    },

    mounted: function() {
      this.getAll();
		}

    
  }
</script>
