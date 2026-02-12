import * as DialogPrimitive from "@radix-ui/react-dialog";
import { XIcon } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetPortal = DialogPrimitive.Portal;
const SheetClose = DialogPrimitive.Close;

function SheetOverlay({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
	return (
		<DialogPrimitive.Overlay
			className={cn(
				"fixed inset-0 z-50 bg-black/40 backdrop-blur-sm",
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
				className,
			)}
			{...props}
		/>
	);
}

const SheetContent = React.forwardRef<
	React.ElementRef<typeof DialogPrimitive.Content>,
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
		side?: "left" | "right";
	}
>(({ className, children, side = "left", ...props }, ref) => {
	const sideClasses =
		side === "left"
			? "inset-y-0 left-0 w-[min(20rem,85vw)] border-r data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
			: "inset-y-0 right-0 w-[min(20rem,85vw)] border-l data-[state=open]:slide-in-from-right data-[state=closed]:slide-out-to-right";

	return (
		<SheetPortal>
			<SheetOverlay />
			<DialogPrimitive.Content
				ref={ref}
				className={cn(
					"fixed z-50 flex h-full flex-col bg-background text-foreground shadow-lg outline-none",
					"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:duration-200 data-[state=closed]:duration-200",
					sideClasses,
					className,
				)}
				{...props}
			>
				{children}
				<DialogPrimitive.Close
					className={cn(
						"absolute right-3 top-3 rounded-md p-1",
						"opacity-70 transition-opacity hover:opacity-100",
						"focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
					)}
				>
					<XIcon className="size-4" />
					<span className="sr-only">Fechar</span>
				</DialogPrimitive.Close>
			</DialogPrimitive.Content>
		</SheetPortal>
	);
});
SheetContent.displayName = DialogPrimitive.Content.displayName;

function SheetHeader({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			className={cn("flex flex-col gap-1.5 px-4 py-3", className)}
			{...props}
		/>
	);
}

function SheetTitle({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>) {
	return (
		<DialogPrimitive.Title
			className={cn("text-sm font-semibold", className)}
			{...props}
		/>
	);
}

function SheetDescription({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>) {
	return (
		<DialogPrimitive.Description
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Sheet,
	SheetTrigger,
	SheetPortal,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
};
