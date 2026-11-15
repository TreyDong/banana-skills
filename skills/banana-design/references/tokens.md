# Banana Design · Token 规范

数值取自高星开源项目的通行做法与本规范的默认值；每条数值的性质与出处见 `references/sources.md`。

## 一、色彩

### 语义层

所有颜色走语义 token。token 名编码角色，不编码外观。

```
--background            页面底色
--foreground            正文
--card / --card-foreground       卡片面与卡上文字
--popover / --popover-foreground 浮层面与浮层上文字
--primary / --primary-foreground   主色与主色上的文字
--secondary / --secondary-foreground 次级面
--muted / --muted-foreground   弱化面与弱化文字
--accent / --accent-foreground 强调面（悬停、选中）
--destructive / --destructive-foreground 危险操作
--success-bg / --success-fg / --success-border    状态色三件套
--warning-bg / --warning-fg / --warning-border    同上
--info-bg / --info-fg / --info-border             同上
（Tailwind 侧对应 --color-success / --color-success-bg / --color-success-border）
--border                常规边框
--border-subtle         装饰细线、列表分隔
--input                 输入框边框
--ring                  焦点环
--link                  正文里的链接色
```

### 规则

- 状态色给三件套：`{status}-bg`、`{status}-fg`、`{status}-border`。不新增状态颜色，只新增状态。
- 强调色以背景 / 前景成对提供，两色都过 4.5:1。
- 结构用单色盘，颜色只承载语义。一个界面只保留一个强色。
- 品牌色只做标记：描边、胶囊、圆点、当前项、栏目标题。不做大面积阅读背景。
- 深色主题基色用中性黑，不用偏蓝的深色，保持两种模式气质一致。
- 每个颜色 token 必须有暗色对应值。
- 数据可视化用一组彼此区分的色相，明暗模式下饱和色与浅底角色互换。

### 对比度底线

| 对象 | 最低对比度 |
| --- | --- |
| 正文 | 4.5:1 |
| 大字（≥18.66px 或 14px 粗体） | 3:1 |
| 控件边界、图标、焦点环 | 3:1 |
| 禁用文字 | 2.5–3:1（仍要可读） |

明暗两套都要验。控件边界与装饰边框用不同 token，别共用。

### 切换机制

用 `data-theme` 属性挂在根元素，深浅两套值写在 `:root` 和 `[data-theme="dark"]`。首帧前从 localStorage 读一次并写 `<meta name="theme-color">`，避免闪白。

## 二、字体与字号

### 字阶

产品组件层（12 / 14 / 16 / 20 / 24 / 32）。报告排版层另有文档字阶 11 / 12 / 13 / 15 / 17 / 19 / 22，用于图注、表格、脚注，定义在 `assets/banana-report.css` 的 `--report-*` 变量里——报告正文字号落在 12–17px 区间，4px 网格在这个区间没有对应档位，所以那一层用 2px 细分网格（6 / 10 / 14 / 18），报告层属于刻度例外。


```
--text-xs    12px / 1.5    辅助、标签、元信息
--text-sm    14px / 1.5    正文、说明
--text-base  16px / 1.6    强调正文
--text-lg    20px / 1.35   小标题
--text-xl    24px / 1.3    标题
--text-2xl   32px / 1.25   页面主标题
--font-size-code  13px / 1.6    代码（Tailwind 侧 --text-code）
--font-family-mono               等宽字体族
```

- 正文只用 12 / 14 / 16 三档，不存在 13px。离刻度的值就近归整。
- 标题字重 600。h2/h3 加 `text-wrap: pretty`。
- 每页只放一个 h1。
- 等宽字体只用于代码、命令、包名、路径、标识符、版本号。
- 移动端输入框字号 16px。
- 禁止在组件里另写 `font-family`。中文界面下，字重不要低于 400（可变字体的 440 在中文下会发虚）。
- 字距用命名配方，不做微调。

## 三、间距与尺寸

### 间距刻度

4px 基准，只管 gap / padding / margin：

```
4 / 8 / 12 / 16 / 20 / 24 / 32
```

组内 8，容器内边距 12，组间 16，区块间 24–32。

半档（6 / 10 / 2）只在高密度列表产品里用，且必须整套统一，不能混着来。

### 圆角

```
--bd-radius-xs   4px     小控件、内层
--bd-radius-sm   6px
--bd-radius-md   8px     按钮、输入框
--bd-radius-lg   10px    卡片、面板
--bd-radius-xl   14px    弹窗
--bd-radius-pill 9999px  药丸、头像、圆形图标按钮
--bd-radius-none 0       页面本身、通栏区域
```

