<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button type="success" plain @click="addroledialogFormVisible = true">添加角色</el-button>
        <template>
            <el-table :data="rolesList" border style="width: 100%;margin-top:15px">
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-row v-for="first in scope.row.children" :key="first.id" style="margin-bottom:15px">
                                <el-col :span="4">
                                    <span>
                                        <el-tag closable type="success" @close="deleteRight(scope.row.id,first.id)">
                                            {{first.authName}}
                                        </el-tag>
                                        <i class="el-icon-arrow-right"></i>
                                    </span>
                                </el-col>
                                <el-col :span="20">
                                    <el-row v-for="second in first.children" :key="second.id">
                                        <el-col :span="4">
                                            <span>
                                                <el-tag closable type="warning" @close="deleteRight(scope.row.id,second.id)">
                                                    {{second.authName}}
                                                </el-tag>
                                                <i class="el-icon-arrow-right"></i>
                                            </span>
                                        </el-col>
                                        <el-col :span="20">
                                            <span>
                                                <el-tag closable type="info" v-for="third in second.children" style="margin-bottom:10px;margin-right:15px" @close="deleteRight(scope.row.id,third.id)" :key="third.id">
                                                    {{third.authName}}
                                                </el-tag>
                                            </span>
                                        </el-col>
                                    </el-row>
                                </el-col>
                            </el-row>
                            <el-row v-if="scope.row.children.length===0">
                                <span>该角色还没有分配任何的权限</span>
                            </el-row>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column prop="roleName" label="角色名称" width="180">
                </el-table-column>
                <el-table-column prop="roleDesc" label="描述" width="180">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip effect="light" content="编辑" placement="top">
                            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" content="删除" placement="bottom">
                            <el-button size="mini" type="primary" plain icon="el-icon-delete" @click="deleteRole(scope.row.id)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" content="授权角色" placement="top">
                            <el-button size="mini" type="primary" plain icon="el-icon-check" @click="showGrantData(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <!-- 添加角色对话框 -->
        <el-dialog title="添加角色" :visible.sync="addroledialogFormVisible">
            <el-form :model="roleform" :rules="rules" ref="roleform">
                <el-form-item label="活动名称" :label-width="formLabelWidth" prop="roleName">
                    <el-input v-model="roleform.roleName" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="活动名称" :label-width="formLabelWidth" prop="roleDesc">
                    <el-input v-model="roleform.roleDesc" auto-complete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addroledialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="rolesubmitForm('roleform')">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 授权对话框 -->
        <el-dialog title="分配权限" :visible.sync="rightroledialogFormVisible">
            <div style="height:300px;overflow:auto">
                <el-tree :data="grantRightList"
                show-checkbox node-key="id"
                 ref="tree"
                :default-expanded-keys="[]"
                :default-expand-all='true'
                :default-checked-keys="checkedRightId"
                :props="defaultProps">
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelSubmit">取 消</el-button>
                <el-button type="primary" @click="rightsubmitForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {
  rolesList,
  addRoles,
  deleteRole,
  deleteRight,
  getRightList,
  submitRightRoles
} from '@/api/index.js'
export default {
  data () {
    return {
      rolesList: [],
      addroledialogFormVisible: false,
      formLabelWidth: '120px',
      grantRightList: [],
      rightroledialogFormVisible: false,
      checkedRightId: [],
      id: '',
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      roleform: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色的描述', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.initRoleList()
  },
  methods: {
    //   取消提交授权
    cancelSubmit () {
      this.rightroledialogFormVisible = false
      this.$refs.tree.setCheckedKeys([])
    },
    //   提交角色授权
    rightsubmitForm () {
      // 获取选中的数组对象
      var arr = this.$refs.tree.getCheckedNodes()
      //   console.log(arr)
      var ridsArr = arr.map(item => {
        return item.id + ',' + item.pid
      })
      var tempArr = Array.from(new Set(ridsArr.join(',').split(',')))
      submitRightRoles(this.roleId, {rids: tempArr.join(',')}).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.$refs.tree.setCheckedKeys([])
        } else {
          this.$message({
            type: 'danger',
            message: res.meta.msg
          })
        }
        this.rightroledialogFormVisible = false
        this.initRoleList()
      })
    },
    //   展示授权的数据
    showGrantData (row) {
      this.roleId = row.id
      this.rightroledialogFormVisible = true
      getRightList('tree').then(res => {
        this.grantRightList = res.data
      })
      //   清空上次选中的
      this.checkedRightId.length = 0
      //   把选中的id号追加到checkedRightId数组中
      if (row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children.length > 0) {
                second.children.forEach(third => {
                  this.checkedRightId.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    //   删除指定角色的权限
    deleteRight (roleId, rightId) {
      deleteRight(roleId, rightId).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            type: 'success',
            message: res.meta.msg
          })
          this.initRoleList()
        } else {
          this.$message({
            type: 'danger',
            message: res.meta.msg
          })
        }
      })
    },
    //   删除角色
    deleteRole (id) {
      this.$confirm(`此操作将永久删除id为${id}的角色`, '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // console.log(id)
          deleteRole(id).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
              this.initRoleList()
            } else {
              this.$message({
                type: 'danger',
                message: res.meta.msg
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    //   角色列表初始化
    initRoleList () {
      rolesList().then(res => {
        if (res.meta.status === 200) {
          this.rolesList = res.data
        }
      })
    },
    //   添加角色
    rolesubmitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addRoles(this.roleform).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
            } else {
              this.$message({
                type: 'danger',
                message: res.meta.msg
              })
            }
            this.initRoleList()
            this.addroledialogFormVisible = false
            this.$refs[formName].resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
</style>
