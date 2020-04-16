<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
    <div v-if="crud.props.searchToggle">
      <!-- 搜索 -->
      <el-input v-model="query.datasourceName" clearable size="small" placeholder="数据源名称" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
      <el-select v-model="query.datasourceType" clearable size="small" placeholder="数据库类型" class="filter-item" style="width: 90px" @change="crud.toQuery">
        <el-option v-for="item in dict.DATASOURCE_TYPE" :key="item.id" :label="item.label" :value="item.value" />
      </el-select>
      <rrOperation :crud="crud" />
    </div>
      <!--如果想在工具栏加入更多按钮，可以使用插槽方式， slot = 'left' or 'right'-->
      <crudOperation :permission="permission" />
      <!--表单组件-->
      <el-dialog :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.title" width="60%">
        <el-form ref="form" :model="form" :rules="rules" size="small" label-width="100px">
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据源名称" prop="datasourceName">
                <el-input v-model="form.datasourceName" style="width: 250px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据库类型" prop="datasourceType">
                <el-select v-model="form.datasourceType" filterable placeholder="请选择" style="width: 250px;">
                  <el-option
                    v-for="item in dict.DATASOURCE_TYPE"
                    :key="item.id"
                    :label="item.label"
                    :value="item.value" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据库SCHEMA" prop="datasourceSchema">
                <el-input v-model="form.datasourceSchema" style="width: 250px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="数据库驱动" prop="datasourceDriver">
                <el-input v-model="form.datasourceDriver" style="width: 250px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="连接URL" prop="datasourceUrl">
                <el-input v-model="form.datasourceUrl" style="width: 250px;" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户名" prop="datasourceUser">
                <el-input v-model="form.datasourceUser" style="width: 250px;" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="密码" prop="datasourcePassword">
                <el-input :type="passw" v-model="form.datasourcePassword" style="width: 250px;">
                  <i slot="suffix" :class="icon" @click="showPass"></i>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="描述">
                <el-input v-model="form.datasourceDesc" style="width: 250px;" />
              </el-form-item>
            </el-col>
           </el-row>
          <!--<el-form-item label="创建用户">
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
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button :loading="loading" icon="el-icon-loading"size="mini" style="float: left; padding: 6px 9px" type="primary" @click="doTest">测试</el-button>
          <el-button type="text" @click="crud.cancelCU">取消</el-button>
          <el-button :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
        </div>
      </el-dialog>
      <!--表格渲染-->
      <el-table ref="table" v-loading="crud.loading" :data="crud.data" size="small" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
        <el-table-column type="selection" width="55" />
        <el-table-column v-if="columns.visible('datasourceName')" prop="datasourceName" label="数据源名称" />
        <el-table-column v-if="columns.visible('datasourceType')" prop="datasourceType" label="数据库类型">
          <template slot-scope="scope">
            {{ dict.label.DATASOURCE_TYPE[scope.row.datasourceType] }}
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('datasourceSchema')" prop="datasourceSchema" label="数据库SCHEMA" width="120" />
        <el-table-column v-if="columns.visible('datasourceDriver')" prop="datasourceDriver" label="数据库驱动" width="140" />
        <el-table-column v-if="columns.visible('datasourceUrl')" prop="datasourceUrl" label="连接URL" width="200" />
        <el-table-column v-if="columns.visible('datasourceUser')" prop="datasourceUser" label="用户名" />
        <!--<el-table-column v-if="columns.visible('datasourcePassword')" prop="datasourcePassword" label="密码" />-->
        <el-table-column v-if="columns.visible('datasourceDesc')" prop="datasourceDesc" label="描述" />
        <el-table-column v-if="columns.visible('crtUserCode')" prop="crtUserCode" label="创建用户" />
        <!--<el-table-column v-if="columns.visible('crtOrgCode')" prop="crtOrgCode" label="创建机构" />-->
        <el-table-column v-if="columns.visible('crtDate')" prop="crtDate" width="140" label="创建时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.crtDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('updUserCode')" prop="updUserCode" label="修改用户" />
        <!--<el-table-column v-if="columns.visible('updOrgCode')" prop="updOrgCode" label="修改机构" />-->
        <el-table-column v-if="columns.visible('updDate')" prop="updDate" width="140" label="修改时间">
          <template slot-scope="scope">
            <span>{{ parseTime(scope.row.updDate) }}</span>
          </template>
        </el-table-column>
        <el-table-column v-if="columns.visible('id')" prop="id" label="数据源ID" className="_default_hidden" />
        <el-table-column v-permission="['admin','indDatasource:edit','indDatasource:del']" label="操作" width="150px" align="center">
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
import crudIndDatasource from '@/api/indicators/indDatasource'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import udOperation from '@crud/UD.operation'
import pagination from '@crud/Pagination'
import { test } from '@/api/indicators/indDatasource'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '数据源', url: crudIndDatasource.url, sort: 'id,desc', crudMethod: { ...crudIndDatasource.method }})
const defaultForm = { datasourceName: null, datasourceType: null, datasourceSchema: null, datasourceDriver: null, datasourceUrl: null, datasourceUser: null, datasourcePassword: null, datasourceDesc: null, crtUserCode: null, crtOrgCode: null, crtDate: null, updUserCode: null, updOrgCode: null, updDate: null, id: null }
export default {
  name: 'IndDatasource',
  components: { pagination, crudOperation, rrOperation, udOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  dicts: ['DATASOURCE_TYPE'],
  data() {
    return {
      table: {
        columns: {
          id: 'hidden'
        }
      },
      passw:"password",
      icon:"el-input__icon el-icon-view",
      permission: {
        add: ['admin', 'indDatasource:add'],
        edit: ['admin', 'indDatasource:edit'],
        del: ['admin', 'indDatasource:del']
      },
      rules: {
        datasourceName: [
          { required: true, message: '数据源名称不能为空', trigger: 'blur' }
        ],
        datasourceType: [
          { required: true, message: '数据库类型不能为空', trigger: 'blur' }
        ],
        datasourceSchema: [
          { required: true, message: '数据库SCHEMA不能为空', trigger: 'blur' }
        ],
        datasourceDriver: [
          { required: true, message: '数据库驱动不能为空', trigger: 'blur' }
        ],
        datasourceUrl: [
          { required: true, message: '连接URL不能为空', trigger: 'blur' }
        ],
        datasourceUser: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        datasourcePassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }    }
  },
  methods: {
    // 获取数据前设置好接口地址
    [CRUD.HOOK.beforeRefresh]() {
      return true
    },
    //密码的隐藏和显示
    showPass(){
　　　　　　　　　　//点击图标是密码隐藏或显示
       if( this.passw=="text"){
           this.passw="password";
           //更换图标
           //this.icon="el-input__icon el-icon-view";
       }else {
           this.passw="text";
           //this.icon="el-input__icon el-icon-view";
       };
    },
    doTest() {
      this.$refs["form"].validate((valid) => {
        if (!valid){ //rules规则校验不通过
          return
        }else{
          test(this.form).then(data => {
            //console.log(data)
            if(data.result == "S"){
              alert("连接成功");
            }else{
              alert("连接失败，请检查数据源各项参数");
            }
          })
        }
      })
    }

  }
}
</script>

<style scoped>

</style>
