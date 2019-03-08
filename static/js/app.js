// from data.js
var tableData = data;

/**
 * Function to populate HTML table with given dataset
 * @param {Array[Object]} dataset: the dataset to populate the table
 * @param {String} tag: the dataset to populate the table
 */
function populateTable(dataset, tag) {
  dataset.forEach((data) => {    
    var row = d3.select(tag).append("tr");
    Object.entries(data).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });
}

/**
 * Function to populate dropdown list with given values 
 * @param {Object} elem: the table element
 * @param {Array} dropdownValues: the array of values to populate the dropdown
 */
function populateDropdown(elem, dropdownValues) {
  dropdownValues.forEach((dropdown) => {
    var option = document.createElement("option");
    option.text = dropdown;
    option.value = dropdown;
    elem.add(option); 
  });
}

/**
 * Function to remove leading zeros from a date string.
 * Example: input 01/01/2018, output 1/1/2018 
 * @param {String} dateInput, the date string to convert 
 */
function convertDate (dateInput) {
  var tokens = dateInput.split('/'),
  mm = tokens[0],
  dd = tokens[1];

  if (mm.charAt(0) === '0') 
    tokens[0] = mm.replace("0", "");
  if (dd.charAt(0) === '0') 
    tokens[1] = dd.replace("0", "");

  return tokens[0] + "/" + tokens[1] + "/" + tokens[2];
}

// Find out unique values of City/State/Country/Shape to compose filter dropdowns
var cities = tableData.map(item => item.city).filter((value, index, self) => self.indexOf(value) === index);
var states = tableData.map(item => item.state).filter((value, index, self) => self.indexOf(value) === index);
var countries = tableData.map(item => item.country).filter((value, index, self) => self.indexOf(value) === index);
var shapes = tableData.map(item => item.shape).filter((value, index, self) => self.indexOf(value) === index);

// Populate City dropdown, sort alphabetically
var citySelect = document.getElementById("city"); 
populateDropdown(citySelect, cities.sort());

// Populate State dropdown, sort alphabetically
var stateSelect = document.getElementById("state"); 
populateDropdown(stateSelect, states.sort());

// Populate Country dropdown, sort alphabetically
var countrySelect = document.getElementById("country"); 
populateDropdown(countrySelect, countries.sort());

// Populate Shape dropdown, sort alphabetically
var shapeSelect = document.getElementById("shape"); 
populateDropdown(shapeSelect, shapes.sort());

// Display all data
populateTable(tableData, "tbody");

// Select the submit button
var submit = d3.select("#filter-btn");
  
// Action when Filter Data button is clicked
submit.on("click", function() {

  // Filter criteria
  var criteria = [];

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Remove all old result rows
  d3.select("tbody").html("");

  // Get the value property of the datetime field if entered, and put into the filter
  // jQuery datepicker returns date in the format of mm/dd/yyyy
  // Dataset date strings are in the same format except for no leading 0
  // Need to call convertDate function to remove leading 0s 
  var datetimeValueRaw = d3.select(".form-control").property("value");
  if (datetimeValueRaw != "") {
    datetimeValue = convertDate(datetimeValueRaw);
    console.log(datetimeValue);
    criteria.push({datetime: datetimeValue});
  }
  
  // Get the value property of the city if a city is selected, and put into the filter
  var cityValue = d3.select("#city").property("value");
  if (cityValue != "Choose a City")
    criteria.push({city: cityValue});

  // Get the value property of the state if a state if selected, and put into the filter
  var stateValue = d3.select("#state").property("value");
  if (stateValue != "Choose a State")
    criteria.push({state: stateValue});

  // Get the value property of the country if a country is selected, and put into the filter
  var countryValue = d3.select("#country").property("value");
  if (countryValue != "Choose a Country")
    criteria.push({country: countryValue});

  // Get the value property of the shape if a shape is selected, and put into the filter
  var shapeValue = d3.select("#shape").property("value");
  if (shapeValue != "Choose a Shape")
    criteria.push({shape: shapeValue});
  
  console.log(criteria);

  // Filter the dataset with the filter(s) from above and populate the table
  // If no filter is selected, populate with the whole dataset
  if (criteria.length === 0) {
    populateTable(tableData, "tbody");
  }
  else {
    var filterCounter = criteria.length;
    var i, ckey, cValue;
    var filteredData = tableData.filter(function(item) {
      for(i=0; i<filterCounter; ++i) {
        //console.log(Object.keys(criteria[i]))
        cKey = Object.keys(criteria[i]);
        cValue = Object.values(criteria[i]);
        if(item[cKey] != cValue) 
          return false;
      }
      return true;
    });
    populateTable(filteredData, "tbody");
  }
});


