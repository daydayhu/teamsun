// 过滤出option估计的数值结构  label value
// data是数结构  id元数据结构的名称如（menu_id），
// name 是原数据的name值如（menu_name）
// type 标识将原来的id改为新值的key
import html2canvas from "html2canvas"

export const filterDataArr = (data, id, name, type = 'value') => {
  let dataList = [];
  const generateList = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i];
      let info = {
        [type]: node[id],
        label: node[name]
      };
      dataList.push(info);
      if (('children' in node) && (node.children.length > 0)) {
        const children = node.children.map(item => ({
          [type]: item[id],
          label: item[name]
        }));
        dataList[i].children = children;
        generateList(node.children);
      }
    }
  };

  generateList(data);
  return dataList;
}


export const filterData = (data, id, name, type = 'value') => {
  let dataList = [];
  const generateList = (obj, node) => {
    const info = {
      [type]: obj[id],
      label: obj[name]
    };
    if (obj['children'] && obj['children'].length) {
      info.children = []
      obj['children'].forEach(item => generateList(item, info))
    }
    if (typeof node === 'undefined') {
      dataList.push(info)
    } else {
      node['children'].push(info)
    }
  }
  data.forEach(item => generateList(item));
  return dataList
}

/**
 * 密码加密
 */
export const btoaPassword = (password) => {
  let newPassword = window.btoa(password);
  if (newPassword.length > 4) {
    let arr = Array.from(newPassword)
    arr.splice(5, 0, Math.floor(Math.random() * 10))
    newPassword = arr.join('')
  }

  return newPassword
}

/**
 * 生成唯一id字符串
 */
export function createUniqueId(n) {
  const random = function () { // 生成10-12位不等的字符串
    return Number(Math.random().toString().substr(2)).toString(36); // 转换成十六进制
  }
  let arr = [];

  function createId() {
    let num = random();
    let _bool = false;
    arr.forEach(v => {
      if (v === num) _bool = true;
    });
    if (_bool) {
      createId();
    } else {
      arr.push(num);
    }
  }

  let i = 0;
  while (i < n) {
    createId();
    i++;
  }
  return arr;
}

export function createUniqueNumberId(prefix) {
  return (prefix || '') + new Date().getTime().toString(36) + Math.random().toString(36).slice(2);
};

/**
 *
 * 取出两数组的差集
 */
export const arrDiff = function (b, a) {
  return b.filter(function (i) {
    return a.indexOf(i) < 0;
  });
};

/**
 * 获取URL地址参数
 */
export const getQueryVariable = function (variable) {
    var arr = window.location.hash.split('?')[1] ? window.location.hash.split('?')[1].split('&') : false;
    if(arr){
      var params = {}
      for (var i = 0; i < arr.length; i++) {
        var data = arr[i].split('=')
        if (data.length === 2) {
          params[data[0]] = data[1]
        }
      }
      return params
    }else{
      return  false;
    }
}

/**
 * 打印页面
 */
export const printPage = async function(ele) {
  let bodyHtml = document.body.innerHTML;
  let imgCanvas = await html2canvas(ele)
  let imgBase = imgCanvas.toDataURL("image/png")
  let printHtml = document.createElement("img")
  printHtml.setAttribute("src",imgBase)
  printHtml.setAttribute("width","793")
  let promise = new Promise(function(resolve,reject) {
      window.document.body.innerHTML = printHtml.outerHTML
      resolve()
  })
  promise.then(()=>{
      window.print()
  })
  window.onafterprint = ()=>{
      window.location.reload()
  }

}

/**
 * 下载导出
 */
 const download =  function(response) {
  var headers = response.headers;
          var filename = (headers["content-disposition"] || "")
            .split(";")[1]
            .split("filename*=UTF-8")[1];
          filename = filename.replace("''", "");
          filename = decodeURI(filename);
          var blob = new Blob([response.data], {
            type: headers["content-type"]
          });
          var link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
           link.click();
}
