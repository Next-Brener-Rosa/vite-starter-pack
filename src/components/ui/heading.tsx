import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const Heading = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("space-y-0.5", className)} {...props} />
));

Heading.displayName = "Heading";

const headingTitleVariants = cva(
	"font-semibold leading-none tracking-tight",
	{
		variants: {
			size: {
				default: "text-2xl",
				sm: "text-lg",
				lg: "text-3xl",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

export interface HeadingTitleProps
	extends React.HTMLAttributes<HTMLHeadingElement>,
		VariantProps<typeof headingTitleVariants> {}

const HeadingTitle = React.forwardRef<HTMLHeadingElement, HeadingTitleProps>(
	({ className, size, ...props }, ref) => (
		<h2
			ref={ref}
			className={cn(headingTitleVariants({ size, className }))}
			{...props}
		/>
	),
);

HeadingTitle.displayName = "HeadingTitle";

const headingDescriptionVariants = cva("text-muted-foreground", {
	variants: {
		size: {
			default: "text-sm",
			sm: "text-xs",
			lg: "text-base",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

export interface HeadingDescriptionProps
	extends React.HTMLAttributes<HTMLParagraphElement>,
		VariantProps<typeof headingDescriptionVariants> {}

const HeadingDescription = React.forwardRef<
	HTMLParagraphElement,
	HeadingDescriptionProps
>(({ className, size, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(headingDescriptionVariants({ size, className }))}
		{...props}
	/>
));

HeadingDescription.displayName = "HeadingDescription";

export { Heading, HeadingTitle, HeadingDescription, headingTitleVariants, headingDescriptionVariants };
