import { cva, type VariantProps } from "class-variance-authority";
import { CheckIcon, EyeIcon, EyeOffIcon, XIcon } from "lucide-react";
import * as React from "react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const passwordInputVariants = cva("", {
	variants: {
		showStrength: {
			true: "",
			false: "",
		},
	},
	defaultVariants: {
		showStrength: true,
	},
});

export interface PasswordInputProps
	extends Omit<React.ComponentProps<typeof Input>, "type">,
		VariantProps<typeof passwordInputVariants> {
	showStrength?: boolean;
	onValueChange?: (value: string) => void;
}

interface PasswordRequirement {
	regex: RegExp;
	text: string;
}

const defaultRequirements: PasswordRequirement[] = [
	{ regex: /.{8,}/, text: "Pelo menos 8 caracteres" },
	{ regex: /[0-9]/, text: "Pelo menos 1 número" },
	{ regex: /[a-z]/, text: "Pelo menos 1 letra minúscula" },
	{ regex: /[A-Z]/, text: "Pelo menos 1 letra maiúscula" },
	{ regex: /[!@#$%^&*(),.?":{}|<>]/, text: "Pelo menos 1 caractere especial" },
];

const checkStrength = (
	password: string,
	requirements: PasswordRequirement[] = defaultRequirements,
) => {
	return requirements.map((req) => ({
		met: req.regex.test(password),
		text: req.text,
	}));
};

const getStrengthColor = (score: number) => {
	if (score === 0) return "bg-border";
	if (score <= 1) return "bg-rose-600";
	if (score <= 2) return "bg-orange-600";
	if (score === 3) return "bg-amber-600";
	return "bg-emerald-600";
};

const getStrengthText = (score: number) => {
	if (score === 0) return "Digite uma senha";
	if (score <= 1) return "Senha muito fraca";
	if (score <= 2) return "Senha fraca";
	if (score === 3) return "Senha média";
	return "Senha forte";
};

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
	(
		{
			className,
			showStrength = true,
			onValueChange,
			onChange,
			value,
			...props
		},
		ref,
	) => {
		const id = React.useId();
		const [isVisible, setIsVisible] = React.useState(false);

		const passwordValue = typeof value === "string" ? value : "";

		const strength = useMemo(
			() => checkStrength(passwordValue),
			[passwordValue],
		);

		const strengthScore = useMemo(() => {
			return strength.filter((req) => req.met).length;
		}, [strength]);

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			onChange?.(e);
			onValueChange?.(e.target.value);
		};

		const toggleVisibility = () => setIsVisible((prev) => !prev);

		return (
			<div className={cn(passwordInputVariants({ showStrength }), className)}>
				<div className="relative">
					<Input
						{...props}
						ref={ref}
						id={id}
						type={isVisible ? "text" : "password"}
						value={value}
						onChange={handleChange}
						aria-describedby={showStrength ? `${id}-description` : undefined}
						className={cn("pe-9", className)}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						className="absolute top-0 right-0 h-full px-3 hover:bg-transparent"
						onClick={toggleVisibility}
						aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
						aria-pressed={isVisible}
						title={isVisible ? "Ocultar senha" : "Mostrar senha"}
					>
						{isVisible ? (
							<EyeOffIcon className="size-4 text-muted-foreground" />
						) : (
							<EyeIcon className="size-4 text-muted-foreground" />
						)}
					</Button>
				</div>

				{showStrength && (
					<>
						{/* Password strength indicator */}
						<div
							aria-label="Força da senha"
							aria-valuemax={4}
							aria-valuemin={0}
							aria-valuenow={strengthScore}
							className="mt-3 mb-4 h-1 w-full overflow-hidden rounded-full bg-border"
							role="progressbar"
							tabIndex={-1}
						>
							<div
								className={cn(
									"h-full transition-all duration-500 ease-out",
									getStrengthColor(strengthScore),
								)}
								style={{ width: `${(strengthScore / 4) * 100}%` }}
							/>
						</div>

						<p
							className="mb-2 text-xs font-medium text-foreground"
							id={`${id}-description`}
						>
							{getStrengthText(strengthScore)}. Deve conter:
						</p>

						<ul aria-label="Requisitos da senha" className="space-y-1.5">
							{strength.map((req) => (
								<li className="flex items-center gap-1.5" key={req.text}>
									{req.met ? (
										<CheckIcon
											aria-hidden="true"
											className={cn(
												"size-3.5",
												req.met ? "text-emerald-600" : "text-muted-foreground",
											)}
										/>
									) : (
										<XIcon
											aria-hidden="true"
											className={cn(
												"size-3.5",
												req.met ? "text-emerald-600" : "text-muted-foreground",
											)}
										/>
									)}
									<span
										className={cn(
											"text-xs",
											req.met ? "text-foreground" : "text-muted-foreground",
										)}
									>
										{req.text}
										<span className="sr-only">
											{req.met
												? " - Requisito atendido"
												: " - Requisito não atendido"}
										</span>
									</span>
								</li>
							))}
						</ul>
					</>
				)}
			</div>
		);
	},
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput, passwordInputVariants };
