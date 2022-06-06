<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;">
    <el-tab-pane label="普通充值" name="first">
      <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input v-model="query.accountId" clearable size="small" placeholder="输入accountId" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <el-input v-model="query.keyword" clearable size="small" placeholder="输入Address、昵称 、邮箱、UID" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <date-range-picker v-model="query.sectionTime" class="date-item" />
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
          <el-table-column label="充值时间" prop="l1_tx.time" :formatter="formatterTimer" width="150" />
          <el-table-column :show-overflow-tooltip="true" label="状态" prop="status" :formatter="formatterStatus" />
          <el-table-column label="币种" prop="currency_id" width="70" />
          <el-table-column label="金额" prop="amount" />
          <el-table-column label="原始链" prop="origin_chain" width="70" />
          <el-table-column label="原币种" prop="currency_id" width="70" />
          <el-table-column :show-overflow-tooltip="true" label="充值帐户" prop="eth_address" />
          <el-table-column :show-overflow-tooltip="true" label="交易TXID" prop="l1_tx.hash" />
          <el-table-column label="确认到账时间" prop="updated_time" width="150" :formatter="formatterTimer" />
        </el-table>
        <!--分页组件-->
        <pagination />
      </div>
    </el-tab-pane>
    <el-tab-pane label="跨链充值" name="second">
      <div>
        跨链充值
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import pagination from '@crud/Pagination'
import crudOperation from '@crud/CRUD.operation'
import DateRangePicker from '@/components/DateRangePicker'

export default {
  name: 'Deposit',
  components: { pagination, crudOperation, rrOperation, DateRangePicker },
  cruds() {
    return CRUD({ title: '充值管理', url: 'api/dewi/deposits', crudMethod: {}})
  },
  mixins: [presenter(), header(), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    return {
      activeName: 'first',
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
  methods: {
    formatterTimer(row, column) {
      if (column.property === 'l1_tx.time') {
        return this.$moment(row.l1_tx.time * 1000).format('YYYY-MM-DD:HH-mm-ss')
      } else if (row.status === 'SUCCESS' && column.property === 'updated_time') {
        return this.$moment(Math.round(row[column.property])).format('YYYY-MM-DD:HH-mm-ss')
      } else {
        return '-'
      }
    },
    formatterStatus(row, column, cellValue, index) {
      const str = this.enabledTypeOptions.map(item => {
        if (item.key === row.status) {
          return item.display_name
        }
      })
      return str
    }
  }
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
