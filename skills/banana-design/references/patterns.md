# Banana Design · 组件与样式写法

## 一、优先级顺序

1. 项目自有组件库
2. 无头原语（Base UI / Radix / headlessui）
3. 组合组件（shadcn 风格）
4. 自己写

只有前三级都没有对应物时，才写第 4 级。新写的底层组件放进既有组件目录，沿用该目录写法，不另起一套。

## 二、组件使用

- 用索引找原语，用契约决定用法。
- 复用复合组件前先判断契约是否匹配，不匹配退回基础契约。
- 不写遮蔽既有契约的二次包装层。包装层只做组合，不重实现基座逻辑：行为归基座，表现归包装层。
- 自研行为不写进 shadcn 原始组件目录，否则 `shadcn add` 会覆盖用户那份。
- 图标走既有集合，禁止自造生成式图标文件。品牌图标用官方 SVG，不用字母缩写。
- 纯图标按钮只给通用动作（关闭、复制、主题、播放、上一个 / 下一个），每个都要 `aria-label`。
- 同一视图里两个省略号控件要能区分：紧凑溢出用横向 `MoreHorizontal`，最右主菜单用纵向 `MoreVertical`。

### 无样式基座组件的契约

自研基座组件要满足：

- 本身不含样式，状态用 `data-*` 暴露
- 支持 `asChild`
- 转发 ref
- 设 displayName
- 缺 context 时抛错，而不是静默降级
- 基座的 hook 属内部实现，不从入口导出；状态经 render props 传递

## 三、变体与类名

```tsx
// 变体用 CVA，颜色尺寸走 token
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground",
        default: "border border-border bg-background text-foreground",
        text: "text-foreground",
        danger: "bg-destructive text-destructive-foreground",
      },
      size: {
        sm: "h-7 px-3",
        md: "h-9 px-4",
        lg: "h-10 px-6",
        icon: "size-9",
      },
    },
  }
);
```

- 类名合并用 `cn`（tailwind-merge + clsx）。
- 一个视图只放一个 primary 按钮。
- 状态样式优先用原语的 `data-*` 属性与 CSS 变量，不把原语状态复制进 React 只为加 class。

## 四、间距与排版写法

### 正确

```tsx
<div className="flex flex-col gap-2 px-3 py-2">
  <span className="text-sm text-muted-foreground">说明</span>
</div>
```

### 错误

```tsx
// 组件内布局优先用 gap 与 padding
<div className="mt-2 space-y-3">
  <span className="text-[13px] text-gray-400">说明</span>   {/* 任意值 + 裸调色板色 */}
</div>
```

- 组件内的布局间距优先用 `gap-*` 与 padding 类；确需 margin 时说明用途并用间距 token（原文是"避免改动元素 margin"，不是一律禁止）。
- 文本溢出用 `text-ellipsis`。
- 少写临时 CSS，改用既有全局工具类。
- 禁止任意值类名（`p-[13px]`、`text-[#333]`），例外要登记。
- 优先用 `rem` 而不是 `px`（可缩放）；固定像素几何除外。
- JSX 过长或出现花括号语句就是拆分信号；禁嵌套三元。
- 字体分档并指向配置文件，不让模型手动改字符串大小写，正确做法是单独提供展示字符串。

## 五、状态样式

```tsx
// 原语的状态用 data 属性暴露，样式挂在 CSS 侧
<button
  data-state={isPending ? "pending" : "idle"}
  data-disabled={isPending || undefined}
  className="disabled:pointer-events-none disabled:opacity-70"
>
```

- 不要把原语的状态复制进 React 状态再只为了加一个 class。
- 禁用态：`opacity-70` + `pointer-events-none`（按钮类），或描边灰字（输入类）。
- 悬停只能提高对比，不能降低透明度。

## 六、状态机

会经历阶段的功能建成状态机：

```ts
type RunPhase = "idle" | "preparing" | "streaming" | "succeeded" | "failed";
```

- 用一个可辨识联合体表达阶段，不用布尔量、可空字段、计数器等旁路编码。
- UI 只能从 selector 派生，组件不许自己判断阶段。
- 异步路径必须落到某个状态；会给请求加有界兜底。
- 渲染期读异步数据必须加守卫，Suspense 边界不代替守卫。
- 抢占工作要同步完成，先离开 idle 再 await。

## 七、空态、加载、错误

每个界面都要覆盖四种状态，缺一不可。

| 状态 | 做法 |
| --- | --- |
| 加载 | 布局可预知时用骨架屏或预留空间；短暂操作用带可访问名称的 spinner |
| 空 | 说清这里会出现什么，给一个明确的开始动作 |
| 错误 | 说清发生了什么，给一个下一步（重试、换模型、联系谁） |
| 成功 | 说清具体变了什么 |

- 数字加载失败就退化成不含数字的散文，绝不用一个看似合理的值。
- 加载器从场景表里选，不自造 spinner。
- 每个状态都只给一个明显的下一步。静默无操作是缺陷。
- 软依赖失效用告警表达，不隐藏整块区域；告警文案要指明依赖和该改什么。
- 每个写操作成功与失败都要提示，错误提示不许省；先失效缓存再提示。

## 八、可访问性写法

```tsx
// 正确
<button aria-label="关闭" data-tip="关闭">
  <XIcon aria-hidden="true" className="size-4" />
</button>

// 错误
<div role="button" onClick={close} tabIndex={0}>关闭</div>
<div onClick={close}>关闭</div>       {/* 缺角色与键盘 */}
<input placeholder="搜索" />            {/* placeholder 不能当 label */}
<div className="fixed inset-0 bg-black/50" />  {/* 自造 modal 遮罩 */}
```

- 用语义化 HTML，补 ARIA 标签，保证键盘可达。
- 焦点指示归组件所有，不用调用点补 prop。
- 弹窗与抽屉困住焦点，关闭时归还焦点。
- 布局用逻辑属性（`padding-inline-start`、`inset-inline-end`），支持 RTL。
- 状态不能只靠颜色表达。
- 不要给每一行 spinner 加 `role="status"`，那会变成多个 live region 重复播报；行级用带标签的 `role="img"`，列表只保留一个摘要 live region。
- 无障碍缺陷按正确性缺陷处理，不是"优化项"。
