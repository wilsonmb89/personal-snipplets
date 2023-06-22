(function (s, h, ci, si, wi) {
  s = s + Math.random().toString(36).substring(7) + "/login.js?clientId=" + ci + "&websiteId=" + wi;
  window._dmo = {src: s, host: h, sessionId: si, clientId: ci, websiteId: wi};
  var a = document.createElement("script");
  a.type = "text/javascript";
  a.src = s;
  a.async = !0;
  var b = document.getElementsByTagName("script")[0];
  b.parentNode.insertBefore(a, b);
})('https://imagenes.bancodebogota.com:443/scriptdealer/script/v1/', 'https://imagenes.bancodebogota.com:443',
  '$ci$', null, '$wi$');


