const totalTripPrice = 1230;

const createTripPrice = () => {
  return (
    `Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalTripPrice}</span>`
  );
};

export const createCostInfoTemplate = () => {
  const tripPrice = createTripPrice();
  return (
    `<p class="trip-info__cost">
      ${tripPrice}
    </p>`
  );
};
