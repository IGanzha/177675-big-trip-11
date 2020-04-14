import {createTripEventTemplate} from './trip-event.js';

const numberToMonth = {
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
  return numberToMonth[monthNumber];
};

export const createDayTemplate = (date, arr, dayIndex) => {

  const createEventsMarkup = (eventsList) => {
    return eventsList.map(createTripEventTemplate).join(``);
  };

  const month = castMonthFormat(date);
  const day = date[8] + date[9];
  const eventsMarkup = createEventsMarkup(arr);

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${dayIndex}</span>
        <time class="day__date" datetime="${date}">${month} ${day}</time>
      </div>

      <ul class="trip-events__list">
        ${eventsMarkup}
      </ul>
    </li>`
  );
};

