---
name: vite-permissions
description: Sistema RBAC com guards de rotas e componentes. Use quando verificar permissoes, proteger rotas, ou esconder elementos baseado em acesso do usuario.
---

# Sistema de Permissoes (RBAC)

Sistema de controle de acesso baseado em roles e permissoes.

## Hook usePermissions

```tsx
import { usePermissions } from "@/hooks/use-permissions";

function MeuComponente() {
  const { hasPermission, hasAnyPermission } = usePermissions();

  if (hasPermission("users.create")) {
    // Usuario pode criar usuarios
  }

  if (hasAnyPermission(["users.edit", "users.delete"])) {
    // Usuario pode editar OU deletar
  }
}
```

## Componente PermissionGuard

Renderiza conteudo apenas se usuario tem permissao:

```tsx
import { PermissionGuard } from "@/providers/permissions-provider";

<PermissionGuard permission="users.delete">
  <Button variant="destructive">Deletar</Button>
</PermissionGuard>

// Multiplas permissoes (qualquer uma)
<PermissionGuard permissions={["users.edit", "users.delete"]}>
  <ActionsMenu />
</PermissionGuard>
```

## Proteger Rotas

Em `src/routes/(protected)/`:

```tsx
import { createFileRoute } from "@tanstack/react-router";
import { ensureAuthenticated, ensureRoutePermissions } from "@/utils/route-guards";

export const Route = createFileRoute("/(protected)/usuarios")({
  staticData: {
    requiredPermissions: ["users.view"],
  },
  beforeLoad: async () => {
    await ensureAuthenticated();
    ensureRoutePermissions({ requiredPermissions: ["users.view"] });
  },
  component: UsuariosPage,
});
```

## Esconder Itens do Menu

Em `src/config/navigation.ts`:

```tsx
export const mainNavItems: NavItem[] = [
  {
    title: "Usuarios",
    href: "/usuarios",
    icon: UsersIcon,
    permissions: ["users.view"], // Esconde se nao tiver permissao
  },
];
```

## Arquivos Relevantes

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/hooks/use-permissions.ts` | Hook de verificacao |
| `src/providers/permissions-provider.tsx` | Guard component |
| `src/utils/route-guards.ts` | Guards de rota |
| `src/lib/permissions.ts` | Utilitarios |
| `src/config/navigation.ts` | Menu com permissoes |

## Formato de Permissoes

Permissoes seguem o padrao: `recurso.acao`

Exemplos:
- `users.view` - Visualizar usuarios
- `users.create` - Criar usuarios
- `users.edit` - Editar usuarios
- `users.delete` - Deletar usuarios
- `roles.manage` - Gerenciar roles
