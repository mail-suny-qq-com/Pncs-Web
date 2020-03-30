<template>
  <el-row :gutter="20" style="height:100%">
    <div class="content" style="height:590px !important">
      <el-col :span="16">
        <el-tabs v-model="authActiveName" @tab-click="authHandleClick">
          <el-tab-pane label="机构权限管理" name="dept">
            <el-input v-model="deptTab.query.name" size="mini" clearable placeholder="输入机构名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQueryDept"/>
            <el-input v-model="deptTab.query.id" size="mini" clearable placeholder="输入机构编号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQueryDept"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQueryDept">搜索</el-button>
            
            <el-table v-loading="deptTab.loading" :data="deptTab.data" :expand-row-keys="['1']" row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border size="mini" height="430"              
              @current-change="onSelectDept"
              highlight-current-row style="width: 100%;margin-top: 10px;">
               <el-table-column prop="name" label="机构名称" />    
               <el-table-column prop="id" label="机构编号" width="200px" />    
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="角色权限管理" name="role">
            <el-input v-model="roleTab.query.blurry" size="mini" clearable placeholder="输入名称或描述搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQueryRole"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQueryRole">搜索</el-button>
            <el-table v-loading="roleTab.loading" :data="roleTab.data" row-key="id" border size="mini" height="398"
              @current-change="onSelectRole"
              highlight-current-row style="width: 100%;margin-top: 10px;">
               <el-table-column :show-overflow-tooltip="true" prop="name" label="角色名称" width="150px"/>    
               <el-table-column prop="dataScope" label="数据权限" width="150px"/>    
               <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述"/>
            </el-table>
            <el-pagination
              :total="roleTab.total"
              :current-page="roleTab.page + 1"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="roleSizeChange"
              @current-change="rolePageChange"/>
          </el-tab-pane>
          <el-tab-pane label="用户权限管理" name="user">
            <el-input v-model="userTab.query.blurry" size="mini" clearable placeholder="输入名称或邮箱搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQueryUser"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQueryUser">搜索</el-button>
            <el-table v-loading="userTab.loading" :data="userTab.data" row-key="id" border size="mini" height="398"
              @current-change="onSelectUser"
              highlight-current-row style="width: 100%;margin-top: 10px;">

               <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" width="100px"/>    
               <el-table-column :show-overflow-tooltip="true" prop="nickName" label="姓名" width="120px"/>    
               <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" width="150px"/>    
               <el-table-column :show-overflow-tooltip="true" label="部门">
                  <template slot-scope="scope">
                    <div>{{ scope.row.dept.name }}</div>
                  </template>
               </el-table-column>
            </el-table>
            <el-pagination
              :total="userTab.total"
              :current-page="userTab.page + 1"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="userSizeChange"
              @current-change="userPageChange"/>
          </el-tab-pane>
        </el-tabs>
      </el-col>
      <el-col :span="8">
        <el-tabs v-model="menuActiveName" @tab-click="menuHandleClick">
          <el-tab-pane label="后台管理菜单" name="admin">
            <el-button class="filter-item" :loading="adminTab.menuLoading" size="mini" type="primary" icon="el-icon-check" @click="doSaveAdminMenus">保存</el-button>
            <div class="line">
              <el-tree
                ref="adminMenuTree"
                v-loading="adminTab.loading"
                :data="adminTab.data"
                :default-checked-keys="adminTab.menuIds"
                :props="menuTreeDefaultProps"
                accordion
                show-checkbox
                style="width: 100%"
                node-key="id"/>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </div>
  </el-row>
</template>

