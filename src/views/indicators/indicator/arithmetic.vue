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
              <el-button :loading="loading" type="primary"  @click="formulaSymbol('+')">+</el-button>
              <el-button :loading="loading" type="primary" @click="formulaSymbol('-')">-</el-button>
              <el-button :loading="loading" type="primary" @click="formulaSymbol('*')">*</el-button>
              <el-button :loading="loading" type="primary" @click="formulaSymbol('/')">/</el-button>
              <el-button :loading="loading" type="primary" @click="formulaSymbol('(')">(</el-button>
              <el-button :loading="loading" type="primary" @click="formulaSymbol(')')">)</el-button>
              <el-button :loading="loading" type="primary" @click="reset()">重置</el-button>
            </el-row>
          </div>
          <div class="tablediv">
            <el-tag
              style="background-color:#FFFFDF;height: 28px"
              v-for="tag in tags"
              :key="tag.name"
              closable
              type="primary"
              @close="handleClose(tag)">
              {{tag.name}}
            </el-tag>
          </div>
          <div class="dialog-footer">
            <el-button :loading="loading" type="primary" @click="taste()" >试算</el-button>
            <el-button :loading="loading" type="primary" @click="saveArithmetic()">保存</el-button>
            <el-button type="text" @click="cancel()">关闭</el-button>
          </div>
        </el-col>
      </div>
    </el-row>
  </el-dialog>
</template>

<script>
  import crudIndIndicatorInfo, {saveArithmetic } from '@/api/indicators/indIndicatorInfo'
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
        ieCode: '',
        tree: {},
        tags: [],
        dBExpress:[]
      }
    },
    methods: {
      //获取数据库的表达式
      getDBExpress(){
        let dbStr=''
        for (let i = 0; i < this.dBExpress.length; i++) {
          dbStr += this.dBExpress[i]
        }
        return dbStr
      },
      //点击运算符号触发
      formulaSymbol(param){
        this.dBExpress.push(param)  //记录db

        let  tag={
          name:param,
        }
        this.tags.push(tag)  //tab标签显示
      },
      //删除
      handleClose (tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.dBExpress.splice(this.tags.indexOf(tag), 1); //删除记录db
      },
      //取消按钮
      cancel() {
        this.title = ''
        this.ieCode = ''
        this.tags=[];
        this.dBExpress=[]; //删除记录db
        this.dialog = false
      },
      //重置
      reset(){
        this.tags=[];
        this.dBExpress=[]; //删除记录db
      },
      //点击指标触发
      async handleCategoryClick(data) {
        if(data.categoryType==='88'){
          this.dBExpress.push(data.categoryName)  //记录db
          let  tag={
            name:data.categoryName,
          }
          this.tags.push(tag)  //tab标签显示
        }
      },
      //试算
      taste (){
        let dbStr = this.getDBExpress()
        let result = this.fondamentalJudge(dbStr)
        if (!result){
          this.$message.error({
            message:'运算表达式不正确!'
          })
          return
        }
      },
      //保存
      saveArithmetic(){
        let dbStr = this.getDBExpress()
        let result = this.fondamentalJudge(dbStr)
        if (!result){
          this.$message.error({
            message:'运算表达式不正确!'
          })
          return
        }
        const data = {
          'ieCode': this.ieCode,
          'ruleType': 1,
          'calcRule':dbStr
        }
        saveArithmetic(data).then(data => {
          if(data.code===0){
            this.$message.info({
              message:'保存成功!'
            })
            this.cancel()
          }else{
            this.$message.info({
              message:data.msg
            })
          }
        })
      },
      //判断四则运算的函数
      fondamentalJudge (string) {
        // 剔除空白符
        string = string.replace(/\s/g, '')

        // 错误情况，空字符串
        if ('' === string) {
          return false
        }
        // 错误情况，运算符连续
        if (/[\+\-\*\/]{2,}/.test(string)) {
          return false
        }
        // 空括号
        if (/\(\)/.test(string)) {
          return false
        }
        // 最后一个符号是加、减、乘、除符号
        if (/[\+\-\*\/]$/.test(string)) {
          return false
        }
        // 错误情况，括号不配对
        var stack = []
        for (var i = 0, item; i < string.length; i++) {
          item = string.charAt(i)
          if ('(' === item) {
            stack.push('(')
          } else if (')' === item) {
            if (stack.length > 0) {
              stack.pop()
            } else {
              return false
            }
          }
        }
        if (0 !== stack.length) {
          return false
        }
        // 错误情况，(后面是运算符
        if (/\([\+\-\*\/]/.test(string)) {
          return false
        }
        // 错误情况，)前面是运算符
        if (/[\+\-\*\/]\)/.test(string)) {
          return false
        }
        // 错误情况，(前面不是运算符
        if (/[^\+\-\*\/]\(/.test(string)) {
          return false
        }
        // 错误情况，)后面不是运算符
        if (/\)[^\+\-\*\/]/.test(string)) {
          return false
        }

        // **错误情况最后一个字符是**+-*/
        if (/\*[\+\-\*\/]$/.test(string)) {
          return false
        }
        return true
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
    border: 1px solid #dfe6ec;
    overflow: auto;
    height: 450px;
    width: 100%;
    margin-top: 10px;
  }
  .dialog-footer {
    overflow: auto;
    height: 35px;
    margin-left: 300px;
    margin-top: 30px;
  }
  .ruledesc {
    height: 100%;
    width: 100%;
  }
</style>
