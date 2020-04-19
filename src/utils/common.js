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

export const getGroupedEvents = (arr, dateField) => {
  const result = {};

  arr.forEach((event) => {
    if (result[event[dateField]] === undefined) {
      result[event[dateField]] = [];
    }

    result[event[dateField]].push(event);
  });
  return result;
};
