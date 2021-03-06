<template>
  <div class="app-container" style="padding: 8px;">
    <!--工具栏-->
    <div class="head-container">
      <div v-if="crud.props.searchToggle">
        <!-- 搜索 -->
        <el-input v-model="query.blurry" clearable size="small" placeholder="输入内容模糊搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="crud.toQuery" />
        <el-date-picker
          v-model="query.createTime"
          :default-time="['00:00:00','23:59:59']"
          type="daterange"
          range-separator=":"
          size="small"
          class="date-item"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <rrOperation :crud="crud" />
      </div>
      <crudOperation :permission="permission">
        <!-- 新增 -->
        <el-button
          slot="left"
          v-permission="['admin','storage:add']"
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-upload"
          @click="crud.toAdd"
        >上传
        </el-button>
      </crudOperation>
    </div>
    <!--表单组件-->
    <el-dialog append-to-body :close-on-click-modal="false" :before-close="crud.cancelCU" :visible.sync="crud.status.cu > 0" :title="crud.status.add ? '文件上传' : '编辑文件'" width="500px">
      <el-form ref="form" :model="form" size="small" label-width="100px">
        <el-form-item label="是否制度文件" prop="portal_visible">
          <el-radio v-for="item in dict.yes_or_no" :key="item.id" v-model="form.portal_visible" :label="item.value">{{ item.label }}</el-radio>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model="form.name" style="width: 350px;" />
          <el-upload
            ref="upload"
            :auto-upload="false"
            :on-change="handleChange"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :headers="headers"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-remove="beforeRemove"
            :action="fileUploadApi + '?name=' + form.name + '&portal_visible=' + form.portal_visible"
          >
            <div class="eladmin-upload"><i class="el-icon-upload" /> 添加文件</div>
            <div slot="tip" class="el-upload__tip">可上传任意格式文件，且不超过100M</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="text" @click="crud.cancelCU">取消</el-button>
        <el-button v-if="crud.status.add" :loading="loading" type="primary" @click="upload">确认</el-button>
        <el-button v-else :loading="crud.cu === 2" type="primary" @click="crud.submitCU">确认</el-button>
      </div>
    </el-dialog>
    <!--表格渲染-->
    <el-table ref="table" v-loading="crud.loading" :data="crud.data" style="width: 100%;" @selection-change="crud.selectionChangeHandler">
      <el-table-column type="selection" width="55" />
      <el-table-column v-if="columns.visible('name')" prop="name" label="文件名">
        <template slot-scope="scope">
          <el-popover
            :content="scope.row.name"
            placement="top-start"
            width="200"
            trigger="hover"
          >
            <a
              slot="reference"
              href="#"
              class="el-link--primary"
              style="word-break:keep-all;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color: #1890ff;font-size: 13px;"
              @click.stop.prevent="handleClick(baseApi + '/file/' + scope.row.type + '/' + scope.row.realName, scope.row.name)"
            >
              {{ scope.row.name }}
            </a>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="columns.visible('path')" prop="path" label="预览图">
        <template slot-scope="{row}">
          <el-image
            :src=" baseApi + '/file/' + row.type + '/' + row.realName"
            :preview-src-list="[baseApi + '/file/' + row.type + '/' + row.realName]"
            fit="contain"
            lazy
            class="el-avatar"
          >
            <div slot="error">
              <i class="el-icon-document" />
            </div>
          </el-image>
        </template>
      </el-table-column> -->
      <!-- <el-table-column v-if="columns.visible('suffix')" prop="suffix" label="文件类型" /> -->
      <el-table-column v-if="columns.visible('type')" prop="type" label="类别" />
      <el-table-column label="是否制度文件">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.visible"
            active-color="#409EFF"
            inactive-color="#F56C6C"
            active-value="1"
            inactive-value="0"
            @change="changeEnabled(scope.row, scope.row.visible)"/>
        </template>
      </el-table-column>
      <el-table-column v-if="columns.visible('size')" prop="size" label="大小" />
      <el-table-column v-if="columns.visible('operate')" prop="operate" label="操作人" />
      <el-table-column v-if="columns.visible('createTime')" prop="createTime" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!--分页组件-->
    <pagination />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getToken } from '@/utils/auth'
