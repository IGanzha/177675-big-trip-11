import AbstractComponent from "./abstract-component.js";
import moment from 'moment';
import {MomentFormat} from '../const.js';


const createDayTemplate = (date, dayIndex) => {
  const month = moment(date).format(MomentFormat.MONTH);
  const day = moment(date).format(MomentFormat.DAY);

  const dayInfoMarkup = (date === `noGroup`) ? `` : (
    `<span class="day__counter">${dayIndex}</span>
    <time class="day__date" datetime="${date}">${month} ${day}</time>`
  );

  return (
    `<li class="trip-days__item day">
      <div class="day__info">
        ${dayInfoMarkup}
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class Day extends AbstractComponent {
  constructor(date, dayIndex) {
    super();
    this._date = date;
    this._dayIndex = dayIndex;
  }

  getTemplate() {
    return createDayTemplate(this._date, this._dayIndex);
  }
}
