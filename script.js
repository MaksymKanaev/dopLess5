//вибор различных переменных для дальнейшей работы
const startBtn = document.querySelector('#start button');
const startModal = document.querySelector('#start');
const gameBlock = document.querySelector('#game');
let lifes = document.querySelector('#lifes');
let numberOfLives = 3; // переменная для выбора количества жизней
audioPlater = document.querySelector("audio");
sourceAudio = document.querySelector("audio source");
const btnMelodi1 = document.querySelector('#melodi1');
const btnMelodi2 = document.querySelector('#melodi2');
sound = "off";
soundBtn = document.querySelector('#sound img');
const gamer = document.querySelector('#player');
let score = document.querySelector("#score span");
gamerSkin = "skin_1" // переменная для переключения скина игрока

//блок первой мелодии
btnMelodi1.onclick = function() {
   // audioPlater.pause();
   audioPlater.load()
   sourceAudio.src = "audio/1.mp3";
   audioPlater.play();
   soundBtn.src = "images/sound_on.png";
   sound = "on";
}
//блок второй мелодии
btnMelodi2.onclick = function() {
   // audioPlater.pause();
   audioPlater.load()
   sourceAudio.src = "audio/2.mp3";
   audioPlater.play();
   soundBtn.src = "images/sound_on.png";
   sound = "on";
}
//блок кнопки старт
startBtn.onclick = function() {
   startGame()
}
// Блок кнопки проигрывания песни
soundBtn.onclick = function() {
   if(sound == "on") {
      soundBtn.src = "images/mute_sound.png"
      sound = "off";
      audioPlater.pause();
   } else{
      soundBtn.src = "images/sound_on.png";
      sound = "on";
      audioPlater.play();
   }
}

/**
* !БЛОК ИГРОКА
*/

//Движение игрока и стрельба
document.onkeydown = function(event) {
   // Получаем текущую позицию игрока
   const currentPosition = gamer.offsetTop;
   // Задаем границы игровой зоны
   const gameAreaTop = 40;
   const gameAreaBottom = 770;
   //Действия при нажаии W
   if(event.keyCode == 87) {
      if (currentPosition - 40 >= gameAreaTop) {
         gamer.style.top = currentPosition - 40 + "px";
      }
   }
   //Действия при нажатии S
   if(event.keyCode == 83) {
      if (currentPosition + 40 <= gameAreaBottom) {
         gamer.style.top = currentPosition + 40 + "px";
      }
   }
   //Действия при нажатии пробел
   if(event.keyCode == 32) {createBullet()}
}   
//Блок скинов 
// Скин 1
selectSkin1 = document.querySelector('#skin_1');
selectSkin1.onclick = function() {
   gamerSkin = "skin_1";
   selectSkin2.className = "";
   selectSkin1.className = "selected";
}
//Скин 2
selectSkin2 = document.querySelector('#skin_2');
selectSkin2.onclick = function() {
   gamerSkin = "skin_2";
   selectSkin1.className = "";
   selectSkin2.className = "selected";
}
// !Функция старта игры
function startGame() {
   startModal.style.display = "none";
   gameBlock.style.display = "block";
   gamer.className = gamerSkin;
   createLifes();
   createEnemy();
   // setTimeout(createEnemy2, 3000);
}

/** 
* ! БЛОК ВРАГА
*/

