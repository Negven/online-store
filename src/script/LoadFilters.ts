import * as noUiSlider from 'nouislider';
import ICardType from './type/ICard';

export default class LoadFilters {
  public data: ICardType[];

  sliderCounts: noUiSlider.API | null;

  sliderYear: noUiSlider.API | null;

  constructor(
    data: ICardType[],
    sliderYear: noUiSlider.API | null,
    sliderCounts: noUiSlider.API | null,
  ) {
    this.data = data;
    this.sliderYear = sliderYear;
    this.sliderCounts = sliderCounts;
  }

  loadSaveFilter(): void {
    const optionString = window.localStorage.getItem('option');
    const selectString = window.localStorage.getItem('filter__select');
    const searchString = window.localStorage.getItem('filter__search');
    const favoriteValue: boolean = window.localStorage.getItem('favorite') === 'true';
    const idList = window.localStorage.getItem('inCart');
    const countsString = window.localStorage.getItem('count');
    const yearString = window.localStorage.getItem('year');
    let option: { [key: string]: string[] } = {};
    const cartCounterValue = window.localStorage.getItem('cartCounter');
    if (optionString) option = JSON.parse(optionString);
    if (searchString) LoadFilters.updateSortBlock('.filter__search', searchString);
    if (selectString) LoadFilters.updateSortBlock('.filter__select', selectString);
    if (idList) this.updateCardsInCart(idList);
    if (countsString) this.sliderCounts?.set(countsString.split(','));
    if (yearString) this.sliderYear?.set(yearString.split(','));
    if (cartCounterValue) LoadFilters.updateCartCounter(cartCounterValue);
    LoadFilters.updateFilterBlock(option);
    LoadFilters.updateFavoriteCheckbox(favoriteValue);
  }

  static updateCartCounter(cartCounterValue: string) {
    const cartCounter: HTMLElement | null = document.querySelector('.cart__item-counter');
    if (cartCounter) {
      cartCounter.innerHTML = cartCounterValue;
    }
  }

  static updateSortBlock(selector: string, value: string): void {
    const block = document.querySelector(selector);
    if (block instanceof HTMLInputElement || block instanceof HTMLSelectElement) {
      block.value = value;
    }
  }

  static updateFilterBlock(option: { [key: string]: string[] }): void {
    Object.keys(option).forEach((optionKey) => {
      option[optionKey].forEach((property) => {
        const item = document.querySelector(`[data-filter="${optionKey}=${property}"]`);
        if (item instanceof HTMLElement) {
          item.click();
        }
      });
    });
  }

  static updateFavoriteCheckbox(favoriteValue: boolean): void {
    if (favoriteValue) {
      const checkbox = document.querySelector('.filter__checkbox');
      if (checkbox instanceof HTMLInputElement) {
        checkbox.checked = true;
      }
    }
  }

  updateCardsInCart(idListString: string): void {
    idListString.split(',').forEach((id) => {
      this.data[Number(id)].inCart = true;
    });
  }
}
