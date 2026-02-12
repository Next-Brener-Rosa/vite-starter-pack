---
name: vite-routes
description: Roteamento file-based com TanStack Router. Use quando criar novas paginas, rotas publicas, rotas protegidas, rotas dinamicas, ou adicionar itens ao menu de navegacao.
---

# Roteamento com TanStack Router

Sistema de rotas baseado em arquivos.

## Estrutura de Pastas

```
src/routes/
├── __root.tsx           # Layout raiz (providers globais)
├── sobre.tsx            # Pagina publica (/sobre)
├── (auth)/              # Grupo: paginas de autenticacao
│   ├── layout.tsx       # Redireciona se ja autenticado
│   ├── index.tsx        # /entrar (login)
│   └── recuperar-senha.tsx
└── (protected)/         # Grupo: paginas privadas
    ├── layout.tsx       # Requer autenticacao
    ├── dashboard.tsx    # /dashboard
    └── usuarios/        # Rotas aninhadas
        ├── index.tsx    # /usuarios
        └── [id].tsx     # /usuarios/:id
```

## Tipos de Rotas

| Local | Tipo | Comportamento |
|-------|------|---------------|
| `src/routes/` (raiz) | Publica | Acessivel por qualquer visitante |
| `src/routes/(auth)/` | Autenticacao | Redireciona para /dashboard se logado |
| `src/routes/(protected)/` | Privada | Redireciona para /entrar se nao logado |

## Criar Pagina Publica

```tsx
// src/routes/sobre.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sobre")({
  component: SobrePage,
});

function SobrePage() {
  return <div>Conteudo publico</div>;
}
```

## Criar Pagina Protegida

```tsx
// src/routes/(protected)/usuarios.tsx
import { createFileRoute } from "@tanstack/react-router";
import { ensureAuthenticated, ensureRoutePermissions } from "@/utils/route-guards";

export const Route = createFileRoute("/(protected)/usuarios")({
  staticData: {
    requiredPermissions: ["users.view"], // Opcional
  },
  beforeLoad: async () => {
    await ensureAuthenticated();
    ensureRoutePermissions({ requiredPermissions: ["users.view"] }); // Opcional
  },
  component: UsuariosPage,
});

function UsuariosPage() {
  return <div>Pagina protegida</div>;
}
```

## Rota Dinamica

```tsx
// src/routes/(protected)/usuarios/[id].tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(protected)/usuarios/$id")({
  component: UsuarioDetalhePage,
});

function UsuarioDetalhePage() {
  const { id } = Route.useParams();
  return <div>Usuario {id}</div>;
}
```

## Adicionar ao Menu

Em `src/config/navigation.ts`:

```tsx
import { UsersIcon } from "lucide-react";

export const mainNavItems: NavItem[] = [
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: UsersIcon,
    permissions: ["users.view"], // Opcional
  },
];
```

## Arquivos Relevantes

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/routes/` | Todas as rotas |
| `src/utils/route-guards.ts` | Guards de autenticacao/permissao |
| `src/config/navigation.ts` | Itens do menu |
| `src/route-tree.gen.ts` | Arvore gerada (nao editar) |
