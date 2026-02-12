export interface ThemeVariables {
	background: string;
	foreground: string;
	card: string;
	cardForeground: string;
	popover: string;
	popoverForeground: string;
	primary: string;
	primaryForeground: string;
	secondary: string;
	secondaryForeground: string;
	muted: string;
	mutedForeground: string;
	accent: string;
	accentForeground: string;
	destructive: string;
	destructiveForeground: string;
	border: string;
	input: string;
	ring: string;
	chart1: string;
	chart2: string;
	chart3: string;
	chart4: string;
	chart5: string;
	sidebar: string;
	sidebarForeground: string;
	sidebarPrimary: string;
	sidebarPrimaryForeground: string;
	sidebarAccent: string;
	sidebarAccentForeground: string;
	sidebarBorder: string;
	sidebarRing: string;
	fontSans: string;
	fontSerif: string;
	fontMono: string;
	radius: string;
	shadowX: string;
	shadowY: string;
	shadowBlur: string;
	shadowSpread: string;
	shadowOpacity: string;
	shadowColor: string;
	shadow2xs: string;
	shadowXs: string;
	shadowSm: string;
	shadow: string;
	shadowMd: string;
	shadowLg: string;
	shadowXl: string;
	shadow2xl: string;
	trackingNormal: string;
	spacing: string;
}

export interface CompleteTheme {
	name: string;
	light: ThemeVariables;
	dark: ThemeVariables;
	swatches: string[];
}

export interface FontFamily {
	name: string;
	sans: string;
	serif: string;
	mono: string;
}

export const PRESET_FONTS: FontFamily[] = [
	{
		name: "Sistema",
		sans: "ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		serif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
		mono: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	},
	{
		name: "Inter",
		sans: "Inter, sans-serif",
		serif: "Georgia, serif",
		mono: "JetBrains Mono, monospace",
	},
	{
		name: "Geist",
		sans: "Geist Mono, ui-monospace, monospace",
		serif: "serif",
		mono: "JetBrains Mono, monospace",
	},
	{
		name: "Montserrat",
		sans: "Montserrat, sans-serif",
		serif: "Georgia, serif",
		mono: "Fira Code, monospace",
	},
	{
		name: "Roboto",
		sans: "Roboto, sans-serif",
		serif: "Georgia, serif",
		mono: "Roboto Mono, monospace",
	},
	{
		name: "Open Sans",
		sans: "'Open Sans', sans-serif",
		serif: "Georgia, serif",
		mono: "'Fira Code', monospace",
	},
];

export const DEFAULT_FONT_FAMILY = "Sistema";

const DEFAULT_THEME_PROPERTIES = {
	fontSans:
		"ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
	fontSerif: "ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif",
	fontMono:
		"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
	radius: "0.5rem",
	shadowX: "0",
	shadowY: "1px",
	shadowBlur: "3px",
	shadowSpread: "0px",
	shadowOpacity: "0.1",
	shadowColor: "oklch(0 0 0)",
	shadow2xs: "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
	shadowXs: "0 1px 3px 0px hsl(0 0% 0% / 0.05)",
	shadowSm:
		"0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
	shadow:
		"0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 1px 2px -1px hsl(0 0% 0% / 0.10)",
	shadowMd:
		"0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 2px 4px -1px hsl(0 0% 0% / 0.10)",
	shadowLg:
		"0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 4px 6px -1px hsl(0 0% 0% / 0.10)",
	shadowXl:
		"0 1px 3px 0px hsl(0 0% 0% / 0.10), 0 8px 10px -1px hsl(0 0% 0% / 0.10)",
	shadow2xl: "0 1px 3px 0px hsl(0 0% 0% / 0.25)",
	trackingNormal: "0em",
	spacing: "0.25rem",
} as const;

const DEFAULT_FONT_PROPERTIES = {
	fontSans: DEFAULT_THEME_PROPERTIES.fontSans,
	fontSerif: DEFAULT_THEME_PROPERTIES.fontSerif,
	fontMono: DEFAULT_THEME_PROPERTIES.fontMono,
} as const;

