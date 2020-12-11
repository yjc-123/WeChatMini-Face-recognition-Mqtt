import mqtt from '../../utils/mqtt.js';
//连接的服务器域名，注意格式！！！
const host = 'wxs://www.iot-yjc.cn/mqtt';
Page({

  onClick_Simple: function() {
    wx.navigateTo({
      url: '../simpleDemo/simple',
    })

  }

})