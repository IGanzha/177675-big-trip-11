import {createElement} from "../utils.js";

const NumberToMonth = {
  1: `JAN`,
  2: `FEB`,
  3: `MAR`,
  4: `APR`,
  5: `MAY`,
  6: `JUN`,
  7: `JUL`,
  8: `AUG`,
  9: `SEP`,
  10: `OKT`,
  11: `NOV`,
  12: `DEC`,
};

const castMonthFormat = (dateString) => {
  const monthNumber = +(dateString[5] + dateString[6]);
  return NumberToMonth[monthNumber];
};

const createDayTemplate = (date, dayIndex) => {

  const month = castMonthFormat(date);
  const day = date[8] + date[9];

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayIndex}</span>
        <time class="day__date" datetime="${date}">${month} ${day}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day {
  constructor(date, dayIndex) {
    this._date = date;
    this._dayIndex = dayIndex;
    this._element = null;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._dayIndex);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
