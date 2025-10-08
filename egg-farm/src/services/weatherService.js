// Weather service for fetching real-time weather data
class WeatherService {
  constructor() {
    this.baseUrl = 'https://wttr.in';
    this.city = 'Kuliyapitiya';
    this.country = 'Sri%20Lanka';
  }

  // Fetch current weather data
  async getCurrentWeather() {
    try {
      const url = `${this.baseUrl}/${this.city},${this.country}?format=j1&lang=en`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseWeatherData(data);
    } catch (error) {
      console.warn('Weather API failed:', error);
      return this.getFallbackWeatherData();
    }
  }

  // Parse weather data from API response
  parseWeatherData(data) {
    const current = data.current_condition[0];
    
    return {
      temperature: parseInt(current.temp_C),
      humidity: parseInt(current.humidity),
      pressure: Math.round(parseFloat(current.pressure)),
      description: current.weatherDesc[0].value,
      windSpeed: parseFloat(current.windspeedKmph) / 3.6, // Convert km/h to m/s
      visibility: parseInt(current.visibility),
      lastUpdated: new Date().toISOString(),
      source: 'wttr.in',
      impact: this.calculateProductionImpact({
        temp: parseFloat(current.temp_C),
        humidity: parseInt(current.humidity),
        pressure: parseFloat(current.pressure)
      })
    };
  }

  // Calculate impact on egg production
  calculateProductionImpact(weatherData) {
    const { temp, humidity, pressure } = weatherData;
    
    // Optimal conditions for egg production: 20-25°C, 50-70% humidity
    if (temp >= 20 && temp <= 25 && humidity >= 50 && humidity <= 70) {
      return 'positive';
    } else if (temp > 30 || temp < 15 || humidity > 80 || humidity < 40) {
      return 'negative';
    }
    
    return 'neutral';
  }

  // Generate fallback weather data for Kuliyapitiya, Sri Lanka
  getFallbackWeatherData() {
    const now = new Date();
    const hour = now.getHours();
    
    // Simulate realistic weather for Sri Lanka
    const baseTemp = 28; // Base temperature for Sri Lanka
    const tempVariation = Math.sin((hour - 6) * Math.PI / 12) * 4; // Daily temperature cycle
    const temperature = Math.round(baseTemp + tempVariation + (Math.random() - 0.5) * 2);
    
    const humidity = Math.round(65 + Math.sin(hour * Math.PI / 12) * 10 + (Math.random() - 0.5) * 10);
    const pressure = Math.round(1013 + (Math.random() - 0.5) * 10);
    
    return {
      temperature: temperature,
      humidity: Math.max(30, Math.min(90, humidity)),
      pressure: pressure,
      description: this.getWeatherDescription(temperature, humidity),
      windSpeed: Math.round(2 + Math.random() * 8),
      visibility: Math.round(8 + Math.random() * 4),
      lastUpdated: now.toISOString(),
      source: 'fallback',
      impact: this.calculateProductionImpact({
        temp: temperature,
        humidity: humidity,
        pressure: pressure
      })
    };
  }

  // Get weather description based on conditions
  getWeatherDescription(temp, humidity) {
    if (temp > 30) return 'Hot and sunny';
    if (temp < 20) return 'Cool and pleasant';
    if (humidity > 80) return 'Humid';
    if (humidity < 50) return 'Dry';
    return 'Pleasant';
  }

  // Get weather forecast for next 3 days
  async getWeatherForecast() {
    try {
      const url = `${this.baseUrl}/${this.city},${this.country}?format=j1&lang=en`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.parseForecastData(data);
    } catch (error) {
      console.warn('Weather forecast API failed:', error);
      return this.getFallbackForecastData();
    }
  }

  // Parse forecast data
  parseForecastData(data) {
    const forecast = [];
    
    for (let i = 0; i < 3; i++) {
      const day = data.weather[i];
      forecast.push({
        date: day.date,
        maxTemp: parseInt(day.maxtempC),
        minTemp: parseInt(day.mintempC),
        description: day.hourly[0].weatherDesc[0].value,
        humidity: parseInt(day.hourly[0].humidity),
        impact: this.calculateProductionImpact({
          temp: parseInt(day.maxtempC),
          humidity: parseInt(day.hourly[0].humidity),
          pressure: 1013
        })
      });
    }
    
    return forecast;
  }

  // Generate fallback forecast data
  getFallbackForecastData() {
    const forecast = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      const maxTemp = 28 + Math.floor(Math.random() * 6);
      const minTemp = maxTemp - 4 - Math.floor(Math.random() * 3);
      
      forecast.push({
        date: date.toISOString().split('T')[0],
        maxTemp: maxTemp,
        minTemp: minTemp,
        description: this.getWeatherDescription(maxTemp, 65),
        humidity: 60 + Math.floor(Math.random() * 20),
        impact: this.calculateProductionImpact({
          temp: maxTemp,
          humidity: 65,
          pressure: 1013
        })
      });
    }
    
    return forecast;
  }
}

// Create and export singleton instance
const weatherService = new WeatherService();
export default weatherService;

