import './App.css';
import React, { useEffect, useState } from 'react';
import CurrencyRow from './CurrencyRow';

const host = 'api.frankfurter.app'
const BASE_URL = `https://${host}/latest?from=USD`

function App() {
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [fromCurrency, setFromCurrency] = useState()
  const [toCurrency, setToCurrency] = useState()
  const [exchangeRate, setExchangeRate] = useState()
  const [amount, setAmount] = useState(1)
  const [amountInFromCurrency, setAmountInFromCurrency] = useState(true)
  const [usdExchangeRates, setUsdExchangeRates] = useState()

  let toAmount, fromAmount
  if(amountInFromCurrency) {
    fromAmount = amount
    toAmount = (Math.floor((amount * exchangeRate) * 100)) / 100
  } else {
    toAmount = amount
    fromAmount = (amount / exchangeRate).toFixed(2)
  }
  
  useEffect(() => {
    fetch(BASE_URL)
    .then(res => res.json())
    .then(data => {
      const rates = data.rates
      rates.USD = 1
      const firstCurrency = Object.keys(data.rates)[0]
      setCurrencyOptions([data.base, ...Object.keys(data.rates)])
      setFromCurrency(data.base)
      setToCurrency(firstCurrency)
      setExchangeRate(data.rates[firstCurrency])
      setUsdExchangeRates (rates)
    }) 
  }, [])

  useEffect(() => {
    if (fromCurrency != null && toCurrency != null) {
      let curRate = usdExchangeRates[toCurrency] / usdExchangeRates[fromCurrency]
      setExchangeRate(curRate)
    }
  }, [fromCurrency, toCurrency])

  function handleFromAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e) {
    setAmount(e.target.value)
    setAmountInFromCurrency(false)
  }

  return (
    <>
   <h1>Convert</h1>
   <CurrencyRow 
   currencyOptions={currencyOptions} 
   selectedCurrency={fromCurrency}
   onChangeCurrency={e => setFromCurrency(e.target.value)}
   onChangeAmount={handleFromAmountChange}
   amount={fromAmount}
   />
   <div className='equals'>=</div>
   <CurrencyRow
   currencyOptions={currencyOptions} 
   selectedCurrency={toCurrency}
   onChangeCurrency={e => setToCurrency(e.target.value)}
   amount={toAmount}
   onChangeAmount={handleToAmountChange}
   />
   </>
  );
}

export default App;
