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
      <v-spacer/>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      
    </v-app-bar>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
    >
      <v-list
        nav
        dense
      >
        <v-list-item-group
          v-model="group"
          active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-title>Foo</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Bar</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Fizz</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Buzz</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>


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
        drawer: false,
        group: null,
      }
    },

    methods: {
			jumpHome: function(){
        this.$router.push({ path: '/' });
      }
    },

    watch: {
      group () {
        this.drawer = false
      },
    },
  }
</script>