export const lightColors = {
  sand: "#F7F7F7",
  paper: "#FFFFFF",
  ink: "#222222",
  muted: "#717171",
  coral: "#FF385C",
  ocean: "#00A699",
  mist: "#F0F0F0",
  peach: "#FFF1EE",
  white: "#FFFFFF",
  line: "#EBEBEB",
  // Always-dark surface — used for the summary card and loading overlay
  surfaceDark: "#1C2526",
  // On-dark accent tokens — live on surfaceDark, unchanged across themes
  tealLight: "#EDF3F4",
  tealMuted: "#B7D9DA",
  tealSoft: "#D6E4E5",
  peachSoft: "#F7D7C6",
} as const;

export const darkColors = {
  sand: "#000000",
  paper: "#1C1C1E",
  ink: "#EBEBF0",
  muted: "#8E8E93",
  coral: "#FF385C",
  ocean: "#00A699",
  mist: "#2C2C2E",
  peach: "#2C1B18",
  white: "#FFFFFF",
  line: "#38383A",
  surfaceDark: "#1C2526",
  tealLight: "#EDF3F4",
  tealMuted: "#B7D9DA",
  tealSoft: "#D6E4E5",
  peachSoft: "#F7D7C6",
} as const;

export type Colors = {
  sand: string;
  paper: string;
  ink: string;
  muted: string;
  coral: string;
  ocean: string;
  mist: string;
  peach: string;
  white: string;
  line: string;
  surfaceDark: string;
  tealLight: string;
  tealMuted: string;
  tealSoft: string;
  peachSoft: string;
};

// Legacy alias — kept so any missed imports don't cause TypeScript errors
export const COLORS = lightColors;
