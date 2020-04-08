import {createTripEventTemplate} from './components/trip-event.js';
import {createDayTemplate} from './components/day.js';
import {createCostInfoTemplate} from './components/cost-info.js';
import {createFilterTemplate} from './components/filter.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createTripDaysSectionTemplate} from './components/trip-days-section.js';
import {createTripEditTemplate} from './components/trip-edit.js';
import {createTripInfoTemplate} from './components/trip-info.js';

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

render(tripEventsSection, createTripEditTemplate());

render(tripEventsSection, createTripDaysSectionTemplate());
render(tripEventsSection, createDayTemplate());

const tripEventsList = tripEventsSection.querySelector(`.trip-events__list`);

for (let i = 0; i < 3; i++) {
  render(tripEventsList, createTripEventTemplate());
}
