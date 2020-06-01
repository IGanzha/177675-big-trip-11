export default class Destination {
  constructor(destinationData) {
    this.description = destinationData[`description`] || ``;
    this.city = destinationData[`name`] || ``;
    this.photos = destinationData[`pictures`] || [];
  }

  static parseDestination(destination) {
    return new Destination(destination);
  }

  static parseDestinations(destionations) {
    return destionations.map(Destination.parseDestination);
  }
}
