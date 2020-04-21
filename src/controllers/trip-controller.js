import DayComponent from '../components/day.js';
import TripDaysSectionComponent from '../components/trip-days-section.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import NoEventsComponent from '../components/no-events.js';
import SortComponent, {SortType} from '../components/sort.js';

import {render, replace, RenderPosition} from '../utils/render.js';
import {getGroupedEvents} from '../utils/common.js';


const renderEvent = (eventContainer, event) => {
  const eventComponent = new EventComponent(event);
  eventComponent.setEditButtonClickHandler(() => {
    replaceEventToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const replaceEventToEdit = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceEditToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const eventEditComponent = new EventEditComponent(event);
  eventEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventContainer, eventComponent, RenderPosition.BEFOREEND);
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
    this._noEventsComponent = new NoEventsComponent();
    this._sortComponent = new SortComponent();
    this._tripDaysSectionComponent = new TripDaysSectionComponent();
  }

  render(events) {
    const container = this._container;

    render(container, this._sortComponent, RenderPosition.AFTERBEGIN);

    const hasEvents = events.length === 0 || events === undefined;
    if (hasEvents) {
      render(container, new NoEventsComponent(), RenderPosition.BEFOREEND);
      return;
    }

    render(container, this._tripDaysSectionComponent, RenderPosition.BEFOREEND);


    const tripDaysList = this._tripDaysSectionComponent.getElement();
    let sortedEvents = getSortedEvents(events, this._sortComponent.getSortType());
    const groupedByDayEvents = getGroupedEvents(sortedEvents, `dateForGroup`, this._sortComponent.getSortType());


    let dayNumber = 0;
    for (const day of Object.keys(groupedByDayEvents)) {
      dayNumber++;
      const dayComponent = new DayComponent(day, dayNumber);
      render(tripDaysList, dayComponent, RenderPosition.BEFOREEND);
      const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
      const dayEvents = groupedByDayEvents[day];
      dayEvents.forEach((event) => {
        renderEvent(dayEventsList, event);
      });
    }

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      sortedEvents = getSortedEvents(events, sortType);
      groupedByDayEvents = getGroupedEvents(sortedEvents, `dateForGroup`, sortType);
      tripDaysList.innerHTML = ``;
      dayNumber = 0;
      for (const day of Object.keys(groupedByDayEvents)) {
        dayNumber++;
        const dayComponent = new DayComponent(day, dayNumber);
        render(tripDaysList, dayComponent, RenderPosition.BEFOREEND);
        const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);
        const dayEvents = groupedByDayEvents[day];
        dayEvents.forEach((event) => {
          renderEvent(dayEventsList, event);
        });
      }
    });
  }
}
