export default class Destination {
  constructor(data) {
    this.description = data[`description`] || ``;
    this.city = data[`name`] || ``;
    this.photos = data[`pictures`] || [];
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}
