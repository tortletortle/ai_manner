import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  Archive,
  ArrowRight,
  Bell,
  Bot,
  Boxes,
  Check,
  ChevronRight,
  CircleCheck,
  CircleDashed,
  Clock3,
  Code2,
  Cpu,
  Database,
  Download,
  ExternalLink,
  Eye,
  FileCode2,
  FileImage,
  FileText,
  FolderKanban,
  GitBranch,
  KeyRound,
  Layers3,
  MessageSquare,
  MoreHorizontal,
  Network,
  Palette,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Server,
  Settings2,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Type,
  Upload,
  WandSparkles,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

export type WorkspaceViewKey =
  | "input"
  | "projects"
  | "design"
  | "plan"
  | "execution"
  | "artifacts"
  | "agents"
  | "tools"
  | "history"
  | "audit"
  | "system"
  | "config";

function Action({
  children,
  kind = "quiet",
  onClick,
}: {
  children: ReactNode;
  kind?: "primary" | "quiet" | "danger";
  onClick?: () => void;
}) {
  return (
    <button className={`view-action ${kind}`} onClick={onClick} type="button">
      {children}
    </button>
  );
}

function downloadText(filename: string, content: string) {
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function ViewHeading({
  eyebrow,
  title,
  copy,
  actions,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  actions?: ReactNode;
}) {
  return (
    <div className="view-heading">
      <div>
        <div className="view-eyebrow">{eyebrow}</div>
        <div className="view-title">{title}</div>
        <div className="view-copy">{copy}</div>
      </div>
      {actions && <div className="view-heading-actions">{actions}</div>}
    </div>
  );
}

function Section({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`view-section ${className}`}>
      <div className="view-section-head">
        <div>
          <div className="view-section-title">{title}</div>
          {subtitle && <div className="view-section-subtitle">{subtitle}</div>}
        </div>
        {action}
      </div>
      <div className="view-section-body">{children}</div>
    </section>
  );
}

function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: string }) {
  return <span className={`view-pill ${tone}`}>{children}</span>;
}

function InputView({ onNavigate }: { onNavigate: (view: WorkspaceViewKey) => void }) {
  const [request, setRequest] = useState(
    "构建一个企业知识库 RAG 系统，支持多格式文档导入、向量检索、权限隔离和可追溯的引用来源。",
  );
  const [executionMode, setExecutionMode] = useState<"workflow" | "quick">("workflow");
  const [contextAdded, setContextAdded] = useState(false);
  return (
    <main className="other-view input-view">
      <ViewHeading
        eyebrow="NEW WORKFLOW"
        title="从一个清晰的目标开始"
        copy="描述你想完成的任务，Helm 会分析复杂度、生成设计书并规划可执行步骤。"
      />
      <div className="input-layout">
        <Section title="任务需求" subtitle="尽量包含目标、约束和期望交付物" className="request-section">
          <textarea
            className="request-editor"
            onChange={(event) => setRequest(event.target.value)}
            placeholder="描述你的任务..."
            value={request}
          />
          <div className="editor-footer">
            <div className="input-tools">
              <Action onClick={() => setContextAdded((added) => !added)}><Upload size={14} /> {contextAdded ? "已添加仓库上下文" : "添加上下文"}</Action>
              <span>{request.length} 字</span>
            </div>
            <Action kind="primary" onClick={() => onNavigate(executionMode === "workflow" ? "design" : "execution")}>
              {executionMode === "workflow" ? <WandSparkles size={15} /> : <Zap size={15} />}
              {executionMode === "workflow" ? "生成设计书" : "直接执行"}
              <ArrowRight size={14} />
            </Action>
          </div>
        </Section>
        <aside className="input-aside">
          <Section title="执行方式" subtitle="系统会根据任务复杂度自动判断">
            <button className={`mode-card ${executionMode === "workflow" ? "selected" : ""}`} onClick={() => setExecutionMode("workflow")} type="button">
              <div className="mode-icon"><Network size={17} /></div>
              <div><strong>完整工作流</strong><span>设计、审批、计划与执行</span></div>
              {executionMode === "workflow" ? <Check size={15} /> : <CircleDashed size={15} />}
            </button>
            <button className={`mode-card ${executionMode === "quick" ? "selected" : ""}`} onClick={() => setExecutionMode("quick")} type="button">
              <div className="mode-icon"><Zap size={17} /></div>
              <div><strong>快速任务</strong><span>直接调用单个工具完成</span></div>
              {executionMode === "quick" ? <Check size={15} /> : <CircleDashed size={15} />}
            </button>
          </Section>
          <Section title="推荐模板">
            <div className="template-list">
              {["构建完整 Web 应用", "分析代码仓库", "生成数据报告"].map((item) => (
                <button key={item} onClick={() => setRequest(item === "构建完整 Web 应用" ? "构建一个完整的 Web 应用，包含前端、后端、数据库、身份验证和部署配置。" : item === "分析代码仓库" ? "分析当前代码仓库的架构、依赖、风险与可优化项，并生成结构化报告。" : "读取项目数据并生成包含核心指标、趋势分析和结论的数据报告。")} type="button"><FileText size={14} />{item}<ChevronRight size={13} /></button>
              ))}
            </div>
          </Section>
        </aside>
      </div>
    </main>
  );
}

type Project = {
  id: string;
  name: string;
  description: string;
  status: "运行中" | "空闲" | "已归档";
  plans: number;
  updated: string;
  stack: string[];
};

const initialProjects: Project[] = [
  { id: "PRJ-A84F", name: "企业知识库 RAG 系统", description: "支持权限隔离、向量检索与引用溯源的企业知识服务", status: "运行中", plans: 3, updated: "刚刚", stack: ["FastAPI", "React", "pgvector"] },
  { id: "PRJ-91BD", name: "电商数据分析平台", description: "多渠道销售数据汇总、指标分析与自动化周报", status: "空闲", plans: 8, updated: "昨天 18:06", stack: ["Python", "PostgreSQL", "ECharts"] },
  { id: "PRJ-C02A", name: "客服工单分类服务", description: "基于大模型的工单分类、优先级识别与智能分派", status: "空闲", plans: 5, updated: "5月18日", stack: ["FastAPI", "Redis", "OpenAI"] },
  { id: "PRJ-E318", name: "营销内容工作台", description: "营销文案、落地页与素材的自动化生产工作流", status: "已归档", plans: 12, updated: "5月16日", stack: ["React", "Node.js", "S3"] },
];

function ProjectsView({ onNavigate }: { onNavigate: (view: WorkspaceViewKey) => void }) {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(initialProjects[0].id);
  const [query, setQuery] = useState("");
  const [creating, setCreating] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [statusFilter, setStatusFilter] = useState<"全部状态" | Project["status"]>("全部状态");
  const [showProjectMeta, setShowProjectMeta] = useState(false);
  const selected = projects.find((project) => project.id === selectedId) ?? projects[0];
  const filtered = projects.filter((project) => (project.name.includes(query) || project.description.includes(query)) && (statusFilter === "全部状态" || project.status === statusFilter));

  const createProject = () => {
    if (!projectName.trim()) return;
    const project: Project = {
      id: `PRJ-${Math.random().toString(16).slice(2, 6).toUpperCase()}`,
      name: projectName.trim(),
      description: "新建项目，等待创建第一个执行任务",
      status: "空闲",
      plans: 0,
      updated: "刚刚",
      stack: ["待配置"],
    };
    setProjects((current) => [project, ...current]);
    setSelectedId(project.id);
    setProjectName("");
    setCreating(false);
  };

  return (
    <main className="other-view projects-view">
      <ViewHeading
        eyebrow="PROJECT WORKSPACE"
        title="项目管理"
        copy="集中管理项目、执行计划、技术上下文和最近活动。"
        actions={<Action kind="primary" onClick={() => setCreating(true)}><Plus size={14} /> 新建项目</Action>}
      />
      <div className="project-metrics">
        <div><FolderKanban size={17} /><span>全部项目</span><strong>{projects.length}</strong></div>
        <div><Play size={17} /><span>正在运行</span><strong>{projects.filter((project) => project.status === "运行中").length}</strong></div>
        <div><FileText size={17} /><span>执行计划</span><strong>{projects.reduce((sum, project) => sum + project.plans, 0)}</strong></div>
        <div><Archive size={17} /><span>已归档</span><strong>{projects.filter((project) => project.status === "已归档").length}</strong></div>
      </div>
      <div className="view-filterbar">
        <label><Search size={14} /><input onChange={(event) => setQuery(event.target.value)} placeholder="搜索项目..." value={query} /></label>
        <Action onClick={() => setStatusFilter((current) => current === "全部状态" ? "运行中" : current === "运行中" ? "空闲" : current === "空闲" ? "已归档" : "全部状态")}><SlidersHorizontal size={14} /> {statusFilter}</Action>
      </div>
      <div className="project-layout">
        <Section title="项目列表" subtitle={`${filtered.length} 个项目`}>
          <div className="project-list">
            {filtered.map((project) => (
              <button className={selectedId === project.id ? "selected" : ""} key={project.id} onClick={() => setSelectedId(project.id)} type="button">
                <div className="project-list-icon"><FolderKanban size={17} /></div>
                <div className="project-list-copy"><strong>{project.name}</strong><span>{project.description}</span><div>{project.stack.map((item) => <Pill key={item}>{item}</Pill>)}</div></div>
                <div className="project-list-meta"><Pill tone={project.status === "运行中" ? "info" : project.status === "已归档" ? "neutral" : "success"}>{project.status}</Pill><span>{project.updated}</span></div>
                <ChevronRight size={15} />
              </button>
            ))}
          </div>
        </Section>
        <Section title="项目详情" action={<Action onClick={() => setShowProjectMeta((visible) => !visible)}><MoreHorizontal size={14} /></Action>}>
          <div className="project-detail">
            <div className="project-detail-mark"><FolderKanban size={22} /></div>
            <strong>{selected.name}</strong>
            <code>{selected.id}</code>
            <p>{selected.description}</p>
            {showProjectMeta && <div className="section-note">项目标识：{selected.id} · 技术栈：{selected.stack.join(" / ")} · 当前状态：{selected.status}</div>}
            <div className="project-detail-stats">
              <div><span>执行计划</span><strong>{selected.plans}</strong></div>
              <div><span>最近更新</span><strong>{selected.updated}</strong></div>
            </div>
            <div className="project-detail-actions">
              <Action kind="primary" onClick={() => onNavigate("input")}><Plus size={14} /> 新建任务</Action>
              <Action onClick={() => onNavigate("history")}><Clock3 size={14} /> 查看历史</Action>
            </div>
          </div>
        </Section>
      </div>
      {creating && (
        <div className="project-dialog-backdrop">
          <div className="project-dialog">
            <div className="project-dialog-icon"><FolderKanban size={20} /></div>
            <strong>创建新项目</strong>
            <span>项目用于组织相关任务、计划与交付产物。</span>
            <label><small>项目名称</small><input autoFocus onChange={(event) => setProjectName(event.target.value)} placeholder="例如：智能客服平台" value={projectName} /></label>
            <div><Action onClick={() => setCreating(false)}>取消</Action><Action kind="primary" onClick={createProject}>创建项目</Action></div>
          </div>
        </div>
      )}
    </main>
  );
}

