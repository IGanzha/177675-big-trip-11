import API from './api/api.js';
import FilterController from './controllers/filter-controller.js';
import DestinationsModel from './models/destinations.js';
import OffersModel from './models/offers.js';
import PointsModel from './models/points.js';
import Provider from './api/provider.js';
import SiteMenuComponent from './components/site-menu.js';
import StatisticsComponent from './components/statistics.js';
import Store from './api/store.js';
import TripController from './controllers/trip-controller.js';
import {render} from './utils/render.js';
import {AUTHORIZATION, END_POINT, RenderPosition, MenuItem} from './const.js';

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2`);
const tripEventsSectionElement = document.querySelector(`.trip-events`);
const pageBodyContainerElement = document.querySelector(`main .page-body__container`);

const STORE_PREFIX = `bigtrip-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const pointsModel = new PointsModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const siteMenuComponent = new SiteMenuComponent();
render(menuHeaderElement, siteMenuComponent, RenderPosition.AFTER);
const filterController = new FilterController(tripControlsElement, pointsModel);
const tripController = new TripController(tripEventsSectionElement, filterController, pointsModel, apiWithProvider, offersModel, destinationsModel);
const statisticsComponent = new StatisticsComponent(pointsModel);

render(pageBodyContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.STATISTICS:
      siteMenuComponent.setActiveItem(MenuItem.STATISTICS);
      tripController.hide();
      tripController.enableAddNewPointButton();
      statisticsComponent.show();
      break;
    case MenuItem.TABLE:
      siteMenuComponent.setActiveItem(MenuItem.TABLE);
      statisticsComponent.hide();
      tripController.show();
      break;
  }
});

document.addEventListener(`addNewPointButtonClick`, () => {
  siteMenuComponent.setActiveItem(MenuItem.TABLE);
  statisticsComponent.hide();
  tripController.show();
});

Promise.all([
  apiWithProvider.getOffers(),
  apiWithProvider.getDestinations(),
  apiWithProvider.getPoints()
]).then((res) => {
  offersModel.setOffers(res[0]);
  destinationsModel.setDestinations(res[1]);
  pointsModel.setPoints(res[2]);
  tripController.render();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {})
    .catch(() => {});
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
