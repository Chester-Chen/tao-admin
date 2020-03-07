<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="goods"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >

      <el-table-column align="center" label="OrdersID">
        <template slot-scope="">
          暂无添加订单id
        </template>
      </el-table-column>
      <el-table-column align="center" label="ID">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="Name">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="Price" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Num" align="center">
        <template slot-scope="scope">
          {{ scope.row.num }}
        </template>
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
      goods: null
    }
  },
  created() {
    this.$axios.get('/querygoods').then(response => {
      console.log(response)
      this.goods = response.data
      this.listLoading = false
    })
  },
  methods: {

  }
}
</script>
