
import React, { useState, useEffect } from 'react'
import { 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  FileText,
  Camera,
  Paperclip,
  Download,
  Save,
  X,
  Users,
  Building,
  Clipboard,
  Sun,
  Cloud,
  CloudRain,
  Shield,
  Activity,
  TrendingUp,
  BarChart3,
  Settings,
  Upload,
  Image,
  File,
  PenTool
} from 'lucide-react'
import { lumi } from '../lib/lumi'
import toast from 'react-hot-toast'
import jsPDF from 'jspdf'

interface DiarioObra {
  _id: string
  planejamentoId: string
  tipo: 'diario' | 'semanal'
  data: string
  responsavel: string
  local: string
  clima: {
    manha: 'sol' | 'chuva' | 'nublado'
    tarde: 'sol' | 'chuva' | 'nublado'
    noite: 'sol' | 'chuva' | 'nublado'
  }
  climaSemanal?: {
    segunda: 'sol' | 'chuva' | 'nublado'
    terca: 'sol' | 'chuva' | 'nublado'
    quarta: 'sol' | 'chuva' | 'nublado'
    quinta: 'sol' | 'chuva' | 'nublado'
    sexta: 'sol' | 'chuva' | 'nublado'
  }
  maoDeObra: MaoDeObraItem[]
  equipamentos: EquipamentoItem[]
  atividades: AtividadeItem[]
  atividadesPlanejamento: AtividadePlanejamentoItem[]
  atividadesPlanejamentoSemanal: AtividadePlanejamentoSemanalItem[]
  fotos: FotoItem[]
  naoConformidades: NaoConformidadeItem[]
  checklistSeguranca: ChecklistSeguranca
  documentos: DocumentoItem[]
  medicao: {
    percentualConcluido: number
    valorMedicao: number
    observacoes: string
  }
  criadoEm: string
  atualizadoEm: string
}

interface MaoDeObraItem {
  funcionarioId: string
  nome: string
  funcao: string
  horasTrabalhadas: number
  valorHora: number
  valorTotal: number
}

interface EquipamentoItem {
  nome: string
  horasUso: number
  observacoes: string
}

interface AtividadeItem {
  descricao: string
  responsavel: string
  progresso: number
}

interface AtividadePlanejamentoItem {
  id: string
  nome: string
  etapa: string
  subetapa?: string
  responsavel: string
  progresso: number
  status: string
  origem: 'planejamento'
}

interface AtividadePlanejamentoSemanalItem {
  id: string
  nome: string
  responsavel: string
  progresso: number
  status: string
  origem: 'planejamento_semanal'
}

interface FotoItem {
  id: string
  url: string
  descricao: string
  timestamp: string
  arquivo?: File
}

interface NaoConformidadeItem {
  tipo: 'ocorrencia' | 'acidente' | 'inspecao'
  descricao: string
  gravidade: 'baixa' | 'media' | 'alta'
  acaoCorretiva: string
}

interface ChecklistSeguranca {
  epiUtilizado: boolean
  areaIsolada: boolean
  equipamentosFuncionando: boolean
  observacoes: string
}

interface DocumentoItem {
  id: string
  nome: string
  url: string
  tipo: string
  arquivo?: File
}

interface Planejamento {
  _id: string
  nomeProjeto: string
  cliente: string
  status: string
  dataInicio: string
  dataPrevisaoTermino: string
  progresso: number
  etapas?: Etapa[]
}

interface Etapa {
  id: string
  nome: string
  atividades?: AtividadeEtapa[]
  subetapas?: Subetapa[]
}

interface Subetapa {
  id: string
  nome: string
  atividades?: AtividadeSubetapa[]
}

interface AtividadeEtapa {
  id: string
  nome: string
  responsavel: string
  status: string
  progresso: number
}

interface AtividadeSubetapa {
  id: string
  nome: string
  responsavel: string
  status: string
  progresso: number
}

interface PlanejamentoSemanal {
  _id: string
  planejamentoId: string
  semana: string
  atividades?: AtividadeSemanal[]
}

interface AtividadeSemanal {
  id: string
  nome: string
  responsavel: string
  status: string
  progresso: number
}

interface Funcionario {
  _id: string
  nome: string
  funcao: string
  valorHora: number
  ativo: boolean
}

// NOVA INTERFACE PARA PROPOSTA
interface Proposta {
  _id: string
  numero: string
  cliente: string
  nomeProjeto: string
  etapas: EtapaProposta[]
  valorTotal: number
}

interface EtapaProposta {
  id: string
  numero: string
  nome: string
  insumos: InsumoEtapa[]
  subetapas: SubetapaProposta[]
}

interface SubetapaProposta {
  id: string
  numero: string
  nome: string
  insumos: InsumoEtapa[]
}

interface InsumoEtapa {
  id: string
  nome: string
  valorTotal: number
}

// NOVA INTERFACE PARA ATIVIDADES BASEADAS EM ETAPAS/SUBETAPAS DA PROPOSTA
interface AtividadeEtapaSubetapa {
  id: string
  tipo: 'etapa' | 'subetapa'
  etapaId: string
  subetapaId?: string
  nome: string
  responsavel: string
  progresso: number
  realizada: boolean
  origem: 'proposta'
}

// TAREFA 1: Emoticons para clima
const climaOptions = {
  sol: { label: 'Sol', emoji: '☀️', icon: Sun },
  chuva: { label: 'Chuva', emoji: '🌧️', icon: CloudRain },
  nublado: { label: 'Nublado', emoji: '☁️', icon: Cloud }
}

const climaIcons = {
  sol: Sun,
  chuva: CloudRain,
  nublado: Cloud
}

const climaLabels = {
  sol: 'Sol',
  chuva: 'Chuva',
  nublado: 'Nublado'
}

const tipoLabels = {
  diario: 'Diário',
  semanal: 'Semanal'
}

const gravidadeColors = {
  baixa: 'bg-green-100 text-green-800',
  media: 'bg-yellow-100 text-yellow-800',
  alta: 'bg-red-100 text-red-800'
}

const gravidadeLabels = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta'
}

const tipoNaoConformidadeLabels = {
  ocorrencia: 'Ocorrência',
  acidente: 'Acidente',
  inspecao: 'Inspeção'
}

const diasSemana = {
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira'
}

