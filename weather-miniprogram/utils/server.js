

const getweather = (position, successCallback, failCallback) => {
  wx.request({
    url:'https://api.jisuapi.com/weather/query?appkey=4ed24aa842d6f22b&city='+position,
    method: 'GET',

    success: res => {
      if (typeof (successCallback) === 'function') {
        successCallback(res)
      }
    },
    fail: res => {
      if (typeof (failCallback) === 'function') {
        failCallback(res)
      }
    }
  })
}
const getwords = ( successCallback, failCallback) => {
  wx.request({
    url: 'https://api.ooopn.com/ciba/api.php?type=json',
    method: 'GET',

    success: res => {
      if (typeof (successCallback) === 'function') {
        successCallback(res)
      }
    },
    fail: res => {
      if (typeof (failCallback) === 'function') {
        failCallback(res)
      }
    }
  })
}
const getcity = (lat,lng,successCallback, failCallback) => {
  wx.request({
    url: 'https://api.jisuapi.com/geoconvert/coord2addr?lat='+lat+'&lng='+lng+'&type=baidu&appkey=4ed24aa842d6f22b',
    method: 'GET',


    success: res => {
      if (typeof (successCallback) === 'function') {
        successCallback(res)
      }
    },
    fail: res => {
      if (typeof (failCallback) === 'function') {
        failCallback(res)
      }
    }
  })
}
const getallcity = (successCallback, failCallback) => {
  wx.request({
    url: 'https://api.jisuapi.com/weather/city?appkey=4ed24aa842d6f22b',
    method: 'GET',

    success: res => {
      if (typeof (successCallback) === 'function') {
        successCallback(res)
      }
    },
    fail: res => {
      if (typeof (failCallback) === 'function') {
        failCallback(res)
      }
    }
  })
}
module.exports = {
  getweather:getweather,
  getcity:getcity,
  getallcity,getallcity,
  getwords:getwords
}