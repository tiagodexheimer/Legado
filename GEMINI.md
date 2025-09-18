Projeto de Jogo RPG de Sobrevivência: Fase 1 - Sobrevivência Primitiva
A Fase 1 do seu jogo será o pilar fundamental, onde o jogador mergulhará em um ambiente selvagem, dominando as tecnologias mais básicas para sobreviver e progredir. O foco principal é a interação imersiva com o ambiente e o crafting utilizando princípios de física realista.
Gênero: RPG de Sobrevivência em Terceira/Primeira Pessoa, Multiplayer Online (PvP e PvE) Período Tecnológico: Paleolítico Superior ao Neolítico Objetivo da Fase 1: Estabelecer as mecânicas centrais de sobrevivência, crafting com física e progressão de habilidades, criando uma experiência sólida e imersiva.
1. Visão Geral do Jogo e Ambiente
O jogador (e outros jogadores) começam em um ambiente selvagem e inóspito. O mundo deve parecer vivo e perigoso, com ciclos naturais e criaturas selvagens.
Ambiente e Mapa Inicial:
Unreal Engine 5.4 (UE5.4) Capacidades: O projeto utilizará a UE5.4, aproveitando seu robusto sistema de iluminação (Lumen), renderização de alto desempenho (Nanite) e sistema de partículas (Niagara) para visuais realistas. As ferramentas de Landscape da UE5.4 não serão usadas para o terreno principal, mas sim para elementos estáticos ou camadas de textura.
Geração Procedural e Modificação do Mundo (Voxel ou Similar): O mundo será gerado proceduralmente a cada nova sessão ou servidor, garantindo uma experiência única e vasta. Crucialmente, a topografia será construída utilizando uma tecnologia de voxel ou similar que permita a modificação dinâmica do terreno pelos jogadores. Isso possibilita:
Terraformagem: Jogadores poderão escavar, nivelar e construir elevações no terreno em tempo real.
Criação de Cavernas: Será possível cavar túneis e criar cavernas subterrâneas, adicionando uma dimensão vertical à exploração e um novo tipo de abrigo.
Construção Dinâmica: As construções dos jogadores se integrarão diretamente ao terreno, podendo ser escavadas na rocha ou ter suas fundações moldadas no solo.
Realismo e Coerência: A geração inicial do terreno seguirá princípios de realismo, com paisagens que imitam a complexidade do mundo real, como montanhas, vales e formações geológicas. A alteração pelos jogadores será contínua e visível.
Implementação na UE5.4 (Desafios e Abordagem):
Sistema de Voxel Personalizado: A UE5.4 não possui um sistema de voxel nativo, o que exigirá o desenvolvimento de uma solução customizada em C++ ou a integração de um plugin robusto do marketplace. Este sistema será responsável por:
Geração de Dados Voxel: Utilização de funções de ruído (Perlin, Simplex, Worley noise com múltiplas oitavas) combinadas com algoritmos de simulação de erosão (hidráulica e térmica) para preencher o volume do mundo com dados voxel (ex: terra, rocha, água, ar) de forma realista.
Geração de Mesh em Tempo de Execução: Converter os dados voxel em malhas (meshes) visualizáveis e colidíveis em tempo real, otimizando o processo para garantir performance. Isso pode envolver técnicas como Marching Cubes ou Dual Contouring.
Modificação de Voxel em Tempo de Execução: Lógica para adicionar ou remover voxels com base nas ações do jogador (ex: cavar com uma picareta, colocar um bloco de terra), atualizando a mesh do terreno dinamicamente.
Simulação de Biomas e Clima: O ruído também pode ser usado para simular variáveis climáticas como temperatura e pluviosidade em todo o mapa voxel. Combinando altitude (do heightmap interno do voxel), latitude/longitude e essas simulações climáticas, o sistema pode determinar a distribuição de biomas realistas (desertos, florestas tropicais, tundras, pântanos, montanhas nevadas, etc.), atribuindo diferentes materiais e foliage a cada área de voxel.
Geração de Rios e Lagos: A água pode ser simulada como voxels de um tipo específico, fluindo e preenchendo as partes mais baixas do terreno, com simulações de fluxo para criar rios e lagos dinâmicos.
Distribuição de Vegetação e Recursos: Com base nos biomas e nas simulações de altitude/inclinação do terreno voxel, distribua o foliage (árvores, arbustos, grama) e os recursos (rochas, minerais, plantas comestíveis) de forma lógica e realista. Esses elementos serão independentes dos voxels do terreno, mas sua distribuição será influenciada por eles.
Características Geológicas Distintas: Algoritmos complexos poderão inserir formações geológicas maiores dentro do volume voxel, como vastas cadeias de montanhas, platôs íngremes ou até mesmo cicatrizes de antigos eventos vulcânicos ou impactos.
Coerência Multiplayer: A geração e modificação procedural precisam ser determinísticas e replicadas. Usando a mesma seed (semente) e as mesmas regras, o mundo gerado deve ser idêntico para todos os jogadores. Todas as modificações de voxel feitas por um jogador precisarão ser sincronizadas eficientemente através da rede para todos os outros clientes, garantindo que a física e as interações sejam consistentes em um ambiente multiplayer. Isso é um desafio técnico significativo.
Ciclo Dia/Noite:
Implementação na UE5.4: A UE5.4 possui sistemas robustos para ciclos de dia e noite, seja através de plugins do marketplace ou sistemas built-in que controlam a luz direcional, o céu e os materiais baseados na hora do dia. A escuridão noturna pode ser aprimorada com o Lumen (sistema de iluminação global da UE5.4) para um ambiente mais realista e ameaçador.
Sistema Climático:
Implementação na UE5.4: Use o Niagara (sistema de partículas da UE5.4) para efeitos visuais de chuva, neve e vento. Materiais com shaders dinâmicos podem simular a neve acumulando ou a vegetação molhada. A lógica de jogo (ex: fogueiras apagando, velocidade de flechas) será controlada por Blueprints ou C++ baseada nas variáveis climáticas.
2. Mecânicas Centrais de RPG
Essas mecânicas definem a progressão e as interações do jogador.
2.1. O Personagem:
Criação Básica: Utilize Blueprints para o sistema de criação de personagem e o MetaHuman (se quiser um nível de detalhe extremo) ou modelos personalizados para a aparência visual.
Atributos Primários (Força, Agilidade, Vigor, Inteligência, Percepção): Implemente-os em C++ ou Blueprints usando Structs e Data Tables para fácil configuração e balanceamento. A progressão pode ser vinculada a um Sistema de Habilidades baseado no uso (ex: usar um machado aumenta a habilidade de "Silvicultura").
Sistema de Habilidades: Crie um sistema robusto em Blueprints ou C++ onde o uso de ferramentas ou a realização de ações específicas aumenta o nível das habilidades relacionadas, desbloqueando perks ou novas receitas. O Gameplay Ability System (GAS) da UE5.4 pode ser uma opção avançada para isso, mas um sistema customizado em Blueprint pode ser mais rápido para prototipar inicialmente.
2.2. Gerenciamento de Necessidades (Fome, Sede, Temperatura Corporal):
Implementação na UE5.4: Utilize a UMG (Unreal Motion Graphics) para a interface do usuário (HUD) que exibe as barras de necessidades. A lógica de decaimento e impacto na saúde e atributos será em Blueprints ou C++. A temperatura corporal pode interagir com o sistema climático e os tipos de vestimenta equipados.
Saúde e Condições (Ferimentos, Doenças): Um sistema de status effects que aplica modificadores aos atributos ou causa dano ao longo do tempo. O crafting de itens medicinais (plantas, bandagens primitivas) será crucial para a recuperação.
3. Mecânicas com Física Realista
Este é o grande diferencial do seu jogo e exigirá um foco intenso na Chaos Physics Engine da UE5.4.
3.1. Coleta de Recursos:
Corte de Árvores:
Física da Queda: Modele árvores como Skeletal Meshes ou Static Meshes com Chaos Destructible Mesh para a quebra no ponto de corte. A direção da queda pode ser influenciada por vetores de força aplicados no ponto de corte e pela inclinação do terreno (programação em C++ ou Blueprint).
Divisão de Toras: As toras (agora Physics Actors) podem ser interativas. Implemente um minigame usando hitboxes e detecção de colisões para simular o golpe preciso do machado, aplicando forças localizadas que dividem a tora em pedaços menores através de corte procedural ou troca de meshes pré-cortadas.
Mineração:
Fragmentação: Rochas podem ser Destructible Meshes. A colisão da picareta aplica força ao ponto de impacto, quebrando a rocha em fragmentos (partículas Chaos). Rochas maiores podem exigir mais golpes ou ferramentas específicas. A interação com o terreno voxel será fundamental aqui: a mineração removerá voxels, e os fragmentos de rocha serão gerados na superfície do voxel.
Caça e Pesca:
Trajetória de Projéteis: Utilize o sistema de física da UE5.4 para simular balística realista para flechas e lanças (gravidade, arrasto aerodinâmico). O tipo de material da flecha e a força do disparo serão variáveis de entrada.
Impacto no Alvo: Implemente um sistema de hit detection preciso em Skeletal Meshes de animais (ex: verificar qual bone foi atingido). Diferentes bones (cabeça, coração, perna) terão multiplicadores de dano e chances de efeitos como sangramento ou lentidão.
3.2. Criação de Itens (Crafting Imersivo):
Lascagem de Pedra (Knapping):
Minigame Interativo: Esta é a mecânica mais desafiadora e inovadora. Crie um minigame onde o jogador manipula um pedaço de rocha (um Static Mesh ou Procedural Mesh) e usa uma ferramenta. A detecção de colisões (com Physics Bodies para simular a força e ângulo) em pontos específicos da rocha removerá "lascas". Isso pode envolver:
Procedural Mesh Generation: Alterar o mesh da rocha em tempo real para simular a remoção de material.
Pre-fractured Meshes: Usar um mesh pré-fraturado com múltiplas partes que são "removidas" ou "escondidas" com base nos acertos.
Feedback: Feedback visual (partículas, mudanças no material) e auditivo são cruciais.
Fogueira:
Física do Fogo: Utilize o Niagara para um sistema de partículas de fogo dinâmico que reage a materiais próximos (inflamáveis) e ao vento. A radiação de calor pode ser simulada com volumes de calor que afetam a temperatura do jogador. A propagação do fogo para outros objetos inflamáveis pode ser um sistema de trigger baseado em proximidade e tipo de material.
Construção de Abrigos:
Física de Empilhar/Amarrar: Elementos de construção (galhos, toras) serão Physics Actors que podem ser manipulados. Use Physics Constraints (juntas, pivôs) para "amarrar" as peças, e verifique a estabilidade da estrutura através de simulações de física ou cálculos simplificados (Blueprint). A qualidade da construção afeta a durabilidade. A construção integrada ao terreno voxel permitirá que os jogadores cavem fundações ou construam estruturas diretamente modificando a paisagem.
3.3. Combate e Interação:
Física de Combate Corporal:
Peso e Inércia da Arma: Armas terão Physics Bodies que reagem à manipulação do jogador. A inércia pode ser simulada aplicando forças proporcionais à massa da arma durante os swings.
Colisões: Detecção de colisão precisa entre a arma e os Physics Bodies dos inimigos. O tipo de material colidido (osso, carne, armadura primitiva) determinará o feedback (som, partículas, dano).
Ragdolls: A UE5.4 possui suporte robusto para Ragdolls via Chaos Physics. Inimigos abatidos podem cair e interagir realisticamente com o ambiente.
Interação com Objetos: Objetos manipuláveis terão Physics Bodies e massa. A interação (empurrar, arrastar, levantar) dependerá da força do personagem versus o peso e atrito do objeto, tudo simulado pela Chaos Physics.
4. Progressão e Descoberta
Árvore de Tecnologia/Descobertas:
Implementação na UE5.4: Use Data Tables para definir as receitas e tecnologias. Um gráfico em UMG pode representar a árvore visualmente. Desbloqueio pode ser feito através de eventos de gameplay (ex: coletar um recurso raro, atingir um nível de habilidade).
Diário de Sobrevivência:
Implementação na UE5.4: Crie um sistema de diário em UMG que armazena informações dinamicamente (receitas aprendidas, criaturas e plantas descobertas, dicas).
5. Multiplayer, PvP e PvE
A integração de multiplayer é fundamental para a sua visão de jogo.
5.1. Multiplayer Online:
Unreal Engine 5.4 Network: A UE5.4 oferece um framework de networking robusto. A replicação de estados de personagens, inventário, construções e modificações do terreno voxel será crucial. Utilize Actor Replication, RPCs (Remote Procedure Calls) e RepNotifies para garantir a sincronização entre os clientes e o servidor.
Arquitetura: Recomenda-se uma arquitetura de servidor dedicado ou de ouvinte/servidor de hospedeiro para gerenciar a física e a lógica do jogo de forma autoritária, minimizando cheats e problemas de sincronização. A sincronização do estado voxel do mundo entre todos os clientes será um dos maiores desafios de networking.
5.2. PvP (Player vs. Player):
Combate entre Jogadores: As mecânicas de combate corporal e projéteis (seção 3.3) serão aplicadas a outros jogadores. A sincronização de hit detection, dano e ragdolls será vital para uma experiência PvP justa.
Interações Sociais: Incentive a formação de alianças temporárias ou permanentes, mas também permita o combate hostil. Mecânicas de saque (looting) de jogadores abatidos podem ser implementadas.
Bases e Raids: Jogadores podem construir bases diretamente modificando o terreno voxel. A durabilidade das construções e a forma como a física de destruição de objetos (Chaos Destructible Meshes) interage em um ambiente multiplayer, incluindo a capacidade de destruir ou modificar a base voxel de outros jogadores, serão desafios importantes.
5.3. PvE (Player vs. Environment):
Fauna e Predadores: A IA dos animais (selvagens e agressivos) será um componente chave do PvE. Utilize o sistema de Behavior Trees e Perception System da UE5.4 para criar comportamentos realistas (caça, fuga, ataque, pastoreio).
Desafios Ambientais: O ciclo dia/noite e o sistema climático representam ameaças constantes. A sobrevivência contra esses elementos é o cerne do PvE.
Eventos Aleatórios: Eventos climáticos extremos (tempestades, ondas de frio), surtos de doenças ou a migração de manadas podem adicionar dinamismo e desafio PvE.
6. Requisitos Técnicos e Ferramentas (Fase 1)
Motor de Jogo: Unreal Engine 5.4 é a escolha ideal devido à sua Chaos Physics Engine, sistemas de partículas Niagara, ferramentas de rendering avançadas (Lumen, Nanite) e flexibilidade para prototipagem rápida com Blueprints e escalabilidade com C++. Seu framework de networking também é um ponto forte.
Linguagens de Programação: C++ (para sistemas de jogo de alto desempenho, lógica de física complexa, networking robusto e, criticamente, para o desenvolvimento do sistema de voxel e geração de mesh em tempo de execução) e Blueprints (para prototipagem rápida, UI, e lógica de gameplay).
Foco na Performance: A simulação de física realista em um ambiente multiplayer, juntamente com a manipulação e renderização de um mundo voxel em tempo real, será extremamente exigente em termos de performance. A otimização será absolutamente crucial, utilizando LODs (Levels of Detail) para voxels, culling (frustum, occlusion), e técnicas avançadas de otimização para Chaos Physics e replicação de dados em rede.
7. Próximos Passos Sugeridos
Prova de Conceito (POC) - Voxel Core e Multiplayer: A primeira POC deve focar em um sistema de voxel básico que permita gerar um terreno simples e modificar voxels em tempo de execução, com a replicação dessas modificações através da rede para múltiplos clientes. Testar a sincronização da manipulação do terreno será o ponto mais crítico aqui.
Documento de Design de Jogo (GDD) Detalhado: Transforme esta visão em um GDD formal. Detalhe cada mecânica, atributos, receitas de crafting, tipos de inimigos, arte conceitual, e, especialmente, os aspectos de networking, balanceamento PvP/PvE, e o design e implementação detalhada do sistema de voxel.
Equipe Inicial: Para uma Fase 1 tão ambiciosa, considere recrutar:
Um Programador Sênior com forte experiência em física de jogos (Chaos Physics), networking e, idealmente, geração procedural/voxel engines.
Um Artista 3D/Animador para os assets do ambiente, personagens e ferramentas.
Um Designer de Níveis/Mundo para auxiliar na criação das regras de geração procedural do terreno e posicionamento de recursos, agora com a complexidade adicional do mundo voxel.