export const PRESET_THEMES: CompleteTheme[] = [
	{
		name: "Padrão",
		light: {
			background: "oklch(0.9818 0.0054 95.0986)",
			foreground: "oklch(0.3438 0.0269 95.7226)",
			card: "oklch(0.9818 0.0054 95.0986)",
			cardForeground: "oklch(0.1908 0.002 106.5859)",
			popover: "oklch(1 0 0)",
			popoverForeground: "oklch(0.2671 0.0196 98.939)",
			primary: "oklch(0.607 0.0936 34.44)",
			primaryForeground: "oklch(1 0 0)",
			secondary: "oklch(0.9245 0.0138 92.9892)",
			secondaryForeground: "oklch(0.4334 0.0177 98.6048)",
			muted: "oklch(0.9341 0.0153 90.239)",
			mutedForeground: "oklch(0.6059 0.0075 97.4233)",
			accent: "oklch(0.9245 0.0138 92.9892)",
			accentForeground: "oklch(0.2671 0.0196 98.939)",
			destructive: "oklch(0.6368 0.2078 25.3313)",
			destructiveForeground: "oklch(1 0 0)",
			border: "oklch(0.8847 0.0069 97.3627)",
			input: "oklch(0.7621 0.0156 98.3528)",
			ring: "oklch(0.607 0.0936 34.44)",
			chart1: "oklch(0.5583 0.1276 42.9956)",
			chart2: "oklch(0.6898 0.1581 290.4107)",
			chart3: "oklch(0.8816 0.0276 93.128)",
			chart4: "oklch(0.8822 0.0403 298.1792)",
			chart5: "oklch(0.5608 0.1348 42.0584)",
			sidebar: "oklch(0.9663 0.008 98.8792)",
			sidebarForeground: "oklch(0.359 0.0051 106.6524)",
			sidebarPrimary: "oklch(0.607 0.0936 34.44)",
			sidebarPrimaryForeground: "oklch(0.9881 0 0)",
			sidebarAccent: "oklch(0.9245 0.0138 92.9892)",
			sidebarAccentForeground: "oklch(0.325 0 0)",
			sidebarBorder: "oklch(0.9401 0 0)",
			sidebarRing: "oklch(0.7731 0 0)",
			...DEFAULT_THEME_PROPERTIES,
		},
		dark: {
			background: "oklch(0.2679 0.0036 106.6427)",
			foreground: "oklch(0.8074 0.0142 93.0137)",
			card: "oklch(0.2679 0.0036 106.6427)",
			cardForeground: "oklch(0.9818 0.0054 95.0986)",
			popover: "oklch(0.3085 0.0035 106.6039)",
			popoverForeground: "oklch(0.9211 0.004 106.4781)",
			primary: "oklch(0.607 0.0936 34.44)",
			primaryForeground: "oklch(1 0 0)",
			secondary: "oklch(0.9818 0.0054 95.0986)",
			secondaryForeground: "oklch(0.3085 0.0035 106.6039)",
			muted: "oklch(0.2213 0.0038 106.707)",
			mutedForeground: "oklch(0.7713 0.0169 99.0657)",
			accent: "oklch(0.213 0.0078 95.4245)",
			accentForeground: "oklch(0.9663 0.008 98.8792)",
			destructive: "oklch(0.6368 0.2078 25.3313)",
			destructiveForeground: "oklch(1 0 0)",
			border: "oklch(0.3618 0.0101 106.8928)",
			input: "oklch(0.4336 0.0113 100.2195)",
			ring: "oklch(0.607 0.0936 34.44)",
			chart1: "oklch(0.5583 0.1276 42.9956)",
			chart2: "oklch(0.6898 0.1581 290.4107)",
			chart3: "oklch(0.213 0.0078 95.4245)",
			chart4: "oklch(0.3074 0.0516 289.323)",
			chart5: "oklch(0.5608 0.1348 42.0584)",
			sidebar: "oklch(0.2357 0.0024 67.7077)",
			sidebarForeground: "oklch(0.8074 0.0142 93.0137)",
			sidebarPrimary: "oklch(0.325 0 0)",
			sidebarPrimaryForeground: "oklch(0.9881 0 0)",
			sidebarAccent: "oklch(0.168 0.002 106.6177)",
			sidebarAccentForeground: "oklch(0.8074 0.0142 93.0137)",
			sidebarBorder: "oklch(0.9401 0 0)",
			sidebarRing: "oklch(0.7731 0 0)",
			...DEFAULT_THEME_PROPERTIES,
		},
		swatches: [
			"oklch(0.607 0.0936 34.44)",
			"oklch(0.9818 0.0054 95.0986)",
			"oklch(0.9245 0.0138 92.9892)",
			"oklch(0.3438 0.0269 95.7226)",
		],
	},
	{
		name: "Tangerine",
		light: {
			background: "oklch(0.9383 0.0042 236.4993)",
			foreground: "oklch(0.3211 0 0)",
			card: "oklch(1.0000 0 0)",
			cardForeground: "oklch(0.3211 0 0)",
			popover: "oklch(1.0000 0 0)",
			popoverForeground: "oklch(0.3211 0 0)",
			primary: "oklch(0.6397 0.1720 36.4421)",
			primaryForeground: "oklch(1.0000 0 0)",
			secondary: "oklch(0.9670 0.0029 264.5419)",
			secondaryForeground: "oklch(0.4461 0.0263 256.8018)",
			muted: "oklch(0.9846 0.0017 247.8389)",
			mutedForeground: "oklch(0.5510 0.0234 264.3637)",
			accent: "oklch(0.9119 0.0222 243.8174)",
			accentForeground: "oklch(0.3791 0.1378 265.5222)",
			destructive: "oklch(0.6368 0.2078 25.3313)",
			destructiveForeground: "oklch(1.0000 0 0)",
			border: "oklch(0.9022 0.0052 247.8822)",
			input: "oklch(0.9700 0.0029 264.5420)",
			ring: "oklch(0.6397 0.1720 36.4421)",
			chart1: "oklch(0.7156 0.0605 248.6845)",
			chart2: "oklch(0.7875 0.0917 35.9616)",
			chart3: "oklch(0.5778 0.0759 254.1573)",
			chart4: "oklch(0.5016 0.0849 259.4902)",
			chart5: "oklch(0.4241 0.0952 264.0306)",
			sidebar: "oklch(0.9030 0.0046 258.3257)",
			sidebarForeground: "oklch(0.3211 0 0)",
			sidebarPrimary: "oklch(0.6397 0.1720 36.4421)",
			sidebarPrimaryForeground: "oklch(1.0000 0 0)",
			sidebarAccent: "oklch(0.9119 0.0222 243.8174)",
			sidebarAccentForeground: "oklch(0.3791 0.1378 265.5222)",
			sidebarBorder: "oklch(0.9276 0.0058 264.5313)",
			sidebarRing: "oklch(0.6397 0.1720 36.4421)",
			radius: "0.75rem",
			shadowX: "0px",
			shadowY: "1px",
			shadowBlur: "3px",
			shadowSpread: "0px",
			shadowOpacity: "0.1",
			shadowColor: "hsl(0 0% 0%)",
			shadow2xs: "0px 1px 3px 0px hsl(0 0% 0% / 0.05)",
			shadowXs: "0px 1px 3px 0px hsl(0 0% 0% / 0.05)",
			shadowSm:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
			shadow:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
			shadowMd:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 2px 4px -1px hsl(0 0% 0% / 0.10)",
			shadowLg:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 4px 6px -1px hsl(0 0% 0% / 0.10)",
			shadowXl:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 8px 10px -1px hsl(0 0% 0% / 0.10)",
			shadow2xl: "0px 1px 3px 0px hsl(0 0% 0% / 0.25)",
			trackingNormal: "0em",
			spacing: "0.25rem",
			...DEFAULT_FONT_PROPERTIES,
		},
		dark: {
			background: "oklch(0.2598 0.0306 262.6666)",
			foreground: "oklch(0.9219 0 0)",
			card: "oklch(0.3106 0.0301 268.6365)",
			cardForeground: "oklch(0.9219 0 0)",
			popover: "oklch(0.2900 0.0249 268.3986)",
			popoverForeground: "oklch(0.9219 0 0)",
			primary: "oklch(0.6397 0.1720 36.4421)",
			primaryForeground: "oklch(1.0000 0 0)",
			secondary: "oklch(0.3095 0.0266 266.7132)",
			secondaryForeground: "oklch(0.9219 0 0)",
			muted: "oklch(0.3095 0.0266 266.7132)",
			mutedForeground: "oklch(0.7155 0 0)",
			accent: "oklch(0.3380 0.0589 267.5867)",
			accentForeground: "oklch(0.8823 0.0571 254.1284)",
			destructive: "oklch(0.6368 0.2078 25.3313)",
			destructiveForeground: "oklch(1.0000 0 0)",
			border: "oklch(0.3843 0.0301 269.7337)",
			input: "oklch(0.3843 0.0301 269.7337)",
			ring: "oklch(0.6397 0.1720 36.4421)",
			chart1: "oklch(0.7156 0.0605 248.6845)",
			chart2: "oklch(0.7693 0.0876 34.1875)",
			chart3: "oklch(0.5778 0.0759 254.1573)",
			chart4: "oklch(0.5016 0.0849 259.4902)",
			chart5: "oklch(0.4241 0.0952 264.0306)",
			sidebar: "oklch(0.3100 0.0283 267.7408)",
			sidebarForeground: "oklch(0.9219 0 0)",
			sidebarPrimary: "oklch(0.6397 0.1720 36.4421)",
			sidebarPrimaryForeground: "oklch(1.0000 0 0)",
			sidebarAccent: "oklch(0.3380 0.0589 267.5867)",
			sidebarAccentForeground: "oklch(0.8823 0.0571 254.1284)",
			sidebarBorder: "oklch(0.3843 0.0301 269.7337)",
			sidebarRing: "oklch(0.6397 0.1720 36.4421)",
			radius: "0.75rem",
			shadowX: "0px",
			shadowY: "1px",
			shadowBlur: "3px",
			shadowSpread: "0px",
			shadowOpacity: "0.1",
			shadowColor: "hsl(0 0% 0%)",
			shadow2xs: "0px 1px 3px 0px hsl(0 0% 0% / 0.05)",
			shadowXs: "0px 1px 3px 0px hsl(0 0% 0% / 0.05)",
			shadowSm:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
			shadow:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 1px 2px -1px hsl(0 0% 0% / 0.10)",
			shadowMd:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 2px 4px -1px hsl(0 0% 0% / 0.10)",
			shadowLg:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 4px 6px -1px hsl(0 0% 0% / 0.10)",
			shadowXl:
				"0px 1px 3px 0px hsl(0 0% 0% / 0.10), 0px 8px 10px -1px hsl(0 0% 0% / 0.10)",
			shadow2xl: "0px 1px 3px 0px hsl(0 0% 0% / 0.25)",
			trackingNormal: "0em",
			spacing: "0.25rem",
			...DEFAULT_FONT_PROPERTIES,
		},
		swatches: [
			"oklch(0.6397 0.1720 36.4421)",
			"oklch(0.9383 0.0042 236.4993)",
			"oklch(0.9119 0.0222 243.8174)",
			"oklch(0.3211 0 0)",
		],
	},
	{
		name: "Darkmatter",
		light: {
			background: "oklch(1.0000 0 0)",
			foreground: "oklch(0.2101 0.0318 264.6645)",
			card: "oklch(1.0000 0 0)",
			cardForeground: "oklch(0.2101 0.0318 264.6645)",
			popover: "oklch(1.0000 0 0)",
			popoverForeground: "oklch(0.2101 0.0318 264.6645)",
			primary: "oklch(0.6716 0.1368 48.5130)",
			primaryForeground: "oklch(1.0000 0 0)",
			secondary: "oklch(0.5360 0.0398 196.0280)",
			secondaryForeground: "oklch(1.0000 0 0)",
			muted: "oklch(0.9670 0.0029 264.5419)",
			mutedForeground: "oklch(0.5510 0.0234 264.3637)",
			accent: "oklch(0.9491 0 0)",
			accentForeground: "oklch(0.2101 0.0318 264.6645)",
			destructive: "oklch(0.6368 0.2078 25.3313)",
			destructiveForeground: "oklch(0.9851 0 0)",
			border: "oklch(0.9276 0.0058 264.5313)",
			input: "oklch(0.9276 0.0058 264.5313)",
			ring: "oklch(0.6716 0.1368 48.5130)",
			chart1: "oklch(0.5940 0.0443 196.0233)",
			chart2: "oklch(0.7214 0.1337 49.9802)",
			chart3: "oklch(0.8721 0.0864 68.5474)",
			chart4: "oklch(0.6268 0 0)",
			chart5: "oklch(0.6830 0 0)",
			sidebar: "oklch(0.9670 0.0029 264.5419)",
			sidebarForeground: "oklch(0.2101 0.0318 264.6645)",
			sidebarPrimary: "oklch(0.6716 0.1368 48.5130)",
			sidebarPrimaryForeground: "oklch(1.0000 0 0)",
			sidebarAccent: "oklch(1.0000 0 0)",
			sidebarAccentForeground: "oklch(0.2101 0.0318 264.6645)",
			sidebarBorder: "oklch(0.9276 0.0058 264.5313)",
			sidebarRing: "oklch(0.6716 0.1368 48.5130)",
			radius: "0.75rem",
			shadowX: "0px",
			shadowY: "1px",
			shadowBlur: "4px",
			shadowSpread: "0px",
			shadowOpacity: "0.05",
			shadowColor: "#000000",
			shadow2xs: "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
			shadowXs: "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
			shadowSm:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
			shadow:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
			shadowMd:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05)",
			shadowLg:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05)",
			shadowXl:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05)",
			shadow2xl: "0px 1px 4px 0px hsl(0 0% 0% / 0.13)",
			trackingNormal: "0rem",
			spacing: "0.25rem",
			...DEFAULT_FONT_PROPERTIES,
		},
		dark: {
			background: "oklch(0.1797 0.0043 308.1928)",
			foreground: "oklch(0.8109 0 0)",
			card: "oklch(0.1822 0 0)",
			cardForeground: "oklch(0.8109 0 0)",
			popover: "oklch(0.1797 0.0043 308.1928)",
			popoverForeground: "oklch(0.8109 0 0)",
			primary: "oklch(0.7214 0.1337 49.9802)",
			primaryForeground: "oklch(0.1797 0.0043 308.1928)",
			secondary: "oklch(0.5940 0.0443 196.0233)",
			secondaryForeground: "oklch(0.1797 0.0043 308.1928)",
			muted: "oklch(0.2520 0 0)",
			mutedForeground: "oklch(0.6268 0 0)",
			accent: "oklch(0.3211 0 0)",
			accentForeground: "oklch(0.8109 0 0)",
			destructive: "oklch(0.5940 0.0443 196.0233)",
			destructiveForeground: "oklch(0.1797 0.0043 308.1928)",
			border: "oklch(0.2520 0 0)",
			input: "oklch(0.2520 0 0)",
			ring: "oklch(0.7214 0.1337 49.9802)",
			chart1: "oklch(0.5940 0.0443 196.0233)",
			chart2: "oklch(0.7214 0.1337 49.9802)",
			chart3: "oklch(0.8721 0.0864 68.5474)",
			chart4: "oklch(0.6268 0 0)",
			chart5: "oklch(0.6830 0 0)",
			sidebar: "oklch(0.1822 0 0)",
			sidebarForeground: "oklch(0.8109 0 0)",
			sidebarPrimary: "oklch(0.7214 0.1337 49.9802)",
			sidebarPrimaryForeground: "oklch(0.1797 0.0043 308.1928)",
			sidebarAccent: "oklch(0.3211 0 0)",
			sidebarAccentForeground: "oklch(0.8109 0 0)",
			sidebarBorder: "oklch(0.2520 0 0)",
			sidebarRing: "oklch(0.7214 0.1337 49.9802)",
			radius: "0.75rem",
			shadowX: "0px",
			shadowY: "1px",
			shadowBlur: "4px",
			shadowSpread: "0px",
			shadowOpacity: "0.05",
			shadowColor: "#000000",
			shadow2xs: "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
			shadowXs: "0px 1px 4px 0px hsl(0 0% 0% / 0.03)",
			shadowSm:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
			shadow:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 1px 2px -1px hsl(0 0% 0% / 0.05)",
			shadowMd:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 2px 4px -1px hsl(0 0% 0% / 0.05)",
			shadowLg:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 4px 6px -1px hsl(0 0% 0% / 0.05)",
			shadowXl:
				"0px 1px 4px 0px hsl(0 0% 0% / 0.05), 0px 8px 10px -1px hsl(0 0% 0% / 0.05)",
			shadow2xl: "0px 1px 4px 0px hsl(0 0% 0% / 0.13)",
			trackingNormal: "0rem",
			spacing: "0.25rem",
			...DEFAULT_FONT_PROPERTIES,
		},
		swatches: [
			"oklch(0.6716 0.1368 48.5130)",
			"oklch(0.1797 0.0043 308.1928)",
			"oklch(0.5360 0.0398 196.0233)",
			"oklch(0.2101 0.0318 264.6645)",
		],
	},
	{
		name: "Graphite",
		light: {
			background: "oklch(0.9551 0 0)",
			foreground: "oklch(0.3211 0 0)",
			card: "oklch(0.9702 0 0)",
			cardForeground: "oklch(0.3211 0 0)",
			popover: "oklch(0.9702 0 0)",
			popoverForeground: "oklch(0.3211 0 0)",
			primary: "oklch(0.4891 0 0)",
			primaryForeground: "oklch(1.0000 0 0)",
			secondary: "oklch(0.9067 0 0)",
			secondaryForeground: "oklch(0.3211 0 0)",
			muted: "oklch(0.8853 0 0)",
			mutedForeground: "oklch(0.5103 0 0)",
			accent: "oklch(0.8078 0 0)",
			accentForeground: "oklch(0.3211 0 0)",
			destructive: "oklch(0.5594 0.1900 25.8625)",
			destructiveForeground: "oklch(1.0000 0 0)",
			border: "oklch(0.8576 0 0)",
			input: "oklch(0.9067 0 0)",
			ring: "oklch(0.4891 0 0)",
			chart1: "oklch(0.4891 0 0)",
			chart2: "oklch(0.4863 0.0361 196.0278)",
			chart3: "oklch(0.6534 0 0)",
			chart4: "oklch(0.7316 0 0)",
			chart5: "oklch(0.8078 0 0)",
			sidebar: "oklch(0.9370 0 0)",
			sidebarForeground: "oklch(0.3211 0 0)",
			sidebarPrimary: "oklch(0.4891 0 0)",
			sidebarPrimaryForeground: "oklch(1.0000 0 0)",
			sidebarAccent: "oklch(0.8078 0 0)",
			sidebarAccentForeground: "oklch(0.3211 0 0)",
			sidebarBorder: "oklch(0.8576 0 0)",
			sidebarRing: "oklch(0.4891 0 0)",
			radius: "0.35rem",
			shadowX: "0px",
			shadowY: "2px",
			shadowBlur: "0px",
			shadowSpread: "0px",
			shadowOpacity: "0.15",
			shadowColor: "hsl(0 0% 20% / 0.1)",
			shadow2xs: "0px 2px 0px 0px hsl(0 0% 20% / 0.07)",
			shadowXs: "0px 2px 0px 0px hsl(0 0% 20% / 0.07)",
			shadowSm:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 1px 2px -1px hsl(0 0% 20% / 0.15)",
			shadow:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 1px 2px -1px hsl(0 0% 20% / 0.15)",
			shadowMd:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 2px 4px -1px hsl(0 0% 20% / 0.15)",
			shadowLg:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 4px 6px -1px hsl(0 0% 20% / 0.15)",
			shadowXl:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 8px 10px -1px hsl(0 0% 20% / 0.15)",
			shadow2xl: "0px 2px 0px 0px hsl(0 0% 20% / 0.38)",
			trackingNormal: "0em",
			spacing: "0.25rem",
			...DEFAULT_FONT_PROPERTIES,
		},
		dark: {
			background: "oklch(0.2178 0 0)",
			foreground: "oklch(0.8853 0 0)",
			card: "oklch(0.2435 0 0)",
			cardForeground: "oklch(0.8853 0 0)",
			popover: "oklch(0.2435 0 0)",
			popoverForeground: "oklch(0.8853 0 0)",
			primary: "oklch(0.7058 0 0)",
			primaryForeground: "oklch(0.2178 0 0)",
			secondary: "oklch(0.3092 0 0)",
			secondaryForeground: "oklch(0.8853 0 0)",
			muted: "oklch(0.2850 0 0)",
			mutedForeground: "oklch(0.5999 0 0)",
			accent: "oklch(0.3715 0 0)",
			accentForeground: "oklch(0.8853 0 0)",
			destructive: "oklch(0.6591 0.1530 22.1703)",
			destructiveForeground: "oklch(1.0000 0 0)",
			border: "oklch(0.3290 0 0)",
			input: "oklch(0.3092 0 0)",
			ring: "oklch(0.7058 0 0)",
			chart1: "oklch(0.7058 0 0)",
			chart2: "oklch(0.6714 0.0339 206.3482)",
			chart3: "oklch(0.5452 0 0)",
			chart4: "oklch(0.4604 0 0)",
			chart5: "oklch(0.3715 0 0)",
			sidebar: "oklch(0.2393 0 0)",
			sidebarForeground: "oklch(0.8853 0 0)",
			sidebarPrimary: "oklch(0.7058 0 0)",
			sidebarPrimaryForeground: "oklch(0.2178 0 0)",
			sidebarAccent: "oklch(0.3715 0 0)",
			sidebarAccentForeground: "oklch(0.8853 0 0)",
			sidebarBorder: "oklch(0.3290 0 0)",
			sidebarRing: "oklch(0.7058 0 0)",
			radius: "0.35rem",
			shadowX: "0px",
			shadowY: "2px",
			shadowBlur: "0px",
			shadowSpread: "0px",
			shadowOpacity: "0.15",
			shadowColor: "hsl(0 0% 20% / 0.1)",
			shadow2xs: "0px 2px 0px 0px hsl(0 0% 20% / 0.07)",
			shadowXs: "0px 2px 0px 0px hsl(0 0% 20% / 0.07)",
			shadowSm:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 1px 2px -1px hsl(0 0% 20% / 0.15)",
			shadow:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 1px 2px -1px hsl(0 0% 20% / 0.15)",
			shadowMd:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 2px 4px -1px hsl(0 0% 20% / 0.15)",
			shadowLg:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 4px 6px -1px hsl(0 0% 20% / 0.15)",
			shadowXl:
				"0px 2px 0px 0px hsl(0 0% 20% / 0.15), 0px 8px 10px -1px hsl(0 0% 20% / 0.15)",
			shadow2xl: "0px 2px 0px 0px hsl(0 0% 20% / 0.38)",
			trackingNormal: "0em",
			spacing: "0.25rem",
			...DEFAULT_FONT_PROPERTIES,
		},
		swatches: [
			"oklch(0.4891 0 0)",
			"oklch(0.9551 0 0)",
			"oklch(0.7058 0 0)",
			"oklch(0.3211 0 0)",
		],
	},
];

