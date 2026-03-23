# 🛒 E-commerce Full-Stack (MVP)

Um e-commerce completo e responsivo, focado em pequenos negócios de varejo, com catálogo dinâmico, painel administrativo seguro e checkout totalmente integrado ao WhatsApp.

## 🎯 O Problema de Negócio
Pequenos varejistas (como lojas de roupas e acessórios) frequentemente perdem vendas devido a atendimentos lentos no WhatsApp. O cliente precisa perguntar preços, tamanhos e aguardar cálculos manuais, o que gera gargalos operacionais e erros de cobrança.

## 💡 A Solução
Este projeto automatiza a jornada de compra sem perder a personalização do atendimento via WhatsApp. O cliente navega por uma vitrine dinâmica, adiciona itens ao carrinho e o sistema formata o pedido com quantidades, tamanhos e valor exato, enviando diretamente para a API do WhatsApp da loja.

## 🚀 Tecnologias Utilizadas (Stack)
A arquitetura foi desenhada priorizando velocidade e leveza, sem a necessidade de frameworks complexos no frontend.

* **Frontend:** HTML5, CSS3, Vanilla JavaScript (manipulação de DOM, LocalStorage e Fetch API).
* **Backend:** Python com FastAPI.
* **Banco de Dados:** SQLite e SQLAlchemy (ORM).
* **Segurança:** Autenticação JWT (JSON Web Tokens) e criptografia Bcrypt para o painel administrativo.

## ✨ Funcionalidades
* **Catálogo Dinâmico:** Produtos carregados via API do banco de dados com filtros de categoria, preço e tamanho.
* **Carrinho de Compras:** Sistema de carrinho lateral com persistência de dados no `localStorage`.
* **Checkout Otimizado:** Geração de mensagem formatada com total calculado para o WhatsApp.
* **Painel Administrativo:** Área restrita (com login e token) para adicionar, excluir e gerenciar produtos e estoques.
* **Upload de Imagens:** Sistema de upload nativo pelo painel admin.

## ⚙️ Como Rodar o Projeto Localmente

1. **Clone este repositório:**
   ```bash
   git clone [https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git](https://github.com/SEU-USUARIO/NOME-DO-REPOSITORIO.git)
   cd NOME-DO-REPOSITORIO