var currentView = 'upcoming';
var altView = 'previous';

var $main = document.querySelector('main');

var launchList;
function launchListSwitch(prevOrUpcoming) {
  var xhrLaunches = new XMLHttpRequest();
  xhrLaunches.open('GET', 'https://ll.thespacedevs.com/2.0.0/launch/' + prevOrUpcoming + '/?format=json');
  xhrLaunches.responseType = 'json';
  xhrLaunches.addEventListener('load', function () {
    if (xhrLaunches.status === 200 || xhrLaunches.status === 429) {
      launchList = xhrLaunches.response;
      removeAndAppendLaunchList(prevOrUpcoming);
      if (prevOrUpcoming === 'upcoming') {
        currentView = 'upcoming';
        altView = 'previous';
      } else {
        currentView = 'previous';
        altView = 'upcoming';
      }
    } else {
      window.alert('Unable to retrieve launch data at this time');
    }
  });
  xhrLaunches.send();
}

function removeAndAppendLaunchList(prevOrUpcoming) {
  window.scrollTo({
    top: 0,
    left: 0
  });
  var $existingSection = document.querySelector('section');
  $main.removeChild($existingSection);
  $main.appendChild(renderLaunchList(prevOrUpcoming));
  launchIndex = null;
}

function renderLaunchItem(i) {
  var $launchItem = document.createElement('div');
  $launchItem.className = 'launch-item';

  var $imgDiv = document.createElement('div');
  $imgDiv.className = 'item-img';
  $launchItem.appendChild($imgDiv);

  var $launchItemImg = document.createElement('img');
  $launchItemImg.src = 'images/rocketwhite.png';
  $launchItemImg.alt = 'Rocket icon';
  $imgDiv.appendChild($launchItemImg);

  var $infoDiv = document.createElement('div');
  $infoDiv.className = 'item-info';
  $launchItem.appendChild($infoDiv);

  var $launchName = document.createElement('h3');
  $launchName.textContent = launchList.results[i].name;
  $infoDiv.appendChild($launchName);

  var $launchLoc = document.createElement('p');
  $launchLoc.textContent = launchList.results[i].pad.location.name;
  $infoDiv.appendChild($launchLoc);

  var $launchDate = document.createElement('p');
  var launchDate = new Date(launchList.results[i].window_start);
  $launchDate.textContent = launchDate.toLocaleString();
  $infoDiv.appendChild($launchDate);

  var $moreInfoDiv = document.createElement('div');
  $moreInfoDiv.className = 'more-info';
  $infoDiv.appendChild($moreInfoDiv);

  var $moreInfoBtn = document.createElement('button');
  $moreInfoBtn.textContent = 'More Info';
  $moreInfoBtn.setAttribute('data-id', i);
  $moreInfoBtn.addEventListener('click', viewLaunchDetails);
  $moreInfoDiv.appendChild($moreInfoBtn);

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

function renderLaunchDetails(launchIndex, $launchImg) {
  var $newSection = document.createElement('section');
  $newSection.className = 'launch-details';

  var $launchName = document.createElement('h1');
  $launchName.textContent = launchList.results[launchIndex].name;
  $newSection.appendChild($launchName);

  var $detailsColumns = document.createElement('div');
  $detailsColumns.className = 'details-columns';
  $newSection.appendChild($detailsColumns);

  $launchImg.setAttribute('alt', 'Rocket icon');
  $detailsColumns.appendChild($launchImg);

  var $detailsDiv = document.createElement('div');
  $detailsColumns.appendChild($detailsDiv);

  var $agencyName = document.createElement('h3');
  $agencyName.textContent = launchList.results[launchIndex].launch_service_provider.name;
  $detailsDiv.appendChild($agencyName);

  var $location = document.createElement('h3');
  $location.textContent = launchList.results[launchIndex].pad.location.name;
  $detailsDiv.appendChild($location);

  var $statusDiv = document.createElement('div');
  $statusDiv.className = 'status';
  $detailsDiv.appendChild($statusDiv);

  var $statusH2 = document.createElement('h2');
  $statusH2.textContent = 'Launch Status:';
  $statusDiv.appendChild($statusH2);

  var $statusH3 = document.createElement('h3');
  $statusH3.textContent = launchList.results[launchIndex].status.name;
  if ($statusH3.textContent === 'Success' || $statusH3.textContent === 'Go' || $statusH3.textContent === 'In Flight') {
    $statusH3.className = 'green';
  } else {
    $statusH3.className = 'yellow';
  }
  $statusDiv.appendChild($statusH3);

  if (currentView === 'upcoming') {
    var $timerContDiv = document.createElement('div');
    $timerContDiv.className = 'timer';
    $newSection.appendChild($timerContDiv);

    var $tMinus = document.createElement('h2');
    $tMinus.className = 't-';
    $tMinus.textContent = 'T-';
    $timerContDiv.appendChild($tMinus);

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
  }

  var $dateTime = document.createElement('h3');
  var dateTime = new Date(launchList.results[launchIndex].window_start);
  $dateTime.textContent = dateTime.toLocaleString();
  $newSection.appendChild($dateTime);

  var $missionTitle = document.createElement('h2');
  $missionTitle.className = 'mission-title';
  $missionTitle.textContent = 'Mission';
  $newSection.appendChild($missionTitle);

  var $mission = document.createElement('div');
  $mission.className = 'mission';
  if (launchList.results[launchIndex].mission) {
    $mission.textContent = launchList.results[launchIndex].mission.description;
  } else {
    $mission.textContent = 'N/A';
  }
  $newSection.appendChild($mission);

  if (currentView === 'upcoming') {
    var $weatherButton = document.createElement('button');
    $weatherButton.className = 'weather-button';
    $weatherButton.textContent = 'Weather Forecast';
    $weatherButton.addEventListener('click', function () {
      getWeather(launchIndex);
      clearInterval(countdown);
    });
    $newSection.appendChild($weatherButton);
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
  var $launchImg = document.createElement('img');
  var suppliedImg = launchList.results[launchIndex].image;
  if (suppliedImg) {
    $launchImg.src = suppliedImg;
  } else {
    $launchImg.src = 'images/rocketwhite.png';
  }
  $launchImg.onload = function () {
    window.scrollTo({
      top: 0,
      left: 0
    });
    var $existingSection = document.querySelector('section');
    $main.removeChild($existingSection);
    $main.appendChild(renderLaunchDetails(launchIndex, $launchImg));
    if (currentView === 'upcoming') {
      countdownTimer();
    }
  };
}

var countdown;
var timeToLaunch;

function renderCountdown() {
  var time = Math.abs(timeToLaunch);
  if (timeToLaunch < 0) {
    time += 1000;
  }
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

  if (timeToLaunch < 0) {
    var $tMinus = document.querySelector('.t-');
    $tMinus.textContent = 'T+';
  }
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
    renderCountdown();
  }, 1000);
}

