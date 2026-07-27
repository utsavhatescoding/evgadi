import vehicleSpecs from "./vehicleSpecs.json";

export type MarketVehicle = {
  id: string;
  brand: string;
  model: string;
  price: number;
  variants?: string;
  segment: "City" | "Hatchback" | "SUV" | "MPV" | "Luxury" | "Pickup";
  image?: string;
  batteryKwh?: number | null;
  rangeKm?: number | null;
  rangeStandard?: string | null;
  batteryType?: string | null;
  acCharging?: string | null;
  dcCharging?: string | null;
  clearanceMm?: number | null;
  vehicleWarranty?: string | null;
  batteryWarranty?: string | null;
  motorWarranty?: string | null;
  distributor?: string | null;
  sourceUrl?: string | null;
  officialSourceUrl?: string | null;
  sourceLabel?: string | null;
  sourceTier?: string | null;
  checkedAt?: string | null;
};

const baseMarketVehicles: MarketVehicle[] = [
  { id:"seres-e1", brand:"Seres", model:"E1", price:1649000, segment:"City" },
  { id:"mg-comet", brand:"MG", model:"Comet EV", price:1875000, variants:"Pace · Play", segment:"City", image:"/vehicles/mg-comet.webp" },
  { id:"henrey-volts", brand:"Henrey", model:"Volts", price:1995000, segment:"City" },
  { id:"baw-brumby", brand:"BAW", model:"Brumby", price:1999000, segment:"City" },
  { id:"lingbox-ec01", brand:"Lingbox", model:"EC01", price:2099000, segment:"City" },
  { id:"changan-lumin", brand:"Changan", model:"Lumin", price:2296000, segment:"City" },
  { id:"kaiyi-equte", brand:"Kaiyi", model:"e-Qute", price:2296000, variants:"02 · 04", segment:"City" },
  { id:"wuling-air", brand:"Wuling", model:"Air EV", price:2499000, variants:"Standard · Long Range", segment:"City" },
  { id:"tata-tiago", brand:"Tata", model:"Tiago.ev", price:2749000, variants:"XT · XZ+ Tech Lux", segment:"Hatchback" },
  { id:"leapmotor-t03", brand:"Leapmotor", model:"T03", price:2899000, segment:"Hatchback", image:"/vehicles/leapmotor-t03.jpg" },
  { id:"tata-tigor", brand:"Tata", model:"Tigor EV", price:2999000, variants:"XE · XM · XZ+", segment:"Hatchback" },
  { id:"proton-emas5", brand:"Proton", model:"e.MAS 5", price:2999000, variants:"Prime · Premium", segment:"Hatchback" },
  { id:"wuling-binguo", brand:"Wuling", model:"Binguo EV", price:3199000, segment:"Hatchback" },
  { id:"nammi-01", brand:"Dongfeng", model:"Nammi 01", price:3249000, variants:"E2 · E3", segment:"Hatchback" },
  { id:"citroen-ec3", brand:"Citroën", model:"ë-C3", price:3499000, variants:"Live · Shine", segment:"Hatchback" },
  { id:"tata-punch", brand:"Tata", model:"Punch.ev", price:3499000, variants:"MR · LR", segment:"SUV", image:"/vehicles/tata-punch.webp" },
  { id:"neta-v", brand:"Neta", model:"V", price:3899000, segment:"SUV" },
  { id:"nammi-vigo", brand:"Dongfeng", model:"Nammi Vigo", price:4099000, variants:"E2 · E2+", segment:"SUV" },
  { id:"byd-dolphin", brand:"BYD", model:"Dolphin", price:4115000, segment:"Hatchback" },
  { id:"mg-windsor", brand:"MG", model:"Windsor EV", price:4149000, variants:"Commute · Excite · Exclusive · Essence", segment:"MPV", image:"/vehicles/mg-windsor.webp" },
  { id:"mg-mg4", brand:"MG", model:"MG4 EV", price:4149000, variants:"Comfort · Luxury", segment:"Hatchback" },
  { id:"kaiyi-x3", brand:"Kaiyi", model:"X3 Pro EV", price:4396000, segment:"SUV" },
  { id:"mg-s5", brand:"MG", model:"S5 EV", price:4399000, variants:"Comfort · Deluxe · Luxury", segment:"SUV" },
  { id:"gwm-ora5", brand:"GWM", model:"ORA 5", price:4699000, segment:"SUV" },
  { id:"proton-emas7", brand:"Proton", model:"e.MAS 7", price:4699000, variants:"Prime · Premium", segment:"SUV" },
  { id:"gwm-ora03", brand:"GWM", model:"ORA 03", price:4749000, segment:"Hatchback" },
  { id:"forthing-friday", brand:"Forthing", model:"Friday EV", price:4896999, segment:"SUV" },
  { id:"byd-atto2", brand:"BYD", model:"ATTO 2", price:4899000, segment:"SUV" },
  { id:"suzuki-evitara", brand:"Suzuki", model:"e VITARA", price:4899000, variants:"Delta · Zeta · Alpha", segment:"SUV" },
  { id:"tata-nexon", brand:"Tata", model:"Nexon K3.ev", price:4899000, segment:"SUV" },
  { id:"leapmotor-b10", brand:"Leapmotor", model:"B10", price:4999000, variants:"Life · Design", segment:"SUV", image:"/vehicles/leapmotor-b10.png" },
  { id:"seres-3", brand:"Seres", model:"3", price:4999000, variants:"Comfort · Premium", segment:"SUV" },
  { id:"omoda-e5", brand:"Omoda", model:"E5 Pro", price:5159000, segment:"SUV", image:"/vehicles/omoda-e5.png" },
  { id:"hyundai-creta", brand:"Hyundai", model:"Creta Electric", price:5196000, variants:"Executive · Smart · Premium+", segment:"SUV" },
  { id:"mahindra-xuv400", brand:"Mahindra", model:"XUV400", price:5250000, segment:"SUV" },
  { id:"neta-x", brand:"Neta", model:"X", price:5399000, variants:"Comfort · Luxury", segment:"SUV" },
  { id:"deepal-s05", brand:"Deepal", model:"S05", price:5399000, variants:"Plus · Max", segment:"SUV" },
  { id:"icaur-v23", brand:"iCAUR", model:"V23", price:5399000, segment:"SUV" },
  { id:"jmev-gse", brand:"JMEV", model:"GSE Elight", price:5399000, segment:"SUV" },
  { id:"byd-m6", brand:"BYD", model:"M6", price:5500000, segment:"MPV" },
  { id:"tata-curvv", brand:"Tata", model:"Curvv.ev", price:5699000, segment:"SUV" },
  { id:"mahindra-be6", brand:"Mahindra", model:"BE 6", price:5700000, variants:"Pack 1 · Pack 2 · Pack 3", segment:"SUV" },
  { id:"jaecoo-j5", brand:"Jaecoo", model:"J5 EV", price:5699000, segment:"SUV", image:"/vehicles/jaecoo-j5.png" },
  { id:"gac-aiony", brand:"GAC", model:"Aion Y", price:5850000, segment:"MPV" },
  { id:"hyundai-kona", brand:"Hyundai", model:"KONA Electric", price:5996000, variants:"GL · GLS", segment:"SUV" },
  { id:"geely-ex5", brand:"Geely", model:"Galaxy EX5", price:6200000, variants:"Pro · Max", segment:"SUV" },
  { id:"byd-atto3", brand:"BYD", model:"ATTO 3", price:6199000, variants:"Advanced · Superior", segment:"SUV" },
  { id:"riddara-rd6", brand:"Riddara", model:"RD6", price:6500000, segment:"Pickup" },
  { id:"kia-niro", brand:"Kia", model:"Niro EV", price:6990000, segment:"SUV" },
  { id:"jaecoo-j6t", brand:"Jaecoo", model:"J6T", price:6999000, segment:"SUV", image:"/vehicles/jaecoo-j6t.png" },
  { id:"deepal-l07", brand:"Deepal", model:"L07", price:6999000, segment:"Luxury" },
  { id:"gac-aionv", brand:"GAC", model:"Aion V", price:6999000, variants:"Elite · Luxury", segment:"SUV" },
  { id:"leapmotor-c10", brand:"Leapmotor", model:"C10", price:7200000, segment:"SUV", image:"/vehicles/leapmotor-c10.jpg" },
  { id:"deepal-s07", brand:"Deepal", model:"S07", price:7499000, segment:"SUV" },
  { id:"byd-sealion7", brand:"BYD", model:"SEALION 7", price:7999000, segment:"SUV" },
  { id:"zeekr-x", brand:"Zeekr", model:"X", price:7999000, variants:"RWD · AWD", segment:"Luxury" },
  { id:"mg-im6", brand:"MG", model:"IM6", price:8199000, segment:"Luxury" },
  { id:"xpeng-g6", brand:"XPENG", model:"G6", price:8499000, segment:"SUV" },
  { id:"hyundai-ioniq5", brand:"Hyundai", model:"IONIQ 5", price:9296000, segment:"Luxury" },
  { id:"smart-1", brand:"smart", model:"#1", price:10000000, segment:"Luxury" },
  { id:"smart-3", brand:"smart", model:"#3", price:10000000, segment:"Luxury" },
  { id:"deepal-e07", brand:"Deepal", model:"E07", price:10990000, segment:"Luxury" },
  { id:"byd-seal", brand:"BYD", model:"SEAL", price:11000000, variants:"Dynamic · Premium · Performance", segment:"Luxury" },
  { id:"maxus-eterron", brand:"Maxus", model:"eTerron 9", price:11800000, segment:"Pickup" },
  { id:"kia-ev6", brand:"Kia", model:"EV6", price:12590000, segment:"Luxury" },
  { id:"avatr-11", brand:"Avatr", model:"11", price:16000000, segment:"Luxury" },
  { id:"mg-cyberster", brand:"MG", model:"Cyberster", price:16800000, segment:"Luxury" },
  { id:"kia-ev9", brand:"Kia", model:"EV9", price:17990000, segment:"Luxury" },
  { id:"bmw-ix2", brand:"BMW", model:"iX2", price:17996000, segment:"Luxury" },
  { id:"xpeng-x9", brand:"XPENG", model:"X9", price:23000000, segment:"Luxury" },
  { id:"maxus-mifa7", brand:"Maxus", model:"MIFA 7", price:24500000, segment:"Luxury" },
];

export const marketVehicles: MarketVehicle[] = baseMarketVehicles.map((vehicle) => ({
  ...vehicle,
  ...(vehicleSpecs[vehicle.id as keyof typeof vehicleSpecs] || {}),
}));
