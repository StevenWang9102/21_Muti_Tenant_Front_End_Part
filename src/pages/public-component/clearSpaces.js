// import {clearSpaces} from '../../public-component/clearSpaces'

export const clearSpaces = (value) =>{
    const regExp = /^[\s]*/ // 去掉前面的N个空格
    return value && value.replace(regExp, "")
}
