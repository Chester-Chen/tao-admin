<template>
  <div class="app-container">
    <el-button type="primary">
      <i class="el-icon-search">搜索</i>
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
      <el-table-column label="订单ID" prop="_id" />
      <el-table-column label="商品id" prop="id" />
      <el-table-column label="用户" prop="name" />
      <el-table-column align="right">
        <template slot="header" slot-scope="scope">
          <el-input v-model="search" size="mini" placeholder="输入关键字搜索" />
        </template>
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" @click="showDistribution(scope.$index, scope.row)">状态</el-button>
          <el-button size="mini" type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 物流信息修改 -->
    <el-dialog title="编辑物流信息" :visible.sync="dialogEditFormVisible">
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
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 物流详情框 -->
    <el-dialog title="物流详情" :visible.sync="dialogDistributionVisible">
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button> -->
      </div>
      <!-- 物流 -->
      <div v-if="distributionIsShown" class="block">
        <el-timeline :reverse="reverse">
          <el-timeline-item
            v-for="(activity, index) in activities[0]"
            :key="index"
            :timestamp="activity.datetime"
          >{{ activity.remark }}</el-timeline-item>
        </el-timeline>
      </div>
    </el-dialog>

  </div>
</template>

<style lang="scss" scoped>
.el-button {
  margin: 0 0.5rem;
}
</style>

<script>
export default {
  data() {
    return {
      tableData: [],
      search: '',
      dialogDistributionVisible: false,
      distributionIsShown: false,
      dialogEditFormVisible: false,
      formLabelWidth: '120px',
      form: {
        id: '',
        name: '',
        num: '',
        singlePrice: '',
        toatalPrice: ''
      },
      reverse: false,
      activities: [] // 物流信息
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
    this.$axios.get('/querydis').then(response => {
      response.data.forEach(element => {
        console.log(element.result[0].list)
        const temp = element.result[0].list
        this.activities.push(temp)
      })
      console.log(this.activities)
    }
    )
  },
  methods: {
    // 编辑物流信息
    handleEdit(index, row) {
      this.dialogEditFormVisible = true
    },
    // 增加物流信息
    showDistribution() {
      // console.log('add order')
      this.dialogDistributionVisible = !this.dialogDistributionVisible
      this.distributionIsShown = true
    },
    // 警告提示
    warmingNoitce() {
      this.$notify({
        title: '警告',
        message: 'id 不能为空',
        type: 'warning'
      })
    }
  }
}
</script>
