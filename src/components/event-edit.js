import {castDateFormatForEdit, castTimeFormat} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createOffersMarkup = (offers) => {

  return (offers) ? offers.map((offer)=> {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.id}-1" type="checkbox" name="event-offer-${offer.id}">
        <label class="event__offer-label" for="event-offer-${offer.id}-1">
          <span class="event__offer-title">${offer.text}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join(`\n`) : ``;
};

const createDestinationsListMarkup = (cities) => {

  return cities.map((city) => {
    return `<option value=${city}></option>`;
  }).join(`\n`);
};

const createTypesMarkup = (types) => {
  return types.map((type) => {
    const typeInFormat = type.toLowerCase();
    return (
      `<div class="event__type-item">
        <input id="event-type-${typeInFormat}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeInFormat}">
        <label class="event__type-label  event__type-label--${typeInFormat}" for="event-type-${typeInFormat}-1">${type}</label>
      </div>`
    );
  }).join(`\n`);
};


const createEventEditTemplate = (event) => {
  const {type, city, cities, availableOffers, preposition, activityTypes, transferTypes, startDate, endDate, price} = event;

  const offersMarkup = createOffersMarkup(availableOffers, type);

  const hiddenClass = (availableOffers) ? `` : `visually-hidden`;

  const transferTypesMarkup = createTypesMarkup(transferTypes);
  const activityTypesMarkup = createTypesMarkup(activityTypes);
  const destinationsListMarkup = createDestinationsListMarkup(cities);

  const startDay = castDateFormatForEdit(startDate, `/`);
  const startTime = castTimeFormat(startDate);
  const endDay = castDateFormatForEdit(endDate, `/`);
  const endTime = castTimeFormat(endDate);

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">

            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${transferTypesMarkup}
            </fieldset>
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${activityTypesMarkup}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type} ${preposition}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
          <datalist id="destination-list-1">
            ${destinationsListMarkup}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${startDay} ${startTime}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${endDay} ${endTime}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>

        <input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
        <label class="event__favorite-btn" for="event-favorite-1">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </label>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers ${hiddenClass}">
          <h3 class="event__section-title  event__section-title--offers ">Offers</h3>

          <div class="event__available-offers">
            ${offersMarkup}

          </div>
        </section>
      </section>
    </form>`
  );
};

export default class EventEdit extends AbstractComponent {
  constructor(event) {
    super();
    this._event = event;
  }

  getTemplate() {
    return createEventEditTemplate(this._event);
  }

  setSubmitHandler(handler) {
    this.getElement().addEventListener(`submit`, handler);
  }
}
