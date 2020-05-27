const CHART_BAR_HEIGHT = 55;
const CHOSEN_OFFERS_AMOUNT_TO_PREVIEW = 3;
const HOURS_IN_DAY = 24;
const SHAKE_ANIMATION_TIMEOUT = 600;

const ACTIVITY_TYPES = [`Check-in`, `Sightseeing`, `Restaurant`];
const TRANSFER_TYPES = [`Taxi`, `Bus`, `Train`, `Ship`, `Transport`, `Drive`, `Flight`];

const AUTHORIZATION = `Basic randomString123`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const FilterType = {
  ALL: `everything`,
  PAST: `past`,
  FUTURE: `future`,
};

const flatpickrConfig = {
  enableTime: true,
  altFormat: `d/m/y H:i`,
  altInput: true,
  allowInput: true,
};

const MenuItem = {
  STATISTICS: `control-stats`,
  TABLE: `control-table`,
};

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const MomentFormat = {
  DAY: `Y-MM-DD`,
  DATETIME: `Y-MM-DD[T]HH:mm`,
  EDIT: `DD/MM/YY HH:mm`,
  TIME: `HH:mm`,
};

const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`,
  BEFORE: `before`
};

const ResponseCode = {
  SUCCESS: 200,
  REDIRECTION: 300
};

const SortType = {
  TIME_DOWN: `time-down`,
  PRICE_DOWN: `price-down`,
  EVENTS_UP: `events-up`,
};


export {
  ACTIVITY_TYPES,
  AUTHORIZATION,
  CHART_BAR_HEIGHT,
  CHOSEN_OFFERS_AMOUNT_TO_PREVIEW,
  END_POINT,
  HOURS_IN_DAY,
  SHAKE_ANIMATION_TIMEOUT,
  TRANSFER_TYPES,
  FilterType,
  flatpickrConfig,
  MenuItem,
  Method,
  MomentFormat,
  SortType,
  RenderPosition,
  ResponseCode,
};
