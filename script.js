document.getElementById("toggleBtn").addEventListener("click", togglePause);

async function getCurrentTabInfo() {
  const tab = await chrome.tabs.query({ currentWindow: true });
  tab.forEach((tab) => {
    console.log(`You are currently viewing: ${tab.title} (${tab.url})`);
  });

  return tab;
}

async function togglePause() {
  const ButtonText = document.getElementById("toggleBtn");
  if (ButtonText.textContent === "Active") {
    let tabs = await getCurrentTabInfo();
    tabs.forEach((tab) => {
      console.log(tab.url);
      if (tab.url.includes("youtube.com")) {
        if(tab.active) return;
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          function: (isActive) => {
            const video = document.querySelector(`.html5-main-video`);
            if (!video) return;
            if (isActive && video.paused) {
              video.play();
              console.log("Video played ", tab.url);
            }
            if (!isActive && !video.paused) {
              video.pause();
              console.log("Video paused ", tab.url);
            }
          },
          args: [tab.active],
        });
      }
    });
    ButtonText.textContent = "Inactive";
  } else {
    ButtonText.textContent = "Active";
  }

  console.log("from click");
}
