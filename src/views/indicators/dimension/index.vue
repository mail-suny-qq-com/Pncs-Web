<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="维度ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维度编号">
            <el-input v-model="form.dimCode" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="数据源ID(预留)">
            <el-input v-model="form.datasourceId" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维度名称">
            <el-input v-model="form.dimName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维表表名称">
            <el-input v-model="form.tableName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维度显示字段(可多字段逗号隔开)">
            <el-input v-model="form.nameColumn" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="维度显示字段描述(可多字段逗号隔开)">
            <el-input v-model="form.nameColumnDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="代码字段(用户管理指标对象)">
            <el-input v-model="form.codeColumn" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="代码字段描述">
            <el-input v-model="form.codeColumnDesc" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="父ID(预留)">
            <el-input v-model="form.pid" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="级别(预留)">
            <el-input v-model="form.level" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="别名">
            <el-input v-model="form.alias" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="主键标志">
            <el-input v-model="form.pkFlag" style="width: 370px;" />
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
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('id')" prop="id" label="维度ID" />
        <el-table-column v-if="columns.visible('dimCode')" prop="dimCode" label="维度编号" />
        <el-table-column v-if="columns.visible('datasourceId')" prop="datasourceId" label="数据源ID(预留)" />
        <el-table-column v-if="columns.visible('dimName')" prop="dimName" label="维度名称" />
        <el-table-column v-if="columns.visible('tableName')" prop="tableName" label="维表表名称" />
        <el-table-column v-if="columns.visible('nameColumn')" prop="nameColumn" label="维度显示字段(可多字段逗号隔开)" />
        <el-table-column v-if="columns.visible('nameColumnDesc')" prop="nameColumnDesc" label="维度显示字段描述(可多字段逗号隔开)" />
        <el-table-column v-if="columns.visible('codeColumn')" prop="codeColumn" label="代码字段(用户管理指标对象)" />
        <el-table-column v-if="columns.visible('codeColumnDesc')" prop="codeColumnDesc" label="代码字段描述" />
        <el-table-column v-if="columns.visible('pid')" prop="pid" label="父ID(预留)" />
        <el-table-column v-if="columns.visible('level')" prop="level" label="级别(预留)" />
        <el-table-column v-if="columns.visible('alias')" prop="alias" label="别名" />
        <el-table-column v-if="columns.visible('pkFlag')" prop="pkFlag" label="主键标志" />
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建人" />
        <el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" label="创建日期" />
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改人" />
        <el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" label="修改日期" />
        <el-table-column v-permission="['admin','indDimension:edit','indDimension:del']" label="操作" width="150px" align="center">
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
import crudIndDimension from '@/api/indicators/indDimension'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '维度管理', url: crudIndDimension.url, sort: 'id,desc', crudMethod: { ...crudIndDimension.method }})
const defaultForm = { id: null, dimCode: null, datasourceId: null, dimName: null, tableName: null, nameColumn: null, nameColumnDesc: null, codeColumn: null, codeColumnDesc: null, pid: null, level: null, alias: null, pkFlag: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null }
export default {
  name: 'IndDimension',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      permission: {
        add: ['admin', 'indDimension:add'],
        edit: ['admin', 'indDimension:edit'],
        del: ['admin', 'indDimension:del']
      },
      rules: {
        id: [
          { required: true, message: '维度ID不能为空', trigger: 'blur' }
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
