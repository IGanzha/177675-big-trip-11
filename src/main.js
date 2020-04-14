import {createDayTemplate} from './components/day.js';
import {createCostInfoTemplate} from './components/cost-info.js';
import {createFilterTemplate} from './components/filter.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createTripDaysSectionTemplate} from './components/trip-days-section.js';
import {createTripEditTemplate} from './components/trip-edit.js';
import {createTripInfoTemplate} from './components/trip-info.js';
import {createEvents} from './mock/trip-event.js';
import {getGroupedEvents} from './utils.js';


const EVENTS_COUNT = 10;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, createCostInfoTemplate());

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2`);
render(menuHeaderElement, createMenuTemplate(), `afterend`);

render(tripControlsElement, createFilterTemplate());

const tripEventsSection = document.querySelector(`.trip-events`);
render(tripEventsSection, createSortTemplate());

const events = createEvents(EVENTS_COUNT);

const groupByDayEvents = getGroupedEvents(events, `dateForGroup`);

render(tripEventsSection, createTripEditTemplate(events[0]));
render(tripEventsSection, createTripDaysSectionTemplate());

let dayNumber = 0;

for (const day of Object.keys(groupByDayEvents)) {
  dayNumber++;
  render(tripEventsSection, createDayTemplate(day, groupByDayEvents[day], dayNumber));
}
