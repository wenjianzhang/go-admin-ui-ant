import { BasicLayout, RouteView } from '@/layouts'
import { bxAnaalyse } from '@/core/icons'

/**
 * 动态生成菜单
 * @param token
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (result) => {
  return new Promise((resolve, reject) => {
    let routers = generator(result)
    routers = routers.filter(item => item!== undefined)
    const rootRouter = {
      key: '',
      name: 'index',
      path: '/',
      component: BasicLayout,
      redirect: '/dashboard/analysis',
      meta: {
        title: '首页'
      },
      children: [
        {
          path: '/dashboard',
          name: 'dashboard',
          redirect: '/dashboard/analysis',
          component: RouteView,
          meta: { title: 'menu.dashboard', keepAlive: true, icon: bxAnaalyse, permission: [ 'dashboard' ] },
          children: [
            {
              path: '/dashboard/analysis',
              name: 'Analysis',
              component: () => import('@/views/dashboard/Analysis'),
              meta: { title: 'menu.dashboard.analysis', keepAlive: false, permission: [ 'dashboard' ] }
            },
            // // 外部链接
            // {
            //   path: 'https://www.baidu.com/',
            //   name: 'Monitor',
            //   meta: { title: 'menu.dashboard.monitor', target: '_blank' }
            // },
            {
              path: '/dashboard/workplace',
              name: 'Workplace',
              component: () => import('@/views/dashboard/Workplace'),
              meta: { title: 'menu.dashboard.workplace', keepAlive: true, permission: [ 'dashboard' ] }
            }
          ]
        },
        ...routers
      ]
    }
    resolve(rootRouter)
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {

      if(item.path && item.path !== "") {
        // const { title, show, hideChildren, hiddenHeaderContent, target, icon } = item || {}
        const currentRouter = {
          // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
          path: item.path.startsWith('/') ? item.path : '/'+item.path,
          // 路由名称，建议唯一
          name: item.menuName,
          // 该路由对应页面的 组件 :方案1
          // component: constantRouterComponents[item.component || item.key],
          // 该路由对应页面的 组件 :方案2 (动态加载)
          component: item.component === 'Layout' ? RouteView : (() => import(`@/views${item.component}`)),

          // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
          meta: {
            title: item.title,
            icon: item.icon || undefined,
            target: item.target,
            permission: item.permission
          }
        }

        // console.log(currentRouter)
        // 是否设置了隐藏菜单
        if (item.visible === '1') {
          currentRouter.hidden = true
        }
        // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
        if (!currentRouter.path.startsWith('http')) {
          currentRouter.path = currentRouter.path.replace('//', '/')
        }
        // 重定向
        // item.redirect && (currentRouter.redirect = item.redirect)
        // 是否有子菜单，并递归处理
        if (item.children && item.children.length > 0) {
          // Recursion
          currentRouter.children = generator(item.children, currentRouter)
        }
        return currentRouter
      }
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
