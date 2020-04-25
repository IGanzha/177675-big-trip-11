import EventComponent from "../components/event.js";
import EventEditComponent from '../components/event-edit.js';
import {render, replace, RenderPosition} from '../utils/render.js';


export default class PointController {
  // constructor(container, onDataChange) {
  constructor(container) {
    this._container = container;
    // this._onDataChange = onDataChange;

    this._eventComponent = null;
    this._eventEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point) {

    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(point);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler(() => {
      // evt.preventDefault();
      this._replaceEditToEvent();
    });



    // this._eventEditComponent.setFavoritesButtonClickHandler((evt) => {
    //   // console.log();
    //   // console.log(this);
    //   // this._onDataChange(point, {
    //   //   isFavorite: !point.isFavorite,
    //   // });
    // });

    render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
  }

  _replaceEventToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
  }

  _replaceEditToEvent() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    replace(this._eventComponent, this._eventEditComponent);
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }

}
