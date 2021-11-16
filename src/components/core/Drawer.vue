<template>
  <v-navigation-drawer
    id="app-drawer"
    v-model="inputValue"
    :src="image"
    app
    color="grey darken-2"
    dark
    floating
    mobile-break-point="991"
    persistent
    width="180"
  >
    <template v-slot:img="attrs">
      <v-img
        v-bind="attrs"
        gradient="to top, rgba(0, 0, 0, .7), rgba(0, 0, 0, .7)"
      />
    </template>

    <v-list-item two-line>
      <v-list-item-title class="title text-center">
        {{ $t('lang.home')}}
      </v-list-item-title>
    </v-list-item>

    <v-divider class="mx-3 mb-3" />

    <v-list nav>
      <!-- Bug in Vuetify for first child of v-list not receiving proper border-radius -->
      <div />

      <v-list-item
        v-for="(link, i) in links"
        :key="i"
        :to="link.to"
        active-class="primary white--text"
      >
        <v-list-item-action>
          <v-icon>{{ link.icon }}</v-icon>
        </v-list-item-action>

        <v-list-item-title v-text="link.text" />
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="pa-2">
        <v-btn block>账户余额: {{$store.state.user.balance}} 美元</v-btn>
      </div>
    </template>


  </v-navigation-drawer>
</template>

<script>
// Utilities
  import {
    mapMutations,
    mapState
  } from 'vuex'

  var potentialLinks = [
        {
          to: '/dashboard',
          icon: 'mdi-home',
          text: '首页'
        },
        {
          to: '/admin/homepage',
          icon: 'mdi-home',
          text: '管理员首页'
        },
        {
          to: '/admin/preprocess_package',
          icon: 'mdi-plus-box-multiple-outline',
          text: '预处理包裹'
        },
        {
          to: '/admin/mailbag_list',
          icon: 'mdi-plus-box-multiple-outline',
          text: '邮袋列表'
        },
        {
          to: '/package/forcast',
          icon: 'mdi-plus-box-multiple-outline',
          text: '预报包裹'
        },
        {
          to: '/thirdparty_package',
          icon: 'mdi-clipboard-outline',
          text: '第三方包裹'
        },
        {
          to: '/package/mypackage',
          icon: 'mdi-package-variant',
          text: '我的包裹'
        },
        {
          to: '/waitpackage_list',
          icon: 'mdi-package',
          text: '待处理包裹'
        },
        {
          to: '/finishpackage_list',
          icon: 'mdi-package',
          text: '已处理包裹'
        },
      ]
  export default {
    props: {
      opened: {
        type: Boolean,
        default: false
      }
    },
    data: () => ({
      links: [],
    }),

    computed: {
      ...mapState('app', ['image', 'color']),
      inputValue: {
        get () {
          return this.$store.state.app.drawer
        },
        set (val) {
          this.setDrawer(val)
        }
      }
    },

    methods: {
      ...mapMutations('app', ['setDrawer', 'toggleDrawer'])
    },
    mounted: function() {
      let childrenPath = this.$store.state.permission.addRouters[0].children;
      childrenPath.forEach(element => {
        var findLinks = potentialLinks.find(function(p){
          return p.to === element.path;
        })
        if(typeof(findLinks) != 'undefined'){
          this.links.push(findLinks);
        }
      });
		}
  }
</script>
