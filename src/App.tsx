import React, { FormEvent, useState } from 'react'
import './App.css'
import { api } from './services/api'
import { FaTemperatureHigh, FaThermometer, FaWind } from 'react-icons/fa'

type CurrentWeather = "Partly cloudy" | "Clear"

type Forecast = {
  day: number
  temperature: string
  wind: string
}

interface IWeatherData {
  temperature: string
  wind: string
  description: CurrentWeather
  forecast: Forecast[]
}

function App() {
  const [search, setSearch] = useState('')
  const [city, setCity] = useState('')
  const [weatherData, setWeatherData] = useState<IWeatherData>({} as IWeatherData)
  const currentDate = new Date()

  async function handleSearchCity(event: FormEvent) {
    event.preventDefault()

    const response = await api.get<IWeatherData>(search)

    if (response.data) {
      const weather = response.data

      const { temperature } = weather

      weather.temperature = temperature.split('+').pop() as string

      weather.forecast = weather.forecast.map(day => (
        {...day, temperature: day.temperature.split('+').pop() as string })
      )

      setCity(search)
      setWeatherData(weather)
    }
  }

  return (
    <div className="App">
      <header>
        <form onSubmit={handleSearchCity}>
          <input 
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
          />

          <button type="submit">pesquisar</button>
        </form>
      </header>

      {weatherData && 
        <main>
          <h1>{city}</h1>

          <section className="current-weather">
            <h2>Informações Meteorológicas</h2>
            <p>{weatherData.temperature}</p>
            <p>{weatherData.description}</p>
          </section>

          <section className="forecast">
            <h2>Previsão</h2>
            <ul>
            {weatherData.forecast &&
              weatherData.forecast.map((day, index) => 
                <li>
                  <h3>{index === 0 ? 
                  'Amanhã' 
                  : Intl.DateTimeFormat(
                    'pt-br', {weekday: 'long'}
                    ).format(new Date().setDate(currentDate.getDate() + index + 1))}</h3>

                  <div>
                    <FaTemperatureHigh />
                    <p>{day.temperature}</p>
                  </div>

                  <div>
                    <FaWind />
                    <p>{day.wind}</p>
                  </div>
                </li>
            )}
              </ul>
          </section>
        </main>
      }
    </div>
  )
}

export default App
