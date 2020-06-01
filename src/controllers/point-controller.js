import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import PointModel from '../models/point.js';
import {capitalizeFirstLetter, getOffersForCurrentType} from '../utils/common.js';
import {render, replace, remove} from '../utils/render.js';
import {RenderPosition, SHAKE_ANIMATION_TIMEOUT} from '../const.js';

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export let EmptyPoint = {
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
  const chosenDestination = destinations.find((destinationItem) => (destinationItem.city === city));

  const destination = (city) ? {
    name: city,
    description: chosenDestination.description,
    pictures: chosenDestination.photos,
  } : {
    name: ``,
    description: null,
    pictures: null,
  };

  return new PointModel({
    'id': editFormData.get(`pointId`),
    'type': capitalizeFirstLetter(chosenTypes[0]),
    'destination': destination,
    'date_from': new Date(editFormData.get(`event-start-time`)),
    'date_to': new Date(editFormData.get(`event-end-time`)),
    'base_price': editFormData.get(`event-price`),
    'offers': getOffers(editFormData, offersForThisType.offers),
    'is_favorite': (editFormData.get(`event-favorite`) === `on`),
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
    this._point = null;
    this._sourcePoint = null;
    this._tempPoint = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point, mode) {
    this._mode = mode;
    this._point = (mode === Mode.EDIT) ? this._tempPoint : JSON.parse(JSON.stringify(point));

    if (!this._sourcePoint) {
      this._sourcePoint = (this._mode === Mode.ADDING) ? JSON.parse(JSON.stringify(EmptyPoint)) : PointModel.clone(point);
    }
    this._sourcePoint.isFavorite = point.isFavorite;

    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;


    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(this._point, this._offersModel, this._destinationsModel);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setFavoritesButtonClickHandler(() => {
      const newPoint = PointModel.clone(this._sourcePoint);
      newPoint.isFavorite = !newPoint.isFavorite;

      const formData = this._eventEditComponent.getData();
      const pointNewData = parseFormData(formData, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
      this._point = Object.assign(this._point, pointNewData, {
        isFavorite: newPoint.isFavorite,
      });
      this._tempPoint = Object.assign({}, this._point);
      this._onDataChange(this, newPoint, newPoint, true);
    });

    this._eventEditComponent.setChangeTypeHandler((evt) => {
      const selectedType = evt.target.parentNode.querySelector(`.event__type-input`).value;
      if (capitalizeFirstLetter(selectedType) === this._point.type) {
        return;
      }
      const formData = this._eventEditComponent.getData();
      const pointNewData = parseFormData(formData, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
      this._point = Object.assign(this._point, pointNewData, {
        type: capitalizeFirstLetter(selectedType),
        chosenOffers: [],
      });

      this._eventEditComponent.rerender();
    });

    this._eventEditComponent.setChangeDestinationHandler((evt) => {
      const formData = this._eventEditComponent.getData();
      const pointNewData = parseFormData(formData, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
      this._point = Object.assign(this._point, pointNewData, {
        city: evt.target.value,
      });

      this._eventEditComponent.rerender();
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const formData = this._eventEditComponent.getData();
      const pointNewData = parseFormData(formData, this._offersModel.getOffers(), this._destinationsModel.getDestinations());
      this._eventEditComponent.setData({
        saveButtonText: `Saving...`,
        isFormDisabled: true,
      });
      this._onDataChange(this, point, pointNewData);

      this._resetEmptyPoint();
    });

    this._eventEditComponent.setDeleteButtonClickHandler(() => {
      this._eventEditComponent.setData({
        deleteButtonText: `Deleting...`,
        isFormDisabled: true,
      });
      this._onDataChange(this, point, null);
      this._resetEmptyPoint();
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

      case Mode.EDIT:
        if (oldEventEditComponent && oldEventComponent) {
          replace(this._eventComponent, oldEventComponent);
          replace(this._eventEditComponent, oldEventEditComponent);
        }
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._eventEditComponent);
    remove(this._eventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._resetEmptyPoint();
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
    if (this._mode === Mode.ADDING) {
      this._resetEmptyPoint();
      this._onDataChange(this, EmptyPoint, null);
    } else {
      this._point = Object.assign({}, this._sourcePoint);
    }

    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._eventEditComponent.reset(this._point);
    if (document.contains(this._eventEditComponent.getElement())) {
      replace(this._eventComponent, this._eventEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  _resetEmptyPoint() {
    if (this._mode === Mode.ADDING) {
      EmptyPoint = JSON.parse(JSON.stringify(this._sourcePoint));
    }
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._resetEmptyPoint();
        this._onDataChange(this, EmptyPoint, null);
      }
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
