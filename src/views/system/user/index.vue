<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="用户名">
        <el-input clearable v-model="pageParams.userName" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input clearable v-model="pageParams.trueName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-input clearable v-model="pageParams.agencyName" placeholder="请输入机构名称"></el-input>
      </el-form-item>
      <el-form-item label="状态">
        <el-select v-model="pageParams.status" clearable placeholder="请选择状态">
          <el-option label="启用" value="1"></el-option>
          <el-option label="禁用" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" v-if="$route.meta.manage" @click="addOne">添加</el-button>
      </el-form-item>
    </el-form>
    <el-button-group v-if="$route.meta.manage" style="margin-bottom: 20px;">
      <el-button @click="handleSelect(1)" size="mini">批量启用账号</el-button>
      <el-button @click="handleSelect(2)" size="mini">批量禁用账号</el-button>
    </el-button-group>
    <el-table
      v-loading="loading"
      ref="multipleTable"
      :data="tableData"
      :max-height="tableH"
      :height="tableH"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户名" min-width="200">
        <template slot-scope="scope">
          <el-avatar v-if="scope.row.avatarUrl" style="vertical-align: middle;" :src="getFile(scope.row.avatarUrl)"></el-avatar>
          <el-avatar v-else style="vertical-align: middle;">{{ scope.row.userName.substr(0, 1).toUpperCase() }}</el-avatar>
          <span style="margin-left: 5px;">{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="trueName" label="姓名" min-width="160"></el-table-column>
      <el-table-column prop="agencyName" label="机构名称" min-width="200"></el-table-column>
      <!--      <el-table-column prop="nickName" label="昵称" min-width="180"></el-table-column>-->
      <el-table-column prop="gender" label="性别" min-width="100">
        <template slot-scope="scope">{{ scope.row.gender == 1 ? '男' : scope.row.gender == 2 ? '女' : '' }}</template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" align="center" :width="!$route.meta.manage ? '200' : '360'">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" type="primary" size="mini">{{ $route.meta.manage ? '编辑' : '详情' }}</el-button>
          <el-button v-if="$route.meta.manage" @click="updateOne(scope.row, 'role')" type="info" size="mini">角色设置</el-button>
          <el-button v-if="$route.meta.manage" @click="updatePwd(scope.row)" style="margin-right: 10px;" type="warning" size="mini"
            >重置密码</el-button
          >
          <el-popconfirm
            v-if="$route.meta.manage"
            :title="`确定${scope.row.status == 1 ? '禁用' : '启用'}吗？`"
            @confirm="changeSwitch(scope.row.id, scope.row.status == 1 ? 2 : 1, scope.$index)"
          >
            <el-button slot="reference" type="danger" size="mini">{{ scope.row.status == 1 ? '禁用' : '启用' }}</el-button>
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
      top="5vh"
      width="40%"
      :close-on-click-modal="false"
      :title="!$route.meta.manage ? '详情' : form.id ? '编辑' : '添加'"
      :visible.sync="dialogVisible"
      :before-close="handleCancel"
    >
      <el-form ref="form" :model="form" :disabled="!$route.meta.manage" :rules="formRules" label-width="110px">
        <el-form-item label="头像" prop="avatarUrl">
          <upload-img :avatarUrl="form.avatarUrl" @changeUrl="(url) => (form.avatarUrl = url)" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.userName" placeholder="请输入用户名" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="trueName">
          <el-input v-model="form.trueName" placeholder="请输入姓名" maxlength="50"></el-input>
        </el-form-item>
        <el-form-item label="部门" prop="agencyCode">
          <el-cascader
            v-model="form.agencyCode"
            placeholder="请选择部门"
            :props="{ checkStrictly: true }"
            :options="options"
            filterable
            :emitPath="false"
            style="width: 100%;"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="form.mobile" placeholder="请输入手机号" maxlength="11"></el-input>
        </el-form-item>
        <!--<el-form-item label="电子邮件" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮件地址" maxlength="60"></el-input>
        </el-form-item>-->
        <el-form-item label="性别" prop="gender">
          <el-radio-group v-model="form.gender">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否启用">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <el-button :loading="saving" type="primary" v-if="$route.meta.manage" @click="handleSave">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :title="`重置密码-${form1.userName}`" :visible.sync="dialog1Visible" width="30%">
      <el-form ref="form1" :model="form1" :rules="form1Rules" label-width="110px">
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="form1.newPassword" placeholder="请输入新密码" autocomplete="off" maxlength="32"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkPass">
          <el-input type="password" v-model="form1.checkPass" placeholder="请确认新密码" autocomplete="off" maxlength="32"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="() => (dialog1Visible = false)">取 消</el-button>
        <el-button :loading="saving" type="primary" @click="handlePwd">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :close-on-click-modal="false" top="9vh" title="角色设置" :visible.sync="dialog2Visible">
      <div style="text-align: center;">
        用户名: <el-tag size="small" type="info" style="margin-right: 20px; min-width: 120px;">{{ form.userName }}</el-tag> 姓名:
        <el-tag size="small" type="info" style="min-width: 120px;">{{ form.trueName }}</el-tag>
      </div>
      <el-divider></el-divider>
      <el-table stripe ref="rolesTable" :data="roles" style="width: 100%;" border @selection-change="handleCheckAllChange">
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="name" label="角色名称" min-width="160"> </el-table-column>
        <el-table-column prop="agencyName" label="机构名称" min-width="160"> </el-table-column>
        <el-table-column prop="code" label="角色编码" min-width="180"> </el-table-column>
      </el-table>
      <div slot="footer">
        <el-button @click="() => (dialog2Visible = false)">取 消</el-button>
        <el-button :loading="saving" type="primary" @click="handleRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getList, updStatus, saveOrUpd, resetPwd, saveUserRole } from '@/api/user';
import { getList as getAgency } from '@/api/agency';
import { getList as getRole } from '@/api/role';
import { getByUserName } from '@/api/user';

import { validCommon } from '@/utils/valid';
import { formatCascader } from '@/utils/utils';

import UploadImg from '@/components/Upload';

import { mapState } from 'vuex';
import { getStyle } from '@/utils/common';

const defaultProps = {
  id: null,
  agencyCode: '',
  userName: '',
  trueName: '',
  gender: null,
  age: null,
  email: '',
  mobile: '',
  avatarUrl: '',
  status: 1,
};

export default {
  name: 'User',
  data(props) {
    var validatePass = (rule, value, callback) => {
      if (this.form1.checkPass) {
        this.$refs.form1.validateField('checkPass');
      }
      callback();
    };

    var validatePass2 = (rule, value, callback) => {
      if (value && value !== this.form1.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      loading: false,
      saving: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
      },
      options: [], // 组织机构
      roles: [], // 角色
      roleIds: [], // 角色设置
      isIndeterminate: false,
      checkAll: false,
      form: props._.cloneDeep(defaultProps),
      form1: {},
      dialogVisible: false,
      dialog1Visible: false,
      dialog2Visible: false,
      tableData: [],
      total: 0,
      formRules: {
        agencyCode: [{ required: true, message: '请选择机构', trigger: 'blur' }],
        userName: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        email: [{ type: 'email', message: '请输入正确的邮件地址', trigger: 'blur' }],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            validator: (rule, value, callback) => validCommon('mobile', value, callback, '手机号', false),
            trigger: 'blur',
          },
        ],
      },
      form1Rules: {
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' },
        ],
        checkPass: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' },
        ],
      },
      userIds: [], // 批量操作状态
      pickerOptions: {
        disabledDate(val) {
          return props.$moment(val) > props.$moment();
        },
      },
    };
  },
  components: {
    UploadImg,
  },
  watch: {
    'form.joinWorkTime': function (val) {
      this.form.workYears = val ? this.$moment().diff(this.$moment(val), 'years') : null;
    },
  },
  computed: {
    ...mapState('layout', ['tableHeight']),

    tableH() {
      if (this.tableHeight) {
        let html = getStyle(document.documentElement);
        let htmlFont = Number(html.fontSize.replace('px', ''));
        return this.tableHeight - 4.6 * htmlFont;
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
      this.form1 = {};
      this.$refs.form && this.$refs.form.resetFields();
      this.$refs.form1 && this.$refs.form1.resetFields();

      this.dialogVisible = false;
      this.dialog2Visible = false;
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
        if (!valid) return;

        this.saving = true;

        saveOrUpd({
          ...this.form,
          joinWorkTime: this.form.joinWorkTime ? this.$moment(this.form.joinWorkTime).format('YYYY-MM-DD') : '',
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
        this.getUserRoles(row);

        return;
      }

      this.dialogVisible = true;
    },

    getUserRoles(row) {
      this.loading = true;

      this.$refs.rolesTable && this.$refs.rolesTable.clearSelection();

      getByUserName({ userName: row.userName })
        .then((res) => {
          this.dialog2Visible = true;

          this.roleIds = (res.data.roles || []).map((item) => item.id);

          this.$nextTick(() => {
            this.roleIds.map((id) => {
              const obj = this._.find(this.roles, ['id', id]);

              obj && this.$refs.rolesTable.toggleRowSelection(obj);
            });
          });
        })
        .finally(() => (this.loading = false));
    },

    updatePwd(row) {
      this.form1 = {
        id: row.id,
        userName: row.userName,
      };

      this.dialog1Visible = true;
    },
    handlePwd() {
      this.$refs.form1.validate((valid) => {
        if (!valid) return;

        this.saving = true;

        resetPwd(this.form1)
          .then(() => {
            this.$message({
              message: '重置成功',
              type: 'success',
            });

            this.dialog1Visible = false;
          })
          .finally(() => (this.saving = false));
      });
    },
    handleRole() {
      this.saving = true;

      saveUserRole({
        userId: this.form.id,
        roleIds: this.roleIds.join(','),
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
    handleCheckAllChange(val) {
      this.roleIds = val.map((item) => item.id);
    },
    handleSizeChange(pageSize) {
      this.pageParams.pageSize = pageSize;
      this.loadData();
    },
    handleCurrentChange(pageNo) {
      this.pageParams.pageNo = pageNo;
      this.loadData();
    },
    handleSelect(status) {
      const text = status == 1 ? '启用' : '禁用';

      if (this.userIds.length === 0) {
        this.$message({
          type: 'warning',
          message: `请选择需要${text}的账号`,
        });

        return;
      }

      this.$confirm(`确定【${text}】所选账号吗？`, '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        updStatus({
          userIds: this.userIds.join(','),
          status,
        }).then(() => {
          this.$refs.multipleTable.clearSelection();
          this.userIds = [];

          this.$message({
            type: 'success',
            message: `${text}成功`,
          });
        });
      });
    },
    handleSelectionChange(userIds) {
      this.userIds = userIds;
    },
    changeSwitch(userIds, status, index) {
      updStatus({
        userIds,
        status,
      }).then(() => {
        const tableData = [...this.tableData];
        tableData[index].status = status;
        this.tableData = tableData;
      });
    },
  },
  mounted() {
    this.loadData();
    getAgency({ pageNo: 1, pageSize: 500 }).then((res) => {
      this.options = formatCascader(res.data);
    });

    getRole({ pageNo: 1, pageSize: 500 }).then((res) => {
      this.roles = res.data;
    });
  },
};
</script>

<style scoped>
.el-divider {
  margin: 10px 0px;
}
</style>
