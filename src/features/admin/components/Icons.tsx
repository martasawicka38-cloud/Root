import Svg, { Path, Rect } from "react-native-svg";

export function IconSteps({ size = 18, color = "#535A3E" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="3" y="12" width="4" height="9" rx="1" fill={color} />
      <Rect x="10" y="7" width="4" height="14" rx="1" fill={color} />
      <Rect x="17" y="3" width="4" height="18" rx="1" fill={color} />
    </Svg>
  );
}

export function IconTrophy({ size = 18, color = "#535A3E" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M6 2h12v6a6 6 0 01-12 0V2z" fill={color} />
      <Path d="M6 4H3a1 1 0 00-1 1v2a4 4 0 004 4h0" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M18 4h3a1 1 0 011 1v2a4 4 0 01-4 4h0" stroke={color} strokeWidth="1.5" fill="none" />
      <Path d="M10 18h4v2h-4z" fill={color} />
      <Path d="M8 20h8v2H8z" fill={color} />
    </Svg>
  );
}

export function IconActivity({ size = 18, color = "#535A3E" }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill={color} />
    </Svg>
  );
}
