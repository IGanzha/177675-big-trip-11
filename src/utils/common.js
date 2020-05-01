import moment from 'moment';

export const getTwoNumbersFormat = (number) => {
  return String(number).padStart(2, `0`);
};

export const formatDate = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatDateForEdit = (date) => {
  return moment(date).format(`DD/MM/YY`);
};

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const getFormattedTimeDuration = (startDate, endDate) => {

  // высчитываю разницу для проверки
  // const start = moment(startDate).clone();
  // const end = moment(endDate).clone();

  // const days = end.diff(start, `days`);
  // console.log(`дней! - `, days);

  // start.add(days, `days`);
  // const hours = end.diff(start, `hours`);
  // console.log(`часов! - `, hours);

  // start.add(hours, `hours`);
  // const minutes = end.diff(start, `minutes`);
  // console.log(`минут! - `, minutes);

  const difference = moment(endDate).diff(moment(startDate));
  // // console.log(`милисек `, difference);
  // // console.log(`сек `, difference/1000);
  // console.log(`мин `, difference/(1000*60));
  // console.log(`часов `, difference/(1000*60*60));
  // console.log(`дней `, difference/(1000*60*60*24));

  return moment(difference).utc().format(`DDD[D] H[H] mm[M]`);
};

export const getGroupedEvents = (arr, field, sortType) => {
  const result = {};
  if (sortType === `events-up`) {
    arr.forEach((event) => {
      if (result[event[field]] === undefined) {
        result[event[field]] = [];
      }
      result[event[field]].push(event);
    });
  } else {
    result[`noGroup`] = arr;
  }

  return result;
};
