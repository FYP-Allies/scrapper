import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { assert } from "console";

const BASE_PATH = './storage/datasets/default';

const cities = [];
const specializations = [];
const conditions = {};

readdirSync(BASE_PATH).forEach(file => {
  const filePath = `${BASE_PATH}/${file}`;
  const data = JSON.parse(readFileSync(filePath, 'utf-8'));
  
  switch(data.label) {
    case 'city':
      const city = data.url.split('/').at(-1);
      cities.push({ city, img: data.cityImageUrl, description: data.cityDescription });
      break;
    case 'specialization':
      specializations.push(data.specialization);
      break;
    case 'condition':
      if(data.specialization) conditions[data.specialization] = data.conditions;
      break;
  }
});



///
/// TEST
///

assert(
  Object.keys(conditions).length === specializations.length, 
  `Missing conditions for some specializations Object.keys(conditions).length === specializations.length GOT ${Object.keys(conditions).length} === ${specializations.length}`
);

assert((()=> {
  const allSpecializations = new Set(specializations);
  return Object.keys(conditions).filter((specialization) => allSpecializations.has(specialization)).length === 
    specializations.length;
})(), `Missing conditions for some specializations total match ${(()=>{
  const allSpecializations = new Set(specializations);
  return Object.keys(conditions).filter((specialization) => allSpecializations.has(specialization)).length;
})()}`)

if(!existsSync('./data')) mkdirSync('./data');

writeFileSync('./data/cities.json', JSON.stringify(cities, null, 2), 'utf-8');
writeFileSync('./data/specializations.json', JSON.stringify(specializations, null, 2), 'utf-8');
writeFileSync('./data/conditions.json', JSON.stringify(conditions, null, 2), 'utf-8');
