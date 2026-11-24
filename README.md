# 🛒 Redesign de Caixa de Autoatendimento — Supermercado Horizonte

![React](https://img.shields.io/badge/React-18.3-0A1E3C?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5.4-163A5F?style=for-the-badge&logo=vite)
![CSS3](https://img.shields.io/badge/CSS3-Touchscreen_UI-16A34A?style=for-the-badge&logo=css3)
![IHC](https://img.shields.io/badge/Projeto_Acadêmico-IHC_%2F_UX-DC2626?style=for-the-badge)

Aplicação web interativa desenvolvida para um trabalho acadêmico de **Interação Humano-Computador (IHC)**. O projeto simula um terminal físico de autoatendimento (*self-checkout*) de supermercado, com foco no **cancelamento autônomo, intuitivo, seguro e acessível de produtos já registrados**.

---

## 🎯 Objetivo do Projeto

Nos terminais tradicionais de autoatendimento, cancelar um item registrado por engano costuma exigir a intervenção imediata de um funcionário, gerando filas, constrangimento e frustração ao consumidor.

Este protótipo demonstra como substituir uma interação confusa e bloqueante por uma **experiência centrada no usuário**, conectando claramente as **ações na tela touchscreen** às **ações físicas no terminal** (leitor óptico, balança de ensacamento e bandeja dedicada a produtos cancelados).

---

## ✨ Principais Funcionalidades e Princípios de IHC

### 1. Conceito Visual e Ergonomia Touchscreen
- **Layout Horizontal (Widescreen)**: Proporção fiel a um terminal físico de autoatendimento.
- **Hierarquia Cromática Semântica**:
  - **Fundo Claro** (`#F5F7FA` / `#FFFFFF`) para alto contraste e legibilidade.
  - **Azul Escuro** (`#0A1E3C`) como cor institucional principal.
  - **Verde** (`#16A34A`) exclusivo para confirmações e avanço de fluxo.
  - **Vermelho** (`#DC2626`) reservado para ações de remoção e alerta.
- **Lei de Fitts & Lei de Hick**: Botões amplos para toque direto, vocabulário simples (sem códigos fiscais crípticos) e baixa densidade informacional por etapa.

### 2. Duas Formas de Cancelar Produtos e Cancelamento Parcial
- **Opção A — Pela Lista de Produtos**: O consumidor toca diretamente sobre qualquer item já registrado na lista e aciona o botão contextual **"Remover produto"**.
- **Opção B — Pelo Botão Fixo**: O consumidor toca no botão permanente **"Cancelar produto"** no painel direito e escolhe, em uma janela dedicada, qual item registrado deseja remover.
- **Seleção de Quantidade e Prévia Financeira**: Na janela de confirmação, o utilizador pode ajustar exatamente quantas unidades deseja remover (ex.: **cancelar 2 de 3 unidades**), visualizando **antes de confirmar**:
  - **Nome do produto**, **preço unitário** e **peso**
  - **Quantidade a remover**
  - **Valor a descontar**
  - **Novo total da compra**
  - Botões **"Voltar"** e **"Confirmar cancelamento"**

### 3. Conexão Tela ↔ Mundo Físico e Transições Limpas
- Após confirmar o cancelamento, a interface evita cartões e botões concorrentes ao fundo, mantendo o foco no próximo passo do utilizador:
  1. Remove (ou deduz) a quantidade cancelada da lista ativa e atualiza o valor total imediatamente.
  2. Registra o item no **Histórico de Itens Cancelados (Sem Cobrança)**.
  3. Exibe a mensagem **"Produto cancelado com sucesso!"** seguida da instrução: *"Coloque o produto na área identificada para itens cancelados."*
  4. Separa visualmente a **2. Área de Ensacamento (Compra Ativa / Peso)** da **3. Bandeja de Produtos Cancelados**, permitindo simular o depósito físico na bandeja.
  5. Ao finalizar a compra, apresenta um **Resumo Final Transparente** com **Total Bruto Registrado**, **Valor Cancelado / Abatido** e **Valor Final Cobrado**.

### 4. Tratamento de Exceções e Regras de Segurança
- Impede o cancelamento de produtos inexistentes (carrinho vazio).
- Simula **Divergência de Peso na Balança** (caso o consumidor remova o item na tela, mas não o deposite na bandeja física de cancelados).
- Simula **Bloqueio Preventivo de Segurança** e chamado de assistência de funcionário, com explicação transparente e opção de liberação simulada para continuidade da demonstração.

---

## 🗂️ Arquitetura do Projeto

```text
caixa/
├── index.html                              # Ponto de entrada HTML e tipografia (Inter & JetBrains Mono)
├── package.json                            # Dependências e scripts de execução/build
├── vite.config.js                          # Configuração do bundler Vite
├── .gitignore                              # Exclusão de node_modules, dist, .env e arquivos locais
├── .env.example                            # Modelo de variáveis de ambiente
├── publish-github.ps1                      # Script PowerShell automatizado para push no GitHub
├── publish-github.sh                       # Script Bash automatizado para push no GitHub
└── src/
    ├── main.jsx                            # Inicialização da árvore React
    ├── App.jsx                             # Orquestração de estado da compra e fluxos de IHC
    ├── data/
    │   └── products.js                     # Catálogo local de produtos fictícios e formatadores
    ├── utils/
    │   └── sound.js                        # Síntese sonora do leitor óptico via Web Audio API
    ├── components/
    │   ├── TerminalHeader.jsx              # Cabeçalho do terminal, status luminoso e atalhos IHC
    │   ├── ProductList.jsx                 # Lista de produtos registrados (Opção A de cancelamento)
    │   ├── CheckoutSummary.jsx             # Totalizador e botão fixo "Cancelar produto" (Opção B)
    │   ├── CanceledHistory.jsx             # Histórico separado de itens removidos na compra
    │   ├── PhysicalZones.jsx               # Simulação do Leitor Óptico, Ensacamento e Bandeja de Cancelados
    │   ├── CancelModals.jsx                # Modais de Seleção (Opção B), Confirmação e Sucesso
    │   └── ExceptionAndPaymentModals.jsx   # Modais de Exceção (Funcionário), Pagamento e Roteiro IHC
    └── styles/
        └── terminal.css                    # Design system touchscreen horizontal
```

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm**

### Passo a passo

1. Clone o repositório:
   ```bash
   git clone https://github.com/bernardoaoliveora/caixa.git
   cd caixa
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

4. Acesse no navegador o endereço exibido no terminal (por padrão `http://localhost:5173`).

5. Para gerar a versão otimizada de produção:
   ```bash
   npm run build
   ```

---

## 🎬 Roteiro de Demonstração (Vídeo Acadêmico de IHC)

1. **Início da compra**: Utilize a compra de exemplo pré-carregada ou clique em **"Compra do Zero"** no cabeçalho.
2. **Registro de produtos**: Toque nos itens da **1. Área de Leitura de Produtos (Leitor Óptico)** para adicioná-los ao carrinho com feedback visual e sonoro.
3. **Identificação de erro**: Observe um produto adicionado por engano (ex.: *Azeite de Oliva Extra Virgem 500ml*).
4. **Início do cancelamento**:
   - **Opção A**: Toque no produto diretamente na lista e clique em **"Remover produto"**; ou
   - **Opção B**: Toque no botão fixo **"Cancelar produto"** e selecione o item desejado.
5. **Confirmação**: Verifique os dados na janela *"Deseja realmente remover este produto da sua compra?"* e toque em **"Confirmar cancelamento"**.
6. **Orientação física**: Veja o novo total atualizado, leia a orientação *"Coloque o produto na área identificada para itens cancelados."* e clique para depositar o item na bandeja **"PRODUTOS CANCELADOS"**.
7. **Continuidade**: Continue registrando itens ou finalize a compra em **"Finalizar e Pagar"**.

---

## 👤 Autor

Desenvolvido para fins acadêmicos de **Interação Humano-Computador (IHC)**.

- **GitHub User**: `bnwebstudio`
- **Repositório**: `https://github.com/bernardoaoliveora/caixa.git`
