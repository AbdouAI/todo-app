const newDivTxt=document.getElementById("new-div-txt");
const taskBoxes=document.querySelectorAll(".task");
const itemsLeft=document.getElementById("itemsLeft");
const clearBtn=document.getElementById("clearBtn");
const displayAll=document.getElementById("displayAll");
const displayActive=document.getElementById("displayActive");
const displayCompleted=document.getElementById("displayCompleted");
const darkLightBtn=document.getElementById("DLM-btn");
const infoDiv=document.getElementById("infoDiv");
const displayStates=document.getElementById("displayStates");
const addNewTask=document.getElementById("addNewTask");
const header=document.getElementById("header");


let count=0;
const taskBoxList=[];
const taskBoxSpan=[];
const taskBoxCross=[];
const taskBoxCheck=[];
let checkedTasks=[0,0,0,0,0,0,0];
let taskTxtList=[];
let displayState="all";
let isDark=true;

taskBoxes.forEach(el=>taskBoxList.push(el));
taskBoxes.forEach(el=>taskBoxSpan.push(el.children.item(1)));
taskBoxes.forEach(el=>taskBoxCross.push(el.children.item(2).children.item(0)));
taskBoxes.forEach(el=>taskBoxCheck.push(el.children.item(0)));


if(localStorage.getItem("countStor")){
    count=parseInt(localStorage.getItem("countStor"));
    taskTxtList=JSON.parse(localStorage.getItem("taskTxtListStor"));
    checkedTasks=JSON.parse(localStorage.getItem("checkedTasksStor"));
    isDark=("true"==localStorage.getItem("isDarkStor"));
    for(let i=0;i<count;i++){
        displayTasks(i)
    };
    addCheckToTasks();
    itemsLeftFunction();

    if(!isDark){
        darkToLightMode()
    }
};

darkLightBtn.addEventListener("click",function(){
    isDark=!isDark;
    localStorage.setItem("isDarkStor",isDark);
    darkToLightMode();
    addCheckToTasks();
});

newDivTxt.addEventListener("keypress",function(e){
    if(e.key==="Enter"){
        if(count==7){
            alert("Reached max amount of tasks")
        }
        else if(newDivTxt.value.trim()==""){
            alert("Can't add an empty task")
        }
        else{
            taskTxtList.push(newDivTxt.value.trim());
            localStorage.setItem("taskTxtListStor",JSON.stringify(taskTxtList));
            newDivTxt.value="";
            displayTasks(count);
            count+=1;
            localStorage.setItem("countStor",count);
            localStorage.setItem("checkedTasksStor",JSON.stringify(checkedTasks))
        };
        itemsLeftFunction();
    }  
});


taskBoxCross.forEach(cross=>cross.addEventListener("click",function(){
    let indexCross=taskBoxCross.indexOf(cross);
    let taskToDelete=taskBoxSpan[indexCross].textContent;
    let indexTaskToDelete=taskTxtList.indexOf(taskToDelete);
    deleteTask(indexTaskToDelete,indexCross);
}));

taskBoxCheck.forEach(check=>check.addEventListener("click",function(){
    let indexCheck=taskBoxCheck.indexOf(check);
    if(checkedTasks[indexCheck]==1){
        checkedTasks[indexCheck]=0
    }
    else{
        checkedTasks[indexCheck]=1
    };
    localStorage.setItem("checkedTasksStor",JSON.stringify(checkedTasks))
    taskBoxSpan[indexCheck].classList.toggle("checked-span");
    if(!isDark){
        taskBoxSpan[indexCheck].classList.toggle("checked-span-LM");
    }
    else if(isDark){
        taskBoxSpan[indexCheck].classList.remove("checked-span-LM");
    };
    check.children.item(0).children.item(0).classList.toggle("inner-check-img");
    check.children.item(0).classList.toggle("inner-check-style");
    check.classList.toggle("outer-check-style");


    itemsLeftFunction()
}));

clearBtn.addEventListener("click",function(){
    while(checkedTasks.includes(1)){
        for(let i=0;i<checkedTasks.length;i++){
            if(checkedTasks[i]==1){
                deleteTask(i,i)
            }
        };
    }
})

displayAll.addEventListener("click",function(){
    displayStateColor(displayAll);
    taskBoxList.forEach(e=>e.style.display="none");
    for(e of taskBoxList){
        if(taskBoxList.indexOf(e)!=0){
            e.classList.remove("border-radius")
        }
    }
    for(let i=0;i<count;i++){
        displayTasks(i);
        displayState="all";
    };
});

displayActive.addEventListener("click",function(){
    displayStateColor(displayActive);
    taskBoxList.forEach(e=>e.style.display="none");
    for(e of taskBoxList){
        if(taskBoxList.indexOf(e)!=0){
            e.classList.remove("border-radius")
        }
    }
    let firstDisplayedTask=true;
    for(let i=0;i<count;i++){
        if(checkedTasks[i]==0){
            displayTasks(i);
            if(firstDisplayedTask){
                taskBoxList[i].classList.add("border-radius");
                firstDisplayedTask=!firstDisplayedTask;
            };
            displayState="active";
        }
    };
});

