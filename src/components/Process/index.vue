<template>
  <div>
    <el-form :inline="true" :model="pageParams">
      <el-form-item label="类型名称">
        <el-input clearable v-model="pageParams.name" placeholder="请输入类型名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table stripe v-loading="loading" :data="tableData" style="width: 100%; margin-bottom: 20px;" border>
      <el-table-column prop="name" label="类型名称" min-width="220"></el-table-column>
      <el-table-column prop="processDefinitionKey" label="流程定义KEY" min-width="200"></el-table-column>
      <el-table-column prop="typeCode" label="类型编码" min-width="260"></el-table-column>
      <el-table-column prop="updateTime" label="创建时间" min-width="200"></el-table-column>
      <el-table-column fixed="right" label="操作" v-if="$route.meta.manage" align="center" min-width="200">
        <template slot-scope="scope">
          <el-button @click="updateOne(scope.row)" style="margin-right: 10px;" type="primary" size="mini">配置流程</el-button>
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
    <el-drawer title="选择流程" size="80%" :visible.sync="drawer">
      <list-content :form="form" @save="handleSave"></list-content>
    </el-drawer>
  </div>
</template>
<script>
import { getList, saveOrUpd } from '@/api/workFlow';
import ListContent from './List';

const defaultProps = {
  id: null,
  name: '',
  icon: '',
  formUrl: '',
  typeCode: '',
  categoryCode: '',
  processDefinitionKey: '',
};

export default {
  name: 'Process',
  props: {
    categoryCode: String,
  },
  data(props) {
    return {
      loading: false,
      saving: false,
      pageParams: {
        pageNo: 1,
        pageSize: 10,
      },
      model: {
        id: null,
      }, // 模型初始配置
      form: props._.cloneDeep(defaultProps),
      drawer: false,
      dialogVisible: false,
      tableData: [],
      total: 0,
    };
  },
  components: { ListContent },
  methods: {
    handleSearch() {
      this.pageParams.pageNo = 1;

      this.loadData();
    },
    loadData() {
      this.loading = true;
      getList({
        ...this.pageParams,
        categoryCode: this.categoryCode,
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
      this.form = this._.cloneDeep(defaultProps);
      this.drawer = false;
      this.dialogVisible = false;
    },
    handleSave(row) {
      saveOrUpd({
        ...this.form,
        processDefinitionKey: row.key,
      }).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success',
        });
        this.loadData();
        this.handleCancel();
      });
    },
    updateOne(row) {
      this.form = this._.pick(row, Object.keys(defaultProps));

      this.drawer = true;
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
