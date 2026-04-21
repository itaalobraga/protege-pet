# RF_S1 — Relatório de Animais Cadastrados (CSV) — Plano de Implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar exportação CSV da listagem de animais (`GET /animais/relatorio.csv`) com botão "Exportar CSV" em `ListaDeAnimais`, espelhando o filtro de busca livre, BOM UTF-8 para Excel BR, sem novas dependências.

**Architecture:** Backend Express acrescenta uma rota dedicada que reusa `AnimalModel.filtrar`/`listarTodos`, monta CSV em memória via helper isolado (`backend/src/utils/csv.js`) e devolve `text/csv` com `Content-Disposition: attachment` e prefixo `\uFEFF`. Frontend acrescenta botão na `ListaDeAnimais` que faz `fetch` da rota, transforma resposta em `Blob`, parseia o filename do header `Content-Disposition` (com fallback `animais_AAAA-MM-DD.csv`) e dispara download via `<a download>` programático. Lista vazia bloqueia o request no front com toast warning.

**Tech Stack:** Node 18+/Express, MySQL (`mysql2/promise`), React 18/Vite, React-Bootstrap. Sem libs novas. Sem framework de testes (verificação manual via `curl` + browser).

**Reference Spec:** `docs/superpowers/specs/2026-04-21-rf-s1-relatorio-animais-csv-design.md`

---

## File Structure

| Arquivo | Tipo | Responsabilidade |
|---|---|---|
| `backend/src/utils/csv.js` | NEW | Helper puro: escapar valor RFC 4180 + montar string CSV a partir de header + linhas. |
| `backend/src/controllers/AnimalController.js` | MOD | Adicionar método estático `exportarCsv` que orquestra busca → CSV → headers HTTP. |
| `backend/src/routes/AnimalRoutes.js` | MOD | Registrar `GET /animais/relatorio.csv` **antes** de `/animais/:id`. |
| `frontend/src/pages/ListaDeAnimais/ListaDeAnimais.jsx` | MOD | Adicionar estado `exportando`, botão "Exportar CSV", handler `exportarCsv()`. |
| `docs/superpowers/specs/2026-04-21-rf-s1-relatorio-animais-csv-design.md` | EXISTENTE | Spec de referência (não alterar). |

Decisões de decomposição:
- O helper CSV fica num arquivo próprio (`utils/csv.js`) porque é puramente lógico, reutilizável (futuro: outros relatórios) e isolável para verificação manual independente do controller.
- O controller fica num único arquivo já existente (mantém padrão do projeto: 1 controller por entidade).
- O frontend mantém handler inline no componente (caso único, já alinhado no spec). Não cria service novo nem método em `ApiService` (o serviço genérico só lida com JSON).

---

## Task 1: Helper CSV (utilitário puro)

**Files:**
- Create: `backend/src/utils/csv.js`

- [x] **Step 1: Criar o helper com a API mínima**

Criar o arquivo `backend/src/utils/csv.js` com o conteúdo exato:

```js
const DELIMITER = ",";
const NEWLINE = "\r\n";
const QUOTE = '"';

function escaparValor(valor) {
  if (valor === null || valor === undefined) {
    return "";
  }
  const texto = String(valor);
  const precisaAspas =
    texto.includes(DELIMITER) ||
    texto.includes(QUOTE) ||
    texto.includes("\n") ||
    texto.includes("\r");
  if (!precisaAspas) {
    return texto;
  }
  return `${QUOTE}${texto.replaceAll(QUOTE, QUOTE + QUOTE)}${QUOTE}`;
}

function montarLinha(valores) {
  return valores.map(escaparValor).join(DELIMITER);
}

export function gerarCsv(header, linhas) {
  const cabecalho = montarLinha(header);
  const corpo = linhas.map(montarLinha).join(NEWLINE);
  if (linhas.length === 0) {
    return cabecalho + NEWLINE;
  }
  return cabecalho + NEWLINE + corpo + NEWLINE;
}

export const __test__ = { escaparValor, montarLinha };
```

Notas:
- Usa `\r\n` (CRLF) como separador de linha — exigido por RFC 4180 e melhor compatibilidade com Excel Windows.
- `escaparValor` cobre: null/undefined → `""`; vírgula, aspas, `\n` ou `\r` no valor → envolve em aspas e duplica aspas internas.
- O export `__test__` permite verificar funções internas no smoke test sem mudar a API pública.

