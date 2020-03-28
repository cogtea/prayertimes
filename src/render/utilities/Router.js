export default new Router({
  routes: [
    { path: '/', component: Home},
    { path: '*', redirect: '/'}
  ]
});