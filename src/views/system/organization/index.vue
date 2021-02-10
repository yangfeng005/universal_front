<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="机构名称">
        <el-input clearable v-model="pageParams.name" placeholder="请输入名称"></el-input>
      </el-form-item>
      <el-form-item label="机构编码">
        <el-input clearable v-model="pageParams.code" placeholder="请输入编码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$route.meta.manage" @click="addOne()">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" row-key="id" default-expand-all border style="width: 100%; margin-bottom: 20px;">
      <el-table-column prop="name" label="机构名称" width="200"></el-table-column>
      <el-table-column prop="code" label="机构编码" width="150"></el-table-column>
      <el-table-column prop="phone" label="办公电话" width="150"></el-table-column>
      <el-table-column prop="address" label="机构地址" width="250"></el-table-column>
      <el-table-column prop="rank" label="排序" width="80"></el-table-column>
      <el-table-column prop="status" v-if="$route.meta.manage" label="是否启用" width="82">
        <template slot-scope="scope">
          <el-popconfirm :title="`确定${scope.row.status == 1 ? '禁用' : '启用'}吗？`" @confirm="changeSwitch(scope.row)">
            <el-switch slot="reference" :value="`${scope.row.status}`" active-value="1" inactive-value="2"></el-switch>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" :width="!$route.meta.manage ? '200' : '260'">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" type="primary" size="mini">{{ $route.meta.manage ? '编辑' : '详情' }}</el-button>
          <el-button v-if="$route.meta.manage" style="margin-right: 10px;" @click="addOne(scope.row)" type="info" size="mini"
            >添加子级</el-button
          >
          <el-popconfirm v-if="$route.meta.manage" title="确定删除吗？" @confirm="removeOne(scope.row.id)">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      top="5vh"
      width="40%"
      :max-height="tableH"
      :height="tableH"
      :close-on-click-modal="false"
      :title="`${!form.id && form.parentCode ? '添加子级' : form.id ? '编辑' : '添加'}`"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
    >
      <el-form ref="form" :model="form" :disabled="!$route.meta.manage" :rules="formRules" label-width="110px">
        <el-form-item label="机构名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入名称" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="机构编码" prop="code">
          <el-input :disabled="!!form.id" v-model="form.code" placeholder="例：lh_police" maxlength="20"></el-input>
          <small v-if="!form.id">注：机构编码设置后不能修改</small>
        </el-form-item>
        <el-form-item label="父级机构编码" v-if="form.parentCode" prop="parentCode">
          <el-input disabled v-model="form.parentCode" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="父级机构名称" v-if="form.parentName" prop="parentName">
          <el-input disabled v-model="form.parentName" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="办公电话" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入电话" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="机构地址" prop="zipCode">
          <el-input v-model="form.address" placeholder="请输入机构地址" maxlength="100"></el-input>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.status" active-value="1" inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="排序" prop="rank">
          <el-input-number v-model="form.rank" :min="1" controls-position="right" placeholder="请排序"></el-input-number>
          <small>排序规则为：从小到大</small>
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
import { mapState } from 'vuex';
import { getStyle } from '@/utils/common';
import { getList, removeOne, saveOrUpd } from '@/api/agency';
import { validPhoneOrTel } from '@/utils/valid';

const defaultProps = {
  id: null,
  code: '',
  parentCode: '',
  rank: 1,
  name: '',
  level: null,
  email: '',
  zipCode: '',
  phone: '',
  address: '',
  status: '1',
  parentName: '',
};

export default {
  name: 'Agency',
  data(props) {
    return {
      loading: false,
      saving: false,
      pageParams: {
        // pageNo: 1,
        // pageSize: 10,
        name: '',
        code: '',
      },
      form: props._.cloneDeep(defaultProps),
      dialogVisible: false,
      tableData: [],
      total: 0,
      formRules: {
        name: [{ required: true, message: '请输入机构名称', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入机构编码', trigger: 'blur' },
          { max: 30, min: 3, message: '长度必须在3至30个字符之间' },
        ],
        address: [{ required: true, message: '请输入机构地址', trigger: 'blur' }],
        // email: [
        //   { type: "email", message: "请输入正确的邮件地址", trigger: "blur" }
        // ],
        phone: [
          { required: false, message: '请输入电话号码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => validPhoneOrTel('phone', value, callback),
            trigger: 'blur',
          },
        ],
      },
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
    addOne(row) {
      if (row) {
        this.form.parentName = row.name;
        this.form.parentCode = row.code;
      }
      this.dialogVisible = true;
    },
    handleSearch() {
      // this.pageParams.pageNo = 1;

      this.loadData();
    },
    loadData() {
      this.loading = true;
      getList(this.pageParams)
        .then((res) => {
          if (res.data) {
            this.tableData = res.data;
            // this.total = (res.additionalProperties.page && res.additionalProperties.page.total) || res.data.length;
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

        saveOrUpd({
          ...this.form,
          children: JSON.stringify(this.form.children || []),
        })
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
      this.$nextTick(() => {
        this.$refs.form.clearValidate();
      });
    },
    removeOne(agencyId) {
      removeOne({ agencyId }).then(() => {
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
    changeSwitch(data) {
      const form = this._.pick(data, Object.keys(defaultProps));
      form.status = form.status == 1 ? 2 : 1;
      saveOrUpd(form).then(() => {
        data.status = form.status;
      });
    },
  },
  mounted() {
    this.loadData();
  },
};
</script>
