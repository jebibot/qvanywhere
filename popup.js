(async () => {
  let { sites } = await chrome.storage.local.get({
    sites: ["https://cafe.naver.com", "https://www.fmkorea.com"],
  });
  const sitesSet = new Set(sites);

  const form = document.forms[0];
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    sitesSet.add(form.site.value);
    await chrome.storage.local.set({ sites: [...sitesSet] });
    location.reload();
  });

  const list = document.getElementById("sites");
  for (const s of sitesSet) {
    const item = document.createElement("div");
    list.appendChild(item);

    const span = document.createElement("span");
    span.textContent = s;
    item.appendChild(span);

    const remove = document.createElement("button");
    remove.textContent = "x";
    remove.addEventListener("click", async () => {
      sitesSet.delete(s);
      await chrome.storage.local.set({ sites: [...sitesSet] });
      item.remove();
    });
    item.appendChild(remove);
  }
})();
