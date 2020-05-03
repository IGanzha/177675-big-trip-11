import DayComponent from '../components/day.js';
import TripDaysSectionComponent from '../components/trip-days-section.js';
import NoEventsComponent from '../components/no-events.js';
import SortComponent, {SortType} from '../components/sort.js';
import PointController, {Mode as PointControllerMode, EmptyPoint} from './point-controller.js';

import {render, RenderPosition} from '../utils/render.js';
import {getGroupedEvents} from '../utils/common.js';

const renderPoints = (eventListElement, points, sortType, onDataChange, onViewChange) => {
  const groupedByDayEvents = getGroupedEvents(points, `dateForGroup`, sortType);
  const newPoints = [];
  let dayNumber = 0;
  let index = 1;
  for (const day of Object.keys(groupedByDayEvents)) {
    dayNumber++;
    const dayComponent = new DayComponent(day, dayNumber);
    render(eventListElement, dayComponent, RenderPosition.BEFOREEND);
    const dayPointsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const dayPoints = groupedByDayEvents[day];
    dayPoints.map((point) => {
      const pointController = new PointController(dayPointsList, index, onDataChange, onViewChange);
      pointController.render(point, PointControllerMode.DEFAULT);
      index++;
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
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._showedEventControllers = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysSectionComponent = new TripDaysSectionComponent();
    this._creatingTask = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container;
    const points = this._pointsModel.getPoints();
    const hasEvents = points.length === 0 || points === undefined;
    if (hasEvents) {
      render(container, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tripDaysSectionComponent, RenderPosition.BEFOREEND);

    this._renderPoints(points);
  }

  createPoint() {
    if (this._creatingTask) {
      return;
    }

    const pointListElement = this._pointComponent.getElement();
    this._creatingTask = new PointController(pointListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyPoint, PointControllerMode.ADDING);
  }

  _renderPoints(points) {
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    const sortedPoints = getSortedPoints(points, this._sortComponent.getSortType());

    const tripPoints = renderPoints(tripDaysList, sortedPoints, this._sortComponent.getSortType(), this._onDataChange, this._onViewChange);
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
  }

  _onSortTypeChange(sortType) {
    const sortedPoints = getSortedPoints(this._pointsModel.getPoints(), sortType);
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    tripDaysList.innerHTML = ``;
    const tripPoints = renderPoints(tripDaysList, sortedPoints, sortType, this._onDataChange);
    this._showedEventControllers = this._showedEventControllers.concat(tripPoints);
  }

  _onDataChange(pointController, oldData, newData) {
    // if (oldData === EmptyPoint) {
    //   this._creatingPoint = null;

    //   if (newData === null) {
    //     pointController.destroy();
    //     this._updatePoints();

    //   } else {
    //     this._pointsModel.addPoint(newData);
    //     pointController.render(newData, PointControllerMode.DEFAULT);

    //     this._showedPointControllers = [].concat(pointController, this._showedPointControllers);
    //   }

    // } else if (newData === null) {
    if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      const isSuccess = this._pointsModel.updatePoint(oldData.id, newData);
      if (isSuccess) {
        pointController.render(newData, PointControllerMode.DEFAULT);
      }
    }
  }

  _onViewChange() {
    this._showedEventControllers.forEach((it) => it.setDefaultView());
  }

  _onFilterChange() {
    this._updatePoints();
  }
}
