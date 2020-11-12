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
    removeAndAppendLaunchList(prevOrUpcoming);
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

function removeAndAppendLaunchList(prevOrUpcoming) {
  var $existingSection = document.querySelector('section');
  $main.removeChild($existingSection);
  $main.appendChild(renderLaunchList(prevOrUpcoming));
  launchIndex = null;
}

function renderLaunchItem(i) {
  var $launchItem = document.createElement('button');
  $launchItem.className = 'launch-item';
  $launchItem.setAttribute('data-id', i);
  $launchItem.addEventListener('click', viewLaunchDetails);

  var $launchItemImg = document.createElement('img');
  $launchItemImg.src = 'images/rocketwhite.png';
  $launchItemImg.alt = 'Rocket icon';
  $launchItem.appendChild($launchItemImg);

  var $launchItemP = document.createElement('p');
  $launchItemP.textContent = launchList.results[i].name;
  $launchItem.appendChild($launchItemP);

  return $launchItem;
}

function renderLaunchList(prevOrUpcoming) {
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

  if (launchList.results) {
    for (let i = 0; i < 10; i++) {
      $newSection.appendChild(renderLaunchItem(i));
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
    $h3.textContent = launchList.detail;
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
    $weatherButton.className = 'weather-button';
    $weatherButton.textContent = 'Weather Forecast';
    $weatherButton.addEventListener('click', function () {
      getWeather(launchIndex);
      clearInterval(countdown);
    });
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
    $statusDiv.appendChild($statusH3);

    $newSection.appendChild($statusDiv);
  }

  var $backToList = document.createElement('button');
  $backToList.className = 'gray-button';
  $backToList.textContent = 'Back to List';
  $backToList.addEventListener('click', function () {
    removeAndAppendLaunchList(currentView);
    clearInterval(countdown);
  });
  $newSection.appendChild($backToList);

  return $newSection;
}

var launchIndex;
function viewLaunchDetails(e) {
  if (!launchIndex) {
    if (e.target.getAttribute('data-id')) {
      launchIndex = e.target.getAttribute('data-id');
    } else {
      launchIndex = e.target.closest('button').getAttribute('data-id');
    }
  }
  var $existingSection = document.querySelector('section');
  $main.removeChild($existingSection);
  $main.appendChild(renderLaunchDetails(launchIndex));
  countdownTimer();
}

var countdown;
var timeToLaunch;

function renderCountdown() {
  var time = timeToLaunch;
  var msPerDay = 1000 * 60 * 60 * 24;
  var days = Math.floor(time / msPerDay);
  time -= msPerDay * days;
  var msPerHour = 1000 * 60 * 60;
  var hours = Math.floor(time / msPerHour);
  time -= msPerHour * hours;
  var msPerMinute = 1000 * 60;
  var minutes = Math.floor(time / msPerMinute);
  time -= msPerMinute * minutes;
  var seconds = Math.floor(time / 1000);

  var $days = document.querySelector('.days');
  $days.textContent = ('0' + days).slice(-2);
  var $hours = document.querySelector('.hours');
  $hours.textContent = ('0' + hours).slice(-2);
  var $minutes = document.querySelector('.minutes');
  $minutes.textContent = ('0' + minutes).slice(-2);
  var $seconds = document.querySelector('.seconds');
  $seconds.textContent = ('0' + seconds).slice(-2);
}

function countdownTimer() {
  var launchTime = new Date(launchList.results[launchIndex].window_start);
  launchTime = launchTime.getTime();
  var currentTime = new Date();
  currentTime = currentTime.getTime();
  timeToLaunch = launchTime - currentTime;
  renderCountdown();
  countdown = setInterval(function () {
    timeToLaunch -= 1000;
    if (timeToLaunch <= 0) {
      clearInterval(countdown);
      return;
    }
    renderCountdown();
  }, 1000);
}

var weather;
var forecastDays = 7;
function getWeather(launchIndex) {
  var weatherbitApiKey = '9e69faa8384143cfb363ea4710be3c21';
  var lat = launchList.results[launchIndex].pad.latitude;
  var lon = launchList.results[launchIndex].pad.longitude;
  var xhrWeather = new XMLHttpRequest();
  xhrWeather.open('GET', 'https://api.weatherbit.io/v2.0/forecast/daily?units=I&key=' + weatherbitApiKey + '&days=' + forecastDays + '&lat=' + lat + '&lon=' + lon);
  xhrWeather.responseType = 'json';
  xhrWeather.addEventListener('load', function () {
    weather = xhrWeather.response;
    var $existingSection = document.querySelector('section');
    $main.removeChild($existingSection);
    $main.appendChild(renderWeatherPage());
  });
  xhrWeather.send();
}

function renderWeatherPage() {
  var $newSection = document.createElement('section');
  $newSection.className = 'weather-page';

  var $weatherH1 = document.createElement('h1');
  $weatherH1.textContent = forecastDays + '-Day Forecast';
  $newSection.appendChild($weatherH1);

  var $weatherH2 = document.createElement('h2');
  $weatherH2.textContent = launchList.results[launchIndex].pad.location.name;
  $newSection.appendChild($weatherH2);

  var $weatherDiv = document.createElement('div');
  $newSection.appendChild($weatherDiv);

  for (var i = 0; i < forecastDays; i++) {
    var $date = document.createElement('h3');
    $date.textContent = weather.data[i].valid_date;
    $weatherDiv.appendChild($date);

    var $temp = document.createElement('p');
    $temp.className = 'temp';
    $temp.insertAdjacentHTML('afterbegin', weather.data[i].high_temp + '&deg;F');
    $weatherDiv.appendChild($temp);

    var $description = document.createElement('p');
    $description.textContent = weather.data[i].weather.description;
    $weatherDiv.appendChild($description);
  }

  var $backToLaunchDetails = document.createElement('button');
  $backToLaunchDetails.className = 'gray-button';
  $backToLaunchDetails.textContent = 'Back to Launch Details';
  $backToLaunchDetails.addEventListener('click', viewLaunchDetails);
  $newSection.appendChild($backToLaunchDetails);

  return $newSection;
}

launchListSwitch('upcoming');
