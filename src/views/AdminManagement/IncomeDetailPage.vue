<template>
  <v-container
    fill-height
    fluid
    grid-list-xl
  >
    <v-row justify="center">
      <v-col cols="12">
        <material-card 
          flat
					color="green"
          title="汇总统计"
        >
          <v-row>
            <v-col cols="12" sm="12" lg="4" md="4">
              <v-date-picker full-width v-model="dates" :allowed-dates="allowedDates" range color="green"></v-date-picker>
            </v-col>
            <v-col cols="12" sm="12" lg="8" md="8">
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
                @click="today"
              >
                今天
              </v-chip>
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
                @click="last7days"
              >
                最近7天
              </v-chip>
              <v-chip
                class="ma-2"
                color="green"
                text-color="white"
                @click="last30days"
              >
                最近30天
              </v-chip>
              <v-card
                class="mx-auto"
              >
                <v-card-text>
                  <v-text-field v-model="dateRangeText" label="时间范围" readonly :append-icon=iconChange color="blue darken-2" @click:append="actionGenerate"></v-text-field>
                  <div  ref="print" v-if="reportDisplay">
                    <h3 style="text-align:center">{{dateRangeText}} 详情</h3>
                    <v-list subheader dense>
                      <v-subheader>总计</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>总收入</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalIncome}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>总支出</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalOutcome}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-subheader>收入</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>充值总数</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalDeposit}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>充值笔数</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{depositNm}}次</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>平均每天</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{averageIncome}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-subheader>支出</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>运费账单总数</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalCharge}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>物料费用</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalMaterial}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>平均每天</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{averageProfit}}元</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>

                      <v-subheader>包裹</v-subheader>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>处理包裹总数</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{totalPackage}}个</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-list-item>
                        <v-list-item-content>
                          <v-list-item-title>平均每天</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-list-item-title>{{averagePatient}}个</v-list-item-title>
                        </v-list-item-action>
                      </v-list-item>
                      <v-divider></v-divider>
                    </v-list>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </material-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { dateToString, stringToDate, getNowFormatDate} from '../../utils/helpFunction';
  export default {
    data: () => ({
      dates: [],
      reportDisplay: false,
      totalIncome: 0,
      iconChange: 'mdi-check-bold',
      monthSalesChart: {
        data: [],
      },
      monthProfitChart: {
        data: [],
      },
      chartColor: ['#00bbbb', '#00bb5e','#bb5e2f','#cccc00'],
    }),

    methods: {
			allowedDates: val => Date.parse(val) < Date.now(),

      today: function(){
        let todayDate = getNowFormatDate();
        this.dates = [];
        this.dates.push(todayDate);
        this.dates.push(todayDate);
      },

      last7days: function(){
        var end = dateToString(new Date());
        var start = dateToString(new Date(new Date().setDate(new Date().getDate()-6)));
        this.dates = [];
        this.dates.push(start);
        this.dates.push(end);
      },

      last30days: function(){
        var end = dateToString(new Date());
        var start = dateToString(new Date(new Date().setDate(new Date().getDate()-29)));
        this.dates = [];
        this.dates.push(start);
        this.dates.push(end);
      },

      actionGenerate: function(){
        this.monthSalesChart.data = [];
        this.monthProfitChart.data = [];
        if(this.reportDisplay != true){
          this.reportDisplay = true;
          this.iconChange = 'mdi-close';
          var start = this.dates[0];
          var end = this.dates[1];
          let days = (stringToDate(end) - stringToDate(start)) / (1000*3600*24) + 1;
          this.$http.get('/api/getOrdBetweenDates', {
            params: {
              dbs_a : this.$store.state.user.dbs_prefix+'ordlist',
              dbs_b : this.$store.state.user.dbs_prefix+'patient',
              startDate: start,
              endDate: end
            }
          }).then(response => {
              this.calculateAndAnalysis(response.data,days);            						
            }
          );
        }else{
          this.reportDisplay = false;
          this.iconChange = 'mdi-check-bold';
          tjos.dates = [];
        }
      },

      calculateAndAnalysis: function(orderObj,days){
        //alert(JSON.stringify(orderObj));
        let _totalIncome = 0, _totalProfit = 0, _averageIncome = 0, _averageProfit = 0;
        let _incomeMianjian = 0, _incomeXiyao = 0, _incomeYaowan = 0, _incomeCaoyao = 0;
        let _profitMianjian = 0, _profitXiyao = 0, _profitYaowan = 0, _profitCaoyao = 0;
        let _taotalPatient = 0, _averagePatient = 0, _gt20Patient = 0, _lt20Patient = 0;
        let _jianyaoTimes = 0;
        for(let item of orderObj){
          if(item.medtype == "免煎"){
            _incomeMianjian = parseFloat((_incomeMianjian + item.total).toFixed(2));
            _profitMianjian = parseFloat((_profitMianjian + item.totalprofit).toFixed(2));
          } 
          else if(item.medtype == "草药"){
            _incomeCaoyao = parseFloat((_incomeCaoyao + item.total).toFixed(2));
            _profitCaoyao = parseFloat((_profitCaoyao + item.totalprofit).toFixed(2));
          }
          else if(item.medtype == "西药"){
            _incomeXiyao = parseFloat((_incomeXiyao + item.total).toFixed(2));
            _profitXiyao = parseFloat((_profitXiyao + item.totalprofit).toFixed(2));
          }
          else if(item.medtype == '药丸'){
            _incomeYaowan = parseFloat((_incomeYaowan + item.total).toFixed(2));
            _profitYaowan = parseFloat((_profitYaowan + item.totalprofit).toFixed(2)); 
          }
          _totalIncome = parseFloat((_totalIncome + item.total).toFixed(2));
          _totalProfit = parseFloat((_totalProfit + item.totalprofit).toFixed(2));
          _taotalPatient = _taotalPatient + 1;
          
          if(parseInt(item.age) > 20){
            _gt20Patient = _gt20Patient + 1;
          }else{
            _lt20Patient = _lt20Patient + 1;
          }
          let searchStr = JSON.stringify(item.medarray);
          if(searchStr.indexOf('煎药') != -1){
            _jianyaoTimes = _jianyaoTimes + item.dose;
          }
        }
        _averageIncome = parseFloat((_totalIncome / days).toFixed(2));
        _averageProfit = parseFloat((_totalProfit / days).toFixed(2));
        _averagePatient = parseFloat((_taotalPatient / days).toFixed(2));
        //赋值
        this.totalIncome = _totalIncome;
        this.totalProfit = _totalProfit;
        this.averageIncome = _averageIncome;
        this.averageProfit = _averageProfit;
        //收入
        this.incomeMianjian = _incomeMianjian;
        this.incomeCaoyao = _incomeCaoyao;
        this.incomeXiyao = _incomeXiyao;
        this.incomeYaowan = _incomeYaowan;
        //利润
        this.profitMianjian = _profitMianjian;
        this.profitCaoyao = _profitCaoyao;
        this.profitXiyao = _profitXiyao;
        this.profitYaowan = _profitYaowan;
        //病人
        this.totalPatient = _taotalPatient;
        this.averagePatient = _averagePatient;
        this.gt20Patient = _gt20Patient;
        this.lt20Patient = _lt20Patient;
        //其它
        this.jianyaoTimes = _jianyaoTimes;
        this.monthSalesChart.data.push(['免煎', this.incomeMianjian]);
        this.monthSalesChart.data.push(['草药', this.incomeCaoyao]);
        this.monthSalesChart.data.push(['西药', this.incomeXiyao]);
        this.monthSalesChart.data.push(['药丸', this.incomeYaowan]);

        this.monthProfitChart.data.push(['免煎', this.profitMianjian]);
        this.monthProfitChart.data.push(['草药', this.profitCaoyao]);
        this.monthProfitChart.data.push(['西药', this.profitXiyao]);
        this.monthProfitChart.data.push(['药丸', this.profitYaowan]);

      },
    },
    
    computed: {
      dateRangeText () {
        return this.dates.join(' ~ ')
      },
    },

    
  }
</script>
