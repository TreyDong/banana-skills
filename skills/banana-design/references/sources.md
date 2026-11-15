# 来源映射

这份规范里的每条规则都能追到出处。本表按主题列出主要来源仓库与文件，行号对应调研时该仓库 HEAD 的位置（2026-11-14）。

## 〇、来源类别：哪些是共识，哪些是本规范自选

引用规则前先分清三类，避免把自选值说成行业共识：

| 类别 | 含义 | 例子 |
| --- | --- | --- |
| 来源共识 | 多个项目独立采用同一做法 | 4px 间距刻度、语义 token 优先、审批动作靠近输入框、正文对比度 4.5:1、状态四分法 |
| 单项目做法 | 只有一个项目这么写，属可选风格 | lobehub 的 20 个语义色与 4px 圆角刻度、opencode 的 147 个原始色与 elevation 三档、vibe-kanban 的看板布局、tambo 的品牌色 95% 中性化 |
| Banana 默认值 | 本规范为了能直接落地自己选定 | 圆角基准 0.625rem（lobehub 4/6/8/12、opencode 0/50%/999px/22.5% 都不一致）、控件高 28/36/40（来源多为 40px 单值）、断点测试宽度、容器宽度 768/880、报告层 2px 细分网格与 11–22px 文档字阶 |

自选值的取舍写在 `SKILL.md` 第 0 节与 `references/tokens.md`。改这些值时同步改这两处，别只改 CSS。

## 一、我们抓下来的规范文件清单

共 67 份，来自 18 个仓库：

| 仓库 | 拿到的文件 |
| --- | --- |
| lobehub/lobehub | `DESIGN.md`、`DESIGN.dark.md`、`AGENTS.md`、`.agents/skills/lobe-design/references/design.md`、`.agents/ux/product.md` |
| langflow-ai/langflow | `DESIGN.md`、`AGENTS.md` |
| anomalyco/opencode | `AGENTS.md`、`packages/{ui,app,session-ui}/AGENTS.md`、`services/site/DESIGN.md`、`packages/plugins/figma/skills/*` |
| assistant-ui/assistant-ui | `AGENTS.md`、`packages/AGENTS.md`、`packages/ui/AGENTS.md`、`apps/docs/content/design.md`、`.claude/skills/variants/SKILL.md` |
| tambo-ai/tambo | `TOKENS.md`、`AGENTS.md`、`CLAUDE.md`、`.claude/skills/{building-settings-ui,compound-components,creating-styled-wrappers,validating-accessibility}/SKILL.md` |
| dyad-sh/dyad | `PRODUCT.md`、`AGENTS.md`、`rules/{ui-styling,product-principles,base-ui-components,adding-settings}.md` |
| langgenius/dify | `AGENTS.md`、`packages/dify-ui/AGENTS.md`、`web/AGENTS.md`、`.agents/skills/frontend-code-review/**` |
| CopilotKit/CopilotKit | `AGENTS.md`、`CLAUDE.md`、`.cursor/rules/{frontend-development,quick-reference,working-with-rules}.mdc`、`showcase/shell-docs/{DESIGN,PRODUCT}.md` |
| OpenHands/OpenHands | `AGENTS.md`、`.agents/skills/{frontend-development,pr-design-doc}/**` |
| BloopAI/vibe-kanban | `AGENTS.md`、`CLAUDE.md`、`packages/local-web/AGENTS.md` |
| RooCodeInc/Roo-Code | `AGENTS.md`、`.roo/rules/rules.md` |
| cline/cline | `AGENTS.md`、`.agents/skills/opentui/**` |
| continuedev/continue | `.continue/rules/{colors,css-units,migrate-styled-components-to-tailwind}.md` |
| open-webui/open-webui | `static/BRANDING.md` |
| janhq/jan | `web-app/CONTRIBUTING.md` |
| stackblitz-labs/bolt.diy | `CONTRIBUTING.md` |
| bytedance/UI-TARS-desktop | `CONTRIBUTING.md` |
| FlowiseAI/Flowise | `CONTRIBUTING.md` |

## 二、按主题

### 色彩与主题

