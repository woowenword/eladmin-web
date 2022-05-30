<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--币种管理-->
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <!-- <el-input
            v-model="query.blurry"
            clearable
            size="small"
            placeholder="输入名称或者邮箱搜索"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="crud.toQuery"
          />
          <date-range-picker v-model="query.createTime" class="date-item" />
          <el-select
            v-model="query.enabled"
            clearable
            size="small"
            placeholder="状态"
            class="filter-item"
            style="width: 90px"
            @change="crud.toQuery"
          >
            <el-option
              v-for="item in enabledTypeOptions"
              :key="item.key"
              :label="item.display_name"
              :value="item.key"
            />
          </el-select>
          <rrOperation />-->
        </div>
      </div>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 50%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="symbol_name" label="币对" />
        <el-table-column prop="cross_idx" label="撮合服务的编号" />
        <!-- <el-table-column
          v-if="checkPer(['admin','user:del'])"
          label="操作"
          width="115"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column> -->
        <el-table-column v-if="checkPer(['admin','deployHistory:del'])" label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-popover
              :ref="scope.row.id"
              v-permission="['admin','deployHistory:del']"
              placement="top"
              width="180"
            >
              <p>确定清空本条数据吗？</p>
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
import { isvalidPhone } from '@/utils/validate'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import pagination from '@crud/Pagination'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const defaultForm = { id: null, username: null, nickName: null, gender: '男', email: null, enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null }
export default {
  name: 'Currency',
  components: { pagination },
  cruds() {
    return CRUD({ title: '币种管理', url: 'api/symbol/list', crudMethod: { del }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  // 数据字典
  dicts: ['user_status'],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
      } else if (!isvalidPhone(value)) {
        callback(new Error('请输入正确的11位手机号码'))
      } else {
        callback()
      }
    }
    return {
      delLoading: false,
      height: document.documentElement.clientHeight - 180 + 'px;',
      status_list: [
        { id: 'Pending', label: 'Pending' },
        { id: 'Trading', label: 'Trading' },
        { id: 'Settling', label: 'Settling' },
        { id: 'Closed', label: 'Closed' }
      ],
      type_list: [
        { id: 'UNKNOWN', label: 'UNKNOWN' },
        { id: 'LinearPerpetual', label: 'LinearPerpetual' }
      ],
      deptName: '', depts: [], deptDatas: [], jobs: [], level: 3, roles: [],
      jobDatas: [], roleDatas: [], // 多选时使用
      defaultProps: { children: 'children', label: 'name', isLeaf: 'leaf' },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        phone: [
          { required: true, trigger: 'blur', validator: validPhone }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
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
      if (!crud.form.contract_status) {
        this.$message({
          message: '合约状态不能为空',
          type: 'warning'
        })
        return false
      } else if (!crud.form.cross_idx) {
        this.$message({
          message: '撮合服务的编号不能为空',
          type: 'warning'
        })
        return false
      } else if (!crud.form.cross_name) {
        this.$message({
          message: '撮合服务的名称不能为空',
          type: 'warning'
        })
        return false
      }
      return true
    }
  }
}
</script>
