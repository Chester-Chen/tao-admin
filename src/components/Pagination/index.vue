<template>
  <div class="page">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="100"
      :current-page="paginationForm.pageNum"
      @current-change="currentPageChange"
    />
  </div>
</template>

<script type="text/javascript">
export default {
  components: {},
  data() {
    return {
      paginationForm: {
        pageNum: 1
      }
    }
  },
  methods: {
    currentPageChange(val) {
      this.paginationForm.pageNum = val
      this.$emit('currentPageChange', this.paginationForm.pageNum)
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
}
</style>
