import {capitalizeFirstLetter} from '../utils/common.js';

export default class Offer {
  constructor(data) {
    this.type = capitalizeFirstLetter(data[`type`]);
    this.offers = data[`offers`] || ``;
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}
