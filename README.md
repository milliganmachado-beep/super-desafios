# Super Desafios (AHSD)

Visual novel standalone — projeto independente extraído do repositório Unbalanced Tournament.

## Como rodar

```bash
npm install
npm run dev
```

Abra o endereço que o Vite mostrar (geralmente `http://localhost:5173`).

## Onde colocar as imagens das cenas

Pasta:

```text
public/ahsd/images/
```

Regras de nome (o jogo tenta automaticamente `.webp`, depois `.png`, `.jpg`, `.jpeg`):

- Cenas principais: `01`, `02`, … `30`
- Subcenas (consequência de cada opção A–D): `01a` … `01d`, até `29a` … `29d`

Exemplos: `01.webp`, `01a.png`, `15c.jpg`.

Há um guia completo em `public/ahsd/images/README.md`.

## Onde alterar o texto do jogo

Arquivo:

```text
src/ahsd/story.ts
```

Nesse arquivo ficam as cenas, perguntas, opções, desfechos e os textos dos finais.

## Estrutura principal

| Caminho | Função |
|---|---|
| `public/ahsd/images/` | Imagens das cenas |
| `src/ahsd/story.ts` | Texto / narrativa |
| `src/ahsd/game.tsx` | Lógica e interface do jogo |
| `src/ahsd/game.css` | Estilo visual |

## Editor de cenas

O projeto também incorpora o editor de cenas do repositório colaborativo. Com o servidor local rodando, abra `/editor` para editar as 30 cenas, narrativa, perguntas, escolhas, consequências, atributos, imagens e finais.

- `/editor` — editor de autoria
- `src/ahsd/story.ts` — dados da narrativa
- `public/ahsd/images/` — imagens das cenas
- **Salvar no jogo** — grava as alterações diretamente no arquivo da narrativa quando o editor está rodando localmente
- **Baixar backup JSON** — cria uma cópia das cenas e finais antes de alterações maiores

O editor foi incorporado sem substituir o `game.tsx` e o `game.css` da versão mais recente do projeto.
