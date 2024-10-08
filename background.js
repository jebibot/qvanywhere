const COOKIES = [
  {
    name: "PdboxTicket",
    domain: ".afreecatv.com",
    url: "https://login.afreecatv.com/app/LoginAction.php",
  },
  {
    name: "PdboxUser",
    domain: ".afreecatv.com",
    url: "https://login.afreecatv.com/app/LoginAction.php",
  },
  {
    name: "AuthTicket",
    domain: ".sooplive.co.kr",
    url: "https://login.sooplive.co.kr/app/LoginAction.php",
  },
  {
    name: "UserTicket",
    domain: ".sooplive.co.kr",
    url: "https://login.sooplive.co.kr/app/LoginAction.php",
  },
];

const init = async () => {
  const granted = await checkPermission();
  if (!granted) {
    return;
  }
  for (const { name, url } of COOKIES) {
    const cookie = await chrome.cookies.get({ name, url });
    if (cookie != null) {
      await setPartitonedCookie(cookie, url);
    }
  }
};

const checkPermission = async () => {
  const granted = await chrome.permissions.contains({
    origins: ["*://*.afreecatv.com/*", "*://*.sooplive.co.kr/*"],
  });
  if (!granted) {
    chrome.tabs.create({
      url: chrome.runtime.getURL("permission.html"),
    });
  }
  return granted;
};

const setPartitonedCookie = async (cookie, url) => {
  if (cookie.partitionKey != null) {
    return;
  }
  delete cookie.hostOnly;
  delete cookie.session;

  const { sites } = await chrome.storage.local.get({
    sites: ["https://cafe.naver.com", "https://www.fmkorea.com"],
  });
  for (const site of sites) {
    if (!/^https:\/\/[a-z0-9.-]+$/.test(site)) {
      continue;
    }
    await chrome.cookies.set({
      ...cookie,
      sameSite: chrome.cookies.SameSiteStatus.NO_RESTRICTION,
      secure: true,
      url,
      partitionKey: {
        topLevelSite: site,
      },
    });
  }
};

chrome.runtime.onInstalled.addListener(init);
chrome.runtime.onStartup.addListener(init);
chrome.storage.local.onChanged.addListener(init);

chrome.permissions.onRemoved.addListener(checkPermission);

chrome.cookies.onChanged.addListener(async ({ cookie, removed }) => {
  if (removed) {
    return;
  }
  const c = COOKIES.find(
    ({ name, domain }) => cookie.name === name && cookie.domain === domain
  );
  if (c != null) {
    await setPartitonedCookie(cookie, c.url);
  }
});
