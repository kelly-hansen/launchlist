var currentView = 'upcoming';

var $main = document.querySelector('main');

var upcomingLaunchList;
var xhrLaunches = new XMLHttpRequest();
xhrLaunches.open('GET', 'https://ll.thespacedevs.com/2.0.0/launch/upcoming/?format=json');
xhrLaunches.responseType = 'json';
xhrLaunches.addEventListener('load', function () {
  upcomingLaunchList = xhrLaunches.response;
  if (!upcomingLaunchList.results) {
    const $loadingMsg = document.querySelector('.loading-msg');
    $loadingMsg.textContent = upcomingLaunchList.detail;
  } else {
    const $existingSection = document.querySelector('section');
    $main.removeChild($existingSection);
    $main.appendChild(renderLaunchList(upcomingLaunchList));
  }
});
xhrLaunches.send();

function renderLaunchItem(launchAPIData, i) {
  const $launchItem = document.createElement('button');
  $launchItem.className = 'launch-item';
  $launchItem.setAttribute('data-id', i);

  const $launchItemImg = document.createElement('img');
  $launchItemImg.src = 'images/rocketwhite.png';
  $launchItemImg.alt = 'Rocket icon';
  $launchItem.appendChild($launchItemImg);

  const $launchItemP = document.createElement('p');
  $launchItemP.textContent = launchAPIData.results[i].name;
  $launchItem.appendChild($launchItemP);

  return $launchItem;
}

function renderLaunchList(launchAPIData) {
  const $newSection = document.createElement('section');

  const $h1 = document.createElement('h1');
  $h1.textContent = 'Upcoming Rocket Launches';
  $newSection.appendChild($h1);

  for (let i = 0; i < 10; i++) {
    $newSection.appendChild(renderLaunchItem(launchAPIData, i));
  }

  const $grayButton = document.createElement('button');
  $grayButton.className = 'gray-button';
  $grayButton.textContent = 'View Recent Launches';
  $newSection.appendChild($grayButton);

  return $newSection;
}
