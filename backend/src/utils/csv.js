const NEWLINE = "\r\n";
const QUOTE = '"';

function escaparValor(valor, delimiter) {
  if (valor === null || valor === undefined) {
    return "";
  }
  const texto = String(valor);
  const precisaAspas =
    texto.includes(delimiter) ||
    texto.includes(",") ||
    texto.includes(";") ||
    texto.includes(QUOTE) ||
    texto.includes("\n") ||
    texto.includes("\r");
  if (!precisaAspas) {
    return texto;
  }
  return `${QUOTE}${texto.replaceAll(QUOTE, QUOTE + QUOTE)}${QUOTE}`;
}

function montarLinha(valores, delimiter) {
  return valores.map((valor) => escaparValor(valor, delimiter)).join(delimiter);
}

export function gerarCsv(header, linhas, delimiter = ",") {
  const cabecalho = montarLinha(header, delimiter);
  const corpo = linhas
    .map((linha) => montarLinha(linha, delimiter))
    .join(NEWLINE);
  if (linhas.length === 0) {
    return cabecalho + NEWLINE;
  }
  return cabecalho + NEWLINE + corpo + NEWLINE;
}

export const __test__ = { escaparValor, montarLinha };
