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

            <span :title="[data.categoryName]" v-if="data.categoryType === '88'"><svg-icon class=""></svg-icon>[{{ data.categoryName }}]
            </span>
            <span :title="data.categoryName" v-if="data.categoryType !== '88'"><svg-icon icon-class="folder_open" class=""></svg-icon>{{ data.categoryName }}
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
      //console.log('=====category---mounted....')
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
      init() {
        crudIndCategory.treeInfo(this.type, this.parentId).then(res => {
          this.treeData[0].children = res.data
        }).catch(() => {
          console.log('')
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
