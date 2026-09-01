# CFBox 订阅管理器

> **切换语言**  [简体中文](README.md)  [English](English.md)  [فارسی](فارسی.md)

> **运行在 Cloudflare Workers / Pages 上的代理订阅管理面板**——融合 CFnew 与 edgetunnel（cmliu）双方能力，既能在 `/UUID`（或自定义路径）上输出 VLESS / Trojan / xhttp 多协议订阅，又提供**双模式图形化配置面板**（标准模式 / 进阶模式，一键切换）、**优选订阅生成**（内置 26 条优选源）、多客户端订阅、网络测试、KV 存储改完即生效等能力。
---
> **[Telegram 交流群](https://t.me/SZ_PAI)**

> **[YouTube 频道](https://www.youtube.com/@PAI_CN)**
---
## 更新内容（v1.0 → v1.1）

### 内置优选源扩充
- 内置优选源由 **26 条扩充至 32 条**
- bestcf 区域源由 **5 地扩展至 11 地**，新增：KR、DE、SE、NL、FI、GB

### 问题修复
- 修复指定指定地区后仍然下发所有节点的BUG

### IP 地区检测多源化
- **v1.0**：单源 `ping0.cc`
- **v1.1**：主源 `ping0.cc` + 备用源 `ipinfo.io`，自动降级

### 兼容性
- 配置项、API 接口、协议（VLESS / Trojan / xhttp）、面板 / 多语言 / 客户端等**全部保持不变**
- 升级无需修改 KV 和环境变量


## 一、项目概述与兼容性

| 项 | 内容 |
|---|---|
| 项目名称 | **CFBox 订阅管理器** |
| 运行环境 | Cloudflare Workers / Pages
| 部署形态 | 单文件 Worker（`CFBox明文版.js` / `CFBox混淆版.js`） |
| 数据存储 | Cloudflare KV（绑定变量 **K**，兼容 C/KV/ConfigKV/CFKV/CFBOX） |
| 面板模式 | 标准模式 + 进阶模式（右上角一键切换，进阶模式为霓虹科技风背景） |

### 1.1 兼容 CFnew 与 edgetunnel 双方的 IP / 节点

CFBox 在订阅生成时把 CFnew 与 edgetunnel（cmliu）双方的 IP / 节点来源统一合并，两套体系的 IP 均原生兼容、可同时使用。

| 来源 | 说明 |
|---|---|
| **CFnew 的 IP** | ① 优选域名列表原样内置（`cloudflare.182682.xyz`、`bestcf.top` 等）<br>② 在线优选（IPv4/IPv6 按运营商筛选）<br>③ `yx` 自定义优选使用 `IP:端口#名称` 格式 |
| **edgetunnel（cmliu）的 IP** | ① ProxyIP 反代域名库整段内置，作为备用地址 / 中转<br>② `GO2SOCKS5` / SOCKS5 降级链路兼容 |

订阅生成时会将官方直连地址、优选域名、在线优选 IP、内置优选源 / 自定义优选、仓库优选、ProxyIP 反代列表全部叠加合并后输出，IPv4 / IPv6 / 域名 / 带 `#名称` 别名三种形态均可解析。官方直连默认即可下发 **800+ 节点**（内置优选源 + Cloudflare 官方 CIDR 随机补足），并可通过「优选订阅生成」继续追加节点。

---

## 二、主要功能

| # | 功能 | 说明 |
|---|---|---|
| 1 | **多协议支持** | VLESS / Trojan / xhttp，可同时启用，图形界面一键开关 |
| 2 | **双模式面板** | 标准模式（常用模块紧凑排布）+ 进阶模式（自定义设置 / 高级控制），右上角一键切换，保持界面功能一致 |
| 3 | **优选订阅生成** | 三种模式：优选订阅生成器（小白专属）/ 随机优选模式（官方优选）/ 自定义订阅模式（支持汇聚），默认「自定义订阅模式」，内置 26 条优选源 |
| 4 | **内置优选类型** | 原生地址（`ena`）/ 优选域名（`epd`）/ 优选 IP（`epi`）/ 仓库优选（`egi`）独立开关 |
| 5 | **优选IP筛选设置** | IP 版本选择（IPv4 / IPv6）+ 运营商筛选（移动 / 联通 / 电信） |
| 6 | **网络测试** | 一键测试流媒体/AI（谷歌 / Netflix / Disney+ / HBO / HBOMax / Peacock / GitHub / GPT / Gemini）+ 一键测速当前节点（fiber.google.com） |
| 7 | **图形化配置** | KV 存储配置，改完立即生效（绑定 **K**） |
| 8 | **API 管理** | RESTful 增删优选 IP（`/api/preferred-ips`） |
| 9 | **多客户端** | CLASH / SURGE / SING-BOX / LOON / QUANTUMULT X / V2RAY / Shadowrocket / STASH / NEKORAY / V2RAYNG，按 UA 自动识别 |
| 10 | **多语言** | 中文 / فارسی / English，浏览器语言自动切换 + 右上角下拉切换 |
| 11 | **ECH** | Encrypted Client Hello 加密客户端握手 |
| 12 | **自定义设置** | 自定义首页 URL（`homepage`）/ 自定义路径 / 自定义 ProxyIP 融合为一个模块 |
| 13 | **客户端 path 参数** | `p` / `wk` / `rm` / `s` 单节点覆盖 |

---

## 三、部署说明

### Worker 部署

1. 登录 Cloudflare 控制台 → Workers 和 Pages → 新建 Worker
2. 将 `CFBox混淆版.js`（明文版）粘贴到 Worker 代码
3. 设置 **环境变量 `U`** = 你的 UUID（必需；大写 U，兼容 `UUID` / 小写 u）
4. 创建 **KV 命名空间** 并在 Worker 设置中绑定，变量名设为 **`K`**（主用；兼容 `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`）
5. 部署后访问 `https://你的域名/UUID` 进入图形化配置面板

### Pages 部署

1. 登录 Cloudflare 控制台 → Workers 和 Pages → 新建 Pages 项目
2. 将 `CFBox混淆版.js` 重命名为 `_worker.js`，压缩为 `.zip` 文件后上传（或直接拖拽 `_worker.js` 所在的文件夹）
3. 设置 **环境变量 `U`** = 你的 UUID（必需；大写 U，兼容 `UUID` / 小写 u）
4. 创建 **KV 命名空间** 并在 Pages 设置中绑定，变量名设为 **`K`**（主用；兼容 `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`）
5. 部署后访问 `https://你的域名/UUID` 进入图形化配置面板

### 登录流程

访问 `/` → 终端登录页 → 输入 UUID（或自定义路径）→「登录成功」→ 进入面板。

---

## 四、环境变量与配置变量表

> 优先级：**KV 配置 > 环境变量 > 默认值**

### 4.1 基础配置

| 变量 | 值 | 说明 |
|---|---|---|
| `U` | 你的 UUID | **必需**，用于访问订阅和配置界面（大写 U，兼容 `UUID` / 小写 u） |
| `p` | proxyip | 可选，自定义 ProxyIP 地址和端口（IPv4/IPv6/域名）。设置后 `wk` 地区匹配失效（互斥） |
| `s` | SOCKS5 地址 | 可选，`user:pass@host:port` 或 `host:port` |
| `d` | 自定义路径 | 可选，如 `/mypath` 或 `/path/to/sub`，不填用 UUID 路径 |
| `wk` | 地区代码 | 可选，手动指定 Worker 地区（SG/HK/US/JP…）。设置 `p` 后失效（互斥） |
| `homepage` | 自定义首页 URL | 可选，访问根路径 `/` 时显示该 URL 伪装页面 |

### 4.2 协议配置

| 变量 | 值 | 说明 |
|---|---|---|
| `ev` | yes/no | 启用 VLESS（默认启用） |
| `et` | yes/no | 启用 Trojan（默认禁用） |
| `ex` | yes/no | 启用 xhttp（默认禁用） |
| `tp` | 自定义密码 | Trojan 密码，留空用 UUID |
| `ech` | yes/no | 启用 ECH（默认禁用，启用后自动开启仅 TLS 模式） |

### 4.3 高级控制（进阶模式）

| 变量 | 值 | 说明 |
|---|---|---|
| `yx` | 自定义优选 | 支持命名，`1.1.1.1:443#香港节点,8.8.8.8:53#Google DNS` |
| `yxURL` | 优选来源 URL | 自定义 IP 列表来源（留空用内置默认源） |
| `scu` | 订阅转换地址 | 订阅转换服务地址（默认 `https://url.v1.mk/sub`） |
| `epd` | yes/no | 启用优选域名（默认启用） |
| `epi` | yes/no | 启用优选 IP（默认启用） |
| `egi` | yes/no | 启用仓库优选（默认启用） |
| `ena` | yes/no | 启用原生地址（默认关闭） |
| `qj` | no | 设为 `no` 启用降级：CF 直连失败 → SOCKS5 → fallback |
| `dkby` | yes | 设为 `yes` 只生成 TLS 节点 |
| `yxby` | yes | 设为 `yes` 关闭所有优选功能 |
| `rm` | no | 设为 `no` 关闭地区智能匹配 |
| `ae` | yes | 设为 `yes` 允许 API 管理（默认关闭） |

> 优选 IP 筛选（`ipv4` / `ipv6` / `ispMobile` / `ispUnicom` / `ispTelecom`）、自定义 DNS（`customDNS`，DoH 格式）、自定义 ECH 域名（`customECHDomain`）、ALPN 协商（`alpn`）等均可在面板「内置优选类型」「优选IP筛选设置」「高级控制」模块中配置（绑定 KV 后显示）。



---

## 五、面板功能说明（标准 / 进阶模式）

部署后访问 `/{UUID}` 进入图形化配置面板。右上角提供**模式切换按钮**，点击可在「标准模式」与「进阶模式」之间切换。

### 5.1 标准模式（常用模块紧凑排布）

| 模块 | 说明 |
|---|---|
| **配置管理** | KV 绑定后显示，保存全部配置（绑定 K） |
| **系统状态** | 显示 Worker 地区、检测方式、ProxyIP、当前 IP 等运行状态 |
| **优选订阅生成** | 优选订阅模式（关闭 / 优选订阅生成器 / 随机优选 / 自定义订阅），内置 26 条优选源，含「开始优选」「订阅接口」「链式代理」功能 |
| **选择客户端** | 10 种客户端（CLASH / SURGE / SING-BOX / LOON / QUANTUMULT X / V2RAY / Shadowrocket / STASH / NEKORAY / V2RAYNG），生成订阅链接并唤起应用 |
| **内置优选类型** | 原生地址（`ena`）/ 优选域名（`epd`）/ 优选 IP（`epi`）/ 仓库优选（`egi`）独立开关 |
| **优选IP筛选设置** | IP 版本（IPv4 / IPv6）+ 运营商（移动 / 联通 / 电信）筛选 |
| **网络测试** | 一键测试流媒体/AI + 一键测速当前节点 |
| **当前路径配置** | 显示使用类型 / 当前路径 / 访问地址 |
| **相关链接** | 常用外链（仓库、社区等） |

### 5.2 进阶模式（自定义设置 + 高级控制）

| 模块 | 说明 |
|---|---|
| **自定义设置** | 自定义首页 URL（`homepage`）/ 自定义路径（`d`）/ 自定义 ProxyIP（`p`）融合为一个模块 |
| **高级控制** | 订阅转换地址（`scu`）/ 允许 API 管理（`ae`）/ 地区匹配（`rm`）/ 出站方式（`qj`）/ TLS 控制（`dkby`）/ 优选控制（`epd`/`epi`/`egi`/`ena`/`yxby`） |

### 5.3 模式切换与背景

- 右上角「模式切换」按钮，标准模式 ↔ 进阶模式一键切换
- 进阶模式使用**霓虹科技风背景**，两种模式下模块布局重新合理排版，界面与功能保持一致

---

## 六、优选订阅生成及本地优选

### 6.1 优选订阅模式

| 模式 | 说明 |
|---|---|
| 关闭 | 使用默认订阅生成逻辑 |
| **优选订阅生成器（小白专属）** | 输入生成器域名，自动调用 edgetunnel 原版优选生成 API |
| **随机优选模式（官方优选）** | 按指定数量（`subRandomCount`）从 Cloudflare 官方 CIDR 随机生成优选 IP |
| **自定义订阅模式（支持汇聚）**（默认） | 按「自定义优选（每行一个）」中的来源逐条汇聚，支持 域名 / IPv4 / IPv6 / `sub://` 优选 API / `https://` 优选 API /内置优选源（自定义订阅模式默认 26 条）|

### 6.2 本地优选模式
> 优选方式 API所使用的项目接口与 [CFnew](https://github.com/byJoey/cfnew) 一致，可直接使用  [yx-tools](https://github.com/byJoey/yx-tools) 优选工具；优选结果可「下载」也可通过「一键上报」直接一键上报至项目。

### 6.3 其他参数

| 变量 | 说明 |
|---|---|
| `subRandomCount` | 随机优选数量（默认 16） |
| `subPort` | 指定优选端口（-1 = 随机端口） |
| `subName` | 订阅名称（选择客户端下方各客户端下发的订阅名称同步生效） |
| `subUpdateTime` | 订阅更新时间（小时，默认 3） |

---

## 七、性能优化与安全

- **KV 读取优化**：30 秒内存缓存，短窗口内完全信任缓存，减少高频请求对 KV 的打压
- **每 15 分钟自动优选一次**；多重备用方案、智能缓存
- **无效请求拦截**：非法路径直接返回 404，不触发 KV 读取
- **UUID 鉴权**：访问路径中的 UUID 与 `U` 变量一致（不区分大小写）才放行
- **降级链路**：CF 直连失败 → SOCKS5 → fallback，提高可用性

---

## 八、致谢

- 项目灵感来自于 [byJoey/cfnew](https://github.com/byJoey/cfnew) / [cmliu/Edgetunnel](https://github.com/cmliu/edgetunnel) 
- 优选接口 / 优选源：bestcf、WeTest 等社区维护
- IP 地区检测：ping0.cc
- 网络测速：[Google Speedtest](https://fiber.google.com/speedtest/)
