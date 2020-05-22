import AbstractSmartComponent from './abstract-smart-component.js';
import {ACTIVITY_TYPES, TRANSFER_TYPES} from '../const.js';
import {capitalizeFirstLetter, getRandomArrayItem, formatTime, formatDateForEdit, getOffersForCurrentType} from '../utils/common.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import {encode} from 'he';

const DefaultData = {
  deleteButtonText: `Delete`,
  saveButtonText: `Save`,
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


const createEventEditTemplate = (event, options = {}, offersList, destinationsList) => {
  const {startDate, endDate, price, destination, id} = event;
  const {type, currentCity, chosenOffers, externalData} = options;

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

  const startDay = formatDateForEdit(startDate);
  const startTime = formatTime(startDate);
  const endDay = formatDateForEdit(endDate);
  const endTime = formatTime(endDate);

  const isEventFavorite = (event.isFavorite) ? `checked` : ``;
  const preposition = ACTIVITY_TYPES.includes(type) ? `in` : `to`;
  const destinationMarkup = createDestinationMarkup(destination);

  const deleteButtonText = externalData.deleteButtonText;
  const saveButtonText = externalData.saveButtonText;

  return (
    `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
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
            <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time" value="${startDay}T${startTime}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-${id}">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time" value="${endDay} ${endTime}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-${id}">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${saveButtonText}</button>
          <button class="event__reset-btn" type="reset">${deleteButtonText}</button>

          <input id="event-favorite-${id}" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${isEventFavorite}>
          <label class="event__favorite-btn" for="event-favorite-${id}">
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

export default class EventEdit extends AbstractSmartComponent {
  constructor(event, offersModel, destinationsModel) {
    super();

    this._event = event;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._id = event.id;
    this._type = event.type;
    this._chosenOffers = event.chosenOffers;
    this._destination = event.destination;
    this._startDate = event.startDate;
    this._endDate = event.endDate;
    this._currentCity = event.city;
    this._externalData = DefaultData;


    this._submitHandler = null;
    this._typeInputClickHandler = null;
    this._favBtnClickHandler = null;
    this._deleteButtonClickHandler = null;

    this._subscribeOnEvents();

    this._flatpickr = null;
    this._applyFlatpickr();

  }

  getTemplate() {
    return createEventEditTemplate(this._event, {type: this._type, chosenOffers: this._chosenOffers, currentCity: this._currentCity, externalData: this._externalData}, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
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
    this._currentCity = event.city;
    this._destination = event.destination;
    this._currentCity = event.city;

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
        this._offers = getOffersForCurrentType(this._type, JSON.parse(JSON.stringify(this._offersModel.getOffers()))).offers;
        const randomDestination = getRandomArrayItem(this._destinationsModel.getDestinations());
        this._currentCity = randomDestination.city;
        this._event.destination = {
          description: randomDestination.description,
          photos: randomDestination.photos,
        };
        this.rerender();
      });
    });

    const destinationCityInput = element.querySelector(`.event__input--destination`);
    destinationCityInput.addEventListener(`change`, () => {
      this._currentCity = capitalizeFirstLetter(destinationCityInput.value);
      const destination = this._destinationsModel.getDestinations().find((destinationItem) => (destinationItem.city === this._currentCity));
      this._event.destination = {
        description: destination.description,
        photos: destination.photos,
      };
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
