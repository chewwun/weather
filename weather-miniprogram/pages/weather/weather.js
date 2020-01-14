const CHARTS = require('../../utils/wxcharts-min.js'); // 引入wx-charts.js文件
wx.cloud.init()
const db = wx.cloud.database()

const app = getApp()
const server = require('../../utils/server.js')
const util = require('../../utils/util.js')
var DATE = util.formatTime(new Date());

// pages/weather/weather.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "",
    tem: "",
    txt: "",
    cityname: "北京",
    day: ["今天", "明天", "后天"],
    hid: true,
    weather: false,
    imgname: 0,
    sunset: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //console.log(wx.getStorageSync("city"))
    const successCallback = res => {
      console.log(res.data)
      if (!(res.data.result.img in [0, 1, 2])) {

        this.setData({
          imgname: 2,
        })
        console.log(this.data.imgname)
      } else {
        this.setData({
          imgname: res.data.result.img,
        })
      }
      this.setData({
        city: res.data.result.city,
        tem: res.data.result.temp,
        txt: res.data.result.weather,
       qlty: res.data.result.aqi.aqi,
        windpower: res.data.result.windpower,
        templow: res.data.result.templow,
        temphigh: res.data.result.temphigh,
        winddirect: res.data.result.winddirect,
        daily: res.data.result.daily,
        hourly: res.data.result.hourly,
        updatetime: res.data.result.updatetime,
        date: DATE,
        index: res.data.result.index


      })
      let sunrise = []
      for (var i = 0; i < this.data.daily.length; i++) {
        sunrise.push(this.data.daily[i].sunrise)
      }
      let sunset=[]
      for (var i = 0; i < this.data.daily.length; i++) {
        sunset.push(this.data.daily[i].sunset)
      }
      this.setData({
        sunsetvalue:sunset,
        sunrisevalue:sunrise
      })
    }
    server.getweather(this.data.cityname, successCallback)
    if (wx.getStorageSync("city") == '') {
      wx.getLocation({

        type: 'gcj02',

        success: (res) => {

          console.log(res)
          const successCallback1 = res => {
            console.log(res.data)
            let city = res.data.result.city.split('市')[0]
            wx.setStorageSync("city", city)
            this.setData({
              country: res.data.result.country,
              province: res.data.result.province,
              cityname: wx.getStorageSync("city")
            })
          }
          server.getcity(res.latitude, res.longitude, successCallback1)



        }

      })
    } else {
      this.setData({
        cityname: wx.getStorageSync("city")
      })

    }
  },
  weilaiyizhou:function(){
    var that = this
    wx.showModal({
      title: '是否隐藏此模块',
    
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          that.setData({
            weilaiyizhou:true
          })
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })
    
  },
  tianqixiangqing: function () {
    var that = this
    wx.showModal({
      title: '是否隐藏此模块',

      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          that.setData({
            tianqixiangqing: true
          })
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })

  },
  detail: function () {
    var that=this
    wx.showModal({
      title: '是否隐藏此模块',

      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
        } else {
          //点击确定
          that.setData({
            detail: true
          })
        }
      },
      fail: function (res) { },//接口调用失败的回调函数
      complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
    })

  },

  handletouchmove: function(event) {



    if (this.data.flag !== 0) {

      return

    }

    let currentX = event.touches[0].pageX;

    let currentY = event.touches[0].pageY;

    let tx = currentX - this.data.lastX;

    let ty = currentY - this.data.lastY;

    let text = "";

    //左右方向滑动

    if (Math.abs(tx) > Math.abs(ty)) {

      if (tx < 0) {

        text = "向左滑动";

        this.data.flag = 1


      } else if (tx > 0) {

        text = "向右滑动";
        //console.log(text)

        this.data.flag = 2

      }



    }

    //上下方向滑动
    else {
      var that = this
      if (ty < 0) {

        //text = "向上滑动";
        this.data.flag = 3
        this.setData({
          weather: true
        })
        this.lineShow()

      } else if (ty > 0) {

        text = "向下滑动";

        this.data.flag = 4


      }



    }



    //将当前坐标进行保存以进行下一次计算

    this.data.lastX = currentX;

    this.data.lastY = currentY;

    this.setData({

      text: text,

    });

  },
  handletouchstart: function(event) {

    // console.log(event)

    this.data.lastX = event.touches[0].pageX;

    this.data.lastY = event.touches[0].pageY;

  },
  handletouchend: function(event) {

    this.data.flag = 0

    this.setData({

      text: "没有滑动",

    });

  },

  addcommon: function(e) {
    db.collection('weather').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
        _id: this.data.city,
        weathername: this.data.city


      },
      success: function(res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)

      }
    })
  },
  input: function(e) {
    this.setData({
      textvalue: e.detail.value
    })
  },
  clickweather: function(e) {
    var that=this
    this.setData({
      sunset: false,
      sunsetdata:that.data.sunsetvalue[e.currentTarget.id],
      sunrisedata: that.data.sunrisevalue[e.currentTarget.id]
    })
   let widthPX = wx.getSystemInfoSync().windowWidth;
    let r = this.data.radioPos = widthPX * (365 / 750) * (270 / 365) * (2 / 3);
    var context = wx.createCanvasContext('canvasProgress');
    context.setStrokeStyle("#DBE9FF");
    context.setLineWidth(1);
    context.beginPath();
    for (let i = 180; i >= 0; i -= 3) { //每3度绘制一条线     
      let degree = i / 360 * Math.PI * 2
      let radio = r * 0.87 - r * 0.05 * (210 - i) / 240
      context.moveTo(r + radio * Math.cos(degree), r - radio * Math.sin(degree)); //向量加减     
      context.lineTo(r + r * Math.cos(degree), r - r * Math.sin(degree)); //向量加减      
      context.stroke();
    }
    context.draw();
   
    var context1 = wx.createCanvasContext('canvasProgressReal');
    context1.setStrokeStyle("#499AFF");
    context1.setLineWidth(1);
    context1.beginPath();
    for (let i = 180; i >= 120; i -= 3) { //每3度绘制一条线     
      let degree = i / 360 * Math.PI * 2
      let radio = r * 0.87 - r * 0.05 * (210 - i) / 240
      context1.moveTo(r + radio * Math.cos(degree), r - radio * Math.sin(degree)); //向量加减     
      context1.lineTo(r + r * Math.cos(degree), r - r * Math.sin(degree)); //向量加减      
      context1.stroke();
    }
    context1.draw();
  },
  walkAction: function() {
    console.log('walk')
    this.setData({
      degree: 210
    })
    let that = this
    let r = this.data.radioPos
    let widthPX = wx.getSystemInfoSync().windowWidth;
    var context = wx.createCanvasContext('canvasProgressReal');
    context.clearRect(0, 0, this.data.canvasWidth, this.data.canvasHeitht);
    context.setStrokeStyle("#499AFF");
    context.setLineWidth(1);
    let degreeMax = 210 - (this.data.footNumAll / this.data.myTargetFoot) * 240;
    if (Number.parseInt(this.data.footNumAll) >= Number.parseInt(this.data.myTargetFoot)) {
      console.log('footNumAll is smaller than myTargetFoot')
      degreeMax = -33
    }
    this.timer = setInterval(() => {
      if (that.data.degree > degreeMax) {
        context.beginPath();
        let degreeOne = that.data.degree / 360 * Math.PI * 2
        let radio = r * 0.87 - r * 0.05 * (210 - that.data.degree) / 240
        context.moveTo(r + radio * Math.cos(degreeOne), r - radio * Math.sin(degreeOne));
        context.lineTo(r + r * Math.cos(degreeOne), r - r * Math.sin(degreeOne));
        context.stroke(); //
        context.draw({        //  
         reserve: true        // 
         })//这个方法真机上绘制有问题        
        wx.drawCanvas({
          canvasId: 'canvasProgressReal',
          actions: context.getActions(),
          reserve: true
        })
        that.data.degree -= 3;
      } else {
        clearInterval(that.timer)
      }
    }, 50)
    let tempTimes = 0;
    let times = (this.data.footNumAll / this.data.myTargetFoot) * 240 / 3;
    if (Number.parseInt(this.data.footNumAll) >= Number.parseInt(this.data.myTargetFoot)) {
      times = 80
    }
    let step = this.data.footNumAll / times
    this.timerNum = setInterval(() => {
      if (tempTimes < times) {
        that.setData({
          footNum: Math.floor(that.data.footNum + step)
        })
        tempTimes += 1;
      } else {
        that.setData({

          footNum: that.data.footNumAll
        });
        clearInterval(that.timerNum)
      }
    }, 50)
  },


  back1: function() {
    this.setData({
      weather: false,
      sunset: true
    })
  },
  back: function() {
    this.setData({
      weather: false
    })
  },
  lineShow: function(type) {
    let cat = []
    for (var i = 0; i < this.data.daily.length; i++) {
      cat.push(this.data.daily[i].date)
    }
    let tem = []
    for (var i = 0; i < this.data.daily.length; i++) {
      tem.push(this.data.daily[i].day.temphigh)
    }
    let temlow = []
    for (var i = 0; i < this.data.daily.length; i++) {
      temlow.push(this.data.daily[i].night.templow)
    }

    let line = {
      canvasId: 'lineGraph', // canvas-id
      type: 'line', // 图表类型，可选值为pie, line, column, area, ring
      categories: cat,
      series: [ // 数据列表
        {
          name: '最高气温',
          data: tem,
        },
        {
          name: '最低气温',
          data: temlow,
        }
      ],
      yAxis: {
        min: 0 // Y轴起始值
      },
      width: 310,
      height: 200,
      dataLabel: true, // 是否在图表中显示数据内容值
      legend: true, // 是否显示图表下方各类别的标识
      extra: {
        lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
      }
    }
    new CHARTS(line);
    let cat1 = []
    for (var i = 0; i < this.data.hourly.length; i++) {
      cat1.push(this.data.hourly[i].time)
    }
    let tem1 = []
    for (var i = 0; i < this.data.hourly.length; i++) {
      tem1.push(this.data.hourly[i].temp)
    }

    let line1 = {
      canvasId: 'lineGraph1', // canvas-id
      type: 'line', // 图表类型，可选值为pie, line, column, area, ring
      categories: cat1,
      series: [ // 数据列表
        {
          name: ' ',
          data: tem1,
        }
      ],
      xAxis: {

      },
      yAxis: {
        min: 0 // Y轴起始值
      },
      width: 310,
      height: 200,
      dataLabel: false, // 是否在图表中显示数据内容值
      legend: true, // 是否显示图表下方各类别的标识
      extra: {
        lineStyle: 'curve' // (仅对line, area图表有效) 可选值：curve曲线，straight直线 (默认)
      }
    }
    new CHARTS(line1);


  },

  search: function() {
    /*var that=this
    this.setData({
      cityname:that.data.textvalue,
      hid:true
    })
    this.onShow()*/
    wx.navigateTo({
      url: '../city/city',
    })
  },
  click: function() {
    this.setData({
      hid: false
    })
  },
  addcity: function() {
    wx.navigateTo({
      url: '../choosecity/choosecity',
    })
    /*wx.navigateTo({
      url: '../addcity/addcity',
    })*/
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  textarea: function(e) {
    this.setData({
      cityname: e.detaul.dataset.value
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    const successCallback = res => {
      console.log(res.data.img)
      if (!(res.data.result.img in [0, 1, 2])) {

        this.setData({
          imgname: 2,
        })
        console.log(this.data.imgname)
      } else {
        this.setData({
          imgname: res.data.result.img,
        })
      }
      this.setData({
        city: res.data.result.city,
        tem: res.data.result.temp,
        txt: res.data.result.weather,
        qlty: res.data.result.aqi.aqi,
        windpower: res.data.result.windpower,
        templow: res.data.result.templow,
        temphigh: res.data.result.temphigh,
        winddirect: res.data.result.winddirect,
        daily: res.data.result.daily,
        hourly: res.data.result.hourly,

        date: DATE,


      })
    }
    server.getweather(this.data.cityname, successCallback)
    if (wx.getStorageSync("city") == '') {
      wx.getLocation({

        type: 'gcj02',

        success: (res) => {

          console.log(res)
          const successCallback1 = res => {
            console.log(res.data)
            let city = res.data.result.city.split('市')[0]
            wx.setStorageSync("city", city)
            this.setData({
              country: res.data.result.country,
              province: res.data.result.province,
              cityname: wx.getStorageSync("city")
            })
          }
          server.getcity(res.latitude, res.longitude, successCallback1)



        }

      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})