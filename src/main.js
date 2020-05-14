import FilterController from './controllers/filter-controller.js';
import PointsModel from './models/points.js';
import SiteMenuComponent, {MenuItem} from './components/menu.js';
import TotalPriceComponent from './components/total-price.js';
import TripController from './controllers/trip-controller.js';
import TripInfoComponent from './components/trip-info.js';
import StatisticsComponent from './components/statistics.js';

import {createEvents} from './mock/trip-event.js';
import {FilterType} from './const.js';
import {render, RenderPosition} from './utils/render.js';

const EVENTS_COUNT = 10;
const points = createEvents(EVENTS_COUNT);
const pointsModel = new PointsModel();
pointsModel.setPoints(points);

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfoComponent(), RenderPosition.AFTERBEGIN);

const tripInfoElement = document.querySelector(`.trip-info`);
render(tripInfoElement, new TotalPriceComponent(), RenderPosition.BEFOREEND);

const siteMenuComponent = new SiteMenuComponent();

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const menuHeaderElement = tripControlsElement.querySelector(`h2`);
render(menuHeaderElement, siteMenuComponent, RenderPosition.AFTER);

const tripEventsSection = document.querySelector(`.trip-events`);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripController = new TripController(tripEventsSection, pointsModel);
tripController.render(points);

const statisticsComponent = new StatisticsComponent(pointsModel);
const pageBodyContainer = document.querySelector(`main .page-body__container`);
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

const addButton = document.querySelector(`.trip-main__event-add-btn`);

const onAddPointButtonClick = () => {
  pointsModel.setFilter(FilterType.ALL);
  tripController.resetSort();

  tripController.createPoint();
};

addButton.addEventListener(`click`, onAddPointButtonClick);


