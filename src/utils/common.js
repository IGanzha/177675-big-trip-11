import moment from 'moment';

const HOURS_IN_DAY = 24;

export const getTwoNumbersFormat = (number) => {
  return String(number).padStart(2, `0`);
};

export const formatDate = (date) => {
  return moment(date).format(`Y-MM-DD`);
};

export const formatDateForEdit = (date) => {
  return moment(date).format(`DD/MM/YY`);
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};


export const getFormattedTimeDuration = (startDate, endDate) => {

  const difference = moment(endDate).diff(moment(startDate));
  const duration = moment.duration(difference);

  const days = (parseInt(duration.asDays(), 10) > 0) ? `${parseInt(duration.asDays(), 10)}D` : ``;

  const hours = (parseInt(duration.asHours(), 10) > 0 || parseInt(duration.asDays(), 10) > 0) ? ` ${parseInt(duration.asHours(), 10) - parseInt(duration.asDays(), 10) * HOURS_IN_DAY}H` : ``;

  const minutes = ` ${parseInt(duration.minutes(), 10)}M`;
  return days + hours + minutes;
};

export const getGroupedByDayPoints = (arr, sortType) => {
  const result = {};
  if (sortType === `events-up`) {
    arr.forEach((event) => {
      if (result[formatDate(event.startDate)] === undefined) {
        result[formatDate(event.startDate)] = [];
      }
      result[formatDate(event.startDate)].push(event);
    });
  } else {
    result[`noGroup`] = arr;
  }

  return result;
};
