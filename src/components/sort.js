import AbstractSmartComponent from './abstract-smart-component.js';
import {SortType} from '../const.js';

const createSortTemplate = (sortType) => {
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">Day</span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" ${sortType === SortType.EVENTS_UP ? `checked` : ``}>
        <label data-sort-type="${SortType.EVENTS_UP}" class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time"  class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" ${sortType === SortType.TIME_DOWN ? `checked` : ``}>
        <label data-sort-type="${SortType.TIME_DOWN}" class="trip-sort__btn" for="sort-time">
          Time
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" ${sortType === SortType.PRICE_DOWN ? `checked` : ``}>
        <label data-sort-type="${SortType.PRICE_DOWN}" class="trip-sort__btn" for="sort-price">
          Price
          <svg class="trip-sort__direction-icon" width="8" height="10" viewBox="0 0 8 10">
            <path d="M2.888 4.852V9.694H5.588V4.852L7.91 5.068L4.238 0.00999987L0.548 5.068L2.888 4.852Z"/>
          </svg>
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`
  );
};

export default class Sort extends AbstractSmartComponent {
  constructor() {
    super();
    this._handler = null;

    this._currentSortType = SortType.EVENTS_UP;
  }

  getTemplate() {
    return createSortTemplate(this._currentSortType);
  }

  getSortType() {
    return this._currentSortType;
  }

  recoveryListeners() {
    this.setSortTypeChangeHandler(this._handler);
  }

  setDefaultView(isSortHidden) {
    this._currentSortType = SortType.EVENTS_UP;
    this.rerender();
    if (isSortHidden) {
      this.hide();
    }
  }

  setSortTypeChangeHandler(handler) {
    this._handler = handler;
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `LABEL`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;
      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
      this.rerender();
    });
  }
}
