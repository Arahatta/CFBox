# CFBox Subscription Manager

> **A proxy subscription management panel running on Cloudflare Workers, compatible with both CFnew and edgetunnel** — it serves VLESS/Trojan/xhttp multi-protocol subscriptions at the `/UUID` path while providing a graphical configuration interface (KV-backed, changes take effect instantly), with built-in latency testing, streaming/AI connectivity checks, multi-client subscription generation, and multi-language support.

---
> **[Telegram Group](https://t.me/SZ_PAI)**
> **[YouTube Channel](https://www.youtube.com/@PAI_CN)**
---
![](1.png)
![](2.png)
![](3.png)
---

## Table of Contents

- [1. Project Overview & Compatibility](#1-project-overview--compatibility)
- [2. Key Features](#2-key-features)
- [3. Deployment](#3-deployment)
- [4. Environment Variables & Configuration Table](#4-environment-variables--configuration-table)
- [5. Code Structure Annotations](#5-code-structure-annotations)
- [6. Feature Details](#6-feature-details)
- [7. Performance & Security](#7-performance--security)
- [8. Credits](#8-credits)

---

## 1. Project Overview & Compatibility

| Item | Content |
|---|---|
| Project Name | **CFBox Subscription Manager** (Terminal v1.0) |
| Runtime | Cloudflare Workers / Pages (Node-compatible runtime, compatibility date `2026-01-20` recommended) |
| Deployment | Single-file Worker (plaintext / obfuscated build) |
| Data Storage | Cloudflare KV (bound variable **K**, compatible with C/KV/ConfigKV/CFKV/CFBOX) |

### 1.1 Fully Compatible with Both CFnew and edgetunnel IP / Nodes

> CFBox unifies and merges the IP/node sources from both CFnew and edgetunnel (cmliu) during subscription generation — the IPs of both systems are natively supported and can be used simultaneously.

**Compatibility Matrix**

| Source | Implementation in CFBox | Code Location |
|---|---|---|
| **CFnew IPs** | ① Preferred domain list built in as-is: `cloudflare.182682.xyz`, `speed.marisalnc.com`, `freeyx.cloudflare88.eu.org`, `bestcf.top`<br>② Online preference uses the same cfnew endpoint `wetest.vip` (IPv4/IPv6 filtered by ISP)<br>③ `yx` custom preferred IPs fully use cfnew's `IP:port#name` format<br>④ Switch system `epd` / `epi` / `egi` / `ena` identical to cfnew | **L271 Direct domain list**<br>**L2959 Preferred IP fetch**<br>**L662-694 yx parsing** |
| **edgetunnel (cmliu) IPs** | ① cmliu's **ProxyIP reverse-proxy domain pool** fully built in: `ProxyIP.HK/US/SG/JP/KR/DE/SE/NL/FI/GB/Oracle/DigitalOcean/Vultr/Multacom...CMLiussss.net` used as fallback/relay addresses<br>② `GO2SOCKS5` / SOCKS5 fallback chain compatible with edgetunnel<br>③ edgetunnel-style plain `IP:port` lists can be fed directly to `yx` or fetched via `yxURL` | **L200-270 Fallback address list**<br>**L5 GO2SOCKS5** |

**Subscription Generation Merge Logic (L2654-2680)**

```
Final node list =
    Custom preferred IPs (yx)     ← manually/API-added, IP:port#name
  + Preferred domain list         ← cfnew direct domains (epd)
  + wetest online preference      ← same cfnew endpoint (epi, filtered by ISP)
  + GitHub repo preference (egi)
  + ProxyIP reverse-proxy list    ← edgetunnel (cmliu), used as relay/fallback
```

All sources are merged and output together; IPv4 / IPv6 / domains / `#name` aliases are all supported.

**Notes**

"Incompatibility" between the two projects is usually not a format issue, but rather **different preferred-IP source URLs** (cfnew uses `wetest.vip`, edgetunnel uses its own IP pool) or **different ProxyIP domain ownership**. CFBox has unified all these sources, so conflicts no longer occur.

- **CFnew switch system**: `epd` (preferred domain) / `epi` (preferred IP) / `egi` (repo preference) / `ena` (native address)
- **edgetunnel mechanisms**: `ProxyIP.*.CMLiussss.net` reverse proxy + `GO2SOCKS5`/SOCKS5 fallback
- If a specific node still cannot connect, share that node's link or preferred-IP source URL for troubleshooting.

---

## 2. Key Features

| # | Feature | Code Location (Block) |
|---|---|---|
| 1 | **Multi-protocol support**: VLESS / Trojan / xhttp, can be enabled simultaneously | Subscription handler / WebSocket proxy core |
| 2 | **Custom path**: use a custom path instead of the UUID path (multi-level supported) | Routing / login page |
| 3 | **Latency test**: built-in speed test tool, measures preferred-IP latency, auto-fetches airport codes | Panel front-end logic |
| 4 | **Network test**: one-click streaming/AI test (Google/Netflix/Disney+/HBO/HBOMax/Peacock/GitHub/GPT/Gemini) + one-click current-node speed test (fiber.google.com) | Panel front-end logic / network-test API |
| 5 | **Subscription conversion**: custom subscription-conversion service URL (`scu`) | Subscription handler |
| 6 | **Graphical configuration**: KV-backed config, takes effect instantly (bound to **K**) | Admin panel / panel front-end logic |
| 7 | **API management**: RESTful add/delete of preferred IPs (`/api/preferred-ips`) | Routing / panel |
| 8 | **Multi-client**: CLASH / SURGE / SING-BOX / LOON / QUANTUMULT X / V2RAY / Shadowrocket / STASH / NEKORAY / V2RAYNG, auto-detected by UA | Multi-client generation / subscription handler |
| 9 | **Multi-language**: 中文 / فارسی / English, auto-switch by browser language + dropdown switcher | Login page / admin panel |
| 10 | **Current IP region display**: top-left "Your current IP: IP · Region", region detected via ping0.cc | Login page / panel HUD |
| 11 | **ECH**: Encrypted Client Hello | ECH block |
| 12 | **Client path parameters**: `p` / `wk` / `rm` / `s` per-node overrides | WebSocket proxy core |

---

## 3. Deployment

### Worker Deployment

1. Log in to the Cloudflare dashboard → Workers & Pages → Create a Worker
2. Paste `CFBox明文版.js` (or the obfuscated build) into the Worker code
3. Set **environment variable `U`** = your UUID (required; uppercase U, lowercase u also compatible)
4. Create a **KV namespace** and bind it in the Worker settings, variable name **`K`** (primary; compatible with `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`)
5. Set the **compatibility date** to `2026-01-20`
6. After deployment, visit `https://your-domain/UUID` to open the graphical configuration panel

### Pages Deployment

1. Log in to the Cloudflare dashboard → Workers & Pages → Create a Pages project
2. Compress `CFBox明文版.js` (or the obfuscated build) into a `.zip` file → upload the `.zip`
3. Set **environment variable `U`** = your UUID (required; uppercase U, lowercase u also compatible)
4. Create a **KV namespace** and bind it in the Pages settings, variable name **`K`** (primary; compatible with `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`)
5. Re-upload the `.zip` file
6. Set the **compatibility date** to `2026-01-20`
7. After deployment, visit `https://your-domain/UUID` to open the graphical configuration panel

### Login Flow

Visit `/` → terminal login page → enter UUID (or custom path) → "Login successful" → enter the panel.

---

## 4. Environment Variables & Configuration Table

> Priority: **KV config > environment variables > defaults** (corresponds to the "config snapshot assembly" logic in the code).

### 4.1 Basic Configuration

| Variable | Value | Description | Code Field |
|---|---|---|---|
| `U` | your UUID | **Required**, used to access the subscription and config UI (uppercase U, lowercase u / UUID compatible) | `认证令牌` |
| `p` | proxyip | Optional, custom ProxyIP address and port (IPv4/IPv6/domain). Once set, `wk` region matching is disabled (mutually exclusive). Can also be set per-node in the path | `获取配置值('p')` |
| `s` | SOCKS5 address | Optional, `user:pass@host:port` or `host:port`. Can also be set per-node in the path | `代理5配置` |
| `d` | custom path | Optional, e.g. `/mypath` or `/path/to/sub`; if empty, the UUID path is used | `自定义路径` |
| `wk` | region code | Optional, manually specify the Worker region (SG/HK/US/JP…). Disabled once `p` is set (mutually exclusive) | `手动工作器地区` |

### 4.2 Protocol Configuration

| Variable | Value | Description | Code Field |
|---|---|---|---|
| `ev` | yes/no | Enable VLESS (enabled by default) | `启用明文` |
| `et` | yes/no | Enable Trojan (disabled by default) | `启用木马` |
| `ex` | yes/no | Enable xhttp (disabled by default) | `启用扩展传输` |
| `tp` | custom password | Trojan password; if empty, uses the UUID | `配置默认值.tp` |
| `ech` | yes/no | Enable ECH (disabled by default; automatically enables TLS-only mode when on) | `启用加密客户端问候` |

### 4.3 Advanced Controls

| Variable | Value | Description | Code Field |
|---|---|---|---|
| `yx` | custom preferred IPs | Named format supported, `1.1.1.1:443#HongKong-Node,8.8.8.8:53#Google DNS` | `自定义优选地址列表` |
| `yxURL` | preferred-IP source URL | Custom IP list source; if empty, uses the default | `优选地址源` |
| `scu` | subscription converter URL | Default `https://url.v1.mk/sub` | `订阅转换接口` |
| `epd` | yes/no | Enable preferred domains (enabled by default) | `启用优选域名` |
| `epi` | yes/no | Enable preferred IPs (enabled by default) | `启用优选地址` |
| `egi` | yes/no | Enable GitHub default preference (enabled by default) | `启用仓库优选` |
| `ena` | yes/no | Enable native addresses (disabled by default) | `启用原生地址` |
| `qj` | no | Set to `no` to enable fallback: CF direct → SOCKS5 → fallback | `启用代理降级` |
| `dkby` | yes | Set to `yes` to generate TLS-only nodes | `禁用非传输层安全` |
| `yxby` | yes | Set to `yes` to disable all preference features | `禁用优选` |
| `rm` | no | Set to `no` to disable smart region matching | `启用地区匹配` |
| `ae` | yes | Set to `yes` to allow API management (disabled by default) | `配置默认值.ae` |

> **CFBox exclusive customizations**: preferred-IP filtering (`ipv4` / `ipv6` / `ispMobile` / `ispUnicom` / `ispTelecom`), custom DNS (`customDNS`, DoH format), custom ECH domain (`customECHDomain`), ALPN negotiation (`alpn`), etc. — all configurable in the panel's "Built-in Preference" and "Preferred IP Filter" modules (shown after KV binding).

### 4.4 KV Storage Setup

1. Create a KV namespace in Cloudflare Workers
2. Bind the KV, variable name **`K`** (compatible with `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`)
3. Redeploy
4. Visit `/{UUID}` to use the graphical configuration (takes effect instantly, no redeploy needed)

---

## 5. Code Structure Annotations

> Below the code is divided into functional blocks from top to bottom, with responsibilities described for each. Line numbers refer to starting lines in `CFBox明文版.js`.

### 5.1 Global Runtime Variables (L4 ~ L40)

```js
// Auth token: UUID read from environment variable U, used for subscription & panel auth
// GO2SOCKS5 whitelist / fallback address / proxy5 config: fallback chain (CF direct→SOCKS5→fallback)
// Custom preferred address/domain lists: populated by yx variable and API-added preferred IPs
// Feature switches: plaintext(ev)/trojan(et)/xhttp(ex)/ECH(ech)/fallback(qj)/TLS-only(dkby)/
//                   disable-preference(yxby)/region-matching(rm)/enable-native(ena)
// Region & path: worker region(wk)/custom path(d)
// Preference switches: preferred-domain(epd)/preferred-IP(epi)/repo-preference(egi)
// KV: key-value store binding (variable K), config cache (30s memory cache, reduces KV reads)
```

### 5.2 Config Defaults Table (L42 ~ L74)

Code default-value object corresponding to the "Basic/Protocol/Advanced" variable tables in the README:

- `wk` (region), `ev/et/ex` (protocol switches), `ech`, `tp` (Trojan password)
- `customDNS` (DoH), `customECHDomain` (ECH domain), `alpn`
- `d/p/s` (path/ProxyIP/SOCKS5), `yx/yxURL/scu`
- `ena/epd/epi/egi` (native/domain/IP/repo preference), `ae/rm/qj/dkby/yxby`
- Preferred-IP filter: `ipv4/ipv6/ispMobile/ispUnicom/ispTelecom`

### 5.3 Config Utility Functions (L75 ~ L170)

- **Switch normalization**: `是否开启值/归一配置开关/获取配置开关值` — unifies `yes/no/true/false/1/0/on/off` into booleans
- **Environment variable reading**: `读取环境配置值/获取环境配置快照` — supports **upper/lowercase variable names** (e.g. `U/u`, `K/k`, fixing the case BUG)
- **Config snapshot assembly**: `整理有效配置/获取有效配置快照` — merges by "defaults → env vars → KV" priority; guarantees at least one protocol is enabled (auto-enables ev if ev/et/ex are all off)

### 5.4 Airport Code Mapping Table (L172 ~ L190)

`地区映射`: latency test / preferred nodes auto-fetch airport codes (SJC/LAX etc.) and map them to Chinese names (San Jose etc.), used for airport/data-center label recognition of preferred addresses.

### 5.5 Official Direct / Preferred Address Fetch (L191 ~ L315)

`取官方直连地址()`: built-in Cloudflare official preferred domains and IP list (with airport/region labels) for node generation; merges all preference sources via the `epd/epi/egi` switches; `yx` supports "IP:port#name" custom naming (see README "Preferred Node Naming").

### 5.6 Proxy Protocol Error Codes & Constants (L316 ~ L360)

Error messages used in VLESS / Trojan / SOCKS5 / HTTP-tunnel handshakes (`错误_无效数据`, `错误_代理连接失败`, etc.) and protocol text constants (`文本_连接方法`CONNECT, `文本_代理认证头`Proxy-Authorization, HTTP versions, etc.).

### 5.7 Node Parsing & Naming Tools + KV Read/Write (L361 ~ L602)

- Unique node numbering (`创建节点命名器/设置跳过编号/处理命名器`)
- "IP:port#name" alias parsing (`处理值节点别名部分/获取值节点别名基础`)
- ALPN negotiation value normalization (`规范化应用层协议协商`, h3,h2,http/1.1)
- **KV config read/write** (`加载键值配置/保存键值配置`): bound variable K, 30s memory cache; get/set config values (`获取配置值/设置配置值`)
- Address availability probe (`检查地址可用性`), ProxyIP/region-matching selection (`获取值备用地址/获取值地区值`: same region → nearby → other)

### 5.8 Worker Main Entry fetch Routing (L604 ~ L1080)

```js
export default { async fetch(请求, 环境, ...) }
```

- Validates UUID first (case-insensitive, compatible with `U/u`)
- Routing:
  - **POST / WebSocket upgrade** → proxy request (VLESS/Trojan protocol parse & forward)
  - **GET /** → terminal login page
  - **GET /{UUID or custom path}** → admin panel (graphical config)
  - **GET /{UUID or path}/sub...** → subscription output (client auto-detected by User-Agent)
  - **/api/preferred-ips** → API management (query/add/delete preferred IPs)
  - **/region** → Worker region detection API
  - **/net-test** → network-test API (streaming/AI connectivity, CFBox custom)

### 5.9 Terminal Login Page (L1081 ~ L1545)

- After deployment, visiting `/` shows the terminal login page; enter UUID (or custom path) to enter the panel
- Supports 中文 / فارسی / English, auto-selected by browser language
- Top HUD shows the visitor's current IP (`访客IP`, from CF-Connecting-IP) + region (detected via ping0.cc JSONP)
- Login-page scripts: cyber matrix-rain effect (persistently disableable via FX switch), UUID format validation (RFC4122), language switching persisted (localStorage + Cookie, 1-year validity)

### 5.10 Multi-Client Subscription Generation (L1634 ~ L2456)

Corresponds to README "Multi-Client Support":

- Share-link parsing (`解析值链接`): parses `vless://`, `trojan://` into node objects (protocol, address, port, SNI, fingerprint, transport, path, Host)
- Client format generators:
  - `生成值值589` → **Clash / Mihomo** YAML (full rule set + remote rule-providers + DNS)
  - `生成值值562` → **Surge / Stash** ini
  - `生成值值552` → **Loon** ini
  - `生成值值` → **Quantumult X** (remote filter resources)
  - `生成值值数据对象` → **SING-BOX** JSON
  - Others → V2RAY / NEKORAY / Shadowrocket etc. Base64 subscriptions
- All TLS links automatically include `h3,h2,http/1.1` protocol negotiation

### 5.11 ECH (L2460 ~ L2592)

Corresponds to README "ECH": `获取加密客户端问候配置()` — fetches the latest ECH config from DoH on every subscription refresh; prefers Google DNS, auto-falls back to Cloudflare DNS; enabling ECH automatically enables TLS-only mode (avoids port-80 interference); debug info returned via response headers `X-ECH-Status` / `X-ECH-Debug` / `X-ECH-Config-Length`.

### 5.12 Subscription Request Handling (L2593 ~ L2958)

`处理订阅请求()` aggregates and generates the final subscription node list:

- Official direct + preferred domain/IP/GitHub repo (corresponds to `epd/epi/egi`)
- Custom preferred `yx` and API-added preferred IPs auto-merged
- VLESS / Trojan / xhttp generated per their switches
- Worker-region matching selects the optimal ProxyIP (same region → nearby → other)
- Auto-preference every 15 minutes; placeholder error node returned on fetch failure
- Returns the client-appropriate format per `target` parameter or User-Agent

### 5.13 Preferred IP List Fetch (L2959 ~ L3033)

`获取值地址列表()`: fetches IPv4/IPv6 preferred addresses from the online preference endpoint (wetest.vip), filters per "Preferred IP Filter" settings (ipv4/ipv6/mobile/unicom/telecom), and parses address/port/airport/region fields for node generation.

### 5.14 WebSocket Proxy Core (L3034 ~ L3947)

VLESS / Trojan / xhttp protocol handshake and data forwarding:

- Parses client path parameters (README "Client Path Parameters"): `p`=override ProxyIP / `wk`=override region / `rm`=disable region matching / `s`=override SOCKS5
- **Priority: path params > KV/env vars > auto-detection**
- Multi-race connection (`连接值套接字`, Promise.any) + retry fallback on failure (CF direct → SOCKS5 → fallback)
- UDP(DNS) forwarding, packet queue and backpressure control

### 5.15 SOCKS5 / HTTP Tunnel Proxy (L3714 ~ L3947)

Corresponds to README "Fallback Mode" and the `s` variable: `处理值代理连接()` — parses `s` (user:pass@host:port or host:port) to establish a proxy; supports SOCKS5 auth handshake, CONNECT tunnel, and CONNECT forwarding; used as the fallback chain after CF direct-connect failures.

### 5.16 Admin Panel (L3948 ~ L5200)

`处理订阅值()` builds the admin-panel HTML (template string):

- Top HUD: current IP + region (ping0.cc) + language-switch dropdown
- Two-column layout:
  - **Left**: config management (shown after KV binding)
  - **Right**: client selection / system status / current path config / built-in preference / preferred-IP filter / network test / related links
- System status: Worker region, detection method, ProxyIP, current IP
- Multi-language (中文/فارسی/English) inline dictionaries

### 5.17 Panel Front-End Logic (L5201 ~ L8814)

In-page `<script>`:

- After KV binding check (variable K) passes, shows config-management content (`configContent`, built-in preference, preferred-IP filter modules)
- Config load/save (instant); client-link generation and app launching (`生成客户端链接`)
- Network test (`运行网络测试`: streaming/AI connectivity; `一键测速当前节点`: fiber.google.com)
- Current path config (`更新路径类型状态`: type/current path/access URL)
- Copy-subscription toast "🥳复制成功"
- Language switching persisted (localStorage + Cookie)

---

## 6. Feature Details

### 6.1 Latency Test / Network Test

- **Latency test**: built-in speed-test tool; IP sources include manual input / CF random IP / URL fetch; 1-50 concurrent threads (default 5); auto-fetches airport codes and maps Chinese names (SJC→San Jose); auto-deducts DNS+TLS handshake time for real latency; supports region filtering, fastest 10, append/replace modes.
- **Network test**: the `[ Network Test ]` panel provides a "One-click Streaming/AI Test" button, testing **Google / Netflix / Disney+ / HBO / HBOMax / Peacock / GitHub / GPT / Gemini** in order with actual connectivity results; plus a "One-click Current-Node Speed Test" button pointing at `https://fiber.google.com/speedtest/`.

### 6.2 Multi-Protocol Support

- VLESS: enabled by default; Trojan: supports Trojan-WS-TLS with custom password (`tp`); xhttp: HTTP-POST-based camouflage protocol
- Multiple protocols can be enabled simultaneously; auto-detected by clients; one-click switches in the GUI; independent protocol config saving

### 6.3 ECH

See 5.11. Debug response headers: `X-ECH-Status` (SUCCESS/FAILED), `X-ECH-Debug`, `X-ECH-Config-Length`.

### 6.4 Custom Path (d variable)

- Use a custom multi-level path instead of the UUID path (`/path/to/sub`); a leading `/` is auto-added if missing
- Once a custom path is set, the UUID path is disabled; can be changed anytime in the GUI

### 6.5 Graphical Configuration

- Store config in Cloudflare KV (bound variable K); available by visiting `/{UUID}`
- Takes effect instantly without redeploy; priority: KV > env vars > defaults

### 6.6 API Management

- Disabled by default; enable via "Allow API Management" in the panel
- Endpoints:
  - `GET /{UUID or path}/api/preferred-ips` — query list
  - `POST /{UUID or path}/api/preferred-ips` — add (single/batch JSON)
  - `DELETE /{UUID or path}/api/preferred-ips` — delete (single/all)
- API-added IPs auto-merge with the manually configured `yx` variable

### 6.7 Client Path Parameters

Append query parameters to the path field of a VLESS/Trojan share link to specify per-**node** connection-level config:

| Param | Effect | Example |
|---|---|---|
| `p` | Override ProxyIP (port supported) | `p=1.1.1.1` / `p=1.2.3.4:8443` |
| `wk` | Override Worker region | `wk=jp` / `wk=us` / `wk=sg` |
| `rm` | Disable smart region matching | `rm=no` |
| `s` | Override SOCKS5 proxy | `s=user:pass@host:1080` |

> ⚠️ `p` and `wk` are mutually exclusive: if both are set, only `p` takes effect. Priority: **path params > KV/env vars > auto-detection**.

### 6.8 Manual Region Override

`wk=SG` (or select in the GUI / add `wk=SG` in the path) overrides auto-detection. Supported: US, SG, JP, HK, KR, DE, SE, NL, FI, GB.

### 6.9 Preferred Node Naming

`IP:port#node-name` format (e.g. `1.1.1.1:443#HongKong-Node,8.8.8.8:53#Google DNS`); if no name is given, auto-generates `custom-preferred-IP:port`.

### 6.10 System Status

Shows Worker region, detection method, ProxyIP status; selection logic: same region → nearby region → other regions. The CFBox panel top also shows "Your current IP: IP · Region".

### 6.11 Multi-Client Support

Supports 10 clients (CLASH, SURGE, SING-BOX, LOON, QUANTUMULT X, V2RAY, Shadowrocket, STASH, NEKORAY, V2RAYNG); auto-generates config per client type; one-click subscription-link generation and app launching in the GUI; auto-recognizes format by User-Agent; all TLS links automatically include `h3,h2,http/1.1` protocol negotiation.

### 6.12 Multi-Language

- 中文 / فارسی / English, auto-selected by browser language
- Manual dropdown switch on both login page and panel; selection saved to localStorage + Cookie (1-year validity)
- Persian automatically enables RTL layout (`dir="rtl"`)

### 6.13 Current IP Region Display

Top-left "Your current IP: `{IP}` · `{Region}`". Region-detection approach:

- Direct `ping0.cc/geo` fetch is blocked by CORS; the homepage has a Turnstile CAPTCHA
- Uses the **JSONP approach**: dynamically injects `<script src="https://ipv4.ping0.cc/geo/jsonp/cfboxRegionCallback">` — script loading is not restricted by CORS and returns the **visitor's real-IP** region
- The callback `cfboxRegionCallback(ip, location, asn, org, cc)` fills the location (country/province/city) into the HUD
- Fails silently (only the region is hidden) without affecting functionality

### 6.14 Two-Column Layout

- **Left**: config management (shown after KV binding)
- **Right**: client selection / system status / current path config / built-in preference / preferred-IP filter / network test / related links side by side
- Right modules naturally move down as the left config management expands (no blank gaps)

---

## 7. Performance & Security

- **KV read optimization**: 30-second memory cache, fully trusts the cache within the short window, reducing pressure on KV under high-frequency requests
- **Auto-preference every 15 minutes**; multiple fallback plans, smart caching
- **Invalid-request interception**: illegal paths return 404 directly without triggering KV reads
- **UUID auth**: the UUID in the access path must match the `U` variable (case-insensitive) to be allowed
- **Fallback chain**: CF direct → SOCKS5 → fallback, improving availability
- **Obfuscated build**: source is obfuscated to reduce the risk of direct reading/tampering

---

## 8. Credits

- Based on [byJoey/cfnew](https://github.com/byJoey/cfnew/tree/main), integrating capabilities from [cmliu/Edgetunnel](https://github.com/cmliu/edgetunnel)
- ProxyIP portion from [cmliu](https://github.com/cmliu)
- Reverse-proxy IPs from [qwer-search](https://github.com/qwer-search)
- Online preference endpoint from [白嫖哥](https://t.me/bestcfipas)
- IP region detection: ping0.cc
- Network speed test: [Google Speedtest](https://fiber.google.com/speedtest/)