- lobehub `DESIGN.md` L95「token 名字编码角色，同名在明暗两种主题下解析到不同值；只按名字消费，不按值」；L104「文字与表面分属两套刻度」；L76–84 功能色派生档位；L158–178 主题通过具名属性声明
- lobehub `design.md` L189「一旦发现自己在写 `isDarkMode ? '#fff' : '#000'`，说明该换成 token」
- langflow `DESIGN.md` L514「结构 UI 用单色盘」；L533「强调色以背景/前景成对提供，两色都要满足 WCAG AA 4.5:1」；L516「深色主题基色用中性 zinc 黑而不是偏蓝的深色」
- assistant-ui `design.md` L61「中性色只用一条 oklch 色调」；L70–71「一页只有一个活跃强调色，且只能是蓝」
- tambo `TOKENS.md` L5–6「中性默认，品牌例外：目标 95% 的界面用中性色」；L34「`border-primary` / `ring` 只用于焦点与激活态」
- opencode `services/site/DESIGN.md` L14「每种颜色写成 `light-dark()` 对」；L16「两个主题下与背景对比约 1.3–1.5:1」
- CopilotKit `showcase/shell-docs/DESIGN.md` L185「白色承载阅读内容，lilac-grey 承载框架」；L275「新配色对必须在两个主题下检查」
- OpenHands frontend-development guide L25–27「禁止裸 Tailwind 调色板类、未声明命名色与裸 SVG 填色，全仓 lint 拦截」
- opencode `AGENTS.md` L28–31「按语义角色选 token」「禁止挪用最像的那个 token」「缺角色先扩 schema」

### 字体与字号

- lobehub `DESIGN.md` L116「正文字阶是 12 / 14 / 16，没有 13px token」；L117 标题 38→16 配 600
- opencode `services/site/DESIGN.md` L24「所有字号取自 `--fs-*` token；不小于 12px」；L28「移动端输入框字号 16px」；L30「正文阅读宽度约 70 字符一行」；L32–33「每页只放一个 h1」
- opencode `packages/ui/AGENTS.md` L22「13px 文本至少用 16px 行高，否则 g/j/p/q/y 会被裁」；L23「`line-height: 1` 和 `leading-none` 只留给图标类非文字字形」
- assistant-ui `design.md` L80「等宽字体只用于代码、命令、包名、路径、标识符和版本」
- lobehub `design.md` L101「禁止在组件里另写 `font-family`」

### 间距、圆角、阴影

- lobehub `DESIGN.md` L124「间距统一 4px 基准刻度；离刻度的值算漂移」；L78–80「控件高度 28 / 36 / 40」；L41–45「阴影只分三级」；L146–153「圆角刻度固定 4/6/8/12/9999」
- lobehub `design.md` L99「圆角是嵌套关系：内层 = 外层 − padding」
- assistant-ui `design.md` L16–18「页面本身圆角为 0」；L54–55「浮层绝不做直角，通栏区域绝不做圆角」；L112「阴影全局归零，只有浮层可以有阴影」
- langflow `DESIGN.md` L684「按钮统一规格：40px 高、8px 圆角、字重 500、字号 14px」；L668「边框标准 1px」
- opencode `services/site/DESIGN.md` L12–13「圆角刻度只有 0、50%、999px、22.5%」
- OpenHands frontend-development guide L1–21「禁止任意值类名」；L88–89「固定像素几何不能换成 rem 别名」
- continue `.continue/rules/css-units.md` L5「优先用 rem 而不是 px」
- opencode `packages/ui/AGENTS.md`「三层 elevation：raised / floating / overlay」
- jan `web-app/CONTRIBUTING.md` L105–111（语义化 HTML、对比度、键盘可达）

### 布局

- lobehub `DESIGN.md` L126「每个界面都要同时做明暗两版、桌面与移动两版」；`design.md` L205「断点层只管字号缩放、间距收缩、触达面积」
- opencode `services/site/DESIGN.md` L50「`--page-max` 为 1728px」；L58「不产生布局偏移（CLS 0）」；L57「加载时绝不改变滚动位置」；L59「何时堆叠按自身容器宽度判断」
- langflow `DESIGN.md` L604「侧栏展开 19rem / 收起 4rem」；L615–619 断点 45rem / 1200 / 1400 / 1500
- assistant-ui `design.md` L124「一致性来自共享词汇而不是固定网格」

### 组件

- lobehub `DESIGN.md` L157–162「优先用系统的无头原语，再退到组合组件」；L164「一个视图只放一个 primary 按钮」；L166「样式优先 `createStaticStyles` + `cssVar`」；`design.md` L213「不写库内部类名」
- CopilotKit `DESIGN.md` L232「不手搓框架已提供的组件；用官方 CLI 安装」
- dyad `rules/ui-styling.md` L5「品牌/厂商图标用官方 SVG」；L26–28「两个省略号控件要视觉可区分」
- OpenHands frontend-development guide L52「内联样式全局告警」
- tambo `.claude/skills/compound-components/SKILL.md` L227–238 无样式基座组件契约
- assistant-ui `packages/ui/AGENTS.md` L7–9「自研行为不写进 shadcn 原始组件目录」「不从上游重新 vendor」「变体用固定后缀命名」；L12「Web 组件动效只用 CSS」

