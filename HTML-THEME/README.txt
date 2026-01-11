
To-Do To-Did PRO — Tema HTML Standalone v1.2
============================================

Este pacote contém a versão completa e sem base de dados do To-Do To-Did.

SISTEMA DE MANTRAS DINÂMICOS
----------------------------
Apesar de ser um site estático (apenas HTML/JS), o sistema inclui um comportamento inteligente no browser.
As frases (Mantras) exibidas no fundo do ecrã atualizam-se automaticamente com base em:

1. Hora do Dia (Manhã vs Noite)
2. Carga de Trabalho (Lista vazia vs Lista cheia)
3. Contexto do Utilizador (Tarefas adicionadas/completas)

Esta lógica corre localmente no ficheiro 'javascript.js' (função updateMantra), fazendo com que a app pareça "viva" mesmo num alojamento estático.

INSTALAÇÃO (SERVIDOR)
---------------------
1. Copie o conteúdo desta pasta ('HTML-THEME') para o seu servidor web (public_html, www, etc.).
2. Está pronto. Não é necessária configuração de base de dados.

FICHEIROS
---------
- index.html: A estrutura e layout.
- style.css: O sistema de design "Eye Comfort" (Cinzento Escuro).
- javascript.js: O núcleo lógico (Tarefas, NLP, Mantras Dinâmicos) - COM COMENTÁRIOS EM PT-PT.
- jquery.js: Biblioteca necessária.

To-Do To-Did — Menos planeamento. Mais ação.