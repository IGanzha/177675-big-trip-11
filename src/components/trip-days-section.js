import AbstractComponent from "./abstract-component.js";

const createTripDaysSectionTemplate = () => {
  return `<ul class="trip-days"></ul>`;
};

export default class TripDaysSection extends AbstractComponent {

  getTemplate() {
    return createTripDaysSectionTemplate();
  }
}
