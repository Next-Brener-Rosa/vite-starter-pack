import { createFileRoute } from "@tanstack/react-router";
import { LayoutDashboardIcon, RocketIcon, ShieldCheckIcon, UsersIcon } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heading, HeadingDescription, HeadingTitle } from "@/components/ui/heading";

export const Route = createFileRoute("/(protected)/dashboard")({
	component: DashboardPage,
});

function StatsCard({
	title,
	value,
	description,
	icon: Icon,
}: {
	title: string;
	value: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<Icon className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{value}</div>
				<p className="text-xs text-muted-foreground">{description}</p>
			</CardContent>
		</Card>
	);
}

function DashboardPage() {
	return (
		<div className="space-y-6">
			<Heading>
				<HeadingTitle>Dashboard</HeadingTitle>
				<HeadingDescription>
					Bem-vindo ao seu painel de controle. Este é um exemplo de dashboard
					para o starter pack.
				</HeadingDescription>
			</Heading>

			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					title="Usuários Ativos"
					value="1,234"
					description="Usuários cadastrados no sistema"
					icon={UsersIcon}
				/>
				<StatsCard
					title="Permissões"
					value="48"
					description="Permissões configuradas"
					icon={ShieldCheckIcon}
				/>
				<StatsCard
					title="Requisições"
					value="12.5k"
					description="Requisições nas últimas 24h"
					icon={RocketIcon}
				/>
				<StatsCard
					title="Uptime"
					value="99.9%"
					description="Disponibilidade do sistema"
					icon={LayoutDashboardIcon}
				/>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Início Rápido</CardTitle>
						<CardDescription>
							Comece a personalizar seu projeto
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<h4 className="font-medium">1. Configure as variáveis de ambiente</h4>
							<p className="text-sm text-muted-foreground">
								Copie o arquivo <code className="bg-muted px-1 rounded">.env.example</code> para{" "}
								<code className="bg-muted px-1 rounded">.env</code> e configure as variáveis.
							</p>
						</div>
						<div className="space-y-2">
							<h4 className="font-medium">2. Configure a API</h4>
							<p className="text-sm text-muted-foreground">
								Atualize o <code className="bg-muted px-1 rounded">orval.config.ts</code> com a URL
								do seu Swagger/OpenAPI e execute{" "}
								<code className="bg-muted px-1 rounded">pnpm generate:api</code>.
							</p>
						</div>
						<div className="space-y-2">
							<h4 className="font-medium">3. Personalize a navegação</h4>
							<p className="text-sm text-muted-foreground">
								Edite <code className="bg-muted px-1 rounded">src/config/navigation.ts</code> para
								adicionar seus itens de menu.
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Recursos Incluídos</CardTitle>
						<CardDescription>
							O que este starter pack oferece
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2 text-sm">
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								Autenticação JWT com refresh token automático
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								Sistema de permissões (RBAC)
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								Componentes UI (shadcn/ui + Radix)
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								TanStack Router (file-based routing)
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								TanStack Query (data fetching)
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								Zustand (state management)
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								React Hook Form + Zod (forms)
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								WebSocket (Laravel Echo)
							</li>
							<li className="flex items-center gap-2">
								<span className="h-2 w-2 rounded-full bg-green-500" />
								Geração de API Client (Orval)
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
