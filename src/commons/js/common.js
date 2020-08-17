export const makeElementTree = (params) => {
    // 将参数拿出来，不喜欢 params.xxx 的调用方式
    const { pid, list, pidFiled, labelFiled, valueFiled ,bj} = params
    // 构建一个内部函数，用于实现递归
    const makeTree = (pid, arr) => {
      const res = []
      arr.forEach(i => {
        if (i[pidFiled] === pid) {
          // 自己调用自己，递归查归属于自己的 children
          const children = makeTree(i[bj], list)
          // 将原有的数据按照 element 的格式进行重构
          const obj = {
            label: i[labelFiled],
            value: i[valueFiled],
            //bz:i[bz]
          }
          // 如果有 children 则插入 obj 中
          if (children.length) {
            obj.children = children
          }
          res.push(obj)
        }
      })
      return res
    }
    return makeTree(pid, list)
  }