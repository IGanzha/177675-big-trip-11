
import TotalPriceComponent from './components/total-price.js';
import FilterComponent from './components/filter.js';
import MenuComponent from './components/menu.js';
import TripInfoComponent from './components/trip-info.js';
import TripControllerComponent from './controllers/trip-controller.js';
import PointsModel from './models/points.js';


import {render, RenderPosition} from './utils/render.js';
import {filterNames} from './mock/filter.js';
import {createEvents} from './mock/trip-event.js';

const EVENTS_COUNT = 10;
const points = createEvents(EVENTS_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TotalPriceComponent(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2`);
render(menuHeaderElement, new MenuComponent(), RenderPosition.AFTER);

const tripEventsSection = document.querySelector(`.trip-events`);
render(tripControlsElement, new FilterComponent(filterNames), RenderPosition.BEFOREEND);


const tripControllerComponent = new TripControllerComponent(tripEventsSection, pointsModel);
tripControllerComponent.render(points);
