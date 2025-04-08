const WeatherCard = ({ data }) => {
  const { name, main, weather, wind } = data;
  const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

  return (
    <div className="mt-8 w-full max-w-xl bg-green-200 dark:bg-blue-800 rounded-2xl shadow-lg p-8 text-center text-gray-800 dark:text-gray-100 transition-all duration-300">
      
      <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 drop-shadow-md">
        {name}
      </h2>

      <img
        src={iconUrl}
        alt="weather icon"
        className="mx-auto w-28 sm:w-32 drop-shadow-lg"
      />

      <p className="text-5xl font-extrabold text-blue-700 dark:text-blue-400 my-4">
        {main.temp}°C
      </p>

      <p className="text-xl font-medium mb-6">
        Weather Condition:{" "}
        <span className="font-semibold">{weather[0].main}</span>
      </p>

      <div className="grid grid-cols-2 gap-6 mt-4 text-sm sm:text-base">
        <div className="bg-white/40 dark:bg-white/10 p-4 rounded-xl shadow-sm">
          <p className="font-semibold mb-1">Humidity</p>
          <p className="text-lg font-medium">{main.humidity}%</p>
        </div>
        <div className="bg-white/40 dark:bg-white/10 p-4 rounded-xl shadow-sm">
          <p className="font-semibold mb-1">Wind Speed</p>
          <p className="text-lg font-medium">{wind.speed} km/h</p>
        </div>
      </div>
    </div>
  );
};

export default WeatherCard;