- [x] **Step 2: Smoke test manual do helper**

Rodar o seguinte one-liner a partir de `backend/`:

```bash
node --input-type=module -e "
import { gerarCsv, __test__ } from './src/utils/csv.js';
const { escaparValor } = __test__;
console.assert(escaparValor(null) === '', 'null vira string vazia');
console.assert(escaparValor(undefined) === '', 'undefined vira string vazia');
console.assert(escaparValor('Luna') === 'Luna', 'simples sem aspas');
console.assert(escaparValor('a,b') === '\"a,b\"', 'virgula gera aspas');
console.assert(escaparValor('a\"b') === '\"a\"\"b\"', 'aspas duplicada');
console.assert(escaparValor('a\nb') === '\"a\nb\"', 'quebra de linha gera aspas');
const csv = gerarCsv(['Nome','Idade'], [['Luna',3],['Bo,b',null]]);
console.assert(csv === 'Nome,Idade\r\nLuna,3\r\n\"Bo,b\",\r\n', 'csv completo: ' + JSON.stringify(csv));
const vazio = gerarCsv(['A','B'], []);
console.assert(vazio === 'A,B\r\n', 'csv vazio so header');
console.log('csv helper OK');
"
```

Esperado: `csv helper OK` impresso, sem `AssertionError`.

- [x] **Step 3: Commit** — `fa07ac8`

```bash
git add backend/src/utils/csv.js
git commit -m "feat(backend): adicionar helper de geração de CSV (RF_S1)"
```

---

## Task 2: Controller — método `exportarCsv`

**Files:**
- Modify: `backend/src/controllers/AnimalController.js`

- [x] **Step 1: Importar o helper no topo do arquivo**

Logo abaixo da linha existente `import AnimalModel from "../models/AnimalModel.js";` adicionar:

```js
import { gerarCsv } from "../utils/csv.js";
```

- [x] **Step 2: Adicionar o método `exportarCsv` antes do `}` final da classe**

Inserir o método imediatamente antes do `}` que fecha `class AnimalController` (após `excluir` e antes do `}`):

```js
  static async exportarCsv(req, res) {
    try {
      const { busca } = req.query;
      const animais = busca
        ? await AnimalModel.filtrar(busca)
        : await AnimalModel.listarTodos();

      const header = ["Nome", "Espécie", "Raça", "Sexo", "Porte", "Status"];
      const linhas = animais.map((a) => [
        a.nome,
        a.especie,
        a.nome_raca,
        a.sexo,
        a.porte,
        a.status,
      ]);

      const corpo = "\uFEFF" + gerarCsv(header, linhas);
      const dataIso = new Date().toISOString().slice(0, 10);
      const filename = `animais_${dataIso}.csv`;

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.send(corpo);
    } catch (error) {
      console.error("Erro ao exportar CSV de animais:", error);
      res.status(500).json({ error: "Erro ao exportar CSV de animais" });
    }
  }
```

Notas:
- Reusa exatamente a mesma lógica de seleção do `listar` (`busca ? filtrar : listarTodos`).
- `nome_raca` vem do JOIN (já existe em `AnimalModel`), pode ser `null` → helper devolve `""`.
- `\uFEFF` (BOM UTF-8) é prefixado ao corpo, **não** ao header.
- Resposta de erro continua JSON (500) — só sucesso é CSV.

- [x] **Step 3: Verificar que o arquivo está sintaticamente válido**

Rodar a partir de `backend/`:

```bash
node --check src/controllers/AnimalController.js && echo "syntax OK"
```

Esperado: `syntax OK` impresso, sem erro.

- [x] **Step 4: Commit** — `186b0a6`

```bash
git add backend/src/controllers/AnimalController.js
git commit -m "feat(backend): adicionar AnimalController.exportarCsv (RF_S1)"
```

---

## Task 3: Rota — `GET /animais/relatorio.csv`

**Files:**
- Modify: `backend/src/routes/AnimalRoutes.js`

- [x] **Step 1: Inserir a rota literal antes da paramétrica**

No arquivo `backend/src/routes/AnimalRoutes.js`, encontrar a linha:

