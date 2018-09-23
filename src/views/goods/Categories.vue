<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <div style="marginTop:15px">
            <el-button type="success" plain @click="showCatData">添加角色</el-button>
        </div>
        <tree-grid :treeStructure="true" :columns="columns" :data-source="categoriesList" @deleteCate="deleteCategory" @editCate="editCategory">
        </tree-grid>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pagenum" :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
        <!-- 添加分类对话框 -->
        <el-dialog title="添加商品分类" :visible.sync="addroledialogFormVisible">
            <el-form :model="addform" :rules="rules" ref="addform" label-width="100px">
                <el-form-item label="分类名称"  prop="cat_name">
                    <el-input v-model="addform.cat_name" auto-complete="off"></el-input>
                </el-form-item>
                <el-form-item label="父级名称"  >
                    <el-cascader
                    :options="options"
                    v-model="selectedOptions"
                     @change="handleChange"
                     :props='props'>
                    </el-cascader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addroledialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCatsubmit('addform')">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import TreeGrid from '@/components/TreeGrid/TreeGrid.vue'
import { getCategoriesList, addCategories } from '@/api/index.js'
export default {
  data () {
    return {
      dataSource: [],
      categoriesList: [],
      options: [],
      selectedOptions: [],
      props: {
        label: 'cat_name',
        children: 'children',
        value: 'cat_id'
      },
      addroledialogFormVisible: false,
      addform: {
        cat_name: '',
        cat_pid: '',
        cat_level: ''
      },
      rules: {
        cat_name: [{}]
      },
      pagesize: 10,
      pagenum: 1,
      total: 0,
      columns: [
        {
          text: '分类名称',
          dataIndex: 'cat_name',
          width: ''
        },
        {
          text: '是否有效',
          dataIndex: 'cat_deleted',
          width: ''
        },
        {
          text: '排序',
          dataIndex: 'cat_level',
          width: ''
        }
      ]
    }
  },
  components: {
    'tree-grid': TreeGrid
  },
  methods: {
    //   提交分类商品
    addCatsubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.selectedOptions.length === 0) {
            this.addform.cat_pid = 0
            this.addform.cat_level = 0
          } else if (this.selectedOptions.length === 1) {
            this.addform.cat_pid = this.selectedOptions[0]
            this.addform.cat_level = 1
          } else if (this.selectedOptions.length === 2) {
            this.addform.cat_pid = this.selectedOptions[1]
            this.addform.cat_level = 2
          }
          addCategories(this.addform).then(res => {
            console.log(res)
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
            this.addroledialogFormVisible = false
            this.initCategoriesList()
            this.$refs[formName].resetFields()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //   展示分类数据
    showCatData () {
      this.addroledialogFormVisible = true
      getCategoriesList({type: 2}).then(res => {
        if (res.meta.status === 200) {
          this.options = res.data
        }
      })
    },
    handleChange () {},
    deleteCategory (cid) {
      console.log(cid)
    },
    editCategory (cid) {
      console.log(cid)
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initCategoriesList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initCategoriesList()
    },
    // 分类列表初始化
    initCategoriesList () {
      getCategoriesList({
        type: 3,
        pagesize: this.pagesize,
        pagenum: this.pagenum
      }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.categoriesList = res.data.result
          this.total = res.data.total
        }
      })
    }
  },
  mounted () {
    this.initCategoriesList()
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
