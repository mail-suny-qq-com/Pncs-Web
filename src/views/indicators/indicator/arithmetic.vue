<template>
  <el-dialog append-to-body :close-on-click-modal="false" :visible.sync="dialog" :title="title" width="80%" top="2vh">
    <el-row :gutter="24">
      <div class="content">
        <el-col :span="6">
          <div class="line">
            <category type="2" @node-click="handleCategoryClick"/>
          </div>
        </el-col>
        <el-col :span="15">
          <div>
            <el-row>运算符号</el-row>
            <br/>
            <el-row>
              <el-button :loading="loading" type="primary">+</el-button>
              <el-button :loading="loading" type="primary">-</el-button>
              <el-button :loading="loading" type="primary">*</el-button>
              <el-button :loading="loading" type="primary">/</el-button>
              <el-button :loading="loading" type="primary">(</el-button>
              <el-button :loading="loading" type="primary">)</el-button>
            </el-row>
          </div>
          <div class="tablediv">
            <el-table ref="userTable" border size="mini" height="410"
                      style="width: 100%;margin-top: 10px;">
            </el-table>
          </div>
          <div class="dialog-footer">
            <el-button :loading="loading" type="primary">试算</el-button>
            <el-button :loading="loading" type="primary">保存</el-button>
            <el-button type="text" @click="cancel">关闭</el-button>
          </div>
        </el-col>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
  import request from '@/utils/request'
  import category from '../category/categoryInfo'
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    components: {
      ElRow,
      category },
    data() {
      return {
        loading: false,
        dialog: false,
        title: '',
        tree: {}
      }
    }
  }
</script>

<style scoped>
  .content {
    margin-top: -35px;
  }

  .line {
    border: 1px solid #dfe6ec;
    overflow: auto;
    height: 600px;
    width: 100%;
    margin-top: 10px;
  }

  .tablediv {
    overflow: auto;
    height: 500px;
    width: 100%;
    margin-top: 10px;
  }
  .dialog-footer {
    margin-left: 400px;
  }
</style>
