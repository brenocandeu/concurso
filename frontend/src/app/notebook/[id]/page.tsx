"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  FileText,
  FileCheck2,
  FileSpreadsheet,
  Upload,
  Plus,
  Sparkles,
  CheckCircle2,
  BookOpen,
  BrainCircuit,
  ListChecks,
  ChevronRight,
  ChevronDown,
  Trash2,
  Sun,
  Moon,
  Settings,
  LogOut,
  Layers,
  Filter,
  Eye,
  Play,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PdfSource {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  meta?: string;
}

interface SyllabusTopic {
  id: string;
  name: string;
  questionsCount: number;
  resolvedCount: number;
}

interface SyllabusSubject {
  id: string;
  name: string;
  examQuestions: number;
  weight: number;
  extractedQuestions: number;
  resolvedQuestions: number;
  accuracy: number;
  flashcardsCount: number;
  topics: SyllabusTopic[];
}

interface NotebookDetail {
  id: string;
  code: string;
  title: string;
  description: string;
  examBoard: string;
  targetRole: string;
  editalFiles: PdfSource[];
  examFiles: PdfSource[];
  answerKeyFiles: PdfSource[];
  discardedOutofSyllabus: number;
  dueFlashcardsToday: number;
  dueQuestionsToday: number;
  subjects: SyllabusSubject[];
}

const DEFAULT_SUBJECTS: SyllabusSubject[] = [
  {
    id: "sub-ti",
    name: "Informática e Tecnologia da Informação",
    examQuestions: 36,
    weight: 2,
    extractedQuestions: 112,
    resolvedQuestions: 64,
    accuracy: 84,
    flashcardsCount: 42,
    topics: [
      {
        id: "top-1",
        name: "Redes de Computadores, TCP/IP e protocolos web",
        questionsCount: 34,
        resolvedCount: 22,
      },
      {
        id: "top-2",
        name: "Banco de Dados Relacional, SQL e Modelagem",
        questionsCount: 28,
        resolvedCount: 18,
      },
      {
        id: "top-3",
        name: "Segurança da Informação, Criptografia e Malware",
        questionsCount: 30,
        resolvedCount: 14,
      },
      {
        id: "top-4",
        name: "Noções de Python e R para Análise de Dados",
        questionsCount: 20,
        resolvedCount: 10,
      },
    ],
  },
  {
    id: "sub-pt",
    name: "Língua Portuguesa",
    examQuestions: 24,
    weight: 1,
    extractedQuestions: 76,
    resolvedQuestions: 40,
    accuracy: 78,
    flashcardsCount: 25,
    topics: [
      {
        id: "top-5",
        name: "Compreensão, interpretação e tipologia textual",
        questionsCount: 28,
        resolvedCount: 18,
      },
      {
        id: "top-6",
        name: "Reescrita de frases, pontuação e concordância",
        questionsCount: 32,
        resolvedCount: 15,
      },
      {
        id: "top-7",
        name: "Regência verbal, nominal e emprego da crase",
        questionsCount: 16,
        resolvedCount: 7,
      },
    ],
  },
  {
    id: "sub-da",
    name: "Noções de Direito Administrativo",
    examQuestions: 12,
    weight: 1,
    extractedQuestions: 54,
    resolvedQuestions: 30,
    accuracy: 88,
    flashcardsCount: 31,
    topics: [
      {
        id: "top-8",
        name: "Nova Lei de Licitações e Contratos (Lei 14.133/2021)",
        questionsCount: 18,
        resolvedCount: 12,
      },
      {
        id: "top-9",
        name: "Atos Administrativos, Poderes e Agentes Públicos",
        questionsCount: 22,
        resolvedCount: 10,
      },
      {
        id: "top-10",
        name: "Organização Administrativa e Regime Jurídico (Lei 8.112)",
        questionsCount: 14,
        resolvedCount: 8,
      },
    ],
  },
  {
    id: "sub-cont",
    name: "Contabilidade Geral",
    examQuestions: 24,
    weight: 2,
    extractedQuestions: 46,
    resolvedQuestions: 12,
    accuracy: 65,
    flashcardsCount: 19,
    topics: [
      {
        id: "top-11",
        name: "Balanço Patrimonial, Ativo, Passivo e Patrimônio Líquido",
        questionsCount: 24,
        resolvedCount: 8,
      },
      {
        id: "top-12",
        name: "Demonstração do Resultado do Exercício (DRE) e CPC 00",
        questionsCount: 22,
        resolvedCount: 4,
      },
    ],
  },
];

