
# Roteiro de Desenvolvimento do Jogo - Visão Completa (GEMINI.md)

Este arquivo `TODO.md` descreve a lista de tarefas de alto nível para implementar a visão completa do jogo de sobrevivência, conforme detalhado em `GEMINI.md`.

**Nota Importante:** A implementação atual em Next.js é uma prova de conceito (POC) simplificada em 2D para prototipar mecânicas de interface e estado. A realização completa da visão descrita abaixo exigiria a migração para um motor de jogo 3D robusto como a **Unreal Engine 5**, para suportar a física complexa, o mundo voxel dinâmico e os gráficos de alta fidelidade.

---

## Fase 1: Era Paleolítica (Fundação da Sobrevivência)

### Core Engine & Mundo (Unreal Engine 5)
- [x] **Sistema de Voxel:** Desenvolver ou integrar um sistema de voxel para o terreno.
  - [x] Geração procedural de mundo voxel com múltiplos biomas (ruído Perlin/Simplex).
  - [ ] Modificação do terreno em tempo real (escavação, construção).
  - [ ] Geração de mesh em tempo de execução (ex: Marching Cubes).
  - [ ] Simulação de física em estruturas voxel (desmoronamentos).
- [ ] **Networking:** Implementar a arquitetura de rede para multiplayer.
  - [ ] Servidor dedicado ou Host/Listen.
  - [ ] Replicar de forma eficiente as modificações do terreno voxel entre todos os clientes.
  - [ ] Replicar estado de jogadores, NPCs e objetos dinâmicos.
- [ ] **Ambiente:**
  - [ ] Ciclo completo de Dia/Noite com iluminação global dinâmica (Lumen).
  - [ ] Sistema de clima dinâmico (chuva, neve, vento, tempestades) com partículas (Niagara).
  - [ ] Efeitos climáticos na jogabilidade (fogueiras apagando, terreno molhado/nevado).

### Mecânicas de RPG
- [ ] **Personagem:**
  - [ ] Tela de criação de personagem (aparência básica).
  - [ ] Sistema de Atributos Primários (Força, Agilidade, Vigor, etc.).
  - [x] Sistema de Habilidades baseado no uso (ex: usar machado aumenta Silvicultura).
- [ ] **Sobrevivência:**
  - [x] Gerenciamento de necessidades: Fome, Sede, Temperatura Corporal.
  - [x] Sistema de Saúde e Condições (ferimentos, doenças, envenenamento).
  - [x] HUD (interface de usuário) para exibir status (UMG).

### Física e Interação (Chaos Physics)
- [ ] **Coleta de Recursos:**
  - [ ] **Corte de Árvores:** Física de queda controlada, divisão de toras em minigame.
  - [x] **Mineração:** Fragmentação de rochas, interação com o terreno voxel.
  - [x] **Caça e Pesca:** Balística realista para projéteis (flechas, lanças), detecção de acerto em ossos específicos dos animais.
- [ ] **Crafting Imersivo:**
  - [ ] **Lascagem de Pedra (Knapping):** Minigame interativo de fratura procedural ou pré-fraturada.
  - [x] **Fogueira:** Física de propagação de fogo, radiação de calor, reação ao vento.
  - [x] **Construção de Abrigos:** Empilhamento e amarração de objetos com `Physics Constraints`, cálculo de estabilidade estrutural.
- [ ] **Combate Físico:**
  - [ ] Simulação de peso e inércia de armas brancas.
  - [ ] Detecção de colisão precisa entre armas e corpos.
  - [ ] Sistema de Ragdoll para morte de personagens e animais.

### Progressão e Multiplayer
- [ ] **Progressão:**
  - [ ] Árvore de Tecnologia/Descobertas baseada em ações.
  - [ ] Diário de Sobrevivência para registrar descobertas.
- [ ] **PvE (Player vs. Environment):**
  - [ ] IA para fauna (comportamentos de caça, fuga, pastoreio) usando Behavior Trees.
  - [ ] Eventos aleatórios (migração de manadas, desastres naturais).
- [ ] **PvP (Player vs. Player):**
  - [ ] Sincronização de combate e dano.
  - [ ] Sistema de saque de corpos.
  - [ ] Raids a bases (destruição de construções e terreno voxel).

---

## Fase 2: Era Neolítica (Revolução Agrícola)

- [ ] **Agricultura:**
  - [ ] Nivelar e preparar terreno voxel para cultivo.
  - [ ] Sistema de irrigação com canais escavados no voxel (física de fluidos básica).
  - [ ] Ciclo de crescimento de plantas influenciado pelo clima e solo.
