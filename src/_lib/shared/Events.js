const CLICK = 'click';
const CHANGE = 'change';
const INPUT = 'input';
const KEYDOWN = 'keydown';

const add = (el, event, cb) => el.addEventListener(event, cb);
const remove = (el, event, cb) => el.removeEventListener(event, cb);

export default {
  onClick: (el, cb) => add(el, CLICK, cb),
  offClick: (el, cb) => remove(el, CLICK, cb),
  onChange: (el, cb) => add(el, CHANGE, cb),
  onInput: (el, cb) => add(el, INPUT, cb),
  onKeydown: (el, cb) => add(el, KEYDOWN, cb),
};
