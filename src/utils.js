export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`,
  BEFORE: `before`
};

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

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTER:
      container.after(element);
      break;
    case RenderPosition.BEFORE:
      container.before(element);
      break;
  }
};
