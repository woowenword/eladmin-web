<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.filter" clearable size="small" placeholder="输入Address、昵称、邮箱开始检索" style="width: 300px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation show="" :permission="permission" />
    </div>
    <!--Form表单-->
    <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" append-to-body width="730px">
      <el-form ref="form" :inline="true" :model="form" size="small" label-width="100px">
        <p>基础资料</p>
        <div class="border-style">
          <el-form-item label="UID" prop="base_info.id">
            <el-input v-model="form.base_info.id" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="昵称" prop="base_info.nickname">
            <el-input v-model="form.base_info.nickname" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="注册时间" prop="base_info.created_time">
            <el-input v-model="form.base_info.created_time" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="最后登录时间" prop="base_info.created_time">
            <el-input v-model="form.base_info.created_time" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="Address" prop="base_info.eth_address">
            <el-input v-model="form.base_info.eth_address" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="邮箱" prop="base_info.email">
            <el-input v-model="form.base_info.email" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="账户状态" prop="base_info.eth_address">
            <el-input v-model="form.base_info.eth_address" style="width: 220px;" />
          </el-form-item>
        </div>
        <p>资产信息</p>
        <div class="border-style">
          <el-form-item label="总资产" prop="property.total_account_value">
            <el-input v-model="form.property.total_account_value" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="30日交易集" prop="property.volume_for_30day">
            <el-input v-model="form.property.volume_for_30day" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="可用保证金" prop="property.margin_value">
            <el-input v-model="form.property.margin_value" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="累计交易值" prop="property.margin_value">
            <el-input v-model="form.property.margin_value" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="仓位价值" prop="property.position_value">
            <el-input v-model="form.property.position_value" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="累计手续费贡献" prop="property.position_value">
            <el-input v-model="form.property.position_value" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="用户手续费等级" prop="property.position_value">
            <el-input v-model="form.property.position_valuex" style="width: 220px;" />
          </el-form-item>
        </div>
        <p>查询</p>
        <div class="border-style">
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            @click="toJumpDeposite(form.base_info.account_id)"
          >
            充值记录
          </el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            @click="toJumpWithdraw(form.base_info.account_id)"
          >
            提现记录
          </el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            @click="crud.toAdd"
          >
            委托记录
          </el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            @click="crud.toAdd"
          >
            交易记录
          </el-button>
        </div>
        <p>账户操作日志记录</p>
        <div class="border-style">
          <el-table ref="table" v-loading="crud.loading" :data="form.data" style="width: 100%;">
            <el-table-column prop="时间" label="时间" />
            <el-table-column prop="IP" label="IP" />
            <el-table-column prop="设备信息" label="设备信息" />
            <el-table-column prop="操作内容" label="操作内容" />
          </el-table>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="UID" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="eth_address" label="Address" />
      <el-table-column prop="email" label="邮箱" />
      <el-table-column prop="created_time" label="注册时间" :formatter="formatterTimer" width="150" />
      <el-table-column label="操作" width="70px" fixed="right">
        <template slot-scope="scope">
          <!-- <el-button v-permission="['admin','timing:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">查看</el-button> -->
          <el-button
            v-permission="['admin','timing:edit']"
            :loading="lookLoading"
            size="mini"
            style="margin-right: 3px;"
            type="text"
            @click="handelEdit(scope.row)"
          > 查看 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudDexu from '@/api/dexuser/dexuser'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { base_info: { id: null, nickname: null, created_time: null, eth_address: null, email: null, account_id: null }, property: { total_account_value: null, volume_for_30day: null, margin_value: null, position_value: null }}
export default {
  name: 'OnlineUser',
  components: { pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ url: 'api/dexuser/list', title: '账户管理', crudMethod: { ...crudDexu }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
      lookLoading: false,
      permission: {}
    }
  },
  created() {
    this.crud.msg.del = '强退成功！'
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: false
    }
  },
  methods: {
    handelEdit(row) {
      this.lookLoading = true
      crudDexu.edit(row.id).then((res) => {
        this.lookLoading = false
        this.crud.toEdit(res)
      }).catch(() => {
        this.lookLoading = false
      })
      this.crud.toEdit()
    },
    formatterTimer(row, column) {
      return this.$moment(Math.round(row.created_time)).format('YYYY-MM-DD:HH-mm-ss')
    },
    toJumpWithdraw(id) {
      debugger
      this.$router.push(
        { path: '/depositwithdraw/withdraw', query: { accountIdUrl: id }}
      )
    },
    toJumpDeposite(id) {
      this.$router.push(
        { path: '/depositwithdraw/deposit', query: { accountIdUrl: id }}
      )
    }
  }
}
</script>
<style scoped>
  .border-style {
    padding: 15px 0 10px 10px;
    border: 1px solid #eee
  }
</style>
