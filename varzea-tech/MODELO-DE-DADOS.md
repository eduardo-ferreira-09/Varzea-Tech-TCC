# Modelo de dados (para o backend)

Hoje tudo vive no `localStorage` dentro do objeto `db` do `script.js`. Ao criar a API, troque só ele.

| Tabela | Campos principais |
|---|---|
| usuarios | username, nome, email, whatsapp, posicao, foto, senha_hash |
| rachas | id, nome, tipo, privado, vagas, preco, arena, data_hora, endereco, cep, cidade, org (usuario), cancelado |
| participacoes | racha_id, usuario, posicao, status (confirmado, pendente, espera) |
| sumula | racha_id, usuario, gols, assistencias (preenchida pelo organizador após o jogo) |
| avaliacoes | racha_id, de, para, tecnica, fairplay, pontual (1 a 5), comentario, criada_em (única por racha, de, para) |

Estatísticas do jogador (`estat()` no script): partidas, gols, assistências, gols por jogo, nota média e rachas organizados. Todas são somas e médias sobre `sumula` e `avaliacoes`, ou seja, um `GET /jogadores/:username/estatisticas`.

Regras já aplicadas no front e que o backend deve repetir: só avalia quem jogou o racha, depois da data, sem avaliar a si mesmo. Só o organizador edita a súmula, depois da data.

## Posições por tipo de racha

Campo: Goleiro, Zagueiro, Lateral, Volante, Meia, Ponta, Atacante. Society: Goleiro, Zagueiro, Ala, Meia, Atacante. Futsal e Areia: Goleiro, Fixo, Ala, Pivô. O tipo do racha não muda depois de criado, e o backend deve validar que `participacoes.posicao` pertence ao tipo do racha.

## Tema claro e escuro

Fica só no front: segue o `prefers-color-scheme` do navegador e, se o usuário clicar no botão do topo, grava `vt_tema` (`light` ou `dark`) no `localStorage`. Se quiser sincronizar entre aparelhos, basta guardar essa preferência no cadastro do usuário.

## Rachas semanais

`rachas` ganha `recorrente` (boolean), `serie_id` (id do primeiro racha da série), `proximo_id` (racha já gerado a partir deste) e `prazo_confirmacao`. `participacoes.status` ganha o valor `a_confirmar`, que reserva a vaga até o prazo (24h antes do jogo). Uma tarefa agendada faz duas coisas: (1) quando um racha recorrente termina e ainda não tem `proximo_id`, cria o próximo com data +7 dias, o organizador confirmado e os demais jogadores como `a_confirmar`; (2) depois do prazo, remove os `a_confirmar` e promove a lista de espera. Vagas ocupadas = confirmados + `a_confirmar`.

## Ranking do racha

O ranking fica dentro da página de cada racha (aba "Ranking"). Ele soma todas as edições da série (`serie_id`) e conta só jogos já realizados: gols e assistências vêm de `sumula`, presença de `participacoes` e nota de `avaliacoes`. No backend é um `GET /rachas/:id/ranking?categoria=gols|assistencias|nota|presenca`.

## Fotos do racha

`rachas.foto_capa` (URL) e a tabela `fotos_racha` (id, racha_id, usuario, url, criada_em). Hoje as imagens ficam em base64 no `localStorage`, reduzidas para 900px; no backend guarde o arquivo em um storage (S3, Cloudinary etc.) e salve só a URL. Regras do front: só quem joga ou organiza envia (até 24 por racha); exclui quem enviou ou o organizador. Sem capa, o card usa a primeira foto da galeria; sem nenhuma, mostra o campo desenhado.

## Identidade visual

A logo fica em `img/` (versões para tema escuro e claro, mais favicon e ícone de app). Paleta extraída da logo: esmeralda `#0a9f61` (TECH), verde profundo `#0b6b46`, menta `#6fdca8` e fundo preto esverdeado `#030d09`. Tudo está nos tokens do início do `style.css`.

## Esqueci a senha

Tabela `redefinicoes_senha` (usuario, codigo_hash, expira_em, tentativas, usado). Fluxo: `POST /senha/esqueci` (sempre responde a mesma mensagem, exista a conta ou não, e envia o código de 6 dígitos por e-mail/SMS), depois `POST /senha/redefinir` com código e nova senha (máximo de 5 tentativas, validade de 10 minutos, senha com hash no servidor). Hoje o código aparece na tela em modo demonstração.
