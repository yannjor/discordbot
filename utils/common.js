const axios = require("axios").default;
var xml2js = require("xml2js");
const { join } = require("path");
const { readdirSync, statSync } = require("fs");

const getRedditPost = async (sub, top, limit) => {
  const redditUrl = `https://www.reddit.com/r/${sub}.json?limit=${limit}&sort=top&t=${top}`;
  try {
    const { data } = await axios.get(redditUrl);
    const redditData = data.data;
    const children = redditData.children;
    const len = redditData.dist - 1;
    const index = Math.floor(Math.random() * len + 1);
    if (children.length > 1) {
      const post = children[index]["data"];
      if (post.over_18) return "NSFW post";
      const msg = `${post["title"]}\n(r/${sub})\n${post["url"]}`;
      return msg;
    }
  } catch (err) {
    console.error(err);
  }
};

const getWeather = async (city, token) => {
  const openweatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${token}`;
  try {
    const { data } = await axios.get(openweatherUrl);
    return {
      country: data.sys.country,
      city: data.name,
      description: data.weather[0].description,
      icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      temp: (data.main.temp - 273.15).toFixed(2),
      wind: data.wind.speed,
      pressure: data.main.pressure,
      humidity: data.main.humidity
    };
  } catch (err) {
    console.error(err);
  }
};

const getCoronaStats = async (country) => {
  const coronaUrl = `https://api.covid19api.com/total/country/${country}`;
  try {
    const { data } = await axios.get(coronaUrl);
    const len = data.length;
    const latest = data[len - 1];
    const dayBefore = data[len - 2];
    const { Confirmed, Deaths, Recovered } = latest;
    return {
      ...latest,
      newCases: Confirmed - dayBefore.Confirmed,
      newDeaths: Deaths - dayBefore.Deaths,
      newRecovered: Recovered - dayBefore.Recovered
    };
  } catch (err) {
    console.error(err);
  }
};

const getUrbanDictionaryQuery = async (query) => {
  try {
    const { data } = await axios.get(
      `https://api.urbandictionary.com/v0/define?${query}`
    );
    return data.list;
  } catch (err) {
    console.error(err);
  }
};

const getMetarData = async (query) => {
  const url = `https://aviationweather.gov/adds/dataserver_current/httpparam?dataSource=metars&requestType=retrieve&format=xml&stationString=${query}&hoursBeforeNow=1`;
  try {
    const { data } = await axios.get(url);
    const { response } = await xml2js.parseStringPromise(data);
    return response;
  } catch (err) {
    console.error(err);
  }
};

// Adds spaces between thousands
const spaceNum = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// Functions to help with importing of command files
const getDirectories = (source) => {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const isCommandFile = (path) => {
  return statSync(path).isFile() && path.endsWith(".js");
};

const getCommandFiles = (path) => {
  return readdirSync(path)
    .map((name) => join(path, name))
    .filter(isCommandFile);
};

const getAllCommandFiles = (path) => {
  let dirs = getDirectories(path).map((name) => join(path, name));
  let files = dirs
    .map((dir) => getAllCommandFiles(dir))
    .reduce((a, b) => a.concat(b), []);
  return files.concat(getCommandFiles(path)).map((file) => "./".concat(file));
};

module.exports = {
  getMetarData,
  getRedditPost,
  getWeather,
  getCoronaStats,
  getUrbanDictionaryQuery,
  spaceNum,
  getAllCommandFiles
};
