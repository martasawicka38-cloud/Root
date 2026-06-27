import type { IconProps } from "./icons/types";
import {
  BikeIcon,
  BusIcon,
  CarIcon,
  StepsIcon,
  BookIcon,
  RecycleIcon,
  ToolIcon,
  ClothesIcon,
  LeafIcon,
  ShoppingIcon,
  BagIcon,
  CheeseIcon,
  CookIcon,
  NatureIcon,
  CleanIcon,
  TreeIcon,
  BirdIcon,
  YogaIcon,
  RunningIcon,
  CoffeeIcon,
  SwimIcon,
  LightbulbIcon,
  SproutIcon,
  FireIcon,
  TrophyIcon,
  MedalIcon,
} from "./icons";

const ICON_MAP: Record<string, React.FC<IconProps>> = {
  bike: BikeIcon,
  bus: BusIcon,
  car: CarIcon,
  walk: StepsIcon,
  book: BookIcon,
  recycle: RecycleIcon,
  tool: ToolIcon,
  clothes: ClothesIcon,
  leaf: LeafIcon,
  shopping: ShoppingIcon,
  bag: BagIcon,
  cheese: CheeseIcon,
  cook: CookIcon,
  nature: NatureIcon,
  clean: CleanIcon,
  tree: TreeIcon,
  bird: BirdIcon,
  yoga: YogaIcon,
  run: RunningIcon,
  coffee: CoffeeIcon,
  swim: SwimIcon,
  lightbulb: LightbulbIcon,
  sprout: SproutIcon,
  fire: FireIcon,
  trophy: TrophyIcon,
  medal: MedalIcon,
};

export function EcoIcon({ name, size = 24, color }: { name: string; size?: number; color?: string }) {
  const Icon = ICON_MAP[name];

  if (!Icon) {
    return <LeafIcon size={size} color={color} />;
  }

  return <Icon size={size} color={color} />;
}
