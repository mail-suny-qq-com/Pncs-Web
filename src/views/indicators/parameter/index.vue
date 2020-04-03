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
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.parmCode" clearable size="small" placeholder="参数编号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.parmName" clearable size="small" placeholder="参数名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.status" clearable size="small" placeholder="状态" class="filter-item" style="width: 90px" @change="crud.toQuery">
          <el-option v-for="item in dict.STATUS" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="参数类型">
            <el-input v-model="form.categoryId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数编号">
            <el-input v-model="form.parmCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数名称">
            <el-input v-model="form.parmName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数值类型">
            <el-select v-model="form.parmType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.PARM_TYPE"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="参数值">
            <el-input v-model="form.parmValue" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="参数描述">
            <el-input v-model="form.parmDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="状态(1-启用，0-停用)">
            <el-select v-model="form.status" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.STATUS"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <!--<el-form-item label="创建人">
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="参数ID" />
        <el-table-column v-if="columns.visible('categoryId')" prop="categoryId" label="参数类型" />
        <el-table-column v-if="columns.visible('parmCode')" prop="parmCode" label="参数编号" />
        <el-table-column v-if="columns.visible('parmName')" prop="parmName" label="参数名称" />
        <el-table-column v-if="columns.visible('parmType')" prop="parmType" label="参数值类型">
          <template slot-scope="scope">
            {{ dict.label.PARM_TYPE[scope.row.parmType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('parmValue')" prop="parmValue" label="参数值" />
        <el-table-column v-if="columns.visible('parmDesc')" prop="parmDesc" label="参数描述" />
        <el-table-column v-if="columns.visible('status')" prop="status" label="状态(1-启用，0-停用)">
          <template slot-scope="scope">
            {{ dict.label.STATUS[scope.row.status] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <!--<el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />-->
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" width="140" label="创建日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" />
        <!--<el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />-->
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" width="140" label="修改日期">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-permission="['admin','indParameter:edit','indParameter:del']" label="操作" width="150px" align="center">
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
import crudIndParameter from '@/api/indicators/indParameter'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import category from '../category/category'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '参数', url: crudIndParameter.url, sort: 'id,desc', crudMethod: { ...crudIndParameter.method }})
const defaultForm = { id: null, categoryId: null, parmCode: null, parmName: null, parmType: null, parmValue: null, parmDesc: null, status: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null }
export default {
  name: 'IndParameter',
  components: { pagination, crudOperation, rrOperation, udOperation,category },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['STATUS','PARM_TYPE'],
  data() {
    return {
      permission: {
        add: ['admin', 'indParameter:add'],
        edit: ['admin', 'indParameter:edit'],
        del: ['admin', 'indParameter:del']
      },
      rules: {
        id: [
          { required: true, message: '参数ID不能为空', trigger: 'blur' }
        ]
      }    }
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
