import DayComponent from '../components/day.js';
import LoadingMessageComponent from '../components/loading-message.js';
import NoEventsComponent from '../components/no-events.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point-controller.js';
import SortComponent, {SortType} from '../components/sort.js';
import TripDaysSectionComponent from '../components/trip-days-section.js';

import {FilterType} from '../const.js';
import {getGroupedByDayPoints} from '../utils/common.js';
import {render, RenderPosition} from '../utils/render.js';


const renderPoints = (eventList, points, sortType, onDataChange, onViewChange, offersModel, destinationsModel) => {
  const groupedByDayPoints = getGroupedByDayPoints(points, sortType);
  const newPoints = [];
  let dayNumber = 0;
  for (const day of Object.keys(groupedByDayPoints)) {
    dayNumber++;
    const dayComponent = new DayComponent(day, dayNumber);
    render(eventList, dayComponent, RenderPosition.BEFOREEND);
    const dayPointsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const dayPoints = groupedByDayPoints[day];
    dayPoints.map((point) => {
      const pointController = new PointController(dayPointsList, onDataChange, onViewChange, offersModel, destinationsModel);
      pointController.render(point, PointControllerMode.DEFAULT);
      newPoints.push(pointController);
      return pointController;
    });
  }
  return newPoints;
};

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];
  switch (sortType) {
    case SortType.TIME_DOWN:

      sortedPoints = points.slice().sort((first, second) => {
        if ((first.endDate - first.startDate) > (second.endDate - second.startDate)) {
          return -1;
        } else if ((first.endDate - first.startDate) < (second.endDate - second.startDate)) {
          return 1;
        } else {
          return 0;
        }
      });
      break;

    case SortType.PRICE_DOWN:
      sortedPoints = points.slice().sort((first, second) => {
        if (first.price > second.price) {
          return -1;
        } else if (first.price < second.price) {
          return 1;
        } else {
          return 0;
        }
      });
      break;

    case SortType.EVENTS_UP:
      sortedPoints = points.slice().sort((first, second) => {
        if (first.startDate > second.startDate) {
          return 1;
        } else if (first.startDate < second.startDate) {
          return -1;
        } else {
          return 0;
        }
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
    this._loadingMessageComponent = new LoadingMessageComponent();
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysSectionComponent = new TripDaysSectionComponent();


    this._creatingPoint = null;
    this._addNewPointButton = document.querySelector(`.trip-main__event-add-btn`);

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);

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
    const hasPoints = points.length === 0 || points === undefined;
    if (hasPoints) {
      render(container, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tripDaysSectionComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points);
  }

  _renderPoints(points) {
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    const sortedPoints = getSortedPoints(points, this._sortComponent.getSortType());
    const tripPoints = renderPoints(tripDaysList, sortedPoints, this._sortComponent.getSortType(), this._onDataChange, this._onViewChange, this._offersModel, this._destinationsModel);
    this._showedEventControllers = this._showedEventControllers.concat(tripPoints);
  }

  resetSort() {
    this._onSortTypeChange(SortType.EVENTS_UP);
    this._sortComponent.setDefaultView();
  }

  createPoint() {
    if (this._creatingPoint) {
      return;
    }

    const tripSortElement = document.querySelector(`.trip-sort`);
    const dayComponent = new DayComponent(`noGroup`, null);
    render(tripSortElement, dayComponent, RenderPosition.AFTER);
    const dayPointsElement = dayComponent.getElement().querySelector(`.trip-events__list`);
    this._creatingPoint = new PointController(dayPointsElement, this._onDataChange, this._onViewChange, this._offersModel, this._destinationsModel);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);

    this._onViewChange();
    this._showedEventControllers.push(this._creatingPoint);
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

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    tripDaysList.innerHTML = ``;
    this._showedEventControllers = [];

    const tripPoints = renderPoints(tripDaysList, sortedPoints, sortType, this._onDataChange, this._onViewChange, this._offersModel, this._destinationsModel);
    this._showedEventControllers = this._showedEventControllers.concat(tripPoints);
  }

  _onDataChange(pointController, oldData, newData) {
    this._addNewPointButton.disabled = false;
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;

      if (newData === null) {
        pointController.destroy();
      } else {
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            pointController.render(pointModel, PointControllerMode.DEFAULT);
            this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
            this._updatePoints();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });

    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          const isSuccess = this._pointsModel.updatePoint(oldData.id, pointModel);

          if (isSuccess) {
            pointController.render(newData, PointControllerMode.DEFAULT);
          }

          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });
    }
  }

  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._addNewPointButton.disabled = false;
    this._updatePoints();
    this._creatingPoint = null;
  }

  _onCreateNewPoint() {
    this._addNewPointButton.addEventListener(`click`, () => {
      this._pointsModel.setFilter(FilterType.ALL);
      this._filterController.setDefaultView();
      this._addNewPointButton.disabled = true;

      this.resetSort();
      this.createPoint();
    });
  }
}
