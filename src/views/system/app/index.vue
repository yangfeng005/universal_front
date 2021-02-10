<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="平台">
        <el-select v-model="pageParams.platform" clearable placeholder="请选择平台">
          <el-option label="IOS" value="IOS"></el-option>
          <el-option label="Android" value="Android"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="APP版本号">
        <el-input clearable v-model="pageParams.versionCode" placeholder="请输入版本号"></el-input>
      </el-form-item>
      <el-form-item label="APP版本名称">
        <el-input clearable v-model="pageParams.versionName" placeholder="请输入版本名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$route.meta.manage" @click="addOne">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" style="width: 100%; margin-bottom: 20px;" border>
      <el-table-column prop="versionName" label="APP版本名称" min-width="200"></el-table-column>
      <el-table-column prop="versionCode" label="APP版本号" min-width="200"></el-table-column>
      <el-table-column prop="platform" label="平台" min-width="200"></el-table-column>
      <el-table-column prop="status" v-if="$route.meta.manage" label="是否启用" min-width="150">
        <template slot-scope="scope">
          <el-popconfirm
            :title="`确定${scope.row.status == 1 ? '禁用' : '启用'}吗？`"
            @confirm="changeSwitch({ ...scope.row, status: scope.row.status == 1 ? 2 : 1 }, scope.$index)"
          >
            <el-switch slot="reference" :value="scope.row.status" :active-value="1" :inactive-value="2"></el-switch>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column prop="forceUpdate" v-if="$route.meta.manage" label="是否强制更新" min-width="150">
        <template slot-scope="scope">
          <el-popconfirm
            :title="`${scope.row.forceUpdate == 2 ? '启用' : '禁用'}强制更新吗？`"
            @confirm="changeSwitch({ ...scope.row, forceUpdate: scope.row.forceUpdate == 1 ? 2 : 1 }, scope.$index)"
          >
            <el-switch slot="reference" :value="scope.row.forceUpdate" :active-value="1" :inactive-value="2"></el-switch>
          </el-popconfirm>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" min-width="200"></el-table-column>
      <el-table-column prop="description" label="备注" min-width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" align="center" width="260">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" style="margin-right: 10px;" type="primary" size="mini">{{
            $route.meta.manage ? '编辑' : '详情'
          }}</el-button>
          <a style="margin-right: 10px;" :href="getFile(scope.row.fileId)" download>
            <el-button type="info" size="mini">下载</el-button>
          </a>
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
        <el-form-item label="安装包上传" prop="fileId">
          <upload-file
            :fileId="form.fileId"
            :filePath="form.filePath"
            fileType="apk"
            @change="
              (file) => {
                form.fileId = file.id;
                form.filePath = file.filePath;
              }
            "
          />
        </el-form-item>
        <el-form-item label="APP版本名称" prop="versionName">
          <el-input v-model="form.versionName" placeholder="请输入版本名称" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="APP版本号" prop="versionCode">
          <el-input v-model="form.versionCode" placeholder="请输入版本号" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="平台" prop="platform">
          <el-radio-group v-model="form.platform">
            <el-radio label="IOS"></el-radio>
            <el-radio label="Android"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="是否强制更新">
          <el-switch v-model="form.forceUpdate" :active-value="1" :inactive-value="2"></el-switch>
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
import { getList, removeOne, saveOrUpd } from '@/api/app';

import UploadFile from '@/components/Upload/File';

const defaultProps = {
  id: null,
  platform: 'Android',
  versionCode: '',
  versionName: '',
  fileId: '',
  forceUpdate: 1,
  status: 1,
  description: '',
  filePath: null,
};

export default {
  name: 'AppManage',
  data(props) {
    return {
      loading: false,
      saving: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
        platform: null,
      },
      form: props._.cloneDeep(defaultProps),
      dialogVisible: false,
      tableData: [],
      total: 0,
      formRules: {
        fileId: [{ required: true, message: '请上传安装包' }],
        versionName: [{ required: true, message: '请输入版本名称', trigger: 'blur' }],
        versionCode: [{ required: true, message: '请输入版本号', trigger: 'blur' }],
        platform: [{ required: true, message: '请选择平台', trigger: 'blur' }],
      },
    };
  },
  components: { UploadFile },
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
    removeOne(apkVersionId) {
      removeOne({ apkVersionId }).then(() => {
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
