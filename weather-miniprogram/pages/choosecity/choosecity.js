wx.cloud.init()
const db = wx.cloud.database()

// pages/choosecity/choosecity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let chooseweather = []
    db.collection('weather').get({
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          const item = {
            weathername: res.data[i].weathername,
            status: false
          }
          chooseweather.push(item)

        }
        that.setData({
          weather: chooseweather
        })

      }, fail: function (res) {
        console.log(res)
      }
    })
  },
  gotoweather: function (e) {
    var that = this
    console.log(e)
    console.log(that.data.weather[e.currentTarget.id])
    wx.setStorageSync("city", that.data.weather[e.currentTarget.id])
    console.log(wx.getStorageSync("city"))
    setTimeout(function () {
      wx.redirectTo({
        url: '../weather/weather',
      }, 1000)
    })
  },
  deleteitem: function (e) {
    console.log(e.currentTarget.id)
    var that = this
    let cityid = this.data.weather[e.currentTarget.id].weathername

    db.collection('weather').doc(cityid).remove().then(res => {
      console.log(res)
      wx.showToast({
        title: '删除成功',
      })
      that.onShow()
    })



  },
  addcity: function () {
    wx.navigateTo({
      url: '../addcity/addcity',
    })
  },

 touchS(e) {
    // 获得起始坐标
    console.log("touchs")
    this.startX = e.touches[0].clientX;
    this.startY = e.touches[0].clientY;
  },
  touchE: function (e) {
    console.log("touche")
    console.log(e);
    var that = this
    if (e.changedTouches.length == 1) {
      //手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "rpx" : "left:0rpx";

      //获取手指触摸的是哪一项

    }
  },
  touchM(e) {
    console.log("1234")
    console.log(e)
    // 获得当前坐标
    this.currentX = e.touches[0].clientX;
    this.currentY = e.touches[0].clientY;
    const x = this.startX - this.currentX; //横向移动距离
    const y = Math.abs(this.startY - this.currentY); //纵向移动距离，若向左移动有点倾斜也可以接受
    var that = this
    if (x > 35 && y < 110) {
      //向左滑是显示删除
      var index = e.currentTarget.id

      var list = that.data.weather;
      console.log(index)
      //console.log(that.data.weather)
      //console.log(list[index])
      list[index].status = true;
      //更新列表的状态
      that.setData({
        weather: list,
        
      });


    } else if (x < -35 && y < 110) {
      //向右滑
      var index = e.currentTarget.id

      var list = that.data.weather;
      console.log(index)
      //console.log(that.data.weather)
      //console.log(list[index])
      list[index].status = false;
      //更新列表的状态
      that.setData({
        weather: list,
        
      });


    }
    that.onShow()
  },
  editcity:function(){
    var that=this
    let chooseweather=[]
    for (var i = 0; i < this.data.weather.length; i++) {

      const item = {
        weathername: that.data.weather[i].weathername,
        status: false
      }
      chooseweather.push(item)
    }
    this.setData({
      weather:chooseweather
    })
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
   /* var that = this
    let chooseweather = []
    db.collection('weather').get({
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          const item = {
            weathername: res.data[i].weathername,
            status: false
          }
          chooseweather.push(item)
        }
        that.setData({
          weather: chooseweather
        })

      }, fail: function (res) {
        console.log(res)
      }
    })*/
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