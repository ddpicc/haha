<template>
  <div id="app">
   <v-app light>
    <v-app-bar
      app
      color="white"
      height="50"
    >
      <v-avatar
        class="mr-3"
        color="grey lighten-5"
        size="50"
      >
        <v-img
          contain
          max-height="100%"
          src="../assets/logo1.png"
          @click.stop="jumpHome"
        ></v-img>
      </v-avatar>


    </v-app-bar>

    <v-content>
      <v-container
        class="fill-height"
        fluid
      >
        <v-row
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="8"
          >
            <v-card class="elevation-12">
              <v-card-text>
                <v-expansion-panels>
									<v-expansion-panel
										v-for="(item,i) in 5"
										:key="i"
									>
										<v-expansion-panel-header>
											Item
										</v-expansion-panel-header>
										<v-expansion-panel-content>
											Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
										</v-expansion-panel-content>
									</v-expansion-panel>
								</v-expansion-panels> 
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <v-snackbar
          v-model="snackbar"
          :color="snackbarColor"
          :timeout="snackbarTimeout"
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
    </v-content>
  </v-app>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        snackbar: false,
        snackbarColor: '',
        notification: '',
        snackbarTimeout: 3000,
      }
    },

    methods: {
			jumpHome: function(){
        this.$router.push({ path: '/' });
      }
    }
  }
</script>