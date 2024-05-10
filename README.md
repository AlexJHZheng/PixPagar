# PixPagar
当前暂停使用，可以作为启动模版

## 入口流程
**1**- 登录模块   
src\views\login\index.vue   
handleLogin()方法进行登录   
**2**-Vuex   
第一步之后调用Vuex的action中的src\store\modules\user.js进行接口调用   
调用成功以后把token存储到cookie中之后返回   
**3**-返回登录模块路由跳转   
**4**-permission模块进行拦截    
src\permission.js
4.1有token的情况下，判断是否有roles，没有的话调用Vuex的action中的src\store\modules\user.js进行接口调用   
4.2有token的情况下，判断是否有roles，有的话直接跳转到目标路由   
4.3没有token的情况下，跳转到登录页面   
 

