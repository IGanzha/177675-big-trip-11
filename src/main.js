import {createTripEventTemplate} from './components/tripEvent.js';
import {createDayTemplate} from './components/day.js';
import {createCostInfoTemplate} from './components/costInfo.js';
import {createFilterTemplate} from './components/filter.js';
import {createMenuTemplate} from './components/menu.js';
import {createSortTemplate} from './components/sort.js';
import {createTripDaysSection} from './components/tripDaysSection.js';
import {createTripEditTemplate} from './components/tripEdit.js';
import {createTripInfoTemplate} from './components/tripInfo.js';

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

render(tripEventsSection, createTripDaysSection());
render(tripEventsSection, createDayTemplate());

const tripEventsList = tripEventsSection.querySelector(`.trip-events__list`);

for (let i = 0; i < 3; i++) {
  render(tripEventsList, createTripEventTemplate());
}
