import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import CONSTANTS from '@/utils/Constants'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/chat',
    name: 'Home',
    component: Home,
    redirect:{name:'ChatRoom'},
    children: [
      {
        path: 'chatroom',
        name: 'ChatRoom',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/ChatRoom.vue'),
        beforeEnter:(to,from,next)=>{
            const user =  sessionStorage.getItem(CONSTANTS.USER_KEY);
            if(user === null)
              next({name:'Login'})
            else
              next()
        }
      },
      {
        path: 'about',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      }
    ]
  },
  {
    path: '/',
    name: 'root',
    redirect:{name:'Home'}
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  routes
})

export default router
