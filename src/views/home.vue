<template>
  <div class="dashboard-container">
    <div class="dashboard-editor-container">
      <panel-group />
      <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <line-chart />
      </el-row>
      <!-- <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <radar-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <pie-chart />
          </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="8">
          <div class="chart-wrapper">
            <bar-chart />
          </div>
        </el-col>
      </el-row> -->
    </div>

    <updatePass1 ref="pass" />
  </div>
</template>

<script>
import PanelGroup from './dashboard/PanelGroup'
import LineChart from './dashboard/LineChart'
// import RadarChart from '@/components/Echarts/RadarChart'
// import PieChart from '@/components/Echarts/PieChart'
// import BarChart from '@/components/Echarts/BarChart'
import { count } from '@/api/monitor/visits'
import Cookies from 'js-cookie'
import store from '@/store'
import { updatePass } from '@/api/system/user'

import updatePass1 from '@/views/system/user/center/updatePass'
import { mapGetters } from 'vuex'

/**
 * 记录访问，只有页面刷新或者第一次加载才会记录
 */
count().then(res => {
})

export default {
  name: 'Dashboard',
  components: {
    PanelGroup,
    LineChart,
    updatePass1
    // RadarChart,
    // PieChart,
    // BarChart
  },

  mounted(){
    if(Cookies.get('defaultPass') == 'default'){
      this.$confirm('您目前使用的是初始密码，是否修改密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.dialog = true
          this.$refs.pass.dialog = true
          //console.log(this.$refs.pass.dialog)
        }).catch(() => {
          //console.log('000')
           Cookies.remove('defaultPass')
        })
    }

  },
methods:{
  ...mapGetters(['getSmartbi'])
}
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 18px 22px 22px 22px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
