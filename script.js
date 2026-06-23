chrome.tab.onActivated.addListener(async (activeInfo) => {
  const tab = await chrome.tab.get(activeInfo.tabId);
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
      await pauseAllYouTubeTabs(tab.id);
    }
  }
}

async function playVideo(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      const video = document.querySelector(".html5-main-video");
      if (video && video.paused) {
        await video.play();
      }
    }
  })
}

async function pauseVideo(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    function: () => {
      const video = document.querySelector(".html5-main-video");
      if (video && !video.paused) {
        await video.pause();
      }
    }
  })
}