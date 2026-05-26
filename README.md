# iPhone 摄影模式启动器 Pro

一个可添加到 iPhone 主屏幕的 PWA 摄影风格控制台。打开后可一键选择 5 种拍照氛围，并通过 iOS 的相机采集入口呼出相机。

## 项目结构

```text
摄影风格/
├── index.html
├── styles.css
├── modes.js
├── app.js
├── manifest.webmanifest
├── sw.js
├── .nojekyll
├── assets/
│   ├── apple-touch-icon.png
│   ├── icon-512.png
│   └── icon.svg
└── README.md
```

根目录就是 GitHub Pages 发布目录，不需要构建步骤。

## GitHub Pages 部署

1. 在 GitHub 新建一个仓库，例如 `photo-mode-pro`。
2. 把当前文件夹里的文件提交到仓库根目录。
3. 进入仓库 Settings -> Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub 生成网址。

最终访问地址通常是：

```text
https://你的用户名.github.io/photo-mode-pro/
```

如果仓库名是 `你的用户名.github.io`，访问地址会是：

```text
https://你的用户名.github.io/
```

## 更新线上版本

每次修改后提交并推送：

```bash
git add .
git commit -m "update photo modes"
git push
```

如果改了界面、逻辑、配置或图标，并希望 iPhone 立刻刷新离线缓存，请同步修改 `sw.js` 里的缓存版本号：

```js
const CACHE_NAME = "photo-mode-launcher-pro-v3";
```

版本号变化后，iPhone 会更可靠地拿到新文件。

## 本地运行

在当前文件夹启动一个本地静态服务：

```bash
python3 -m http.server 5174 --bind 0.0.0.0
```

然后在 Safari 打开：

```text
http://localhost:5174
```

如果要在 iPhone 上访问，请让 Mac 和 iPhone 连接同一个 Wi-Fi，然后在 Mac 上查看本机局域网 IP，用 iPhone Safari 打开：

```text
http://你的电脑IP:5174
```

## 添加到 iPhone 主屏幕

1. 用 Safari 打开本地地址。
2. 点底部分享按钮。
3. 选择“添加到主屏幕”。
4. 名称保留“摄影模式 Pro”。
5. 从桌面图标打开后，会以接近原生 App 的全屏方式运行。

## 功能说明

- 首页包含 5 个摄影模式：韩系日常、城市高级感、女生自拍、清新自然、夜景电影感。
- 每个模式都有图标、描述、关键词和氛围颜色。
- 点击模式会打开底部毛玻璃控制面板，显示适用场景、曝光或亮度建议。
- 点击“打开相机”会通过 iOS 网页相机采集入口呼出相机。
- 支持深色模式、安全区域、横竖屏、离线缓存和主屏幕 PWA。

## iOS 权限限制

iOS PWA 不能直接修改系统亮度、强制切换系统深色模式、开启勿扰模式，也不能稳定跳转 Apple 原生相机 App。本项目采用可长期使用的替代方案：

- 用屏幕暗层模拟不同亮度环境。
- 用界面氛围切换模拟深色或清亮取景状态。
- 用 `input capture` 呼出 iOS 相机采集界面。
- 对勿扰模式给出明确的控制中心提示。

## 新增摄影模式

打开 `modes.js`，在 `window.PHOTO_MODES` 数组里新增一项：

```js
{
  id: "new-mode",
  icon: "📷",
  name: "新模式",
  description: "首页卡片描述。",
  prompt: "点击后显示的场景提示",
  advice: ["曝光 -0.7", "冷调", "高对比"],
  keywords: ["关键词一", "关键词二"],
  accent: "#8aa8ff",
  accentSoft: "rgba(138, 168, 255, 0.52)",
  sheetGlow: "rgba(138, 168, 255, 0.42)",
  brightness: 0.65,
  forceDark: true,
  camera: "environment",
  note: "底部补充建议。"
}
```

字段说明：

- `camera: "environment"` 使用后摄入口。
- `camera: "user"` 使用前摄入口。
- `brightness` 取值 0 到 1，数值越小界面暗层越明显。
- `forceDark` 和 `forceLight` 会改变顶部状态提示。

新增或修改模式后，建议把 `sw.js` 的 `CACHE_NAME` 版本号加 1，再推送到 GitHub Pages。
