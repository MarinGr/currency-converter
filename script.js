const message = document.querySelector(".rate-info-message");
const inputFields = document.querySelectorAll(".input-amount");
const fromSelector = document.querySelector(".from-selector");
const toSelector = document.querySelector(".to-selector");
const currencySelectors = document.querySelectorAll(".currency-selector");
const flags = document.querySelectorAll(".flag");
const exchangeIcon = document.querySelector(".exchange-icon");
const fromAmount = document.getElementById("from");
const toAmount = document.getElementById("to");
let api;

document.addEventListener("DOMContentLoaded", populateSelect);

function populateSelect() {
  fetch("currencies.json")
    .then((res) => res.json())
    .then((data) => {
      const currencyCodes = Object.keys(data);

      currencySelectors.forEach((selector) => {
        for (element of currencyCodes) {
          const option = document.createElement("option");
          option.innerText = element;
          option.value = element;
          selector.appendChild(option);
        }
      });

      fromSelector.value = "USD";
      toSelector.value = "RUB";
    });
}

inputFields.forEach((input) => input.addEventListener("input", numericOnly));

function numericOnly(e) {
  this.value = this.value.replace(/\D/g, "");
}

inputFields.forEach((input) => {
  input.addEventListener("input", chooseStartInput);
});

function chooseStartInput(e) {
  if (e.target == fromAmount) {
    const from = document.querySelector(".from-selector").value;
    const to = document.querySelector(".to-selector").value;
    const amount = e.target.value;
    const outputField = document.getElementById("to");
    convertCurrencies(from, to, amount, outputField);
  } else {
    const from = document.querySelector(".to-selector").value;
    const to = document.querySelector(".from-selector").value;
    const amount = e.target.value;
    const outputField = document.getElementById("from");
    convertCurrencies(from, to, amount, outputField);
  }
}

function convertCurrencies(from, to, amount, outputField) {
  api = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;

  fetch(api)
    .then((res) => res.json())
    .then((data) => {
      displayRate(data, outputField);
      displayMessage(data);
    })
    .catch((err) => displayError());
}

function displayRate(data, outputField) {
  if (data.query.from == data.query.to) {
    outputField.value = data.result.toFixed();
  } else {
    outputField.value = data.result.toFixed(2);
  }
}

function displayMessage(data) {
  message.classList.remove("error-message");
  message.classList.add("rate-info-message");
  message.style.display = "block";

  if (data.query.from == data.query.to) {
    message.innerText = `1 ${data.query.from} = ${data.info.rate.toFixed()} ${
      data.query.to
    }`;
  } else {
    message.innerText = `1 ${data.query.from} = ${data.info.rate.toFixed(2)} ${
      data.query.to
    }`;
  }
}

function displayError() {
  message.classList.remove(".rate-info-message");
  message.classList.add("error-message");
  message.innerText =
    "Unable to convert. Please check your internet connection and try again.";
}

currencySelectors.forEach((selector) =>
  selector.addEventListener("change", getCurrencyCode)
);

function getCurrencyCode(e) {
  const currencyCode = e.target.options[e.target.selectedIndex].text;
  refreshCalculations(e);
  return currencyCode;
}

function refreshCalculations() {
  const event = new Event("input");
  fromAmount.dispatchEvent(event);
}

exchangeIcon.addEventListener("click", swapCurrencies);

function swapCurrencies() {
  const temp = fromSelector.value;
  fromSelector.value = toSelector.value;
  toSelector.value = temp;
  refreshCalculations();
}

currencySelectors.forEach((selector) => {
  selector.addEventListener("focus", focusOnInput);
});

function focusOnInput(e) {
  const connectedInput = e.target.previousElementSibling;
  connectedInput.focus();
}
