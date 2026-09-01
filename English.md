# CFBox Subscription Manager

> **Language**  [简体中文](README.md)  [English](English.md)  [فارسی](فارسی.md)

> **A proxy subscription management panel running on Cloudflare Workers / Pages** — integrating the capabilities of both CFnew and edgetunnel (cmliu). It can output VLESS / Trojan / xhttp multi-protocol subscriptions at `/UUID` (or a custom path), and provides a **dual-mode graphical configuration panel** (Standard Mode / Advanced Mode, one-click switch), **Preferred Subscription Generator** (26 built-in preferred sources), multi-client subscriptions, network tests, and KV storage with instant effect.
---
> **[Telegram Group](https://t.me/SZ_PAI)**

> **[YouTube Channel](https://www.youtube.com/@PAI_CN)**
---
## Changelog (v1.0 → v1.1)

### Preferred Source Expansion
- Built-in preferred sources expanded from **26 to 32**
- bestcf regional sources expanded from **5 to 11 regions**, newly added: KR, DE, SE, NL, FI, GB

### Bug Fixes
- Fixed the bug where all nodes were still delivered even after a specific region was specified

### Multi-Source IP Region Detection
- **v1.0**: single source `ping0.cc`
- **v1.1**: primary source `ping0.cc` + fallback source `ipinfo.io`, with automatic fallback

### Compatibility
- Config items, API endpoints, protocols (VLESS / Trojan / xhttp), panel / multilingual support / clients, etc. **all remain unchanged**
- Upgrade requires **no changes to KV or environment variables**

## 1. Project Overview and Compatibility

| Item | Content |
|---|---|
| Project Name | **CFBox Subscription Manager** |
| Runtime | Cloudflare Workers / Pages |
| Deployment Form | Single-file Worker (`CFBox明文版.js` / `CFBox混淆版.js`) |
| Data Storage | Cloudflare KV (bound variable **K**, compatible with C/KV/ConfigKV/CFKV/CFBOX) |
| Panel Modes | Standard Mode + Advanced Mode (one-click switch at top right; Advanced Mode features a neon tech-style background) |

### 1.1 Compatibility with IP / Nodes from Both CFnew and edgetunnel

CFBox merges the IP / node sources from both CFnew and edgetunnel (cmliu) during subscription generation; IPs from both systems are natively compatible and can be used simultaneously.

| Source | Description |
|---|---|
| **CFnew IPs** | ① Preferred domain list built in as-is (`cloudflare.182682.xyz`, `bestcf.top`, etc.)<br>② Online preferred IPs (filtered by IPv4/IPv6 and ISP)<br>③ `yx` custom preferred IPs use the `IP:Port#Name` format |
| **edgetunnel (cmliu) IPs** | ① ProxyIP reverse-proxy domain library built in entirely, as backup addresses / relays<br>② `GO2SOCKS5` / SOCKS5 fallback chain compatible |

During subscription generation, official direct-connect addresses, preferred domains, online preferred IPs, built-in / custom preferred sources, repository preferred IPs, and ProxyIP reverse-proxy lists are all merged and output. IPv4 / IPv6 / domains / `#Name` aliases are all parsed. Official direct-connect delivers **800+ nodes** by default (built-in preferred sources + random Cloudflare official CIDR supplementation), and more nodes can be appended via the "Preferred Subscription Generator".

---

## 2. Main Features

| # | Feature | Description |
|---|---|---|
| 1 | **Multi-Protocol Support** | VLESS / Trojan / xhttp, can be enabled simultaneously with one-click toggles in the GUI |
| 2 | **Dual-Mode Panel** | Standard Mode (common modules compactly arranged) + Advanced Mode (custom settings / advanced controls), one-click switch at top right, consistent UI and functionality |
| 3 | **Preferred Subscription Generator** | Three modes: Preferred Subscription Generator (beginner-friendly) / Random Preferred Mode (official preferred) / Custom Subscription Mode (supports aggregation), default "Custom Subscription Mode", 26 built-in preferred sources |
| 4 | **Built-in Preferred Types** | Independent toggles: Native Address (`ena`) / Preferred Domain (`epd`) / Preferred IP (`epi`) / Repository Preferred (`egi`) |
| 5 | **Preferred IP Filter Settings** | IP version selection (IPv4 / IPv6) + ISP filtering (Mobile / Unicom / Telecom) |
| 6 | **Network Test** | One-click streaming/AI test (Google / Netflix / Disney+ / HBO / HBOMax / Peacock / GitHub / GPT / Gemini) + one-click speed test for the current node (fiber.google.com) |
| 7 | **Graphical Configuration** | KV-stored configuration, takes effect immediately after change (bound to **K**) |
| 8 | **API Management** | RESTful add/delete of preferred IPs (`/api/preferred-ips`) |
| 9 | **Multi-Client** | CLASH / SURGE / SING-BOX / LOON / QUANTUMULT X / V2RAY / Shadowrocket / STASH / NEKORAY / V2RAYNG, auto-detected by UA |
| 10 | **Multi-Language** | Chinese / فارسی / English, automatic switch by browser language + dropdown switch at top right |
| 11 | **ECH** | Encrypted Client Hello |
| 12 | **Custom Settings** | Custom homepage URL (`homepage`) / custom path / custom ProxyIP merged into one module |
| 13 | **Client Path Parameters** | `p` / `wk` / `rm` / `s` per-node override |

---

## 3. Deployment Guide

### Worker Deployment

1. Log in to the Cloudflare dashboard → Workers and Pages → Create a new Worker
2. Paste `CFBox混淆版.js` (plain version) into the Worker code
3. Set **environment variable `U`** = your UUID (required; uppercase U, compatible with `UUID` / lowercase u)
4. Create a **KV namespace** and bind it in the Worker settings, set the variable name to **`K`** (primary; compatible with `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`)
5. After deployment, visit `https://your-domain/UUID` to enter the graphical configuration panel

### Pages Deployment

1. Log in to the Cloudflare dashboard → Workers and Pages → Create a new Pages project
2. Rename `CFBox混淆版.js` to `_worker.js`, compress it into a `.zip` file and upload (or drag and drop the folder containing `_worker.js`)
3. Set **environment variable `U`** = your UUID (required; uppercase U, compatible with `UUID` / lowercase u)
4. Create a **KV namespace** and bind it in the Pages settings, set the variable name to **`K`** (primary; compatible with `C`/`KV`/`ConfigKV`/`CFKV`/`CFBOX`)
5. After deployment, visit `https://your-domain/UUID` to enter the graphical configuration panel

### Login Flow

Visit `/` → terminal login page → enter your UUID (or custom path) → "Login Successful" → enter the panel.

---

## 4. Environment Variables and Configuration Variable Table

> Priority: **KV Configuration > Environment Variables > Defaults**

### 4.1 Basic Configuration

| Variable | Value | Description |
|---|---|---|
| `U` | Your UUID | **Required**, used to access the subscription and configuration interface (uppercase U, compatible with `UUID` / lowercase u) |
| `p` | proxyip | Optional, custom ProxyIP address and port (IPv4/IPv6/domain). Setting it disables `wk` region matching (mutually exclusive) |
| `s` | SOCKS5 address | Optional, `user:pass@host:port` or `host:port` |
| `d` | Custom path | Optional, e.g. `/mypath` or `/path/to/sub`; defaults to the UUID path if empty |
| `wk` | Region code | Optional, manually specify the Worker region (SG/HK/US/JP…). Disabled after setting `p` (mutually exclusive) |
| `homepage` | Custom homepage URL | Optional, displays this URL as a disguise page when visiting the root path `/` |

### 4.2 Protocol Configuration

| Variable | Value | Description |
|---|---|---|
| `ev` | yes/no | Enable VLESS (enabled by default) |
| `et` | yes/no | Enable Trojan (disabled by default) |
| `ex` | yes/no | Enable xhttp (disabled by default) |
| `tp` | Custom password | Trojan password, uses UUID if empty |
| `ech` | yes/no | Enable ECH (disabled by default; auto-enables TLS-only mode once enabled) |

### 4.3 Advanced Controls (Advanced Mode)

| Variable | Value | Description |
|---|---|---|
| `yx` | Custom preferred IPs | Supports naming, `1.1.1.1:443#Hong Kong Node,8.8.8.8:53#Google DNS` |
| `yxURL` | Preferred source URL | Custom IP list source (uses built-in default source if empty) |
| `scu` | Subscription converter address | Subscription conversion service address (default `https://url.v1.mk/sub`) |
| `epd` | yes/no | Enable preferred domains (enabled by default) |
| `epi` | yes/no | Enable preferred IPs (enabled by default) |
| `egi` | yes/no | Enable repository preferred (enabled by default) |
| `ena` | yes/no | Enable native addresses (disabled by default) |
| `qj` | no | Set to `no` to enable fallback: CF direct connection failure → SOCKS5 → fallback |
| `dkby` | yes | Set to `yes` to generate only TLS nodes |
| `yxby` | yes | Set to `yes` to disable all preferred functions |
| `rm` | no | Set to `no` to disable region smart matching |
| `ae` | yes | Set to `yes` to allow API management (disabled by default) |

> Preferred IP filtering (`ipv4` / `ipv6` / `ispMobile` / `ispUnicom` / `ispTelecom`), custom DNS (`customDNS`, DoH format), custom ECH domain (`customECHDomain`), ALPN negotiation (`alpn`), etc. can all be configured in the "Built-in Preferred Types", "Preferred IP Filter Settings", and "Advanced Controls" modules in the panel (displayed after binding KV).

---

## 5. Panel Function Description (Standard / Advanced Mode)

After deployment, visit `/{UUID}` to enter the graphical configuration panel. A **mode switch button** is provided at the top right; click to switch between "Standard Mode" and "Advanced Mode".

### 5.1 Standard Mode (common modules compactly arranged)

| Module | Description |
|---|---|
| **Configuration Management** | Displayed after KV binding, save all configurations (bound to K) |
| **System Status** | Shows Worker region, detection method, ProxyIP, current IP, etc. |
| **Preferred Subscription Generator** | Preferred subscription modes (Off / Preferred Subscription Generator / Random Preferred / Custom Subscription), 26 built-in preferred sources, includes "Start Preferred", "Subscription API", "Chained Proxy" features |
| **Select Client** | 10 clients (CLASH / SURGE / SING-BOX / LOON / QUANTUMULT X / V2RAY / Shadowrocket / STASH / NEKORAY / V2RAYNG), generate subscription links and launch apps |
| **Built-in Preferred Types** | Independent toggles: Native Address (`ena`) / Preferred Domain (`epd`) / Preferred IP (`epi`) / Repository Preferred (`egi`) |
| **Preferred IP Filter Settings** | IP version (IPv4 / IPv6) + ISP (Mobile / Unicom / Telecom) filtering |
| **Network Test** | One-click streaming/AI test + one-click speed test for the current node |
| **Current Path Configuration** | Shows usage type / current path / access address |
| **Related Links** | Common external links (repository, community, etc.) |

### 5.2 Advanced Mode (custom settings + advanced controls)

| Module | Description |
|---|---|
| **Custom Settings** | Custom homepage URL (`homepage`) / custom path (`d`) / custom ProxyIP (`p`) merged into one module |
| **Advanced Controls** | Subscription converter address (`scu`) / allow API management (`ae`) / region matching (`rm`) / outbound method (`qj`) / TLS control (`dkby`) / preferred control (`epd`/`epi`/`egi`/`ena`/`yxby`) |

### 5.3 Mode Switching and Background

- "Mode Switch" button at the top right, one-click switch between Standard Mode ↔ Advanced Mode
- Advanced Mode uses a **neon tech-style background**, with module layouts rearranged in both modes while keeping the UI and functionality consistent

---

## 6. Preferred Subscription Generator and Local Preferred

### 6.1 Preferred Subscription Modes

| Mode | Description |
|---|---|
| Off | Use the default subscription generation logic |
| **Preferred Subscription Generator (beginner-friendly)** | Enter the generator domain, automatically calls the edgetunnel original preferred generation API |
| **Random Preferred Mode (official preferred)** | Randomly generate preferred IPs from Cloudflare official CIDRs according to the specified count (`subRandomCount`) |
| **Custom Subscription Mode (supports aggregation)** (default) | Aggregates sources one by one from "Custom Preferred (one per line)", supports domains / IPv4 / IPv6 / `sub://` preferred API / `https://` preferred API / built-in preferred sources (26 by default in custom subscription mode) |

### 6.2 Local Preferred Mode
> The API used by the preferred methods is consistent with the [CFnew](https://github.com/byJoey/cfnew) project; you can directly use the [yx-tools](https://github.com/byJoey/yx-tools) preferred tool. Preferred results can be "Downloaded" or reported to the project with one click via "One-click Report".

### 6.3 Other Parameters

| Variable | Description |
|---|---|
| `subRandomCount` | Random preferred count (default 16) |
| `subPort` | Specified preferred port (-1 = random port) |
| `subName` | Subscription name (the subscription name delivered to each client under "Select Client" takes effect synchronously) |
| `subUpdateTime` | Subscription update time (hours, default 3) |

---

## 7. Performance Optimization and Security

- **KV read optimization**: 30-second in-memory cache, fully trusts the cache within a short window, reducing high-frequency pressure on KV
- **Automatic preferred every 15 minutes**; multiple backup schemes, smart caching
- **Invalid request blocking**: illegal paths return 404 directly without triggering KV reads
- **UUID authentication**: access is allowed only when the UUID in the path matches the `U` variable (case-insensitive)
- **Fallback chain**: CF direct connection failure → SOCKS5 → fallback, improving availability

---

## 8. Acknowledgments

- Project inspired by [byJoey/cfnew](https://github.com/byJoey/cfnew) / [cmliu/Edgetunnel](https://github.com/cmliu/edgetunnel)
- Preferred APIs / preferred sources: bestcf, WeTest and other community-maintained
- IP region detection: ping0.cc
- Network speed test: [Google Speedtest](https://fiber.google.com/speedtest/)
