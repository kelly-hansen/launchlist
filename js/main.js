let currentView = 'upcoming';
let altView = 'previous';

const $main = document.querySelector('main');
const $loadingScreen = document.querySelector('.loading-screen');

let launchList;
function launchListSwitch(prevOrUpcoming) {
  $loadingScreen.className = 'loading-screen';
  const xhrLaunches = new XMLHttpRequest();
  xhrLaunches.open('GET', `https://ll.thespacedevs.com/2.0.0/launch/${prevOrUpcoming}/?format=json`);
  xhrLaunches.responseType = 'json';
  xhrLaunches.addEventListener('load', () => {
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
    $loadingScreen.className = 'loading-screen hidden';
  });
  xhrLaunches.send();
}

function removeAndAppendLaunchList(prevOrUpcoming) {
  window.scrollTo({
    top: 0,
    left: 0
  });
  const $existingSection = document.querySelector('section');
  $main.removeChild($existingSection);
  $main.appendChild(renderLaunchList(prevOrUpcoming));
  launchIndex = null;
}

function renderLaunchItem(i) {
  const $launchItem = document.createElement('div');
  $launchItem.className = 'launch-item';

  const $imgDiv = document.createElement('div');
  $imgDiv.className = 'item-img';
  $launchItem.appendChild($imgDiv);

  const $launchItemImg = document.createElement('img');
  $launchItemImg.src = 'images/rocketwhite.png';
  $launchItemImg.alt = 'Rocket icon';
  $imgDiv.appendChild($launchItemImg);

  const $infoDiv = document.createElement('div');
  $infoDiv.className = 'item-info';
  $launchItem.appendChild($infoDiv);

  const $launchName = document.createElement('h3');
  $launchName.textContent = launchList.results[i].name;
  $infoDiv.appendChild($launchName);

  const $launchLoc = document.createElement('p');
  $launchLoc.textContent = launchList.results[i].pad.location.name;
  $infoDiv.appendChild($launchLoc);

  const $launchDate = document.createElement('p');
  const launchDate = new Date(launchList.results[i].window_start);
  $launchDate.textContent = launchDate.toLocaleString();
  $infoDiv.appendChild($launchDate);

  const $moreInfoDiv = document.createElement('div');
  $moreInfoDiv.className = 'more-info';
  $infoDiv.appendChild($moreInfoDiv);

  const $moreInfoBtn = document.createElement('button');
  $moreInfoBtn.textContent = 'More Info';
  $moreInfoBtn.setAttribute('data-id', i);
  $moreInfoBtn.addEventListener('click', viewLaunchDetails);
  $moreInfoDiv.appendChild($moreInfoBtn);

  return $launchItem;
}

function renderLaunchList(prevOrUpcoming) {
  let h1Content;
  let grayButtonContent;
  if (prevOrUpcoming === 'previous') {
    h1Content = 'Recent Rocket Launches';
    grayButtonContent = 'View Upcoming Launches';
  } else if (prevOrUpcoming === 'upcoming') {
    h1Content = 'Upcoming Rocket Launches';
    grayButtonContent = 'View Recent Launches';
  }

  const $newSection = document.createElement('section');

  const $h1 = document.createElement('h1');
  $h1.textContent = h1Content;
  $newSection.appendChild($h1);

  if (launchList.results) {
    for (let i = 0; i < 10; i++) {
      $newSection.appendChild(renderLaunchItem(i));
    }

    const $grayButton = document.createElement('button');
    $grayButton.className = 'gray-button';
    $grayButton.addEventListener('click', () => launchListSwitch(altView));
    $grayButton.textContent = grayButtonContent;

    $newSection.appendChild($grayButton);
  } else {
    const $h3 = document.createElement('h3');
    $h3.className = 'loading-msg';
    $h3.textContent = launchList.detail;
    $newSection.appendChild($h3);

    const $loadingDiv = document.createElement('div');
    $loadingDiv.className = 'loading';
    $newSection.appendChild($loadingDiv);

    const $loadingImg = document.createElement('img');
    $loadingImg.src = 'images/rocketwhite.png';
    $loadingImg.setAttribute('alt', 'Rocket icon');
    $loadingDiv.appendChild($loadingImg);
  }

  return $newSection;
}

