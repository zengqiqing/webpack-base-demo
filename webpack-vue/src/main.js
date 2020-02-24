//核心入口文件

import Vue from 'vue'
import App from './app.vue'
import VueRouter from 'vue-router'
import Home from './views/Home.vue'
import Login from './views/Login.vue'

Vue.use(VueRouter)


const router = new VueRouter({
  routes:[
    {path:'/',redirect:'/home'},
    {path:'/home',component:Home},
    {path:'/login',component:Login},

  ]
})

new  Vue({
  render:(createElement)=>{createElement(App)}, 
  router
}).$mount('#app')