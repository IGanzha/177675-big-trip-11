import {FilterType} from '../const.js';


const getFuturePoints = (points) => {
  const dateNow = new Date();
  const filteredPoints = points.filter((point) => {
    return point.startDate > dateNow;
  });

  return (filteredPoints.length > 0) ? filteredPoints : [];
};

const getPastPoints = (points) => {
  const dateNow = new Date();
  const filteredPoints = points.filter((point) => {
    return point.endDate < dateNow;
  });
  return (filteredPoints.length > 0) ? filteredPoints : [];
};

const getPointsByFilter = (points, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return points;
    case FilterType.PAST:
      return getPastPoints(points);
    case FilterType.FUTURE:
      return getFuturePoints(points);
  }

  return points;
};

export {getFuturePoints, getPastPoints, getPointsByFilter};
