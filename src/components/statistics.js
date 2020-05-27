import AbstractSmartComponent from './abstract-smart-component.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';
import {CHART_BAR_HEIGHT, TRANSFER_TYPES} from '../const.js';

const ChartName = {
  TRANSPORT: `TRANSPORT`,
  TIME: `TIME`,
  MONEY: `MONEY'`,
};

const getUniqTypes = (points) => {
  const typesArr = [];
  points.forEach((point) => {
    if (!typesArr.includes(point.type)) {
      typesArr.push(point.type);
    }
  });
  return typesArr;
};

const getTimeChartData = (points) => {
  const types = getUniqTypes(points);

  const time = types.map((type) => {
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

  return {
    labels: types,
    data: time,
  };
};

const getTransportChartData = (points) => {
  const uniqTypes = getUniqTypes(points);

  const transportTypes = uniqTypes.filter((type) =>{
    return TRANSFER_TYPES.includes(type);
  });

  const transportCountOnTypes = transportTypes.map((type) => {
    return points.filter((point) => {
      return point.type === type;
    }).length;
  });

  return {
    labels: transportTypes,
    data: transportCountOnTypes,
  };
};

const getMoneyChartData = (points) => {
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

  return {
    labels: types,
    data: moneySpentOnTypes,
  };
};

const renderChart = (ctxElement, chartName, chartData, formatter) => {

  return new Chart(ctxElement, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: chartData.labels,
      datasets: [{
        data: chartData.data,
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`,
        barThickness: 55,
        minBarLength: 50
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
          formatter
        }
      },
      title: {
        display: true,
        text: chartName,
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
    const moneyCtxElement = element.querySelector(`.statistics__chart--money`);
    const transportCtxElement = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtxElement = element.querySelector(`.statistics__chart--time`);

    const uniqTypes = getUniqTypes(this._points.getAllPoints());

    const uniqTransportTypes = uniqTypes.filter((type) => {
      return TRANSFER_TYPES.includes(type);
    });

    moneyCtxElement.height = CHART_BAR_HEIGHT * uniqTypes.length;
    transportCtxElement.height = CHART_BAR_HEIGHT * uniqTransportTypes.length;
    timeSpendCtxElement.height = CHART_BAR_HEIGHT * uniqTypes.length;

    this._resetCharts();

    const moneyChartData = getMoneyChartData(this._points.getAllPoints());
    const transportChartData = getTransportChartData(this._points.getAllPoints());
    const timeChartData = getTimeChartData(this._points.getAllPoints());

    const transportChartFormatter = (val) => `${val}x`;
    const moneyChartFormatter = (val) => `€ ${val}`;
    const timeChartFormatter = (val) => `${val}H`;

    this._moneyChart = renderChart(moneyCtxElement, ChartName.MONEY, moneyChartData, moneyChartFormatter);
    this._timeSpendChart = renderChart(timeSpendCtxElement, ChartName.TIME, timeChartData, timeChartFormatter);

    this._transportChart = renderChart(transportCtxElement, ChartName.TRANSPORT, transportChartData, transportChartFormatter);
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
