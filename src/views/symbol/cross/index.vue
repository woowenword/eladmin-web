<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 50%;">
        <el-table-column prop="symbol_name" label="币对" />
        <el-table-column prop="symbol" label="币对编号" />
        <el-table-column prop="cross_idx" label="撮合服务的编号" />
        <el-table-column v-if="checkPer(['admin','deployHistory:del'])" label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','deployHistory:del']"
              placement="top"
              width="180"
            >
              <p>确定清空此撮合数据吗？</p>
              <div style="text-align: right; margin: 0">
                <el-button size="mini" type="text" @click="$refs[scope.row.symbol_name].doClose()">取消</el-button>
                <el-button :loading="delLoading" type="primary" size="mini" @click="delMethod(scope.row.symbol_name)">确定</el-button>
              </div>
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini" />
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </el-row>
  </div>
</template>

<script>

import { del } from '@/api/symbol/cross'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const defaultForm = { }
export default {
  name: 'Currency',
  components: { pagination },
  cruds() {
    return CRUD({ title: '清空撮合', url: 'api/symbol/list', crudMethod: { del }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    // 自定义验证
    return {
      delLoading: false
    }
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    delMethod(name) {
      this.delLoading = true
      del([name]).then(() => {
        this.delLoading = false
        this.$refs[name].doClose()
      }).catch(() => {
        this.delLoading = false
        this.$refs[name].doClose()
      })
    },
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      form.enabled = form.enabled.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd](crud, form) {
      form = null
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {},
    // 提交前做的操作
    [CRUD.HOOK.afterValidateCU](crud) {
      return true
    }
  }
}
</script>
