<template>
    <div>
        <el-steps :active="activeName-0" finish-status="success">
            <el-step title="步骤 1"></el-step>
            <el-step title="步骤 2"></el-step>
            <el-step title="步骤 3"></el-step>
            <el-step title="步骤 4"></el-step>
        </el-steps>
        <template>
            <el-form :model="goodsForm" :rules="rules" ref="goodsForm" label-width="80px" style='height:600px'>
                <el-tabs v-model="activeName" tab-position="left">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="goodsForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="goodsForm.goods_price" type='number' :min="0" :max="10"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="goodsForm.goods_weight" controls-position="right"  type='number' :min="0" :max="10" style="width:100%"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number">
                            <el-input v-model="goodsForm.goods_number" controls-position="right"  type='number' :min="0" :max="10" style="width:100%"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类">
                            <el-cascader :options="options"
                            @change="handleChange"
                            v-model="selectedOptions" :props="props">
                            </el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <template>
                            <div id="app">
                                <div class="amap-wrapper">
                                    <el-amap class="amap-box" :vid="'amap-vue'"></el-amap>
                                </div>
                            </div>
                        </template>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload
                        class="upload-demo"
                        multiple
                        action="http://localhost:8888/api/private/v1/upload"
                        :headers="getToken()"
                        :before-upload="beforeUpload"
                        :on-preview="handlePreview"
                        :on-success="updateDone"
                        :on-remove="handleRemove"
                        :file-list="fileList"
                        list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                    </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4" prop="goods_introduce">
                        <quill-editor
                            v-model="goodsForm.goods_introduce"
                            ref="myQuillEditor"
                            :options="editorOption"
                            @blur="onEditorBlur($event)"
                            @focus="onEditorFocus($event)"
                            @ready="onEditorReady($event)">
                        </quill-editor>
                    </el-tab-pane>
                </el-tabs>
                <el-button type="success" class="btn" @click="addGoodsSubmit('goodsForm')">提交</el-button>
            </el-form>
        </template>
        <!-- 图片对话框 -->
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="70%"
            >
            <img :src="imgSrc" alt="">
            <span slot="footer" class="dialog-footer"></span>
        </el-dialog>

    </div>
</template>

<script>
import { getCategoriesList, addGoods } from '@/api/index.js'
export default {
  data () {
    return {
      activeName: 0,
      dialogVisible: false,
      imgSrc: '',
      selectedOptions: [],
      fileList: [],
      editorOption: {},
      rules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goods_introduce: [
          { required: true, message: '请输入商品内容', trigger: 'blur' }
        ]
      },
      props: {
        value: 'cat_id',
        children: 'children',
        label: 'cat_name'
      },
      options: [],
      goodsForm: {
        goods_name: '',
        goods_price: '',
        goods_number: '',
        goods_weight: '',
        goods_introduce: '',
        pics: [],
        attrs: [],
        goods_cat: ''
      }
    }
  },
  mounted () {
    getCategoriesList({ type: 3 }).then(res => {
      if (res.meta.status === 200) {
        this.options = res.data
      }
    })
  },
  methods: {
    //   添加商品提交
    addGoodsSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          addGoods(this.goodsForm).then(res => {
            if (res.meta.status === 201) {
              this.$message({
                type: 'success',
                message: res.meta.msg
              })
              //   console.log(this.goodsForm)
              this.$router.push({path: 'list'})
            } else {
              this.$message({
                type: 'danger',
                message: res.meta.msg
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    //   选中的值发生改变视触发
    handleChange (value) {
      console.log(value)
      this.goodsForm.goods_cat = value.join(',')
    },
    onEditorBlur (quill) {
      console.log('editor blur!', quill)
    },
    onEditorFocus (quill) {
      console.log('editor focus!', quill)
    },
    onEditorReady (quill) {
      console.log('editor ready!', quill)
    },
    //   在上传之前判断文件是否过大
    beforeUpload (file) {
      console.log(file)
      if (file.size > 500 * 1024) {
        this.$message({
          type: 'danger',
          message: '文件过大'
        })
        return false
      }
    },
    //   文件上传成功时触发
    updateDone (response, file, fileList) {
    //   console.log(response, file, fileList)
      this.goodsForm.pics.push({pic: response.data.tmp_path})
    },
    //   获取token
    getToken () {
      var token = localStorage.getItem('mytoken')
      return { Authorization: token }
    },
    // 删除文件
    handleRemove (file, fileList) {
    //   console.log(file, fileList)
      // 在文件上传失败之前return false之后这个这个函数还会执行
      if (!file.response) {
        return
      }
      var index = this.goodsForm.pics.findIndex((value, index) => {
        return value.pic === file.response.data.tmp_path
      })
      this.goodsForm.pics.splice(index, 1)
    //   console.log(index)
    //   console.log(this.goodsForm.pics)
    },
    // 实现图片是时预览
    handlePreview (file) {
    //   console.log(file)
      this.dialogVisible = true
      this.imgSrc = 'http://localhost:8888/' + file.response.data.tmp_path
    }
  }
}
</script>
<style lang="scss" scoped>
.btn {
  float: right;
  margin-bottom: 30px;
}
.amap-wrapper {
  width: 500px;
  height: 500px;
}
.quill-editor {
  height: 400px;
  .ql-container {
    height: 300px;
  }
}
</style>
