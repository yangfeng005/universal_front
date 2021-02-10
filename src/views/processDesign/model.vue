<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <!-- <el-form-item label="流程类型">
        <el-input clearable v-model="pageParams.name" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item> -->
      <el-form-item v-if="$route.meta.manage">
        <el-button type="primary" @click="addOne">创建模型</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" style="width: 100%; margin-bottom: 20px;" border>
      <el-table-column prop="id" label="模型编号" width="120"></el-table-column>
      <el-table-column prop="version" label="版本" width="100"></el-table-column>
      <el-table-column prop="name" label="模型名称" min-width="200"></el-table-column>
      <el-table-column prop="key" label="模型KEY" min-width="200"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="200">
        <template slot-scope="scope">
          {{ scope.row.createTime && $moment(scope.row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" v-if="$route.meta.manage" align="center" width="340">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" style="margin-right: 10px;" type="primary" size="mini">编辑</el-button>
          <el-popconfirm title="确定发布吗？" style="margin-right: 10px;" @confirm="handleBtn(scope.row.id, 3)">
            <el-button slot="reference" type="info" size="mini">发布</el-button>
          </el-popconfirm>
          <el-popconfirm title="确定撤销吗？" style="margin-right: 10px;" @confirm="handleBtn(scope.row.id, 1)">
            <el-button slot="reference" type="warning" size="mini">撤销</el-button>
          </el-popconfirm>
          <el-popconfirm title="确定删除吗？" @confirm="handleBtn(scope.row.id, 2)">
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
    <el-dialog
      :close-on-click-modal="false"
      :title="`${form.id ? '编辑' : '创建模型'}`"
      :visible.sync="dialog1Visible"
      :before-close="handleCancel"
    >
      <el-form ref="form" :model="form" :rules="formRules" label-width="80px">
        <!-- <el-form-item label="流程类型" prop="key">
          <el-select style="width: 100%;" v-model="form.key" placeholder="请选择流程类型">
            <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.typeCode"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="form.name" maxlength="50" placeholder="请输入模型名称"></el-input>
        </el-form-item>
        <!-- <el-form-item label="模型KEY">
          <el-input readonly v-model="form.key" placeholder="流程类型KEY"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button :loading="saving" type="primary" @click="handleSave(1)">保存模型</el-button>
        <el-button :loading="saving" type="primary" @click="handleSave(2)">设计流程</el-button>
      </div>
    </el-dialog>
    <el-dialog fullscreen lock-scroll :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="handleCancel">
      <activiti-exp :modelId="form.id" @handleCancel="handleCancel"></activiti-exp>
    </el-dialog>
  </div>
</template>
<script>
import { getList, removeOne, createOne, publishOne } from '@/api/process';
import ActivitiExp from '@/components/Activiti';

const defaultProps = {
  id: null,
  name: '',
};

export default {
  name: 'processDesign',
  data(props) {
    return {
      loading: false,
      saving: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
      },
      options: [],
      form: props._.cloneDeep(defaultProps),
      dialogVisible: false,
      dialog1Visible: false,
      tableData: [],
      total: 0,
      formRules: {
        name: [{ required: true, message: '请输入模型名称' }],
        key: [{ required: true, message: '请输入请选择流程类型' }],
      },
    };
  },
  components: { ActivitiExp },
  computed: {},
  methods: {
    addOne() {
      this.dialog1Visible = true;
    },
    handleSearch() {
      this.pageParams.pageNo = 1;

      this.loadData();
    },
    loadData() {
      this.loading = true;
      getList(this.pageParams)
        .then((res) => {
          if (res.data) {
            this.tableData = res.data;
            this.total = (res.additionalProperties.page && res.additionalProperties.page.total) || res.data.length;
          }
        })
        .finally(() => (this.loading = false));
    },
    handleCancel() {
      this.form = this._.cloneDeep(defaultProps);
      this.$refs.form && this.$refs.form.resetFields();

      this.dialogVisible = false;
      this.dialog1Visible = false;
    },
    handleSave(type) {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        this.saving = true;

        createOne(this.form)
          .then((res) => {
            if (type == 2) {
              this.form.id = res.data;
              this.loadData();
              this.dialogVisible = true;
              this.dialog1Visible = false;

              return;
            }
            this.$message({
              message: '保存成功',
              type: 'success',
            });
            this.loadData();
            this.handleCancel();
          })
          .finally(() => (this.saving = false));
      });
    },
    updateOne(row) {
      this.form = this._.pick(row, Object.keys(defaultProps));

      this.dialogVisible = true;
    },
    handleBtn(modelId, type) {
      switch (type) {
        case 3:
          publishOne({ modelId }).then(() => {
            this.$message({
              message: '发布成功',
              type: 'success',
            });
            this.loadData();
          });
          break;
        default:
          removeOne({ modelId }, type).then(() => {
            this.$message({
              message: `${type == 1 ? '撤销' : '删除'}成功`,
              type: 'success',
            });
            this.loadData();
          });
      }
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
