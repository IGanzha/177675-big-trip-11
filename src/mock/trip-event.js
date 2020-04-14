import {castDateFormat} from '../utils.js';

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

export const getRandomArray = (array) => {
  return (array) ? array.slice(0, getRandomIntegerNumber(0, array.length) + 1) : ``;
};

const getRandomStartDate = () => {
  const targetDate = new Date();
  const diffDaysValue = getRandomIntegerNumber(0, 3);
  const diffHoursValue = getRandomIntegerNumber(0, 23);
  const diffMinutesValue = getRandomIntegerNumber(0, 59);
  targetDate.setDate(targetDate.getDate() + diffDaysValue);
  targetDate.setHours(targetDate.getHours() + diffHoursValue);
  targetDate.setMinutes(targetDate.getMinutes() + diffMinutesValue);

  return targetDate;
};

const getRandomEndDate = (startDate) => {
  const targetDate = new Date();
  const diffDaysValue = getRandomIntegerNumber(0, 3);
  const diffHoursValue = getRandomIntegerNumber(0, 23);
  const diffMinutesValue = getRandomIntegerNumber(0, 59);
  targetDate.setDate(startDate.getDate() + diffDaysValue);
  targetDate.setHours(startDate.getHours() + diffHoursValue);
  targetDate.setMinutes(startDate.getMinutes() + diffMinutesValue);

  return targetDate;
};

const roadTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
const activityTypes = [`Check-in`, `Sightseeing`, `Restaurant`];
const eventTypes = [].concat(roadTypes, activityTypes);


const MIN_EVENT_PRICE = 10;
const MAX_EVENT_PRICE = 300;

const cities = [
  `Amsterdam`,
  `Chamonix `,
  `Geneva`,
  `Saint Petersburg`,
];

const descriptions = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`,
];

const allOffers = [
  {
    id: `luggage`,
    text: `Add luggage`,
    price: 30,
  }, {
    id: `comfort`,
    text: `Switch to comfort class`,
    price: 100,
  }, {
    id: `meal`,
    text: `Add meal`,
    price: 15,
  }, {
    id: `seats`,
    text: `Choose seats`,
    price: 5,
  }, {
    id: `train`,
    text: `Travel by train`,
    price: 40,
  }
];

const offersForTypes = {
  'Flight': getRandomArray(allOffers),
  'Taxi': getRandomArray(allOffers),
  'Train': getRandomArray(allOffers),
  'Bus': getRandomArray(allOffers),
  'Transport': getRandomArray(allOffers),
  'Drive': getRandomArray(allOffers),
  'Check-in': getRandomArray(allOffers),
  'Sightseeing': getRandomArray(allOffers),
  'Restaurant': getRandomArray(allOffers),
};

const photos = [
  `<img src='http://picsum.photos/248/152?r=${Math.random()}'>`,
  `<img src='http://picsum.photos/248/152?r=${Math.random()}'>`,
  `<img src='http://picsum.photos/248/152?r=${Math.random()}'>`,
];

const createEvent = function () {
  const type = getRandomArrayItem(eventTypes);
  const startDate = getRandomStartDate();

  return {
    type,
    city: getRandomArrayItem(cities),
    description: getRandomArray(descriptions),
    photos: getRandomArray(photos),
    availableOffers: offersForTypes[type],
    price: getRandomIntegerNumber(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
    preposition: activityTypes.includes(type) ? `in` : `to`,
    startDate,
    endDate: getRandomEndDate(startDate),
    dateForGroup: castDateFormat(startDate),
  };
};

const createEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(createEvent)
    .sort((first, second) => {
      if (first.startDate > second.startDate) {
        return 1;
      } else if (first.startDate < second.startDate) {
        return -1;
      } else {
        return 0;
      }
    });
};

export {createEvent, createEvents};
