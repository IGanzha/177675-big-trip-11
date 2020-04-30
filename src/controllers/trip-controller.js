import DayComponent from '../components/day.js';
import TripDaysSectionComponent from '../components/trip-days-section.js';
import NoEventsComponent from '../components/no-events.js';
import SortComponent, {SortType} from '../components/sort.js';
import PointController from './point-controller.js';

import {render, RenderPosition} from '../utils/render.js';
import {getGroupedEvents} from '../utils/common.js';


const renderEvents = (eventListElement, points, sortType, onDataChange) => {
  const groupedByDayEvents = getGroupedEvents(points, `dateForGroup`, sortType);

  let dayNumber = 0;
  let index = 1;
  for (const day of Object.keys(groupedByDayEvents)) {
    dayNumber++;
    const dayComponent = new DayComponent(day, dayNumber);
    render(eventListElement, dayComponent, RenderPosition.BEFOREEND);
    const dayPointsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const dayPoints = groupedByDayEvents[day];
    dayPoints.map((point) => {
      const pointController = new PointController(dayPointsList, index, onDataChange);
      pointController.render(point);
      index++;
      return pointController;
    });
  }
};

const getSortedEvents = (events, sortType) => {

  let sortedEvents = [];
  switch (sortType) {
    case SortType.TIME_DOWN:

      sortedEvents = events.slice().sort((first, second) => {
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
      sortedEvents = events.slice().sort((first, second) => {
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
      sortedEvents = events.slice().sort((first, second) => {
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

  return sortedEvents;
};

export default class TripController {
  constructor(container) {
    this._container = container;
    this._events = [];
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysSectionComponent = new TripDaysSectionComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(events) {
    const container = this._container;
    this._events = events;

    const hasEvents = this._events.length === 0 || this._events === undefined;
    if (hasEvents) {
      render(container, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);
    render(container, this._tripDaysSectionComponent, RenderPosition.BEFOREEND);


    const tripDaysList = this._tripDaysSectionComponent.getElement();
    const sortedEvents = getSortedEvents(this._events, this._sortComponent.getSortType());

    renderEvents(tripDaysList, sortedEvents, this._sortComponent.getSortType(), this._onDataChange);
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._events, sortType);
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    tripDaysList.innerHTML = ``;
    renderEvents(tripDaysList, sortedEvents, sortType, this._onDataChange);
  }

  _onDataChange(pointController, data, modificator) {
    const index = this._events.findIndex((tripEvent) => tripEvent === data);
    if (index === -1) {
      return;
    }

    const modifiedPoint = Object.assign(data, modificator);
    this._events = [].concat(this._events.slice(0, index), modifiedPoint, this._events.slice(index + 1));
    pointController.render(this._events[index]);
  }
}
