(async () => {
  const allTabs = await chrome.tabs.query({});
  const list = await document.getElementById("list");
  for (const tab of allTabs) {
    if (tab.url?.includes("youtube.com")) {
      const li = document.createElement("li");
      li.textContent = tab.title ?? tab.url;
      list.appendChild(li);
      console.log(list);
    }
  }
})();

const toggleBtn = document.getElementById("toggleBtn");
const pillData = document.getElementById("pill");

chrome.storage.local.get("focusActive", (data) => {
  updateUI(data.focusActive ?? false);
});
toggleBtn.addEventListener("click", () => {
  chrome.storage.local.get("focusActive", (data) => {
    const newState = !(data.focusActive ?? false);
    chrome.storage.local.set({ focusActive: newState });
    UpdateUi(newState);
    chrome.runtime.sendMessage({ type: "TOOGLE", newState });
  });
});

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
