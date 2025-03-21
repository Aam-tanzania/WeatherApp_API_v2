import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = '8b2a37cbf269a57286a4df8eb388260b';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';

const HomeScreen = () => {
  const [city, setCity] = useState('Mbeya');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather('Mbeya');
  }, []);

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) {
      setError('Please enter a city name.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(WEATHER_URL, {
        params: {
          q: cityName,
          units: 'metric',
          appid: API_KEY,
        },
      });
      setWeatherData(response.data);
    } catch (error) {
      setError('City not found. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#E0F2FE', '#B3E5FC']} style={styles.container}>
      <Text style={styles.title}>WeatherWise 🌦️</Text>

      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#888" style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Enter city..."
          placeholderTextColor="#888"
          value={city}
          onChangeText={setCity}
        />
        <TouchableOpacity style={styles.button} onPress={() => fetchWeather(city)}>
          <Text style={styles.buttonText}>Go</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007BFF" />
        </View>
      )}
      {error && <Text style={styles.error}>{error}</Text>}

      {weatherData && (
        <View style={styles.contentContainer}>
          <View style={styles.weatherCard}>
            <Text style={styles.city}>{weatherData.name}, {weatherData.sys.country}</Text>
            <Text style={styles.temperature}>{Math.round(weatherData.main.temp)}°C</Text>
            <Text style={styles.condition}>{weatherData.weather[0].description}</Text>
            <Image style={styles.icon} source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png` }} />

            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="water-percent" size={24} color="#007BFF" />
                <Text style={styles.detail}>Humidity: {weatherData.main.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="wind-turbine" size={24} color="#007BFF" />
                <Text style={styles.detail}>Wind: {weatherData.wind.speed} m/s</Text>
              </View>
              <View style={styles.detailItem}>
                <MaterialCommunityIcons name="weather-rainy" size={24} color="#007BFF" />
                <Text style={styles.detail}>Rain: {weatherData.rain ? `${weatherData.rain['1h']} mm` : '0 mm'}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#333'
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  city: {
    fontSize: 22,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  temperature: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#007BFF',
    marginVertical: 10,
  },
  condition: {
    fontSize: 16,
    color: '#555',
    marginBottom: 15,
  },
  icon: {
    width: 80,
    height: 80,
  },
  detailsGrid: {
    width: '100%',
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
  },
  detail: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default HomeScreen;