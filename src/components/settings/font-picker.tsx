import { CheckIcon } from "lucide-react";

import { type FontFamily, PRESET_FONTS } from "@/lib/theme-colors";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";

export function FontPicker() {
	const fontFamily = useThemeStore((s) => s.fontFamily);
	const setFontFamily = useThemeStore((s) => s.setFontFamily);

	const handleFontClick = (selectedFont: FontFamily) => {
		setFontFamily(selectedFont.name);
	};

	return (
		<div className="space-y-4">
			<div className="space-y-1.5">
				<p className="text-foreground text-sm font-medium leading-none">
					Escolha a fonte
				</p>
				<p className="text-muted-foreground text-xs">
					Selecione uma família de fontes para o aplicativo
				</p>
			</div>

			<div className="space-y-3">
				{PRESET_FONTS.map((presetFont) => {
					const isSelected = fontFamily === presetFont.name;
					return (
						<button
							key={presetFont.name}
							type="button"
							onClick={() => handleFontClick(presetFont)}
							className={cn(
								"group relative flex w-full items-center justify-between rounded-md border p-3 transition-all border-input bg-background hover:border-ring/50 hover:bg-accent/50",
								isSelected &&
									"bg-accent/30 shadow-sm ring-offset-2 ring-1 ring-primary ring-offset-background",
							)}
							aria-label={`Selecionar fonte ${presetFont.name}`}
							aria-pressed={isSelected}
						>
							<div className="flex items-center gap-3">
								<p
									className="text-3xl leading-none"
									style={{ fontFamily: presetFont.sans }}
								>
									Aa
								</p>

								<div className="flex flex-col items-start gap-0.5">
									<span
										className="text-foreground text-sm font-medium"
										style={{ fontFamily: presetFont.sans }}
									>
										{presetFont.name}
									</span>
									<span
										className="text-muted-foreground text-xs"
										style={{ fontFamily: presetFont.sans }}
									>
										Lorem ipsum dolor sit amet.
									</span>
								</div>
							</div>

							{isSelected && (
								<CheckIcon
									className="absolute right-3 text-foreground size-4"
									aria-hidden="true"
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
