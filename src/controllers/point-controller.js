import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import PointModel from '../models/point.js';
import {capitalizeFirstLetter, getOffersForCurrentType} from '../utils/common.js';
import {render, replace, remove, RenderPosition} from '../utils/render.js';

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  id: `new`,
  type: `Flight`,
  city: ``,
  destination: {},
  chosenOffers: [],
  price: 0,
  startDate: new Date(),
  endDate: new Date(),
  isFavorite: false,
};

const parseFormData = (editFormData, allOffersFromServer, destinations) => {

  const chosenTypes = editFormData.getAll(`event-type`);
  const offersForThisType = getOffersForCurrentType(capitalizeFirstLetter(chosenTypes[0]), JSON.parse(JSON.stringify(allOffersFromServer)));

  const getOffers = (formData, allOffers) => {

    if (!allOffers) {
      return [];

    } else {

      const allOffersNames = [];
      allOffers.forEach((offer) => {
        allOffersNames.push(offer.title);
      });

      const chosenOffersNames = [];
      allOffersNames.forEach((offer) => {
        if (formData.get(offer)) {
          chosenOffersNames.push(offer);
        }
      });

      const chosenOffers = [];
      chosenOffersNames.forEach((offerName) => {
        allOffers.forEach((offer) => {
          if (offer.title === offerName) {
            chosenOffers.push(offer);
          }
        });
      });

      return chosenOffers;
    }
  };

  const city = editFormData.get(`event-destination`);

  const destination = destinations.find((destinationItem) => (destinationItem.city === city));

  return new PointModel({
    "id": editFormData.get(`pointId`),
    "type": capitalizeFirstLetter(chosenTypes[0]),
    "destination": {
      name: city,
      description: destination.description,
      pictures: destination.photos,
    },
    "date_from": new Date(editFormData.get(`event-start-time`)),
    "date_to": new Date(editFormData.get(`event-end-time`)),
    "base_price": editFormData.get(`event-price`),
    "offers": getOffers(editFormData, offersForThisType.offers),
    "is_favorite": (editFormData.get(`event-favorite`) === `on`) ? true : false,
  });
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offersModel, destinationsModel) {
    this._container = container;
    this._mode = Mode.DEFAULT;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;
    this._mode = mode;

    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(point, this._offersModel, this._destinationsModel);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const newPoint = PointModel.clone(point);
      newPoint.isFavorite = !newPoint.isFavorite;
      this._onDataChange(this, point, newPoint);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const data = parseFormData(formData, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
      this._eventEditComponent.setData({
        saveButtonText: `Saving...`,
        isFormDisabled: true,
      });
      this._onDataChange(this, point, data);
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._eventEditComponent.setData({
        deleteButtonText: `Deleting...`,
        isFormDisabled: true,
      });
      this._onDataChange(this, point, null);
    });

    this._eventEditComponent.setCloseEditFormButton(() => {
      this._replaceEditToEvent();
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        } else {
          render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEventEditComponent && oldEventComponent) {
          remove(oldEventComponent);
          remove(oldEventEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._eventEditComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {

    if (this._mode === Mode.ADDING) {
      this._onDataChange(this, EmptyPoint, null);
    }

    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  disableEditForm() {

  }

  shake() {
    this._eventEditComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._eventComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    this._eventEditComponent.getElement().querySelector(`form.event--edit`).classList.add(`shake`);

    setTimeout(() => {
      this._eventEditComponent.getElement().style.animation = ``;
      this._eventComponent.getElement().style.animation = ``;

      this._eventEditComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
        isFormDisabled: false,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._eventEditComponent, this._eventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset();
    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
