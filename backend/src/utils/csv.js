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
