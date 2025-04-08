// components/ForecastCard.jsx
const ForecastCard = ({ forecast }) => {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-6 w-full">
        {forecast.map((day, idx) => (
          <div key={idx} className="bg-white/20 dark:bg-white/10 p-4 rounded-xl text-center shadow-md">
            <p className="font-semibold text-white dark:text-gray-100">{day.date}</p>
            <img src={`https://openweathermap.org/img/wn/${day.icon}@2x.png`} alt="weather icon" className="mx-auto" />
            <p className="text-blue-700 dark:text-blue-300 font-bold">{day.temp}°C</p>
            <p className="text-sm text-white dark:text-gray-300">{day.weather}</p>
          </div>
        ))}
      </div>
    );
  };
  
  export default ForecastCard;
  