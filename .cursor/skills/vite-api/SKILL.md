---
name: vite-api
description: Integracao com API usando Orval e TanStack Query. Use quando fazer chamadas de API, criar mutations, invalidar cache, ou tratar erros de requisicao.
---

# Integracao com API

Hooks gerados pelo Orval + TanStack Query.

## Gerar Hooks da API

```bash
pnpm generate:api
```

Hooks ficam em `src/api/generated/`.

## Query (Buscar Dados)

```tsx
import { useGetUsuarios } from "@/api/generated/usuarios/usuarios";

function UsuariosPage() {
  const { data, isLoading, isError } = useGetUsuarios({
    query: {
      staleTime: 1000 * 60 * 5, // 5 minutos
    },
  });

  if (isLoading) return <Skeleton />;
  if (isError) return <div>Erro</div>;

  return <DataTable data={data?.data ?? []} />;
}
```

## Mutation (Criar/Atualizar/Deletar)

```tsx
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateUsuario, getGetUsuariosQueryKey } from "@/api/generated/usuarios/usuarios";
import { onError } from "@/utils/on-error";

function CriarUsuarioPage() {
  const queryClient = useQueryClient();

  const { mutateAsync: createUsuario, isPending } = useCreateUsuario({
    mutation: {
      onSuccess: (response) => {
        toast.success(response.message ?? "Usuario criado com sucesso");
        queryClient.invalidateQueries({
          queryKey: getGetUsuariosQueryKey(),
        });
      },
      onError, // Handler centralizado
    },
  });

  const handleSubmit = async (data: IUsuario) => {
    await createUsuario({ data });
  };

  return <UsuarioForm onSubmit={handleSubmit} isSubmitting={isPending} />;
}
```

## Invalidar Cache

Sempre usar `getXxxQueryKey()` para type-safety:

```tsx
// BOM: Type-safe
queryClient.invalidateQueries({ queryKey: getGetUsuariosQueryKey() });

// EVITAR: String magica
queryClient.invalidateQueries({ queryKey: ["getUsuarios"] });
```

## Multiplas Mutations

Combinar estados de loading:

```tsx
const { isPending: isPendingCreate } = useCreateUsuario({ ... });
const { isPending: isPendingUpdate } = useUpdateUsuario({ ... });

const isSubmitting = isPendingCreate || isPendingUpdate;

return <Form isSubmitting={isSubmitting} />;
```

## Tratamento de Erros

Usar `onError` centralizado de `src/utils/on-error.ts`:

```tsx
import { onError } from "@/utils/on-error";

const { mutateAsync } = useCreateUsuario({
  mutation: { onError }, // Exibe toast.error automaticamente
});
```

## Feedback ao Usuario

```tsx
onSuccess: (response) => {
  // Preferir mensagem da API quando disponivel
  toast.success(response.message ?? "Operacao realizada com sucesso");
}
```

## Padrao Completo

```tsx
const { mutateAsync, isPending } = useCreateUsuario({
  mutation: {
    onSuccess: (response) => {
      toast.success(response.message ?? "Criado com sucesso");
      queryClient.invalidateQueries({ queryKey: getGetUsuariosQueryKey() });
      onOpenChange(false); // Fechar dialog
    },
    onError,
  },
});
```

## Arquivos Relevantes

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/api/generated/` | Hooks gerados |
| `src/utils/on-error.ts` | Handler de erro |
| `src/lib/api-client.ts` | Cliente Axios |
| `orval.config.ts` | Configuracao Orval |
