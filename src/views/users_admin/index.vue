<template>
  <div class="app-container">
    <el-button type="primary" class="refresh" @click="refresh">
      <i class="el-icon-refresh">刷新</i>
    </el-button>
    <el-col :span="8">
      <el-input v-model="search" placeholder="输入关键字搜索" />
    </el-col>
    <el-table
      :data="tableData.filter(data => !search || data.user.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column label="用户名" prop="user" />
      <el-table-column label="密码" prop="password" />
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
          <el-button size="mini" type="danger" @click="delUser(scope.$index, tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form ref="ruleForm" :model="ruleForm" status-icon :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.user" :disabled="true" autocomplete="off" />
        </el-form-item>
        <el-form-item label="原密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" :disabled="true" autocomplete="off" />
        </el-form-item>
        <!--        <el-form-item label="新密码" :label-width="formLabelWidth">
          <el-input v-model="form.newPassword" autocomplete="off"  />
        </el-form-item> -->
        <el-form-item label="新密码" prop="pass">
          <el-input v-model="ruleForm.pass" type="password" autocomplete="off" :show-password="true" placeholder="密码由数字和字母组成,长度6-9位" />
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" :show-password="true" placeholder="密码由数字和字母组成,长度6-9位" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updatePwd">确 定</el-button>
      </div>
    </el-dialog>
    <Pagination @currentPageChange="currentPageChange" />
  </div>
</template>

<style lang="scss" scoped>
.el-button {
  margin: 0 0.5rem;
}
.el-button.refresh {
  float: right;
}
</style>

<script>
import Pagination from '@/components/Pagination/index'
export default {
  components: {
    Pagination
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        const pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,9}$/
        if (!pattern.test(value)) {
          callback(new Error('密码格式不正确！'))
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      search: '',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        user: '',
        password: '',
        newPassword: ''
      },
      ruleForm: {
        pass: '',
        checkPass: ''
      },
      rules: {
        pass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    /*     this.$axios.get('/queryusers').then(response => {
      // console.log(response)
      this.tableData = response.data
    }) */
    this.$axios.get('/queryUsersByPage').then(response => {
      // console.log(response)
      this.tableData = response.data.usersPageData
    })
  },
  methods: {
    // 编辑订单
    handleEdit(index, row) {
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    // 警告提示
    warmingNoitce() {
      this.$notify({
        title: '警告',
        message: 'id 不能为空',
        type: 'warning'
      })
    },
    // 刷新数据
    refresh() {
      this.$axios.get('/queryusers').then(response => {
        this.tableData = response.data
      })
    },
    // 修改用户密码
    updatePwd() {
      console.log(this.ruleForm)
      if (this.ruleForm.pass === this.ruleForm.checkPass && this.ruleForm.pass !== '' && this.ruleForm.checkPass !== '') {
        this.$axios.post('/update_pwd', {
          user: {
            userName: this.form.user,
            newPassword: this.ruleForm
          }})
          .then(response => {
            if (response.data.status === 200) {
              this.$notify({
                title: '成功',
                message: response.data.msg,
                type: 'success'
              })
              this.dialogFormVisible = false
            }
            this.refresh()
          })
          .catch(reason => {
            this.$notify({
              title: '错误',
              message: '发生未知错误',
              type: 'error'
            })
            console.log(reason)
          })
      } else {
        this.$notify({
          title: '错误',
          message: '请确认密码是否相同或检查密码是否为空',
          type: 'error'
        })
      }
    },
    // 删除用户
    delUser(index, row) {
      console.log(`删除第${index + 1}行用户`)
      // console.log(row)
      this.$axios
        .get('/del_user', {
          params: { user_id: row[index]._id, userName: row[index].user }
        })
        .then(response => {
          if (response.data.status === 200) {
            console.log(`用户${row[index].user}${response.data.msg}`)
            row.splice(index, 1)
          }
        })
        .catch(reason => {
          console.log(reason)
        })
    },
    // 分页
    currentPageChange(val) { // val   sonComponent传递的页码值
      this.$axios.get('/queryUsersByPage', {
        params: {
          pageNum: val
        }})
        .then((res) => {
          console.log(res.data.usersPageData)
          this.tableData = res.data.usersPageData
        })
    }
  }
}
</script>
