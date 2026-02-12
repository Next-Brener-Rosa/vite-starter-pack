---
name: vite-crud
description: Padrao completo para modulos CRUD com DataTable, formularios e dialogs. Use quando criar listagem de dados, tabelas com acoes, modulos de cadastro, ou estruturar um CRUD completo.
---

# Padrao CRUD Completo

Estrutura para modulos CRUD com separacao de responsabilidades.

## Estrutura de Pastas

```
src/
├── api/generated/usuarios/       # Hooks Orval
├── components/usuarios/
│   ├── columns.tsx               # Colunas (puro)
│   ├── data-table.tsx            # DataTable (puro)
│   ├── table-actions.tsx         # Acoes da linha
│   ├── usuario-form.tsx          # Formulario (puro)
│   └── usuario-dialog.tsx        # Dialog (container)
├── schemas/usuario.ts            # Schema Zod
└── routes/(protected)/usuarios/
    ├── index.tsx                 # Listagem (container)
    └── criar.tsx                 # Criacao (container)
```

## Principio de Separacao

| Tipo | Responsabilidade | Acesso a API |
|------|------------------|--------------|
| **Componente Puro** | UI, recebe props | NAO |
| **Container** | Mutations, cache | SIM |

Componentes puros: `form`, `columns`, `data-table`
Containers: `dialog`, `pages`

## Schema Zod

```tsx
// src/schemas/usuario.ts
import { z } from "zod";

export const usuarioSchema = z.object({
  nome: z.string().min(1, "Nome e obrigatorio"),
  email: z.string().email("E-mail invalido"),
});

export type IUsuario = z.infer<typeof usuarioSchema>;
```

## Colunas

```tsx
// src/components/usuarios/columns.tsx
import type { ColumnDef } from "@tanstack/react-table";
import { TableActions } from "./table-actions";

export type Usuario = {
  id: number;
  nome: string;
  email: string;
};

export const columns: ColumnDef<Usuario>[] = [
  { accessorKey: "nome", header: "Nome" },
  { accessorKey: "email", header: "E-mail" },
  { id: "actions", cell: ({ row }) => <TableActions usuario={row.original} /> },
];
```

## DataTable

Usar `@tanstack/react-table` com:
- `getCoreRowModel()`
- `getPaginationRowModel()`
- `getSortedRowModel()`
- `getFilteredRowModel()`

Ver exemplo completo em README.md secao "Criando um CRUD Completo".

## Dialog de Edicao

```tsx
// src/components/usuarios/usuario-dialog.tsx
interface UsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  usuario?: Usuario; // undefined = criacao
}

export function UsuarioDialog({ open, onOpenChange, usuario }: UsuarioDialogProps) {
  const isEditing = !!usuario;
  // Mutations aqui (ver vite-api skill)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar" : "Novo"} Usuario</DialogTitle>
        </DialogHeader>
        <UsuarioForm
          defaultValues={usuario}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
}
```

## Acoes da Tabela

```tsx
// src/components/usuarios/table-actions.tsx
export function TableActions({ usuario }: { usuario: Usuario }) {
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setShowEditDialog(true)}>
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <UsuarioDialog open={showEditDialog} onOpenChange={setShowEditDialog} usuario={usuario} />
      {/* AlertDialog para confirmacao de exclusao */}
    </>
  );
}
```

## Arquivos de Referencia

| Arquivo | Padrao |
|---------|--------|
| README.md | Secao "Criando um CRUD Completo" |
| `src/components/ui/table.tsx` | Primitivos de tabela |
| `src/components/ui/dialog.tsx` | Primitivos de dialog |
| `src/components/ui/alert-dialog.tsx` | Confirmacao |
