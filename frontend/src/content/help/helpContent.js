export const helpContent = {
  adocoes: {
    lista: {
      heading: "Como usar a lista de adocoes",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Consulta as adocoes registradas no sistema.",
            "Acessa o cadastro de uma nova adocao ou a edicao de um registro existente.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Use a busca para localizar o adotante.",
            "Clique em Novo para registrar uma adocao.",
            "Use Exportar CSV quando precisar gerar um relatorio da lista filtrada.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Ao excluir uma adocao, confirme se o registro nao sera mais necessario.",
            "Revise sempre se o animal exibido corresponde ao adotante esperado.",
          ],
        },
        {
          title: "Dicas rapidas",
          items: [
            "O termo de adocao fica disponivel no atalho da tabela quando houver arquivo anexado.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar ou editar uma adocao",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Relaciona o adotante ao animal e guarda o termo de adocao."],
        },
        {
          title: "Como executar",
          items: [
            "Preencha os dados do adotante.",
            "Selecione o animal apto ou o animal ja vinculado em edicao.",
            "Anexe o termo assinado antes de salvar, quando o arquivo estiver disponivel.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: [
            "Confira CPF, telefone e email antes de concluir.",
            "Ao remover um termo existente, a exclusao so acontece quando o formulario for salvo.",
          ],
        },
      ],
    },
  },
  doacoes: {
    lista: {
      heading: "Como usar a lista de doacoes",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Consulta o historico de doacoes financeiras e de produtos."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo doador ou pelo conteudo visivel da lista.",
            "Abra uma nova doacao pelo botao Nova Doacao.",
            "Use o icone de visualizacao para abrir os detalhes do registro.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: ["A exportacao considera a busca atual."],
        },
        {
          title: "Dicas rapidas",
          items: [
            "Doacoes de dinheiro aparecem com destaque em moeda.",
            "Doacoes de produto exibem quantidade e item recebido.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar uma doacao",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Registra o recebimento de dinheiro ou produto e atualiza o estoque quando houver item fisico.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Escolha o tipo de doacao.",
            "Se for dinheiro, informe um valor valido.",
            "Se for produto, selecione o item e a quantidade recebida.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: [
            "Doacoes de produto impactam o estoque automaticamente.",
            "Use o contato do doador quando precisar enviar recibo ou retorno.",
          ],
        },
      ],
    },
    detalhes: {
      heading: "Como ler os detalhes da doacao",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Confere os dados completos da doacao selecionada."],
        },
        {
          title: "Como executar",
          items: [
            "Revise identificacao, data, doador, tipo e observacao.",
            "Use Voltar para retornar a lista.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Quando a doacao nao for encontrada, valide se o link veio da listagem correta.",
          ],
        },
      ],
    },
  },
  movimentacoes: {
    lista: {
      heading: "Como usar o historico de movimentacoes",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Consulta entradas e saidas do estoque em um unico historico."],
        },
        {
          title: "Como executar",
          items: [
            "Use a busca textual para localizar registros.",
            "Use o filtro de tipo para separar entradas e saidas.",
            "Abra os detalhes pelo icone de visualizacao.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "A tela cobre tanto RF_F3 quanto RF_F5, porque entradas e saidas vivem no mesmo fluxo.",
          ],
        },
        {
          title: "Dicas rapidas",
          items: [
            "Motivos como doacao, tratamento e descarte ajudam a rastrear a origem da movimentacao.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar uma movimentacao de estoque",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Registra entradas ou saidas de produtos no estoque."],
        },
        {
          title: "Como executar",
          items: [
            "Escolha se a movimentacao e entrada ou saida.",
            "Selecione o produto, informe quantidade, motivo e responsavel.",
            "Use Novo Produto se o item ainda nao estiver cadastrado.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: [
            "Saidas reduzem o estoque do produto selecionado.",
            "Se escolher Outros como motivo, descreva o motivo manualmente.",
          ],
        },
      ],
    },
    detalhes: {
      heading: "Como ler os detalhes da movimentacao",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Confere data, tipo, produto, motivo e observacao da movimentacao registrada.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Use esta tela para auditoria e conferencia do historico.",
            "Retorne para a lista pelo botao Voltar.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Se o registro nao existir, valide se o identificador aberto veio da listagem atual.",
          ],
        },
      ],
    },
  },
  consultas: {
    agenda: {
      heading: "Como usar a agenda de consultas",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Agenda, consulta e exclui consultas veterinarias."],
        },
        {
          title: "Como executar",
          items: [
            "Alterne entre tabela e calendario conforme o tipo de visualizacao desejado.",
            "Use os filtros por periodo, veterinario e animal para restringir os resultados.",
            "Clique em Novo agendamento ou em uma data do calendario para abrir o formulario.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Ao excluir, revise os detalhes da consulta no modal antes de confirmar.",
          ],
        },
        {
          title: "Dicas rapidas",
          items: ["A exportacao respeita os filtros aplicados na agenda."],
        },
      ],
    },
    cadastro: {
      heading: "Como agendar ou editar uma consulta",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Vincula animal, veterinario e horario para formar a consulta veterinaria.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Selecione veterinario e animal.",
            "Informe data e hora compativeis com a disponibilidade do veterinario.",
            "Adicione observacao quando houver contexto clinico ou operacional.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: [
            "O formulario bloqueia horarios fora da disponibilidade cadastrada.",
            "Em edicao, revise o horario atual antes de confirmar alteracoes.",
          ],
        },
      ],
    },
  },
  atendimentos: {
    lista: {
      heading: "Como usar a lista de atendimentos",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Consulta o historico de atendimentos veterinarios realizados."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise por paciente, veterinario ou diagnostico.",
            "Abra detalhes para revisar o prontuario.",
            "Use Novo para registrar um novo atendimento.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: ["A exportacao da tela gera o relatorio completo do historico."],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar ou editar um atendimento",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Transforma uma consulta da agenda em atendimento clinico ou cria um atendimento novo.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Escolha se o atendimento virá de uma consulta existente ou de um novo agendamento.",
            "Preencha paciente, veterinario, data, diagnostico, exames e observacoes clinicas.",
            "Em edicao, revise os dados clinicos antes de salvar.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: [
            "Quando a origem for uma consulta existente, selecione uma consulta ainda sem atendimento.",
            "Em atendimento novo, valide a data e hora antes de concluir.",
          ],
        },
      ],
    },
    detalhes: {
      heading: "Como ler os detalhes do atendimento",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Consulta o prontuario consolidado do atendimento."],
        },
        {
          title: "Como executar",
          items: [
            "Revise consulta vinculada, dados clinicos, exames e observacoes.",
            "Use Editar para corrigir ou complementar o prontuario.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Quando nao houver diagnostico, a tela exibira explicitamente essa ausencia.",
          ],
        },
      ],
    },
  },
  prescricoes: {
    lista: {
      heading: "Como usar a lista de prescricoes",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Consulta, edita e encerra o ciclo de prescricoes veterinarias."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo conteudo da prescricao.",
            "Filtre por status quando precisar focar em prescricoes ativas, encerradas ou canceladas.",
            "Use o atalho de Ministrações para abrir o historico de aplicacoes da prescricao.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Excluir uma prescricao remove o registro da listagem; confirme antes de continuar.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como criar ou editar uma prescricao",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Relaciona consulta, medicamento, dosagem, frequencia e duracao do tratamento.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Selecione a consulta correspondente ao caso clinico.",
            "Escolha o medicamento e descreva dosagem, frequencia e duracao.",
            "Defina o status adequado da prescricao.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: [
            "Duracao deve ser maior que zero.",
            "Em edicao, revise o status para evitar bloquear novas ministrações sem necessidade.",
          ],
        },
      ],
    },
  },
  ministracoes: {
    lista: {
      heading: "Como usar a lista de ministracoes",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Consulta o historico de aplicacoes ligadas a uma prescricao especifica.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Revise a identificacao da prescricao no topo da tela.",
            "Use Nova para registrar uma nova aplicacao quando a prescricao estiver ativa.",
            "Exporte o CSV quando precisar compartilhar ou auditar o historico.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: ["Prescricoes inativas nao permitem nova ministracao."],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar uma ministracao",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Registra quem aplicou o medicamento, quanto foi aplicado e em qual horario.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Escolha o responsavel.",
            "Informe a quantidade aplicada e a data/hora da aplicacao.",
            "Adicione observacao quando houver ocorrencia relevante.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: [
            "A tela fica bloqueada quando a prescricao nao estiver ativa.",
            "Quantidade e data/hora precisam ser validas.",
          ],
        },
      ],
    },
  },
  medicamentos: {
    lista: {
      heading: "Como usar a lista de medicamentos",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Consulta e gerencia o cadastro de medicamentos disponiveis no sistema.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo nome do medicamento.",
            "Use Novo para criar um cadastro.",
            "Use os botoes da tabela para editar ou excluir.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Excluir um medicamento e uma acao destrutiva; confirme antes de prosseguir.",
          ],
        },
        {
          title: "Dicas rapidas",
          items: ["A exportacao CSV respeita o filtro de busca."],
        },
      ],
    },
    cadastro: {
      heading: "Como cadastrar ou editar um medicamento",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Mantem os dados mestres de medicamentos usados nas prescricoes.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Preencha nome e, quando disponivel, principio ativo, dosagem e forma farmaceutica.",
            "Use descricao para observacoes complementares do cadastro.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: ["O nome do medicamento e obrigatorio."],
        },
      ],
    },
  },
  tiposDeExames: {
    lista: {
      heading: "Como usar a lista de tipos de exames",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Consulta e gerencia os tipos de exame disponiveis para atendimentos.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo nome do exame.",
            "Use Novo para criar um tipo de exame.",
            "Edite ou exclua pelos controles da tabela.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Revise a descricao antes de excluir um registro que possa estar sendo usado pela equipe.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como cadastrar ou editar um tipo de exame",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Mantem o catalogo de exames solicitados em atendimentos veterinarios.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Preencha o nome do exame.",
            "Use a descricao para orientar o uso clinico ou operacional do tipo de exame.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: ["O nome precisa ter pelo menos dois caracteres."],
        },
      ],
    },
  },
  diagnosticos: {
    lista: {
      heading: "Como usar a lista de diagnosticos",
      sections: [
        {
          title: "O que voce faz aqui",
          items: ["Consulta e gerencia os diagnosticos padroes do sistema."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo nome do diagnostico.",
            "Use Novo para adicionar um registro.",
            "Edite ou exclua conforme a necessidade.",
          ],
        },
        {
          title: "Atencao ao usar",
          items: [
            "Diagnosticos com atendimentos vinculados nao podem ser excluidos.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como cadastrar ou editar um diagnostico",
      sections: [
        {
          title: "O que voce faz aqui",
          items: [
            "Mantem a base de diagnosticos usada nos atendimentos veterinarios.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Preencha o nome do diagnostico.",
            "Use a descricao para registrar observacoes padrao ou contexto clinico.",
          ],
        },
        {
          title: "Atencao antes de salvar",
          items: ["O nome do diagnostico e obrigatorio."],
        },
      ],
    },
  },
};

export function getHelpContent(moduleKey, variantKey) {
  return helpContent[moduleKey]?.[variantKey] ?? null;
}
