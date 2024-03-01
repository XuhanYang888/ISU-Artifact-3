var simpleInterest = true;

var simpleInterestRadio = document.getElementById('simpleInterest');
simpleInterestRadio.addEventListener('change', function () {
	if (this.checked) {
		simpleInterest = true;
	}
});

var compoundInterestRadio = document.getElementById('compoundInterest');
compoundInterestRadio.addEventListener('change', function () {
	if (this.checked) {
		simpleInterest = false;
	}
});

function calculateInterest() {
	if (simpleInterest) {
		document.getElementById("simpleError").innerHTML = "<p style='color: green;'>✓</p>";
		document.getElementById("compoundError").innerHTML = "<p></p>";
	} else {
		document.getElementById("compoundError").innerHTML = "<p style='color: green;'>✓</p>";
		document.getElementById("simpleError").innerHTML = "<p></p>";
	}


	var principal = Number(document.getElementById('principalAmount').value);
	var principalValid = false;
	if (isNaN(principal) || principal < 0.01 || (principal).toFixed(2) != principal) {
		text = "<p style='color: red;'>✗</p>";
		principalValid = false;
	} else {
		text = "<p style='color: green;'>✓</p>";
		principalValid = true;
	}
	document.getElementById("principalError").innerHTML = text;


	var rate = Number(document.getElementById('interestRate').value);
	var rateValid = false;
	if (isNaN(rate) || rate < 0.01 || (rate).toFixed(2) != rate) {
		text = "<p style='color: red;'>✗</p>";
		rateValid = false;
	} else {
		text = "<p style='color: green;'>✓</p>";
		rateValid = true;
	}
	document.getElementById("rateError").innerHTML = text;



	var freq = document.getElementById('interestFreq').value;
	document.getElementById("freqError").innerHTML = "<p style='color: green;'>✓</p>";



	var duration = Number(document.getElementById('duration').value);
	var durationValid = false;
	if (isNaN(duration) || duration < 1 || duration > 100 || Math.round(duration) != duration) {
		text = "<p style='color: red;'>✗</p>";
		durationValid = false;
	} else {
		text = "<p style='color: green;'>✓</p>";
		durationValid = true;
	}
	document.getElementById("durationError").innerHTML = text;



	const timesPerYear = {"Annually" : 1,"Semiannually" : 2,"Quarterly" : 4,"Monthly" : 12};
	var times = duration * timesPerYear[freq];


	if (principalValid && rateValid && durationValid) {
		rate = rate / 100;
		var output = "<table class='resultTable'><tr><th>Year</th><th>Interest</th><th>Total Amount</th></tr>";
		if (simpleInterest) {
			for (var i = timesPerYear[freq]; i <= times; i+=timesPerYear[freq]) {
				var total = principal + principal * rate * i;
				var year = Math.ceil(i / timesPerYear[freq]);
				output += "<tr><td style='text-align: center;'>" + year + "</td>";
				output += "<td style='text-align: right;'>$" + (principal * rate * timesPerYear[freq]).toFixed(2) + "</td>";
				output += "<td style='text-align: right;'>$" + total.toFixed(2) + "</td></tr>";
			}
		} else {
			for (var i = timesPerYear[freq]; i <= times; i+=timesPerYear[freq]) {
				var total = principal * (1 + rate) ** i;
				var year = Math.ceil(i / timesPerYear[freq]);
				output += "<tr><td style='text-align: center;'>" + year + "</td>";
				output += "<td style='text-align: right;'>$" + (principal * (1 + rate) ** i - principal * (1 + rate) ** (i-timesPerYear[freq])).toFixed(2) + "</td>";
				output += "<td style='text-align: right;'>$" + total.toFixed(2) + "</td></tr>";
			}
		}
		output += "</table>";
	} else {
		var output = "<p>Invalid Inputs</p>"
	}

	document.getElementById('results').innerHTML = output;

}


// Define a data structure to store currency rates with USD as base currency
let currencyRates = {
	"USD": 1,
	"EUR": null,
	"JPY": null,
	"GBP": null,
	"CNY": null,
	"AUD": null,
	"CAD": null, 
	"CHF": null,
	"HKD": null,
	"SGD": null,
	"SEK": null,
	"KRW": null,
	"NOK": null,
	"NZD": null,
	"INR": null,
	"MXN": null,
	"TWD": null,
	"ZAR": null,
	"BRL": null,
	"DKK": null,
	// Add other currencies here
};

