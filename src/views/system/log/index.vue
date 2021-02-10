<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="用户名">
        <el-input clearable v-model="pageParams.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker clearable v-model="pageParams.operateTime" type="date" placeholder="请选择"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" :max-height="tableH" :height="tableH" border>
      <el-table-column prop="action" label="操作名称" :show-overflow-tooltip="true" width="220"></el-table-column>
      <el-table-column prop="operateObject" label="操作对象" :show-overflow-tooltip="true" width="310"></el-table-column>
      <el-table-column prop="operateContent" label="操作内容" :show-overflow-tooltip="true" width="300"></el-table-column>
      <el-table-column prop="ip" label="IP" width="200" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="operateTime" label="操作时间" width="150" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="user" label="操作用户" width="150" :show-overflow-tooltip="true"></el-table-column>
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
import { getList } from '@/api/sysLog';
import { mapState } from 'vuex';
import { getStyle } from '@/utils/common';

export default {
  name: 'SystemLog',
  data() {
    return {
      loading: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
      },
      tableData: [],
      total: 0,
    };
  },
  computed: {
    ...mapState('layout', ['tableHeight']),

    tableH() {
      if (this.tableHeight) {
        let html = getStyle(document.documentElement);
        let htmlFont = Number(html.fontSize.replace('px', ''));
        return this.tableHeight - 1.5 * htmlFont;
      }
      return null;
    },
  },
  methods: {
    handleSearch() {
      this.pageParams.pageNo = 1;

      this.loadData();
    },
    loadData() {
      this.loading = true;

      const params = { ...this.pageParams };

      if (params.operateTime) params.operateTime = this.$moment(params.operateTime).format('YYYY-MM-DD');

      getList(params)
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
  },
  mounted() {
    this.loadData();
  },
};
</script>
