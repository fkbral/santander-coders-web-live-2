import axios from "axios";

export const api = axios.create({
  // baseURL: 'https://www.metaweather.com/api/',
  baseURL: 'https://goweather.herokuapp.com/weather/',
})