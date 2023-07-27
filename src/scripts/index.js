console.clear();

import { refs } from './modules/refs.js';
const { addBtn, allBtn, cardList } = refs;

let timeout = 5000;
let count = 0;

const addCard = () => {
  count++;

  const newCard = document.createElement('li');
  newCard.className = `cards-item` + ' ' + `cls${count}`;

  const card = document.createElement('div');
  card.className = `card`;

  card.style.width = `15rem`;
  card.style.height = `16rem`;

  const cardBody = document.createElement('div');
  cardBody.className = `card-body`;

  const cardTitle = document.createElement('h5');
  cardTitle.className = `card-title`;
  cardTitle.textContent = `team ${count}`;

  const cardButton = document.createElement('a');
  cardButton.href = `#`;

  cardButton.className = `btn btn-primary btn--padding`;
  cardButton.textContent = `start`;

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardButton);

  card.appendChild(cardBody);
  newCard.appendChild(card);

  cardList.appendChild(newCard);
}

addBtn.addEventListener('click', addCard);

allBtn.addEventListener('click', e => {
  console.log(e.target);
});
