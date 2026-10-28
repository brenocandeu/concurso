"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import {
  Search,
  Plus,
  MoreHorizontal,
  LayoutGrid,
  List,
  FolderOpen,
  Pencil,
  Users,
  Trash2,
  Sun,
  Moon,
  FileText,
  BookOpen,
  ArrowUpRight,
  Layers,
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

type ScopeFilter = "all" | "shared" | "personal";
type ViewMode = "grid" | "list";

interface StudyNotebook {
  id: string;
  code: string;
  title: string;
  targetRole: string;
  examBoard: string;
  updatedAt: string;
  editalImported: boolean;
  examsCount: number;
  questionsCount: number;
  shared: boolean;
}

const INITIAL_NOTEBOOKS: StudyNotebook[] = [
  {
    id: "nb-pf",
    code: "PF",
    title: "Polícia Federal",
    targetRole: "Agente de Polícia Federal",
    examBoard: "Cebraspe",
    updatedAt: "15 out 2026",
    editalImported: true,
    examsCount: 6,
    questionsCount: 420,
    shared: true,
  },
  {
    id: "nb-tse",
    code: "TSE",
    title: "TSE Unificado",
    targetRole: "Analista Judiciário — TI",
    examBoard: "Cebraspe",
    updatedAt: "02 set 2026",
    editalImported: true,
    examsCount: 8,
    questionsCount: 540,
    shared: true,
  },
  {
    id: "nb-rfb",
    code: "RFB",
    title: "Receita Federal",
    targetRole: "Auditor-Fiscal",
    examBoard: "FGV",
    updatedAt: "28 ago 2026",
    editalImported: true,
    examsCount: 4,
    questionsCount: 280,
    shared: true,
  },
  {
    id: "nb-bacen",
    code: "BCB",
    title: "Banco Central do Brasil",
    targetRole: "Analista — Tecnologia da Informação",
    examBoard: "Cebraspe",
    updatedAt: "19 ago 2026",
    editalImported: true,
    examsCount: 5,
    questionsCount: 310,
    shared: false,
  },
  {
    id: "nb-tcu",
    code: "TCU",
    title: "Tribunal de Contas da União",
    targetRole: "Auditor Federal de Controle Externo",
    examBoard: "FGV",
    updatedAt: "04 ago 2026",
    editalImported: true,
    examsCount: 7,
    questionsCount: 490,
    shared: true,
  },
  {
    id: "nb-cnu",
    code: "CNU",
    title: "Concurso Nacional Unificado",
    targetRole: "Bloco 2 — Tecnologia, Dados e Informação",
    examBoard: "Cesgranrio",
    updatedAt: "12 jul 2026",
    editalImported: false,
    examsCount: 2,
    questionsCount: 140,
    shared: true,
  },
  {
    id: "nb-sefaz",
    code: "SEF",
    title: "SEFAZ São Paulo",
    targetRole: "Auditor Fiscal da Receita Estadual",
    examBoard: "FCC",
    updatedAt: "22 jun 2026",
    editalImported: true,
    examsCount: 3,
    questionsCount: 240,
    shared: false,
  },
];

const EXAM_BOARDS = ["Cebraspe", "FGV", "FCC", "Vunesp", "Cesgranrio", "Outra"];

