export const helpContent = {
  adocoes: {
    lista: {
      heading: "Como usar a lista de adoções",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Consulta as adoções registradas no sistema.",
            "Acessa o cadastro de uma nova adoção ou a edição de um registro existente.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Use a busca para localizar o adotante.",
            "Clique em Novo para registrar uma adoção.",
            "Use Exportar CSV quando precisar gerar um relatório da lista filtrada.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Ao excluir uma adoção, confirme se o registro não será mais necessário.",
            "Revise sempre se o animal exibido corresponde ao adotante esperado.",
          ],
        },
        {
          title: "Dicas rápidas",
          items: [
            "O termo de adoção fica disponível no atalho da tabela quando houver arquivo anexado.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar ou editar uma adoção",
      sections: [
        {
          title: "O que você faz aqui",
          items: ["Relaciona o adotante ao animal e guarda o termo de adoção."],
        },
        {
          title: "Como executar",
          items: [
            "Preencha os dados do adotante.",
            "Selecione o animal apto ou o animal já vinculado em edição.",
            "Anexe o termo assinado antes de salvar, quando o arquivo estiver disponível.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: [
            "Confira CPF, telefone e email antes de concluir.",
            "Ao remover um termo existente, a exclusão só acontece quando o formulário for salvo.",
          ],
        },
      ],
    },
  },
  doacoes: {
    lista: {
      heading: "Como usar a lista de doações",
      sections: [
        {
          title: "O que você faz aqui",
          items: ["Consulta o histórico de doações financeiras e de produtos."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo doador ou pelo conteúdo visível da lista.",
            "Abra uma nova doação pelo botão Nova Doação.",
            "Use o ícone de visualização para abrir os detalhes do registro.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: ["A exportação considera a busca atual."],
        },
        {
          title: "Dicas rápidas",
          items: [
            "Doações de dinheiro aparecem com destaque em moeda.",
            "Doações de produto exibem quantidade e item recebido.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar uma doação",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Registra o recebimento de dinheiro ou produto e atualiza o estoque quando houver item físico.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Escolha o tipo de doação.",
            "Se for dinheiro, informe um valor válido.",
            "Se for produto, selecione o item e a quantidade recebida.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: [
            "Doações de produto impactam o estoque automaticamente.",
            "Use o e-mail do doador quando precisar enviar recibo ou retorno.",
          ],
        },
      ],
    },
    detalhes: {
      heading: "Como ler os detalhes da doação",
      sections: [
        {
          title: "O que você faz aqui",
          items: ["Confere os dados completos da doação selecionada."],
        },
        {
          title: "Como executar",
          items: [
            "Revise identificação, data, doador, tipo e observação.",
            "Use Voltar para retornar à lista.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Quando a doação não for encontrada, valide se o link veio da listagem correta.",
          ],
        },
      ],
    },
  },
  movimentacoes: {
    lista: {
      heading: "Como usar o histórico de movimentações",
      sections: [
        {
          title: "O que você faz aqui",
          items: ["Consulta entradas e saídas do estoque em um único histórico."],
        },
        {
          title: "Como executar",
          items: [
            "Use a busca textual para localizar registros.",
            "Use o filtro de tipo para separar entradas e saídas.",
            "Abra os detalhes pelo ícone de visualização.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "A tela cobre tanto RF_F3 quanto RF_F5, porque entradas e saídas vivem no mesmo fluxo.",
          ],
        },
        {
          title: "Dicas rápidas",
          items: [
            "Motivos como doação, tratamento e descarte ajudam a rastrear a origem da movimentação.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar uma movimentação de estoque",
      sections: [
        {
          title: "O que você faz aqui",
          items: ["Registra entradas ou saídas de produtos no estoque."],
        },
        {
          title: "Como executar",
          items: [
            "Escolha se a movimentação é entrada ou saída.",
            "Selecione o produto, informe quantidade, motivo e responsável.",
            "Use Novo Produto se o item ainda não estiver cadastrado.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: [
            "Saídas reduzem o estoque do produto selecionado.",
            "Se escolher Outros como motivo, descreva o motivo manualmente.",
          ],
        },
      ],
    },
    detalhes: {
      heading: "Como ler os detalhes da movimentação",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Confere data, tipo, produto, motivo e observação da movimentação registrada.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Use esta tela para auditoria e conferência do histórico.",
            "Retorne para a lista pelo botão Voltar.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Se o registro não existir, valide se o identificador aberto veio da listagem atual.",
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
          title: "O que você faz aqui",
          items: ["Agenda, consulta e exclui consultas veterinárias."],
        },
        {
          title: "Como executar",
          items: [
            "Alterne entre tabela e calendário conforme o tipo de visualização desejado.",
            "Use os filtros por período, veterinário e animal para restringir os resultados.",
            "Clique em Agendar ou em uma data do calendário para abrir o formulário.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Ao excluir, revise os detalhes da consulta no modal antes de confirmar.",
          ],
        },
        {
          title: "Dicas rápidas",
          items: ["A exportação respeita os filtros aplicados na agenda."],
        },
      ],
    },
    cadastro: {
      heading: "Como agendar ou editar uma consulta",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Vincula animal, veterinário e horário para formar a consulta veterinária.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Selecione veterinário e animal.",
            "Informe data e hora compatíveis com a disponibilidade do veterinário.",
            "Adicione observação quando houver contexto clínico ou operacional.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: [
            "O formulário bloqueia horários fora da disponibilidade cadastrada.",
            "Em edição, revise o horário atual antes de confirmar alterações.",
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
          title: "O que você faz aqui",
          items: ["Consulta o histórico de atendimentos veterinários realizados."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise por paciente, veterinário ou diagnóstico.",
            "Abra detalhes para revisar o prontuário.",
            "Use Novo para registrar um novo atendimento.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: ["A exportação da tela gera o relatório completo do histórico."],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar ou editar um atendimento",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Transforma uma consulta da agenda em atendimento clínico ou cria um atendimento novo.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Escolha se o atendimento virá de uma consulta existente ou de um novo agendamento.",
            "Preencha paciente, veterinário, data, diagnóstico, exames e observações clínicas.",
            "Em edição, revise os dados clínicos antes de salvar.",
          ],
        },
        {
          title: "Atenção antes de salvar",
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
          title: "O que você faz aqui",
          items: ["Consulta o prontuário consolidado do atendimento."],
        },
        {
          title: "Como executar",
          items: [
            "Revise consulta vinculada, dados clínicos, exames e observações.",
            "Use Editar para corrigir ou complementar o prontuário.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Quando não houver diagnóstico, a tela exibirá explicitamente essa ausência.",
          ],
        },
      ],
    },
  },
  prescricoes: {
    lista: {
      heading: "Como usar a lista de prescrições",
      sections: [
        {
          title: "O que você faz aqui",
          items: ["Consulta, edita e gerencia prescrições veterinárias."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo conteúdo da prescrição.",
            "Filtre por status quando precisar focar em prescrições ativas, encerradas ou canceladas.",
            "Use o atalho de Ministrações para abrir o histórico de aplicações da prescrição.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Excluir uma prescrição remove o registro da listagem; confirme antes de continuar.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como criar ou editar uma prescrição",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Relaciona consulta, medicamento, dosagem, frequência e duração do tratamento.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Selecione a consulta correspondente ao caso clínico.",
            "Escolha o medicamento e descreva dosagem, frequência e duração.",
            "Defina o status adequado da prescrição.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: [
            "Duração deve ser maior que zero.",
            "Em edição, revise o status para evitar bloquear novas ministrações sem necessidade.",
          ],
        },
      ],
    },
  },
  ministracoes: {
    lista: {
      heading: "Como usar a lista de ministrações",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Consulta o histórico de aplicações ligadas a uma prescrição específica.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Revise a identificação da prescrição no topo da tela.",
            "Use Nova para registrar uma nova aplicação quando a prescrição estiver ativa.",
            "Exporte o CSV quando precisar compartilhar ou auditar o histórico.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: ["Prescrições inativas não permitem nova ministração."],
        },
      ],
    },
    cadastro: {
      heading: "Como registrar uma ministração",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Registra quem aplicou o medicamento, quanto foi aplicado e em qual horário.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Escolha o responsável.",
            "Informe a quantidade aplicada e a data/hora da aplicação.",
            "Adicione observação quando houver ocorrência relevante.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: [
            "A tela fica bloqueada quando a prescrição não estiver ativa.",
            "Quantidade e data/hora precisam ser válidas.",
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
          title: "O que você faz aqui",
          items: [
            "Consulta e gerencia o cadastro de medicamentos disponíveis no sistema.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo nome do medicamento.",
            "Use Novo para criar um cadastro.",
            "Use os botões da tabela para editar ou excluir.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Excluir um medicamento é uma ação destrutiva; confirme antes de prosseguir.",
          ],
        },
        {
          title: "Dicas rápidas",
          items: ["A exportação CSV respeita o filtro de busca."],
        },
      ],
    },
    cadastro: {
      heading: "Como cadastrar ou editar um medicamento",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Mantém os dados mestres de medicamentos usados nas prescrições.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Preencha nome e, quando disponível, princípio ativo, dosagem e forma farmacêutica.",
            "Use descrição para observações complementares do cadastro.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: ["O nome do medicamento é obrigatório."],
        },
      ],
    },
  },
  tiposDeExames: {
    lista: {
      heading: "Como usar a lista de tipos de exames",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Consulta e gerencia os tipos de exame disponíveis para atendimentos.",
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
          title: "Atenção ao usar",
          items: [
            "Revise a descrição antes de excluir um registro que possa estar sendo usado pela equipe.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como cadastrar ou editar um tipo de exame",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Mantém o catálogo de exames solicitados em atendimentos veterinários.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Preencha o nome do exame.",
            "Use a descrição para orientar o uso clínico ou operacional do tipo de exame.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: ["O nome precisa ter pelo menos dois caracteres."],
        },
      ],
    },
  },
  diagnosticos: {
    lista: {
      heading: "Como usar a lista de diagnósticos",
      sections: [
        {
          title: "O que você faz aqui",
          items: ["Consulta e gerencia os diagnósticos padrões do sistema."],
        },
        {
          title: "Como executar",
          items: [
            "Pesquise pelo nome do diagnóstico.",
            "Use Novo para adicionar um registro.",
            "Edite ou exclua conforme a necessidade.",
          ],
        },
        {
          title: "Atenção ao usar",
          items: [
            "Diagnósticos com atendimentos vinculados não podem ser excluídos.",
          ],
        },
      ],
    },
    cadastro: {
      heading: "Como cadastrar ou editar um diagnóstico",
      sections: [
        {
          title: "O que você faz aqui",
          items: [
            "Mantém a base de diagnósticos usada nos atendimentos veterinários.",
          ],
        },
        {
          title: "Como executar",
          items: [
            "Preencha o nome do diagnóstico.",
            "Use a descrição para registrar observações padrão ou contexto clínico.",
          ],
        },
        {
          title: "Atenção antes de salvar",
          items: ["O nome do diagnóstico é obrigatório."],
        },
      ],
    },
  },
};

export function getHelpContent(moduleKey, variantKey) {
  return helpContent[moduleKey]?.[variantKey] ?? null;
}
