(function() {
  const defaultConfig = {
    paletteTitleLabelColor: "rgba(25,34,59,1)", // 调色板标题栏的文字颜色
    paletteTitleLabelFont: "PingFangSC-Semibold,PingFang SC", // 调色板标题栏的文字字体
    paletteTitleHeight: "50", // 调色板标题栏的高度
    paletteTitleBackground: "#ffffff", // 调色板标题栏的背景色
    paletteTitleHoverBackground: "rgba(25,34,59,0.08)", // 鼠标划过调色板标题栏时的背景色
    paletteContentLabelFont: "PingFangSC-Regular,PingFang SC", // 调色板内容区域的文字字体
    paletteContentLabelColor: "rgba(25,34,59,1)", // 调色板内容区域的文字颜色
    paletteContentBackground: "#ffffff", // 调色板内容区域的背景色
    paletteSeparatorWidth: "1", // 标题栏分割线的宽度
    paletteSeparatorColor: "#ffffff", // 标题栏分割线的颜色
    paletteItemHoverBorderColor: "rgba(25,34,59,0.08)", // 鼠标划过按钮元素时的边框颜色
    paletteItemSelectBackground: "rgba(25,34,59,0.08)" // 被选中的按钮元素的背景色
  };

  ht.Default = Object.assign(ht.Default, htconfig || defaultConfig);
  ht.Default.setImage("toArrow", {
    width: 30,
    height: 20,
    comps: [
      {
        type: "shape",
        points: [5, 2, 10, 10, 5, 18, 20, 10],
        closePath: true,
        background: "#000",
        borderWidth: 0.4,
        borderColor: "#000"
      }
    ]
  });
  ht.Default.setImage("fromArrow", {
    width: 6,
    height: 6,
    comps: [
      {
        type: "circle",
        background: "#000"
      }
    ]
  });
  ht.Default.setImage(
    "defaultIcon",
    require("@/commons/images/default_icon.svg")
  );
  ht.Default.setImage('success', require('@/commons/images/success.svg'));
  ht.Default.setImage('error', require('@/commons/images/error.svg'));
  ht.Default.zoomMax = 10;
  ht.Default.zoomMin = 0.5;
})();
