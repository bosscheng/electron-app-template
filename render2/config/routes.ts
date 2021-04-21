export default [
  {
    path: "/login",
    component: './Login/index'
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/home',
          },
          {
            path: '/home',
            name: 'home',
            icon: 'smile',
            component: './Home',
          },
          {
            path: '/test',
            name: 'test',
            icon: 'smile',
            component: './Test',
          }
        ]
      },
      {
        component: './errorPage/404'
      }
    ]
  },
  {
    component: './errorPage/404'
  }
]