export const DEFAULT_THEME_COLOR = 34.44;

export interface ThemeColorPalette {
	primary: string;
	primaryForeground: string;
	ring: string;
	sidebarPrimary: string;
	sidebarPrimaryForeground: string;
	chart1: string;
	chart5: string;
}

function generateOKLCH(l: number, c: number, h: number): string {
	return `oklch(${l} ${c} ${h})`;
}

export function generateLightPalette(hue: number): ThemeColorPalette {
	return {
		primary: generateOKLCH(0.607, 0.0936, hue),
		primaryForeground: generateOKLCH(1, 0, 0),
		ring: generateOKLCH(0.607, 0.0936, hue),
		sidebarPrimary: generateOKLCH(0.607, 0.0936, hue),
		sidebarPrimaryForeground: generateOKLCH(0.9881, 0, 0),
		chart1: generateOKLCH(0.5583, 0.1276, hue),
		chart5: generateOKLCH(0.5608, 0.1348, hue),
	};
}

export function generateDarkPalette(hue: number): ThemeColorPalette {
	return {
		primary: generateOKLCH(0.607, 0.0936, hue),
		primaryForeground: generateOKLCH(1, 0, 0),
		ring: generateOKLCH(0.607, 0.0936, hue),
		sidebarPrimary: generateOKLCH(0.325, 0, 0),
		sidebarPrimaryForeground: generateOKLCH(0.9881, 0, 0),
		chart1: generateOKLCH(0.5583, 0.1276, hue),
		chart5: generateOKLCH(0.5608, 0.1348, hue),
	};
}

