<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="字典数据类型">
        <el-input clearable v-model="pageParams.dictType" placeholder="请输入字典数据类型"></el-input>
      </el-form-item>
      <el-form-item label="字典名称">
        <el-input clearable v-model="pageParams.dictName" placeholder="请输入字典名称"></el-input>
      </el-form-item>
      <el-form-item label="字典Key">
        <el-input clearable v-model="pageParams.dictKey" placeholder="请输入字典Key"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$route.meta.manage" @click="addOne">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" style="width: 100%; margin-bottom: 20px;" border>
      <el-table-column prop="dictType" label="字典数据类型" min-width="200"></el-table-column>
      <el-table-column prop="dictKey" label="字典Key" min-width="200"></el-table-column>
      <el-table-column prop="dictName" label="字典名称" min-width="200"></el-table-column>
      <el-table-column prop="dictValue" label="字典值" min-width="200"></el-table-column>
      <el-table-column prop="status" v-if="$route.meta.manage" label="是否启用" width="150">
        <template slot-scope="scope">
          <el-popconfirm
            :title="`确定${scope.row.status == 1 ? '禁用' : '启用'}吗？`"
            @confirm="changeSwitch({ ...scope.row, status: scope.row.status == 1 ? 2 : 1 }, scope.$index)"
          >
            <el-switch slot="reference" :value="scope.row.status" :active-value="1" :inactive-value="2"></el-switch>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" width="200"></el-table-column>
      <el-table-column prop="description" label="备注" min-width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" :width="!$route.meta.manage ? '200' : '260'">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" style="margin-right: 10px;" type="primary" size="mini">{{
            $route.meta.manage ? '编辑' : '详情'
          }}</el-button>
          <el-popconfirm v-if="$route.meta.manage" title="确定删除吗？" @confirm="removeOne(scope.row.id)">
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
      :title="!$route.meta.manage ? '详情' : form.id ? '编辑' : '添加'"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
    >
      <el-form ref="form" :model="form" :disabled="!$route.meta.manage" :rules="formRules" label-width="110px">
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="字典Key" prop="dictKey">
          <el-input v-model="form.dictKey" placeholder="请输入字典Key" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="字典值" prop="dictKey">
          <el-input v-model="form.dictValue" placeholder="请输入字典值" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.description" maxlength="100" type="textarea" rows="5" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button :loading="saving" type="primary" v-if="$route.meta.manage" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, removeOne, saveOrUpd } from '@/api/dict';

const defaultProps = {
  id: null,
  dictType: '',
  dictKey: '',
  dictName: '',
  dictValue: '',
  description: '',
  status: 1,
};

export default {
  name: 'Dict',
  data(props) {
    return {
      loading: false,
      saving: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
      },
      form: props._.cloneDeep(defaultProps),
      dialogVisible: false,
      tableData: [],
      total: 0,
      formRules: {
        dictName: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
        dictKey: [{ required: true, message: '请输入字典Key', trigger: 'blur' }],
        dictType: [{ required: true, message: '请输入字典数据类型', trigger: 'blur' }],
        dictValue: [{ required: true, message: '请输入字典值', trigger: 'blur' }],
      },
    };
  },
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
      this.$refs.form.resetFields();
      this.dialogVisible = false;
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        this.saving = true;

        saveOrUpd(this.form)
          .then(() => {
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
    removeOne(dictionaryId) {
      removeOne({ dictionaryId }).then(() => {
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
    changeSwitch(data, index) {
      saveOrUpd(this._.pick(data, Object.keys(defaultProps))).then(() => {
        const tableData = [...this.tableData];
        tableData[index] = data;
        this.tableData = tableData;
      });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>
