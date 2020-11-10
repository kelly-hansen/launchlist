var currentView = 'upcoming';
var altView = 'previous';

var $main = document.querySelector('main');

var launchList;
function launchListSwitch(prevOrUpcoming) {
  var xhrLaunches = new XMLHttpRequest();
  xhrLaunches.open('GET', 'https://ll.thespacedevs.com/2.0.0/launch/' + prevOrUpcoming + '/?format=json');
  xhrLaunches.responseType = 'json';
  xhrLaunches.addEventListener('load', function () {
    launchList = xhrLaunches.response;
    var $existingSection = document.querySelector('section');
    $main.removeChild($existingSection);
    $main.appendChild(renderLaunchList(launchList, prevOrUpcoming));
    if (prevOrUpcoming === 'upcoming') {
      currentView = 'upcoming';
      altView = 'previous';
    } else {
      currentView = 'previous';
      altView = 'upcoming';
    }
  });
  xhrLaunches.send();
}

function renderLaunchItem(launchAPIData, i) {
  var $launchItem = document.createElement('button');
  $launchItem.className = 'launch-item';
  $launchItem.setAttribute('data-id', i);

  var $launchItemImg = document.createElement('img');
  $launchItemImg.src = 'images/rocketwhite.png';
  $launchItemImg.alt = 'Rocket icon';
  $launchItem.appendChild($launchItemImg);

  var $launchItemP = document.createElement('p');
  $launchItemP.textContent = launchAPIData.results[i].name;
  $launchItem.appendChild($launchItemP);

  return $launchItem;
}

function renderLaunchList(launchAPIData, prevOrUpcoming) {
  var h1Content;
  var grayButtonContent;
  if (prevOrUpcoming === 'previous') {
    h1Content = 'Recent Rocket Launches';
    grayButtonContent = 'View Upcoming Launches';
  } else if (prevOrUpcoming === 'upcoming') {
    h1Content = 'Upcoming Rocket Launches';
    grayButtonContent = 'View Recent Launches';
  }

  var $newSection = document.createElement('section');

  var $h1 = document.createElement('h1');
  $h1.textContent = h1Content;
  $newSection.appendChild($h1);

  if (launchAPIData.results) {
    for (let i = 0; i < 10; i++) {
      $newSection.appendChild(renderLaunchItem(launchAPIData, i));
    }

    var $grayButton = document.createElement('button');
    $grayButton.className = 'gray-button';
    $grayButton.addEventListener('click', function() {
      launchListSwitch(altView);
    });
    $grayButton.textContent = grayButtonContent;

    $newSection.appendChild($grayButton);
  } else {
    var $h3 = document.createElement('h3');
    $h3.className = 'loading-msg';
    $h3.textContent = launchAPIData.detail;
    $newSection.appendChild($h3);

    var $loadingDiv = document.createElement('div');
    $loadingDiv.className = 'loading';
    $newSection.appendChild($loadingDiv);

    var $loadingImg = document.createElement('img');
    $loadingImg.src = 'images/rocketwhite.png';
    $loadingImg.setAttribute('alt', 'Rocket icon');
    $loadingDiv.appendChild($loadingImg);
  }

  return $newSection;
}

launchListSwitch('upcoming')
