<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.dimCode" clearable size="small" placeholder="维度编号" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-input v-model="query.dimName" clearable size="small" placeholder="维度名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <rrOperation :crud="crud" />
      </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="60%">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <!--<el-form-item label="维度ID" prop="id">
            <el-input v-model="form.id" style="width: 370px;" />
          </el-form-item>-->
          <el-row>
            <el-col :span="12">
            <el-form-item label="维度编号">
              <el-input v-model="form.dimCode" style="width: 250px;" placeholder="系统自动生成..." :disabled="true" />
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="数据源ID">
              <!--<el-input v-model="form.datasourceId" style="width: 250px;" />-->
              <el-select v-model="form.datasourceId" filterable placeholder="请选择" style="width: 250px;" @change="getTableByDB">
                <el-option
                  v-for="item in tableDB"
                  :key="item.id"
                  :label="item.datasourceName"
                  :value="item.id" />
              </el-select>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
            <el-form-item label="维度名称" prop="dimName">
              <el-input v-model="form.dimName" style="width: 250px;" />
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="维表表名称" prop="tableName">
              <!--<el-input v-model="form.tableName" style="width: 250px;" />-->
              <el-select v-model="form.tableName" filterable placeholder="请选择" style="width: 250px;" @change="getTableInfo">
                <el-option
                  v-for="item in tableData"
                  :key="item.tableName"
                  :label="item.tableName"
                  :value="item.tableName" />
              </el-select>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
            <el-form-item label="维度显示字段" prop="nameColumn">
              <!--<el-input v-model="form.nameColumn" style="width: 250px;" />-->
              <el-select v-model="form.nameColumn" filterable placeholder="请选择" style="width: 680px;" @change="setColumnDesc">
                <el-option
                  v-for="item in tableInfo"
                  :key="item.columnName"
                  :label="item.columnName"
                  :value="item.columnName" />
              </el-select>
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
            <el-form-item label="维度显示字段描述" prop="nameColumnDesc">
              <el-input v-model="form.nameColumnDesc" style="width: 250px;" disabled="disabled"/>
              <!--<el-select v-model="form.nameColumnDesc" filterable placeholder="请选择" style="width: 680px;">
                <el-option
                  v-for="item in tableInfo"
                  :key="item.remark"
                  :label="item.remark"
                  :value="item.remark" />
              </el-select>-->
            </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
            <el-form-item label="代码字段">
              <el-input v-model="form.codeColumn" style="width: 250px;" />
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="代码字段描述">
              <el-input v-model="form.codeColumnDesc" style="width: 250px;" />
            </el-form-item>
            </el-col>
          </el-row>
          <!--<el-row>
            <el-col :span="12">
            <el-form-item label="父ID(预留)">
              <el-input v-model="form.pid" style="width: 250px;" />
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="级别(预留)">
              <el-input v-model="form.level" style="width: 250px;" />
            </el-form-item>
            </el-col>
          </el-row>-->
          <el-row>
            <el-col :span="12">
            <el-form-item label="别名">
              <el-input v-model="form.alias" style="width: 250px;" />
            </el-form-item>
            </el-col>
            <el-col :span="12">
            <el-form-item label="主键标志">
              <el-input v-model="form.pkFlag" style="width: 250px;" />
            </el-form-item>
            </el-col>
          </el-row>
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
        <el-table-column v-if="columns.visible('id')" prop="id" label="维度ID" className="_default_hidden"/>
        <el-table-column v-if="columns.visible('dimCode')" prop="dimCode" label="维度编号" />
        <el-table-column v-if="columns.visible('datasourceId')" prop="datasourceId" label="数据源ID" :formatter="formatId" />
        <el-table-column v-if="columns.visible('dimName')" prop="dimName" label="维度名称" />
        <el-table-column v-if="columns.visible('tableName')" prop="tableName" label="维表表名称" width="120" />
        <el-table-column v-if="columns.visible('nameColumn')" prop="nameColumn" label="维度显示字段" width="140" />
        <el-table-column v-if="columns.visible('nameColumnDesc')" prop="nameColumnDesc" label="维度显示字段描述" width="140" />
        <el-table-column v-if="columns.visible('codeColumn')" prop="codeColumn" label="代码字段" />
        <el-table-column v-if="columns.visible('codeColumnDesc')" prop="codeColumnDesc" label="代码字段描述" width="100" />
        <!--<el-table-column v-if="columns.visible('pid')" prop="pid" label="父ID(预留)" />
        <el-table-column v-if="columns.visible('level')" prop="level" label="级别(预留)" />-->
        <el-table-column v-if="columns.visible('alias')" prop="alias" label="别名" />
        <el-table-column v-if="columns.visible('pkFlag')" prop="pkFlag" label="主键标志" />
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
import { getAllSource,getTables,getColumns } from '@/api/indicators/indIndicatorInfo'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '维度管理', url: crudIndDimension.url, sort: 'id,desc', crudMethod: { ...crudIndDimension.method }})
const defaultForm = { id: null, dimCode: null, datasourceId: null, dimName: null, tableName: null, nameColumn: null, nameColumnDesc: null, codeColumn: null, codeColumnDesc: null, pid: null, level: null, alias: null, pkFlag: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null }
export default {
  name: 'IndDimension',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  data() {
    return {
      table: {
            columns: {
              id: 'hidden'
            }
          },
      tableData: [],
      tableInfo: [],
      tableDB: [],
      selectData: [],
      permission: {
        add: ['admin', 'indDimension:add'],
        edit: ['admin', 'indDimension:edit'],
        del: ['admin', 'indDimension:del']
      },
      rules: {
        dimName: [
          { required: true, message: '维度名称不能为空', trigger: 'blur' }
        ],
        tableName: [
          { required: true, message: '维表表名称不能为空', trigger: 'blur' }
        ],
        nameColumn: [
          { required: true, message: '维度显示字段不能为空', trigger: 'blur' }
        ],
        nameColumnDesc: [
          { required: true, message: '维度显示字段描述不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.$nextTick(() => {
      getAllSource().then(data => {
      //console.log("=====getAllSource====>>>>",data)
        this.tableDB = data.data
      })
    })
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    [CRUD.HOOK.beforeToAdd]() {
      this.tableInfo = null
    },
    [CRUD.HOOK.beforeToEdit](){
         //const temp1 = this.form.nameColumn
         //const temp2 = this.form.nameColumnDesc
         //if( (temp1 != null && temp1 != "") || temp1.indexOf(",") != -1){
          //this.form.nameColumn = temp1.split(',')
         //}
         //if( (temp2 != null && temp2 != "")  || temp2.indexOf(",") != -1){
          //this.form.nameColumnDesc = temp2.split(',')
         //}
         //this.form.nameColumn = this.form.nameColumn.split(',')
         //this.form.nameColumnDesc = this.form.nameColumnDesc.split(',')
         //getTableColumns(this.form.tableName).then(data => {
           //this.tableInfo = data.content
         //})
         const param = {
           'id': this.form.datasourceId,
           'tablename': this.form.tableName
         }
         getTables(param).then(data => {
           //console.log("====getTables====>>>>>",data)
           if(data.code === 0){
             this.tableData = data.data
           }else{
             alert("数据源连接错误");
           }
         })
         getColumns(param).then(data => {
           //console.log("========getColumns====>>>>",data)
           if(data.code === 0){
             this.tableInfo = data.data
           }else{
             alert("数据源连接错误");
           }
         })
    },
    //[CRUD.HOOK.beforeSubmit](){
         //this.form.nameColumn = String(this.form.nameColumn)
         //this.form.nameColumnDesc = String(this.form.nameColumnDesc)
    //},
    getTableInfo() {
      this.form.nameColumn = null
      this.form.nameColumnDesc = null
      const param = {
        'id': this.form.datasourceId,
        'tablename': this.form.tableName
      }
      getColumns(param).then(data => {
        //console.log("========getColumns====>>>>",data)
        if(data.code === 0){
          this.tableInfo = data.data
        }else{
          alert("数据源连接错误");
        }
      })
    },
    setColumnDesc() {
      this.tableInfo.forEach(row => {
        if(this.form.nameColumn == row.columnName){
          this.form.nameColumnDesc = row.remark
        }
      });
    },
    getTableByDB() {
      this.form.nameColumn = null
      this.form.nameColumnDesc = null
      this.form.tableName = null
      const param = {
        'id': this.form.datasourceId
      }
      getTables(param).then(data => {
        //console.log("====getTables====>>>>>",data)
        if(data.code === 0){
          this.tableData = data.data
        }else{
          alert("数据源连接错误");
        }
      })
    },
    formatId(row){
        let name = ""
        this.tableDB.forEach(row1 => {
          if(row1.id == row.datasourceId){
            name = row1.datasourceName
          }
        })
        return name
    }
  }
}
</script>

<style scoped>

</style>