// Dictionary mapping currency codes to their full names
const currencyNames = {
  "USD": "United States Dollar",
  "EUR": "Euro",
  "JPY": "Japanese Yen",
  "GBP": "British Pound Sterling",
  "AUD": "Australian Dollar",
  "CAD": "Canadian Dollar",
  "CHF": "Swiss Franc",
  "CNY": "Chinese Yuan",
  "HKD": "Hong Kong Dollar",
  "NZD": "New Zealand Dollar",
  "SEK": "Swedish Krona",
  "KRW": "South Korean Won",
  "SGD": "Singapore Dollar",
  "NOK": "Norwegian Krone",
  "MXN": "Mexican Peso",
  "INR": "Indian Rupee",
  "RUB": "Russian Ruble",
  "ZAR": "South African Rand",
  "BRL": "Brazilian Real",
  "TRY": "Turkish Lira",
  "TWD": "New Taiwan Dollar",
  "DKK": "Danish Krone"
  // Add more currencies as needed
};

// Function to fetch currency rates
async function fetchCurrencyRates(baseCurrency) {
	const apiKey = 'ec0fca6954d14623b025324388e9ad98'; // Replace 'YOUR_API_KEY' with your actual API key
	const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}`;

	try {
		const response = await fetch(apiUrl + `?apikey=${apiKey}`);
		const data = await response.json();
		return data.rates;
	} catch (error) {
		console.error('Error fetching currency rates:', error);
	}
}

// Function to update the currency rates data structure
async function updateCurrencyRatesDataStructure() {
	const baseCurrency = 'USD'; // Fixed base currency
	const rates = await fetchCurrencyRates(baseCurrency);

	if (rates) {
		for (const currency in currencyRates) {
			currencyRates[currency] = rates[currency];
		}
	}
}

// Call the function to update the currency rates data structure immediately
updateCurrencyRatesDataStructure();

// Set interval to update the currency rates data structure every hour
setInterval(updateCurrencyRatesDataStructure, 3600000); // 3600000 milliseconds = 1 hour

console.log("Currency Rates:");
for (const currency in currencyRates) {
	console.log(`${currency}: ${currencyRates[currency]}`);
}

// Function to populate dropdown with currencies
function populateDropdowns() {
  const dropdown1 = document.getElementById("currencyDropdown1");
  const dropdown2 = document.getElementById("currencyDropdown2");
  dropdown1.innerHTML = ""; // Clear existing options
  dropdown2.innerHTML = ""; // Clear existing options

  for (const currency in currencyRates) {
	const option1 = document.createElement("option");
	const option2 = document.createElement("option");

	option1.value = currency;
	option1.text = `${currencyNames[currency]} - ${currency}  `;

	option2.value = currency;
	option2.text = `${currencyNames[currency]} - ${currency}  `;

	dropdown1.appendChild(option1);
	dropdown2.appendChild(option2);
  }
}

// Call function to populate dropdowns initially
populateDropdowns();

// Attach event listeners for currency dropdowns after populating them
document.getElementById("currencyDropdown1").addEventListener("change", function() {
  calculateCurrencyAmount("currencyAmount1", "currencyDropdown1", "currencyDropdown2");
});
document.getElementById("currencyDropdown2").addEventListener("change", function() {
  calculateCurrencyAmount("currencyAmount2", "currencyDropdown1", "currencyDropdown2");
});

// Function to add trailing zeros to a number
function addTrailingZeros(input) {
	if (input.value === '') return; // If input is empty, do nothing
	const floatValue = parseFloat(input.value); // Parse input value to float
	if (!isNaN(floatValue)) {
		input.value = floatValue.toFixed(2); // Set value with 2 decimal places
	}
}

// Function to calculate currency amount based on exchange rate and currencies
function calculateCurrencyAmount(inputId, dropdown1Id, dropdown2Id) {
	const input = document.getElementById(inputId);
	const dropdown1 = document.getElementById(dropdown1Id);
	const dropdown2 = document.getElementById(dropdown2Id);
	const rate1 = currencyRates[dropdown1.value];
	const rate2 = currencyRates[dropdown2.value];

	// Calculate corresponding value for the other input
	if (inputId === "currencyAmount1" && rate1 && rate2) {
		const calculatedAmount = parseFloat(input.value) * (1 / rate1) * rate2;
		document.getElementById("currencyAmount2").value = calculatedAmount.toFixed(2);
	} else if (inputId === "currencyAmount2" && rate1 && rate2) {
		const calculatedAmount = parseFloat(input.value) * (1 / rate2) * rate1;
		document.getElementById("currencyAmount1").value = calculatedAmount.toFixed(2);
	}
}

// Get all number input elements
const numberInputs = document.querySelectorAll(".number-input");

// Add event listener for input event to each input
numberInputs.forEach(function(input) {
	input.addEventListener("input", function() {
		if (this.id === "currencyAmount1") {
			calculateCurrencyAmount("currencyAmount1", "currencyDropdown1", "currencyDropdown2");
		} else if (this.id === "currencyAmount2") {
			calculateCurrencyAmount("currencyAmount2", "currencyDropdown1", "currencyDropdown2");
		}
	});
	input.addEventListener("blur", function() {
		addTrailingZeros(this); // Call addTrailingZeros function passing the input element
	});
});
