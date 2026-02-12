---
name: vite-forms
description: Formularios com React Hook Form, Zod e componentes Field. Use quando criar formularios, campos de input, validacao, ou controlar estados de submit.
---

# Formularios com React Hook Form + Zod

Padrao para formularios validados com componentes Field.

## Setup Basico

```tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  nome: z.string().min(1, "Nome e obrigatorio"),
  email: z.string().email("E-mail invalido"),
});

type FormData = z.infer<typeof schema>;

function MeuForm() {
  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { nome: "", email: "" },
  });

  const onSubmit = async (data: FormData) => {
    // ...
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Campos aqui */}
    </form>
  );
}
```

## Componentes Field

Usar componentes de `src/components/ui/field.tsx`:

```tsx
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
```

| Componente | Descricao |
|------------|-----------|
| `Field` | Container do campo |
| `FieldLabel` | Label com asterisco automatico |
| `FieldContent` | Wrapper do input |
| `FieldError` | Mensagem de erro |
| `FieldGroup` | Agrupa multiplos campos |

## Campo com Controller

```tsx
import * as React from "react";

function MeuForm({ onSubmit, isSubmitting }: Props) {
  const nomeId = React.useId();
  const form = useForm<FormData>({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="nome"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={nomeId} schema={schema} fieldName="nome">
                Nome
              </FieldLabel>
              <FieldContent>
                <Input {...field} id={nomeId} />
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </FieldContent>
            </Field>
          )}
        />
      </FieldGroup>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? <><Spinner /> Salvando...</> : "Salvar"}
      </Button>
    </form>
  );
}
```

## FieldLabel com Schema

O `FieldLabel` detecta automaticamente campos obrigatorios:

```tsx
<FieldLabel 
  htmlFor={id} 
  schema={meuSchema}    // Schema Zod
  fieldName="nome"      // Nome do campo no schema
>
  Nome
</FieldLabel>
```

**Resultado**: Exibe asterisco (*) vermelho se o campo for required no Zod.

## Props do Formulario

Formularios puros recebem callbacks via props:

```tsx
interface FormProps {
  defaultValues?: Partial<FormData>;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}
```

O `isSubmitting` vem do container (page/dialog) que controla as mutations.

## Arquivos Relevantes

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/components/ui/field.tsx` | Componentes Field |
| `src/components/ui/input.tsx` | Input base |
| `src/components/ui/button.tsx` | Botoes |
| `src/components/ui/spinner.tsx` | Loading indicator |
| `src/schemas/` | Schemas Zod |
