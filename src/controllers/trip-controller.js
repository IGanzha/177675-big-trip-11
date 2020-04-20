import DayComponent from '../components/day.js';
import TripDaysSectionComponent from '../components/trip-days-section.js';
import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import NoEventsComponent from '../components/no-events.js';
import SortComponent from '../components/sort.js';

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

const renderTripEvents = (container, eventsArr) => {

  render(container, new SortComponent(), RenderPosition.AFTERBEGIN);
  const hasEvents = eventsArr.length === 0 || eventsArr === undefined;

  if (hasEvents) {
    render(container, new NoEventsComponent(), RenderPosition.BEFOREEND);
    return;
  }
  const tripDaysSectionComponent = new TripDaysSectionComponent();
  render(container, tripDaysSectionComponent, RenderPosition.BEFOREEND);

  const groupByDayEvents = getGroupedEvents(eventsArr, `dateForGroup`);
  let dayNumber = 0;
  for (const day of Object.keys(groupByDayEvents)) {
    dayNumber++;
    const dayComponent = new DayComponent(day, dayNumber);

    render(tripDaysSectionComponent.getElement(), dayComponent, RenderPosition.BEFOREEND);
    const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);

    const dayEvents = groupByDayEvents[day];
    dayEvents.forEach((event) => {
      renderEvent(dayEventsList, event);
    });
  }
};

export default class TripController {
  constructor(container) {
    this._container = container;
  }

  render(events) {
    renderTripEvents(this._container, events);
  }
}
