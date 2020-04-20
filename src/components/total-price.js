import AbstractComponent from "./abstract-component.js";

const totalPrice = 1230;
// доработать - реализовать расчет итоговой стоимости

const createTotalPriceTemplate = () => {
  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`
  );
};

export default class TotalPrice extends AbstractComponent {

  getTemplate() {
    return createTotalPriceTemplate();
  }
}
