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
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
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
    $grayButton.addEventListener('click', function () {
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

function renderLaunchDetails(launchIndex) {
  var $newSection = document.createElement('section');
  $newSection.className = 'launch-details';

  var $rocketImg = document.createElement('img');
  $rocketImg.src = 'images/rocketwhite.png';
  $rocketImg.setAttribute('alt', 'Rocket icon');
  $newSection.appendChild($rocketImg);

  var $launchName = document.createElement('h2');
  $launchName.textContent = launchList.results[launchIndex].name;
  $newSection.appendChild($launchName);

  var $agencyName = document.createElement('h3');
  $agencyName.textContent = launchList.results[launchIndex].launch_service_provider.name;
  $newSection.appendChild($agencyName);

  var $location = document.createElement('h3');
  $location.textContent = launchList.results[launchIndex].pad.location.name;
  $newSection.appendChild($location);

  var $dateTime = document.createElement('h3');
  $dateTime.textContent = launchList.results[launchIndex].window_start;
  $newSection.appendChild($dateTime);

  if (currentView === 'upcoming') {
    var $timerContDiv = document.createElement('div');
    $timerContDiv.className = 'timer';
    $newSection.appendChild($timerContDiv);

    for (var i = 0; i < 4; i++) {
      var timeUnit = ['days', 'hours', 'minutes', 'seconds'];

      var $timerDiv = document.createElement('div');

      var $timerH2 = document.createElement('h2');
      $timerH2.className = timeUnit[i];
      $timerH2.textContent = '00';
      $timerDiv.appendChild($timerH2);

      var $timerP = document.createElement('p');
      $timerP.textContent = timeUnit[i].toUpperCase();
      $timerDiv.appendChild($timerP);

      $timerContDiv.appendChild($timerDiv);

      if (i < 3) {
        var $separatorH2 = document.createElement('h2');
        $separatorH2.textContent = ':';
        $timerContDiv.appendChild($separatorH2);
      }
    }
    var $weatherButton = document.createElement('button');
    $weatherButton.className = 'orange-button';
    $weatherButton.textContent = 'Weather Forecast';
    $newSection.appendChild($weatherButton);
  } else if (currentView === 'previous') {
    var $statusDiv = document.createElement('div');
    $statusDiv.className = 'status';

    var $statusH2 = document.createElement('h2');
    $statusH2.textContent = 'Launch Status:';
    $statusDiv.appendChild($statusH2);

    var $statusH3 = document.createElement('h3');
    $statusH3.textContent = launchList.results[launchIndex].status.name;
    if ($statusH3.textContent === 'Success') {
      $statusH3.className = 'green';
    } else {
      $statusH3.className = 'yellow';
    }

    $newSection.appendChild($statusDiv);
  }

  var $backToList = document.createElement('button');
  $backToList.className = 'gray-button';
  $backToList.textContent = 'Back to List';
  $newSection.appendChild($backToList);

  return $newSection;
}

function viewLaunchDetails(e) {
  if (e.target.className !== 'launch-item') {
    return;
  }
  var launchIndex = e.target.getAttribute('data-id');
  var $existingSection = document.querySelector('section');
  $main.removeChild($existingSection);
  $main.appendChild(renderLaunchDetails(launchIndex));
}

window.addEventListener('click', viewLaunchDetails);

launchListSwitch('upcoming');
