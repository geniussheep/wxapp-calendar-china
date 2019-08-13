// pages/calendar/calendar.js
var CN_Date = require('../../utils/cndateutril.js');
var todayDate = new Date();
Page({

  data: {
    calShow: true, // 日历组件是否打开
    dateShow: false, // 日期是否选择
    selectDay: '', // 当前选择日期
    calendar: {
      weeks: [],
      month: todayDate.getMonth() + 1,
      data: todayDate.getDate(),
      day: todayDate.getDay(),
      year: todayDate.getFullYear(),
      cnDateDetail: CN_Date(todayDate.getFullYear(),todayDate.getMonth()+1,todayDate.getDate())
    },
    selected: []
  },

  // 获取日历内容
  getCalender: function(dateData) {
    let selected = this.data.selected
    // console.log("im date ", a, typeof a === 'object')
    // 判断当前是 安卓还是ios ，传入不容的日期格式
    if (typeof dateData !== 'object') {
      dateData = dateData.replace(/-/g, "/")
    }
    let _date = new Date(dateData);
    let year = _date.getFullYear(); //年
    let month = _date.getMonth() + 1;  //月
    let date = _date.getDate();//日
    let day = _date.getDay();// 天
    let calendar = [];
    // console.log(selected)
    let dates = {
      firstDay: new Date(year, month - 1, 1).getDay(),
      lastMonthDays: [],// 上个月末尾几天
      currentMonthDys: [], // 本月天数
      nextMonthDays: [], // 下个月开始几天
      endDay: new Date(year, month, 0).getDay(),
      weeks: []
    }

    // 循环上个月末尾几天添加到数组
    for (let i = dates.firstDay; i > 0; i--) {
      var cnDateDetail = CN_Date(year, month -1, new Date(year, month, -i).getDate());
      dates.lastMonthDays.push({
        'year': year,
        'date': new Date(year, month , -i).getDate() + '',
        'month': month - 1,
        'cnDate': cnDateDetail.slice(cnDateDetail.length - 2),
        'cnDateDetail': cnDateDetail
      })
    }
    // 循环本月天数添加到数组
    for (let i = 1; i <= new Date(year, month, 0).getDate(); i++) {
      var cnDateDetail = CN_Date(year, month, i);
      dates.currentMonthDys.push({
        'year': year,
        'date': i + "",
        'month': month,
        'cnDate': cnDateDetail.slice(cnDateDetail.length - 2),
        'cnDateDetail': cnDateDetail,
        'isToday' : todayDate.getFullYear() == year && (todayDate.getMonth()+1) == month && todayDate.getDate() == i 
      })
    }
    // 循环下个月开始几天 添加到数组
    for (let i = 1; i < 7 - dates.endDay; i++) {
      var cnDateDetail = CN_Date(year, month + 1, i);
      dates.nextMonthDays.push({
        'year': year,
        'date': i + '',
        'month': month + 1,
        'cnDate': cnDateDetail.slice(cnDateDetail.length - 2),
        'cnDateDetail': cnDateDetail,
      })
    }

    calendar = calendar.concat(dates.lastMonthDays, dates.currentMonthDys, dates.nextMonthDays)
    // 拼接数组  上个月开始几天 + 本月天数+ 下个月开始几天
    for (let i = 0; i < calendar.length; i++) {
      if (i % 7 == 0) {
        dates.weeks[parseInt(i / 7)] = new Array(7);
      }
      dates.weeks[parseInt(i / 7)][i % 7] = calendar[i]
    }

    // 渲染数据
    this.setData({
      selectDay: month + "月" + date + "日",
      "calendar.weeks": dates.weeks,
      'calendar.month': month,
      'calendar.date': date,
      "calendar.day": day,
      'calendar.year': year,
    })
    month = month < 10 ? "0" + month : month
    date = date < 10 ? "0" + date : date
    //this.triggerEvent('getdate', { year, month, date })
  },

  /**
     * 时间计算
     */
  calcDate: function (date, AddDayCount, str = 'day') {
    if (typeof date !== 'object') {
      date = date.replace(/-/g, "/")
    }
    let dd = new Date(date)
    switch (str) {
      case 'day':
        dd.setDate(dd.getDate() + AddDayCount)// 获取AddDayCount天后的日期
        break;
      case 'month':
        dd.setMonth(dd.getMonth() + AddDayCount)// 获取AddDayCount天后的日期
        break;
      case 'year':
        dd.setFullYear(dd.getFullYear() + AddDayCount)// 获取AddDayCount天后的日期
        break;
    }
    let y = dd.getFullYear()
    let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1)// 获取当前月份的日期，不足10补0
    let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate()// 获取当前几号，不足10补0
    return y + '-' + m + '-' + d
  },

  // 返回今天
  backtoday: function() { this.getCalender(todayDate); },

  /**
   * 日期变化
   * 通过获取元素上的data-type和data-id属性来判断变化规则 
   * data-type="month" or data-type="day"
   * data-id = "0" or data-id="1"
   */
  dateChange: function(e) {
    let num = 0;
    let types = e.currentTarget.dataset.type;

    if (e.currentTarget.dataset.id === "0") {
      num = -1;
    } else {
      num = 1
    }
    let year = this.data.calendar.year + "-" + this.data.calendar.month + "-" + this.data.calendar.date
    let _date = this.calcDate(year, num, types === 'month' ? "month" : "day");
    this.getCalender(_date);
  },

  selectDay: function(e){},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) { 
    this.getCalender(new Date());
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