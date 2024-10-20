import createElement from "./create-element";
import Events from "./Events";
import uid from "./uid";

export class Switch {
  constructor ({ label, description, changeCallback, checkCallback }) {
    this.label = label;
    this.description = description;
    this.changeCallback = changeCallback;
    this.checkCallback = checkCallback;
    this.el = null;
    this.id = uid();

    this.init();
  }

  check () {
    return !!this.checkCallback.call(null, this);
  }

  init () {
    const checked = this.check() ? 'checked' : '';
    const description = this.description ? `<p class="env-text" style="margin: 0 0 var(--env-spacing-x-large) calc(2.625em + var(--env-spacing-x-small))">${this.description}</p>` : '';

    this.el = createElement(
    `<div class="env-form-field">
      <div class="env-form-control">
        <input class="env-switch" type="checkbox" id="${this.id}" name="switches" ${checked} />
        <label class="env-form-label" for="${this.id}">${this.label}</label>
      </div>
      ${description}
    </div>`
    );

    Events.onChange(this.el.querySelector('input'), (event) => this.changeCallback.call(null, this, event));
  }

  appendTo (target) {
    target.appendChild(this.el);
  }
}

export default Switch;
