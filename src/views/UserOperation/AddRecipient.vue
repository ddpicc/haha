<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12" md="6">
				<v-card>
					<v-card-text>
						<v-container>
							<v-row>
								<v-col cols="12" sm="12" md="4">
									<v-text-field label="姓名" v-model="recipientName" :rules="requiredRule"></v-text-field>
								</v-col>
								<v-col cols="12" sm="4" md="3">
									<v-select v-model="phoneCode" 
										:items="phoneCodeList"
										label="Code"
									></v-select>
								</v-col>
								<v-col cols="12" sm="8" md="5">
									<v-text-field label="手机号码" v-model="recipientPhone" :rules="requiredRule"></v-text-field>
								</v-col>
								<v-col cols="12" v-if="phoneCode == 'China +86'">
									<v-text-field label="身份证号码" v-model="recipientIdentityCard" :rules="requiredRule"></v-text-field>
								</v-col>
								<v-col cols="12">
									<v-text-field label="地址" v-model="recipientAddress" :rules="requiredRule"></v-text-field>
								</v-col>								
								<v-col cols="12" sm="4" md="4">
                  <v-select v-model="recipientState" 
										:items="stateList"
										label="省/州"
                    :rules="requiredRule"
									></v-select>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-text-field label="城市" v-model="recipientCity" :rules="requiredRule"></v-text-field>
								</v-col>
								<v-col cols="12" sm="4" md="4">
									<v-text-field label="邮编" v-model="recipientZip" v-if="phoneCode != 'China +86'"></v-text-field>
								</v-col>
							</v-row>
						</v-container>
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="cancel">取消</v-btn>
						<v-btn color="blue darken-1" text @click="save">保存</v-btn>
					</v-card-actions>
				</v-card>
      </v-col>
			<v-col cols="12" md="6">
				<v-card>
					<v-card-text>
						<v-container>
							<v-textarea
								solo
								label="智能识别地址信息"
                 v-model="regAddress"
							></v-textarea>
						</v-container>
					</v-card-text>
          <v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="blue darken-1" text @click="parseAddress">确认</v-btn>
					</v-card-actions>
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
</template>

<script>
  import AddressParse from 'zh-address-parse'
  import {USStates, CNStates, CNCity} from '../../utils/helpFunction'
  export default {
    data: () => ({
      snackbar: false,
      snackbarColor: '',
      notification: '',
      snackbarTimeout: 300,
      recipientName: '',
      phoneCode: 'China +86',
      phoneCodeList: ['China +86', 'USA +1'],
      recipientPhone: '',
      recipientIdentityCard: '',
      recipientAddress: '',
      recipientState: '',
      recipientCity: '',
      recipientZip: '',
      recipientId: '',
      regAddress: '',
      stateList: CNStates,
      cityList: [],
      requiredRule: [
          v => !!v || 'Item is required',
      ]

    }),

    methods: {
      parseAddress: function(){
        let id_cardArray = this.regAddress.match(/(\d{15}$)|(\d{18}$)|(\d{17}(\d|X|x)$)/);
        let parseStr = '';
        if(id_cardArray){
          this.recipientIdentityCard = id_cardArray[0];
          let index = this.regAddress.search(/(\d{15}$)|(\d{18}$)|(\d{17}(\d|X|x)$)/);
          parseStr = this.regAddress.substring(0,index);
        }else{
          parseStr = this.regAddress;
        }
        
        const options = {
          type: 0, // 哪种方式解析，0：正则，1：树查找
          textFilter: [], // 预清洗的字段
          nameMaxLength: 4, // 查找最大的中文名字长度
        }
        const parseResult = AddressParse(parseStr, options);
        this.recipientName = parseResult.name;
        this.phoneCode = 'China +86';
        this.recipientPhone = parseResult.phone;
        this.recipientAddress = parseResult.area + parseResult.detail;
        this.recipientState = parseResult.province;
        this.recipientCity = parseResult.city;
      },

      getEditRecipient: function(item){
        this.$http.get('/api/getRecipientbybyId',{
          params: {
						id : this.recipientId,
					}
        }).then( (res) => {
          let recipientJson = res.data[0];
          this.recipientName = recipientJson.name;
          this.phoneCode = recipientJson.country_code;
          this.recipientPhone = recipientJson.phone;
          this.recipientIdentityCard = recipientJson.identity_card;
          this.recipientAddress = recipientJson.address;
          this.recipientState = recipientJson.state;
          this.recipientCity = recipientJson.city;
          this.recipientZip = recipientJson.zip;
        })
        
      },

      clearVariable: function(){
        this.recipientName = '';
        this.recipientPhone = '';
        this.recipientIdentityCard = '';
        this.recipientAddress = '';
        this.recipientState = '';
        this.recipientCity = '';
        this.recipientZip = '';
        this.phoneCode = 'China +86';
        this.defaultAddress = false;
        this.regAddress = "";
      },

      save: function(){
        if(this.recipientId != undefined){
          this.$http.post('/api/updateRecipientbyId',{   
              recipientName : this.recipientName,
              countryCode : this.phoneCode,
              recipientPhone : this.recipientPhone,
              recipientIdentityCard : this.recipientIdentityCard,
              recipientAddress : this.recipientAddress,
              recipientState : this.recipientState,
              recipientCity : this.recipientCity,
              recipientZip : this.recipientZip,
              id: this.recipientId            
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '修改成功';
            this.snackbarColor = 'green';
          })
        }else{
          this.$http.post('/api/insertRecipient',{
              userId : this.$store.state.user.user_id,          
              recipientName : this.recipientName,
              countryCode : this.phoneCode,
              recipientPhone : this.recipientPhone,
              recipientIdentityCard : this.recipientIdentityCard,
              recipientAddress : this.recipientAddress,
              recipientState : this.recipientState,
              recipientCity : this.recipientCity,
              recipientZip : this.recipientZip,
          }).then( (res) => {
            this.snackbar = true;
            this.notification = '增加成功';
            this.snackbarColor = 'green';
          })
        }
        this.clearVariable();
      },

      cancel: function(){
        this.$router.push({ path: '/recipients'});
      }
    },

    mounted: function() {
      if(this.recipientId != undefined){
        this.getEditRecipient();
      }
    },
    
    created() {
      this.recipientId = this.$route.params.recipient_id;
    },

    watch: {
      phoneCode: function(){
        if(this.phoneCode == 'China +86')
          this.stateList = CNStates;
        else{
          this.stateList = USStates;
          this.recipientCity = '';
        }
      },
    }
        
  }
</script>
