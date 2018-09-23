<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <div style="margin-top: 15px;">
      <el-input placeholder="请输入内容" v-model="searchValue" @keyup.native.enter="search" style="width:300px">
        <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
      </el-input>
      <el-button type="success" plain @click="adddialogFormVisible = true">添加用户</el-button>
    </div>
    <template>
      <el-table :data="userList" border style="width: 100%;margin-top:15px">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column label="状态" width="60">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="changeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip effect="light" content="编辑" placement="top">
              <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="删除" placement="bottom">
              <el-button size="mini" type="primary" plain icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
            </el-tooltip>
            <el-tooltip effect="light" content="授权角色" placement="top">
              <el-button size="mini" type="primary" plain icon="el-icon-check" @click="handleCheck(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalPage">
    </el-pagination>
    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="adddialogFormVisible">
      <el-form :model="addForm" :rules="rules" ref="addForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="addForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth" prop="password">
          <el-input v-model="addForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="addForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="addForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="adddialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addsubmitForm('addForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑用户对话框 -->
    <el-dialog title="编辑用户" :visible.sync="editdialogFormVisible">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="editForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
          <el-input v-model="editForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" :label-width="formLabelWidth" prop="mobile">
          <el-input v-model="editForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editdialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editsubmitForm('editForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 授权角色对话框 -->
    <el-dialog title="授权角色" :visible.sync="grantdialogFormVisible">
      <el-form :model="grantForm" :rules="rules" ref="grantForm">
        <el-form-item label="用户名" :label-width="formLabelWidth" prop="username">
          <el-input v-model="grantForm.username" auto-complete="off" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色" :label-width="formLabelWidth" prop="email">
          <template>
            <el-select v-model="grantForm.rid" placeholder="请选择">
              <el-option v-for="item in options" :key="item.id" :label="item.roleName" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantdialogFormVisible = false">取 消</el-button>
        <el-button type="primary"  @click="grantsubmitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  getUserList,
  addUser,
  updateUser,
  editUser,
  deleteUser,
  rolesList,
  grantRoles
} from '@/api/index.js'
export default {
  data () {
    return {
      searchValue: '',
      userList: [],
      pagenum: 1,
      totalPage: 1,
      options: [],
      pagesize: 10,
      adddialogFormVisible: false,
      editdialogFormVisible: false,
      grantdialogFormVisible: false,
      formLabelWidth: '100px',
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {
        username: '',
        email: '',
        mobile: '',
        id: ''
      },
      grantForm: {
        username: '',
        id: '',
        rid: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱格式',
            trigger: 'blur,change'
          }
        ],
        mobile: [{ required: true, message: '请输入用户名', trigger: 'blur' }]
      }
    }
  },
  mounted () {
    this.initList()
  },
  methods: {
    // 分配用户角色
    grantsubmitForm () {
      if (!this.grantForm.id) {
        this.$message({
          message: '请选择角色，否则无法提交',
          type: 'danger'
        })
        return false
      } else {
        grantRoles(this.grantForm).then(res => {
          if (res.meta.status === 200) {
            this.$message({
              message: res.meta.msg,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.meta.msg,
              type: 'danger'
            })
          }
        })
        this.grantdialogFormVisible = false
      }
    },
    // 授权角色列表数据列表展示
    handleCheck (row) {
      this.grantdialogFormVisible = true
      this.grantForm.username = row.username
      this.grantForm.id = row.id
      rolesList().then(res => {
        if (res.meta.status === 200) {
          this.options = res.data
        }
      })
    },
    //  删除单个用户
    handleDelete (id) {
      deleteUser(id).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'danger'
          })
        }
        this.initList()
      })
    },
    // 编辑用户提交
    editsubmitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.editForm.id)
          editUser(this.editForm).then(res => {
            if (res.meta.status === 200) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'danger'
              })
            }
            this.editdialogFormVisible = false
            this.initList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 展示编辑的数据
    handleEdit (row) {
      this.editdialogFormVisible = true
      this.editForm.id = row.id
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
    },
    //  修改用户状态
    changeState (row) {
      updateUser({ id: row.id, type: row.mg_state }).then(res => {
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success'
          })
        } else {
          this.$message({
            message: res.meta.msg,
            type: 'danger'
          })
        }
      })
    },
    // 添加用户
    addsubmitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUser(this.addForm).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                message: res.meta.msg,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'danger'
              })
            }
            this.adddialogFormVisible = false
            this.initList()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 搜索
    search () {
      this.initList()
    },
    // 用户数据列表初始化
    initList () {
      getUserList({
        query: this.searchValue,
        pagenum: this.pagenum,
        pagesize: this.pagesize
      }).then(res => {
        console.log(res)
        this.userList = res.data.users
        this.totalPage = res.data.total
      })
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initList()
    }
  }
}
</script>

<style lang='scss' scoped>
/* 覆盖element导航菜单的样式 */
.el-breadcrumb {
  background-color: #f5f5f5;
  height: 45px;
  font-size: 15px;
  padding-left: 10px;
  line-height: 45px;
  margin-bottom: 15px;
}
</style>
