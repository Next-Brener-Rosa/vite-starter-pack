---
name: vite-auth
description: Implementa autenticacao JWT com refresh token automatico usando Zustand. Use quando criar login, logout, verificar autenticacao, ou trabalhar com tokens JWT neste projeto.
---

# Autenticacao JWT

Sistema de autenticacao com JWT e refresh token automatico.

## Store de Autenticacao

Usar `useAuthStore` de `src/stores/auth-store.ts`:

```tsx
import { useAuthStore } from "@/stores/auth-store";

// No componente
const { user, isAuthenticated, signIn, signOut } = useAuthStore();

// Login
await signIn(email, password, rememberMe);

// Logout
signOut();
```

## Metodos Disponiveis

| Metodo | Descricao |
|--------|-----------|
| `signIn(email, password, rememberMe)` | Autentica usuario e armazena tokens |
| `signOut()` | Remove tokens e redireciona para login |
| `isAuthenticated` | Boolean indicando se usuario esta logado |
| `user` | Dados do usuario autenticado |

## Armazenamento de Tokens

Tokens sao armazenados automaticamente:
- `localStorage` quando `rememberMe = true`
- `sessionStorage` quando `rememberMe = false`

Chaves configuradas em `.env`:
```env
VITE_TOKEN_STORAGE_KEY="auth_token"
VITE_REFRESH_TOKEN_STORAGE_KEY="refresh_token"
```

## Refresh Automatico

O interceptor Axios em `src/lib/api-client.ts` renova tokens automaticamente quando:
- Token expira (401)
- Refresh token ainda e valido

Nao e necessario implementar logica de refresh manualmente.

## Arquivos Relevantes

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/stores/auth-store.ts` | Estado global de autenticacao |
| `src/lib/auth.ts` | Funcoes de gerenciamento de tokens |
| `src/lib/api-client.ts` | Cliente Axios com interceptors |
| `src/api/generated/auth/` | Endpoints de autenticacao |

## Exemplo: Formulario de Login

```tsx
import { useAuthStore } from "@/stores/auth-store";
import { useNavigate } from "@tanstack/react-router";

function LoginForm() {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (data: LoginData) => {
    await signIn(data.email, data.password, data.rememberMe);
    navigate({ to: "/dashboard" });
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```
