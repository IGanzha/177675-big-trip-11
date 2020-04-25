import {getRandomArray} from '../mock/trip-event.js';
import {getTwoNumbersFormat, castDateFormat, castTimeFormat} from '../utils/common.js';
import AbstractSmartComponent from "./abstract-smart-component.js";

const CHOSEN_OFFERS_TO_PREVIEW = 3;
const MILISEC_IN_DAY = 1000 * 60 * 60 * 24;
const MILISEC_IN_HOUR = 1000 * 60 * 60;
const MILISEC_IN_MINUTE = 1000 * 60;

const createTimeMarkup = (start, end) => {

  const startDay = castDateFormat(start, `-`);
  const startTime = castTimeFormat(start);
  const endDay = castDateFormat(end, `-`);
  const endTime = castTimeFormat(end);

  const duration = end - start;

  const durationDays = getTwoNumbersFormat(Math.floor(duration / MILISEC_IN_DAY));
  const durationHours = getTwoNumbersFormat(Math.floor((duration % MILISEC_IN_DAY) / MILISEC_IN_HOUR));
  const durationMinutes = getTwoNumbersFormat(Math.floor(((duration % MILISEC_IN_DAY) % MILISEC_IN_HOUR) / MILISEC_IN_MINUTE));

  const eventDuration = `${(durationDays >= 1) ? `${durationDays}D` : ``} ${(durationDays >= 1 || durationHours >= 1) ? `${durationHours}H` : ``} ${durationMinutes}M`;

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

const createChosenOffersMarkup = (chosenOffersArray, amount = `${chosenOffersArray.length}`) => {

  return (chosenOffersArray.length === 0) ? `` : chosenOffersArray.slice(0, amount).map((offer)=> {
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

  const {type, city, availableOffers, price, preposition, startDate, endDate} = event;


  const chosenOffers = getRandomArray(availableOffers);
  const shortChosenOffersMarkup = createChosenOffersMarkup(chosenOffers, CHOSEN_OFFERS_TO_PREVIEW);
  const timeMarkup = createTimeMarkup(startDate, endDate);
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
          ${shortChosenOffersMarkup}
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
