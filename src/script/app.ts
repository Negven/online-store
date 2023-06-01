import '../index.css';
import '../media.css';
import './importImg';
import * as noUiSlider from 'nouislider';
import wNumb from 'wnumb';
import DrawFunctions from './Draw';
import data from '../data/data';
import Listeners from './Listeners';
import ICard from './type/ICard';
import Filter from './Filter';
import 'nouislider/dist/nouislider.css';
import LoadFilters from './LoadFilters';
import Constants from '../data/Constants';

export default class App {
  private data: ICard[] = data;

  private draw: DrawFunctions = new DrawFunctions();

  private listeners: Listeners = new Listeners();

  private readonly sliderCounts: noUiSlider.API | null;

  private readonly sliderYear: noUiSlider.API | null;

  private loader: LoadFilters;

  private constants: Constants = new Constants();

  constructor() {
    this.sliderCounts = this.createSlider('sliderCounts', this.constants.countsLeftBorder, this.constants.countsRightBorder);
    this.sliderYear = this.createSlider('sliderYear', this.constants.yearLeftBorder, this.constants.yearRightBorder);
    this.loader = new LoadFilters(data, this.sliderYear, this.sliderCounts);
  }

  start() {
    this.addListeners();
    this.loader.loadSaveFilter();
    App.updateTable();
  }

  createSlider(sliderId: string, min: number, max: number): noUiSlider.API | null {
    const sliderCounts = document.getElementById(sliderId);
    if (sliderCounts) {
      return noUiSlider.create(sliderCounts, {
        start: [min, max],
        connect: true,
        tooltips: [wNumb({ decimals: 0 }), wNumb({ decimals: 0 })],
        range: {
          min,
          max,
        },
        step: this.constants.sliderStep,
      });
    }
    return null;
  }

  static updateTable(): void {
    let listCard: ICard[] = Filter.makeNewDataList(Filter.makeOption());
    listCard = Filter.searchByName(listCard);
    listCard = Filter.changeRange(listCard);
    Listeners.changeQueue(listCard);
  }

  addListeners(): void {
    document.querySelector('.items-container')?.addEventListener('click', (event) => {
      this.listeners.addRemoveCartBlock(event, this.draw, this.data);
    });
    document.querySelector('.filter')?.addEventListener('click', (event) => {
      Listeners.changeFilterMode(event);
      App.updateTable();
    });
    document.querySelector('.filter__select')?.addEventListener('change', (event) => {
      if (event.target instanceof HTMLSelectElement) {
        App.updateTable();
      }
    });
    document.querySelector('.filter__search')?.addEventListener('input', (event) => {
      if (event.target instanceof HTMLInputElement) {
        App.updateTable();
      }
    });
    document.querySelector('#deleteStorage')?.addEventListener('click', () => {
      window.localStorage.clear();
      window.location.reload();
    });
    document.querySelector('#deleteFilters')?.addEventListener('click', () => {
      this.listeners.deleteFilters(this.sliderCounts, this.sliderYear);
      App.updateTable();
    });
    document.querySelector('.delete-btn')?.addEventListener('click', () => {
      const searchBlock = document.querySelector('.filter__search');
      if (searchBlock instanceof HTMLInputElement) {
        searchBlock.value = '';
      }
      App.updateTable();
    });
    this.sliderYear?.on('change', () => {
      App.updateTable();
    });
    this.sliderCounts?.on('change', () => {
      App.updateTable();
    });
  }
}
