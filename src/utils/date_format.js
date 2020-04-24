const moment = require('moment')
export function dateColumnFormat(row, column, cellValue, index) {
  // console.log('===========4444=================', cellValue)
  if (cellValue != null) {
    return moment(cellValue).format('YYYY-MM-DD')
  } else {
    return ''
  }
  // return moment(row.crtDate).format('YYYY-MM-DD HH:mm:ss');
}
export function timeColumnFormat(row, column, cellValue, index) {
  // console.log('===========55=================', cellValue)
  if (cellValue != null) {
    return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return ''
  }
  // return moment(row.crtDate).format('YYYY-MM-DD HH:mm:ss');
}

export default { dateColumnFormat, timeColumnFormat }
