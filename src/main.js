import DayComponent from './components/day.js';
import TotalPriceComponent from './components/total-price.js';
import FilterComponent from './components/filter.js';
import MenuComponent from './components/menu.js';
import SortComponent from './components/sort.js';
import TripDaysSectionComponent from './components/trip-days-section.js';
import EventComponent from './components/event.js';
import EventEditComponent from './components/event-edit.js';
import TripInfoComponent from './components/trip-info.js';

import {getGroupedEvents, render, RenderPosition} from './utils.js';
import {filterNames} from './mock/filter.js';
import {createEvents} from './mock/trip-event.js';

const EVENTS_COUNT = 10;
const events = createEvents(EVENTS_COUNT);


const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent().getElement(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TotalPriceComponent().getElement(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2`);
render(menuHeaderElement, new MenuComponent().getElement(), RenderPosition.AFTER);

render(tripControlsElement, new FilterComponent(filterNames).getElement(), RenderPosition.BEFOREEND);

const tripEventsSection = document.querySelector(`.trip-events`);
render(tripEventsSection, new SortComponent().getElement(), RenderPosition.AFTERBEGIN);

render(tripEventsSection, new EventEditComponent(events[0]).getElement(), RenderPosition.BEFOREEND);

render(tripEventsSection, new TripDaysSectionComponent().getElement(), RenderPosition.BEFOREEND);


const renderEvent = (eventListElement, event) => {
  const eventComponent = new EventComponent(event);
  const onEditButtonClick = () => {
    eventListElement.replaceChild(eventEditComponent.getElement(), eventComponent.getElement());
  };

  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    eventListElement.replaceChild(eventComponent.getElement(), eventEditComponent.getElement());
  };

  const editButton = eventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const eventEditComponent = new EventEditComponent(event);
  eventEditComponent.getElement().addEventListener(`submit`, onEditFormSubmit);
  render(eventListElement, eventComponent.getElement(), RenderPosition.BEFOREEND);

};

const renderTripEvents = (eventsArr) => {

  const groupByDayEvents = getGroupedEvents(eventsArr, `dateForGroup`);
  let dayNumber = 0;
  for (const day of Object.keys(groupByDayEvents)) {
    dayNumber++;
    const dayComponent = new DayComponent(day, dayNumber);

    render(tripEventsSection, dayComponent.getElement(), RenderPosition.BEFOREEND);
    const dayEventsList = dayComponent.getElement().querySelector(`.trip-events__list`);

    const dayEvents = groupByDayEvents[day];
    dayEvents.forEach((event) => {
      renderEvent(dayEventsList, event);
    });
  }
};

renderTripEvents(events);
