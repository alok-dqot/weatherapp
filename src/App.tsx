import { useEffect, useState } from 'react';
import './App.css';

import {
  Cloud, Sun, CloudRain, Wind, Thermometer,
  Droplets, Timer, Search, Brain,
  Globe, Book, ArrowRight
} from 'lucide-react';
import axios from 'axios';
interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
    feelsLike: number;
    pressure: number;
    visibility: number;
    uvIndex: number;
  };
  forecast: {
    day: string;
    temp: number;
    condition: string;
    precipitation: number;
  }[];
  aiPrediction?: {
    summary: string;
    recommendations: string[];
  };
  recentBlogs?: {
    title: string;
    excerpt: string;
    author: string;
    readTime: string;
  }[];
}

function App() {
  return (
    <>
      <WeatherDashboard />
    </>
  );
}

export default App;

const WeatherDashboard = () => {
  const [location, setLocation] = useState<string>('');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [activeTab, setActiveTab] = useState<string>('weather');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const API_KEY = '75e731a704840da325abfb147b1e8be5';
  const BASE_URL = 'https://api.openweathermap.org/data/2.5';

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    try {
      const [currentResponse, forecastResponse] = await Promise.all([
        axios.get(`${BASE_URL}/weather`, {
          params: { q: location, appid: API_KEY, units: 'metric' }
        }),
        axios.get(`${BASE_URL}/forecast`, {
          params: { q: location, appid: API_KEY, units: 'metric' }
        })
      ]);

      const currentWeather = currentResponse.data;
      const forecast = forecastResponse.data.list.slice(0, 5).map((item: any) => ({
        day: new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'short' }),
        temp: item.main.temp,
        condition: item.weather[0].main,
        precipitation: item.pop * 100
      }));

      setWeatherData({
        current: {
          temp: currentWeather.main.temp,
          humidity: currentWeather.main.humidity,
          windSpeed: currentWeather.wind.speed,
          condition: currentWeather.weather[0].main,
          feelsLike: currentWeather.main.feels_like,
          pressure: currentWeather.main.pressure,
          visibility: currentWeather.visibility / 1000,
          uvIndex: 5 // placeholder, as this data may need an additional API call
        },
        forecast
      });
    } catch (error) {
      setError('Unable to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location) {
      fetchWeatherData();
    }
  }, [location]);

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
        return <Sun className="w-8 h-8 text-yellow-500 animate-pulse" />;
      case 'cloudy':
        return <Cloud className="w-8 h-8 text-gray-500 animate-bounce" />;
      case 'rain':
        return <CloudRain className="w-8 h-8 text-blue-500 animate-bounce" />;
      case 'partly cloudy':
        return <Cloud className="w-8 h-8 text-gray-400 animate-pulse" />;
      default:
        return <Sun className="w-8 h-8 text-yellow-500" />;
    }
  };

  interface WeatherMetricProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: string;
    color: string;
  }

  const WeatherMetric = ({ icon: Icon, title, value, color }: WeatherMetricProps) => (
    <Card className={`p-4 transition-transform duration-300 hover:scale-105 bg-gradient-to-br ${color}`}>
      <div className="flex items-center gap-2">
        <Icon className="w-6 h-6 text-white" />
        <div>
          <div className="text-sm text-white/80">{title}</div>
          <div className="text-xl font-bold text-white">{value}</div>
        </div>
      </div>
    </Card>
  );

  interface TabButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    active: boolean;
  }

  const TabButton = ({ icon: Icon, label, active }: TabButtonProps) => (
    <button
      onClick={() => setActiveTab(label.toLowerCase())}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
        ${active ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  interface BlogCardProps {
    blog: {
      title: string;
      excerpt: string;
      author: string;
      readTime: string;
    };
  }

  const BlogCard = ({ blog }: BlogCardProps) => (
    <Card className="p-4 hover:shadow-lg transition-shadow duration-300">
      <h3 className="font-bold text-lg mb-2">{blog.title}</h3>
      <p className="text-gray-600 mb-2">{blog.excerpt}</p>
      <div className="flex justify-between text-sm text-gray-500">
        <span>{blog.author}</span>
        <span>{blog.readTime}</span>
      </div>
    </Card>
  );

  const AIPredictor = () => (
    <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="w-6 h-6" />
          AI Weather Insights
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{weatherData?.aiPrediction?.summary}</p>
        <div className="space-y-2">
          {weatherData?.aiPrediction?.recommendations.map((rec, index) => (
            <div key={index} className="flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Smart Weather Forecast
          </h1>
          <p className="text-gray-600 mt-2">Powered by AI and Real-time Data</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Enter location..."
            className="w-full p-4 rounded-lg border shadow-sm pl-12 focus:ring-2 focus:ring-blue-500 transition-all duration-300"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Search className="absolute left-4 top-4 text-gray-400" />
        </div>

        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <TabButton icon={Cloud} label="Weather" active={activeTab === 'weather'} />
          <TabButton icon={Brain} label="AI" active={activeTab === 'ai'} />
          <TabButton icon={Book} label="Blog" active={activeTab === 'blog'} />
          <TabButton icon={Globe} label="Map" active={activeTab === 'map'} />
        </div>

        {activeTab === 'weather' && weatherData && (
          <div className="space-y-6 animate-fade-in">
            {loading && <p>Loading...</p>}
            {/* {error && <p className="text-red-500">{error}</p>} */}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <WeatherMetric icon={Thermometer} title="Temperature" value={`${weatherData.current.temp}°C`} color="from-orange-400 to-red-500" />
              <WeatherMetric icon={Wind} title="Wind Speed" value={`${weatherData.current.windSpeed} km/h`} color="from-blue-400 to-blue-600" />
              <WeatherMetric icon={Droplets} title="Humidity" value={`${weatherData.current.humidity}%`} color="from-green-400 to-green-600" />
              <WeatherMetric icon={Timer} title="Pressure" value={`${weatherData.current.pressure} hPa`} color="from-purple-400 to-purple-600" />
            </div>
          </div>
        )}

        {activeTab === 'ai' && <AIPredictor />}
        {activeTab === 'blog' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {weatherData?.recentBlogs?.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// const Card: React.FC<{ className?: string }> = ({ children, className }) => (
//   <div className={`rounded-lg shadow-md ${className}`}>
//     {children}
//   </div>
// );

// const CardHeader: React.FC = ({ children }) => (
//   <div className="mb-4">{children}</div>
// );

// const CardTitle: React.FC<{ className?: string }> = ({ children, className }) => (
//   <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
// );

// const CardContent: React.FC = ({ children }) => (
//   <div>{children}</div>
// );



export const Card = ({ className = '', children, ...props }: any) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardHeader = ({ className = '', children, ...props }: any) => (
  <div
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardTitle = ({ className = '', children, ...props }: any) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight ${className}`}
    {...props}
  >
    {children}
  </h3>
);

export const CardDescription = ({ className = '', children, ...props }: any) => (
  <p
    className={`text-sm text-muted-foreground ${className}`}
    {...props}
  >
    {children}
  </p>
);

export const CardContent = ({ className = '', children, ...props }: any) => (
  <div
    className={`p-6 pt-0 ${className}`}
    {...props}
  >
    {children}
  </div>
);

export const CardFooter = ({ className = '', children, ...props }: any) => (
  <div
    className={`flex items-center p-6 pt-0 ${className}`}
    {...props}
  >
    {children}
  </div>
);








