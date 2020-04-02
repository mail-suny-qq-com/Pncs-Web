<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <div class="treediv">
        <el-tree
          :data="treeData"
          node-key="id"
          :default-expanded-keys="['1']"
          :props="defaultProps"
          :expand-on-click-node="false"
          @node-click="handleNodeClick"
        >
          <span slot-scope="{ node, data}" class="span-ellipsis">
            <span :title="data.categoryName"><svg-icon icon-class="folder_open" class=""></svg-icon>{{ data.categoryName }}</span>
             <span align="right">
                <el-tooltip class="item" effect="dark" content="添加子节点" placement="top-start">
                  <el-button
                    type="text"
                    size="mini" icon="el-icon-circle-plus-outline"
                    @click="() => handleAdd(data)">
                  </el-button>
                </el-tooltip>
               <el-tooltip v-if="data.id!='0'" class="item" effect="dark" content="删除该节点" placement="top-start">
                <el-button
                  type="text"
                  size="mini" icon="el-icon-remove-outline"
                  @click="() => handleRemove(node, data)">
                </el-button>
               </el-tooltip>
          </span>
          </span>
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script>
  import crudIndCategory from '@/api/indicators/indCategory'
  import CRUD, { presenter, header, form, crud } from '@crud/crud'
  import rrOperation from '@crud/RR.operation'
  import crudOperation from '@crud/CRUD.operation'
  import udOperation from '@crud/UD.operation'
  import pagination from '@crud/Pagination'

  // crud交由presenter持有
  const defaultCrud = CRUD({
    title: '指标分类',
    url: crudIndCategory.url,
    sort: 'id,desc',
    crudMethod: { ...crudIndCategory.crud }
  })
  const defaultForm = {
    id: null,
    categoryType: null,
    categoryName: null,
    categoryDesc: null,
    parentId: null,
    crtUserCode: null,
    crtOrgCode: null,
    crtDate: null,
    updUserCode: null,
    updOrgCode: null,
    updDate: null
  }
  export default {
    name: 'IndCategory',
    components: { pagination, crudOperation, rrOperation, udOperation },
    //mixins: [presenter(defaultCrud), header(), form(defaultForm), crud()],
    data() {
      return {
        defaultProps: { children: 'children', label: 'name' },
        treeData: [{ id: '0', categoryType: this.type, categoryName: '全部类别', children: [] }],
        permission: {
          add: ['admin', 'indCategory:add'],
          edit: ['admin', 'indCategory:edit'],
          del: ['admin', 'indCategory:del']
        },
        rules: {
          id: [
            { required: true, message: '分类ID不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    props: {
      type: { type: String, default: 'base' },
      parentId: { type: String, default: '0' }
    },
    mounted() {
      console.log('=====category---mounted....')
      this.init()
    }
    ,
    methods: {
      // 获取数据前设置好接口地址
      [CRUD.HOOK.beforeRefresh]() {
        return true
      },
      // 点击事件
      handleNodeClick(data) {
        this.$emit('node-click', data)
      },
      handleAdd(data) {
        let $this = this
        this.$prompt('输入节点名称', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
          //inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          //inputErrorMessage: '邮箱格式不正确'
        }).then(({ value }) => {
          console.log('========', value)
          crudIndCategory.crud.add({
            categoryName: value,
            categoryType: data.categoryType,
            parentId: data.id
          }).then(res => {
            $this.$message({
              type: 'success',
              message: '添加成功 '
            })
            $this.init()
            //this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          }).catch(() => {
            console.log('新增异常')
            $this.$message({
              type: 'error',
              message: '添加失败 '
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '添加失败'
          })
        })
      }
      ,
      handleRemove(node, data) {
        let $this = this
        this.$confirm('确定要删除该节点及其所有子节点吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          crudIndCategory.crud.del([data.id]).then(res => {
            $this.$message({
              type: 'success',
              message: '删除成功 '
            })
            $this.init()
            //this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
          }).catch(() => {
            console.log('删除异常')
            $this.$message({
              type: 'error',
              message: '删除失败 '
            })
          })
        }).catch(() => {
        })
      }
      ,
      init() {
        crudIndCategory.tree(this.type, this.parentId).then(res => {
          console.log('======crudIndCategory.init======', res)
          this.treeData[0].children = res.data
          //this.crud.notify(this.dict.label.user_status[val] + '成功', CRUD.NOTIFICATION_TYPE.SUCCESS)
        }).catch(() => {
          console.log('')
          //data.enabled = !data.enabled
        })
      }
    }
  }
</script>

<style scoped>
  .span-ellipsis {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: 微软雅黑;
    font-size: 12px;
    padding-right: 8px;
  }

  .treediv {
    height: 470px;
    width: 170px;
    overflow: auto;
    font-size: 12px;
    overflow-x: auto;
  }

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
</style>
