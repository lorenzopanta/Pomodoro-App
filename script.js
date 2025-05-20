//THIS CODE IS FOR THE TO-DO LIST
const inputBox = document.getElementById("input-box");     //<input type="text">
const listContainer = document.getElementById("list-container");    //<ul>
const completedCounter = document.getElementById("completed-counter");
const uncompletedCounter = document.getElementById("uncompleted-counter");

function addTask() {
    const task = inputBox.value.trim();     //.value takes the value, .trim() removes spaces
    if(!task) {
        alert("Please write down a task");
        return;
    }

    const li = document.createElement("li");    //I create an element <li> that is added each time I click "Add"
    li.innerHTML = `
      <label>
        <input type="checkbox">
        <span>${task}</span>
      </label>
      <span class="edit-btn">Edit</span>
      <span class="delete-btn">Delete</span>
    `;

    listContainer.appendChild(li);
    inputBox.value = "";               //removes text from the input form after submit

    //buttons for the new li element
    const checkbox = li.querySelector("input");
    const editBtn = li.querySelector(".edit-btn");
    const taskSpan = li.querySelector("span");          //allows us to edit a specific task when edit is clicked
    const deleteBTn = li.querySelector(".delete-btn");

    
   checkbox.addEventListener("click", function() {
      li.classList.toggle("completed", checkbox.checked);     //if checkbox.checked is true -> add class, if false remove class
      updateCounters();
    });

   editBtn.addEventListener("click", function() {
    const update = prompt("Edit task:");
    if(update !== null){
      taskSpan.textContent = update;
      li.classList.remove("completed");

      checkbox.checked = false;
      updateCounters();
    }
   });

   deleteBTn.addEventListener("click", function() {
    if(confirm("Are you sure you want to delete this task?")) {
      listContainer.removeChild(li);

      updateCounters();
    }
   });

   updateCounters();
}

function updateCounters() {
  const completedTasks = document.querySelectorAll(".completed").length;  //.length property is used to count the number of elements with this class
  const uncompletedTasks = document.querySelectorAll("li:not(.completed)").length;

  completedCounter.textContent = completedTasks;
  uncompletedCounter.textContent = uncompletedTasks;
}










//THIS CODE IS FOR THE POMODORO TIMER
const bells = new Audio('bell.wav');
const startBtn = document.querySelector('#btn-start'); 
const resetBtn = document.querySelector('#btn-reset');
const pauseBtn = document.querySelector('#btn-pause'); 
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

//let breakTimeNow = false;

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

    //START THE PAUSE TIMER
    /*
    if(breakTimeNow==false){
      breakTimer();
    }
    else{
      return;
    }
    */
  }
}


/*
//BREAK TIMER
const breakTimer = () => {

  let coso = Number.parseInt(startingMinutes);
  totalSeconds = Math.floor(coso / 3)*60;

  breakTimeNow=true;
  //CAMBIARE TESTO IN CIMA PER DIRE CHE SIAMO IN PAUSA
  myInterval = setInterval(updateSeconds, 1000);
}
*/

//BUTTONS ------------------------------------------------
//function to start the timer
const appTimer = () => {
  if(paused == true){
    alert("Timer is paused, can't start now");
    return;
  }
  startedOrOver = false;
  const sessionAmount = Number.parseInt(session.textContent);  //converts minutes into a a number

  if (isRunning == false) {
    isRunning = true;                      //if true, it means that the timer is running, you can't start it again
    totalSeconds = sessionAmount * 60;
    myInterval = setInterval(updateSeconds, 1000);    //setInterval() executes "updateSeconds" every 1 second
  } else {
    alert('Session has already started.');
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

      startedOrOver = true;
      minuteDiv.textContent = startingMinutes;
      secondDiv.textContent = startingSeconds;
    }
  }
  
}

//function to pause the timer
const appPause = () => {
  if(startedOrOver == true){
    alert("Cannot Pause, session has not started yet or has ended");
    return;
  }
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
};


//li.classList.toggle("completed", checkbox.checked);     //if checkbox.checked is true -> add class, if false remove class

startBtn.addEventListener('click', appTimer);
resetBtn.addEventListener('click', appReset);
pauseBtn.addEventListener('click', appPause);


//SET YOUR OWN TIME -------------------------------------------------
const setBtn = document.getElementById("submitBtn");
const inputTime = document.getElementById("inputTime");

//function to use the submit button to select your own time
setBtn.addEventListener("click", (event) => {
    event.preventDefault();              //prevents page from refreshing

      if(paused){
        alert("Cannot set a new time, timer is currently paused.");
        return;
      }
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

