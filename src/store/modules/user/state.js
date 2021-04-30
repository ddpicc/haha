import Cookies from 'js-cookie';
export default {
    token: Cookies.get('Admin-Token'),
    name: '',
    storage_number: '',
    roles: '',
    user_id: '',
    balance: 0,
  }