import {capitalizeFirstLetter} from '../utils/common.js';

export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.type = capitalizeFirstLetter(data[`type`]);
    this.startDate = new Date(data[`date_from`]);
    this.endDate = new Date(data[`date_to`]);
    this.price = data[`base_price`];
    this.city = data[`destination`][`name`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.destination = {};
    this.destination.description = data[`destination`][`description`] || ``;

    this.destination.photos = data[`destination`][`pictures`] || ``;

    this.chosenOffers = data[`offers`] || ``;
    this.chosenOffers.map((chosenOffer) => {
      chosenOffer.isChecked = true;
    });
  }

  toRAW() {
    return {
      'id': this.id,
      'type': this.type.toLowerCase(),
      'date_from': this.startDate,
      'date_to': this.endDate,
      'base_price': +this.price,
      'is_favorite': this.isFavorite,
      'offers': this.chosenOffers,
      'destination': {
        'name': this.city,
        'description': this.destination.description,
        'pictures': this.destination.photos,
      },
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
