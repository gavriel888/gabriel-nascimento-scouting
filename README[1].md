# Gabriel Nascimento Scouting

Banco de dados particular para scouting, rodando localmente no navegador.

## Como abrir

### Jeito mais fácil
Abra o arquivo `index.html` com dois cliques.

### Usando servidor local
Se tiver Python instalado, abra esta pasta no terminal e rode:

```bash
python -m http.server 8000
```

ou:

```bash
py -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000
```

No Windows, você também pode dar dois cliques em `ABRIR_SITE.bat`.

## O que tem nesta versão

- Cadastro de jogadores com foto.
- Observações por jogo.
- Atributos de 0 a 10.
- Atributos fixos para todas as posições: técnica, velocidade, estatura e competitividade.
- Atributos específicos para atacantes, meias, laterais, zagueiros e goleiros.
- Médias automáticas.
- Gráfico de perfil em radar, no estilo menu de futebol.
- Quadrante de scouting com leitura de bola/técnica e impacto competitivo.
- Função para comparar dois atletas do banco.
- Importar/exportar backup JSON.
- Sincronização opcional na nuvem com Supabase Auth + Postgres.

## Supabase

1. Abra o projeto no Supabase.
2. Va em `SQL Editor`.
3. Cole e rode o arquivo `supabase/schema.sql`.
4. Va em `Authentication` > `Users`.
5. Crie um usuario com email e senha.
6. Abra o site, clique em `Entrar` e use esse email/senha.
7. Clique em `Sync` se quiser forcar a mesclagem local/nuvem.

O site continua funcionando em modo local se voce nao entrar ou estiver sem internet.

## Importante

Os dados ficam salvos no navegador pelo localStorage e, quando conectado, tambem no Supabase. Use `Exportar` de vez em quando como backup.
