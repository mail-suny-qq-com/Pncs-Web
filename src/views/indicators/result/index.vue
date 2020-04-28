<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">

      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.ieCode" clearable size="small" placeholder="指标编号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.ieName" clearable size="small" placeholder="指标名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.ieType" clearable size="small" placeholder="指标类型" class="filter-item" style="width: 120px" @change="crud.toQuery">
          <el-option v-for="item in dict.IE_TYPE" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 120px" @change="crud.toQuery">
          <el-option v-for="item in dict.IE_STATUS" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="90px">
          <!--<el-form-item label="结果ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>-->
          <el-form-item label="指标ID" prop="ieId">
            <el-input v-model="form.ieId" style="width: 370px;" />
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
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="指标规则(备查)">
            <el-input v-model="form.ieRule" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标计算结果">
            <el-input v-model="form.ieValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="指标手工调整结果">
            <el-input v-model="form.ieAdjustValue" style="width: 370px;" />
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
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.IE_STATUS"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核流程ID">
            <el-input v-model="form.processInstanceId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="结果保留期限（1,Y）">
            <!--<el-input v-model="form.retention" style="width: 370px;" />-->
            <el-select v-model="form.retention" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.RETENTION"
                :key="item.id"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <!--<el-form-item label="创建用户">
            <el-input v-model="form.crtUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建机构">
            <el-input v-model="form.crtOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker v-model="form.crtDate" type="datetime" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改用户">
            <el-input v-model="form.updUserCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改机构">
            <el-input v-model="form.updOrgCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="修改时间">
            <el-date-picker v-model="form.updDate" type="datetime" style="width: 370px;" />
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="结果ID" />
        <el-table-column v-if="columns.visible('ieId')" prop="ieId" label="指标ID" />
        <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编号" />
        <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称" />
        <el-table-column v-if="columns.visible('ieType')" prop="ieType" label="指标类型">
          <template slot-scope="scope">
            {{ dict.label.IE_TYPE[scope.row.ieType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('ieRule')" prop="ieRule" label="指标规则(备查)" />
        <el-table-column v-if="columns.visible('ieValue')" prop="ieValue" label="指标计算结果" />
        <el-table-column v-if="columns.visible('ieAdjustValue')" prop="ieAdjustValue" label="指标手工调整结果" />
        <el-table-column v-if="columns.visible('iePlanValue')" prop="iePlanValue" label="指标计划值" />
        <el-table-column v-if="columns.visible('periodCode')" prop="periodCode" label="计算周期" />
        <el-table-column v-if="columns.visible('objectCode')" prop="objectCode" label="对象编号" />
        <el-table-column v-if="columns.visible('objectType')" prop="objectType" label="对象类别(维度ID)" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态">
          <template slot-scope="scope">
            {{ dict.label.IE_STATUS[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('processInstanceId')" prop="processInstanceId" label="审核流程ID" />
        <el-table-column v-if="columns.visible('retention')" prop="retention" label="结果保留期限（1,Y）">
          <template slot-scope="scope">
            {{ dict.label.RETENTION[scope.row.retention] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建用户" />
        <el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" width="140" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtDate) }}</span>
          </template>
        </el-table-column>

        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改用户" />
        <el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" width="140" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','indIndicatorResult:edit','indIndicatorResult:del']" label="操作" width="150px" align="center">
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
import crudIndIndicatorResult from '@/api/indicators/indIndicatorResult'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '指标计算结果表', url: crudIndIndicatorResult.url, sort: 'id,desc', crudMethod: { ...crudIndIndicatorResult.crud }})
const defaultForm = { id: null, ieId: null, ieCode: null, ieName: null, ieType: null, ieRule: null, ieValue: null, ieAdjustValue: null, iePlanValue: null, periodCode: null, objectCode: null, objectType: null, status: null, processInstanceId: null, retention: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null }
export default {
  name: 'IndIndicatorResult',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['RETENTION', 'IE_TYPE', 'IE_STATUS'],
  data() {
    return {
      permission: {
        add: ['admin', 'indIndicatorResult:add'],
        edit: ['admin', 'indIndicatorResult:edit'],
        del: ['admin', 'indIndicatorResult:del']
      },
      rules: {
        ieId: [
          { required: true, message: '指标ID不能为空', trigger: 'blur' }
        ]
      }}
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
