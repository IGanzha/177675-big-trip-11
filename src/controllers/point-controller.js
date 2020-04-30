import EventComponent from '../components/event.js';
import EventEditComponent from '../components/event-edit.js';
import {render, replace, RenderPosition} from '../utils/render.js';


export default class PointController {
  constructor(container, index, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._index = index;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._type = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(point) {
    const oldEventComponent = this._eventComponent;
    const oldEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventComponent(point);
    this._eventEditComponent = new EventEditComponent(point, this._index);

    this._eventComponent.setEditButtonClickHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._eventEditComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      this._replaceEditToEvent();
    });

    this._eventEditComponent.setFavoritesButtonClickHandler((evt) => {
      evt.preventDefault();

      this._onDataChange(this, point, {
        isFavorite: !point.isFavorite,
      });
    });


    if (oldEventEditComponent && oldEventComponent) {
      replace(this._eventComponent, oldEventComponent);
      replace(this._eventEditComponent, oldEventEditComponent);
    } else {
      render(this._container, this._eventComponent, RenderPosition.BEFOREEND);
    }
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
