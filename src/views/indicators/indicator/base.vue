<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--侧边分类数据-->
      <el-col :xs="9" :sm="6" :md="4" :lg="4" :xl="4">
        <category type="base" @node-click="handleCategoryClick"/>
      </el-col>
      <!--用户数据-->
      <el-col :xs="15" :sm="18" :md="20" :lg="20" :xl="20">
        <!--工具栏-->
        <div class="head-container">
          <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
          <crudOperation :permission="permission" />
          <!--表单组件-->
          <el-dialog
            :close-on-click-modal="false"
            :before-close="crud.cancelCU"
            :visible.sync="crud.status.cu > 0"
            :title="crud.status.title"
            width="500px"
          >
            <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
              <el-form-item label="指标ID" prop="id">
                <el-input v-model="form.id" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="指标编号" prop="ieCode">
                <el-input v-model="form.ieCode" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="指标名称">
                <el-input v-model="form.ieName" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="指标分类ID(树状)">
                <el-input v-model="form.categoryId" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="指标类别(1-财务类，2-经营类...)">
                <el-select v-model="form.ieProp" filterable placeholder="请选择">
                  <el-option
                    v-for="item in dict.IE_PROP"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="指标类型(0-手工指标，1-基础指标，2-衍生指标，3-定性指标)">
                <el-select v-model="form.ieType" filterable placeholder="请选择">
                  <el-option
                    v-for="item in dict.IE_TYPE"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="指标描述">
                <el-input v-model="form.ieDesc" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="指标业务规则">
                <el-input v-model="form.ieRule" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="默认值">
                <el-input v-model="form.ieDefaultValue" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="取值方式( 衍生指标时：1-四则运算，2-复杂SQL，3-限制，4-EXCEL公式)">
                <el-select v-model="form.ieMethod" filterable placeholder="请选择">
                  <el-option
                    v-for="item in dict.IE_METHOD"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="计算频度(D-天，M-月，Q-季度，Y-年)">
                <el-select v-model="form.calcFreq" filterable placeholder="请选择">
                  <el-option
                    v-for="item in dict.CALC_FREQ"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="指标状态（0-已创建，1-已提交，2-已审批）">
                <el-select v-model="form.status" filterable placeholder="请选择">
                  <el-option
                    v-for="item in dict.IE_STATUS"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="指标单位()">
                <el-select v-model="form.ieDataUnit" filterable placeholder="请选择">
                  <el-option
                    v-for="item in dict.IE_DATA_UNIT"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="指标层级(根据依赖关系确定层级，基础指标为0)">
                <el-input v-model="form.ieLevel" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="生效日期">
                <el-input v-model="form.startDate" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="失效日期">
                <el-input v-model="form.endDate" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="结果保留期限（1,Y）">
                <el-select v-model="form.retention" filterable placeholder="请选择">
                  <el-option
                    v-for="item in dict.RETENTION"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="审核流程ID">
                <el-input v-model="form.processInstanceId" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="管理部门(解释部门)">
                <el-input v-model="form.manageDept" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="创建人">
                <el-input v-model="form.crtUserCode" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="创建机构">
                <el-input v-model="form.crtOrgCode" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="创建日期">
                <el-input v-model="form.crtDate" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="修改人">
                <el-input v-model="form.updUserCode" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="修改机构">
                <el-input v-model="form.updOrgCode" style="width: 370px;" />
              </el-form-item>
              <el-form-item label="修改日期">
                <el-input v-model="form.updDate" style="width: 370px;" />
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="text" @click="crud.cancelCU">取消</el-button>
              <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
            </div>
          </el-dialog>
          <!--表格渲染-->
          <el-table
            ref="table"
            v-loading="crud.loading"
            :data="crud.data"
            size="small"
            style="width: 100%;"
            @selection-change="crud.selectionChangeHandler"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column v-if="columns.visible('id')" prop="id" label="指标ID" />
            <el-table-column v-if="columns.visible('ieCode')" prop="ieCode" label="指标编号" />
            <el-table-column v-if="columns.visible('ieName')" prop="ieName" label="指标名称" />
            <el-table-column v-if="columns.visible('ieProp')" prop="ieProp" label="指标类别">
              <template slot-scope="scope">
                {{ dict.label.IE_PROP[scope.row.ieProp] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieType')" prop="ieType" label="指标类型">
              <template slot-scope="scope">
                {{ dict.label.IE_TYPE[scope.row.ieType] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieDesc')" prop="ieDesc" label="指标描述" />
            <el-table-column v-if="columns.visible('ieRule')" prop="ieRule" label="指标业务规则" />
            <el-table-column v-if="columns.visible('ieDefaultValue')" prop="ieDefaultValue" label="默认值" />
            <el-table-column
              v-if="columns.visible('ieMethod')"
              prop="ieMethod"
              label="取值方式"
            >
              <template slot-scope="scope">
                {{ dict.label.IE_METHOD[scope.row.ieMethod] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('calcFreq')" prop="calcFreq" label="计算频度">
              <template slot-scope="scope">
                {{ dict.label.CALC_FREQ[scope.row.calcFreq] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('status')" prop="status" label="指标状态">
              <template slot-scope="scope">
                {{ dict.label.IE_STATUS[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('ieDataUnit')" prop="ieDataUnit" label="指标单位()">
              <template slot-scope="scope">
                {{ dict.label.IE_DATA_UNIT[scope.row.ieDataUnit] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('startDate')" prop="startDate" label="生效日期" />
            <el-table-column v-if="columns.visible('endDate')" prop="endDate" label="失效日期" />
            <el-table-column v-if="columns.visible('retention')" prop="retention" label="结果保留期限（1,Y）">
              <template slot-scope="scope">
                {{ dict.label.RETENTION[scope.row.retention] }}
              </template>
            </el-table-column>
            <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
            <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建日期" />
            <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" />
            <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="修改日期" />
            <el-table-column
              v-permission="['admin','indIndicatorInfo:edit','indIndicatorInfo:del']"
              label="操作"
              width="150px"
              align="center"
            >
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
import crudIndIndicatorInfo from '@/api/indicators/indIndicatorInfo'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../category/category'
// crud交由presenter持有
const defaultCrud = CRUD({
  title: '指标基本信息',
  url: crudIndIndicatorInfo.url,
  sort: 'id,desc',
  crudMethod: { ...crudIndIndicatorInfo.method }
})
const defaultForm = {
  id: null,
  ieCode: null,
  ieName: null,
  categoryId: null,
  ieProp: null,
  ieType: null,
  ieDesc: null,
  ieRule: null,
  ieDefaultValue: null,
  ieMethod: null,
  calcFreq: null,
  status: null,
  ieDataUnit: null,
  ieLevel: null,
  startDate: null,
  endDate: null,
  retention: null,
  processInstanceId: null,
  manageDept: null,
  crtUserCode: null,
  crtOrgCode: null,
  crtDate: null,
  updUserCode: null,
  updOrgCode: null,
  updDate: null
}
export default {
  name: 'IndIndicatorInfo',
  components: { pagination, crudOperation, rrOperation, udOperation, category },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['IE_PROP', 'IE_TYPE', 'IE_METHOD', 'CALC_FREQ', 'IE_STATUS', 'IE_DATA_UNIT', 'RETENTION'],
  data() {
    return {
      permission: {
        add: ['admin', 'indIndicatorInfo:add'],
        edit: ['admin', 'indIndicatorInfo:edit'],
        del: ['admin', 'indIndicatorInfo:del']
      },
      rules: {
        id: [
          { required: true, message: '指标ID不能为空', trigger: 'blur' }
        ],
        ieCode: [
          { required: true, message: '指标编号不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    handleCategoryClick(data){
      console.log("========handleCategoryClick====>",data)
    }
  }
}
</script>

<style scoped>

</style>