function renderLaunchDetails(launchIndex, $launchImg) {
  const $newSection = document.createElement('section');
  $newSection.className = 'launch-details';

  const $launchName = document.createElement('h1');
  $launchName.textContent = launchList.results[launchIndex].name;
  $newSection.appendChild($launchName);

  const $detailsColumns = document.createElement('div');
  $detailsColumns.className = 'details-columns';
  $newSection.appendChild($detailsColumns);

  $launchImg.setAttribute('alt', 'Rocket icon');
  $detailsColumns.appendChild($launchImg);

  const $detailsDiv = document.createElement('div');
  $detailsColumns.appendChild($detailsDiv);

  const $agencyName = document.createElement('h3');
  $agencyName.textContent = launchList.results[launchIndex].launch_service_provider.name;
  $detailsDiv.appendChild($agencyName);

  const $location = document.createElement('h3');
  $location.textContent = launchList.results[launchIndex].pad.location.name;
  $detailsDiv.appendChild($location);

  const $statusDiv = document.createElement('div');
  $statusDiv.className = 'status';
  $detailsDiv.appendChild($statusDiv);

  const $statusH2 = document.createElement('h2');
  $statusH2.textContent = 'Launch Status:';
  $statusDiv.appendChild($statusH2);

  const $statusH3 = document.createElement('h3');
  $statusH3.textContent = launchList.results[launchIndex].status.name;
  if ($statusH3.textContent === 'Success' || $statusH3.textContent === 'Go' || $statusH3.textContent === 'In Flight') {
    $statusH3.className = 'green';
  } else {
    $statusH3.className = 'yellow';
  }
  $statusDiv.appendChild($statusH3);

  if (currentView === 'upcoming') {
    const $timerContDiv = document.createElement('div');
    $timerContDiv.className = 'timer';
    $newSection.appendChild($timerContDiv);

    const $tMinus = document.createElement('h2');
    $tMinus.className = 't-';
    $tMinus.textContent = 'T-';
    $timerContDiv.appendChild($tMinus);

    for (let i = 0; i < 4; i++) {
      const timeUnit = ['days', 'hours', 'minutes', 'seconds'];

      const $timerDiv = document.createElement('div');

      const $timerH2 = document.createElement('h2');
      $timerH2.className = timeUnit[i];
      $timerH2.textContent = '00';
      $timerDiv.appendChild($timerH2);

      const $timerP = document.createElement('p');
      $timerP.textContent = timeUnit[i].toUpperCase();
      $timerDiv.appendChild($timerP);

      $timerContDiv.appendChild($timerDiv);

      if (i < 3) {
        const $separatorH2 = document.createElement('h2');
        $separatorH2.textContent = ':';
        $timerContDiv.appendChild($separatorH2);
      }
    }
  }

  const $dateTime = document.createElement('h3');
  const dateTime = new Date(launchList.results[launchIndex].window_start);
  $dateTime.textContent = dateTime.toLocaleString();
  $newSection.appendChild($dateTime);

  const $missionTitle = document.createElement('h2');
  $missionTitle.className = 'mission-title';
  $missionTitle.textContent = 'Mission';
  $newSection.appendChild($missionTitle);

  const $mission = document.createElement('div');
  $mission.className = 'mission';
  if (launchList.results[launchIndex].mission) {
    $mission.textContent = launchList.results[launchIndex].mission.description;
  } else {
    $mission.textContent = 'N/A';
  }
  $newSection.appendChild($mission);

  if (currentView === 'upcoming') {
    const $weatherButton = document.createElement('button');
    $weatherButton.className = 'weather-button';
    $weatherButton.textContent = 'Weather Forecast';
    $weatherButton.addEventListener('click', () => {
      getWeather(launchIndex);
      clearInterval(countdown);
    });
    $newSection.appendChild($weatherButton);
  }

  const $backToList = document.createElement('button');
  $backToList.className = 'gray-button';
  $backToList.textContent = 'Back to List';
  $backToList.addEventListener('click', () => {
    removeAndAppendLaunchList(currentView);
    clearInterval(countdown);
  });
  $newSection.appendChild($backToList);

  return $newSection;
}