export function applyThemeColors(hue: number, isDark: boolean): void {
	if (typeof window === "undefined") return;

	const palette = isDark ? generateDarkPalette(hue) : generateLightPalette(hue);
	const root = window.document.documentElement;

	root.style.setProperty("--primary", palette.primary);
	root.style.setProperty("--primary-foreground", palette.primaryForeground);
	root.style.setProperty("--ring", palette.ring);
	root.style.setProperty("--sidebar-primary", palette.sidebarPrimary);
	root.style.setProperty(
		"--sidebar-primary-foreground",
		palette.sidebarPrimaryForeground,
	);
	root.style.setProperty("--chart-1", palette.chart1);
	root.style.setProperty("--chart-5", palette.chart5);
}

export function applyFontFamily(fontFamily: FontFamily): void {
	if (typeof window === "undefined") return;

	const root = window.document.documentElement;
	root.style.setProperty("--font-sans", fontFamily.sans);
	root.style.setProperty("--font-serif", fontFamily.serif);
	root.style.setProperty("--font-mono", fontFamily.mono);
}

function applyThemeVariables(
	variables: ThemeVariables,
	root: HTMLElement,
): void {
	root.style.setProperty("--background", variables.background);
	root.style.setProperty("--foreground", variables.foreground);
	root.style.setProperty("--card", variables.card);
	root.style.setProperty("--card-foreground", variables.cardForeground);
	root.style.setProperty("--popover", variables.popover);
	root.style.setProperty("--popover-foreground", variables.popoverForeground);
	root.style.setProperty("--primary", variables.primary);
	root.style.setProperty("--primary-foreground", variables.primaryForeground);
	root.style.setProperty("--secondary", variables.secondary);
	root.style.setProperty(
		"--secondary-foreground",
		variables.secondaryForeground,
	);
	root.style.setProperty("--muted", variables.muted);
	root.style.setProperty("--muted-foreground", variables.mutedForeground);
	root.style.setProperty("--accent", variables.accent);
	root.style.setProperty("--accent-foreground", variables.accentForeground);
	root.style.setProperty("--destructive", variables.destructive);
	root.style.setProperty(
		"--destructive-foreground",
		variables.destructiveForeground,
	);
	root.style.setProperty("--border", variables.border);
	root.style.setProperty("--input", variables.input);
	root.style.setProperty("--ring", variables.ring);
	root.style.setProperty("--chart-1", variables.chart1);
	root.style.setProperty("--chart-2", variables.chart2);
	root.style.setProperty("--chart-3", variables.chart3);
	root.style.setProperty("--chart-4", variables.chart4);
	root.style.setProperty("--chart-5", variables.chart5);
	root.style.setProperty("--sidebar", variables.sidebar);
	root.style.setProperty("--sidebar-foreground", variables.sidebarForeground);
	root.style.setProperty("--sidebar-primary", variables.sidebarPrimary);
	root.style.setProperty(
		"--sidebar-primary-foreground",
		variables.sidebarPrimaryForeground,
	);
	root.style.setProperty("--sidebar-accent", variables.sidebarAccent);
	root.style.setProperty(
		"--sidebar-accent-foreground",
		variables.sidebarAccentForeground,
	);
	root.style.setProperty("--sidebar-border", variables.sidebarBorder);
	root.style.setProperty("--sidebar-ring", variables.sidebarRing);
	root.style.setProperty("--font-sans", variables.fontSans);
	root.style.setProperty("--font-serif", variables.fontSerif);
	root.style.setProperty("--font-mono", variables.fontMono);
	root.style.setProperty("--radius", variables.radius);
	root.style.setProperty("--shadow-x", variables.shadowX);
	root.style.setProperty("--shadow-y", variables.shadowY);
	root.style.setProperty("--shadow-blur", variables.shadowBlur);
	root.style.setProperty("--shadow-spread", variables.shadowSpread);
	root.style.setProperty("--shadow-opacity", variables.shadowOpacity);
	root.style.setProperty("--shadow-color", variables.shadowColor);
	root.style.setProperty("--shadow-2xs", variables.shadow2xs);
	root.style.setProperty("--shadow-xs", variables.shadowXs);
	root.style.setProperty("--shadow-sm", variables.shadowSm);
	root.style.setProperty("--shadow", variables.shadow);
	root.style.setProperty("--shadow-md", variables.shadowMd);
	root.style.setProperty("--shadow-lg", variables.shadowLg);
	root.style.setProperty("--shadow-xl", variables.shadowXl);
	root.style.setProperty("--shadow-2xl", variables.shadow2xl);
	root.style.setProperty("--tracking-normal", variables.trackingNormal);
	root.style.setProperty("--spacing", variables.spacing);
}

