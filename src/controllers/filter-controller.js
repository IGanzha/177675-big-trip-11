import FilterComponent from '../components/filter.js';
import {FilterType} from '../const.js';
import {getPointsByFilter} from '../utils/filter.js';
import {render, replace, RenderPosition} from '../utils/render.js';


export default class FilterController {
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._pointsModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        checked: filterType === this._activeFilterType,
      };
    });
    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    this.disableEmptyFilters();

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    this._filterComponent.setDefaultView();
  }

  disableEmptyFilters() {
    Object.values(FilterType).map((filter) => {
      const filteredPoints = getPointsByFilter(this._pointsModel.getAllPoints(), filter);
      if (filteredPoints.length === 0) {
        this._filterComponent.disableEmptyFilter(filter, true);
      } else {
        this._filterComponent.disableEmptyFilter(filter, false);
      }
    });
  }

  _onFilterChange(filterType) {
    this._pointsModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
