import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  STATISTICS: `control__stats`,
  TABLE: `control__table`,
};

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a id="control-table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a id="control-stats" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem() {

  }

  setOnChange() {
    this._getElement().querySelectorAll(`.trip-tabs__btn`).forEach((tab) => {
      if (tab.classList.contains(`trip-tabs__btn--active`)) {
        tab.classList.remove(`trip-tabs__btn--active`);
      } else {
        tab.classList.add(`trip-tabs__btn--active`);
      }
    });
  }
}
