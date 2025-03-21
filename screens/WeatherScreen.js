import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

const WeatherScreen = ({ route }) => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { latitude, longitude } = route.params;

  useEffect(() => {
    const fetchWeather = async () => {
      const url = 'https://api.open-meteo.com/v1/forecast';
      const params = {
        latitude: latitude,
        longitude: longitude,
        hourly: 'temperature_2m,precipitation,apparent_temperature',
        daily: 'temperature_2m_max',
        timezone: 'auto',
      };

      try {
        const response = await fetch(`${url}?${new URLSearchParams(params)}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weather Data</Text>
      <Text style={styles.subtitle}>Hourly Temperature:</Text>
      {weatherData.hourly.time.map((time, index) => (
        <Text key={index}>
          {new Date(time).toLocaleString()}: {weatherData.hourly.temperature_2m[index]}°C
        </Text>
      ))}
      <Text style={styles.subtitle}>Daily Max Temperature:</Text>
      {weatherData.daily.time.map((time, index) => (
        <Text key={index}>
          {new Date(time).toLocaleString()}: {weatherData.daily.temperature_2m_max[index]}°C
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default WeatherScreen;