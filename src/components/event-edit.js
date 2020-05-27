import AbstractSmartComponent from './abstract-smart-component.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import moment from 'moment';

import {ACTIVITY_TYPES, TRANSFER_TYPES, MomentFormat, flatpickrConfig} from '../const.js';
import {encode} from 'he';
import {capitalizeFirstLetter, getRandomArrayItem, getOffersForCurrentType} from '../utils/common.js';

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
  isFormDisabled: false
};

const createCitiesPattern = (citiesList) => {
  return citiesList.map((city) => {
    return `[` + city[0].toUpperCase() + city[0].toLowerCase() + `]` + city.slice(1);
  }).join(`|`);
};


const getFinalOffers = (allOffers, chosenOffers) => {
  if (!allOffers) {
    return [];
  }

  if (!chosenOffers) {
    return allOffers;
  }

  const finalOffers = [];

  allOffers.forEach((offerAll) => {
    for (let i = 0; i < chosenOffers.length; i++) {
      if (offerAll.title === chosenOffers[i].title) {
        offerAll.isChecked = true;
        break;
      } else {
        offerAll.isChecked = false;
      }
    }

    finalOffers.push(offerAll);
  });

  return finalOffers;
};


const createOffersDataMarkup = (offers, index) => {
  if (!offers || offers.length === 0) {
    return ``;
  }

  const offersMarkup = offers.map((offer)=> {
    return (
      `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="${offer.title}-${index}" type="checkbox" name="${offer.title}" ${(offer.isChecked) ? `checked` : ``}>
        <label class="event__offer-label" for="${offer.title}-${index}">
          <span class="event__offer-title">${offer.title}</span>
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

const createDestinationCityListMarkup = (cities) => {

  return cities.map((city) => {
    return `<option value=${city}></option>`;
  }).join(`\n`);
};

const createTypesMarkup = (types, chosenType, index) => {
  return types.map((type) => {
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
  if (!destination.description && !destination.photos) {
    return ``;
  }

  const createPhotosMarkup = (photos) => {
    if (!photos) {
      return ``;
    }
    const images = photos.map((photo) => {
      return `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;
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

const createResetButton = (point, buttonsText) => {
  if (point.id !== `new`) {
    return `<button class="event__reset-btn" type="reset">${buttonsText.deleteButtonText}</button>`;
  } else {
    return `<button class="event__reset-btn" type="reset">Cancel</button>`;
  }
};

const createRollUpButton = (point) => {
  return (point.id !== `new`) ? (
    `<button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`) : ``;
};

const createEventEditTemplate = (point, options = {}, offersList, destinationsList) => {
  const {type, chosenOffers, startDate, endDate, price, destination, id} = point;
  const {currentCity, externalData} = options;

  const offersForCurrentType = getOffersForCurrentType(type, JSON.parse(JSON.stringify(offersList)));
  const offers = getFinalOffers(offersForCurrentType.offers, JSON.parse(JSON.stringify(chosenOffers)));

  const offersDataMarkup = createOffersDataMarkup(offers, id);

  const citiesList = destinationsList.slice().map((destinationItem) => {
    return destinationItem.city;
  });

  const transferTypesMarkup = createTypesMarkup(TRANSFER_TYPES, type, id);
  const activityTypesMarkup = createTypesMarkup(ACTIVITY_TYPES, type, id);

  const destinationCityListMarkup = createDestinationCityListMarkup(citiesList);
  const citiesPattern = createCitiesPattern(citiesList);

  const city = encode(currentCity);

  const preposition = ACTIVITY_TYPES.includes(type) ? `in` : `to`;
  const destinationMarkup = createDestinationMarkup(destination);

  const saveButtonText = externalData.saveButtonText;

  const resetButton = createResetButton(point, externalData);
  const rollUpButton = createRollUpButton(point);

  return (
    `<li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

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
            <label class="event__label  event__type-output" for="event-destination-${id}">
              ${type} ${preposition}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-${id}" type="text" name="event-destination" value="${city}" list="destination-list-${id}" required pattern="${citiesPattern}">
            <datalist id="destination-list-${id}">
              ${destinationCityListMarkup}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-${id}">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${moment(startDate).format(MomentFormat.EDIT)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${moment(endDate).format(MomentFormat.EDIT)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
          ${resetButton}

          <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${(point.isFavorite) ? `checked` : ``}>
          <label class="event__favorite-btn ${(id === `new`) ? `visually-hidden` : ``}" for="event-favorite-${id}">
            <span class="visually-hidden">Add to favorite</span>
            <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
              <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
            </svg>
          </label>

          ${rollUpButton}

        </header>
        <section class="event__details">
          ${offersDataMarkup}
          ${destinationMarkup}
        </section>
      </form>
    </li>`
  );
};

export default class EventEdit extends AbstractSmartComponent {
  constructor(point, offersModel, destinationsModel) {
    super();

    this._point = point;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._currentCity = point.city;
    this._externalData = DefaultData;

    this._submitHandler = null;
    this._favoriteButtonClickHandler = null;
    this._deleteButtonClickHandler = null;
    this._closeEditFormButtonHandler = null;

    this._subscribeOnEvents();

    this._startDateFlatpickr = null;
    this._endDateFlatpickr = null;
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEventEditTemplate(this._point, {currentCity: this._currentCity, externalData: this._externalData}, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
  }

  getData() {
    const form = this.getElement().querySelector(`.event--edit`);
    const formData = new FormData(form);
    formData.append(`pointId`, this._id);
    return formData;
  }

  setData(data) {
    this._externalData = Object.assign({}, DefaultData, data);
    this.rerender();
    this._disableForm();
  }

  rerender() {
    super.rerender();
    this._applyFlatpickr();
  }

  reset() {
    const point = this._point;
    this._currentCity = point.city;
    this.rerender();
  }

  removeElement() {
    if (this._endDateFlatpickr) {
      this._endDateFlatpickr.destroy();
      this._endDateFlatpickr = null;
    }

    if (this._startDateFlatpickr) {
      this._startDateFlatpickr.destroy();
      this._startDateFlatpickr = null;
    }

    super.removeElement();
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setFavoritesButtonClickHandler(this._favoriteButtonClickHandler);
    this.setDeleteButtonClickHandler(this._deleteButtonClickHandler);
    this.setCloseEditFormButton(this._closeEditFormButtonHandler);
    this._subscribeOnEvents();
  }

  setSubmitHandler(handler) {
    this.getElement().querySelector(`form`)
      .addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, handler);
    this._favoriteButtonClickHandler = handler;
  }

  setDeleteButtonClickHandler(handler) {
    this.getElement().querySelector(`.event__reset-btn`)
      .addEventListener(`click`, handler);
    this._deleteButtonClickHandler = handler;
  }

  setCloseEditFormButton(handler) {
    const closeEditFormButton = this.getElement().querySelector(`.event__rollup-btn`);
    if (closeEditFormButton) {
      closeEditFormButton.addEventListener(`click`, handler);
      this._closeEditFormButtonHandler = handler;
    }
  }

  _disableForm() {
    this.getElement().querySelectorAll(`input, button`).forEach((element) => {
      element.disabled = this._externalData.isFormDisabled;
    });
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    const typeLabels = element.querySelectorAll(`.event__type-label`);
    typeLabels.forEach((label) => {
      label.addEventListener(`click`, (evt) => {
        const type = evt.target.parentNode.querySelector(`.event__type-input`).value;
        this._point.type = capitalizeFirstLetter(type);
        const randomDestination = getRandomArrayItem(this._destinationsModel.getDestinations());
        this._currentCity = randomDestination.city;
        this._point.destination = {
          description: randomDestination.description,
          photos: randomDestination.photos,
        };
        this.rerender();
        this._point.destination = {};
      });
    });

    const destinationCityInput = element.querySelector(`.event__input--destination`);
    destinationCityInput.addEventListener(`change`, () => {
      if (destinationCityInput.value) {
        this._currentCity = capitalizeFirstLetter(destinationCityInput.value);
        const destination = this._destinationsModel.getDestinations().find((destinationItem) => (destinationItem.city === this._currentCity));
        this._point.destination = {
          description: destination.description,
          photos: destination.photos,
        };
      } else {
        this._point.destination = {};
      }
      this.rerender();
      this._point.destination = {};
    });
  }

  _applyFlatpickr() {

    if (this._startDateFlatpickr || this._endDateFlatpickr) {

      this._startDateFlatpickr.destroy();
      this._startDateFlatpickr = null;

      this._endDateFlatpickr.destroy();
      this._endDateFlatpickr = null;
    }

    const dateElements = this.getElement().querySelectorAll(`.event__input--time`);
    const startDateInput = dateElements[0];
    const endDateInput = dateElements[1];

    this._startDateFlatpickr = flatpickr(startDateInput, Object.assign({}, flatpickrConfig, {
      defaultDate: this._point.startDate || `today`,
      onClose: (selectedDates, dateStr) => {
        this._point.startDate = dateStr;
        this._endDateFlatpickr.set(`minDate`, dateStr);
        this._endDateFlatpickr.open();
      },
    }));

    this._endDateFlatpickr = flatpickr(endDateInput, Object.assign({}, flatpickrConfig, {
      minDate: startDateInput.value,
      defaultDate: this._point.endDate || `today`,
      onClose: (selectedDates, dateStr) => {
        this._point.endDate = dateStr;
      },
    }));
  }
}
