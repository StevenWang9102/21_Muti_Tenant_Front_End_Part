// <InputNumber
//  style={{ width: 215 }}
//  min={0}
//  precision={2}
// formatter={(value) => displayDecimalQuantity(value)}
//  onChange={(value)=> {
    // form.setFieldsValue({
    //   quantity: setDecimalNum(value),
    // })    
// }}
// />

// 负责设置
export const setDecimalNum = (value) => {
    console.log('value11',value);
    const regExp = /^\d+(?:\.\d{0,2})?/
    let text = value

    // 首先如果是空或者负数
    if(text < 0 || text == '' || text == null) { text = 0; return `0` }
    
    // 如果是0. 返回0.
    else if((text == '0.')){ text = 0;  return `0.`}

    // 处理掉非数字 
    else{ text = text && text.toString().replace(/^[D.]/g, '')
        // 如果超过两位小数，自动剪切掉
        text = text && text.match(regExp) && text.match(regExp)[0]

    return text
    }
}


// 只负责显示
export const displayDecimal = (value) => {
    const regExp = /^\d+(?:\.\d{0,2})?/
    console.log('displayDecimal,value', value);
    if (value == '') return `$`
    else if(value) {
        let text = value.toString().replace(/^[D.]/g, '')
        text = text.replace(/[.]{2}/g, '.')
        text = text.match(regExp) && text.match(regExp)[0]
        text = text ? text : ''
        return `$ ${text}`
    } 
}

export const displayDecimalQuantity = (value) => {
    const regExp = /^\d+(?:\.\d{0,2})?/

    if (value == '') return ``
    else if(value) {
        let text = value.toString().replace(/^[D.]/g, '')
        text = text.replace(/[.]{2}/g, '.')
        text = text.match(regExp) && text.match(regExp)[0]
        text = text ? text : ''
        return `${text}`
    } 
}

export const getPureNumbers = (value) => {
    // 公用函数：处理只能是数字
    let text = value.toString().replace(/^[D]/g, '')
    text = text ? text : ''
    return `${text}`
}