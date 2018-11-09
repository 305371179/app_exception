<template>
  <el-menu class="navbar" mode="horizontal" v-loading.body="loading" element-loading-text="Loading">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
    <el-dropdown class="avatar-container" trigger="click" @command="handleCommand">
      <div class="avatar-wrapper">
        <img class="user-avatar" :src="avatar+'?imageView2/1/w/80/h/80'">
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
          <el-dropdown-item command="1">
            修改密码
          </el-dropdown-item>
        <el-dropdown-item divided>
          <span @click="logout" style="display:block;">退出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <el-dialog title="修改密码" :visible.sync="dialogVisible">
      <div style="margin: 10px 20px;">
        原来密码：<el-input style="width: 200px" minlength="5" type="password" v-model="password" placeholder="请输入内容"></el-input>
      </div>
      <div style="margin: 10px 20px;">
        修改密码：<el-input style="width: 200px" minlength="5" type="password" v-model="newPassword" placeholder="请输入内容"></el-input>
      </div>
      <div style="margin: 10px 20px;">
        再次确认：<el-input style="width: 200px" minlength="5" type="password" v-model="againPassword" placeholder="请输入内容"></el-input>
      </div>
      <el-button @click="confirm" type="primary" style="margin: 10px 20px;" :disabled="!enable">确定</el-button>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import {modifyPassword} from '@/api/login'
export default {
  data:function(){
    return {
      dialogVisible:false,
      password:'',
      newPassword:'',
      againPassword:'',
      loading:false
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'name',
      'avatar'
    ]),
    enable(){
      if([this.password,this.newPassword,this.againPassword].some(item=>item === '')){
        return false
      }
      if(this.password===this.newPassword||this.newPassword!==this.againPassword)return false
      return true
    }
  },
  methods: {
    confirm(){
      this.loading=true
      modifyPassword({username:this.name,password:this.password,newPassword:this.newPassword}).then(response => {
        if (response.data) {
          this.dialogVisible=false
          this.$message.success(response.message)
        }
        this.loading = false
      }).catch(error => {
        this.loading = false
      })
    },
    handleCommand(command) {
      if(command==1){
        this.password=''
        this.newPassword=''
        this.againPassword=''
        this.dialogVisible =true
      }
    },
    modify(){
    },
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

