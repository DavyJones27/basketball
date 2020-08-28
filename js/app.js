let data;
document.addEventListener("DOMContentLoaded", async function() {
  data = await fetchAllData(
    "http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/users/questions"
  );
  console.log(data);
});
let chance = 5;
let questionCount = 0;
let score = 0;
var angle;
const pointer = document.querySelector(".pointer__img");
const gameOverCard = document.querySelector(".game-over");
let balls = document.querySelectorAll(".ball");

var chosen; // user selection is stored in this
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = 200;

const msg = document.querySelector(".msg-txt");

const fetchAllData = async url => {
  try {
    let response = await fetch(url);
    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Failed");
    }
    response = await response.json();
    console.log(response);
    return response;
  } catch (err) {
    console.log(err);
  }
};

//  to send name and score or any data
const sendData = async (url, data, method) => {
  let id;
  try {
    let res = await fetch(url, {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-type": "application/json"
      }
    });
    console.log(res);
    if (res.status !== 200 && res.status !== 201) {
      throw new Error("Failed");
    }
    res = await res.json();
    return res;
  } catch (err) {
    console.log(err);
  }
};


reset = () => {
  questionCount = 0;
  chance = 0;
  gameOverCard.style.opacity = "0";
  gameOverCard.style.pointerEvents = "none";
  document.querySelector(".overlay").style.display = "none";
  document.querySelector(".middle").style.display = "flex";
  balls.forEach(ball => {
    ball.style.opacity = 1;
  });
  setQuestion();
};

const drawBasket = () => {
  const basket1 = document.getElementById("basket-1");
  const basket2 = document.getElementById("basket-2");
  const basket3 = document.getElementById("basket-3");
  const basket4 = document.getElementById("basket-4");
  const width = canvas.width;
  ctx.drawImage(basket1, 0.1 * width - 200 / 2, 20, 200, 200);
  ctx.drawImage(basket2, 0.35 * width - 200 / 2, 20, 200, 200);
  ctx.drawImage(basket3, 0.65 * width - 200 / 2, 20, 200, 200);
  ctx.drawImage(basket4, 0.9 * width - 200 / 2, 20, 200, 200);
};

const decrChance = () => {
  if (chance <= 0) {
    setTimeout(() => {
      gameOverCard.style.opacity = "1";
      gameOverCard.style.pointerEvents = "all";
      document.querySelector(".overlay").style.display = "flex";
      document.querySelector(".middle").style.display = "none";
    }, 500);
  } else {
    balls[chance - 1].style.opacity = "0";
    chance--;
  }
};

setQuestion = () => {
  const questionTxt = document.querySelector(".question-txt");
  const optionA = document.querySelector(".option-a");
  const optionB = document.querySelector(".option-b");
  const optionC = document.querySelector(".option-c");
  const optionD = document.querySelector(".option-d");
  console.log(data);

  questionTxt.innerHTML = data[questionCount].question;
  optionA.innerHTML = "A. " + data[questionCount].option1;
  optionB.innerHTML = "B. " + data[questionCount].option2;
  optionC.innerHTML = "C. " + data[questionCount].option3;
  optionD.innerHTML = "D. " + data[questionCount].option4;
};

const checkAns = () => {
  msg.style.animation = "";
  console.log("checkans");
  console.log(msg.style.animation + questionCount);
  if (chosen === data[questionCount].solution) {
    questionCount++;
    document.querySelector(".score").innerHTML = ++score;
    setQuestion();
    console.log(questionCount);
  } else {
    decrChance();
    msg.classList.add("wrong-ans");
  }
};

const throwBall = () => {
  msg.classList.remove("wrong-ans");
  var str = " 3s forwards";
  if (angle >= -60 && angle < -40) {
    str = "throwBallToA" + str;
    chosen = data[questionCount].option1;
  } else if (angle >= -40 && angle < 0) {
    str = "throwBallToB" + str;
    chosen = data[questionCount].option2;
  } else if (angle >= 0 && angle < 40) {
    str = "throwBallToC" + str;
    chosen = data[questionCount].option3;
  } else if (angle >= 40 && angle <= 60) {
    str = "throwBallToD" + str;
    chosen = data[questionCount].option4;
  }
  console.log("throwBall called");
  document.querySelector(".ready-ball__img").style.animation = str;
  pointer.classList.remove("paused");
  checkAns();
};

setQuestion();
window.addEventListener("click", () => {
  pointer.classList.add("paused");
  var st = window.getComputedStyle(pointer, null);
  var tr = st.getPropertyValue("transform");

  var values = tr.split("(")[1],
    values = values.split(")")[0],
    values = values.split(",");

  var b = values[1];

  angle = Math.round(Math.asin(b) * (180 / Math.PI));
  console.log(angle);
  throwBall();
});





const res = sendData("http://ec2-13-232-39-98.ap-south-1.compute.amazonaws.com:3000/users/questions", 55, "POST");