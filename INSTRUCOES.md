# 📖 Manual do Desenvolvedor: AgendaFácil Template

Este projeto foi criado para ser um Template Multi-Nicho fácil de configurar e entregar. Aqui estão os comandos principais que você precisa saber.

## 🛠️ Comandos Essenciais

No seu terminal, dentro da pasta do projeto:

- `npm install` - Instala todas as ferramentas (só precisa rodar uma vez ou quando baixar o projeto de novo).
- `npm run dev` - Abre o site para você ver e testar no seu computador (Localhost).
- `npm run build` - Prepara o site para ser colocado na internet (Gera a pasta `dist`).

## ⚙️ Como Personalizar para um Cliente

Para criar um novo site baseado neste molde, você tem dois caminhos:

1. **Pelo Painel Admin (Rápido)**: 
   - Abra o site (`npm run dev`), entre no Admin com a senha `mestre` e mude tudo na aba **Master**. Os dados ficam salvos no navegador.
   
2. **Pelo Código (Definitivo)**:
   - Abra o arquivo `src/config.ts`.
   - Mude os valores de `name`, `whatsapp`, `services` e `primaryColor`.
   - Isso garante que qualquer pessoa que abrir o site verá as configurações certas.

## 🔒 Segurança (Senhas)

- **Agenda**: O cliente deve usar a senha definida em `apptPassword`.
- **Master**: Você deve usar a senha definida em `settingsPassword`.

## ☁️ Como Salvar e Colocar Online

### Salvar no GitHub (Backup)
1. Inicie o git: `git init`
2. Adicione os arquivos: `git add .`
3. Salve: `git commit -m "Versão base do template"`

### Colocar na Internet (Vercel)
1. Crie conta no [vercel.com](https://vercel.com).
2. Clique em "New Project" e selecione esta pasta.
3. O Vercel vai te dar um link público automaticamente!

---
**Dica**: Guarde bem essa pasta `book-go`. Ela é a sua "fábrica" de mini-sites agora! 🚀