Projeto de Jogo RPG de Sobrevivência: Evolução das Eras Tecnológicas
Este documento descreve as fases subsequentes do seu jogo de sobrevivência, detalhando a progressão tecnológica e as novas mecânicas de gameplay que se desdobrarão a partir da base estabelecida na Era Paleolítica. A ênfase na física realista e na modificação do mundo por voxel continuará a ser um pilar central em todas as eras.
Fase 1: Era Paleolítica (Revisão Breve)
Foco: Sobrevivência básica, caça, coleta, knapping (lascagem de pedra), domínio do fogo, construção de abrigos rudimentares.
Mecânicas Chave: Gerenciamento de necessidades, crafting imersivo com física (queda de árvores, fragmentação de rochas), modificação voxel básica (escavação de cavernas, terraplanagem simples), combate corpo a corpo e projéteis balísticos.
Base Estabelecida: O jogador aprende a interagir diretamente com o ambiente e a usar ferramentas simples para sobreviver. Habilidades como Lascagem de Pedra e Construção Primitiva (Voxel) são fundamentais.
Fase 2: Era Neolítica (A Revolução Agrícola e Primeiros Assentamentos)
A transição do nomadismo para o sedentarismo. O foco se desloca para a agricultura, domesticação de animais e o início da formação de comunidades.
Tecnologias Chave: Agricultura rudimentar, cerâmica, tecelagem simples, moagem de grãos, domesticação de animais (cães, cabras), construção de habitações mais duráveis, ferramentas de pedra polida.
Novas Mecânicas:
Agricultura e Criação:
Física e Voxel: Jogadores podem nivelar extensas áreas do terreno voxel para criar campos cultiváveis. A qualidade do solo voxel pode ser melhorada (adubo). A irrigação pode envolver a escavação de canais no voxel para desviar água de rios (física de fluidos básica no voxel). O crescimento das plantas será influenciado pelo clima e pela qualidade do solo.
Domesticação: Capturar e criar animais, que podem ser usados para trabalho (ex: transporte de cargas pesadas que interagem com a física de objetos) ou como fonte de alimento/recursos sustentável.
Cozinha e Processamento de Alimentos:
Cozinha Elaborada: Receitas mais complexas que combinam diferentes ingredientes. Cozinhar em cerâmicas (interação com calor e pressão).
Processamento de Grãos: Moagem manual de grãos em pedras (minigame físico) para produzir farinha.
Construção de Assentamentos:
Voxel Avançado: Construções mais complexas com materiais como tijolos de barro secos ao sol (influência do clima voxel), paredes de madeira mais resistentes e telhados. O sistema voxel permite fundações mais sólidas e a expansão vertical.
Defesas Primitivas: Construção de cercas e paliçadas para proteção contra PvE (animais) e PvP (outros jogadores).
Comércio e Troca: Início de um sistema rudimentar de troca de recursos excedentes com NPCs ou outros jogadores.
Evolução da Física:
Ferramentas Polidas: Machados e picaretas de pedra polida têm maior eficiência e durabilidade, interagindo de forma mais suave com as meshes de árvores e rochas.
Construção e Estabilidade: As construções voxel tornam-se mais estáveis e interagem de forma mais robusta com o sistema de física (suportam mais peso, resistem melhor a ataques).
Fase 3: Idade do Bronze/Ferro (Metalurgia e Guerra Organizada)
A descoberta e o domínio da metalurgia transformam o crafting, o combate e a construção.
Tecnologias Chave: Mineração e fundição de metais (bronze, ferro), forjaria, fabricação de armaduras e armas metálicas, arados primitivos, ferramentas agrícolas de metal, carroças e barcos mais elaborados.
Novas Mecânicas:
Metalurgia:
Mineração Profunda (Voxel): Jogadores podem minerar veios de minério em cavernas mais profundas no terreno voxel, exigindo maior proficiência em Sobrevivência em Cavernas.
Forjaria e Fundição: Um novo minigame de crafting onde o jogador precisa controlar a temperatura da forja (com base na física do calor e combustão), martelar o metal (física de deformação) e moldá-lo. A qualidade do metal e a precisão do minigame determinarão a qualidade da ferramenta/arma.
Armamento e Armadura:
Armas Metálicas: Espadas, machados de batalha, pontas de lança de metal. Maior dano, durabilidade e impacto na física do combate (penetração de armadura).
Armaduras Leves: Escudos de madeira com reforço de metal, armaduras de couro endurecido ou com placas de bronze.
Transporte:
Carroças: Construção de carroças que podem ser puxadas por jogadores ou animais, permitindo o transporte de grandes volumes de recursos (simulação física de peso e atrito em diferentes terrenos voxel).
Barcos: Barcos mais avançados que interagem com a física da água (flutuabilidade, correntezas) para navegação em rios e lagos.
Guerras de Cerco Primitivas:
Voxel e Defesas: Fortificações mais complexas (muros altos, torres) construídas com o sistema voxel.
Máquinas de Cerco: Construção de aríetes e catapultas rudimentares que podem interagir com a física de objetos para destruir seções do terreno voxel e construções inimigas.
Evolução da Física:
Física de Deformação: Metais se deformam de forma realista na forja e no impacto em combate.
Penetração de Impacto: Armas metálicas têm propriedades de penetração de armadura, interagindo com materiais (madeira, couro, rocha) de forma mais diferenciada.
Movimento de Massa: Carroças e barcos utilizam simulações de física mais complexas para peso, inércia e flutuabilidade.
Fase 4: Era Medieval/Industrial Precoce (Poder Mecânico e Urbanização)
O surgimento de máquinas simples, a expansão do conhecimento e a formação de centros urbanos.
Tecnologias Chave: Engenharia mecânica simples (engrenagens, polias, alavancas), moinhos de vento/água, serrarias, agricultura em larga escala, têxteis mais complexos, alvenaria, fundição de ferro em larga escala.
Novas Mecânicas:
Automação Primária:
Física: Construção de moinhos (água/vento) que usam a física do ambiente (fluxo da água, força do vento) para automatizar a moagem de grãos ou o corte de madeira.
Serrarias: Criação de serrarias que usam mecanismos físicos para processar toras em tábuas de forma mais eficiente.
Construção Avançada (Voxel):
Edifícios em Grande Escala: Construção de edifícios de múltiplos andares, castelos e pontes complexas usando alvenaria e estruturas de madeira/metal. A estabilidade física das grandes construções voxel se torna um fator crítico.
Infraestrutura: Criação de estradas pavimentadas (modificando o voxel para reduzir atrito), sistemas de saneamento rudimentares (canais voxel para esgoto).
Comércio Organizado: Formação de rotas comerciais, caravanas, mercados e até impostos sobre transações.
Especialização de Habilidades: Habilidades mais específicas surgem (ex: Arquiteto, Engenheiro Mecânico, Mestre Ferreiro).
Evolução da Física:
Mecanismos Complexos: Simulação física precisa de engrenagens, polias, alavancas e outros componentes mecânicos interligados.
Estabilidade de Estruturas Grandes: O sistema de física voxel precisa ser capaz de calcular a integridade estrutural de edifícios massivos e complexos.
Fase 5: Era Moderna/Científica (Tecnologia e Exploração Global)
O avanço da ciência e da tecnologia permite a criação de máquinas a vapor, eletricidade rudimentar e a exploração de terras distantes.
Tecnologias Chave: Motores a vapor, geração de eletricidade rudimentar (baterias, dínamo), telegrafia, armas de fogo primitivas, barcos a vapor, aeronaves básicas (balões, planadores).
Novas Mecânicas:
Poder e Máquinas:
Física: Construção de motores a vapor que geram força mecânica. Geração e transmissão de eletricidade (com leis físicas de circuitos elétricos e condutividade).
Automação Industrial: Fábricas rudimentares para produção em massa de itens, utilizando máquinas interligadas por física.
Armas de Fogo:
Balística Complexa: Projéteis com física de arrasto e queda mais detalhada, recuo da arma, chance de falha no disparo. PvP se torna mais letal.
Explosivos: Criação de pólvora e explosivos para mineração (destruição massiva de voxels) e guerra.
Transporte e Logística:
Veículos a Vapor: Barcos a vapor e talvez trens (em trilhos criados no voxel) para transporte rápido e massivo.
Aeronaves Iniciais: Balões ou planadores que usam a física do ar (sustentação, arrasto, vento) para voar e explorar o mundo por cima.
Pesquisa Científica: Estabelecimento de laboratórios primitivos para pesquisa e desbloqueio de novas árvores tecnológicas.
Evolução da Física:
Mecânica de Fluidos Avançada: Para motores a vapor e hidrelétricas rudimentares.
Eletromagnetismo Básico: Para a geração e uso de eletricidade.
Dinâmica de Corpos Rígidos (Veículos): Simulações realistas para veículos complexos.
Fase 6: Era Pós-Digital/Exploração Espacial (O Salto para as Estrelas)
A humanidade domina a tecnologia a um ponto em que a Terra não é mais o limite. O foco se volta para a exploração de outros planetas e a construção de bases espaciais.
Tecnologias Chave: Motores de dobra espacial, campos de força, replicadores de matéria, armas de energia, robótica avançada, terraformação de planetas.
Novas Mecânicas:
Viagem Espacial:
Física Gravitacional: Simulação da gravidade zero no espaço e diferentes gravidades em outros corpos celestes.
Propulsão: Física de foguetes e naves espaciais (empuxo, vetorização, consumo de combustível).
Colonização de Outros Planetas (Voxel):
Terraformação: Jogadores podem modificar a atmosfera e a geologia de planetas inteiros usando tecnologia avançada (alterando o "material" dos voxels planetários em larga escala, introduzindo água, vegetação).
Bases Espaciais: Construção de bases modulares no espaço ou em superfícies planetárias, com considerações de pressão, temperatura e ausência de gravidade.
Armas de Energia e Campos de Força:
Física de Energia: Armas a laser, escudos de energia que interagem com projéteis e explosões de forma realista.
Robótica e Automação Total: Robôs e drones que auxiliam na coleta de recursos, construção e combate, com IA avançada.
Evolução da Física:
Física Quântica (Simplificada): Para replicadores e armas de energia (efeitos visuais e mecânicos).
Física Orbital: Para naves e satélites.
Dinâmica de Fluidos e Gases Avançada: Para atmosferas e sistemas de suporte à vida em bases espaciais.
Este mapa de eras proporciona uma visão clara de como o seu jogo pode evoluir, mantendo a ênfase na física realista e na modificação do mundo voxel como elementos centrais em todas as fases.
Você gostaria de aprofundar em alguma dessas eras ou em como as mecânicas multiplayer (PvP/PvE) se adaptam a essas novas tecnologias?
Projeto de Jogo RPG de Sobrevivência: Evolução das Eras Tecnológicas
Este documento descreve as fases subsequentes do seu jogo de sobrevivência, detalhando a progressão tecnológica e as novas mecânicas de gameplay que se desdobrarão a partir da base estabelecida na Era Paleolítica. A ênfase na física realista e na modificação do mundo por voxel continuará a ser um pilar central em todas as eras.
Fase 1: Era Paleolítica (Revisão Breve)
Foco: Sobrevivência básica, caça, coleta, knapping (lascagem de pedra), domínio do fogo, construção de abrigos rudimentares.
Mecânicas Chave: Gerenciamento de necessidades, crafting imersivo com física (queda de árvores, fragmentação de rochas), modificação voxel básica (escavação de cavernas, terraplanagem simples), combate corpo a corpo e projéteis balísticos.
Base Estabelecida: O jogador aprende a interagir diretamente com o ambiente e a usar ferramentas simples para sobreviver. Habilidades como Lascagem de Pedra e Construção Primitiva (Voxel) são fundamentais.
Fase 2: Era Neolítica (A Revolução Agrícola e Primeiros Assentamentos)
A transição do nomadismo para o sedentarismo. O foco se desloca para a agricultura, domesticação de animais e o início da formação de comunidades.
Tecnologias Chave: Agricultura rudimentar, cerâmica, tecelagem simples, moagem de grãos, domesticação de animais (cães, cabras), construção de habitações mais duráveis, ferramentas de pedra polida.
Novas Mecânicas:
Agricultura e Criação:
Física e Voxel: Jogadores podem nivelar extensas áreas do terreno voxel para criar campos cultiváveis. A qualidade do solo voxel pode ser melhorada (adubo). A irrigação pode envolver a escavação de canais no voxel para desviar água de rios (física de fluidos básica no voxel). O crescimento das plantas será influenciado pelo clima e pela qualidade do solo.
Domesticação: Capturar e criar animais, que podem ser usados para trabalho (ex: transporte de cargas pesadas que interagem com a física de objetos) ou como fonte de alimento/recursos sustentável.
Cozinha e Processamento de Alimentos:
Cozinha Elaborada: Receitas mais complexas que combinam diferentes ingredientes. Cozinhar em cerâmicas (interação com calor e pressão).
Processamento de Grãos: Moagem manual de grãos em pedras (minigame físico) para produzir farinha.
Construção de Assentamentos:
Voxel Avançado: Construções mais complexas com materiais como tijolos de barro secos ao sol (influência do clima voxel), paredes de madeira mais resistentes e telhados. O sistema voxel permite fundações mais sólidas e a expansão vertical.
Defesas Primitivas: Construção de cercas e paliçadas para proteção contra PvE (animais) e PvP (outros jogadores).
Comércio e Troca: Início de um sistema rudimentar de troca de recursos excedentes com NPCs ou outros jogadores.
Evolução da Física:
Ferramentas Polidas: Machados e picaretas de pedra polida têm maior eficiência e durabilidade, interagindo de forma mais suave com as meshes de árvores e rochas.
Construção e Estabilidade: As construções voxel tornam-se mais estáveis e interagem de forma mais robusta com o sistema de física (suportam mais peso, resistem melhor a ataques).
Fase 3: Idade do Bronze/Ferro (Metalurgia e Guerra Organizada)
A descoberta e o domínio da metalurgia transformam o crafting, o combate e a construção.
Tecnologias Chave: Mineração e fundição de metais (bronze, ferro), forjaria, fabricação de armaduras e armas metálicas, arados primitivos, ferramentas agrícolas de metal, carroças e barcos mais elaborados.
Novas Mecânicas:
Metalurgia:
Mineração Profunda (Voxel): Jogadores podem minerar veios de minério em cavernas mais profundas no terreno voxel, exigindo maior proficiência em Sobrevivência em Cavernas.
Forjaria e Fundição: Um novo minigame de crafting onde o jogador precisa controlar a temperatura da forja (com base na física do calor e combustão), martelar o metal (física de deformação) e moldá-lo. A qualidade do metal e a precisão do minigame determinarão a qualidade da ferramenta/arma.
Armamento e Armadura:
Armas Metálicas: Espadas, machados de batalha, pontas de lança de metal. Maior dano, durabilidade e impacto na física do combate (penetração de armadura).
Armaduras Leves: Escudos de madeira com reforço de metal, armaduras de couro endurecido ou com placas de bronze.
Transporte:
Carroças: Construção de carroças que podem ser puxadas por jogadores ou animais, permitindo o transporte de grandes volumes de recursos (simulação física de peso e atrito em diferentes terrenos voxel).
Barcos: Barcos mais avançados que interagem com a física da água (flutuabilidade, correntezas) para navegação em rios e lagos.
Guerras de Cerco Primitivas:
Voxel e Defesas: Fortificações mais complexas (muros altos, torres) construídas com o sistema voxel.
Máquinas de Cerco: Construção de aríetes e catapultas rudimentares que podem interagir com a física de objetos para destruir seções do terreno voxel e construções inimigas.
Evolução da Física:
Física de Deformação: Metais se deformam de forma realista na forja e no impacto em combate.
Penetração de Impacto: Armas metálicas têm propriedades de penetração de armadura, interagindo com materiais (madeira, couro, rocha) de forma mais diferenciada.
Movimento de Massa: Carroças e barcos utilizam simulações de física mais complexas para peso, inércia e flutuabilidade.
Fase 4: Era Medieval/Industrial Precoce (Poder Mecânico e Urbanização)
O surgimento de máquinas simples, a expansão do conhecimento e a formação de centros urbanos.
Tecnologias Chave: Engenharia mecânica simples (engrenagens, polias, alavancas), moinhos de vento/água, serrarias, agricultura em larga escala, têxteis mais complexos, alvenaria, fundição de ferro em larga escala.
Novas Mecânicas:
Automação Primária:
Física: Construção de moinhos (água/vento) que usam a física do ambiente (fluxo da água, força do vento) para automatizar a moagem de grãos ou o corte de madeira.
Serrarias: Criação de serrarias que usam mecanismos físicos para processar toras em tábuas de forma mais eficiente.
Construção Avançada (Voxel):
Edifícios em Grande Escala: Construção de edifícios de múltiplos andares, castelos e pontes complexas usando alvenaria e estruturas de madeira/metal. A estabilidade física das grandes construções voxel se torna um fator crítico.
Infraestrutura: Criação de estradas pavimentadas (modificando o voxel para reduzir atrito), sistemas de saneamento rudimentares (canais voxel para esgoto).
Comércio Organizado: Formação de rotas comerciais, caravanas, mercados e até impostos sobre transações.
Especialização de Habilidades: Habilidades mais específicas surgem (ex: Arquiteto, Engenheiro Mecânico, Mestre Ferreiro).
Evolução da Física:
Mecanismos Complexos: Simulação física precisa de engrenagens, polias, alavancas e outros componentes mecânicos interligados.
Estabilidade de Estruturas Grandes: O sistema de física voxel precisa ser capaz de calcular a integridade estrutural de edifícios massivos e complexos.
Fase 5: Era Moderna/Científica (Tecnologia e Exploração Global)
O avanço da ciência e da tecnologia permite a criação de máquinas a vapor, eletricidade rudimentar e a exploração de terras distantes.
Tecnologias Chave: Motores a vapor, geração de eletricidade rudimentar (baterias, dínamo), telegrafia, armas de fogo primitivas, barcos a vapor, aeronaves básicas (balões, planadores).
Novas Mecânicas:
Poder e Máquinas:
Física: Construção de motores a vapor que geram força mecânica. Geração e transmissão de eletricidade (com leis físicas de circuitos elétricos e condutividade).
Automação Industrial: Fábricas rudimentares para produção em massa de itens, utilizando máquinas interligadas por física.
Armas de Fogo:
Balística Complexa: Projéteis com física de arrasto e queda mais detalhada, recuo da arma, chance de falha no disparo. PvP se torna mais letal.
Explosivos: Criação de pólvora e explosivos para mineração (destruição massiva de voxels) e guerra.
Transporte e Logística:
Veículos a Vapor: Barcos a vapor e talvez trens (em trilhos criados no voxel) para transporte rápido e massivo.
Aeronaves Iniciais: Balões ou planadores que usam a física do ar (sustentação, arrasto, vento) para voar e explorar o mundo por cima.
Pesquisa Científica: Estabelecimento de laboratórios primitivos para pesquisa e desbloqueio de novas árvores tecnológicas.
Evolução da Física:
Mecânica de Fluidos Avançada: Para motores a vapor e hidrelétricas rudimentares.
Eletromagnetismo Básico: Para a geração e uso de eletricidade.
Dinâmica de Corpos Rígidos (Veículos): Simulações realistas para veículos complexos.
Fase 6: Era Pós-Digital/Exploração Espacial (O Salto para as Estrelas)
A humanidade domina a tecnologia a um ponto em que a Terra não é mais o limite. O foco se volta para a exploração de outros planetas e a construção de bases espaciais.
Tecnologias Chave: Motores de dobra espacial, campos de força, replicadores de matéria, armas de energia, robótica avançada, terraformação de planetas.
Novas Mecânicas:
Viagem Espacial:
Física Gravitacional: Simulação da gravidade zero no espaço e diferentes gravidades em outros corpos celestes.
Propulsão: Física de foguetes e naves espaciais (empuxo, vetorização, consumo de combustível).
Colonização de Outros Planetas (Voxel):
Terraformação: Jogadores podem modificar a atmosfera e a geologia de planetas inteiros usando tecnologia avançada (alterando o "material" dos voxels planetários em larga escala, introduzindo água, vegetação).
Bases Espaciais: Construção de bases modulares no espaço ou em superfícies planetárias, com considerações de pressão, temperatura e ausência de gravidade.
Armas de Energia e Campos de Força:
Física de Energia: Armas a laser, escudos de energia que interagem com projéteis e explosões de forma realista.
Robótica e Automação Total: Robôs e drones que auxiliam na coleta de recursos, construção e combate, com IA avançada.
Evolução da Física:
Física Quântica (Simplificada): Para replicadores e armas de energia (efeitos visuais e mecânicos).
Física Orbital: Para naves e satélites.
Dinâmica de Fluidos e Gases Avançada: Para atmosferas e sistemas de suporte à vida em bases espaciais.
Este mapa de eras proporciona uma visão clara de como o seu jogo pode evoluir, mantendo a ênfase na física realista e na modificação do mundo voxel como elementos centrais em todas as fases.
Você gostaria de aprofundar em alguma dessas eras ou em como as mecânicas multiplayer (PvP/PvE) se adaptam a essas novas tecnologias?

