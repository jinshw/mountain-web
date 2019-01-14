import layoutHeaderAside from '@/layout/header-aside'

const meta = { requiresAuth: true }

export default {
  path: '/sys',
  name: 'sys',
  meta,
  redirect: { name: 'sys-admin' },
  component: layoutHeaderAside,
  children: (pre => [
    { path: 'admin', name: `${pre}admin`, component: () => import('@/pages/sys/admin'), meta: { meta, title: '管理员管理' } },
    { path: 'dept', name: `${pre}dept`, component: () => import('@/pages/sys/dept'), meta: { meta, title: '部门管理' } },
    { path: 'role', name: `${pre}role`, component: () => import('@/pages/sys/role'), meta: { meta, title: '角色管理' } },
    { path: 'menu', name: `${pre}menu`, component: () => import('@/pages/sys/menu'), meta: { meta, title: '菜单管理' } }
  ])('sys-')
}
