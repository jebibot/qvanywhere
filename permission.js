document.getElementById("grant").addEventListener("click", () => {
  chrome.permissions
    .request({
      origins: ["*://*.sooplive.com/*"],
    })
    .then((granted) => {
      if (granted) {
        window.close();
      }
    });
});
