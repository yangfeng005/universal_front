<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="机构名称">
        <el-input clearable v-model="pageParams.agencyName" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$route.meta.manage" @click="addOne">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" :max-height="tableH" :height="tableH" border>
      <el-table-column prop="name" label="角色名称" min-width="160"></el-table-column>
      <el-table-column prop="agencyName" label="机构名称" min-width="200"></el-table-column>
      <el-table-column prop="code" label="角色编码" width="200"></el-table-column>
      <el-table-column prop="agencyCode" label="机构编码" width="200"></el-table-column>
      <!--<el-table-column prop="dataScope" label="数据权限" width="100">
        <template slot-scope="scope">
          {{ scope.row.dataScope == 1 ? '本人' : scope.row.dataScope == 2 ? '本部门' : scope.row.dataScope == 3 ? '本机构' : '' }}
        </template>
      </el-table-column>-->
      <el-table-column prop="status" v-if="$route.meta.manage" label="是否启用" width="100">
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
      <el-table-column fixed="right" label="操作" align="center" :width="!$route.meta.manage ? '200' : '260'">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" type="primary" size="mini">{{ $route.meta.manage ? '编辑' : '详情' }}</el-button>
          <el-button
            v-if="$route.meta.manage"
            @click="updateOne(scope.row, 'privilege')"
            style="margin-right: 10px;"
            type="info"
            size="mini"
            >权限配置</el-button
          >
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
      top="9vh"
      width="40%"
      :close-on-click-modal="false"
      :title="!$route.meta.manage ? '详情' : form.id ? '编辑' : '添加'"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
    >
      <el-form ref="form" :model="form" :disabled="!$route.meta.manage" :rules="formRules" label-width="110px">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入角色名称" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="角色编码" prop="code">
          <el-input v-model="form.code" placeholder="请输入角色编码" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="组织机构" prop="agencyCode">
          <el-cascader
            v-model="form.agencyCode"
            placeholder="请选择机构"
            :props="{ checkStrictly: true }"
            :options="options"
            filterable
            :emitPath="false"
            style="width: 100%;"
          ></el-cascader>
        </el-form-item>
        <!--  <el-form-item label="数据权限" prop="dataScope">
          <el-radio-group v-model="form.dataScope">
            <el-radio :label="1">本人</el-radio>
            <el-radio :label="2">本部门</el-radio>
            <el-radio :label="3">本机构</el-radio>
          </el-radio-group>
        </el-form-item>-->
        <el-form-item label="是否启用">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
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
    <el-dialog
      :close-on-click-modal="false"
      :title="`权限配置-${this.form.name}[${this.form.code}]`"
      :visible.sync="dialog1Visible"
      :before-close="handleCancel"
    >
      <ul class="infinite-list" style="height: 350px; overflow: auto;">
        <el-tree
          ref="tree"
          :data="resource"
          show-checkbox
          node-key="id"
          highlight-current
          default-expand-all
          :default-expanded-keys="[0]"
          :props="{ label: 'name' }"
        ></el-tree>
      </ul>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button :loading="saving" type="primary" @click="savePrivilege">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, removeOne, saveOrUpd, getRolePrivilege, savePrivilege } from '@/api/role';
import { getList as getAgency } from '@/api/agency';
import { getResourceTreeNode } from '@/api/resource';
import { formatCascader } from '@/utils/utils';
import { mapState } from 'vuex';
import { getStyle } from '@/utils/common';

const defaultProps = {
  id: null,
  name: '',
  code: '',
  rank: null,
  status: 1,
  agencyCode: [],
  description: '',
};

export default {
  name: 'SystemRole',
  data(props) {
    return {
      loading: false,
      saving: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
      },
      options: [], // 组织机构tree
      resource: [], // 菜单权限Tree
      form: props._.cloneDeep(defaultProps),
      dialogVisible: false,
      dialog1Visible: false,
      tableData: [],
      total: 0,
      formRules: {
        name: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
        agencyCode: [{ required: true, message: '请选择组织机构', trigger: 'blur' }],
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
      this.$refs.form && this.$refs.form.resetFields();
      this.dialogVisible = false;
      this.dialog1Visible = false;
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        this.saving = true;

        saveOrUpd({
          ...this.form,
          agencyCode: this._.isArray(this.form.agencyCode) ? this.form.agencyCode[this.form.agencyCode.length - 1] : this.form.agencyCode,
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
    updateOne(row, type) {
      this.form = this._.pick(row, Object.keys(defaultProps));

      if (type) {
        getRolePrivilege({ roleId: row.id }).then((res) => {
          const ids = res.data.map((item) => item.privilegeId);
          this.$refs.tree.setCheckedKeys(ids);
        });

        this.dialog1Visible = true;

        return;
      }

      this.dialogVisible = true;
    },
    removeOne(id) {
      removeOne({ id }).then(() => {
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
    savePrivilege() {
      this.saving = true;

      let ids = this.$refs.tree.getCheckedKeys();
      ids = this._.cloneDeep(ids);

      const _ids = ids.filter((num) => !!num).join(',');

      savePrivilege({
        roleId: this.form.id,
        privilegeIds: _ids,
      })
        .then(() => {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
          this.handleCancel();
        })
        .finally(() => (this.saving = false));
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
    getAgency({ pageNo: 1, pageSize: 500 }).then((res) => {
      this.options = formatCascader(res.data);
    });
    getResourceTreeNode({ pageNo: 1, pageSize: 500 }).then((res) => {
      this.resource = [
        {
          id: 0,
          name: '全选',
          children: res.data,
        },
      ];
    });
  },
};
</script>
