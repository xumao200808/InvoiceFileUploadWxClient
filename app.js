//app.js
App({
  onLaunch: function () {
      var info = wx.getSystemInfoSync();
      console.log("小程序基础库版本号：" + info.SDKVersion)
      this.globalData.sdkVersion = info.SDKVersion;
      const res = wx.getSystemInfoSync()
      this.globalData.windowHeight = res.windowHeight;

  },
    compareVersion: function (v1,v2) {
        v1 = v1.split('.')
        v2 = v2.split('.')
        var len = Math.max(v1.length, v2.length)

        while (v1.length < len) {
            v1.push('0')
        }
        while (v2.length < len) {
            v2.push('0')
        }

        for (var i = 0; i < len; i++) {
            var num1 = parseInt(v1[i])
            var num2 = parseInt(v2[i])

            if (num1 > num2) {
                return 1
            } else if (num1 < num2) {
                return -1
            }
        }
        return 0
    },
  globalData: {
    queryServerUrl: 'https://wx.fapiaohelp.com/verify-service',
    serverUrl: 'https://wx.fapiaohelp.com/miniProJavaStorage',
    windowHeight: '',
  }
})