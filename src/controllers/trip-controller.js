import DayComponent from '../components/day.js';
import LoadingMessageComponent from '../components/loading-message.js';
import NoEventsComponent from '../components/no-events.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point-controller.js';
import SortComponent from '../components/sort.js';
import TripDaysSectionComponent from '../components/trip-days-section.js';

import {FilterType, RenderPosition, SortType} from '../const.js';
import {getGroupedByDayPoints} from '../utils/common.js';
import {render} from '../utils/render.js';

const createNewPointEvent = new Event(`addNewPointButtonClick`);

const renderPoints = (eventList, points, sortType, onDataChange, onViewChange, offersModel, destinationsModel) => {
  const groupedByDayPoints = getGroupedByDayPoints(points, sortType);
  const newPoints = [];
  let dayNumber = 0;
  for (const day of Object.keys(groupedByDayPoints)) {
    dayNumber++;
    const dayComponent = new DayComponent(day, dayNumber);
    render(eventList, dayComponent, RenderPosition.BEFOREEND);
    const dayPointsListElement = dayComponent.getElement().querySelector(`.trip-events__list`);
    const dayPoints = groupedByDayPoints[day];
    dayPoints.forEach((point) => {
      const pointController = new PointController(dayPointsListElement, onDataChange, onViewChange, offersModel, destinationsModel);
      pointController.render(point, PointControllerMode.DEFAULT);
      newPoints.push(pointController);
    });
  }
  return newPoints;
};

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  switch (sortType) {
    case SortType.TIME_DOWN:

      sortedPoints = points.slice().sort((first, second) => {
        return (second.endDate - second.startDate) - (first.endDate - first.startDate);
      });
      break;

    case SortType.PRICE_DOWN:
      sortedPoints = points.slice().sort((first, second) => {
        return (second.price - first.price);
      });
      break;

    case SortType.EVENTS_UP:
      sortedPoints = points.slice().sort((first, second) => {
        return (first.startDate - second.startDate);
      });
      break;
  }
  return sortedPoints;
};

export default class TripController {
  constructor(container, filterController, pointsModel, api, offersModel, destinationsModel) {
    this._container = container;
    this._filterController = filterController;
    this._pointsModel = pointsModel;
    this._api = api;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._showedEventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._loadingMessageComponent = new LoadingMessageComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysSectionComponent = new TripDaysSectionComponent();


    this._creatingPoint = null;
    this._addNewPointButtonElement = document.querySelector(`.trip-main__event-add-btn`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange.bind(this));
    this._pointsModel.setFilterChangeHandler(this._onFilterChange.bind(this));

    this._onCreateNewPoint();
    render(this._container, this._loadingMessageComponent, RenderPosition.BEFOREEND);
  }

  hide() {
    this._container.classList.add(`visually-hidden`);
    this._updatePoints();
  }

  show() {
    this._container.classList.remove(`visually-hidden`);
    this._updatePoints();
  }

  render() {
    this._loadingMessageComponent.hide();
    const container = this._container;
    const points = this._pointsModel.getPoints();
    const hasNoPoints = points.length === 0;
    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    if (hasNoPoints) {
      render(container, this._noEventsComponent, RenderPosition.BEFOREEND);
      this._noEventsComponent.show();
      this._sortComponent.hide();
    } else {
      this._noEventsComponent.hide();
      this._sortComponent.show();
    }
    render(container, this._tripDaysSectionComponent, RenderPosition.BEFOREEND);
    this._renderPoints(points);
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const tripDaysElement = document.querySelector(`.trip-days`);
    const dayComponent = new DayComponent(`noGroup`, null);
    render(tripDaysElement, dayComponent, RenderPosition.AFTERBEGIN);
    const dayPointsElement = dayComponent.getElement().querySelector(`.trip-events__list`);
    this._creatingPoint = new PointController(dayPointsElement, this._onDataChange, this._onViewChange, this._offersModel, this._destinationsModel);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);

    this._onViewChange();
    this._showedEventControllers.push(this._creatingPoint);
  }

  enableAddNewPointButton() {
    this._addNewPointButtonElement.disabled = false;
  }

  _renderPoints(points) {
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    const sortedPoints = getSortedPoints(points, this._sortComponent.getSortType());
    const tripPoints = renderPoints(tripDaysList, sortedPoints, this._sortComponent.getSortType(), this._onDataChange, this._onViewChange, this._offersModel, this._destinationsModel);
    this._showedEventControllers = this._showedEventControllers.concat(tripPoints);
  }

  _removePoints() {
    this._showedEventControllers.forEach((pointController) => pointController.destroy());
    this._showedEventControllers = [];
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    tripDaysList.innerHTML = ``;
  }

  _updatePoints() {
    this._removePoints();
    this._renderPoints(this._pointsModel.getPoints());
    this._filterController.disableEmptyFilters();
  }

  _resetSort() {
    this._onSortTypeChange(SortType.EVENTS_UP);
    this._sortComponent.setDefaultView(this._pointsModel.getAllPoints().length === 0);
  }

  _addPointToModel(pointModel, pointController) {
    this._pointsModel.addPoint(pointModel);
    pointController.render(pointModel, PointControllerMode.DEFAULT);
    this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
    this._updatePoints();
    if (this._pointsModel.getAllPoints().length > 0) {
      this._sortComponent.show();
    }
  }

  _removePointFromModel(oldData) {
    this._pointsModel.removePoint(oldData.id);
    this._updatePoints();
    if (this._pointsModel.getAllPoints().length === 0) {
      this._sortComponent.hide();
    }
  }

  _updatePointInModel(pointModel, pointController, oldData, newData, isEditForm) {
    const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);
    if (isSuccess) {

      if (isEditForm) {
        pointController.render(newData, PointControllerMode.EDIT);

      } else {
        pointController.render(newData, PointControllerMode.DEFAULT);
        this._updatePoints();
      }

    }
  }

  _onDataChange(pointController, oldData, newData, isEditForm) {
    this.enableAddNewPointButton();

    if (oldData === EmptyPoint) {
      this._creatingPoint = null;

      if (newData === null) {
        pointController.destroy();
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._addPointToModel(pointModel, pointController);
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._removePointFromModel(oldData);
        })
        .catch(() => {
          pointController.shake();
        });

    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          this._updatePointInModel(pointModel, pointController, oldData, newData, isEditForm);
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onSortTypeChange(sortType) {
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    tripDaysList.innerHTML = ``;
    this._showedEventControllers.forEach((pointController)=> {
      pointController.destroy();
    });
    this._showedEventControllers = [];

    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);
    const tripPoints = renderPoints(tripDaysList, sortedPoints, sortType, this._onDataChange, this._onViewChange, this._offersModel, this._destinationsModel);
    this._showedEventControllers = this._showedEventControllers.concat(tripPoints);
    this.enableAddNewPointButton();
  }

  _onViewChange() {
    this._showedEventControllers.forEach((eventController) => eventController.setDefaultView());
  }

  _onFilterChange() {
    this.enableAddNewPointButton();
    this._updatePoints();
    this._creatingPoint = null;
  }

  _onCreateNewPoint() {
    this._addNewPointButtonElement.addEventListener(`click`, () => {
      this._pointsModel.setFilter(FilterType.ALL);
      this._filterController.setDefaultView();
      this._noEventsComponent.hide();
      document.dispatchEvent(createNewPointEvent);
      this._resetSort();
      this._addNewPointButtonElement.disabled = true;
      this.createPoint();
    });
  }
}
