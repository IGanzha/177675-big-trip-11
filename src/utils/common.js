import moment from 'moment';

const HOURS_IN_DAY = 24;


export const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

export const getTimeDuration = (startDate, endDate) => {

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
      if (result[moment(event.startDate).format(`Y-MM-DD`)] === undefined) {
        result[moment(event.startDate).format(`Y-MM-DD`)] = [];
      }
      result[moment(event.startDate).format(`Y-MM-DD`)].push(event);
    });
  } else {
    result[`noGroup`] = arr;
  }

  return result;
};

export const getOffersForCurrentType = (type, allOffers) => {
  return allOffers.find((offerObj) => (offerObj.type === type));
};
