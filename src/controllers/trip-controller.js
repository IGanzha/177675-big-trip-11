import DayComponent from '../components/day.js';
import TripDaysSectionComponent from '../components/trip-days-section.js';
import NoEventsComponent from '../components/no-events.js';
import SortComponent, {SortType} from '../components/sort.js';
import PointController from "./point-controller.js";

import {render, RenderPosition} from '../utils/render.js';
import {getGroupedEvents} from '../utils/common.js';


const renderEvents = (eventListElement, events, sortType, onDataChange) => {
  const groupedByDayEvents = getGroupedEvents(events, `dateForGroup`, sortType);

  let dayNumber = 0;
  for (const day of Object.keys(groupedByDayEvents)) {
    dayNumber++;
    const dayComponent = new DayComponent(day, dayNumber);
    render(eventListElement, dayComponent, RenderPosition.BEFOREEND);
    const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
    const dayEvents = groupedByDayEvents[day];

    dayEvents.map((event) => {
      const pointController = new PointController(dayEventsList, onDataChange);
      pointController.render(event);
      return pointController;
    });

  }
};

const getSortedEvents = (events, sortType) => {

  let sortedEvents = [];
  switch (sortType) {
    case SortType.TIME_DOWN:

      sortedEvents = events.slice().sort((first, second) => {
        if (first.duration > second.duration) {
          return -1;
        } else if (first.duration < second.duration) {
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

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

    const hasEvents = this._events.length === 0 || this._events === undefined;
    if (hasEvents) {
      render(container, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._tripDaysSectionComponent, RenderPosition.BEFOREEND);


    const tripDaysList = this._tripDaysSectionComponent.getElement();
    const sortedEvents = getSortedEvents(this._events, this._sortComponent.getSortType());

    renderEvents(tripDaysList, sortedEvents, this._sortComponent.getSortType(), this._onDataChange);
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._events, sortType);
    const tripDaysList = this._tripDaysSectionComponent.getElement();
    tripDaysList.innerHTML = ``;
    renderEvents(tripDaysList, sortedEvents, sortType);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._events.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._events = [].concat(this._events.slice(0, index), newData, this._events.slice(index + 1));

    pointController.render(this._events[index]);
  }

}
