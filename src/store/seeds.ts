import type { Reward, TxItem } from "./types";

const nowIso = () => new Date().toISOString();

export const txSeed: TxItem[] = [
  { id: "tx-1", name: "Kroki (6200)", points: 25, type: "earned", createdAt: nowIso() },
  { id: "tx-2", name: "Segregacja odpadow", points: 30, type: "earned", createdAt: nowIso() },
  { id: "tx-3", name: "Kawa w sieciowce", points: -200, type: "spent", createdAt: nowIso() },
];

export const rewardsSeed: Reward[] = [
  { id: "r-1", icon: "coffee", title: "Kawa w sieciowce", merchant: "American Cafe", category: "food", cost: 200, code: "K4W4-2B8X", description: "Darmowa kawa w punktach American Cafe." },
  { id: "r-2", icon: "yoga", title: "Joga w Centrum", merchant: "Centrum Jogi Sopot", category: "wellness", cost: 350, code: "J0G4-9C2D", description: "Jednorazowe wejscie na zajecia jogi." },
  { id: "r-3", icon: "swim", title: "Karnet na basen", merchant: "Aquapark Sopot", category: "sport", cost: 500, code: "B4S3-7X9M", description: "Miesieczny karnet na basen." },
  { id: "r-4", icon: "leaf", title: "Zestaw roslinny", merchant: "Zielony Zakatek", category: "eco", cost: 150, code: "R05T-4P2Q", description: "Zestaw sadzonek do domu lub biura." },
];
