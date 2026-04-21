# RF_S1 — Gerar Relatório de Animais Cadastrados (CSV)

- **Status:** aprovado (design)
- **Data:** 2026-04-21
- **Branch:** `feat/rf-s1-relatorio-animais-csv`
- **Requisito:** RF_S1 — Gerar Relatórios de Animais Cadastrados

## Objetivo

Permitir que usuários com permissão `Gerenciar animais` exportem em CSV a lista de animais cadastrados, espelhando o filtro de busca livre já presente em `ListaDeAnimais`.

## Escopo

- **Inclui:** novo endpoint backend `GET /animais/relatorio.csv`, novo botão "Exportar CSV" em `ListaDeAnimais`, geração de CSV com BOM UTF-8 e download via blob.
- **Não inclui (fora do escopo):**
  - PDF, Excel (xlsx) ou visualização HTML imprimível.
  - Filtros novos na tela (status, espécie, período etc.) — fica para um futuro RF.
  - Menu lateral "Relatórios" — só botão local na lista.
  - Nova permissão dedicada — reusa `Gerenciar animais`.
  - Agendamento, envio por e-mail ou histórico de relatórios gerados.

## Decisões fechadas

| Decisão | Valor |
|---|---|
| Formato | CSV |
| Filtro | Mesma busca livre da `ListaDeAnimais` (`?busca=`) |
| Colunas | Nome, Espécie, Raça, Sexo, Porte, Status |
| Gatilho UI | Botão "Exportar CSV" ao lado do "Novo" em `ListaDeAnimais` |
| Geração | Backend (novo endpoint dedicado) |
| Permissão | `Gerenciar animais` (reusa) |
| Lista vazia | Bloqueia download no front + toast warning |
| Nome do arquivo | `animais_AAAA-MM-DD.csv` |
| Encoding | UTF-8 com BOM (`\uFEFF`) para Excel BR |

## Arquitetura

### Backend (Express + MySQL)

**Rota** — `backend/src/routes/AnimalRoutes.js`:

```js
router.get(
  "/animais/relatorio.csv",
  authJwt,
  validarPermissao,
  AnimalController.exportarCsv
);
```

Declarar **antes** de `/animais/:id` para evitar qualquer ambiguidade de matching.

**Controller** — `AnimalController.exportarCsv`:

1. Lê `req.query.busca` (string opcional).
2. Reusa `AnimalModel.filtrar(busca)` quando há termo, ou `AnimalModel.listarTodos()` quando vazio (mesma lógica do `listar`).
3. Monta CSV em memória (sem lib externa):
   - Header fixo: `Nome,Espécie,Raça,Sexo,Porte,Status`
   - Linhas: `nome, especie, nome_raca, sexo, porte, status` (na ordem)
   - Valores `null`/`undefined` → string vazia
   - Escape: se valor contém `,`, `"` ou quebra de linha → envolver em aspas duplas e duplicar aspas internas (`"` → `""`)
4. Prepende **BOM UTF-8** (`"\uFEFF"`) ao corpo.
5. Define headers HTTP:
   - `Content-Type: text/csv; charset=utf-8`
   - `Content-Disposition: attachment; filename="animais_${YYYY-MM-DD}.csv"`
6. `res.send(corpo)`.

Data calculada com `new Date().toISOString().slice(0, 10)`.

**Model** — sem alterações. Reusa `listarTodos` e `filtrar` existentes em `AnimalModel.js`.

### Frontend (React + Bootstrap)

**Em `frontend/src/pages/ListaDeAnimais/ListaDeAnimais.jsx`:**

1. Novo estado `exportando` (boolean) para desabilitar botão durante o download.
2. Novo botão `<Button variant="outline-primary">` com ícone `bi-download` e label "Exportar CSV", entre o input de busca e o link "Novo".
3. Handler `exportarCsv()`:
   - Se `animais.length === 0` → `exibirToast("Nenhum animal para exportar.", "warning")` e `return`.
   - Caso contrário:
     - `setExportando(true)`
     - `fetch(\`${API_URL}/animais/relatorio.csv?busca=${encodeURIComponent(search)}\`, { credentials: "include" })`
     - Se `!response.ok` → toast erro com `response.status`.
     - `await response.blob()` → `URL.createObjectURL` → cria `<a>` invisível com atributo `download` → `click()` → `revokeObjectURL`.
     - **Filename:** ao usar `blob:` URL o browser ignora o `Content-Disposition` do servidor. O front precisa parsear o header da resposta com regex `filename="?([^";]+)"?` e usar como `a.download`. Fallback: `animais_${YYYY-MM-DD}.csv` calculado no front.
   - `finally`: `setExportando(false)`.
