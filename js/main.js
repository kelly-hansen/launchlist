var launchList;
var xhrLaunches = new XMLHttpRequest();
xhrLaunches.open('GET', 'https://ll.thespacedevs.com/2.0.0/launch/upcoming/?format=json');
xhrLaunches.responseType = 'json';
xhrLaunches.addEventListener('load', function() {
  launchList = xhrLaunches.response;
});
xhrLaunches.send();
