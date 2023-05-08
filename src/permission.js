import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  // 如果token有效则判断是否为登录页
  if (hasToken) {
    console.log('步骤1')
    if (to.path === '/login') {
      console.log('步骤2')
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done() // hack: https://github.com/PanJiaChen/vue-element-admin/pull/2939
    } else {
      console.log('步骤3')
      // 检查token是否有效
      const checkToken=await store.dispatch('user/checkToken',hasToken)
      console.log('checkToken',checkToken)
      // 如果无效则返回登录页并清除cookie
      if(!checkToken){
        console.log('如果无效则返回登录页并清除cookie')
        await store.dispatch('user/resetToken')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        console.log('步骤4')
        //通过权限获取路由
        const accessRoutes = await store.dispatch('permission/generateRoutes', store.getters.roles)
        // dynamically add accessible routes
        //渲染侧边栏
        router.addRoutes(accessRoutes)
        next()
      } else {
        try {
          console.log('步骤5')
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) {
          console.log('步骤6')
          // 尝试通过refresh_token获取新的token
          const res = await store.dispatch('user/refreshToken')
          // 判断是否成功，成功则继续执行步骤5，失败则继续清除token，跳转到登录页
          if(res){  
            const { roles } = await store.dispatch('user/getInfo')
            const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
            // dynamically add accessible routes
            //渲染侧边栏
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
            NProgress.done()
          }else{
            // remove token and go to login page to re-login
            await store.dispatch('user/resetToken')
            Message.error(error || 'Has Error')
            next(`/login?redirect=${to.path}`)
            NProgress.done()
          }
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
