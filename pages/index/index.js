//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
Page({
  data: {
      version: app.globalData.sdkVersion,
      app : app,
      hiddenLoading: true,
      lodingText: null,
  },
  onLoad: function () {
    wx.getSetting({
      success(res) {
        if (res.authSetting["scope.userInfo"]) {
          wx.getUserInfo({
            success: res => {
              app.globalData.userInfo = res.userInfo
            }
          })  
     }else{
          wx.redirectTo({
            url: '/pages/login/login',
            fail(res) {
              wx.showModal({//显示弹窗方法
                title: '警告',
                content: '跳转页面失败！' + res.errMsg,
              })
            }
          })
     }
    }
  })
  },
  getJsCode : function (){
      return new Promise(function(resolve , reject){
            wx.login({
                timeout: 8000,
                success: res => {
                    if (res.code) {
                       let jsCode = res.code;
                       resolve(jsCode)
                    } else {
                        reject(res.errMsg)
                    }
                },
                fail: function (res) {
                    reject(res.errMsg)
                },
            })
      })
  },
  getScanCode: function (scanType){
      var _this = this
      return new Promise(function(resolve,reject){
        wx.scanCode({
            onlyFromCamera: true,
            scanType: scanType,
            success(res) {
                resolve(res.result)
            },
        })
      })
  },
  requestDocking: function(data,complete){
      return new Promise(function(resolve,reject){
          wx.request({
              url: data.url,
              header: data.header,
              data: data.data,
              method: data.method,
              success: function (res) {
                  resolve(res.data)
              },
              fail: function (res) {
                 reject(res.errMsg);
              },
              complete: complete
          })
      });
  },
    getDockCode: function(e){
        var nickName = e.detail.userInfo.nickName
        var _this = this;
        this.getJsCode().then((res) => {
            let jsCode = res
            _this.getScanCode(['barCode']).then((res)=>{
                let code = res
                console.log("code",code)
                _this.setData({
                    lodingText: '正在对接',
                    hiddenLoading: false,
                })
                _this.requestDocking({
                    url: app.globalData.serverUrl + '/api/dockDockingCode',
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
                    data: {
                        dockingCode: code,
                        nickName: nickName,
                        jsCode: jsCode,
                    },
                    method: 'POST',
                }, function complete(res) {
                        _this.setData({
                            hiddenLoading: true,
                        })
                }).then((res)=>{
                  console.log(res)
                    if (res.code == '0') {
                            wx.navigateTo({
                              url: '/pages/photo/photo?code=' + code + '&companyFullName=' + res.companyFullName + '&businesscode=' + res.businesscode,
                          
                                fail(res) {
                                    wx.showModal({
                                        title: '警告',
                                        content: '跳转页面失败！' + res.errMsg,
                                        showCancel: false,
                                    })
                                }
                            })
                        } else {
                            throw new Error(res.message)
                        }
                }).catch(res=>{
                    wx.showModal({
                            title: '警告',
                            content: '对接失败！' + res,
                            showCancel: false,
                    })
                })
              
            })
        }).catch((res) => {
            wx.showModal({
                title: '小程序登录失败',
                content: '获取登录凭证失败，' + res,
            })
        })
    },
  invoiceVerify: function () {
    var that = this
    this.getScanCode(['qrCode']).then((res) => {
      console.log(res)
      that.setData({
        lodingText: '正在验证发票数据',
        hiddenLoading: false,
      })
      var yzmurl = app.globalData.queryServerUrl + '/invoice/check?'
      var ar = res.split(',')
      var fpdm = ar[2]
      console.log('fpdm:' + fpdm)
      var fphm = ar[3]
      console.log('fphm:' + fphm)
      var kprq = ar[5]
      console.log('kprq:' + kprq)
      var kjje = ar[4]
      console.log('kjje:' + kjje)
      var jym = ar[6]
      console.log('jym:' + jym)
      try{
        var invoiceType = util.getInvoiceType(fpdm)
      }catch(error){
        wx.showModal({
          title: '发票代码识别发票类型错误',
          content: error.name + '：' + error.message,
        })
        that.setData({
          hiddenLoading: true,
        })
      }
      var ext
      if (invoiceType == '01') {
        ext = kjje
      } else {
        ext = jym.substr(jym.length - 6, 6)
      }
      console.log('ext:' + ext)
      yzmurl = yzmurl + 'fpdm=' + fpdm + '&fphm=' + fphm + '&kprq=' + kprq + '&ext=' + ext
      console.log(yzmurl)
      wx.request({
        url: yzmurl,
        success: function (res) {
          console.log(res.data)

          if (res.data["returnCode"] < 0) {
            wx.showModal({
              title: '错误',
              content: res.data["errorMessage"],
              showCancel: false,
              complete: function () {
                console.log("错误：" + res.data["errorMessage"])
              }
            })
          } else {
            wx.setStorage({
              key: 'detail',
              data: res.data,
              success: function (res) {
                wx.navigateTo({
                  url: '../code/code?detail=' + res.data,
                })
              }
            })
          }
        },
        fail(res){
          wx.showModal({
            title: '验真失败',
            content: res.errMsg,
            showCancel: false
          })
        },
        complete: function (res) {
          that.setData({
            hiddenLoading: true,
          })
        }

      })
    })
  },
  manualInput: function(){
    wx.navigateTo({
      url: '/pages/inputInfo/inputInfo',
      fail(res) {
        wx.showModal({
          title: '警告',
          content: '跳转页面失败！' + res.errMsg,
          showCancel: false,
        })
      }
    })
  }
})
