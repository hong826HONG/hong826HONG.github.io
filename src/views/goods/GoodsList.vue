<template>
    <div>
        <div>
            <el-input placeholder="请输入内容" v-model="searchValue" @keyup.native.enter="search" style="width:300px">
                <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
            </el-input>
            <el-button type="success" plain @click="$router.push({path:'add'})">添加商品</el-button>
        </div>
        <template>
            <el-table ref="singleTable" :data="goodsList" highlight-current-row border style="width: 100%">
                <el-table-column type="index" width="50">
                </el-table-column>
                <el-table-column property="goods_name" label="商品名称">
                </el-table-column>
                <el-table-column property="goods_price" label="商品价格" width="120">
                </el-table-column>
                <el-table-column property="goods_weight" label="商品重量" width="120">
                </el-table-column>
                <el-table-column property="upd_time" label="创建时间" width="120">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-tooltip effect="light" content="编辑" placement="top">
                            <el-button size="mini" type="primary" plain icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip effect="light" content="删除" placement="bottom">
                            <el-button size="mini" type="primary" plain icon="el-icon-delete" @click="handleDelete(scope.row.id)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </template>
        <el-pagination @size-change="handleSizeChange"
         @current-change="handleCurrentChange"
         :current-page="pagenum" :page-sizes="[10, 20, 30, 40]"
         :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
         :total="total">
    </el-pagination>
    </div>
</template>

<script>
import { getGoods } from '@/api/index.js'
export default {
  data () {
    return {
      searchValue: '',
      pagenum: 1,
      goodsList: [],
      pagesize: 10,
      total: 0
    }
  },
  methods: {
    //   搜索商品
    search () {
      this.initGoodsList()
    },
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.initGoodsList()
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.initGoodsList()
    },
    // 商品列表初始化
    initGoodsList () {
      getGoods({
        query: this.searchValue,
        pagesize: this.pagesize,
        pagenum: this.pagenum
      }).then(res => {
        console.log(res)
        if (res.meta.status === 200) {
          this.goodsList = res.data.goods
          this.total = res.data.total
        }
      })
    }
  },
  mounted () {
    this.initGoodsList()
  }
}
</script>

<style scoped>
</style>
