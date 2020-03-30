<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.value" clearable placeholder="输入搜索内容" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-select v-model="query.type" clearable placeholder="类型" class="filter-item" style="width: 130px">
          <el-option v-for="item in queryTypeOptions" :key="item.key" :label="item.display_name" :value="item.key" />
        </el-select>
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="500px">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
          <el-form-item label="机构号" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="机构名称" prop="orgName">
            <el-input v-model="form.orgName" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="机构级别" prop="orgLevel">
            <el-input v-model="form.orgLevel" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="机构类型" prop="orgType">
            <el-select v-model="form.orgType" filterable placeholder="请选择">
              <el-option
                v-for="item in dict.dept_type"
                :key="item.id"
                :label="item.label"
                :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="存款总额" prop="orgTotal">
            <el-input v-model="form.orgTotal" style="width: 370px;" />
          </el-form-item>
          <el-form-item label="成立日期" prop="createDate">
            <el-date-picker v-model="form.createDate" type="datetime" style="width: 370px;" />
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="机构号" />
        <el-table-column v-if="columns.visible('orgName')" prop="orgName" label="机构名称" />
        <el-table-column v-if="columns.visible('orgLevel')" prop="orgLevel" label="机构级别" />
        <el-table-column v-if="columns.visible('orgType')" prop="orgType" label="机构类型">
          <template slot-scope="scope">
            {{ dict.label.dept_type[scope.row.orgType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('orgTotal')" prop="orgTotal" label="存款总额" />
        <el-table-column v-if="columns.visible('createDate')" prop="createDate" label="成立日期">
        	<template slot-scope="scope">
            <span>{{ parseTime(scope.row.createDate) }}</span>
        	</template>
        </el-table-column>
        <el-table-column v-permission="['admin','genTestMybatis:edit','genTestMybatis:del']" label="操作" width="150px" align="center">
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
import crudGenTestMybatis from '@/api/testMybatis/genTestMybatis'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: 'genTestMybatis', url: 'api/genTestMybatis', sort: 'id,desc', crudMethod: { ...crudGenTestMybatis }})
const defaultForm = { id: null, orgName: null, orgLevel: null, orgType: null, orgTotal: null, createDate: null }
export default {
  name: 'GenTestMybatis',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['dept_type'],
  data() {
    return {
      permission: {
        add: ['admin', 'genTestMybatis:add'],
        edit: ['admin', 'genTestMybatis:edit'],
        del: ['admin', 'genTestMybatis:del']
      },
      rules: {
        id: [
          { required: true, message: '机构号不能为空', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '机构名称不能为空', trigger: 'blur' }
        ],
        orgLevel: [
          { required: true, message: '机构级别不能为空', trigger: 'blur' }
        ],
        orgType: [
          { required: true, message: '机构类型不能为空', trigger: 'blur' }
        ],
        orgTotal: [
          { required: true, message: '存款总额不能为空', trigger: 'blur' }
        ],
        createDate: [
          { required: true, message: '成立日期不能为空', trigger: 'blur' }
        ]
      },
      queryTypeOptions: [
        { key: 'id', display_name: '机构号' },
        { key: 'orgName', display_name: '机构名称' }
      ]
    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      const query = this.query
      if (query.type && query.value) {
        this.crud.params[query.type] = query.value
      }
      return true
    }
  }
}
</script>

<style scoped>

</style>
