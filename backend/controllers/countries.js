const axios = require('axios');

const REST_COUNTRIES_API = 'https://restcountries.com/v3.1/all';

const allCountries = require("./countries.json")

const dataProcessing = async (allCountries) =>{
    let i = 0
    let filteredData = await allCountries.map(country => {
        return {
            id: ++i,
            name: country.name.common,
            region: country.region,
            capital:country.capital && country.capital[0],
            timezones:country.timezones,
            code:country.flag
          }
    })

    console.log("filteredData", filteredData)
    return filteredData
    
}
// Get all countries
const getCountries = async (req, res) => {
    try{
        const response = await axios.get(REST_COUNTRIES_API);
        res.send(response["data"])
    }catch(e){
        if(e.code == "ECONNRESET"){
            let filteredData = await dataProcessing(allCountries)
            res.send(filteredData)
        }
    }  
};

// Get country by code
const getCountryByCode = async (req, res) => {
  const { code } = req.params;
  const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
  const country = response.data[0];
  res.json({
    name: country.name.common,
    region: country.region,
    capital:country.capital && country.capital[0],
    timezones:country.timezones,
    code:country.flag
  });
};

// Filter countries by region
const filterCountriesByRegion = async (req, res) => {
  const { region } = req.params;
  try{
    const response = await filterByRegion(region);
    res.send(response)
  }catch(e){
    if(e.code == "ECONNRESET"){
        const countries = allCountries.filter((country) => country.region === region);
        res.json(countries);
    }
  }
};

const filterByName = async (countryName) => {
    try{
      const response = await axios.get(`https://restcountries.com/v3.1/name/${countryName}`);
      return await dataProcessing(response.data)
    }catch(e){
        return e
    }
  };

  
const filterByRegion = async (region) => {
    try{
      const response = await axios.get(`https://restcountries.com/v3.1/region/${region}`);
      return await dataProcessing(response.data)
    }catch(e){
        return e
    }
  };

  
const filterByCapital = async (capital) => {
    try{
      const response = await axios.get(`https://restcountries.com/v3.1/capital/${capital}`);
      return await dataProcessing(response.data)
    }catch(e){
        return e
    }
  };


  
const filterByTimezone = async (capital) => {
    try{
      const response = await axios.get(`https://restcountries.com/v3.1/capital/${capital}`);
      return await dataProcessing(response.data)
    }catch(e){
        return e
    }
  };


// Get country by code
const filterByCode = async (code) => {
  try{
    const response = await axios.get(`https://restcountries.com/v3.1/alpha/${code}`);
    let result = await dataProcessing(response.data)
    return result
  }catch(e){
      return e
  }
};

const searchCountries = async (req, res) => {
    const { name, capital, region, timezone, code } = req.query;

    if (name) {
        res.send(await filterByName(name))
    }

    if (capital) {
        res.send(await filterByCapital(capital))
    }
    
    if (region) {
        res.send(await filterByRegion(region))
    }

    if (timezone) {
        res.send(await filterByTimezone(timezone))
    }

    if(code){
      res.send(await filterByCode(code))
    }


};

module.exports = {
  getCountries,
  getCountryByCode,
  filterCountriesByRegion,
  searchCountries
};
