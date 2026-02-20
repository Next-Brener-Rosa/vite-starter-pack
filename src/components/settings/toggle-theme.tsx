import { CheckIcon, MinusIcon } from "lucide-react";
import * as React from "react";
import { ColorPicker } from "@/components/settings/color-picker";
import { FontPicker } from "@/components/settings/font-picker";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { applyThemeColors } from "@/lib/theme-colors";
import { cn } from "@/lib/utils";
import { type Theme, useThemeStore } from "@/stores/theme-store";

const items: {
	value: Theme;
	label: string;
	image: string;
}[] = [
	{ value: "light", label: "Claro", image: "/ui-light.png" },
	{ value: "dark", label: "Escuro", image: "/ui-dark.png" },
	{ value: "system", label: "Sistema", image: "/ui-system.png" },
];

export function ToggleTheme() {
	const id = React.useId();

	const theme = useThemeStore((s) => s.theme);
	const setTheme = useThemeStore((s) => s.setTheme);
	const themeColor = useThemeStore((s) => s.themeColor);
	const hydrate = useThemeStore((s) => s.hydrate);

	React.useEffect(() => {
		hydrate();
	}, [hydrate]);

	React.useEffect(() => {
		if (theme !== "system" || typeof window === "undefined") return;

		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = () => {
			const isDark = mediaQuery.matches;
			applyThemeColors(themeColor, isDark);
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, [theme, themeColor]);

	return (
		<div className="space-y-6">
			<fieldset className="space-y-4">
				<legend className="text-foreground text-sm leading-none font-medium">
					Escolha o tema
				</legend>
				<RadioGroup
					className="grid grid-cols-3 xl:grid-cols-4 gap-4"
					value={theme}
					onValueChange={(value) => setTheme(value as Theme)}
				>
					{items.map((item) => (
						<label key={`${id}-${item.value}`} htmlFor={`${id}-${item.value}`}>
							<RadioGroupItem
								id={`${id}-${item.value}`}
								value={item.value}
								className="peer sr-only after:absolute after:inset-0"
							/>
							<img
								src={item.image}
								alt={item.label}
								width={88}
								height={70}
								className={cn(
									"group relative flex w-full items-center justify-between rounded-md border transition-all border-input bg-background hover:border-ring/50 hover:bg-accent/50",
									item.value === theme &&
										"bg-accent/30 shadow-sm ring-offset-2 ring-1 ring-primary ring-offset-background",
								)}
							/>
							<span className="group peer-data-[state=unchecked]:text-muted-foreground/70 mt-2 flex items-center gap-1">
								<CheckIcon
									size={16}
									className="group-peer-data-[state=unchecked]:hidden"
									aria-hidden="true"
								/>
								<MinusIcon
									size={16}
									className="group-peer-data-[state=checked]:hidden"
									aria-hidden="true"
								/>
								<span className="text-xs font-medium">{item.label}</span>
							</span>
						</label>
					))}
				</RadioGroup>
			</fieldset>

			<Separator />

			<ColorPicker />

			<Separator />

			<FontPicker />
		</div>
	);
}