```js
router.get("/animais", authJwt, validarPermissao, AnimalController.listar);
router.get("/animais/:id", authJwt, validarPermissao, AnimalController.buscarPorId);
```

E inserir uma nova linha **entre** essas duas, ficando assim:

```js
router.get("/animais", authJwt, validarPermissao, AnimalController.listar);
router.get("/animais/relatorio.csv", authJwt, validarPermissao, AnimalController.exportarCsv);
router.get("/animais/:id", authJwt, validarPermissao, AnimalController.buscarPorId);
```

Por que antes de `:id`: Express casa rotas por ordem; declarar a rota literal antes evita qualquer ambiguidade futura (mesmo que `relatorio.csv` não case com `:id` numérico hoje, é boa prática).

- [x] **Step 2: Verificar sintaxe**

```bash
node --check backend/src/routes/AnimalRoutes.js && echo "syntax OK"
```

Esperado: `syntax OK`.

- [ ] **Step 3: Smoke test do endpoint (servidor rodando)** — _SKIPPED na execução automatizada (sem MySQL local). Coberto pela Task 5._

Garantir que o backend está rodando localmente (porta padrão do projeto). Em outro terminal, com um JWT válido de um usuário com permissão `Gerenciar animais` exportado em `$TOKEN`:

```bash
curl -i -H "Cookie: token=$TOKEN" "http://localhost:3000/animais/relatorio.csv" | head -20
```

(Substituir porta/host se o projeto usar outro. Se o auth for header `Authorization: Bearer`, usar `-H "Authorization: Bearer $TOKEN"`.)

Esperado:
- `HTTP/1.1 200 OK`
- `Content-Type: text/csv; charset=utf-8`
- `Content-Disposition: attachment; filename="animais_AAAA-MM-DD.csv"`
- Corpo começa com BOM (3 bytes `EF BB BF`) seguido de `Nome,Espécie,Raça,Sexo,Porte,Status\r\n…`

Se o servidor não estiver rodando, iniciá-lo com o script padrão do projeto (verificar `backend/package.json`) antes de chamar o curl.

- [ ] **Step 4: Smoke test do filtro de busca** — _SKIPPED (sem MySQL local). Coberto pela Task 5._

```bash
curl -s -H "Cookie: token=$TOKEN" "http://localhost:3000/animais/relatorio.csv?busca=luna" | xxd | head -5
```

Esperado: bytes iniciais `efbb bf` (BOM) + `Nome,Espécie…`. As linhas seguintes contêm apenas animais que casam com `luna` (no nome, espécie, raça ou status).

- [ ] **Step 5: Smoke test sem permissão / sem auth** — _SKIPPED (sem MySQL local). Coberto pela Task 5._

```bash
curl -i "http://localhost:3000/animais/relatorio.csv" | head -3
```

Esperado: `401` (sem cookie) ou `403` (cookie de usuário sem `Gerenciar animais`). Em qualquer caso, **não deve** retornar 200 com CSV.

- [x] **Step 6: Commit** — `0097fc1`

```bash
git add backend/src/routes/AnimalRoutes.js
git commit -m "feat(backend): expor rota GET /animais/relatorio.csv (RF_S1)"
```

---

## Task 4: Frontend — botão + estado

**Files:**
- Modify: `frontend/src/pages/ListaDeAnimais/ListaDeAnimais.jsx`

- [x] **Step 1: Adicionar estado `exportando`**

No bloco de `useState` (depois de `const [toastVariant, setToastVariant] = useState("success");`), adicionar:

```jsx
  const [exportando, setExportando] = useState(false);
```

- [x] **Step 2: Adicionar import do `API_URL` (ou ler o env diretamente)**

`ApiService.js` já lê `import.meta.env.VITE_API_URL` mas não o exporta. Para manter o handler inline e auto-contido, ler o env direto no componente.

Logo abaixo dos imports existentes (após `import ApiService from "../../services/ApiService";`), adicionar:

```jsx
const API_URL = import.meta.env.VITE_API_URL;
```

- [x] **Step 3: Adicionar o handler `exportarCsv`**

Inserir o handler **logo após** `carregarAnimais` (antes de `useEffect`):

