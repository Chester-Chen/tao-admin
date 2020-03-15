<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="orders"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="OrdersID">
        <template slot-scope="scope">{{ scope.row._id }}</template>
      </el-table-column>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="totalPrice" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price * scope.row.num }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Num" align="center">
        <template slot-scope="scope">{{ scope.row.num }}</template>
      </el-table-column>
      <el-table-column align="left" prop="created_at" label="Desc">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      orders: null
    }
  },
  created() {
    this.$axios.get('/queryorders').then(response => {
      console.log(response)
      this.orders = response.data
      this.listLoading = false
    })
  },
  methods: {}
}
</script>
