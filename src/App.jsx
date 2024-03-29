import { useEffect, useState } from "react";
import { LocationIcon} from "./components/Icons";
import { Search } from "./components/Search";
import {getForecast,getForecastByCords,getWeather,getWeatherByCords} from "../public/fetch";
import { addPlaceToLocalStorage } from "./Storage/storage";
import "./app.css";
import Hightlights from "./components/Hightlights";
import backGNuves from "../public/Cloud-background.png";
import Temperatura from "./components/Temperatura";
import Weak from "./components/Weak";


function App() {
  const [weatherData, setWeatherData] = useState({
    temp: 0,
    dateFormat: "",
    windStatus: 0,
    humidity: 0,
    airPressure: 0,
    visibilityInMiles: 0,
    weather: "",
    locationName: "",
    showImage: true,
    isImageGoingUp: true,
  });

  
  useEffect(() => {
    setWeatherData((prev) => ({ ...prev, showImage: true }));
  }, []);

  const handleAnimationIteration = () => {
    setWeatherData((prev) => ({
      ...prev,
      isImageGoingUp: !prev.isImageGoingUp,
    }));
  };

  const [forecastData, setForecastData] = useState({});
  const [keys, setKeys] = useState([]);

  const [isFahrenheit, setIsFahrenheit] = useState(false);
  const [isMph, setIsMph] = useState(false);


  const changeWeather = (data) => {
    const { weather, main, visibility, wind, name } = data;
    const date = new Date(); 
    const dateOptions = { weekday: "short", day: "numeric", month: "short" };

    setWeatherData({
      weather: weather.main ?? "Shower",
      temp: Math.round(main?.temp ?? 0),
      dateFormat: date.toLocaleDateString("en-US", dateOptions),
      windStatus: Math.round(wind?.speed ?? 0),
      humidity: Math.round(main?.humidity ?? 0),
      airPressure: main?.pressure ?? 0,
      visibilityInMiles: visibility ? visibility / 1609.34 : 0,
      weather: weather[0]?.main ?? "Shower",
      locationName: name,
    });
    const progreso = document.getElementById("progress");
    const windStatus = document.getElementById("windStatus");
    progreso.style.width = Math.round(main?.humidity ?? 0) + "%";
    windStatus.style.transform = `rotate(${wind.deg}deg)`;
  };

  const changeForecast = (data) => {
    const dailyForecast = [];

    
    data.list.forEach((segment) => {
      const fechaTexto = segment.dt_txt;
      const fecha = new Date(fechaTexto);
      const dia = fecha.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      
      if (!dailyForecast[dia]) {
        dailyForecast[dia] = {
          minTemp: segment.main.temp,
          maxTemp: segment.main.temp,
          weather: segment.weather[0].main,
        };
      } else {
        
        dailyForecast[dia].minTemp = Math.min(
          dailyForecast[dia].minTemp,
          segment.main.temp
        );
        dailyForecast[dia].maxTemp = Math.max(
          dailyForecast[dia].maxTemp,
          segment.main.temp
        );
      }
    });
    const dayKeys = Object.keys(dailyForecast);
    setForecastData(dailyForecast);
    setKeys(dayKeys);
  };

  const cords = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        getWeatherByCords(lat, lon).then((data) => changeWeather(data));
        getForecastByCords(lat, lon).then((data) => changeForecast(data));
      });
    } else {
      console.log("La geolocalización no está disponible en este navegador.");
    }
  };

  const inputSearch = (place) => {
    addPlaceToLocalStorage(place);
    getWeather(place).then((data) => changeWeather(data));
    getForecast(place).then((data) => changeForecast(data));
  };

  const changeF = () => {
    setIsFahrenheit(true);
    setIsMph(true)
  };

  const changeC = () => {
    setIsFahrenheit(false);
    setIsMph(false)
  };
  
  useEffect(() => {
    getWeather("colombia").then((data) => changeWeather(data));
    getForecast("colombia").then((data) => changeForecast(data));
  }, []);

  return (
    <main className="md:flex max-w-8xl mx-auto w-[100%]">
      <section className="w-[100%] md:fixed md:top-0 md:bottom-0 md:left-0 md:w-[400px] relative h-[990px]">
        <Search inputSearch={inputSearch} cords={cords} />

        <article
          className="px-4 max-sm:py-[0] bg-blue-1 h-[860px] w-[100%] truncate max-sm:w-full sm:w-[100%] sm:h-[950px] md:h-screen "
        >
          <div className="flex flex-col items-center relative">
            <img
              className="w-[185px] absolute m-[35px] mt-[70px] sm:w-44 sm:h-44 sm:mt-[100px] max-sm:mt-[140px]"
              src={`/${weatherData.weather}.png`}
              alt={`/${weatherData.weather}`}
              style={{
                animation: "slideUpDown 3s ease-in-out infinite",
                transform: `translateY(${
                  weatherData.isImageGoingUp ? "20px" : "0"
                })`,
              }}
              onAnimationIteration={handleAnimationIteration}
            />
            <div
              className="w-[100%] absolute  max-sm:w-[1100px] max-sm:pl-[110px] sm:w-[850px] "
            >
              <img
                className="h-auto opacity-10 max-sm:h-[450px]  sm:w-[900px] md:w-[650px] md:h-[370px] md:ml-[85px] "
                src={backGNuves}
                alt=""
              />
            </div>
            <div
              className="absolute mt-5  sm:top-[400px] max-sm:top-[375px] md:top-[340px] ">
              <p className="text-[144px] font-medium ">
                {isFahrenheit
                  ? Math.floor(weatherData.temp * (9 / 5) + 32)
                  : weatherData.temp}
                <span className="text-gray-2 text-5xl ">
                  {isFahrenheit ? "°F" : "°C"}
                </span>
              </p>
              <div className="flex flex-col justify-center items-center ">
                <p className="text-gray-2 text-4xl font-semibold pb-12">
                  {weatherData.weather}
                </p>
                <div className="flex gap-4 text-gray-2  text-lg font-medium pb-6">
                  <span>Today</span>
                  <span>•</span>
                  <span>{weatherData.dateFormat}</span>
                </div>
                <div className="flex mt-[5px] gap-3 animate-bounce">
                  <LocationIcon />
                  <p className="text-gray-2 text-lg font-semibold">
                    {weatherData.locationName}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="md:flex-1 md:pl-[400px] md:m-20">
        <Temperatura changeF={changeF} changeC={changeC} />
        <Weak
          keys={keys}
          forecastData={forecastData}
          isFahrenheit={isFahrenheit}
        />
        <Hightlights weatherData={weatherData}
        isMph={isMph}
         />
        <footer className="text-sm font-medium text-center p-8 mt-14 ">
          created by <span className="font-bold">Rotsen C. Estefanel</span> -
          devChallenges.io
        </footer>
      </section>
    </main>
  );
}

export default App;
