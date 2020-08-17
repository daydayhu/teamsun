const notFound = r => require(['@/commonPages/404/index'], r);

export default [{
  path: '*',
  name: 'notFound',
  component: notFound,
  meta: {
    'title': ['404'],
  },
  children: []
}]
