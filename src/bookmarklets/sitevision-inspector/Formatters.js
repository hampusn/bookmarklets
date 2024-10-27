import NodeTypes from './NodeTypes';
import Icons from './Icons';

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
    this.emptyText = 'No data found',
    this.data = null;

    this.applyOpts(opts);
  }

  applyOpts (opts) {
    if (opts.emptyText) {
      this.emptyText = opts.emptyText;
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

    return (
    `<table class="env-table env-table--zebra env-table--small env-w--100">
      <caption class="env-assistive-text">Properties for ${s(data.articleName || data.displayName)}</caption>
      <thead>
        <tr><th>Property</th><th>Value</th></tr>
      </thead>
      <tbody>
        ${Object.entries(data).map(([ key, value ]) =>
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

    return (
      `<ul class="env-nav env-nav--sidenav">
        ${data.map(item =>
          `<li class="env-nav__item" data-filter-item>
            ${[NodeTypes.PAGE, NodeTypes.ARTICLE, NodeTypes.LINK, NodeTypes.GROUP_PAGE].includes(item.type) ?
              `<a class="env-nav__link env-d--flex" href="${s(item.properties.URI)}">${i(item.type)}${s(item.name)}</a>`
            :
              // Envision does not yet have utility class for justify-content: start;
              // env-d--flex does not override display of env-button in older SV versions so we need to inline display flex.
              `<button class="env-nav__link env-button env-button--link env-w--100" style="justify-content: start; display: flex;" data-node-id="${s(item.id)}">${i(item.type)}${s(item.name)}</button>`
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
