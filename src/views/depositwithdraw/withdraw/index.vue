<template>
  <el-tabs v-model="activeName" style="padding-left: 8px;">
    <el-tab-pane label="普通提现" name="first">
      <div class="app-container">
        <!--工具栏-->
        <div class="head-container">
          <div v-if="crud.props.searchToggle">
            <!-- 搜索 -->
            <el-input v-model="query.accountId" clearable size="small" placeholder="输入accountId" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <el-input v-model="query.keyword" clearable size="small" placeholder="输入Address、昵称 、邮箱、UID" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
            <date-range-picker v-model="query.sectionTime" class="date-item" />
            <el-select v-model="query.withdrawStatus" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
              <el-option v-for="item in enabledTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
            </el-select>
            <rrOperation />
          </div>
          <crudOperation :permission="permission" />
        </div>
        <!--表格渲染-->
        <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
          <!-- <el-table-column type="selection" width="55" /> -->
          <el-table-column label="提现申请时间" prop="created_time" :formatter="formatterTimer" width="150" />
          <el-table-column :show-overflow-tooltip="true" label="状态" align="center" prop="status" :formatter="formatterStatus" />
          <el-table-column label="币种" prop="currency_id" width="70" />
          <el-table-column label="金额" prop="amount" />
          <el-table-column label="链路" prop="origin_chain" width="60" />
          <el-table-column label="费用(USDC)" prop="currency_id" />
          <el-table-column :show-overflow-tooltip="true" label="提现帐户" prop="eth_address" />
          <el-table-column :show-overflow-tooltip="true" label="交易TXID" prop="l1_confirmed_tx.hash" />
          <el-table-column label="提现打款时间" prop="updated_time" width="150" :formatter="formatterTimer" />
        </el-table>
        <!--分页组件-->
        <pagination />
      </div>
    </el-tab-pane>
    <el-tab-pane label="快速提现" name="second">
      <div>
        快速提现
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
    return CRUD({ title: '提现管理', url: 'api/dewi/withdraws', crudMethod: { }})
  },
  mixins: [presenter(), header(), crud()],
  // 设置数据字典
  dicts: ['dept_status'],
  data() {
    const query = this.$route.query
    return {
      accountId: query.accountIdUrl,
      activeName: 'first',
      depts: [],
      permission: {
        add: ['admin', 'dept:add'],
        edit: ['admin', 'dept:edit'],
        del: ['admin', 'dept:del']
      },
      enabledTypeOptions: [
        { key: 'UNKNOWN_WITHDRAW_STATUS', display_name: '未知状态' },
        { key: 'PENDING_CENSORING ', display_name: '审查验证结果中' },
        { key: 'PENDING_L2_APPROVING', display_name: '审查验证成功，等待L2验证批准中' },
        { key: ' PENDING_L1_CONFIRMING', display_name: 'L2验证批准完成，等待提现交易L1确认中' },
        { key: 'PENDING_L1_WITHDRAWING', display_name: '提现交易L1确认完成，等待用户在L1合约中提现' },
        { key: 'SUCCESS', display_name: '提现成功，钱已到用户钱包中【终态】' },
        { key: 'FAILED_CENSOR_FAILURE', display_name: '提现失败。审查验证数据不正确，所有数据回滚。【终态】' },
        { key: 'FAILED_L2_REJECTED', display_name: '提现失败。L2验证拒绝，所有数据回滚。【终态】' }
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
      if (column.property === 'created_time') {
        return this.$moment(Math.round(row[column.property])).format('YYYY-MM-DD:HH-mm-ss')
      } else if (column.property === 'l1_confirmed_time' && row.l1_confirmed_time !== null) {
        return this.$moment(row.l1_confirmed_time * 1000).format('YYYY-MM-DD:HH-mm-ss')
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
