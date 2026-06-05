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

const getIntervalHours = (noOfBottles) => {
const totalWakingHours = 14;
const interval = totalWakingHours / noOfBottles;

return Math.max(interval, 0.5);
};

const checkAlarmStatus = (goalTime, noOfBottles) => {
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
            checkAlarmStatus(nextGoalTime,  Number(data.savedbottles));
        }
    });
};

elements.lgBtn.addEventListener("click", () => {
    const size = Number(elements.inputSize.value);
    if (!size) return alert("Please enter bottle size");

    const noOfBottles = Math.ceil(2000 / size);
    const intervalMinutes = getIntervalHours(noOfBottles) * 60;
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
        checkAlarmStatus(firstGoal, noOfBottles);
    });
});

elements.newDayBtn.addEventListener("click", () => {
    chrome.alarms.clearAll(() => {
        chrome.storage.local.clear(() => {
            location.reload();
        });
    });
});