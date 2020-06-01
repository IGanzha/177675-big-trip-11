import AbstractComponent from './abstract-component.js';

const ACTIVE_TAB_CLASS = `trip-tabs__btn--active`;

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <h2 class="visually-hidden">Switch trip view</h2>
      <a id="control-table" class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a id="control-stats" class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {

  getTemplate() {
    return createSiteMenuTemplate();
  }

  setActiveItem(selectedTab) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((tab) => {
        if (tab.id === selectedTab) {
          tab.classList.add(ACTIVE_TAB_CLASS);
        } else {
          tab.classList.remove(ACTIVE_TAB_CLASS);
        }
      });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      evt.preventDefault();
      handler(evt.target.id);
    });
  }
}
