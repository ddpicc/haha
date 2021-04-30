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
            <v-text-field
              solo-inverted
              flat
              hide-details
              label="Search"
              v-model="searchStr"
              prepend-inner-icon="mdi-magnify"
              @click:prepend-inner="filterSearch"
            ></v-text-field>
            <v-spacer></v-spacer>

            <v-btn text @click.stop="addRecipient">新增</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col
        v-for="recipient in recipients"
        :key="recipient.name"
        cols="12"
        sm="6"
      >
        <v-card>
          <v-list-item three-line>
            <v-list-item-content>
              <v-list-item-title class="headline mb-1">{{recipient.name}}  {{recipient.phone}}</v-list-item-title>
              <v-list-item-subtitle>{{recipient.oneLineAddress}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-card-actions>
            <v-chip v-if="recipient.is_default"
              class="ma-2"
              small
            >
              默认寄件地址
            </v-chip>
            <v-spacer></v-spacer>
            <v-btn text @click="editRecipient(recipient.id)">编辑</v-btn>
            <v-btn text @click="deleteRecipient(recipient.id)">删除</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      searchStr: '',
      recipients: [],
      backupRecipients: [],
    }),

    methods: {
      //搜索
      filterSearch () {
        this.recipients = this.backupRecipients;
        this.recipients = this.recipients.filter((item) => {
          return item.name.toString().indexOf(this.searchStr) !== -1 ||
          item.phone.toString().indexOf(this.searchStr) !== -1 ||
          item.oneLineAddress.toString().indexOf(this.searchStr) !== -1
        })
      },

      getAll: function() {
        this.$http.get('/api/getRecipientsByUser',{
          params: {
						userId : this.$store.state.user.user_id,
					}
        }).then( (res) => {
          this.recipients = [];
          for(let item of res.data){
            this.recipients.push({
              name: item.name,
              phone: item.phone,
              oneLineAddress: item.state + ' ' + item.city + ' ' + item.address,
              id: item.id,
              is_default: item.is_default_address,
            })
          }
          this.backupRecipients = this.recipients;
        })
      },

      addRecipient: function(){
        this.$router.push({ path: '/add_recipient'});
      },

      editRecipient: function(rid){
        this.$router.push({name: '添加收件人', params: {recipient_id: rid}});
      },

      deleteRecipient(recipientId){
        this.$http.delete('/api/deleteRecipientbybyId',{
          params: {
						id : recipientId
					}
        }).then( (res) => {
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
