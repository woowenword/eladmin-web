<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--币种管理-->
      <!--工具栏-->
      <div class="head-container">
        <div v-if="crud.props.searchToggle">
          <!-- 搜索 -->
          <el-input
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
          <rrOperation />
        </div>
        <crudOperation show="" :permission="permission" />
      </div>
      <!--表单渲染-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="70%">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="币种id" prop="coin">
            <el-input v-model="form.coin" @keydown.native="keydown($event)" :disabled="true" />
          </el-form-item>
          <el-form-item label="币种名称" prop="coin_name">
            <el-input v-model.number="form.coin_name" :disabled="true" />
          </el-form-item>
          <el-form-item label="合约状态" prop="contract_status">
            <treeselect
              v-model="form.contract_status"
              :options="status_list"
              :load-options="loadDepts"
              style="width: 178px"
              placeholder="选择合约状态"
            />
          </el-form-item>
          <el-form-item label="合约类型" prop="contract_type">
            <treeselect
              v-model="form.contract_type"
              :options="type_list"
              :load-options="loadDepts"
              style="width: 178px"
              placeholder="选择合约类型"
            />
          </el-form-item>
          <el-form-item label="撮合服务的编号" prop="cross_idx">
            <el-input v-model="form.cross_idx" />
          </el-form-item>
          <el-form-item label="撮合服务的名称" prop="cross_name">
            <el-input v-model="form.cross_name" />
          </el-form-item>
          <el-form-item label="数量小数位数" prop="lot_fraction">
            <el-input v-model="form.lot_fraction" :disabled="true" />
          </el-form-item>
          <el-form-item label="1" prop="lot_size_x">
            <el-input v-model="form.lot_size_x" :disabled="true" />
          </el-form-item>
          <el-form-item label="最小价格" prop="min_qty_x">
            <el-input v-model="form.min_qty_x" :disabled="true" />
          </el-form-item>
          <el-form-item label="qty,size的放大倍数" prop="one_x">
            <el-input v-model="form.one_x" :disabled="true" />
          </el-form-item>
          <el-form-item label="价格小数位数（对外展示）" prop="price_fraction">
            <el-input v-model="form.price_fraction" :disabled="true" />
          </el-form-item>
          <el-form-item label="价格缩放倍数" prop="price_scale">
            <el-input v-model="form.price_scale" :disabled="true" />
          </el-form-item>
          <el-form-item label="币对编号" prop="symbol">
            <el-input v-model="form.symbol" :disabled="true" />
          </el-form-item>
          <el-form-item label="币对名称" prop="symbol_name">
            <el-input v-model="form.symbol_name" :disabled="true" />
          </el-form-item>
          <el-form-item label="价格最小增量" prop="tick_size_x">
            <el-input v-model="form.tick_size_x" :disabled="true" />
          </el-form-item>
          <el-form-item label="价值缩放倍数" prop="value_scale">
            <el-input v-model="form.value_scale" :disabled="true" />
          </el-form-item>
          <el-form-item label="该symbol当前配置的版本号" prop="version">
            <el-input v-model="form.version" :disabled="true" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column :selectable="checkboxT" type="selection" width="55" />
        <el-table-column :show-overflow-tooltip="true" prop="coin" label="币种id" />
        <el-table-column :show-overflow-tooltip="true" prop="coin_name" label="币种名称" />
        <el-table-column prop="contract_status" label="合约状态" />
        <el-table-column prop="contract_type" label="合约类型" />
        <el-table-column prop="cross_idx" width="100" label="撮合服务的编号" />
        <el-table-column prop="cross_name" width="100" label="撮合服务的名称" />
        <el-table-column prop="lot_fraction" width="100" label="数量小数位数" />
        <el-table-column prop="lot_size_x" width="100" label="1" />
        <el-table-column prop="min_price_x" width="100" label="最小价格" />
        <el-table-column prop="min_qty_x" width="100" label="最小数量" />
        <el-table-column prop="one_x" width="100" label="qty,size的放大倍数" />
        <el-table-column prop="price_fraction" width="100" label="价格小数位数（对外展示）" />
        <el-table-column prop="price_scale" width="100" label="价格缩放倍数" />
        <el-table-column prop="symbol" width="100" label="币对编号" />
        <el-table-column prop="symbol_name" width="100" label="币对名称" />
        <el-table-column prop="tick_size_x" width="100" label="价格最小增量" />
        <el-table-column prop="value_scale" width="100" label="价值缩放倍数" />
        <el-table-column prop="version" width="100" label="该symbol当前配置的版本号" />
        <!-- <el-table-column label="状态" align="center" prop="enabled">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.enabled"
              :disabled="user.id === scope.row.id"
              active-color="#409EFF"
              inactive-color="#F56C6C"
              @change="changeEnabled(scope.row, scope.row.enabled)"
            />
          </template>
        </el-table-column> -->
        <!-- <el-table-column :show-overflow-tooltip="true" prop="createTime" width="135" label="创建日期" /> -->
        <el-table-column
          v-if="checkPer(['admin','user:edit','user:del'])"
          label="操作"
          width="115"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
              :disabled-dle="scope.row.id === user.id"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </el-row>
  </div>
