/**
 * 向后端请求用户的菜单，动态生成路由
 */
import { constantRouterMap } from '@/config/router.config'
import { generatorDynamicRouter } from '@/router/generator-routers'

import { getRoutes } from '@/api/system/role'

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      const router404 = {
        path: '*', redirect: '/404', hidden: true
      }
      // console.log(JSON.stringify(routers))
      state.addRouters = [routers, router404]
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateDynamicRoutes ({ commit }, data) {
      return new Promise(resolve => {
        getRoutes().then(response => {
          if (response.code !== 200) {
            this.$message({
              message: '菜单数据加载异常',
              type: 0
            })
          } else {
            generatorDynamicRouter(response.data).then(ret=>{
              commit('SET_ROUTERS', ret)
              resolve()
            })
          }
        }).catch(error => {
          console.log(error)
        })
      })
    }
  }
}

export default permission
