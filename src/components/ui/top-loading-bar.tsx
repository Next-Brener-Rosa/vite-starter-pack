import * as React from "react";
import LoadingBar, { type LoadingBarRef } from "react-top-loading-bar";

import { cn } from "@/lib/utils";

type TopLoadingBarProps = {
	className?: string;
	color?: string;
	height?: number;
	shadow?: boolean;
};

export const TopLoadingBar = React.forwardRef<
	LoadingBarRef,
	TopLoadingBarProps
>(({ className, color = "var(--primary)", height = 3, shadow = true }, ref) => {
	return (
		<div className={cn("fixed top-0 left-0 right-0 z-60", className)}>
			<LoadingBar
				color={color}
				height={height}
				ref={ref}
				shadow={shadow}
				shadowStyle={{
					boxShadow: `0 0 10px ${color}, 0 0 5px ${color}`,
				}}
			/>
		</div>
	);
});

TopLoadingBar.displayName = "TopLoadingBar";