const DEFAULT_SOURCES = {
  editalFiles: [
    {
      id: "ed-1",
      name: "Edital_Abertura_2025.pdf",
      size: "2.4 MB",
      uploadedAt: "10 out",
      meta: "Cargo e tópicos mapeados",
    },
  ],
  examFiles: [
    {
      id: "ex-1",
      name: "Prova_Objetiva_2021.pdf",
      size: "4.1 MB",
      uploadedAt: "11 out",
      meta: "108 questões válidas",
    },
    {
      id: "ex-2",
      name: "Prova_Objetiva_2018.pdf",
      size: "3.8 MB",
      uploadedAt: "12 out",
      meta: "96 questões válidas",
    },
    {
      id: "ex-3",
      name: "Prova_Objetiva_2014.pdf",
      size: "3.2 MB",
      uploadedAt: "15 out",
      meta: "84 questões válidas",
    },
  ],
  answerKeyFiles: [
    {
      id: "gb-1",
      name: "Gabarito_Definitivo_2021.pdf",
      size: "420 KB",
      uploadedAt: "11 out",
      meta: "Vinculado à prova 2021",
    },
    {
      id: "gb-2",
      name: "Gabarito_Definitivo_2018.pdf",
      size: "390 KB",
      uploadedAt: "12 out",
      meta: "Vinculado à prova 2018",
    },
    {
      id: "gb-3",
      name: "Gabarito_Definitivo_2014.pdf",
      size: "310 KB",
      uploadedAt: "15 out",
      meta: "Vinculado à prova 2014",
    },
  ],
};

const NOTEBOOKS_DB: Record<string, NotebookDetail> = {
  "nb-pf": {
    id: "nb-pf",
    code: "PF",
    title: "Polícia Federal",
    description: "Estudos para o cargo de Agente de Polícia Federal",
    examBoard: "Cebraspe",
    targetRole: "Agente de Polícia Federal",
    ...DEFAULT_SOURCES,
    discardedOutofSyllabus: 42,
    dueFlashcardsToday: 18,
    dueQuestionsToday: 9,
    subjects: DEFAULT_SUBJECTS,
  },
  "nb-tse": {
    id: "nb-tse",
    code: "TSE",
    title: "TSE Unificado",
    description: "Caderno focado em Analista Judiciário — Área de TI",
    examBoard: "Cebraspe",
    targetRole: "Analista Judiciário — TI",
    ...DEFAULT_SOURCES,
    discardedOutofSyllabus: 31,
    dueFlashcardsToday: 24,
    dueQuestionsToday: 12,
    subjects: DEFAULT_SUBJECTS,
  },
  "nb-rfb": {
    id: "nb-rfb",
    code: "RFB",
    title: "Receita Federal",
    description: "Preparação completa para Auditor-Fiscal",
    examBoard: "FGV",
    targetRole: "Auditor-Fiscal da Receita Federal",
    ...DEFAULT_SOURCES,
    discardedOutofSyllabus: 19,
    dueFlashcardsToday: 15,
    dueQuestionsToday: 6,
    subjects: DEFAULT_SUBJECTS,
  },
  "nb-bacen": {
    id: "nb-bacen",
    code: "BCB",
    title: "Banco Central do Brasil",
    description: "Analista — Tecnologia da Informação",
    examBoard: "Cebraspe",
    targetRole: "Analista — TI",
    ...DEFAULT_SOURCES,
    discardedOutofSyllabus: 27,
    dueFlashcardsToday: 11,
    dueQuestionsToday: 5,
    subjects: DEFAULT_SUBJECTS,
  },
  "nb-tcu": {
    id: "nb-tcu",
    code: "TCU",
    title: "Tribunal de Contas da União",
    description: "Auditor Federal de Controle Externo",
    examBoard: "FGV",
    targetRole: "Auditor Federal de Controle Externo",
    ...DEFAULT_SOURCES,
    discardedOutofSyllabus: 38,
    dueFlashcardsToday: 21,
    dueQuestionsToday: 10,
    subjects: DEFAULT_SUBJECTS,
  },
  "nb-cnu": {
    id: "nb-cnu",
    code: "CNU",
    title: "Concurso Nacional Unificado",
    description: "Bloco 2 — Tecnologia, Dados e Informação",
    examBoard: "A definir pelo Edital",
    targetRole: "Bloco 2 — Tecnologia, Dados e Informação",
    editalFiles: [],
    examFiles: [],
    answerKeyFiles: [],
    discardedOutofSyllabus: 0,
    dueFlashcardsToday: 0,
    dueQuestionsToday: 0,
    subjects: [],
  },
  "nb-sefaz": {
    id: "nb-sefaz",
    code: "SEF",
    title: "SEFAZ São Paulo",
    description: "Auditor Fiscal da Receita Estadual",
    examBoard: "FCC",
    targetRole: "Auditor Fiscal da Receita Estadual",
    ...DEFAULT_SOURCES,
    discardedOutofSyllabus: 14,
    dueFlashcardsToday: 9,
    dueQuestionsToday: 4,
    subjects: DEFAULT_SUBJECTS,
  },
};

