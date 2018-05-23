export const makeId = () => {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
};

export const getWindowWidth = () => {
  return window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;
};


export const getFromLS = (key) => {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem("page-design")) || {};
    } catch (e) {
      /*Ignore*/
    }
  }
  return ls[key];
};

export const saveToLS = (key, value) => {
  if (global.localStorage) {
    global.localStorage.setItem(
      "page-design",
      JSON.stringify({
        [key]: value
      })
    );
  }
};

