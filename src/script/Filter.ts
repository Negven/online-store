import data from '../data/data';
import ICard from './type/ICard';
import { CardKeys } from './type/cardKeys';
import { Option } from './type/option';

export default class Filter {
  public static makeOption(): Option {
    const option: Option = {};
    document.querySelectorAll('.active-filter').forEach((filterElement) => {
      if (filterElement instanceof HTMLElement) {
        const [key, property]: string[] = filterElement.dataset.filter?.split('=') || [];
        if (option[key]) {
          option[key].push(property);
        } else {
          option[key] = [property];
        }
      }
    });

    const checkboxFavorite: HTMLInputElement | null = document.querySelector('.filter__checkbox');
    if (checkboxFavorite?.checked) {
      option.favorite = [true];
      window.localStorage.setItem('favorite', 'true');
    } else {
      window.localStorage.setItem('favorite', 'false');
    }
    window.localStorage.setItem('option', JSON.stringify(option));
    return option;
  }

  public static makeNewDataList(option: Option): ICard[] {
    const newData: ICard[] = [];
    data.forEach((card) => {
      let isCorrectCard = true;
      Object.keys(option).forEach((optionKey) => {
        let hasRightProperty = false;
        option[optionKey].forEach((cardProperty) => {
          if (card[optionKey as CardKeys] === cardProperty) {
            hasRightProperty = true;
          }
        });
        if (!hasRightProperty) {
          isCorrectCard = false;
        }
      });
      if (isCorrectCard) {
        newData.push(card);
      }
    });
    return option ? newData : data;
  }

  public static sortList(key: CardKeys, list: ICard[]): ICard[] {
    let newList = [];
    newList = list.sort((a, b) => {
      if (a[key] > b[key]) return a.id - b.id;
      return b.id - a.id;
    });
    return newList;
  }

  public static searchByName(list: ICard[]): ICard[] {
    const newList: ICard[] = [];
    const searchBlock = document.querySelector('.filter__search');
    if (searchBlock instanceof HTMLInputElement) {
      const { value } = searchBlock;
      list.forEach((card) => {
        if (card.name.toLowerCase().includes(value.toLowerCase())) {
          newList.push(card);
        }
      });
      window.localStorage.setItem('filter__search', value);
    }
    return newList;
  }

  static changeRange(list: ICard[]): ICard[] {
    const newData: ICard[] = [];
    const borders: number[] = [];
    document.querySelectorAll('.noUi-handle').forEach((item) => {
      borders.push(Number(item.attributes.getNamedItem('aria-valuenow')?.value));
    });
    const [firstLeftBorder, firstRightBorder, secondLeftBorder, secondRightBorder] = borders;
    list.forEach((card) => {
      if (card.count >= firstLeftBorder && card.count <= firstRightBorder) {
        if (card.year >= secondLeftBorder && card.year <= secondRightBorder) {
          newData.push(card);
        }
      }
    });
    window.localStorage.setItem('count', `${firstLeftBorder},${firstRightBorder}`);
    window.localStorage.setItem('year', `${secondLeftBorder},${secondRightBorder}`);
    return newData;
  }
}
