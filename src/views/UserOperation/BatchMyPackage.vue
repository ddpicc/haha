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
            <v-text-field
              solo-inverted
              flat
              hide-details
              label="Search"
              clearable
              v-model="searchStr"
              prepend-inner-icon="mdi-magnify"
              @click:prepend-inner="filterSearch"
              @keyup.enter.native="filterSearch"
            ></v-text-field>
            <v-spacer></v-spacer>

            <v-btn text @click="jumpToSendPackage()">发货</v-btn>
          </v-toolbar>
        </v-card>
      </v-col>
      <v-col cols="12">
        <v-divider
          class="mx-4"
        ></v-divider>
        <v-subheader>
          已入库
        </v-subheader>
        <v-data-table
					v-model="selected"
					:headers="headers"
					:items="batchPackageList"
					item-key="id"
					show-select
					class="elevation-1"
					hide-default-footer
        >
        </v-data-table>
      </v-col> 
    </v-row>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      batchPackageList: [],
      searchStr: '',
      headers: [
        {
          sortable: false,
          text: '全选',
          value: 'user_defined_tracking',
        }
      ],
      selected: [],
    }),

    methods: {

      //搜索
      filterSearch () {

      },

      jumpToSendPackage: function(){
        let selectedContent = {};
        selectedContent.isLargeVolume = 1;
        selectedContent.selectedPackages = [];
        for(let myPackage of this.selected){
          selectedContent.selectedPackages.push(myPackage.id);
        }
        if(this.selected.length != 0){
          this.$router.push({ name: '我要发货', params: {_selectedContent: selectedContent}});
        }else{
          alert('请至少选择一个包裹');
        }
      },

      jumpToPackageDetail: function(package_id){
        this.$router.push({ path: '/package/detail', query: {packageId: package_id}});
      },

      getAll: function(){
        this.$http.get('/api/getThirdPartyPackageByUser',{
          params: {
            userId : this.$store.state.user.user_id,
            status: '已入库',
            packageType: '大货',
					}
        }).then( (res) => {
          this.batchPackageList = res.data;
          
        })
      }
    },

    mounted: function() {
      this.getAll();
		}
    
  }
</script>