Árvore de Habilidades: Era Paleolítica (Fase 1)
Esta árvore de habilidades foca nas capacidades essenciais para a sobrevivência primitiva e a interação com o ambiente modificado por voxel, permitindo ao jogador especializar-se em diferentes aspectos da vida na Idade da Pedra. As habilidades progridem através do uso e desbloqueiam novas receitas ou bônus passivos.
I. Habilidades de Sobrevivência e Coleta (Gathering & Survival)
Foco em obter recursos e gerenciar as necessidades básicas.
1.1. Forrageamento Primário:
Descrição: Aumenta a eficiência na coleta de plantas comestíveis, sementes, frutas e fungos. Reduz a chance de encontrar itens estragados ou venenosos.
Progressão: Melhora a velocidade de coleta, aumenta a quantidade de itens por fonte, desbloqueia a identificação de novas espécies e métodos de processamento simples (ex: secagem de frutas).
1.2. Silvicultura Rudimentar:
Descrição: Aumenta a proficiência no corte de madeira e processamento de galhos.
Progressão e Interação com a Física:
Nível Básico (Iniciante): O corte de árvores exige muitos golpes e é inconsistente. A queda da árvore é menos controlável, podendo cair em direções inesperadas, causar mais danos ao jogador se ele não desviar, ou até mesmo ficar presa em outras árvores/obstáculos (simulação física).
Nível Intermediário: Menos golpes para derrubar árvores. O jogador pode influenciar levemente a direção da queda através do ângulo de corte, tornando a colheita mais segura e eficiente. Maior chance de toras de qualidade e de evitar que a árvore se quebre em pedaços pequenos e inúteis.
Nível Avançado: O jogador tem controle significativo sobre a direção da queda, podendo planejar onde a árvore cairá para maximizar a colheita de toras ou até mesmo usá-la para derrubar outras árvores ou criar atalhos. Desbloqueia o reconhecimento de diferentes tipos de madeira com propriedades físicas únicas (ex: madeiras mais densas para maior resistência, madeiras mais leves para flutuar em rios). Aumenta a proficiência no uso do machado para dividir toras, tornando o minigame de divisão mais fácil e resultando em menos desperdício.
Mestre Silvicultor: O corte de árvores se torna um processo preciso e rápido. O jogador pode derrubar árvores maciças e, com técnica apurada, fazer com que caiam em locais específicos com mínima chance de erro ou dano. Desbloqueia o crafting de ferramentas de corte mais avançadas para a era, como machados com lâminas de pedra polida, que interagem de forma mais eficiente com a física da madeira.
1.3. Mineração Básica:
Descrição: Melhora a eficiência na extração de rochas e minerais brutos do terreno voxel.
Progressão: Maior velocidade de mineração, maior chance de obter rochas de melhor qualidade para lascagem, menor chance de quebrar ferramentas durante a mineração, desbloqueia a identificação de veios de minério.
1.4. Tratamento de Água:
Descrição: Permite purificar e tornar a água potável usando métodos primitivos.
Progressão: Reduz o tempo de fervura, melhora a eficácia de filtros simples (carvão, areia, tecido), reduz a chance de contrair doenças de água contaminada.
1.5. Resistência Ambiental:
Descrição: Aumenta a tolerância do personagem a condições climáticas extremas (frio, calor, chuva, vento).
Progressão: Reduz a taxa de decaimento da temperatura corporal, diminui a penalidade de atributos em climas extremos, reduz a chance de doenças relacionadas ao ambiente.
II. Habilidades de Artesanato e Construção (Crafting & Building)
Foco em transformar recursos brutos em ferramentas, armas e estruturas, com ênfase na física.
2.1. Lascagem de Pedra (Knapping):
Descrição: Habilidade crucial para criar ferramentas e armas de pedra (machados, facas, pontas de lança). Impacta diretamente o minigame de knapping, que simula a física de fratura da rocha.
Progressão e Interação com a Física:
Nível Básico (Iniciante): O minigame é mais desafiador. O jogador tem menos "pontos de impacto" ideais visíveis na rocha. Golpes imprecisos resultam em fragmentos de baixa qualidade, ferramentas com durabilidade reduzida e menor eficiência (dano/velocidade). A rocha pode quebrar de forma imprevisível.
Nível Intermediário: O jogador consegue identificar mais facilmente os pontos de impacto ideais. A margem de erro para golpes precisos é maior. Ferramentas produzidas têm durabilidade e eficiência razoáveis. Desbloqueia formas de ferramentas um pouco mais complexas (ex: raspadores com borda mais fina).
Nível Avançado: O minigame se torna mais intuitivo. Os pontos de impacto ideais são claros e a resposta física da rocha é mais previsível. Golpes precisos garantem fragmentos perfeitos. Ferramentas têm alta durabilidade, grande eficiência e afiação superior. O jogador pode "moldar" a rocha com mais controle, desbloqueando formas de ferramentas especializadas e de nicho (ex: anzóis primitivos de pedra, lâminas serrilhadas).
Mestre Artesão: O minigame pode ser simplificado ou oferecer bônus massivos. Há uma chance de produzir ferramentas "obra-prima" com bônus únicos (ex: maior dano, durabilidade infinita, bônus de coleta específico). O jogador pode até "reparar" ferramentas de pedra quebradas com uma chance de sucesso.
2.2. Fabricação de Ferramentas Primárias:
Descrição: Governa a criação de ferramentas não diretamente ligadas à lascagem (ex: machados com cabo, picaretas, raspadores, martelos).
Progressão: Melhora a durabilidade e o desempenho geral das ferramentas fabricadas, reduz a chance de falha no crafting, desbloqueia o uso de diferentes materiais para cabos.
2.3. Armeiro Rudimentar:
Descrição: Foca na criação de armas de caça e combate (lanças, arcos simples, flechas, tacapes, fundas).
Progressão: Aumenta o dano e a durabilidade das armas fabricadas, melhora a precisão de arcos e fundas, desbloqueia diferentes tipos de pontas de flecha e lança.
2.4. Confecção de Vestimentas:
Descrição: Permite transformar peles e fibras em vestimentas e acessórios básicos.
Progressão: Melhora a proteção térmica e física das roupas, desbloqueia novas receitas de vestimentas (mais camadas, diferentes materiais), aumenta a resistência das roupas a danos.
2.5. Construção Primitiva (Voxel):
Descrição: Habilidade de manipular o terreno voxel para criar abrigos e fortificações, além de montar estruturas simples. A proficiência nesta habilidade afeta diretamente a interação do jogador com o mundo voxel.
Progressão e Interação com o Voxel:
Nível Básico (Iniciante): Escavação e terraplanagem são lentas e imprecisas. Túneis podem ser irregulares e as estruturas construídas (como paredes de terra batida ou fundações de rocha) têm baixa estabilidade. Pequenas modificações podem causar colapsos localizados devido à física do voxel. Desbloqueia ferramentas de escavação básicas (pá de osso, picareta de pedra rudimentar).
Nível Intermediário: Aumenta a velocidade de escavação e a precisão da terraplanagem. É possível criar túneis mais retos e uniformes. As estruturas construídas (ex: choupanas de madeira e terra, pequenos muros) têm melhor integridade estrutural e são menos propensas a colapsar sob peso ou pressão (simulado pela física do voxel). Desbloqueia a capacidade de construir com blocos de terra compactada ou pedras grandes soltas.
Nível Avançado: Alta velocidade e precisão na manipulação do terreno voxel. O jogador pode criar grandes escavações, sistemas de túneis complexos e superfícies perfeitamente niveladas. As construções atingem um alto nível de estabilidade e resistência (capacidade de suportar ataques PvP ou condições climáticas extremas), permitindo estruturas multiandares ou fortalezas subterrâneas. Desbloqueia novos tipos de materiais de construção voxel (ex: argila seca ao sol, grandes blocos de rocha esculpida).
Mestre Construtor: O jogador pode realizar modificações em massa do terreno (ex: remover grandes volumes de terra de uma só vez). As estruturas construídas são extremamente resistentes e podem até influenciar a física local do terreno, prevenindo erosão ou desmoronamentos. Desbloqueia técnicas avançadas de engenharia primitiva, como a criação de pontes e barragens simples usando materiais voxel e recursos conectados.
III. Habilidades de Combate e Caça (Combat & Hunting)
Foco em combate, furtividade e obtenção de alimento através da caça.
3.1. Combate Corporal (Armas Primitivas):
Descrição: Aumenta a proficiência no uso de armas de curta distância (lanças, tacapes, machados de pedra), impactando a precisão e a força dos golpes e o manejo da inércia da arma.
Progressão e Interação com a Física:
Nível Básico (Iniciante): Golpes lentos e previsíveis, com pouca força. A física da inércia da arma é mais pronunciada, exigindo maior esforço do jogador para controlar o follow-through. O hitbox da arma é menor e mais difícil de conectar com o inimigo.
Nível Intermediário: Aumento na velocidade e força dos ataques. O jogador tem um controle melhor da inércia da arma, permitindo sequências de golpes mais rápidas. A chance de aparar ou bloquear ataques inimigos é maior, com feedback físico (colisão, knockback leve).
Nível Avançado: Golpes rápidos, poderosos e precisos. O controle da inércia da arma é quase instintivo, permitindo combos fluidos e ataques especiais. O hitbox é mais generoso, e acertos em pontos vulneráveis (cabeça, juntas) resultam em dano crítico significativo e ragdolls mais dramáticos. Desbloqueia a capacidade de desarmar inimigos ou quebrar suas defesas com golpes bem posicionados.
Mestre de Combate Primitivo: O combate corporal se torna uma dança letal. Cada golpe é maximizado em dano e eficiência. O jogador pode controlar perfeitamente a inércia da arma para reposicionamentos rápidos e contra-ataques. Desbloqueia técnicas como a "carga com lança" (aplicando grande força ao impacto inicial, derrubando o inimigo) ou a "ruptura de escudo" (ignora parte da defesa inimiga).
3.2. Arquearia e Arremesso:
Descrição: Melhora a precisão, o alcance e o dano com arcos, flechas e armas de arremesso (lanças, fundas). A física balística do projétil é diretamente influenciada.
Progressão e Interação com a Física:
Nível Básico (Iniciante): Projéteis (flechas, lanças) têm uma trajetória parabólica acentuada e são fortemente afetados pela gravidade e resistência do ar. A influência do vento é alta, exigindo muita compensação. A mira é imprecisa.
Nível Intermediário: A parábola da trajetória é mais suave. A influência do vento é reduzida, e a velocidade do projétil aumenta, impactando mais rapidamente o alvo. Mira assistida leve pode aparecer, ou um indicador de trajetória mais preciso.
Nível Avançado: Projéteis voam em uma trajetória quase reta a curtas e médias distâncias. A influência do vento é mínima, permitindo tiros de longo alcance com alta precisão. A força do disparo (e, consequentemente, o dano) é maximizada. Desbloqueia tiros especiais como "tiro de precisão" (maior chance de crítico em pontos vulneráveis) ou "tiro perfurante" (ignora parte da armadura primitiva do alvo).
Mestre Arqueiro/Arremessador: O jogador é capaz de tiros incríveis, quase desafiando a física em situações ideais. Pode realizar "tiros ricochete" (se implementado) ou "tiros através de coberturas leves". A detecção de hitbox para pontos fracos do inimigo é facilitada, e cada acerto é devastador.
3.3. Rastreamento e Caça Furtiva:
Descrição: Permite ao jogador encontrar e seguir rastros de animais e inimigos, além de se mover e atacar sem ser detectado. A interação com o ambiente voxel é crucial para cobertura.
Progressão:
Nível Básico (Iniciante): Rastros são pouco visíveis e desaparecem rapidamente. A detecção de inimigos é limitada ao campo de visão direto. Mover-se furtivamente é difícil, com muito barulho.
Nível Intermediário: Rastros permanecem visíveis por mais tempo e são mais detalhados (ex: indica o tipo de animal, a direção). Aumenta o raio de detecção de inimigos próximos (audição, olfato). O movimento furtivo é mais eficiente, com menos barulho, permitindo aproximações.
Nível Avançado: Rastros detalhados revelam informações cruciais (saúde, velocidade, idade, ferimentos). O jogador pode "ler" o ambiente para prever o comportamento de presas. O movimento furtivo é quase silencioso, permitindo flanquear e se esconder em quase qualquer tipo de terreno voxel (ex: usando pequenas depressões ou elevações para cobertura). Ataques furtivos causam dano massivo ou atordoam o alvo.
Mestre Caçador/Rastreador: O jogador é um fantasma na paisagem. Pode detectar inimigos através de paredes finas de voxel (visão aprimorada) ou pelo cheiro. Consegue usar armadilhas e emboscadas com maestria, tornando a caça e o PvP furtivo extremamente eficazes. Rastros podem ser identificados mesmo após longos períodos ou condições climáticas adversas.
3.4. Curtume e Processamento de Carne:
Descrição: Foca na manipulação de carcaças de animais para obter peles, carne e outros subprodutos, otimizando o aproveitamento dos recursos.
Progressão: Aumenta a quantidade de recursos obtidos de uma carcaça, melhora a qualidade das peles para curtir, desbloqueia receitas de conservação de carne (defumação, salga), reduz o risco de contaminação ao processar.
IV. Habilidades de Exploração e Adaptação (Exploration & Adaptation)
Foco em navegação, sobrevivência em ambientes diversos e inteligência.
4.1. Navegação e Orientação:
Descrição: Melhora a capacidade de se orientar no vasto mundo voxel gerado proceduralmente, identificar pontos de referência naturais e evitar se perder. É essencial para a exploração eficiente e o retorno seguro à base.
Progressão:
Nível Básico (Iniciante): O jogador depende de marcos visuais óbvios para se orientar. O mapa (se houver) exibe apenas a área imediata. Há uma chance maior de se perder em áreas desconhecidas ou durante condições climáticas adversas.
Nível Intermediário: O jogador consegue "ler" o terreno com mais facilidade, identificando padrões de biomas e elevações para navegação. A habilidade pode revelar pontos de interesse distantes no horizonte ou "marcar" automaticamente o caminho de volta para locais recentemente visitados.
Nível Avançado: O jogador tem um senso inato de direção, sendo menos afetado por neblina ou escuridão. Pode criar "mapas mentais" mais detalhados da área, e talvez até "esboçar" um mapa rudimentar no diário. Desbloqueia a capacidade de identificar recursos específicos de biomas à distância (ex: fumaça de assentamentos, cheiro de água).
Mestre Navegador: O jogador raramente se perde, mesmo em condições extremas ou em áreas inexploradas. Pode prever rotas ideais para travessias rápidas ou seguras, e sua presença em uma área pode revelar recursos ocultos ou passagens secretas no terreno voxel que outros jogadores não notariam.
4.2. Primeiros Socorros Primitivos:
Descrição: Capacidade de tratar ferimentos, doenças e condições de saúde básicas usando recursos naturais e técnicas primitivas.
Progressão:
Nível Básico (Iniciante): Permite apenas o tratamento de arranhões leves e pequenos cortes com ervas simples. O processo é lento e a chance de infecção é alta.
Nível Intermediário: Capacidade de tratar ferimentos moderados, como fraturas simples (com talas improvisadas) e infecções leves. Aumenta a eficácia de curativos e remédios naturais, reduzindo o tempo de recuperação e a severidade dos efeitos.
Nível Avançado: O jogador pode tratar ferimentos graves, como ossos expostos (com risco) e doenças mais complexas. Desbloqueia a fabricação de antídotos primitivos para venenos e tratamentos de choque para hipotermia/superaquecimento. Reduz drasticamente a chance de infecções e acelera a cura.
Mestre Curandeiro Primitivo: O jogador se torna um recurso valioso para a equipe. Pode realizar procedimentos complexos que outros não conseguiriam, como remover objetos encravados ou tratar doenças avançadas com alta taxa de sucesso. Há uma chance de buffs de recuperação para aliados ou de estabilizar rapidamente um companheiro gravemente ferido em combate PvP/PvE.
4.3. Sobrevivência em Cavernas:
Descrição: Habilidade específica para navegação, coleta e combate em ambientes subterrâneos (túneis e cavernas) gerados pelo sistema voxel.
Progressão:
Nível Básico (Iniciante): Movimento lento e desajeitado em túneis apertados. É difícil detectar perigos como desmoronamentos iminentes (física do voxel), gases tóxicos ou criaturas subterrâneas. A visibilidade é limitada e o medo da escuridão pode impor penalidades leves.
Nível Intermediário: Aumenta a velocidade de movimento em ambientes subterrâneos. Melhora a detecção de sons e vibrações que indicam criaturas próximas ou instabilidade estrutural do voxel. O jogador pode identificar veios de minério mais facilmente.
Nível Avançado: O jogador se move com confiança no subsolo. Desbloqueia a capacidade de identificar pontos fracos em formações rochosas que podem ser explorados (ex: para causar desmoronamentos controlados ou criar atalhos com ferramentas de escavação). Aumenta a chance de encontrar minerais e recursos raros específicos de cavernas. A visibilidade na escuridão total melhora.
Mestre Caverneiro: O jogador pode explorar as profundezas do mundo voxel sem medo. Consegue navegar em labirintos subterrâneos complexos, identificar áreas ricas em recursos e até mesmo criar armadilhas físicas complexas usando a manipulação do voxel para emboscar inimigos (PvP ou PvE). Pode encontrar e estabilizar estruturas antigas ou formações geológicas únicas.
4.4. Inteligência Prática:
Descrição: Habilidade geral que afeta a velocidade de aprendizado de novas receitas, a eficiência na descoberta de novos recursos e a capacidade de inovar.
Progressão:
Nível Básico (Iniciante): A aprendizagem de novas receitas é lenta. A identificação de novos usos para recursos existentes é rara.
Nível Intermediário: Reduz o custo de "pesquisa" para desbloquear novas receitas na árvore de tecnologia. Há uma chance maior de encontrar variações de recursos (ex: uma pedra com características únicas para knapping). O jogador começa a entender como diferentes elementos interagem (ex: água e argila para criar um barro moldável).
Nível Avançado: Acelera significativamente o desbloqueio de novas tecnologias. O jogador pode ter "insights" aleatórios que revelam receitas experimentais ou atalhos de crafting. Melhora a eficiência na resolução de problemas práticos no ambiente (ex: como contornar um obstáculo físico usando os recursos disponíveis).
Mestre Inovador: O jogador é um verdadeiro pioneiro. Pode "inventar" receitas totalmente novas combinando recursos de maneiras inesperadas, criando itens únicos. Aumenta a chance de acionar eventos de "descoberta" que revelam áreas secretas no mundo voxel ou segredos de civilizações primitivas. Aumenta a velocidade de aprendizado de todas as outras habilidades.



