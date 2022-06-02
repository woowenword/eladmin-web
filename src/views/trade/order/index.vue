<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.keyword" clearable size="small" placeholder="输入名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <date-range-picker v-model="query.createTime" class="date-item" />
        <el-select v-model="query.currencyId" clearable size="small" placeholder="币种" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in enabledCurrencyOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <el-select v-model="query.depositStatus" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation />
      </div>
      <crudOperation :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column label="委托时间" prop="created_time" :formatter="dateFormat" />
      <el-table-column label="币对" prop="symbol" />
      <el-table-column label="委托数量" prop="size" />
      <el-table-column label="价格" prop="price" />
      <el-table-column label="成交数量" prop="cum_match_fill_size" />
      <el-table-column label="方向" prop="side" />
      <el-table-column :show-overflow-tooltip="true" label="类型" align="center" prop="type" />
      <el-table-column :show-overflow-tooltip="true" label="状态" prop="status" />
      <el-table-column :show-overflow-tooltip="true" label="订单编号" prop="id" />
      <el-table-column label="UID" prop="user_id" width="100" />
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  name: 'Order',
  components: { pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '委托单查询', url: 'api/order/list', crudMethod: {}})
  },
  mixins: [presenter(), header(), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      depts: [],
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      enabledTypeOptions: [
        { key: 'UNKNOWN_DEPOSIT_STATUS', display_name: '未知状态' },
        { key: 'PENDING_L1_CREATING', display_name: '已在L1发现充值交易，创建确认中' },
        { key: 'SUCCESS', display_name: '充值成功，钱已到账可使用,等待L2验证批准中' },
        { key: 'SUCCESS_L2_APPROVED', display_name: 'L2验证批准通过【终态】' },
        { key: 'CANCELED', display_name: 'L1创建确认失败，已取消充值【终态】' },
        { key: 'FAILED_CENSOR_FAILURE', display_name: '充值失败。审查验证充值数据不正确，所有数据回滚。【终态】' },
        { key: 'FAILED_L2_REJECTED', display_name: '充值失败。L2验证拒绝，已到账的钱要回滚' }
      ],
      enabledCurrencyOptions: [
        { key: 'USDC', display_name: 'USDC' }
      ]
    }
  },
  created() {
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: false
    }
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .vue-treeselect__control,::v-deep .vue-treeselect__placeholder,::v-deep .vue-treeselect__single-value {
    height: 30px;
    line-height: 30px;
  }
</style>
<style rel="stylesheet/scss" lang="scss" scoped>
 ::v-deep .el-input-number .el-input__inner {
    text-align: left;
  }
</style>