<script>
import request from '@/utils/request'
import qs from 'qs'
export default {
  name: 'authMgt',
  data() {
    return {
      authActiveName: 'dept',
      menuActiveName: 'admin',

      currentType: 'dept',
      currentId: '',
      
      menuTreeDefaultProps: {
        children: 'children',
        label: 'label'
      },
      deptTab: {
        query: {
          name: '',
          id: ''
        },
        data: [],
        loading: true
      },
      roleTab: {
        query: {
          blurry: ''
        },
        data: [],
        loading: true,
        total: 0,page: 0,size: 10
      },
      userTab: {
        query: {
          blurry: ''
        },
        data: [],
        loading: true,
        total: 0,page: 0,size: 10
      },


      adminTab: {
        menuLoading: false,
        data: [],
        loading: true,
        menuIds: []
      }
    };
  },
  created() {
    this.toQueryDept();
    this.getAdminmenus();
  },
  methods: {
    authHandleClick(tab, event) {
      if(tab.name == 'dept'){
        this.currentType = 'dept',
        this.$refs.adminMenuTree.setCheckedKeys([])
        this.toQueryDept();
      }else if(tab.name == 'role'){
        this.currentType = 'role',
        this.$refs.adminMenuTree.setCheckedKeys([])
        this.toQueryRole();
      }else if(tab.name == 'user'){
        this.currentType = 'user',
        this.$refs.adminMenuTree.setCheckedKeys([])
        this.toQueryUser();
      }
    },

    menuHandleClick(tab, event) {
      this.getAdminmenus();
    },

    //机构权限配置
    toQueryDept() {
      var _this = this ;
      _this.deptTab.loading = true;
      //_this.deptTab.data = [];
      request({
          url:'/api/dept' + '?' + qs.stringify(_this.deptTab.query, { indices: false }),
          method:'get'
      }).then(res => {
       
          _this.deptTab.data = res.content
          _this.deptTab.loading = false
          //  console.log(_this.deptTab.data)
      })
    },
    onSelectDept(currentRow,oldCurrentRow) {
      // console.log(currentRow,oldCurrentRow)
      if(currentRow){
        this.currentId = currentRow.id
        this.$refs.adminMenuTree.setCheckedKeys([])
        request({
          url:'/api/authMgt/menus' + '?' + qs.stringify({type: 'dept', id:currentRow.id}, { indices: false }),
          method:'get'
        }).then(res => {
            this.adminTab.menuIds = res.adminMenus;
            this.adminTab.loading = false
        })
      }
    },

    //角色权限配置
    toQueryRole() {
      var _this = this ;
       _this.roleTab.loading = true;
      const sort = 'level,asc'
      this.params = { page: this.roleTab.page, size: this.roleTab.size, sort: sort }
      this.params['blurry'] = _this.roleTab.query.blurry
      request({
          url:'/api/roles' + '?' + qs.stringify(_this.params, { indices: false }),
          method:'get'
      }).then(res => {
        // console.log(res.content)
          _this.roleTab.data = res.content
          _this.roleTab.total = res.totalElements
          _this.roleTab.loading = false
      })
    },
    onSelectRole(currentRow,oldCurrentRow) {
      if(currentRow){
        this.currentId = currentRow.id
        this.$refs.adminMenuTree.setCheckedKeys([])
        request({
          url:'/api/authMgt/menus' + '?' + qs.stringify({type: 'role', id:currentRow.id}, { indices: false }),
          method:'get'
        }).then(res => {
            this.adminTab.menuIds = res.adminMenus;
        })
      }
    },
    rolePageChange(e) {
      this.roleTab.page = e - 1
      this.toQueryRole()
    },
    roleSizeChange(e) {
      this.roleTab.page = 0
      this.roleTab.size = e
      this.toQueryRole()
    },

    //用户权限配置
    toQueryUser() {
      var _this = this ;
      _this.userTab.loading = true;
      const sort = 'id,desc'
      this.params = { page: this.userTab.page, size: this.userTab.size, sort: sort }
      this.params['blurry'] = _this.userTab.query.blurry
      request({
          url:'/api/users' + '?' + qs.stringify(_this.params, { indices: false }),
          method:'get'
      }).then(res => {
        // console.log(res.content)
          _this.userTab.data = res.content
          _this.userTab.total = res.totalElements
          _this.userTab.loading = false
      })
    },
    onSelectUser(currentRow,oldCurrentRow) {
      // console.log(currentRow,oldCurrentRow)
      if(currentRow){
        this.currentId = currentRow.id
        this.$refs.adminMenuTree.setCheckedKeys([])
        request({
          url:'/api/authMgt/menus' + '?' + qs.stringify({type: 'user', id:currentRow.id}, { indices: false }),
          method:'get'
        }).then(res => {
            this.adminTab.menuIds = res.adminMenus;
        })
      }
    },
    userPageChange(e) {
      this.userTab.page = e - 1
      this.toQueryUser()
    },
    userSizeChange(e) {
      this.userTab.page = 0
      this.userTab.size = e
      this.toQueryUser()
    },


    //加载admin菜单
    getAdminmenus() {
      var _this = this ;
      request({
          url:'/api/menus/tree',
          method:'get'
      }).then(res => {
          _this.adminTab.data = res
          _this.adminTab.loading = false
      })
    },
    doSaveAdminMenus(){
      this.adminTab.menuLoading = true
      var _this = this ;
      const menuIds = [];
      this.$refs.adminMenuTree.getHalfCheckedNodes().forEach(function(data, index) {
        menuIds.push(data.id)
      })
      // 得到已选中的 key 值
      this.$refs.adminMenuTree.getCheckedKeys().forEach(function(data, index) {
        menuIds.push(data)
      })
      request({
          url:'/api/authMgt/menus',
          method:'post',
          data: {menuType: 'admin', objectType: this.currentType, objectId: this.currentId,menuIds: menuIds}
      }).then(res => {
        this.adminTab.menuLoading = false
        this.$notify({
          title: '保存成功',
          type: 'success',
          duration: 2500
        })
      })
    }
  }
}
</script>

<style scoped>
.content{
  padding: 20px;
}
.line{
  border: 1px solid #dfe6ec;
  overflow: auto;
  height: 430px;
  width: 100%;
  margin-top: 10px;
}
</style>