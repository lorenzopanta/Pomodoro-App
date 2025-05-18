const bells = new Audio('bell.wav');         //can't use it on the codédex builds unfortunately 
const startBtn = document.querySelector('.btn-start'); 
const resetBtn = document.querySelector('.btn-reset');
const pauseBtn = document.querySelector('.btn-pause'); 
const session = document.querySelector('.minutes'); 
let myInterval; 

let isRunning = false;      //defines if the application is running
let startedOrOver = true;   //using this variable so that pressing Pause doesn't glitch the timer
let paused = false;         //using this variable so that pressing Start or Reset when pause doesn't glitch the timer

let totalSeconds;
let minuteDiv = document.querySelector('.minutes');
let secondDiv = document.querySelector('.seconds');

let startingMinutes = document.querySelector('.minutes').textContent;
let startingSeconds = document.querySelector('.seconds').textContent;



//MOST IMPORTANT FUNCTION: updates the timer by going down by 1 second
const updateSeconds = () => {
  totalSeconds--;
  //totalSeconds = totalSeconds - 20;     //used for quick testing

  let minutesLeft = Math.floor(totalSeconds / 60);
  let secondsLeft = totalSeconds % 60;

  minuteDiv.textContent = `${minutesLeft}`;
  if(secondsLeft < 10) {
    secondDiv.textContent = '0' + secondsLeft;
  } else {
    secondDiv.textContent = secondsLeft;
  }

  if (minutesLeft === 0 && secondsLeft === 0) {
    startedOrOver = true;
    bells.play();
    clearInterval(myInterval);    //this functions cancels the timed repeated actions enstablished by the SetInterval()
  }
}



//BUTTONS ------------------------------------------------
//function to start the timer
const appTimer = () => {
  if(paused == true){
    alert("Timer is paused, can't start now");
  }
  else{
    startedOrOver = false;
    const sessionAmount = Number.parseInt(session.textContent);  //converts minutes into a single big number

    if (isRunning == false) {
      isRunning = true;                      //if false, it means that the timer is running, you can't start it again
      totalSeconds = sessionAmount * 60;
      myInterval = setInterval(updateSeconds, 1000);    //setInterval() executes "updateSeconds" every 1 second
    } else {
      alert('Session has already started.');
    }
  }
};

//function to stop the timer and reset the time
const appReset = () => {
  if(paused == true){
    alert("Timer is paused, can't reset now");
  }
  else{
    if(isRunning){
      isRunning = false;
      clearInterval(myInterval);

      minuteDiv.textContent = startingMinutes;
      secondDiv.textContent = startingSeconds;
    }
  }
  
}

//function to pause the timer
const appPause = () => {
  if(startedOrOver == true){
    alert("Cannot Pause, session has not started yet or has ended");
  }
  else{
    if(isRunning == true){
      paused = true;
      pauseBtn.classList.add("paused");   //using a class so that the button changes color when clicked
      isRunning = false;
      clearInterval(myInterval);
    }
    else {
      paused = false;
      pauseBtn.classList.remove("paused");
      isRunning = true;
      myInterval = setInterval(updateSeconds, 1000); 
    }
  }
}

startBtn.addEventListener('click', appTimer);
resetBtn.addEventListener('click', appReset);
pauseBtn.addEventListener('click', appPause);


//SET YOUR OWN TIME -------------------------------------------------
const setBtn = document.getElementById("submitBtn");
const inputTime = document.getElementById("inputTime");

//function to use the submit button to select your own time
setBtn.addEventListener("click", (event) => {
    event.preventDefault();              //prevents page from refreshing

      const rawValue = inputTime.value.trim();
      //Checks if the value contains a dot or a comma
      if (rawValue.includes(",") || rawValue.includes(".")) {
        alert("Value not valid. Decimals are not allowed.");
        return;
      }

    const inputValue = parseInt(rawValue);     //converts inputTime from string to number, so that I can use it in the if-else

    if(inputValue < 0 || inputValue > 999){
      alert("Value is negative or bigger than 999.")
    }
    else{
      startingMinutes = inputValue;
      appReset();
      minuteDiv.textContent = inputValue;
    }
});