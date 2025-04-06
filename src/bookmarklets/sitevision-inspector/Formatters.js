import NodeTypes from './NodeTypes';
import Icons from './Icons';
import uid from '../../_lib/shared/uid';

const ICONS_DICT = {
  [NodeTypes.ARCHIVE]: Icons.ARCHIVE,
  [NodeTypes.FOLDER]: Icons.FOLDER,
  [NodeTypes.PAGE]: Icons.PAGE,
  [NodeTypes.ARTICLE]: Icons.ARTICLE,
  [NodeTypes.LINK]: Icons.LINK,
  [NodeTypes.GROUP_PAGE]: Icons.GROUP_PAGE,
  [NodeTypes.GROUP_FOLDER]: Icons.GROUP_FOLDER,
  'back': Icons.BACK,
};

export class Formatter {
  constructor (opts = {}) {
    this.emptyText = 'No data found';
    this.caption = '';
    this.headings = ['Property', 'Value'];
    this.data = null;

    this.applyOpts(opts);
  }

  applyOpts (opts) {
    if (opts.emptyText) {
      this.emptyText = opts.emptyText;
    }

    if (opts.caption) {
      this.caption = opts.caption;
    }

    if (opts.headings) {
      this.headings = opts.headings;
    }
  }

  setData (data) {
    this.data = data;
    return this;
  }

  silentStringify (mixed) {
    try {
      return JSON.stringify(mixed, null, 2);
    } catch (_) {}

    return '';
  }

  sanitize (str) {
    const dict = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;',
      // Fix for characters in Unicode Private Use Area
      '\uF03A': ':',
      '\uF02F': '/',
    };

    return str ? String(str).replace(/[&<>"'/\uF03A\uF02F]/g, (match) => dict[match]) : '';
  }

  render () {
    return '';
  }
}

export class TableFormatter extends Formatter {
  render () {
    const data = this.data;
    const dataStr = this.silentStringify(data);
    const s = this.sanitize;
    
    if (!dataStr || dataStr === '{}') {
      return this.emptyText;
    }
    
    const rows = Array.isArray(data) ? data : Object.entries(data);
    const caption = typeof this.caption === 'function' ? this.caption.call(null, data) : this.caption;
    const [ keyHeading, valueHeading ] = this.headings;

    return (
    `<table class="env-table env-table--zebra env-table--small env-w--100">
      <caption class="env-assistive-text">${s(caption)}</caption>
      <thead>
        <tr><th>${keyHeading}</th><th>${valueHeading}</th></tr>
      </thead>
      <tbody>
        ${rows.map(([ key, value ]) =>
          `<tr data-filter-item><td style="white-space:nowrap">${s(key)}</td><td>${s(value)}</td></tr>`
        ).join('')}
      </tbody>
    </table>`
    );
  }
}

export class ListFormatter extends Formatter {
  icon (type) {
    return ICONS_DICT[type] ? String(ICONS_DICT[type]).replace('<svg ', '<svg class="env-icon env-icon--small env-m-right--small" ') : '';
  }

  render () {
    const data = this.data;
    const s = this.sanitize;
    const i = this.icon;

    if (!Array.isArray(data) || data.length === 0) {
      return this.emptyText;
    }
    
    const idPool = Array(data.length).fill().map(() => {
      const id = uid();
      return [
        id + '_btn',
        id + '_menu',
      ];
    });
    
    return (
      `<ul class="env-nav env-nav--sidenav">
        ${data.map((item, j) =>
          `<li class="env-nav__item" style="position:relative;" data-filter-item>
            ${[NodeTypes.PAGE, NodeTypes.ARTICLE, NodeTypes.LINK, NodeTypes.GROUP_PAGE].includes(item.type) ?
              `<a class="env-nav__link env-d--flex env-p-right--xx-large" href="${s(item.properties.URI)}">${i(item.type)}${s(item.name)}</a>`
            :
              // Envision does not yet have utility class for justify-content: start;
              // env-d--flex does not override display of env-button in older SV versions so we need to inline display flex.
              `<button class="env-nav__link env-button env-button--link env-w--100 env-p-right--xx-large" style="justify-content:start;display:flex;border-radius:0;" data-node-id="${s(item.id)}">${i(item.type)}${s(item.name)}</button>`
            }
            ${item.type !== 'back' ?
              `<div class="env-dropdown" style="position:absolute;top:50%;right:0;transform:translateY(-50%);z-index:0;">
                <button id="${idPool[j][0]}" aria-controls="${idPool[j][1]}" class="env-button env-button--slim env-button--icon" type="button" aria-expanded="false" aria-haspopup="menu" data-placement="end" data-dropdown>
                  <svg class="env-icon" style="pointer-events:none;"><use href="/sitevision/envision-icons.svg#icon-menu-dots"></use></svg>
                  <span class="env-assistive-text">${s(item.name)}, actions</span>
                </button>
                <ul id="${idPool[j][1]}" aria-labelledby="${idPool[j][0]}" role="menu" class="env-dropdown__menu">
                  <li role="presentation">
                    <button type="button" role="menuitem" class="env-dropdown__item" data-node-id="${s(item.id)}">Inspect</button>
                  </li>
                  <li role="presentation">
                    <button type="button" role="menuitem" class="env-dropdown__item" data-copy="${s(item.id)}">Copy ID</button>
                  </li>
                </ul>
              </div>`
            :
              ''
            }
          </li>`
        ).join('')}
      </ul>`
    );
  }
}

export class JsonFormatter extends Formatter {
  render () {
    const formattedData = this.silentStringify(this.data);

    if (!formattedData || formattedData === '{}') {
      return this.emptyText;
    }

    return (
      `<pre style="background-color:var(--env-ui-color-brand-10);color:var(--env-ui-color-brand-10-contrast);overflow:scroll;padding:1em;"><code>${formattedData}</code></pre>`
    );
  }
}

export default {
  TableFormatter,
  ListFormatter,
  JsonFormatter,
};
