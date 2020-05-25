import API from './api.js';
import FilterController from './controllers/filter-controller.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';
import PointsModel from './models/points.js';
import SiteMenuComponent, {MenuItem} from './components/menu.js';
import StatisticsComponent from './components/statistics.js';
import TripController from './controllers/trip-controller.js';
import {render, RenderPosition} from './utils/render.js';

const AUTHORIZATION = `Basic randomString123`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2`);
const tripEventsSection = document.querySelector(`.trip-events`);
const pageBodyContainer = document.querySelector(`main .page-body__container`);


const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const siteMenuComponent = new SiteMenuComponent();
render(menuHeaderElement, siteMenuComponent, RenderPosition.AFTER);
const filterController = new FilterController(tripControlsElement, pointsModel);
const tripController = new TripController(tripEventsSection, filterController, pointsModel, api, offersModel, destinationsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);

render(pageBodyContainer, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      siteMenuComponent.setActiveItem(MenuItem.STATISTICS);
      tripController.hide();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      siteMenuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});

api.getOffers()
  .then((offers) => {
    offersModel.setOffers(offers);
    return api.getDestinations();
  }).then((destinations) => {
    destinationsModel.setDestinations(destinations);
    return api.getPoints();
  })
  .then((points) => {
    pointsModel.setPoints(points);
    tripController.render();
    filterController.render();
  });
