// pages/wxml/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      Sao: "扫码对接",
      tempaths: []
  },
  getDockCode:function(){
    wx.scanCode({
      onlyFromCamera: true,
      scanType: ['barCode'],
      success(res){
        console.log(res.result);
      },
      fail(){
        console.log("fail");
      },
      complete(){

      }
    })
  },
  getSavePath: function(event){
    var _this = this;
     wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        const tempFilePaths = res.tempFilePaths
          for(var i in tempFilePaths){
              _this.data.tempaths.push(tempFilePaths[i])
              wx.uploadFile({
                  url: 'http://192.168.17.128:8080/dataStore/get/saveImage',
                  filePath: tempFilePaths[i],
                  name: 'imageFile',
                  formData: {
                      'type': 'type'
                  },
                  success(res) {
                      const data = res.data
                      //do something
                  }
              })

          }
        _this.setData({
            tempaths: _this.data.tempaths
        })
      }
    })
   
  },
    takePhoto: function () {
        const ctx = wx.createCameraContext()
        ctx.takePhoto({
            quality: 'high',
            success: (res) => {
                this.setData({
                    src: res.tempImagePath
                })
            }
        })
  },
    toView: function(event){
        console.log(event.currentTarget.dataset.colType == 2)
        console.log(event.currentTarget.dataset.coltype == 1)
        wx.navigateTo({
            url: '/pages/index/index'
        })
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