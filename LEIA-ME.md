# Pedidos Pro — aplicativo instalável para Windows

Esta pasta contém o projeto baseado no sistema HTML enviado, empacotado como aplicativo de computador. Os cadastros e pedidos são gravados automaticamente em um banco SQLite (`pedidos-pro.db`) na pasta de dados do aplicativo do usuário do Windows, não apenas no armazenamento de um navegador.

## Como gerar o instalador usando o GitHub pelo computador

1. Crie um repositório no GitHub e envie todos os arquivos desta pasta (incluindo a pasta `.github/workflows`).
2. No GitHub, abra a aba **Actions** e selecione **Gerar instalador Windows**.
3. Clique em **Run workflow** e confirme.
4. Quando terminar com sucesso, abra a execução e baixe o artefato **Pedidos-Pro-Instalador-Windows**. Dentro estará o arquivo `.exe`.
5. Execute o instalador no Windows e siga as telas.

O workflow constrói o instalador em um ambiente Windows do GitHub; não é necessário compilar no seu computador.

## Desenvolvimento local (opcional)

Instale Node.js 22 ou superior. Dentro da pasta do projeto execute:

```bash
npm install
npm start
```

Para gerar o instalador localmente em Windows:

```bash
npm run dist
```

## Banco de dados e backup

- Banco local: arquivo `pedidos-pro.db` dentro da pasta de dados do aplicativo do Windows.
- O sistema salva os dados automaticamente no SQLite.
- O backup JSON existente continua disponível pela aba **Backup e ajuda**.
- A base de dados SQLite também pode ser copiada pelo código do aplicativo para uma pasta escolhida pelo usuário, se o botão de backup nativo for ligado à interface.

## Importante

- Os dados ficam neste computador e não são sincronizados automaticamente com celular ou outros computadores.
- Faça backups regulares e guarde-os em outro local, como pendrive ou nuvem.
- A base SQLite é local; desinstalar o aplicativo normalmente não precisa apagar os dados, mas não use ferramentas de limpeza para apagar a pasta de dados do aplicativo sem backup.
- O conteúdo e as funcionalidades do sistema HTML original foram preservados como base. O pacote não foi compilado nem testado em uma máquina Windows nesta sessão; use o workflow do GitHub para compilar e validar o instalador.