### 交互与动效

- lobehub `DESIGN.md` L140「动效只为解释变化，不做装饰；必须支持 `prefers-reduced-motion`」；L142「状态变化与浮层 100–200ms，覆盖层与弹窗最多约 300ms」
- opencode `services/site/DESIGN.md` L106「只动 transform 与 opacity」；L108「颜色变化缓动 150ms，按下缩放到 0.985」；L109 抽屉弹簧参数；L95「触摸端不放只能悬停触发的 UI」；L98「菜单在 Escape、外部点击和选中时关闭，并把焦点还给触发元素」；L79「复制类操作就地反馈并通过 live region 播报」
- langflow `DESIGN.md` L646–647「浮层入场 400ms、`cubic-bezier(0.16, 1, 0.3, 1)`、从 0.95 缩放」；L654–656「悬停用背景色变化，不加阴影；按下 `active:scale-[0.97]`」
- dyad `rules/product-principles.md` L60「复制按钮切成绿色对勾 2 秒后复原」
- cline `.agents/skills/opentui/references/animation/REFERENCE.md` L172–234 缓动函数名单

### 状态与空态

- lobehub `DESIGN.md` L196「四个数据状态都要做：空、加载、错误、成功」
- assistant-ui `design.md` L34「数字加载失败就退化成不含数字的散文」；L139「加载就是骨架屏」
- dyad `PRODUCT.md` L28「每个状态都要说明正在发生什么，并只给一个明显的下一步；静默无操作是 bug」
- opencode `services/site/DESIGN.md` L92「禁用态画成描边 + 灰字」；L94「加载用 `aria-busy="true"`」；L116「不发占位内容」
- dyad `rules/ui-styling.md` L43–45「不要给每一行的 spinner 都加 `role="status"`」；L47「轮询时保持已验证的成功消息常驻」
- tambo `AGENTS.md` L244–245「loading 态用数据层的 loading 状态或骨架屏，禁止只有转圈」
- opencode `packages/app/AGENTS.md` L33–40 状态机规则

### 可访问性

- opencode `services/site/DESIGN.md` L123「正文对比度至少 4.5:1；控件至少 3:1」；L125「焦点画成 2px 链接蓝环，落在独立按钮外侧 2px」；L97「触屏点击目标至少 44px」；L128「装饰性 SVG 标 `aria-hidden`」；L129「弹窗里困住焦点，关闭时归还」；L137「布局用逻辑属性支持 RTL」
- dyad `PRODUCT.md` L36–38「WCAG 2.1 AA、`prefers-reduced-motion` 全覆盖」
- tambo `.claude/skills/validating-accessibility/SKILL.md` L23–28、L62–68、L82 禁止项
- dify `.agents/skills/frontend-code-review/references/accessibility-ui.md` L3–6「无障碍缺陷按正确性缺陷处理」；L25–30 焦点与禁用语义归属；L57–68「关键信息不能只靠 hover」
- assistant-ui `AGENTS.md` L19「每次 UI 改动都要保住可访问性 + 键盘 + 响应式」；L22「修 bug 禁止用关功能、删动画、放宽 API 的方式」

### 品牌与文案

- lobehub `DESIGN.md` L172「术语表固定」；L176「同一动作全站用同一个动词」；L177「动作名用动词 + 名词」；L179「进行中用现在分词加省略号」；L183「信息与温度默认 80/20」；L185–187 敏感消息三步序；L189「不用说教式鼓励」
- opencode `services/site/DESIGN.md` L37「界面文案里不用冒号」；L38「写陈述句，不用反问句」；L39–40 产品名固定
- assistant-ui `design.md` L94–99「不写标语、不堆叠碎片句、不叙述读者感受、不用 simply/just、辅助文案说明结果」
- dyad `PRODUCT.md` L17–24 语气冷静而有能力 + 四条反面参考；L31「每个界面只放一个主行动」
- open-webui `static/BRANDING.md` L5、L7「品牌资产不可改、不可遮蔽、不可替换」
- OpenHands frontend-development guide L141–161 i18n 键名约定

## 三、AI 生成 UI 的治理