type ImportCategory = "edital" | "exam" | "answerKey";

function NotebookWorkspaceContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id || "nb-pf";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const initialData: NotebookDetail = NOTEBOOKS_DB[id] || {
    id,
    code: "NB",
    title: "Novo Notebook",
    description:
      "Importe o edital, as provas antigas e os respectivos gabaritos para a IA estruturar suas matérias e gerar o banco de questões.",
    examBoard: "A definir pelo Edital",
    targetRole: "A definir pelo Edital",
    editalFiles: [],
    examFiles: [],
    answerKeyFiles: [],
    discardedOutofSyllabus: 0,
    dueFlashcardsToday: 0,
    dueQuestionsToday: 0,
    subjects: [],
  };

  const [notebook, setNotebook] = useState<NotebookDetail>(initialData);
  const [expandedSubjects, setExpandedSubjects] = useState<string[]>([
    "sub-ti",
    "sub-da",
  ]);

  // Import Dialog state
  const [importModalCategory, setImportModalCategory] =
    useState<ImportCategory | null>(null);
  const [customFileName, setCustomFileName] = useState("");
  const [targetRoleInput, setTargetRoleInput] = useState(
    "Agente de Polícia Federal"
  );

  useEffect(() => {
    setMounted(true);
    if (!NOTEBOOKS_DB[id]) {
      try {
        const saved = localStorage.getItem("acervo_custom_notebooks");
        if (saved) {
          const list = JSON.parse(saved) as Array<{
            id: string;
            code: string;
            title: string;
            description: string;
          }>;
          const found = list.find((item) => item.id === id);
          if (found) {
            setNotebook((prev) => ({
              ...prev,
              code: found.code,
              title: found.title,
              description:
                found.description ||
                "Importe o edital, as provas antigas e os gabaritos para começar seus estudos.",
            }));
          }
        }
      } catch {}
    }
  }, [id]);

  const hasAnySource =
    notebook.editalFiles.length > 0 ||
    notebook.examFiles.length > 0 ||
    notebook.answerKeyFiles.length > 0;

  const isFullyStructured = notebook.subjects.length > 0;

  function toggleSubject(subId: string) {
    setExpandedSubjects((prev) =>
      prev.includes(subId)
        ? prev.filter((item) => item !== subId)
        : [...prev, subId]
    );
  }

  function handleOpenImportModal(category: ImportCategory) {
    setImportModalCategory(category);
    if (category === "edital") {
      setCustomFileName("Edital_Abertura_2026.pdf");
    } else if (category === "exam") {
      setCustomFileName(
        `Prova_Anterior_${2024 - notebook.examFiles.length}.pdf`
      );
    } else {
      setCustomFileName(
        `Gabarito_Oficial_${2024 - notebook.answerKeyFiles.length}.pdf`
      );
    }
  }

  function handleConfirmImport(e: React.FormEvent) {
    e.preventDefault();
    if (!importModalCategory || !customFileName.trim()) return;

    const newFile: PdfSource = {
      id: `src-${Date.now()}`,
      name: customFileName.trim().endsWith(".pdf")
        ? customFileName.trim()
        : `${customFileName.trim()}.pdf`,
      size: importModalCategory === "answerKey" ? "380 KB" : "3.4 MB",
      uploadedAt: "Agora",
      meta:
        importModalCategory === "edital"
          ? `Cargo: ${targetRoleInput}`
          : importModalCategory === "exam"
          ? "Pronto para extração"
          : "Gabarito vinculado",
    };

    setNotebook((prev) => {
      const updated = { ...prev };
      if (importModalCategory === "edital") {
        updated.editalFiles = [...prev.editalFiles, newFile];
        updated.targetRole = targetRoleInput || prev.targetRole;
      } else if (importModalCategory === "exam") {
        updated.examFiles = [...prev.examFiles, newFile];
      } else {
        updated.answerKeyFiles = [...prev.answerKeyFiles, newFile];
      }
      return updated;
    });

    setImportModalCategory(null);
    setCustomFileName("");
  }

  function handleRemoveSource(category: ImportCategory, fileId: string) {
    setNotebook((prev) => {
      const updated = { ...prev };
      if (category === "edital") {
        updated.editalFiles = prev.editalFiles.filter((f) => f.id !== fileId);
      } else if (category === "exam") {
        updated.examFiles = prev.examFiles.filter((f) => f.id !== fileId);
      } else {
        updated.answerKeyFiles = prev.answerKeyFiles.filter(
          (f) => f.id !== fileId
        );
      }
      if (
        updated.editalFiles.length === 0 &&
        updated.examFiles.length === 0 &&
        updated.answerKeyFiles.length === 0
      ) {
        updated.subjects = [];
      }
      return updated;
    });
  }

  function handleGenerateStructureWithAI() {
    setNotebook((prev) => ({
      ...prev,
      examBoard: "Cebraspe",
      editalFiles:
        prev.editalFiles.length > 0
          ? prev.editalFiles
          : DEFAULT_SOURCES.editalFiles,
      examFiles:
        prev.examFiles.length > 0 ? prev.examFiles : DEFAULT_SOURCES.examFiles,
      answerKeyFiles:
        prev.answerKeyFiles.length > 0
          ? prev.answerKeyFiles
          : DEFAULT_SOURCES.answerKeyFiles,
      discardedOutofSyllabus: 42,
      dueFlashcardsToday: 18,
      dueQuestionsToday: 9,
      subjects: DEFAULT_SUBJECTS,
    }));
  }

  function handleResetToEmptyState() {
    setNotebook((prev) => ({
      ...prev,
      editalFiles: [],
      examFiles: [],
      answerKeyFiles: [],
      subjects: [],
      discardedOutofSyllabus: 0,
      dueFlashcardsToday: 0,
      dueQuestionsToday: 0,
    }));
  }

  const totalExtractedQuestions = notebook.subjects.reduce(
    (acc, s) => acc + s.extractedQuestions,
    0
  );
  const totalResolvedQuestions = notebook.subjects.reduce(
    (acc, s) => acc + s.resolvedQuestions,
    0
  );
  const totalFlashcards = notebook.subjects.reduce(
    (acc, s) => acc + s.flashcardsCount,
    0
  );

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden bg-background text-foreground flex flex-col">
      {/* ====================================================================
          TOP NAVIGATION BAR
         ==================================================================== */}
      <header className="shrink-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4 sm:px-6">
          {/* Left: Back to Home + Notebook Breadcrumb */}
          <div className="flex items-center gap-3 min-w-0">
            <Link
              href="/"
              aria-label="Voltar para todos os notebooks"
              className="btn-press flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </Link>

            <div className="flex items-center gap-2 min-w-0">
              <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border bg-secondary font-mono text-[9px] font-semibold text-foreground">
                {notebook.code}
              </div>
              <span className="truncate text-sm font-semibold text-foreground">
                {notebook.title}
              </span>
              {isFullyStructured && (
                <span className="hidden sm:inline-flex items-center gap-1 rounded-sm bg-brand-muted px-2 py-0.5 font-mono text-[10px] font-medium text-brand">
                  <CheckCircle2 className="size-3" />
                  Edital estruturado
                </span>
              )}
            </div>
          </div>

          {/* Right: Demo State Switcher + Theme + Account */}
          <div className="flex items-center gap-2.5">
            {hasAnySource ? (
              <button
                type="button"
                onClick={handleResetToEmptyState}
                title="Ver como fica quando o notebook é acessado pela 1ª vez (vazio)"
                className="btn-press hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[10px] text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Ver estado vazio (1º acesso)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateStructureWithAI}
                title="Preencher com edital, provas e matérias de exemplo"
                className="btn-press hidden md:inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1 font-mono text-[10px] text-brand hover:bg-secondary cursor-pointer"
              >
                <Sparkles className="size-3" />
                <span>Simular notebook preenchido</span>
              </button>
            )}

            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Alternar tema"
                className="btn-press flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="size-3.5" />
                ) : (
                  <Moon className="size-3.5" />
                )}
              </button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Menu da conta"
                  className="btn-press flex h-8 items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-3 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer"
                >
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-muted font-mono text-[10px] font-semibold text-brand">
                    B
                  </span>
                  <span className="hidden sm:inline">Breno</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem>
                  <Settings className="size-3.5" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <LogOut className="size-3.5" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ====================================================================
          WORKSPACE BODY: LEFT SOURCES SIDEBAR + MAIN AREA
         ==================================================================== */}
      <div className="flex flex-1 flex-col lg:flex-row lg:overflow-hidden">
        {/* ------------------------------------------------------------------
            LEFT SIDEBAR: PDF SOURCES (Edital, Provas, Gabaritos)
           ------------------------------------------------------------------ */}
        <aside className="w-full lg:w-80 shrink-0 border-b lg:border-b-0 lg:border-r border-border/70 bg-card/40 flex flex-col lg:h-full lg:overflow-hidden">
          <div className="shrink-0 flex items-center justify-between border-b border-border/70 px-5 py-3.5">
            <div className="flex items-center gap-2">
              <Layers className="size-3.5 text-brand" />
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-foreground">
                Arquivos Importados
              </span>
            </div>
            <span className="rounded-sm bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
              {notebook.editalFiles.length +
                notebook.examFiles.length +
                notebook.answerKeyFiles.length}{" "}
              PDFs
            </span>
          </div>

          <div className="flex-1 space-y-6 p-4 overflow-y-auto">
            {/* 1. EDITAL SECTION */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-muted-foreground">
                  <FileText className="size-3.5 text-brand" />
                  EDITAL ({notebook.editalFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenImportModal("edital")}
                  className="btn-press inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] font-medium text-brand hover:bg-brand-muted cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>Adicionar</span>
                </button>
              </div>

              {notebook.editalFiles.length === 0 ? (
                <button
                  type="button"
                  onClick={() => handleOpenImportModal("edital")}
                  className="btn-press flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground cursor-pointer"
                >
                  <Upload className="size-3.5" />
                  <span>Importar PDF do edital</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  {notebook.editalFiles.map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center justify-between gap-2 rounded-md border border-border bg-card p-2.5 text-xs transition-colors hover:border-foreground/20"
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          title={file.name}
                          className="truncate font-medium text-foreground"
                        >
                          {file.name}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {file.size} • {file.meta}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSource("edital", file.id)}
                        aria-label={`Remover ${file.name}`}
                        className="btn-press flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. PROVAS SECTION */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-muted-foreground">
                  <FileSpreadsheet className="size-3.5 text-foreground/80" />
                  PROVAS ({notebook.examFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenImportModal("exam")}
                  className="btn-press inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] font-medium text-brand hover:bg-brand-muted cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>Adicionar</span>
                </button>
              </div>

              {notebook.examFiles.length === 0 ? (
                <button
                  type="button"
                  onClick={() => handleOpenImportModal("exam")}
                  className="btn-press flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground cursor-pointer"
                >
                  <Upload className="size-3.5" />
                  <span>Importar PDF de prova</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  {notebook.examFiles.map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center justify-between gap-2 rounded-md border border-border bg-card p-2.5 text-xs transition-colors hover:border-foreground/20"
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          title={file.name}
                          className="truncate font-medium text-foreground"
                        >
                          {file.name}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {file.size} • {file.meta}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSource("exam", file.id)}
                        aria-label={`Remover ${file.name}`}
                        className="btn-press flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. GABARITOS SECTION */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[11px] font-medium text-muted-foreground">
                  <FileCheck2 className="size-3.5 text-foreground/80" />
                  GABARITOS ({notebook.answerKeyFiles.length})
                </span>
                <button
                  type="button"
                  onClick={() => handleOpenImportModal("answerKey")}
                  className="btn-press inline-flex items-center gap-1 rounded-sm px-1.5 py-0.5 text-[11px] font-medium text-brand hover:bg-brand-muted cursor-pointer"
                >
                  <Plus className="size-3" />
                  <span>Adicionar</span>
                </button>
              </div>

              {notebook.answerKeyFiles.length === 0 ? (
                <button
                  type="button"
                  onClick={() => handleOpenImportModal("answerKey")}
                  className="btn-press flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border py-3 text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground cursor-pointer"
                >
                  <Upload className="size-3.5" />
                  <span>Importar PDF de gabarito</span>
                </button>
              ) : (
                <div className="space-y-1.5">
                  {notebook.answerKeyFiles.map((file) => (
                    <div
                      key={file.id}
                      className="group flex items-center justify-between gap-2 rounded-md border border-border bg-card p-2.5 text-xs transition-colors hover:border-foreground/20"
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          title={file.name}
                          className="truncate font-medium text-foreground"
                        >
                          {file.name}
                        </p>
                        <p className="font-mono text-[10px] text-muted-foreground">
                          {file.size} • {file.meta}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveSource("answerKey", file.id)}
                        aria-label={`Remover ${file.name}`}
                        className="btn-press flex size-6 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary hover:text-destructive cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Footer — AI relevance filter notice */}
          {isFullyStructured && (
            <div className="shrink-0 border-t border-border/70 p-4 bg-secondary/30">
              <div className="flex items-start gap-2.5">
                <Filter className="size-3.5 text-brand shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  <strong className="text-foreground">
                    Filtro do Edital Ativo:
                  </strong>{" "}
                  {notebook.discardedOutofSyllabus} questões de provas antigas
                  foram descartadas pela IA por cobrarem tópicos fora do edital
                  atual.
                </p>
              </div>
            </div>
          )}
        </aside>

        {/* ------------------------------------------------------------------
            MAIN CONTENT AREA
           ------------------------------------------------------------------ */}
        <main className="flex-1 min-w-0 w-full lg:h-full lg:overflow-y-auto px-6 sm:px-10 lg:px-16 py-10">
          <div className="mx-auto w-full max-w-[940px]">
            {/* Notebook Header (Always shows Title & Description) */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-6">
              <div>
                <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
                  {notebook.title}
                </h1>
                {notebook.description && (
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    {notebook.description}
                  </p>
                )}
              </div>

              {isFullyStructured && (
                <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground shrink-0">
                  <span className="size-1.5 rounded-full bg-brand" />
                  <span>{notebook.examBoard}</span>
                  <span className="text-border">•</span>
                  <span>{notebook.targetRole}</span>
                </div>
              )}
            </div>

            {/* ================================================================
                STATE 1: FIRST ACCESS / NO STRUCTURED CONTENT YET
               ================================================================ */}
            {!isFullyStructured ? (
              <div className="mt-7 space-y-6">
                {/* 3 Import Cards: Edital, Prova, Gabarito — matching Home dossier cards */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Card 1: Importar Edital */}
                  <button
                    type="button"
                    onClick={() => handleOpenImportModal("edital")}
                    className="notebook-card group relative flex min-h-[188px] cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-5 text-left select-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-brand">
                        <FileText className="size-3.5" />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        01 / EDITAL
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                          Importar Edital
                        </h2>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Extrai matérias, pesos e a árvore de tópicos do cargo.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${
                            notebook.editalFiles.length > 0
                              ? "bg-brand"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <span>
                          {notebook.editalFiles.length > 0
                            ? `${notebook.editalFiles.length} PDF importado`
                            : "Nenhum PDF"}
                        </span>
                      </div>
                      <span className="text-foreground group-hover:text-brand transition-colors">
                        Subir PDF
                      </span>
                    </div>
                  </button>

                  {/* Card 2: Importar Provas */}
                  <button
                    type="button"
                    onClick={() => handleOpenImportModal("exam")}
                    style={{ animationDelay: "40ms" }}
                    className="notebook-card group relative flex min-h-[188px] cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-5 text-left select-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground">
                        <FileSpreadsheet className="size-3.5" />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        02 / PROVAS
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                          Importar Provas
                        </h2>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Filtra questões de provas antigas pelo edital atual.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${
                            notebook.examFiles.length > 0
                              ? "bg-brand"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <span>
                          {notebook.examFiles.length > 0
                            ? `${notebook.examFiles.length} PDFs importados`
                            : "Nenhum PDF"}
                        </span>
                      </div>
                      <span className="text-foreground group-hover:text-brand transition-colors">
                        Subir PDF
                      </span>
                    </div>
                  </button>

                  {/* Card 3: Importar Gabaritos */}
                  <button
                    type="button"
                    onClick={() => handleOpenImportModal("answerKey")}
                    style={{ animationDelay: "80ms" }}
                    className="notebook-card group relative flex min-h-[188px] cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-5 text-left select-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground">
                        <FileCheck2 className="size-3.5" />
                      </div>
                      <span className="font-mono text-[10px] text-muted-foreground">
                        03 / GABARITOS
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                          Importar Gabaritos
                        </h2>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Vincula respostas oficiais, ignora anuladas e comenta.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span
                          className={`size-1.5 shrink-0 rounded-full ${
                            notebook.answerKeyFiles.length > 0
                              ? "bg-brand"
                              : "bg-muted-foreground/40"
                          }`}
                        />
                        <span>
                          {notebook.answerKeyFiles.length > 0
                            ? `${notebook.answerKeyFiles.length} PDFs importados`
                            : "Nenhum PDF"}
                        </span>
                      </div>
                      <span className="text-foreground group-hover:text-brand transition-colors">
                        Subir PDF
                      </span>
                    </div>
                  </button>
                </div>

                {/* Subtle Action Bar to trigger AI Pipeline */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-lg border border-border bg-card px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-brand">
                      <Sparkles className="size-3.5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground">
                        Estruturar banco de estudos com IA
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Cruza o edital com as provas e gabaritos para montar as
                        matérias e questões.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateStructureWithAI}
                    size="sm"
                    className="shrink-0 self-start sm:self-auto"
                  >
                    <Sparkles className="size-3.5" />
                    <span>Processar documentos</span>
                  </Button>
                </div>
              </div>
            ) : (
              /* ================================================================
                 STATE 2: POPULATED NOTEBOOK (Study Modes + Syllabus by Subject)
                 ================================================================ */
              <div className="mt-7 space-y-10">
                {/* 3 Core Study Modules — Dossier style matching Home page */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {/* Module 1: Banco de Questões */}
                  <div className="notebook-card group relative flex min-h-[184px] cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-5 text-left select-none">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground">
                        <BookOpen className="size-3.5" />
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {notebook.subjects.length} matérias
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                          Banco de Questões
                        </h2>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Questões extraídas das provas, filtradas pelo edital e
                        comentadas pela IA.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                        <span className="text-foreground font-medium">
                          {totalExtractedQuestions} questões
                        </span>
                      </div>
                      <span className="group-hover:text-foreground transition-colors">
                        Abrir banco →
                      </span>
                    </div>
                  </div>

                  {/* Module 2: Estudo por Flashcards (SRS) */}
                  <div
                    style={{ animationDelay: "40ms" }}
                    className="notebook-card group relative flex min-h-[184px] cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-5 text-left select-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-brand">
                        <BrainCircuit className="size-3.5" />
                      </div>
                      <span className="rounded-sm bg-brand-muted px-2 py-0.5 font-mono text-[10px] font-medium text-brand">
                        {notebook.dueFlashcardsToday} hoje
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                          Flashcards
                        </h2>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Revisão espaçada ativa com cards manuais e gerados a
                        partir dos seus erros.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                        <span className="text-foreground font-medium">
                          {totalFlashcards} cards
                        </span>
                      </div>
                      <span className="group-hover:text-foreground transition-colors">
                        Revisar →
                      </span>
                    </div>
                  </div>

                  {/* Module 3: Questões Resolvidas */}
                  <div
                    style={{ animationDelay: "80ms" }}
                    className="notebook-card group relative flex min-h-[184px] cursor-pointer flex-col justify-between rounded-lg border border-border bg-card p-5 text-left select-none"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-foreground">
                        <ListChecks className="size-3.5" />
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        81% de acerto
                      </span>
                    </div>

                    <div className="my-4">
                      <div className="flex items-center justify-between gap-2">
                        <h2 className="text-[15px] font-semibold tracking-tight text-foreground">
                          Questões Resolvidas
                        </h2>
                        <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                        Histórico individual de respostas, estatísticas e
                        caderno de erros.
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <span className="size-1.5 shrink-0 rounded-full bg-brand" />
                        <span className="text-foreground font-medium">
                          {totalResolvedQuestions} resolvidas
                        </span>
                      </div>
                      <span className="group-hover:text-foreground transition-colors">
                        Ver histórico →
                      </span>
                    </div>
                  </div>
                </div>

                {/* ==============================================================
                    QUESTIONS & SYLLABUS SEPARATED BY SUBJECT (Matérias do Edital)
                   ============================================================== */}
                <div className="space-y-4">
                  <div className="flex items-end justify-between border-b border-border/70 pb-3">
                    <div>
                      <h2 className="font-serif text-2xl font-normal tracking-tight text-foreground">
                        Questões por matéria
                      </h2>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        Conteúdo programático extraído do edital com o banco de
                        questões filtrado por tópico.
                      </p>
                    </div>
                    <span className="hidden sm:inline font-mono text-[11px] text-muted-foreground">
                      {totalResolvedQuestions}/{totalExtractedQuestions}{" "}
                      concluídas
                    </span>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-border bg-card divide-y divide-border">
                    {notebook.subjects.map((subject) => {
                      const isExpanded = expandedSubjects.includes(subject.id);
                      const progressPercent = Math.round(
                        (subject.resolvedQuestions /
                          subject.extractedQuestions) *
                          100
                      );

                      return (
                        <div key={subject.id} className="bg-card">
                          {/* Subject Row Header */}
                          <div
                            onClick={() => toggleSubject(subject.id)}
                            className="flex cursor-pointer flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between hover:bg-card-hover transition-colors select-none"
                          >
                            <div className="flex items-center gap-3.5 min-w-0">
                              <button
                                type="button"
                                aria-label="Expandir tópicos"
                                className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border bg-secondary text-muted-foreground"
                              >
                                {isExpanded ? (
                                  <ChevronDown className="size-3.5" />
                                ) : (
                                  <ChevronRight className="size-3.5" />
                                )}
                              </button>

                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-semibold text-foreground">
                                  {subject.name}
                                </h3>
                                <p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                                  Peso {subject.weight} •{" "}
                                  {subject.examQuestions} na prova •{" "}
                                  {subject.flashcardsCount} flashcards
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pl-10 sm:pl-0">
                              {/* Progress Bar + Count */}
                              <div className="flex items-center gap-3">
                                <span className="font-mono text-[11px] text-muted-foreground">
                                  {subject.resolvedQuestions}/
                                  {subject.extractedQuestions} questões
                                </span>
                                <div className="hidden md:block h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                                  <div
                                    className="h-full rounded-full bg-brand"
                                    style={{ width: `${progressPercent}%` }}
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={(e) => e.stopPropagation()}
                                className="btn-press rounded-md border border-border bg-secondary px-2.5 py-1 text-xs font-medium text-foreground hover:bg-foreground hover:text-background transition-colors cursor-pointer"
                              >
                                Resolver
                              </button>
                            </div>
                          </div>

                          {/* Expanded Topics Tree from Edital */}
                          {isExpanded && (
                            <div className="border-t border-border/60 bg-background/40 divide-y divide-border/40">
                              {subject.topics.map((topic, idx) => (
                                <div
                                  key={topic.id}
                                  className="group flex items-center justify-between gap-4 pl-14 pr-5 py-2.5 text-xs hover:bg-secondary/30 transition-colors"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <span className="font-mono text-[10px] text-muted-foreground">
                                      {String(idx + 1).padStart(2, "0")}
                                    </span>
                                    <span className="truncate text-foreground/85 group-hover:text-foreground">
                                      {topic.name}
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-4 shrink-0 font-mono text-[11px] text-muted-foreground">
                                    <span>
                                      {topic.resolvedCount}/
                                      {topic.questionsCount}
                                    </span>
                                    <button
                                      type="button"
                                      className="btn-press text-[11px] font-sans font-medium text-muted-foreground group-hover:text-foreground cursor-pointer"
                                    >
                                      Praticar →
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ====================================================================
          MODAL: IMPORT PDF SOURCE (Edital, Prova or Gabarito)
         ==================================================================== */}
      <Dialog
        open={importModalCategory !== null}
        onOpenChange={(open) => !open && setImportModalCategory(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal tracking-tight">
              {importModalCategory === "edital" && "Importar PDF do Edital"}
              {importModalCategory === "exam" && "Importar PDF de Prova"}
              {importModalCategory === "answerKey" &&
                "Importar PDF de Gabarito"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {importModalCategory === "edital" &&
                "Informe o cargo alvo e selecione o PDF do edital para a IA extrair as matérias e tópicos."}
              {importModalCategory === "exam" &&
                "Selecione o PDF da prova anterior. A IA filtrará apenas as questões que caem no seu edital."}
              {importModalCategory === "answerKey" &&
                "Selecione o PDF do gabarito oficial correspondente para vincular as respostas corretas."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmImport} className="space-y-4 pt-2">
            {importModalCategory === "edital" && (
              <div className="space-y-1.5">
                <label
                  htmlFor="target-role"
                  className="text-xs font-medium text-foreground"
                >
                  Cargo pretendido no edital
                </label>
                <input
                  id="target-role"
                  type="text"
                  required
                  value={targetRoleInput}
                  onChange={(e) => setTargetRoleInput(e.target.value)}
                  placeholder="Ex: Agente de Polícia Federal, Analista de TI..."
                  className="h-9 w-full rounded-md border border-border bg-secondary/50 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/50 focus:outline-none"
                />
              </div>
            )}

            {/* Dropzone Simulation */}
            <div className="space-y-1.5">
              <label
                htmlFor="pdf-file"
                className="text-xs font-medium text-foreground"
              >
                Arquivo PDF
              </label>
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-border bg-secondary/20 p-6 text-center">
                <Upload className="size-5 text-muted-foreground" />
                <p className="mt-2 text-xs font-medium text-foreground">
                  Arraste o arquivo PDF aqui ou clique para selecionar
                </p>
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground">
                  Suporta PDFs de até 50MB (processamento em background)
                </p>
                <input
                  id="pdf-file"
                  type="text"
                  required
                  value={customFileName}
                  onChange={(e) => setCustomFileName(e.target.value)}
                  placeholder="Nome do arquivo.pdf"
                  className="mt-3 h-8 w-full max-w-xs rounded-md border border-border bg-card px-2.5 text-center font-mono text-xs text-foreground focus:border-foreground/50 focus:outline-none"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setImportModalCategory(null)}
              >
                Cancelar
              </Button>
              <Button type="submit" size="sm">
                Importar PDF
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function NotebookWorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center font-mono text-xs text-muted-foreground">
          Carregando notebook...
        </div>
      }
    >
      <NotebookWorkspaceContent />
    </Suspense>
  );
}
