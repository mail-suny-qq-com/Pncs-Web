<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" :title="title" width="91%" top="2vh">
    <el-row :gutter="24">
      <div class="content">
        <el-col :span="5">
          <div class="line">
            <div class="treediv">
              <el-tree
                :data="tree.data"
                node-key="id"
                v-loading="tree.loading"
                :default-expanded-keys="['1']"
                :props="tree.defaultProps"
                :expand-on-click-node="false" accordion
                @node-click="handleNodeClick"
                >
                <span class="span-ellipsis" slot-scope="{ node }">
                  <span :title="node.label">{{ node.label }}</span>
                </span>
              </el-tree>
            </div>
          </div>
        </el-col>
        <el-col :span="13">
          <div class="tablediv">
            <el-input v-model="table.query.blurry" size="mini" clearable placeholder="输入名称或邮箱搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQueryUser"/>
            <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQueryUser">搜索</el-button>
            <el-table ref="userTable" v-loading="table.loading" :data="table.data"  border size="mini" height="410"
              @select="onUserSelected" @select-all="onUserSelectedAll"
              style="width: 100%;margin-top: 10px;">
              <el-table-column type="selection" width="45" />
              <el-table-column :show-overflow-tooltip="true" prop="username" label="用户名" width="100px"/>
              <el-table-column :show-overflow-tooltip="true" prop="nickname" label="姓名" width="120px"/>
              <el-table-column :show-overflow-tooltip="true" prop="email" label="邮箱" width="150px"/>
              <el-table-column :show-overflow-tooltip="true" prop="deptname" label="部门" />
            </el-table>
            <el-pagination
              :total="table.total"
              :current-page="table.page + 1"
              style="margin-top: 8px;"
              layout="total, prev, pager, next, sizes"
              @size-change="userSizeChange"
              @current-change="userPageChange"/>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="line">
            <el-tag
              v-for="tag in tag.data"
              :key="tag[0]"
              style="margin-left:10px;margin-top:5px"
              size="small"
              closable
              :disable-transitions="false"
              @close="tagHandleClose(tag)">
              {{tag.username}} {{tag.nickname}}
            </el-tag>
          </div>
        </el-col>
      </div>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getDepts } from '@/api/system/dept'
import request from '@/utils/request'
import qs from 'qs'
export default {
  data() {
    return {
      loading: false,
      dialog: false,
      title: '',
      roleId: '',
      tree: {
        defaultProps: { children: 'children', label: 'name' },
        data: [],
        deptNam: '',
        loading: true,
        menuIds: []
      },
      table: {
        query: {
          blurry: '',
          deptId: '',
          enabled: true
        },
        data: [],
        loading: true,
        total: 0,page: 0,size: 10
      },
      tag: {
        data: []
      },
      userIds: []
    }
  },
  computed: {

  },
  created() {

  },
  methods: {
    // 获取左侧部门数据
    getDeptDatas() {
      this.tree.loading = false
      const sort = 'id,desc'
      const params = { sort: sort }
      if (this.tree.deptName) { params['name'] = this.tree.deptNam }
      getDepts(params).then(res => {
        this.tree.data = res.content
        this.tree.loading = false
      })
    },
    // 切换部门
    handleNodeClick(data) {
      if (data.pid === 0) {
        this.table.query.deptId = null
      } else {
        this.table.query.deptId = data.id
      }
      this.toQueryUser()
    },
    toQueryUser() {
      var _this = this ;
      _this.table.loading = true;
      const sort = 'id,desc'
      this.params = { page: this.table.page, size: this.table.size, sort: sort }
      this.params['blurry'] = _this.table.query.blurry
      this.params['deptId'] = _this.table.query.deptId
      this.params['enabled'] = _this.table.query.enabled
      request({
          url:'/api/users/list' + '?' + qs.stringify(_this.params, { indices: false }),
          method:'get'
      }).then(res => {
          _this.table.data = res.content
          _this.table.total = res.totalElements
          _this.table.loading = false

          this.$refs.userTable.toggleRowSelection(_this.table.data[0])

          //TODO 默认选中用户未处理
          // _this.tag.data.forEach(row => {
            // console.info(_this.table.data[1])
            // this.$refs.userTable.toggleAllSelection()
            // this.$refs.userTable.toggleRowSelection(this.table.data[0])
          // });
          // console.info(this.hasSelectList)
          // this.table.data.forEach(row => {
          //   if(this.hasSelectList.indexOf(row.ID) >= 0){
          //     console.info(row.ID)
          //     console.info(row)
          //     this.$refs.userTable.toggleRowSelection(row,true);
          //   }
          // })
      })
    },
    userPageChange(e) {
      this.table.page = e - 1
      this.toQueryUser()
    },
    userSizeChange(e) {
      this.table.page = 0
      this.table.size = e
      this.toQueryUser()
    },
    onUserSelected(selection, row) {
      if(selection.indexOf(row)>=0){
        if(this.userIds.indexOf(row.id)<0){
          this.tag.data.push(row)
          this.userIds.push(row.id)
        }
      }else{
        if(this.userIds.indexOf(row.ID)>=0){
          this.tag.data.splice(this.userIds.indexOf(row.id),1)
          this.userIds.splice(this.userIds.indexOf(row.id),1)
        }
      }
    },
    onUserSelectedAll(selection) {
      if(selection.length>0){
        selection.forEach(row => {
          if(this.userIds.indexOf(row.id)<0){
            this.tag.data.push(row)
            this.userIds.push(row.id)
          }
        });
      }else{
        this.table.data.forEach(row => {
          if(this.userIds.indexOf(row.id)>=0){
            this.tag.data.splice(this.userIds.indexOf(row.id),1)
            this.userIds.splice(this.userIds.indexOf(row.id),1)
          }
        });
      }
    },
    getUserByRoleId() {
      var _this = this ;
      request({
          url:'/api/roles/queryUserByRole' + '?' + qs.stringify({'roleId':this.roleId}, { indices: false }),
          method:'get'
      }).then(res => {
          _this.tag.data = res
          _this.tag.data.forEach(row => {
            this.userIds.push(row.id)
          });
      })
    },
    tagHandleClose(tag) {
      this.tag.data.splice(this.tag.data.indexOf(tag), 1);
    },
  	cancel() {
      this.title = ''
      this.roleId = ''
      this.dialog = false
    },
    doSubmit() {
      var _this = this ;
      this.loading = true
      request({
          url:'/api/roles/saveUserRoles' + '?' + qs.stringify({'roleId':this.roleId,'userIds':this.userIds}, { indices: false }),
          method:'post'
      }).then(res => {
          this.loading = false
          this.$notify({
            title: '保存成功',
            type: 'success',
            duration: 2500
          })
          this.dialog = false
      })
    }
  }
}
</script>

<style scoped>
.content{
  margin-top: -35px;
}
.line{
  border: 1px solid #dfe6ec;
  overflow: auto;
  height: 480px;
  width: 100%;
  margin-top: 10px;
}
.tablediv{
  overflow: auto;
  height: 500px;
  width: 100%;
  margin-top: 10px;
}
.el-tree {
  min-width: 100%;
  display:inline-block !important;
}
</style>
