const frmCurrencies = document.querySelector('#frmCurrencies');
const parMessage = document.querySelector('#parMessage');
const selFrom = document.querySelector('#selFrom');
const selTo = document.querySelector('#selTo');
const fetchOptions = {
   method: 'GET',
   headers: {
      'X-RapidAPI-Key': '8bd0826a8amshbaea6ec7ea515adp113f6fjsn7d54754923df',
      'X-RapidAPI-Host': 'currency-exchange.p.rapidapi.com'
   }
};

// get an array of all available currencies
async function getAllCurrencies() {
   // build request
   const url = 'https://currency-exchange.p.rapidapi.com/listquotes';

   // fetch
   const resp = await fetch(url, fetchOptions);
   if (!resp.ok) {
      console.log('opvragen lijst munten mislukt');
      return;
   }

   // get json data
   const data = await resp.json();

   // return data
   return data;
}

// get the exchange rate for two currencies
async function getExchangeRate(curr1, curr2) {
   // build request
   const params = new URLSearchParams();
   params.append('from', curr1); 
   params.append('to', curr2); 
   const url = `https://currency-exchange.p.rapidapi.com/exchange?${params.toString()}`;

   // fetch
   const resp = await fetch(url, fetchOptions);
   if (!resp.ok) {
      console.log('opvragen wisselkoers mislukt');
      return;
   }

   // get json data
   const data = await resp.json();

   // return data
   return data;
}

// populate dropdowns
async function startApp() {
   const currencies = await getAllCurrencies();
   currencies.sort().forEach(curr => {
      selFrom.innerHTML += `<option>${curr}</option>`;
      selTo.innerHTML += `<option>${curr}</option>`;
   });
   frmCurrencies.classList.remove('hide');
   selFrom.value = 'EUR';
   selTo.value = 'USD';
   parMessage.innerHTML = 'selecteer twee munten...';
}

// handle form submits
frmCurrencies.addEventListener('submit', async function(e) {
   e.preventDefault();
   const rate = await getExchangeRate(selFrom.value, selTo.value);
   parMessage.innerHTML = `1 ${selFrom.value} = ${rate} ${selTo.value}`;
});

// start your engines
startApp();
