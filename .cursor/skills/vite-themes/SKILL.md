---
name: vite-themes
description: Sistema de temas com cores OKLCH e suporte a modo claro/escuro. Use quando personalizar cores, criar novos temas, adicionar fontes, ou alterar tema padrao.
---

# Sistema de Temas OKLCH

Temas com cores OKLCH e suporte a light/dark mode.

## Arquivos Principais

| Arquivo | Responsabilidade |
|---------|------------------|
| `src/lib/theme-colors.ts` | Definicoes de temas e cores |
| `src/stores/theme-store.ts` | Estado e persistencia |

## Alterar Tema Padrao

### Cor Primaria

Em `src/lib/theme-colors.ts`:

```tsx
// Hue da cor primaria (0-360)
export const DEFAULT_THEME_COLOR = 34.44; // Laranja/terracota
```

### Modo (Claro/Escuro)

Em `src/stores/theme-store.ts`:

```tsx
export const DEFAULT_THEME: Theme = "dark"; // "light" | "dark" | "system"
```

## Adicionar Novo Tema

Adicionar ao array `PRESET_THEMES` em `src/lib/theme-colors.ts`:

```tsx
export const PRESET_THEMES: CompleteTheme[] = [
  // ... temas existentes
  {
    name: "Meu Tema",
    light: {
      background: "oklch(0.98 0.005 95)",
      foreground: "oklch(0.34 0.027 96)",
      primary: "oklch(0.55 0.15 250)",
      primaryForeground: "oklch(1 0 0)",
      // ... demais variaveis
      ...DEFAULT_THEME_PROPERTIES,
    },
    dark: {
      // Mesma estrutura para modo escuro
      ...DEFAULT_THEME_PROPERTIES,
    },
    swatches: [
      "oklch(0.55 0.15 250)",  // Primary
      "oklch(0.98 0.005 95)",  // Background
    ],
  },
];
```

## Variaveis de Cor

| Variavel | Descricao |
|----------|-----------|
| `primary` | Cor principal (botoes, links) |
| `background` | Fundo das paginas |
| `foreground` | Texto principal |
| `muted` | Elementos secundarios |
| `destructive` | Acoes destrutivas (vermelho) |
| `sidebar*` | Cores da sidebar |
| `chart1-5` | Cores para graficos |

## Adicionar Nova Fonte

1. Adicionar ao `index.html`:

```html
<link
  href="https://fonts.googleapis.com/css2?family=Poppins:wght@300..700&display=swap"
  rel="stylesheet"
/>
```

2. Adicionar ao `PRESET_FONTS` em `src/lib/theme-colors.ts`:

```tsx
export const PRESET_FONTS: FontFamily[] = [
  // ... fontes existentes
  {
    name: "Poppins",
    sans: "Poppins, sans-serif",
    serif: "Georgia, serif",
    mono: "Fira Code, monospace",
  },
];
```

## Formato OKLCH

Cores usam formato `oklch(L C H)`:

| Parametro | Descricao | Range |
|-----------|-----------|-------|
| **L** (Lightness) | Luminosidade | 0-1 (0=preto, 1=branco) |
| **C** (Chroma) | Saturacao | 0-0.4 |
| **H** (Hue) | Matiz | 0-360 |

Exemplos:
- Vermelho: `oklch(0.63 0.21 25)`
- Verde: `oklch(0.72 0.17 142)`
- Azul: `oklch(0.55 0.15 250)`
- Roxo: `oklch(0.55 0.15 290)`
