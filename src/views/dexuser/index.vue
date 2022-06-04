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
          <el-form-item label="UID" prop="jobName">
            <el-input v-model="form.jobName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="昵称" prop="jobName">
            <el-input v-model="form.jobName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="注册时间" prop="jobName">
            <el-input v-model="form.jobName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="最后登录时间" prop="description">
            <el-input v-model="form.description" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="Address" prop="beanName">
            <el-input v-model="form.beanName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="邮箱" prop="methodName">
            <el-input v-model="form.methodName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="账户状态" prop="cronExpression">
            <el-input v-model="form.cronExpression" style="width: 220px;" />
          </el-form-item>
        </div>
        <p>资产信息</p>
        <div class="border-style">
          <el-form-item label="总资产" prop="jobName">
            <el-input v-model="form.jobName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="30日交易集" prop="jobName">
            <el-input v-model="form.jobName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="可用保证金" prop="jobName">
            <el-input v-model="form.jobName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="累计交易值" prop="description">
            <el-input v-model="form.description" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="仓位价值" prop="beanName">
            <el-input v-model="form.beanName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="累计手续费贡献" prop="methodName">
            <el-input v-model="form.methodName" style="width: 220px;" />
          </el-form-item>
          <el-form-item label="用户手续费等级" prop="cronExpression">
            <el-input v-model="form.cronExpression" style="width: 220px;" />
          </el-form-item>
        </div>
        <p>查询</p>
        <div class="border-style">
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            @click="toJumpDeposite"
          >
            充值记录
          </el-button>
          <el-button
            class="filter-item"
            size="mini"
            type="default"
            @click="toJumpWithdraw"
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
          <el-button v-permission="['admin','timing:edit']" size="mini" style="margin-right: 3px;" type="text" @click="crud.toEdit(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import crudJob from '@/api/account/account'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

const defaultForm = { id: null, jobName: null, subTask: null, beanName: null, methodName: null, params: null, cronExpression: null, pauseAfterFailure: true, isPause: false, personInCharge: null, email: null, description: null }
export default {
  name: 'OnlineUser',
  components: { pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ url: 'api/dexuser/list', title: '账户管理', crudMethod: { ...crudJob }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    return {
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
    formatterTimer(row, column) {
      return this.$moment(Math.round(row.created_time)).format('YYYY-MM-DD:HH-mm-ss')
    },
    toJumpWithdraw() {
      this.$route.push('/depositwithdraw/withdraw')
    },
    toJumpDeposite() {
      this.$router.push('/depositwithdraw/deposit')
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
