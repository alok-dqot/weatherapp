import { useState } from 'react'
import './App.css'

import {
  Cloud, Sun, CloudRain, Wind, Thermometer,
  Droplets, Timer, Search, Brain,
  Globe, Book, ArrowRight
} from 'lucide-react'
function App() {
  return (
    <>
      <WeatherDashboard />
    </>
  )
}
export default App

const WeatherDashboard = () => {
  const [location, setLocation] = useState('');
  const [activeTab, setActiveTab] = useState('weather');
  const [showAIPredictor, setShowAIPredictor] = useState(false);
  const [loading, setLoading] = useState(false);


  const weatherData = {
    current: {
      temp: 22,
      humidity: 65,
      windSpeed: 12,
      condition: 'Partly Cloudy',
      feelsLike: 24,
      pressure: 1015,
      visibility: 10,
      uvIndex: 5
    },
    forecast: [
      { day: 'Mon', temp: 23, condition: 'Sunny', precipitation: 0 },
      { day: 'Tue', temp: 21, condition: 'Cloudy', precipitation: 20 },
      { day: 'Wed', temp: 20, condition: 'Rain', precipitation: 80 },
      { day: 'Thu', temp: 22, condition: 'Partly Cloudy', precipitation: 30 },
      { day: 'Fri', temp: 24, condition: 'Sunny', precipitation: 0 }
    ],
    aiPrediction: {
      summary: "Based on current patterns, expect a mild week with increasing humidity. Perfect conditions for outdoor activities on Monday and Friday.",
      recommendations: [
        "Best time for outdoor activities: Monday morning",
        "Carry an umbrella on Wednesday",
        "Good week for garden maintenance"
      ]
    },
    recentBlogs: [
      {
        title: "Understanding Weather Patterns",
        excerpt: "Learn how to read weather signs in nature...",
        author: "Dr. Weather",
        readTime: "5 min"
      },
      {
        title: "Climate Change Effects",
        excerpt: "How global warming affects your local weather...",
        author: "Climate Expert",
        readTime: "7 min"
      }
    ]
  };

  const getWeatherIcon = (condition: any) => {
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

  const WeatherMetric = ({ icon: Icon, title, value, color }: any) => (
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

  const TabButton = ({ icon: Icon, label, active }: any) => (
    <button
      onClick={() => setActiveTab(label.toLowerCase())}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
        ${active ? 'bg-blue-500 text-white' : 'hover:bg-blue-100'}`}
    >
      <Icon className="w-5 h-5" />
      {label}
    </button>
  );

  const BlogCard = ({ blog }: any) => (
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
        <p className="mb-4">{weatherData.aiPrediction.summary}</p>
        <div className="space-y-2">
          {weatherData.aiPrediction.recommendations.map((rec, index) => (
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
            placeholder="Enter location or coordinates..."
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

        {activeTab === 'weather' && (
          <div className="space-y-6 animate-fade-in">

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <WeatherMetric
                icon={Thermometer}
                title="Temperature"
                value={`${weatherData.current.temp}°C`}
                color="from-orange-400 to-red-500"
              />
              <WeatherMetric
                icon={Wind}
                title="Wind Speed"
                value={`${weatherData.current.windSpeed} km/h`}
                color="from-blue-400 to-blue-600"
              />
              <WeatherMetric
                icon={Droplets}
                title="Humidity"
                value={`${weatherData.current.humidity}%`}
                color="from-green-400 to-green-600"
              />
              <WeatherMetric
                icon={Timer}
                title="Pressure"
                value={`${weatherData.current.pressure} hPa`}
                color="from-purple-400 to-purple-600"
              />
            </div>


            <Card className="p-6">
              <CardHeader>
                <CardTitle>5-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {weatherData.forecast.map((day, index) => (
                    <div key={index} className="text-center p-4 rounded-lg bg-gradient-to-b from-white to-blue-50 hover:shadow-lg transition-all duration-300">
                      <div className="font-bold mb-2">{day.day}</div>
                      <div className="flex justify-center mb-2">
                        {getWeatherIcon(day.condition)}
                      </div>
                      <div className="text-xl font-bold">{day.temp}°C</div>
                      <div className="text-sm text-gray-500">{day.condition}</div>
                      <div className="text-sm text-blue-500">{day.precipitation}% rain</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="space-y-6 animate-fade-in">
            <AIPredictor />
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="grid gap-6 md:grid-cols-2 animate-fade-in">
            {weatherData.recentBlogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} />
            ))}
          </div>
        )}

        {activeTab === 'map' && (
          <Card className="p-4 h-[400px] flex items-center justify-center">
            <p className="text-gray-500">Interactive weather map would be implemented here</p>
          </Card>
        )}
      </div>
    </div>
  );
};

// Add some global styles
const style = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`;


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