<template>
  <div style="height:auto;">
    <iframe style="width:100%;height:100%;" :src="documentPath" frameborder="0" scrolling="no" id="bdIframe">
    </iframe>
  </div>
</template>

<script>
  export default {
    name: 'database' ,
    computed: {
      documentPath() {
        //console.log('====pagePath====', process.env.VUE_APP_SMARTBI_ADDRESS, process.env.VUE_APP_SMARTBI_ADDRESS.replace("{moduleId}", "Database"))
        return process.env.VUE_APP_SMARTBI_ADDRESS+'/vision/openmodule.jsp?id=Publish&showbanner=false'
      }
    },
    mounted(){
      /**
       * iframe-宽高自适应显示
       */
      const oIframe = document.getElementById('bdIframe');
      const deviceWidth = document.documentElement.clientWidth;
      const deviceHeight = document.documentElement.clientHeight;
      oIframe.style.width = (Number(deviceWidth)-220) + 'px'; //数字是页面布局宽度差值
      oIframe.style.height = (Number(deviceHeight)-120) + 'px'; //数字是页面布局高度差
    },

  }

</script>

<style scoped>
  .iframe {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background: #fff;
    overflow-y: hidden;
  }
</style>
