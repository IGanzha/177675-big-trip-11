import FilterController from './controllers/filter-controller.js';
import PointsModel from './models/points.js';
import SiteMenuComponent from './components/menu.js';
import TotalPriceComponent from './components/total-price.js';
import TripController from './controllers/trip-controller.js';
import TripInfoComponent from './components/trip-info.js';

import {createEvents} from './mock/trip-event.js';
import {render, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 3;
const points = createEvents(EVENTS_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TotalPriceComponent(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2`);
render(menuHeaderElement, new SiteMenuComponent(), RenderPosition.AFTER);

const tripEventsSection = document.querySelector(`.trip-events`);

// render(tripControlsElement, new FilterComponent(filterNames), RenderPosition.BEFOREEND);
const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripController = new TripController(tripEventsSection, pointsModel);
tripController.render(points);

const addButton = document.querySelector(`.trip-main__event-add-btn`);

const onAddPointButtonClick = () => {
  tripController.createPoint();
};

addButton.addEventListener(`click`, onAddPointButtonClick);


