import { useState, type ReactNode } from "react";
import {
  Activity,
  Archive,
  Blocks,
  Bot,
  Boxes,
  ChevronDown,
  ChevronRight,
  CircleCheck,
  CircleDashed,
  ClipboardCheck,
  Code2,
  Command,
  FileBox,
  FileText,
  FolderKanban,
  Gauge,
  GitBranch,
  GripHorizontal,
  GripVertical,
  History,
  LayoutDashboard,
  Moon,
  Pause,
  PanelLeftClose,
  PanelLeftOpen,
  Play,
  Plus,
  Radio,
  RefreshCw,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  Sun,
  TerminalSquare,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { Group, Panel, Separator } from "react-resizable-panels";
import OtherView, { type WorkspaceViewKey } from "./Views";

type ViewKey = WorkspaceViewKey;

type NavItem = {
  id: ViewKey;
  label: string;
  icon: typeof Activity;
  badge?: string;
};

const primaryItems: NavItem[] = [
  { id: "input", label: "新建任务", icon: Plus },
  { id: "design", label: "设计书", icon: FileText },
  { id: "plan", label: "执行计划", icon: ClipboardCheck },
  { id: "execution", label: "实时执行", icon: Activity, badge: "3" },
  { id: "artifacts", label: "产物库", icon: FileBox },
  { id: "agents", label: "Agent 记录", icon: Bot },
];

const libraryItems: NavItem[] = [
  { id: "projects", label: "项目管理", icon: FolderKanban },
  { id: "tools", label: "工具库", icon: Wrench },
  { id: "history", label: "历史记录", icon: History },
  { id: "audit", label: "审计日志", icon: ShieldCheck },
  { id: "system", label: "系统概览", icon: Gauge },
  { id: "config", label: "系统设置", icon: Settings },
];

const steps = [
  {
    id: "01",
    title: "分析代码仓库结构",
    tool: "repo_inspector",
    status: "success",
    meta: "18.4s · 2,148 tokens",
  },
  {
    id: "02",
    title: "生成数据模型与接口层",
    tool: "code_agent",
    status: "success",
    meta: "42.7s · 5,802 tokens",
  },
  {
    id: "03",
    title: "实现核心工作流",
    tool: "code_agent",
    status: "running",
    meta: "运行 01:24",
  },
  {
    id: "04",
    title: "执行集成测试",
    tool: "shell_runner",
    status: "pending",
    meta: "等待步骤 03",
  },
  {
    id: "05",
    title: "生成交付报告",
    tool: "report_writer",
    status: "pending",
    meta: "等待步骤 04",
  },
];

function Button({
  children,
  className = "",
  onClick,
  title,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button className={`button-reset ${className}`} onClick={onClick} title={title} type="button">
      {children}
    </button>
  );
}

function StatusDot({ status = "online" }: { status?: "online" | "running" | "pending" }) {
  return <span className={`status-dot status-${status}`} />;
}

function Sidebar({
  active,
  collapsed,
  onChange,
  onToggle,
}: {
  active: ViewKey;
  collapsed: boolean;
  onChange: (view: ViewKey) => void;
  onToggle: () => void;
}) {
  const [workspaceMenuOpen, setWorkspaceMenuOpen] = useState(false);
  const [checkingWorkspace, setCheckingWorkspace] = useState(false);

  const checkWorkspace = () => {
    setCheckingWorkspace(true);
    window.setTimeout(() => setCheckingWorkspace(false), 900);
  };

  const renderGroup = (title: string, items: NavItem[]) => (
    <div className="nav-group">
      <div className="nav-label">{title}</div>
      <div className="nav-list">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              className={`nav-item ${active === item.id ? "is-active" : ""}`}
              key={item.id}
              onClick={() => onChange(item.id)}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} strokeWidth={1.8} />
              <span>{item.label}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </Button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside className={`sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <Command size={20} />
        </div>
        <div>
          <div className="brand-name">星舵 Helm</div>
          <div className="brand-subtitle">EAS 2.0 · 本地工作区</div>
        </div>
      </div>
      <Button className="new-task" onClick={() => onChange("input")} title={collapsed ? "创建新任务" : undefined}>
        <Plus size={16} />
        <span>创建新任务</span>
        <span className="shortcut">⌘ N</span>
      </Button>
      <nav className="nav-scroll">
        {renderGroup("工作流", primaryItems)}
        {renderGroup("资源与治理", libraryItems)}
      </nav>
      <Button className="current-task" onClick={() => onChange("execution")} title="打开当前任务">
        <div className="current-task-head">
          <span>当前任务</span>
        </div>
        <div className="current-task-title">
          <StatusDot status="running" />
          企业知识库 RAG 系统
        </div>
        <div className="task-progress">
          <span />
        </div>
        <div className="current-task-meta">
          <span>3 / 5 步骤</span>
          <span>运行中</span>
        </div>
      </Button>
      <div className="sidebar-footer">
        <Button
          className={`workspace ${workspaceMenuOpen ? "is-open" : ""}`}
          onClick={() => setWorkspaceMenuOpen(!workspaceMenuOpen)}
          title="打开工作区菜单"
        >
          <div className="avatar"><Command size={15} /></div>
          <div className="workspace-copy">
            <div>本地工作区</div>
            <span><StatusDot /> FastAPI · 在线</span>
          </div>
          <ChevronRight className="workspace-chevron" size={16} />
        </Button>
        <Button
          className="collapse-sidebar"
          onClick={onToggle}
          title={collapsed ? "展开侧栏" : "收起侧栏"}
        >
          {collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
        </Button>
        {workspaceMenuOpen && (
          <div className="workspace-menu">
            <div className="workspace-menu-head">
              <div className="workspace-menu-mark"><Command size={17} /></div>
              <div>
                <strong>本地工作区</strong>
                <span>~/helm-workspace</span>
              </div>
              <span className="workspace-live"><StatusDot /> 当前</span>
            </div>
            <div className="workspace-menu-section">
              <div className="workspace-menu-label">连接状态</div>
              <div className="workspace-status-row">
                <span>API 服务</span>
                <strong><StatusDot /> 在线 · 24ms</strong>
              </div>
              <div className="workspace-status-row">
                <span>任务执行器</span>
                <strong><StatusDot /> 可用</strong>
              </div>
              <div className="workspace-endpoint">同源连接 · /api/*</div>
            </div>
            <div className="workspace-menu-actions">
              <Button className="project-entry" onClick={() => { onChange("projects"); setWorkspaceMenuOpen(false); }}>
                <FolderKanban size={14} /> 项目管理
              </Button>
              <Button onClick={checkWorkspace}>
                <RefreshCw className={checkingWorkspace ? "spin-slow" : ""} size={14} />
                {checkingWorkspace ? "正在检查" : "检查连接"}
              </Button>
              <Button onClick={() => { onChange("config"); setWorkspaceMenuOpen(false); }}>
                <Settings size={14} /> 工作区设置
              </Button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}

function Header({
  dark,
  onTheme,
  onAi,
  view,
}: {
  dark: boolean;
  onTheme: () => void;
  onAi: () => void;
  view: ViewKey;
}) {
  const [accountOpen, setAccountOpen] = useState(false);
  const meta = [...primaryItems, ...libraryItems].find((item) => item.id === view);
  return (
    <header className="header">
      <div>
        <div className="breadcrumbs">
          工作区 <ChevronRight size={12} /> 星舵 Helm <ChevronRight size={12} /> {meta?.label}
        </div>
        <div className="page-title-row">
          <div className="page-title">{meta?.label}</div>
          {view !== "input" && <span className="plan-chip">PLAN · A84F21C9</span>}
        </div>
      </div>
      <div className="header-actions">
        <div className="connection">
          <StatusDot />
          <span>服务在线</span>
          <span className="latency">24ms</span>
        </div>
        <Button className="icon-button" onClick={onAi} title="打开 AI 副驾">
          <Bot size={18} />
        </Button>
        <Button className="icon-button" onClick={onTheme} title="切换主题">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <div className="header-divider" />
        <div className="account-control">
          <Button className="avatar-button" onClick={() => setAccountOpen((open) => !open)} title="账户菜单">LX</Button>
          {accountOpen && (
            <div className="account-popover">
              <strong>林晓</strong>
              <span>lx@helm.local</span>
              <small>本地工作区账户</small>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <div className="metric-card">
      <div className={`metric-icon ${tone}`}>{icon}</div>
      <div>
        <div className="metric-label">{label}</div>
        <div className="metric-value">{value}</div>
      </div>
      <div className="metric-detail">{detail}</div>
    </div>
  );
}

function ExecutionContent() {
  const [paused, setPaused] = useState(false);
  const [expanded, setExpanded] = useState("03");
  const [showDiff, setShowDiff] = useState(false);
  const [showRunHistory, setShowRunHistory] = useState(false);
  return (
    <main className="main-content">
      <section className="hero-row">
        <div>
          <div className="eyebrow">
            <span className="live-pulse" />
            EXECUTION IN PROGRESS
          </div>
          <div className="hero-title">企业知识库 RAG 系统</div>
          <div className="hero-copy">自动构建检索增强生成服务，已运行 2 分 46 秒</div>
        </div>
        <div className="hero-actions">
          <Button className={paused ? "primary-button" : "warning-button"} onClick={() => setPaused(!paused)}>
            {paused ? <Play size={16} /> : <Pause size={16} />}
            {paused ? "继续执行" : "暂停执行"}
          </Button>
        </div>
      </section>

      <section className="metrics-grid">
        <MetricCard icon={<CircleCheck size={18} />} label="已完成步骤" value="2 / 5" detail="40%" tone="mint" />
        <MetricCard icon={<Radio size={18} />} label="当前运行" value={paused ? "已暂停" : "步骤 03"} detail="01:24" tone="blue" />
        <MetricCard icon={<Zap size={18} />} label="Token 消耗" value="8,426" detail="预算 32%" tone="amber" />
        <MetricCard icon={<Activity size={18} />} label="执行尝试" value="3" detail="0 次重试" tone="purple" />
      </section>

      <Group className="content-grid" id="execution-content-layout" orientation="horizontal">
        <Panel defaultSize="68%" id="execution-steps" minSize="46%">
          <div className="panel steps-panel">
            <div className="panel-header">
              <div>
                <div className="panel-title">执行步骤</div>
                <div className="panel-subtitle">Segment 01 · 核心服务搭建</div>
              </div>
              <div className="compact-progress">
                <div><span>整体进度</span><strong>40%</strong></div>
                <div className="progress-track"><span /></div>
              </div>
            </div>
            <div className="steps-list">
              {steps.map((step, index) => (
                <div className={`step ${step.status} ${expanded === step.id ? "expanded" : ""}`} key={step.id}>
                  <Button className="step-main" onClick={() => setExpanded(expanded === step.id ? "" : step.id)}>
                    <div className="step-rail">
                      <div className="step-status">
                        {step.status === "success" ? (
                          <CircleCheck size={18} />
                        ) : step.status === "running" ? (
                          <RefreshCw className="spin-slow" size={18} />
                        ) : (
                          <CircleDashed size={18} />
                        )}
                      </div>
                      {index < steps.length - 1 && <div className="rail-line" />}
                    </div>
                    <div className="step-copy">
                      <div className="step-title-row">
                        <span className="step-number">STEP {step.id}</span>
                        <span className="step-title">{step.title}</span>
                        {step.status === "running" && <span className="running-chip">执行中</span>}
                      </div>
                      <div className="step-meta">
                        <Code2 size={13} />
                        <span>{step.tool}</span>
                        <span className="dot-separator">·</span>
                        <span>{step.meta}</span>
                      </div>
                    </div>
                    <ChevronDown className="step-chevron" size={16} />
                  </Button>
                  {expanded === step.id && (
                    <div className="step-detail">
                      <div className="code-line"><span>›</span> 正在生成向量检索与文档分块模块...</div>
                      <div className="detail-stats">
                        <span>输入 2,804 tokens</span>
                        <span>输出 1,672 tokens</span>
                        <span className="success-text">检查点已保存</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </Panel>
        <ResizeHandle orientation="horizontal" />
        <Panel id="execution-details" minSize="24%">
          <Group className="right-stack" id="execution-detail-layout" orientation="vertical">
            <Panel defaultSize="57%" id="worktree-detail" minSize={142}>
              <div className="panel branch-panel">
                <div className="panel-header compact">
                  <div>
                    <div className="panel-title">隔离工作区</div>
                    <div className="panel-subtitle">Worktree 安全执行</div>
                  </div>
                  <span className="safe-chip"><ShieldCheck size={13} /> 安全</span>
                </div>
                <div className="panel-scroll-body">
                  <div className="branch-card">
                    <div className="branch-icon"><GitBranch size={18} /></div>
                    <div>
                      <div className="branch-name">helm/a84f21c9</div>
                      <div className="branch-path">~/worktrees/rag-system</div>
                    </div>
                  </div>
                  <div className="diff-row">
                    <span>工作区变更</span>
                    <div><span className="add">+284</span><span className="remove">−16</span><span>7 文件</span></div>
                  </div>
                  <Button className="diff-button" onClick={() => setShowDiff((visible) => !visible)}>
                    <Code2 size={15} /> {showDiff ? "收起 Diff" : "查看完整 Diff"} <ChevronRight size={14} />
                  </Button>
                  {showDiff && (
                    <div className="diff-file-list">
                      <div><code>src/services/retrieval.ts</code><span><b>+126</b><i>−0</i></span></div>
                      <div><code>src/adapters/vector-store.ts</code><span><b>+84</b><i>−6</i></span></div>
                      <div><code>src/workflows/rag.ts</code><span><b>+48</b><i>−8</i></span></div>
                      <div><code>tests/retrieval.test.ts</code><span><b>+26</b><i>−2</i></span></div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
            <ResizeHandle orientation="vertical" />
            <Panel id="run-detail" minSize={112}>
              <div className="panel run-panel">
                <div className="panel-header compact">
                  <div className="panel-title">{showRunHistory ? "运行历史" : "本次运行"}</div>
                  <Button className="text-button" onClick={() => setShowRunHistory((visible) => !visible)}>
                    {showRunHistory ? "返回本次" : "查看历史"} <ChevronRight size={14} />
                  </Button>
                </div>
                <div className="panel-scroll-body">
                  {showRunHistory ? (
                    <div className="run-history-list">
                      <div><span><StatusDot status="running" /><strong>RUN-31D8</strong></span><small>运行中 · 今天 14:32</small></div>
                      <div><span><CircleCheck size={12} /><strong>RUN-2FA1</strong></span><small>已完成 · 昨天 18:06</small></div>
                      <div><span><CircleCheck size={12} /><strong>RUN-1C94</strong></span><small>已完成 · 5月18日 10:24</small></div>
                    </div>
                  ) : (
                    <div className="run-grid">
                      <div><span>运行 ID</span><strong>RUN-31D8</strong></div>
                      <div><span>触发方式</span><strong>手动执行</strong></div>
                      <div><span>开始时间</span><strong>14:32:18</strong></div>
                      <div><span>心跳</span><strong className="online-text"><StatusDot /> 刚刚</strong></div>
                    </div>
                  )}
                </div>
              </div>
            </Panel>
          </Group>
        </Panel>
      </Group>
    </main>
  );
}

function AiPanel({ onClose }: { onClose: () => void }) {
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);

  const sendMessage = (content = draft) => {
    const message = content.trim();
    if (!message) return;

    setMessages((current) => [...current, { role: "user", text: message }]);
    setDraft("");
  };

  const runSuggestion = (prompt: string, reply: string) => {
    setMessages((current) => [
      ...current,
      { role: "user", text: prompt },
      { role: "assistant", text: reply },
    ]);
    setDraft("");
  };

  return (
    <aside className="ai-panel">
      <div className="ai-header">
        <div className="ai-title"><Sparkles size={17} /> AI 副驾</div>
        <Button className="icon-button small" onClick={onClose}><X size={16} /></Button>
      </div>
      <div className="ai-context">
        <div className="context-label">当前上下文</div>
        <div className="context-card"><Activity size={15} /><span>执行计划 · 步骤 03</span></div>
      </div>
      <div className="chat-area">
        <div className="ai-message">
          <div className="bot-avatar"><Sparkles size={14} /></div>
          <div>
            <div className="message-name">Helm Copilot</div>
            <div className="message-bubble">步骤 03 正在稳定运行。当前已生成向量检索模块，预计还需约 1 分钟完成。</div>
          </div>
        </div>
        <div className="suggestions">
          <Button onClick={() => runSuggestion("解释当前步骤", "步骤 03 正在实现核心工作流：连接检索服务、编排 Agent 调用，并为后续集成测试准备统一接口。")}>解释当前步骤</Button>
          <Button onClick={() => runSuggestion("检查执行风险", "当前未发现阻断风险。需要关注向量存储适配器的超时处理，以及步骤 04 集成测试中的依赖可用性。")}>检查执行风险</Button>
          <Button onClick={() => runSuggestion("查看 Token 用量", "当前运行累计使用 8,416 tokens，其中步骤 03 已使用 2,614 tokens，仍处于本次任务预算范围内。")}>查看 Token 用量</Button>
        </div>
        {messages.map((message, index) => message.role === "user" ? (
          <div className="user-message" key={`${message.text}-${index}`}>{message.text}</div>
        ) : (
          <div className="ai-message ai-followup" key={`${message.text}-${index}`}>
            <div className="bot-avatar"><Sparkles size={14} /></div>
            <div>
              <div className="message-name">Helm Copilot</div>
              <div className="message-bubble">{message.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="chat-composer">
        <textarea
          aria-label="询问当前任务"
          className="composer-input"
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              sendMessage();
            }
          }}
          placeholder="询问当前任务..."
          rows={2}
          value={draft}
        />
        <Button className="send-button" onClick={() => sendMessage()} title="发送消息"><Send size={15} /></Button>
      </div>
      <div className="composer-hint">Copilot 可读取当前计划与运行日志</div>
    </aside>
  );
}

function LogPanel({ onClose }: { onClose: () => void }) {
  const [completedOnly, setCompletedOnly] = useState(false);
  const lines = [
    ["14:34:52", "INFO", "code_agent", "正在生成 src/services/retrieval.ts"],
    ["14:34:55", "DONE", "code_agent", "向量存储适配器已创建"],
    ["14:35:01", "INFO", "runtime", "执行类型检查与依赖验证..."],
  ].filter((line) => !completedOnly || line[1] === "DONE");
  return (
    <section className="log-panel">
      <div className="log-toolbar">
        <div className="log-title"><TerminalSquare size={15} /> 活动流 <span>LIVE</span></div>
        <div className="log-actions">
          <Button onClick={() => setCompletedOnly((active) => !active)}><Search size={14} /> {completedOnly ? "全部日志" : "仅看完成"}</Button>
          <Button onClick={onClose}><X size={15} /></Button>
        </div>
      </div>
      <div className="log-lines">
        {lines.map(([time, level, source, copy]) => (
          <div key={`${time}-${level}`}><span className="time">{time}</span><span className={level === "DONE" ? "success-log" : "info"}>{level}</span><span>{source}</span><span className="log-copy">{copy}</span></div>
        ))}
      </div>
    </section>
  );
}

function ResizeHandle({ orientation }: { orientation: "horizontal" | "vertical" }) {
  return (
    <Separator className={`resize-handle resize-${orientation}`}>
      <div className="resize-grip">
        {orientation === "horizontal" ? <GripVertical size={12} /> : <GripHorizontal size={12} />}
      </div>
    </Separator>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState<ViewKey>("execution");
  const [dark, setDark] = useState(() => window.localStorage.getItem("helm-theme") !== "light");
  const [fontSize, setFontSize] = useState<"compact" | "default" | "large">(
    () => (window.localStorage.getItem("helm-font-size") as "compact" | "default" | "large") || "default",
  );
  const [background, setBackground] = useState<"aurora" | "plain" | "grid">(
    () => (window.localStorage.getItem("helm-background") as "aurora" | "plain" | "grid") || "aurora",
  );
  const [contrast, setContrast] = useState<"standard" | "high">(
    () => (window.localStorage.getItem("helm-contrast") as "standard" | "high") || "standard",
  );
  const [aiOpen, setAiOpen] = useState(true);
  const [logsOpen, setLogsOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => window.localStorage.getItem("helm-sidebar-collapsed") === "true",
  );

  const changeTheme = () => {
    const next = !dark;
    setDark(next);
    window.localStorage.setItem("helm-theme", next ? "dark" : "light");
  };

  const updateAppearance = (next: Partial<{
    theme: "dark" | "light";
    fontSize: "compact" | "default" | "large";
    background: "aurora" | "plain" | "grid";
    contrast: "standard" | "high";
  }>) => {
    if (next.theme) {
      setDark(next.theme === "dark");
      window.localStorage.setItem("helm-theme", next.theme);
    }
    if (next.fontSize) {
      setFontSize(next.fontSize);
      window.localStorage.setItem("helm-font-size", next.fontSize);
    }
    if (next.background) {
      setBackground(next.background);
      window.localStorage.setItem("helm-background", next.background);
    }
    if (next.contrast) {
      setContrast(next.contrast);
      window.localStorage.setItem("helm-contrast", next.contrast);
    }
  };

  const toggleSidebar = () => {
    setSidebarCollapsed((current) => {
      window.localStorage.setItem("helm-sidebar-collapsed", String(!current));
      return !current;
    });
  };

  return (
    <div className={`app ${dark ? "theme-dark" : "theme-light"} font-${fontSize} background-${background} contrast-${contrast}`} id="app-shell">
      <div className={`sidebar-shell ${sidebarCollapsed ? "is-collapsed" : ""}`}>
        <Sidebar
          active={activeView}
          collapsed={sidebarCollapsed}
          onChange={setActiveView}
          onToggle={toggleSidebar}
        />
      </div>
      <div className="workspace-shell">
          <Header dark={dark} onTheme={changeTheme} onAi={() => setAiOpen(!aiOpen)} view={activeView} />
          <Group className="body-row" id="body-layout" orientation="horizontal">
            <Panel defaultSize="76%" id="main-area" minSize={520}>
              <Group className="center-column" id="center-layout" orientation="vertical">
                <Panel id="main-view" minSize={350}>
                  {activeView === "execution" ? (
                    <ExecutionContent />
                  ) : (
                    <OtherView
                      appearance={{ theme: dark ? "dark" : "light", fontSize, background, contrast }}
                      onAppearanceChange={updateAppearance}
                      onNavigate={setActiveView}
                      view={activeView}
                    />
                  )}
                </Panel>
                {logsOpen && (
                  <>
                    <ResizeHandle orientation="vertical" />
                    <Panel defaultSize={116} id="activity-log" maxSize="40%" minSize={82}>
                      <LogPanel onClose={() => setLogsOpen(false)} />
                    </Panel>
                  </>
                )}
              </Group>
              {!logsOpen && (
                <Button className="open-logs" onClick={() => setLogsOpen(true)}>
                  <TerminalSquare size={15} /> 打开活动流
                </Button>
              )}
            </Panel>
            {aiOpen && (
              <>
                <ResizeHandle orientation="horizontal" />
                <Panel defaultSize={260} id="ai-copilot" maxSize="36%" minSize={220}>
                  <AiPanel onClose={() => setAiOpen(false)} />
                </Panel>
              </>
            )}
          </Group>
      </div>
    </div>
  );
}
