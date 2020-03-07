<template>
  <div class="app-container">
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      search: ''
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
      console.log(index, row)
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
    }
  }
}
</script>
