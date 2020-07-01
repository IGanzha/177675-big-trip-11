export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getPoints() {
    try {
      return JSON.parse(this._storage.getItem(`${this._storeKey}-points`)) || {};
    } catch (err) {
      return {};
    }
  }

  getDestinations() {
    try {
      return JSON.parse(this._storage.getItem(`${this._storeKey}-destinations`)) || {};
    } catch (err) {
      return {};
    }
  }

  getOffers() {
    try {
      return JSON.parse(this._storage.getItem(`${this._storeKey}-offers`)) || {};
    } catch (err) {
      return {};
    }
  }

  setPoints(items) {
    this._storage.setItem(
        `${this._storeKey}-points`,
        JSON.stringify(items)
    );
  }

  setPoint(key, value) {
    const store = this.getPoints();

    this._storage.setItem(
        `${this._storeKey}-points`,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  setDestinations(items) {
    this._storage.setItem(
        `${this._storeKey}-destinations`,
        JSON.stringify(items)
    );
  }

  setOffers(items) {
    this._storage.setItem(
        `${this._storeKey}-offers`,
        JSON.stringify(items)
    );
  }

  removePoint(key) {
    const store = this.getItems();

    delete store[key];

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(store)
    );
  }
}