export function applyCompleteTheme(
	theme: CompleteTheme,
	isDark: boolean,
): number {
	if (typeof window === "undefined") return DEFAULT_THEME_COLOR;

	const root = window.document.documentElement;
	const variables = isDark ? theme.dark : theme.light;

	applyThemeVariables(variables, root);

	const hue = extractHueFromOKLCH(variables.primary);

	return hue;
}

type Oklch = { l: number; c: number; h: number };
type Hsl = { h: number; s: number; l: number };

export function oklchToHsl(oklch: Oklch): Hsl {
	const { l, c, h } = oklch;

	const hRad = (h * Math.PI) / 180;
	const a = c * Math.cos(hRad);
	const b = c * Math.sin(hRad);

	const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
	const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
	const s_ = l - 0.0894841775 * a - 1.291485548 * b;

	const l3 = l_ * l_ * l_;
	const m3 = m_ * m_ * m_;
	const s3 = s_ * s_ * s_;

	let r = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
	let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3;
	let bl = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3;

	const transfer = (v: number) => {
		const vClamped = v < 0 ? 0 : v > 1 ? 1 : v;
		return vClamped <= 0.0031308
			? 12.92 * vClamped
			: 1.055 * Math.pow(vClamped, 1 / 2.4) - 0.055;
	};

	r = transfer(r);
	g = transfer(g);
	bl = transfer(bl);

	const max = Math.max(r, g, bl);
	const min = Math.min(r, g, bl);
	let hHsl = 0;
	let sHsl = 0;
	const lHsl = (max + min) / 2;

	if (max !== min) {
		const d = max - min;
		sHsl = lHsl > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r:
				hHsl = (g - bl) / d + (g < bl ? 6 : 0);
				break;
			case g:
				hHsl = (bl - r) / d + 2;
				break;
			case bl:
				hHsl = (r - g) / d + 4;
				break;
		}
		hHsl /= 6;
	}

	return {
		h: Math.round(hHsl * 360),
		s: Math.round(sHsl * 100),
		l: Math.round(lHsl * 100),
	};
}

export function getHslStringFromOklchString(oklchStr: string): string {
	const match = oklchStr.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/);

	if (!match) return "transparent";

	const [, l, c, h] = match.map(Number);
	const hsl = oklchToHsl({ l, c, h });

	return `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`;
}

export function extractHueFromOKLCH(color: string): number {
	const match = color.match(/oklch\(([^)]+)\)/);
	if (match) {
		const parts = match[1].trim().split(/\s+/);
		if (parts.length >= 3) {
			const hue = Number.parseFloat(parts[2]);
			if (!Number.isNaN(hue) && hue >= 0 && hue <= 360) {
				return hue;
			}
		}
	}
	return DEFAULT_THEME_COLOR;
}
