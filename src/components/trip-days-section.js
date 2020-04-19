import {createElement} from "../utils.js";

const createTripDaysSectionTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class TripDaysSection {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createTripDaysSectionTemplate();
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
