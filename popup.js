(async () => {
  const allTabs = await chrome.tabs.query({});
  const list = document.getElementById("list");
  for (const tab of allTabs) {
    if (tab.url?.includes("youtube.com")) {
      const li = document.createElement("li");
      li.textContent = tab.title ?? tab.url;

      li.classList.add("playing");

      list.appendChild(li);
    }
  }
})();
const toggleBtn = document.getElementById("toggleBtn");
const pillData = document.getElementById("pill");

function UpdateUi(isActive) {
  if (isActive) {
    toggleBtn.textContent = "Disable";
    toggleBtn.classList.remove("disabled");
    pillData.textContent = "Active";
    pillData.style.backgroundColor = "#ff6200e4";
  } else {
    toggleBtn.textContent = "Enable";
    toggleBtn.classList.add("disabled");
    pillData.textContent = "Inactive";
    pillData.style.backgroundColor = "#ef4444";
  }
}

chrome.storage.local.get("focusActive", (data) => {
  UpdateUi(data.focusActive ?? false);
});
toggleBtn.addEventListener("click", () => {
  chrome.storage.local.get("focusActive", (data) => {
    const newState = !(data.focusActive ?? false);
    chrome.storage.local.set({ focusActive: newState });
    UpdateUi(newState);
    chrome.runtime.sendMessage({ type: "TOGGLE", active: newState });
  });
});
