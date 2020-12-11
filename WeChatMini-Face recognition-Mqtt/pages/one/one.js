// pages/one/one.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      resData:[],
      toke:"",
      src:"",
      base64:"",
      msg:"",
      d:""
  },

  token:function(){
    wx.request({
      url:'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=YXL65ekIloykyjrT4kzcsF59&client_secret=lFiapBoZ5eBwOFyxMbiwQDmClg1uO4bA',
      data: {
        grant_type: 'client_credentials'
      },
      method: 'GET',
      header: {
        'Content-Type': 'application/json' 
      },
      success:res=>{
          this.setData({
         resData:res.data,
         toke:res.data.access_token
      })
        console.log(this.data.toke)
        this.validPhoto();
    }
    })

      // wx.request({
    //   url: 'https://aip.baidubce.com/rest/2.0/face/v3/search',
    //   params = "{\"image\":\"027d8308a2ec665acb1bdf63e513bcb9\",\"image_type\":\"FACE_TOKEN\",\"group_id_list\":\"group_repeat,group_233\",\"quality_control\":\"LOW\",\"liveness_control\":\"NORMAL\"}"
    // })
  },

  takePhoto() {
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          src :res.tempImagePath
        })
        var filePath
        wx.getFileSystemManager().readFile({
          filePath: this.data.src, //选择图片返回的相对路径
          encoding: 'base64', //编码格式
          success: res => { //成功的回调          
            this.setData({
              base64: res.data
            })
          }
        })
        console.log(this.data.src)
        this.token();
      }
    })
  },
  error(e) {
    console.log(e.detail)
  },




  validPhoto:function(){
    var that = this;
    //上传人脸进行 比对
    
    wx.request({
      url: 'https://aip.baidubce.com/rest/2.0/face/v3/search?access_token=' + that.data.toke,
      method: 'POST',
      data: {
        image: this.data.base64,
        image_type: 'BASE64',
        group_id_list: "1,2,3,4",//自己建的用户组id

      },
      header: {
        'Content-Type': 'application/json' // 默认值
      },
      
      success(res) {
        if( res.data.result.user_list[0] != null){
          that.setData({
            msg: res.data.result.user_list[0]
          })
        }
        console.log(that.data.msg)
        if (that.data.msg.score > 80) {
          console.log("此人是:",that.data.msg.user_id)
          wx.showToast({
            title: '验证通过',
            icon: 'success',
            duration: 1000
          })         //验证通过，跳转至UI页面
          if(that.data.msg.user_id == 'yjc_1'){
            wx.navigateTo({
              url: '../simpleDemo/simple',
            })

          }
          console.log("此人是:",that.data.msg.user_id)
        }
        else{

        }
      }
    });
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})