- lobehub `AGENTS.md` L142「日常任何 UI 任务：先读 `.agents/ux/product.md` 与 `.agents/ux/components.md`」；L136「项目层规则优先于通用 skill 规则」；L153「一次只进一个 stage」；L169–170「抽象指令先归一化，归一化不了就问用户，不要猜」；L177–181 规则分层 `structure > lint > rule > style`；L183 回流顺序；L92「界面渲染出来的文案变了就算产品行为，不豁免验收」；L97「验收链接写进 PR」
- assistant-ui `AGENTS.md` L67「嵌套 AGENTS.md 承载该目录的规则，改文件前先读」；L74–77「一条一个 bullet、最多一个 because-clause、同类错误复发才进文件、已有检查覆盖的只写一行指针、根文件 ≤8KB、嵌套 ≤5KB」
- dify `AGENTS.md` L3「先读最近的带作用域的 AGENTS.md」；`web/AGENTS.md` L17–26 组件优先、契约匹配、禁二次包装、图标走既有集合；`packages/dify-ui/AGENTS.md` L3–4「规则文件只做路由」；L12「CVA + cn + design token」；L16–17「状态样式优先用 data 属性」；`.agents/skills/frontend-code-review/SKILL.md` L10–15 评审四步、L19–27 检查包路由、L33–38 P0–P3 分级
- dyad `AGENTS.md` L142「Always use Base UI, never Radix UI」；L94–118 封掉 `npx eslint/prettier/tsc`；`rules/base-ui-components.md` L9–16、L106–108；`rules/ui-styling.md` L16、L65–69
- tambo `AGENTS.md` L151–167 严格 TS；L233 数据层；L244–245 状态；L249–250 间距；L486–492 依赖与人类专属；`.claude/skills/compound-components/SKILL.md` L16–19、L38–40；`.claude/skills/creating-styled-wrappers/SKILL.md` L14–17、L235
- OpenHands `AGENTS.md` L21、L45、L49、L53、L57–65、L99–100、L113 依赖冷静期、持久状态唯一归属者、人类专属动作、细则按功能域拆 skill；`packages/app/AGENTS.md` L17、L22、L24、L39、L131、L137 截图用隔离上下文、故事渲染真实组件、加测试前答三个问题
- CopilotKit `.cursor/rules/working-with-rules.mdc` L5「规则与产出不一致时主动修订规则并在回复里明说」；`AGENTS.md` L32、L42–43、L64 视觉改动后截图验收、视觉与品牌各自独立成 skill
- opencode figma skills：设计到代码先加载 skill、截图只作比对目标、Code Connect 连通组件直接复用、每个可见资源核四项、字体必须显式断言正确、`token-creation.md` 原始层与语义层分离、语义层一律别名、原始 token scope 置空、禁 `ALL_SCOPES`
- Roo-Code `.roo/rules/rules.md` L18「禁止关闭任何 lint 规则」；L22–23「新代码用 Tailwind 类，不用内联样式；用 VSCode 变量前先在 index.css 登记」
- continue `.continue/rules/colors.md` L5、L8–9「禁止 `text-gray-400` 这类显式色」；`.continue/rules/migrate-styled-components-to-tailwind.md` L5「遇到主题里没有的变量，先查来源再补进主题」
- vibe-kanban `packages/local-web/AGENTS.md` L5、L9–12、L67–72 样式变量集中、语义色名替代调色板色、视图无状态容器管状态
- cline `.agents/skills/opentui/SKILL.md` UI 专项 skill 的写法范式
- jan `web-app/CONTRIBUTING.md` L113–119「组件要小而专，禁 `any`，必须处理加载和错误态」

## 四、这些项目共同的空白

调研中确认没有仓库管好的环节，我们的设计系统要补上：

1. AI 写完 UI 之后，缺少跨页面的一致性自检流程（只有设计稿还原度比对）。
2. 响应式断点几乎无人管，只有一句"保持响应式"。
3. 暗色模式多数只写一半，没有强制两套都验。
4. 动效时长与缓动没有统一值表。
5. 空态与错误态没有统一模板，只有"要有"的要求。
6. 图标尺寸与网格没有硬约束。
7. 评审流程缺 UI 专项 checklist。
8. 界面文案的语气、长度、大小写几乎没有规范（除 opencode 的 i18n 章节）。
9. 可访问性没有自动化必过项，全靠人工。
10. 表格、图表、代码块这类高密度内容的排版规则缺失。

## 五、内部稽核

逐条原文摘录与外部审核记录存于 `references/distilled/`（仅本地保留，不随仓库分发）。
