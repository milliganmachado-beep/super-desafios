export type StatKey = "conexao" | "estimulo" | "energia" | "autenticidade" | "regulacao" | "autonomia";
export type RouteKey = "romance" | "familia" | "faculdade" | "trabalho" | "hobby" | "amizades";

export type Choice = {
  text: string;
  outcome: string;
  deltas: Partial<Record<StatKey, number>>;
  plausible: boolean;
  image?: string;
};

export type Scene = {
  id: number;
  date: string;
  age: string;
  title: string;
  image?: string;
  routes: RouteKey[];
  complicator: string;
  event: string[];
  question: string;
  choices?: Choice[];
};

const c = (text: string, outcome: string, deltas: Choice["deltas"], plausible = false): Choice => ({ text, outcome, deltas, plausible });

export const statLabels: Record<StatKey, string> = {
  conexao: "Conexão",
  estimulo: "Estímulo",
  energia: "Energia",
  autenticidade: "Autenticidade",
  regulacao: "Regulação",
  autonomia: "Autonomia",
};

export const routeLabels: Record<RouteKey, string> = {
  romance: "Júlia",
  familia: "Família",
  faculdade: "Faculdade",
  trabalho: "Trabalho",
  hobby: "Projeto",
  amizades: "Amizades",
};

export const scenes: Scene[] = [
  {
    id: 1, date: "Fevereiro · Ano 1", age: "18 anos", title: "Calouro", routes: ["faculdade", "amizades"], complicator: "Solidão",
    event: [
      "Daniel chega cedo demais no primeiro dia e passa a manhã aprendendo nomes, prédios e horários antes de aprender qualquer pessoa.",
      "No almoço, Bruno o puxa para uma mesa cheia. À noite, o grupo da turma não para de vibrar. Há uma festa dos calouros e todos parecem já saber com quem irão.",
      "Daniel passou o dia inteiro acompanhado. Mesmo assim, cada conversa parece ter terminado um pouco antes de começar de verdade."
    ],
    question: "O que Daniel provavelmente faz quando vê o convite da festa?",
    choices: [
      c("Vai à festa e decide ficar até conseguir se enturmar.", "Ele permanece duas horas, conversa com muita gente e volta para casa mais consciente da distância entre companhia e intimidade.", { conexao: -4, energia: -3, regulacao: -2 }, true),
      c("Manda mensagem para Júlia e pergunta se ela quer jantar só com ele.", "Ele escreve, apaga, reescreve e conclui que seria íntimo demais para alguém que conheceu hoje. O convite nunca sai do rascunho.", { conexao: -3, autenticidade: -2, regulacao: -2 }),
      c("Fica em casa e desliga o celular para não pensar nisso.", "O silêncio alivia por alguns minutos. Depois ele abre o grupo no navegador e acompanha as fotos sem participar.", { energia: 2, conexao: -5 }),
      c("Vai sozinho a um bar que já conhece, para provar que prefere ficar só.", "Ele consegue ficar sozinho sem desconforto, mas passa a noite observando mesas de grupos e comparando a própria noite com a deles.", { autonomia: 2, conexao: -4, regulacao: -1 })
    ]
  },
  {
    id: 2, date: "Abril · Ano 1", age: "18 anos", title: "A mesa do fundo", routes: ["familia", "faculdade", "amizades"], complicator: "Sensação de ser diferente",
    event: [
      "Dois meses depois, Daniel já almoça quase todos os dias com Bruno, Larissa, Caio e Júlia.",
      "Num domingo, ele transforma a decisão da irmã Marina de largar o inglês numa discussão sobre motivação, escolhas e compromisso. Na segunda, faz algo parecido quando Bruno reclama de um aplicativo ruim.",
      "Nas duas vezes, alguém diz a mesma coisa com palavras diferentes: era uma conversa simples."
    ],
    question: "Quando percebe que novamente foi longe demais, como Daniel reage?",
    choices: [
      c("Ri junto e passa a observar melhor até onde os outros querem ir.", "Ele aprende a cortar o próprio raciocínio alguns segundos antes de os rostos mudarem. A convivência melhora; a sensação de tradução constante fica.", { conexao: 2, autenticidade: -3, regulacao: 2 }, true),
      c("Explica que o problema é os outros não acompanharem.", "O argumento faz sentido para ele e soa arrogante para todos os outros. Bruno muda de assunto e Marina para de pedir sua opinião por alguns dias.", { conexao: -5, autonomia: 1 }),
      c("Decide não falar mais em grupos.", "Ele consegue evitar o constrangimento criando outro: agora perguntam por que está tão calado.", { autenticidade: -4, conexao: -2 }),
      c("Procura imediatamente terapia para resolver sua dificuldade social.", "Ele pesquisa profissionais, compara abordagens e fecha as abas. Ainda nem consegue formular o que diria numa primeira sessão.", { regulacao: -2, energia: -2 })
    ]
  },
  {
    id: 3, date: "Junho · Ano 1", age: "18 anos", title: "Personagem secundário", routes: ["romance", "hobby", "faculdade"], complicator: "Ocultação das capacidades",
    event: [
      "Júlia descobre que Daniel faz um RPG desde os quinze anos e insiste em ver. Ele mostra mapas, personagens, sistemas e uma pasta de versões abandonadas.",
      "Ela passa vinte minutos lendo. Daniel fecha o notebook antes que ela termine e chama tudo de besteira.",
      "Na faculdade, ele também já espera alguém responder primeiro, esconde algumas notas e evita contar o que lê fora das aulas."
    ],
    question: "Júlia pergunta por que ele diminui tudo o que faz. O que ele responde?",
    choices: [
      c("Diz que é mais fácil assim e muda de assunto.", "Júlia percebe que a resposta é verdadeira e incompleta. Ela não insiste, mas passa a prestar atenção nas vezes em que Daniel desaparece atrás de uma piada.", { autenticidade: -3, conexao: 1, regulacao: 1 }, true),
      c("Mostra tudo e promete parar de se esconder.", "A promessa dura até o almoço seguinte, quando ele ouve uma piada sobre sua nota e volta automaticamente ao comportamento antigo.", { autenticidade: -4, regulacao: -2 }),
      c("Diz que os outros têm inveja e não merecem saber.", "Júlia fecha o notebook. O RPG deixa de ser assunto entre eles por algumas semanas.", { conexao: -4, autonomia: 1 }),
      c("Apaga o projeto para parar de ter algo a esconder.", "Ele seleciona a pasta, encara a confirmação e cancela. A ideia de jogar anos fora é mais intolerável do que a exposição.", { energia: -2, autenticidade: -2 })
    ]
  },
  {
    id: 4, date: "Agosto · Ano 1", age: "18 anos", title: "Fácil demais", routes: ["faculdade", "romance"], complicator: "Necessidade de desafio",
    event: [
      "Daniel começa o segundo semestre com notas altas e a convicção de que encontrou o ritmo da faculdade.",
      "Uma aula ocupa duas horas para explicar algo que ele entende em vinte minutos. Júlia, ao lado, ainda está tentando acompanhar.",
      "No celular, ele tem um artigo difícil aberto e uma ideia para o jogo que quer testar."
    ],
    question: "O que Daniel faz durante o restante da aula?",
    choices: [
      c("Abre o artigo por baixo da mesa e alterna atenção entre as duas coisas.", "A cabeça volta a funcionar. Ele aprende algo novo e perde exatamente a parte da aula em que o professor anuncia uma atividade obrigatória.", { estimulo: 5, energia: 2, regulacao: -2 }, true),
      c("Fecha tudo e se obriga a ouvir cada repetição.", "Em quinze minutos, está relendo mentalmente uma discussão antiga. O corpo continua na cadeira; a atenção não.", { estimulo: -4, regulacao: -2 }),
      c("Sai da sala e decide nunca mais assistir a aulas fáceis.", "A liberdade dura até descobrir que presença e recados administrativos também contam.", { autonomia: 3, regulacao: -4 }),
      c("Passa a aula inteira ajudando Júlia sem que ela peça.", "Júlia agradece na primeira explicação e se irrita na quarta. Daniel percebe tarde que transformar a aula dela em tutoria também tira sua autonomia.", { conexao: -2, estimulo: 1 })
    ]
  },
  {
    id: 5, date: "Outubro · Ano 1", age: "18 anos", title: "Quatrocentos parafusos", routes: ["familia", "trabalho"], complicator: "Tédio por repetição",
    event: [
      "Para ajudar nas despesas, Daniel aceita trabalhar alguns sábados no estoque do tio Roberto.",
      "Depois de contar centenas de peças, ele cria uma planilha, reorganiza o método e encontra compras duplicadas. Roberto olha a tela e diz que ele foi contratado para contar caixas.",
      "O pai concorda com o irmão: fazer bem o trabalho começa por fazer o trabalho pedido."
    ],
    question: "No sábado seguinte, o que Daniel tende a fazer?",
    choices: [
      c("Tenta cumprir a contagem, mas inventa pequenos desafios mentais para aguentar a repetição.", "Ele transforma lotes em padrões, tempos e metas pessoais. Termina quase tudo, embora ainda erre uma caixa quando a cabeça foge para outra coisa.", { estimulo: 2, regulacao: 2, energia: -2 }, true),
      c("Promete simplesmente se concentrar mais.", "A promessa funciona por vinte minutos. Depois ele percebe que contou a mesma caixa duas vezes e precisa recomeçar.", { regulacao: -3, energia: -3 }),
      c("Refaz o sistema escondido e apresenta pronto.", "O sistema é melhor, mas Roberto interpreta como desafio à autoridade e encerra o trabalho temporário antes do combinado.", { autonomia: 3, conexao: -3 }),
      c("Pede demissão na hora e diz que trabalho repetitivo é perda de vida.", "A frase chega ao pai antes de Daniel chegar em casa. O jantar vira uma discussão sobre privilégio e responsabilidade.", { autonomia: 2, conexao: -4, energia: -2 })
    ]
  },
  {
    id: 6, date: "Dezembro · Ano 1", age: "18 anos", title: "Vinte exercícios", routes: ["faculdade", "hobby"], complicator: "Baixa necessidade de repetição",
    event: [
      "No fim do primeiro ano, Daniel já reconhece um padrão: resolve três exercícios, entende a técnica e abandona os outros dezessete.",
      "Na mesma semana, passa até quatro da manhã tentando corrigir sozinho a iluminação do RPG.",
      "O professor devolve uma lista incompleta com uma frase: 'Você sabe fazer. Então faça.'"
    ],
    question: "Como ele lida com a próxima lista?",
    choices: [
      c("Faz os itens diferentes e negocia consigo mesmo blocos curtos para os repetidos.", "Ele não completa tudo, mas entrega muito mais do que costuma. Descobre que suportar repetição exige estratégia, não convicção.", { regulacao: 4, estimulo: -1, energia: -1 }, true),
      c("Decide terminar tudo de uma vez antes de tocar no jogo.", "Depois de uma hora nos itens repetidos, está irritado, lento e acaba abrindo o projeto 'só por cinco minutos'.", { regulacao: -3, energia: -3 }),
      c("Entrega somente três itens e anexa uma explicação de que os demais são redundantes.", "O professor concorda com a redundância e dá zero nos itens não feitos.", { autonomia: 2, regulacao: -3 }),
      c("Copia os resultados dos colegas porque já sabe fazer.", "A tarefa termina rápido. O incômodo de ter burlado uma regra simples permanece mais tempo que o ganho de tempo.", { autenticidade: -4, regulacao: -1 })
    ]
  },
  {
    id: 7, date: "Fevereiro · Ano 2", age: "19 anos", title: "Vinte e três abas", routes: ["hobby", "romance"], complicator: "Curiosidade intelectual intensa",
    event: [
      "Pesquisando comportamento de inimigos para o jogo, Daniel encontra um artigo que leva a outro, depois a uma discussão antiga, depois a um campo inteiro que ele não conhecia.",
      "Às quatro da manhã há vinte e três abas abertas. Júlia acorda com doze mensagens dele sobre o assunto.",
      "À tarde ela liga, ri do excesso e, antes de desligar, pergunta se eles estão namorando."
    ],
    question: "Como Daniel reage à pergunta?",
    choices: [
      c("Fica alguns segundos tentando reconstruir quando isso aconteceu e responde que sim.", "Júlia ri do atraso da resposta. O namoro começa sem declaração grandiosa, no meio de uma conversa que já existia.", { conexao: 6, autenticidade: 3, regulacao: 1 }, true),
      c("Pede uma semana para pensar racionalmente sobre compatibilidade.", "Júlia entende a frase como uma recusa sofisticada e se afasta antes de a análise terminar.", { conexao: -5, regulacao: -2 }),
      c("Diz que sim imediatamente e promete priorizá-la sempre.", "A resposta soa bonita até ele enviar outro artigo no meio da conversa e esquecer a promessa em menos de uma hora.", { conexao: -2, autenticidade: -2 }),
      c("Desvia perguntando o que ela entende por namoro.", "A discussão conceitual dura dez minutos até Júlia perguntar, sem rir, se ele realmente não consegue só responder.", { conexao: -3, regulacao: -1 })
    ]
  },
  {
    id: 8, date: "Abril · Ano 2", age: "19 anos", title: "Por quê?", routes: ["faculdade", "familia"], complicator: "Necessidade de profundidade",
    event: [
      "Um professor interrompe a quarta pergunta de Daniel sobre as hipóteses de um modelo: para aquela disciplina, não precisam ir tão fundo.",
      "Naquela noite, Marina entra no quarto porque quer mudar de escola. Daniel começa a listar causas, riscos e alternativas.",
      "Ela o corta: não quer solução ainda. Quer reclamar primeiro."
    ],
    question: "O que Daniel faz?",
    choices: [
      c("Segura a próxima análise e pergunta o que aconteceu.", "A pergunta simples mantém Marina falando. Daniel percebe que profundidade também pode ser dirigida à pessoa, não apenas ao problema.", { conexao: 4, regulacao: 3, autenticidade: 1 }, true),
      c("Explica que entender as causas vai fazê-la se sentir melhor.", "Marina levanta e diz que volta quando quiser uma consultoria.", { conexao: -4, regulacao: -1 }),
      c("Fica completamente calado para não 'resolver' nada.", "O silêncio fica artificial. Marina pergunta se ele está prestando atenção.", { conexao: -2, autenticidade: -2 }),
      c("Envia um teste vocacional e uma planilha de escolas no dia seguinte.", "Marina responde com um único emoji e não toca mais no assunto naquela semana.", { conexao: -3, energia: -1 })
    ]
  },
  {
    id: 9, date: "Junho · Ano 2", age: "19 anos", title: "A coisa nova", routes: ["romance", "hobby"], complicator: "Intensidade de interesses",
    event: [
      "Daniel descobre geração procedural e passa semanas falando quase exclusivamente disso.",
      "No aniversário de Júlia, leva o notebook porque teve uma ideia que 'leva só dois minutos para mostrar'. Ela olha para a mochila e depois para ele.",
      "Não há briga. Isso o deixa mais desconfortável que uma briga."
    ],
    question: "O que ele faz com o notebook?",
    choices: [
      c("Guarda e passa a noite contendo a vontade de voltar ao assunto.", "Ele consegue ficar presente, mas percebe quantas vezes sua atenção tenta escapar para a ideia. No fim da noite, anota tudo de uma vez no ônibus.", { conexao: 4, regulacao: 3, estimulo: -1 }, true),
      c("Mostra rapidamente para tirar isso da cabeça.", "Dois minutos viram quinze. Quando termina, metade da mesa já está em outra conversa e Júlia está servindo o próprio bolo.", { conexao: -4, estimulo: 3 }),
      c("Pede desculpas e promete abandonar o projeto por um mês.", "Dois dias depois está programando escondido e ressentido com uma promessa que ninguém pediu.", { autenticidade: -4, regulacao: -3 }),
      c("Vai embora cedo para trabalhar na ideia sem atrapalhar a festa.", "Júlia recebe a ausência como mensagem mais clara do que qualquer explicação posterior.", { conexao: -6, estimulo: 4 })
    ]
  },
  {
    id: 10, date: "Agosto · Ano 2", age: "19 anos", title: "Domingo desaparecido", routes: ["romance", "familia", "hobby"], complicator: "Foco prolongado em interesses",
    event: [
      "Daniel começa a programar às sete da manhã. Quando olha o relógio novamente são quatro da tarde.",
      "Há nove mensagens de Júlia, três da mãe e uma de Marina: 'Mamãe está puta'. É aniversário do pai.",
      "Ele chega quando estão cortando o bolo. O pai não discute. Júlia fala pouco na volta."
    ],
    question: "O que Daniel faz depois?",
    choices: [
      c("Admite que não percebeu o tempo passar e evita transformar a explicação em desculpa.", "O pai continua magoado e Júlia continua cansada. Daniel aceita que compreender o mecanismo não apaga a ausência.", { autenticidade: 4, conexao: 1, regulacao: 2 }, true),
      c("Promete que nunca mais vai acontecer.", "A promessa alivia a conversa por uma noite e cria uma dívida impossível para o futuro.", { conexao: 1, autenticidade: -3 }),
      c("Mostra o que produziu para provar que o dia não foi desperdiçado.", "O pai olha o protótipo sem interesse. O argumento transforma a ausência em escolha aos olhos de quem esperou.", { conexao: -5, estimulo: 2 }),
      c("Instala cinco alarmes e uma rotina rígida imediatamente.", "Na primeira semana funciona. Na segunda, começa a desligar os alarmes sem registrar que fez isso.", { regulacao: -2, energia: -2 })
    ]
  },
  {
    id: 11, date: "Outubro · Ano 2", age: "19 anos", title: "Cinco vírgula dois", routes: ["faculdade", "romance"], complicator: "Descompasso potencial-desempenho",
    event: [
      "Daniel tira a maior nota da turma numa disciplina difícil e 5,2 numa disciplina simples na mesma semana.",
      "Na segunda, esqueceu atividades, perdeu prazos e confiou que conseguiria recuperar depois. Júlia olha as notas e diz que parecem pertencer a duas pessoas.",
      "Daniel acha a diferença previsível. Isso preocupa Júlia mais do que a nota."
    ],
    question: "Como Daniel reage?",
    choices: [
      c("Reconhece o padrão e anota quais situações o fazem funcionar ou desaparecer.", "A lista não resolve o semestre, mas pela primeira vez transforma 'sou inconsistente' em condições observáveis.", { regulacao: 5, autonomia: 2, autenticidade: 2 }, true),
      c("Decide compensar tirando dez em todas as próximas provas.", "Ele consegue estudar intensamente por alguns dias e volta a esquecer uma entrega administrativa.", { energia: -3, regulacao: -2 }),
      c("Conclui que notas não medem inteligência e deixa de se importar.", "A frase protege o orgulho e não impede que as consequências acadêmicas continuem existindo.", { autenticidade: -2, regulacao: -3 }),
      c("Pede para Júlia controlar seus prazos.", "Ela ajuda por uma semana e percebe que virou responsável por uma rotina que não é dela.", { conexao: -3, autonomia: -4 })
    ]
  },
  {
    id: 12, date: "Dezembro · Ano 2", age: "19 anos", title: "Reprovado", routes: ["faculdade", "familia"], complicator: "Sub-rendimento",
    event: [
      "Daniel reprova por falta numa disciplina cujo conteúdo domina. A professora lembra que ele ajudou colegas antes das provas e pergunta como chegou àquele resultado.",
      "Em casa, o pai interpreta a reprovação como irresponsabilidade. Daniel corrige uma frase dele no meio da discussão e transforma o jantar numa guerra sobre detalhes.",
      "Antes de sair da mesa, o pai diz: 'Seu maior problema é achar que inteligência compensa tudo'."
    ],
    question: "O que Daniel faz naquela noite?",
    choices: [
      c("Revê o semestre sozinho e percebe que o pai acertou uma parte que ele não queria ouvir.", "A conclusão irrita. Mesmo assim, Daniel distingue capacidade de cumprir rotina e para de usar uma como prova automática da outra.", { autenticidade: 4, regulacao: 4, energia: -1 }, true),
      c("Prepara argumentos para provar que a regra de frequência é ruim.", "Os argumentos são bons e não mudam a reprovação. Ele amanhece com seis páginas e nenhum plano para o próximo semestre.", { estimulo: 2, regulacao: -3, energia: -2 }),
      c("Decide que a família nunca o compreenderá e corta contato por alguns dias.", "O silêncio reduz o conflito e amplia exatamente a distância que o incomodava.", { conexao: -5, energia: 1 }),
      c("Promete ao pai que daqui para frente será um aluno perfeito.", "A promessa produz alívio imediato e uma meta que Daniel sabe, ainda naquela noite, que não corresponde a como ele funciona.", { autenticidade: -4, regulacao: -2 })
    ]
  },
  {
    id: 13, date: "Fevereiro · Ano 3", age: "20 anos", title: "O inteligente", routes: ["familia", "faculdade"], complicator: "Expectativas externas elevadas",
    event: [
      "Num almoço de família, uma tia comenta a reprovação e imediatamente conclui que Daniel recuperará tudo porque sempre foi 'o inteligente'.",
      "O pai diz que pelo menos reconhecem o potencial dele. Daniel ouve a palavra como se fosse uma conta em aberto.",
      "Na volta às aulas, colegas voltam a pedir ajuda antes mesmo de perguntar como foram suas férias."
    ],
    question: "Quando Bruno pede que ele resolva um exercício antes da aula, o que Daniel faz?",
    choices: [
      c("Ajuda, mas diz quando não sabe e procura junto.", "Bruno estranha a primeira dúvida e depois continua normalmente. Daniel descobre que admitir ignorância incomoda mais a ele do que ao colega.", { autenticidade: 4, conexao: 2, regulacao: 2 }, true),
      c("Resolve mesmo sem tempo porque é o que esperam dele.", "Chega atrasado à própria aula e reforça uma função que já o cansa.", { energia: -3, autonomia: -3, conexao: 1 }),
      c("Recusa de forma seca para desmontar o rótulo.", "Bruno para de pedir ajuda por um tempo, inclusive quando Daniel gostaria de participar.", { autonomia: 2, conexao: -3 }),
      c("Finge não saber.", "A conversa termina rápido, mas Daniel passa o resto da aula irritado com a própria encenação.", { autenticidade: -5, energia: -1 })
    ]
  },
  {
    id: 14, date: "Abril · Ano 3", age: "20 anos", title: "Pergunta ao Daniel", routes: ["trabalho", "faculdade"], complicator: "Pressão do rótulo",
    event: [
      "Daniel consegue estágio numa empresa de logística. Marcelo, o supervisor, o apresenta como o aluno indicado por um professor.",
      "Nos primeiros dias, Daniel pesquisa escondido qualquer dúvida simples antes de perguntar. Quando tenta adivinhar uma regra da planilha, erra uma fórmula que afeta um relatório.",
      "Marcelo corrige sem drama e diz: 'Você podia ter perguntado'."
    ],
    question: "No problema seguinte, Daniel não sabe uma função básica do sistema. O que ele faz?",
    choices: [
      c("Fica alguns minutos tentando sozinho e então pergunta diretamente.", "A pergunta leva trinta segundos. Daniel sente uma vergonha desproporcional que ninguém ao redor parece notar.", { regulacao: 4, autonomia: 1, energia: 2 }, true),
      c("Pesquisa até descobrir sozinho, custe o tempo que custar.", "Duas horas depois sabe muito mais sobre o sistema do que precisava e perdeu o prazo da tarefa original.", { estimulo: 3, energia: -3, regulacao: -3 }),
      c("Inventa uma desculpa para adiar a entrega.", "A dúvida simples vira um problema de confiança quando Marcelo descobre que bastava uma pergunta.", { autenticidade: -4, conexao: -3 }),
      c("Diz a Marcelo que a interface é mal projetada.", "Marcelo concorda parcialmente e ainda pergunta por que Daniel não pediu ajuda.", { autonomia: 1, regulacao: -2 })
    ]
  },
  {
    id: 15, date: "Junho · Ano 3", age: "20 anos", title: "Henrique", routes: ["amizades", "hobby", "faculdade"], complicator: "Dificuldade de encontrar pares compatíveis",
    event: [
      "Num projeto optativo, Daniel conhece Henrique. A primeira conversa longa começa em jogos e termina três horas depois numa discussão sobre métricas e comportamento.",
      "Daniel perde o ônibus sem perceber. Na semana seguinte, mostra seu RPG. Henrique testa por vinte minutos e diz que metade das regras não funciona.",
      "Daniel sente alívio em vez de ofensa: finalmente alguém acompanhou o sistema inteiro antes de criticá-lo."
    ],
    question: "O que Daniel faz com Henrique depois do teste?",
    choices: [
      c("Convida Henrique para desmontar o projeto com ele e talvez construir algo menor.", "Henrique aceita com a condição de poder cortar ideias. A amizade ganha uma tarefa concreta e o jogo ganha, pela primeira vez, um escopo possível.", { conexao: 6, estimulo: 5, autenticidade: 4 }, true),
      c("Entrega o projeto inteiro para Henrique revisar.", "Henrique devolve parte e lembra que ainda tem a própria vida. Daniel percebe que compatibilidade não significa disponibilidade ilimitada.", { conexao: -1, autonomia: -2 }),
      c("Evita chamá-lo de novo para não parecer intenso demais.", "As semanas passam e Daniel volta a reclamar, sozinho, que nunca encontra gente interessada nas mesmas coisas.", { conexao: -4, autenticidade: -3 }),
      c("Abandona os amigos antigos porque finalmente encontrou alguém que o acompanha.", "Henrique não quer ocupar esse lugar e Daniel cria um isolamento novo ao tentar resolver um antigo.", { conexao: -5, regulacao: -2 })
    ]
  },
  {
    id: 16, date: "Agosto · Ano 3", age: "20 anos", title: "Duas mesas", routes: ["romance", "amizades"], complicator: "Dificuldade de pertencimento",
    event: [
      "No aniversário de Bruno, Daniel alterna entre a mesa da turma e a mesa dos amigos de Júlia. É bem recebido nas duas.",
      "Ainda assim, passa a noite ajustando assunto, tom e ritmo conforme muda de lugar. Na volta, Júlia diz que ele parecia observar a festa de fora.",
      "Daniel sabe exatamente o que ela quer dizer e não sabe explicar por quê."
    ],
    question: "Júlia pergunta onde ele gostaria de ter ficado. O que ele responde?",
    choices: [
      c("Diz que gostou de estar ali, mas não conseguiu parar de se ajustar.", "Júlia não tenta corrigir a sensação. Só pergunta em quais momentos ele precisou fazer isso, e a conversa fica mais íntima que a festa.", { conexao: 4, autenticidade: 5, regulacao: 2 }, true),
      c("Diz que prefere ficar sozinho a conviver com gente superficial.", "A frase simplifica uma sensação complexa e inclui pessoas de quem ele realmente gosta.", { conexao: -5, autenticidade: -2 }),
      c("Diz que está tudo bem para não preocupar Júlia.", "Ela aceita a resposta e Daniel sente, imediatamente, que acabou de produzir a distância que estava tentando descrever.", { autenticidade: -4, conexao: -2 }),
      c("Decide organizar uma festa só com pessoas compatíveis.", "A lista de convidados vira um exercício impossível de classificação e a festa nunca sai da nota do celular.", { energia: -2, regulacao: -1 })
    ]
  },
  {
    id: 17, date: "Outubro · Ano 3", age: "20 anos", title: "Dois pontos", routes: ["faculdade", "trabalho"], complicator: "Sensibilidade a injustiça",
    event: [
      "Um professor tira dois pontos de toda a turma porque três alunos colaram. Bruno acha injusto, mas prefere esquecer.",
      "Daniel lê regulamentos, monta argumentos e percebe que está prestes a gastar horas por dois pontos que não mudarão sua média.",
      "No estágio, Marcelo acaba de aprovar uma mudança de processo proposta por Daniel porque a evidência era boa."
    ],
    question: "O que Daniel faz com a punição coletiva?",
    choices: [
      c("Escreve uma contestação objetiva, envia uma vez e aceita que talvez não mude nada.", "A coordenação responde dias depois e revê parte da decisão. Daniel ainda pensa em três argumentos que poderia ter acrescentado, mas não reabre o caso.", { autonomia: 4, regulacao: 4, energia: -1 }, true),
      c("Larga tudo até conseguir derrubar a decisão.", "Dois pontos passam a consumir noites, atrasar o estágio e irritar colegas que já seguiram em frente.", { energia: -6, regulacao: -4 }),
      c("Fica quieto porque reclamar não vale o esforço.", "A média permanece quase igual. O incômodo com ter aceitado a regra permanece muito mais tempo.", { autenticidade: -4, regulacao: -2 }),
      c("Confronta o professor em público no início da aula.", "A discussão sai do mérito e vira disputa de autoridade. A turma que ele queria defender começa a desejar que acabe logo.", { conexao: -4, regulacao: -3 })
    ]
  },
  {
    id: 18, date: "Dezembro · Ano 3", age: "20 anos", title: "A pergunta pequena", routes: ["romance", "familia"], complicator: "Preocupações existenciais",
    event: [
      "Júlia pergunta em que cidade Daniel gostaria de morar depois de formado. Em minutos, ele já está pensando em carreira, filhos, dinheiro, propósito e quantas escolhas de uma vida são feitas por vontade ou medo.",
      "Na mesma semana, Marina conta em segredo que quer prestar vestibular para cinema e pede que ele não diga ao pai.",
      "Duas perguntas comuns abrem futuros demais ao mesmo tempo."
    ],
    question: "O que Daniel faz primeiro?",
    choices: [
      c("Separa as perguntas: responde a Júlia sobre cidades e promete a Marina guardar o segredo até ela estar pronta.", "Nada fica resolvido, mas o futuro deixa de ser um único problema gigantesco por algumas horas.", { regulacao: 5, conexao: 3, energia: 1 }, true),
      c("Monta um plano de cinco anos para ele e Júlia.", "A planilha responde questões que Júlia nunca perguntou e cria outras sobre um futuro que os dois ainda não decidiram compartilhar.", { conexao: -3, regulacao: -2 }),
      c("Conta ao pai sobre Marina para evitar uma decisão impulsiva.", "Marina descobre e deixa de confiar nele justamente quando precisava de um aliado.", { conexao: -6, autonomia: -2 }),
      c("Evita os dois assuntos até saber qual é a decisão correta.", "As decisões continuam avançando sem ele: inscrições têm prazo e Júlia percebe a evasão.", { autonomia: -3, conexao: -3 })
    ]
  },
  {
    id: 19, date: "Fevereiro · Ano 4", age: "21 anos", title: "Agenda cheia", routes: ["trabalho", "romance", "hobby"], complicator: "Sobrecarga e desengajamento",
    event: [
      "Daniel começa o quarto ano com mais horas no estágio, o jogo com Henrique, faculdade, namoro, academia e compromissos familiares.",
      "Por algumas semanas, cada intervalo vira tarefa e cada deslocamento vira leitura. Então começam os atrasos pequenos: uma mensagem, uma reunião, uma entrega.",
      "A agenda está eficiente. Não há espaço para nada dar errado."
    ],
    question: "Quando percebe os primeiros atrasos, o que Daniel faz?",
    choices: [
      c("Corta temporariamente duas atividades antes de descobrir qual delas 'merece' ficar.", "A redução parece fracasso nos primeiros dias e alívio na semana seguinte. O jogo desacelera, mas deixa de competir com tudo ao mesmo tempo.", { energia: 5, regulacao: 4, autonomia: 2 }, true),
      c("Otimiza a agenda em blocos de quinze minutos.", "A planilha fica impecável e transforma qualquer atraso de dez minutos numa cascata até a madrugada.", { energia: -4, regulacao: -3 }),
      c("Pede a Júlia para lembrá-lo das coisas pessoais.", "Ela ajuda e rapidamente percebe que virou a camada de correção de um sistema que continua sobrecarregado.", { conexao: -3, autonomia: -4 }),
      c("Abandona o jogo, porque hobby é o menos importante.", "A agenda ganha horas e perde uma das poucas atividades que ainda forneciam energia em vez de apenas consumi-la.", { estimulo: -5, energia: -2 })
    ]
  },
  {
    id: 20, date: "Abril · Ano 4", age: "21 anos", title: "Quarta-feira", routes: ["trabalho", "romance", "faculdade"], complicator: "Burnout",
    event: [
      "Numa quarta-feira, Daniel abre o computador às oito e às onze ainda não começou. Sabe o que fazer; não consegue começar.",
      "Falta à aula, sai cedo do estágio e não abre o jogo. Júlia o encontra vestido, deitado, olhando para o teto.",
      "Tudo que antes tinha pesos diferentes agora parece exigir a mesma energia impossível."
    ],
    question: "Quando Júlia pergunta o que ele precisa, o que Daniel consegue responder?",
    choices: [
      c("'Não sei. Só não consigo continuar como está.'", "É pouco, mas é a primeira resposta que não tenta transformar exaustão em problema técnico. Júlia ajuda a cancelar o que pode ser cancelado naquela semana.", { energia: 6, conexao: 4, autenticidade: 4 }, true),
      c("'Só preciso dormir hoje e amanhã volto ao normal.'", "Ele dorme e acorda ainda exausto. A expectativa de normalidade vira mais uma tarefa atrasada.", { energia: 1, regulacao: -4 }),
      c("'Preciso terminar tudo para poder descansar.'", "A lista cresce mais rápido do que ele consegue executá-la. O descanso fica sempre do outro lado de uma linha que se move.", { energia: -6, regulacao: -4 }),
      c("'Nada. Eu resolvo.'", "Júlia vai embora porque não sabe como ficar. Daniel sente alívio por não precisar conversar e, horas depois, a casa parece vazia demais.", { conexao: -5, autenticidade: -3 })
    ]
  },
  {
    id: 21, date: "Junho · Ano 4", age: "21 anos", title: "Dois relógios", routes: ["romance", "familia"], complicator: "Desenvolvimento assíncrono",
    event: [
      "Durante a recuperação, Daniel percebe uma contradição que o envergonha: consegue discutir emoções com precisão e ainda passa uma tarde inteira desregulado porque Júlia demora a responder.",
      "Ele sabe racionalmente que quatro horas de silêncio não significam abandono. O corpo não parece convencido.",
      "A mãe diz algo simples: entender uma emoção não dá idade emocional infinita a ninguém."
    ],
    question: "Quando Júlia finalmente responde, o que Daniel faz?",
    choices: [
      c("Espera alguns minutos e diz que ficou mais afetado do que gostaria, sem acusá-la.", "A conversa é desconfortável e curta. Júlia não precisa defender uma ausência que não foi agressão, e Daniel não precisa fingir indiferença.", { regulacao: 5, conexao: 4, autenticidade: 3 }, true),
      c("Responde imediatamente como se nada tivesse acontecido.", "O tom casual dura três mensagens antes de uma irritação deslocada aparecer em outro assunto.", { autenticidade: -4, regulacao: -3 }),
      c("Explica detalhadamente por que a demora foi objetivamente problemática.", "A análise racionaliza uma reação que ele próprio sabe não ser proporcional. Júlia termina defendendo o direito de passar uma tarde longe do celular.", { conexao: -4, regulacao: -2 }),
      c("Desliga o telefone pelo mesmo número de horas.", "A simetria parece justa por dez minutos e infantil assim que ele reconhece o que está fazendo.", { conexao: -4, autenticidade: -2 })
    ]
  },
  {
    id: 22, date: "Agosto · Ano 4", age: "21 anos", title: "Marina", routes: ["familia", "romance"], complicator: "Intensidade emocional",
    event: [
      "Marina conta ao pai que pretende fazer cinema. Ele responde que ela vai jogar a vida fora.",
      "Daniel entra na discussão, recebe de volta a reprovação antiga e, em minutos, quatro anos de ressentimentos estão na mesa. Marina começa a chorar. A mãe manda Daniel sair.",
      "Júlia o encontra andando sem destino, ainda repetindo cada frase mentalmente."
    ],
    question: "O que Daniel faz nas horas seguintes?",
    choices: [
      c("Anda, fala demais com Júlia e adia qualquer nova mensagem à família até a intensidade baixar.", "Ele continua preso à discussão, mas pelo menos não adiciona outra rodada enquanto ainda responde a frases que já terminaram.", { regulacao: 4, conexao: 2, energia: -2 }, true),
      c("Volta imediatamente para terminar a conversa direito.", "A segunda rodada começa com menos gritos e termina com novas frases que ninguém consegue recolher.", { conexao: -6, regulacao: -4 }),
      c("Escreve um texto longo para o pai explicando toda a história familiar.", "Às três da manhã, o texto tem oito páginas. Daniel percebe que não quer enviá-lo e continua acordado revisando mesmo assim.", { energia: -4, regulacao: -2 }),
      c("Bloqueia a família até Marina entrar na faculdade.", "A decisão transforma defesa da irmã em desaparecimento exatamente quando ela ainda precisa atravessar a casa todos os dias.", { conexao: -5, autonomia: -2 })
    ]
  },
  {
    id: 23, date: "Outubro · Ano 4", age: "21 anos", title: "A festa de Marcelo", routes: ["trabalho", "romance"], complicator: "Sensibilidade sensorial",
    event: [
      "Marcelo é promovido e leva a equipe a um bar. Daniel tenta acompanhar a comemoração, mas música, luzes, vozes, perfumes e ar-condicionado parecem chegar sem filtro.",
      "Depois de quarenta minutos, sai para a calçada. Júlia vai atrás e pergunta se ele quer ir embora.",
      "Daniel está cansado de parecer difícil, mas está mais cansado ainda de ficar ali."
    ],
    question: "O que ele responde?",
    choices: [
      c("Diz que quer ir e manda uma mensagem curta de parabéns a Marcelo antes de sair.", "Ninguém transforma a saída num evento. Daniel percebe que suportar até o limite era uma regra que ele mesmo vinha impondo.", { energia: 5, regulacao: 4, autenticidade: 4 }, true),
      c("Diz que está bem e volta para dentro.", "Vinte minutos depois está irritado com perguntas simples e Júlia precisa praticamente decidir por ele que é hora de ir.", { energia: -5, regulacao: -3, conexao: -2 }),
      c("Vai embora sem avisar ninguém.", "A saída resolve o estímulo e cria no dia seguinte uma sequência de perguntas sobre onde ele sumiu.", { energia: 3, conexao: -3 }),
      c("Pede para todos mudarem para um lugar mais silencioso.", "Alguns topariam, outros não. A proposta faz Daniel se sentir centro de uma logística que queria justamente evitar.", { regulacao: -2, autenticidade: 1 })
    ]
  },
  {
    id: 24, date: "Dezembro · Ano 4", age: "21 anos", title: "Talvez", routes: ["hobby", "trabalho"], complicator: "Intensidade imaginativa",
    event: [
      "O arquivo 'Talvez' de Daniel tem 184 ideias. Henrique o chama de cemitério e corta quinze sistemas do jogo que tentam terminar juntos.",
      "Na mesma semana, Marcelo diz que existe uma vaga provável para Daniel depois da formatura.",
      "Pela primeira vez, duas coisas que ele quer têm prazo e nenhuma aceita possibilidades infinitas."
    ],
    question: "O que Daniel faz com o jogo?",
    choices: [
      c("Aceita congelar o escopo e move as novas ideias para 'Talvez'.", "Dói ver boas ideias fora do produto. Pela primeira vez, porém, o número de tarefas restantes diminui toda semana.", { autonomia: 4, regulacao: 5, estimulo: 2 }, true),
      c("Convence Henrique a incluir só mais três sistemas essenciais.", "Os três sistemas criam sete dependências. Henrique lembra por que tinham congelado o escopo.", { regulacao: -4, energia: -3, estimulo: 2 }),
      c("Abandona o arquivo de ideias para aprender a ser objetivo.", "Em dois dias há um novo arquivo chamado 'Depois'. O problema mudou de nome.", { autenticidade: -3, regulacao: -1 }),
      c("Escolhe a vaga e encerra o jogo para reduzir incerteza.", "A decisão traz alívio por uma semana e depois começa a parecer uma amputação feita apenas para não escolher mais nada.", { autonomia: -4, estimulo: -4 })
    ]
  },
  {
    id: 25, date: "Fevereiro · Ano 5", age: "22 anos", title: "A célula errada", routes: ["trabalho", "faculdade"], complicator: "Pensamento complexo e busca de padrões",
    event: [
      "Daniel encontra uma célula estranha numa planilha do estágio. Dois dias depois, reconstruiu o processo e descobriu uma regra mantida por causa de outra regra eliminada três anos antes.",
      "Marcelo apresenta a descoberta à diretoria e oferece participação num projeto maior.",
      "No mesmo período, o orientador cobra três páginas do trabalho final que continuam atrasadas."
    ],
    question: "Daniel tem uma tarde livre. Onde a atenção dele vai primeiro?",
    choices: [
      c("Ao problema do estágio, e ele precisa interromper deliberadamente para escrever ao menos uma página da faculdade.", "A investigação puxa como sempre. O alarme que ele colocou para si mesmo parece absurdo, mas funciona o suficiente para impedir outro atraso total.", { estimulo: 4, regulacao: 3, energia: -1 }, true),
      c("Exclusivamente às três páginas, sem tocar no problema interessante.", "Ele abre o arquivo acadêmico, relê duas frases e quinze minutos depois percebe que está pensando na cadeia de regras do estágio.", { regulacao: -2, estimulo: -3 }),
      c("Ao estágio, porque trabalho real importa mais que faculdade.", "A justificativa é convincente até chegar outro prazo acadêmico que continua produzindo consequências reais.", { autonomia: 1, regulacao: -4 }),
      c("Tenta alternar a cada quinze minutos entre as duas tarefas.", "Cada troca exige reconstruir contexto. Ao fim da tarde trabalhou muito e terminou pouco nas duas frentes.", { energia: -4, regulacao: -2 })
    ]
  },
  {
    id: 26, date: "Abril · Ano 5", age: "22 anos", title: "Página doze", routes: ["faculdade", "romance"], complicator: "Sobre-excitabilidade intelectual",
    event: [
      "O orientador aprova um capítulo. Daniel continua pensando numa hipótese fraca da página doze e passa a noite reconstruindo um argumento que já havia sido aceito.",
      "Ele perde um almoço com Júlia. Quando chega, ela não briga. Diz apenas que precisam conversar.",
      "Júlia ainda o ama, mas não quer construir uma vida em que problemas só terminem quando a cabeça dele os considera completamente encerrados."
    ],
    question: "O que Daniel faz durante o término?",
    choices: [
      c("Tenta entender, pergunta o que precisa perguntar e resiste à vontade de converter a decisão dela num problema solucionável.", "Não há frase que reverta a escolha. Daniel sai com perguntas sem resposta e com a percepção incômoda de que respeitar alguém também pode significar não convencê-la.", { conexao: -5, autenticidade: 5, regulacao: 4 }, true),
      c("Propõe um plano detalhado de mudanças e acompanhamento.", "Júlia ouve até o fim e repete que não veio negociar metas. O plano perfeito chega depois da decisão que tentava evitar.", { conexao: -6, regulacao: -3 }),
      c("Diz que ela está desistindo justamente quando ele mais precisa.", "A frase desloca para Júlia a responsabilidade por uma dinâmica que ela passou anos tentando explicar.", { conexao: -7, autenticidade: -2 }),
      c("Aceita de forma fria e vai embora antes de sentir qualquer coisa.", "A conversa termina limpa. A sensação não. Nas semanas seguintes, tudo retorna em momentos aleatórios e sem contexto.", { conexao: -5, regulacao: -4, energia: -2 })
    ]
  },
  {
    id: 27, date: "Junho · Ano 5", age: "22 anos", title: "Partidas", routes: ["amizades", "hobby", "romance"], complicator: "Solidão após perda de pares",
    event: [
      "Dois meses depois do término, Henrique recebe uma proposta em outro estado. O jogo pode continuar remotamente, mas a amizade perde os encontros espontâneos.",
      "Daniel ainda tem Bruno, Larissa, Caio, colegas do estágio e família. Mesmo assim, sente o espaço deixado por duas pessoas específicas.",
      "Agora ele sabe que quantidade de companhia e compatibilidade são variáveis diferentes. Isso não reduz a falta."
    ],
    question: "Na primeira semana depois da mudança de Henrique, o que Daniel tende a fazer?",
    choices: [
      c("Mantém contato com os amigos antigos, mas passa noites demais sozinho no jogo porque ali ainda sente a presença de Henrique.", "O projeto vira ponte e esconderijo ao mesmo tempo. Daniel não desaparece socialmente, mas percebe que está usando trabalho para ocupar um lugar que trabalho não preenche.", { conexao: -1, estimulo: 4, energia: -2 }, true),
      c("Enche a agenda de festas e encontros para não ficar sozinho.", "Há companhia quase toda noite. A solidão piora quando ele volta de cada encontro ainda sentindo que a conversa que queria ter não aconteceu.", { conexao: -4, energia: -5 }),
      c("Corta o jogo porque lembra Henrique e Júlia.", "Ele remove justamente a atividade que ainda produz continuidade com uma das perdas.", { estimulo: -5, conexao: -3 }),
      c("Decide que precisa de um novo namoro imediatamente.", "Duas tentativas de encontro parecem entrevistas para ocupar uma vaga emocional. Daniel volta para casa mais cansado do que interessado.", { conexao: -4, energia: -3 })
    ]
  },
  {
    id: 28, date: "Agosto · Ano 5", age: "22 anos", title: "O melhor caminho", routes: ["trabalho", "faculdade", "hobby"], complicator: "Múltiplas possibilidades e escolha",
    event: [
      "Marcelo oferece efetivação. O orientador sugere pós-graduação. Henrique quer lançar o jogo comercialmente.",
      "Daniel cria uma planilha com salário, risco, aprendizado, autonomia, tempo e possibilidade de arrependimento. Depois questiona os pesos. Depois cria cenários.",
      "Marina encontra a análise aberta e pergunta se ele fez um modelo multicritério da própria vida."
    ],
    question: "O que Daniel faz depois de perceber que o modelo não escolhe por ele?",
    choices: [
      c("Mantém a análise como informação e aceita que alguma parte da decisão será perda sem prova de optimalidade.", "A planilha continua útil quando deixa de fingir que contém uma resposta objetiva. Daniel começa a testar combinações possíveis em vez de buscar uma vida dominante em todos os critérios.", { autonomia: 6, regulacao: 5, energia: 2 }, true),
      c("Adiciona mais critérios até aparecer uma vencedora clara.", "A precisão aumenta e a decisão continua empatada, agora com vinte e três linhas de justificativa.", { energia: -4, regulacao: -3 }),
      c("Joga uma moeda para escapar da análise.", "Ele não consegue obedecer ao resultado e descobre, pela irritação, qual opção não queria perder.", { autonomia: 1, regulacao: -1 }),
      c("Deixa o pai decidir porque tem mais experiência.", "A ansiedade cai imediatamente e volta como ressentimento quando a escolha começa a parecer a vida de outra pessoa.", { autonomia: -6, conexao: 1 })
    ]
  },
  {
    id: 29, date: "Outubro · Ano 5", age: "22 anos", title: "Potencial", routes: ["familia", "trabalho", "hobby"], complicator: "Conflito entre realização e expectativas",
    event: [
      "Daniel decide não aceitar a efetivação tradicional. Negocia alguns meses em carga reduzida, prepara candidatura para pós-graduação e termina o lançamento do jogo com Henrique.",
      "O pai chama a decisão de desperdício de oportunidade e repete que Daniel tem potencial para muito mais.",
      "Cinco anos antes, Daniel teria preparado argumentos suficientes para vencer a mesa."
    ],
    question: "O que ele faz agora?",
    choices: [
      c("Diz que pode estar errando, mas que a escolha é dele, e encerra a discussão antes de transformá-la em tribunal.", "O pai continua discordando. Nada é resolvido naquela noite, mas Daniel sai sem precisar provar que sua escolha é universalmente correta.", { autonomia: 7, autenticidade: 5, regulacao: 4, conexao: -1 }, true),
      c("Apresenta projeções financeiras até o pai admitir que a decisão é racional.", "As projeções melhoram. A aprovação não vem. A conversa dura horas porque o problema nunca foi apenas matemática.", { energia: -4, conexao: -3 }),
      c("Rompe com o pai por não receber apoio.", "A autonomia fica clara e a perda de vínculo passa a acompanhar uma decisão que Daniel queria que fosse sua, não uma reação.", { autonomia: 2, conexao: -7 }),
      c("Aceita a efetivação para acabar com o conflito.", "O jantar melhora imediatamente. Na semana seguinte, Daniel abre o contrato e sente que trocou incerteza externa por conflito interno.", { conexao: 3, autonomia: -7, autenticidade: -5 })
    ]
  },
  {
    id: 30, date: "Fevereiro · Ano 6", age: "23 anos", title: "Depois", routes: ["faculdade", "familia", "trabalho", "hobby", "amizades", "romance"], complicator: "Construção de ambientes compatíveis",
    event: [
      "A formatura aconteceu três dias atrás. Júlia apareceu, conversou com Daniel e foi embora sem promessa de retorno. Marina entrou em cinema; o pai ainda discorda, mas ajudou na mudança.",
      "O jogo de Daniel e Henrique foi lançado e vendeu algumas centenas de cópias. Marcelo contratou outra pessoa para a vaga recusada. O trabalho final foi aprovado com uma página que Daniel ainda mudaria.",
      "Na segunda-feira, não existe semestre seguinte. Há quatro caminhos reais sobre a mesa e nenhum deles resolve quem Daniel é."
    ],
    question: "Qual vida Daniel decide experimentar primeiro?"
  }
];