displayCompleted.addEventListener("click",function(){
    displayStateColor(displayCompleted);
    taskBoxList.forEach(e=>e.style.display="none");
    for(e of taskBoxList){
        if(taskBoxList.indexOf(e)!=0){
            e.classList.remove("border-radius")
        }
    }
    let firstDisplayedTask=true;
    for(let i=0;i<count;i++){
        if(checkedTasks[i]==1){
            displayTasks(i);
            if(firstDisplayedTask){
                taskBoxList[i].classList.add("border-radius")
                firstDisplayedTask=!firstDisplayedTask;
            }
            displayState="completed";
        }
    };
});


function displayTasks(num){
    taskBoxSpan[num].textContent=taskTxtList[num];
    taskBoxList[num].style.display="flex";
};

function deleteTask(index1,index2){
    taskTxtList.splice(index1,1);
    count-=1;
    localStorage.setItem("taskTxtListStor",JSON.stringify(taskTxtList));
    localStorage.setItem("countStor",count);
    taskBoxList.forEach(el=>el.style.display="none");    

    checkedTasks.splice(index2,1);
    checkedTasks.push(0);
    localStorage.setItem("checkedTasksStor",JSON.stringify(checkedTasks));

    taskBoxCheck.forEach(el=>el.children.item(0).classList.remove("inner-check-style"));
    taskBoxCheck.forEach(el=>el.classList.remove("outer-check-style"));
    taskBoxCheck.forEach(el=>el.children.item(0).children.item(0).classList.remove("inner-check-img"));
    taskBoxSpan.forEach(el=>el.classList.remove("checked-span"));
    taskBoxSpan.forEach(el=>el.classList.remove("checked-span-LM"));
    
    addCheckToTasks();

    if(displayState=="all"){
        for(let i=0;i<count;i++){
            displayTasks(i)
        };
    }
    else if(displayState=="active"){
        for(let i=0;i<count;i++){
            if(checkedTasks[i]==0){
                displayTasks(i);
            };
        };
    }
    else{
        for(let i=0;i<count;i++){
            if(checkedTasks[i]==1){
                displayTasks(i);
            };
        };
    }


    itemsLeftFunction();
};

function addCheckToTasks(){
    for(let i=0;i<checkedTasks.length;i++){
        if(checkedTasks[i]==1){            
            taskBoxSpan[i].classList.add("checked-span");
            if(!isDark){
                taskBoxSpan[i].classList.add("checked-span-LM");
            }
            else if(isDark){
                taskBoxSpan[i].classList.remove("checked-span-LM");
            };
            taskBoxCheck[i].children.item(0).children.item(0).classList.add("inner-check-img");
            taskBoxCheck[i].children.item(0).classList.add("inner-check-style");
            taskBoxCheck[i].classList.add("outer-check-style");
        }
    };
};

function itemsLeftFunction(){
    let checkedTasksCount=0;
    let itemsLeftNum=0;
    for(let i=0;i<checkedTasks.length;i++){
        if(checkedTasks[i]==1){
            checkedTasksCount+=1
        }
    };

    itemsLeftNum=(count-checkedTasksCount)
    itemsLeft.textContent=itemsLeftNum   

}

function displayStateColor(displayX){
    displayActive.classList.remove("display-states-selected");
    displayAll.classList.remove("display-states-selected");
    displayCompleted.classList.remove("display-states-selected");
    displayX.classList.add("display-states-selected");
}

function darkToLightMode(){
    taskBoxList.forEach(e=>e.classList.toggle("tasks-LM"));
    taskBoxSpan.forEach(e=>e.classList.toggle("span-scrollbar-LM"));
    taskBoxList.forEach(e=>e.classList.toggle("task-border-LM"));
    taskBoxList.forEach(e=>e.classList.toggle("task-shadow-LM"));
    document.body.classList.toggle("body-LM");
    header.classList.toggle("lightBG");
    infoDiv.classList.toggle("display-states-LM");
    infoDiv.classList.toggle("info-div-shadow-LM");
    displayStates.classList.toggle("display-states-LM");
    displayStates.classList.toggle("display-states-shadow-LM");
    displayActive.classList.toggle("display-states-span-LM");
    displayAll.classList.toggle("display-states-span-LM");
    displayCompleted.classList.toggle("display-states-span-LM");
    newDivTxt.classList.toggle("tasks-LM");
    addNewTask.classList.toggle("tasks-LM");
    darkLightBtn.children.item(0).classList.toggle("imgHidden");
    darkLightBtn.children.item(1).classList.toggle("imgHidden");
    clearBtn.classList.toggle("clearBtn-LM");
    taskBoxCheck.forEach(e=>e.children.item(0).classList.toggle("check-LM"));
}



