// When user switches tabs
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  await handleTabSwitch(tab);
});

// When tab URL changes (e.g. navigating to youtube)
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.includes("youtube.com")) {
    await handleTabSwitch(tab);
  }
});

// When window focus changes (handles minimize / switching apps)
chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    // Chrome lost focus (minimized or switched to another app)
    await pauseAllYouTubeTabs();
  } else {
    // Chrome regained focus — play video in active tab if it's YT
    const [activeTab] = await chrome.tabs.query({ active: true, windowId });
    if (activeTab?.url?.includes("youtube.com")) {
      await playVideo(activeTab.id);
    }
  }
});

async function handleTabSwitch(activeTab) {
  const allTabs = await chrome.tabs.query({});

  for (const tab of allTabs) {
    if (!tab.url?.includes("youtube.com")) continue;

    if (tab.id === activeTab.id && activeTab.url?.includes("youtube.com")) {
      await playVideo(tab.id);   // play the tab you switched TO
    } else {
      await pauseVideo(tab.id);  // pause all other YT tabs
    }
  }
}

async function pauseAllYouTubeTabs() {
  const allTabs = await chrome.tabs.query({});
  for (const tab of allTabs) {
    if (tab.url?.includes("youtube.com")) {
      await pauseVideo(tab.id);
    }
  }
}

function playVideo(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      const video = document.querySelector(".html5-main-video");
      if (video && video.paused) video.play();
    },
  });
}

function pauseVideo(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      const video = document.querySelector(".html5-main-video");
      if (video && !video.paused) video.pause();
    },
  });
}