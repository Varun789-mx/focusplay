(async () => {
  const allTabs = await chrome.tabs.query({});
  const list = await document.getElementById("list");
  console.log(list);
  for (const tab of allTabs) {
    if (tab.url?.includes("youtube.com")) {
      const li = document.createElement("li");
      li.textContent = tab.title ?? tab.url;
      list.appendChild(li);
      console.log(list);
    }
  }
})();
