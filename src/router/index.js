/**
 * Vue Router
 *
 * @library
 *
 * https://router.vuejs.org/en/
 */

// Lib imports
import Vue from 'vue'
import VueAnalytics from 'vue-analytics'
import Router from 'vue-router'
import Meta from 'vue-meta'
import Homepage from '../views/HomePage'
import Login from '../views/LoginAndRegister/Login'
import ForgetPass from '../views/LoginAndRegister/ForgetPass'
import Register from '../views/LoginAndRegister/Register'
import SelectPlan from '../views/LoginAndRegister/SelectPlan.vue'
import BlogPage from '../views/BlogPage.vue'


//不理解，但是是为了解决 next()的时候路由导航钩子时出现"uncaught (in promise) undefined 
//https://blog.csdn.net/hgs_5683/article/details/101027580
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

Vue.use(Router)

export const constantRouterMap = [
  { path: '', component: Homepage, hidden: true},
  { path: '/login', component: Login, hidden: true },
  { path: '/forgetPass', component: ForgetPass, hidden: true },
  { path: '/register', component: Register, hidden: true },
  { path: '/register/selectplan', name: '账户选择', component: SelectPlan, hidden: true },
  { path: '/blogPage', name: '博客', component: BlogPage, hidden: true},
]
// Create a new router
const router = new Router({
  mode: 'hash',
  routes: constantRouterMap,
  
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    if (to.hash) {
      return { selector: to.hash }
    }
    return { x: 0, y: 0 }
  }
});


//用户类型:  admin, operator, default, premium, batch user, 
export const asyncRouterMap = [
  {
    path: '/dashboard',
    component: () => import('../Full.vue'),
    children: [
      {path: '/admin/homepage', name: '管理员首页', component: () => import('../views/AdminManagement/AdminHomePage.vue'),meta: { role: ['admin'] }},
      {path: '/admin/ratetable', name: 'Rate Table管理', component: () => import('../views/AdminManagement/RateTable.vue'),meta: { role: ['admin'] }},
      {path: '/admin/all_recipients', name: '收件人列表', component: () => import('../views/AdminManagement/AllRecipient.vue'),meta: { role: ['admin'] }},
      {path: '/admin/package_processing', name: '包裹处理', component: () => import('../views/AdminManagement/PackageProcessing.vue'),meta: { role: ['admin','operator'] }},
      {path: '/admin/process_package', name: '包裹处理', component: () => import('../views/AdminManagement/ProcessPackage.vue'),meta: { role: ['admin','operator'] }},
      {path: '/admin/childpackage_info', name: '快递单信息', component: () => import('../views/AdminManagement/childPackageInfoPage.vue'),meta: { role: ['admin','operator'] }},
      {path: '/admin/package_info', name: '发货单信息', component: () => import('../views/AdminManagement/PackageInfoPage.vue'),meta: { role: ['admin','operator'] }},
      
      {path: '/admin/mailbag_list', name: '邮袋列表', component: () => import('../views/AdminManagement/MailBagList.vue'),meta: { role: ['admin','operator'] }},
      {path: '/admin/mailbag_operation', name: '邮袋管理', component: () => import('../views/AdminManagement/MailBagOperation.vue'),meta: { role: ['admin','operator'] }},
      {path: '/admin/all_invoice', name: '所有账单', component: () => import('../views/AdminManagement/AllInvoice.vue'),meta: { role: ['admin','operator'] }},
      {path: '/dashboard', component: () => import('../views/Dashboard.vue')},
      {path: '/add_package', name: '添加包裹', component: () => import('../views/AdminManagement/AddPackage.vue'),meta: { role: ['admin','operator'] }},
      {path: '/add_batch_package', name: '批量添加包裹', component: () => import('../views/AdminManagement/AddBatchPackage.vue'),meta: { role: ['admin','operator'] }},
      {path: '/package/new_order', name: '添加发货单', component: () => import('../views/ForcastPackage.vue'),meta: { role: ['default'] }},
      {path: '/thirdparty_package', name: '第三方包裹', component: () => import('../views/AdminManagement/ThirdPartyPackageList.vue'),meta: { role: ['admin','operator'] }},
      {path: '/waitpackage_list', name: '待处理', component: () => import('../views/AdminManagement/WaitPackageList.vue'),meta: { role: ['admin','operator'] }},
      {path: '/finishpackage_list', name: '已处理', component: () => import('../views/AdminManagement/FinishPackageList.vue'),meta: { role: ['admin','operator'] }},

      {path: '/user_list', name: '用户列表', component: () => import('../views/UserManagement.vue'),meta: { role: ['admin','operator'] }},
      {path: '/package/send_package', name: '我要发货', component: () => import('../views/UserOperation/SentPackage.vue'),meta: { role: ['premium','batch user'] }},
      {path: '/package/mypackage', name: '我的包裹', component: () => import('../views/MyPackage.vue'),meta: { role: ['default','premium']}},
      {path: '/package/batch_mypackage', name: '全部包裹', component: () => import('../views/BatchMyPackage.vue'),meta: { role: ['batch user'] }},
      {path: '/recipients', name: '收件人管理', component: () => import('../views/RecipientsList.vue')},
      {path: '/package/detail', name: '包裹详情', component: () => import('../views/UserOperation/UserPackageDetail.vue')},
      {path: '/add_recipient', name: '添加收件人', component: () => import('../views/AddRecipient.vue')},
      {path: '/deposit', name: '充值', component: () => import('../views/Deposit.vue')},
      {path: '/payit', name: 'nihaoPay', component: () => import('../views/nihaopay.vue')},
      {path: '/invoice', name: '账单', component: () => import('../views/InvoiceList.vue')},
      {path: '/tracking_info', name: '包裹追踪', component: () => import('../views/Tracking.vue')},
      {path: '/account/upgrade', name: '账户升级', component: () => import('../views/UserSelect.vue')},
      

      { path: '*', redirect: '/' }
    ]
  }
]

Vue.use(Meta)

// Bootstrap Analytics
// Set in .env
// https://github.com/MatteoGabriele/vue-analytics
if (process.env.GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    id: process.env.GOOGLE_ANALYTICS,
    router,
    autoTracking: {
      page: process.env.NODE_ENV !== 'development'
    }
  })
}

export default router
