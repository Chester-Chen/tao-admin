<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="paginationOrders"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="OrdersID">
        <template slot-scope="scope">{{ scope.row._id }}</template>
      </el-table-column>
      <el-table-column align="center" label="Date">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.date }}
        </template>
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
          <i class="el-icon-bell" />
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--     <div class="page">
      <el-pagination
        background
        layout="prev, pager, next"
        :total="100"
        :current-page="paginationForm.pageNum"
        @current-change="currentPageChange"
      />
    </div> -->
    <Pagination @currentPageChange="currentPageChange" />
  </div>
</template>

<style lang="scss">

</style>

<script>
import Pagination from '@/components/Pagination/index'
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
  components: {
    Pagination
  },
  data() {
    return {
      listLoading: true,
      orders: null,
      paginationOrders: null
    }
  },
  created() {
    /*     this.$axios.get('/queryorders').then(response => {
      console.log(response)
      this.orders = response.data
      this.listLoading = false
    }), */
    this.$axios.get('/queryOrdersByPage', {
      params: {
        pageNum: 1
      }})
      .then((res) => {
        console.log(res.data.paginationOrders)
        this.paginationOrders = res.data.paginationOrders
        this.listLoading = false
      })
  },
  methods: {
    currentPageChange(val) { // val   sonComponent传递的页码值
      console.log('parent component got the sonValue: ', val)
      this.$axios.get('/queryOrdersByPage', {
        params: {
          pageNum: val
        }})
        .then((res) => {
          console.log(res.data.paginationOrders)
          this.paginationOrders = res.data.paginationOrders
        })
    }
  }
}
</script>
