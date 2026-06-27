chrome.storage.local.get("focusActive", (data) => {
  focusActive = data.focusActive ?? false;
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "TOGGLE") {
    focusActive = message.active;
  }
  if (!focusActive) {
    pauseAllYouTubeTabs();
  }
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tabs.get(activeInfo.tabId);
  await handleTabSwitch(tab);
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url?.includes("youtube.com")) {
    await handleTabSwitch(tab);
  }
});
async function pauseAllYouTubeTabs() {
  const allTabs = await chrome.tabs.query({});
  for (const tab of allTabs) {
    if (tab?.url?.includes("youtube.com")) {
      await pauseVideo(tab.id);
    }
  }
}

async function handleTabSwitch(activeTab) {
  const allTabs = await chrome.tabs.query({});

  for (const tab of allTabs) {
    if (!tab.url?.includes("youtube.com")) continue;
    if (tab.id === activeTab.id && tab?.url?.includes("youtube.com")) {
      await playVideo(tab.id);
    } else {
      await pauseAllYouTubeTabs();
    }
  }
}

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    const allTabs = await chrome.tabs.query({});
    for (const tab of allTabs) {
      if (tab.url?.includes("youtube.com")) {
        await pauseVideo(tab.id);
      }
    }
  }
});
async function playVideo(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    function: async () => {
      const video = document.querySelector(".html5-main-video");
      if (video && video.paused) {
        await video.play();
      }
    },
  });
}
async function pauseVideo(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    function: async () => {
      const video = document.querySelector(".html5-main-video");
      if (video && !video.paused) {
        await video.pause();
      }
    },
  });
}
