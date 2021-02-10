<template>
  <div style="padding: 0px 20px 20px;">
    <el-table
      stripe
      v-loading="loading"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px;"
      border
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="name" label="流程名称" min-width="180"></el-table-column>
      <el-table-column prop="id" label="流程定义id" min-width="200"></el-table-column>
      <el-table-column prop="key" label="流程定义key" min-width="200"></el-table-column>
      <el-table-column prop="deploymentId" label="部署id" min-width="150"></el-table-column>
      <el-table-column prop="version" label="版本" min-width="100"></el-table-column>
      <el-table-column prop="resourceName" label="部署资源名称" min-width="200"></el-table-column>
      <el-table-column v-if="!readonly && $route.meta.manage" label="操作" fixed="right" align="center" min-width="200">
        <template slot-scope="scope">
          <el-button v-if="form.processDefinitionKey == scope.row.key" style="cursor: default;" type="success" slot="reference" size="mini"
            >当前流程</el-button
          >
          <el-popconfirm v-else title="确定选择此流程吗？" @confirm="handleSelect(scope.row)">
            <el-button slot="reference" type="primary" size="mini">选择流程</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageParams.pageNo"
      background
      layout="total, prev, pager, next, jumper, sizes"
      :page-size="pageParams.pageSize"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { processList } from '@/api/workFlow';

export default {
  name: 'ProcessList',
  props: {
    readonly: Boolean,
    form: Object,
  },
  data() {
    return {
      loading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 15,
      },
      tableData: [],
      total: 0,
    };
  },
  methods: {
    tableRowClassName({ row }) {
      if (this.form && row.key == this.form.processDefinitionKey) {
        return 'success-row';
      }
      return '';
    },
    handleSearch() {
      this.pageParams.pageNo = 1;

      this.loadData();
    },
    loadData() {
      this.loading = true;

      processList(this.pageParams, this.readonly)
        .then((res) => {
          if (res.data) {
            this.tableData = res.data;
            this.total = (res.additionalProperties.page && res.additionalProperties.page.total) || res.data.length;
          }
        })
        .finally(() => (this.loading = false));
    },
    handleSizeChange(pageSize) {
      this.pageParams.pageSize = pageSize;
      this.loadData();
    },
    handleCurrentChange(pageNo) {
      this.pageParams.pageNo = pageNo;
      this.loadData();
    },
    handleSelect(row) {
      this.$emit('save', row);
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style>
.el-table .success-row {
  background-color: #f0f9eb;
}
</style>
