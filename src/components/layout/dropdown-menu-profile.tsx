import { useNavigate } from "@tanstack/react-router";
import { LogOutIcon, Settings2Icon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { getInitialsCharacters } from "@/utils/get-initial-characters";

export function DropdownMenuProfile() {
	const { user, signOut } = useAuth();

	const navigate = useNavigate();

	const handleSignOut = () => {
		signOut();
		navigate({ to: "/entrar" });
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-8">
					<AvatarImage
						src={user?.full_path_profile_picture ?? undefined}
						alt={user?.name}
					/>
					<AvatarFallback>
						{getInitialsCharacters(user?.name ?? "")}
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent side="bottom" align="end" className="min-w-48">
				<div className="-space-y-0.5 px-2 py-1.5">
					<p className="font-semibold text-sm">{user?.name}</p>
					<p className="text-xs text-muted-foreground">{user?.email}</p>
				</div>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={() => navigate({ to: "/configuracoes" })}>
					<Settings2Icon />
					Configurações
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem onSelect={handleSignOut}>
					<LogOutIcon />
					Sair
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