//создание массива для определения количества врагов
const myArray = [1, 2, 3];
//Случайный выбор количесва врагов которые появятся за раз 
const randomIndex = Math.floor(Math.random() * myArray.length);
const numOfEnemies = myArray[randomIndex];
// Функция создания врагов
function createEnemy() {
   //Использование цикла для создания врагов согласно случайному числу из массива
   for (let i = 0; i < numOfEnemies; i++) {
      let enemy = document.createElement("div"); //создание пблок div
      enemy.className = 'enemy ' + typeEnemy(); // присвоение класса 
      //выбор случайного места появления врага на поле
      enemy.style.top = random(100, document.querySelector("#app").clientHeight - 100) + "px"; 
      // выбор местоположения созданых блоков див
      gameBlock.appendChild(enemy);
      moveEnemy(enemy);
   }
}
//случайный класс в соответствии с вероятностью 50/50 для создания различных типов врагов.
function typeEnemy() {
   if(random(1, 2) == 1) {
      return 'type-1';
   } else {
      return 'type-2';
   }
}
//отвечает за движение врага. Функция удаляет врага, если он заходит за левую границу блока игры.
function moveEnemy(enemy) {
   let idTimer = setInterval(function() {
      enemy.style.left = enemy.offsetLeft - 10 + 'px';
      if(enemy.offsetLeft < -100) {
         enemy.remove();
         createEnemy();
         clearInterval(idTimer);
         die();
      }
   }, 100);
}

/**
* ! БЛОК ПУЛИ
*/

//Создание пули
function createBullet() {
   let bullet = document.createElement("div");
       bullet.className = 'bullet';
       bullet.style.top = gamer.offsetTop + 140 + "px"; // создание пули в местоположении игрока
       gameBlock.appendChild(bullet);
       moveBullet(bullet)
}
//движение пули вправо по экрану
function moveBullet(bullet) {
   let idTimer = setInterval(function() {
      bullet.style.left = bullet.offsetLeft + 10 + 'px';
      // удаление пули если вышла за поля экрана
      if(bullet.offsetLeft > document.querySelector("body").clientWidth) {
         bullet.remove();
         clearInterval(idTimer);
      }
      isBoom(bullet);
   }, 50);
}
// Функция попадания пули по врагу
function isBoom(bullet) {
   //Выбор всех элементов 
   let enemies = document.querySelectorAll(".enemy");
   //Проверка на совпадение границы для каждого элемента 
   enemies.forEach(function(enemy) {
      if(bullet.offsetTop > enemy.offsetTop // левый верхний угол
         && bullet.offsetTop < enemy.offsetTop + enemy.clientHeight //левый нижний угол
         && bullet.offsetLeft > enemy.offsetLeft) { //правый верхний угол
            createBoom(bullet.offsetTop, bullet.offsetLeft);
            score.innerText++; //добавление очков при попадании
            bullet.remove(); // удаление пули при попадании
            enemy.remove(); // удаление врага 
            createEnemy(); // создание новых врагов
      }
   });
}   
//Фкнуция взрыва при попадании
function createBoom(top, left) {
   let boom = document.createElement("div");
      boom.className = "boom";
      boom.style.top = top - 100 + "px";
      boom.style.left = left - 100 + "px";
      gameBlock.appendChild(boom);
      setTimeout(function() {
      boom.remove();
      }, 1000);
}
/**
* !БЛОК ХП И ЗАВЕРШЕНИЯ ИГРЫ
*/
// Умешьшение жизней на 1 и при их отчутвии завершение игры
function die() {
   numberOfLives = numberOfLives - 1;
   if(numberOfLives <= 0) {
      endGame();
   }
   createLifes();
}
// Фукция создания хп согласно выбраному количеству в переменной 
function createLifes() {
   lifes.innerHTML = "";
   let count = 0;
   while(count < numberOfLives) {
      let span = document.createElement("span");
      lifes.appendChild(span);
      count = count + 1;
   }
}
//функция для рандомного выбора значений
function random(min, max) {
   // случайное число от min до (max+1)
   let rand = min + Math.random() * (max + 1 - min);
   return Math.floor(rand);
}

//Функция завершения игры
function endGame() {
   let scoreEnd = document.querySelector("#end h3 span");
   scoreEnd.innerText = score.innerText; //выбор количества набраных очков

   gameBlock.innerHTML = "";

   let endBlock = document.querySelector("#end");
   endBlock.style.display = "block";

   let restartBtn = document.querySelector("#end button");
   endBlock.onclick = restart;
}

//Функция кнопки перезагрузка
function restart() {
   location.reload();
}

