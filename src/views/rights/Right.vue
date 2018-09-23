<template>
    <div>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>
        <template>
      <el-table :data="rightList" border style="width: 100%;margin-top:15px">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column prop="authName" label="权限" width="180">
        </el-table-column>
        <el-table-column prop="path" label="路径" width="180">
        </el-table-column>
        <el-table-column prop="level" label="层级">
            <template slot-scope="scope">
                <span>{{scope.row.level | levelFormat }}</span>
            </template>
        </el-table-column>
      </el-table>
    </template>
    </div>
</template>

<script>
import {getRightList} from '@/api/index.js'
export default {
  data () {
    return {
      rightList: []
    }
  },
  mounted () {
    getRightList('list').then(res => {
      if (res.meta.status === 200) {
        this.rightList = res.data
      }
    })
  },
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      } else {
        return ''
      }
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
