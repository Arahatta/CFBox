# CFBox 订阅管理器

> **一个运行在 Cloudflare Workers 上兼容CFnew 与edgetunnel的代理订阅管理面板**——既能在 `/UUID` 路径上输出 VLESS/Trojan/xhttp 多协议订阅，又提供图形化配置界面（KV 存储、改完即生效），并内置延迟测试、流媒体/AI 连通性检测、多客户端订阅生成、多语言等能力。

---

## 目录

- [一、项目概述与兼容性](#一项目概述与兼容性)
- [二、主要功能](#二主要功能)
- [三、部署说明](#三部署说明)
- [四、环境变量与配置变量表](#四环境变量与配置变量表)
- [五、代码结构注释](#五代码结构注释)
- [六、功能说明](#六功能说明)
- [七、性能优化与安全](#七性能优化与安全)
- [八、致谢](#八致谢)

---

## 一、项目概述与兼容性

| 项 | 内容 |
|---|---|
| 项目名称 | **CFBox 订阅管理**（终端 v1.0） |
| 运行环境 | Cloudflare Workers / Pages（Node 兼容运行时，兼容性日期建议 `2026-01-20`） |
| 部署形态 | 单文件 Worker（明文版 / 混淆部署版） |
| 数据存储 | Cloudflare KV（绑定变量 **K**，兼容 C/KV/ConfigKV/CFKV/CFBOX） |


### 1.1 完全兼容 CFnew 与 edgetunnel 双方的 IP / 节点

> CFBox 在订阅生成时把 CFnew 与 edgetunnel（cmliu）双方的 IP / 节点来源统一合并，两套体系的 IP 均原生兼容、可同时使用。

**兼容性对照**

| 来源 | 在 CFBox 中的实现 | 代码位置 |
|---|---|---|
| **CFnew 的 IP** | ① 优选域名列表原样内置：`cloudflare.182682.xyz`、`speed.marisalnc.com`、`freeyx.cloudflare88.eu.org`、`bestcf.top`<br>② 在线优选走 cfnew 同款接口 `wetest.vip`（IPv4/IPv6 按运营商筛选）<br>③ `yx` 自定义优选完全用 cfnew 的 `IP:端口#名称` 格式<br>④ 开关体系 `epd` / `epi` / `egi` / `ena` 与 cfnew 一致 | **L271 直连域名列表**<br>**L2959 优选抓取**<br>**L662-694 yx 解析** |
| **edgetunnel（cmliu）的 IP** | ① cmliu 的 **ProxyIP 反代域名库**整段内置：`ProxyIP.HK/US/SG/JP/KR/DE/SE/NL/FI/GB/Oracle/DigitalOcean/Vultr/Multacom...CMLiussss.net` 作为备用地址/中转<br>② `GO2SOCKS5` / SOCKS5 降级链路兼容 edgetunnel<br>③ edgetunnel 风格的纯 `IP:端口` 列表可直接喂给 `yx` 或 `yxURL` 抓取 | **L200-270 备用地址列表**<br>**L5 GO2SOCKS5** |

**订阅生成时的合并逻辑（L2654-2680）**

```
最终节点列表 =
    自定义优选 (yx)           ← 手动/API 添加，IP:端口#名称
  + 优选域名列表              ← cfnew 直连域名（epd）
  + wetest 在线优选 (IPv4/v6) ← cfnew 同款接口（epi，按运营商筛选）
  + GitHub 仓库优选 (egi)
  + ProxyIP 反代列表           ← edgetunnel（cmliu），作为连接中转/降级
```

全部叠加合并后输出；IPv4 / IPv6 / 域名 / 带 `#名称` 别名三种形态均可解析。

**说明**

两个项目的"不兼容"通常不是格式问题，而是**优选 IP 来源 URL 不同**（cfnew 走 `wetest.vip`、edgetunnel 用自己的 IP 库）或 **ProxyIP 域名归属不同**。CFBox 已将上述来源统一合并，不再冲突。

- **CFnew 体系的开关**：`epd`（优选域名）/ `epi`（优选 IP）/ `egi`（仓库优选）/ `ena`（原生地址）
- **edgetunnel 体系的机制**：`ProxyIP.*.CMLiussss.net` 反代 + `GO2SOCKS5`/SOCKS5 降级
- 若个别节点仍连不上，可把该节点的分享链接或优选 IP 来源 URL 交给排查。

---

## 二、主要功能

| # | 功能 | 代码位置（区块） |
|---|---|---|
| 1 | **多协议支持**：VLESS / Trojan / xhttp，可同时启用 | 订阅请求处理 / WebSocket 代理核心 |
| 2 | **自定义路径**：可用自定义路径替代 UUID 路径（支持多级路径） | 路由分发 / 登录页 |
| 3 | **延迟测试**：内置测速工具，测优选 IP 延迟、自动获取机场码 | 面板前端逻辑 |
| 4 | **网络测试**：一键测试流媒体/AI（谷歌/Netflix/Disney+/HBO/HBOMax/Peacock/GitHub/GPT/Gemini）+ 一键测速当前节点（fiber.google.com） | 面板前端逻辑 / 网络测试接口 |
| 5 | **订阅转换**：可自定义订阅转换服务地址（`scu`） | 订阅请求处理 |
| 6 | **图形化配置**：KV 存储配置，改完立即生效（绑定 **K**） | 管理面板 / 面板前端逻辑 |
| 7 | **API 管理**：RESTful 增删优选 IP（`/api/preferred-ips`） | 路由分发 / 面板 |
| 8 | **多客户端**：CLASH / SURGE / SING-BOX / LOON / QUANTUMULT X / V2RAY / Shadowrocket / STASH / NEKORAY / V2RAYNG，按 UA 自动识别 | 多客户端订阅生成 / 订阅请求处理 |
| 9 | **多语言**：中文 / فارسی / English，浏览器语言自动切换 + 右上角下拉切换 | 登录页 / 管理面板 |
| 10 | **当前 IP 地区显示**：左上角「您当前IP地址：IP · 地区」，地区经 ping0.cc 检测 | 登录页 / 面板 HUD |
| 11 | **ECH**：Encrypted Client Hello 加密客户端握手 | ECH 功能区块 |
| 12 | **客户端 path 参数**：`p` / `wk` / `rm` / `s` 单节点覆盖 | WebSocket 代理核心 |

---

## 三、部署说明

### Worker 部署

1. 登录 Cloudflare 控制台 → Workers 和 Pages → 新建 Worker
2. 将 `CFBox明文版.js`（或混淆版）粘贴到 Worker 代码
3. 设置 **环境变量 `U`** = 你的 UUID（必需；大写 U，兼容小写 u）
4. 创建 **KV 命名空间** 并在 Worker 设置中绑定，变量名设为 **`K`**（主用；兼容 `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`）
5. **兼容性日期** 设置为 `2026-01-20`
6. 部署后访问 `https://你的域名/UUID` 进入图形化配置面板

### Pages 部署

1. 登录 Cloudflare 控制台 → Workers 和 Pages → 新建 Pages 项目
2. 将 `CFBox明文版.js`（或混淆版）压缩为 `.zip` 文件 → 上传 `.zip` 压缩文件
3. 设置 **环境变量 `U`** = 你的 UUID（必需；大写 U，兼容小写 u）
4. 创建 **KV 命名空间** 并在 Pages 设置中绑定，变量名设为 **`K`**（主用；兼容 `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`）
5. 重新上传 `.zip` 压缩文件
6. **兼容性日期** 设置为 `2026-01-20`
7. 部署后访问 `https://你的域名/UUID` 进入图形化配置面板

### 登录流程

访问 `/` → 终端登录页 → 输入 UUID（或自定义路径）→「登录成功」→ 进入面板。

---

## 四、环境变量与配置变量表

> 优先级：**KV 配置 > 环境变量 > 默认值**

### 4.1 基础配置

| 变量 | 值 | 说明 | 代码字段 |
|---|---|---|---|
| `U` | 你的 UUID | **必需**，用于访问订阅和配置界面（大写 U，兼容小写 u / UUID） | `认证令牌` |
| `p` | proxyip | 可选，自定义 ProxyIP 地址和端口（IPv4/IPv6/域名）。设置后 `wk` 地区匹配失效（互斥）。也可在节点 path 里单独指定 | `获取配置值('p')` |
| `s` | SOCKS5 地址 | 可选，`user:pass@host:port` 或 `host:port`。也可在节点 path 里单独指定 | `代理5配置` |
| `d` | 自定义路径 | 可选，如 `/mypath` 或 `/path/to/sub`，不填用 UUID 路径 | `自定义路径` |
| `wk` | 地区代码 | 可选，手动指定 Worker 地区（SG/HK/US/JP…）。设置 `p` 后失效（互斥） | `手动工作器地区` |

### 4.2 协议配置

| 变量 | 值 | 说明 | 代码字段 |
|---|---|---|---|
| `ev` | yes/no | 启用 VLESS（默认启用） | `启用明文` |
| `et` | yes/no | 启用 Trojan（默认禁用） | `启用木马` |
| `ex` | yes/no | 启用 xhttp（默认禁用） | `启用扩展传输` |
| `tp` | 自定义密码 | Trojan 密码，留空用 UUID | `配置默认值.tp` |
| `ech` | yes/no | 启用 ECH（默认禁用，启用后自动开启仅 TLS 模式） | `启用加密客户端问候` |

### 4.3 高级控制

| 变量 | 值 | 说明 | 代码字段 |
|---|---|---|---|
| `yx` | 自定义优选 | 支持命名，`1.1.1.1:443#香港节点,8.8.8.8:53#Google DNS` | `自定义优选地址列表` |
| `yxURL` | 优选来源 URL | 自定义 IP 列表来源，留空用默认 | `优选地址源` |
| `scu` | 订阅转换地址 | 默认 `https://url.v1.mk/sub` | `订阅转换接口` |
| `epd` | yes/no | 启用优选域名（默认启用） | `启用优选域名` |
| `epi` | yes/no | 启用优选 IP（默认启用） | `启用优选地址` |
| `egi` | yes/no | 启用 GitHub 默认优选（默认启用） | `启用仓库优选` |
| `ena` | yes/no | 启用原生地址（默认关闭） | `启用原生地址` |
| `qj` | no | 设为 `no` 启用降级：CF 直连失败 → SOCKS5 → fallback | `启用代理降级` |
| `dkby` | yes | 设为 `yes` 只生成 TLS 节点 | `禁用非传输层安全` |
| `yxby` | yes | 设为 `yes` 关闭所有优选功能 | `禁用优选` |
| `rm` | no | 设为 `no` 关闭地区智能匹配 | `启用地区匹配` |
| `ae` | yes | 设为 `yes` 允许 API 管理（默认关闭） | `配置默认值.ae` |

> **CFBox 专属定制**：优选 IP 筛选（`ipv4` / `ipv6` / `ispMobile` / `ispUnicom` / `ispTelecom`）、自定义 DNS（`customDNS`，DoH 格式）、自定义 ECH 域名（`customECHDomain`）、ALPN 协商（`alpn`）等均可在面板「内置优选类型」「优选IP筛选设置」模块中配置（绑定 KV 后显示）。

### 4.4 KV 存储设置

1. 在 Cloudflare Workers 中创建 KV 命名空间
2. 绑定 KV，变量名设为 **`K`**（兼容 `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`）
3. 重新部署
4. 访问 `/{UUID}` 使用图形化配置（改完立即生效，无需重新部署）

---

## 五、代码结构注释

> 以下按源码从上到下划分功能区块，逐段给出职责说明。行号为 `CFBox明文版.js` 中的起始行。

### 5.1 全局运行时变量（L4 ~ L40）

```js
// 认证令牌：由环境变量 U 读取的 UUID，用于访问订阅与面板鉴权
// GO2SOCKS5白名单 / 回退地址 / 代理5配置：降级链路（CF直连→SOCKS5→fallback）
// 自定义优选地址/域名列表：由 yx 变量与 API 添加的优选 IP 填充
// 功能开关：明文(ev)/木马(et)/扩展传输(ex)/ECH(ech)/降级(qj)/仅TLS(dkby)/
//           关闭优选(yxby)/地区匹配(rm)/启用原生地址(ena)
// 地区与路径：工作器地区(wk)/自定义路径(d)
// 优选开关：启用优选域名(epd)/启用优选IP(epi)/启用仓库优选(egi)
// KV：键值存储绑定（变量 K）、配置缓存（30 秒内存缓存，减少 KV 读取量）
```

### 5.2 配置默认值表（L42 ~ L74）

对应 README「基础/协议/高级控制」变量表的代码默认值对象：

- `wk`（地区）、`ev/et/ex`（协议开关）、`ech`、`tp`（Trojan 密码）
- `customDNS`（DoH）、`customECHDomain`（ECH 域名）、`alpn`
- `d/p/s`（路径/ProxyIP/SOCKS5）、`yx/yxURL/scu`
- `ena/epd/epi/egi`（原生/域名/IP/仓库优选）、`ae/rm/qj/dkby/yxby`
- 优选 IP 筛选：`ipv4/ipv6/ispMobile/ispUnicom/ispTelecom`

### 5.3 配置工具函数（L75 ~ L170）

- **开关归一化**：`是否开启值/归一配置开关/获取配置开关值`——将 `yes/no/true/false/1/0/on/off` 统一为布尔开关
- **环境变量读取**：`读取环境配置值/获取环境配置快照`——兼容**大写/小写变量名**（如 `U/u`、`K/k`，修复了大小写 BUG）
- **配置快照整理**：`整理有效配置/获取有效配置快照`——按「默认值 → 环境变量 → KV」优先级合并；保证至少启用一个协议（ev/et/ex 全关时自动启用 ev）

### 5.4 机场代码映射表（L172 ~ L190）

`地区映射`：延迟测试/优选节点自动获取机场码（SJC/LAX 等）并映射为中文名（圣何塞等），用于优选地址的机场/数据中心标签识别。

### 5.5 官方直连 / 优选地址获取（L191 ~ L315）

`取官方直连地址()`：内置 Cloudflare 官方优选域名与 IP 列表（含机场/地区标签），供节点生成使用；配合 `epd/epi/egi` 开关合并各类优选来源；`yx` 支持「IP:端口#名称」自定义命名（对应 README「优选节点命名」）。

### 5.6 代理协议错误码与协议常量（L316 ~ L360）

VLESS / Trojan / SOCKS5 / HTTP 隧道握手使用的错误信息（`错误_无效数据`、`错误_代理连接失败` 等）与协议文本（`文本_连接方法`CONNECT、`文本_代理认证头`Proxy-Authorization、HTTP 版本等）常量。

### 5.7 节点解析与命名工具 + KV 读写（L361 ~ L602）

- 节点唯一编号生成（`创建节点命名器/设置跳过编号/处理命名器`）
- 「IP:端口#名称」别名解析（`处理值节点别名部分/获取值节点别名基础`）
- ALPN 协商值规范化（`规范化应用层协议协商`，h3,h2,http/1.1）
- **KV 配置读写**（`加载键值配置/保存键值配置`）：绑定变量 K，30 秒内存缓存；配置值获取/设置（`获取配置值/设置配置值`）
- 地址可用性探测（`检查地址可用性`）、ProxyIP/地区匹配选择（`获取值备用地址/获取值地区值`：同地区 → 邻近 → 其他）

### 5.8 Worker 主入口 fetch 路由（L604 ~ L1080）

```js
export default { async fetch(请求, 环境, ...) }
```

- 请求进入先校验 UUID（不区分大小写，兼容 `U/u`）
- 路由分发：
  - **POST / WebSocket 升级** → 代理请求（VLESS/Trojan 协议解析转发）
  - **GET /** → 登录页终端
  - **GET /{UUID或自定义路径}** → 管理面板（图形化配置）
  - **GET /{UUID或路径}/sub...** → 订阅输出（按 User-Agent 自动识别客户端）
  - **/api/preferred-ips** → API 管理（查询/添加/删除优选 IP）
  - **/region** → 工作器地区检测接口
  - **/net-test** → 网络测试接口（流媒体/AI 连通性，CFBox 定制）

### 5.9 登录页终端（L1081 ~ L1545）

- 部署后访问 `/` 显示终端登录页；输入 UUID（或自定义路径）进入面板
- 支持 中文 / فارسی / English，按浏览器语言自动选择
- 顶部 HUD 显示访客当前 IP（`访客IP`，来自 CF-Connecting-IP）+ 地区（经 ping0.cc JSONP 检测）
- 登录页脚本：赛博矩阵雨特效（可经 FX 开关持久化关闭）、UUID 输入校验（RFC4122 格式）、语言切换并持久化（localStorage + Cookie 有效期 1 年）

### 5.10 多客户端订阅生成（L1634 ~ L2456）

对应 README「多客户端支持」：

- 分享链接解析（`解析值链接`）：将 `vless://`、`trojan://` 解析为节点对象（协议、地址、端口、SNI、指纹、传输类型、路径、Host）
- 客户端格式生成器：
  - `生成值值589` → **Clash / Mihomo** YAML（完整规则集 + 远端 rule-providers + DNS）
  - `生成值值562` → **Surge / Stash** ini
  - `生成值值552` → **Loon** ini
  - `生成值值` → **Quantumult X**（远端 filter 资源）
  - `生成值值数据对象` → **SING-BOX** JSON
  - 其余 → V2RAY / NEKORAY / Shadowrocket 等 Base64 订阅
- 所有 TLS 链接自动包含 `h3,h2,http/1.1` 协议协商

### 5.11 ECH 功能（L2460 ~ L2592）

对应 README「ECH 功能」：`获取加密客户端问候配置()`——每次刷新订阅时从 DoH 获取最新 ECH 配置；优先 Google DNS，失败自动回退 Cloudflare DNS；启用 ECH 自动开启「仅 TLS」模式（避免 80 端口干扰）；调试信息通过响应头 `X-ECH-Status` / `X-ECH-Debug` / `X-ECH-Config-Length` 返回。

### 5.12 订阅请求处理（L2593 ~ L2958）

`处理订阅请求()` 汇总生成最终订阅节点列表：

- 官方直连 + 优选域名/优选 IP/GitHub 仓库（对应 `epd/epi/egi`）
- 自定义优选 `yx` 与 API 添加的优选 IP 自动合并
- VLESS / Trojan / xhttp 多协议按开关生成
- 工作器地区匹配选择最优 ProxyIP（同地区 → 邻近 → 其他）
- 每 15 分钟自动优选；获取失败时返回占位错误节点
- 按 `target` 参数或 User-Agent 返回对应客户端格式

### 5.13 优选 IP 列表获取（L2959 ~ L3033）

`获取值地址列表()`：从在线优选接口（wetest.vip）抓取 IPv4/IPv6 优选地址，按「优选IP筛选设置」（ipv4/ipv6/移动/联通/电信）过滤，解析出 地址/端口/机场/地区 字段供节点生成使用。

### 5.14 WebSocket 代理核心（L3034 ~ L3947）

VLESS / Trojan / xhttp 协议握手与数据转发：

- 解析客户端 path 参数（README「客户端 path 参数」）：`p`=覆盖 ProxyIP / `wk`=覆盖地区 / `rm`=关闭地区匹配 / `s`=覆盖 SOCKS5
- **优先级：path 参数 > KV/环境变量 > 自动检测**
- 多路竞速连接（`连接值套接字`，Promise.any）+ 失败重试降级（CF 直连 → SOCKS5 → fallback）
- UDP(DNS) 转发、数据包队列与背压控制

### 5.15 SOCKS5 / HTTP 隧道代理（L3714 ~ L3947）

对应 README「降级模式」与 `s` 变量：`处理值代理连接()`——解析 `s`（user:pass@host:port 或 host:port）建立代理；支持 SOCKS5 认证握手、CONNECT 隧道与 CONNECT 转发；用于 CF 直连失败后的降级链路。

### 5.16 管理面板（L3948 ~ L5200）

`处理订阅值()` 构建管理面板 HTML（模板字符串）：

- 顶部 HUD：当前 IP + 地区（ping0.cc）+ 语言切换下拉
- 双列布局：
  - **左侧**：配置管理（KV 绑定后显示）
  - **右侧**：选择客户端 / 系统状态 / 当前路径配置 / 内置优选类型 / 优选IP筛选设置 / 网络测试 / 相关链接
- 系统状态：Worker 地区、检测方式、ProxyIP、当前 IP
- 多语言（中文/فارسی/English）内联字典

### 5.17 面板前端逻辑（L5201 ~ L8814）

面板页内 `<script>`：

- KV 绑定检查（变量 K）通过后显示配置管理相关内容（`configContent`、内置优选、优选IP筛选模块）
- 配置加载/保存（立即生效）；客户端链接生成与唤起应用（`生成客户端链接`）
- 网络测试（`运行网络测试`：流媒体/AI 连通性；`一键测速当前节点`：fiber.google.com）
- 当前路径配置（`更新路径类型状态`：使用类型/当前路径/访问地址）
- 复制订阅提示「🥳复制成功」
- 语言切换并持久化（localStorage + Cookie）

---

## 六、功能说明

### 6.1 延迟测试 / 网络测试

- **延迟测试**：内置测速工具，IP 来源支持手动输入 / CF 随机 IP / URL 获取；1-50 线程并发（默认 5）；自动获取机场码并映射中文名（SJC→圣何塞）；自动扣除 DNS+TLS 握手时间显示真实延迟；支持地区筛选、最快 10 个、追加/替换模式。
- **网络测试**：`[ 网络测试 ]` 面板提供「一键测试流媒体/AI」按钮，依次测试 **访问谷歌 / Netflix / Disney+ / HBO / HBOMax / Peacock / GitHub / GPT / Gemini**，输出实际连通结果；另有「一键测速当前节点」按钮，测速地址为 `https://fiber.google.com/speedtest/`。

### 6.2 多协议支持

- VLESS：默认启用；Trojan：支持 Trojan-WS-TLS，可自定义密码（`tp`）；xhttp：基于 HTTP POST 的伪装协议
- 可同时启用多个协议，客户端自动识别；图形界面一键开关；协议配置有独立保存

### 6.3 ECH 功能

见 5.11 节。响应头调试信息：`X-ECH-Status`（SUCCESS/FAILED）、`X-ECH-Debug`、`X-ECH-Config-Length`。

### 6.4 自定义路径（d 变量）

- 不用 UUID 当路径，可自定义多级路径（`/path/to/sub`）；路径没 `/` 开头会自动补上
- 自定义路径后 UUID 路径自动禁用；可随时在图形界面改路径

### 6.5 图形化配置

- 用 Cloudflare KV 存配置（绑定变量 K）；访问 `/{UUID}` 即可使用
- 改完立即生效，不用重新部署；优先级：KV > 环境变量 > 默认值

### 6.6 API 管理

- 默认关闭，需在面板「允许API管理」开启
- 端点：
  - `GET /{UUID或路径}/api/preferred-ips` — 查询列表
  - `POST /{UUID或路径}/api/preferred-ips` — 添加（单个/批量 JSON）
  - `DELETE /{UUID或路径}/api/preferred-ips` — 删除（单个/全部）
- API 添加的 IP 与手动配置的 `yx` 变量自动合并

### 6.7 客户端 path 参数

在 VLESS/Trojan 分享链接的 path 字段追加查询参数，为**单个节点**单独指定连接级配置：

| 参数 | 作用 | 示例 |
|---|---|---|
| `p` | 覆盖 ProxyIP（支持带端口） | `p=1.1.1.1` / `p=1.2.3.4:8443` |
| `wk` | 覆盖 Worker 地区 | `wk=jp` / `wk=us` / `wk=sg` |
| `rm` | 关闭地区智能匹配 | `rm=no` |
| `s` | 覆盖 SOCKS5 代理 | `s=user:pass@host:1080` |

> ⚠️ `p` 与 `wk` 互斥：同时写只有 `p` 生效。优先级：**path 参数 > KV/环境变量 > 自动检测**。

### 6.8 手动指定地区

`wk=SG`（或图形界面选择 / path 里加 `wk=SG`），覆盖自动检测。支持：US、SG、JP、HK、KR、DE、SE、NL、FI、GB。

### 6.9 优选节点命名

`IP:端口#节点名称` 格式（如 `1.1.1.1:443#香港节点,8.8.8.8:53#Google DNS`）；不设置名称自动生成 `自定义优选-IP:端口`。

### 6.10 系统状态

显示 Worker 地区、检测方式、ProxyIP 状态；选择逻辑：同地区 → 邻近地区 → 其他地区。CFBox 面板顶部另显示「您当前IP地址：IP · 地区」。

### 6.11 多客户端支持

支持 10 种客户端（CLASH、SURGE、SING-BOX、LOON、QUANTUMULT X、V2RAY、Shadowrocket、STASH、NEKORAY、V2RAYNG）；根据客户端类型自动生成配置；图形界面一键生成订阅链接并唤起应用；根据 User-Agent 自动识别返回对应格式；所有 TLS 链接自动包含 `h3,h2,http/1.1` 协议协商。

### 6.12 多语言

- 中文 / فارسی / English 三语，根据浏览器语言自动选择
- 右上角下拉手动切换（登录页与面板均有）；选择保存到 localStorage + Cookie（有效期 1 年）
- 波斯语自动启用 RTL 布局（`dir="rtl"`）

### 6.13 当前 IP 地区显示

左上角「您当前IP地址：`{IP}` · `{地区}`」。地区检测方案：

- 直接 fetch `ping0.cc/geo` 会被 CORS 拦截、首页有 Turnstile 验证码
- 采用 **JSONP 方案**：动态注入 `<script src="https://ipv4.ping0.cc/geo/jsonp/cfboxRegionCallback">`，script 加载不受 CORS 限制，且能拿到**访客真实 IP** 的地区
- 回调 `cfboxRegionCallback(ip, location, asn, org, cc)` 将位置（国家/省份/城市）填入 HUD
- 失败时静默（仅地区不显示），不影响功能

### 6.14 双列布局

- **左侧**：配置管理（KV 绑定后显示）
- **右侧**：选择客户端 / 系统状态 / 当前路径配置 / 内置优选类型 / 优选IP筛选设置 / 网络测试 / 相关链接 并列排布
- 右侧模块随左侧配置管理展开而自然下移（不产生空白区域）

---

## 七、性能优化与安全

- **KV 读取优化**：30 秒内存缓存，短窗口内完全信任缓存，减少高频请求对 KV 的打压
- **每 15 分钟自动优选一次**；多重备用方案、智能缓存
- **无效请求拦截**：非法路径直接返回 404，不触发 KV 读取
- **UUID 鉴权**：访问路径中的 UUID 与 `U` 变量一致（不区分大小写）才放行
- **降级链路**：CF 直连失败 → SOCKS5 → fallback，提高可用性
- **混淆部署版**：源码经混淆处理，降低被直接阅读/篡改的风险

---

## 八、致谢

- 项目基于 [byJoey/cfnew](https://github.com/byJoey/cfnew/tree/main) 并融合 [cmliu/Edgetunnel](https://github.com/cmliu/edgetunnel) 能力
- ProxyIP 部分来自 [cmliu](https://github.com/cmliu)
- 反代 IP 来自 [qwer-search](https://github.com/qwer-search)
- 在线优选接口来自 [白嫖哥](https://t.me/bestcfipas)
- IP 地区检测：ping0.cc
- 网络测速：[Google Speedtest](https://fiber.google.com/speedtest/)
