const getOrderDirection = (name, { by, desc }) => {
  if (name !== by) {
    return 'unsorted';
  }
  return desc ? 'desc' : 'asc';
};

const getComparator = (fieldToSortBy, isDesc) => (a, b) => {
  const [firstValue, secondValue] = isDesc
    ? [b[fieldToSortBy], a[fieldToSortBy]]
    : [a[fieldToSortBy], b[fieldToSortBy]];
  return String(firstValue).localeCompare(secondValue, 'en-US', { numeric: true, localeMatcher: 'lookup', caseFirst: 'upper' });
};

class Grid extends HTMLElement {
  // Внутреннее состояние
  #state = {
    isLoading: false,
    columns: ['id', 'author', 'quote', 'tags'],
    data: [],
    order: {
      by: 'id',
      desc: false,
    },
    search: {
      ref: {},
      by: null,
      value: null,
    }
  };

  constructor() {
    super();
  }

  // Смена состояния = ререндер
  // Лучше использовать какую-нибудь библиотеку - например https://www.npmjs.com/package/on-change
  // чтобы отслеживать изменения
  setState(state) {
    this.#state = {...this.#state, ...state};
    this.render();
  }

  render() {
    const { columns, data, isLoading, order, search } = this.#state;

    const table = document.createElement('table');
    table.classList.add('grid')

    // Создаем заголовки
    const thead = document.createElement('thead');
    const trHead = document.createElement('tr')

    columns.forEach((column) => {
      const th = document.createElement('th');
      th.classList.add('grid__cell', 'grid__head', `grid__${column}`);
      const link = document.createElement('a');
      link.setAttribute('href', '');
      link.innerHTML = `${column} (${getOrderDirection(column, order)})`;

      // Вешаем обработчик на сортировку
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const { by, desc } = order;
        this.setState({
          order: {
            by: column,
            desc: by === column ? !desc : false,
          }
        });
      });

      th.appendChild(link);

      // Поисковый инпут
      const input = document.createElement('input');
      input.setAttribute('type', 'text');
      input.classList.add('grid__input', 'grid__column');

      if (column === search.by) {
        search.ref = input;
        input.value = search.value;
      }

      input.addEventListener('input', (e) => {
        e.preventDefault();
        const value = e.target.value;
        this.setState({
          search: {
            by: column,
            value,
          }
        });
      });

      th.appendChild(input);
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    table.appendChild(thead);

    // Создаем строки с данными
    const tbody = document.createElement('tbody');

    // Данные грузятся
    if (isLoading || data.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.innerHTML = isLoading ? 'Данные загружаются...' : 'Данных нет';
      td.setAttribute('colspan', columns.length);
      tr.appendChild(td);
      tbody.appendChild(tr);
    }

    // Отсортируем данные
    data.sort((a, b) => {
      const compare = getComparator(order.by, order.desc);
      return compare(a, b);
    });

    // Данные есть
    if (!isLoading && data.length > 0) {
      data.forEach(item => {
        const tr = document.createElement('tr');
        Object.entries(item).forEach(([key, value]) => {
          const td = document.createElement('td');
          td.classList.add('grid__cell', 'grid__data', `grid__${key}`);

          if (key === search.by 
            && String(value).includes(search.value) > 0 
            && search.value !== '') {
            td.classList.add('grid__found');
          }

          td.innerHTML = Array.isArray(value) ? value.join(' | ') : value;
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      });
    }

    table.appendChild(tbody);

    // Обновляем
    this.innerHTML = '';
    this.appendChild(table);

    if (search.by) {
      search.ref.focus();
    }
  }

  connectedCallback() {
    this.render();
  }
}

window.customElements.define('custom-grid', Grid);
