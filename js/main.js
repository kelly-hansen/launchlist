var launchList;
var xhrLaunches = new XMLHttpRequest();
xhrLaunches.open('GET', 'https://ll.thespacedevs.com/2.0.0/launch/upcoming/?format=json');
xhrLaunches.responseType = 'json';
xhrLaunches.addEventListener('load', function () {
  launchList = xhrLaunches.response;
  renderUpcomingLaunches();
});
xhrLaunches.send();

function renderUpcomingLaunches() {
  if (!launchList.results) {
    const $loadingMsg = document.querySelector('.loading-msg');
    $loadingMsg.textContent = launchList.detail;
    return;
  }
  const $main = document.querySelector('main');
  const $existingSection = document.querySelector('section');
  $main.removeChild($existingSection);

  const $newSection = document.createElement('section');
  $main.appendChild($newSection);

  const $h1 = document.createElement('h1');
  $h1.textContent = 'Upcoming Rocket Launches';
  $newSection.appendChild($h1);

  for (let i = 0; i < 10; i++) {
    const $launchItem = document.createElement('button');
    $launchItem.className = 'launch-item';
    $launchItem.setAttribute('data-id', i);

    const $launchItemImg = document.createElement('img');
    $launchItemImg.src = 'images/rocketwhite.png';
    $launchItemImg.alt = 'Rocket icon';
    $launchItem.appendChild($launchItemImg);

    const $launchItemP = document.createElement('p');
    $launchItemP.textContent = launchList.results[i].name;
    $launchItem.appendChild($launchItemP);

    $newSection.appendChild($launchItem);
  }

  const $grayButton = document.createElement('button');
  $grayButton.className = 'gray-button';
  $grayButton.textContent = 'View Past Launches';
  $newSection.appendChild($grayButton);

}
