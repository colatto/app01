
# 🏗️ Sistema de Gestão para Construção Civil

Um sistema completo de gestão empresarial desenvolvido especificamente para empresas de construção civil, oferecendo controle total sobre projetos, recursos humanos, financeiro, estoque e muito mais.

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Usar](#como-usar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Módulos do Sistema](#módulos-do-sistema)
- [Contribuindo](#contribuindo)
- [Licença](#licença)
- [Suporte](#suporte)

## 🎯 Sobre o Projeto

O Sistema de Gestão para Construção Civil é uma solução completa e moderna que visa otimizar todos os aspectos operacionais de empresas do setor da construção. Desenvolvido com tecnologias de ponta, oferece uma interface intuitiva e funcionalidades robustas para gestão eficiente de projetos, recursos e finanças.

### 🌟 Diferenciais

- **Interface Moderna**: Design responsivo e intuitivo
- **Gestão Integrada**: Todos os módulos conectados em uma única plataforma
- **Relatórios Avançados**: Dashboards e relatórios em tempo real
- **Mobilidade**: Acesso via web em qualquer dispositivo
- **Segurança**: Controle de acesso baseado em perfis
- **Escalabilidade**: Arquitetura preparada para crescimento

## 🚀 Funcionalidades

### 📊 Dashboard Principal
- Visão geral em tempo real de todos os indicadores
- Gráficos interativos de performance
- Alertas e notificações importantes
- Resumo financeiro e operacional

### 👥 Gestão de Recursos Humanos
- **Cadastro de Funcionários**: Informações completas e documentos
- **Controle de Ponto**: Registro de entrada/saída e horas trabalhadas
- **Folha de Pagamento**: Cálculo automático de salários e benefícios
- **Gestão de Férias**: Controle de períodos e planejamento
- **Avaliações**: Sistema de avaliação de desempenho
- **Treinamentos**: Controle de capacitações e certificações

### 💰 Gestão Financeira
- **Contas a Pagar**: Controle completo de fornecedores e vencimentos
- **Contas a Receber**: Gestão de clientes e recebimentos
- **Fluxo de Caixa**: Projeções e controle de entrada/saída
- **Centros de Custo**: Organização por projeto ou departamento
- **Relatórios Financeiros**: DRE, Balanço e análises gerenciais

### 📦 Gestão de Estoque
- **Controle de Materiais**: Cadastro completo com especificações
- **Movimentações**: Entrada, saída e transferências
- **Inventário**: Controle de estoque mínimo e máximo
- **Fornecedores**: Gestão de parceiros e cotações
- **Relatórios**: Análise de consumo e custos

### 🏗️ Gestão de Projetos
- **Cadastro de Obras**: Informações detalhadas dos projetos
- **Cronogramas**: Planejamento e acompanhamento de etapas
- **Orçamentos**: Estimativas detalhadas de custos
- **Acompanhamento**: Status em tempo real da execução
- **Documentos**: Gestão de plantas, contratos e licenças

### 🤝 Gestão de Leads e Clientes
- **CRM Integrado**: Controle completo do funil de vendas
- **Lead Scoring**: Qualificação automática de prospects
- **Histórico de Interações**: Registro completo de contatos
- **Pipeline de Vendas**: Acompanhamento visual das oportunidades

### 📋 Sistema de Propostas
- **Templates Personalizáveis**: Modelos profissionais para propostas
- **Orçamentação Detalhada**: Etapas, subetapas e insumos
- **Cálculos Automáticos**: BDI, descontos e totalizações
- **Exportação**: PDF e Excel para apresentação

### 🔧 Gestão de Equipamentos
- **Cadastro Completo**: Especificações e documentação
- **Manutenções**: Preventivas e corretivas
- **Histórico de Uso**: Controle de horas e projetos
- **Depreciação**: Cálculos automáticos de valor

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18**: Biblioteca JavaScript para interfaces
- **TypeScript**: Tipagem estática para maior robustez
- **Tailwind CSS**: Framework CSS utilitário
- **Lucide React**: Ícones modernos e consistentes
- **React Router**: Navegação entre páginas
- **React Hot Toast**: Notificações elegantes

### Backend & Banco de Dados
- **Lumi SDK**: Plataforma de desenvolvimento backend
- **MongoDB**: Banco de dados NoSQL escalável
- **Validação JSON Schema**: Estruturas de dados consistentes

### Ferramentas de Desenvolvimento
- **Vite**: Build tool rápido e moderno
- **ESLint**: Linting para qualidade de código
- **Git**: Controle de versão

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Git**
- Navegador web moderno (Chrome, Firefox, Safari, Edge)

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/sistema-gestao-construcao.git
cd sistema-gestao-construcao
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
```
Edite o arquivo `.env` com suas configurações:
```env
VITE_API_BASE_URL=sua_url_da_api
VITE_PROJECT_ID=seu_project_id
```

4. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

5. **Acesse a aplicação**
Abra seu navegador e acesse: `http://localhost:5173`

## 📖 Como Usar

### Primeiro Acesso

1. **Login**: Use suas credenciais fornecidas pelo administrador
2. **Dashboard**: Familiarize-se com a visão geral do sistema
3. **Configurações**: Configure perfis de usuário e permissões
4. **Dados Iniciais**: Cadastre informações básicas da empresa

### Fluxo de Trabalho Típico

1. **Cadastros Básicos**
   - Funcionários e departamentos
   - Fornecedores e clientes
   - Materiais e equipamentos

2. **Gestão de Projetos**
   - Criar novo projeto/obra
   - Definir cronograma e orçamento
   - Alocar recursos e equipe

3. **Operação Diária**
   - Registrar movimentações de estoque
   - Controlar ponto dos funcionários
   - Acompanhar progresso dos projetos

4. **Gestão Financeira**
   - Lançar contas a pagar/receber
   - Acompanhar fluxo de caixa
   - Gerar relatórios gerenciais

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── Dashboard.tsx    # Dashboard principal
│   ├── RH.tsx          # Módulo de Recursos Humanos
│   ├── Financeiro.tsx  # Módulo Financeiro
│   ├── Estoque.tsx     # Módulo de Estoque
│   ├── Projetos.tsx    # Módulo de Projetos
│   ├── Leads.tsx       # Módulo de Leads/CRM
│   ├── Proposta.tsx    # Sistema de Propostas
│   └── Equipamentos.tsx # Gestão de Equipamentos
├── entities/           # Schemas do MongoDB
│   ├── funcionarios.json
│   ├── projetos.json
│   ├── estoque.json
│   └── ...
├── lib/               # Configurações e utilitários
│   └── lumi.ts        # Cliente SDK (NÃO MODIFICAR)
├── pages/             # Páginas da aplicação
├── hooks/             # Hooks personalizados
├── utils/             # Funções utilitárias
└── types/             # Definições de tipos TypeScript
```

## 🏢 Módulos do Sistema

### 1. Dashboard
**Objetivo**: Visão geral e indicadores-chave
- Métricas financeiras em tempo real
- Status de projetos ativos
- Alertas e notificações
- Gráficos de performance

### 2. Recursos Humanos
**Objetivo**: Gestão completa de pessoal
- Cadastro e documentação
- Controle de ponto e frequência
- Folha de pagamento
- Gestão de benefícios

### 3. Financeiro
**Objetivo**: Controle financeiro total
- Contas a pagar e receber
- Fluxo de caixa
- Relatórios gerenciais
- Análise de rentabilidade

### 4. Estoque
**Objetivo**: Controle de materiais e insumos
- Movimentações de entrada/saída
- Controle de estoque mínimo
- Gestão de fornecedores
- Análise de consumo

### 5. Projetos
**Objetivo**: Gestão de obras e empreendimentos
- Planejamento e cronogramas
- Controle de custos
- Acompanhamento de progresso
- Gestão de documentos

### 6. Leads/CRM
**Objetivo**: Gestão comercial
- Funil de vendas
- Qualificação de prospects
- Histórico de interações
- Análise de conversão

### 7. Propostas
**Objetivo**: Elaboração de orçamentos
- Templates personalizáveis
- Cálculos automáticos
- Gestão de etapas
- Exportação profissional

### 8. Equipamentos
**Objetivo**: Controle de maquinário
- Cadastro e especificações
- Manutenções preventivas
- Controle de uso
- Análise de produtividade

## 🔐 Segurança e Permissões

O sistema implementa controle de acesso baseado em perfis:

- **Administrador**: Acesso total ao sistema
- **Gerente**: Acesso a módulos específicos
- **Operador**: Acesso limitado a funções operacionais
- **Visualizador**: Apenas consulta e relatórios

## 📊 Relatórios Disponíveis

### Financeiros
- Demonstrativo de Resultados (DRE)
- Fluxo de Caixa Projetado
- Análise de Custos por Projeto
- Relatório de Inadimplência

### Operacionais
- Produtividade por Funcionário
- Consumo de Materiais
- Status de Projetos
- Utilização de Equipamentos

### Gerenciais
- Dashboard Executivo
- Análise de Rentabilidade
- Indicadores de Performance (KPIs)
- Comparativo Orçado x Realizado

## 🤝 Contribuindo

Contribuições são sempre bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. **Abra** um Pull Request

### Diretrizes de Contribuição

- Siga os padrões de código estabelecidos
- Documente novas funcionalidades
- Inclua testes quando apropriado
- Mantenha commits pequenos e focados

## 🐛 Reportando Bugs

Para reportar bugs, abra uma issue incluindo:

- Descrição detalhada do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do ambiente (browser, OS, etc.)

## 📞 Suporte

### Documentação
- [Wiki do Projeto](link-para-wiki)
- [FAQ](link-para-faq)
- [Guia do Usuário](link-para-guia)

### Contato
- **Email**: suporte@sistemagestao.com
- **Telefone**: (11) 9999-9999
- **Chat**: Disponível no sistema

### Treinamento
Oferecemos treinamento personalizado para sua equipe:
- Treinamento presencial ou online
- Material de apoio incluído
- Suporte pós-treinamento

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🎉 Agradecimentos

- Equipe de desenvolvimento
- Beta testers
- Comunidade de contribuidores
- Empresas parceiras que forneceram feedback

---

## 📈 Roadmap

### Versão 2.0 (Próximas Features)
- [ ] Aplicativo mobile nativo
- [ ] Integração com contabilidade
- [ ] BI avançado com Machine Learning
- [ ] API pública para integrações
- [ ] Módulo de qualidade e certificações

### Versão 1.5 (Em Desenvolvimento)
- [ ] Notificações push
- [ ] Backup automático
- [ ] Auditoria de ações
- [ ] Relatórios customizáveis

---

**Desenvolvido com ❤️ para a indústria da construção civil**

*Transformando a gestão empresarial através da tecnologia*
