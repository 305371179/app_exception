<template>
  <div class="dashboard-container" v-loading.body="listLoading" element-loading-text="Loading">
    <div>
      邮箱地址：
      <el-input
        placeholder="请输入邮箱地址"
        suffix-icon="el-icon-message"
        style="width:400px;"
        v-model="email">
      </el-input>
      <el-button :disabled="!enable" type="primary" :loading="loading" @click="addEmail">添加邮箱</el-button>
    </div>
    <el-table
      :data="list"
      style="width: 100%"
      :default-sort="{prop: 'date', order: 'descending'}"
    >
      <el-table-column
        label="序号"
        type="index"
      >
      </el-table-column>
      <el-table-column
        :formatter="dateFormat"
        prop="date"
        label="日期"
        sortable
      >
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
      >
      </el-table-column>
      <el-table-column
        label="操作"
      >
        <template slot-scope="scope">
          <el-button type="danger" size="small" :loading="deleteLoading" @click="deleteEmail(scope.row.email,$index)">删除邮箱</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import {getEmails,addEmail,deleteEmail} from '@/api/email'

  export default {
    name: 'dashboard',
    data() {
      return {
        list: [],
        listLoading: true,
        loading: false,
        deleteLoading:false,
        email: ''
      }
    },
    filters: {
      strFormat: function (value) {
        return value.replace(/\n/g, '<br')
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'roles'
      ]),
      enable(){
        return this.checkEmail(this.email)
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      checkEmail(str) {
        var re = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
        if (re.test(str)) {
          return true
        } else {
          return false
        }
      },
      addEmail() {
        if(!this.checkEmail(this.email)){
          return this.$message.error('邮箱格式不对')
        }
        this.loading=true
        addEmail({email:this.email}).then(response => {
          if (response.data) {
            this.list.push(response.data)
            this.email = ''
          }
          this.loading = false
        }).catch(error => {
          this.loading = false
        })
      },
      deleteEmail(email,$index) {
        this.deleteLoading=true
        deleteEmail({email}).then(response => {
          if (response.data) {
            this.list.splice($index,1)
          }
          this.deleteLoading = false
        }).catch(error => {
          this.deleteLoading = false
        })
      },
      strFormat: function (value) {
        if (!value) return ''
        return value.replace(/\n/g, '<br')
      },
      dateFormat(row, column) {
        var value = row.date
        if (!value) return ''
        return new Date(value).Format('yyyy-MM-dd hh:mm:ss');
      },
      fetchData() {
        this.listLoading = true
        getEmails().then(response => {
          if (response.data) {
            this.list = response.data
          }
          this.listLoading = false
        }).catch(error => {
          this.listLoading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