（原生 CSS 里用 `var(--bd-radius-lg)`；Tailwind 里用 `rounded-lg`，映射在 `assets/banana-tokens.css` 的 `@theme inline` 里。）

- 嵌套表面需要贴合时，内层圆角取 `max(0, 外层圆角 − 内边距)`；外层 12px 圆角配 4px 内边距时内层取 8px。
- 同一视觉组内不混用不同圆角值。
- 浮层不做直角（直角加阴影会在四角漏出月牙光）；通栏区域不做圆角。
- 营销 CTA 用 8px 矩形，不是药丸。`rounded-2xl` / `rounded-3xl` 不当装饰用。

### 控件高度

```
28px  小（表格内操作）
36px  默认
40px  大、触屏主按钮
```

触屏点击区 ≥ 44px。控件高 28 / 36 / 40px 是 Banana 默认值；40px 的控件要靠外部命中区或内边距达到 44px 触控目标。

### 边框

- 常规 1px。
- 0.5px 只用于装饰细线（分隔线、图表网格），不用作控件边界。
- 强调态可用 1.5px 或 1.75px。
- 边框颜色走 `--border` / `--border-subtle`，不用纯黑纯白。

### 阴影

三级，语义命名：

```
--elevation-raised    0 2px 4px + 0 1px 2px -1px      抬起的卡片
--elevation-floating  0 8px 16px                      浮层：菜单、popover
--elevation-overlay   0 16px 32px                     弹窗
```

多数卡片不要阴影，用边框分层。阴影与边框不要在同一条边上叠加。

### 层级

```
--layer-panel             40   粘性栏、面板
--layer-floating          60   菜单、popover
--layer-modal             80   弹窗
--layer-modal-floating    90   弹窗内的浮层
--layer-toast             100  通知
```

用变量，不写裸数字。portal 逃出层叠上下文后仍能压对层。

## 四、布局

### 容器宽度

| 用途 | 宽度 |
| --- | --- |
| 阅读正文 | 768px（`--container-prose`） |
| 对话列 | 880px（`--container-chat`） |
| 报告正文列 | 860px（`--container-report`，只在 `banana-report.css` 里；报告表格多，需要更宽的列） |
| 表单 / 设置 | 1024px |
| 整页最大 | 1440px |
| 侧栏 | 240px（紧凑）/ 280px（标准） |

宽屏时居中，两侧留白增长，不让内容无限拉长。

### 断点

下面是**测试宽度**，不是布局切换点。行业没有统一的断点值，这组数只用来规定在哪些宽度下做检查：

```
360px    最窄检查宽度
768px    单栏 / 双栏检查宽度
1024px   侧栏常驻检查宽度
1280px   宽版检查宽度
1536px   超宽检查宽度
```

真正的切换点按内容溢出决定。

- 何时堆叠按容器宽度判断（容器查询），不只看屏幕宽度。
- 断点层只管字号缩放、间距收缩、触达面积。栏数变化属于骨架。
- 不产生布局偏移：预留空间，流式内容用骨架屏占位。
- 加载时绝不改变滚动位置。

### 页面骨架

Agent 类界面固定四层：顶栏（56px）→ 主区 flex 自适应 → 阅读列居中 → 底部输入区固定。

消息区与输入区的经典结构是 `grid-template-rows: 1fr auto`：消息区吃剩余高度，输入区按内容长高。输入框永远不写死像素高度。

## 五、动效

| 场景 | 时长 | 缓动 |
| --- | --- | --- |
| 状态变化、悬停 | 100–200ms | `--ease-out` |
| 浮层进出 | ≤ 300ms | `--ease-out` |
| 弹窗 | ≤ 300ms | `--ease-out` |
| 颜色变化 | 150ms | `--ease-out` |
| 按下反馈 | 即时 | 缩放到 0.985 |

- 新增动效时注明它反馈的是哪次操作或状态变化；指不出用途就不加动效。
- 优先动 transform 与 opacity；允许颜色过渡（背景、边框、文字色）；不动会触发布局的属性（width / height / top / left / margin）。
- 不为了活泼把缓动改成弹跳曲线。
- 离屏、后台标签页、减弱动效偏好时暂停循环动画。
- 必须支持 `prefers-reduced-motion`。

## 六、暗色与多主题

- 每个颜色 token 在两套主题下都有值，深色不是"把亮度调低"。
- 中性色用一条 oklch 色调，靠明度分档，不靠色相分档。
- 深色下的饱和色要降饱和，浅底角色互换。
- 换肤只改第一层（原始值），语义层用别名指向原始层，组件类名不动。
- 改公开 token 面时，同时验证内置明暗默认值和自定义主题的回退路径。
