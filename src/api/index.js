import axios from 'axios'
// 设置基准路径
const baseURL = 'http://localhost:8888/api/private/v1/'
axios.defaults.baseURL = baseURL
// 设置拦截器
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('mytoken')
  // Do something before request is sent
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})
// 登陆
export const login = (params) => {
  return axios.post('login', params).then(res => {
    return res.data
  })
}
// 获取用户数据列表
export const getUserList = (params) => {
  return axios.get('users', {params: params}).then(res => {
    return res.data
  })
}
// 添加用户
export const addUser = (params) => {
  return axios.post('users', params).then(res => {
    return res.data
  })
}
//  修改用户状态
export const updateUser = (params) => {
  return axios.put(`users/${params.id}/state/${params.type}`).then(res => {
    return res.data
  })
}
// 编辑用户提交
export const editUser = (params) => {
  return axios.put(`users/${params.id}`, {email: params.email, mobile: params.mobile}).then(res => {
    return res.data
  })
}
//  删除单个用户
export const deleteUser = (id) => {
  return axios.delete(`users/${id}`).then(res => {
    return res.data
  })
}
// 获取角色列表
export const rolesList = () => {
  return axios.get('roles').then(res => {
    return res.data
  })
}
// 分配用户角色
export const grantRoles = (params) => {
  return axios.put(`users/${params.id}/role`, {rid: params.rid}).then(res => {
    return res.data
  })
}
// 左侧菜单权限
export const getMenus = () => {
  return axios.get('menus').then(res => {
    return res.data
  })
}
// 所有权限列表
export const getRightList = (type) => {
  return axios.get(`rights/${type}`).then(res => {
    return res.data
  })
}
// 添加角色
export const addRoles = (params) => {
  return axios.post('roles', params).then(res => {
    return res.data
  })
}
//  删除角色
export const deleteRole = (id) => {
  return axios.delete(`roles/${id}`).then(res => {
    return res.data
  })
}
// 删除角色指定权限
export const deleteRight = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`).then(res => {
    return res.data
  })
}
// 提交授权角色
export const submitRightRoles = (roleId, params) => {
  return axios.post(`roles/${roleId}/rights`, params).then(res => {
    return res.data
  })
}
//  商品分类列表
export const getCategoriesList = (params) => {
  return axios.get('categories', {params: params}).then(res => {
    return res.data
  })
}
// 添加分类
export const addCategories = (params) => {
  return axios.post('categories', params).then(res => {
    return res.data
  })
}
//  商品列表数据
export const getGoods = (params) => {
  return axios.get('goods', {
    params: params
  }).then(res => {
    return res.data
  })
}
// 添加商品
export const addGoods = (params) => {
  return axios.post('goods', params).then(res => {
    return res.data
  })
}