export type EndingId = "pesquisa" | "empresa" | "jogo" | "portfolio";
export type Ending = { id: EndingId; title: string; choice: string; body: string[]; statBias: Partial<Record<StatKey, number>> };

export const endings: Ending[] = [
  {
    id: "pesquisa", title: "Perguntas que ficam", choice: "Aceitar a pós-graduação e reduzir o restante para caber nela.",
    body: ["Daniel escolhe a pós-graduação sem chamar a escolha de destino. Mantém algumas horas de consultoria, congela novas funções do jogo e aprende rapidamente que pesquisa também contém burocracia, repetição e gente.", "Henrique continua parceiro à distância. Marina manda roteiros para ele ler. O pai continua perguntando quando aquilo vira um emprego 'de verdade'. Daniel para de responder toda vez.", "Não encontrou o ambiente perfeito. Encontrou um ambiente em que, por enquanto, há perguntas suficientes para querer ficar."],
    statBias: { estimulo: 5, autonomia: 2, energia: -2 }
  },
  {
    id: "empresa", title: "Processos reais", choice: "Procurar outra posição profissional, agora escolhendo o ambiente e não apenas a vaga.",
    body: ["Daniel não recupera a vaga de Marcelo. Procura outra empresa e recusa duas propostas antes de aceitar uma equipe pequena que tolera perguntas e exige entregas.", "Descobre que gostar de trabalho não impede tédio, conflito ou cansaço. O jogo vira hobby novamente. Henrique reclama e continua mandando builds.", "A diferença é menos épica: Daniel começa a avaliar trabalhos também pelo custo de funcionar neles."],
    statBias: { autonomia: 4, conexao: 2, estimulo: 2 }
  },
  {
    id: "jogo", title: "Versão 1.0", choice: "Dar um ano ao projeto com Henrique e tratá-lo como trabalho de verdade.",
    body: ["Daniel e Henrique formalizam o pequeno estúdio. A primeira decisão é menos criativa do que qualquer um gostaria: orçamento, prazo e quantas ideias precisam morrer antes da próxima versão.", "O pai acha arriscado. Marina oferece ajuda com roteiro. Júlia curte o anúncio e não manda mensagem.", "O jogo não promete sucesso. Pela primeira vez, Daniel aceita que terminar uma coisa pode valer mais do que preservar todas as coisas que ela poderia ter sido."],
    statBias: { estimulo: 5, autenticidade: 4, energia: -3 }
  },
  {
    id: "portfolio", title: "Ano sem nome", choice: "Não escolher uma identidade única ainda: consultoria curta, projeto próprio e candidatura aberta.",
    body: ["Daniel escolhe um ano fragmentado de propósito. Trabalha por projeto, continua o jogo, submete uma candidatura e mantém espaço vazio na agenda.", "A liberdade cobra instabilidade financeira e decisões frequentes. O pai chama de provisório; Daniel concorda. Nem tudo precisa receber nome antes de começar.", "O maior desafio passa a ser não preencher cada espaço livre com uma nova possibilidade."],
    statBias: { autonomia: 6, energia: 2, regulacao: -2 }
  }
];
