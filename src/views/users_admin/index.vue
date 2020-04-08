<template>
  <div class="app-container">
    <el-button type="primary" class="refresh" @click="refresh">
      <i class="el-icon-refresh">刷新</i>
    </el-button>
    <el-col :span="8">
      <el-input v-model="search" placeholder="输入关键字搜索" />
    </el-col>
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
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
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.user" autocomplete="off" />
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
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
export default {
  data() {
    return {
      tableData: [],
      search: '',
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        user: '',
        password: ''
      }
    }
  },
  computed: {
  },
  created() {
    this.$axios.get('/queryusers').then(response => {
      // console.log(response)
      this.tableData = response.data
    })
  },
  methods: {
    // 编辑订单
    handleEdit(index, row) {
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    // 删除订单
    handleDelete(index, row) {
      /*    console.log(`删除订单，第${index + 1}行`)
      console.log(`row: `, row)
      this.$axios
        .get('delorder', {
          params: { orderid: row[index]._id, ordername: row[index].name }
        })
        .then(response => {
          console.log('删除后的返回值：', response)
        })
      row.splice(index, 1) */
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
      this.$axios.get('').then(response => {
        this.tableData = response.data
      })
    }
  }
}
</script>
