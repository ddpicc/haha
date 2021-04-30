  import md5 from 'js-md5';
  import axios from 'axios';
  export function invoke_junanApi(url, content){
    let api_key = process.env.VUE_APP_JUNANEX_APIKEY;
    let api_token = process.env.VUE_APP_JUNANEX_APITOKEN;
    let full_url = process.env.VUE_APP_JUNANEX_BASEURL + url;
    return new Promise (( resolve, reject) => {
      axios.post(full_url,{
        api_key: api_key,
        content: JSON.stringify(content),
        sign: md5(JSON.stringify(content) + api_token),
        }).then(function (response) {
        console.log('call junan api');
        resolve(response.data);
      }).catch(function (error) {
        console.log(error);
        reject(error);
      });
    })
    
  }