</template>

<script>
import crudUser from '@/api/symbol/currency'
import { isvalidPhone } from '@/utils/validate'
import { getDepts, getDeptSuperior } from '@/api/system/dept'
import { getAll, getLevel } from '@/api/system/role'
import { getAllJob } from '@/api/system/job'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import DateRangePicker from '@/components/DateRangePicker'
import Treeselect from '@riophae/vue-treeselect'
import { mapGetters } from 'vuex'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { LOAD_CHILDREN_OPTIONS } from '@riophae/vue-treeselect'
let userRoles = []
let userJobs = []
const defaultForm = { id: null, username: null, nickName: null, gender: '男', email: null, enabled: 'false', roles: [], jobs: [], dept: { id: null }, phone: null }
export default {
  name: 'User',
  components: { Treeselect, crudOperation, rrOperation, udOperation, pagination, DateRangePicker },
  cruds() {
    return CRUD({ title: '币种管理', url: 'api/symbol/list', crudMethod: { ...crudUser }})
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
      permission: {
        add: ['admin', 'user:add'],
        edit: ['admin', 'user:edit'],
        del: ['admin', 'user:del']
      },
      enabledTypeOptions: [
        { key: 'true', display_name: '激活' },
        { key: 'false', display_name: '锁定' }
      ],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '请输入用户昵称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
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
    this.crud.msg.add = '新增成功，默认密码：123456'
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
    },
    changeRole(value) {
      userRoles = []
      value.forEach(function(data, index) {
        const role = { id: data }
        userRoles.push(role)
      })
    },
    changeJob(value) {
      userJobs = []
      value.forEach(function(data, index) {
        const job = { id: data }
        userJobs.push(job)
      })
    },
    deleteTag(value) {
      userRoles.forEach(function(data, index) {
        if (data.id === value) {
          userRoles.splice(index, value)
        }
      })
    },
    // 新增与编辑前做的操作
    [CRUD.HOOK.afterToCU](crud, form) {
      this.getRoles()
      if (form.id == null) {
        this.getDepts()
      } else {
        this.getSupDepts(form.dept.id)
      }
      this.getRoleLevel()
      this.getJobs()
      form.enabled = form.enabled.toString()
    },
    // 新增前将多选的值设置为空
    [CRUD.HOOK.beforeToAdd]() {
      this.jobDatas = []
      this.roleDatas = []
    },
    // 初始化编辑时候的角色与岗位
    [CRUD.HOOK.beforeToEdit](crud, form) {
      this.getJobs(this.form.dept.id)
      this.jobDatas = []
      this.roleDatas = []
      userRoles = []
      userJobs = []
      const _this = this
      form.roles.forEach(function(role, index) {
        _this.roleDatas.push(role.id)
        const rol = { id: role.id }
        userRoles.push(rol)
      })
      form.jobs.forEach(function(job, index) {
        _this.jobDatas.push(job.id)
        const data = { id: job.id }
        userJobs.push(data)
      })
    },
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
    },
    getDepts() {
      getDepts({ enabled: true }).then(res => {
        this.depts = res.content.map(function(obj) {
          if (obj.hasChildren) {
            obj.children = null
          }
          return obj
        })
      })
    },
    getSupDepts(deptId) {
      getDeptSuperior(deptId).then(res => {
        const date = res.content
        this.buildDepts(date)
        this.depts = date
      })
    },
    buildDepts(depts) {
      depts.forEach(data => {
        if (data.children) {
          this.buildDepts(data.children)
        }
        if (data.hasChildren && !data.children) {
          data.children = null
        }
      })
    },
    // 获取弹窗内部门数据
    loadDepts({ action, parentNode, callback }) {
      if (action === LOAD_CHILDREN_OPTIONS) {
        getDepts({ enabled: true, pid: parentNode.id }).then(res => {
          parentNode.children = res.content.map(function(obj) {
            if (obj.hasChildren) {
              obj.children = null
            }
            return obj
          })
          setTimeout(() => {
            callback()
          }, 200)
        })
      }
    },
    // 改变状态
    changeEnabled(data, val) {
      this.$confirm('此操作将 "' + this.dict.label.user_status[val] + '" ' + data.username + ', 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        crudUser.edit(data).then(res => {
          this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          data.enabled = !data.enabled
        })
      }).catch(() => {
        data.enabled = !data.enabled
      })
    },
    // 获取弹窗内角色数据
    getRoles() {
      getAll().then(res => {
        this.roles = res
      }).catch(() => { })
    },
    // 获取弹窗内岗位数据
    getJobs() {
      getAllJob().then(res => {
        this.jobs = res.content
      }).catch(() => { })
    },
    // 获取权限级别
    getRoleLevel() {
      getLevel().then(res => {
        this.level = res.level
      }).catch(() => { })
    },
    checkboxT(row, rowIndex) {
      return row.id !== this.user.id
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
