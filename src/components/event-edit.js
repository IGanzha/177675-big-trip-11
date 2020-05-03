import AbstractSmartComponent from './abstract-smart-component.js';
import {CITIES, ACTIVITY_TYPES, TRANSFER_TYPES} from '../const.js';
import {capitalizeFirstLetter, formatTime, formatDateForEdit} from '../utils/common.js';
import {offersForTypes, getRandomArrayItem, generateDestination} from '../mock/trip-event.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

const createOffersDataMarkup = (offers, index) => {
  if (!offers) {
    return ``;
  }

  const offersMarkup = offers.map((offer)=> {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.id}-${index}" type="checkbox" name="${offer.id}" ${(offer.checked) ? `checked` : ``}>
        <label class="event__offer-label" for="${offer.id}-${index}">
          <span class="event__offer-title">${offer.text}</span>
          &plus;
          &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
        </label>
      </div>`
    );
  }).join(`\n`);


  return (
    `<section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers ">Offers</h3>
      <div class="event__available-offers">
        ${offersMarkup}
      </div>
    </section>`
  );
};

const createDestinationsListMarkup = (cities) => {

  return cities.map((city) => {
    return `<option value=${city}></option>`;
  }).join(`\n`);
};

const createTypesMarkup = (typesArr, chosenType, index) => {
  return typesArr.map((type) => {
    const typeInFormat = type.toLowerCase();
    return (
      `<div class="event__type-item">
        <input id="event-type-${typeInFormat}-${index}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeInFormat}" ${type === chosenType ? `checked` : ``}>
        <label class="event__type-label event__type-label--${typeInFormat}" for="event-type-${typeInFormat}-${index}">${type}</label>
      </div>`
    );
  }).join(`\n`);
};

const createDestinationMarkup = (destination) => {
  if (!destination) {
    return ``;
  }

  const createPhotosMarkup = (photoURLs) => {
    if (!photoURLs) {
      return ``;
    }
    const images = photoURLs.map((URL) => {
      return `<img class="event__photo" src="${URL}" alt="Event photo">`;
    }).join(`\n`);

    return (
      `<div class="event__photos-container">
        <div class="event__photos-tape">
          ${images}
        </div>
      </div>`
    );
  };

  const descriptionMarkup = `<p class="event__destination-description"> ${destination.description} </p>`;
  const photosMarkup = createPhotosMarkup(destination.photos);

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${descriptionMarkup}
      ${photosMarkup}
    </section>`
  );
};


const createEventEditTemplate = (event, options = {}, index) => {
  const {startDate, endDate, price, destination} = event;
  const {type, city, offers} = options;
  const offersDataMarkup = createOffersDataMarkup(offers, index);

  const transferTypesMarkup = createTypesMarkup(TRANSFER_TYPES, type, index);
  const activityTypesMarkup = createTypesMarkup(ACTIVITY_TYPES, type, index);
  const destinationsListMarkup = createDestinationsListMarkup(CITIES);

  const startDay = formatDateForEdit(startDate);
  const startTime = formatTime(startDate);
  const endDay = formatDateForEdit(endDate);
  const endTime = formatTime(endDate);

  const isEventFavorite = (event.isFavorite) ? `checked` : ``;
  const preposition = ACTIVITY_TYPES.includes(type) ? `in` : `to`;
  const destinationMarkup = createDestinationMarkup(destination);

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${index}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${index}" type="checkbox">

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
            <label class="event__label  event__type-output" for="event-destination-${index}">
              ${type} ${preposition}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${index}" type="text" name="event-destination" value="${city}" list="destination-list-${index}">
            <datalist id="destination-list-${index}">
              ${destinationsListMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${index}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${index}" type="text" name="event-start-time" value="${startDay} ${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${index}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${index}" type="text" name="event-end-time" value="${endDay} ${endTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${index}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${index}" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          <input id="event-favorite-${index}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isEventFavorite}>
          <label class="event__favorite-btn" for="event-favorite-${index}">
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
          ${offersDataMarkup}
          ${destinationMarkup}
        </section>
      </form>
    </li>`
  );
};

const parseFormData = (editFormData, allOffersArr) => {

  const getOffers = (formData, allOffers) => {

    if (!allOffers) {
      return [];
    } else {

      const allOffersNames = [];
      allOffers.forEach((offer) => {
        allOffersNames.push(offer.id);
      });

      const chosenOffersNames = [];
      allOffersNames.forEach((offer) => {
        if (formData.get(offer)) {
          chosenOffersNames.push(offer);
        }
      });

      return allOffers.map((offer) => {
        if (chosenOffersNames.includes(offer.id)) {
          return Object.assign({}, offer, {
            checked: true,
          });
        } else {
          return Object.assign({}, offer, {
            checked: false,
          });
        }
      });
    }
  };

  const chosenTypesArr = editFormData.getAll(`event-type`);

  return {
    type: capitalizeFirstLetter(chosenTypesArr[0]),
    city: editFormData.get(`event-destination`),
    startDate: editFormData.get(`event-start-time`),
    endDate: editFormData.get(`event-end-time`),
    price: editFormData.get(`event-price`),
    offers: getOffers(editFormData, allOffersArr),
  };
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, index) {
    super();

    this._event = event;

    this._index = index;
    this._type = event.type;
    this._city = event.city;
    this._offers = event.offers;
    this._cities = CITIES;
    this._destination = event.destination;
    this._startDate = event.startDate;
    this._endDate = event.endDate;

    this._submitHandler = null;
    this._typeInputClickHandler = null;
    this._favBtnClickHandler = null;
    this._deleteButtonClickHandler = null;

    this._subscribeOnEvents();

    this._flatpickr = null;
    this._applyFlatpickr();

  }

  getTemplate() {
    return createEventEditTemplate(this._event, {type: this._type, city: this._city, offers: this._offers}, this._index);
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);
    return parseFormData(formData, this._offers);
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`).addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const event = this._event;
    this._type = event.type;
    this._city = event.city;
    this._destination = event.destination;

    this.rerender();
  }

  removeElement() {
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._favBtnClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this._subscribeOnEvents();
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
    this._favBtnClickHandler = handler;
  }

  setTypeInputClickHandler(handler) {
    this.getElement().querySelector(`.event__type-btn`)
      .addEventListener(`click`, handler);
    this._typeInputClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);

    this._deleteButtonClickHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const typeLabels = element.querySelectorAll(`.event__type-label`);
    typeLabels.forEach((label) => {
      label.addEventListener(`click`, (evt) => {
        const type = evt.target.parentNode.querySelector(`.event__type-input`).value;

        this._type = capitalizeFirstLetter(type);
        this._offers = offersForTypes[this._type];
        this._city = getRandomArrayItem(this._cities);
        this._event.destination = generateDestination();
        this.rerender();
      });
    });

    const destinationCityInput = element.querySelector(`.event__input--destination`);
    destinationCityInput.addEventListener(`change`, () => {
      this._city = destinationCityInput.value;
      this._event.destination = generateDestination();
      this.rerender();
    });
  }

  _applyFlatpickr() {

    const dateFormat = `d/m/y H:i`;
    const enableTime = true;
    if (this._flatpickr) {
      this._flatpickr.destroy();
      this._flatpickr = null;
    }

    const dateElements = this.getElement().querySelectorAll(`.event__input--time`);
    this._flatpickr = flatpickr(dateElements[0], {
      enableTime,
      dateFormat,
      defaultDate: this._startDate,
    });

    this._flatpickr = flatpickr(dateElements[1], {
      enableTime,
      dateFormat,
      defaultDate: this._endDate,
    });
  }
}