export default function HomePage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [notebooks, setNotebooks] = useState<StudyNotebook[]>(INITIAL_NOTEBOOKS);
  const [scope, setScope] = useState<ScopeFilter>("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeUser, setActiveUser] = useState<"Breno" | "Parceiro">("Breno");

  // Modal state for creating a new notebook
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newBoard, setNewBoard] = useState("Cebraspe");
  const [newShared, setNewShared] = useState(true);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Instant keyboard shortcut "/" to focus search (no animation, 100+/day gate)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (
        e.key === "/" &&
        !isNewModalOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isNewModalOpen]);

  const filteredNotebooks = useMemo(() => {
    return notebooks.filter((nb) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        nb.title.toLowerCase().includes(q) ||
        nb.targetRole.toLowerCase().includes(q) ||
        nb.examBoard.toLowerCase().includes(q) ||
        nb.code.toLowerCase().includes(q);

      if (!matchesSearch) return false;
      if (scope === "shared") return nb.shared;
      if (scope === "personal") return !nb.shared;
      return true;
    });
  }, [notebooks, searchQuery, scope]);

  function handleCreateNotebook(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim() || !newRole.trim()) return;

    const cleanWords = newTitle.trim().split(/\s+/);
    const generatedCode =
      cleanWords.length >= 2
        ? (cleanWords[0][0] + cleanWords[1][0]).toUpperCase()
        : newTitle.trim().slice(0, 3).toUpperCase();

    const created: StudyNotebook = {
      id: `nb-${Date.now()}`,
      code: generatedCode,
      title: newTitle.trim(),
      targetRole: newRole.trim(),
      examBoard: newBoard,
      updatedAt: "Agora mesmo",
      editalImported: false,
      examsCount: 0,
      questionsCount: 0,
      shared: newShared,
    };

    setNotebooks((prev) => [created, ...prev]);
    setNewTitle("");
    setNewRole("");
    setNewBoard("Cebraspe");
    setNewShared(true);
    setIsNewModalOpen(false);
  }

  function handleDeleteNotebook(id: string) {
    setNotebooks((prev) => prev.filter((nb) => nb.id !== id));
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ====================================================================
          MINIMALIST AUTHORIAL TOPBAR
         ==================================================================== */}
      <header className="sticky top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8">
          {/* Left: Brand Identity + Scope Filter */}
          <div className="flex items-center gap-7">
            <div className="flex items-center gap-2.5 select-none">
              <div className="flex size-8 items-center justify-center rounded-lg border border-border bg-card shadow-2xs">
                <Layers className="size-4 text-brand" />
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-xl tracking-tight text-foreground">
                  Acervo
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  estudos
                </span>
              </div>
            </div>

            {/* Scope Filter Tabs */}
            <nav
              aria-label="Filtro de cadernos"
              className="hidden md:flex items-center gap-1 rounded-lg border border-border/80 bg-card/60 p-1"
            >
              <button
                type="button"
                onClick={() => setScope("all")}
                className={`btn-press rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                  scope === "all"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Todos
              </button>
              <button
                type="button"
                onClick={() => setScope("shared")}
                className={`btn-press flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                  scope === "shared"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="size-1.5 rounded-full bg-brand" />
                <span>Em dupla</span>
              </button>
              <button
                type="button"
                onClick={() => setScope("personal")}
                className={`btn-press rounded-md px-3 py-1 text-xs font-medium cursor-pointer ${
                  scope === "personal"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Individuais
              </button>
            </nav>
          </div>

          {/* Right: Search, View Mode, Theme Toggle, Active Student */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative hidden sm:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filtrar por órgão, cargo ou banca..."
                className="h-8 w-56 lg:w-64 rounded-lg border border-border bg-card pl-8 pr-7 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
              />
              <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                /
              </kbd>
            </div>

            {/* Grid / List View Switcher */}
            <div
              role="group"
              aria-label="Visualização"
              className="flex h-8 items-center rounded-lg border border-border bg-card p-0.5"
            >
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-label="Grade"
                className={`btn-press flex h-full items-center justify-center rounded-md px-2 cursor-pointer ${
                  viewMode === "grid"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <LayoutGrid className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                aria-label="Lista"
                className={`btn-press flex h-full items-center justify-center rounded-md px-2 cursor-pointer ${
                  viewMode === "list"
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" />
              </button>
            </div>

            {/* Direct Theme Toggle */}
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Alternar tema"
                className="btn-press flex size-8 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
              >
                {theme === "dark" ? (
                  <Sun className="size-3.5" />
                ) : (
                  <Moon className="size-3.5" />
                )}
              </button>
            )}

            {/* Active Student Selector (Breno / Parceiro) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Trocar estudante ativo"
                  className="btn-press flex h-8 items-center gap-2 rounded-lg border border-border bg-card pl-2 pr-2.5 text-xs font-medium text-foreground hover:bg-secondary cursor-pointer"
                >
                  <span className="flex size-5 items-center justify-center rounded-md bg-brand-muted font-mono text-[10px] font-semibold text-brand">
                    {activeUser[0]}
                  </span>
                  <span className="hidden sm:inline">{activeUser}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-2.5 py-1.5 text-[11px] text-muted-foreground">
                  Progresso individual ativo:
                </div>
                <DropdownMenuItem onClick={() => setActiveUser("Breno")}>
                  <Users className="size-3.5" />
                  <span className="flex-1">Breno</span>
                  {activeUser === "Breno" && (
                    <span className="font-mono text-[10px] text-brand">
                      ATIVO
                    </span>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setActiveUser("Parceiro")}>
                  <Users className="size-3.5" />
                  <span className="flex-1">Parceiro de estudo</span>
                  {activeUser === "Parceiro" && (
                    <span className="font-mono text-[10px] text-brand">
                      ATIVO
                    </span>
                  )}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN WORKSPACE — NOTEBOOKS DIRECTORY
         ==================================================================== */}
      <main className="mx-auto w-full max-w-[1440px] flex-1 px-5 sm:px-8 pt-10 pb-20">
        {/* Editorial Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-border/70 pb-6">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal tracking-tight text-foreground">
              Notebooks de estudo
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Abra um notebook para importar o edital, provas e gabaritos ou
              iniciar o estudo por questões e flashcards.
            </p>
          </div>

          <Button
            onClick={() => setIsNewModalOpen(true)}
            className="h-9 rounded-lg px-4 text-xs font-medium self-start sm:self-auto"
          >
            <Plus className="size-3.5" />
            <span>Novo notebook</span>
          </Button>
        </div>

        {/* Notebooks Collection */}
        {filteredNotebooks.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
            <BookOpen className="size-7 text-muted-foreground/50" />
            <p className="mt-3 text-sm font-medium text-foreground">
              Nenhum notebook encontrado
            </p>
            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
              Crie um notebook para o seu concurso e importe o PDF do edital e
              as provas antigas.
            </p>
            <Button
              onClick={() => setIsNewModalOpen(true)}
              className="mt-4 h-8 rounded-lg px-3.5 text-xs"
            >
              <Plus className="size-3.5" />
              <span>Criar notebook</span>
            </Button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Quick Create Card */}
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="notebook-card group flex min-h-[188px] cursor-pointer flex-col justify-between rounded-2xl border border-dashed border-border bg-transparent p-5 text-left hover:border-foreground/30 hover:bg-card/50"
            >
              <div className="flex size-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors group-hover:border-foreground/20 group-hover:text-foreground">
                <Plus className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Criar novo notebook
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Importar edital, provas e gabaritos para estruturar com IA
                </p>
              </div>
            </button>

            {/* Notebook Dossier Cards */}
            {filteredNotebooks.map((nb, index) => (
              <div
                key={nb.id}
                style={{ animationDelay: `${Math.min((index + 1) * 40, 280)}ms` }}
                className="notebook-card group relative flex min-h-[188px] cursor-pointer flex-col justify-between rounded-2xl border border-border bg-card p-5 text-left select-none"
              >
                {/* Top bar: Monogram + Board Tag + Menu */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 min-w-8 items-center justify-center rounded-lg border border-border bg-secondary px-2 font-mono text-[11px] font-semibold tracking-wider text-foreground">
                      {nb.code}
                    </div>
                    <span className="rounded-md bg-secondary/70 px-2 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      {nb.examBoard}
                    </span>
                    {nb.shared && (
                      <span
                        title="Compartilhado com seu parceiro de estudo"
                        className="inline-flex items-center gap-1 rounded-md bg-brand-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-brand"
                      >
                        Dupla
                      </span>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Opções de ${nb.title}`}
                        className="btn-press -mr-1 -mt-1 flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenuItem>
                        <FolderOpen className="size-3.5" />
                        <span>Abrir notebook</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Pencil className="size-3.5" />
                        <span>Editar informações</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteNotebook(nb.id)}
                      >
                        <Trash2 className="size-3.5" />
                        <span>Excluir notebook</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Middle: Concurso Title & Target Role */}
                <div className="my-4">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="truncate text-[15px] font-semibold tracking-tight text-foreground">
                      {nb.title}
                    </h2>
                    <ArrowUpRight className="size-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {nb.targetRole}
                  </p>
                </div>

                {/* Bottom Metadata Footer */}
                <div className="flex items-center justify-between border-t border-border/70 pt-3 font-mono text-[11px] text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-1.5 rounded-full ${
                        nb.editalImported ? "bg-brand" : "bg-muted-foreground/40"
                      }`}
                    />
                    <span>
                      {nb.examsCount === 0
                        ? "Sem provas importadas"
                        : `${nb.examsCount} ${
                            nb.examsCount === 1 ? "prova" : "provas"
                          } • ${nb.questionsCount} questões`}
                    </span>
                  </div>
                  <span>{nb.updatedAt}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View Mode */
          <div className="mt-7 overflow-hidden rounded-2xl border border-border bg-card divide-y divide-border">
            {filteredNotebooks.map((nb, index) => (
              <div
                key={nb.id}
                style={{ animationDelay: `${Math.min(index * 25, 200)}ms` }}
                className="notebook-card flex cursor-pointer items-center justify-between gap-4 px-5 py-3.5"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-8 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary font-mono text-[11px] font-semibold text-foreground">
                    {nb.code}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h2 className="truncate text-sm font-semibold text-foreground">
                        {nb.title}
                      </h2>
                      <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                        {nb.examBoard}
                      </span>
                      {nb.shared && (
                        <span className="rounded bg-brand-muted px-1.5 py-0.5 font-mono text-[10px] text-brand">
                          Dupla
                        </span>
                      )}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {nb.targetRole}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="hidden md:flex items-center gap-4 font-mono text-[11px] text-muted-foreground">
                    <span>{nb.examsCount} provas</span>
                    <span>{nb.questionsCount} questões</span>
                    <span>{nb.updatedAt}</span>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Opções de ${nb.title}`}
                        className="btn-press flex size-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground cursor-pointer"
                      >
                        <MoreHorizontal className="size-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <FolderOpen className="size-3.5" />
                        <span>Abrir notebook</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => handleDeleteNotebook(nb.id)}
                      >
                        <Trash2 className="size-3.5" />
                        <span>Excluir notebook</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ====================================================================
          MODAL: CREATE NEW NOTEBOOK (shadcn/ui Dialog)
         ==================================================================== */}
      <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal tracking-tight">
              Novo notebook de concurso
            </DialogTitle>
            <DialogDescription className="text-xs">
              Após criar o notebook, você poderá importar o PDF do edital,
              provas antigas e gabaritos para gerar o banco de questões e
              flashcards.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateNotebook} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label
                htmlFor="nb-title"
                className="text-xs font-medium text-foreground"
              >
                Órgão ou Certame
              </label>
              <input
                id="nb-title"
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Polícia Federal, Receita Federal, TRF-1"
                className="h-9 w-full rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="nb-role"
                className="text-xs font-medium text-foreground"
              >
                Cargo Alvo
              </label>
              <input
                id="nb-role"
                type="text"
                required
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="Ex: Analista de TI, Agente Administrativo"
                className="h-9 w-full rounded-lg border border-border bg-secondary/50 px-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-foreground/50 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Banca Examinadora
              </label>
              <div className="flex flex-wrap gap-1.5">
                {EXAM_BOARDS.map((board) => (
                  <button
                    key={board}
                    type="button"
                    onClick={() => setNewBoard(board)}
                    className={`btn-press rounded-lg border px-2.5 py-1 font-mono text-[11px] cursor-pointer ${
                      newBoard === board
                        ? "border-foreground bg-foreground text-background font-medium"
                        : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {board}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-3">
              <div>
                <p className="text-xs font-medium text-foreground">
                  Compartilhar acervo com parceiro
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Questões e flashcards visíveis para ambos; revisões continuam
                  individuais.
                </p>
              </div>
              <input
                type="checkbox"
                checked={newShared}
                onChange={(e) => setNewShared(e.target.checked)}
                className="size-4 accent-brand cursor-pointer"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsNewModalOpen(false)}
                className="h-8 rounded-lg text-xs"
              >
                Cancelar
              </Button>
              <Button type="submit" className="h-8 rounded-lg px-4 text-xs">
                Criar notebook
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
