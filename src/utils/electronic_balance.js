import axios from 'axios';

export var ElectronicBalance = {
  init : function() {
    try {
      if (typeof(this.__balance) == "undefined") {
        this.__initBalance();
      }
      return this.__checkAndReturnBalance();
    } catch (err) {
      return { state : 'REINSTALL', balance : this.__balance };
    };
  },

  exit : function() {
    if (typeof(this.__balance) == "undefined") {
      this.__initBalance();
    }
    if (this.__balance != null){
      this.__balance.Exit;
    }
  },

  __initBalance : function() {
    this.__balance = document.createElement("object");
    this.__balance.setAttribute("width", 0);
    this.__balance.setAttribute("height", 0);
    this.__balance.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
    this.__balance.setAttribute("classid", "clsid:4DED24B2-B296-4DDF-8FC5-E682D2BBD902");
    document.documentElement.appendChild(this.__balance);
  },

  __checkAndReturnBalance : function() {
    if (this.__balance == null || typeof(this.__balance.GetRs232) == "undefined") {
      return { state : 'REINSTALL', balance : this.__balance };
    }
    return { state : 'OK', balance : this.__balance };
  },

};

export var LocalWindowsServiceBalance = {
  get_weight : function() {
    axios.get("/getWeight/get_weight").then( function (ret) {
      console.log(ret);
      if(ret[0].Status == "Success"){
        if (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(ret[0].Weight)) {
          return ret[0].Weight;
        }
      }
    });
  }
};