// Funções auxiliares de formatação com verificação defensiva
const formatCurrency = (value: any): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 'R$ 0,00'
  }
  const numValue = Number(value)
  return `R$ ${numValue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

const formatNumber = (value: any): string => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return '0'
  }
  const numValue = Number(value)
  return numValue.toLocaleString('pt-BR')
}

const safeNumber = (value: any): number => {
  if (value === null || value === undefined || isNaN(Number(value))) {
    return 0
  }
  return Number(value)
}

const formatDate = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleDateString('pt-BR')
  } catch (error) {
    return '-'
  }
}

const formatDateTime = (dateString: string): string => {
  if (!dateString) return '-'
  try {
    return new Date(dateString).toLocaleString('pt-BR')
  } catch (error) {
    return '-'
  }
}

export default function DiarioObra() {
  const [diarios, setDiarios] = useState<DiarioObra[]>([])
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([])
  const [planejamentosSemanais, setPlanejamentosSemanais] = useState<PlanejamentoSemanal[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [propostas, setPropostas] = useState<Proposta[]>([]) // NOVA STATE PARA PROPOSTAS
  const [loading, setLoading] = useState(true)
  
  // Estados de filtro e navegação
  const [selectedPlanejamento, setSelectedPlanejamento] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [tipoFilter, setTipoFilter] = useState<string>('')
  const [currentWeek, setCurrentWeek] = useState<string>('')
  
  // Estados de modal
  const [showDiarioModal, setShowDiarioModal] = useState(false)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showResumoModal, setShowResumoModal] = useState(false)
  const [editingDiario, setEditingDiario] = useState<DiarioObra | null>(null)
  const [selectedDiario, setSelectedDiario] = useState<DiarioObra | null>(null)
  
  // Formulários
  const [diarioForm, setDiarioForm] = useState({
    planejamentoId: '',
    tipo: 'diario' as const,
    data: new Date().toISOString().split('T')[0],
    responsavel: '',
    local: '',
    clima: {
      manha: 'sol' as const,
      tarde: 'sol' as const,
      noite: 'sol' as const
    },
    climaSemanal: {
      segunda: 'sol' as const,
      terca: 'sol' as const,
      quarta: 'sol' as const,
      quinta: 'sol' as const,
      sexta: 'sol' as const
    },
    medicao: {
      percentualConcluido: 0,
      valorMedicao: 0,
      observacoes: ''
    }
  })

  const [maoObraForm, setMaoObraForm] = useState({
    funcionarioId: '',
    horasTrabalhadas: 8
  })

  const [equipamentoForm, setEquipamentoForm] = useState({
    nome: '',
    horasUso: 8,
    observacoes: ''
  })

  const [atividadeForm, setAtividadeForm] = useState({
    descricao: '',
    responsavel: '',
    progresso: 0
  })

  const [naoConformidadeForm, setNaoConformidadeForm] = useState({
    tipo: 'ocorrencia' as const,
    descricao: '',
    gravidade: 'media' as const,
    acaoCorretiva: ''
  })

  const [checklistForm, setChecklistForm] = useState({
    epiUtilizado: false,
    areaIsolada: false,
    equipamentosFuncionando: false,
    observacoes: ''
  })

  // Arrays temporários para o formulário
  const [tempMaoObra, setTempMaoObra] = useState<MaoDeObraItem[]>([])
  const [tempEquipamentos, setTempEquipamentos] = useState<EquipamentoItem[]>([])
  const [tempAtividades, setTempAtividades] = useState<AtividadeItem[]>([])
  const [tempAtividadesPlanejamento, setTempAtividadesPlanejamento] = useState<AtividadePlanejamentoItem[]>([])
  const [tempAtividadesPlanejamentoSemanal, setTempAtividadesPlanejamentoSemanal] = useState<AtividadePlanejamentoSemanalItem[]>([])
  const [tempFotos, setTempFotos] = useState<FotoItem[]>([])
  const [tempNaoConformidades, setTempNaoConformidades] = useState<NaoConformidadeItem[]>([])
  const [tempDocumentos, setTempDocumentos] = useState<DocumentoItem[]>([])

  // NOVA FUNCIONALIDADE: Array para atividades baseadas em etapas/subetapas da Proposta
  const [tempAtividadesEtapaSubetapa, setTempAtividadesEtapaSubetapa] = useState<AtividadeEtapaSubetapa[]>([])

  useEffect(() => {
    fetchData()
    setCurrentWeek(getCurrentWeek())
  }, [])

  useEffect(() => {
    if (selectedPlanejamento) {
      fetchDiarios()
      loadAtividadesPlanejamento()
      loadAtividadesEtapaSubetapaProposta() // NOVA FUNCIONALIDADE
    }
  }, [selectedPlanejamento])

  // NOVA FUNCIONALIDADE: Calcular valor automático da medição baseado na Proposta
  useEffect(() => {
    if (selectedPlanejamento) {
      calcularValorMedicaoAutomatico()
    }
  }, [selectedPlanejamento, tempAtividadesPlanejamento, tempAtividadesPlanejamentoSemanal, tempAtividades, tempAtividadesEtapaSubetapa])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [diariosResult, planejamentosResult, planejamentosSemanaisResult, funcionariosResult, propostasResult] = await Promise.all([
        lumi.entities.diarios.list(),
        lumi.entities.planejamentos.list(),
        lumi.entities.planejamento_semanal.list(),
        lumi.entities.funcionarios.list(),
        lumi.entities.propostas.list() // BUSCAR PROPOSTAS
      ])
      
      setDiarios(diariosResult.list || [])
      setPlanejamentos(planejamentosResult.list || [])
      setPlanejamentosSemanais(planejamentosSemanaisResult.list || [])
      setFuncionarios((funcionariosResult.list || []).filter(f => f?.ativo))
      setPropostas(propostasResult.list || []) // ARMAZENAR PROPOSTAS
      
      if ((planejamentosResult.list || []).length > 0 && !selectedPlanejamento) {
        setSelectedPlanejamento(planejamentosResult.list[0]._id)
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error)
      toast.error('Erro ao carregar dados')
    } finally {
      setLoading(false)
    }
  }

  const fetchDiarios = async () => {
    try {
      const { list } = await lumi.entities.diarios.list()
      const diariosFiltrados = (list || []).filter(d => 
        d.planejamentoId === selectedPlanejamento
      )
      setDiarios(diariosFiltrados)
    } catch (error) {
      console.error('Erro ao buscar diários:', error)
      toast.error('Erro ao carregar diários')
    }
  }

  // TAREFA 1: Carregar atividades do Planejamento e Planejamento Semanal
  const loadAtividadesPlanejamento = async () => {
    try {
      if (!selectedPlanejamento) return

      // Buscar atividades do Planejamento
      const planejamento = planejamentos.find(p => p._id === selectedPlanejamento)
      const atividadesPlanejamento: AtividadePlanejamentoItem[] = []

      if (planejamento?.etapas) {
        planejamento.etapas.forEach(etapa => {
          // Atividades da etapa
          if (etapa.atividades) {
            etapa.atividades.forEach(atividade => {
              atividadesPlanejamento.push({
                id: atividade.id,
                nome: atividade.nome,
                etapa: etapa.nome,
                responsavel: atividade.responsavel,
                progresso: atividade.progresso,
                status: atividade.status,
                origem: 'planejamento'
              })
            })
          }

          // Atividades das subetapas
          if (etapa.subetapas) {
            etapa.subetapas.forEach(subetapa => {
              if (subetapa.atividades) {
                subetapa.atividades.forEach(atividade => {
                  atividadesPlanejamento.push({
                    id: atividade.id,
                    nome: atividade.nome,
                    etapa: etapa.nome,
                    subetapa: subetapa.nome,
                    responsavel: atividade.responsavel,
                    progresso: atividade.progresso,
                    status: atividade.status,
                    origem: 'planejamento'
                  })
                })
              }
            })
          }
        })
      }

      // Buscar atividades do Planejamento Semanal
      const planejamentoSemanal = planejamentosSemanais.find(ps => ps.planejamentoId === selectedPlanejamento)
      const atividadesPlanejamentoSemanal: AtividadePlanejamentoSemanalItem[] = []

      if (planejamentoSemanal?.atividades) {
        planejamentoSemanal.atividades.forEach(atividade => {
          atividadesPlanejamentoSemanal.push({
            id: atividade.id,
            nome: atividade.nome,
            responsavel: atividade.responsavel,
            progresso: atividade.progresso,
            status: atividade.status,
            origem: 'planejamento_semanal'
          })
        })
      }

      setTempAtividadesPlanejamento(atividadesPlanejamento)
      setTempAtividadesPlanejamentoSemanal(atividadesPlanejamentoSemanal)

    } catch (error) {
      console.error('Erro ao carregar atividades do planejamento:', error)
      toast.error('Erro ao carregar atividades do planejamento')
    }
  }

  // NOVA FUNCIONALIDADE: Carregar etapas e subetapas da Proposta para atividades
  const loadAtividadesEtapaSubetapaProposta = async () => {
    try {
      if (!selectedPlanejamento) return

      // Buscar planejamento para obter nome do projeto
      const planejamento = planejamentos.find(p => p._id === selectedPlanejamento)
      if (!planejamento) return

      // Buscar proposta correspondente pelo nome do projeto e cliente
      const proposta = propostas.find(p => 
        p.nomeProjeto === planejamento.nomeProjeto && 
        p.cliente === planejamento.cliente
      )

      if (!proposta) {
        console.log('Proposta não encontrada para carregar etapas/subetapas')
        setTempAtividadesEtapaSubetapa([])
        return
      }

      const atividadesEtapaSubetapa: AtividadeEtapaSubetapa[] = []

      // Carregar etapas da proposta
      proposta.etapas.forEach(etapa => {
        // Adicionar etapa principal
        atividadesEtapaSubetapa.push({
          id: `etapa_${etapa.id}`,
          tipo: 'etapa',
          etapaId: etapa.id,
          nome: `${etapa.numero}. ${etapa.nome}`,
          responsavel: '',
          progresso: 0,
          realizada: false,
          origem: 'proposta'
        })

        // Adicionar subetapas
        etapa.subetapas.forEach(subetapa => {
          atividadesEtapaSubetapa.push({
            id: `subetapa_${subetapa.id}`,
            tipo: 'subetapa',
            etapaId: etapa.id,
            subetapaId: subetapa.id,
            nome: `${subetapa.numero}. ${subetapa.nome}`,
            responsavel: '',
            progresso: 0,
            realizada: false,
            origem: 'proposta'
          })
        })
      })

      setTempAtividadesEtapaSubetapa(atividadesEtapaSubetapa)

    } catch (error) {
      console.error('Erro ao carregar etapas/subetapas da proposta:', error)
      toast.error('Erro ao carregar etapas/subetapas da proposta')
    }
  }

  // NOVA FUNCIONALIDADE: Calcular valor da medição automaticamente baseado na Proposta
  const calcularValorMedicaoAutomatico = async () => {
    try {
      if (!selectedPlanejamento) return

      // Buscar planejamento para obter nome do projeto
      const planejamento = planejamentos.find(p => p._id === selectedPlanejamento)
      if (!planejamento) return

      // Buscar proposta correspondente pelo nome do projeto e cliente
      const proposta = propostas.find(p => 
        p.nomeProjeto === planejamento.nomeProjeto && 
        p.cliente === planejamento.cliente
      )

      if (!proposta) {
        console.log('Proposta não encontrada para calcular valor da medição')
        return
      }

      // Calcular progresso médio de todas as atividades
      const todasAtividades = [
        ...tempAtividadesPlanejamento,
        ...tempAtividadesPlanejamentoSemanal,
        ...tempAtividades,
        ...tempAtividadesEtapaSubetapa.filter(a => a.realizada) // NOVA: Incluir atividades realizadas da proposta
      ]

      let progressoMedio = 0
      if (todasAtividades.length > 0) {
        const somaProgresso = todasAtividades.reduce((sum, atividade) => sum + safeNumber(atividade.progresso), 0)
        progressoMedio = somaProgresso / todasAtividades.length
      }

      // Calcular valor da medição baseado no progresso e valor total da proposta
      const valorTotalProposta = safeNumber(proposta.valorTotal)
      const valorMedicao = (valorTotalProposta * progressoMedio) / 100

      // Atualizar formulário com valores calculados
      setDiarioForm(prev => ({
        ...prev,
        medicao: {
          ...prev.medicao,
          percentualConcluido: Math.round(progressoMedio),
          valorMedicao: valorMedicao
        }
      }))

    } catch (error) {
      console.error('Erro ao calcular valor da medição:', error)
    }
  }

  // Função para obter a semana atual
  const getCurrentWeek = (): string => {
    const today = new Date()
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()))
    return startOfWeek.toISOString().split('T')[0]
  }

  // Navegação entre semanas
  const navigateWeek = (direction: 'prev' | 'next') => {
    const currentDate = new Date(currentWeek)
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentWeek(newDate.toISOString().split('T')[0])
  }

  // TAREFA 5: Criar projeção de custo no financeiro com mão de obra
  const criarProjecaoCustoMaoObra = async (diarioData: DiarioObra) => {
    try {
      if (!diarioData.maoDeObra || diarioData.maoDeObra.length === 0) return

      const valorTotalMaoObra = diarioData.maoDeObra.reduce((total, mao) => total + safeNumber(mao.valorTotal), 0)

      const projecaoFinanceira = {
        tipo: 'provisao_despesa',
        categoria: 'Mão de Obra',
        descricao: `Projeção de custo - Mão de obra do diário ${diarioData.tipo} de ${formatDate(diarioData.data)}`,
        valor: valorTotalMaoObra,
        planejamentoId: diarioData.planejamentoId,
        diarioOrigemId: diarioData._id,
        status: 'pendente',
        dataVencimento: diarioData.data,
        observacoes: `Gerado automaticamente do diário de obra. Funcionários: ${diarioData.maoDeObra.map(m => m.nome).join(', ')}`,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      }

      await lumi.entities.financeiro.create(projecaoFinanceira)
      toast.success('Projeção de custo de mão de obra criada no financeiro')

    } catch (error) {
      console.error('Erro ao criar projeção de custo:', error)
      toast.error('Erro ao criar projeção de custo no financeiro')
    }
  }

  // TAREFA 4: Criar projeção de recebimento no financeiro com medição
  const criarProjecaoRecebimentoMedicao = async (diarioData: DiarioObra) => {
    try {
      if (!diarioData.medicao || safeNumber(diarioData.medicao.valorMedicao) <= 0) return

      const projecaoFinanceira = {
        tipo: 'provisao_receita',
        categoria: 'Medição de Obra',
        descricao: `Projeção de recebimento - Medição do diário ${diarioData.tipo} de ${formatDate(diarioData.data)}`,
        valor: safeNumber(diarioData.medicao.valorMedicao),
        planejamentoId: diarioData.planejamentoId,
        diarioOrigemId: diarioData._id,
        status: 'pendente',
        dataVencimento: diarioData.data,
        observacoes: `Gerado automaticamente do diário de obra. Percentual concluído: ${safeNumber(diarioData.medicao.percentualConcluido)}%. ${diarioData.medicao.observacoes || ''}`,
        criadoEm: new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      }

      await lumi.entities.financeiro.create(projecaoFinanceira)
      toast.success('Projeção de recebimento de medição criada no financeiro')

    } catch (error) {
      console.error('Erro ao criar projeção de recebimento:', error)
      toast.error('Erro ao criar projeção de recebimento no financeiro')
    }
  }

  // NOVA FUNCIONALIDADE: Atualizar atividade de etapa/subetapa da proposta
  const updateAtividadeEtapaSubetapa = (id: string, field: string, value: any) => {
    setTempAtividadesEtapaSubetapa(prev => 
      prev.map(atividade => 
        atividade.id === id 
          ? { ...atividade, [field]: value }
          : atividade
      )
    )

    // Recalcular valor da medição quando houver mudanças
    setTimeout(() => calcularValorMedicaoAutomatico(), 100)
  }

  // Criar/Editar diário
  const saveDiario = async () => {
    if (!diarioForm.planejamentoId || !diarioForm.responsavel) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    try {
      const diarioData: Omit<DiarioObra, '_id'> = {
        planejamentoId: diarioForm.planejamentoId,
        tipo: diarioForm.tipo,
        data: diarioForm.data,
        responsavel: diarioForm.responsavel,
        local: diarioForm.local,
        clima: diarioForm.clima,
        climaSemanal: diarioForm.tipo === 'semanal' ? diarioForm.climaSemanal : undefined,
        maoDeObra: tempMaoObra,
        equipamentos: tempEquipamentos,
        atividades: tempAtividades,
        atividadesPlanejamento: tempAtividadesPlanejamento,
        atividadesPlanejamentoSemanal: tempAtividadesPlanejamentoSemanal,
        fotos: tempFotos,
        naoConformidades: tempNaoConformidades,
        checklistSeguranca: checklistForm,
        documentos: tempDocumentos,
        medicao: diarioForm.medicao,
        // NOVA FUNCIONALIDADE: Incluir atividades de etapas/subetapas da proposta
        atividadesEtapaSubetapa: tempAtividadesEtapaSubetapa,
        criadoEm: editingDiario?.criadoEm || new Date().toISOString(),
        atualizadoEm: new Date().toISOString()
      }

      let savedDiario: DiarioObra

      if (editingDiario) {
        await lumi.entities.diarios.update(editingDiario._id, diarioData)
        savedDiario = { ...diarioData, _id: editingDiario._id } as DiarioObra
        toast.success('Diário atualizado com sucesso')
      } else {
        const result = await lumi.entities.diarios.create(diarioData)
        savedDiario = result as DiarioObra
        toast.success('Diário criado com sucesso')
      }

      // TAREFA 5 e 4: Criar projeções financeiras
      await criarProjecaoCustoMaoObra(savedDiario)
      await criarProjecaoRecebimentoMedicao(savedDiario)

      await fetchDiarios()
      closeDiarioModal()
    } catch (error) {
      console.error('Erro ao salvar diário:', error)
      toast.error('Erro ao salvar diário')
    }
  }

  // Deletar diário
  const deleteDiario = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este diário?')) return

    try {
      await lumi.entities.diarios.delete(id)
      toast.success('Diário excluído com sucesso')
      await fetchDiarios()
    } catch (error) {
      console.error('Erro ao excluir diário:', error)
      toast.error('Erro ao excluir diário')
    }
  }

  // Adicionar mão de obra
  const addMaoObra = () => {
    if (!maoObraForm.funcionarioId) return

    const funcionario = funcionarios.find(f => f._id === maoObraForm.funcionarioId)
    if (!funcionario) return

    const valorTotal = maoObraForm.horasTrabalhadas * safeNumber(funcionario.valorHora)

    const novaMaoObra: MaoDeObraItem = {
      funcionarioId: funcionario._id,
      nome: funcionario.nome,
      funcao: funcionario.funcao, // TAREFA 2: Incluir função do funcionário
      horasTrabalhadas: maoObraForm.horasTrabalhadas,
      valorHora: safeNumber(funcionario.valorHora),
      valorTotal: valorTotal
    }

    setTempMaoObra([...tempMaoObra, novaMaoObra])
    setMaoObraForm({ funcionarioId: '', horasTrabalhadas: 8 })
  }

  // Adicionar equipamento
  const addEquipamento = () => {
    if (!equipamentoForm.nome) return

    const novoEquipamento: EquipamentoItem = {
      nome: equipamentoForm.nome,
      horasUso: equipamentoForm.horasUso,
      observacoes: equipamentoForm.observacoes
    }

    setTempEquipamentos([...tempEquipamentos, novoEquipamento])
    setEquipamentoForm({ nome: '', horasUso: 8, observacoes: '' })
  }

  // Adicionar atividade
  const addAtividade = () => {
    if (!atividadeForm.descricao || !atividadeForm.responsavel) return

    const novaAtividade: AtividadeItem = {
      descricao: atividadeForm.descricao,
      responsavel: atividadeForm.responsavel,
      progresso: atividadeForm.progresso
    }

    setTempAtividades([...tempAtividades, novaAtividade])
    setAtividadeForm({ descricao: '', responsavel: '', progresso: 0 })

    // Recalcular valor da medição quando atividade for adicionada
    setTimeout(() => calcularValorMedicaoAutomatico(), 100)
  }

  // Adicionar não conformidade
  const addNaoConformidade = () => {
    if (!naoConformidadeForm.descricao) return

    const novaNaoConformidade: NaoConformidadeItem = {
      tipo: naoConformidadeForm.tipo,
      descricao: naoConformidadeForm.descricao,
      gravidade: naoConformidadeForm.gravidade,
      acaoCorretiva: naoConformidadeForm.acaoCorretiva
    }

    setTempNaoConformidades([...tempNaoConformidades, novaNaoConformidade])
    setNaoConformidadeForm({
      tipo: 'ocorrencia',
      descricao: '',
      gravidade: 'media',
      acaoCorretiva: ''
    })
  }

  // TAREFA 3: Corrigir seleção de fotos
  const handleFotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file, index) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const novaFoto: FotoItem = {
            id: `foto_${Date.now()}_${index}`,
            url: e.target?.result as string,
            descricao: `Foto da obra - ${file.name}`,
            timestamp: new Date().toISOString(),
            arquivo: file
          }
          setTempFotos(prev => [...prev, novaFoto])
        }
        reader.readAsDataURL(file)
      } else {
        toast.error(`Arquivo ${file.name} não é uma imagem válida`)
      }
    })

    // Limpar o input
    event.target.value = ''
  }

  // TAREFA 4: Corrigir anexo de documentos
  const handleDocumentoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach((file, index) => {
      const novoDocumento: DocumentoItem = {
        id: `doc_${Date.now()}_${index}`,
        nome: file.name,
        url: URL.createObjectURL(file),
        tipo: file.type || 'application/octet-stream',
        arquivo: file
      }
      setTempDocumentos(prev => [...prev, novoDocumento])
    })

    // Limpar o input
    event.target.value = ''
  }

  // TAREFA 5: Gerar PDF com campo de assinatura - CORRIGIDO
  const generatePDFWithSignature = (diario: DiarioObra) => {
    try {
      toast.loading('Gerando PDF com campos de assinatura...', { id: 'pdf-signature' })

      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.width
      const pageHeight = doc.internal.pageSize.height
      const margin = 20
      let yPosition = margin

      // Cabeçalho
      doc.setFontSize(18)
      doc.setFont('helvetica', 'bold')
      doc.text('DIÁRIO DE OBRA', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 20

      // Informações básicas
      doc.setFontSize(12)
      doc.setFont('helvetica', 'normal')
      
      const planejamento = planejamentos.find(p => p._id === diario.planejamentoId)
      const infoBasica = [
        `Obra: ${planejamento?.nomeProjeto || 'N/A'}`,
        `Cliente: ${planejamento?.cliente || 'N/A'}`,
        `Data: ${formatDate(diario.data)}`,
        `Tipo: ${tipoLabels[diario.tipo]}`,
        `Responsável: ${diario.responsavel}`,
        `Local: ${diario.local || 'N/A'}`
      ]

      infoBasica.forEach(info => {
        doc.text(info, margin, yPosition)
        yPosition += 8
      })

      yPosition += 10

      // Clima
      doc.setFont('helvetica', 'bold')
      doc.text('CONDIÇÕES CLIMÁTICAS:', margin, yPosition)
      yPosition += 10
      doc.setFont('helvetica', 'normal')

      if (diario.tipo === 'semanal' && diario.climaSemanal) {
        Object.entries(diario.climaSemanal).forEach(([dia, clima]) => {
          const climaInfo = climaOptions[clima]
          doc.text(`${diasSemana[dia as keyof typeof diasSemana]}: ${climaInfo.emoji} ${climaInfo.label}`, margin, yPosition)
          yPosition += 6
        })
      } else {
        const periodos = ['manha', 'tarde', 'noite'] as const
        periodos.forEach(periodo => {
          const clima = diario.clima?.[periodo] || 'sol'
          const climaInfo = climaOptions[clima]
          doc.text(`${periodo.charAt(0).toUpperCase() + periodo.slice(1)}: ${climaInfo.emoji} ${climaInfo.label}`, margin, yPosition)
          yPosition += 6
        })
      }

      yPosition += 10

      // Mão de obra
      if (diario.maoDeObra && diario.maoDeObra.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.text('MÃO DE OBRA:', margin, yPosition)
        yPosition += 10
        doc.setFont('helvetica', 'normal')

        diario.maoDeObra.forEach(mao => {
          // TAREFA 2: Exibir função do funcionário no PDF
          doc.text(`• ${mao.nome} (${mao.funcao}) - ${mao.horasTrabalhadas}h - ${formatCurrency(mao.valorTotal)}`, margin, yPosition)
          yPosition += 6
        })
        yPosition += 10
      }

      // Atividades realizadas
      const todasAtividades = [
        ...(diario.atividades || []),
        ...(diario.atividadesPlanejamento || []),
        ...(diario.atividadesPlanejamentoSemanal || []),
        // NOVA FUNCIONALIDADE: Incluir atividades de etapas/subetapas da proposta realizadas
        ...(diario.atividadesEtapaSubetapa?.filter(a => a.realizada) || [])
      ]

      if (todasAtividades.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.text('ATIVIDADES REALIZADAS:', margin, yPosition)
        yPosition += 10
        doc.setFont('helvetica', 'normal')

        todasAtividades.forEach(atividade => {
          let nomeAtividade = ''
          let responsavel = ''
          let progresso = 0

          if ('descricao' in atividade) {
            nomeAtividade = atividade.descricao
            responsavel = atividade.responsavel
            progresso = safeNumber(atividade.progresso)
          } else if ('nome' in atividade) {
            nomeAtividade = atividade.nome
            responsavel = atividade.responsavel
            progresso = safeNumber(atividade.progresso)
          }

          doc.text(`• ${nomeAtividade} - ${responsavel} (${progresso}%)`, margin, yPosition)
          yPosition += 6
        })
        yPosition += 10
      }

      // Medição
      if (diario.medicao) {
        doc.setFont('helvetica', 'bold')
        doc.text('MEDIÇÃO:', margin, yPosition)
        yPosition += 10
        doc.setFont('helvetica', 'normal')

        doc.text(`Percentual Concluído: ${safeNumber(diario.medicao.percentualConcluido)}%`, margin, yPosition)
        yPosition += 6
        doc.text(`Valor da Medição: ${formatCurrency(diario.medicao.valorMedicao)}`, margin, yPosition)
        yPosition += 6
        
        if (diario.medicao.observacoes) {
          doc.text(`Observações: ${diario.medicao.observacoes}`, margin, yPosition)
          yPosition += 6
        }
        yPosition += 15
      }

      // Verificar se precisa de nova página para assinaturas
      if (yPosition > pageHeight - 100) {
        doc.addPage()
        yPosition = margin
      }

      // Campos de assinatura
      doc.setFont('helvetica', 'bold')
      doc.text('ASSINATURAS:', margin, yPosition)
      yPosition += 20

      // Campo de assinatura do gestor
      doc.setFont('helvetica', 'normal')
      doc.text('GESTOR DA OBRA:', margin, yPosition)
      yPosition += 10
      
      // Linha para assinatura do gestor
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 10
      doc.text('Nome: ___________________________________', margin, yPosition)
      yPosition += 10
      doc.text('Data: ___/___/______', margin, yPosition)
      yPosition += 20

      // Campo de assinatura do cliente
      doc.text('CLIENTE/RESPONSÁVEL:', margin, yPosition)
      yPosition += 10
      
      // Linha para assinatura do cliente
      doc.line(margin, yPosition, pageWidth - margin, yPosition)
      yPosition += 10
      doc.text('Nome: ___________________________________', margin, yPosition)
      yPosition += 10
      doc.text('Data: ___/___/______', margin, yPosition)

      // Rodapé
      doc.setFontSize(10)
      doc.setFont('helvetica', 'italic')
      doc.text(`Documento gerado em: ${formatDateTime(new Date().toISOString())}`, margin, pageHeight - 20)

      // Download do PDF
      const fileName = `diario_obra_${diario.tipo}_${new Date(diario.data).toISOString().split('T')[0]}.pdf`
      doc.save(fileName)

      toast.success('PDF com campos de assinatura gerado com sucesso!', { id: 'pdf-signature' })

    } catch (error) {
      console.error('Erro ao gerar PDF:', error)
      toast.error('Erro ao gerar PDF', { id: 'pdf-signature' })
    }
  }

  // Exportar PDF
  const exportPDF = (diario: DiarioObra) => {
    generatePDFWithSignature(diario)
  }

  // Abrir modal de diário
  const openDiarioModal = (diario?: DiarioObra) => {
    if (diario) {
      setEditingDiario(diario)
      setDiarioForm({
        planejamentoId: diario.planejamentoId,
        tipo: diario.tipo,
        data: diario.data?.split('T')[0] || '',
        responsavel: diario.responsavel,
        local: diario.local,
        clima: diario.clima,
        climaSemanal: diario.climaSemanal || {
          segunda: 'sol',
          terca: 'sol',
          quarta: 'sol',
          quinta: 'sol',
          sexta: 'sol'
        },
        medicao: diario.medicao
      })
      setTempMaoObra(diario.maoDeObra || [])
      setTempEquipamentos(diario.equipamentos || [])
      setTempAtividades(diario.atividades || [])
      setTempAtividadesPlanejamento(diario.atividadesPlanejamento || [])
      setTempAtividadesPlanejamentoSemanal(diario.atividadesPlanejamentoSemanal || [])
      setTempFotos(diario.fotos || [])
      setTempNaoConformidades(diario.naoConformidades || [])
      setTempDocumentos(diario.documentos || [])
      // NOVA FUNCIONALIDADE: Carregar atividades de etapas/subetapas da proposta
      setTempAtividadesEtapaSubetapa(diario.atividadesEtapaSubetapa || [])
      setChecklistForm(diario.checklistSeguranca || {
        epiUtilizado: false,
        areaIsolada: false,
        equipamentosFuncionando: false,
        observacoes: ''
      })
    } else {
      setEditingDiario(null)
      setDiarioForm({
        planejamentoId: selectedPlanejamento,
        tipo: 'diario',
        data: new Date().toISOString().split('T')[0],
        responsavel: '',
        local: '',
        clima: {
          manha: 'sol',
          tarde: 'sol',
          noite: 'sol'
        },
        climaSemanal: {
          segunda: 'sol',
          terca: 'sol',
          quarta: 'sol',
          quinta: 'sol',
          sexta: 'sol'
        },
        medicao: {
          percentualConcluido: 0,
          valorMedicao: 0,
          observacoes: ''
        }
      })
      setTempMaoObra([])
      setTempEquipamentos([])
      setTempAtividades([])
      setTempAtividadesPlanejamento([])
      setTempAtividadesPlanejamentoSemanal([])
      setTempFotos([])
      setTempNaoConformidades([])
      setTempDocumentos([])
      setTempAtividadesEtapaSubetapa([]) // NOVA FUNCIONALIDADE
      setChecklistForm({
        epiUtilizado: false,
        areaIsolada: false,
        equipamentosFuncionando: false,
        observacoes: ''
      })

      // Carregar atividades do planejamento e da proposta
      loadAtividadesPlanejamento()
      loadAtividadesEtapaSubetapaProposta() // NOVA FUNCIONALIDADE
    }
    setShowDiarioModal(true)
  }

  const closeDiarioModal = () => {
    setShowDiarioModal(false)
    setEditingDiario(null)
  }

  const openViewModal = (diario: DiarioObra) => {
    setSelectedDiario(diario)
    setShowViewModal(true)
  }

  const openResumoModal = () => {
    setShowResumoModal(true)
  }

  // Filtros
  const diariosFiltrados = diarios.filter(diario => {
    const matchSearch = searchTerm === '' || 
      diario.responsavel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      diario.local?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchTipo = tipoFilter === '' || diario.tipo === tipoFilter
    
    return matchSearch && matchTipo
  })

  // Estatísticas
  const estatisticas = {
    totalDiarios: diariosFiltrados.length,
    diariosDiarios: diariosFiltrados.filter(d => d.tipo === 'diario').length,
    diariosSemanais: diariosFiltrados.filter(d => d.tipo === 'semanal').length,
    progressoMedio: diariosFiltrados.length > 0 ? 
      Math.round(diariosFiltrados.reduce((sum, d) => sum + safeNumber(d.medicao?.percentualConcluido), 0) / diariosFiltrados.length) : 0
  }

  // Formatação de data
  const formatWeekRange = (weekStart: string): string => {
    const start = new Date(weekStart)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)
    
    return `${formatDate(start.toISOString())} - ${formatDate(end.toISOString())}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Diário de Obra</h1>
          <p className="text-gray-600">Registre atividades diárias e semanais da obra</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={openResumoModal}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Resumo</span>
          </button>
          <button
            onClick={() => openDiarioModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Diário</span>
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Diários</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.totalDiarios}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Diários</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.diariosDiarios}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Semanais</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.diariosSemanais}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progresso Médio</p>
              <p className="text-2xl font-bold text-gray-900">{estatisticas.progressoMedio}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Projeto</label>
            <select
              value={selectedPlanejamento}
              onChange={(e) => setSelectedPlanejamento(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecione um projeto</option>
              {planejamentos.map(projeto => (
                <option key={projeto._id} value={projeto._id}>
                  {projeto.nomeProjeto} - {projeto.cliente}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Buscar</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por responsável ou local..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="diario">Diário</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Diários */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Diários de Obra</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Responsável
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Clima
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progresso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Medição
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {diariosFiltrados.map((diario) => {
                const ClimaIcon = climaIcons[diario.clima?.manha || 'sol']
                const climaInfo = climaOptions[diario.clima?.manha || 'sol']
                
                return (
                  <tr key={diario._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatDate(diario.data)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tipoLabels[diario.tipo]}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{diario.responsavel}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                        <div className="text-sm text-gray-900">{diario.local || '-'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-1">
                        <ClimaIcon className="h-4 w-4 text-gray-600" />
                        <span className="text-sm text-gray-600">
                          {climaInfo.emoji} {climaInfo.label}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${safeNumber(diario.medicao?.percentualConcluido)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{safeNumber(diario.medicao?.percentualConcluido)}%</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(diario.medicao?.valorMedicao)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openViewModal(diario)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Visualizar"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDiarioModal(diario)}
                          className="text-green-600 hover:text-green-900"
                          title="Editar"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => exportPDF(diario)}
                          className="text-purple-600 hover:text-purple-900"
                          title="Exportar PDF com Assinatura"
                        >
                          <PenTool className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteDiario(diario._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Resumo */}
      {showResumoModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Resumo das Obras</h3>
                <button
                  onClick={() => setShowResumoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Atividades da Semana */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Atividades da Semana</h4>
                  <div className="flex items-center justify-between mb-2">
                    <button
                      onClick={() => navigateWeek('prev')}
                      className="p-1 text-gray-600 hover:text-gray-900"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="text-center">
                      <div className="font-medium text-gray-900">{formatWeekRange(currentWeek)}</div>
                    </div>
                    <button
                      onClick={() => navigateWeek('next')}
                      className="p-1 text-gray-600 hover:text-gray-900"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {diarios
                      .filter(d => {
                        const diarioDate = new Date(d.data)
                        const weekStart = new Date(currentWeek)
                        const weekEnd = new Date(weekStart)
                        weekEnd.setDate(weekStart.getDate() + 6)
                        return diarioDate >= weekStart && diarioDate <= weekEnd
                      })
                      .slice(0, 5)
                      .map(diario => (
                        <div key={diario._id} className="text-sm">
                          <span className="font-medium">{formatDate(diario.data)}</span>
                          <span className="text-gray-600"> - {diario.responsavel}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Avanço Geral */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Avanço Geral</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm">
                        <span>Progresso Médio</span>
                        <span>{estatisticas.progressoMedio}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${estatisticas.progressoMedio}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Diários:</span>
                        <span className="font-medium ml-2">{estatisticas.diariosDiarios}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Semanais:</span>
                        <span className="font-medium ml-2">{estatisticas.diariosSemanais}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Visualização */}
      {showViewModal && selectedDiario && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Diário de Obra - {formatDate(selectedDiario.data)}
                </h3>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações Básicas */}
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Informações Gerais</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Responsável:</strong> {selectedDiario.responsavel}</div>
                      <div><strong>Local:</strong> {selectedDiario.local}</div>
                      <div><strong>Tipo:</strong> {tipoLabels[selectedDiario.tipo]}</div>
                      <div><strong>Progresso:</strong> {safeNumber(selectedDiario.medicao?.percentualConcluido)}%</div>
                      <div><strong>Valor Medição:</strong> {formatCurrency(selectedDiario.medicao?.valorMedicao)}</div>
                    </div>
                  </div>

                  {/* Clima */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Clima</h4>
                    {selectedDiario.tipo === 'semanal' && selectedDiario.climaSemanal ? (
                      <div className="grid grid-cols-1 gap-2 text-sm">
                        {Object.entries(selectedDiario.climaSemanal).map(([dia, clima]) => {
                          const ClimaIcon = climaIcons[clima]
                          const climaInfo = climaOptions[clima]
                          return (
                            <div key={dia} className="flex items-center justify-between">
                              <span className="capitalize">{diasSemana[dia as keyof typeof diasSemana]}</span>
                              <div className="flex items-center">
                                <ClimaIcon className="h-4 w-4 text-gray-600 mr-1" />
                                <span>{climaInfo.emoji} {climaInfo.label}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {['manha', 'tarde', 'noite'].map(periodo => {
                          const clima = selectedDiario.clima?.[periodo as keyof typeof selectedDiario.clima] || 'sol'
                          const ClimaIcon = climaIcons[clima]
                          const climaInfo = climaOptions[clima]
                          return (
                            <div key={periodo} className="text-center">
                              <div className="capitalize font-medium">{periodo}</div>
                              <div className="flex items-center justify-center mt-1">
                                <ClimaIcon className="h-5 w-5 text-gray-600" />
                                <span className="ml-1">{climaInfo.emoji} {climaInfo.label}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Checklist de Segurança */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Checklist de Segurança</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        {selectedDiario.checklistSeguranca?.epiUtilizado ? 
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" /> :
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        }
                        <span>EPI utilizado</span>
                      </div>
                      <div className="flex items-center">
                        {selectedDiario.checklistSeguranca?.areaIsolada ? 
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" /> :
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        }
                        <span>Área isolada</span>
                      </div>
                      <div className="flex items-center">
                        {selectedDiario.checklistSeguranca?.equipamentosFuncionando ? 
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2" /> :
                          <XCircle className="h-4 w-4 text-red-600 mr-2" />
                        }
                        <span>Equipamentos funcionando</span>
                      </div>
                      {selectedDiario.checklistSeguranca?.observacoes && (
                        <div className="mt-2">
                          <strong>Observações:</strong> {selectedDiario.checklistSeguranca.observacoes}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Listas */}
                <div className="space-y-4">
                  {/* Mão de Obra */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Mão de Obra</h4>
                    <div className="space-y-2">
                      {(selectedDiario.maoDeObra || []).map((item, index) => (
                        <div key={index} className="text-sm">
                          <strong>{item.nome}</strong> - {item.funcao} ({item.horasTrabalhadas}h)
                          <div className="text-gray-600">
                            {formatCurrency(item.valorHora)}/h = {formatCurrency(item.valorTotal)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Equipamentos */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Equipamentos</h4>
                    <div className="space-y-2">
                      {(selectedDiario.equipamentos || []).map((item, index) => (
                        <div key={index} className="text-sm">
                          <strong>{item.nome}</strong> - {item.horasUso}h
                          {item.observacoes && <div className="text-gray-600">{item.observacoes}</div>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Todas as Atividades */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Atividades Realizadas</h4>
                    <div className="space-y-3">
                      {/* Atividades manuais */}
                      {(selectedDiario.atividades || []).length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Atividades Manuais:</h5>
                          {selectedDiario.atividades.map((item, index) => (
                            <div key={index} className="text-sm pl-4 border-l-2 border-blue-300">
                              <strong>{item.descricao}</strong> - {item.responsavel} ({safeNumber(item.progresso)}%)
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Atividades do Planejamento */}
                      {(selectedDiario.atividadesPlanejamento || []).length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Do Planejamento:</h5>
                          {selectedDiario.atividadesPlanejamento.map((item, index) => (
                            <div key={index} className="text-sm pl-4 border-l-2 border-green-300">
                              <strong>{item.nome}</strong> - {item.responsavel} ({safeNumber(item.progresso)}%)
                              <div className="text-gray-600">
                                {item.etapa}{item.subetapa ? ` > ${item.subetapa}` : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Atividades do Planejamento Semanal */}
                      {(selectedDiario.atividadesPlanejamentoSemanal || []).length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Do Planejamento Semanal:</h5>
                          {selectedDiario.atividadesPlanejamentoSemanal.map((item, index) => (
                            <div key={index} className="text-sm pl-4 border-l-2 border-purple-300">
                              <strong>{item.nome}</strong> - {item.responsavel} ({safeNumber(item.progresso)}%)
                            </div>
                          ))}
                        </div>
                      )}

                      {/* NOVA FUNCIONALIDADE: Atividades de Etapas/Subetapas da Proposta */}
                      {(selectedDiario.atividadesEtapaSubetapa?.filter(a => a.realizada) || []).length > 0 && (
                        <div>
                          <h5 className="font-medium text-sm text-gray-700 mb-2">Da Proposta (Etapas/Subetapas):</h5>
                          {selectedDiario.atividadesEtapaSubetapa.filter(a => a.realizada).map((item, index) => (
                            <div key={index} className="text-sm pl-4 border-l-2 border-orange-300">
                              <strong>{item.nome}</strong> - {item.responsavel} ({safeNumber(item.progresso)}%)
                              <div className="text-gray-600">
                                {item.tipo === 'etapa' ? 'Etapa' : 'Subetapa'} da Proposta
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Não Conformidades */}
                  {(selectedDiario.naoConformidades || []).length > 0 && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Não Conformidades</h4>
                      <div className="space-y-2">
                        {selectedDiario.naoConformidades.map((item, index) => (
                          <div key={index} className="text-sm">
                            <div className="flex items-center mb-1">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${gravidadeColors[item.gravidade]}`}>
                                {gravidadeLabels[item.gravidade]}
                              </span>
                              <span className="ml-2 font-medium">{tipoNaoConformidadeLabels[item.tipo]}</span>
                            </div>
                            <div>{item.descricao}</div>
                            {item.acaoCorretiva && (
                              <div className="text-gray-600 mt-1">
                                <strong>Ação Corretiva:</strong> {item.acaoCorretiva}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Fotos */}
                  {(selectedDiario.fotos || []).length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Fotos ({selectedDiario.fotos.length})</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedDiario.fotos.slice(0, 4).map((foto, index) => (
                          <div key={foto.id} className="relative">
                            <img 
                              src={foto.url} 
                              alt={foto.descricao}
                              className="w-full h-20 object-cover rounded"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b">
                              {foto.descricao}
                            </div>
                          </div>
                        ))}
                      </div>
                      {selectedDiario.fotos.length > 4 && (
                        <div className="text-sm text-gray-500 mt-2">
                          +{selectedDiario.fotos.length - 4} fotos adicionais
                        </div>
                      )}
                    </div>
                  )}

                  {/* Documentos */}
                  {(selectedDiario.documentos || []).length > 0 && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-3">Documentos ({selectedDiario.documentos.length})</h4>
                      <div className="space-y-2">
                        {selectedDiario.documentos.map((doc, index) => (
                          <div key={doc.id} className="flex items-center text-sm">
                            <File className="h-4 w-4 text-gray-500 mr-2" />
                            <span>{doc.nome}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Diário */}
      {showDiarioModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-7xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingDiario ? 'Editar Diário de Obra' : 'Novo Diário de Obra'}
                </h3>
                <button
                  onClick={closeDiarioModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Coluna 1: Informações Básicas */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Projeto</label>
                      <select
                        value={diarioForm.planejamentoId}
                        onChange={(e) => setDiarioForm({ ...diarioForm, planejamentoId: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="">Selecione um projeto</option>
                        {planejamentos.map(projeto => (
                          <option key={projeto._id} value={projeto._id}>
                            {projeto.nomeProjeto}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tipo</label>
                      <select
                        value={diarioForm.tipo}
                        onChange={(e) => setDiarioForm({ ...diarioForm, tipo: e.target.value as any })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="diario">Diário</option>
                        <option value="semanal">Semanal</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Data</label>
                      <input
                        type="date"
                        value={diarioForm.data}
                        onChange={(e) => setDiarioForm({ ...diarioForm, data: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Responsável</label>
                      <input
                        type="text"
                        value={diarioForm.responsavel}
                        onChange={(e) => setDiarioForm({ ...diarioForm, responsavel: e.target.value })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Nome do responsável"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Local</label>
                    <input
                      type="text"
                      value={diarioForm.local}
                      onChange={(e) => setDiarioForm({ ...diarioForm, local: e.target.value })}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Local da obra"
                    />
                  </div>

                  {/* TAREFA 1: Clima com emoticons */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Clima</label>
                    {diarioForm.tipo === 'semanal' ? (
                      <div className="space-y-3">
                        {Object.entries(diasSemana).map(([dia, label]) => (
                          <div key={dia} className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-600">{label}</label>
                            <select
                              value={diarioForm.climaSemanal[dia as keyof typeof diarioForm.climaSemanal]}
                              onChange={(e) => setDiarioForm({
                                ...diarioForm,
                                climaSemanal: {
                                  ...diarioForm.climaSemanal,
                                  [dia]: e.target.value as any
                                }
                              })}
                              className="border border-gray-300 rounded-md px-3 py-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {Object.entries(climaOptions).map(([value, option]) => (
                                <option key={value} value={value}>
                                  {option.emoji} {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-4">
                        {['manha', 'tarde', 'noite'].map(periodo => (
                          <div key={periodo}>
                            <label className="block text-xs font-medium text-gray-600 capitalize">{periodo}</label>
                            <select
                              value={diarioForm.clima[periodo as keyof typeof diarioForm.clima]}
                              onChange={(e) => setDiarioForm({
                                ...diarioForm,
                                clima: {
                                  ...diarioForm.clima,
                                  [periodo]: e.target.value as any
                                }
                              })}
                              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              {Object.entries(climaOptions).map(([value, option]) => (
                                <option key={value} value={value}>
                                  {option.emoji} {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NOVA FUNCIONALIDADE: Medição com cálculo automático baseado na Proposta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medição (Calculada Automaticamente)</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600">% Concluído</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={diarioForm.medicao.percentualConcluido}
                          onChange={(e) => setDiarioForm({
                            ...diarioForm,
                            medicao: {
                              ...diarioForm.medicao,
                              percentualConcluido: Number(e.target.value)
                            }
                          })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                          readOnly
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600">Valor Medição</label>
                        <input
                          type="text"
                          value={formatCurrency(diarioForm.medicao.valorMedicao)}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-600">Observações</label>
                      <textarea
                        value={diarioForm.medicao.observacoes}
                        onChange={(e) => setDiarioForm({
                          ...diarioForm,
                          medicao: {
                            ...diarioForm.medicao,
                            observacoes: e.target.value
                          }
                        })}
                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        rows={2}
                        placeholder="Observações da medição"
                      />
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      * Valor calculado automaticamente baseado no progresso das atividades e valor da proposta
                    </div>
                  </div>

                  {/* Checklist de Segurança */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Checklist de Segurança</label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checklistForm.epiUtilizado}
                          onChange={(e) => setChecklistForm({ ...checklistForm, epiUtilizado: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm">EPI utilizado</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checklistForm.areaIsolada}
                          onChange={(e) => setChecklistForm({ ...checklistForm, areaIsolada: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm">Área isolada</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={checklistForm.equipamentosFuncionando}
                          onChange={(e) => setChecklistForm({ ...checklistForm, equipamentosFuncionando: e.target.checked })}
                          className="mr-2"
                        />
                        <span className="text-sm">Equipamentos funcionando</span>
                      </label>
                      <div>
                        <textarea
                          value={checklistForm.observacoes}
                          onChange={(e) => setChecklistForm({ ...checklistForm, observacoes: e.target.value })}
                          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                          placeholder="Observações de segurança"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 2: Recursos e Atividades */}
                <div className="space-y-4">
                  {/* Mão de Obra */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mão de Obra</label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <select
                          value={maoObraForm.funcionarioId}
                          onChange={(e) => setMaoObraForm({ ...maoObraForm, funcionarioId: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="">Selecione funcionário</option>
                          {funcionarios.map(funcionario => (
                            <option key={funcionario._id} value={funcionario._id}>
                              {funcionario.nome} - {funcionario.funcao}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          value={maoObraForm.horasTrabalhadas}
                          onChange={(e) => setMaoObraForm({ ...maoObraForm, horasTrabalhadas: Number(e.target.value) })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Horas trabalhadas"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addMaoObra}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Adicionar
                      </button>
                      <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                        {tempMaoObra.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                            {/* TAREFA 2: Exibir função do funcionário */}
                            <span>{item.nome} - {item.funcao} ({item.horasTrabalhadas}h) - {formatCurrency(item.valorTotal)}</span>
                            <button
                              onClick={() => setTempMaoObra(tempMaoObra.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Equipamentos */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Equipamentos</label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="space-y-2 mb-3">
                        <input
                          type="text"
                          value={equipamentoForm.nome}
                          onChange={(e) => setEquipamentoForm({ ...equipamentoForm, nome: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nome do equipamento"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="number"
                            value={equipamentoForm.horasUso}
                            onChange={(e) => setEquipamentoForm({ ...equipamentoForm, horasUso: Number(e.target.value) })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Horas de uso"
                          />
                          <input
                            type="text"
                            value={equipamentoForm.observacoes}
                            onChange={(e) => setEquipamentoForm({ ...equipamentoForm, observacoes: e.target.value })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Observações"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addEquipamento}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Adicionar
                      </button>
                      <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                        {tempEquipamentos.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                            <span>{item.nome} - {item.horasUso}h {item.observacoes && `(${item.observacoes})`}</span>
                            <button
                              onClick={() => setTempEquipamentos(tempEquipamentos.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Atividades Manuais */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Atividades Manuais</label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="space-y-2 mb-3">
                        <input
                          type="text"
                          value={atividadeForm.descricao}
                          onChange={(e) => setAtividadeForm({ ...atividadeForm, descricao: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Descrição da atividade"
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <input
                            type="text"
                            value={atividadeForm.responsavel}
                            onChange={(e) => setAtividadeForm({ ...atividadeForm, responsavel: e.target.value })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Responsável"
                          />
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={atividadeForm.progresso}
                            onChange={(e) => setAtividadeForm({ ...atividadeForm, progresso: Number(e.target.value) })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Progresso %"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={addAtividade}
                        className="bg-purple-600 text-white px-3 py-1 rounded text-sm hover:bg-purple-700"
                      >
                        Adicionar
                      </button>
                      <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                        {tempAtividades.map((item, index) => (
                          <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded text-sm">
                            <span>{item.descricao} - {item.responsavel} ({item.progresso}%)</span>
                            <button
                              onClick={() => setTempAtividades(tempAtividades.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Não Conformidades */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Não Conformidades</label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="space-y-2 mb-3">
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            value={naoConformidadeForm.tipo}
                            onChange={(e) => setNaoConformidadeForm({ ...naoConformidadeForm, tipo: e.target.value as any })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="ocorrencia">Ocorrência</option>
                            <option value="acidente">Acidente</option>
                            <option value="inspecao">Inspeção</option>
                          </select>
                          <select
                            value={naoConformidadeForm.gravidade}
                            onChange={(e) => setNaoConformidadeForm({ ...naoConformidadeForm, gravidade: e.target.value as any })}
                            className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                          </select>
                        </div>
                        <textarea
                          value={naoConformidadeForm.descricao}
                          onChange={(e) => setNaoConformidadeForm({ ...naoConformidadeForm, descricao: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                          placeholder="Descrição da não conformidade"
                        />
                        <textarea
                          value={naoConformidadeForm.acaoCorretiva}
                          onChange={(e) => setNaoConformidadeForm({ ...naoConformidadeForm, acaoCorretiva: e.target.value })}
                          className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                          rows={2}
                          placeholder="Ação corretiva"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addNaoConformidade}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Adicionar
                      </button>
                      <div className="mt-3 space-y-1 max-h-32 overflow-y-auto">
                        {tempNaoConformidades.map((item, index) => (
                          <div key={index} className="flex justify-between items-start bg-red-50 p-2 rounded text-sm">
                            <div>
                              <div className="font-medium">{tipoNaoConformidadeLabels[item.tipo]} - {gravidadeLabels[item.gravidade]}</div>
                              <div>{item.descricao}</div>
                              {item.acaoCorretiva && <div className="text-gray-600">Ação: {item.acaoCorretiva}</div>}
                            </div>
                            <button
                              onClick={() => setTempNaoConformidades(tempNaoConformidades.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coluna 3: Atividades do Planejamento e da Proposta + Anexos */}
                <div className="space-y-4">
                  {/* TAREFA 1: Atividades do Planejamento */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atividades do Planejamento ({tempAtividadesPlanejamento.length})
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                      {tempAtividadesPlanejamento.length > 0 ? (
                        <div className="space-y-2">
                          {tempAtividadesPlanejamento.map((atividade, index) => (
                            <div key={atividade.id} className="bg-green-50 p-2 rounded text-sm">
                              <div className="font-medium">{atividade.nome}</div>
                              <div className="text-gray-600">
                                {atividade.etapa}{atividade.subetapa ? ` > ${atividade.subetapa}` : ''}
                              </div>
                              <div className="text-gray-600">
                                {atividade.responsavel} - {atividade.progresso}% ({atividade.status})
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm text-center py-4">
                          Nenhuma atividade encontrada no planejamento
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TAREFA 1: Atividades do Planejamento Semanal */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Atividades do Planejamento Semanal ({tempAtividadesPlanejamentoSemanal.length})
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                      {tempAtividadesPlanejamentoSemanal.length > 0 ? (
                        <div className="space-y-2">
                          {tempAtividadesPlanejamentoSemanal.map((atividade, index) => (
                            <div key={atividade.id} className="bg-purple-50 p-2 rounded text-sm">
                              <div className="font-medium">{atividade.nome}</div>
                              <div className="text-gray-600">
                                {atividade.responsavel} - {atividade.progresso}% ({atividade.status})
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm text-center py-4">
                          Nenhuma atividade encontrada no planejamento semanal
                        </div>
                      )}
                    </div>
                  </div>

                  {/* NOVA FUNCIONALIDADE: Atividades de Etapas/Subetapas da Proposta */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Etapas/Subetapas da Proposta ({tempAtividadesEtapaSubetapa.length})
                    </label>
                    <div className="border border-gray-300 rounded-md p-3 max-h-64 overflow-y-auto">
                      {tempAtividadesEtapaSubetapa.length > 0 ? (
                        <div className="space-y-3">
                          {tempAtividadesEtapaSubetapa.map((atividade, index) => (
                            <div key={atividade.id} className="bg-orange-50 p-3 rounded border">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={atividade.realizada}
                                    onChange={(e) => updateAtividadeEtapaSubetapa(atividade.id, 'realizada', e.target.checked)}
                                    className="mr-2"
                                  />
                                  <span className="font-medium text-sm">{atividade.nome}</span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${
                                  atividade.tipo === 'etapa' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                }`}>
                                  {atividade.tipo === 'etapa' ? 'Etapa' : 'Subetapa'}
                                </span>
                              </div>
                              
                              {atividade.realizada && (
                                <div className="space-y-2">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600">Responsável</label>
                                    <input
                                      type="text"
                                      value={atividade.responsavel}
                                      onChange={(e) => updateAtividadeEtapaSubetapa(atividade.id, 'responsavel', e.target.value)}
                                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                      placeholder="Nome do responsável"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600">Percentual Realizado (%)</label>
                                    <input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={atividade.progresso}
                                      onChange={(e) => updateAtividadeEtapaSubetapa(atividade.id, 'progresso', Number(e.target.value))}
                                      className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                                      placeholder="0-100"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm text-center py-4">
                          Nenhuma etapa/subetapa encontrada na proposta
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-orange-600 mt-1">
                      * Marque as etapas/subetapas que foram realizadas, informe o responsável e percentual
                    </div>
                  </div>

                  {/* TAREFA 3: Fotos com seleção funcional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fotos</label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="mb-3">
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleFotoUpload}
                          className="hidden"
                          id="foto-upload"
                        />
                        <label
                          htmlFor="foto-upload"
                          className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 cursor-pointer flex items-center justify-center"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          Selecionar Fotos
                        </label>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {tempFotos.map((foto, index) => (
                          <div key={foto.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                            <div className="flex items-center">
                              <img 
                                src={foto.url} 
                                alt={foto.descricao}
                                className="w-10 h-10 object-cover rounded mr-2"
                              />
                              <span>{foto.descricao}</span>
                            </div>
                            <button
                              onClick={() => setTempFotos(tempFotos.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* TAREFA 4: Documentos com anexo funcional */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Documentos</label>
                    <div className="border border-gray-300 rounded-md p-3">
                      <div className="mb-3">
                        <input
                          type="file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                          multiple
                          onChange={handleDocumentoUpload}
                          className="hidden"
                          id="documento-upload"
                        />
                        <label
                          htmlFor="documento-upload"
                          className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 cursor-pointer flex items-center justify-center"
                        >
                          <Paperclip className="h-4 w-4 mr-2" />
                          Anexar Documentos
                        </label>
                      </div>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {tempDocumentos.map((doc, index) => (
                          <div key={doc.id} className="flex items-center justify-between bg-gray-50 p-2 rounded text-sm">
                            <div className="flex items-center">
                              <File className="h-4 w-4 text-gray-500 mr-2" />
                              <span>{doc.nome}</span>
                            </div>
                            <button
                              onClick={() => setTempDocumentos(tempDocumentos.filter((_, i) => i !== index))}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 mt-6 border-t border-gray-200">
                <button
                  onClick={closeDiarioModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={saveDiario}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
                >
                  {editingDiario ? 'Atualizar' : 'Salvar'} Diário
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
