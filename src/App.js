import React, { useState, useEffect } from "react";
import './App.css';

const api = {
  key: "YOUR_API_KEY", 
  base: "https://api.openweathermap.org/data/2.5/"
}

const App = () => {
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState({});
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState("");

  useEffect(() => {
    if (listening) {
      startListening();
    } else {
      stopListening();
    }
  }, [listening]);

  useEffect(() => {
    if (transcript) {
      if (transcript.toLowerCase().includes("location")) {
        const location = transcript.split("location")[1].trim();
        setSearch(location);
        setListening(false);
        searchWeather(location);
      }
    }
  }, [transcript]);

  const searchPressed = () => {
    searchWeather(search);
  };

  const searchWeather = (location) => {
    fetch(`${api.base}weather?q=${location}&units=metric&APPID=${api.key}`)
      .then((res) => res.json())
      .then((result) => {
        setWeather(result);
      });
  };

  const startListening = () => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.continuous = true;
    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      setTranscript(event.results[last][0].transcript);
    };

    recognition.start();
  };

  const stopListening = () => {
    const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
    recognition.stop();
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Weather App</h1>

        <div>
          <input
            type="text"
            placeholder='Search City/Town...'
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={searchPressed}>Search</button>
        </div>

        {typeof weather.main !== "undefined" ? (
          <div>
            <p>{weather.name}</p>
            <p>{weather.main.temp}°C</p>
            <p>{weather.weather[0].main}</p>
            <p>({weather.weather[0].description})</p>
          </div>
        ) : (
          ""
        )}

        <div>
          <p>Microphone: {listening ? 'on' : 'off'}</p>
          <button onClick={() => setListening(true)}>Start</button>
          <button onClick={() => setListening(false)}>Stop</button>
          <button onClick={() => setTranscript("")}>Reset</button>
          <p>{transcript}</p>
        </div>
      </header>
    </div>
  );
};

export default App;
