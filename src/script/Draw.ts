import ICard from './type/ICard';

export default class Draw {
  static drawCards(listOfCards: ICard[]):void {
    const cardContainer: HTMLElement | null = document.querySelector('.items-container');
    if (cardContainer) {
      cardContainer.innerHTML = '';
      if (listOfCards.length > 0) {
        listOfCards.forEach((card) => {
          const cardBlock = document.createElement('div');
          cardBlock.classList.add('card');
          cardBlock.dataset.cardId = `${card.id}`;
          cardBlock.innerHTML = `
                  <img class="card__img" src="${card.img}" alt="Фото машины">
                  <h3 class="card__name">${card.name}</h3>
                  <p class="card__paragraph">Количество: ${card.count}</p>
                  <p class="card__paragraph">Год выпуска: ${card.year}</p>
                  <p class="card__paragraph">Цвет: ${card.color}</p>
                  <p class="card__paragraph">Марка: ${card.brand}</p>
                  <p class="card__paragraph">Тип: ${card.type}</p>
                  <p class="card__paragraph">Популярный: ${card.favorite ? 'Да' : 'Нет'}</p>
                  ${card.inCart ? '<div class="card__in-cart">В корзине</div>' : ''}
                 `;
          cardContainer.append(cardBlock);
        });
      } else {
        const alertMsg = document.createElement('div');
        alertMsg.classList.add('items-container__alert-msg');
        alertMsg.innerHTML = 'Извините, совпадений не обнаружено';
        cardContainer.append(alertMsg);
      }
    }
  }

  static changeCountsOfCart(direct: string): void {
    const counter: HTMLElement | null = document.querySelector('.cart__item-counter');
    if (counter) {
      counter.innerHTML = String(Number(counter.innerHTML) + (direct === '+' ? +1 : -1));
      window.localStorage.setItem('cartCounter', counter.innerHTML);
    }
  }

  static drawPopUp(): void {
    const popUpBack = document.createElement('div');
    popUpBack.classList.add('popUp__background');
    const popUp = document.createElement('div');
    popUp.classList.add('popUp');
    popUp.innerHTML = 'Извините, все слоты заполнены';
    popUpBack.append(popUp);
    popUpBack.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement) {
        if (event.target.classList.contains('popUp__background')) {
          event.target.remove();
        }
      }
    });
    document.querySelector('body')?.append(popUpBack);
  }
}
