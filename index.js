var axios = require('axios')
require('dotenv').config()

const getExchangeRate = async (from, to) => {
  try {
    const { data: { rates } } = await axios.get(`${process.env.fixerUrl}/latest?access_key=${process.env.fixerApiKey}&format=1`)
    const euro = 1 / rates[from]
    const rate = euro * rates[to]
    if (isNaN(rate)) {
      throw new Error()
    }
    return rate
  } catch (e) {
    throw new Error(`Unable to get exchange rate for ${from} and ${to}`)
  }
}

const getCountries = async (curencyValue) => {
  try {
    const { data } = await axios.get(`${process.env.restCountriesUrl}/${curencyValue}`)
    return data.map(country => country.name)
  } catch (error) {
    throw new Error(`Unable to get countries that use ${curencyValue}`)
  }
}

const convertCurrency = async (from, to, amount) => {
  const rate = await getExchangeRate(from, to)
  const countries = await getCountries(to)
  const finalRate = (amount * rate).toFixed(2)
  return `${amount} ${from} is worth ${finalRate} ${to}. You can spend these in the following countries: ${countries}`
}

convertCurrency('USD', 'CAD', 20)
  .then(response => console.log(response))
  .catch(e => console.log(e.message))
