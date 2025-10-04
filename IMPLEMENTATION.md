# Funcionalidades Implementadas

## Sistema de Fogueira e Culinária
- **Construção de Fogueira**: Os jogadores podem criar uma fogueira usando 5 pedras e 5 gravetos.
- **Menu da Fogueira**: Ao se aproximar de uma fogueira, um menu é aberto com as opções de "Cozinhar" e "Fundir".
- **Culinária**: Os jogadores podem cozinhar "Carne de Galinha Crua" para obter "Carne de Galinha Cozida".
- **Consumo de Comida Cozida**: A "Carne de Galinha Cozida" pode ser consumida para restaurar 50 pontos de fome.

## Habilidades
- **Habilidade de Culinária**: Uma nova habilidade chamada "Cozinhar" foi adicionada.
- **Ganho de XP de Culinária**: Os jogadores ganham 15 XP de culinária ao cozinhar uma galinha e 25 XP ao derreter minério de ferro.
- **Correção de Bug da Habilidade de Caça**: O ganho de XP da habilidade de caça foi corrigido para ser acionado de forma confiável ao matar uma galinha.
- **Exibição de Habilidades**: A aba de habilidades agora exibe corretamente todas as habilidades, incluindo "Caça" e "Cozinhar".

## Sistema de Necessidades e Saúde
- **Decaimento de Fome e Sede**: As taxas de decaimento de fome e sede foram ajustadas.
- **Modificadores de Temperatura**: A perda de sede aumenta se a temperatura corporal estiver alta, e a perda de fome aumenta se a temperatura corporal estiver baixa.
- **Regeneração de Saúde**: A saúde do jogador regenera periodicamente se a fome e a sede estiverem acima de 80%.

## Recursos e Coleta
- **Redução de Frutas**: A quantidade de frutas obtidas ao colher foi reduzida de 2 para 1.
- **Minério de Ferro**: Um novo recurso, "Minério de Ferro", foi adicionado ao jogo.
- **Geração de Minério de Ferro**: O minério de ferro pode ser encontrado em terrenos rochosos, com maior chance em montanhas e no subsolo.
- **Requisitos de Ferramentas**: A mineração de minério de ferro requer uma picareta (primitiva ou de ferro).

## Metalurgia e Ferramentas de Ferro
- **Fundição de Ferro**: O "Minério de Ferro" pode ser derretido em uma fogueira para criar "Barra de Ferro".
- **Ferramentas de Ferro**: Novas receitas foram adicionadas para criar "Picareta de Ferro" e "Machado de Ferro" a partir de barras de ferro.
- **Uso de Ferramentas de Ferro**: As ferramentas de ferro podem ser usadas para coletar recursos de forma mais eficiente.

## Sistema de Construção (em andamento)
- **Novos Itens de Construção**: Foram adicionados os itens "Pregos", "Tábua", "Parede de Madeira" e "Porta de Madeira".
- **Receitas de Construção**: Novas receitas foram adicionadas para criar tábuas, pregos, paredes e portas.
- **Colocação de Estruturas**: A lógica para colocar paredes e portas no mapa foi iniciada.
- **Colisão**: A detecção de colisão com paredes e portas foi implementada.

## Geração de Mundo
- **Acesso à Montanha**: Adicionada a geração de caminhos de grama dentro do bioma de montanha para permitir o acesso e a exploração.
- **Distribuição de Recursos**: O minério de ferro agora pode ser encontrado em todos os biomas, com a adição de afloramentos rochosos em planícies e florestas.
