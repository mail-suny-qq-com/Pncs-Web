<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :inline="true" :rules="rules">
      <!--用户数据-->
      <el-form-item label="同步信息:" prop="url">
        <el-select v-model="form.url">
          <el-option value="user" label="用户信息" />
          <el-option value="dept" label="机构信息" />
          <el-option value="role" label="机构信息" />
        </el-select>
      </el-form-item>
      <el-form-item label="编号:" prop="datano">
        <el-input v-model="form.datano" />
      </el-form-item>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-form>
  </div>
</template>

<script>
import { syncUser } from '@/api/smartbi'

export default {
  name: 'User',
  // 数据字典
  data() {
    return {
      form: {
        url: '',
        datano: '',
        method: 'POST'
      },
      rules: {
        url: [
          { required: true, message: '前选择同步信息', trigger: 'change' }
        ],
        datano: [
          { required: true, message: '请输入编号', trigger: 'blur' }
        ]
      },
      resetLoading: false
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate
      this.$refs['form'].validate((valid) => {
        if (valid) {
          syncUser(`v1/smartbi/${this.form.url}/sync/${this.form.datano}`, this.form.method).then(() => {
            console.log('同步成功！')
            this.$notify({ title: '同步成功', type: 'success', duration: 2000 })
          })
        }
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
  }

  .treediv {
    height: 470px;
    width: 170px;
    overflow: auto;
    font-size: 12px;
    overflow-x: scroll;
  }

  .el-tree {
    min-width: 100%;
    display: inline-block !important;
  }
</style>
