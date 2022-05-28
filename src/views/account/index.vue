<template>
  <div class="app-container">
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <el-input v-model="query.filter" clearable size="small" placeholder="输入Address、昵称、邮箱开始检索" style="width: 300px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation />
      </div>
      <crudOperation show="" :permission="permission" />
    </div>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="id" label="UID" />
      <el-table-column prop="nickName" label="昵称" />
      <el-table-column prop="dept" label="Address" />
      <el-table-column prop="browser" label="邮箱" />
      <el-table-column prop="loginTime" label="注册时间" />
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
import CRUD, { presenter, header, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

export default {
  name: 'OnlineUser',
  components: { pagination, crudOperation, rrOperation },
  cruds() {
    return CRUD({ url: 'api/account/list', title: '账户管理' })
  },
  mixins: [presenter(), header(), crud()],
  data() {
    return {
      delLoading: false,
      permission: {}
    }
  },
  created() {
    this.crud.msg.del = '强退成功！'
    this.crud.optShow = {
      add: false,
      edit: false,
      del: false,
      download: true
    }
  }
}
</script>
