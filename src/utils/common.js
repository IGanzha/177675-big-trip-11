export const getTwoNumbersFormat = (number) => {
  return String(number).padStart(2, `0`);
};

export const castDateFormat = (date, connector) => {
  return (
    `${date.getFullYear()}${connector}${getTwoNumbersFormat(date.getMonth() + 1)}${connector}${getTwoNumbersFormat(date.getDate())}`
  );
};

export const castDateFormatForEdit = (date, connector) => {
  return (
    `${getTwoNumbersFormat(date.getDate())}${connector}${getTwoNumbersFormat(date.getMonth() + 1)}${connector}${date.getFullYear()}`
  );
};

export const castTimeFormat = (date) => {
  return (
    `${getTwoNumbersFormat(date.getHours())}:${getTwoNumbersFormat(date.getMinutes())}`
  );
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