import crudFile from '@/api/tools/localStorage'
import CRUD, { presenter, header, form, crud } from '@crud/crud'
import rrOperation from '@crud/RR.operation'
import crudOperation from '@crud/CRUD.operation'
import pagination from '@crud/Pagination'

// crud交由presenter持有
const defaultCrud = CRUD({ title: '文件', url: 'api/localStorage', crudMethod: { ...crudFile }})
const defaultForm = { id: null, name: '', portal_visible: '0' }
export default {
  name: 'localStorage',
  components: { pagination, crudOperation, rrOperation },
  mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
  // 设置数据字典
  dicts: ['yes_or_no'],
  data() {
    return {
      delAllLoading: false,
      loading: false,
      headers: { 'Authorization': getToken() },
      permission: {
        edit: ['admin', 'storage:edit'],
        del: ['admin', 'storage:del']
      },
      fileList: []
    }
  },
  computed: {
    ...mapGetters([
      'baseApi',
      'fileUploadApi'
    ])
  },
  created() {
    this.crud.optShow.add = false
    this.crud.optShow.edit = false
  },
  methods: {
    upload() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.fileList.length === 0) {
            this.$message.error('请选择上传文件!')
          } else {
            this.loading = true
            this.$refs.upload.submit()
          }
        } else {
          return false
        }
      })
    },
    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
      this.form.name = file.name
    },
    beforeUpload(file) {
      let isLt2M = true
      isLt2M = file.size / 1024 / 1024 < 100
      if (!isLt2M) {
        this.loading = false
        this.$message.error('上传文件大小不能超过 100MB!')
      }
      this.form.name = file.name
      return isLt2M
    },    
    handleSuccess(response, file, fileList) {
      this.crud.notify('上传成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
      this.$refs.upload.clearFiles()
      this.crud.status.add = CRUD.STATUS.NORMAL
      this.crud.resetForm()
      file.name = ''
      this.loading = false
      this.crud.toQuery()
    },    
    handleError(e, file, fileList) {
      const msg = JSON.parse(e.message)
      file.name = ''
      this.$refs.upload.clearFiles()
      this.$notify({
        title: msg.message,
        type: 'error',
        duration: 2500
      })
      this.loading = false
    },  
    beforeRemove(file, fileList) {
      this.form.name = ''
    }, 

    // 添加取消 - 之前 */
    [CRUD.HOOK.beforeAddCancel](crud, form) {
      this.loading = false
      this.$refs.upload.clearFiles()
    },

    // 改变状态
    changeEnabled(data, val) {
      var s = '取消设置';
      if(val==1){
        s = '设置';
      }
      this.$confirm('此操作将 [' + s + '] "' + data.name + '" 为制度文件,是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
          crudFile.edit(data).then(res => {
          this.$notify({
            title: '设置成功',
            type: 'success',
            duration: 2500
          })
        }).catch(() => {
          data.visible = data.visible === '1' ? '0' : '1'
        })
      }).catch(() => {
        data.visible = data.visible === '1' ? '0' : '1'
      })
    },
    // 下载文件
    handleClick(url, name) {
      var xhh = new XMLHttpRequest()
      xhh.open('get', url)
      xhh.setRequestHeader('Authorization', getToken())
      xhh.setRequestHeader('Content-Type', 'application/json')
      xhh.responseType = 'blob'
      xhh.onload = function() {
        const blob = this.response
        var filename = name
        var a = document.createElement('a')
        var new_url = window.URL.createObjectURL(blob)
        a.href = new_url
        a.download = filename
        var body = document.getElementsByTagName('body')[0]
        body.appendChild(a)
        a.click()
        body.removeChild(a)
        window.URL.revokeObjectURL(new_url)
      }
      xhh.send()
    },
  }
}
</script>

<style scoped>
  .eladmin-upload {
    border: 1px dashed #c0ccda;
    border-radius: 5px;
    height: 45px;
    line-height: 45px;
    width: 350px;
  }
  /deep/ .el-image__error, .el-image__placeholder{
    background: none;
  }
  /deep/ .el-image-viewer__wrapper{
    top: 55px;
  }
</style>