```jsx
  const exportarCsv = async () => {
    if (animais.length === 0) {
      exibirToast("Nenhum animal para exportar.", "warning");
      return;
    }
    setExportando(true);
    try {
      const url = `${API_URL}/animais/relatorio.csv?busca=${encodeURIComponent(search)}`;
      const response = await fetch(url, { credentials: "include" });
      if (!response.ok) {
        exibirToast(`Erro ao exportar (${response.status}).`, "danger");
        return;
      }

      const disposition = response.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^";]+)"?/i);
      const fallback = `animais_${new Date().toISOString().slice(0, 10)}.csv`;
      const filename = match ? match[1] : fallback;

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Erro ao exportar CSV:", error);
      exibirToast("Erro ao exportar CSV.", "danger");
    } finally {
      setExportando(false);
    }
  };
```

- [x] **Step 4: Adicionar o botão "Exportar CSV" no header da página**

Encontrar o bloco que contém o input de busca e o link "Novo":

```jsx
            <div className="d-flex align-items-center gap-3">
              <input
                type="text"
                placeholder="Buscar..."
                ...
              />
              <Link
                to="/animais/cadastro"
                ...
              >
                <i className="bi bi-plus-lg"></i> Novo
              </Link>
            </div>
```

Inserir o `<Button>` **entre** o `<input>` e o `<Link>`:

```jsx
              <Button
                variant="outline-primary"
                onClick={exportarCsv}
                disabled={exportando}
                className="d-flex align-items-center gap-2"
                aria-label="Exportar CSV"
              >
                <i className="bi bi-download"></i>
                {exportando ? "Exportando..." : "Exportar CSV"}
              </Button>
```

`Button` já é importado de `react-bootstrap` no topo do arquivo, sem mudança em imports.

- [x] **Step 5: Verificar que o componente compila (lint do Vite)**

A partir de `frontend/`:

```bash
npm run lint
```

(Se o projeto não tiver script `lint`, rodar `npx eslint src/pages/ListaDeAnimais/ListaDeAnimais.jsx`.)

Esperado: zero erros novos. Warnings pré-existentes podem permanecer.

- [x] **Step 6: Commit** — `4460962`

```bash
git add frontend/src/pages/ListaDeAnimais/ListaDeAnimais.jsx
git commit -m "feat(frontend): adicionar botão Exportar CSV em ListaDeAnimais (RF_S1)"
```

---

## Task 5: Verificação manual end-to-end (browser)

**Files:** nenhum (validação).

Pré-requisito: backend e frontend rodando localmente, com pelo menos:
- 1 animal com nome contendo acento (ex.: "André" ou "Açaí")
- 1 animal com `raca_id` NULL
- 1 animal com vírgula ou aspas em algum campo de texto (criar via endpoint POST se necessário)
- 1 usuário com permissão `Gerenciar animais` logado

- [ ] **Step 1: Critério 1 — exportação completa**

1. Abrir `/animais` no browser, sem texto na busca.
2. Clicar em "Exportar CSV".
3. Confirmar que o browser baixou um arquivo nomeado `animais_AAAA-MM-DD.csv` (data de hoje).
4. Abrir o arquivo num editor de texto. Conferir:
   - Primeira linha: `Nome,Espécie,Raça,Sexo,Porte,Status`
   - Número de linhas de dados = número de animais visíveis na tabela.

- [ ] **Step 2: Critério 2 — acentos no Excel/LibreOffice**

Abrir o mesmo CSV no Excel ou LibreOffice. Conferir:
- Cabeçalho mostra `Espécie` e `Raça` corretamente (não `EspÃ©cie`).
- Animais com acento no nome aparecem corretamente.

- [ ] **Step 3: Critério 3 — busca filtrada**

1. Digitar `luna` (ou outro termo que case com 1 animal específico) no campo de busca.
2. Aguardar a tabela atualizar (~300 ms).
3. Clicar em "Exportar CSV".
4. Abrir o CSV. Conferir que contém **apenas** as linhas que casam com o termo.

- [ ] **Step 4: Critério 4 — busca sem matches**

1. Digitar `xyzqq123` no campo de busca.
2. Aguardar a tabela mostrar "Nenhum resultado encontrado".
3. Clicar em "Exportar CSV".
4. Conferir:
   - Toast warning aparece com texto "Nenhum animal para exportar."
   - **Nenhum** download é disparado.
   - Aba Network do DevTools: **nenhum** request a `/animais/relatorio.csv`.

