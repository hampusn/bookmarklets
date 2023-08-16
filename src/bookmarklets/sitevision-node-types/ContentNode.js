const TYPE_INLINE = 'inline';
const TYPE_BLOCK = 'block';
const TYPE_TEXT = 'text';
const TYPE_LINE_BREAK = 'lineBreak';

export default class ContentNode {
  constructor ({ type, htmlName, attributes, content, children }) {
    this.type = type || TYPE_INLINE;
    this.tag = htmlName || (this.type === TYPE_INLINE ? 'span' : this.type === TYPE_BLOCK ? 'div' : '');
    this.attrs = attributes || {};
    this.content = content || '';
    this.children = (children || []).map(child => new ContentNode(child));
    this.delim = this.type === TYPE_BLOCK ? '\n' : ' ';
  }

  render () {
    if (this.type === TYPE_TEXT) {
      return String(this.content);
    }

    if (this.type === TYPE_LINE_BREAK) {
      return '<br>';
    }

    const renderedChildren = this.children.map(child => child.render()).join(this.delim);

    return `<${this.tag}>${renderedChildren}</${this.tag}>`;
  }
}
