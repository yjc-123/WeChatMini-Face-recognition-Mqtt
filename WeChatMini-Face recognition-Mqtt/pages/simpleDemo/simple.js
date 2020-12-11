import mqtt from '../../utils/mqtt.js';
//连接的服务器域名，注意格式！！！
const host = 'wxs://www.iot-yjc.cn/mqtt';
//WebSocket connection to 'wss://www.iot-yjc.cn/mqtt' failed: WebSocket is closed before the connection is established. 出现这个问题就是因为反向代理没搞好，需要进入宝塔重启nigix sudo fuser -k 80/tcp
Page({

  data: {
    client: null,
    //记录重连的次数
    reconnectCounts: 0,
    //MQTT连接的配置
    options: {
      protocolVersion: 4, //MQTT连接协议版本c
      clientId: 'wx_' + parseInt(Math.random() * 100 + 800, 10),
      clean: false,
      password: 'test',
      username: 'test',
      reconnectPeriod: 1000, //1000毫秒，两次重新连接之间的间隔
      connectTimeout: 30 * 1000, //1000毫秒，两次重新连接之间的间隔
      resubscribe: true //如果连接断开并重新连接，则会再次自动订阅已订阅的主题（默认true）
    }
  },
  onClick_connect: function() {
    var that = this;
    //开始连接
    this.data.client = mqtt.connect(host, this.data.options);
    this.data.client.on('connect', function(connack) {
      wx.showToast({
        title: '连接成功'
      })
    })


    //服务器下发消息的回调
    that.data.client.on("message", function(topic, payload) {
      console.log(" 收到 topic:" + topic + " , payload :" + payload)
      wx.showModal({
        content: " 收到topic:[" + topic + "], payload :[" + payload + "]",
        showCancel: false,
      });
    })


    //服务器连接异常的回调
    that.data.client.on("error", function(error) {
      console.log(" 服务器 error 的回调" + error)

    })

    //服务器重连连接异常的回调
    that.data.client.on("reconnect", function() {
      console.log(" 服务器 reconnect的回调")

    })


    //服务器连接异常的回调
    that.data.client.on("offline", function(errr) {
      console.log(" 服务器offline的回调")

    })


  },
  

  //发布消息
  listenerSwitch: function(e) {
    if (this.data.client && this.data.client.connected){
      if( e.detail.value == true){
        this.data.client.publish('/$sys/city/company/LoRaGW0001', '{"Power":"on"}');
        wx.showToast({
          title: '发布成功'
        })
      }
      else if(e.detail.value == false){
        this.data.client.publish('/$sys/city/company/LoRaGW0001', '{"Power":"off"}');
        wx.showToast({
          title: '发布成功'
        })
      }
      else{}
    }
    console.log('switch类型开关当前状态-----', e.detail.value);},

    //发布消息
    listenerSwitch_1: function(e) {
      if (this.data.client && this.data.client.connected){
        if( e.detail.value == true){
          this.data.client.publish('凉雾', '打开');
          wx.showToast({
            title: '发布成功'
          })
        }
        else if(e.detail.value == false){
          this.data.client.publish('凉雾', '关闭');
          wx.showToast({
            title: '发布成功'
          })
        }
        else{}
      }
      console.log('switch类型开关当前状态-----', e.detail.value);},

  onClick_unSubOne: function() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe('Topic1');
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onClick_unSubMany: function() {
    if (this.data.client && this.data.client.connected) {
      this.data.client.unsubscribe(['Topic1', 'Topic2']);
    } else {
      wx.showToast({
        title: '请先连接服务器',
        icon: 'none',
        duration: 2000
      })
    }
  },
  onLoad: function() {
    wx.setNavigationBarTitle({
      title: '简单服务器Mqtt连接'
    })
  }
})