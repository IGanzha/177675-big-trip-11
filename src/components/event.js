import AbstractSmartComponent from "./abstract-smart-component.js";
import {ACTIVITY_TYPES} from '../const.js';
import {formatDate, formatTime, getFormattedTimeDuration} from '../utils/common.js';


const CHOSEN_OFFERS_TO_PREVIEW = 3;

const createTimeMarkup = (start, end) => {

  const startDay = formatDate(start);
  const startTime = formatTime(start);
  const endDay = formatDate(end);
  const endTime = formatTime(end);

  const eventDuration = getFormattedTimeDuration(start, end);

  return (
    `<p class="event__time">
      <time class="event__start-time" datetime="${startDay}T${startTime}">${startTime}</time>
      &mdash;
      <time class="event__end-time" datetime="${endDay}T${endTime}">${endTime}</time>
    </p>
    <p class="event__duration">${eventDuration}</p>
    `
  );
};

const createChosenOffersMarkup = (offersArray, offersAmount = `${offersArray.length}`) => {

  if (!offersArray) {
    return ``;
  }

  const chosenOffers = offersArray.filter((offer) => {

    return offer.checked;
  });

  return (chosenOffers.length === 0) ? `` : chosenOffers.slice(0, offersAmount).map((offer)=> {
    return (
      `<li class="event__offer">
        <span class="event__offer-title">${offer.text}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </li>`
    );
  }).join(`\n`);

};


const createEventTemplate = (event) => {

  const {type, city, offers, price, startDate, endDate} = event;
  const shortListChosenOffersMarkup = createChosenOffersMarkup(offers, CHOSEN_OFFERS_TO_PREVIEW);
  const timeMarkup = createTimeMarkup(startDate, endDate);
  const preposition = ACTIVITY_TYPES.includes(type) ? `in` : `to`;

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
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventTemplate(this._event);
  }

  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, handler);
  }
}
