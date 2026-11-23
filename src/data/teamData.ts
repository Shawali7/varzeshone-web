import type { Team } from "../types";
import { demoVenues } from "./geographyData";

const afghanistan = "Afghanistan";
const provinceByCity: Record<string, string> = {
  Kabul: "Kabul",
  Paghman: "Kabul",
  Herat: "Herat",
  Guzara: "Herat",
  Injil: "Herat",
  Karukh: "Herat",
  Kushk: "Herat",
  "Zinda Jan": "Herat",
  Kandahar: "Kandahar",
  "Spin Boldak": "Kandahar",
  Daman: "Kandahar",
  Arghandab: "Kandahar",
  Panjwayi: "Kandahar",
  "Shah Wali Kot": "Kandahar",
  "Mazar-i-Sharif": "Balkh",
  Panjshir: "Panjshir",
  Jalalabad: "Nangarhar",
  Faizabad: "Badakhshan",
  Bamyan: "Bamyan",
};

const venueNamesById = new Map(demoVenues.map((venue) => [venue.id, venue.name] as const));

const activeDemoTeam = (id: string, name: string, sport: Team["sport"], city: string): Team => {
  const venueId = sport === "futsal"
    ? (city === "Herat" ? "venue-herat-demo-futsal-hall" : "venue-kabul-demo-futsal-hall")
    : (city === "Herat"
      ? "venue-herat-demo-football-ground"
      : city === "Kandahar"
        ? "venue-kandahar-demo-football-ground"
        : city === "Mazar-i-Sharif"
          ? "venue-balkh-demo-football-ground"
          : "venue-kabul-demo-sports-ground");

  return {
    id,
    name,
    country: afghanistan,
    city,
    province: provinceByCity[city],
    sport,
    venueId,
    venue: venueNamesById.get(venueId),
    isActive: true,
    isDemo: true,
  };
};

export const demoTeams: Team[] = [
  activeDemoTeam("herat-fc", "Herat FC", "football", "Herat"),
  activeDemoTeam("kabul-fc", "Kabul FC", "football", "Kabul"),
  activeDemoTeam("kandahar-fc", "Kandahar FC", "football", "Kandahar"),
  activeDemoTeam("balkh-fc", "Balkh FC", "football", "Mazar-i-Sharif"),
  activeDemoTeam("panjshir-fc", "Panjshir FC", "football", "Panjshir"),
  activeDemoTeam("nangarhar-fc", "Nangarhar FC", "football", "Jalalabad"),
  activeDemoTeam("badakhshan-fc", "Badakhshan FC", "football", "Faizabad"),
  activeDemoTeam("bamyan-fc", "Bamyan FC", "football", "Bamyan"),

  activeDemoTeam("kabul-eagles", "Kabul Eagles", "football", "Kabul"),
  activeDemoTeam("kabul-united", "Kabul United", "football", "Kabul"),
  activeDemoTeam("kabul-stars", "Kabul Stars", "football", "Kabul"),
  activeDemoTeam("kabul-city", "Kabul City", "football", "Kabul"),
  activeDemoTeam("shahr-e-naw-fc", "Shahr-e-Naw FC", "football", "Kabul"),
  activeDemoTeam("paghman-fc", "Paghman FC", "football", "Paghman"),
  activeDemoTeam("kabul-warriors", "Kabul Warriors", "football", "Kabul"),
  activeDemoTeam("kabul-athletic", "Kabul Athletic", "football", "Kabul"),

  activeDemoTeam("herat-united", "Herat United", "football", "Herat"),
  activeDemoTeam("herat-stars", "Herat Stars", "football", "Herat"),
  activeDemoTeam("jami-fc", "Jami FC", "football", "Herat"),
  activeDemoTeam("guzara-fc", "Guzara FC", "football", "Guzara"),
  activeDemoTeam("injil-fc", "Injil FC", "football", "Injil"),
  activeDemoTeam("herat-city", "Herat City", "football", "Herat"),
  activeDemoTeam("karukh-fc", "Karukh FC", "football", "Karukh"),
  activeDemoTeam("kushk-fc", "Kushk FC", "football", "Kushk"),

  activeDemoTeam("kandahar-united", "Kandahar United", "football", "Kandahar"),
  activeDemoTeam("kandahar-stars", "Kandahar Stars", "football", "Kandahar"),
  activeDemoTeam("spin-boldak-fc", "Spin Boldak FC", "football", "Spin Boldak"),
  activeDemoTeam("daman-fc", "Daman FC", "football", "Daman"),
  activeDemoTeam("arghandab-fc", "Arghandab FC", "football", "Arghandab"),
  activeDemoTeam("kandahar-city", "Kandahar City", "football", "Kandahar"),
  activeDemoTeam("panjwayi-fc", "Panjwayi FC", "football", "Panjwayi"),
  activeDemoTeam("shah-wali-kot-fc", "Shah Wali Kot FC", "football", "Shah Wali Kot"),

  activeDemoTeam("herat-futsal", "Herat Futsal", "futsal", "Herat"),
  activeDemoTeam("kabul-futsal", "Kabul Futsal", "futsal", "Kabul"),
  activeDemoTeam("balkh-futsal", "Balkh Futsal", "futsal", "Mazar-i-Sharif"),
  activeDemoTeam("kandahar-futsal", "Kandahar Futsal", "futsal", "Kandahar"),
  activeDemoTeam("nangarhar-futsal", "Nangarhar Futsal", "futsal", "Jalalabad"),
  activeDemoTeam("panjshir-futsal", "Panjshir Futsal", "futsal", "Panjshir"),
  activeDemoTeam("bamyan-futsal", "Bamyan Futsal", "futsal", "Bamyan"),
  activeDemoTeam("badakhshan-futsal", "Badakhshan Futsal", "futsal", "Faizabad"),

  activeDemoTeam("herat-futsal-club", "Herat Futsal Club", "futsal", "Herat"),
  activeDemoTeam("jami-futsal", "Jami Futsal", "futsal", "Herat"),
  activeDemoTeam("injil-futsal", "Injil Futsal", "futsal", "Injil"),
  activeDemoTeam("guzara-futsal", "Guzara Futsal", "futsal", "Guzara"),
  activeDemoTeam("herat-city-futsal", "Herat City Futsal", "futsal", "Herat"),
  activeDemoTeam("karukh-futsal", "Karukh Futsal", "futsal", "Karukh"),
  activeDemoTeam("kushk-futsal", "Kushk Futsal", "futsal", "Kushk"),
  activeDemoTeam("zinda-jan-futsal", "Zinda Jan Futsal", "futsal", "Zinda Jan"),
];
