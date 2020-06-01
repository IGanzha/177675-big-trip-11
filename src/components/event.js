import AbstractSmartComponent from "./abstract-smart-component.js";
import moment from 'moment';
import {ACTIVITY_TYPES, CHOSEN_OFFERS_AMOUNT_TO_PREVIEW, MomentFormat} from '../const.js';
import {getTimeDuration} from '../utils/common.js';
import {encode} from 'he';

const createTimeMarkup = (start, end) => {

  const eventDuration = getTimeDuration(start, end);

  return (
    `<p class="event__time">
      <time class="event__start-time" datetime="${moment(start).format(MomentFormat.DATETIME)}">${moment(start).format(MomentFormat.TIME)}</time>
      &mdash;
      <time class="event__end-time" datetime="${moment(end).format(MomentFormat.DATETIME)}">${moment(end).format(MomentFormat.TIME)}</time>
    </p>
    <p class="event__duration">${eventDuration}</p>
    `
  );
};

const createChosenOffersMarkup = (offers, offersAmount = `${offers.length}`) => {
  if (!offers) {
    return ``;
  }

  const chosenOffers = offers.filter((offer) => {
    return offer.isChecked;
  });

  return (chosenOffers.length === 0) ? `` : chosenOffers.slice(0, offersAmount).map((offer)=> {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.title}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }).join(`\n`);
};

const createEventTemplate = (point) => {

  const {type, city: notSanitizedCity, chosenOffers, price, startDate, endDate} = point;

  const shortListChosenOffersMarkup = createChosenOffersMarkup(chosenOffers, CHOSEN_OFFERS_AMOUNT_TO_PREVIEW);
  const timeMarkup = createTimeMarkup(startDate, endDate);
  const preposition = ACTIVITY_TYPES.includes(type) ? `in` : `to`;

  const city = encode(notSanitizedCity);

  return (
    `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${type} ${preposition} ${city}</h3>

        <div class="event__schedule">
          ${timeMarkup}
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${shortListChosenOffersMarkup}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractSmartComponent {
  constructor(point) {
    super();
    this._point = point;
  }

  getTemplate() {
    return createEventTemplate(this._point);
  }

  setEditButtonClickHandler(handler) {

    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
