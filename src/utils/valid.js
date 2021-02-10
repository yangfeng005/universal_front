export const validPhoneOrTel = (type, value, callback) => {
  const mobile = /^1\d{10}$/; //手机
  const tel = /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/; //固话

  if (value && !(mobile.test(value) || tel.test(value))) {
    callback(new Error('请输入正确的手机号或座机号'));
  } else {
    callback();
  }
};

export const validCommon = (type, value, callback, msg, required = true) => {
  const regex = {
    mobile: /^1\d{10}$/, // 手机号
    phone: /(\d{4}-)?\d{6,8}/, // 座机号
    // password: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,14}$/, // 8-14位数字和字母
    // fms: /(?!^\d+$)(?!^[a-zA-Z]+$)[0-9a-zA-Z];*$/, // 快递单号,数字字母以;号隔开
    money: /^([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/, // 金额
    // parsePhone: /(\d{5})\d{4}(\d{3})/, // 匹配手机号码中间四位,
    zh: /([\u4e00-\u9fa5]+?)/g, // 匹配汉字
    num: /^[1-9]\d*$/, // 匹配正整数
  };

  if (required && !value) {
    callback(new Error(`请输入${msg}`));
  } else if (!regex[type].test(value)) {
    callback(new Error(`请输入正确的${msg}`));
  } else {
    callback();
  }
};
