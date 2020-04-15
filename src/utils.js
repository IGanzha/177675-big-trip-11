const getTwoNumbersFormat = (number) => {
  return String(number).padStart(2, `0`);
};

const castDateFormat = (date) => {
  return (
    `${date.getFullYear()}-${getTwoNumbersFormat(date.getMonth())}-${getTwoNumbersFormat(date.getDate())}`
  );
};

const castTimeFormat = (date) => {
  return (
    `${getTwoNumbersFormat(date.getHours())}:${getTwoNumbersFormat(date.getMinutes())}`
  );
};

const getGroupedEvents = (arr, dateField) => {
  const result = {};

  arr.forEach((event) => {
    if (result[event[dateField]] === undefined) {
      result[event[dateField]] = [];
    }

    result[event[dateField]].push(event);
  });
  return result;
};

export {castDateFormat, castTimeFormat, getTwoNumbersFormat, getGroupedEvents};
