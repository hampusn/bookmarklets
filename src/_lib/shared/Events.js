const CLICK = 'click';
const CHANGE = 'change';

const add = (el, event, cb) => el.addEventListener(event, cb);
const remove = (el, event, cb) => el.removeEventListener(event, cb);

export default {
  onClick: (el, cb) => add(el, CLICK, cb),
  offClick: (el, cb) => remove(el, CLICK, cb),
  onChange: (el, cb) => add(el, CHANGE, cb),
};
