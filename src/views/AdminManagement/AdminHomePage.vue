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
      }
    },

    methods: {
      jumpToRateTable: function(){
        this.$router.push({ path: '/admin/ratetable' });
      },

      jumpToAllRecipients: function(){
        this.$router.push({ path: '/admin/all_recipients' });
      },
		},

    mounted: function() {

		}
	}
</script>