let dateContainer = document.querySelector('.date');
let dateObj = new Date();
let dayOfWeek = [ 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let date = dateObj.getDate();
let currentMonth = monthNames[dateObj.getMonth()];
let currentDay = dayOfWeek[dateObj.getDay()];
let inputField = document.querySelector('input');
let enterBtn = document.querySelector('.enter')
let listContainer = document.querySelector('.list-container')
let isPriority = false;
let priorityCount = 0;
const priority = '#priority';
let todoList = [];
let uniqueId = 0;

dateContainer.innerText = `${currentDay} - ${currentMonth} ${date}`;


// INPUT FIELD HANDLE

inputField.oninput = inputCheck;

function inputCheck() { 
        
    if(inputField.value !== ''){
        enterBtn.src = './img/arrow-enabled.png';
    }
    else{
        enterBtn.src = './img/arrow-disable.png';
    }
}

inputField.onkeydown = event => {

    if(event.key === 'Enter' && inputField.value.trim() !== '') {
        if(listContainer.childElementCount <= 10){
            createItem(inputField.value);
        }
    }
};

enterBtn.onclick = () => {

    if(inputField.value.trim() !== ''){
        if(listContainer.childElementCount <= 10){
            createItem(inputField.value);
        }
    }
};


// CHECK PRIORITY

let priorityCheck = () =>{
    
    if (inputField.value.includes(priority)) {

        // DISPLAY ALERT WHEN MAXIMUM PRIORITY REACHED       

        if (priorityCount < 3) return true;
        else {
            alert('Maximum priority limit reached');
            return false;
        }
    }
    else return false;
    
}


// CREATE A LIST ITEM 

function createItem(textInput){

    textInput = textInput.replace(priority, '');

    if(textInput.trim() !== ''){

        let listItem = document.createElement('div');
        listItem.className = 'list-item' + (isPriority ? ' priority' : '');
        listItem.id = uniqueId;
    
        // CHANGE BG IF PRIORITY TEXT 
    
        isPriority = priorityCheck();
    
        if(isPriority){
            listItem.style.background = '#EFC5AF';
            listItem.classList.add('priority');
            priorityCount++; 
        }
    
        let time = getTime();
    
        listItem.innerHTML = 
            `<img src="img/uncheck.png" class="checkbox" alt="Image of check-box icon">
            <p class="note-text">${textInput}</p>
            <aside class="delete-container">
                <img src="img/delete.png" class="delete" alt="Image of delete icon">
                <p class="time">${time}</p>
            </aside>`;
    
        listContainer.appendChild(listItem);
    
        createToDoObj(uniqueId, false, textInput, time, isPriority);
    
        // RESETTING ONCE ITEM IS ADDED
    
        inputField.value = '';
        enterBtn.src = 'img/arrow-disable.png';
        isPriority = false;
        uniqueId++;

    }
}


//  HANDLE LIST ITEM CLICKS CHECKBOX, TEXT EDIT, DELETE

listContainer.onclick = itemClick;

function itemClick(event){
    let element = event.target;
    let listItem = element.closest('.list-item');
    let id = listItem.id;

    // CHECKBOX HANDLE
    
    if(element.matches( '.checkbox')){
        let textContent = element.nextElementSibling;
        let isChecked;

        if(element.src.includes('img/uncheck.png')){
            element.src = 'img/check.png';
            textContent.style.textDecoration = 'line-through';
            isChecked = true;
        }
        else{
            element.src = 'img/uncheck.png';
            textContent.style.textDecoration = 'none';
            isChecked = false;
        }

        updateCheck(id, isChecked);
    }

    // DELETE BUTTON

    if(element.matches('.delete')){
        if(element.closest('.priority')){
            priorityCount--;
        }

        updateDelete(id);
        listItem.remove();
    }

    // EDIT EXISTING NOTES

    if(element.matches('.note-text')){
        element.contentEditable = true;
    }
}


// GET CURRENT TIME

function getTime() {
    let dateObj = new Date();
    let hours = dateObj.getHours();
    let minutes = dateObj.getMinutes();
    let time = 'am';

    if(hours > 12){
        hours -= 12;
        time = 'pm'
    } 
    if(minutes < 10) minutes = '0' + minutes;
    if(hours < 10) hours = '0' + hours;
    
    return hours + ':' + minutes + ' ' + time;
}


// CREATE TO DO LIST

function createToDoObj(uniqueId, isCheck, text, time, priority){
    
    let listItem = {
        id : uniqueId,
        isChecked : isCheck,
        inputText : text,
        timing : time,
        isPriority : priority,
    }

    todoList.push(listItem);

    localStorage.setItem('to-do', JSON.stringify(todoList));
}


// UPDATE CHECKBOX IN OBJ

function updateCheck(idName, isCheck){
    let updatedObj = findObj(parseInt(idName)); 
    updatedObj['isChecked'] = isCheck;

    localStorage.setItem('to-do', JSON.stringify(todoList));
}


// UPDATE DELETE ITEM IN OBJ

function updateDelete(idName){
    let updatedObj = findObj(parseInt(idName));
    todoList.splice((todoList.indexOf(updatedObj)), 1);

    localStorage.setItem('to-do', JSON.stringify(todoList));
}


// SAVE CONTENT WHEN ITEM LOSES FOCUS

listContainer.addEventListener('focusout', updateText);

function updateText(event){
    let element = event.target;
    
    if(element.matches('.note-text')){
        let listItem = element.closest('.list-item');
        let trimmedText =  element.textContent.trim();

        element.textContent = trimmedText;

        let updatedObj = findObj(parseInt(listItem.id));
        updatedObj['inputText'] = trimmedText;

        if(trimmedText === ''){
            updateDelete(listItem.id);
            listItem.remove();
        }
    }

    localStorage.setItem('to-do', JSON.stringify(todoList));
}


// FINDS AND RETURNS THE OBJECT OF PARTICULAR ID

let findObj = (value) => todoList.find(item => item.id === value);


// GET CONTENT ON LOAD

function onPageLoad(){
    const todoList = JSON.parse(localStorage.getItem('to-do'));

    if(todoList){
            
        todoList.forEach(item =>{
            console.log(item)

            let listItem = document.createElement('div');
            listItem.className = 'list-item' + (isPriority ? ' priority' : '');
            listItem.id = item.id;

            // CHANGE BG IF PRIORITY TEXT 
            
            if(isPriority){
                console.log('hi')
                listItem.style.background = '#EFC5AF';
                listItem.classList.add('priority');
                priorityCount++; 
            }
                    
            listItem.innerHTML = 
            `<img src="img/uncheck.png" class="checkbox" alt="Image of check-box icon">
            <p class="note-text">${item.inputText}</p>
            <aside class="delete-container">
                <img src="img/delete.png" class="delete" alt="Image of delete icon">
                <p class="time">${item.time}</p>
            </aside>`;

            listContainer.appendChild(listItem);
        });
    }
}