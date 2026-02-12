import { MenuIcon, PanelLeftIcon, PanelRightIcon } from "lucide-react";
import * as React from "react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { DropdownMenuProfile } from "@/components/layout/dropdown-menu-profile";
import { Sidebar } from "@/components/layout/sidebar";
import { useSidebarState } from "@/components/layout/sidebar-state";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";

export function Header() {
	const [open, setOpen] = React.useState(false);
	const { collapsed, toggleCollapsed } = useSidebarState();

	return (
		<div className="sticky top-0 z-50 flex items-center gap-4 bg-sidebar pr-4 py-3 backdrop-blur md:gap-6 md:pr-8 md:pb-8 md:pt-6">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className="md:hidden"
						aria-label="Abrir menu"
					>
						<MenuIcon />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="p-0">
					<SheetHeader className="border-b">
						<SheetTitle>Menu</SheetTitle>
					</SheetHeader>
					<Sidebar variant="mobile" onNavigate={() => setOpen(false)} />
				</SheetContent>
			</Sheet>

			<div className="flex min-w-0 flex-1 items-center gap-2">
				<Button
					variant="ghost"
					size="icon"
					className="hidden md:inline-flex"
					onClick={toggleCollapsed}
					aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
					title={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
				>
					{collapsed ? <PanelLeftIcon /> : <PanelRightIcon />}
				</Button>

				<div className="min-w-0">
					<Breadcrumbs className="truncate" />
				</div>
			</div>

			<div className="flex items-center gap-4">
				<DropdownMenuProfile />
			</div>
		</div>
	);
}
