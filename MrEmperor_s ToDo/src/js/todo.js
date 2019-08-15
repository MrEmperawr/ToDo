function setState(newState) {
  window.localStorage.setItem('state', JSON.stringify(newState));
}

function getState() {
  return JSON.parse(window.localStorage.getItem('state'));
}

function render() {
  const cards = getState();
  if (cards !== null) {
    const todoList = document.querySelector('.todo-list');

    cards.forEach((card) => {
      if (card.toggled === false) {
        todoList.insertAdjacentHTML('beforeend', `
            <li class="todo-card" data-key="${card.id}">
                <input id="${card.id}" type="button" class="done-toggle" value="Done">
                <h2>${card.titleInput}</h2>
                <h3>${card.descriptionInput}</h3>
                <p>${card.dateStamp}</p>
                <button class="delete-button" hidden>Delete Task!</button>
            </li>
            `);
      } else {
        todoList.insertAdjacentHTML('beforeend', `
            <li class="todo-card done" data-key="${card.id}">
                <input id="${card.id}" type="button" class="done-toggle" value="Done">
                <h2>${card.titleInput}</h2>
                <h3>${card.descriptionInput}</h3>
                <p>${card.dateStamp}</p>
                <button class="delete-button">Delete Task!</button>
            </li>
            `);
      }
    });
  }
}

function getFormattedDate() {
  const currentDatetime = new Date();
  const formattedDate = `${currentDatetime.getFullYear()
  }-${
    currentDatetime.getMonth() + 1
  }-${currentDatetime.getDate()
  } ${currentDatetime.getHours()
  }:${currentDatetime.getMinutes()
  }:${currentDatetime.getSeconds()}`;
  return formattedDate;
}

function addTodoCard(titleInput, descriptionInput) {
  let stateArray = getState();
  const formattedDate = getFormattedDate();
  if (stateArray === null) { stateArray = []; }
  const card = {
    titleInput,
    descriptionInput,
    toggled: false,
    id: Math.random() * 100000000000000000,
    dateStamp: formattedDate,
    sortDate: Date.now(),
  };

  if (card.titleInput.value !== '') {
    stateArray.push(card);
    setState(stateArray);
    const todoList = document.querySelector('.todo-list');
    todoList.insertAdjacentHTML('beforeend', `
    <li class="todo-card" data-key="${card.id}">
        <input id="${card.id}" type="button" class="done-toggle" value="Done">
        <h2>${card.titleInput}</h2>
        <h3>${card.descriptionInput}</h3>
        <p>${card.dateStamp}</p>
        <button class="delete-button" hidden>Delete Task!</button>
    </li>
    `);
  }
}

function removeTodoCard(key) {
  const stateArray = getState();
  const leftoverCards = stateArray.filter(card => card.id !== Number(key));
  const card = document.querySelector(`[data-key='${key}']`);
  setState(leftoverCards);
  card.remove();
}

function done(dataKey) {
  const stateArray = getState();
  const indexNum = stateArray.findIndex(card => card.id === Number(dataKey));
  stateArray[indexNum].toggled = !stateArray[indexNum].toggled;
  const listElement = document.querySelector(`[data-key='${dataKey}']`);

  if (stateArray[indexNum].toggled) {
    listElement.classList.add('done');
    listElement.lastElementChild.removeAttribute('hidden');
    window.localStorage.setItem('state', JSON.stringify(stateArray));
  } else {
    listElement.classList.remove('done');
    listElement.lastElementChild.setAttribute('hidden', '');
    window.localStorage.setItem('state', JSON.stringify(stateArray));
  }
}

const form = document.querySelector('.todo-form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const titleInput = document.querySelector('.todo-input-title').value;
  const descriptionInput = document.querySelector('.todo-input-description').value;
  addTodoCard(titleInput, descriptionInput);
  form.reset();
});

const todoList = document.querySelector('.todo-list');

todoList.addEventListener('click', (event) => {
  if (event.target.classList.contains('done-toggle')) {
    const cardDataKey = event.target.parentElement.dataset.key;
    done(cardDataKey);
  }

  if (event.target.classList.contains('delete-button')) {
    const cardDataKey = event.target.parentElement.dataset.key;
    removeTodoCard(cardDataKey);
  }
});

window.onload = render;
