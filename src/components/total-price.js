import {createElement} from "../utils.js";

const totalPrice = 1230;
// доработать - реализовать расчет итоговой стоимости

const createTotalPriceTemplate = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export default class TotalPrice {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTotalPriceTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
