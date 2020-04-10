let moment = require('moment')
export function dateColumnFormat(row, column, cellValue, index) {
  //console.log('===========4444=================', cellValue)
  return moment(cellValue).format('YYYY-MM-DD')
  //return moment(row.crtDate).format('YYYY-MM-DD HH:mm:ss');
}
export function timeColumnFormat(row, column, cellValue, index) {
  //console.log('===========55=================', cellValue)
  return moment(cellValue).format('YYYY-MM-DD HH:mm:ss')
  //return moment(row.crtDate).format('YYYY-MM-DD HH:mm:ss');
}

export default {dateColumnFormat,timeColumnFormat}