4. Toast variante `warning`: o componente atual usa `text-${toastVariant}` (Bootstrap aceita `text-warning`) e o ícone cai no fallback `exclamation-circle-fill` (qualquer variante diferente de `success`). Funciona sem mudanças no Toast.

**`ApiService`:** sem alteração. O fetch de blob é inline no handler (caso único, não vale poluir o service genérico de JSON).

**Permissão UI:** já garantida — toda a página `ListaDeAnimais` está dentro de `<RotaComPermissao permissao={PERMISSOES.ANIMAIS} />`.

## Comportamento esperado (fluxo)

1. Usuário abre `/animais`.
2. (Opcional) digita termo de busca → tabela atualiza após 300 ms.
3. Clica em "Exportar CSV":
   - Lista tem itens → browser baixa `animais_AAAA-MM-DD.csv` com as linhas visíveis.
   - Lista vazia → toast warning, nenhum request feito.
4. Sem permissão → não chega à tela (`RotaComPermissao` bloqueia).
5. Sessão expirada durante export → 401 → toast erro.

## Edge cases

- **Caracteres especiais em campos** (`,`, `"`, `\n`): escape RFC 4180 — envolve em aspas duplas e duplica aspas internas.
- **Acentos no Excel BR:** BOM UTF-8 (`\uFEFF`) no início do corpo → Excel reconhece encoding.
- **`raca_id` NULL:** `nome_raca` vem `null` do JOIN → renderiza como string vazia no CSV.
- **Busca sem matches:** front bloqueia (já decidido). Se endpoint for chamado direto via URL com 0 resultados, devolve 200 + CSV apenas com cabeçalho (não 4xx — endpoint válido).
- **Auth expirado:** fetch retorna 401 → toast "Erro ao exportar (401)".
- **Duplo clique no botão:** estado `exportando` desabilita botão até o download iniciar.

## Critérios de aceitação

1. Lista cheia, sem busca → download de `animais_AAAA-MM-DD.csv` contendo TODOS os animais, com 6 colunas e cabeçalho exato `Nome,Espécie,Raça,Sexo,Porte,Status`.
2. Arquivo abre no Excel/LibreOffice com acentos corretos (ex.: "Espécie" não vira "EspÃ©cie").
3. Busca por `luna` → CSV contém apenas a linha do animal "Luna".
4. Busca por termo sem matches → toast warning aparece, nenhum download dispara.
5. Animal com `raca_id NULL` → coluna Raça aparece vazia (não `null`, não `undefined`).
6. Usuário sem permissão `Gerenciar animais` chamando o endpoint direto → 403.
7. Usuário deslogado tenta exportar → 401 → toast erro.
8. Campo contendo vírgula ou aspas é exportado e reaberto preservando o conteúdo original.

## Arquivos impactados

- `backend/src/routes/AnimalRoutes.js` — nova rota.
- `backend/src/controllers/AnimalController.js` — novo método `exportarCsv` + helper de escape CSV.
- `frontend/src/pages/ListaDeAnimais/ListaDeAnimais.jsx` — novo botão, estado e handler.

## Riscos e contramedidas

| Risco | Contramedida |
|---|---|
| Excel BR abrir com acentos quebrados | BOM UTF-8 no início do corpo |
| Conflito de rota com `/animais/:id` | Declarar rota literal antes da paramétrica |
| Vazamento de dados sensíveis | Endpoint atrás de `authJwt` + `exigirPermissao("Gerenciar animais")` |
| Download bloqueado por popup blocker | Usar `<a download>` com `click()` programático (não `window.open`) |

## Fora do escopo (próximos passos sugeridos)

- Filtros estruturados na `ListaDeAnimais` (status, espécie, período de cadastro) — habilita relatórios mais ricos.
- Menu "Relatórios" centralizado quando houver 3+ relatórios.
- Exportação em PDF (precisaria lib tipo `pdfkit` ou `puppeteer`).
- Histórico de relatórios gerados (auditoria).
