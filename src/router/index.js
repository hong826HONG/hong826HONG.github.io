import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login.vue'
import Home from '../views/Home.vue'
import Users from '../views/users/Users.vue'
import Right from '../views/rights/Right.vue'
import Role from '../views/rights/Role.vue'
import Params from '../views/goods/Params.vue'
import Categories from '../views/goods/Categories.vue'
import Gooods from '../views/goods/Goods.vue'
import Add from '../views/goods/GoodAdd.vue'
import List from '../views/goods/GoodsList.vue'
import Reports from '../views/reports/Reports.vue'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [
        {
          path: 'users',
          name: 'Users',
          component: Users
        }, {
          path: 'rights',
          name: 'Right',
          component: Right
        },
        {
          path: 'roles',
          name: 'Role',
          component: Role
        },
        {
          path: 'paramss',
          name: 'Params',
          component: Params
        },
        {
          path: 'goods',
          name: 'Gooods',
          component: Gooods,
          redirect: {path: 'goods/list'},
          children: [{
            path: 'list',
            name: 'List',
            component: List
          }, {path: 'add', name: 'Add', component: Add}]
        },
        {
          path: 'categories',
          name: 'Categories',
          component: Categories
        }, {
          path: 'reports',
          name: 'Reports',
          component: Reports
        }
      ]
    }
  ]
})
