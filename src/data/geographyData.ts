import type { SportType } from "../types/sports";

export type AfghanProvince = {
  id: string;
  name: string;
  country: "Afghanistan";
  isDemo: true;
};

export type AfghanCity = {
  id: string;
  name: string;
  provinceId: string;
  country: "Afghanistan";
  isDemo: true;
};

export type DemoVenue = {
  id: string;
  name: string;
  cityId: string;
  provinceId: string;
  sport: SportType | "multi";
  isDemo: true;
};

export const afghanProvinces: AfghanProvince[] = [
  { id: "province-kabul", name: "Kabul", country: "Afghanistan", isDemo: true },
  { id: "province-herat", name: "Herat", country: "Afghanistan", isDemo: true },
  { id: "province-kandahar", name: "Kandahar", country: "Afghanistan", isDemo: true },
  { id: "province-balkh", name: "Balkh", country: "Afghanistan", isDemo: true },
  { id: "province-panjshir", name: "Panjshir", country: "Afghanistan", isDemo: true },
  { id: "province-nangarhar", name: "Nangarhar", country: "Afghanistan", isDemo: true },
  { id: "province-badakhshan", name: "Badakhshan", country: "Afghanistan", isDemo: true },
  { id: "province-bamyan", name: "Bamyan", country: "Afghanistan", isDemo: true },
];

export const afghanCities: AfghanCity[] = [
  { id: "city-kabul", name: "Kabul", provinceId: "province-kabul", country: "Afghanistan", isDemo: true },
  { id: "city-herat", name: "Herat", provinceId: "province-herat", country: "Afghanistan", isDemo: true },
  { id: "city-kandahar", name: "Kandahar", provinceId: "province-kandahar", country: "Afghanistan", isDemo: true },
  { id: "city-mazar-i-sharif", name: "Mazar-i-Sharif", provinceId: "province-balkh", country: "Afghanistan", isDemo: true },
  { id: "city-panjshir", name: "Panjshir", provinceId: "province-panjshir", country: "Afghanistan", isDemo: true },
  { id: "city-jalalabad", name: "Jalalabad", provinceId: "province-nangarhar", country: "Afghanistan", isDemo: true },
  { id: "city-faizabad", name: "Faizabad", provinceId: "province-badakhshan", country: "Afghanistan", isDemo: true },
  { id: "city-bamyan", name: "Bamyan", provinceId: "province-bamyan", country: "Afghanistan", isDemo: true },
];

export const demoVenues: DemoVenue[] = [
  { id: "venue-kabul-demo-sports-ground", name: "Kabul Demo Sports Ground", cityId: "city-kabul", provinceId: "province-kabul", sport: "multi", isDemo: true },
  { id: "venue-herat-demo-football-ground", name: "Herat Demo Football Ground", cityId: "city-herat", provinceId: "province-herat", sport: "football", isDemo: true },
  { id: "venue-kandahar-demo-football-ground", name: "Kandahar Demo Football Ground", cityId: "city-kandahar", provinceId: "province-kandahar", sport: "football", isDemo: true },
  { id: "venue-balkh-demo-football-ground", name: "Balkh Demo Football Ground", cityId: "city-mazar-i-sharif", provinceId: "province-balkh", sport: "football", isDemo: true },
  { id: "venue-herat-demo-futsal-hall", name: "Herat Demo Futsal Hall", cityId: "city-herat", provinceId: "province-herat", sport: "futsal", isDemo: true },
  { id: "venue-kabul-demo-futsal-hall", name: "Kabul Demo Futsal Hall", cityId: "city-kabul", provinceId: "province-kabul", sport: "futsal", isDemo: true },
];
