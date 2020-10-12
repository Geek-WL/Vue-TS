import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from "@/views/Home.vue";
import Register from '../views/Register.vue'
import Login from "@/views/Login.vue";
import Admin from "@/views/Admin.vue";
import Cookies from "js-cookie";
import Welcome from '../components/Welcome.vue'
import Rights from "@/components/Rights.vue";
import Roles from "@/components/Roles.vue";
import Users from "@/components/Users.vue";
import Error401 from "@/components/error-page/Error401.vue";
import Error404 from "@/components/error-page/Error404.vue";
import Error500 from "@/components/error-page/Error500.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
      path: '/',
      name: 'Home',
      redirect: '/admin',
      component: Home
    },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ,
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    redirect: '/welcome',
    children: [
      {path: '/welcome', component: Welcome},
      {path: '/roles', component: Roles},
      {path: '/rights', component: Rights},
      {path: '/users', component: Users},
      {path: '/error401', component: Error401},
      {path: '/error404', component: Error404},
      {path: '/error500', component: Error500},
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// 添加路由守卫 实现权限控制
router.beforeEach((to, from, next) => {
   // 1.如果访问的是注册或登录页面，就放行
  if(to.path === '/login' || to.path === '/register' || to.path === '/error401' || to.path === '/error404' || to.path === '/error500') {
    return next();
  }
  // 2.获取当前的登录状态
  // const token = sessionStorage.getItem('token');
  const token = Cookies.get('token');
  // 3.访问其他路由需要判断是否已经登录，如果没有登录那么就需要强制跳转
  if(!token) {
    return next('/login');
  }
  const routerRights = getRouterRights();
  const flag = isNext(routerRights, to.path);
  // console.log(flag);
  // console.log(routerRights);
  // 如果已登录  直接放行
  if(flag) {
    next(); // 有权限 可以跳转
  } else {
    next(false) // 没有权限
  }
});
const isNext = (routerRights: any, path: string) => {
  if(routerRights.rightsPath === path) return true;
  if(routerRights.children) {
    for(let i = 0; i < routerRights.children.length; i++) {
      const item = routerRights.children[i];
      if(isNext(item, path)) return true;
    }
  }
  return false;
};
const getRouterRights = () => {
  const data = sessionStorage.getItem('userInfo');
  if(!data) return null;
  const userInfo = JSON.parse(data);
  const routerRights = userInfo.rightsTree.filter((rights: any) => {
    if(rights.rightsType === 'router') return rights;
  });
  return routerRights[0];
};

export default router
