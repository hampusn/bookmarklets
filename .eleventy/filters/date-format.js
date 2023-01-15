const { parseISO, isDate, format } = require('date-fns');

module.exports = {
  name: 'dateFormat',
  filter (date, dateFormat = 'yyyy-MM-dd') {
    return date ? format(isDate(date) ? date : parseISO(date), dateFormat) : '';
  }
};
