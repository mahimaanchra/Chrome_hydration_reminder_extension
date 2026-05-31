let nextGoalTime;
let currentBottle;

const elements = {
    lgBtn: document.querySelector(".lg"),
    inputSize: document.querySelector(".input1"),
    firstPage: document.querySelector(".firstpage"),
    secondPage: document.querySelector(".secondpage"),
    popup: document.querySelector(".popup-overlay"),
    newDayBtn: document.querySelector("#newDay"),
    closePopupBtn: document.querySelector("#close"),
    currentBottleSpan: document.querySelector("#current"),
    totalBottleSpan: document.querySelector("#noofbottles"),
    mainTimeSpan: document.querySelector("#time"),
    popupNextSpan: document.querySelector("#nth"),
    popupDoneSpan: document.querySelector("#done"),
    popupDeadlineSpan: document.querySelector("#nextdeadline"),
    deadline: document.querySelector("#deadline"),
    lastpopup: document.querySelector("#lastpopup")
};

const formatTime = (dateObj) => {
    return dateObj.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const getIntervalHours = (size) => {
   if (size <= 250)  return 0.5;  
    if (size <= 400)  return 0.75; 
    if (size <= 500)  return 1.0;  
    if (size <= 650)  return 1.25; 
    if (size <= 750)  return 1.5;  
    if (size <= 850)  return 1.75; 
    if (size <= 1000) return 2.0;  
    if (size <= 1250) return 2.25; 
    if (size <= 1500) return 2.5;  
    if (size <= 2000) return 3.0;   
    return 4.0; 
};

const checkAlarmStatus = (goalTime, size, noOfBottles) => {
    const now = new Date().getTime();
    if (now >= goalTime) {
        showPopup(getIntervalHours(size), noOfBottles);
    } else {
        const interval = setInterval(() => {
            if (new Date().getTime() >= goalTime) {
                showPopup(getIntervalHours(size), noOfBottles);
                clearInterval(interval);
            }
        }, 1000);
    }
};

const updateUI = (bottleNum, goalTime) => {
    elements.currentBottleSpan.innerText = bottleNum;
    elements.mainTimeSpan.innerText = formatTime(new Date(goalTime));
};

const showPopup = (addhours, noOfBottles) => {
    elements.popup.style.display = "flex"; 
    elements.popupDoneSpan.innerText = currentBottle;

    if (currentBottle >= noOfBottles) {
        elements.lastpopup.innerText = "MISSION COMPLETE! 🏆";
    } else {
        const previewTime = new Date(new Date().getTime() + (addhours * 3600000));
        elements.popupNextSpan.innerText = currentBottle + 1;
        elements.popupDeadlineSpan.innerText = formatTime(previewTime);
    }

    elements.closePopupBtn.onclick = () => {
        elements.popup.style.display = "none";
        
        if (currentBottle < noOfBottles) {
            currentBottle++; 
            nextGoalTime = new Date().getTime() + (addhours * 3600000);

            chrome.storage.local.set({
                currentBottle: currentBottle,
                starting: nextGoalTime
            }, () => {
                chrome.alarms.create("hydrationAlarm", { when: nextGoalTime });
                updateUI(currentBottle, nextGoalTime);
            });
        } else {
            chrome.alarms.clear("hydrationAlarm");
            elements.deadline.innerText = "You are Hydrated for the day! Consistency is key. ✨";
        }
    };
};

window.onload = () => {
    chrome.storage.local.get(["savedsize", "savedbottles", "starting", "currentBottle"], (data) => {
        if (data.savedsize) {
            elements.firstPage.style.display = "none";
            elements.secondPage.style.display = "block";
            elements.totalBottleSpan.innerText = data.savedbottles;
            
            currentBottle = data.currentBottle || 1;
            nextGoalTime = data.starting;

            updateUI(currentBottle, nextGoalTime);
            checkAlarmStatus(nextGoalTime, Number(data.savedsize), Number(data.savedbottles));
        }
    });
};

elements.lgBtn.addEventListener("click", () => {
    const size = Number(elements.inputSize.value);
    if (!size) return alert("Please enter bottle size");

    const noOfBottles = Math.ceil(2000 / size);
    const intervalMinutes = getIntervalHours(size) * 60;
    const firstGoal = new Date().getTime() + (intervalMinutes * 60000);

    chrome.storage.local.set({
        savedsize: size,
        savedbottles: noOfBottles,
        starting: firstGoal,
        currentBottle: 1
    }, () => {
        chrome.alarms.create("hydrationAlarm", { when: firstGoal });

        elements.firstPage.style.display = "none";
        elements.secondPage.style.display = "block";
        elements.totalBottleSpan.innerText = noOfBottles;
        currentBottle = 1;

        updateUI(currentBottle, firstGoal);
        checkAlarmStatus(firstGoal, size, noOfBottles);
    });
});

elements.newDayBtn.addEventListener("click", () => {
    chrome.alarms.clearAll(() => {
        chrome.storage.local.clear(() => {
            location.reload();
        });
    });
});