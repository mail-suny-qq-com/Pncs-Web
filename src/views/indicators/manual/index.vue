<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="补录ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标编号">
            <el-input v-model="form.ieCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标名称">
            <el-input v-model="form.ieName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标类型">
            <el-select v-model="form.ieType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.IE_TYPE"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="指标结果">
            <el-input v-model="form.ieValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标计划值">
            <el-input v-model="form.iePlanValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="计算周期">
            <el-input v-model="form.periodCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="对象编号">
            <el-input v-model="form.objectCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="对象类别(维度ID)">
            <el-input v-model="form.objectType" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="form.status" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="审核流程ID">
            <el-input v-model="form.processInstanceId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结果保留期限（1,Y）">
            <el-input v-model="form.retention" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建用户">
            <el-input v-model="form.crtUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建机构">
            <el-input v-model="form.crtOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-input v-model="form.crtDate" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改用户">
            <el-input v-model="form.updUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改机构">
            <el-input v-model="form.updOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改时间">
            <el-input v-model="form.updDate" style="width: 370px;" />
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="补录ID" />
        <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编号" />
        <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称" />
        <el-table-column v-if="columns.visible('ieType')" prop="ieType" label="指标类型">
          <template slot-scope="scope">
            {{ dict.label.IE_TYPE[scope.row.ieType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('ieValue')" prop="ieValue" label="指标结果" />
        <el-table-column v-if="columns.visible('iePlanValue')" prop="iePlanValue" label="指标计划值" />
        <el-table-column v-if="columns.visible('periodCode')" prop="periodCode" label="计算周期" />
        <el-table-column v-if="columns.visible('objectCode')" prop="objectCode" label="对象编号" />
        <el-table-column v-if="columns.visible('objectType')" prop="objectType" label="对象类别(维度ID)" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态" />
        <el-table-column v-if="columns.visible('processInstanceId')" prop="processInstanceId" label="审核流程ID" />
        <el-table-column v-if="columns.visible('retention')" prop="retention" label="结果保留期限（1,Y）" />
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建用户" />
        <el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建时间" />
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改用户" />
        <el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="修改时间" />
        <el-table-column v-permission="['admin','indIndicatorManual:edit','indIndicatorManual:del']" label="操作" width="150px" align="center">
          <template slot-scope="scope">
            <udOperation
              :data="scope.row"
              :permission="permission"
            />
          </template>
        </el-table-column>
      </el-table>
      <!--分页组件-->
      <pagination />
    </div>
  </div>
</template>

<script>
import crudIndIndicatorManual from '@/api/indicators/indIndicatorManual'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '指标补录', url: crudIndIndicatorManual.url, sort: 'id,desc', crudMethod: { ...crudIndIndicatorManual.method }})
const defaultForm = { id: null, ieCode: null, ieName: null, ieType: null, ieValue: null, iePlanValue: null, periodCode: null, objectCode: null, objectType: null, status: null, processInstanceId: null, retention: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null }
export default {
  name: 'IndIndicatorManual',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IE_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'indIndicatorManual:add'],
        edit: ['admin', 'indIndicatorManual:edit'],
        del: ['admin', 'indIndicatorManual:del']
      },
      rules: {
        id: [
          { required: true, message: '补录ID不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    }
  }
}
</script>

<style scoped>

</style>
