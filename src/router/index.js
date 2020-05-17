import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

  {
    path: '/order',
    component: Layout,
    redirect: '/order/orderlists',
    name: 'Order',
    meta: { title: '订单管理', icon: 'example' },
    children: [
      {
        path: 'orderlists',
        name: 'Orderlists',
        component: () => import('@/views/order_admin/orderlists/index'),
        meta: { title: '订单列表', icon: 'form' }
      },
      {
        path: 'orderedit',
        name: 'Orderedit',
        component: () => import('@/views/order_admin/orderedit/index'),
        meta: { title: '订单处理', icon: 'form' }
      }
    ]
  },

  {
    path: '/distribution',
    component: Layout,
    redirect: '/distribution/distribution_list',
    name: 'Distribution',
    meta: { title: '物流管理', icon: 'example' },
    children: [
      {
        path: 'dis_list',
        name: 'Distribution_list',
        component: () => import('@/views/distribution/dis_list/index'),
        meta: { title: '物流列表', icon: 'form' }
      },
      {
        path: 'dis_edit',
        name: 'Dis_edit',
        component: () => import('@/views/distribution/dis_edit/index'),
        meta: { title: '物流编辑', icon: 'form' }
      }
    ]
  },
  {
    path: '/users',
    component: Layout,
    name: 'Users',
    meta: { title: '用户管理', icon: 'example' },
    children: [
      {
        path: 'users_admin',
        name: 'Users_admin',
        component: () => import('@/views/users_admin/index'),
        meta: { title: '用户管理', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
