<template>
  <div class="app-container">
    <el-button type="primary">
      <i class="el-icon-search">搜索</i>
    </el-button>
    <el-button type="primary" @click="addOrder()">
      <i class="el-icon-edit">增加</i>
    </el-button>
    <el-button type="primary" @click="exportExcel">
      <i class="el-icon-download">导出</i>
    </el-button>
    <el-button type="primary" class="refresh" @click="refreshByPagination">
      <i class="el-icon-refresh">刷新</i>
    </el-button>
    <el-col :span="8">
      <el-input v-model="search" placeholder="输入关键字搜索" />
    </el-col>
    <el-table
      id="table2Excel"
      ref="table2Excel"
      :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    >
      <!--     <el-table
      id="table2Excel"
      ref="table2Excel"
      :data="tableData.filter(data => !search || data.id.toString().toLowerCase().includes(search.toLowerCase()))"
      style="width: 100%"
    > -->
      <el-table-column label="OrdersID" prop="_id" />
      <el-table-column label="Id" prop="id" />
      <el-table-column label="Date">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          {{ scope.row.date }}
        </template>
      </el-table-column>
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
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- edit dialog -->
    <el-dialog title="编辑" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="_id" :label-width="formLabelWidth">
          <el-input v-model="form._id" autocomplete="off" :disabled="true" />
        </el-form-item>
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
        <el-button type="primary" @click="updateOrderByOrderid">确认修改</el-button>
      </div>
    </el-dialog>
    <!-- add order dialog-->
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
        <el-button type="primary" @click="submitNewOrder">确 定</el-button>
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
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      tableData: [],
      paginationForm: {
        pageNum: 1
      },
      search: '',
      dialogFormVisible: false,
      dialogAddOrderVisible: false,
      formLabelWidth: '120px',
      form: {
        _id: '',
        id: '',
        name: '',
        num: null,
        singlePrice: null,
        toatalPrice: ''
      },
      newOrderForm: {
        id: '',
        name: '',
        num: '',
        price: '',
        desc: ''
      },
      notifyPara: {
        notifyTitle: {
          success: '成功',
          error: '错误',
          warning: '警告'
        },
        notifyType: {
          success: 'success',
          error: 'error',
          warning: 'warning'
        }
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
    //     this.$axios.get('/queryorders').then(response => {
    //   // console.log(response)
    //   this.tableData = response.data
    // })
    this.$axios.get('/queryOrdersByPage').then(response => {
      this.tableData = response.data.paginationOrders
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
      console.log(`删除订单，第${index + 1}行`)
      console.log(`row: `, row)
      this.$axios
        .get('delorder', {
          params: { orderid: row[index]._id, ordername: row[index].name }
        })
        .then(response => {
          console.log('删除后的返回值：', response)
        })
      row.splice(index, 1)
    },
    // 提交新订单
    submitNewOrder(newOrderForm) {
      newOrderForm = this.newOrderForm
      if (newOrderForm.id === '') {
        const msg = 'id 不能为空'
        this.warmingNoitce(this.notifyPara.notifyTitle.warning, msg, this.notifyPara.notifyType.warning)
      } else {
        this.$axios
          .post('addneworder', {
            data: { newOrderForm: newOrderForm }
          })
          .then(response => {
            if (response.data.status === 200) {
              const msg = response.data.msg
              // console.log(msg)
              this.dialogAddOrderVisible = false
              this.warmingNoitce(this.notifyPara.notifyTitle.success, msg, this.notifyPara.notifyType.success)
              this.refresh()
              console.log(`新增订单id:${newOrderForm.id}, 新增订单成功`)
            } else if (response.data.status === 409) {
              const msg = response.data.msg
              // console.log(msg)
              this.dialogAddOrderVisible = false
              this.warmingNoitce(this.notifyPara.notifyTitle.error, msg, this.notifyPara.notifyType.error)
              console.log(`新增订单id:${newOrderForm.id}, 新增订单失败`)
            }
          })
      }
    },
    // 增加订单的dialog
    addOrder() {
      // console.log('add order')
      this.dialogAddOrderVisible = true
    },
    // 警告提示
    warmingNoitce(title, msg, type) {
      this.$notify({
        title: title,
        message: msg,
        type: type
      })
    },
    // 刷新数据
    refresh() {
      this.$axios.get('/queryorders').then(response => {
        this.tableData = response.data
      })
    },
    // 分页刷新数据
    refreshByPagination() {
      this.currentPageChange(this.paginationForm.pageNum)
    },
    // 更改订单信息
    updateOrderByOrderid(row) {
      const form = this.form
      this.$axios
        .post('/update_order_by_orderid', { form })
        .then(res => {
          if (res.data.title === '成功' && res.data.status === 200) {
            console.log('订单数据修改成功啦！')
            this.dialogFormVisible = false
          }
        })
        .then(() => {
          this.refresh()
        })
    },
    // 导出表格
    exportExcel() {
      const wb = XLSX.utils.table_to_book(
        document.querySelector('#table2Excel')
      )
      const wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          'orders.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') {
          console.log(e, wbout)
        }
      }
      return wbout
    },
    // 分页
    currentPageChange(val) { // val   sonComponent传递的页码值
      this.$axios.get('/queryOrdersByPage', {
        params: {
          pageNum: val
        }})
        .then((res) => {
          console.log(res.data.paginationOrders)
          this.tableData = res.data.paginationOrders
          this.paginationForm.pageNum = val
        })
    }
  }
}
</script>
