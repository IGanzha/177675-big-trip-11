import {capitalizeFirstLetter} from '../utils/common.js';

export default class Offer {
  constructor(offerData) {
    this.type = capitalizeFirstLetter(offerData[`type`]);
    this.offers = offerData[`offers`] || ``;
  }

  static parseOffer(offer) {
    return new Offer(offer);
  }

  static parseOffers(offers) {
    return offers.map(Offer.parseOffer);
  }
}

