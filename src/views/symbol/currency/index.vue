<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--币种管理-->
      <!--工具栏-->
      <div class="head-container">
        <crudOperation show="" :permission="permission">
          <el-button
            slot="left"
            v-permission="['admin','symbol:up']"
            class="filter-item"
            type="default"
            icon="el-icon-upload2"
            size="mini"
            @click="toUpCoin"
          >
            上币
          </el-button>
        </crudOperation>
      </div>
      <!--表单渲染-->
      <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="70%">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" size="small" label-width="120px">
          <el-form-item label="coin" prop="coin">
            <el-input v-model="form.coin" :disabled="crud.status.add ? false : true" @keydown.native="keydown($event)" />
          </el-form-item>
          <el-form-item label="币种名称" prop="coin_name">
            <el-input v-model.number="form.coin_name" :disabled=" crud.status.add ? false : true " @keydown.native="keydown($event)" />
          </el-form-item>
          <el-form-item label="合约状态" prop="contract_status">
            <treeselect
              v-model="form.contract_status"
              :options="status_list"
              style="width: 178px"
              placeholder="选择合约状态"
            />
          </el-form-item>
          <el-form-item label="合约类型" prop="contract_type">
            <treeselect
              v-model="form.contract_type"
              :options="type_list"
              style="width: 178px"
              placeholder="选择合约类型"
            />
          </el-form-item>
          <el-form-item label="撮合服务编号" prop="cross_idx">
            <el-input v-model="form.cross_idx" />
          </el-form-item>
          <el-form-item label="撮合服务名称" prop="cross_name">
            <el-input v-model="form.cross_name" />
          </el-form-item>
          <el-form-item label="数量小数位数" prop="lot_fraction">
            <el-input v-model="form.lot_fraction" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="数量最小增量" prop="lot_size_x">
            <el-input v-model="form.lot_size_x" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="最小价格" prop="min_price_x">
            <el-input v-model="form.min_price_x" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="最小数量" prop="min_qty_x">
            <el-input v-model="form.min_qty_x" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="qty放大倍数" prop="one_x">
            <el-input v-model="form.one_x" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="价格小数位数" prop="price_fraction">
            <el-input v-model="form.price_fraction" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="价格缩放倍数" prop="price_scale">
            <el-input v-model="form.price_scale" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="币对编号" prop="symbol">
            <el-input v-model="form.symbol" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="币对名称" prop="symbol_name">
            <el-input v-model="form.symbol_name" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="价格最小增量" prop="tick_size_x">
            <el-input v-model="form.tick_size_x" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="价值缩放倍数" prop="value_scale">
            <el-input v-model="form.value_scale" :disabled="crud.status.add ? false : true" />
          </el-form-item>
          <el-form-item label="版本号" prop="version">
            <el-input v-model="form.version" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.status.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <!-- <el-table-column type="selection" width="55" /> -->
        <el-table-column prop="symbol" width="100" label="币对编号" />
        <el-table-column prop="symbol_name" width="100" label="币对名称" />
        <el-table-column prop="coin_name" label="币种名称" />
        <el-table-column :show-overflow-tooltip="true" prop="coin" label="coin" />
        <el-table-column prop="contract_status" label="合约状态" />
        <el-table-column prop="contract_type" width="110" label="合约类型" />
        <el-table-column prop="cross_idx" width="100" label="撮合服务编号" />
        <el-table-column prop="cross_name" width="100" label="撮合服务名称" />
        <el-table-column prop="lot_fraction" width="100" label="数量小数位数" />
        <el-table-column prop="lot_size_x" width="100" label="数量最小增量" />
        <el-table-column prop="min_price_x" width="100" label="最小价格" />
        <el-table-column prop="min_qty_x" width="100" label="最小数量" />
        <el-table-column prop="one_x" width="100" label="qty放大倍数" />
        <el-table-column prop="price_fraction" width="100" label="价格小数位数" />
        <el-table-column prop="price_scale" width="100" label="价格缩放倍数" />
        <el-table-column prop="tick_size_x" width="100" label="价格最小增量" />
        <el-table-column prop="value_scale" width="100" label="价值缩放倍数" />
        <el-table-column prop="version" width="100" label="版本号" />
        <el-table-column
          label="操作"
          width="115"
          align="center"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button v-permission="permission.edit" :loading="crud.status.cu === 2" size="mini" type="primary" icon="el-icon-edit" @click="crud.toEdit(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </el-row>
  </div>
</template>

<script>
import crudCurrency from '@/api/symbol/currency'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
const defaultForm = { id: null, coin: null, coin_name: null, contract_status: null, contract_type: null, cross_idx: null, cross_name: null, lot_fraction: null, lot_size_x: null, min_price_x: null, min_qty_x: null, one_x: null, price_fraction: null, price_scale: null, symbol: null, symbol_name: null, tick_size_x: null, value_scale: null, version: null }
export default {
  name: 'Currency',
  components: { Treeselect, crudOperation, pagination },
  cruds() {
    return CRUD({ title: '币种管理', url: 'api/symbol/list', crudMethod: { ...crudCurrency }})
  },
  mixins: [presenter(), header(), form(defaultForm), crud()],
  data() {
    // 自定义验证
    const validPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入电话号码'))
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
      permission: {
        add: ['admin', 'symbol:add'],
        edit: ['admin', 'symbol:edit'],
        del: []
      },
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
  created() {
    this.crud.msg.add = '新增成功'
    this.crud.optShow = {
      add: true,
      edit: false,
      del: false,
      download: false
    }
  },
  mounted: function() {
    const that = this
    window.onresize = function temp() {
      that.height = document.documentElement.clientHeight - 180 + 'px;'
    }
  },
  methods: {
    toUpCoin() {
      // jiekou neirong
    },
    // 禁止输入空格
    keydown(e) {
      if (e.keyCode === 32) {
        e.returnValue = false
      }
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
