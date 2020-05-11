import {formatDate} from '../utils/common.js';
import {CITIES, ACTIVITY_TYPES, TRANSFER_TYPES} from '../const.js';

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
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffDaysValue = sign * getRandomIntegerNumber(0, 5);
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

const MIN_EVENT_PRICE = 10;
const MAX_EVENT_PRICE = 300;

const allOffers = [
  {
    id: `event-offer-luggage`,
    text: `Add luggage`,
    price: 30,
    checked: getTrueOrFalse(),
  }, {
    id: `event-offer-comfort`,
    text: `Switch to comfort class`,
    price: 100,
    checked: getTrueOrFalse(),
  }, {
    id: `event-offer-meal`,
    text: `Add meal`,
    price: 15,
    checked: getTrueOrFalse(),
  }, {
    id: `event-offer-seats`,
    text: `Choose seats`,
    price: 5,
    checked: getTrueOrFalse(),
  }, {
    id: `event-offer-train`,
    text: `Travel by train`,
    price: 40,
    checked: getTrueOrFalse(),
  }
];

export const offersForTypes = {
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

export const generateDestination = () => {
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

  return {
    description: getRandomArrayItem(descriptions),
    photos: getPhotosArray(),
  };
};

const createEvent = function () {
  const type = getRandomArrayItem(Math.random() > 0.5 ? ACTIVITY_TYPES : TRANSFER_TYPES);
  const startDate = getRandomStartDate();
  const endDate = getRandomEndDate(startDate);
  const city = getRandomArrayItem(CITIES);
  return {
    id: String(new Date() + Math.random()),
    type,
    city,
    destination: generateDestination(),
    offers: offersForTypes[type],
    price: getRandomIntegerNumber(MIN_EVENT_PRICE, MAX_EVENT_PRICE),
    startDate,
    endDate,
    dateForGroup: formatDate(startDate),
    isFavorite: getTrueOrFalse(),
  };
};

const createEvents = (count) => {
  return new Array(count)
    .fill(``)
    .map(createEvent);
};

export {createEvent, createEvents};
