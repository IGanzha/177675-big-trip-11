import {castDateFormat} from '../utils/common.js';

export const getRandomArrayItem = (array) => {
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

const getTrueOrFalse = () => {
  return Math.random() > 0.5;
};

const transferTypes = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];
export const activityTypes = [`Check-in`, `Sightseeing`, `Restaurant`];
const eventTypes = [].concat(transferTypes, activityTypes);


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
    checked: getTrueOrFalse(),
  }, {
    id: `comfort`,
    text: `Switch to comfort class`,
    price: 100,
    checked: getTrueOrFalse(),
  }, {
    id: `meal`,
    text: `Add meal`,
    price: 15,
    checked: getTrueOrFalse(),
  }, {
    id: `seats`,
    text: `Choose seats`,
    price: 5,
    checked: getTrueOrFalse(),
  }, {
    id: `train`,
    text: `Travel by train`,
    price: 40,
    checked: getTrueOrFalse(),
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

const getPhotosArray = () => {
  const photosArr = [];

  for (let i = 0; i < getRandomIntegerNumber(0, 5); i++) {
    photosArr.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }
  return photosArr;
};

const createEvent = function () {
  const type = getRandomArrayItem(eventTypes);
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const city = getRandomArrayItem(cities);
  return {
    type,
    activityTypes,
    transferTypes,
    city,
    cities,
    destination: {
      description: getRandomArrayItem(descriptions),
      photos: getPhotosArray(),
    },
    availableOffers: offersForTypes[type],
    price: getRandomIntegerNumber(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
    startDate,
    endDate,
    dateForGroup: castDateFormat(startDate, `-`),
    isFavorite: getTrueOrFalse(),
  };
};

const createEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(createEvent);
};

export {createEvent, createEvents};
