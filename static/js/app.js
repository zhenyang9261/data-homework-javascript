// from data.js
var tableData = data;

// Function to populate the table with given 'dataset'
function populateTable(dataset) {
  dataset.forEach((data) => {
    
    var row = d3.select("tbody").append("tr");
    Object.entries(data).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });
}

// Function to populate the drowdown list with 'dropdownValues' to element 'elem'
// @param {}
function populateDropdown(elem, dropdownValues) {
  dropdownValues.forEach((dropdown) => {
    var option = document.createElement("option");
    option.text = dropdown;
    option.value = dropdown;
    elem.add(option); 
  });
}

/*
function multiFilter(array, filters) {
  const filterKeys = Object.keys(filters);
  // filters all elements passing the criteria
  return array.filter((item) => {
    // dynamically validate all filter criteria
    return filterKeys.every(key => {
      // ignores an empty filter
      if (!filters[key].length) return true;
      return filters[key].includes(item[key]);
    });
  });
} */

// Find out unique values of City/State/Country/Shape to compose filter dropdowns
var cities = tableData.map(item => item.city).filter((value, index, self) => self.indexOf(value) === index);
var states = tableData.map(item => item.state).filter((value, index, self) => self.indexOf(value) === index);
var countries = tableData.map(item => item.country).filter((value, index, self) => self.indexOf(value) === index);
var shapes = tableData.map(item => item.shape).filter((value, index, self) => self.indexOf(value) === index);

// Populate City dropdown
var citySelect = document.getElementById("city"); 
populateDropdown(citySelect, cities);

// Populate State dropdown
var stateSelect = document.getElementById("state"); 
populateDropdown(stateSelect, states);

// Populate Country dropdown
var countrySelect = document.getElementById("country"); 
populateDropdown(countrySelect, countries);

// Populate Shape dropdown
var shapeSelect = document.getElementById("shape"); 
populateDropdown(shapeSelect, shapes);

// Filter criteria
var criteria = [];

// Select the submit button
var submit = d3.select("#filter-btn");

// Action when Filter Data button is clicked
submit.on("click", function() {

  // Filter criteria
  var criteria = [];

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Remove all old result rows
  d3.selectAll("tr").remove();

  // Get the value property of the datetime field
  var datetimeValue = d3.select(".form-control").property("value");
  if (datetimeValue != "")
    criteria.push({datetime: datetimeValue});
  
  // Get the value property of the city
  var cityValue = d3.select("#city").property("value");
  if (cityValue != "Choose a City")
    criteria.push({city: cityValue});

  // Get the value property of the state
  var stateValue = d3.select("#state").property("value");
  if (stateValue != "Choose a State")
    criteria.push({state: stateValue});

  // Get the value property of the country
  var countryValue = d3.select("#country").property("value");
  if (countryValue != "Choose a Country")
    criteria.push({country: countryValue});

  // Get the value property of the shape
  var shapeValue = d3.select("#shape").property("value");
  if (shapeValue != "Choose a Shape")
    criteria.push({shape: shapeValue});
  
  console.log(criteria);

  //var filteredData = tableData.filter(ufodata => ufodata.datetime === datetimeValue && ufodata.city === cityValue);

  filteredData = tableData.filter(function(item) {
    var i, ntest, cKey, cValue, flag;
    
    for(i=0, ntest=criteria.length; i<ntest; ++i) {
      console.log(Object.keys(criteria[i]))
        cKey = Object.keys(criteria[i]);
        cValue = Object.values(criteria[i]);
        if(item[cKey] != cValue) return false;
    }
    return true;
  });
  
  //var filteredData = multiFilter(tableData, criteria);
  console.log(filteredData);

  // Populate the table with result set
  populateTable(filteredData);
});


