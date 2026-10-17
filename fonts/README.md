# 字体与图标说明

这个目录里的字体都是**本地自托管**的，页面不再请求 Google Fonts 或 cdnjs。

| 文件 | 用途 | 大小 |
| --- | --- | --- |
| `inter-latin-var.woff2` | Inter 可变字体，仅 Latin 子集 | 48 KB |
| `fa-solid-subset.woff2` | Font Awesome 6.4 Solid 子集 | 4.2 KB |
| `fa-brands-subset.woff2` | Font Awesome 6.4 Brands 子集（GitHub / QQ） | 1 KB |
| `fontawesome-subset.css` | 子集 `@font-face` 与 `.fa-*::before` 映射 | 2.4 KB |

中文不再加载 Noto Sans SC 网络字体，按下面的顺序回落到系统字体：

```
Inter → PingFang SC (macOS) → Microsoft YaHei (Windows) → Noto Sans SC (Linux/Android) → sans-serif
```

## 新增图标时注意

`fontawesome-subset.css` 只包含当前站内用到的 45 个图标。
**直接写一个新的 `fa-xxx` class 不会显示**，需要重新生成字体子集：

1. 从 Font Awesome 6.4.0 的 `css/fontawesome.css` / `css/brands.css` 找到图标的 Unicode；
2. 把 Unicode 加入 `fa-solid` 或 `fa-brands` 的子集字符集；
3. 用 `subset-font`（或 `pyftsubset`）重新生成 woff2，并在 CSS 里补一条 `.fa-xxx::before { content: "\fxxx" }`。

如果不想维护子集，也可以把 `fa-solid-900.woff2` 和 `fa-brands-400.woff2` 完整版放进本目录，替换 `fontawesome-subset.css` 里的 `@font-face`，代价是约 250 KB。
