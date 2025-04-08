import { useState, useEffect } from "react";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import { motion } from "framer-motion";

function App() {
  const [city, setCity] = useState("");
  const [apiData, setApiData] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [dark, setDark] = useState(true);

  const apiKey = import.meta.env.VITE_API_KEY;

  useEffect(() => {
    localStorage.setItem("weather-theme", dark ? "dark" : "light");
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [dark]);

  // Here I am using localhost to get the local history
  useEffect(() => {
    localStorage.setItem("weatherHistory", JSON.stringify(searchHistory));
  }, [searchHistory]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setApiData(null);
    setForecastData(null);
    setError("");

    try {
      //Here i am Fetching API
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`
      );
      const data = await res.json();

      if (data.cod !== 200) {
        setError(data.message);
      } else {
        setApiData(data);
        console.log(data); // Console log the api data which fetched to see output to fix my errors
        if (!searchHistory.includes(cityName)) {
          setSearchHistory((prev) =>
            [cityName, ...prev.filter((c) => c !== cityName)].slice(0, 5)
          );
        }
        fetchForecast(cityName);
      }
    } catch {
      setError("Failed to fetch data. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (cityName) => {
    try {
      const res =
        await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric
`);
      const data = await res.json();
      setForecastData(data);
    } catch {
      console.log("Forecast fetch failed");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city.trim());
    }
  };

  const getDailyForecast = () => {
    if (!forecastData || !forecastData.list) return [];

    const dailyData = forecastData.list.filter((item) =>
      item.dt_txt.includes("12:00:00")
    );

    return dailyData.map((item) => ({
      date: new Date(item.dt_txt).toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      temp: Math.round(item.main.temp),
      weather: item.weather[0].main,
      icon: item.weather[0].icon,
    }));
  };

  return (
    <div className={dark ? "dark w-full" : "w-full"}>
      <button
        onClick={() => setDark(!dark)}
        className="absolute top-4 right-4 text-2xl text-white dark:text-yellow-300 dark:bg-gray-600 bg-orange-800 rounded-full p-2"
      >
        {dark ? "🌙" : "☀️"}
      </button>

      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-orange-500 to-red-900 dark:from-gray-800 dark:via-gray-900 dark:to-black flex flex-col items-center justify-center px-4 py-8">
        <h5 className="text-xs font-thin mb-2 text-gray-900 dark:text-white self-baseline">
          Submitted by :- Rupesh Kumar (22051720)
        </h5>

        <div className="bg-white/20 dark:bg-white/10 backdrop-blur-sm p-8 sm:p-10 rounded-2xl shadow-lg w-full max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-bold font-mono text-gray-900 dark:text-gray-100 mb-6 text-center drop-shadow-md">
            Weather Dashboard
          </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name"
              className="w-full sm:w-auto flex-1 p-3 rounded-xl border border-gray-200 dark:border-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80 dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-300"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-300"
            >
              Search
            </button>
          </form>

          {searchHistory.length > 0 && (
            <div className="mt-6 text-white dark:text-gray-200 text-center">
              <h2 className="font-semibold mb-2 text-gray-900 dark:text-white">
                Recent Searches:
              </h2>
              <div className="flex gap-2 flex-wrap justify-center">
                {searchHistory.map((city, idx) => (
                  <button
                    key={idx}
                    onClick={() => fetchWeather(city)}
                    className="bg-white/30 dark:bg-white/20 px-4 py-2 rounded-full text-sm hover:bg-white/50 dark:hover:bg-white/30 transition"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {loading && (
          <div className="mt-6 animate-pulse text-white dark:text-gray-200 font-medium text-xl">
            Loading...
          </div>
        )}

        {
          //  Here i am handling errors
          error && (
            <p className="text-red-600 font-semibold mt-4 text-xl">{error}</p>
          )
        }

        {apiData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 w-full max-w-xl flex flex-col items-center justify-center"
          >
            <WeatherCard data={apiData} forecast={forecastData} />
            {forecastData && <ForecastCard forecast={getDailyForecast()} />}

            <button
              onClick={() => fetchWeather(apiData.name)}
              className="bg-blue-600 dark:bg-green-600 rounded-lg self-center p-4 mt-5 outline-none font-semibold text-white"
            >
              🔄 Refresh
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default App;
