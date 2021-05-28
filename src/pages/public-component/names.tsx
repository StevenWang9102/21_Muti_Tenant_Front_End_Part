

const STAFF_DISPLAY_NAME = 'STAFF_DISPLAY_NAME'
const staffName = localStorage.getItem(STAFF_DISPLAY_NAME) || 'Beautician'

export const WAITING_DATA = 'Waiting data...'
export const ALL_BRANCH = 'All Branches'
export const ALL_LOCATION = 'All Location'
export const ALL_BEAUTICIAN = `All ${staffName}`
export const ALL_STAFF = `All Staff`
export const MY_STAFF_NAME = staffName
export const MY_STAFF_NAME_LOWER = staffName.toLowerCase()
export const MY_STAFF_NAME_UPPER = staffName.replace(/^\S/, s => s.toUpperCase())


// import { WAITING_DATA, ALL_BRANCH, ALL_LOCATION,  ALL_BEAUTICIAN, MY_STAFF_NAME, MY_STAFF_NAME_LOWER, MY_STAFF_NAME_UPPER}  from '../../../public-component/names'
