const app = getApp()
const server = require('../../utils/server.js')
const util = require('../../utils/util.js')
var DATE = util.formatTime(new Date());
// pages/addcity/addcity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    citys:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let citys=[]
    const successCallback = res => {
      console.log(res.data)
      res.data.result.forEach(node =>       {
        citys.push(node.city) 
      })
      this.setData({
        citys:citys
      })
      
    }
    server.getallcity(successCallback)
  },
  input: function (e) {
    this.setData({
      textvalue: e.detail.value
    })
  },
  clickitem:function(e)
  {
    wx.setStorageSync("city", this.data.citys[e.currentTarget.id])
    console.log(wx.getStorageSync("city"))
    setTimeout(function () {
    wx.redirectTo({
      url: '../weather/weather',
    })
  },1000)
    //console.log(e)
  
    
  },
  search: function () {
    //wx.setStorageSync("city", this.data.textvalue)
    let search_city = this.data.textvalue
    console.log(search_city)
    console.log(this.data.citys)
    let city = this.data.citys
    let flag =false
    for(var i=0;i<city.length;i++)
    {
      if(city[i]==search_city)
      { flag=true
        this.setData({
          citys: [this.data.textvalue]
        })
        break
      }
    }
    if(flag==false)
     { wx.showModal({
        title: '搜索城市不存在',
        content: '请您检查是否输入错误',
      })
     }
    
    /*wx.redirectTo({
      url: '../weather/weather',
    })*/
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