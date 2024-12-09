document.getElementById("grant").addEventListener("click", () => {
  chrome.permissions
    .request({
      origins: ["*://*.sooplive.co.kr/*"],
    })
    .then((granted) => {
      if (granted) {
        window.close();
      }
    });
});
