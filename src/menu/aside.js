// 菜单 侧边栏
export default [
  { path: '/index', title: '首页', icon: 'home' },
  {
    title: '权限管理',
    icon: 'folder-o',
    children: [
      { path: '/sys/admin', title: '管理员管理' },
      { path: '/sys/dept', title: '部门管理' },
      { path: '/sys/role', title: '角色管理' },
      { path: '/sys/menu', title: '菜单管理' }
    ]
  }
]



