import Point from '../models/point.js';
import {nanoid} from 'nanoid';

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map((point) => point.toRAW()));
          this._store.setPoints(items);

          return points;
        });
    }

    const storePoints = Object.values(this._store.getPoints());
    return Promise.resolve(Point.parsePoints(storePoints));
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._store.setOffers(offers);

          return offers;
        });
    }

    const storeOffers = Object.values(this._store.getOffers());
    return Promise.resolve(storeOffers);
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._store.setDestinations(destinations);

          return destinations;
        });
    }

    const storeDestinations = Object.values(this._store.getDestinations());
    return Promise.resolve(storeDestinations);
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._store.setPoint(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }
    const localNewPointId = nanoid();
    const localNewPoint = Point.clone(Object.assign(point, {id: localNewPointId}));

    this._store.setPoint(localNewPoint.id, localNewPoint.toRAW());

    return Promise.resolve(localNewPoint);
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._store.setPoint(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }
    const localPoint = Point.clone(Object.assign(point, {id}));
    this._store.setPoints(id, localPoint.toRAW());
    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint()
        .then(() => this._store.removePoint(id));
    }

    this._store.removePoint(id);
    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._store.getPoints());

      return this._api.sync(storePoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._store.setPoints(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