var weather;
var forecastDays = 7;
var forecastUnits = 'I';
function getWeather(launchIndex) {
  var weatherbitApiKey = '9e69faa8384143cfb363ea4710be3c21';
  var lat = launchList.results[launchIndex].pad.latitude;
  var lon = launchList.results[launchIndex].pad.longitude;
  var xhrWeather = new XMLHttpRequest();
  xhrWeather.open('GET', 'https://api.weatherbit.io/v2.0/forecast/daily?units=' + forecastUnits + '&key=' + weatherbitApiKey + '&lat=' + lat + '&lon=' + lon);
  xhrWeather.responseType = 'json';
  xhrWeather.addEventListener('load', function () {
    if (xhrWeather.status === 200) {
      window.scrollTo({
        top: 0,
        left: 0
      });
      weather = xhrWeather.response;
      var $existingSection = document.querySelector('section');
      $main.removeChild($existingSection);
      $main.appendChild(renderWeatherPage());
    } else {
      window.alert('Unable to retreive weather data at this time');
    }
  });
  xhrWeather.send();
}

function renderWeatherPage() {
  var weatherIndex;
  for (var x = 0; x < weather.data.length; x++) {
    var launchDate = new Date(launchList.results[launchIndex].window_start);
    launchDate = launchDate.toLocaleDateString();
    var weatherDate = new Date(weather.data[x].valid_date);
    weatherDate = weatherDate.toLocaleDateString();
    if (launchDate === weatherDate) {
      weatherIndex = x;
      break;
    }
  }

  var $newSection = document.createElement('section');
  $newSection.className = 'weather-page';

  var $locationH2 = document.createElement('h2');
  $locationH2.textContent = launchList.results[launchIndex].pad.location.name;
  $newSection.appendChild($locationH2);

  if (weatherIndex !== undefined) {
    var $launchForecastDiv = document.createElement('div');
    $launchForecastDiv.className = 'launch-forecast';
    $newSection.appendChild($launchForecastDiv);

    var $schedH3 = document.createElement('h3');
    $schedH3.textContent = 'Scheduled Launch:';
    $launchForecastDiv.appendChild($schedH3);

    var $launchDateH3 = document.createElement('h3');
    var launchDateContent = new Date(weather.data[weatherIndex].valid_date);
    $launchDateH3.textContent = launchDateContent.toLocaleDateString();
    $launchForecastDiv.appendChild($launchDateH3);

    var $launchWeatherDesc = document.createElement('p');
    $launchWeatherDesc.textContent = weather.data[weatherIndex].weather.description;
    $launchForecastDiv.appendChild($launchWeatherDesc);

    var $launchIconTemp = document.createElement('div');
    $launchIconTemp.className = 'icon-temp';
    $launchForecastDiv.appendChild($launchIconTemp);

    var $launchWIcon = document.createElement('img');
    $launchWIcon.src = 'images/weathericons/' + weather.data[weatherIndex].weather.icon + '.png';
    $launchWIcon.setAttribute('alt', 'Weather Icon');
    $launchIconTemp.appendChild($launchWIcon);

    var $launchHighTemp = document.createElement('p');
    $launchHighTemp.insertAdjacentHTML('afterbegin', weather.data[weatherIndex].high_temp + '&deg;F');
    $launchIconTemp.appendChild($launchHighTemp);

    var $launchPOP = document.createElement('p');
    $launchPOP.textContent = 'Precipitation: ' + weather.data[weatherIndex].pop + '%';
    $launchForecastDiv.appendChild($launchPOP);

    var $launchRH = document.createElement('p');
    $launchRH.textContent = 'Humidity: ' + weather.data[weatherIndex].rh + '%';
    $launchForecastDiv.appendChild($launchRH);

    var $launchWind = document.createElement('p');
    $launchWind.textContent = 'Wind: ' + weather.data[weatherIndex].wind_spd + ' mph';
    $launchForecastDiv.appendChild($launchWind);
  }

  var $dayForecastH2 = document.createElement('h2');
  $dayForecastH2.textContent = forecastDays + '-Day Forecast';
  $newSection.appendChild($dayForecastH2);

  var $dayForecastDiv = document.createElement('div');
  $dayForecastDiv.className = 'forecast-cont';
  $newSection.appendChild($dayForecastDiv);

  for (var i = 0; i < forecastDays; i++) {
    var $dayDiv = document.createElement('div');
    if (i === weatherIndex) {
      $dayDiv.className = 'forecast-day equals-launch';
    } else {
      $dayDiv.className = 'forecast-day';
    }

    var $date = document.createElement('h3');
    var weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var weatherDateCont = new Date(weather.data[i].valid_date);
    $date.textContent = weekDays[weatherDateCont.getDay()];
    $dayDiv.appendChild($date);

    var $description = document.createElement('p');
    $description.textContent = weather.data[i].weather.description;
    $dayDiv.appendChild($description);

    var $dayIconTemp = document.createElement('div');
    $dayIconTemp.className = 'icon-temp';
    $dayDiv.appendChild($dayIconTemp);

    var $dayIcon = document.createElement('img');
    $dayIcon.src = 'images/weathericons/' + weather.data[i].weather.icon + '.png';
    $dayIcon.setAttribute('alt', 'Weather Icon');
    $dayIconTemp.appendChild($dayIcon);

    var $dayTemp = document.createElement('p');
    $dayTemp.className = 'temp';
    $dayTemp.insertAdjacentHTML('afterbegin', weather.data[i].high_temp + '&deg;F');
    $dayIconTemp.appendChild($dayTemp);

    $dayForecastDiv.appendChild($dayDiv);
  }

  var $backToLaunchDetails = document.createElement('button');
  $backToLaunchDetails.className = 'gray-button';
  $backToLaunchDetails.textContent = 'Back to Launch Details';
  $backToLaunchDetails.addEventListener('click', viewLaunchDetails);
  $newSection.appendChild($backToLaunchDetails);

  return $newSection;
}

launchListSwitch('upcoming');
