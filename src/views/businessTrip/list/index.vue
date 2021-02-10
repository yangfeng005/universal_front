<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="申请状态">
        <el-select clearable v-model="pageParams.applyStatus">
          <el-option v-for="(item, index) in status" :key="'status' + index" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请时间">
        <el-date-picker clearable v-model="pageParams.applyTime" type="date" placeholder="请选择"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" style="width: 100%; margin-bottom: 20px;" border>
      <el-table-column prop="applyUser" label="申请人用户名" min-width="150"></el-table-column>
      <el-table-column prop="applyUserName" label="申请人姓名" min-width="160"></el-table-column>
      <el-table-column prop="agencyName" label="所属组织机构" min-width="160"></el-table-column>
      <!-- <el-table-column prop="post" label="岗位" min-width="160"></el-table-column> -->
      <el-table-column prop="destination" label="出差去向" min-width="150"></el-table-column>
      <el-table-column prop="startDate" label="出差时间" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.startDate }}{{ scope.row.startDate && scope.row.endDate && '至' }}{{ scope.row.endDate }}
        </template>
      </el-table-column>
      <el-table-column prop="days" label="出差天数" min-width="100"></el-table-column>
      <el-table-column prop="reason" label="原因" min-width="200"></el-table-column>
      <el-table-column prop="applyTime" label="申请时间" min-width="180"></el-table-column>
      <el-table-column fixed="right" prop="applyStatus" label="申请状态" min-width="120"></el-table-column>
      <el-table-column prop="auditorName" label="审批人" min-width="150"></el-table-column>
      <el-table-column prop="auditResult" label="审批结果" min-width="150"></el-table-column>
      <el-table-column prop="auditTime" label="审批时间" min-width="200"></el-table-column>
      <el-table-column prop="description" label="备注" min-width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="200">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" style="margin-right: 10px;" type="primary" size="mini">详情</el-button>
          <el-button @click="updateOne(scope.row, true)" style="margin-right: 10px;" type="info" size="mini">打印</el-button>
          <el-popconfirm v-if="$route.meta.manage" title="确定删除吗？" @onConfirm="removeOne(scope.row.id)">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
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
    <el-dialog title="详情" :visible.sync="dialogVisible" :before-close="handleCancel" custom-class="leave-dialog" top="5vh">
      <print ref="print" @onClose="handleCancel" :form="form"></print>
      <div slot="footer">
        <el-button @click="handleCancel">关 闭</el-button>
        <el-button type="primary" @click="handleSave">打 印</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, removeOne } from '@/api/travel';
import { findComment } from '@/api/leave';
import Print from '@/components/Print';

export default {
  name: 'TravelManage',
  data() {
    return {
      loading: false,
      saving: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
      },
      types: [],
      status: ['审批中', '审批通过', '审批拒绝'],
      form: {},
      dialogVisible: false,
      tableData: [],
      total: 0,
    };
  },
  components: { Print },
  methods: {
    addOne() {
      this.dialogVisible = true;
    },
    handleSearch() {
      this.pageParams.pageNo = 1;

      this.loadData();
    },
    loadData() {
      this.loading = true;
      getList({
        ...this.pageParams,
        enterTime: this.pageParams.enterTime ? this.$moment(this.pageParams.enterTime).format('YYYY-MM-DD') : '',
      })
        .then((res) => {
          if (res.data) {
            this.tableData = res.data;
            this.total = (res.additionalProperties.page && res.additionalProperties.page.total) || res.data.length;
          }
        })
        .finally(() => (this.loading = false));
    },
    handleCancel() {
      this.form = {};
      // this.$refs.form.resetFields();
      this.dialogVisible = false;
    },
    handleSave() {
      this.$refs.print.onPrint();
    },
    updateOne(row, isPrint = false, gotData) {
      if (!gotData) {
        this.loading = true;

        findComment(row.processInstanceId)
          .then(({ data }) => {
            const comment = [];

            try {
              data.map((item) => {
                Object.keys(item).map((key) => {
                  if (item[key][0])
                    comment.push({
                      ...item[key][0],
                      taskName: item[key][0].taskName.replace('审批', ''),
                    });
                });
              });
            } catch (error) {
              console.log(error);
            }

            this.updateOne({ ...row, comment }, isPrint, true);
          })
          .finally(() => (this.loading = false));

        return;
      }

      this.isPrint = isPrint;

      this.form = {
        ...row,
        workFlowTypeCode: 'travel_apply',
      };

      this.dialogVisible = true;

      if (!isPrint) return;

      this.$nextTick(() => {
        this.handleSave();
      });
    },
    removeOne(travelApplyId) {
      removeOne({ travelApplyId }).then(() => {
        this.$message({
          message: '删除成功',
          type: 'success',
        });
        this.loadData();
      });
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

<style lang="less">
.leave-dialog {
  min-width: 800px;
}
</style>
