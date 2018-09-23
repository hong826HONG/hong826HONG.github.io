<template>
    <div class="home">
        <el-container>
            <el-aside width="auto">
                <div class="logo"></div>
                <el-menu default-active="1"
                class="el-menu-vertical-demo el-menu-admin"
                background-color="#545c64"
                :unique-opened="true"
                :router="true"
                mode="vertical"
                :collapse="isCollapse"
                text-color="#fff" a
                ctive-text-color="#ffd04b">
                    <el-submenu :index="index+''" v-for="(item,index) in menuList" :key="item.id">
                        <template slot="title">
                            <i class="el-icon-location"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <el-menu-item :index="'/'+value.path" v-for="value in item.children" :key="value.id">
                            <i class="el-icon-menu"></i>
                            <span>{{value.authName}}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <span class="myicon myicon-menu toggle-btn" @click="isCollapse=!isCollapse"></span>
                    <div class="system-title">电商后台管理系统</div>
                    <div>
                        <span>你好：{{$store.state.username?$store.state.username:$store.getters.username}}</span>
                        <el-button type="text" @click="loginOut">退出</el-button>
                    </div>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>
<script>
import {
  getMenus
} from '@/api/index.js'
export default {
  data () {
    return {
      isCollapse: false,
      menuList: ''
    }
  },
  methods: {
    loginOut () {
      localStorage.removeItem('mytoken')
      this.$router.push({name: 'Login'})
    }
  },
  mounted () {
    getMenus().then(res => {
      if (res.meta.status === 200) {
        this.menuList = res.data
      }
    })
  }
}
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 60px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-color: #fff;
  }
  .toggle-btn {
    padding: 0 15px;
    margin-left: -20px;
    font-size: 36px;
    color: white;
    cursor: pointer;
    line-height: 60px;
    &:hover {
      background-color: #4292cf;
    }
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>
