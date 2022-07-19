Component({
  data: {
    selected: 0,
    color: "#999999",
    selectedColor: "#008DF9",
    list: [{
      pagePath: "/pages/index/index",
      iconPath: "https://file.zwyknit.com/%E9%A6%96%E9%A1%B5%EF%BC%88%E7%81%B0%E8%89%B2%EF%BC%89-01.png",
      selectedIconPath: "https://file.zwyknit.com/%E9%A6%96%E9%A1%B5-01.png",
      text: "首页"
    }, {
      pagePath: "/pages/manage/manage",
      iconPath: "https://file.zwyknit.com/%E7%AE%A1%E7%90%86%EF%BC%88%E7%81%B0%E8%89%B2%EF%BC%89-01.png",
      selectedIconPath: "https://file.zwyknit.com/%E7%AE%A1%E7%90%86-01.png",
      text: "管理"
    }]
  },
  attached() {
  },
  methods: {
    switchTab(e) {
      const data = e.currentTarget.dataset
      const url = data.path
      wx.switchTab({url})
      this.setData({
        selected: data.index
      })
    }
  }
})