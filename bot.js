const config = require('./config');
const axios = require('axios');
const fs = require('fs');
const translate = require('translate');

translate.engine = 'yandex';
translate.key = 'trnsl.1.1.20181230T193628Z.ca8bbd29a7bed7a3.6b8304b415776379682eb209649dace0498ac2fd';

const getWeather = async({ url, key, units }, city) => {
    try {
        const res = await axios(`${url}q=${city}&appid=${key}&units=${units}`);
        const weather = res.data;

        return weather;
    } catch (error) {
        console.error(error);
    }
}

const getText = async({ name, weather, main}) => {
    let text = `Cuaca sekarang di ${name} ${weather[0].main} dengan suhu ${main.temp} derajat celcius`;

    return text;
}

const translateText = async(text) => {
    const translatedText = await translate(text, { from: 'en', to: 'id'});

    console.log(translatedText);
}

const controlWeather = async(con) => {
    const cities = JSON.parse(fs.readFileSync('./city.json', 'utf8'));
    
    cities.forEach( async (city) => {
        const weather = await getWeather(con, city.name);
        console.log(weather);
    
        const text = await getText(weather);
        console.log(text);
    });
}

controlWeather(config);