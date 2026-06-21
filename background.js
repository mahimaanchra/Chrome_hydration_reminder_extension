
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "hydrationAlarm") {
    chrome.storage.local.get(["currentBottle", "savedbottles"], (data) => {
      const current = data.currentBottle || 1;
      const total = data.savedbottles || 0;

      chrome.notifications.create({
        type: "basic",
        iconUrl: "128 icon.png",
        title: "Jal Pijiye! 💧",
        message: `Time to finish bottle no. ${current}! Keep pushing toward your target of ${total} bottles!`,
        priority: 2
      });
    });
  }
});