- [ ] **Domesticação:**
  - [ ] Capturar, criar e gerenciar animais (IA para animais domesticados).
  - [ ] Uso de animais para trabalho (puxar carroças).
- [ ] **Novas Tecnologias:**
  - [ ] **Cerâmica:** Crafting de potes para cozinha e armazenamento.
  - [ ] **Tecelagem:** Criação de roupas mais avançadas.
  - [ ] **Moagem de Grãos:** Minigame físico para processar grãos.
- [ ] **Construção e Sociedade:**
  - [ ] Construções mais complexas com tijolos de barro (interação com clima voxel).
  - [ ] Defesas de assentamentos (paliçadas, cercas).
  - [ ] Sistema rudimentar de troca/comércio.

---

## Fase 3: Idade do Bronze/Ferro (Metalurgia)

- [ ] **Metalurgia:**
  - [x] Mineração de veios de minério em cavernas profundas (voxel).
  - [x] **Forja e Fundição:** Minigame de controle de temperatura, martelada e moldagem (física de deformação).
- [ ] **Equipamentos:**
  - [x] Fabricação de armas e ferramentas de metal.
  - [ ] Fabricação de armaduras e escudos.
- [ ] **Transporte e Guerra:**
  - [ ] **Carroças:** Simulação física de peso e atrito em diferentes terrenos voxel.
  - [ ] **Barcos:** Navegação com física de flutuabilidade e correntezas.
  - [ ] **Guerra de Cerco:** Construção de aríetes e catapultas para destruir construções e terreno voxel.

---

## Fase 4: Era Medieval/Industrial Precoce (Poder Mecânico)

- [ ] **Automação Primária:**
  - [ ] **Moinhos:** Construção de moinhos de água/vento que usam a física do ambiente para gerar energia mecânica.
  - [ ] **Serrarias:** Mecanismos físicos para processamento automatizado de madeira.
- [ ] **Engenharia:**
  - [ ] Simulação física de engrenagens, polias e alavancas.
  - [ ] **Construção Avançada:** Castelos, pontes e edifícios de múltiplos andares com cálculo de integridade estrutural no sistema voxel.
- [ ] **Infraestrutura:**
  - [ ] Estradas pavimentadas (modificação do material voxel para reduzir atrito).
  - [ ] Sistemas de saneamento (canais voxel).
- [ ] **Sociedade:**
  - [ ] Rotas comerciais, caravanas e sistema de economia/impostos.
  - [ ] Habilidades especializadas (Arquiteto, Engenheiro).

---

## Fase 5: Era Moderna/Científica (Tecnologia Global)

- [ ] **Energia:**
  - [ ] **Motores a Vapor:** Geração de energia a partir da física de fluidos e calor.
  - [ ] **Eletricidade:** Geração (dínamos) e transmissão com leis de circuitos básicos.
- [ ] **Indústria e Armamento:**
  - [ ] Fábricas para produção em massa.
  - [ ] **Armas de Fogo:** Balística complexa (gravidade, arrasto, recuo).
  - [ ] **Explosivos:** Destruição massiva de terreno voxel.
- [ ] **Transporte Avançado:**
  - [ ] Veículos a vapor (barcos, trens em trilhos construídos no voxel).
  - [ ] Aeronaves básicas (balões, planadores) com física de sustentação e arrasto.
- [ ] **Ciência:**
  - [ ] Laboratórios para pesquisa e desbloqueio de tecnologias.

---

## Fase 6: Era Pós-Digital/Exploração Espacial (Fronteira Final)

- [ ] **Viagem Espacial:**
  - [ ] Construção de naves espaciais.
  - [ ] Simulação de física orbital e gravidade zero.
  - [ ] Motores de propulsão (foguetes, dobra espacial).
- [ ] **Colonização Planetária:**
  - [ ] Geração procedural de outros planetas (diferentes gravidades e atmosferas).
  - [ ] **Terraformação:** Modificação em larga escala da geologia e atmosfera de planetas (alteração de material voxel).
- [ ] **Tecnologia Futurista:**
  - [ ] Construção de bases espaciais modulares (simulação de pressão, O2).
  - [ ] Armas de energia (lasers, plasma) com física de partículas.
  - [ ] Escudos de energia.
  - [ ] Robótica e automação total (drones de coleta, construção e combate).
  - [ ] Replicadores de matéria.
