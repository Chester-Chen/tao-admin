<template>
  <div class="app-container">
    <el-button type="primary">
      <i class="el-icon-search">搜索</i>
    </el-button>
    <el-button type="primary" @click="addOrder()">
      <i class="el-icon-edit">增加</i>
    </el-button>
    <el-button type="primary">
      <i class="el-icon-download">导出</i>
    </el-button>
    <el-col :span="8">
      <el-input v-model="search" placeholder="输入关键字搜索" />
    </el-col>
    <el-table
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <el-table-column label="OrdersID" prop="_id" />
      <el-table-column label="Id" prop="id" />
      <el-table-column label="Name" prop="name" />
      <el-table-column label="Num" prop="num" />
      <el-table-column label="SinglePrice" prop="price" />
      <!-- 此处拼接两个字段需内嵌插槽，传入相应字段即可 -->
      <el-table-column label="TotalPrice" prop="num, price">
        <template slot-scope="scope">{{ scope.row.num * scope.row.price }}</template>
      </el-table-column>
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- dialog -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="form.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="name" :label-width="formLabelWidth">
          <el-input v-model="form.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="num" :label-width="formLabelWidth">
          <el-input v-model="form.num" autocomplete="off" />
        </el-form-item>
        <el-form-item label="singlePrice" :label-width="formLabelWidth">
          <el-input v-model="form.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="toatalPrice" :label-width="formLabelWidth">
          <el-input v-model="getTotalPrice" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- add order -->
    <el-dialog title="添加" :visible.sync="dialogAddOrderVisible">
      <el-form :model="newOrderForm">
        <el-form-item label="id" :label-width="formLabelWidth">
          <el-input v-model="newOrderForm.id" autocomplete="off" />
        </el-form-item>
        <el-form-item label="name" :label-width="formLabelWidth">
          <el-input v-model="newOrderForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="num" :label-width="formLabelWidth">
          <el-input v-model="newOrderForm.num" autocomplete="off" />
        </el-form-item>
        <el-form-item label="singlePrice" :label-width="formLabelWidth">
          <el-input v-model="newOrderForm.price" autocomplete="off" />
        </el-form-item>
        <el-form-item label="desc" :label-width="formLabelWidth">
          <el-input v-model="newOrderForm.desc" autocomplete="off" />
        </el-form-item>
        <el-form-item label="toatalPrice" :label-width="formLabelWidth">
          <el-input v-model="getNewOrderTotalPrice" autocomplete="off" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.el-button {
  margin: 0 .5rem;
}
</style>

<script>
export default {
  data() {
    return {
      tableData: [],
      search: '',
      dialogFormVisible: false,
      dialogAddOrderVisible: false,
      formLabelWidth: '120px',
      form: {
        id: '',
        name: '',
        num: '',
        singlePrice: '',
        toatalPrice: ''
      },
      newOrderForm: {
        id: '',
        name: '',
        num: '',
        price: '',
        desc: '',
        toatalPrice: null
      }
    }
  },
  computed: {
    getTotalPrice() {
      return this.form.num * this.form.price
    },
    getNewOrderTotalPrice() {
      return this.newOrderForm.num * this.newOrderForm.price
    }
  },
  created() {
    this.$axios.get('/queryorders').then(response => {
      // console.log(response)
      this.tableData = response.data
    })
  },
  methods: {
    handleEdit(index, row) {
      this.form = Object.assign({}, row)
      this.dialogFormVisible = true
    },
    handleDelete(index, row) {
      console.log(index, row)
      this.$axios
        .get('delorder', {
          params: { orderid: row._id, ordername: row.name }
        })
        .then(response => {
          console.log(response)
        })
    },
    handleAdd() {
      console.log('add order')
      this.dialogFormVisible = true
    },
    submit() {
      console.log('添加成功')
    },
    addOrder() {
      console.log('add order')
      this.dialogAddOrderVisible = true
    }
  }
}
</script>
