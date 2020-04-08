
const createRouteTitle = (wayPoints) => {

  console.log('>>>>>', wayPoints)
  console.log(wayPoints.length);
  console.log(wayPoints[0]);
  console.log(wayPoints[0].city);
  console.log(wayPoints[0].date);

  if (wayPoints.length = 0) {
    return null;
  } else if (wayPoints.length = 1) {
    return (
      `<h1 class="trip-info__title">${wayPoints[0].city}</h1>
      <p class="trip-info__dates"> ${wayPoints[0].date}</p>`
    )
  } else if (wayPoints.length = 2) {
    return (
      `<h1 class="trip-info__title"> ${wayPoints[0].city} &mdash; ${wayPoints[1].city}</h1>
      <p class="trip-info__dates"> ${wayPoints[0].date}&nbsp;&mdash;&nbsp;${wayPoints[1].date}</p>`
    )
  } else if (wayPoints.length = 3) {
    return (
      `<h1 class="trip-info__title"> ${wayPoints[0].city} &mdash; ${wayPoints[1].city} &mdash; ${wayPoints[2].city}</h1>
      <p class="trip-info__dates"> ${wayPoints[0].date}&nbsp;&mdash;&nbsp;${wayPoints[2].date}</p>`
    )
  } else if (wayPoints.length > 3) {
    return (
      `<h1 class="trip-info__title"> ${wayPoints[0].city} &mdash; &hellip; &mdash; ${wayPoints[wayPoints.length-1].city}</h1>
      <p class="trip-info__dates"> ${wayPoints[0].date}&nbsp;&mdash;&nbsp;${wayPoints[wayPoints.length-1].date}</p>`
    )
  }
};

const createRouteInfoMarkup = (points) => {
  const routeTitle = createRouteTitle(points);
  return `<div class="trip-info__main">
        ${routeTitle}
      </div>
  `
};

export const createTripInfoTemplate = () => {
  const cities = [
    {
      city: `Amsterdam`,
      date: `MAR 18`
    }, {
      'city': `Chamonix`,
      'date': `MAR 19`
    }, {
      'city': `Geneva`,
      'date': `MAR 20`
    }
  ];
  const routeInfoMarkup = createRouteInfoMarkup(cities);
  return (
    `<section class="trip-main__trip-info  trip-info">
      ${routeInfoMarkup}
    </section>`
  );
};

