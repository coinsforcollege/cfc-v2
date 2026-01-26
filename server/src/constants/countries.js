import { getData } from 'country-list';

const countryNameMappings = {
  'United States of America': 'United States',
  'United States of America (the)': 'United States',
  'United Kingdom of Great Britain and Northern Ireland (the)': 'United Kingdom',
  'Russian Federation (the)': 'Russia',
  'Korea (the Republic of)': 'South Korea',
  "Korea (the Democratic People's Republic of)": 'North Korea',
  'Iran (Islamic Republic of)': 'Iran',
  'Syrian Arab Republic (the)': 'Syria',
  'Venezuela (Bolivarian Republic of)': 'Venezuela',
  'Bolivia (Plurinational State of)': 'Bolivia',
  'Moldova (the Republic of)': 'Moldova',
  'Tanzania, the United Republic of': 'Tanzania',
  'Taiwan (Province of China)': 'Taiwan',
  "Lao People's Democratic Republic (the)": 'Laos',
  'United Arab Emirates (the)': 'United Arab Emirates',
  'Bahamas (The)': 'Bahamas',
  'Philippines (the)': 'Philippines',
  'Netherlands (Kingdom of the)': 'Netherlands',
  'Gambia (the)': 'Gambia',
  'Sudan (the)': 'Sudan',
  'Niger (the)': 'Niger',
  'Comoros (the)': 'Comoros',
  'Congo (the)': 'Congo',
  'Congo (the Democratic Republic of the)': 'Democratic Republic of the Congo',
  'Virgin Islands (British)': 'British Virgin Islands',
  'Virgin Islands (U.S.)': 'U.S. Virgin Islands',
  'Falkland Islands (the) [Malvinas]': 'Falkland Islands',
  'Cayman Islands (the)': 'Cayman Islands',
  'Cook Islands (the)': 'Cook Islands',
  'Faroe Islands (the)': 'Faroe Islands',
  'Marshall Islands (the)': 'Marshall Islands',
  'Turks and Caicos Islands (the)': 'Turks and Caicos Islands',
  'Cocos (Keeling) Islands (the)': 'Cocos Islands',
  'Central African Republic (the)': 'Central African Republic',
  'Dominican Republic (the)': 'Dominican Republic',
  'Micronesia (Federated States of)': 'Micronesia',
  'British Indian Ocean Territory (the)': 'British Indian Ocean Territory',
  'Northern Mariana Islands (the)': 'Northern Mariana Islands',
  'French Southern Territories (the)': 'French Southern Territories',
  'United States Minor Outlying Islands (the)': 'United States Minor Outlying Islands',
  'Holy See (the)': 'Holy See'
};

const allCountries = getData().map(country => {
  return countryNameMappings[country.name] || country.name;
});

const uniqueCountries = [...new Set(allCountries)].sort();

// Remove priority countries from the sorted list
const priorityCountries = ['United States', 'United Kingdom'];
priorityCountries.forEach(country => {
  const index = uniqueCountries.indexOf(country);
  if (index > -1) {
    uniqueCountries.splice(index, 1);
  }
});

// Put priority countries at the top, followed by the rest
export const COUNTRIES = [...priorityCountries, ...uniqueCountries];

// Validate if a country is in the list
export const isValidCountry = (country) => {
  return COUNTRIES.includes(country);
};

// Validate an array of countries
export const areValidCountries = (countries) => {
  if (!Array.isArray(countries)) return false;
  return countries.every(country => isValidCountry(country));
};

export default COUNTRIES;