function DesignView({ onNavigate }: { onNavigate: (view: WorkspaceViewKey) => void }) {
  const [revisionDialogOpen, setRevisionDialogOpen] = useState(false);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [revisionSubmitting, setRevisionSubmitting] = useState(false);
  const [revisionSubmitted, setRevisionSubmitted] = useState(false);

  const submitRevision = () => {
    if (!revisionFeedback.trim() || revisionSubmitting) return;
    setRevisionSubmitting(true);
    window.setTimeout(() => {
      setRevisionSubmitting(false);
      setRevisionSubmitted(true);
      setRevisionDialogOpen(false);
      setRevisionFeedback("");
      window.setTimeout(() => setRevisionSubmitted(false), 1800);
    }, 900);
  };

  return (
    <main className="other-view">
      <ViewHeading
        eyebrow="DESIGN REVIEW · DES-7F2A"
        title="企业知识库 RAG 系统"
        copy="设计书已生成，请确认架构、技术栈与工具覆盖情况。"
        actions={<><Action onClick={() => setRevisionDialogOpen(true)}>{revisionSubmitted ? <CircleCheck size={14} /> : <RefreshCw className={revisionSubmitting ? "spin-slow" : ""} size={14} />} {revisionSubmitting ? "正在提交" : revisionSubmitted ? "已提交修订" : "请求修订"}</Action><Action kind="primary" onClick={() => onNavigate("plan")}><Check size={15} /> 批准并生成计划</Action></>}
      />
      <div className="view-two-columns wide-left">
        <div className="view-stack">
          <Section title="系统架构" subtitle="5 个核心组件 · 8 条数据流">
            <div className="architecture-flow">
              {[
                ["文档接入", FileText, "解析与清洗"],
                ["分块服务", Layers3, "语义切片"],
                ["向量存储", Database, "检索与过滤"],
                ["RAG API", Server, "生成与引用"],
              ].map(([title, Icon, copy], index) => {
                const Component = Icon as typeof FileText;
                return (
                  <div className="architecture-node" key={String(title)}>
                    <div className="node-icon"><Component size={18} /></div>
                    <strong>{String(title)}</strong><span>{String(copy)}</span>
                    {index < 3 && <ChevronRight className="node-arrow" size={15} />}
                  </div>
                );
              })}
            </div>
          </Section>
          <Section title="数据流" subtitle="从文件上传到带引用的回答">
            <div className="data-flow-list">
              {["文件进入解析管道并提取结构化内容", "内容按语义边界分块并生成向量", "查询经过权限过滤后召回相关片段", "模型基于上下文生成附带来源的回答"].map((item, index) => (
                <div key={item}><span>{index + 1}</span><div><strong>{item}</strong><small>{index === 2 ? "强制租户与文档级权限校验" : "自动记录输入输出与执行耗时"}</small></div></div>
              ))}
            </div>
          </Section>
        </div>
        <div className="view-stack">
          <Section title="复杂度评估">
            <div className="difficulty-card"><div><span>MEDIUM</span><strong>中等复杂度</strong></div><div className="difficulty-score">6.4</div></div>
            <p className="section-note">涉及异步文档处理、向量数据库与权限模型，但边界清晰且工具覆盖完整。</p>
          </Section>
          <Section title="技术栈">
            <div className="tag-cloud">{["FastAPI", "PostgreSQL", "pgvector", "React", "Redis", "Docker"].map((item) => <Pill key={item}>{item}</Pill>)}</div>
          </Section>
          <Section title="工具覆盖">
            <div className="coverage-row"><CircleCheck size={16} /><div><strong>6 个工具可用</strong><span>已覆盖全部执行需求</span></div><Pill tone="success">100%</Pill></div>
            <div className="tool-mini-list"><span>code_agent</span><span>shell_runner</span><span>repo_inspector</span></div>
          </Section>
        </div>
      </div>
      {revisionDialogOpen && (
        <div className="replan-dialog-backdrop">
          <div className="replan-dialog">
            <div className="replan-dialog-head">
              <div className="replan-dialog-icon"><FileText size={19} /></div>
              <div><strong>请求修订设计书</strong><span>说明需要调整的架构、技术方案或工具选择，系统会生成新的设计书版本。</span></div>
            </div>
            <label>
              <span>修订意见</span>
              <textarea autoFocus onChange={(event) => setRevisionFeedback(event.target.value)} placeholder="例如：需要增加多租户权限隔离；向量数据库改用独立 Qdrant 服务；补充大文件解析失败的降级方案……" value={revisionFeedback} />
            </label>
            <div className="replan-suggestions">
              <span>快速添加</span>
              {["调整系统架构", "更换技术栈", "补充安全策略", "降低实现复杂度"].map((suggestion) => (
                <button key={suggestion} onClick={() => setRevisionFeedback((current) => current ? `${current}\n${suggestion}` : suggestion)} type="button">{suggestion}</button>
              ))}
            </div>
            <div className="replan-impact"><AlertTriangle size={15} /><span>提交后会保留当前版本，并生成可对比的新修订版本。</span></div>
            <div className="replan-dialog-actions">
              <Action onClick={() => setRevisionDialogOpen(false)}>取消</Action>
              <Action kind="primary" onClick={submitRevision}><Sparkles size={14} /> 提交修订建议</Action>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function PlanView({ onNavigate }: { onNavigate: (view: WorkspaceViewKey) => void }) {
  const [replanDialogOpen, setReplanDialogOpen] = useState(false);
  const [replanFeedback, setReplanFeedback] = useState("");
  const [replanning, setReplanning] = useState(false);
  const [replanComplete, setReplanComplete] = useState(false);
  const [planRevision, setPlanRevision] = useState(1);
  const segments = [
    ["01", "基础设施与数据层", "2 / 2", ["初始化服务与依赖", "建立文档与权限模型"]],
    ["02", "检索增强核心", "1 / 3", ["实现文档解析管道", "实现向量检索", "实现 RAG 生成接口"]],
    ["03", "验证与交付", "0 / 2", ["执行集成测试", "生成部署与交付报告"]],
  ];
  const replan = () => {
    if (replanning || !replanFeedback.trim()) return;
    setReplanDialogOpen(false);
    setReplanning(true);
    setReplanComplete(false);
    window.setTimeout(() => {
      setPlanRevision((current) => current + 1);
      setReplanFeedback("");
      setReplanning(false);
      setReplanComplete(true);
      window.setTimeout(() => setReplanComplete(false), 1800);
    }, 1200);
  };
  return (
    <main className="other-view">
      <ViewHeading
        eyebrow="EXECUTION PLAN · A84F21C9"
        title="7 个步骤，分为 3 个执行阶段"
        copy="系统将按依赖顺序执行；高风险工具调用会在操作前请求批准。"
        actions={<><Action onClick={() => setReplanDialogOpen(true)}>{replanComplete ? <CircleCheck size={14} /> : <RefreshCw className={replanning ? "spin-slow" : ""} size={14} />} {replanning ? "正在重新规划" : replanComplete ? "已生成新版本" : "重新规划"}</Action><Action kind="primary" onClick={() => onNavigate("execution")}><Play size={14} /> 开始执行</Action></>}
      />
      <div className="plan-summary">
        <div><span>预计耗时</span><strong>12–18 分钟</strong></div>
        <div><span>执行步骤</span><strong>7</strong></div>
        <div><span>检查点</span><strong>3</strong></div>
        <div><span>当前分支</span><strong>main · v{planRevision}</strong></div>
      </div>
      <div className="plan-segments">
        {segments.map(([id, title, progress, items], segmentIndex) => (
          <section className="plan-segment" key={String(id)}>
            <div className="segment-head"><div className="segment-number">{String(id)}</div><div><strong>{String(title)}</strong><span>Segment {String(id)} · {String(progress)} 已完成</span></div><Pill tone={segmentIndex === 0 ? "success" : segmentIndex === 1 ? "info" : "neutral"}>{segmentIndex === 0 ? "已完成" : segmentIndex === 1 ? "进行中" : "等待中"}</Pill></div>
            <div className="segment-steps">
              {(items as string[]).map((item, index) => (
                <div key={item}><span className={segmentIndex === 0 || (segmentIndex === 1 && index === 0) ? "done" : ""}>{segmentIndex === 0 || (segmentIndex === 1 && index === 0) ? <Check size={13} /> : index + 1}</span><strong>{item}</strong><Pill>{index % 2 ? "code_agent" : "shell_runner"}</Pill><ChevronRight size={14} /></div>
              ))}
            </div>
          </section>
        ))}
      </div>
      {replanDialogOpen && (
        <div className="replan-dialog-backdrop">
          <div className="replan-dialog">
            <div className="replan-dialog-head">
              <div className="replan-dialog-icon"><RefreshCw size={18} /></div>
              <div><strong>提供重新规划建议</strong><span>Helm 会保留当前执行进度，并根据你的建议生成计划 v{planRevision + 1}。</span></div>
            </div>
            <label>
              <span>你希望如何调整当前计划？</span>
              <textarea autoFocus onChange={(event) => setReplanFeedback(event.target.value)} placeholder="例如：先补充权限模型设计，再实现向量检索；集成测试需要增加大文件导入场景……" value={replanFeedback} />
            </label>
            <div className="replan-suggestions">
              <span>快速建议</span>
              {["减少执行步骤", "增加测试覆盖", "调整技术方案", "优先处理高风险项"].map((suggestion) => (
                <button key={suggestion} onClick={() => setReplanFeedback((current) => current ? `${current}\n${suggestion}` : suggestion)} type="button">{suggestion}</button>
              ))}
            </div>
            <div className="replan-impact">
              <AlertTriangle size={15} />
              <span>重新规划会创建新版本；已完成步骤及其产物不会被删除。</span>
            </div>
            <div className="replan-dialog-actions">
              <Action onClick={() => setReplanDialogOpen(false)}>取消</Action>
              <Action kind="primary" onClick={replan}><Sparkles size={14} /> 根据建议重新规划</Action>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const artifacts = [
  ["retrieval-service.ts", "代码", "24.8 KB", "2 分钟前", FileCode2],
  ["architecture-report.md", "报告", "12.4 KB", "3 分钟前", FileText],
  ["rag-flow-diagram.png", "图片", "486 KB", "5 分钟前", FileImage],
  ["integration-results.json", "数据", "8.1 KB", "8 分钟前", Code2],
];

function ArtifactsView() {
  const [selected, setSelected] = useState("architecture-report.md");
  const [reportsOnly, setReportsOnly] = useState(false);
  const [fullPreview, setFullPreview] = useState(false);
  const visibleArtifacts = reportsOnly ? artifacts.filter((artifact) => artifact[1] === "报告") : artifacts;
  return (
    <main className="other-view">
      <ViewHeading eyebrow="DELIVERABLES" title="产物库" copy="浏览、预览和导出当前任务生成的所有文件。" actions={<Action kind="primary" onClick={() => downloadText("helm-deliverables.txt", artifacts.map((artifact) => artifact.slice(0, 4).join(" · ")).join("\n"))}><Download size={14} /> 导出交付包</Action>} />
      <div className="artifact-layout">
        <Section title="所有产物" subtitle={`${visibleArtifacts.length} 个文件 · 531.3 KB`} action={<Action onClick={() => setReportsOnly((active) => !active)}><SlidersHorizontal size={14} /> {reportsOnly ? "显示全部" : "仅看报告"}</Action>}>
          <div className="artifact-list">
            {visibleArtifacts.map(([name, type, size, time, Icon]) => {
              const Component = Icon as typeof FileText;
              return <button className={selected === name ? "selected" : ""} key={String(name)} onClick={() => setSelected(String(name))} type="button"><div className="file-icon"><Component size={18} /></div><div><strong>{String(name)}</strong><span>{String(type)} · {String(size)}</span></div><span>{String(time)}</span><MoreHorizontal size={15} /></button>;
            })}
          </div>
        </Section>
        <Section title="快速预览" action={<Action onClick={() => setFullPreview((visible) => !visible)}><ExternalLink size={14} /> {fullPreview ? "收起" : "打开"}</Action>}>
          <div className="artifact-preview">
            <div className="preview-doc-icon"><FileText size={27} /></div>
            <strong>{selected}</strong>
            <span>由步骤 05 · report_writer 生成</span>
            <div className="preview-lines"><i /><i /><i /><i /></div>
            {fullPreview && <p className="section-note">该产物已通过完整性校验，包含架构摘要、接口设计、执行结果与可追溯引用。当前原型展示的是结构化内容预览。</p>}
            <Action onClick={() => setFullPreview((visible) => !visible)}><Eye size={14} /> {fullPreview ? "关闭完整内容" : "查看完整内容"}</Action>
          </div>
        </Section>
      </div>
    </main>
  );
}

function AgentsView() {
  const sessions = [
    ["code_agent", "正在运行", "8", "3", "7,846", "02:14"],
    ["repo_inspector", "已完成", "4", "12", "2,148", "00:18"],
    ["design_agent", "已完成", "6", "2", "4,921", "00:46"],
  ];
  return (
    <main className="other-view">
      <ViewHeading eyebrow="AGENT TELEMETRY" title="Agent 记录" copy="查看每个 Agent 的模型调用、工具使用与逐轮推理结果。" />
      <div className="agent-metrics">
        {[["总会话", "3", Bot], ["模型调用", "18", Cpu], ["工具调用", "17", Wrench], ["Token", "14,915", Zap]].map(([label, value, Icon]) => {
          const Component = Icon as typeof Bot;
          return <div key={String(label)}><Component size={17} /><span>{String(label)}</span><strong>{String(value)}</strong></div>;
        })}
      </div>
      <Section title="会话列表" subtitle="当前计划的全部 Agent 会话">
        <div className="data-table agent-table">
          <div className="table-head"><span>AGENT</span><span>状态</span><span>轮次</span><span>工具调用</span><span>TOKEN</span><span>耗时</span><span /></div>
          {sessions.map((row, index) => <div className="table-row" key={row[0]}><span className="agent-name"><span className="agent-symbol"><Bot size={14} /></span><strong>{row[0]}</strong></span><span><Pill tone={index === 0 ? "info" : "success"}>{row[1]}</Pill></span>{row.slice(2).map((cell) => <span key={cell}>{cell}</span>)}<span><ChevronRight size={14} /></span></div>)}
        </div>
      </Section>
      <Section title="最近活动" subtitle="code_agent · 当前会话">
        <div className="turn-timeline">
          {["分析现有服务结构与依赖边界", "生成向量检索适配器", "执行类型检查与接口验证"].map((item, index) => <div key={item}><span>{index + 6}</span><div><strong>{item}</strong><small>{index === 2 ? "运行中 · 1,204 tokens" : `完成 · ${24 + index * 11}.2s`}</small></div><Pill tone={index === 2 ? "info" : "success"}>{index === 2 ? "RUNNING" : "SUCCESS"}</Pill></div>)}
        </div>
      </Section>
    </main>
  );
}

const tools: Array<[string, string, string, LucideIcon, string]> = [
  ["code_agent", "代码生成", "读取、编辑和验证项目代码", Code2, "generation"],
  ["repo_inspector", "仓库分析", "分析目录结构、依赖与技术栈", Search, "search"],
  ["shell_runner", "命令执行", "在隔离环境运行安全命令", Server, "other"],
  ["report_writer", "报告生成", "生成结构化交付与审计报告", FileText, "generation"],
  ["web_search", "网络检索", "搜索并提取公开网页信息", Network, "search"],
  ["image_builder", "图像处理", "生成、转换与优化图片资源", FileImage, "generation"],
];

function ToolsView() {
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"library" | "store" | "settings">("library");
  const [category, setCategory] = useState("全部");
  const [selectedPlugin, setSelectedPlugin] = useState("GitHub");
  const [pluginSaved, setPluginSaved] = useState(false);
  const [customBackground, setCustomBackground] = useState(
    () => window.localStorage.getItem("helm-tools-background") || "",
  );
  const [backgroundError, setBackgroundError] = useState("");
  const [installedTools, setInstalledTools] = useState<string[]>(() => {
    try {
      return JSON.parse(window.localStorage.getItem("helm-installed-store-tools") || '["GitHub"]') as string[];
    } catch {
      return ["GitHub"];
    }
  });
  const [pluginSettings, setPluginSettings] = useState<Record<string, { enabled: boolean; autoLoad: boolean; endpoint: string; scope: string }>>(() => {
    try {
      return JSON.parse(window.localStorage.getItem("helm-plugin-settings") || "{}") as Record<string, { enabled: boolean; autoLoad: boolean; endpoint: string; scope: string }>;
    } catch {
      return {};
    }
  });
  const storeTools = [
    { name: "GitHub", category: "开发", description: "读取仓库、管理 Issue 与 Pull Request，并同步提交状态。", icon: GitBranch, installs: "12.8k", verified: true },
    { name: "PostgreSQL", category: "数据", description: "安全查询数据库结构与数据，支持只读策略和审计记录。", icon: Database, installs: "8.4k", verified: true },
    { name: "Web Search", category: "研究", description: "检索公开网页并提取带来源的结构化信息。", icon: Search, installs: "21.6k", verified: true },
    { name: "Slack", category: "协作", description: "发送执行通知、读取频道上下文并创建工作流提醒。", icon: MessageSquare, installs: "6.2k", verified: false },
    { name: "S3 Storage", category: "数据", description: "上传、下载与管理对象存储中的任务产物。", icon: Archive, installs: "5.9k", verified: true },
    { name: "Playwright", category: "开发", description: "运行浏览器自动化、界面回归与端到端验收测试。", icon: Play, installs: "9.7k", verified: true },
  ];
  const filtered = useMemo(() => tools.filter((tool) => tool[0].includes(query) || tool[1].includes(query)), [query]);
  const filteredStoreTools = storeTools.filter((tool) => {
    const normalizedQuery = query.trim().toLowerCase();
    const matchesCategory = category === "全部" || tool.category === category;
    return matchesCategory && (!normalizedQuery || tool.name.toLowerCase().includes(normalizedQuery) || tool.description.toLowerCase().includes(normalizedQuery));
  });
  const loadedPlugins = storeTools.filter((tool) => installedTools.includes(tool.name) && (!query || tool.name.toLowerCase().includes(query.toLowerCase())));
  const selectedStoreTool = storeTools.find((tool) => tool.name === selectedPlugin) || storeTools[0];
  const SelectedPluginIcon = selectedStoreTool.icon;
  const currentPluginSettings = pluginSettings[selectedPlugin] || {
    enabled: true,
    autoLoad: true,
    endpoint: selectedPlugin === "GitHub" ? "https://api.github.com" : selectedPlugin === "PostgreSQL" ? "postgresql://localhost:5432" : "",
    scope: "当前工作区",
  };

  const installStoreTool = (name: string) => {
    setInstalledTools((current) => {
      const next = current.includes(name) ? current : [...current, name];
      window.localStorage.setItem("helm-installed-store-tools", JSON.stringify(next));
      return next;
    });
    setSelectedPlugin(name);
    setMode("settings");
  };

  const openPluginSettings = (name: string) => {
    setSelectedPlugin(name);
    setMode("settings");
  };

  const updatePluginSettings = (next: Partial<typeof currentPluginSettings>) => {
    setPluginSettings((current) => ({
      ...current,
      [selectedPlugin]: { ...currentPluginSettings, ...next },
    }));
    setPluginSaved(false);
  };

  const savePluginSettings = () => {
    const next = { ...pluginSettings, [selectedPlugin]: currentPluginSettings };
    setPluginSettings(next);
    window.localStorage.setItem("helm-plugin-settings", JSON.stringify(next));
    setPluginSaved(true);
    window.setTimeout(() => setPluginSaved(false), 1600);
  };

  const uninstallPlugin = () => {
    setInstalledTools((current) => {
      const next = current.filter((tool) => tool !== selectedPlugin);
      window.localStorage.setItem("helm-installed-store-tools", JSON.stringify(next));
      return next;
    });
    setMode("library");
  };

  const uploadBackground = (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setBackgroundError("请选择图片文件");
      return;
    }
    if (file.size > 2_500_000) {
      setBackgroundError("图片大小不能超过 2.5 MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = String(reader.result);
      try {
        window.localStorage.setItem("helm-tools-background", image);
        setCustomBackground(image);
        setBackgroundError("");
      } catch {
        setBackgroundError("图片无法保存，请选择更小的文件");
      }
    };
    reader.onerror = () => setBackgroundError("图片读取失败，请重试");
    reader.readAsDataURL(file);
  };

  const removeBackground = () => {
    window.localStorage.removeItem("helm-tools-background");
    setCustomBackground("");
    setBackgroundError("");
  };

  return (
    <main
      className={`other-view tools-view ${customBackground ? "has-custom-background" : ""}`}
      style={customBackground ? ({ "--tools-background-image": `url(${customBackground})` } as React.CSSProperties) : undefined}
    >
      <ViewHeading
        eyebrow="CAPABILITY LIBRARY"
        title={mode === "library" ? "工具库" : mode === "store" ? "工具商店" : `${selectedPlugin} 插件设置`}
        copy={mode === "library" ? "查看 Helm 可调用的工具、能力边界与运行要求。" : mode === "store" ? "发现并安装可扩展 Agent 能力的工具与服务连接。" : "配置插件连接、加载方式、权限范围与运行状态。"}
        actions={(
          <>
            {mode === "settings" ? (
              <Action onClick={() => setMode("library")}><ChevronRight size={14} /> 返回工具库</Action>
            ) : (
              <>
                <Action kind={mode === "library" ? "primary" : "quiet"} onClick={() => { setMode("library"); setQuery(""); }}>
                  <Wrench size={14} /> 已安装工具
                </Action>
                <Action kind={mode === "store" ? "primary" : "quiet"} onClick={() => { setMode("store"); setQuery(""); }}>
                  <Boxes size={14} /> 工具商店
                </Action>
              </>
            )}
          </>
        )}
      />
      <div className="tools-background-controls">
        <div><FileImage size={15} /><span><strong>自定义背景</strong><small>上传图片后会保留现有光晕与点阵效果</small></span></div>
        {backgroundError && <span className="tools-background-error">{backgroundError}</span>}
        <label className="view-action quiet">
          <Upload size={14} /> {customBackground ? "更换图片" : "上传图片"}
          <input accept="image/*" onChange={(event) => { uploadBackground(event.target.files?.[0]); event.target.value = ""; }} type="file" />
        </label>
        {customBackground && <Action onClick={removeBackground}><Trash2 size={14} /> 移除图片</Action>}
      </div>
      {mode === "library" ? (
        <>
          <div className="view-filterbar"><label><Search size={14} /><input onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具..." value={query} /></label><span>{filtered.length} 个工具可用</span></div>
          <div className="tool-grid">
            {filtered.map(([id, name, description, Icon, toolCategory]) => {
              const Component = Icon as typeof Wrench;
              return <article className="tool-card" key={String(id)}><div className="tool-card-head"><div className="tool-card-icon"><Component size={19} /></div><Pill tone="success"><span className="tiny-dot" /> 可用</Pill></div><strong>{String(name)}</strong><code>{String(id)}</code><p>{String(description)}</p><div className="tool-card-foot"><Pill>{String(toolCategory)}</Pill><span>3 项能力</span><ChevronRight size={14} /></div></article>;
            })}
          </div>
          <Section title="已加载插件" subtitle={`${installedTools.length} 个插件已加载到工具库`}>
            {loadedPlugins.length > 0 ? (
              <div className="loaded-plugin-list">
                {loadedPlugins.map((tool) => {
                  const Icon = tool.icon;
                  const settings = pluginSettings[tool.name];
                  return (
                    <div className="loaded-plugin-row" key={tool.name}>
                      <div className="tool-store-card-icon"><Icon size={18} /></div>
                      <div><strong>{tool.name}</strong><span>{tool.description}</span></div>
                      <Pill tone={settings?.enabled === false ? "neutral" : "success"}>{settings?.enabled === false ? "已停用" : "已加载"}</Pill>
                      <Action onClick={() => openPluginSettings(tool.name)}><Settings2 size={14} /> 插件设置</Action>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="loaded-plugin-empty"><Boxes size={18} /><span>没有匹配的已加载插件</span></div>
            )}
          </Section>
        </>
      ) : mode === "store" ? (
        <>
          <div className="tool-store-hero">
            <div><div className="tool-store-icon"><Boxes size={21} /></div><div><strong>Helm 工具商店</strong><span>经过验证的工具可直接添加到 Agent 工作流。</span></div></div>
            <Pill tone="success">{installedTools.length} 个已安装</Pill>
          </div>
          <div className="tool-store-toolbar">
            <label><Search size={14} /><input onChange={(event) => setQuery(event.target.value)} placeholder="搜索工具与能力..." value={query} /></label>
            <div>
              {["全部", "开发", "数据", "研究", "协作"].map((item) => (
                <Action key={item} kind={category === item ? "primary" : "quiet"} onClick={() => setCategory(item)}>{item}</Action>
              ))}
            </div>
          </div>
          <div className="tool-store-grid">
            {filteredStoreTools.map((tool) => {
              const Icon = tool.icon;
              const installed = installedTools.includes(tool.name);
              return (
                <div className="tool-store-card" key={tool.name}>
                  <div className="tool-store-card-head"><div className="tool-store-card-icon"><Icon size={19} /></div><Pill tone={tool.verified ? "success" : "neutral"}>{tool.verified ? "已验证" : "社区"}</Pill></div>
                  <strong>{tool.name}</strong><span className="tool-store-category">{tool.category}</span>
                  <p>{tool.description}</p>
                  <div className="tool-store-card-foot"><small>{tool.installs} 次安装</small><Action kind={installed ? "quiet" : "primary"} onClick={() => installed ? openPluginSettings(tool.name) : installStoreTool(tool.name)}>{installed ? <><Settings2 size={14} /> 设置</> : <><Download size={14} /> 安装</>}</Action></div>
                </div>
              );
            })}
          </div>
          {filteredStoreTools.length === 0 && <div className="tool-store-empty"><Search size={20} /><strong>没有找到匹配的工具</strong><span>尝试更换分类或搜索关键词。</span></div>}
        </>
      ) : (
        <div className="plugin-settings-layout">
          <Section
            title={`${selectedStoreTool.name} 插件`}
            subtitle={selectedStoreTool.description}
            action={<Pill tone={currentPluginSettings.enabled ? "success" : "neutral"}>{currentPluginSettings.enabled ? "运行中" : "已停用"}</Pill>}
          >
            <div className="plugin-settings-summary">
              <div className="tool-store-card-icon"><SelectedPluginIcon size={20} /></div>
              <div><strong>{selectedStoreTool.name}</strong><span>{selectedStoreTool.verified ? "Helm 已验证插件" : "社区插件"} · {selectedStoreTool.category}</span></div>
              <button className={`switch ${currentPluginSettings.enabled ? "on" : ""}`} onClick={() => updatePluginSettings({ enabled: !currentPluginSettings.enabled })} type="button"><i /></button>
            </div>
          </Section>
          <Section title="连接设置" subtitle="该配置仅供当前插件使用">
            <div className="plugin-settings-form">
              <label><span>服务端点</span><input onChange={(event) => updatePluginSettings({ endpoint: event.target.value })} placeholder="输入插件服务地址" value={currentPluginSettings.endpoint} /></label>
              <label><span>授权范围</span><select onChange={(event) => updatePluginSettings({ scope: event.target.value })} value={currentPluginSettings.scope}><option>当前工作区</option><option>当前项目</option><option>所有项目</option></select></label>
            </div>
          </Section>
          <Section title="加载行为" subtitle="控制插件在 Agent 会话中的可用方式">
            <div className="plugin-loading-row">
              <div><strong>启动时自动加载</strong><span>进入工作区后自动注册插件能力，无需手动激活。</span></div>
              <button className={`switch ${currentPluginSettings.autoLoad ? "on" : ""}`} onClick={() => updatePluginSettings({ autoLoad: !currentPluginSettings.autoLoad })} type="button"><i /></button>
            </div>
          </Section>
          <div className="plugin-settings-actions">
            <Action kind="danger" onClick={uninstallPlugin}><Trash2 size={14} /> 卸载插件</Action>
            <Action kind="primary" onClick={savePluginSettings}><Save size={14} /> {pluginSaved ? "已保存" : "保存插件设置"}</Action>
          </div>
        </div>
      )}
    </main>
  );
}

function HistoryView({ onNavigate }: { onNavigate: (view: WorkspaceViewKey) => void }) {
  const [statusFilter, setStatusFilter] = useState<"全部" | "运行中" | "已完成" | "已暂停">("全部");
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const rows = [
    ["企业知识库 RAG 系统", "A84F21C9", "运行中", "今天 14:32", "3 / 5"],
    ["电商数据分析仪表盘", "91BD38E2", "已完成", "昨天 18:06", "8 / 8"],
    ["客服工单分类服务", "C02A77F1", "已暂停", "5月18日", "4 / 7"],
    ["营销落地页生成器", "E318AC40", "已归档", "5月16日", "6 / 6"],
  ];
  const visibleRows = rows.filter((row) => {
    if (!showArchived && row[2] === "已归档") return false;
    return statusFilter === "全部" || row[2] === statusFilter;
  });

  return (
    <main className="other-view">
      <ViewHeading eyebrow="WORKSPACE HISTORY" title="历史记录" copy="浏览和恢复过往设计书与执行计划。" actions={<Action kind="primary" onClick={() => onNavigate("input")}><Plus size={14} /> 新建任务</Action>} />
      <div className="view-filterbar">
        <label><Search size={14} /><input placeholder="搜索任务或 Plan ID..." /></label>
        <div className="history-filter-control">
          <Action kind={statusFilter === "全部" ? "quiet" : "primary"} onClick={() => setStatusMenuOpen((open) => !open)}>
            <SlidersHorizontal size={14} /> {statusFilter === "全部" ? "状态" : statusFilter}
          </Action>
          {statusMenuOpen && (
            <div className="history-status-menu">
              {(["全部", "运行中", "已完成", "已暂停"] as const).map((status) => (
                <Action
                  key={status}
                  kind={statusFilter === status ? "primary" : "quiet"}
                  onClick={() => {
                    setStatusFilter(status);
                    setStatusMenuOpen(false);
                  }}
                >
                  {status === "全部" ? "全部状态" : status}
                </Action>
              ))}
            </div>
          )}
        </div>
        <Action kind={showArchived ? "primary" : "quiet"} onClick={() => setShowArchived((visible) => !visible)}>
          <Archive size={14} /> {showArchived ? "隐藏归档" : "显示归档"}
        </Action>
      </div>
      <Section title="最近任务" subtitle="共 12 个计划">
        <div className="data-table history-table">
          <div className="table-head"><span>任务</span><span>PLAN ID</span><span>状态</span><span>更新时间</span><span>进度</span><span /></div>
          {visibleRows.map((row) => <div className="table-row" key={row[1]}><span><strong>{row[0]}</strong><small>{row[1] === "A84F21C9" ? "FastAPI · React · pgvector" : "由完整工作流创建"}</small></span><span><code>{row[1]}</code></span><span><Pill tone={row[2] === "运行中" ? "info" : row[2] === "已完成" ? "success" : "neutral"}>{row[2]}</Pill></span><span>{row[3]}</span><span>{row[4]}</span><span><MoreHorizontal size={15} /></span></div>)}
        </div>
      </Section>
    </main>
  );
}

function AuditView() {
  const [blockedOnly, setBlockedOnly] = useState(false);
  const [recentOnly, setRecentOnly] = useState(true);
  const events = [
    ["14:35:08", "code_agent", "write_file", "允许", "system", "src/services/retrieval.ts"],
    ["14:34:52", "shell_runner", "execute", "允许", "user", "pnpm run typecheck"],
    ["14:32:44", "desktop_agent", "screenshot", "阻止", "policy", "桌面范围未确认"],
    ["14:32:21", "repo_inspector", "read_tree", "允许", "system", "frontend/src"],
  ];
  const visibleEvents = events.filter((event, index) => (!blockedOnly || event[3] === "阻止") && (!recentOnly || index < 3));
  return (
    <main className="other-view">
      <ViewHeading eyebrow="SECURITY & GOVERNANCE" title="审计日志" copy="追踪工具调用、安全策略与人工审批决定。" actions={<Action onClick={() => downloadText("helm-audit-log.csv", ["时间,工具,指令,决定,Actor,详情", ...events.map((event) => event.join(","))].join("\n"))}><Download size={14} /> 导出日志</Action>} />
      <div className="audit-summary"><div><ShieldCheck size={18} /><span>允许操作<strong>28</strong></span></div><div><ShieldAlert size={18} /><span>阻止操作<strong>1</strong></span></div><div><Clock3 size={18} /><span>待审批<strong>0</strong></span></div></div>
      <div className="view-filterbar"><label><Search size={14} /><input placeholder="搜索工具、指令或 Actor..." /></label><Action onClick={() => setBlockedOnly((active) => !active)}><SlidersHorizontal size={14} /> {blockedOnly ? "全部决定" : "仅看阻止"}</Action><Action onClick={() => setRecentOnly((active) => !active)}><Clock3 size={14} /> {recentOnly ? "最近 24 小时" : "全部时间"}</Action></div>
      <Section title="安全事件" subtitle="按时间倒序显示">
        <div className="data-table audit-table">
          <div className="table-head"><span>时间</span><span>工具</span><span>指令</span><span>决定</span><span>ACTOR</span><span>详情</span></div>
          {visibleEvents.map((row) => <div className={`table-row ${row[3] === "阻止" ? "blocked" : ""}`} key={`${row[0]}${row[1]}`}><span>{row[0]}</span><span><strong>{row[1]}</strong></span><span><code>{row[2]}</code></span><span><Pill tone={row[3] === "阻止" ? "danger" : "success"}>{row[3]}</Pill></span><span>{row[4]}</span><span>{row[5]}</span></div>)}
        </div>
      </Section>
    </main>
  );
}

function SystemView() {
  const [refreshed, setRefreshed] = useState(false);
  const [serviceDetails, setServiceDetails] = useState(false);
  const [allKeys, setAllKeys] = useState(false);
  const [notificationSent, setNotificationSent] = useState(false);
  return (
    <main className="other-view">
      <ViewHeading eyebrow="SYSTEM OVERVIEW" title="系统概览" copy="模型用量、能力、密钥与服务健康状态。" actions={<><Pill tone="success"><span className="tiny-dot" /> 所有服务正常</Pill><Action onClick={() => { setRefreshed(true); window.setTimeout(() => setRefreshed(false), 1400); }}><RefreshCw className={refreshed ? "spin-slow" : ""} size={14} /> {refreshed ? "已刷新" : "刷新"}</Action></>} />
      <div className="system-metrics">
        {[["本月模型调用", "1,284", "+12.6%", Cpu], ["Token 用量", "2.48M", "预算 62%", Zap], ["活跃技能", "18", "2 个已跳过", Sparkles], ["对话会话", "46", "本周 +8", MessageSquare]].map(([label, value, detail, Icon]) => {
          const Component = Icon as typeof Cpu;
          return <div key={String(label)}><div className="system-metric-head"><Component size={17} /><span>{String(label)}</span></div><strong>{String(value)}</strong><small>{String(detail)}</small></div>;
        })}
      </div>
      <div className="view-two-columns">
        <Section title="Token 预算" subtitle="本月各阶段消耗">
          <div className="budget-chart">
            {[["执行", 72], ["设计", 44], ["规划", 31], ["对话", 18]].map(([label, value]) => <div key={String(label)}><span>{String(label)}</span><div><i className={`budget-${value}`} /></div><strong>{String(value)}%</strong></div>)}
          </div>
        </Section>
        <Section title="服务状态" action={<Action onClick={() => setServiceDetails((visible) => !visible)}><Settings2 size={14} /> {serviceDetails ? "收起" : "管理"}</Action>}>
          <div className="service-list">
            {[["API 服务", "24ms"], ["WebSocket", "在线"], ["任务执行器", "2 个运行中"], ["PostgreSQL", "健康"]].map(([name, detail]) => <div key={name}><span className="tiny-dot" /><strong>{name}</strong><span>{detail}</span></div>)}
          </div>
          {serviceDetails && <div className="section-note">服务由本地 Helm Runtime 管理，健康检查间隔为 30 秒，异常时会自动重连并写入审计日志。</div>}
        </Section>
        <Section title="密钥健康度" action={<Action onClick={() => setAllKeys((visible) => !visible)}>{allKeys ? "收起" : "查看全部"}</Action>}>
          <div className="secret-list"><div><KeyRound size={16} /><strong>OpenAI</strong><Pill tone="success">已配置</Pill></div><div><KeyRound size={16} /><strong>Anthropic</strong><Pill tone="success">已配置</Pill></div><div><KeyRound size={16} /><strong>通知服务</strong><Pill>未配置</Pill></div></div>
          {allKeys && <div className="section-note">共检测 3 项凭证：2 项有效，1 项未配置，0 项即将过期。</div>}
        </Section>
        <Section title="通知渠道" action={<Action onClick={() => { setNotificationSent(true); window.setTimeout(() => setNotificationSent(false), 1600); }}><Bell size={14} /> {notificationSent ? "测试已发送" : "发送测试"}</Action>}>
          <div className="notification-card"><div className="notification-icon"><Bell size={18} /></div><div><strong>桌面通知</strong><span>{notificationSent ? "刚刚发送测试通知 · 成功" : "最近测试：今天 13:28 · 成功"}</span></div><Pill tone="success">正常</Pill></div>
        </Section>
      </div>
    </main>
  );
}

type PreferenceSection = "general" | "terminal" | "network" | "updates" | "notifications" | "interaction" | "data";

type PreferenceSettings = {
  locale: "zh-CN" | "en-US" | "system";
  inheritProfile: boolean;
  terminalFont: string;
  shell: string;
  enhancedFind: boolean;
  enhancedGrep: boolean;
  httpProxy: string;
  noProxy: string;
  certificatePath: string;
  previewUpdates: boolean;
  autoUpdate: boolean;
  hardwareAcceleration: boolean;
  closeToTray: boolean;
  preventSleep: boolean;
  notifications: boolean;
  notificationSound: boolean;
  notifyCompleted: boolean;
  notifyFailed: boolean;
  notifyApproval: boolean;
  interactionBehavior: "queue" | "next-round";
  autoContinue: boolean;
  autoContinueMinutes: number;
  preserveModelIO: boolean;
  showReasoning: boolean;
  showTodos: boolean;
  groupExplore: boolean;
  groupTerminal: boolean;
  groupChanges: boolean;
  autoArchive: boolean;
  retentionDays: number;
  storagePath: string;
  improveExperience: boolean;
};

const defaultPreferences: PreferenceSettings = {
  locale: "zh-CN",
  inheritProfile: true,
  terminalFont: "",
  shell: "auto",
  enhancedFind: true,
  enhancedGrep: true,
  httpProxy: "",
  noProxy: "localhost,127.0.0.1,::1",
  certificatePath: "",
  previewUpdates: false,
  autoUpdate: true,
  hardwareAcceleration: true,
  closeToTray: false,
  preventSleep: true,
  notifications: true,
  notificationSound: true,
  notifyCompleted: true,
  notifyFailed: true,
  notifyApproval: true,
  interactionBehavior: "queue",
  autoContinue: false,
  autoContinueMinutes: 5,
  preserveModelIO: false,
  showReasoning: true,
  showTodos: true,
  groupExplore: true,
  groupTerminal: true,
  groupChanges: true,
  autoArchive: true,
  retentionDays: 7,
  storagePath: "C:\\Users\\tortl\\.zcode\\v2",
  improveExperience: false,
};

function loadPreferences(): PreferenceSettings {
  try {
    const saved = window.localStorage.getItem("helm-preferences");
    return saved ? { ...defaultPreferences, ...JSON.parse(saved) } : defaultPreferences;
  } catch {
    return defaultPreferences;
  }
}

function PreferenceSwitch({
  checked,
  disabled = false,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}) {
  return <button aria-pressed={checked} className={`switch preference-switch ${checked ? "on" : ""}`} disabled={disabled} onClick={onChange} type="button"><i /></button>;
}

function PreferenceRow({
  title,
  description,
  badge,
  disabled = false,
  control,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  disabled?: boolean;
  control?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className={`preference-row ${disabled ? "disabled" : ""}`}>
      <div className="preference-row-main">
        <div><strong>{title}</strong>{badge && <Pill tone={badge === "需要重启" ? "info" : "neutral"}>{badge}</Pill>}<span>{description}</span></div>
        {control}
      </div>
      {children && <div className="preference-row-detail">{children}</div>}
    </div>
  );
}

type AppearanceSettings = {
  theme: "dark" | "light";
  fontSize: "compact" | "default" | "large";
  background: "aurora" | "plain" | "grid";
  contrast: "standard" | "high";
};

function ConfigView({
  appearance,
  onAppearanceChange,
}: {
  appearance: AppearanceSettings;
  onAppearanceChange: (next: Partial<AppearanceSettings>) => void;
}) {
  const [activeTab, setActiveTab] = useState<"providers" | "routing" | "keys" | "service" | "policy" | "appearance" | "agents" | "preferences">("providers");
  const [preferenceSection, setPreferenceSection] = useState<PreferenceSection>("general");
  const [preferences, setPreferences] = useState<PreferenceSettings>(loadPreferences);
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateChecked, setUpdateChecked] = useState(false);
  const [notificationTested, setNotificationTested] = useState(false);
  const [guideOpened, setGuideOpened] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedProvider, setExpandedProvider] = useState("OpenAI");
  const [testingProvider, setTestingProvider] = useState("");
  const [addingProvider, setAddingProvider] = useState(false);
  const [keyVisible, setKeyVisible] = useState("");
  const [apiKeys, setApiKeys] = useState([
    ["OPENAI_API_KEY", "OpenAI", "sk-proj-••••••••••••7Qx2", "今天 14:22"],
    ["ANTHROPIC_API_KEY", "Anthropic", "sk-ant-••••••••••••K91m", "昨天 09:16"],
    ["NOTIFY_WEBHOOK", "通知服务", "尚未配置", "—"],
  ]);
  const [restarting, setRestarting] = useState(false);
  const [policies, setPolicies] = useState({ approvals: true, offlineGuard: true, worktree: true, notifications: false });
  const [selectedAgent, setSelectedAgent] = useState("research-agent");
  const [agentName, setAgentName] = useState("研究智能体");
  const [agentIdDraft, setAgentIdDraft] = useState("research-agent");
  const [agentPrompt, setAgentPrompt] = useState("你是一名资深技术研究 Agent。分析任务上下文，优先核实事实，并输出带来源的结构化结论。");
  const [agentTools, setAgentTools] = useState({ search: true, code: false, shell: false, files: true });
  const [customTheme, setCustomTheme] = useState(() => {
    try {
      const stored = window.localStorage.getItem("helm-custom-theme");
      return stored ? JSON.parse(stored) as { accent: string; background: string; surface: string; text: string } : {
        accent: "#64e6bd",
        background: "#090b0f",
        surface: "#0e1117",
        text: "#f1f4f8",
      };
    } catch {
      return { accent: "#64e6bd", background: "#090b0f", surface: "#0e1117", text: "#f1f4f8" };
    }
  });
  const [customThemeActive, setCustomThemeActive] = useState(
    () => window.localStorage.getItem("helm-custom-theme-active") === "true",
  );
  const agentProfiles = {
    "research-agent": {
      name: "研究智能体",
      prompt: "你是一名资深技术研究 Agent。分析任务上下文，优先核实事实，并输出带来源的结构化结论。",
      primary: "gpt-4.1",
      fallback: "claude-sonnet-4",
      tools: { search: true, code: false, shell: false, files: true },
    },
    "code-reviewer": {
      name: "代码审查智能体",
      prompt: "你是一名严格的代码审查 Agent。检查正确性、安全性、性能与可维护性，并按照风险等级给出可执行的修改建议。",
      primary: "claude-sonnet-4",
      fallback: "gpt-4.1",
      tools: { search: false, code: true, shell: true, files: true },
    },
    "delivery-agent": {
      name: "交付智能体",
      prompt: "你是一名软件交付 Agent。整理执行产物、验证交付完整性，并生成清晰、可追溯的部署与验收报告。",
      primary: "gpt-4.1-mini",
      fallback: "claude-haiku",
      tools: { search: false, code: false, shell: false, files: true },
    },
  } as const;
  const [providers, setProviders] = useState([
    ["OpenAI", "https://api.openai.com/v1", "gpt-4.1", "已连接"],
    ["Anthropic", "https://api.anthropic.com", "claude-sonnet-4", "已连接"],
    ["Ollama", "http://localhost:11434", "qwen3:14b", "未探测"],
  ]);
  const tabs = [
    ["providers", "模型供应商", Cpu],
    ["routing", "角色路由", GitBranch],
    ["keys", "API 密钥", KeyRound],
    ["service", "服务连接", Server],
    ["policy", "执行策略", ShieldCheck],
    ["appearance", "主题与显示", Palette],
    ["agents", "高级智能体", Bot],
    ["preferences", "应用偏好", SlidersHorizontal],
  ] as const;

  const save = () => {
    window.localStorage.setItem("helm-preferences", JSON.stringify(preferences));
    setDirty(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  };

  const testProvider = (name: string) => {
    setTestingProvider(name);
    window.setTimeout(() => setTestingProvider(""), 1200);
  };

  const restart = () => {
    setRestarting(true);
    window.setTimeout(() => setRestarting(false), 1600);
  };

  const togglePolicy = (key: keyof typeof policies) => {
    setPolicies((current) => ({ ...current, [key]: !current[key] }));
    setDirty(true);
  };

  const updatePreference = <K extends keyof PreferenceSettings>(key: K, value: PreferenceSettings[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  const checkForUpdates = () => {
    setCheckingUpdates(true);
    setUpdateChecked(false);
    window.setTimeout(() => {
      setCheckingUpdates(false);
      setUpdateChecked(true);
    }, 900);
  };

  const testNotification = () => {
    setNotificationTested(true);
    window.setTimeout(() => setNotificationTested(false), 1800);
  };

  const selectAgent = (id: keyof typeof agentProfiles) => {
    const profile = agentProfiles[id];
    setSelectedAgent(id);
    setAgentName(profile.name);
    setAgentIdDraft(id);
    setAgentPrompt(profile.prompt);
    setAgentTools({ ...profile.tools });
  };

  useEffect(() => {
    const shell = document.getElementById("app-shell");
    if (!shell || !customThemeActive) return;

    shell.style.setProperty("--brand", customTheme.accent);
    shell.style.setProperty("--brand-soft", `color-mix(in srgb, ${customTheme.accent} 12%, transparent)`);
    shell.style.setProperty("--bg", customTheme.background);
    shell.style.setProperty("--panel", customTheme.surface);
    shell.style.setProperty("--panel-soft", `color-mix(in srgb, ${customTheme.surface} 88%, ${customTheme.text})`);
    shell.style.setProperty("--panel-raised", `color-mix(in srgb, ${customTheme.surface} 78%, ${customTheme.text})`);
    shell.style.setProperty("--line", `color-mix(in srgb, ${customTheme.surface} 72%, ${customTheme.text})`);
    shell.style.setProperty("--line-soft", `color-mix(in srgb, ${customTheme.surface} 82%, ${customTheme.text})`);
    shell.style.setProperty("--text", customTheme.text);
    shell.style.setProperty("--muted", `color-mix(in srgb, ${customTheme.text} 62%, ${customTheme.background})`);
    shell.style.setProperty("--subtle", `color-mix(in srgb, ${customTheme.text} 42%, ${customTheme.background})`);
  }, [customTheme, customThemeActive]);

  const applyCustomTheme = () => {
    window.localStorage.setItem("helm-custom-theme", JSON.stringify(customTheme));
    window.localStorage.setItem("helm-custom-theme-active", "true");
    setCustomThemeActive(true);
    setDirty(true);
  };

  const disableCustomTheme = () => {
    const shell = document.getElementById("app-shell");
    ["--brand", "--brand-soft", "--bg", "--panel", "--panel-soft", "--panel-raised", "--line", "--line-soft", "--text", "--muted", "--subtle"].forEach((property) => {
      shell?.style.removeProperty(property);
    });
    window.localStorage.setItem("helm-custom-theme-active", "false");
    setCustomThemeActive(false);
  };

  const updateCustomTheme = (key: keyof typeof customTheme, value: string) => {
    setCustomTheme((current) => ({ ...current, [key]: value }));
    setDirty(true);
  };

  return (
    <main className="other-view config-view">
      <ViewHeading
        eyebrow="SYSTEM CONFIGURATION · REVISION 24"
        title="系统设置"
        copy="管理模型供应商、角色路由、访问凭证、服务连接与执行安全策略。"
        actions={<><Pill tone={dirty ? "info" : "success"}>{dirty ? "存在未保存更改" : "配置已同步"}</Pill><Action onClick={() => { setPreferences(loadPreferences()); setDirty(false); }}><RefreshCw size={14} /> 重新加载</Action><Action kind="primary" onClick={save}><Save size={14} /> {saved ? "已保存" : "保存更改"}</Action></>}
      />
      <div className="config-layout">
        <nav className="config-nav">
          <div className="config-nav-label">配置中心</div>
          {tabs.map(([id, label, Icon]) => (
            <button className={activeTab === id ? "active" : ""} key={id} onClick={() => setActiveTab(id)} type="button">
              <Icon size={15} /> {label}
              {id === "keys" && <span className="config-nav-badge">2</span>}
            </button>
          ))}
          <div className="config-revision"><span>当前版本</span><strong>Revision 24</strong><small>最后更新于 14:28</small></div>
        </nav>
        <div className="view-stack">
          {activeTab === "providers" && (
            <>
              <Section title="模型供应商" subtitle="配置 API 地址、凭证、模型目录与连接状态" action={<Action kind="primary" onClick={() => setAddingProvider(!addingProvider)}><Plus size={14} /> 添加供应商</Action>}>
                {addingProvider && (
                  <div className="add-provider-form">
                    <label><span>供应商名称</span><input placeholder="例如：DeepSeek" /></label>
                    <label><span>Base URL</span><input placeholder="https://api.example.com/v1" /></label>
                    <Action onClick={() => { setProviders((current) => [...current, ["Custom Provider", "https://api.example.com/v1", "custom-model", "未探测"]]); setAddingProvider(false); setDirty(true); }}><Check size={14} /> 添加</Action>
                  </div>
                )}
                <div className="provider-list">
                  {providers.map(([name, url, model, status], index) => (
                    <div className={`provider-item ${expandedProvider === name ? "expanded" : ""}`} key={name}>
                      <button className="provider-card" onClick={() => setExpandedProvider(expandedProvider === name ? "" : name)} type="button">
                        <div className={`provider-logo provider-${index}`}>{name.slice(0, 1)}</div>
                        <div><strong>{name}</strong><span>{url}</span></div>
                        <div className="provider-model"><span>默认模型</span><strong>{model}</strong></div>
                        <Pill tone={index < 2 ? "success" : "neutral"}>{status}</Pill>
                        <ChevronRight size={15} />
                      </button>
                      {expandedProvider === name && (
                        <div className="provider-editor">
                          <div className="config-form-grid">
                            <label><span>Base URL</span><input defaultValue={url} onChange={() => setDirty(true)} /></label>
                            <label><span>默认模型</span><input defaultValue={model} onChange={() => setDirty(true)} /></label>
                            <label><span>组织 ID</span><input placeholder="可选" onChange={() => setDirty(true)} /></label>
                            <label><span>请求超时</span><input defaultValue="120 秒" onChange={() => setDirty(true)} /></label>
                          </div>
                          <div className="provider-editor-actions">
                            <Action onClick={() => testProvider(name)}><RefreshCw className={testingProvider === name ? "spin-slow" : ""} size={14} /> {testingProvider === name ? "正在探测" : "测试连接"}</Action>
                            <Action onClick={() => { setTestingProvider(`sync-${name}`); window.setTimeout(() => setTestingProvider(""), 1000); }}><Download size={14} /> {testingProvider === `sync-${name}` ? "已同步" : "同步模型目录"}</Action>
                            <Action kind="danger" onClick={() => { setProviders((current) => current.filter((provider) => provider[0] !== name)); setExpandedProvider(""); setDirty(true); }}><Trash2 size={14} /> 移除</Action>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Section>
              <Section title="模型目录缓存" subtitle="最近一次同步：今天 14:22 · 共 18 个模型">
                <div className="catalog-summary">
                  <div><Database size={17} /><span>OpenAI</span><strong>8 个模型</strong></div>
                  <div><Database size={17} /><span>Anthropic</span><strong>6 个模型</strong></div>
                  <div><Database size={17} /><span>Ollama</span><strong>4 个模型</strong></div>
                </div>
              </Section>
            </>
          )}
          {activeTab === "routing" && (
            <>
              <Section title="角色路由" subtitle="为系统角色设置主模型与故障回退模型">
                <div className="routing-table">
                  <div className="routing-table-head"><span>角色</span><span>主模型</span><span>回退模型</span><span>温度</span><span>状态</span></div>
                  {[
                    ["设计 Agent", "gpt-4.1", "claude-sonnet-4", "0.3"],
                    ["规划 Agent", "claude-sonnet-4", "gpt-4.1-mini", "0.2"],
                    ["执行 Agent", "gpt-4.1", "qwen3:14b", "0.1"],
                    ["AI 副驾", "gpt-4.1-mini", "claude-haiku", "0.6"],
                    ["报告生成", "claude-sonnet-4", "gpt-4.1-mini", "0.4"],
                  ].map((row) => (
                    <div className="routing-table-row" key={row[0]}>
                      <strong>{row[0]}</strong>
                      <select defaultValue={row[1]} onChange={() => setDirty(true)}><option>{row[1]}</option><option>gpt-4.1-mini</option><option>claude-sonnet-4</option></select>
                      <select defaultValue={row[2]} onChange={() => setDirty(true)}><option>{row[2]}</option><option>qwen3:14b</option><option>claude-haiku</option></select>
                      <input defaultValue={row[3]} onChange={() => setDirty(true)} />
                      <Pill tone="success">已启用</Pill>
                    </div>
                  ))}
                </div>
              </Section>
              <div className="config-callout"><AlertTriangle size={17} /><div><strong>故障回退策略</strong><span>主模型连续失败 2 次或请求超时后，自动切换到回退模型，并记录到审计日志。</span></div><Action onClick={() => setActiveTab("policy")}>修改策略</Action></div>
            </>
          )}
          {activeTab === "keys" && (
            <Section title="API 密钥" subtitle="密钥仅在本地加密保存，不会显示完整内容" action={<Action kind="primary" onClick={() => { if (!apiKeys.some((key) => key[0] === "CUSTOM_API_KEY")) setApiKeys((current) => [...current, ["CUSTOM_API_KEY", "自定义服务", "尚未配置", "—"]]); setKeyVisible("CUSTOM_API_KEY"); setDirty(true); }}><Plus size={14} /> 添加密钥</Action>}>
              <div className="api-key-list">
                {apiKeys.map(([id, provider, masked, used], index) => (
                  <div className="api-key-row" key={id}>
                    <div className="key-icon"><KeyRound size={16} /></div>
                    <div><strong>{provider}</strong><code>{id}</code></div>
                    <div className="key-value">{keyVisible === id ? (index === 2 ? "尚未配置" : "••••••••••••••••••••") : masked}</div>
                    <div><span>最近使用</span><strong>{used}</strong></div>
                    <Pill tone={index < 2 ? "success" : "neutral"}>{index < 2 ? "有效" : "未配置"}</Pill>
                    <Action onClick={() => setKeyVisible(keyVisible === id ? "" : id)}><Eye size={14} /></Action>
                    <Action kind="danger" onClick={() => { setApiKeys((current) => current.filter((key) => key[0] !== id)); setKeyVisible(""); setDirty(true); }}><Trash2 size={14} /></Action>
                  </div>
                ))}
              </div>
              <div className="security-note"><ShieldCheck size={16} /><span>API 密钥通过系统密钥环加密保存；前端只接收配置状态，不会读取明文。</span></div>
            </Section>
          )}
          {activeTab === "service" && (
            <>
              <Section title="后端连接" subtitle="FastAPI 服务和实时事件通道">
                <div className="config-form-grid service-form">
                  <label><span>API Base URL</span><input defaultValue="同源（自动）" onChange={() => setDirty(true)} /></label>
                  <label><span>WebSocket URL</span><input defaultValue="/ws/logs" onChange={() => setDirty(true)} /></label>
                  <label><span>请求超时</span><input defaultValue="120 秒" onChange={() => setDirty(true)} /></label>
                  <label><span>重连间隔</span><input defaultValue="5 秒" onChange={() => setDirty(true)} /></label>
                </div>
                <div className="connection-test">
                  <div><span className="tiny-dot" /><div><strong>服务连接正常</strong><small>FastAPI 0.115 · 延迟 24ms · WebSocket 在线</small></div></div>
                  <Action onClick={() => { setTestingProvider("service"); window.setTimeout(() => setTestingProvider(""), 1000); }}><RefreshCw className={testingProvider === "service" ? "spin-slow" : ""} size={14} /> {testingProvider === "service" ? "测试成功" : "测试连接"}</Action>
                </div>
              </Section>
              <Section title="服务控制" subtitle="重启会短暂中断 API 与实时日志连接">
                <div className="service-control">
                  <div><Server size={18} /><div><strong>Helm Backend</strong><span>PID 4821 · 已运行 3小时 24分钟</span></div><Pill tone="success">运行中</Pill></div>
                  <Action kind="danger" onClick={restart}><RefreshCw className={restarting ? "spin-slow" : ""} size={14} /> {restarting ? "正在重启" : "重启服务"}</Action>
                </div>
              </Section>
            </>
          )}
          {activeTab === "policy" && (
            <>
              <Section title="执行安全策略" subtitle="控制工具审批、离线保护和隔离环境">
                <div className="policy-list">
                  {[
                    ["approvals", "高风险工具审批", "文件删除、外部请求与桌面操作执行前必须由用户批准", ShieldCheck],
                    ["offlineGuard", "离线禁止写操作", "后端断开连接时自动禁用执行、配置保存和工具调用", ShieldAlert],
                    ["worktree", "默认使用隔离 Worktree", "每个计划在独立 Git 分支执行，完成后手动合并", GitBranch],
                    ["notifications", "审批桌面通知", "出现待处理审批时发送系统桌面通知", Bell],
                  ].map(([id, title, copy, Icon]) => {
                    const key = id as keyof typeof policies;
                    const Component = Icon as LucideIcon;
                    return <div className="policy-row" key={id as string}><div className="policy-icon"><Component size={17} /></div><div><strong>{title as string}</strong><span>{copy as string}</span></div><button className={`switch ${policies[key] ? "on" : ""}`} onClick={() => togglePolicy(key)} type="button"><i /></button></div>;
                  })}
                </div>
              </Section>
              <Section title="重试与日志保留" subtitle="执行失败处理和本地数据保留策略">
                <div className="config-form-grid">
                  <label><span>步骤最大重试次数</span><input defaultValue="3" onChange={() => setDirty(true)} /></label>
                  <label><span>单步骤最大执行时间</span><input defaultValue="30 分钟" onChange={() => setDirty(true)} /></label>
                  <label><span>实时日志上限</span><input defaultValue="500 条" onChange={() => setDirty(true)} /></label>
                  <label><span>审计日志保留</span><input defaultValue="90 天" onChange={() => setDirty(true)} /></label>
                </div>
              </Section>
            </>
          )}
          {activeTab === "appearance" && (
            <>
              <Section title="界面主题" subtitle="主题设置会立即应用并保存在当前浏览器">
                <div className="theme-options">
                  <button className={appearance.theme === "dark" && !customThemeActive ? "selected" : ""} onClick={() => { disableCustomTheme(); onAppearanceChange({ theme: "dark" }); }} type="button">
                    <div className="theme-preview dark-preview"><span /><span /><span /></div>
                    <div><strong>深色主题</strong><span>适合长时间工作和低光环境</span></div>
                    {appearance.theme === "dark" && !customThemeActive && <CircleCheck size={17} />}
                  </button>
                  <button className={appearance.theme === "light" && !customThemeActive ? "selected" : ""} onClick={() => { disableCustomTheme(); onAppearanceChange({ theme: "light" }); }} type="button">
                    <div className="theme-preview light-preview"><span /><span /><span /></div>
                    <div><strong>浅色主题</strong><span>清晰明亮，适合日间使用</span></div>
                    {appearance.theme === "light" && !customThemeActive && <CircleCheck size={17} />}
                  </button>
                </div>
              </Section>
              <Section
                title="自定义主题"
                subtitle="组合品牌色、背景、面板与文字颜色"
                action={<Pill tone={customThemeActive ? "success" : "neutral"}>{customThemeActive ? "正在使用" : "未启用"}</Pill>}
              >
                <div className="custom-theme-layout">
                  <div
                    className="custom-theme-preview"
                    style={{
                      "--custom-accent": customTheme.accent,
                      "--custom-background": customTheme.background,
                      "--custom-surface": customTheme.surface,
                      "--custom-text": customTheme.text,
                    } as React.CSSProperties}
                  >
                    <div><span /><span /><span /></div>
                    <strong>Helm 自定义预览</strong>
                    <small>界面颜色会即时应用到整个工作区</small>
                  </div>
                  <div className="custom-theme-controls">
                    {[
                      ["accent", "品牌强调色"],
                      ["background", "应用背景"],
                      ["surface", "面板表面"],
                      ["text", "主要文字"],
                    ].map(([key, label]) => (
                      <label key={key}>
                        <span>{label}</span>
                        <div>
                          <input
                            aria-label={label}
                            onChange={(event) => updateCustomTheme(key as keyof typeof customTheme, event.target.value)}
                            type="color"
                            value={customTheme[key as keyof typeof customTheme]}
                          />
                          <code>{customTheme[key as keyof typeof customTheme].toUpperCase()}</code>
                        </div>
                      </label>
                    ))}
                    <div className="custom-theme-actions">
                      <Action kind="primary" onClick={applyCustomTheme}><WandSparkles size={14} /> 应用自定义主题</Action>
                      {customThemeActive && <Action onClick={disableCustomTheme}>恢复系统主题</Action>}
                    </div>
                  </div>
                </div>
              </Section>
              <Section title="工作区背景" subtitle="选择主内容区的背景表现">
                <div className="background-options">
                  {[
                    ["aurora", "极光渐变", "柔和的品牌色氛围", "background-aurora"],
                    ["plain", "纯色背景", "更专注、对比更稳定", "background-plain"],
                    ["grid", "精密网格", "适合工程与数据工作", "background-grid"],
                  ].map(([id, title, copy, preview]) => (
                    <button className={appearance.background === id ? "selected" : ""} key={id} onClick={() => onAppearanceChange({ background: id as AppearanceSettings["background"] })} type="button">
                      <div className={`background-preview ${preview}`}><span /></div>
                      <strong>{title}</strong><span>{copy}</span>
                    </button>
                  ))}
                </div>
              </Section>
              <Section title="字号与信息密度" subtitle="调整全局文本尺寸，不影响代码编辑器字号">
                <div className="font-options">
                  {[
                    ["compact", "紧凑", "12px", "同时显示更多信息"],
                    ["default", "标准", "13px", "推荐的平衡设置"],
                    ["large", "舒适", "15px", "更易阅读的字号"],
                  ].map(([id, title, size, copy]) => (
                    <button className={appearance.fontSize === id ? "selected" : ""} key={id} onClick={() => onAppearanceChange({ fontSize: id as AppearanceSettings["fontSize"] })} type="button">
                      <Type size={16} /><div><strong>{title}<small>{size}</small></strong><span>{copy}</span></div>{appearance.fontSize === id && <Check size={15} />}
                    </button>
                  ))}
                </div>
              </Section>
              <Section title="对比度" subtitle="增强文字、边框与交互控件的辨识度">
                <div className="contrast-options">
                  <button className={appearance.contrast === "standard" ? "selected" : ""} onClick={() => onAppearanceChange({ contrast: "standard" })} type="button">
                    <div className="contrast-preview standard"><span>Ag</span><i /><i /></div>
                    <div><strong>标准对比度</strong><span>柔和层次，适合一般工作环境</span></div>
                    {appearance.contrast === "standard" && <CircleCheck size={17} />}
                  </button>
                  <button className={appearance.contrast === "high" ? "selected" : ""} onClick={() => onAppearanceChange({ contrast: "high" })} type="button">
                    <div className="contrast-preview high"><span>Ag</span><i /><i /></div>
                    <div><strong>高对比度</strong><span>强化文字、边界与键盘焦点</span></div>
                    {appearance.contrast === "high" && <CircleCheck size={17} />}
                  </button>
                </div>
              </Section>
            </>
          )}
          {activeTab === "agents" && (
            <div className="agent-custom-layout">
              <Section title="自定义智能体" subtitle="3 个已配置" action={<Action kind="primary" onClick={() => { setAgentName("未命名智能体"); setAgentIdDraft("custom-agent"); setAgentPrompt(""); setDirty(true); }}><Plus size={14} /> 新建</Action>}>
                <div className="custom-agent-list">
                  {[
                    ["research-agent", "研究智能体", "检索与事实核验", Search],
                    ["code-reviewer", "代码审查智能体", "质量与安全审查", Code2],
                    ["delivery-agent", "交付智能体", "报告与产物整理", FileText],
                  ].map(([id, name, copy, Icon]) => {
                    const Component = Icon as LucideIcon;
                    return <button className={selectedAgent === id ? "selected" : ""} key={id as string} onClick={() => selectAgent(id as keyof typeof agentProfiles)} type="button"><div><Component size={16} /></div><span><strong>{name as string}</strong><small>{copy as string}</small></span><ChevronRight size={14} /></button>;
                  })}
                </div>
              </Section>
              <div className="view-stack agent-editor-stack">
                <Section title="智能体身份" subtitle={`配置 ID · ${selectedAgent}`} action={<><Action onClick={() => navigator.clipboard.writeText(agentIdDraft)}><ExternalLink size={14} /> 复制</Action><Action kind="danger" onClick={() => { setAgentName("未命名智能体"); setAgentIdDraft("custom-agent"); setAgentPrompt(""); setDirty(true); }}><Trash2 size={14} /></Action></>}>
                  <div className="config-form-grid">
                    <label><span>显示名称</span><input onChange={(event) => { setAgentName(event.target.value); setDirty(true); }} value={agentName} /></label>
                    <label><span>智能体 ID</span><input onChange={(event) => { setAgentIdDraft(event.target.value); setDirty(true); }} value={agentIdDraft} /></label>
                    <label><span>主要模型</span><select defaultValue={agentProfiles[selectedAgent as keyof typeof agentProfiles].primary} key={`${selectedAgent}-primary`} onChange={() => setDirty(true)}><option>gpt-4.1</option><option>gpt-4.1-mini</option><option>claude-sonnet-4</option><option>qwen3:14b</option></select></label>
                    <label><span>回退模型</span><select defaultValue={agentProfiles[selectedAgent as keyof typeof agentProfiles].fallback} key={`${selectedAgent}-fallback`} onChange={() => setDirty(true)}><option>claude-sonnet-4</option><option>gpt-4.1</option><option>gpt-4.1-mini</option><option>claude-haiku</option></select></label>
                  </div>
                </Section>
                <Section title="系统提示词" subtitle="定义智能体的角色、边界和输出要求" action={<Pill>{agentPrompt.length} 字符</Pill>}>
                  <textarea className="agent-prompt-editor" onChange={(event) => { setAgentPrompt(event.target.value); setDirty(true); }} value={agentPrompt} />
                  <div className="prompt-variables"><span>可用变量</span><code>{"{{project_context}}"}</code><code>{"{{current_plan}}"}</code><code>{"{{user_request}}"}</code></div>
                </Section>
                <Section title="工具权限" subtitle="限制智能体可自主调用的能力">
                  <div className="agent-tool-permissions">
                    {[
                      ["search", "网络检索", "搜索与读取公开信息", Search],
                      ["code", "代码编辑", "读取并修改项目文件", Code2],
                      ["shell", "命令执行", "在隔离环境运行命令", Server],
                      ["files", "产物读写", "创建和读取交付产物", FileText],
                    ].map(([id, title, copy, Icon]) => {
                      const key = id as keyof typeof agentTools;
                      const Component = Icon as LucideIcon;
                      return <div key={id as string}><div className="policy-icon"><Component size={16} /></div><span><strong>{title as string}</strong><small>{copy as string}</small></span><button className={`switch ${agentTools[key] ? "on" : ""}`} onClick={() => { setAgentTools((current) => ({ ...current, [key]: !current[key] })); setDirty(true); }} type="button"><i /></button></div>;
                    })}
                  </div>
                </Section>
                <Section title="运行限制" subtitle="控制单次会话的资源上限">
                  <div className="config-form-grid">
                    <label><span>最大轮次</span><input defaultValue="12" onChange={() => setDirty(true)} /></label>
                    <label><span>Token 预算</span><input defaultValue="32,000" onChange={() => setDirty(true)} /></label>
                    <label><span>单轮超时</span><input defaultValue="180 秒" onChange={() => setDirty(true)} /></label>
                    <label><span>并行工具调用</span><input defaultValue="2" onChange={() => setDirty(true)} /></label>
                  </div>
                </Section>
              </div>
            </div>
          )}
          {activeTab === "preferences" && (
            <div className="preferences-layout">
              <nav className="preferences-nav">
                {[
                  ["general", "通用", Settings2],
                  ["terminal", "终端与工具", Code2],
                  ["network", "网络与证书", Network],
                  ["updates", "更新与系统", RefreshCw],
                  ["notifications", "通知", Bell],
                  ["interaction", "Agent 交互", MessageSquare],
                  ["data", "数据与隐私", Database],
                ].map(([id, label, Icon]) => {
                  const Component = Icon as LucideIcon;
                  return <button className={preferenceSection === id ? "active" : ""} key={id as string} onClick={() => setPreferenceSection(id as PreferenceSection)} type="button"><Component size={15} />{label as string}<ChevronRight size={13} /></button>;
                })}
              </nav>
              <div className="preference-content">
                {preferenceSection === "general" && (
                  <Section title="通用" subtitle="语言、终端环境和首次使用体验">
                    <PreferenceRow title="界面语言" description="选择应用 UI 的显示语言。">
                      <select onChange={(event) => updatePreference("locale", event.target.value as PreferenceSettings["locale"])} value={preferences.locale}>
                        <option value="zh-CN">中文简体</option><option value="en-US">English</option><option value="system">跟随系统</option>
                      </select>
                    </PreferenceRow>
                    <PreferenceRow control={<PreferenceSwitch checked={preferences.inheritProfile} onChange={() => updatePreference("inheritProfile", !preferences.inheritProfile)} />} title="继承系统终端 Profile" description="启动内置终端时尽量继承登录 Shell 环境、代理、Kube 变量和本机终端字体。" />
                    <PreferenceRow title="引导" description="重新打开引导弹窗，查看迁移选项并导入设置。" control={<Action onClick={() => { setGuideOpened(true); window.setTimeout(() => setGuideOpened(false), 1800); }}>{guideOpened ? <CircleCheck size={14} /> : <Sparkles size={14} />}{guideOpened ? "引导已打开" : "重新打开引导"}</Action>} />
                  </Section>
                )}
                {preferenceSection === "terminal" && (
                  <Section title="终端与工具" subtitle="设置新建终端会话和命令工具行为">
                    <PreferenceRow title="终端字体" description="留空时自动探测系统终端配置；填写后作为内置终端的字体覆盖。">
                      <div className="preference-input-with-action"><input onChange={(event) => updatePreference("terminalFont", event.target.value)} placeholder="自动继承，例如 MesloLGS NF, monospace" value={preferences.terminalFont} /><Action onClick={() => updatePreference("terminalFont", "MesloLGS NF, monospace")}><Search size={14} /> 自动探测</Action></div>
                      <div className="terminal-font-preview"><span>$ helm run</span><strong>Agent connected · ready</strong></div>
                    </PreferenceRow>
                    <PreferenceRow badge="新会话生效" title="集成终端 Shell" description="Windows 下 Bash 工具优先使用 Git Bash，找不到时回退 cmd.exe。">
                      <select onChange={(event) => updatePreference("shell", event.target.value)} value={preferences.shell}><option value="auto">自动选择</option><option value="bash">Bash</option><option value="zsh">zsh</option><option value="powershell">PowerShell</option><option value="cmd">cmd.exe</option></select>
                    </PreferenceRow>
                    <PreferenceRow control={<PreferenceSwitch checked={preferences.enhancedFind} onChange={() => updatePreference("enhancedFind", !preferences.enhancedFind)} />} title="增强 Find" description="新会话优先使用更快的文件查找工具；当前会话保持现有设置。" />
                    <PreferenceRow control={<PreferenceSwitch checked={preferences.enhancedGrep} onChange={() => updatePreference("enhancedGrep", !preferences.enhancedGrep)} />} title="增强 Grep" description="新会话优先使用增强文本检索，并在不可用时自动回退。" />
                  </Section>
                )}
                {preferenceSection === "network" && (
                  <Section title="网络与证书" subtitle="代理和证书设置保存后需要重启应用" action={<Pill tone="info">需要重启</Pill>}>
                    <PreferenceRow badge="需要重启" title="HTTP 代理" description="模型、MCP、命令工具与应用渲染层的出口流量将经此代理。">
                      <input onChange={(event) => updatePreference("httpProxy", event.target.value)} placeholder="例如 http://127.0.0.1:7890" value={preferences.httpProxy} />
                    </PreferenceRow>
                    <PreferenceRow badge="需要重启" title="不使用代理的地址" description="匹配这些主机的请求将直连，多个规则用英文逗号分隔。">
                      <textarea onChange={(event) => updatePreference("noProxy", event.target.value)} placeholder="localhost,127.0.0.1,::1,.example.com,*.corp.com" value={preferences.noProxy} />
                    </PreferenceRow>
                    <PreferenceRow badge="需要重启" title="自定义证书" description="填写 PEM 根证书路径，用于模型、MCP、命令工具和渲染层证书校验。">
                      <input onChange={(event) => updatePreference("certificatePath", event.target.value)} placeholder="/Users/name/certs/root-ca.pem" value={preferences.certificatePath} />
                    </PreferenceRow>
                  </Section>
                )}
                {preferenceSection === "updates" && (
                  <div className="view-stack">
                    <Section title="应用更新" subtitle="当前版本 2.4.1 · Stable" action={<Action onClick={checkForUpdates}><RefreshCw className={checkingUpdates ? "spin-slow" : ""} size={14} />{checkingUpdates ? "正在检查" : updateChecked ? "已是最新版本" : "检查更新"}</Action>}>
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.previewUpdates} onChange={() => updatePreference("previewUpdates", !preferences.previewUpdates)} />} title="接受提前收到预览版更新" description="开启后将最快体验新功能和改进版本。" />
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.autoUpdate} onChange={() => updatePreference("autoUpdate", !preferences.autoUpdate)} />} title="自动下载并安装更新" description="检测到更新后自动下载；存在运行任务时，重启安装前仍会确认。" />
                    </Section>
                    <Section title="系统行为" subtitle="控制桌面渲染、窗口与电源行为">
                      <PreferenceRow badge="需要重启" control={<PreferenceSwitch checked={preferences.hardwareAcceleration} onChange={() => updatePreference("hardwareAcceleration", !preferences.hardwareAcceleration)} />} title="Chrome 硬件加速" description="关闭后可规避部分显卡或驱动导致的白屏、闪退和渲染异常。" />
                      <PreferenceRow badge="仅 Windows" control={<PreferenceSwitch checked={preferences.closeToTray} onChange={() => updatePreference("closeToTray", !preferences.closeToTray)} />} title="关闭窗口时隐藏到托盘" description="关闭窗口时保留后台运行，托盘中的退出仍会完全退出应用。" />
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.preventSleep} onChange={() => updatePreference("preventSleep", !preferences.preventSleep)} />} title="保持电脑运行" description="阻止系统因空闲进入休眠，仍可手动睡眠或合盖休眠。" />
                    </Section>
                  </div>
                )}
                {preferenceSection === "notifications" && (
                  <Section title="通知" subtitle="控制任务和审批的桌面提醒" action={<Action onClick={testNotification}><Bell size={14} />{notificationTested ? "测试通知已发送" : "发送测试通知"}</Action>}>
                    <PreferenceRow control={<PreferenceSwitch checked={preferences.notifications} onChange={() => updatePreference("notifications", !preferences.notifications)} />} title="任务通知" description="任务完成、失败或需要确认时发送桌面通知。" />
                    <PreferenceRow disabled={!preferences.notifications} control={<PreferenceSwitch checked={preferences.notificationSound} disabled={!preferences.notifications} onChange={() => updatePreference("notificationSound", !preferences.notificationSound)} />} title="通知声音" description="通知开启后，可单独关闭任务通知提示音。" />
                    <PreferenceRow disabled={!preferences.notifications} control={<PreferenceSwitch checked={preferences.notifyCompleted} disabled={!preferences.notifications} onChange={() => updatePreference("notifyCompleted", !preferences.notifyCompleted)} />} title="任务完成" description="任务执行完成后发送通知。" />
                    <PreferenceRow disabled={!preferences.notifications} control={<PreferenceSwitch checked={preferences.notifyFailed} disabled={!preferences.notifications} onChange={() => updatePreference("notifyFailed", !preferences.notifyFailed)} />} title="任务失败" description="执行失败或服务异常时发送通知。" />
                    <PreferenceRow disabled={!preferences.notifications} control={<PreferenceSwitch checked={preferences.notifyApproval} disabled={!preferences.notifications} onChange={() => updatePreference("notifyApproval", !preferences.notifyApproval)} />} title="需要人工确认" description="工具调用等待审批时发送通知。" />
                  </Section>
                )}
                {preferenceSection === "interaction" && (
                  <div className="view-stack">
                    <Section title="交互行为" subtitle="控制 Agent 运行时如何处理后续操作">
                      <PreferenceRow title="后续操作处理方式" description="将后续操作加入队列，或安排到下一轮工具调用后执行。">
                        <div className="segmented-control"><button className={preferences.interactionBehavior === "queue" ? "active" : ""} onClick={() => updatePreference("interactionBehavior", "queue")} type="button">队列</button><button className={preferences.interactionBehavior === "next-round" ? "active" : ""} onClick={() => updatePreference("interactionBehavior", "next-round")} type="button">下一轮工具调用</button></div>
                      </PreferenceRow>
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.autoContinue} onChange={() => updatePreference("autoContinue", !preferences.autoContinue)} />} title="提问自动继续" description="Agent 提问超过指定时间未回答时自动继续。" >
                        {preferences.autoContinue && <div className="inline-number-field"><span>等待时长</span><input min="1" onChange={(event) => updatePreference("autoContinueMinutes", Number(event.target.value))} type="number" value={preferences.autoContinueMinutes} /><span>分钟</span></div>}
                      </PreferenceRow>
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.showReasoning} onChange={() => updatePreference("showReasoning", !preferences.showReasoning)} />} title="显示推理摘要" description="在消息流中展示模型主动返回的推理内容和工具调用摘要。" />
                    </Section>
                    <Section title="消息流显示" subtitle="控制工具调用在对话中的组织方式">
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.showTodos} onChange={() => updatePreference("showTodos", !preferences.showTodos)} />} title="显示待办" description="在消息流中展示 Todo 工具卡片。" />
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.groupExplore} onChange={() => updatePreference("groupExplore", !preferences.groupExplore)} />} title="分组探索工具" description="将连续的读取和搜索工具聚合为 Explore 分组。" />
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.groupTerminal} onChange={() => updatePreference("groupTerminal", !preferences.groupTerminal)} />} title="分组终端命令" description="将连续的非只读 Shell 命令聚合为 Terminal 分组。" />
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.groupChanges} onChange={() => updatePreference("groupChanges", !preferences.groupChanges)} />} title="分组文件更改" description="将连续的 Write、Edit 和 ApplyPatch 调用聚合为 Changes 分组。" />
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.preserveModelIO} onChange={() => { if (preferences.preserveModelIO || window.confirm("完整模型 I/O 可能包含敏感内容并占用较多存储空间，是否继续？")) updatePreference("preserveModelIO", !preferences.preserveModelIO); }} />} title="完整保留模型 I/O" description="保留完整模型请求和响应，不自动压缩或删除旧记录。" />
                    </Section>
                  </div>
                )}
                {preferenceSection === "data" && (
                  <div className="view-stack">
                    <Section title="任务归档" subtitle="自动整理已完成且不再活跃的任务">
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.autoArchive} onChange={() => updatePreference("autoArchive", !preferences.autoArchive)} />} title="自动归档旧任务" description="定时扫描已完成、无未读、未置顶且超过保留期的任务。" />
                      <PreferenceRow disabled={!preferences.autoArchive} title="归档保留时长" description="任务最后更新时间早于该时长后，才会进入自动归档候选。">
                        <select disabled={!preferences.autoArchive} onChange={(event) => updatePreference("retentionDays", Number(event.target.value))} value={preferences.retentionDays}><option value="7">7 天后归档</option><option value="14">14 天后归档</option><option value="30">30 天后归档</option><option value="90">90 天后归档</option></select>
                      </PreferenceRow>
                    </Section>
                    <Section title="数据存储" subtitle="应用数据根目录，固定使用 .zcode/v2 后缀">
                      <PreferenceRow title="数据存储路径" description="修改后会将现有数据复制到新位置。">
                        <input onChange={(event) => updatePreference("storagePath", event.target.value)} value={preferences.storagePath} />
                        <div className="storage-meta"><span>已使用 2.4 GB</span><span>12,481 个文件</span><span>剩余空间 184 GB</span></div>
                      </PreferenceRow>
                    </Section>
                    <Section title="隐私" subtitle="管理产品分析和体验优化授权">
                      <PreferenceRow control={<PreferenceSwitch checked={preferences.improveExperience} onChange={() => updatePreference("improveExperience", !preferences.improveExperience)} />} title="优化体验" description="允许将对话内容用于优化 Agent 使用体验；默认关闭，可随时撤回。" />
                    </Section>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function OtherView({
  view,
  onNavigate,
  appearance,
  onAppearanceChange,
}: {
  view: WorkspaceViewKey;
  onNavigate: (view: WorkspaceViewKey) => void;
  appearance: AppearanceSettings;
  onAppearanceChange: (next: Partial<AppearanceSettings>) => void;
}) {
  if (view === "input") return <InputView onNavigate={onNavigate} />;
  if (view === "projects") return <ProjectsView onNavigate={onNavigate} />;
  if (view === "design") return <DesignView onNavigate={onNavigate} />;
  if (view === "plan") return <PlanView onNavigate={onNavigate} />;
  if (view === "artifacts") return <ArtifactsView />;
  if (view === "agents") return <AgentsView />;
  if (view === "tools") return <ToolsView />;
  if (view === "history") return <HistoryView onNavigate={onNavigate} />;
  if (view === "audit") return <AuditView />;
  if (view === "system") return <SystemView />;
  return <ConfigView appearance={appearance} onAppearanceChange={onAppearanceChange} />;
}
