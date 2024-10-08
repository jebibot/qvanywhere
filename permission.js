document.getElementById("grant").addEventListener("click", () => {
  chrome.permissions
    .request({
      origins: ["*://*.afreecatv.com/*", "*://*.sooplive.co.kr/*"],
    })
    .then((granted) => {
      if (granted) {
        window.close();
      }
    });
});
