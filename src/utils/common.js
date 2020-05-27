import moment from 'moment';
import {HOURS_IN_DAY, MomentFormat} from '../const.js';

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const capitalizeFirstLetter = (string) => {
  return string[0].toUpperCase() + string.slice(1);
};

const getTimeDuration = (startDate, endDate) => {

  const difference = moment(endDate).diff(moment(startDate));
  const duration = moment.duration(difference);

  const days = (parseInt(duration.asDays(), 10) > 0) ? `${parseInt(duration.asDays(), 10)}D` : ``;

  const hours = (parseInt(duration.asHours(), 10) > 0 || parseInt(duration.asDays(), 10) > 0) ? ` ${parseInt(duration.asHours(), 10) - parseInt(duration.asDays(), 10) * HOURS_IN_DAY}H` : ``;

  const minutes = ` ${parseInt(duration.minutes(), 10)}M`;
  return days + hours + minutes;
};

const getGroupedByDayPoints = (points, sortType) => {
  const result = {};
  if (sortType === `events-up`) {
    points.forEach((point) => {
      if (result[moment(point.startDate).format(MomentFormat.DAY)] === undefined) {
        result[moment(point.startDate).format(MomentFormat.DAY)] = [];
      }
      result[moment(point.startDate).format(MomentFormat.DAY)].push(point);
    });
  } else {
    result[`noGroup`] = points;
  }

  return result;
};

const getOffersForCurrentType = (type, allOffers) => {
  return allOffers.find((offer) => (offer.type === type));
};

export {getRandomArrayItem, capitalizeFirstLetter, getTimeDuration, getGroupedByDayPoints, getOffersForCurrentType};