let launchIndex;
function viewLaunchDetails(e) {
  $loadingScreen.className = 'loading-screen';
  if (!launchIndex) {
    if (e.target.getAttribute('data-id')) {
      launchIndex = e.target.getAttribute('data-id');
    } else {
      launchIndex = e.target.closest('button').getAttribute('data-id');
    }
  }
  const $launchImg = document.createElement('img');
  const suppliedImg = launchList.results[launchIndex].image;
  if (suppliedImg) {
    $launchImg.src = suppliedImg;
  } else {
    $launchImg.src = 'images/rocketwhite.png';
  }
  $launchImg.onload = () => {
    window.scrollTo({
      top: 0,
      left: 0
    });
    const $existingSection = document.querySelector('section');
    $main.removeChild($existingSection);
    $main.appendChild(renderLaunchDetails(launchIndex, $launchImg));
    if (currentView === 'upcoming') {
      countdownTimer();
    }
    $loadingScreen.className = 'loading-screen hidden';
  };
}

let countdown;
let timeToLaunch;

function renderCountdown() {
  let time = Math.abs(timeToLaunch);
  if (timeToLaunch < 0) {
    time += 1000;
  }
  const msPerDay = 1000 * 60 * 60 * 24;
  const days = Math.floor(time / msPerDay);
  time -= msPerDay * days;
  const msPerHour = 1000 * 60 * 60;
  const hours = Math.floor(time / msPerHour);
  time -= msPerHour * hours;
  const msPerMinute = 1000 * 60;
  const minutes = Math.floor(time / msPerMinute);
  time -= msPerMinute * minutes;
  const seconds = Math.floor(time / 1000);

  if (timeToLaunch < 0) {
    const $tMinus = document.querySelector('.t-');
    $tMinus.textContent = 'T+';
  }
  const $days = document.querySelector('.days');
  $days.textContent = ('0' + days).slice(-2);
  const $hours = document.querySelector('.hours');
  $hours.textContent = ('0' + hours).slice(-2);
  const $minutes = document.querySelector('.minutes');
  $minutes.textContent = ('0' + minutes).slice(-2);
  const $seconds = document.querySelector('.seconds');
  $seconds.textContent = ('0' + seconds).slice(-2);
}

function countdownTimer() {
  let launchTime = new Date(launchList.results[launchIndex].window_start);
  launchTime = launchTime.getTime();
  let currentTime = new Date();
  currentTime = currentTime.getTime();
  timeToLaunch = launchTime - currentTime;
  renderCountdown();
  countdown = setInterval(() => {
    timeToLaunch -= 1000;
    renderCountdown();
  }, 1000);
}

let weather;
const forecastDays = 7;
const forecastUnits = 'I';
function getWeather(launchIndex) {
  $loadingScreen.className = 'loading-screen';
  const weatherbitApiKey = '9e69faa8384143cfb363ea4710be3c21';
  const lat = launchList.results[launchIndex].pad.latitude;
  const lon = launchList.results[launchIndex].pad.longitude;
  const xhrWeather = new XMLHttpRequest();
  xhrWeather.open('GET', `https://api.weatherbit.io/v2.0/forecast/daily?units=${forecastUnits}&key=${weatherbitApiKey}&lat=${lat}&lon=${lon}`);
  xhrWeather.responseType = 'json';
  xhrWeather.addEventListener('load', () => {
    if (xhrWeather.status === 200) {
      window.scrollTo({
        top: 0,
        left: 0
      });
      weather = xhrWeather.response;
      const $existingSection = document.querySelector('section');
      $main.removeChild($existingSection);
      $main.appendChild(renderWeatherPage());
    } else {
      window.alert('Unable to retreive weather data at this time');
    }
    $loadingScreen.className = 'loading-screen hidden';
  });
  xhrWeather.send();
}

