import { API } from 'nouislider';
import Draw from './Draw';
import Filter from './Filter';
import ICard from './type/ICard';
import { CardKeys } from './type/cardKeys';
import Constants from '../data/Constants';

export default class Listeners {
  private MAX_ITEMS_IN_CART = 20;

  private constants = new Constants();

  private addBlock(target: HTMLElement, data: ICard[]): void {
    const list = data;
    if (target.querySelector('.card__in-cart')) {
      target.querySelector('.card__in-cart')?.remove();
      Draw.changeCountsOfCart('-');
      list[Number(target.dataset.cardId)].inCart = false;
      let oldValue = window.localStorage.getItem('inCart');
      if (oldValue) {
        oldValue = oldValue.replace(`${data[Number(target.dataset.cardId)].id},`, '');
        window.localStorage.setItem('inCart', oldValue);
      }
    } else if (Number(document.querySelector('.cart__item-counter')?.innerHTML) < this.MAX_ITEMS_IN_CART) {
      const inCartBlock = document.createElement('div');
      inCartBlock.innerHTML = 'В корзине';
      inCartBlock.classList.add('card__in-cart');
      target.append(inCartBlock);
      Draw.changeCountsOfCart('+');
      list[Number(target.dataset.cardId)].inCart = true;
      const oldValue = window.localStorage.getItem('inCart');
      if (oldValue) {
        window.localStorage.setItem('inCart', `${oldValue + data[Number(target.dataset.cardId)].id},`);
      } else {
        window.localStorage.setItem('inCart', `${data[Number(target.dataset.cardId)].id},`);
      }
    } else {
      Draw.drawPopUp();
    }
  }

  public addRemoveCartBlock(event: Event, draw: Draw, data: ICard[]):void {
    const { target } = event;
    if (target instanceof HTMLElement) {
      if (target.parentElement?.classList.contains('card')) {
        this.addBlock(target.parentElement, data);
      }
      if (target.classList.contains('card')) {
        this.addBlock(target, data);
      }
    }
  }

  public static changeFilterMode(event: Event): void {
    if (event.target instanceof HTMLElement) {
      const targetClassList: DOMTokenList = event.target.classList;
      if (['item-type', 'item-color', 'company-logo'].includes(targetClassList[0])) {
        if (targetClassList.contains('active-filter')) {
          targetClassList.remove(targetClassList[targetClassList.length - 2]);
        } else {
          targetClassList.add(`${targetClassList[0] === 'company-logo' ? targetClassList[1] : targetClassList[0]}_active`);
        }
        event.target.classList.toggle('active-filter');
      }
    }
  }

  public static changeQueue(data: ICard[]): void {
    const select: HTMLSelectElement | null = document.querySelector('.filter__select');
    if (select) {
      const { value } = select;
      window.localStorage.setItem('filter__select', value);
      switch (value) {
        case 'fromAtoZ':
          Draw.drawCards(Filter.sortList(CardKeys.name, data));
          break;
        case 'fromZtoA':
          Draw.drawCards(Filter.sortList(CardKeys.name, data).reverse());
          break;
        case 'byYearToUp':
          Draw.drawCards(Filter.sortList(CardKeys.year, data));
          break;
        case 'byYearToDown':
          Draw.drawCards(Filter.sortList(CardKeys.year, data).reverse());
          break;
        case 'byCountToUp':
          Draw.drawCards(Filter.sortList(CardKeys.count, data));
          break;
        case 'byCountToDown':
          Draw.drawCards(Filter.sortList(CardKeys.count, data).reverse());
          break;
        default:
          break;
      }
    }
  }

  public deleteFilters(sliderCounts: API | null, sliderYears: API | null): void {
    document.querySelectorAll('.active-filter').forEach((filter) => {
      if (filter instanceof HTMLElement) {
        filter.click();
      }
    });
    const checkbox = document.querySelector('.filter__checkbox');
    if (checkbox instanceof HTMLInputElement) {
      checkbox.checked = false;
    }
    const search = document.querySelector('.filter__search');
    if (search instanceof HTMLInputElement) {
      search.value = '';
    }
    if (sliderCounts && sliderYears) {
      sliderCounts.set([this.constants.countsLeftBorder, this.constants.countsRightBorder]);
      sliderYears.set([this.constants.yearLeftBorder, this.constants.yearRightBorder]);
    }
  }
}
