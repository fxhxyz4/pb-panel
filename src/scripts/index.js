console.clear();

import { refs } from './modules/refs.js';
const { cardList, addBtn, allBtn, timeList } = refs;

let timeText = `5:00`;
let timeout = 5;
let count = 0;

timeList.forEach(t => {
  t.addEventListener('click', () => {
    const time = t.textContent;

    if (time.includes('3')) {
      timeText = `3:00`;
      timeout = 3;
    } else if (time.includes('4')) {
      timeText = `4:00`;
      timeout = 4;
    } else {
      timeText = `5:00`;
      timeout = 5;
    }
  })
})

const addCard = () => {
  count++;

  const newCard = document.createElement('li');
  newCard.className = `cards-item`;

  const card = document.createElement('div');
  card.className = `card`;

  card.style.width = `15rem`;
  card.style.height = `16rem`;

  const cardBody = document.createElement('div');
  cardBody.className = `card-body`;

  const cardTitle = document.createElement('h5');
  cardTitle.className = `card-title`;
  cardTitle.textContent = `team ${count}`;

  const cardTime = document.createElement('p');
  cardTime.className = `card-time`;
  cardTime.style.display = `none`;

  const cardButton = document.createElement('a');
  cardButton.href = `#`;

  cardButton.className = `btn btn-start btn-primary btn--padding cls${count}`;
  cardButton.textContent = `start`;

  cardButton.addEventListener('click', () => {
    cardTime.style.display = 'block';
    newCard.classList.add('cards-started');

    cardTime.textContent = timeText;

    cardButton.disabled = true;
    startTimer(cardTime, count);
  });

  cardBody.appendChild(cardTitle);
  cardBody.appendChild(cardTime);

  cardBody.appendChild(cardButton);
  card.appendChild(cardBody);

  newCard.appendChild(card);
  cardList.appendChild(newCard);
}

const startTimer = (cardTime) => {
  let seconds = timeout * 60;

  const interval = setInterval(() => {
    seconds--;
    cardTime.textContent = formatTime(seconds);

    if (seconds <= 0) {
      cardTime.style.display = 'none';
      clearInterval(interval);
    }

    cardTime.textContent = formatTime(seconds);
  }, 1000);
};

addBtn.addEventListener('click', addCard);

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

allBtn.addEventListener('click', () => {
  const cardElements = document.querySelectorAll('.cards-item');
  const cardTime = document.querySelectorAll('.card-time');

  if (cardElements && cardElements.length === 0) {
    console.error(`[error]` + ' ' + `please add teams`);
    return;
  }

  addBtn.disabled = true;
  allBtn.disabled = true;

  cardElements.forEach(el => {
    el.classList.add(`cards-started`);
  })

  cardTime.forEach((t, index) => {
    t.style.display = `block`;
    t.textContent = timeText;
  });

  const interval = setInterval(() => {
    cardTime.forEach((t, index) => {
      let seconds = parseInt(t.textContent.split(':')[0]) * 60 + parseInt(t.textContent.split(':')[1]);
      seconds--;

      if (seconds <= 0) {
        t.style.display = `none`;
        cardElements[index].classList.remove('cards-started');
      }

      t.textContent = formatTime(seconds);
    });

    if (document.querySelectorAll('.cards-started').length === 0) {
      addBtn.disabled = false;
      allBtn.disabled = false;

      clearInterval(interval);
    }
  }, 1000);
});
