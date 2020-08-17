const allTagList = r => require(['../../pages/tagManagement/allTagList'], r)

let routes = [{
  path: 'tagManagement/allTagList',
  name: 'allTagList',
  component: allTagList,
  meta: {
    'title': ['标签管理', '所有标签'],
    'id': 'rbac_front_auth_action_tagMagagement'
  },
  children: []
}
]

export default routes