- [ ] **Step 5: Critério 5 — `raca_id` NULL**

1. Localizar no CSV exportado a linha do animal com `raca_id` NULL.
2. Conferir que a coluna `Raça` está vazia (`,,` no CSV cru), e **não** contém `null` nem `undefined`.

- [ ] **Step 6: Critério 6 — sem permissão (endpoint direto)**

Em outro terminal, com cookie/token de usuário **sem** permissão `Gerenciar animais`:

```bash
curl -i -H "Cookie: token=$TOKEN_SEM_PERM" "http://localhost:3000/animais/relatorio.csv"
```

Esperado: `403`.

- [ ] **Step 7: Critério 7 — sessão expirada**

1. No browser, abrir DevTools → Application → Cookies → apagar o cookie de auth.
2. Voltar para `/animais` (não recarregar — manter a lista em memória).
3. Clicar em "Exportar CSV".
4. Esperado: toast "Erro ao exportar (401)." (ou redirect para login se houver interceptor global — registrar o comportamento).

- [ ] **Step 8: Critério 8 — caracteres especiais preservados**

1. Garantir que existe pelo menos 1 animal com `,` ou `"` em algum campo (ex.: `nome = 'Bo,b'` ou `local_resgate = 'Av. "Brasil"'`). Se não existir, criar via UI.
2. Exportar CSV.
3. Reabrir no Excel/LibreOffice e conferir que o valor original aparece intacto numa única célula (a vírgula não quebrou em duas colunas, as aspas não duplicaram).

- [ ] **Step 9: Critério extra — duplo clique**

1. Clicar em "Exportar CSV" duas vezes rapidamente.
2. Esperado: o botão fica desabilitado e mostra "Exportando..." entre o clique e o início do download. Apenas 1 request em DevTools → Network.

- [ ] **Step 10: Registrar resultados**

Para cada critério acima, anotar PASS/FAIL. Se algum FAIL, abrir uma issue ou voltar à task correspondente para correção.

---

## Task 6: Push e abertura de PR

**Files:** nenhum (entrega).

- [x] **Step 1: Verificar histórico local**

```bash
git log --oneline origin/main..HEAD
```

Esperado: 4 commits (helper csv, controller, rota, frontend) — além do commit anterior do spec já presente na branch. Resultado real: 6 commits (incluindo plano `8639f19` e fix CORS `1be3301`).

- [x] **Step 2: Push**

```bash
git push origin feat/rf-s1-relatorio-animais-csv
```

- [ ] **Step 3: Abrir PR** — _PAT sem permissão de criar PR via API; abrir manualmente em https://github.com/itaalobraga/protege-pet/pull/new/feat/rf-s1-relatorio-animais-csv_

Usar o template/skill do projeto (`/new-pr`) ou criar manualmente apontando `feat/rf-s1-relatorio-animais-csv` → `main`. Título sugerido:

```
feat(rf-s1): exportação CSV de animais cadastrados
```

Corpo deve referenciar o spec em `docs/superpowers/specs/2026-04-21-rf-s1-relatorio-animais-csv-design.md` e listar os 8 critérios de aceitação como checklist marcado conforme a Task 5.

---

## Notas de execução

- **Sem framework de testes**: o projeto não tem Jest/Vitest configurado. Verificações são via `node --check`, smoke test do helper com `console.assert`, `curl` para o endpoint e validação manual no browser para o frontend. Se um framework for adicionado no futuro, converter os smoke tests do helper em testes unitários reais.
- **Servidor local**: cada task que envolve `curl` assume que o backend está rodando. O comando exato (`npm start`, `npm run dev`, etc.) está em `backend/package.json` — consultar antes de iniciar.
- **DRY**: o helper `csv.js` é genérico de propósito (recebe `header[]` + `linhas[][]`), preparado para reuso em outros relatórios futuros (RF_S2 etc.) sem reescrita.
- **YAGNI**: nada de paginação, streaming ou compressão do CSV. Tamanho esperado é pequeno (alguns kB no pior cenário do projeto). Caso o volume cresça, refatorar para streaming.
- **Frequência de commit**: 1 commit por task (4 commits funcionais + 1 spec já existente). Cada commit deixa a árvore num estado executável.
