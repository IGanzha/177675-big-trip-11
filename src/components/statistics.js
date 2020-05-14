import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

import moment from 'moment';
import {TRANSFER_TYPES} from '../const.js';

const getUniqTypes = (points) => {
  const typesArr = [];
  points.forEach((point) => {
    if (!typesArr.includes(point.type)) {
      typesArr.push(point.type);
    }
  });
  return typesArr;
};

const renderMoneyChart = (moneyCtx, points) => {
  const types = getUniqTypes(points);

  const moneySpentOnTypes = types.map((type) => {
    let typeMoney = 0;
    points.forEach((point) => {
      if (type === point.type) {
        typeMoney += point.price;
      }
    });
    return typeMoney;
  });

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: moneySpentOnTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, points) => {

  const uniqTypes = getUniqTypes(points);

  const transportTypes = uniqTypes.filter((type) =>{
    return TRANSFER_TYPES.includes(type);
  });

  const transportCountOnTypes = transportTypes.map((type) => {
    return points.filter((point) => {
      return point.type === type;
    }).length;
  });

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: transportTypes,
      datasets: [{
        data: transportCountOnTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeChart = (timeSpendCtx, points) => {

  const types = getUniqTypes(points);

  const timeSpendOnTypes = types.map((type) => {
    let typeTimeInMiliseconds = 0;

    points.forEach((point) => {
      if (point.type === type) {
        const dateFrom = moment(point.startDate);
        const dateTo = moment(point.endDate);
        const ms = dateTo.diff(dateFrom);
        typeTimeInMiliseconds += ms;
      }
    });

    const duration = moment.duration(typeTimeInMiliseconds);
    return parseInt(duration.asHours(), 10);
  });

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: types,
      datasets: [{
        data: timeSpendOnTypes,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}H`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};


export default class Statistics extends AbstractSmartComponent {
  constructor(points) {
    super();
    this._points = points;
    this._timeSpendChart = null;
    this._moneyChart = null;
    this._transportChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();

    this.rerender(this._points);
  }

  recoveryListeners() {}

  rerender(points) {
    this._points = points;

    super.rerender();

    this._renderCharts();
  }

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    const uniqTypes = getUniqTypes(this._points.getPoints());
    const uniqTransportTypes = uniqTypes.filter((type) => {
      return TRANSFER_TYPES.includes(type);
    });

    const BAR_HEIGHT = 55;
    moneyCtx.height = BAR_HEIGHT * uniqTypes.length;
    transportCtx.height = BAR_HEIGHT * uniqTransportTypes.length;
    timeSpendCtx.height = BAR_HEIGHT * uniqTypes.length;

    this._resetCharts();
    this._moneyChart = renderMoneyChart(moneyCtx, this._points.getPoints());
    this._timeSpendChart = renderTimeChart(timeSpendCtx, this._points.getPoints());

    this._transportChart = renderTransportChart(transportCtx, this._points.getPoints());

  }

  _resetCharts() {
    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }

    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._transportChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }
  }

}