function renderWeatherPage() {
  let weatherIndex;
  for (let x = 0; x < weather.data.length; x++) {
    let launchDate = new Date(launchList.results[launchIndex].window_start);
    launchDate = launchDate.toLocaleDateString();
    let weatherDate = new Date(weather.data[x].valid_date);
    weatherDate = weatherDate.toLocaleDateString();
    if (launchDate === weatherDate) {
      weatherIndex = x;
      break;
    }
  }

  const $newSection = document.createElement('section');
  $newSection.className = 'weather-page';

  const $locationH2 = document.createElement('h2');
  $locationH2.textContent = launchList.results[launchIndex].pad.location.name;
  $newSection.appendChild($locationH2);

  if (weatherIndex !== undefined) {
    const $launchForecastDiv = document.createElement('div');
    $launchForecastDiv.className = 'launch-forecast';
    $newSection.appendChild($launchForecastDiv);

    const $schedH3 = document.createElement('h3');
    $schedH3.textContent = 'Scheduled Launch:';
    $launchForecastDiv.appendChild($schedH3);

    const $launchDateH3 = document.createElement('h3');
    const launchDateContent = new Date(weather.data[weatherIndex].valid_date);
    $launchDateH3.textContent = launchDateContent.toLocaleDateString();
    $launchForecastDiv.appendChild($launchDateH3);

    const $launchWeatherDesc = document.createElement('p');
    $launchWeatherDesc.textContent = weather.data[weatherIndex].weather.description;
    $launchForecastDiv.appendChild($launchWeatherDesc);

    const $launchIconTemp = document.createElement('div');
    $launchIconTemp.className = 'icon-temp';
    $launchForecastDiv.appendChild($launchIconTemp);

    const $launchWIcon = document.createElement('img');
    $launchWIcon.src = 'images/weathericons/' + weather.data[weatherIndex].weather.icon + '.png';
    $launchWIcon.setAttribute('alt', 'Weather Icon');
    $launchIconTemp.appendChild($launchWIcon);

    const $launchHighTemp = document.createElement('p');
    $launchHighTemp.insertAdjacentHTML('afterbegin', weather.data[weatherIndex].high_temp + '&deg;F');
    $launchIconTemp.appendChild($launchHighTemp);

    const $launchPOP = document.createElement('p');
    $launchPOP.textContent = 'Precipitation: ' + weather.data[weatherIndex].pop + '%';
    $launchForecastDiv.appendChild($launchPOP);

    const $launchRH = document.createElement('p');
    $launchRH.textContent = 'Humidity: ' + weather.data[weatherIndex].rh + '%';
    $launchForecastDiv.appendChild($launchRH);

    const $launchWind = document.createElement('p');
    $launchWind.textContent = 'Wind: ' + weather.data[weatherIndex].wind_spd + ' mph';
    $launchForecastDiv.appendChild($launchWind);
  }

  const $dayForecastH2 = document.createElement('h2');
  $dayForecastH2.textContent = forecastDays + '-Day Forecast';
  $newSection.appendChild($dayForecastH2);

  const $dayForecastDiv = document.createElement('div');
  $dayForecastDiv.className = 'forecast-cont';
  $newSection.appendChild($dayForecastDiv);

  for (let i = 0; i < forecastDays; i++) {
    const $dayDiv = document.createElement('div');
    if (i === weatherIndex) {
      $dayDiv.className = 'forecast-day equals-launch';
    } else {
      $dayDiv.className = 'forecast-day';
    }

    const $date = document.createElement('h3');
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const weatherDateCont = new Date(weather.data[i].valid_date);
    $date.textContent = weekDays[weatherDateCont.getDay()];
    $dayDiv.appendChild($date);

    const $description = document.createElement('p');
    $description.textContent = weather.data[i].weather.description;
    $dayDiv.appendChild($description);

    const $dayIconTemp = document.createElement('div');
    $dayIconTemp.className = 'icon-temp';
    $dayDiv.appendChild($dayIconTemp);

    const $dayIcon = document.createElement('img');
    $dayIcon.src = 'images/weathericons/' + weather.data[i].weather.icon + '.png';
    $dayIcon.setAttribute('alt', 'Weather Icon');
    $dayIconTemp.appendChild($dayIcon);

    const $dayTemp = document.createElement('p');
    $dayTemp.className = 'temp';
    $dayTemp.insertAdjacentHTML('afterbegin', weather.data[i].high_temp + '&deg;F');
    $dayIconTemp.appendChild($dayTemp);

    $dayForecastDiv.appendChild($dayDiv);
  }

  const $backToLaunchDetails = document.createElement('button');
  $backToLaunchDetails.className = 'gray-button';
  $backToLaunchDetails.textContent = 'Back to Launch Details';
  $backToLaunchDetails.addEventListener('click', viewLaunchDetails);
  $newSection.appendChild($backToLaunchDetails);

  return $newSection;
}

launchListSwitch('upcoming');
