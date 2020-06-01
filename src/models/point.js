import {capitalizeFirstLetter} from '../utils/common.js';

export default class Point {
  constructor(pointData) {
    this.id = pointData[`id`];
    this.type = capitalizeFirstLetter(pointData[`type`]);
    this.startDate = new Date(pointData[`date_from`]);
    this.endDate = new Date(pointData[`date_to`]);
    this.price = pointData[`base_price`];
    this.city = pointData[`destination`][`name`];
    this.isFavorite = Boolean(pointData[`is_favorite`]);
    this.destination = {};
    this.destination.description = pointData[`destination`][`description`] || ``;

    this.destination.photos = pointData[`destination`][`pictures`] || ``;

    this.chosenOffers = pointData[`offers`] || ``;
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

  static parsePoint(point) {
    return new Point(point);
  }

  static parsePoints(points) {
    return points.map(Point.parsePoint);
  }

  static clone(pointData) {
    return new Point(pointData.toRAW());
  }
}
