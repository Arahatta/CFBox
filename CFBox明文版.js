// CFBox - Terminal v1.0
// version: v1.0（merging CFnew + EdgeTunnel features）
import { connect as Connect } from 'cloudflare:sockets';
let AuthToken = '07d2aca9-c060-4039-b265-454fc8510d4c';
let GO2SOCKS5Whitelist = [];
let FallbackAddr = '';
let Socks5Cfg = '';
let CustomPrefAddrs = [];
let CustomPrefDomains = [];
let EnableDegrade = false;
let ProxyOnly = false;
let DisablePlain = false;
let DisablePref = false;
let EnableRegionMatch = true;
let CurRegion = '';
let ManualRegion = '';
let PrefAddrSource = '';
let CustomPath = '';
let EnablePlain = true;
let EnableTrojan = false;
let EnableXhttp = false;
let TransferPath = '';
// enable ECH (true = on, false = off)
let EnableEch = false;
// customDNSservice器（default：https://223.5.5.5/dns-query）
let CustomDns = 'https://223.5.5.5/dns-query';
// custom ECH domain (default: cloudflare-ech.com)
let CustomEchDomain = 'cloudflare-ech.com';
let CustomAlpn = '';
let SubConverter = "https://url.v1.mk/sub";

let EnablePrefDomain = true; // preferred domain enabled (default on)
let EnablePrefIp = true;
let EnableRepoPref = true;
let EnableNative = false; // native addresses off by default

let KVStore = null;
let KVConfig = {};
let KVConfigLastLoad = 0;
const KVCacheTtl = 30 * 1000; // 30second cache (skip version check within a short window)
let KVConfigVersion = '';
const Defaults = {
  wk: '',
  ev: 'yes',
  et: 'no',
  ex: 'no',
  ech: 'no',
  tp: '',
  customDNS: 'https://223.5.5.5/dns-query',
  customECHDomain: 'cloudflare-ech.com',
  alpn: '',
  d: '',
  p: '',
  yx: '',
  yxURL: '',
  s: '',
  homepage: '',
  scu: "https://url.v1.mk/sub",
  ena: 'no',
  epd: 'yes',
  epi: 'yes',
  egi: 'yes',
  ae: '',
  rm: '',
  qj: '',
  dkby: 'no',
  yxby: '',
  ipv4: 'yes',
  ipv6: 'yes',
  ispMobile: 'yes',
  ispUnicom: 'yes',
  ispTelecom: 'yes',
  // ⚡️ preferred-sub generator module (ported from edgetunnel)
  subMode: 'custom',    // custom sub mode by default (aggregation supported)
  subRandomCount: 16,   // random preferred count
  subPort: -1,          // fixed preferred port (-1 = random port)
  subCustomIPs: 'https://bestcf.pages.dev/random-region/HK/100.txt\nhttps://bestcf.pages.dev/random-region/TW/100.txt\nhttps://bestcf.pages.dev/random-region/JP/100.txt\nhttps://bestcf.pages.dev/random-region/SG/100.txt\nhttps://bestcf.pages.dev/random-region/US/100.txt\nbestcf.030101.xyz#Mingyu维护\ncdn.2020111.xyz\ncdns.doon.eu.org\ncf.0sm.com\ncf.877771.xyz\ncf.877774.xyz#秋名山维护\ncf.900501.xyz\ncfip.1323123.xyz\ncfip.cfcdn.vip\ncfip.xxxxxxxx.tk#OTC维护\ncloudflare.182682.xyz#WeTest.Vip维护\ncloudflare-dl.byoip.top\ncloudflare-ip.mofashi.ltd\nfn.130519.xyz\nfreeyx.cloudflare88.eu.org\nnrt.xxxxxxxx.nyc.mn\nnrtcfdns.zone.id\nsaas.sin.fan\ntencentapp.cn#ktff维护\nxn--b6gac.eu.org\n777.ai7777777.xyz',     // custompreferred（每行一个，support domain/IPv4/IPv6/sub://preferredAPI）
  subGenerator: '',     // preferred-sub generator domain
  subName: 'CFBox',     // subscription name
  subUpdateTime: 3      // subscription update interval (hours)
};

function ParseBool(Val, DefaultOn = false) {
  if (Val === undefined || Val === null || Val === '') return DefaultOn;
  if (Val === true || Val === false) return Val;
  const Text = String(Val).trim().toLowerCase();
  if (Text === 'yes' || Text === 'true' || Text === '1' || Text === 'on') return true;
  if (Text === 'no' || Text === 'false' || Text === '0' || Text === 'off') return false;
  return DefaultOn;
}

function NormalizeBool(Val, DefaultOn = false) {
  return ParseBool(Val, DefaultOn) ? 'yes' : 'no';
}

function GetConfigBool(Key, DefaultOn = false, FallbackVal = undefined) {
  const DefaultVal = FallbackVal !== undefined ? FallbackVal : (DefaultOn ? 'yes' : 'no');
  return ParseBool(GetConfigVal(Key, DefaultVal), DefaultOn);
}

function GetConfigText(Key, DefaultVal = '', FallbackVal = undefined) {
  const Val = GetConfigVal(Key, FallbackVal !== undefined ? FallbackVal : DefaultVal);
  return Val === undefined || Val === null ? DefaultVal : String(Val);
}

function FinalizeConfig(Config) {
  const Snap = {
    ...Defaults,
    ...Config
  };
  ['ev', 'et', 'ex', 'ech', 'ena', 'epd', 'epi', 'egi', 'ipv4', 'ipv6', 'ispMobile', 'ispUnicom', 'ispTelecom'].forEach(Key => {
    Snap[Key] = NormalizeBool(Snap[Key], ParseBool(Defaults[Key]));
  });
  if (Snap.ev === 'no' && Snap.et === 'no' && Snap.ex === 'no') {
    Snap.ev = 'yes';
  }
  if (Snap.ech === 'yes') {
    Snap.dkby = 'yes';
  }
  return Snap;
}

function ReadEnvVal(EnvVal, ...Names) {
  if (!EnvVal) return undefined;
  for (const Name of Names) {
    if (EnvVal[Name] !== undefined && EnvVal[Name] !== null && EnvVal[Name] !== '') {
      return EnvVal[Name];
    }
  }
  return undefined;
}

function EnvSnapshot(EnvVal = {}) {
  const Map = {
    wk: ['wk', 'WK'],
    ev: ['ev', 'EV'],
    et: ['et', 'ET'],
    ex: ['ex', 'EX'],
    ech: ['ech', 'ECH'],
    tp: ['tp', 'TP'],
    customDNS: ['customDNS', 'CUSTOMDNS', 'CUSTOM_DNS'],
    customECHDomain: ['customECHDomain', 'CUSTOMECHDOMAIN', 'CUSTOM_ECH_DOMAIN'],
    alpn: ['alpn', 'ALPN'],
    d: ['d', 'D'],
    p: ['p', 'P'],
    yx: ['yx', 'YX'],
    yxURL: ['yxURL', 'YXURL', 'YX_URL'],
    s: ['s', 'S'],
    homepage: ['homepage', 'HOMEPAGE'],
    scu: ['scu', 'SCU'],
    ena: ['ena', 'ENA'],
    epd: ['epd', 'EPD'],
    epi: ['epi', 'EPI'],
    egi: ['egi', 'EGI'],
    ae: ['ae', 'AE'],
    rm: ['rm', 'RM'],
    qj: ['qj', 'QJ'],
    dkby: ['dkby', 'DKBY'],
    yxby: ['yxby', 'YXBY'],
    ipv4: ['ipv4', 'IPV4'],
    ipv6: ['ipv6', 'IPV6'],
    ispMobile: ['ispMobile', 'ISPMOBILE', 'ISP_MOBILE'],
    ispUnicom: ['ispUnicom', 'ISPUNICOM', 'ISP_UNICOM'],
    ispTelecom: ['ispTelecom', 'ISPTELECOM', 'ISP_TELECOM'],
    subMode: ['subMode', 'SUBMODE', 'SUB_MODE'],
    subRandomCount: ['subRandomCount', 'SUBRANDOMCOUNT', 'SUB_RANDOM_COUNT'],
    subPort: ['subPort', 'SUBPORT', 'SUB_PORT'],
    subCustomIPs: ['subCustomIPs', 'SUBCUSTOMIPS', 'SUB_CUSTOM_IPS'],
    subGenerator: ['subGenerator', 'SUBGENERATOR', 'SUB_GENERATOR'],
    subName: ['subName', 'SUBNAME', 'SUB_NAME'],
    subUpdateTime: ['subUpdateTime', 'SUBUPDATETIME', 'SUB_UPDATE_TIME']
  };
  const Snap = {};
  for (const [Key, Names] of Object.entries(Map)) {
    const Val = ReadEnvVal(EnvVal, ...Names);
    if (Val !== undefined) Snap[Key] = Val;
  }
  return Snap;
}

function EffectiveSnapshot(EnvVal = {}) {
  return FinalizeConfig({
    ...EnvSnapshot(EnvVal),
    ...KVConfig
  });
}
// official direct address pool: built-in verified addresses, no third-party dependency
// CF uses anycast; the same address lands on different PoPs by location, so no region split
const OfficialAddrs = "172.71.218.190,162.158.228.87,162.158.189.134,162.158.26.63,162.158.25.86,162.158.29.216,162.158.218.160,162.158.227.214,172.69.118.198,172.69.119.150".split(',');
function GetOfficialAddr() {
  const XXX2 = OfficialAddrs[Math.floor(Math.random() * OfficialAddrs.length)];
  return {
    domain: XXX2,
    region: 'CF',
    regionCode: 'CF',
    port: 443
  };
}
let BackupList = [{
  domain: "ProxyIP.HK.CMLiussss.net",
  region: 'HK',
  regionCode: 'HK',
  port: 443
}, {
  domain: "ProxyIP.US.CMLiussss.net",
  region: 'US',
  regionCode: 'US',
  port: 443
}, {
  domain: "ProxyIP.SG.CMLiussss.net",
  region: 'SG',
  regionCode: 'SG',
  port: 443
}, {
  domain: "ProxyIP.JP.CMLiussss.net",
  region: 'JP',
  regionCode: 'JP',
  port: 443
}, {
  domain: "ProxyIP.KR.CMLiussss.net",
  region: 'KR',
  regionCode: 'KR',
  port: 443
}, {
  domain: "ProxyIP.DE.CMLiussss.net",
  region: 'DE',
  regionCode: 'DE',
  port: 443
}, {
  domain: "ProxyIP.SE.CMLiussss.net",
  region: 'SE',
  regionCode: 'SE',
  port: 443
}, {
  domain: "ProxyIP.NL.CMLiussss.net",
  region: 'NL',
  regionCode: 'NL',
  port: 443
}, {
  domain: "ProxyIP.FI.CMLiussss.net",
  region: 'FI',
  regionCode: 'FI',
  port: 443
}, {
  domain: "ProxyIP.GB.CMLiussss.net",
  region: 'GB',
  regionCode: 'GB',
  port: 443
}, {
  domain: "ProxyIP.Oracle.cmliussss.net",
  region: 'Oracle',
  regionCode: 'Oracle',
  port: 443
}, {
  domain: "ProxyIP.DigitalOcean.CMLiussss.net",
  region: 'DigitalOcean',
  regionCode: 'DigitalOcean',
  port: 443
}, {
  domain: "ProxyIP.Vultr.CMLiussss.net",
  region: 'Vultr',
  regionCode: 'Vultr',
  port: 443
}, {
  domain: "ProxyIP.Multacom.CMLiussss.net",
  region: 'Multacom',
  regionCode: 'Multacom',
  port: 443
}];
const DirectDomains = [{
  name: "cloudflare.182682.xyz",
  domain: "cloudflare.182682.xyz"
}, {
  name: "speed.marisalnc.com",
  domain: "speed.marisalnc.com"
}, {
  domain: "freeyx.cloudflare88.eu.org"
}, {
  domain: "bestcf.top"
}, {
  domain: "cdn.2020111.xyz"
}, {
  domain: "cfip.cfcdn.vip"
}, {
  domain: "cf.0sm.com"
}, {
  domain: "cf.090227.xyz"
}, {
  domain: "cf.zhetengsha.eu.org"
}, {
  domain: "cloudflare.9jy.cc"
}, {
  domain: "cf.zerone-cdn.pp.ua"
}, {
  domain: "cfip.1323123.xyz"
}, {
  domain: "cnamefuckxxs.yuchen.icu"
}, {
  domain: "cloudflare-ip.mofashi.ltd"
}, {
  domain: "115155.xyz"
}, {
  domain: "cname.xirancdn.us"
}, {
  domain: "f3058171cad.002404.xyz"
}, {
  domain: "8.889288.xyz"
}, {
  domain: "cdn.tzpro.xyz"
}, {
  domain: "cf.877771.xyz"
}, {
  domain: "xn--b6gac.eu.org"
}];
const ErrXInvalidData = "invalid data";
const ErrXInvalidUuid = "invalid user";
const ErrXXSupportCmd = "command is not supported";
const ErrXOnlySupportDnsUuidDataX = "UDP proxy only enable for DNS which is port 53";
const ErrXInvalidAddrType = "invalid addressType";
const ErrXEmptyAddr = "addressValue is empty";
const ErrXWsXOpen = "webSocket.eadyState is not open";
const ErrXInvalidIdStr = "Stringified identifier is invalid";
const ErrXInvalidProxyAddr = "Invalid SOCKS address format";
const ErrXNoAcceptableMethod = "no acceptable methods";
const ErrXNeedAuth = "socks server needs auth";
const ErrXAuthFail = "fail to auth socks server";
const ErrXProxyConnFail = "fail to open socks connection";
const ErrXProxyTunnelFail = "fail to open proxy tunnel";
const ErrXProxyRespErr = "invalid proxy response";
const PrefixXSock5 = "socks5://";
const PrefixXSock = "socks://";
const PrefixXHttp = "http://";
const PrefixXHttps = "https://";
const TextXConnMethod = "CONNECT";
const TextXProtoVer = " HTTP/1.1";
const TextXHostHeader = "Host: ";
const TextXProxyAuthHeader = "Proxy-Authorization: Basic ";
const TextXProxyKeepAlive = "Proxy-Connection: Keep-Alive";
const TextXUAHeader = "User-Agent: Mozilla/5.0";
const TextXNewline = "\r\n";
const TextXRespPrefix = "HTTP/";
const ProxyKindXSock5 = 'p5';
const ProxyKindXTunnel = 'pt';
const ProxyKindXSecureTunnel = 'pts';
let ParsedSocks5 = {};
let ProxyEnabled = false;
const AT_IPV4 = 1;
const AT_DOMAIN = 2;
const AT_IPV6 = 3;
const ChunkSize = 64 * 1024;
const DownPacketSize = 32 * 1024;
const DownTail = 512;
const DownDelay = 0;
const UpPacketSize = 16 * 1024;
const UpQueueLimit = 256 * 1024;
const ConnRaceCount = 2;
const FirstByteTimeout = 3500;
const SharedDecoder = new TextDecoder();
const UuidByteCache = new Map();
function IsValidUuid(Str) {
  const UuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return UuidRegex.test(Str);
}
function IsValidAddr(Addr792) {
  const ValXRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (ValXRegex.test(Addr792)) return true;
  const ValXRegexX2 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ValXRegexX2.test(Addr792)) return true;
  const ValXRowRegex = /^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;
  if (ValXRowRegex.test(Addr792)) return true;
  return false;
}
function NormalizeHost(Host786) {
  return String(Host786 || '').trim().replace(/^\[([^\]]+)\]$/, '$1');
}
function MakeNodeAlias(Val785, Fallback = 'Node') {
  let Text784 = String(Val785 || '').trim();
  if (!Text784 || /^自定义优选-/i.test(Text784)) Text784 = Fallback;
  Text784 = Text784.replace(/^\[([^\]]+)\]$/, '$1').replace(/^https?:\/\//i, '').replace(/[/?#].*$/, '').replace(/\s+/g, '_');
  return Text784 || Fallback;
}
function NodeAliasBase(Item783) {
  const Host782 = NormalizeHost(Item783?.ip || Item783?.domain || '');
  if (Host782 && Host782.includes(':') && /^[0-9a-fA-F:.]+$/.test(Host782)) return 'IPv6优选';
  if (Host782 && !IsValidAddr(Host782)) return '优选域名';
  const Local781 = MakeNodeAlias(Item783?.isp || Item783?.name || '', 'IPv4优选');
  const Colo780 = MakeNodeAlias(Item783?.colo || '', '');
  return Colo780 ? `${Local781}-${Colo780}` : Local781;
}
function MakeNamer(SkipNo779 = false) {
  const Counter = {};
  return Item778 => {
    const BaseX1 = NodeAliasBase(Item778);
    if (SkipNo779) return BaseX1;
    Counter[BaseX1] = (Counter[BaseX1] || 0) + 1;
    return `${BaseX1}-${String(Counter[BaseX1]).padStart(2, '0')}`;
  };
}
function NormalizeAlpn(Val777) {
  const Local776 = ['', 'h3', 'h2', 'http/1.1', 'h3,h2', 'h2,http/1.1', 'h3,h2,http/1.1'];
  const Alpn775 = String(Val777 || '').trim();
  return Local776.includes(Alpn775) ? Alpn775 : '';
}
function ApplyAlpnParam(Args774) {
  const Alpn = NormalizeAlpn(CustomAlpn);
  if (Alpn) Args774.set('alpn', Alpn);
}
async function InitKV(Local773) {
  // KV binding name: K (primary), also accepts C/KV/ConfigKV/CFKV/CFBOX
  const KVStoreBind = Local773.K || Local773.C || Local773.KV || Local773.ConfigKV || Local773.CFKV || Local773.CFBOX;
  if (KVStoreBind) {
    try {
      KVStore = KVStoreBind;
      await LoadKVConfig();
    } catch (Err772) {
      KVStore = null;
    }
  }
}
async function LoadKVConfig(Local771 = false) {
  if (!KVStore) {
    return;
  }

  // fully trust the cache within a short window to avoid hammering KV
  if (!Local771 && KVConfigLastLoad > 0 && Date.now() - KVConfigLastLoad < KVCacheTtl) {
    return;
  }
  try {
    // read the tiny version key c_ver (~13B) for cross-isolate cache invalidation
    let Local770 = '';
    try {
      Local770 = (await KVStore.get('c_ver')) || '';
    } catch (Ignore769) {}

    // if version unchanged and cache exists, only bump the timestamp and skip a full read
    if (!Local771 && Local770 && Local770 === KVConfigVersion && KVConfig && Object.keys(KVConfig).length > 0) {
      KVConfigLastLoad = Date.now();
      return;
    }
    const CfgData = await KVStore.get('c');
    if (CfgData) {
      KVConfig = JSON.parse(CfgData);
    }
    KVConfigVersion = Local770;
    KVConfigLastLoad = Date.now();
  } catch (Err768) {
    // keep the existing cache on read failure so a transient fault never loses config
    if (!KVConfig) KVConfig = {};
  }
}
async function SaveKVConfig() {
  if (!KVStore) {
    return;
  }
  try {
    const ConfigStr = JSON.stringify(KVConfig);
    await KVStore.put('c', ConfigStr);
    // write the version so other isolates see the change on the next request
    const NewVal = String(Date.now());
    KVConfigVersion = NewVal;
    try {
      await KVStore.put('c_ver', NewVal);
    } catch (Ignore767) {}
    KVConfigLastLoad = Date.now();
  } catch (Err766) {
    throw Err766;
  }
}
function GetConfigVal(Key765, DefaultVal = '') {
  if (KVConfig[Key765] !== undefined) {
    return KVConfig[Key765];
  }
  return DefaultVal;
}
async function SetConfigVal(Key764, Val763) {
  KVConfig[Key764] = Val763;
  await SaveKVConfig();
}
async function GetBackupAddr(WorkerRegion753 = '', ValRegionMatch752 = EnableRegionMatch) {
  // when no region is specified (wk empty = official direct), use built-in addresses without third-party domains
  if (!WorkerRegion753 || WorkerRegion753 === 'CF') {
    return GetOfficialAddr();
  }
  if (BackupList.length === 0) {
    return GetOfficialAddr();
  }
  const AvailableAddrs751 = BackupList.map(Addr750 => ({
    ...Addr750,
    available: true
  }));
  if (ValRegionMatch752 && WorkerRegion753) {
    const Addrs749 = GetRegionAddrs(WorkerRegion753, AvailableAddrs751, ValRegionMatch752);
    if (Addrs749.length > 0) {
      const SelectedAddr748 = Addrs749[0];
      return SelectedAddr748;
    }
  }
  const SelectedAddr = AvailableAddrs751[0];
  return SelectedAddr;
}
function GetRegionNeighbors(Region747) {
  const ValMap = {
    'US': ['SG', 'JP', 'KR'],
    'SG': ['JP', 'KR', 'US'],
    'JP': ['SG', 'KR', 'US'],
    'KR': ['JP', 'SG', 'US'],
    'DE': ['NL', 'GB', 'SE', 'FI'],
    'SE': ['DE', 'NL', 'FI', 'GB'],
    'NL': ['DE', 'GB', 'SE', 'FI'],
    'FI': ['SE', 'DE', 'NL', 'GB'],
    'GB': ['DE', 'NL', 'SE', 'FI']
  };
  return ValMap[Region747] || [];
}
function GetRegionOrder(Region746) {
  const Val2745 = GetRegionNeighbors(Region746);
  const Val2744 = ['US', 'SG', 'JP', 'KR', 'DE', 'SE', 'NL', 'FI', 'GB'];
  return [Region746, ...Val2745, ...Val2744.filter(ReadResultVal743 => ReadResultVal743 !== Region746 && !Val2745.includes(ReadResultVal743))];
}
function GetRegionAddrs(WorkerRegion, AvailableAddrs, ValRegionMatch = EnableRegionMatch) {
  if (!ValRegionMatch || !WorkerRegion) {
    return AvailableAddrs;
  }
  const Val2742 = GetRegionOrder(WorkerRegion);
  const Addrs741 = [];
  for (const Region of Val2742) {
    const RegionAddrItems = AvailableAddrs.filter(Addr740 => Addr740.regionCode === Region);
    Addrs741.push(...RegionAddrItems);
  }
  return Addrs741;
}
function ParseAddrPort(Input) {
  if (Input.includes('[') && Input.includes(']')) {
    const Local739 = Input.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (Local739) {
      return {
        address: Local739[1],
        port: Local739[2] ? parseInt(Local739[2], 10) : null
      };
    }
  }
  const Val2Idx738 = Input.lastIndexOf(':');
  if (Val2Idx738 > 0) {
    const Addr737 = Input.substring(0, Val2Idx738);
    const PortStr = Input.substring(Val2Idx738 + 1);
    const Port736 = parseInt(PortStr, 10);

    // address 含 @@T0@@ description是裸 IPv6（如 2001:db8::1），整体当address，无port
    if (!Addr737.includes(':') && !isNaN(Port736) && Port736 > 0 && Port736 <= 65535) {
      return {
        address: Addr737,
        port: Port736
      };
    }
  }
  return {
    address: Input,
    port: null
  };
}
export default {
  async fetch(Request735, Local734, Local733) {
    try {
      const IsWs = Request735.headers.get('Upgrade') === "websocket";
      const IsRtl732 = Request735.method === 'POST';
      const RequestUrl731 = new URL(Request735.url);
      const PathVal730 = RequestUrl731.pathname.split('/').filter(ParamVal729 => ParamVal729);
      if (!IsWs && !IsRtl732 && RequestUrl731.pathname !== '/') {
        const Val2728 = (Local734.U || '').toLowerCase();
        const Val2727 = (Local734.d || Local734.D || '').toLowerCase();
        const XXVal = PathVal730[0] || '';
        const CleanVal = Val2727.startsWith('/') ? Val2727.substring(1) : Val2727;
        if (XXVal !== Val2728 && (CleanVal ? XXVal !== CleanVal : false)) {
          return new Response('Not Found', {
            status: 404
          });
        }
      }
      await InitKV(Local734);
       // read auth token: uppercase var U (UUID-compatible), trim and lowercase
      AuthToken = String(Local734.U || Local734.UUID || AuthToken || '').trim().toLowerCase();
      const ValPath = (Local734.d || Local734.D || AuthToken).toLowerCase();
      const Local726 = GetConfigVal('p', Local734.p || Local734.P);
      let ValCustomAddr = false;
      const ManualRegion725 = GetConfigVal('wk', Local734.wk || Local734.WK);
      if (ManualRegion725 && ManualRegion725.trim()) {
        ManualRegion = ManualRegion725.trim().toUpperCase();
        CurRegion = ManualRegion;
      } else if (Local726 && Local726.trim()) {
        ValCustomAddr = true;
        CurRegion = 'CUSTOM';
      } else {
        // wk empty = official direct: use built-in addresses, skip region detection for third-party domains
        CurRegion = 'CF';
      }
      const RegionMatchXX724 = GetConfigText('rm', Defaults.rm, Local734.rm || Local734.RM);
      EnableRegionMatch = !(RegionMatchXX724 && RegionMatchXX724.toLowerCase() === 'no');
      const ValFallback723 = GetConfigText('p', Defaults.p, Local734.p || Local734.P);
      FallbackAddr = ValFallback723 ? ValFallback723.trim() : '';
      Socks5Cfg = GetConfigText('s', Defaults.s, Local734.s || Local734.S);
      if (Socks5Cfg) {
        try {
          ParsedSocks5 = ParseProxyConfig(Socks5Cfg);
          ProxyEnabled = true;
        } catch (Err722) {
          ProxyEnabled = false;
        }
      } else {
        ParsedSocks5 = {};
        ProxyEnabled = false;
      }
      // EdgeTunnel feature: GO2SOCKS5 domain whitelist — whitelisted targets are forced through the proxy from the s variable
      const WhitelistConfigVal = Local734.GO2SOCKS5 || Local734.gO2SOCKS5 || GetConfigVal('GO2SOCKS5', '');
      GO2SOCKS5Whitelist = String(WhitelistConfigVal).split(/[,，\s]+/).map(ItemX14 => String(ItemX14).trim().replace(/^\*\./, '').toLowerCase()).filter(ItemX14 => ItemX14);
      const CustomPref = GetConfigVal('yx', Local734.yx || Local734.YX);
      if (CustomPref) {
        try {
          const PrefItems721 = CustomPref.split(',').map(Item720 => Item720.trim()).filter(Item719 => Item719);
          CustomPrefAddrs = [];
          CustomPrefDomains = [];
          PrefItems721.forEach(Item718 => {
            let NodeName717 = '';
            let AddrPart716 = Item718;
            if (Item718.includes('#')) {
              const Parts715 = Item718.split('#');
              AddrPart716 = Parts715[0].trim();
              NodeName717 = Parts715[1].trim();
            }
            const {
              address: Addr714,
              port: Port713
            } = ParseAddrPort(AddrPart716);
            if (!NodeName717) {
              NodeName717 = '自定义优选-' + Addr714 + (Port713 ? ':' + Port713 : '');
            }
            if (IsValidAddr(Addr714)) {
              CustomPrefAddrs.push({
                ip: Addr714,
                port: Port713,
                isp: NodeName717
              });
            } else {
              CustomPrefDomains.push({
                domain: Addr714,
                port: Port713,
                name: NodeName717
              });
            }
          });
        } catch (Err712) {
          CustomPrefAddrs = [];
          CustomPrefDomains = [];
        }
      }
      const ValXX711 = GetConfigText('qj', Defaults.qj, Local734.qj || Local734.QJ);
      const ValXXXXXVal = (ValXX711 || '').toLowerCase();
      EnableDegrade = ValXXXXXVal === 'no';
      ProxyOnly = ValXXXXXVal === 'only';
      const ValXX710 = GetConfigText('dkby', Defaults.dkby, Local734.dkby || Local734.DKBY);
      DisablePlain = !!(ValXX710 && ValXX710.toLowerCase() === 'yes');
      const ValXX709 = GetConfigText('yxby', Defaults.yxby, Local734.yxby || Local734.YXBY);
      DisablePref = !!(ValXX709 && ValXX709.toLowerCase() === 'yes');
      EnablePlain = GetConfigBool('ev', true, Local734.ev);
      EnableTrojan = GetConfigBool('et', false, Local734.et);
      TransferPath = GetConfigText('tp', Defaults.tp, Local734.tp);
      EnableXhttp = GetConfigBool('ex', false, Local734.ex);
      SubConverter = GetConfigText('scu', Defaults.scu, Local734.scu);
      EnablePrefDomain = GetConfigBool('epd', true, Local734.epd || Local734.EPD);
      EnablePrefIp = GetConfigBool('epi', true, Local734.epi || Local734.EPI);
      EnableRepoPref = GetConfigBool('egi', true, Local734.egi || Local734.EGI);
      EnableNative = GetConfigBool('ena', false, Local734.ena || Local734.ENA);
      EnableEch = GetConfigBool('ech', false, Local734.ech || Local734.ECH);

      // loadcustomDNS and ECHdomainconfig
      CustomDns = GetConfigText('customDNS', Defaults.customDNS).trim() || Defaults.customDNS;
      CustomEchDomain = GetConfigText('customECHDomain', Defaults.customECHDomain).trim() || Defaults.customECHDomain;
      CustomAlpn = NormalizeAlpn(GetConfigText('alpn', Defaults.alpn, Local734.alpn || Local734.ALPN));

      // if ECH is on, force TLS-only mode (avoid port-80 interference)
      // ECH needs TLS, so non-TLS nodes must be disabled
      if (EnableEch) {
        DisablePlain = true;
        // check whether KV has dkby: yes; write it if missing
        const Cur = GetConfigVal('dkby', '');
        if (Cur !== 'yes') {
          await SetConfigVal('dkby', 'yes');
        }
      }
      if (!EnablePlain && !EnableTrojan && !EnableXhttp) {
        EnablePlain = true;
      }
      PrefAddrSource = GetConfigText('yxURL', Defaults.yxURL, Local734.yxURL || Local734.YXURL);
      CustomPath = GetConfigText('d', Defaults.d, Local734.d || Local734.D);
      const Url698 = new URL(Request735.url);
      if (Url698.pathname.includes('/api/config')) {
        const PathParts697 = Url698.pathname.split('/').filter(ParamVal696 => ParamVal696);
        const ApiIdx695 = PathParts697.indexOf('api');
        if (ApiIdx695 > 0) {
          const PathVal694 = PathParts697.slice(0, ApiIdx695);
          const PathVal693 = PathVal694.join('/');
          let IsValid692 = false;
          if (CustomPath && CustomPath.trim()) {
            const CleanCustomPath691 = CustomPath.trim().startsWith('/') ? CustomPath.trim().substring(1) : CustomPath.trim();
            IsValid692 = PathVal693 === CleanCustomPath691;
          } else {
            IsValid692 = IsValidUuid(PathVal693) && PathVal693 === AuthToken;
          }
          if (IsValid692) {
            return await HandleConfigApi(Request735, Local734);
          } else {
            return new Response(JSON.stringify({
              error: '路径验证失败'
            }), {
              status: 403,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        }
        return new Response(JSON.stringify({
          error: '无效的API路径'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      if (Url698.pathname.includes('/api/preferred-ips')) {
        const PathParts690 = Url698.pathname.split('/').filter(ParamVal689 => ParamVal689);
        const ApiIdx = PathParts690.indexOf('api');
        if (ApiIdx > 0) {
          const PathVal688 = PathParts690.slice(0, ApiIdx);
          const PathVal687 = PathVal688.join('/');
          let IsValid686 = false;
          if (CustomPath && CustomPath.trim()) {
            const CleanCustomPath685 = CustomPath.trim().startsWith('/') ? CustomPath.trim().substring(1) : CustomPath.trim();
            IsValid686 = PathVal687 === CleanCustomPath685;
          } else {
            IsValid686 = IsValidUuid(PathVal687) && PathVal687 === AuthToken;
          }
          if (IsValid686) {
            return await HandlePrefAddrsApi(Request735);
          } else {
            return new Response(JSON.stringify({
              error: '路径验证失败'
            }), {
              status: 403,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        }
        return new Response(JSON.stringify({
          error: '无效的API路径'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      if (Url698.pathname.includes('/api/network-test')) {
        const PathParts678 = Url698.pathname.split('/').filter(ParamVal677 => ParamVal677);
        const ApiIdx676 = PathParts678.indexOf('api');
        if (ApiIdx676 > 0) {
          const PathVal675 = PathParts678.slice(0, ApiIdx676);
          const PathVal674 = PathVal675.join('/');
          let IsValid673 = false;
          if (CustomPath && CustomPath.trim()) {
            const CleanCustomPath672 = CustomPath.trim().startsWith('/') ? CustomPath.trim().substring(1) : CustomPath.trim();
            IsValid673 = PathVal674 === CleanCustomPath672;
          } else {
            IsValid673 = IsValidUuid(PathVal674) && PathVal674 === AuthToken;
          }
          if (IsValid673) {
            return await HandleNetTestApi();
          } else {
            return new Response(JSON.stringify({
              error: '路径验证失败'
            }), {
              status: 403,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        }
        return new Response(JSON.stringify({
          error: '无效的API路径'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      if (Url698.pathname.includes('/api/node-speedtest')) {
        const PathParts671 = Url698.pathname.split('/').filter(ParamVal670 => ParamVal670);
        const ApiIdx669 = PathParts671.indexOf('api');
        if (ApiIdx669 > 0) {
          const PathVal668 = PathParts671.slice(0, ApiIdx669);
          const PathVal667 = PathVal668.join('/');
          let IsValid666 = false;
          if (CustomPath && CustomPath.trim()) {
            const CleanCustomPath665 = CustomPath.trim().startsWith('/') ? CustomPath.trim().substring(1) : CustomPath.trim();
            IsValid666 = PathVal667 === CleanCustomPath665;
          } else {
            IsValid666 = IsValidUuid(PathVal667) && PathVal667 === AuthToken;
          }
          if (IsValid666) {
            return await HandleSpeedApi();
          } else {
            return new Response(JSON.stringify({
              error: '路径验证失败'
            }), {
              status: 403,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        }
        return new Response(JSON.stringify({
          error: '无效的API路径'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      if (Url698.pathname.includes('/api/latency-test')) {
        const SpeedtestPathSeg9 = Url698.pathname.split('/').filter(ParamVal9 => ParamVal9);
        const SpeedtestApiPos9 = SpeedtestPathSeg9.indexOf('api');
        if (SpeedtestApiPos9 > 0) {
          const SpeedtestPathPrefix9 = SpeedtestPathSeg9.slice(0, SpeedtestApiPos9);
          const SpeedtestPathStr9 = SpeedtestPathPrefix9.join('/');
          let SpeedtestPathValid9 = false;
          if (CustomPath && CustomPath.trim()) {
            const CleanPath9 = CustomPath.trim().startsWith('/') ? CustomPath.trim().substring(1) : CustomPath.trim();
            SpeedtestPathValid9 = SpeedtestPathStr9 === CleanPath9;
          } else {
            SpeedtestPathValid9 = IsValidUuid(SpeedtestPathStr9) && SpeedtestPathStr9 === AuthToken;
          }
          if (SpeedtestPathValid9) {
            return await HandleLatencyApi(Request735);
          } else {
            return new Response(JSON.stringify({
              error: '路径验证失败'
            }), {
              status: 403,
              headers: {
                'Content-Type': 'application/json'
              }
            });
          }
        }
        return new Response(JSON.stringify({
          error: '无效的API路径'
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      if (Request735.method === 'POST' && EnableXhttp) {
        const ReadResultVal684 = await HandleXhttp(Request735);
        if (ReadResultVal684) {
          Local733.waitUntil(ReadResultVal684.closed);
          return new Response(ReadResultVal684.readable, {
            headers: {
              'X-Accel-Buffering': 'no',
              'Cache-Control': 'no-store',
              Connection: 'keep-alive',
              'User-Agent': 'Go-http-client/2.0',
              'Content-Type': 'application/grpc'
            }
          });
        }
        return new Response('Internal Server Error', {
          status: 500
        });
      }
      if (Request735.headers.get('Upgrade') === "websocket") {
        return await HandleWsRequest(Request735);
      }
      if (Request735.method === 'GET') {
        // handle /{UUID}/region or /{custom-path}/region
        if (Url698.pathname.endsWith('/region')) {
          const PathParts683 = Url698.pathname.split('/').filter(ParamVal682 => ParamVal682);
          if (PathParts683.length === 2 && PathParts683[1] === 'region') {
            const PathVal681 = PathParts683[0];
            let IsValid680 = false;
            if (CustomPath && CustomPath.trim()) {
              // using custom path
              const CleanCustomPath679 = CustomPath.trim().startsWith('/') ? CustomPath.trim().substring(1) : CustomPath.trim();
              IsValid680 = PathVal681 === CleanCustomPath679;
            } else {
              // using UUID path
              IsValid680 = IsValidUuid(PathVal681) && PathVal681 === AuthToken;
            }
            if (IsValid680) {
              const Local678 = GetConfigVal('p', Local734.p || Local734.P);
              const ManualRegion677 = GetConfigVal('wk', Local734.wk || Local734.WK);
              if (ManualRegion677 && ManualRegion677.trim()) {
                return new Response(JSON.stringify({
                  region: ManualRegion677.trim().toUpperCase(),
                  detectionMethod: '手动指定地区',
                  manualRegion: ManualRegion677.trim().toUpperCase(),
                  timestamp: new Date().toISOString()
                }), {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              } else if (Local678 && Local678.trim()) {
                return new Response(JSON.stringify({
                  region: 'CUSTOM',
                  detectionMethod: "自定义ProxyIP模式",
                  ci: Local678,
                  timestamp: new Date().toISOString()
                }), {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              } else {
                // wk 留空 = official direct，用built-inaddresswhileno是探测地区
                return new Response(JSON.stringify({
                  region: 'CF',
                  detectionMethod: "官方直连",
                  timestamp: new Date().toISOString()
                }), {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              }
            } else {
              return new Response(JSON.stringify({
                error: '访问被拒绝',
                message: '路径验证失败'
              }), {
                status: 403,
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            }
          }
        }

        // handle /{UUID}/test-api or /{custom-path}/test-api
        if (Url698.pathname.endsWith('/test-api')) {
          const PathParts676 = Url698.pathname.split('/').filter(ParamVal675 => ParamVal675);
          if (PathParts676.length === 2 && PathParts676[1] === 'test-api') {
            const PathVal = PathParts676[0];
            let IsValid = false;
            if (CustomPath && CustomPath.trim()) {
              // using custom path
              const CleanCustomPath674 = CustomPath.trim().startsWith('/') ? CustomPath.trim().substring(1) : CustomPath.trim();
              IsValid = PathVal === CleanCustomPath674;
            } else {
              // using UUID path
              IsValid = IsValidUuid(PathVal) && PathVal === AuthToken;
            }
            if (IsValid) {
              try {
                return new Response(JSON.stringify({
                  detectedRegion: 'CF',
                  message: 'API测试完成',
                  timestamp: new Date().toISOString()
                }), {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              } catch (Err673) {
                return new Response(JSON.stringify({
                  error: Err673.message,
                  message: 'API测试失败'
                }), {
                  status: 500,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              }
            } else {
              return new Response(JSON.stringify({
                error: '访问被拒绝',
                message: '路径验证失败'
              }), {
                status: 403,
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            }
          }
        }
        if (Url698.pathname === '/') {
          // check for a custom homepage URL (prefer effective config snapshot; supports KV and env HOMEPAGE)
          const ValidHomeConfig = EffectiveSnapshot(Local734);
          const CustomVal = ValidHomeConfig.homepage || GetConfigVal('homepage', Local734.homepage || Local734.HOMEPAGE);
          if (CustomVal && CustomVal.trim()) {
            try {
              // fetch content from the custom URL
              const ValResp = await fetch(CustomVal.trim(), {
                method: 'GET',
                headers: {
                  'User-Agent': Request735.headers.get('User-Agent') || 'Mozilla/5.0',
                  'Accept': Request735.headers.get('Accept') || '*/*',
                  'Accept-Language': Request735.headers.get('Accept-Language') || 'en-US,en;q=0.9'
                },
                redirect: 'follow'
              });
              if (ValResp.ok) {
                // read response body
                const ContentType672 = ValResp.headers.get('Content-Type') || 'text/html; charset=utf-8';
                const Content671 = await ValResp.text();

                // return the custom homepage body
                return new Response(Content671, {
                  status: ValResp.status,
                  headers: {
                    'Content-Type': ContentType672,
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                  }
                });
              }
            } catch (Err670) {
              // if the fetch fails, fall back to the default terminal page
              console.error('获取自定义首页失败:', Err670);
            }
          }
          // check cookie for the language preference first
          const CookieHeader669 = Request735.headers.get('Cookie') || '';
          let CookieLang668 = null;
          if (CookieHeader669) {
            const Local667 = CookieHeader669.split(';').map(CVal666 => CVal666.trim());
            for (const Cookie665 of Local667) {
              if (Cookie665.startsWith('preferredLanguage=')) {
                CookieLang668 = Cookie665.split('=')[1];
                break;
              }
            }
          }
          let LangCode664 = 'zh';
          if (CookieLang668 === 'fa' || CookieLang668 === 'fa-IR') {
            LangCode664 = 'fa';
          } else if (CookieLang668 === 'en' || CookieLang668 === 'en-US' || CookieLang668 === 'en-GB') {
            LangCode664 = 'en';
          } else if (CookieLang668 === 'zh' || CookieLang668 === 'zh-CN') {
            LangCode664 = 'zh';
          } else {
            // if no cookie, fall back to browser-language detection
            const AcceptLang663 = Request735.headers.get('Accept-Language') || '';
            const BrowserLang662 = AcceptLang663.split(',')[0].split('-')[0].toLowerCase();
            if (BrowserLang662 === 'fa' || AcceptLang663.includes('fa-IR') || AcceptLang663.includes('fa')) {
              LangCode664 = 'fa';
            } else if (BrowserLang662 === 'en') {
              LangCode664 = 'en';
            } else {
              LangCode664 = 'zh';
            }
          }
          const IsRtl664 = LangCode664 === 'fa';
          const Lang = LangCode664 === 'fa' ? 'fa' : LangCode664 === 'en' ? 'en' : 'zh-CN';
          const LangVal661 = LangCode664 === 'fa' ? 'fa-IR' : LangCode664 === 'en' ? 'en' : 'zh-CN';
          const Local660 = {
            zh: {
              title: 'CFBox 终端 v1.0',
              terminal: 'CFBox 终端 v1.0',
              congratulations: '恭喜你来到这',
              enterU: '请输入你U变量的值',
              enterD: '请输入你D变量的值',
              command: '命令: connect [',
              uuid: 'UUID',
              path: 'PATH',
              inputU: '输入U变量的内容并且回车...',
              inputD: '输入D变量的内容并且回车...',
              connecting: '正在连接...',
              invading: '正在登录...',
              success: '登录成功！',
              error: '错误: 无效的UUID格式',
              reenter: '请重新输入有效的UUID'
            },
            fa: {
              title: 'ترمینال v1.0',
              terminal: 'ترمینال v1.0',
              congratulations: 'تبریک می‌گوییم به شما',
              enterU: 'لطفا مقدار متغیر U خود را وارد کنید',
              enterD: 'لطفا مقدار متغیر D خود را وارد کنید',
              command: 'دستور: connect [',
              uuid: 'UUID',
              path: 'PATH',
              inputU: 'محتویات متغیر U را وارد کرده و Enter را بزنید...',
              inputD: 'محتویات متغیر D را وارد کرده و Enter را بزنید...',
              connecting: 'در حال اتصال...',
              invading: 'در حال ورود...',
              success: 'ورود موفق!',
              error: 'خطا: فرمت UUID نامعتبر',
              reenter: 'لطفا UUID معتبر را دوباره وارد کنید'
            },
            en: {
              title: 'CFBox Terminal v1.0',
              terminal: 'CFBox Terminal v1.0',
              congratulations: 'Congratulations, you made it here',
              enterU: 'Please enter the value of your U variable',
              enterD: 'Please enter the value of your D variable',
              command: 'Command: connect [',
              uuid: 'UUID',
              path: 'PATH',
              inputU: 'Enter the U variable content and press Enter...',
              inputD: 'Enter the D variable content and press Enter...',
              connecting: 'Connecting...',
              invading: 'Logging in...',
              success: 'Login successful!',
              error: 'Error: invalid UUID format',
              reenter: 'Please enter a valid UUID again'
            }
          };
          const I18n659 = Local660[LangCode664] || Local660['zh'];
          const VisitorIp = Request735.headers.get('CF-Connecting-IP') || Request735.headers.get('True-Client-IP') || (Request735.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '未知';
  const TerminalHtml = `<!DOCTYPE html>
    <html lang="${LangVal661}" dir="${IsRtl664 ? 'rtl' : 'ltr'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${I18n659.title}</title>
<style>
            /* =========================================================
               CFBox · Aurora Glass 主题（终端页）
               ========================================================= */
            :root {
                --bg-0: #050816; --bg-1: #0b1226;
                --surface: rgba(255,255,255,0.045);
                --surface-2: rgba(255,255,255,0.07);
                --border: rgba(148,163,255,0.16);
                --border-strong: rgba(129,140,248,0.42);
                --acc-1: #6366f1; --acc-2: #22d3ee; --acc-3: #a78bfa;
                --ok: #34d399; --text: #e4eaf7; --text-dim: #8ba0c8;
                --radius: 16px; --radius-sm: 10px;
                --shadow: 0 20px 60px rgba(0,0,0,0.45);
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { min-height: 100%; }
            body {
                font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", -apple-system, Arial, sans-serif;
                color: var(--text);
                min-height: 100vh;
                overflow-x: hidden;
                position: relative;
                background:
                    radial-gradient(1100px 750px at 80% -10%, rgba(99,102,241,0.22), transparent 60%),
                    radial-gradient(900px 650px at 10% 20%, rgba(34,211,238,0.14), transparent 60%),
                    radial-gradient(850px 650px at 55% 110%, rgba(167,139,250,0.16), transparent 60%),
                    linear-gradient(160deg, var(--bg-0) 0%, var(--bg-1) 55%, #070b1d 100%);
                background-attachment: fixed;
            }
            body::before {
                content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
                background:
                    radial-gradient(600px 600px at 20% 20%, rgba(99,102,241,0.14), transparent 60%),
                    radial-gradient(700px 700px at 80% 40%, rgba(34,211,238,0.10), transparent 60%),
                    radial-gradient(600px 600px at 45% 90%, rgba(167,139,250,0.12), transparent 60%);
                filter: blur(30px);
                animation: aurora-drift 18s ease-in-out infinite alternate;
            }
            @keyframes aurora-drift {
                0%   { transform: translate(0,0) scale(1); }
                50%  { transform: translate(2%, -2%) scale(1.08); }
                100% { transform: translate(-2%, 2%) scale(1.02); }
            }
            .matrix-bg, .matrix-code-rain { display: none !important; }
            body::after { display: none !important; }

            .cp-hud {
                position: fixed; top: 0; left: 0; right: 0; z-index: 30;
                display: flex; align-items: center; gap: 18px;
                padding: 14px 28px;
                background: rgba(10,14,32,0.55);
                backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
                border-bottom: 1px solid var(--border);
                color: var(--text-dim); font-size: 0.8rem; letter-spacing: 0.08em;
            }
            .cp-hud-label { color: var(--acc-2); font-weight: 600; }
            .cp-lang-wrapper { margin-left: auto; display: flex; align-items: center; gap: 8px; }
            .cp-lang-tag { color: var(--text-dim); font-size: 0.75rem; letter-spacing: 0.1em; }
            #languageSelector {
                background: var(--surface-2); color: var(--text);
                border: 1px solid var(--border); border-radius: 8px;
                padding: 6px 12px; font-size: 0.85rem; cursor: pointer; outline: none;
            }
            .cp-fx-toggle {
                display: inline-flex; align-items: center; gap: 8px;
                background: var(--surface-2); color: var(--text);
                border: 1px solid var(--border); border-radius: 20px;
                padding: 6px 14px; font-size: 0.8rem; cursor: pointer;
                transition: all .2s ease;
            }
            .cp-fx-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ok); box-shadow: 0 0 8px var(--ok); }

            /* ---------- 终端卡片 ---------- */
            .terminal {
                max-width: 760px; margin: 0 auto; padding: 96px 24px 60px;
            }
            .terminal-body {
                background: var(--surface);
                backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
                border: 1px solid var(--border);
                border-radius: var(--radius);
                box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,0.06);
                overflow: hidden;
            }
            .terminal-header {
                display: flex; align-items: center; gap: 8px;
                padding: 14px 20px;
                background: rgba(255,255,255,0.05);
                border-bottom: 1px solid var(--border);
            }
            .terminal-title {
                font-weight: 700; font-size: 0.9rem; letter-spacing: 0.06em;
                background: linear-gradient(120deg, #a5b4fc, #22d3ee);
                -webkit-background-clip: text; background-clip: text;
                -webkit-text-fill-color: transparent; color: transparent;
            }
            .terminal-buttons { display: flex; gap: 6px; margin-left: auto; }
            .terminal-button { width: 11px; height: 11px; border-radius: 50%; }
            .terminal-button:nth-child(1) { background: #f87171; }
            .terminal-button:nth-child(2) { background: #fbbf24; }
            .terminal-button:nth-child(3) { background: #34d399; }
            .terminal-line { padding: 22px 24px; }
            .terminal-prompt { color: var(--text-dim); font-size: 0.92rem; margin-bottom: 14px; }
            .terminal-prompt .terminal-cursor {
                display: inline-block; width: 9px; height: 1.1em; vertical-align: text-bottom;
                background: var(--acc-2); margin-left: 4px;
                animation: blink 1s steps(2, start) infinite;
            }
            @keyframes blink { 50% { opacity: 0; } }
            .terminal-input {
                width: 100%; padding: 14px 16px !important;
                background: rgba(6,10,26,0.7) !important;
                color: var(--text) !important;
                border: 1px solid var(--border) !important;
                border-radius: var(--radius-sm) !important;
                font-family: "JetBrains Mono", "Fira Code", Consolas, monospace !important;
                font-size: 1rem !important; outline: none !important;
                transition: border-color .2s ease, box-shadow .2s ease;
            }
            .terminal-input:focus { border-color: var(--acc-2) !important; box-shadow: 0 0 0 3px rgba(34,211,238,0.18); }
            .terminal-output {
                margin-top: 16px; padding: 14px 16px;
                background: var(--surface-2); border: 1px solid var(--border);
                border-radius: var(--radius-sm);
                font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
                font-size: 0.88rem; color: var(--text);
                white-space: pre-wrap; word-break: break-all;
                min-height: 20px;
            }
            @media (max-width: 720px) {
                .terminal { padding: 84px 16px 40px; }
                .cp-hud { padding: 12px 16px; flex-wrap: wrap; }
                .cp-hud-line:nth-child(3) { display: none; }
            }
        </style>
    </head>
    <body>
        <div class="matrix-bg"></div>
        <div class="matrix-code-rain" id="matrixCodeRain"></div>
            <div class="cp-hud">
                <span class="cp-hud-line">${LangCode664 === 'fa' ? 'آدرس IP فعلی شما' : LangCode664 === 'en' ? 'Your current IP address' : '您当前IP地址'}：${VisitorIp}<span id="currentIPRegion" style="color: #ffb400;"></span></span>
                <div class="cp-lang-wrapper">
                    <select id="languageSelector" onchange="SwitchLang(this.value)">
                        <option value="zh" ${LangCode664 === 'zh' ? 'selected' : ''}>🇨🇳 中文</option>
                        <option value="fa" ${LangCode664 === 'fa' ? 'selected' : ''}>🇮🇷 فارسی</option>
                        <option value="en" ${LangCode664 === 'en' ? 'selected' : ''}>🇺🇸 English</option>
                    </select>
                </div>
            </div>
        <script>
            // 当前IP地区检测 (ping0.cc JSONP, script 加载不受 CORS 限制)
            window.cfboxRegionCallback = function (ip, loc, asn, org, cc) {
                var el = document.getElementById('currentIPRegion');
                if (el && loc) el.textContent = ' · ' + loc;
            };
            (function () {
                try {
                    var s = document.createElement('script');
                    s.src = 'https://ipv4.ping0.cc/geo/jsonp/cfboxRegionCallback';
                    s.async = true;
                    (document.head || document.documentElement).appendChild(s);
                } catch (e) {}
            })();
        </script>
        <div class="terminal">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <div class="terminal-button"></div>
                    <div class="terminal-button"></div>
                    <div class="terminal-button"></div>
                </div>
                    <div class="terminal-title cp-glitch">${I18n659.terminal}</div>
            </div>
            <div class="terminal-body" id="terminalBody">
                <div class="terminal-line">
                    <span class="terminal-output">${I18n659.congratulations}</span>
                </div>
                <div class="terminal-line">
                    <span class="terminal-output">${CustomPath && CustomPath.trim() ? I18n659.enterD : I18n659.enterU}</span>
                </div>
                <div class="terminal-line">
                    <input type="text" class="terminal-input" id="uuidInput" placeholder="${CustomPath && CustomPath.trim() ? I18n659.inputD : I18n659.inputU}" autofocus>
                    <span class="terminal-cursor"></span>
                </div>
            </div>
        </div>
        <script>
// 页面特效图形化开关 (localStorage 持久化)
window.ApplyPageXX = function () {
  var Local10009 = localStorage.getItem('cp-fx-off') === '1';
  document.body.classList.toggle('fx-off', Local10009);
  var Local10008 = document.getElementById('cpFxLabel');
  if (Local10008) Local10008.textContent = Local10009 ? 'FX: OFF' : 'FX: ON';
  if (Local10009) {
    var Local10007 = document.getElementById('matrixCodeRain');
    if (Local10007) Local10007.innerHTML = '';
  } else if (typeof CreateMatrixRain === 'function') {
    var ReadResultVal = document.getElementById('matrixCodeRain');
    if (ReadResultVal && !ReadResultVal.firstChild) CreateMatrixRain();
  }
};
window.SwitchPageXX = function () {
  var Local10006 = localStorage.getItem('cp-fx-off') === '1';
  localStorage.setItem('cp-fx-off', Local10006 ? '0' : '1');
  window.ApplyPageXX();
};
(function () {
  if (localStorage.getItem('cp-fx-off') === '1') {
    document.documentElement.classList.add('fx-off-preload');
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('fx-off');
    });
  }
})();
function CreateMatrixRain() {
  if (document.body && document.body.classList.contains('fx-off')) return;
  const MatrixEl = document.getElementById('matrixCodeRain');
  if (!MatrixEl) return;
  const MatrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ$%#@!?<>+=ABCDEF';
  const Palette = ['#00f0ff', '#ff2bd6', '#a347ff', '#00ff9d'];
  const ColCount = Math.floor(window.innerWidth / 20);
  for (let IdxVal = 0; IdxVal < ColCount; IdxVal++) {
    const Col10005 = document.createElement('div');
    Col10005.className = 'matrix-column';
    Col10005.style.left = IdxVal * 20 + 'px';
    Col10005.style.animationDelay = -Math.random() * 15 + 's';
    Col10005.style.animationDuration = Math.random() * 14 + 8 + 's';
    Col10005.style.fontSize = Math.random() * 4 + 12 + 'px';
    Col10005.style.opacity = (Math.random() * 0.7 + 0.3).toFixed(2);
    let Text = '';
    const CharCount = Math.floor(Math.random() * 30 + 18);
    for (let Idx2 = 0; Idx2 < CharCount; Idx2++) {
      const Char = MatrixChars[Math.floor(Math.random() * MatrixChars.length)];
      const Highlight = Math.random() > 0.85;
      const Color = Highlight ? Palette[Math.floor(Math.random() * Palette.length)] : '';
      Text += Color ? '<span style="color:' + Color + ';text-shadow:0 0 8px ' + Color + ';">' + Char + '</span><br>' : '<span>' + Char + '</span><br>';
    }
    Col10005.innerHTML = Text;
    MatrixEl.appendChild(Col10005);
  }
  setInterval(function () {
    const Columns = MatrixEl.querySelectorAll('.matrix-column');
    Columns.forEach(function (Col) {
      if (Math.random() > 0.94) {
        const Chars = Col.querySelectorAll('span');
        if (Chars.length > 0) {
          const Target = Chars[Math.floor(Math.random() * Chars.length)];
          const Local10004 = Target.style.color;
          Target.style.color = '#ffffff';
          Target.style.textShadow = '0 0 10px #ffffff, 0 0 18px #00f0ff';
          setTimeout(function () {
            Target.style.color = Local10004;
            Target.style.textShadow = '';
          }, 200);
        }
      }
    });
  }, 110);
}
function IsValidUuidStr(UuidId) {
  const UuidIdRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return UuidIdRegex.test(UuidId);
}
function AppendTerminalLine(Content, Type = 'output') {
  const TerminalBody = document.getElementById('terminalBody');
  const Row = document.createElement('div');
  Row.className = 'terminal-line';
  const Output = document.createElement('span');
  Output.className = 'terminal-' + Type;
  Output.textContent = Content;
  Row.appendChild(Output);
  TerminalBody.appendChild(Row);
  TerminalBody.scrollTop = TerminalBody.scrollHeight;
}
function HandleUuidInput() {
  const Input10003 = document.getElementById('uuidInput');
  const InputVal = Input10003.value.trim();
  const CustomPath = '${CustomPath}';
  if (InputVal) {
    const Local = {
      zh: {
        connecting: '正在连接...',
        invading: '正在登录...',
        success: '登录成功！',
        error: '错误: 无效的UUID格式',
        reenter: '请重新输入有效的UUID'
      },
      fa: {
        connecting: 'در حال اتصال...',
        invading: 'در حال ورود...',
        success: 'ورود موفق!',
        error: 'خطا: فرمت UUID نامعتبر',
        reenter: 'لطفا UUID معتبر را دوباره وارد کنید'
      },
      en: {
        connecting: 'Connecting...',
        invading: 'Logging in...',
        success: 'Login successful!',
        error: 'Error: invalid UUID format',
        reenter: 'Please enter a valid UUID again'
      }
    };
    const SavedLang = localStorage.getItem('preferredLanguage') || '';
    const BrowserLang = navigator.language || navigator.userLanguage || '';
    let LangCode = 'zh';
    if (SavedLang.indexOf('fa') === 0 || BrowserLang.includes('fa')) {
      LangCode = 'fa';
    } else if (SavedLang.indexOf('en') === 0 || BrowserLang.indexOf('en') === 0) {
      LangCode = 'en';
    } else {
      LangCode = 'zh';
    }
    const I18n = Local[LangCode] || Local['zh'];
    if (CustomPath) {
      const CleanInput = InputVal.startsWith('/') ? InputVal : '/' + InputVal;
      AppendTerminalLine(I18n.connecting, 'output');
      setTimeout(() => {
        AppendTerminalLine(I18n.success, 'success');
        setTimeout(() => {
          window.location.href = CleanInput;
        }, 1000);
      }, 500);
    } else {
      if (IsValidUuidStr(InputVal)) {
        AppendTerminalLine(I18n.invading, 'output');
        setTimeout(() => {
          AppendTerminalLine(I18n.success, 'success');
          setTimeout(() => {
            window.location.href = '/' + InputVal;
          }, 1000);
        }, 500);
      } else {
        AppendTerminalLine(I18n.error, 'error');
        AppendTerminalLine(I18n.reenter, 'output');
      }
    }
    Input10003.value = '';
  }
}
function SwitchLang(Lang) {
  localStorage.setItem('preferredLanguage', Lang);
  // 设置Cookie（有效期1年）
  const Expiry10002 = new Date();
  Expiry10002.setFullYear(Expiry10002.getFullYear() + 1);
  document.cookie = 'preferredLanguage=' + Lang + '; path=/; expires=' + Expiry10002.toUTCString() + '; SameSite=Lax';
  // 刷新页面，不使用URL参数
  window.location.reload();
}

// 页面加载时检查 localStorage 和 Cookie，并清理URL参数
window.addEventListener('DOMContentLoaded', function () {
  function GetCookie(Name) {
    const Val = '; ' + document.cookie;
    const Parts = Val.split('; ' + Name + '=');
    if (Parts.length === 2) return Parts.pop().split(';').shift();
    return null;
  }
  const SavedLang = localStorage.getItem('preferredLanguage') || GetCookie('preferredLanguage');
  const UrlParams = new URLSearchParams(window.location.search);
  const UrlLang = UrlParams.get('lang');

  // 如果URL中有语言参数，移除它并设置Cookie
  if (UrlLang) {
    const CurUrl = new URL(window.location.href);
    CurUrl.searchParams.delete('lang');
    const NewUrl = CurUrl.toString();

    // 设置Cookie
    const Expiry10001 = new Date();
    Expiry10001.setFullYear(Expiry10001.getFullYear() + 1);
    document.cookie = 'preferredLanguage=' + UrlLang + '; path=/; expires=' + Expiry10001.toUTCString() + '; SameSite=Lax';
    localStorage.setItem('preferredLanguage', UrlLang);

    // 使用history API移除URL参数，不刷新页面
    window.history.replaceState({}, '', NewUrl);
  } else if (SavedLang) {
    // 如果localStorage中有但Cookie中没有，同步到Cookie
    const Expiry = new Date();
    Expiry.setFullYear(Expiry.getFullYear() + 1);
    document.cookie = 'preferredLanguage=' + SavedLang + '; path=/; expires=' + Expiry.toUTCString() + '; SameSite=Lax';
  }
});
document.addEventListener('DOMContentLoaded', function () {
  try {
    CreateMatrixRain();
  } catch (EventVal10000) {}
  const Input = document.getElementById('uuidInput');
  if (Input) {
    Input.focus();
    Input.addEventListener('keypress', function (EventVal) {
      if (EventVal.key === 'Enter') {
        HandleUuidInput();
      }
    });
  }
});
</script>
    </body>
    </html>`;
          return new Response(TerminalHtml, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8'
            }
          });
        }
        if (CustomPath && CustomPath.trim()) {
          const CleanCustomPath = CustomPath.trim().startsWith('/') ? CustomPath.trim() : '/' + CustomPath.trim();
          const NormalizeCustomPath = CleanCustomPath.endsWith('/') && CleanCustomPath.length > 1 ? CleanCustomPath.slice(0, -1) : CleanCustomPath;
          const NormalizePath = Url698.pathname.endsWith('/') && Url698.pathname.length > 1 ? Url698.pathname.slice(0, -1) : Url698.pathname;
          if (NormalizePath === NormalizeCustomPath) {
            return await HandleSubPage(Request735, AuthToken);
          }
          if (NormalizePath === NormalizeCustomPath + '/sub') {
            return await HandleSubRequest(Request735, AuthToken, Url698);
          }
          if (Url698.pathname.length > 1 && Url698.pathname !== '/') {
            const Uuid658 = Url698.pathname.replace(/\/$/, '').replace('/sub', '').substring(1);
            if (IsValidUuid(Uuid658)) {
              return new Response(JSON.stringify({
                error: '访问被拒绝',
                message: '当前 Worker 已启用自定义路径模式，UUID 访问已禁用'
              }), {
                status: 403,
                headers: {
                  'Content-Type': 'application/json'
                }
              });
            }
          }
        } else {
          if (Url698.pathname.length > 1 && Url698.pathname !== '/' && !Url698.pathname.includes('/sub')) {
            const Uuid657 = Url698.pathname.replace(/\/$/, '').substring(1);
            if (IsValidUuid(Uuid657)) {
              // UUID is case-insensitive: lowercase before comparing with the auth token
              if (Uuid657.toLowerCase() === AuthToken) {
                return await HandleSubPage(Request735, Uuid657);
              } else {
                return new Response(JSON.stringify({
                  error: 'UUID验证失败：请确认环境变量 U（或 UUID）已正确设置，且访问路径中的 UUID 与之一致（不区分大小写）'
                }), {
                  status: 403,
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              }
            }
          }
          if (Url698.pathname.includes('/sub')) {
            const PathParts = Url698.pathname.split('/');
            if (PathParts.length === 2 && PathParts[1] === 'sub') {
              const Uuid656 = PathParts[0].substring(1);
              if (IsValidUuid(Uuid656)) {
                if (Uuid656.toLowerCase() === AuthToken) {
                  return await HandleSubRequest(Request735, Uuid656, Url698);
                } else {
                  return new Response(JSON.stringify({
                    error: 'UUID验证失败：请确认环境变量 U（或 UUID）已正确设置（不区分大小写）'
                  }), {
                    status: 403,
                    headers: {
                      'Content-Type': 'application/json'
                    }
                  });
                }
              }
            }
          }
        }
        if (Url698.pathname.toLowerCase().includes(`/${ValPath}`)) {
          return await HandleSubRequest(Request735, AuthToken);
        }
      }
      return new Response(JSON.stringify({
        error: 'Not Found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (Err655) {
      return new Response(Err655.toString(), {
        status: 500
      });
    }
  }
};


// ============================================================
// internal format converter - no external service dependency
// ============================================================

// quote for YAML (avoid IPv6 brackets and commas being parsed as arrays)
function HandleLocal622(XVal621) {
  if (XVal621 == null) return '""';
  const Text620 = String(XVal621);
  return '"' + Text620.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}

// URL.hostname keeps IPv6 brackets; writing them raw into YAML is treated as an array
function NormalizeHostname(Hostname619) {
  if (!Hostname619) return Hostname619;
  const HeaderVal618 = String(Hostname619);
  if (HeaderVal618.startsWith('[') && HeaderVal618.endsWith(']')) return HeaderVal618.slice(1, -1);
  return HeaderVal618;
}

// policy group list: group + all nodes (avoid groups with only the selector and no concrete nodes)
function PolicyGroupYaml(Names617, Local616 = {}) {
  const {
    directFirst: DirectXX615 = false,
    extraGroups: Val2614 = []
  } = Local616;
  const NodeLines = Names617.length ? Names617.map(CountVal613 => `      - ${HandleLocal622(CountVal613)}`).join('\n') : '      - DIRECT';
  const Lines612 = [];
  if (DirectXX615) {
    Lines612.push('      - "🎯 全球直连"', '      - "🚀 节点选择"');
  } else {
    Lines612.push('      - "🚀 节点选择"', '      - "🎯 全球直连"');
  }
  for (const Local611 of Val2614) Lines612.push(`      - ${HandleLocal622(Local611)}`);
  Lines612.push(NodeLines);
  return Lines612.join('\n');
}

// Quanx client policy groups: group + all nodes
function PolicyGroupList(Names610, Local609 = {}) {
  const {
    directFirst: DirectXX = false,
    extraGroups: Val2608 = [],
    compact: Local607 = false
  } = Local609;
  const Local606 = Local607 ? ',' : ', ';
  const Items605 = Names610.length ? Names610.join(Local606) : 'DIRECT';
  const Parts604 = [];
  if (DirectXX) Parts604.push('🎯 全球直连', '🚀 节点选择');else Parts604.push('🚀 节点选择', '🎯 全球直连');
  Parts604.push(...Val2608);
  if (Names610.length) Parts604.push(Items605);
  return Parts604.join(Local606);
}

// parse an arbitrary share link into a generic node object
function ParseShareLink(Link603) {
  try {
    if (Link603.startsWith("vless://")) {
      const Url602 = new URL(Link603);
      const ParamVal601 = new URLSearchParams(Url602.search);
      return {
        proto: "vless",
        name: decodeURIComponent(Url602.hash.substring(1)) || Url602.hostname + ':' + Url602.port,
        uuid: Url602.username,
        server: NormalizeHostname(Url602.hostname),
        port: parseInt(Url602.port) || 443,
        tls: ParamVal601.get('security') === 'tls' || ParamVal601.get('security') === "reality",
        network: ParamVal601.get('type') || 'ws',
        path: ParamVal601.get('path') || '/?ed=2048',
        host: NormalizeHostname(ParamVal601.get('host') || Url602.hostname),
        sni: NormalizeHostname(ParamVal601.get('sni') || ParamVal601.get('host') || Url602.hostname),
        alpn: (ParamVal601.get('alpn') || '').split(',').map(Text600 => Text600.trim()).filter(Boolean),
        fp: ParamVal601.get('fp') || 'chrome',
        flow: ParamVal601.get('flow') || '',
        encryption: ParamVal601.get('encryption') || 'none',
        mode: ParamVal601.get('mode') || '',
        ech: ParamVal601.get('ech') || ''
      };
    }
    if (Link603.startsWith("trojan://")) {
      const Url599 = new URL(Link603);
      const ParamVal = new URLSearchParams(Url599.search);
      return {
        proto: "trojan",
        name: decodeURIComponent(Url599.hash.substring(1)) || Url599.hostname + ':' + Url599.port,
        password: decodeURIComponent(Url599.username),
        server: NormalizeHostname(Url599.hostname),
        port: parseInt(Url599.port) || 443,
        tls: true,
        network: ParamVal.get('type') || 'ws',
        path: ParamVal.get('path') || '/?ed=2048',
        host: NormalizeHostname(ParamVal.get('host') || Url599.hostname),
        sni: NormalizeHostname(ParamVal.get('sni') || ParamVal.get('host') || Url599.hostname),
        alpn: (ParamVal.get('alpn') || '').split(',').map(Text598 => Text598.trim()).filter(Boolean),
        fp: ParamVal.get('fp') || 'chrome',
        ech: ParamVal.get('ech') || ''
      };
    }
  } catch (EventVal597) {}
  return null;
}

// single node to block-style YAML (avoid flow-style parse errors)
function BuildNodeYaml(CountVal596) {
  const Lines595 = [];
  const Local594 = NormalizeHostname(CountVal596.server);
  const Host593 = NormalizeHostname(CountVal596.host) || Local594;
  const ServiceNameXX592 = NormalizeHostname(CountVal596.sni) || Host593;
  Lines595.push(`  - name: ${HandleLocal622(CountVal596.name)}`);
  Lines595.push(`    type: ${CountVal596.proto}`);
  Lines595.push(`    server: ${HandleLocal622(Local594)}`);
  Lines595.push(`    port: ${CountVal596.port}`);
  if (CountVal596.proto === "vless") {
    Lines595.push(`    uuid: ${CountVal596.uuid}`);
    Lines595.push(`    udp: true`);
    Lines595.push(`    tls: ${CountVal596.tls ? 'true' : 'false'}`);
    if (CountVal596.flow) Lines595.push(`    flow: ${HandleLocal622(CountVal596.flow)}`);
    Lines595.push(`    client-fingerprint: ${HandleLocal622(CountVal596.fp || 'chrome')}`);
  } else if (CountVal596.proto === "trojan") {
    Lines595.push(`    password: ${HandleLocal622(CountVal596.password)}`);
    Lines595.push(`    udp: true`);
    Lines595.push(`    client-fingerprint: ${HandleLocal622(CountVal596.fp || 'chrome')}`);
  }
  if (CountVal596.tls) {
    Lines595.push(`    servername: ${HandleLocal622(ServiceNameXX592)}`);
    if (CountVal596.alpn && CountVal596.alpn.length) {
      Lines595.push(`    alpn: [${CountVal596.alpn.map(AVal591 => HandleLocal622(AVal591)).join(', ')}]`);
    }
    Lines595.push(`    skip-cert-verify: false`);
  }
  if (CountVal596.network === 'ws' || CountVal596.network === 'xhttp') {
    Lines595.push(`    network: ws`);
    Lines595.push(`    ws-opts:`);
    Lines595.push(`      path: ${HandleLocal622(CountVal596.path)}`);
    Lines595.push(`      headers:`);
    Lines595.push(`        Host: ${HandleLocal622(Host593)}`);
  } else if (CountVal596.network === 'grpc') {
    Lines595.push(`    network: grpc`);
    Lines595.push(`    grpc-opts:`);
    Lines595.push(`      grpc-service-name: ${HandleLocal622(CountVal596.path)}`);
  }
  if (CountVal596.ech) {
    const EchDomain590 = CustomEchDomain || 'cloudflare-ech.com';
    Lines595.push(`    ech-opts:`);
    Lines595.push(`      enable: true`);
    Lines595.push(`      query-server-name: ${HandleLocal622(EchDomain590)}`);
  }
  return Lines595.join('\n');
}

// generate YAML internally (full rule set, remote rule-providers)
function GenQuanxConf589(Links588, Local587 = {}) {
  const Nodes586 = Links588.map(ParseShareLink).filter(CountVal585 => CountVal585 && (CountVal585.proto === "vless" || CountVal585.proto === "trojan"));
  const Names584 = Nodes586.map(CountVal583 => CountVal583.name);
  const DnsVal582 = CustomDns || 'https://223.5.5.5/dns-query';
  const Header581 = ['mixed-port: 7890', 'allow-lan: true', 'mode: rule', 'log-level: info', 'ipv6: true', 'external-controller: 127.0.0.1:9090', 'unified-delay: true', 'tcp-concurrent: true', 'geodata-mode: true', 'geo-auto-update: true', 'geo-update-interval: 24', 'geox-url:', '  geoip: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat"', '  geosite: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat"', '  mmdb: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb"', '  asn: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"', 'sniffer:', '  enable: true', '  force-dns-mapping: true', '  parse-pure-ip: true', '  sniff:', '    HTTP:', '      ports: [80, 8080-8880]', '      override-destination: true', '    TLS:', '      ports: [443, 8443]', '    QUIC:', '      ports: [443, 8443]', 'dns:', '  enable: true', '  listen: 0.0.0.0:1053', '  ipv6: true', '  enhanced-mode: fake-ip', '  fake-ip-range: 198.18.0.1/16', '  fake-ip-filter:', '    - "*.lan"', '    - "+.local"', '    - "+.market.xiaomi.com"', '    - "+.msftconnecttest.com"', '    - "+.msftncsi.com"', '    - "localhost.ptlogin2.qq.com"', '    - "+.srv.nintendo.net"', '    - "+.stun.playstation.net"', '    - "+.xboxlive.com"', '  default-nameserver:', '    - 223.5.5.5', '    - 119.29.29.29', '  nameserver:', `    - ${DnsVal582}`, '    - https://119.29.29.29/dns-query', '  fallback:', '    - https://1.1.1.1/dns-query', '    - https://8.8.8.8/dns-query', '  fallback-filter:', '    geoip: true', '    geoip-code: CN', '    ipcidr:', '      - 240.0.0.0/4', ''];
  const Val2580 = ['proxies:'];
  for (const CountVal579 of Nodes586) Val2580.push(BuildNodeYaml(CountVal579));
  const NodesOnly = Names584.length ? Names584.map(CountVal578 => `      - ${HandleLocal622(CountVal578)}`).join('\n') : '      - DIRECT';
  const Val2577 = ["proxy-groups:", '  - name: "🚀 节点选择"', '    type: select', '    proxies:', '      - "🎯 全球直连"', NodesOnly, '  - name: "🌍 国外媒体"', '    type: select', '    proxies:', PolicyGroupYaml(Names584), '  - name: "📺 哔哩哔哩"', '    type: select', '    proxies:', PolicyGroupYaml(Names584, {
    directFirst: true
  }), '  - name: "📹 油管视频"', '    type: select', '    proxies:', PolicyGroupYaml(Names584, {
    extraGroups: ['🌍 国外媒体']
  }), '  - name: "🎬 奈飞视频"', '    type: select', '    proxies:', PolicyGroupYaml(Names584, {
    extraGroups: ['🌍 国外媒体']
  }), '  - name: "📲 电报信息"', '    type: select', '    proxies:', PolicyGroupYaml(Names584), '  - name: "🌐 谷歌服务"', '    type: select', '    proxies:', PolicyGroupYaml(Names584), '  - name: "🤖 OpenAI"', '    type: select', '    proxies:', PolicyGroupYaml(Names584), '  - name: "Ⓜ️ 微软服务"', '    type: select', '    proxies:', PolicyGroupYaml(Names584, {
    directFirst: true
  }), '  - name: "🍎 苹果服务"', '    type: select', '    proxies:', PolicyGroupYaml(Names584, {
    directFirst: true
  }), '  - name: "🎯 全球直连"', '    type: select', '    proxies:', '      - DIRECT', '  - name: "🛑 全球拦截"', '    type: select', '    proxies:', '      - REJECT', '      - DIRECT', '  - name: "🍃 应用净化"', '    type: select', '    proxies:', '      - REJECT', '      - DIRECT', '  - name: "🐟 漏网之鱼"', '    type: select', '    proxies:', PolicyGroupYaml(Names584), ''];

  // rule source - CDN: jsDelivr
  const Base576 = "https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release";
  const Provider = (Name575, Local574) => [`  ${Name575}:`, `    type: http`, `    behavior: ${Local574}`, `    url: "${Base576}/${Name575}.txt"`, `    path: ./rulesets/loyalsoldier/${Name575}.txt`, `    interval: 86400`].join('\n');
  const RuleProviders = ['rule-providers:', Provider('reject', 'domain'), Provider('icloud', 'domain'), Provider('apple', 'domain'), Provider('google', 'domain'), Provider("proxy", 'domain'), Provider('direct', 'domain'), Provider('private', 'domain'), Provider('gfw', 'domain'), Provider('greatfire', 'domain'), Provider('tld-not-cn', 'domain'), Provider('telegramcidr', 'ipcidr'), Provider('cncidr', 'ipcidr'), Provider('lancidr', 'ipcidr'), Provider('applications', 'classical'), ''];
  const Rules = ['rules:', '  - DOMAIN-SUFFIX,acl4.ssr,🎯 全球直连', '  - DOMAIN-SUFFIX,local,🎯 全球直连', "  - DOMAIN,clash.razord.top,🎯 全球直连", '  - DOMAIN,yacd.haishan.me,🎯 全球直连', '  - DOMAIN,yacd.metacubex.one,🎯 全球直连', '  - DOMAIN,d.metacubex.one,🎯 全球直连', '  - DOMAIN-SUFFIX,googleapis.cn,🌐 谷歌服务', '  - DOMAIN-SUFFIX,gstatic.com,🌐 谷歌服务', '  - DOMAIN-SUFFIX,xn--ngstr-lra8j.com,🌐 谷歌服务', '  - DOMAIN-SUFFIX,googlevideo.com,📹 油管视频', '  - DOMAIN-SUFFIX,googleusercontent.com,🌐 谷歌服务', '  - DOMAIN-KEYWORD,youtube,📹 油管视频', '  - DOMAIN-SUFFIX,youtube.com,📹 油管视频', '  - DOMAIN-SUFFIX,youtu.be,📹 油管视频', '  - DOMAIN-KEYWORD,netflix,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflxext.com,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflxso.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflxvideo.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflximg.com,🎬 奈飞视频', '  - DOMAIN-SUFFIX,nflximg.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,netflix.com,🎬 奈飞视频', '  - DOMAIN-SUFFIX,netflix.net,🎬 奈飞视频', '  - DOMAIN-SUFFIX,bilibili.com,📺 哔哩哔哩', '  - DOMAIN-SUFFIX,bilivideo.com,📺 哔哩哔哩', '  - DOMAIN-SUFFIX,hdslb.com,📺 哔哩哔哩', '  - DOMAIN-KEYWORD,openai,🤖 OpenAI', '  - DOMAIN-KEYWORD,chatgpt,🤖 OpenAI', '  - DOMAIN-SUFFIX,openai.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,chatgpt.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,oaistatic.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,oaiusercontent.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,anthropic.com,🤖 OpenAI', '  - DOMAIN-SUFFIX,claude.ai,🤖 OpenAI', '  - DOMAIN-SUFFIX,perplexity.ai,🤖 OpenAI', '  - DOMAIN-SUFFIX,gemini.google.com,🤖 OpenAI', '  - RULE-SET,applications,🎯 全球直连', '  - RULE-SET,private,🎯 全球直连', '  - RULE-SET,reject,🛑 全球拦截', '  - RULE-SET,icloud,🍎 苹果服务', '  - RULE-SET,apple,🍎 苹果服务', '  - RULE-SET,google,🌐 谷歌服务', "  - RULE-SET,proxy,🚀 节点选择", '  - RULE-SET,gfw,🚀 节点选择', '  - RULE-SET,greatfire,🚀 节点选择', '  - RULE-SET,tld-not-cn,🚀 节点选择', '  - RULE-SET,direct,🎯 全球直连', '  - RULE-SET,lancidr,🎯 全球直连,no-resolve', '  - RULE-SET,cncidr,🎯 全球直连,no-resolve', '  - RULE-SET,telegramcidr,📲 电报信息,no-resolve', '  - GEOIP,LAN,🎯 全球直连,no-resolve', '  - GEOIP,CN,🎯 全球直连,no-resolve', '  - MATCH,🐟 漏网之鱼'];
  return [Header581.join('\n'), Val2580.join('\n'), '', Val2577.join('\n'), RuleProviders.join('\n'), Rules.join('\n'), ''].join('\n');
}

// generate JSON client config internally (full rule set: remote mirror)
function GenSingboxJson(Links573) {
  const Nodes572 = Links573.map(ParseShareLink).filter(CountVal571 => CountVal571 && (CountVal571.proto === "vless" || CountVal571.proto === "trojan"));
  const DnsVal570 = CustomDns || 'https://223.5.5.5/dns-query';
  const Outbounds = Nodes572.map(CountVal569 => CountVal569.name);
  function HandleNodeValOutbound(CountVal568) {
    const Output567 = {
      type: CountVal568.proto,
      tag: CountVal568.name,
      server: NormalizeHostname(CountVal568.server),
      server_port: CountVal568.port
    };
    if (CountVal568.proto === "vless") {
      Output567.uuid = CountVal568.uuid;
      if (CountVal568.flow) Output567.flow = CountVal568.flow;
    } else {
      Output567.password = CountVal568.password;
    }
    if (CountVal568.tls) {
      Output567.tls = {
        enabled: true,
        server_name: CountVal568.sni,
        insecure: false,
        utls: {
          enabled: true,
          fingerprint: CountVal568.fp || 'chrome'
        }
      };
      if (CountVal568.alpn && CountVal568.alpn.length) Output567.tls.alpn = CountVal568.alpn;
      if (CountVal568.ech) {
        Output567.tls.ech = {
          enabled: true,
          pq_signature_schemes_enabled: false,
          dynamic_record_sizing_disabled: false
        };
      }
    }
    if (CountVal568.network === 'ws' || CountVal568.network === 'xhttp') {
      Output567.transport = {
        type: 'ws',
        path: CountVal568.path,
        headers: {
          Host: CountVal568.host
        },
        max_early_data: 2048,
        early_data_header_name: 'Sec-WebSocket-Protocol'
      };
    } else if (CountVal568.network === 'grpc') {
      Output567.transport = {
        type: 'grpc',
        service_name: CountVal568.path
      };
    }
    return Output567;
  }

  // remote SRS files (CDN: jsDelivr mirror)
  const GeoBase = 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite';
  const GeoIpBase = 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip';
  const Rule566 = Local565 => ({
    tag: `geosite-${Local565}`,
    type: 'remote',
    format: 'binary',
    url: `${GeoBase}/${Local565}.srs`,
    download_detour: 'direct'
  });
  const AddrRule = Local564 => ({
    tag: `geoip-${Local564}`,
    type: 'remote',
    format: 'binary',
    url: `${GeoIpBase}/${Local564}.srs`,
    download_detour: 'direct'
  });
  const Config = {
    log: {
      level: 'info',
      timestamp: true
    },
    dns: {
      servers: [{
        tag: 'remote',
        address: DnsVal570,
        detour: 'select'
      }, {
        tag: 'local',
        address: '223.5.5.5',
        detour: 'direct'
      }, {
        tag: 'fakeip',
        address: 'fakeip'
      }, {
        tag: 'block',
        address: 'rcode://success'
      }],
      rules: [{
        outbound: 'any',
        server: 'local'
      }, {
        rule_set: 'geosite-category-ads-all',
        server: 'block'
      }, {
        rule_set: 'geosite-cn',
        server: 'local'
      }, {
        query_type: ['A', 'AAAA'],
        server: 'fakeip'
      }],
      fakeip: {
        enabled: true,
        inet4_range: '198.18.0.0/15',
        inet6_range: 'fc00::/18'
      },
      independent_cache: true,
      strategy: 'ipv4_only'
    },
    inbounds: [{
      type: 'mixed',
      tag: 'mixed-in',
      listen: '127.0.0.1',
      listen_port: 2080,
      sniff: true,
      sniff_override_destination: true
    }, {
      type: 'tun',
      tag: 'tun-in',
      interface_name: "sing-box",
      address: ['172.19.0.1/30', 'fdfe:dcba:9876::1/126'],
      mtu: 9000,
      auto_route: true,
      strict_route: true,
      stack: 'mixed',
      sniff: true,
      sniff_override_destination: true
    }],
    outbounds: [{
      type: 'selector',
      tag: 'select',
      outbounds: ['direct', ...Outbounds],
      default: Outbounds[0] || 'direct'
    }, {
      type: 'selector',
      tag: '🌍 国外媒体',
      outbounds: ['select', 'direct', ...Outbounds]
    }, {
      type: 'selector',
      tag: '📲 电报信息',
      outbounds: ['select', 'direct', ...Outbounds]
    }, {
      type: 'selector',
      tag: '🌐 谷歌服务',
      outbounds: ['select', 'direct', ...Outbounds]
    }, {
      type: 'selector',
      tag: '🤖 OpenAI',
      outbounds: ['select', 'direct', ...Outbounds]
    }, {
      type: 'selector',
      tag: 'Ⓜ️ 微软服务',
      outbounds: ['direct', 'select', ...Outbounds]
    }, {
      type: 'selector',
      tag: '🍎 苹果服务',
      outbounds: ['direct', 'select', ...Outbounds]
    }, {
      type: 'selector',
      tag: '📺 哔哩哔哩',
      outbounds: ['direct', 'select', ...Outbounds]
    }, {
      type: 'selector',
      tag: '📹 油管视频',
      outbounds: ['select', '🌍 国外媒体', 'direct', ...Outbounds]
    }, {
      type: 'selector',
      tag: '🎬 奈飞视频',
      outbounds: ['select', '🌍 国外媒体', 'direct', ...Outbounds]
    }, {
      type: 'selector',
      tag: '🎯 全球直连',
      outbounds: ['direct']
    }, {
      type: 'selector',
      tag: '🐟 漏网之鱼',
      outbounds: ['select', 'direct', ...Outbounds]
    }, ...Nodes572.map(HandleNodeValOutbound), {
      type: 'direct',
      tag: 'direct'
    }, {
      type: 'block',
      tag: 'block'
    }, {
      type: 'dns',
      tag: 'dns-out'
    }],
    route: {
      rule_set: [Rule566('cn'), Rule566('private'), Rule566('apple'), Rule566('apple-cn'), Rule566('microsoft'), Rule566('microsoft@cn'), Rule566('google'), Rule566('telegram'), Rule566('openai'), Rule566('anthropic'), Rule566('youtube'), Rule566('netflix'), Rule566('disney'), Rule566('spotify'), Rule566('tiktok'), Rule566('twitter'), Rule566('facebook'), Rule566('github'), Rule566('geolocation-!cn'), Rule566('category-ads-all'), AddrRule('cn'), AddrRule('private'), AddrRule('telegram')],
      rules: [{
        protocol: 'dns',
        outbound: 'dns-out'
      }, {
        ip_is_private: true,
        outbound: 'direct'
      }, {
        rule_set: 'geosite-category-ads-all',
        outbound: 'block'
      }, {
        rule_set: 'geosite-private',
        outbound: 'direct'
      }, {
        rule_set: 'geosite-apple-cn',
        outbound: 'direct'
      }, {
        rule_set: 'geosite-microsoft@cn',
        outbound: 'direct'
      }, {
        rule_set: 'geosite-apple',
        outbound: '🍎 苹果服务'
      }, {
        rule_set: 'geosite-microsoft',
        outbound: 'Ⓜ️ 微软服务'
      }, {
        rule_set: 'geosite-openai',
        outbound: '🤖 OpenAI'
      }, {
        rule_set: 'geosite-anthropic',
        outbound: '🤖 OpenAI'
      }, {
        rule_set: 'geosite-telegram',
        outbound: '📲 电报信息'
      }, {
        rule_set: 'geoip-telegram',
        outbound: '📲 电报信息'
      }, {
        rule_set: 'geosite-google',
        outbound: '🌐 谷歌服务'
      }, {
        rule_set: 'geosite-youtube',
        outbound: '🌍 国外媒体'
      }, {
        rule_set: 'geosite-netflix',
        outbound: '🌍 国外媒体'
      }, {
        rule_set: 'geosite-disney',
        outbound: '🌍 国外媒体'
      }, {
        rule_set: 'geosite-spotify',
        outbound: '🌍 国外媒体'
      }, {
        rule_set: 'geosite-tiktok',
        outbound: '🌍 国外媒体'
      }, {
        rule_set: 'geosite-twitter',
        outbound: '🌍 国外媒体'
      }, {
        rule_set: 'geosite-facebook',
        outbound: '🌍 国外媒体'
      }, {
        rule_set: 'geosite-github',
        outbound: 'select'
      }, {
        rule_set: 'geosite-geolocation-!cn',
        outbound: 'select'
      }, {
        rule_set: 'geosite-cn',
        outbound: 'direct'
      }, {
        rule_set: 'geoip-cn',
        outbound: 'direct'
      }, {
        ip_is_private: true,
        outbound: 'direct'
      }],
      final: '🐟 漏网之鱼',
      auto_detect_interface: true
    },
    experimental: {
      cache_file: {
        enabled: true,
        store_fakeip: true
      },
      clash_api: {
        external_controller: '127.0.0.1:9090'
      }
    }
  };
  return JSON.stringify(Config, null, 2);
}

// rule source (CDN: jsDelivr GitHub mirror)
const Base = "https://fastly.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash";
const RuleX1 = Name563 => `${Base}/${Name563}.list`;

// generate ini client config internally (full rule set)
function GenQuanxConf562(Links561) {
  const Nodes560 = Links561.map(ParseShareLink).filter(CountVal559 => CountVal559 && CountVal559.proto === "trojan");
  const DnsVal558 = CustomDns || '223.5.5.5';
  const Names557 = Nodes560.map(CountVal556 => CountVal556.name);
  const Lines555 = ['[General]', 'loglevel = notify', 'internet-test-url = http://www.apple.com/library/test/success.html', "proxy-test-url = http://www.gstatic.com/generate_204", 'test-timeout = 3', `dns-server = ${DnsVal558.replace(/^https?:\/\//, '').replace(/\/.*$/, '')}, 119.29.29.29, system`, 'encrypted-dns-server = https://223.5.5.5/dns-query, https://1.12.12.12/dns-query', 'ipv6 = true', 'allow-wifi-access = false', 'wifi-access-http-port = 6152', "wifi-access-socks5-port = 6153", "skip-proxy = 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, localhost, *.local, captive.apple.com", 'exclude-simple-hostnames = true', 'show-error-page-for-reject = true', '', "[Proxy]"];
  for (const CountVal554 of Nodes560) {
    const ServiceNameXX = CountVal554.sni;
    Lines555.push(`${CountVal554.name} = ${"trojan"}, ${CountVal554.server}, ${CountVal554.port}, password=${CountVal554.password}, sni=${ServiceNameXX}, ws=true, ws-path=${CountVal554.path}, ws-headers=Host:${CountVal554.host}, skip-cert-verify=false, tfo=true`);
  }
  if (!Nodes560.length) {
    Lines555.push('Direct = direct');
  }
  Lines555.push('');
  Lines555.push("[Proxy Group]");
  const Items553 = Names557.length ? Names557.join(', ') : 'DIRECT';
  Lines555.push(`🚀 节点选择 = select, 🎯 全球直连, ${Items553}`);
  Lines555.push(`🌍 国外媒体 = select, ${PolicyGroupList(Names557)}`);
  Lines555.push(`📺 哔哩哔哩 = select, ${PolicyGroupList(Names557, {
    directFirst: true
  })}`);
  Lines555.push(`📹 油管视频 = select, ${PolicyGroupList(Names557, {
    extraGroups: ['🌍 国外媒体']
  })}`);
  Lines555.push(`🎬 奈飞视频 = select, ${PolicyGroupList(Names557, {
    extraGroups: ['🌍 国外媒体']
  })}`);
  Lines555.push(`📲 电报信息 = select, ${PolicyGroupList(Names557)}`);
  Lines555.push(`🌐 谷歌服务 = select, ${PolicyGroupList(Names557)}`);
  Lines555.push(`🤖 OpenAI = select, ${PolicyGroupList(Names557)}`);
  Lines555.push(`Ⓜ️ 微软服务 = select, ${PolicyGroupList(Names557, {
    directFirst: true
  })}`);
  Lines555.push(`🍎 苹果服务 = select, ${PolicyGroupList(Names557, {
    directFirst: true
  })}`);
  Lines555.push(`🎯 全球直连 = select, DIRECT`);
  Lines555.push(`🛑 全球拦截 = select, REJECT, DIRECT`);
  Lines555.push(`🐟 漏网之鱼 = select, ${PolicyGroupList(Names557)}`);
  Lines555.push('');
  Lines555.push('[Rule]');
  Lines555.push(`RULE-SET,${RuleX1('LocalAreaNetwork')},🎯 全球直连`);
  Lines555.push(`RULE-SET,${RuleX1('UnBan')},🎯 全球直连`);
  Lines555.push(`RULE-SET,${RuleX1('BanAD')},🛑 全球拦截`);
  Lines555.push(`RULE-SET,${RuleX1('BanProgramAD')},🛑 全球拦截`);
  Lines555.push(`RULE-SET,${RuleX1('GoogleFCM')},🌐 谷歌服务`);
  Lines555.push(`RULE-SET,${RuleX1('GoogleCN')},🎯 全球直连`);
  Lines555.push(`RULE-SET,${RuleX1('SteamCN')},🎯 全球直连`);
  Lines555.push(`RULE-SET,${RuleX1('Microsoft')},Ⓜ️ 微软服务`);
  Lines555.push(`RULE-SET,${RuleX1('Apple')},🍎 苹果服务`);
  Lines555.push(`RULE-SET,${RuleX1('Telegram')},📲 电报信息`);
  Lines555.push(`RULE-SET,${RuleX1('OpenAi')},🤖 OpenAI`);
  Lines555.push(`RULE-SET,${RuleX1('Claude')},🤖 OpenAI`);
  Lines555.push(`RULE-SET,${RuleX1('Copilot')},🤖 OpenAI`);
  Lines555.push(`RULE-SET,${RuleX1('Netflix')},🌍 国外媒体`);
  Lines555.push(`RULE-SET,${RuleX1('YouTube')},🌍 国外媒体`);
  Lines555.push(`RULE-SET,${RuleX1('Disney')},🌍 国外媒体`);
  Lines555.push(`RULE-SET,${RuleX1('Spotify')},🌍 国外媒体`);
  Lines555.push(`RULE-SET,${RuleX1('TikTok')},🌍 国外媒体`);
  Lines555.push(`RULE-SET,${RuleX1('BiliBili')},📺 哔哩哔哩`);
  Lines555.push(`RULE-SET,${RuleX1("ProxyMedia")},🌍 国外媒体`);
  Lines555.push(`RULE-SET,${RuleX1("ProxyGFWlist")},🚀 节点选择`);
  Lines555.push(`RULE-SET,${RuleX1('ChinaDomain')},🎯 全球直连`);
  Lines555.push(`RULE-SET,${RuleX1('ChinaCompanyIp')},🎯 全球直连`);
  Lines555.push(`RULE-SET,${RuleX1('ChinaIp')},🎯 全球直连`);
  Lines555.push('GEOIP,CN,🎯 全球直连');
  Lines555.push('FINAL,🐟 漏网之鱼,dns-failed');
  return Lines555.join('\n');
}

// generate another ini-style client config
function GenQuanxConf552(Links551) {
  const Nodes550 = Links551.map(ParseShareLink).filter(CountVal549 => CountVal549 && (CountVal549.proto === "vless" || CountVal549.proto === "trojan"));
  const Names548 = Nodes550.map(CountVal547 => CountVal547.name);
  const Lines546 = ['[General]', 'ip-mode = dual', `dns-server = ${(CustomDns || '223.5.5.5').replace(/^https?:\/\//, '').replace(/\/.*$/, '')},119.29.29.29,system`, 'doh-server = https://223.5.5.5/dns-query, https://1.12.12.12/dns-query', "allow-udp-proxy = true", 'allow-wifi-access = false', 'sni-sniffing = true', "skip-proxy = 127.0.0.1,192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,localhost,*.local,captive.apple.com", 'bypass-tun = 10.0.0.0/8,100.64.0.0/10,127.0.0.0/8,169.254.0.0/16,172.16.0.0/12,192.0.0.0/24,192.0.2.0/24,192.88.99.0/24,192.168.0.0/16,198.51.100.0/24,203.0.113.0/24,224.0.0.0/4,255.255.255.255/32', '', "[Proxy]"];
  for (const CountVal545 of Nodes550) {
    if (CountVal545.proto === "vless") {
      const Parts544 = [`${CountVal545.server}`, `${CountVal545.port}`, `udp=true`, `username=${CountVal545.uuid}`, `transport=ws`, `path=${CountVal545.path}`, `host=${CountVal545.host}`, `over-tls=${CountVal545.tls ? 'true' : 'false'}`];
      if (CountVal545.tls) {
        Parts544.push(`tls-name=${CountVal545.sni}`);
        if (CountVal545.alpn && CountVal545.alpn.length) Parts544.push(`alpn=${CountVal545.alpn.join(':')}`);
        Parts544.push(`skip-cert-verify=false`);
      }
      Lines546.push(`${CountVal545.name} = ${"vless"},${Parts544.join(',')}`);
    } else {
      const Parts543 = [`${CountVal545.server}`, `${CountVal545.port}`, `password=${CountVal545.password}`, `transport=ws`, `path=${CountVal545.path}`, `host=${CountVal545.host}`, `over-tls=true`, `tls-name=${CountVal545.sni}`];
      if (CountVal545.alpn && CountVal545.alpn.length) Parts543.push(`alpn=${CountVal545.alpn.join(':')}`);
      Parts543.push(`skip-cert-verify=false`);
      Lines546.push(`${CountVal545.name} = ${"trojan"},${Parts543.join(',')}`);
    }
  }
  Lines546.push('');
  Lines546.push("[Proxy Group]");
  const Items542 = Names548.length ? Names548.join(',') : 'DIRECT';
  Lines546.push(`🚀 节点选择 = select,🎯 全球直连,${Items542}`);
  Lines546.push(`🌍 国外媒体 = select,${PolicyGroupList(Names548, {
    compact: true
  })}`);
  Lines546.push(`📺 哔哩哔哩 = select,${PolicyGroupList(Names548, {
    directFirst: true,
    compact: true
  })}`);
  Lines546.push(`📹 油管视频 = select,${PolicyGroupList(Names548, {
    extraGroups: ['🌍 国外媒体'],
    compact: true
  })}`);
  Lines546.push(`🎬 奈飞视频 = select,${PolicyGroupList(Names548, {
    extraGroups: ['🌍 国外媒体'],
    compact: true
  })}`);
  Lines546.push(`📲 电报信息 = select,${PolicyGroupList(Names548, {
    compact: true
  })}`);
  Lines546.push(`🌐 谷歌服务 = select,${PolicyGroupList(Names548, {
    compact: true
  })}`);
  Lines546.push(`🤖 OpenAI = select,${PolicyGroupList(Names548, {
    compact: true
  })}`);
  Lines546.push(`Ⓜ️ 微软服务 = select,${PolicyGroupList(Names548, {
    directFirst: true,
    compact: true
  })}`);
  Lines546.push(`🍎 苹果服务 = select,${PolicyGroupList(Names548, {
    directFirst: true,
    compact: true
  })}`);
  Lines546.push(`🎯 全球直连 = select,DIRECT`);
  Lines546.push(`🛑 全球拦截 = select,REJECT,DIRECT`);
  Lines546.push(`🐟 漏网之鱼 = select,${PolicyGroupList(Names548, {
    compact: true
  })}`);
  Lines546.push('');
  Lines546.push('[Remote Rule]');
  Lines546.push(`${RuleX1('LocalAreaNetwork')}, policy=🎯 全球直连, tag=局域网, enabled=true`);
  Lines546.push(`${RuleX1('BanAD')}, policy=🛑 全球拦截, tag=广告拦截, enabled=true`);
  Lines546.push(`${RuleX1('BanProgramAD')}, policy=🛑 全球拦截, tag=应用广告, enabled=true`);
  Lines546.push(`${RuleX1('GoogleCN')}, policy=🎯 全球直连, tag=GoogleCN, enabled=true`);
  Lines546.push(`${RuleX1('SteamCN')}, policy=🎯 全球直连, tag=SteamCN, enabled=true`);
  Lines546.push(`${RuleX1('Microsoft')}, policy=Ⓜ️ 微软服务, tag=微软, enabled=true`);
  Lines546.push(`${RuleX1('Apple')}, policy=🍎 苹果服务, tag=苹果, enabled=true`);
  Lines546.push(`${RuleX1('Telegram')}, policy=📲 电报信息, tag=电报, enabled=true`);
  Lines546.push(`${RuleX1('OpenAi')}, policy=🤖 OpenAI, tag=OpenAI, enabled=true`);
  Lines546.push(`${RuleX1('Netflix')}, policy=🌍 国外媒体, tag=Netflix, enabled=true`);
  Lines546.push(`${RuleX1('YouTube')}, policy=🌍 国外媒体, tag=YouTube, enabled=true`);
  Lines546.push(`${RuleX1('Disney')}, policy=🌍 国外媒体, tag=Disney, enabled=true`);
  Lines546.push(`${RuleX1('Spotify')}, policy=🌍 国外媒体, tag=Spotify, enabled=true`);
  Lines546.push(`${RuleX1('TikTok')}, policy=🌍 国外媒体, tag=TikTok, enabled=true`);
  Lines546.push(`${RuleX1('BiliBili')}, policy=📺 哔哩哔哩, tag=哔哩哔哩, enabled=true`);
  Lines546.push(`${RuleX1("ProxyMedia")}, policy=🌍 国外媒体, tag=${"代理媒体"}, enabled=true`);
  Lines546.push(`${RuleX1("ProxyGFWlist")}, policy=🚀 节点选择, tag=${"代理列表"}, enabled=true`);
  Lines546.push(`${RuleX1('ChinaDomain')}, policy=🎯 全球直连, tag=中国域名, enabled=true`);
  Lines546.push(`${RuleX1('ChinaIp')}, policy=🎯 全球直连, tag=中国IP, enabled=true`);
  Lines546.push('');
  Lines546.push('[Rule]');
  Lines546.push('GEOIP,CN,🎯 全球直连');
  Lines546.push('FINAL,🐟 漏网之鱼');
  return Lines546.join('\n');
}

// generate Quanx config internally (full remote filter resources)
function GenQuanxConf(Links541) {
  const Nodes = Links541.map(ParseShareLink).filter(CountVal540 => CountVal540 && (CountVal540.proto === "vless" || CountVal540.proto === "trojan"));
  const Names = Nodes.map(CountVal539 => CountVal539.name);
  const QuanxBase = "https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX";
  const Lines538 = ['[general]', 'network_check_url=http://www.gstatic.com/generate_204', 'server_check_url=http://www.gstatic.com/generate_204', 'dns_exclusion_list=*.cmpassport.com, *.jegotrip.com.cn, *.icloud.com, *.icloud.com.cn, *.apple.com, *.weibo.com, *.qq.com', 'running_mode_trigger=filter', '', '[dns]', `server=${(CustomDns || '223.5.5.5').replace(/^https?:\/\//, '').replace(/\/.*$/, '')}`, 'server=119.29.29.29', 'server=https://223.5.5.5/dns-query', 'server=https://1.12.12.12/dns-query', '', '[server_local]'];
  for (const CountVal537 of Nodes) {
    if (CountVal537.proto === "vless") {
      const Parts536 = [`${CountVal537.server}:${CountVal537.port}`, `method=none`, `password=${CountVal537.uuid}`, `obfs=${CountVal537.tls ? 'wss' : 'ws'}`, `obfs-host=${CountVal537.host}`, `obfs-uri=${CountVal537.path}`];
      if (CountVal537.tls) Parts536.push(`tls-verification=true`, `tls13=true`);
      Parts536.push(`tag=${CountVal537.name}`);
      Lines538.push(`${"vless"}=${Parts536.join(', ')}`);
    } else {
      const Parts535 = [`${CountVal537.server}:${CountVal537.port}`, `password=${CountVal537.password}`, `over-tls=true`, `tls-host=${CountVal537.sni}`, `obfs=wss`, `obfs-host=${CountVal537.host}`, `obfs-uri=${CountVal537.path}`, `tls-verification=true`, `tag=${CountVal537.name}`];
      Lines538.push(`${"trojan"}=${Parts535.join(', ')}`);
    }
  }
  Lines538.push('');
  Lines538.push('[policy]');
  const Items534 = Names.length ? Names.join(', ') : 'direct';
  Lines538.push(`static=🚀 节点选择, ${Items534}, direct, img-url=${"https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png"}`);
  Lines538.push(`static=🌍 国外媒体, ${PolicyGroupList(Names)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ForeignMedia.png`);
  Lines538.push(`static=📺 哔哩哔哩, ${PolicyGroupList(Names, {
    directFirst: true
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png`);
  Lines538.push(`static=📹 油管视频, ${PolicyGroupList(Names, {
    extraGroups: ['🌍 国外媒体']
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png`);
  Lines538.push(`static=🎬 奈飞视频, ${PolicyGroupList(Names, {
    extraGroups: ['🌍 国外媒体']
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png`);
  Lines538.push(`static=📲 电报信息, ${PolicyGroupList(Names)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png`);
  Lines538.push(`static=🌐 谷歌服务, ${PolicyGroupList(Names)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google.png`);
  Lines538.push(`static=🤖 OpenAI, ${PolicyGroupList(Names)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png`);
  Lines538.push(`static=Ⓜ️ 微软服务, ${PolicyGroupList(Names, {
    directFirst: true
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Microsoft.png`);
  Lines538.push(`static=🍎 苹果服务, ${PolicyGroupList(Names, {
    directFirst: true
  })}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png`);
  Lines538.push(`static=🎯 全球直连, direct, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png`);
  Lines538.push(`static=🛑 全球拦截, reject, direct, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png`);
  Lines538.push(`static=🐟 漏网之鱼, ${PolicyGroupList(Names)}, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png`);
  Lines538.push('');
  Lines538.push('[filter_remote]');
  Lines538.push(`${QuanxBase}/Lan/Lan.list, tag=局域网, force-policy=🎯 全球直连, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Advertising/Advertising.list, tag=广告拦截, force-policy=🛑 全球拦截, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Microsoft/Microsoft.list, tag=微软, force-policy=Ⓜ️ 微软服务, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Apple/Apple.list, tag=苹果, force-policy=🍎 苹果服务, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Telegram/Telegram.list, tag=电报, force-policy=📲 电报信息, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Google/Google.list, tag=谷歌, force-policy=🌐 谷歌服务, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/OpenAI/OpenAI.list, tag=OpenAI, force-policy=🤖 OpenAI, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Claude/Claude.list, tag=Claude, force-policy=🤖 OpenAI, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/YouTube/YouTube.list, tag=YouTube, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Netflix/Netflix.list, tag=Netflix, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Disney/Disney.list, tag=Disney, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Spotify/Spotify.list, tag=Spotify, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/TikTok/TikTok.list, tag=TikTok, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/BiliBili/BiliBili.list, tag=哔哩哔哩, force-policy=📺 哔哩哔哩, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/Global/Global.list, tag=全球加速, force-policy=🚀 节点选择, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push(`${QuanxBase}/ChinaMax/ChinaMax.list, tag=中国直连, force-policy=🎯 全球直连, update-interval=86400, opt-parser=false, enabled=true`);
  Lines538.push('');
  Lines538.push('[filter_local]');
  Lines538.push('geoip, cn, 🎯 全球直连');
  Lines538.push('final, 🐟 漏网之鱼');
  return Lines538.join('\n');
}


// global variable to hold ECH debug info
let EchDebug = '';
// ==================== ⚡️ preferred-sub generator module（移植自 edgetunnel preferredsubscriptiongenerate） ====================
function ToArray(Content) {
  const XXNextXContent = String(Content || '').replace(/[	"'\r\n]+/g, ',').replace(/,+/g, ',');
  let CleanContent = XXNextXContent;
  if (CleanContent.charAt(0) === ',') CleanContent = CleanContent.slice(1);
  if (CleanContent.charAt(CleanContent.length - 1) === ',') CleanContent = CleanContent.slice(0, CleanContent.length - 1);
  return CleanContent.split(',');
}

function ReplaceAsterisk(Content) {
  if (typeof Content !== 'string' || !Content.includes('*')) return Content;
  const CharSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Content.replace(/\*/g, () => {
    let s = '';
    for (let i = 0; i < Math.floor(Math.random() * 14) + 3; i++) s += CharSet[Math.floor(Math.random() * CharSet.length)];
    return s;
  });
}

function DetectIsp(Request) {
  const cf = Request?.cf;
  const ASNIspMap = {
    '4134': 'ct', '4809': 'ct', '4811': 'ct', '4812': 'ct', '4815': 'ct',
    '4837': 'cu', '4814': 'cu', '9929': 'cu', '17623': 'cu', '17816': 'cu',
    '9808': 'cmcc', '24400': 'cmcc', '56040': 'cmcc', '56041': 'cmcc', '56044': 'cmcc'
  };
  const IspPatterns = [
    { code: 'ct', pattern: /chinanet|chinatelecom|china telecom|cn2|shtel/ },
    { code: 'cmcc', pattern: /cmi|cmnet|chinamobile|china mobile|cmcc|mobile communications/ },
    { code: 'cu', pattern: /china169|china unicom|chinaunicom|cucc|cncgroup|cuii|netcom/ }
  ];
  if (String(cf?.country || '').toLowerCase() !== 'cn') return 'cf';
  const OrgName = String(cf?.asOrganization || '').toLowerCase();
  const MatchedIsp = IspPatterns.find(({ pattern }) => pattern.test(OrgName))?.code;
  return MatchedIsp || ASNIspMap[String(cf?.asn || '')] || 'cf';
}

async function GenRandomPrefIp(Request, Count = 16, FixedPort = -1) {
  const IspKey = DetectIsp(Request);
  const IspNames = { cmcc: 'CF移动优选', cu: 'CF联通优选', ct: 'CF电信优选', cf: 'CF官方优选' };
  const PrefCidrUrl = IspKey === 'cf'
    ? 'https://raw.githubusercontent.com/cmliu/cmliu/main/CF-CIDR.txt'
    : `https://raw.githubusercontent.com/cmliu/cmliu/main/CF-CIDR/${IspKey}.txt`;
  const PrefName = IspNames[IspKey] || 'CF官方优选';
  const PrefPorts = [443, 2053, 2083, 2087, 2096, 8443];
  let CIDRItems = [];
  try {
    const Resp = await fetch(PrefCidrUrl);
    CIDRItems = Resp.ok ? ToArray(await Resp.text()) : ['104.16.0.0/13'];
  } catch {
    CIDRItems = ['104.16.0.0/13'];
  }
  const XCidrBuildRandomIp = (cidr) => {
    const [BaseIp, PrefixLen] = cidr.split('/');
    const Prefix = parseInt(PrefixLen);
    const HostBits = 32 - Prefix;
    const IPInt = BaseIp.split('.').reduce((Acc, Seg, i) => Acc | (parseInt(Seg) << (24 - i * 8)), 0);
    const RandomOffset = Math.floor(Math.random() * Math.pow(2, HostBits));
    const Mask = (0xFFFFFFFF << HostBits) >>> 0;
    const RandomIp = (((IPInt & Mask) >>> 0) + RandomOffset) >>> 0;
    return [(RandomIp >>> 24) & 0xFF, (RandomIp >>> 16) & 0xFF, (RandomIp >>> 8) & 0xFF, RandomIp & 0xFF].join('.');
  };
  return Array.from({ length: Count }, (_, Idx) => {
    const IP = XCidrBuildRandomIp(CIDRItems[Math.floor(Math.random() * CIDRItems.length)]);
    const Port = FixedPort === -1 ? PrefPorts[Math.floor(Math.random() * PrefPorts.length)] : FixedPort;
    return { ip: IP, port: Port, isp: PrefName + (Idx + 1) };
  });
}

async function FetchPrefGenData(Host) {
  let PrefIps = [];
  let FormattedHost = String(Host || '').replace(/^sub:\/\//i, 'https://').split('#')[0].split('?')[0];
  if (!/^https?:\/\//i.test(FormattedHost)) FormattedHost = `https://${FormattedHost}`;
  try {
    const URLObj = new URL(FormattedHost);
    FormattedHost = URLObj.origin;
  } catch (Err) {
    return [];
  }
  const GenSubUrl = `${FormattedHost}/sub?host=example.com&uuid=00000000-0000-4000-8000-000000000000`;
  try {
    const Resp = await fetch(GenSubUrl, {
      headers: { 'User-Agent': 'v2rayN/edgetunnel (https://github.com/cmliu/edgetunnel)' }
    });
    if (!Resp.ok) return [];
    const SubText = atob(await Resp.text());
    const Lines = SubText.includes('\r\n') ? SubText.split('\r\n') : SubText.split('\n');
    for (const Row of Lines) {
      if (!Row.trim()) continue;
      if (Row.includes('00000000-0000-4000-8000-000000000000') && Row.includes('example.com')) {
        const AddrMatch = Row.match(/:\/\/[^@]+@([^?]+)/);
        if (AddrMatch) {
          let HostPort = AddrMatch[1];
          let Remark = '';
          const RemarkMatch = Row.match(/#(.+)$/);
          if (RemarkMatch) Remark = '#' + decodeURIComponent(RemarkMatch[1]);
          PrefIps.push(HostPort + Remark);
        }
      }
    }
  } catch (Err) {
    return [];
  }
  return PrefIps;
}

async function QueryPrefApis(URLItems, DefaultPort = '443', TimeoutXXX2 = 3000) {
  if (!URLItems?.length) return [];
  const ResultSet = new Set();
  await Promise.allSettled(URLItems.map(async (URL) => {
    const HashPos = URL.indexOf('#');
    const NoHashXXX = HashPos > -1 ? URL.substring(0, HashPos) : URL;
    const APIRemark = HashPos > -1 ? decodeURIComponent(URL.substring(HashPos + 1)) : null;
    if (NoHashXXX.toLowerCase().startsWith('sub://')) {
      const PrefIps = await FetchPrefGenData(NoHashXXX);
      for (const IP of PrefIps) {
        ResultSet.add(APIRemark ? (IP.includes('#') ? `${IP} [${APIRemark}]` : `${IP}#[${APIRemark}]`) : IP);
      }
      return;
    }
    try {
      const Ctrl = new AbortController();
      const TimerX2 = setTimeout(() => Ctrl.abort(), TimeoutXXX2);
      const Resp = await fetch(NoHashXXX, { signal: Ctrl.signal });
      clearTimeout(TimerX2);
      const Text = await Resp.text();
      if (!Text || !Text.trim()) return;
      const NoSpace = Text.replace(/\s/g, '');
      if (NoSpace.length > 0 && NoSpace.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(NoSpace)) {
        try {
          const DecodedText = atob(NoSpace);
          if (DecodedText.includes('://')) {
            const Lines = DecodedText.split('\n');
            for (const Row of Lines) {
              if (!Row.trim()) continue;
              if (Row.includes('00000000-0000-4000-8000-000000000000') && Row.includes('example.com')) {
                const AddrMatch = Row.match(/:\/\/[^@]+@([^?]+)/);
                if (AddrMatch) ResultSet.add(APIRemark ? AddrMatch[1] + `#[${APIRemark}]` : AddrMatch[1]);
              }
            }
            return;
          }
        } catch {}
      }
      const Lines = Text.split('\n').map(Row => Row.trim()).filter(Row => Row);
      for (const Row of Lines) {
        const RowHashPos = Row.indexOf('#');
        const [HostPart, RemarkPart] = RowHashPos > -1 ? [Row.substring(0, RowHashPos), Row.substring(RowHashPos)] : [Row, ''];
        let HasPort = false;
        if (HostPart.startsWith('[')) {
          HasPort = /\]:(\d+)$/.test(HostPart);
        } else {
          const ColonPos = HostPart.lastIndexOf(':');
          HasPort = ColonPos > -1 && /^\d+$/.test(HostPart.substring(ColonPos + 1));
        }
        const ItemX14 = HasPort ? Row : `${HostPart}:${DefaultPort}${RemarkPart}`;
        ResultSet.add(APIRemark ? (ItemX14.includes('#') ? `${ItemX14} [${APIRemark}]` : `${ItemX14}#[${APIRemark}]`) : ItemX14);
      }
    } catch {}
  }));
  return Array.from(ResultSet);
}

function ParseHostPort(Addr) {
  Addr = String(Addr || '').trim();
  if (!Addr) return { ip: '', port: null };
  if (Addr.startsWith('[')) {
    const Match = Addr.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (Match) return { ip: Match[1], port: Match[2] ? parseInt(Match[2]) : null };
    return { ip: Addr.replace(/^\[|\]$/g, ''), port: null };
  }
  const ColonPos = Addr.lastIndexOf(':');
  if (ColonPos > 0 && /^\d+$/.test(Addr.substring(ColonPos + 1))) {
    return { ip: Addr.substring(0, ColonPos), port: parseInt(Addr.substring(ColonPos + 1)) };
  }
  return { ip: Addr, port: null };
}

async function BuildPrefNodes(Request, Mode) {
  const Nodes = [];
  if (Mode === 'random') {
    const Count = parseInt(GetConfigText('subRandomCount', 16)) || 16;
    const FixedPort = parseInt(GetConfigText('subPort', -1));
    return await GenRandomPrefIp(Request, Math.min(Math.max(Count, 1), 99), Number.isFinite(FixedPort) ? FixedPort : -1);
  }
  if (Mode === 'custom') {
    const CustomContent = GetConfigText('subCustomIPs', '');
    const Lines = String(CustomContent || '').split(/\r?\n/).map(Row => Row.trim()).filter(Row => Row);
    const PrefApiItems = Lines.filter(Row => {
      const XX = Row.toLowerCase();
      return XX.startsWith('sub://') || XX.startsWith('https://');
    });
    const APINode = PrefApiItems.length > 0 ? await QueryPrefApis(PrefApiItems, '443') : [];
    for (const ItemX14 of APINode) {
      const XXX6 = ItemX14.split('#');
      const Addr = XXX6[0];
      const Remark = XXX6.slice(1).join('#') || '优选API';
      const PortParse = ParseHostPort(Addr);
      if (!PortParse.ip) continue;
      Nodes.push({ ip: PortParse.ip, port: PortParse.port, isp: Remark });
    }
    for (const Row of Lines) {
      const XX = Row.toLowerCase();
      if (XX.startsWith('sub://') || XX.startsWith('https://') || XX.includes('://')) continue;
      let HostPort = Row;
      if (HostPort.includes('*')) HostPort = ReplaceAsterisk(HostPort);
      const RemarkPos = HostPort.indexOf('#');
      const Addr = RemarkPos > -1 ? HostPort.slice(0, RemarkPos) : HostPort;
      const Remark = RemarkPos > -1 ? HostPort.slice(RemarkPos + 1) : '';
      const PortParse = ParseHostPort(Addr);
      if (!PortParse.ip) continue;
      Nodes.push({ ip: PortParse.ip, port: PortParse.port, isp: Remark || PortParse.ip });
    }
    return Nodes;
  }
  if (Mode === 'generator') {
    const Generator = GetConfigText('subGenerator', '').trim();
    if (!Generator) return [];
    const PrefIps = await FetchPrefGenData(Generator);
    for (const ItemX14 of PrefIps) {
      const XXX6 = ItemX14.split('#');
      const Addr = XXX6[0];
      const Remark = XXX6.slice(1).join('#') || '优选订阅生成器';
      const PortParse = ParseHostPort(Addr);
      if (!PortParse.ip) continue;
      Nodes.push({ ip: PortParse.ip, port: PortParse.port, isp: Remark });
    }
    return Nodes;
  }
  return Nodes;
}

async function HandleSubRequest(Request507, Uuid506, Url505 = null) {
  if (!Url505) Url505 = new URL(Request507.url);
  const FinalLinks = [];
  const WorkerDomain504 = Url505.hostname;
  const Target503 = Url505.searchParams.get('target') || 'base64';
  const Namer502 = MakeNamer(false);

  // if ECH enabled, use the custom value
  let EchConfig501 = null;
  if (EnableEch) {
    const DnsVal500 = CustomDns || 'https://223.5.5.5/dns-query';
    const EchDomain499 = CustomEchDomain || 'cloudflare-ech.com';
    EchConfig501 = `${EchDomain499}+${DnsVal500}`;
  }
  async function AddNodeSourceItems(Items498) {
    // 【修复】unified IP-version filter so ipv4/ipv6 apply to every node source
    const Ipv4Enabled = GetConfigVal('ipv4', '') === '' || GetConfigVal('ipv4', 'yes') !== 'no';
    const Ipv6Enabled = GetConfigVal('ipv6', '') === '' || GetConfigVal('ipv6', 'yes') !== 'no';
    if (Items498 && Items498.length > 0) {
      Items498 = Items498.filter(ItemX14 => {
        const ipText = String(ItemX14 && ItemX14.ip || '').trim();
        if (!ipText) return true;
        const ColonCount = (ipText.match(/:/g) || []).length;
        const IsXXX6 = ipText.startsWith('[') || ColonCount > 1;
        if (IsXXX6) return Ipv6Enabled;
        return Ipv4Enabled;
      });
    }
    if (EnablePlain) {
      FinalLinks.push(...BuildVlessLinks(Items498, Uuid506, WorkerDomain504, EchConfig501, false, Namer502));
    }
    if (EnableTrojan) {
      FinalLinks.push(...(await BuildTrojanLinks(Items498, Uuid506, WorkerDomain504, EchConfig501, false, Namer502)));
    }
    if (EnableXhttp) {
      FinalLinks.push(...BuildXhttpLinks(Items498, Uuid506, WorkerDomain504, EchConfig501, false, Namer502));
    }
  }
  if (EnableNative) {
    if (CurRegion === 'CUSTOM') {
      const NativeNodes497 = [{
        ip: WorkerDomain504,
        isp: '原生地址'
      }];
      await AddNodeSourceItems(NativeNodes497);
    } else {
      try {
        const NativeNodes496 = [{
          ip: WorkerDomain504,
          isp: '原生地址'
        }];
        await AddNodeSourceItems(NativeNodes496);
      } catch (Err495) {
        if (!CurRegion) {
          CurRegion = 'CF';
        }
        const BackupAddr494 = await GetBackupAddr(CurRegion);
        if (BackupAddr494) {
          FallbackAddr = BackupAddr494.domain + ':' + BackupAddr494.port;
          const BackupNodes493 = [{
            ip: BackupAddr494.domain,
            isp: "ProxyIP-" + CurRegion
          }];
          await AddNodeSourceItems(BackupNodes493);
        } else {
          const NativeNodes = [{
            ip: WorkerDomain504,
            isp: '原生地址'
          }];
          await AddNodeSourceItems(NativeNodes);
        }
      }
    }
  }
  const IsXCustomPref = CustomPrefAddrs.length > 0 || CustomPrefDomains.length > 0;
  if (DisablePref) {} else if (IsXCustomPref) {
    if (CustomPrefAddrs.length > 0 && EnablePrefIp) {
      await AddNodeSourceItems(CustomPrefAddrs);
    }
    if (CustomPrefDomains.length > 0 && EnablePrefDomain) {
      const CustomDomainNodes = CustomPrefDomains.map(DVal492 => ({
        ip: DVal492.domain,
        isp: DVal492.name || DVal492.domain
      }));
      await AddNodeSourceItems(CustomDomainNodes);
    }
  } else {
    if (EnablePrefDomain) {
      const DomainNodes = DirectDomains.map(DVal491 => ({
        ip: DVal491.domain,
        isp: DVal491.name || DVal491.domain
      }));
      await AddNodeSourceItems(DomainNodes);
    }
    if (EnablePrefIp) {
      if (!PrefAddrSource) {
        // 【修复】when a region (wk) is set, prefer that region’s backup addresses as preferred nodes; otherwise keep the old logic
        const IsSpecifiedRegion = CurRegion && CurRegion !== 'CF' && CurRegion !== 'CUSTOM';
        try {
          let PrefNodes = null;
          if (IsSpecifiedRegion) {
            const RegionAddr = await GetBackupAddr(CurRegion);
            if (RegionAddr && RegionAddr.domain) {
              FallbackAddr = RegionAddr.domain + ':' + (RegionAddr.port || 443);
              PrefNodes = [{
                ip: RegionAddr.domain,
                isp: "ProxyIP-" + CurRegion
              }];
            }
          }
          if (!PrefNodes) {
            const Addrs490 = await GetAddrList();
            if (Addrs490.length > 0) {
              PrefNodes = Addrs490;
            }
          }
          if (PrefNodes && PrefNodes.length > 0) {
            await AddNodeSourceItems(PrefNodes);
          }
        } catch (Err489) {
          if (!CurRegion) {
            CurRegion = 'CF';
          }
          const BackupAddr488 = await GetBackupAddr(CurRegion);
          if (BackupAddr488) {
            FallbackAddr = BackupAddr488.domain + ':' + BackupAddr488.port;
            const BackupNodes487 = [{
              ip: BackupAddr488.domain,
              isp: "ProxyIP-" + CurRegion
            }];
            await AddNodeSourceItems(BackupNodes487);
          }
        }
      }
    }
    if (EnableRepoPref) {
      try {
        const NewAddrs = await FetchNewAddrs();
        if (NewAddrs.length > 0) {
          if (EnablePlain) {
            FinalLinks.push(...BuildNewVlessLinks(NewAddrs, Uuid506, WorkerDomain504, EchConfig501, false, Namer502));
          }
          if (EnableTrojan) {
            FinalLinks.push(...(await BuildNewTrojanLinks(NewAddrs, Uuid506, WorkerDomain504, EchConfig501, false, Namer502)));
          }
          if (EnableXhttp) {
            FinalLinks.push(...BuildXhttpLinks(NewAddrs, Uuid506, WorkerDomain504, EchConfig501, false, Namer502));
          }
        }
      } catch (Err486) {
        if (!CurRegion) {
          CurRegion = 'CF';
        }
        const BackupAddr485 = await GetBackupAddr(CurRegion);
        if (BackupAddr485) {
          FallbackAddr = BackupAddr485.domain + ':' + BackupAddr485.port;
          const BackupNodes = [{
            ip: BackupAddr485.domain,
            isp: "ProxyIP-" + CurRegion
          }];
          await AddNodeSourceItems(BackupNodes);
        }
      }
    }
  }

  // ⚡️ preferred-sub module: append preferred nodes by subMode (ported from edgetunnel)
  const SubMode = String(GetConfigText('subMode', '')).trim().toLowerCase();
  if (SubMode === 'random' || SubMode === 'custom' || SubMode === 'generator') {
    try {
      const ModuleNodes = await BuildPrefNodes(Request507, SubMode);
      if (ModuleNodes.length > 0) {
        await AddNodeSourceItems(ModuleNodes);
      }
    } catch (SubGenErr) {
      console.error('优选订阅生成模块出错:', SubGenErr);
    }
  }

  if (FinalLinks.length === 0) {
    const ErrorRemark = "所有节点获取失败";
    const Proto484 = "vless";
    const ErrLink = `${Proto484}://00000000-0000-0000-0000-000000000000@127.0.0.1:80?encryption=none&security=none&type=ws&host=error.com&path=%2F#${encodeURIComponent(ErrorRemark)}`;
    FinalLinks.push(ErrLink);
  }
  let SubText;
  let ContentType483 = 'text/plain; charset=utf-8';
  switch (Target503.toLowerCase()) {
    case "clash":
    case "clashr":
    case "stash":
    case 'meta':
    case "clashmeta":
      SubText = GenQuanxConf589(FinalLinks);
      ContentType483 = 'text/yaml; charset=utf-8';
      break;
    case "surge":
    case "surge2":
    case "surge3":
    case "surge4":
      SubText = GenQuanxConf562(FinalLinks);
      ContentType483 = 'text/plain; charset=utf-8';
      break;
    case "quantumult":
    case "quanx":
    case "quanx":
      SubText = GenQuanxConf(FinalLinks);
      ContentType483 = 'text/plain; charset=utf-8';
      break;
    case "ss":
    case "ssr":
      SubText = btoa(FinalLinks.join('\n'));
      break;
    case "v2ray":
      SubText = btoa(FinalLinks.join('\n'));
      break;
    case "loon":
      SubText = GenQuanxConf552(FinalLinks);
      ContentType483 = 'text/plain; charset=utf-8';
      break;
    case "singbox":
    case "sing-box":
    case "singbox":
      SubText = GenSingboxJson(FinalLinks);
      ContentType483 = 'application/json; charset=utf-8';
      break;
    default:
      SubText = btoa(FinalLinks.join('\n'));
  }
  const RespHeaders = {
    'Content-Type': ContentType483,
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  };

  // ⚡️ preferred-sub module: set the Profile-Update-Interval header
  const SubUpdateHours = parseInt(GetConfigText('subUpdateTime', 3));
  if (SubUpdateHours > 0) {
    RespHeaders['Profile-Update-Interval'] = String(SubUpdateHours);
  }

  // append ECH status to response headers
  if (EnableEch) {
    RespHeaders['X-ECH-Status'] = 'ENABLED';
    if (EchConfig501) {
      RespHeaders['X-ECH-Config-Length'] = String(EchConfig501.length);
    }
  }
  return new Response(SubText, {
    headers: RespHeaders
  });
}
function BuildVlessLinks(Items482, Uuid481, WorkerDomain480, EchConfig479 = null, SkipNo478 = false, Namer477 = null) {
  const CfHttpPorts476 = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const CfHttpsPorts475 = [443, 2053, 2083, 2087, 2096, 8443];
  const DefaultHttpsPorts474 = [443];
  const DefaultHttpPorts473 = DisablePlain ? [] : [80];
  const Links472 = [];
  const WsPath471 = '/?ed=2048';
  const Proto470 = "vless";
  const MakeName469 = Namer477 || MakeNamer(SkipNo478);
  for (const Item468 of Items482) {
    const SafeAddr467 = Item468.ip.includes(':') ? `[${Item468.ip}]` : Item468.ip;
    let Val2Build466 = [];
    if (Item468.port) {
      const Port465 = Item468.port;
      if (CfHttpsPorts475.includes(Port465)) {
        Val2Build466.push({
          port: Port465,
          tls: true
        });
      } else if (CfHttpPorts476.includes(Port465)) {
        if (!DisablePlain) {
          Val2Build466.push({
            port: Port465,
            tls: false
          });
        }
      } else {
        Val2Build466.push({
          port: Port465,
          tls: true
        });
      }
    } else {
      DefaultHttpsPorts474.forEach(Port464 => {
        Val2Build466.push({
          port: Port464,
          tls: true
        });
      });
      DefaultHttpPorts473.forEach(Port463 => {
        Val2Build466.push({
          port: Port463,
          tls: false
        });
      });
    }
    for (const {
      port: Port462,
      tls: Tls461
    } of Val2Build466) {
      const WsNodeName460 = MakeName469(Item468);
      if (Tls461) {
        const WsParams459 = new URLSearchParams({
          encryption: 'none',
          security: 'tls',
          sni: WorkerDomain480,
          fp: 'chrome',
          type: 'ws',
          host: WorkerDomain480,
          path: WsPath471
        });
        ApplyAlpnParam(WsParams459);

        // if ECH enabled, add the ech param (ECH requires Chrome UA disguise)
        if (EnableEch) {
          const DnsVal458 = CustomDns || 'https://223.5.5.5/dns-query';
          const EchDomain457 = CustomEchDomain || 'cloudflare-ech.com';
          WsParams459.set('ech', `${EchDomain457}+${DnsVal458}`);
        }
        Links472.push(`${Proto470}://${Uuid481}@${SafeAddr467}:${Port462}?${WsParams459.toString()}#${encodeURIComponent(WsNodeName460)}`);
      } else {
        const WsParams456 = new URLSearchParams({
          encryption: 'none',
          security: 'none',
          type: 'ws',
          host: WorkerDomain480,
          path: WsPath471
        });
        Links472.push(`${Proto470}://${Uuid481}@${SafeAddr467}:${Port462}?${WsParams456.toString()}#${encodeURIComponent(WsNodeName460)}`);
      }
    }
  }
  return Links472;
}
async function BuildTrojanLinks(Items455, Uuid454, WorkerDomain453, EchConfig452 = null, SkipNo451 = false, Namer450 = null) {
  const CfHttpPorts449 = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const CfHttpsPorts448 = [443, 2053, 2083, 2087, 2096, 8443];
  const DefaultHttpsPorts = [443];
  const DefaultHttpPorts = DisablePlain ? [] : [80];
  const Links447 = [];
  const WsPath446 = '/?ed=2048';
  const Password445 = TransferPath || Uuid454;
  const MakeName444 = Namer450 || MakeNamer(SkipNo451);
  for (const Item443 of Items455) {
    const SafeAddr442 = Item443.ip.includes(':') ? `[${Item443.ip}]` : Item443.ip;
    let Val2Build = [];
    if (Item443.port) {
      const Port441 = Item443.port;
      if (CfHttpsPorts448.includes(Port441)) {
        Val2Build.push({
          port: Port441,
          tls: true
        });
      } else if (CfHttpPorts449.includes(Port441)) {
        if (!DisablePlain) {
          Val2Build.push({
            port: Port441,
            tls: false
          });
        }
      } else {
        Val2Build.push({
          port: Port441,
          tls: true
        });
      }
    } else {
      DefaultHttpsPorts.forEach(Port440 => {
        Val2Build.push({
          port: Port440,
          tls: true
        });
      });
      DefaultHttpPorts.forEach(Port439 => {
        Val2Build.push({
          port: Port439,
          tls: false
        });
      });
    }
    for (const {
      port: Port438,
      tls: Tls
    } of Val2Build) {
      const WsNodeName437 = MakeName444(Item443);
      if (Tls) {
        const WsParams436 = new URLSearchParams({
          security: 'tls',
          sni: WorkerDomain453,
          fp: 'chrome',
          type: 'ws',
          host: WorkerDomain453,
          path: WsPath446
        });
        ApplyAlpnParam(WsParams436);

        // if ECH enabled, add the ech param (ECH requires Chrome UA disguise)
        if (EnableEch) {
          const DnsVal435 = CustomDns || 'https://223.5.5.5/dns-query';
          const EchDomain434 = CustomEchDomain || 'cloudflare-ech.com';
          WsParams436.set('ech', `${EchDomain434}+${DnsVal435}`);
        }
        Links447.push(`${"trojan://"}${Password445}@${SafeAddr442}:${Port438}?${WsParams436.toString()}#${encodeURIComponent(WsNodeName437)}`);
      } else {
        const WsParams = new URLSearchParams({
          security: 'none',
          type: 'ws',
          host: WorkerDomain453,
          path: WsPath446
        });
        Links447.push(`${"trojan://"}${Password445}@${SafeAddr442}:${Port438}?${WsParams.toString()}#${encodeURIComponent(WsNodeName437)}`);
      }
    }
  }
  return Links447;
}
async function GetAddrList() {
  const Ipv4Url1 = "https://www.wetest.vip/page/cloudflare/address_v4.html";
  const Ipv6Url1 = "https://www.wetest.vip/page/cloudflare/address_v6.html";
  let Results433 = [];

  // read filter config (all enabled by default)
  const Ipv4On = GetConfigVal('ipv4', '') === '' || GetConfigVal('ipv4', 'yes') !== 'no';
  const Ipv6On = GetConfigVal('ipv6', '') === '' || GetConfigVal('ipv6', 'yes') !== 'no';
  const Val2432 = GetConfigVal('ispMobile', '') === '' || GetConfigVal('ispMobile', 'yes') !== 'no';
  const Val2431 = GetConfigVal('ispUnicom', '') === '' || GetConfigVal('ispUnicom', 'yes') !== 'no';
  const Val2430 = GetConfigVal('ispTelecom', '') === '' || GetConfigVal('ispTelecom', 'yes') !== 'no';
  try {
    const Promises = [];
    if (Ipv4On) {
      Promises.push(FetchParsedAddrs(Ipv4Url1));
    } else {
      Promises.push(Promise.resolve([]));
    }
    if (Ipv6On) {
      Promises.push(FetchParsedAddrs(Ipv6Url1));
    } else {
      Promises.push(Promise.resolve([]));
    }
    const [Ipv4List, Ipv6List] = await Promise.all(Promises);
    Results433 = [...Ipv4List, ...Ipv6List];

    // filter by ISP
    if (Results433.length > 0) {
      Results433 = Results433.filter(Item429 => {
        const Local428 = Item429.isp || '';
        if (Local428.includes('移动') && !Val2432) return false;
        if (Local428.includes('联通') && !Val2431) return false;
        if (Local428.includes('电信') && !Val2430) return false;
        return true;
      });
    }
    if (Results433.length > 0) {
      return Results433;
    }
  } catch (EventVal427) {}
  return [];
}
async function FetchParsedAddrs(Url426) {
  try {
    const Resp425 = await fetch(Url426, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    if (!Resp425.ok) {
      return [];
    }
    const Page = await Resp425.text();
    const Results424 = [];
    const RowRegex423 = /<tr[\s\S]*?<\/tr>/g;
    const RowRegex422 = /<td data-label="线路名称">(.+?)<\/td>[\s\S]*?<td data-label="优选地址">([\d.:a-fA-F]+)<\/td>[\s\S]*?<td data-label="数据中心">(.+?)<\/td>/;
    let Local421;
    while ((Local421 = RowRegex423.exec(Page)) !== null) {
      const PageHtml420 = Local421[0];
      const Val2419 = PageHtml420.match(RowRegex422);
      if (Val2419 && Val2419[1] && Val2419[2]) {
        const Colo = Val2419[3] ? Val2419[3].trim().replace(/<.*?>/g, '') : '';
        Results424.push({
          isp: Val2419[1].trim().replace(/<.*?>/g, ''),
          ip: Val2419[2].trim(),
          colo: Colo
        });
      }
    }
    if (Results424.length === 0) {}
    return Results424;
  } catch (Err418) {
    return [];
  }
}
async function HandleWsRequest(Request417) {
  // read client override params from the request path query
  // read override params from the path query
  const RequestUrl = new URL(Request417.url);
  const ReqFallback416 = RequestUrl.searchParams.get('p') || '';
  const ReqRegion415 = (RequestUrl.searchParams.get('wk') || '').toUpperCase();
  const ReqMatchStr = RequestUrl.searchParams.get('rm') || '';
  const ReqRegionMatch414 = ReqMatchStr ? ReqMatchStr.toLowerCase() !== 'no' : null;
  const ReqProxyStr = RequestUrl.searchParams.get('s') || '';
  let ReqProxyCfg413 = null;
  if (ReqProxyStr) {
    try {
      ReqProxyCfg413 = ParseProxyConfig(ReqProxyStr);
    } catch (Ignore412) {}
  }

  // detect and set the current Worker region so WebSocket requests match the nearest region
  // priority: client path param wk > global manualWorkerRegion > auto-detect
  let RealRegion411 = CurRegion;
  if (!RealRegion411 || RealRegion411 === '') {
    if (ReqRegion415) {
      RealRegion411 = ReqRegion415;
    } else if (ManualRegion && ManualRegion.trim()) {
      RealRegion411 = ManualRegion.trim().toUpperCase();
    } else {
      RealRegion411 = 'CF';
    }
  } else if (ReqRegion415) {
    RealRegion411 = ReqRegion415;
  }
  const WsPair = new WebSocketPair();
  const [ClientWs, Val2410] = Object.values(WsPair);
  Val2410.accept();
  Val2410.binaryType = 'arraybuffer';
  let RemoteConn409 = {
    socket: null,
    writer: null,
    drainUpload: null
  };
  let IsDns = false;
  let ProtoType = null;
  let Val2408 = false;
  let Transferring = false;
  const ChunkQueue = CreateChunkQueue(UpPacketSize, UpQueueLimit, UpQueueLimit >> 8);
  const ReqRegionMatch407 = Request417.fetcher;
  function ReleaseWriter() {
    try {
      RemoteConn409.writer?.releaseLock();
    } catch (Ignore406) {}
    RemoteConn409.writer = null;
  }
  function CloseTransfer() {
    if (Transferring) return;
    Transferring = true;
    ChunkQueue.clear();
    ReleaseWriter();
    try {
      RemoteConn409.socket?.close();
    } catch (Ignore405) {}
    SafeClose(Val2410);
  }
  function EnqueueChunk(Chunk404) {
    const Data403 = ToU8(Chunk404);
    if (!Data403.byteLength) return true;
    if (!ChunkQueue.sow(Data403)) {
      CloseTransfer();
      return false;
    }
    RemoteConn409.drainUpload();
    return true;
  }
  async function HandleXhttpRemote402() {
    if (Val2408 || Transferring || !RemoteConn409.writer) return;
    Val2408 = true;
    try {
      for (;;) {
        if (Transferring || !RemoteConn409.writer) break;
        const [Data401] = ChunkQueue.bundle();
        if (!Data401) break;
        await RemoteConn409.writer.write(Data401);
      }
    } catch (Ignore400) {
      CloseTransfer();
    } finally {
      Val2408 = false;
      if (!ChunkQueue.empty && !Transferring && RemoteConn409.writer) queueMicrotask(HandleXhttpRemote402);
    }
  }
  RemoteConn409.drainUpload = () => {
    if (!Val2408 && !ChunkQueue.empty && RemoteConn409.writer) queueMicrotask(HandleXhttpRemote402);
  };
  const EarlyData399 = Request417.headers.get("sec-websocket-protocol") || '';
  const Local398 = MakeStream(Val2410, EarlyData399);
  Local398.pipeTo(new WritableStream({
    async write(Chunk397) {
      if (Transferring) return;
      const Data396 = ToU8(Chunk397);
      if (IsDns) return await HandleUdp(Data396, Val2410, null, ReqRegionMatch407);
      if (RemoteConn409.socket && RemoteConn409.writer) {
        if (!EnqueueChunk(Data396)) throw new Error('upload queue overflow');
        return;
      }
      if (ProtoType) {
        if (!EnqueueChunk(Data396)) throw new Error('upload queue overflow');
        return;
      }
      if (!ProtoType) {
        if (EnablePlain && Data396.byteLength >= 24) {
          const VlessHead = ParseVlessHeader(Data396, AuthToken);
          if (!VlessHead.hasError) {
            ProtoType = "vless";
            const {
              addressType: AddrType395,
              port: Port394,
              hostname: Hostname393,
              rawIndex: RawIndex,
              version: Local392,
              isUDP: IsUdp391
            } = VlessHead;
            if (IsUdp391) {
              if (Port394 === 53) IsDns = true;else throw new Error(ErrXOnlySupportDnsUuidDataX);
            }
            const RespHeader390 = new Uint8Array([Local392[0], 0]);
            const RawData389 = Data396.subarray(RawIndex);
            if (IsDns) return HandleUdp(RawData389, Val2410, RespHeader390, ReqRegionMatch407);
            await HandleXhttpRemote384(AddrType395, Hostname393, Port394, RawData389, Val2410, RespHeader390, RemoteConn409, ReqFallback416, RealRegion411, ReqRegionMatch414, ReqProxyCfg413, ReqRegionMatch407);
            return;
          }
        }
        if (EnableTrojan && Data396.byteLength >= 56) {
          const TrojanHead = await ParseTrojanHeader(Data396, AuthToken);
          if (!TrojanHead.hasError) {
            ProtoType = "trojan";
            const {
              addressType: AddrType388,
              port: Port387,
              hostname: Hostname386,
              rawClientData: RawClientData
            } = TrojanHead;
            await HandleXhttpRemote384(AddrType388, Hostname386, Port387, RawClientData, Val2410, null, RemoteConn409, ReqFallback416, RealRegion411, ReqRegionMatch414, ReqProxyCfg413, ReqRegionMatch407);
            return;
          }
        }
        throw new Error('Invalid protocol or authentication failed');
      }
    }
  })).catch(Err385 => {
    CloseTransfer();
  });
  return new Response(null, {
    status: 101,
    webSocket: ClientWs
  });
}
async function HandleXhttpRemote384(AddrType383, Host, PortNum, RawData, Ws382, RespHeader381, RemoteConn, ReqFallback = '', ReqRegion = '', ReqRegionMatch380 = null, ReqProxyCfg = null, ReqRegionMatch379 = null) {
  // use the client path param first, then fall back to global config
  const RealFallback = ReqFallback || FallbackAddr;
  const RealRegion = ReqRegion || CurRegion;
  const RealRegionMatch = ReqRegionMatch380 !== null ? ReqRegionMatch380 : EnableRegionMatch;
  const RealProxyCfg = ReqProxyCfg || ParsedSocks5;
  const RealProxyOn = ReqProxyCfg ? true : ProxyEnabled;
  // EdgeTunnel 特性：GO2SOCKS5 domainwhitelist —— hitwhitelisttargetdomainforce走proxy（首跳）
  const WhitelistHit = Host ? GO2SOCKS5Whitelist.some(Rule => {
    const Target = String(Host).toLowerCase();
    return Target === Rule || Target.endsWith('.' + Rule);
  }) : false;
  const EarlyData378 = ToU8(RawData);
  async function ConnectRemote(Addr377, Port376, ValProxy = false) {
    // when proxying, send the first packet via the handshake before releasing the writer to avoid a reset from swapping writers
    const Remote375 = ValProxy ? await ConnectViaProxy(AddrType383, Addr377, Port376, RealProxyCfg, ReqRegionMatch379, EarlyData378) : await ConnectSocket(Addr377, Port376, ReqRegionMatch379, ConnRaceCount);
    const Writer374 = Remote375.writable.getWriter();
    if (!ValProxy && EarlyData378.byteLength) await Writer374.write(EarlyData378);
    return {
      remoteSock: Remote375,
      writer: Writer374
    };
  }
  function ClearCurrent(Remote373, Writer372) {
    if (RemoteConn.socket !== Remote373) return;
    try {
      Writer372?.releaseLock();
    } catch (Ignore371) {}
    RemoteConn.socket = null;
    RemoteConn.writer = null;
  }
  function AttachRemote(Remote370, Writer369, RetryFn368) {
    try {
      if (RemoteConn.writer && RemoteConn.writer !== Writer369) {
        RemoteConn.writer.releaseLock();
      }
    } catch (Ignore367) {}
    RemoteConn.socket = Remote370;
    RemoteConn.writer = Writer369;
    RemoteConn.drainUpload?.();
    Remote370.closed.catch(() => {}).finally(() => {
      if (RemoteConn.socket === Remote370) SafeClose(Ws382);
    });
    ConnectVal279(Remote370, Ws382, RespHeader381, RetryFn368).finally(() => {
      if (RemoteConn.socket === Remote370) {
        try {
          Writer369.releaseLock();
        } catch (Ignore366) {}
        RemoteConn.writer = null;
      }
    });
  }
  async function RetryConnect() {
    // proxy-only: never fall back to direct or backup addresses to avoid egress IP leaks
    if (ProxyOnly && RealProxyOn) {
      SafeClose(Ws382);
      return;
    }
    if (EnableDegrade && RealProxyOn) {
      try {
        const {
          remoteSock: ProxySock,
          writer: ProxyWriter
        } = await ConnectRemote(Host, PortNum, true);
        AttachRemote(ProxySock, ProxyWriter, null);
        return;
      } catch (ProxyErr) {
        let BackupHost365, BackupPort364;
        if (RealFallback && RealFallback.trim()) {
          const Parsed363 = ParseAddrPort(RealFallback);
          BackupHost365 = Parsed363.address;
          BackupPort364 = Parsed363.port || PortNum;
        } else {
          const BackupAddr362 = await GetBackupAddr(RealRegion, RealRegionMatch);
          BackupHost365 = BackupAddr362 ? BackupAddr362.domain : Host;
          BackupPort364 = BackupAddr362 ? BackupAddr362.port : PortNum;
        }
        try {
          const {
            remoteSock: FallbackSock361,
            writer: FallbackWriter360
          } = await ConnectRemote(BackupHost365, BackupPort364, false);
          AttachRemote(FallbackSock361, FallbackWriter360, null);
        } catch (FallbackErr359) {
          SafeClose(Ws382);
        }
      }
    } else {
      let BackupHost, BackupPort;
      if (RealFallback && RealFallback.trim()) {
        const Parsed = ParseAddrPort(RealFallback);
        BackupHost = Parsed.address;
        BackupPort = Parsed.port || PortNum;
      } else {
        const BackupAddr = await GetBackupAddr(RealRegion, RealRegionMatch);
        BackupHost = BackupAddr ? BackupAddr.domain : Host;
        BackupPort = BackupAddr ? BackupAddr.port : PortNum;
      }
      try {
        const {
          remoteSock: FallbackSock,
          writer: FallbackWriter
        } = await ConnectRemote(BackupHost, BackupPort, RealProxyOn);
        AttachRemote(FallbackSock, FallbackWriter, null);
      } catch (FallbackErr) {
        SafeClose(Ws382);
      }
    }
  }
  try {
    // first-hop proxy decision: proxy-only → always; direct-first → never; GO2SOCKS5 whitelist hit → forced; otherwise depends on whether a proxy is set
    const FirstHopProxy = WhitelistHit ? RealProxyOn : ProxyOnly && RealProxyOn ? true : EnableDegrade ? false : RealProxyOn;
    const {
      remoteSock: DnsSock358,
      writer: RemoteWriter
    } = await ConnectRemote(Host, PortNum, FirstHopProxy);
    AttachRemote(DnsSock358, RemoteWriter, () => {
      ClearCurrent(DnsSock358, RemoteWriter);
      RetryConnect();
    });
  } catch (Err357) {
    await RetryConnect();
  }
}
function ToU8(Chunk356) {
  if (Chunk356 instanceof Uint8Array) return Chunk356;
  if (Chunk356 instanceof ArrayBuffer) return new Uint8Array(Chunk356);
  if (ArrayBuffer.isView(Chunk356)) return new Uint8Array(Chunk356.buffer, Chunk356.byteOffset, Chunk356.byteLength);
  return new Uint8Array(Chunk356);
}
function ConcatU8(Header355, Body354) {
  const HeaderVal353 = ToU8(Header355);
  const BVal352 = ToU8(Body354);
  const Output351 = new Uint8Array(HeaderVal353.byteLength + BVal352.byteLength);
  Output351.set(HeaderVal353);
  Output351.set(BVal352, HeaderVal353.byteLength);
  return Output351;
}
function CreateChunkQueue(Local350, Val2349 = Local350, ItemItemsLimit = Math.max(1, Val2349 >> 8)) {
  let Queue = [];
  let Header348 = 0;
  let ByteCount347 = 0;
  let Buf346 = null;
  function HandleLocal345() {
    if (Header348 > 32 && Header348 * 2 >= Queue.length) {
      Queue = Queue.slice(Header348);
      Header348 = 0;
    }
  }
  function HandleLocal344() {
    if (Header348 >= Queue.length) return null;
    const Data343 = Queue[Header348];
    Queue[Header348++] = undefined;
    ByteCount347 -= Data343.byteLength;
    HandleLocal345();
    return Data343;
  }
  return {
    get empty() {
      return Header348 >= Queue.length;
    },
    clear() {
      Queue = [];
      Header348 = 0;
      ByteCount347 = 0;
    },
    sow(Data342) {
      const CountVal = Data342?.byteLength || 0;
      if (!CountVal) return true;
      if (ByteCount347 + CountVal > Val2349 || Queue.length - Header348 >= ItemItemsLimit) return false;
      Queue.push(Data342);
      ByteCount347 += CountVal;
      return true;
    },
    bundle(Data341 = null) {
      Data341 ||= HandleLocal344();
      if (!Data341 || Header348 >= Queue.length || Data341.byteLength >= Local350) return [Data341, false];
      let Local340 = Data341.byteLength;
      let End = Header348;
      while (End < Queue.length) {
        const Local339 = Queue[End];
        const Val2338 = Local340 + Local339.byteLength;
        if (Val2338 > Local350) break;
        Local340 = Val2338;
        End++;
      }
      if (End === Header348) return [Data341, false];
      const Output = Buf346 ||= new Uint8Array(Local350);
      Output.set(Data341);
      let Offset337 = Data341.byteLength;
      while (Header348 < End) {
        const Local336 = Queue[Header348];
        Queue[Header348++] = undefined;
        ByteCount347 -= Local336.byteLength;
        Output.set(Local336, Offset337);
        Offset337 += Local336.byteLength;
      }
      HandleLocal345();
      return [Output.subarray(0, Local340), true];
    }
  };
}
function CreateFlusher(Ws335) {
  const Local334 = DownPacketSize;
  const Tail = DownTail;
  const Val2333 = Math.max(4096, Tail << 3);
  let Local332 = new Uint8Array(Local334);
  let ByteCount = 0;
  let Timer = 0;
  let Val2331 = false;
  let Local330 = 0;
  let KeyX4 = 0;
  let Val2329 = 0;
  function Flush() {
    if (Timer) clearTimeout(Timer);
    Timer = 0;
    Val2331 = false;
    if (!ByteCount) return;
    if (Ws335.readyState === 1) Ws335.send(Local332.subarray(0, ByteCount).slice());
    Local332 = new Uint8Array(Local334);
    ByteCount = 0;
    Val2329 = 0;
  }
  function HandleLocal() {
    if (Timer || Val2331) return;
    Val2331 = true;
    KeyX4 = Local330;
    queueMicrotask(() => {
      Val2331 = false;
      if (!ByteCount || Timer) return;
      if (Local334 - ByteCount < Tail) return Flush();
      Timer = setTimeout(() => {
        Timer = 0;
        if (!ByteCount) return;
        if (Local334 - ByteCount < Tail) return Flush();
        if (Val2329 < 2 && (Local330 !== KeyX4 || ByteCount < Val2333)) {
          Val2329++;
          KeyX4 = Local330;
          return HandleLocal();
        }
        Flush();
      }, Math.max(DownDelay, 1));
    });
  }
  return {
    send(Chunk328) {
      const Data327 = ToU8(Chunk328);
      let Offset326 = 0;
      const Local325 = Data327.byteLength;
      if (!Local325) return;
      while (Offset326 < Local325) {
        if (!ByteCount && Local325 - Offset326 >= Local334) {
          const Size324 = Math.min(Local334, Local325 - Offset326);
          if (Ws335.readyState === 1) Ws335.send(Offset326 || Size324 !== Local325 ? Data327.subarray(Offset326, Offset326 + Size324) : Data327);
          Offset326 += Size324;
          continue;
        }
        const Size323 = Math.min(Local334 - ByteCount, Local325 - Offset326);
        Local332.set(Data327.subarray(Offset326, Offset326 + Size323), ByteCount);
        ByteCount += Size323;
        Offset326 += Size323;
        Local330++;
        if (ByteCount === Local334 || Local334 - ByteCount < Tail) Flush();else HandleLocal();
      }
    },
    flush: Flush
  };
}
function OpenSocket(Addr322, Port321, ReqRegionMatch320 = null) {
  const Target = {
    hostname: Addr322,
    port: Port321
  };
  if (ReqRegionMatch320 && typeof ReqRegionMatch320.connect === 'function') return ReqRegionMatch320.connect(Target);
  return Connect(Target);
}
async function OpenSocketSafe(Addr319, Port318, ReqRegionMatch317 = null) {
  try {
    const Sock316 = OpenSocket(Addr319, Port318, ReqRegionMatch317);
    if (Sock316?.opened) await Sock316.opened;
    return Sock316;
  } catch (Err315) {
    if (!ReqRegionMatch317) throw Err315;
    const Sock314 = Connect({
      hostname: Addr319,
      port: Port318
    });
    if (Sock314?.opened) await Sock314.opened;
    return Sock314;
  }
}
async function ConnectSocket(Addr313, Port312, ReqRegionMatch311 = null, RaceCount = 1) {
  const Count = Math.max(1, RaceCount | 0);
  if (Count <= 1) return OpenSocketSafe(Addr313, Port312, ReqRegionMatch311);
  const Local310 = Array.from({
    length: Count
  }, () => OpenSocketSafe(Addr313, Port312, ReqRegionMatch311));
  const Local309 = await Promise.any(Local310);
  Local310.forEach(Local308 => {
    Local308.then(Sock307 => {
      if (Sock307 !== Local309) {
        try {
          Sock307.close();
        } catch (Ignore306) {}
      }
    }, () => {});
  });
  return Local309;
}
function UuidToBytes(Token305) {
  if (UuidByteCache.has(Token305)) return UuidByteCache.get(Token305);
  const Hex = String(Token305 || '').replace(/-/g, '');
  if (Hex.length !== 32) return null;
  const Byte304 = new Uint8Array(16);
  for (let IdxVal303 = 0; IdxVal303 < 16; IdxVal303++) {
    const Val302 = Number.parseInt(Hex.slice(IdxVal303 * 2, IdxVal303 * 2 + 2), 16);
    if (Number.isNaN(Val302)) return null;
    Byte304[IdxVal303] = Val302;
  }
  if (UuidByteCache.size > 16) UuidByteCache.clear();
  UuidByteCache.set(Token305, Byte304);
  return Byte304;
}
function MatchUuid(Byte301, Offset300, Token299) {
  const Id298 = UuidToBytes(Token299);
  return !!Id298 && Byte301[Offset300] === Id298[0] && Byte301[Offset300 + 1] === Id298[1] && Byte301[Offset300 + 2] === Id298[2] && Byte301[Offset300 + 3] === Id298[3] && Byte301[Offset300 + 4] === Id298[4] && Byte301[Offset300 + 5] === Id298[5] && Byte301[Offset300 + 6] === Id298[6] && Byte301[Offset300 + 7] === Id298[7] && Byte301[Offset300 + 8] === Id298[8] && Byte301[Offset300 + 9] === Id298[9] && Byte301[Offset300 + 10] === Id298[10] && Byte301[Offset300 + 11] === Id298[11] && Byte301[Offset300 + 12] === Id298[12] && Byte301[Offset300 + 13] === Id298[13] && Byte301[Offset300 + 14] === Id298[14] && Byte301[Offset300 + 15] === Id298[15];
}
function ParseVlessHeader(Chunk297, Token) {
  const Byte296 = ToU8(Chunk297);
  if (Byte296.byteLength < 24) return {
    hasError: true,
    message: ErrXInvalidData
  };
  const Local295 = Byte296.subarray(0, 1);
  if (!MatchUuid(Byte296, 1, Token)) return {
    hasError: true,
    message: ErrXInvalidUuid
  };
  const ValLen294 = Byte296[17];
  const CmdIdx = 18 + ValLen294;
  if (Byte296.byteLength < CmdIdx + 5) return {
    hasError: true,
    message: ErrXInvalidData
  };
  const Cmd293 = Byte296[CmdIdx];
  let IsUdp = false;
  if (Cmd293 === 1) {} else if (Cmd293 === 2) {
    IsUdp = true;
  } else {
    return {
      hasError: true,
      message: ErrXXSupportCmd
    };
  }
  const PortIdx292 = 19 + ValLen294;
  const Port291 = Byte296[PortIdx292] << 8 | Byte296[PortIdx292 + 1];
  let AddrIdx290 = PortIdx292 + 2,
    AddrLength289 = 0,
    AddrValIdx = AddrIdx290 + 1,
    Hostname288 = '';
  const AddrType287 = Byte296[AddrIdx290];
  switch (AddrType287) {
    case AT_IPV4:
      AddrLength289 = 4;
      if (Byte296.byteLength < AddrValIdx + AddrLength289) return {
        hasError: true,
        message: ErrXInvalidData
      };
      Hostname288 = `${Byte296[AddrValIdx]}.${Byte296[AddrValIdx + 1]}.${Byte296[AddrValIdx + 2]}.${Byte296[AddrValIdx + 3]}`;
      break;
    case AT_DOMAIN:
      if (Byte296.byteLength < AddrValIdx + 1) return {
        hasError: true,
        message: ErrXInvalidData
      };
      AddrLength289 = Byte296[AddrValIdx++];
      if (Byte296.byteLength < AddrValIdx + AddrLength289) return {
        hasError: true,
        message: ErrXInvalidData
      };
      Hostname288 = SharedDecoder.decode(Byte296.subarray(AddrValIdx, AddrValIdx + AddrLength289));
      break;
    case AT_IPV6:
      AddrLength289 = 16;
      if (Byte296.byteLength < AddrValIdx + AddrLength289) return {
        hasError: true,
        message: ErrXInvalidData
      };
      const Val6286 = [];
      const ValXView = new DataView(Byte296.buffer, Byte296.byteOffset + AddrValIdx, AddrLength289);
      for (let IdxVal285 = 0; IdxVal285 < 8; IdxVal285++) Val6286.push(ValXView.getUint16(IdxVal285 * 2).toString(16));
      Hostname288 = Val6286.join(':');
      break;
    default:
      return {
        hasError: true,
        message: `${ErrXInvalidAddrType}: ${AddrType287}`
      };
  }
  if (!Hostname288) return {
    hasError: true,
    message: `${ErrXEmptyAddr}: ${AddrType287}`
  };
  return {
    hasError: false,
    addressType: AddrType287,
    port: Port291,
    hostname: Hostname288,
    isUDP: IsUdp,
    rawIndex: AddrValIdx + AddrLength289,
    version: Local295
  };
}
function MakeStream(Sock284, ProtoHeader) {
  let Local283 = false;
  return new ReadableStream({
    start(Ctrl282) {
      Sock284.addEventListener('message', Event => {
        if (!Local283) Ctrl282.enqueue(ToU8(Event.data));
      });
      Sock284.addEventListener('close', () => {
        if (!Local283) {
          SafeClose(Sock284);
          Ctrl282.close();
        }
      });
      Sock284.addEventListener('error', Err281 => Ctrl282.error(Err281));
      const {
        earlyData: EarlyData,
        error: Err280
      } = DecodeEarlyData(ProtoHeader);
      if (Err280) Ctrl282.error(Err280);else if (EarlyData) Ctrl282.enqueue(ToU8(EarlyData));
    },
    cancel() {
      Local283 = true;
      SafeClose(Sock284);
    }
  });
}
async function ConnectVal279(RemoteSock, Ws278, HeaderData, RetryFn) {
  let Header277 = HeaderData,
    HasData = false,
    Local276 = false;

  // note: direct may handshake successfully but receive no data for a long time; a timeout triggers fallback
  let FirstByteTimer = null;
  if (RetryFn) {
    FirstByteTimer = setTimeout(() => {
      if (!HasData && !Local276) {
        Local276 = true;
        try {
          RemoteSock.close && RemoteSock.close();
        } catch (Ignore275) {}
        RetryFn();
      }
    }, FirstByteTimeout);
  }
  const Local274 = CreateFlusher(Ws278);
  let Reader273 = null;
  let Local272 = true;
  let Buf271 = new ArrayBuffer(ChunkSize);
  try {
    try {
      Reader273 = RemoteSock.readable.getReader({
        mode: 'byob'
      });
    } catch (Ignore270) {
      Local272 = false;
      Reader273 = RemoteSock.readable.getReader();
    }
    for (;;) {
      const ReadResult269 = Local272 ? await Reader273.read(new Uint8Array(Buf271, 0, ChunkSize)) : await Reader273.read();
      if (ReadResult269.done) break;
      const ReadVal = ReadResult269.value;
      let Chunk268 = ToU8(ReadVal);
      const BufX2 = Local272 && ReadVal?.buffer instanceof ArrayBuffer && ReadVal.buffer.byteLength >= ChunkSize ? ReadVal.buffer : new ArrayBuffer(ChunkSize);
      if (!Chunk268.byteLength) continue;
      if (!HasData) {
        HasData = true;
        if (FirstByteTimer) {
          clearTimeout(FirstByteTimer);
          FirstByteTimer = null;
        }
      }
      if (Ws278.readyState !== 1) throw new Error(ErrXWsXOpen);
      if (Header277) {
        Chunk268 = ConcatU8(Header277, Chunk268);
        Header277 = null;
      }
      if (Chunk268.byteLength >= ChunkSize >> 1) {
        Local274.flush();
        Ws278.send(Chunk268);
        if (Local272) Buf271 = new ArrayBuffer(ChunkSize);
      } else {
        Local274.send(Chunk268.slice());
        if (Local272) Buf271 = BufX2;
      }
    }
    Local274.flush();
  } catch (Err267) {
    // do not close the WS once retry has fired (retry remounts a new socket)
    if (!Local276) SafeClose(Ws278);
  } finally {
    try {
      Local274.flush();
    } catch (Ignore266) {}
    try {
      Reader273?.releaseLock();
    } catch (Ignore265) {}
  }
  if (FirstByteTimer) {
    clearTimeout(FirstByteTimer);
    FirstByteTimer = null;
  }
  if (!HasData && !Local276 && RetryFn) RetryFn();
}
async function HandleUdp(UuidDataXChunk, Ws, RespHeader, ReqRegionMatch = null) {
  try {
    const DnsSock = await ConnectSocket('8.8.4.4', 53, ReqRegionMatch, 1);
    let Header = RespHeader;
    const Writer264 = DnsSock.writable.getWriter();
    await Writer264.write(UuidDataXChunk);
    Writer264.releaseLock();
    await ConnectVal279(DnsSock, Ws, Header, null);
  } catch (Err263) {}
}
async function ConnectViaProxy(AddrType, Addr262, Port261, ProxyCfg = ParsedSocks5, ReqRegionMatch258 = null, FirstPacket = null) {
  // dispatch by proxy kind: tunnel uses the connect request; the rest keep the SOCKS5 handshake
  if (ProxyCfg && (ProxyCfg.kind === ProxyKindXTunnel || ProxyCfg.kind === ProxyKindXSecureTunnel)) {
    return ConnectTunnel(Addr262, Port261, ProxyCfg, ReqRegionMatch258, FirstPacket);
  }
  const {
    username: Local260,
    password: Password259,
    hostname: Hostname258,
    socksPort: Port257
  } = ProxyCfg;
  // prefer the request’s own fetcher for connecting, fall back to the global one
  const Sock256 = OpenSocket(Hostname258, Port257, ReqRegionMatch258);
  const Writer255 = Sock256.writable.getWriter();
  await Writer255.write(new Uint8Array(Local260 ? [5, 2, 0, 2] : [5, 1, 0]));
  const Reader254 = Sock256.readable.getReader();
  // responses may arrive fragmented; accumulate to the needed length, leaving remaining bytes for the next step
  let Remainder = new Uint8Array(0);
  async function ReadFully(NeedLen) {
    while (Remainder.length < NeedLen) {
      const { value: Chunk, done: Done } = await Reader254.read();
      if (Done || !Chunk) throw new Error(ErrXProxyConnFail);
      Remainder = ConcatU8(Remainder, Chunk);
    }
    return Remainder;
  }
  function Consume(Length) {
    const ReadResult = Remainder.subarray(0, Length);
    Remainder = Remainder.subarray(Length);
    return ReadResult;
  }
  let Local253 = await ReadFully(2);
  if (Local253[0] !== 5 || Local253[1] === 255) throw new Error(ErrXNoAcceptableMethod);
  const SelectedMethod = Local253[1];
  Consume(2);
  if (SelectedMethod === 2) {
    if (!Local260 || !Password259) throw new Error(ErrXNeedAuth);
    const Encoder252 = new TextEncoder();
    const AuthReq = new Uint8Array([1, Local260.length, ...Encoder252.encode(Local260), Password259.length, ...Encoder252.encode(Password259)]);
    await Writer255.write(AuthReq);
    Local253 = await ReadFully(2);
    if (Local253[0] !== 1 || Local253[1] !== 0) throw new Error(ErrXAuthFail);
    Consume(2);
  }
  // 统一用domain型寻址：invoke方address类型number在different协议below含义inconsistent（valueprotocol 2=domain，
  // 木马协议 3=domain），按number分支会把domain当成六版address编错。交给proxy自己parse更稳。
  const Encoder251 = new TextEncoder();
  const TargetBytes = Encoder251.encode(NormalizeTarget(Addr262));
  const Local250 = new Uint8Array([3, TargetBytes.length, ...TargetBytes]);
  await Writer255.write(new Uint8Array([5, 1, 0, ...Local250, Port261 >> 8, Port261 & 255]));
  // reply length depends on the bind address type; read the fixed 4-byte head first, then pad by type
  Local253 = await ReadFully(4);
  if (Local253[1] !== 0) throw new Error(ErrXProxyConnFail);
  const BindType = Local253[3];
  let ReplyLen;
  if (BindType === 1) {
    ReplyLen = 10;
  } else if (BindType === 4) {
    ReplyLen = 22;
  } else if (BindType === 3) {
    ReplyLen = 7 + (await ReadFully(5))[4];
  } else {
    throw new Error(ErrXProxyRespErr);
  }
  await ReadFully(ReplyLen);
  Consume(ReplyLen);
  // the first packet must be sent before releasing the writer, sharing the handshake writer
  if (FirstPacket && FirstPacket.byteLength) await Writer255.write(FirstPacket);
  Writer255.releaseLock();
  Reader254.releaseLock();
  // if the reply already piggybacks target data, reattach it to the stream head to avoid losing the first packet
  if (Remainder.length) return WrapRemainder(Sock256, Remainder);
  return Sock256;
}
// IPv6 addresses carry no brackets in domain-style addressing
function NormalizeTarget(Addr234) {
  const Text = String(Addr234 || '');
  return /^\[.*\]$/.test(Text) ? Text.slice(1, -1) : Text;
}
async function ConnectTunnel(Addr238, PortXXXVal, ProxyCfg, Fetcher = null, FirstPacketXXXVal = null) {
  const {
    username: TunnelUser,
    password: TunnelPwd,
    hostname: TunnelHost,
    socksPort: TunnelPort,
    kind: TunnelKind
  } = ProxyCfg;
  const ConnOpts = TunnelKind === ProxyKindXSecureTunnel ? {
    secureTransport: 'on',
    allowHalfOpen: false
  } : undefined;
  const TargetParams = {
    hostname: TunnelHost,
    port: TunnelPort
  };
  // prefer the request’s own fetcher for connecting, fall back to the global one
  const Sock = Fetcher && typeof Fetcher.connect === 'function' ? (ConnOpts === undefined ? Fetcher.connect(TargetParams) : Fetcher.connect(TargetParams, ConnOpts)) : Connect(TargetParams, ConnOpts);
  if (Sock?.opened) await Sock.opened;
  // IPv6 targets need brackets in the request line
  const TargetHost = Addr238.includes(':') && !/^\[.*\]$/.test(Addr238) ? `[${Addr238}]` : Addr238;
  const TargetAddr = `${TargetHost}:${PortXXXVal}`;
  let RequestHead = `${TextXConnMethod} ${TargetAddr}${TextXProtoVer}${TextXNewline}` + `${TextXHostHeader}${TargetAddr}${TextXNewline}` + `${TextXUAHeader}${TextXNewline}` + `${TextXProxyKeepAlive}${TextXNewline}`;
  if (TunnelUser) {
    RequestHead += `${TextXProxyAuthHeader}${btoa(`${TunnelUser}:${TunnelPwd || ''}`)}${TextXNewline}`;
  }
  RequestHead += TextXNewline;
  const Writer = Sock.writable.getWriter();
  const Reader = Sock.readable.getReader();
  try {
    await Writer.write(new TextEncoder().encode(RequestHead));
    // responses may arrive fragmented; accumulate until the header ends (blank line)
    const Sep = [13, 10, 13, 10];
    let Buf = new Uint8Array(0);
    let HeaderEnd = -1;
    while (HeaderEnd < 0) {
      const {
        value: Chunk,
        done: Done
      } = await Reader.read();
      if (Done || !Chunk) throw new Error(ErrXProxyTunnelFail);
      Buf = ConcatU8(Buf, Chunk);
      for (let Pos = 0; Pos + 3 < Buf.length; Pos++) {
        if (Buf[Pos] === Sep[0] && Buf[Pos + 1] === Sep[1] && Buf[Pos + 2] === Sep[2] && Buf[Pos + 3] === Sep[3]) {
          HeaderEnd = Pos + 4;
          break;
        }
      }
      if (HeaderEnd < 0 && Buf.length > 8192) throw new Error(ErrXProxyRespErr);
    }
    const StatusLine = SharedDecoder.decode(Buf.subarray(0, Math.min(HeaderEnd, 128)));
    if (!StatusLine.startsWith(TextXRespPrefix)) throw new Error(ErrXProxyRespErr);
    const StatusX10 = Number(StatusLine.split(' ')[1]);
    if (!(StatusX10 >= 200 && StatusX10 < 300)) throw new Error(ErrXProxyTunnelFail);
    // the proxy may have piggybacked target data after the header; hand it back downstream
    const RemainderX5 = Buf.subarray(HeaderEnd);
    // send the first packet before releasing the writer
    if (FirstPacketXXXVal && FirstPacketXXXVal.byteLength) await Writer.write(FirstPacketXXXVal);
    Writer.releaseLock();
    Reader.releaseLock();
    if (RemainderX5.byteLength) return WrapRemainder(Sock, RemainderX5);
    return Sock;
  } catch (TunnelErr) {
    try {
      Writer.releaseLock();
    } catch (IgnoreTunnel1) {}
    try {
      Reader.releaseLock();
    } catch (IgnoreTunnel2) {}
    try {
      Sock.close();
    } catch (IgnoreTunnel3) {}
    throw TunnelErr;
  }
}
// reattach piggybacked target data from the tunnel response to the readable-stream head
function WrapRemainder(Sock, RemainderX5) {
  let UpstreamReader = null;
  const NewXX = new ReadableStream({
    start(Ctrl) {
      Ctrl.enqueue(RemainderX5);
      UpstreamReader = Sock.readable.getReader();
    },
    async pull(Ctrl) {
      const {
        value: Chunk,
        done: Done
      } = await UpstreamReader.read();
      if (Done) {
        Ctrl.close();
        return;
      }
      Ctrl.enqueue(Chunk);
    },
    cancel(XXX2) {
      try {
        UpstreamReader?.cancel(XXX2);
      } catch (IgnoreCancel) {}
    }
  });
  return {
    readable: NewXX,
    writable: Sock.writable,
    closed: Sock.closed,
    opened: Sock.opened,
    close: () => Sock.close()
  };
}
function ParseProxyConfig(Addr249) {
  let Rest = String(Addr249 || '').trim();
  // detect proxy kind by prefix; no prefix keeps SOCKS5 behavior
  let ProxyKind = ProxyKindXSock5;
  const LowerAddr = Rest.toLowerCase();
  if (LowerAddr.startsWith(PrefixXHttps)) {
    ProxyKind = ProxyKindXSecureTunnel;
    Rest = Rest.slice(PrefixXHttps.length);
  } else if (LowerAddr.startsWith(PrefixXHttp)) {
    ProxyKind = ProxyKindXTunnel;
    Rest = Rest.slice(PrefixXHttp.length);
  } else if (LowerAddr.startsWith(PrefixXSock5)) {
    Rest = Rest.slice(PrefixXSock5.length);
  } else if (LowerAddr.startsWith(PrefixXSock)) {
    Rest = Rest.slice(PrefixXSock.length);
  }
  // strip any trailing path, keeping only auth@host:port
  const PathPos = Rest.indexOf('/');
  if (PathPos >= 0) Rest = Rest.slice(0, PathPos);
  if (!Rest) throw new Error(ErrXInvalidProxyAddr);
  let [Local248, Local247] = Rest.split("@").reverse();
  let Local246, Password245, Hostname244, PortX5;
  if (Local247) {
    const Local243 = Local247.split(":");
    if (Local243.length !== 2) throw new Error(ErrXInvalidProxyAddr);
    [Local246, Password245] = Local243;
  }
  const Local242 = Local248.split(":");
  const LastSeg = Local242.pop();
  PortX5 = Number(LastSeg);
  // tunnel mode may omit the port, defaulting to plain 80 / secure 443
  if (isNaN(PortX5)) {
    if (ProxyKind === ProxyKindXSock5) throw new Error(ErrXInvalidProxyAddr);
    Local242.push(LastSeg);
    PortX5 = ProxyKind === ProxyKindXSecureTunnel ? 443 : 80;
  }
  Hostname244 = Local242.join(":");
  if (!Hostname244) throw new Error(ErrXInvalidProxyAddr);
  if (Hostname244.includes(":") && !/^\[.*\]$/.test(Hostname244)) throw new Error(ErrXInvalidProxyAddr);
  return {
    username: Local246,
    password: Password245,
    hostname: Hostname244,
    socksPort: PortX5,
    kind: ProxyKind
  };
}
async function HandleSubPage(Request241, Uuid240 = null) {
  if (!Uuid240) Uuid240 = AuthToken;
  const Url239 = new URL(Request241.url);
  // check cookie for the language preference first
  const CookieHeader = Request241.headers.get('Cookie') || '';
  let CookieLang = null;
  if (CookieHeader) {
    const Local238 = CookieHeader.split(';').map(CVal237 => CVal237.trim());
    for (const Cookie of Local238) {
      if (Cookie.startsWith('preferredLanguage=')) {
        CookieLang = Cookie.split('=')[1];
        break;
      }
    }
  }
  let LangCode236 = 'zh';
  if (CookieLang === 'fa' || CookieLang === 'fa-IR') {
    LangCode236 = 'fa';
  } else if (CookieLang === 'en' || CookieLang === 'en-US' || CookieLang === 'en-GB') {
    LangCode236 = 'en';
  } else if (CookieLang === 'zh' || CookieLang === 'zh-CN') {
    LangCode236 = 'zh';
  } else {
    // if no cookie, fall back to browser-language detection
    const AcceptLang = Request241.headers.get('Accept-Language') || '';
    const BrowserLang = AcceptLang.split(',')[0].split('-')[0].toLowerCase();
    if (BrowserLang === 'fa' || AcceptLang.includes('fa-IR') || AcceptLang.includes('fa')) {
      LangCode236 = 'fa';
    } else if (BrowserLang === 'en') {
      LangCode236 = 'en';
    } else {
      LangCode236 = 'zh';
    }
  }
  const IsRtl236 = LangCode236 === 'fa';
  const LangVal = LangCode236 === 'fa' ? 'fa-IR' : LangCode236 === 'en' ? 'en' : 'zh-CN';
  const Local235 = {
    zh: {
          title: 'CFBox 订阅管理',
          subtitle: '多客户端支持 • 智能优选 • 一键生成 • 免费自建',
          selectClient: '选择客户端',
          systemStatus: '系统状态',
          configManagement: '配置管理',
          relatedLinks: '相关链接',
          networkTest: '网络测试',
          runNetworkTest: '一键测试流媒体/AI',
          preferredSubGen: '优选订阅生成',
          subMode: '优选订阅模式',
          subModeOff: '关闭（使用默认订阅生成逻辑）',
          subModeGenerator: '优选订阅生成器（小白专属）',
          subModeRandom: '随机优选模式（官方优选）',
          subModeCustom: '自定义订阅模式（支持汇聚）',
          modeStandard: '标准模式',
          modeAdvanced: '进阶模式',
          chooseOptimizeWay: '请选择一种优选方式',
          onlineOptimize: '在线优选',
          onlineOptimizeDesc: '通过浏览器实时在线优选，无需安装，即开即用',
          localOptimize: '本地优选',
          localOptimizeDesc: '下载优选客户端在本地设备上运行，灵活多变',
          apiOptimize: 'API 优选',
          apiOptimizeDesc: '通过优选API接口获取优选IP列表，自动追加到自定义优选',
          apiOptimizeURL: '优选API地址',
          apiOptimizePort: '端口',
          verifyApi: '验证API',
          appendToCustom: '追加到自定义优选',
          chainProxyAddress: '链式代理地址',
          verifyChain: '验证链式代理',
          applyChainProxy: '应用链式代理',
          loadingTools: '正在拉取优选工具目录…',
          startGen: '开始生成',
          genCount: '生成数量',
          copyAll: '复制全部',
          applyAll: '应用结果',
          testLatency: '测速',
          closeBtn: '关闭',
          modeSwitchHint: '点击切换标准/进阶模式',
          preferredTools: '优选工具',
          startPreferred: '开始优选',
          startPreferredRunning: '正在生成并测速优选IP…',
          startPreferredDone: '优选完成，已填入自定义优选',
          startPreferredFail: '优选失败，请稍后重试',
          subscriptionInterface: '订阅接口',
          subscriptionInterfacePlaceholder: 'https://url.v1.mk/sub',
          subscriptionInterfaceHint: '订阅转换接口地址，用于生成订阅时转换节点格式',
          chainProxy: '链式代理',
          chainProxyPlaceholder: 'user:pass@host:port 或 http://user:pass@host:port',
          chainProxyHint: '出站代理地址，用于转发所有出站流量，不写前缀默认按 s5 处理',
          advancedSection: '进阶设置',
          subModeHint: '选择生成优选IP的方式，保存后访问 /sub 订阅地址生效',
          subRandomCount: '随机优选数量',
          subPort: '指定优选端口',
          subPortRandom: '随机端口',
          subCustomIPs: '自定义优选（每行一个）',
          subCustomIPsPlaceholder: '104.16.0.1:443\n子域名:端口#备注\nsub://优选API地址\nhttps://优选API地址',
          subCustomIPsHint: '支持 IP/域名:端口#备注、sub://优选API、https://优选API（自动汇聚去重）',
          subGenerator: '优选订阅生成器',
          subName: '订阅名称',
          subUpdateTime: '订阅更新时间（小时）',
          subUpdateTimeHint: '客户端自动刷新订阅的间隔',
          netTestHint: '点击"一键测试流媒体/AI"检测各服务连通性',
          nodeSpeedTest: '一键测速当前节点',
          checking: '检测中...',
          workerRegion: 'Worker地区: ',
          detectionMethod: '检测方式: ',
          proxyIPStatus: 'ProxyIP状态: ',
          currentIP: '当前使用IP: ',
          regionMatch: '地区匹配: ',
          selectionLogic: '选择逻辑: ',
          kvStatusChecking: '检测KV状态中...',
          kvEnabled: '✅ KV存储已启用，可以使用配置管理功能',
          kvDisabled: '💡 未检测到 KV 存储（只读模式）',
          specifyRegion: '指定地区',
          autoDetect: '官方直连',
          saveRegion: '保存地区配置',
          protocolSelection: '协议选择:',
          enableProtoV: '启用 VLESS 协议',
          enableProtoT: '启用 Trojan 协议',
          enableXhttp: '启用 xhttp 协议',
          altPassword: 'Trojan 密码',
          customPath: '自定义路径',
          customIP: '自定义ProxyIP',
          preferredIPs: '优选IP列表',
          preferredIPsURL: '优选IP来源URL',
          latencyTest: '延迟测试',
          latencyTestIP: '测试IP/域名:',
          latencyTestIPPlaceholder: '输入IP或域名，多个用逗号分隔',
          latencyTestPort: '端口:',
          startTest: '开始测试',
          stopTest: '停止测试',
          testResult: '测试结果:',
          addToYx: '添加到优选列表',
          addSelectedToYx: '添加选中项到优选列表',
          selectAll: '全选',
          deselectAll: '取消全选',
          testingInProgress: '测试中...',
          testComplete: '测试完成',
          latencyMs: '延迟',
          timeout: '超时',
          ipSource: 'IP来源:',
          manualInput: '手动输入',
          cfRandomIP: 'CF随机IP',
          urlFetch: 'URL获取',
          randomCount: '生成数量:',
          fetchURL: '获取URL:',
          fetchURLPlaceholder: '输入优选IP的URL地址',
          generateIP: '生成IP',
          fetchIP: '获取IP',
          socks5Config: '代理配置',
          customSettings: '自定义设置',
          customHomepage: '自定义首页URL',
          customHomepagePlaceholder: '例如: https://example.com',
          customHomepageHint: '设置自定义URL作为首页伪装。访问根路径 / 时将显示该URL的内容。留空则显示默认终端页面。',
          saveConfig: '保存配置',
          advancedControl: '高级控制',
          subscriptionConverter: '订阅转换地址:',
          builtinPreferred: '内置优选类型',
          enablePreferredDomain: '启用优选域名',
          enablePreferredIP: '启用优选 IP',
          enableNativeAddress: '启用原生地址',
          enableGitHubPreferred: '启用自定义优选',
          allowAPIManagement: '允许API管理',
          regionMatching: '地区匹配',
          downgradeControl: '出站方式',
          tlsControl: 'TLS控制',
          preferredControl: '优选控制',
          saveAdvanced: '保存高级配置',
          loading: '加载中...',
          currentConfig: '当前路径配置',
          refreshConfig: '刷新配置',
          resetConfig: '重置配置',
          subscriptionCopied: '订阅链接已复制',
          autoSubscriptionCopied: '自动识别订阅链接已复制，客户端访问时会根据User-Agent自动识别并返回对应格式',
          altPasswordPlaceholder: '留空则自动使用 UUID',
          altPasswordHint: '设置自定义 Trojan 密码。留空则使用 UUID。客户端会自动对密码进行 SHA224 哈希。',
          protocolHint: '可以同时启用多个协议。订阅将生成选中协议的节点。<br>• VLESS WS: 基于 WebSocket 的标准协议<br>• Trojan: 使用 SHA224 密码认证<br>• xhttp: 基于 HTTP POST 的伪装协议（需要绑定自定义域名并开启 gRPC）',
          enableECH: '启用 ECH (Encrypted Client Hello)',
          enableECHHint: '启用后，每次刷新订阅时会自动从 DoH 获取最新的 ECH 配置并添加到链接中',
          customDNS: '自定义 DNS 服务器',
          customDNSPlaceholder: '例如: https://223.5.5.5/dns-query',
          customDNSHint: '用于ECH配置查询的DNS服务器地址（DoH格式）',
          customECHDomain: '自定义 ECH 域名',
          customECHDomainPlaceholder: '例如: cloudflare-ech.com',
          customECHDomainHint: 'ECH配置中使用的域名，留空则使用默认值',
          alpn: 'TLS ALPN',
          alpnDefault: '默认（留空，由客户端协商）',
          alpnHint: '仅添加到 TLS 节点链接参数；留空则不写 alpn。',
          saveProtocol: '保存协议配置',
          subscriptionConverterPlaceholder: '默认: https://url.v1.mk/sub',
          subscriptionConverterHint: '订阅转换已内部实现，无需外部 API。此项仅作兼容保留，可留空。',
          builtinPreferredHint: '控制订阅中包含哪些内置优选节点。默认全部启用。',
          apiEnabledDefault: '默认（关闭API）',
          apiEnabledYes: '开启API管理',
          apiEnabledHint: '⚠️ 安全提醒：开启后允许通过API动态添加优选IP。建议仅在需要时开启。',
          regionMatchingDefault: '默认（启用地区匹配）',
          regionMatchingNo: '关闭地区匹配',
          regionMatchingHint: '设置为"关闭"时不进行地区智能匹配',
          downgradeControlDefault: '优先走代理（默认）',
          downgradeControlNo: '优先直连，失败再走代理',
          downgradeControlOnly: '只走代理，不回落',
          downgradeControlHint: '没填代理时三个选项都一样，都是直连。只走代理时连不上就断开，出口 IP 不会漏',
          tlsControlDefault: '默认（保留所有节点）',
          tlsControlYes: '仅TLS节点',
          tlsControlHint: '设置为"仅TLS节点"时只生成带TLS的节点，不生成非TLS节点（如80端口）',
          preferredControlDefault: '默认（启用优选）',
          preferredControlYes: '关闭优选',
          preferredControlHint: '设置为"关闭优选"时只使用原生地址，不生成优选IP和域名节点',
          regionNames: {
              CF: '🌐 官方直连',
              HK: '🇭🇰 香港',
              US: '🇺🇸 美国',
              SG: '🇸🇬 新加坡',
              JP: '🇯🇵 日本',
              KR: '🇰🇷 韩国',
              DE: '🇩🇪 德国',
              SE: '🇸🇪 瑞典',
              NL: '🇳🇱 荷兰',
              FI: '🇫🇮 芬兰',
              GB: '🇬🇧 英国'
            },
          terminal: 'CFBox 终端 v1.0',
          githubProject: 'GitHub 项目',
          PrefUtil: '优选工具',
          autoDetectClient: '自动识别',
          selectionLogicText: '同地区 → 邻近地区 → 其他地区',
          customIPDisabledHint: '使用自定义ProxyIP时，地区选择已禁用',
          customIPMode: '自定义ProxyIP模式 (p变量启用)',
          customIPModeDesc: '自定义IP模式 (已禁用地区匹配)',
          usingCustomProxyIP: '使用自定义ProxyIP: ',
          customIPConfig: ' (p变量配置)',
          customIPModeDisabled: '自定义IP模式，地区选择已禁用',
          manualRegion: '手动指定地区',
          manualRegionDesc: ' (手动指定)',
          proxyIPAvailable: '10/10 可用 (ProxyIP域名预设可用)',
          smartSelection: '智能就近选择中',
          sameRegionIP: '同地区IP可用 (1个)',
          cloudflareDetection: '官方直连',
          detectionFailed: '检测失败',
          apiTestResult: 'API检测结果: ',
          apiTestTime: '检测时间: ',
          apiTestFailed: 'API检测失败: ',
          unknownError: '未知错误',
          apiTestError: 'API测试失败: ',
          kvNotConfigured: 'KV存储未配置，无法使用配置管理功能。\\n\\n请在Cloudflare Workers中:\\n1. 创建KV命名空间\\n2. 绑定环境变量 C\\n3. 重新部署代码',
          kvNotEnabled: 'KV存储未配置',
          kvCheckFailed: 'KV存储检测失败: 响应格式错误',
          kvCheckFailedStatus: 'KV存储检测失败 - 状态码: ',
          kvCheckFailedError: 'KV存储检测失败 - 错误: '
        },
    fa: {
          title: 'مدیریت اشتراک CFBox',
          subtitle: 'پشتیبانی چند کلاینت • انتخاب هوشمند • تولید یک کلیکی',
          selectClient: 'انتخاب کلاینت',
          systemStatus: 'وضعیت سیستم',
          configManagement: 'مدیریت تنظیمات',
          relatedLinks: 'لینک‌های مرتبط',
          networkTest: 'تست شبکه',
          runNetworkTest: 'تست یکباره رسانه/هوش مصنوعی',
          preferredSubGen: 'تولید اشتراک برتر',
          subMode: 'حالت تولید اشتراک',
          subModeOff: 'غیرفعال (استفاده از منطق پیش‌فرض)',
          subModeGenerator: 'تولیدکننده اشتراک برتر (مخصوص مبتدیان)',
          subModeRandom: 'حالت انتخاب تصادفی (بهینه رسمی)',
          subModeCustom: 'حالت اشتراک سفارشی (پشتیبانی از تجمیع)',
          modeStandard: 'حالت استاندارد',
          modeAdvanced: 'حالت پیشرفته',
          chooseOptimizeWay: 'لطفاً یک روش بهینه‌سازی انتخاب کنید',
          onlineOptimize: 'بهینه‌سازی آنلاین',
          onlineOptimizeDesc: 'بهینه‌سازی بلادرنگ از طریق مرورگر، بدون نیاز به نصب',
          localOptimize: 'بهینه‌سازی محلی',
          localOptimizeDesc: 'دانلود کلاینت بهینه‌سازی و اجرا در دستگاه محلی',
          apiOptimize: 'بهینه‌سازی API',
          apiOptimizeDesc: 'دریافت لیست IP از طریق API بهینه‌سازی',
          apiOptimizeURL: 'آدرس API بهینه‌سازی',
          apiOptimizePort: 'پورت',
          verifyApi: 'تأیید API',
          appendToCustom: 'افزودن به لیست سفارشی',
          chainProxyAddress: 'آدرس پروکسی زنجیره‌ای',
          verifyChain: 'تأیید پروکسی زنجیره‌ای',
          applyChainProxy: 'اعمال پروکسی زنجیره‌ای',
          loadingTools: 'در حال دریافت فهرست ابزارها…',
          startGen: 'شروع تولید',
          genCount: 'تعداد تولید',
          copyAll: 'کپی همه',
          applyAll: 'اعمال نتایج',
          testLatency: 'تست سرعت',
          closeBtn: 'بستن',
          modeSwitchHint: 'برای تغییر حالت استاندارد/پیشرفته کلیک کنید',
          preferredTools: 'ابزارهای انتخاب IP',
          startPreferred: 'شروع انتخاب',
          startPreferredRunning: 'در حال تولید و تست IP...',
          startPreferredDone: 'انتخاب کامل شد، در لیست سفارشی قرار گرفت',
          startPreferredFail: 'انتخاب ناموفق بود، دوباره تلاش کنید',
          subscriptionInterface: 'رابط اشتراک',
          subscriptionInterfacePlaceholder: 'https://url.v1.mk/sub',
          subscriptionInterfaceHint: 'آدرس رابط تبدیل اشتراک برای تبدیل فرمت گره‌ها',
          chainProxy: 'پروکسی زنجیره‌ای',
          chainProxyPlaceholder: 'user:pass@host:port یا http://user:pass@host:port',
          chainProxyHint: 'آدرس پروکسی خروجی برای ارسال تمام ترافیک خروجی',
          advancedSection: 'تنظیمات پیشرفته',
          subModeHint: 'روش تولید IP برتر را انتخاب کنید؛ پس از ذخیره، در آدرس /sub اعمال می‌شود',
          subRandomCount: 'تعداد انتخاب تصادفی',
          subPort: 'پورت برتر مشخص',
          subPortRandom: 'پورت تصادفی',
          subCustomIPs: 'برتر سفارشی (هر خط یک مورد)',
          subCustomIPsPlaceholder: '104.16.0.1:443\nزیردامنه:پورت#یادداشت\nsub://آدرس API برتر\nhttps://آدرس API برتر',
          subCustomIPsHint: 'پشتیبانی از IP/دامنه:پورت#یادداشت، sub://API برتر، https://API برتر (تجمیع و حذف تکراری)',
          subGenerator: 'تولیدکننده اشتراک برتر',
          subName: 'نام اشتراک',
          subUpdateTime: 'زمان به‌روزرسانی اشتراک (ساعت)',
          subUpdateTimeHint: 'فاصله به‌روزرسانی خودکار اشتراک در کلاینت',
          netTestHint: 'برای بررسی اتصال سرویس‌ها روی «تست یکباره رسانه/هوش مصنوعی» کلیک کنید',
          nodeSpeedTest: 'تست سرعت گره فعلی',
          checking: 'در حال بررسی...',
          workerRegion: 'منطقه Worker: ',
          detectionMethod: 'روش تشخیص: ',
          proxyIPStatus: 'وضعیت ProxyIP: ',
          currentIP: 'IP فعلی: ',
          regionMatch: 'تطبیق منطقه: ',
          selectionLogic: 'منطق انتخاب: ',
          kvStatusChecking: 'در حال بررسی وضعیت KV...',
          kvEnabled: '✅ ذخیره‌سازی KV فعال است، می‌توانید از مدیریت تنظیمات استفاده کنید',
          kvDisabled: '💡 ذخیره‌سازی KV یافت نشد (حالت فقط‌خواندنی)',
          specifyRegion: 'تعیین منطقه',
          autoDetect: 'اتصال مستقیم رسمی',
          saveRegion: 'ذخیره تنظیمات منطقه',
          protocolSelection: 'انتخاب پروتکل:',
          enableProtoV: 'فعال‌سازی پروتکل VLESS',
          enableProtoT: 'فعال‌سازی پروتکل Trojan',
          enableXhttp: 'فعال‌سازی پروتکل xhttp',
          enableECH: 'فعال‌سازی ECH (Encrypted Client Hello)',
          enableECHHint: 'پس از فعال‌سازی، در هر بار تازه‌سازی اشتراک، پیکربندی ECH به‌روز به‌طور خودکار از DoH دریافت شده و به لینک‌ها اضافه می‌شود',
          customDNS: 'سرور DNS سفارشی',
          customDNSPlaceholder: 'مثال: https://223.5.5.5/dns-query',
          customDNSHint: 'آدرس سرور DNS برای جستجوی پیکربندی ECH (فرمت DoH)',
          customECHDomain: 'دامنه ECH سفارشی',
          customECHDomainPlaceholder: 'مثال: cloudflare-ech.com',
          customECHDomainHint: 'دامنه استفاده شده در پیکربندی ECH، خالی بگذارید تا از مقدار پیش‌فرض استفاده شود',
          altPassword: 'رمز عبور Trojan',
          customPath: 'مسیر سفارشی',
          customIP: 'ProxyIP سفارشی',
          preferredIPs: 'لیست IP ترجیحی',
          preferredIPsURL: 'URL منبع IP ترجیحی',
          latencyTest: 'تست تاخیر',
          latencyTestIP: 'IP/دامنه تست:',
          latencyTestIPPlaceholder: 'IP یا دامنه وارد کنید، چند مورد با کاما جدا شوند',
          latencyTestPort: 'پورت:',
          startTest: 'شروع تست',
          stopTest: 'توقف تست',
          testResult: 'نتیجه تست:',
          addToYx: 'افزودن به لیست ترجیحی',
          addSelectedToYx: 'افزودن موارد انتخاب شده',
          selectAll: 'انتخاب همه',
          deselectAll: 'لغو انتخاب',
          testingInProgress: 'در حال تست...',
          testComplete: 'تست کامل شد',
          latencyMs: 'تاخیر',
          timeout: 'زمان تمام شد',
          ipSource: 'منبع IP:',
          manualInput: 'ورودی دستی',
          cfRandomIP: 'IP تصادفی CF',
          urlFetch: 'دریافت از URL',
          randomCount: 'تعداد تولید:',
          fetchURL: 'URL دریافت:',
          fetchURLPlaceholder: 'آدرس URL لیست IP را وارد کنید',
          generateIP: 'تولید IP',
          fetchIP: 'دریافت IP',
          socks5Config: 'تنظیمات پروکسی',
          customSettings: 'تنظیمات سفارشی',
          customHomepage: 'URL صفحه اصلی سفارشی',
          customHomepagePlaceholder: 'مثال: https://example.com',
          customHomepageHint: 'تنظیم URL سفارشی به عنوان استتار صفحه اصلی. هنگام دسترسی به مسیر اصلی / محتوای این URL نمایش داده می‌شود. اگر خالی بگذارید صفحه ترمینال پیش‌فرض نمایش داده می‌شود.',
          saveConfig: 'ذخیره تنظیمات',
          advancedControl: 'کنترل پیشرفته',
          subscriptionConverter: 'آدرس تبدیل اشتراک:',
          builtinPreferred: 'نوع ترجیحی داخلی',
          enablePreferredDomain: 'فعال‌سازی دامنه ترجیحی',
          enablePreferredIP: 'فعال‌سازی IP ترجیحی',
          enableNativeAddress: 'فعال‌سازی آدرس اصلی',
          enableGitHubPreferred: 'فعال‌سازی ترجیح سفارشی',
          allowAPIManagement: 'اجازه مدیریت API',
          regionMatching: 'تطبیق منطقه',
          downgradeControl: 'روش خروج',
          tlsControl: 'کنترل TLS',
          preferredControl: 'کنترل ترجیحی',
          saveAdvanced: 'ذخیره تنظیمات پیشرفته',
          loading: 'در حال بارگذاری...',
          currentConfig: 'پیکربندی مسیر فعلی',
          refreshConfig: 'تازه‌سازی تنظیمات',
          resetConfig: 'بازنشانی تنظیمات',
          subscriptionCopied: 'لینک اشتراک کپی شد',
          autoSubscriptionCopied: 'لینک اشتراک تشخیص خودکار کپی شد، کلاینت هنگام دسترسی بر اساس User-Agent به طور خودکار تشخیص داده و قالب مربوطه را برمی‌گرداند',
          altPasswordPlaceholder: 'خالی بگذارید تا از UUID استفاده شود',
          altPasswordHint: 'رمز عبور Trojan سفارشی را تنظیم کنید. اگر خالی بگذارید از UUID استفاده می‌شود. کلاینت به طور خودکار رمز عبور را با SHA224 هش می‌کند.',
          protocolHint: 'می‌توانید چندین پروتکل را همزمان فعال کنید. اشتراک گره‌های پروتکل‌های انتخاب شده را تولید می‌کند.<br>• VLESS WS: پروتکل استاندارد مبتنی بر WebSocket<br>• Trojan: احراز هویت با رمز عبور SHA224<br>• xhttp: پروتکل استتار مبتنی بر HTTP POST (نیاز به اتصال دامنه سفارشی و فعال‌سازی gRPC دارد)',
          alpn: 'TLS ALPN',
          alpnDefault: 'پیش‌فرض (خالی، مذاکره توسط کلاینت)',
          alpnHint: 'فقط به لینک‌های TLS اضافه می‌شود؛ اگر خالی باشد alpn نوشته نمی‌شود.',
          saveProtocol: 'ذخیره تنظیمات پروتکل',
          subscriptionConverterPlaceholder: 'پیش‌فرض: https://url.v1.mk/sub',
          subscriptionConverterHint: 'تبدیل اشتراک به صورت داخلی پیاده‌سازی شده است و نیازی به API خارجی ندارد. این فیلد فقط برای سازگاری حفظ شده و می‌توان آن را خالی گذاشت.',
          builtinPreferredHint: 'کنترل اینکه کدام گره‌های ترجیحی داخلی در اشتراک گنجانده شوند. به طور پیش‌فرض همه فعال هستند.',
          apiEnabledDefault: 'پیش‌فرض (بستن API)',
          apiEnabledYes: 'فعال‌سازی مدیریت API',
          apiEnabledHint: '⚠️ هشدار امنیتی: فعال‌سازی این گزینه اجازه می‌دهد IP های ترجیحی از طریق API به طور پویا اضافه شوند. توصیه می‌شود فقط در صورت نیاز فعال کنید.',
          regionMatchingDefault: 'پیش‌فرض (فعال‌سازی تطبیق منطقه)',
          regionMatchingNo: 'بستن تطبیق منطقه',
          regionMatchingHint: 'وقتی "بستن" تنظیم شود، تطبیق هوشمند منطقه انجام نمی‌شود',
          downgradeControlDefault: 'اولویت با پروکسی (پیش‌فرض)',
          downgradeControlNo: 'اولویت با اتصال مستقیم، در صورت خطا پروکسی',
          downgradeControlOnly: 'فقط پروکسی، بدون بازگشت',
          downgradeControlHint: 'اگر پروکسی تنظیم نشده باشد هر سه گزینه یکسان و مستقیم هستند. در حالت فقط پروکسی، اتصال ناموفق قطع می‌شود و IP خروجی فاش نمی‌شود',
          tlsControlDefault: 'پیش‌فرض (حفظ همه گره‌ها)',
          tlsControlYes: 'فقط گره‌های TLS',
          tlsControlHint: 'وقتی "فقط گره‌های TLS" تنظیم شود، فقط گره‌های با TLS تولید می‌شوند، گره‌های غیر TLS (مانند پورت 80) تولید نمی‌شوند',
          preferredControlDefault: 'پیش‌فرض (فعال‌سازی ترجیح)',
          preferredControlYes: 'بستن ترجیح',
          preferredControlHint: 'وقتی "بستن ترجیح" تنظیم شود، فقط از آدرس اصلی استفاده می‌شود، گره‌های IP و دامنه ترجیحی تولید نمی‌شوند',
          regionNames: {
              CF: '🌐 مستقیم رسمی',
              HK: '🇭🇰 هنگ کنگ',
              US: '🇺🇸 آمریکا',
              SG: '🇸🇬 سنگاپور',
              JP: '🇯🇵 ژاپن',
              KR: '🇰🇷 کره جنوبی',
              DE: '🇩🇪 آلمان',
              SE: '🇸🇪 سوئد',
              NL: '🇳🇱 هلند',
              FI: '🇫🇮 فنلاند',
              GB: '🇬🇧 بریتانیا'
            },
          terminal: 'ترمینال v1.0',
          githubProject: 'پروژه GitHub',
          PrefUtil: 'ابزار ترجیح IP',
          autoDetectClient: 'تشخیص خودکار',
          selectionLogicText: 'هم‌منطقه → منطقه مجاور → سایر مناطق',
          customIPDisabledHint: 'هنگام استفاده از ProxyIP سفارشی، انتخاب منطقه غیرفعال است',
          customIPMode: 'حالت ProxyIP سفارشی (متغیر p فعال است)',
          customIPModeDesc: 'حالت IP سفارشی (تطبیق منطقه غیرفعال است)',
          usingCustomProxyIP: 'استفاده از ProxyIP سفارشی: ',
          customIPConfig: ' (پیکربندی متغیر p)',
          customIPModeDisabled: 'حالت IP سفارشی، انتخاب منطقه غیرفعال است',
          manualRegion: 'تعیین منطقه دستی',
          manualRegionDesc: ' (تعیین دستی)',
          proxyIPAvailable: '10/10 در دسترس (دامنه پیش‌فرض ProxyIP در دسترس است)',
          smartSelection: 'انتخاب هوشمند نزدیک در حال انجام است',
          sameRegionIP: 'IP هم‌منطقه در دسترس است (1)',
          cloudflareDetection: 'اتصال مستقیم رسمی',
          detectionFailed: 'تشخیص ناموفق',
          apiTestResult: 'نتیجه تشخیص API: ',
          apiTestTime: 'زمان تشخیص: ',
          apiTestFailed: 'تشخیص API ناموفق: ',
          unknownError: 'خطای ناشناخته',
          apiTestError: 'تست API ناموفق: ',
          kvNotConfigured: 'ذخیره‌سازی KV پیکربندی نشده است، نمی‌توانید از عملکرد مدیریت تنظیمات استفاده کنید.\\n\\nلطفا در Cloudflare Workers:\\n1. فضای نام KV ایجاد کنید\\n2. متغیر محیطی C را پیوند دهید\\n3. کد را دوباره مستقر کنید',
          kvNotEnabled: 'ذخیره‌سازی KV پیکربندی نشده است',
          kvCheckFailed: 'بررسی ذخیره‌سازی KV ناموفق: خطای فرمت پاسخ',
          kvCheckFailedStatus: 'بررسی ذخیره‌سازی KV ناموفق - کد وضعیت: ',
          kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
        },
    en: {
          title: 'CFBox Subscription Manager',
          subtitle: 'Multi-client support • Smart IP selection • One-click generation • Free self-hosted',
          selectClient: 'Select Client',
          systemStatus: 'System Status',
          configManagement: 'Config Management',
          relatedLinks: 'Related Links',
          networkTest: 'Network Test',
          runNetworkTest: 'One-click Media/AI Test',
          preferredSubGen: 'Preferred Subscription Generator',
          subMode: 'Preferred Sub Mode',
          subModeOff: 'Off (use default subscription logic)',
          subModeGenerator: 'Preferred Sub Generator (Beginner-friendly)',
          subModeRandom: 'Random Preferred Mode (Official)',
          subModeCustom: 'Custom Subscription Mode (Supports aggregation)',
          modeStandard: 'Standard Mode',
          modeAdvanced: 'Advanced Mode',
          chooseOptimizeWay: 'Please choose an optimization method',
          onlineOptimize: 'Online Optimize',
          onlineOptimizeDesc: 'Real-time online optimization via browser, no installation needed',
          localOptimize: 'Local Optimize',
          localOptimizeDesc: 'Download optimization client and run it locally',
          apiOptimize: 'API Optimize',
          apiOptimizeDesc: 'Fetch preferred IP list via optimization API and append automatically',
          apiOptimizeURL: 'Optimize API URL',
          apiOptimizePort: 'Port',
          verifyApi: 'Verify API',
          appendToCustom: 'Append to Custom',
          chainProxyAddress: 'Chain Proxy Address',
          verifyChain: 'Verify Chain Proxy',
          applyChainProxy: 'Apply Chain Proxy',
          loadingTools: 'Loading tools list...',
          startGen: 'Start Generate',
          genCount: 'Generate Count',
          copyAll: 'Copy All',
          applyAll: 'Apply Results',
          testLatency: 'Test',
          closeBtn: 'Close',
          modeSwitchHint: 'Click to switch Standard/Advanced mode',
          preferredTools: 'Preferred Tools',
          startPreferred: 'Start Optimizing',
          startPreferredRunning: 'Generating & testing IPs...',
          startPreferredDone: 'Optimization complete, filled into custom list',
          startPreferredFail: 'Optimization failed, please retry',
          subscriptionInterface: 'Subscription API',
          subscriptionInterfacePlaceholder: 'https://url.v1.mk/sub',
          subscriptionInterfaceHint: 'Subscription converter URL for node format conversion',
          chainProxy: 'Chain Proxy',
          chainProxyPlaceholder: 'user:pass@host:port or http://user:pass@host:port',
          chainProxyHint: 'Outbound proxy address for forwarding all outbound traffic',
          advancedSection: 'Advanced Settings',
          subModeHint: 'Choose how to generate preferred IPs; takes effect at /sub after saving',
          subRandomCount: 'Random Preferred Count',
          subPort: 'Specified Preferred Port',
          subPortRandom: 'Random Port',
          subCustomIPs: 'Custom Preferred (one per line)',
          subCustomIPsPlaceholder: '104.16.0.1:443\nsubdomain:port#remark\nsub://preferred API\nhttps://preferred API',
          subCustomIPsHint: 'Supports IP/domain:port#remark, sub://preferred API, https://preferred API (auto aggregate & dedupe)',
          subGenerator: 'Preferred Sub Generator',
          subName: 'Subscription Name',
          subUpdateTime: 'Subscription Update Interval (hours)',
          subUpdateTimeHint: 'Client auto-refresh interval for the subscription',
          netTestHint: 'Click "One-click Media/AI Test" to check service connectivity',
          nodeSpeedTest: 'Speed Test Current Node',
          checking: 'Checking...',
          workerRegion: 'Worker Region: ',
          detectionMethod: 'Detection Method: ',
          proxyIPStatus: 'ProxyIP Status: ',
          currentIP: 'Current IP: ',
          regionMatch: 'Region Match: ',
          selectionLogic: 'Selection Logic: ',
          kvStatusChecking: 'Checking KV status...',
          kvEnabled: '✅ KV storage enabled, config management is available',
          kvDisabled: '💡 KV storage not detected (read-only mode)',
          specifyRegion: 'Region',
          autoDetect: 'Official Direct',
          saveRegion: 'Save Region Config',
          protocolSelection: 'Protocol Selection:',
          enableProtoV: 'Enable VLESS Protocol',
          enableProtoT: 'Enable Trojan Protocol',
          enableXhttp: 'Enable xhttp Protocol',
          altPassword: 'Trojan Password',
          customPath: 'Custom Path',
          customIP: 'Custom ProxyIP',
          preferredIPs: 'Preferred IP List',
          preferredIPsURL: 'Preferred IP Source URL',
          latencyTest: 'Latency Test',
          latencyTestIP: 'Test IP/Domain:',
          latencyTestIPPlaceholder: 'Enter IP or domain, separated by commas',
          latencyTestPort: 'Port:',
          startTest: 'Start Test',
          stopTest: 'Stop Test',
          testResult: 'Test Results:',
          addToYx: 'Add to Preferred List',
          addSelectedToYx: 'Add selected to Preferred List',
          selectAll: 'Select All',
          deselectAll: 'Deselect All',
          testingInProgress: 'Testing...',
          testComplete: 'Test Complete',
          latencyMs: 'Latency',
          timeout: 'Timeout',
          ipSource: 'IP Source:',
          manualInput: 'Manual Input',
          cfRandomIP: 'CF Random IP',
          urlFetch: 'URL Fetch',
          randomCount: 'Generate Count:',
          fetchURL: 'Fetch URL:',
          fetchURLPlaceholder: 'Enter preferred IP list URL',
          generateIP: 'Generate IP',
          fetchIP: 'Fetch IP',
          socks5Config: 'Proxy Config',
          customSettings: 'Custom Settings',
          customHomepage: 'Custom Homepage URL',
          customHomepagePlaceholder: 'e.g. https://example.com',
          customHomepageHint: 'Set a custom URL as the homepage disguise. Visiting the root path / will show that URL content. Leave empty to show the default terminal page.',
          saveConfig: 'Save Config',
          advancedControl: 'Advanced Control',
          subscriptionConverter: 'Subscription Converter URL:',
          builtinPreferred: 'Built-in Preferred Type',
          enablePreferredDomain: 'Enable Preferred Domain',
          enablePreferredIP: 'Enable Preferred IP',
          enableNativeAddress: 'Enable Native Address',
          enableGitHubPreferred: 'Enable Custom Preferred',
          allowAPIManagement: 'Allow API Management',
          regionMatching: 'Region Matching',
          downgradeControl: 'Outbound Mode',
          tlsControl: 'TLS Control',
          preferredControl: 'Preferred Control',
          saveAdvanced: 'Save Advanced Config',
          loading: 'Loading...',
          currentConfig: 'Current Path Config',
          refreshConfig: 'Refresh Config',
          resetConfig: 'Reset Config',
          subscriptionCopied: 'Subscription link copied',
          autoSubscriptionCopied: 'Auto-detected subscription link copied. The client will auto-detect and return the corresponding format based on User-Agent',
          altPasswordPlaceholder: 'Leave empty to use UUID',
          altPasswordHint: 'Set a custom Trojan password. Leave empty to use UUID. The client will auto-hash the password with SHA224.',
          protocolHint: 'Multiple protocols can be enabled at the same time. The subscription will generate nodes for selected protocols.<br>• VLESS WS: Standard WebSocket-based protocol<br>• Trojan: SHA224 password authentication<br>• xhttp: HTTP POST disguise protocol (requires custom domain with gRPC enabled)',
          enableECH: 'Enable ECH (Encrypted Client Hello)',
          enableECHHint: 'When enabled, the latest ECH config will be auto-fetched from DoH on each subscription refresh and added to the link',
          customDNS: 'Custom DNS Server',
          customDNSPlaceholder: 'e.g. https://223.5.5.5/dns-query',
          customDNSHint: 'DNS server address (DoH format) used for ECH config lookup',
          customECHDomain: 'Custom ECH Domain',
          customECHDomainPlaceholder: 'e.g. cloudflare-ech.com',
          customECHDomainHint: 'Domain used in the ECH config; leave empty for the default value',
          alpn: 'TLS ALPN',
          alpnDefault: 'Default (empty, negotiated by client)',
          alpnHint: 'Only added to TLS node link params; leave empty to omit alpn.',
          saveProtocol: 'Save Protocol Config',
          subscriptionConverterPlaceholder: 'Default: https://url.v1.mk/sub',
          subscriptionConverterHint: 'Subscription conversion is built-in; no external API needed. This field is kept for compatibility and can be left empty.',
          builtinPreferredHint: 'Controls which built-in preferred nodes are included in the subscription. All are enabled by default.',
          apiEnabledDefault: 'Default (API off)',
          apiEnabledYes: 'Enable API Management',
          apiEnabledHint: '⚠️ Security: enables dynamically adding preferred IPs via API. Recommended only when needed.',
          regionMatchingDefault: 'Default (region matching on)',
          regionMatchingNo: 'Disable region matching',
          regionMatchingHint: 'When set to "off", no region smart matching is performed',
          downgradeControlDefault: 'Proxy first (default)',
          downgradeControlNo: 'Direct first, fallback to proxy',
          downgradeControlOnly: 'Proxy only, no fallback',
          downgradeControlHint: 'Without a proxy, all three options behave the same (direct). Proxy-only disconnects when unreachable, so the egress IP never leaks',
          tlsControlDefault: 'Default (keep all nodes)',
          tlsControlYes: 'TLS nodes only',
          tlsControlHint: 'When set to "TLS nodes only", only TLS nodes are generated (no non-TLS nodes like port 80)',
          preferredControlDefault: 'Default (preferred on)',
          preferredControlYes: 'Disable preferred',
          preferredControlHint: 'When set to "Disable preferred", only native addresses are used (no preferred IP/domain nodes)',
          regionNames: {
              CF: '🌐 Official Direct',
              HK: '🇭🇰 Hong Kong',
              US: '🇺🇸 United States',
              SG: '🇸🇬 Singapore',
              JP: '🇯🇵 Japan',
              KR: '🇰🇷 South Korea',
              DE: '🇩🇪 Germany',
              SE: '🇸🇪 Sweden',
              NL: '🇳🇱 Netherlands',
              FI: '🇫🇮 Finland',
              GB: '🇬🇧 United Kingdom'
            },
          terminal: 'CFBox Terminal v1.0',
          githubProject: 'GitHub Project',
          PrefUtil: 'Preferred Tools',
          autoDetectClient: 'Auto Detect',
          selectionLogicText: 'Same region → Neighboring region → Other regions',
          customIPDisabledHint: 'Region selection is disabled when using a custom ProxyIP',
          customIPMode: 'Custom ProxyIP mode (p variable enabled)',
          customIPModeDesc: 'Custom IP mode (region matching disabled)',
          usingCustomProxyIP: 'Using custom ProxyIP: ',
          customIPConfig: ' (p variable config)',
          customIPModeDisabled: 'Custom IP mode, region selection disabled',
          manualRegion: 'Manual region',
          manualRegionDesc: ' (manual)',
          proxyIPAvailable: '10/10 available (ProxyIP domain presets available)',
          smartSelection: 'Smart nearest selection in progress',
          sameRegionIP: 'Same-region IP available (1)',
          cloudflareDetection: 'Official Direct',
          detectionFailed: 'Detection failed',
          apiTestResult: 'API detection result: ',
          apiTestTime: 'Detection time: ',
          apiTestFailed: 'API detection failed: ',
          unknownError: 'Unknown error',
          apiTestError: 'API test failed: ',
          kvNotConfigured: 'KV storage not configured, config management is unavailable.\\n\\nIn Cloudflare Workers:\\n1. Create a KV namespace\\n2. Bind environment variable K\\n3. Redeploy the code',
          kvNotEnabled: 'KV storage not configured',
          kvCheckFailed: 'KV storage detection failed: invalid response format',
          kvCheckFailedStatus: 'KV storage detection failed - status code: ',
          kvCheckFailedError: 'KV storage detection failed - error: '
        },
  };;
  const I18n = Local235[LangCode236] || Local235['zh'];
  const VisitorIp = Request241.headers.get('CF-Connecting-IP') || Request241.headers.get('True-Client-IP') || (Request241.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '未知';
  const PageHtml = `<!DOCTYPE html>
    <html lang="${LangVal}" dir="${(IsRtl236 ? "rtl" : "ltr")}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${I18n["title"]}</title>
<style>
            /* =========================================================
               CFBox · Aurora Glass 主题（全新设计）
               极光动态背景 + 玻璃拟态卡片 + 现代排版
               ========================================================= */
            :root {
                --bg-0: #050816;
                --bg-1: #0b1226;
                --bg-2: #0e1530;
                --surface: rgba(255,255,255,0.045);
                --surface-2: rgba(255,255,255,0.07);
                --surface-3: rgba(255,255,255,0.10);
                --border: rgba(148,163,255,0.16);
                --border-strong: rgba(129,140,248,0.42);
                --acc-1: #6366f1;
                --acc-2: #22d3ee;
                --acc-3: #a78bfa;
                --ok: #34d399;
                --warn: #fbbf24;
                --danger: #f87171;
                --text: #e4eaf7;
                --text-dim: #8ba0c8;
                --radius: 16px;
                --radius-sm: 10px;
                --shadow: 0 20px 60px rgba(0,0,0,0.45);
            }
            * { margin: 0; padding: 0; box-sizing: border-box; }
            html, body { min-height: 100%; }

            /* ---------- 背景：极光渐变 + 动态光斑 ---------- */
            body {
                font-family: "Segoe UI", "PingFang SC", "Microsoft YaHei", -apple-system, "Helvetica Neue", Arial, sans-serif;
                color: var(--text);
                min-height: 100vh;
                overflow-x: hidden;
                position: relative;
                background:
                    radial-gradient(1200px 800px at 85% -10%, rgba(99,102,241,0.22), transparent 60%),
                    radial-gradient(1000px 700px at -10% 15%, rgba(34,211,238,0.16), transparent 60%),
                    radial-gradient(900px 700px at 60% 110%, rgba(167,139,250,0.16), transparent 60%),
                    linear-gradient(160deg, var(--bg-0) 0%, var(--bg-1) 55%, #070b1d 100%);
                background-attachment: fixed;
            }
            /* 动态光斑层 */
            body::before {
                content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none;
                background:
                    radial-gradient(600px 600px at 20% 20%, rgba(99,102,241,0.14), transparent 60%),
                    radial-gradient(700px 700px at 80% 40%, rgba(34,211,238,0.10), transparent 60%),
                    radial-gradient(600px 600px at 45% 90%, rgba(167,139,250,0.12), transparent 60%);
                filter: blur(30px);
                animation: aurora-drift 18s ease-in-out infinite alternate;
            }
            @keyframes aurora-drift {
                0%   { transform: translate(0,0) scale(1); }
                50%  { transform: translate(2%, -2%) scale(1.08); }
                100% { transform: translate(-2%, 2%) scale(1.02); }
            }
            /* 隐藏旧矩阵雨 / 扫描线 */
            .matrix-bg, .matrix-code-rain { display: none !important; }
            body::after { display: none !important; }
            /* =========================================================
               进阶模式 · 霓虹科技背景（参考 edgetunnel 风格）
               ========================================================= */
            body.mode-advanced {
                background:
                    radial-gradient(900px 620px at 82% -8%, rgba(0,255,196,0.16), transparent 62%),
                    radial-gradient(820px 640px at -8% 12%, rgba(255,0,180,0.18), transparent 62%),
                    radial-gradient(760px 560px at 55% 112%, rgba(0,140,255,0.14), transparent 60%),
                    linear-gradient(160deg, #010208 0%, #050a1c 55%, #020611 100%);
                background-attachment: fixed;
            }
            body.mode-advanced::before {
                background:
                    radial-gradient(560px 560px at 22% 18%, rgba(0,255,196,0.12), transparent 62%),
                    radial-gradient(640px 640px at 78% 42%, rgba(255,0,180,0.12), transparent 62%),
                    radial-gradient(560px 560px at 42% 88%, rgba(0,140,255,0.14), transparent 62%);
                filter: blur(26px);
                animation: aurora-drift 14s ease-in-out infinite alternate;
            }
            body.mode-advanced::after {
                content: ""; display: block !important; position: fixed; inset: 0; z-index: -1; pointer-events: none;
                background:
                    linear-gradient(rgba(0,255,196,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(0,255,196,0.05) 1px, transparent 1px);
                background-size: 42px 42px;
                -webkit-mask-image: radial-gradient(ellipse at center, black 35%, transparent 78%);
                mask-image: radial-gradient(ellipse at center, black 35%, transparent 78%);
            }
            body.mode-advanced .cp-mode-toggle {
                background: linear-gradient(135deg, rgba(0,255,196,0.18), rgba(255,0,180,0.14));
                border-color: rgba(0,255,196,0.5);
            }
            body.mode-advanced .cp-mode-icon { background: #00ffc4; box-shadow: 0 0 10px #00ffc4; }
            body.mode-advanced .card {
                background: rgba(5,9,24,0.72);
                border: 1px solid rgba(0,255,196,0.22);
                box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 26px rgba(0,255,196,0.06), inset 0 1px 0 rgba(255,255,255,0.05);
            }
            body.mode-advanced .card:hover {
                border-color: rgba(255,0,180,0.5);
                box-shadow: 0 24px 64px rgba(0,0,0,0.55), 0 0 32px rgba(255,0,180,0.14);
            }
            body.mode-advanced .card-title::before { background: linear-gradient(180deg, #00ffc4, #ff00b4); }
            /* 进阶模式功能项：标准模式隐藏，进阶模式显示 */
            .advanced-item { display: none !important; }
            body.mode-advanced .advanced-item { display: block !important; }
            .advanced-section-title {
                display: flex; align-items: center; gap: 8px;
                margin: 22px 0 14px 0; padding-bottom: 8px;
                color: #00f0ff; font-size: 1.05rem; font-weight: 700;
                border-bottom: 1px dashed rgba(0,240,255,.35); letter-spacing: 0.04em;
            }
            body.mode-advanced .advanced-section-title { color: #00ffc4; border-bottom-color: rgba(0,255,196,.4); }

            /* ---------- 顶部品牌栏 ---------- */
            .cp-hud {
                position: fixed; top: 0; left: 0; right: 0; z-index: 30;
                display: flex; align-items: center; gap: 18px;
                padding: 14px 28px;
                background: rgba(10,14,32,0.55);
                backdrop-filter: blur(14px);
                -webkit-backdrop-filter: blur(14px);
                border-bottom: 1px solid var(--border);
                color: var(--text-dim);
                font-size: 0.8rem; letter-spacing: 0.08em;
            }
            .cp-hud-line { display: inline-flex; align-items: center; gap: 6px; }
            .cp-hud-label { color: var(--acc-2); font-weight: 600; }
            .cp-lang-wrapper {
                margin-left: auto; display: flex; align-items: center; gap: 8px;
            }
            .cp-lang-tag { color: var(--text-dim); font-size: 0.75rem; letter-spacing: 0.1em; }
            /* ---------- 模式切换按钮 ---------- */
            .cp-mode-toggle {
                display: inline-flex; align-items: center; gap: 8px;
                background: linear-gradient(135deg, rgba(99,102,241,0.18), rgba(34,211,238,0.12));
                color: var(--text); border: 1px solid var(--border-strong); border-radius: 20px;
                padding: 6px 16px; font-size: 0.82rem; font-weight: 600; cursor: pointer;
                transition: all .2s ease; letter-spacing: 0.04em; white-space: nowrap;
            }
            .cp-mode-toggle:hover { box-shadow: 0 0 0 3px rgba(34,211,238,0.18); transform: translateY(-1px); }
            .cp-mode-icon {
                display: inline-flex; width: 16px; height: 16px; align-items: center; justify-content: center;
                border-radius: 50%; background: var(--acc-2); color: #050816;
                font-size: 0.7rem; font-weight: 800; box-shadow: 0 0 8px var(--acc-2);
            }
            #languageSelector {
                background: var(--surface-2); color: var(--text);
                border: 1px solid var(--border); border-radius: 8px;
                padding: 6px 12px; font-size: 0.85rem; cursor: pointer; outline: none;
            }
            #languageSelector:hover { border-color: var(--border-strong); }
            .cp-fx-toggle {
                display: inline-flex; align-items: center; gap: 8px;
                background: var(--surface-2); color: var(--text);
                border: 1px solid var(--border); border-radius: 20px;
                padding: 6px 14px; font-size: 0.8rem; cursor: pointer;
                transition: all .2s ease;
            }
            .cp-fx-toggle:hover { border-color: var(--acc-2); box-shadow: 0 0 0 3px rgba(34,211,238,0.15); }
            .cp-fx-dot {
                width: 8px; height: 8px; border-radius: 50%;
                background: var(--ok); box-shadow: 0 0 8px var(--ok);
            }

            /* ---------- 容器与头部 ---------- */
            .container {
                max-width: 1160px; margin: 0 auto; padding: 96px 24px 60px;
                position: relative; z-index: 2;
                display: grid;
                grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
                gap: 26px;
                align-items: start;
            }
            /* 左右分栏：配置管理在左，选择客户端/系统状态/相关链接在右；
               右侧三卡片随左侧配置卡下拉分布，卡片保持自然高度、不拉伸留白 */
            .container > .header { grid-column: 1 / -1; }
            .container > .left-column {
                grid-column: 1;
                display: flex; flex-direction: column;
                gap: 18px;
                min-width: 0;
            }
            .container > .right-column {
                grid-column: 2;
                display: flex; flex-direction: column;
                gap: 18px;
                min-width: 0;
            }
            .container > .left-column > .card,
            .container > .right-column > .card { margin-bottom: 0; }
            .card-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 18px;
            }
            .card-row > .card { margin-bottom: 0; min-width: 0; }
            .advanced-module { display: none; }
            body.mode-advanced .advanced-module { display: block !important; }
            @media (max-width: 900px) {
                .container { grid-template-columns: 1fr; }
                .container > .header, .container > .left-column, .container > .right-column { grid-column: 1; grid-row: auto; }
                .card-row { grid-template-columns: 1fr; }
            }
            .header { text-align: center; margin-bottom: 40px; }
            .title {
                font-size: clamp(1.9rem, 4vw, 3rem);
                font-weight: 800; letter-spacing: 0.02em;
                background: linear-gradient(120deg, #a5b4fc 0%, #22d3ee 50%, #a78bfa 100%);
                -webkit-background-clip: text; background-clip: text;
                -webkit-text-fill-color: transparent; color: transparent;
                text-shadow: none;
                position: relative;
            }
            .subtitle {
                margin-top: 12px; color: var(--text-dim); font-size: 1rem;
                letter-spacing: 0.03em;
            }

            /* ---------- 玻璃卡片 ---------- */
            .card {
                background: var(--surface);
                backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
                border: 1px solid var(--border);
                border-radius: var(--radius);
                box-shadow: var(--shadow), inset 0 1px 0 rgba(255,255,255,0.06);
                padding: 28px;
                margin-bottom: 26px;
                transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
            }
            .card:hover {
                border-color: var(--border-strong);
                transform: translateY(-2px);
                box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08);
            }
            .card-title {
                font-size: 1.15rem; font-weight: 700; margin-bottom: 18px;
                color: var(--text); display: flex; align-items: center; gap: 10px;
            }
            .card-title::before {
                content: ""; width: 4px; height: 18px; border-radius: 3px;
                background: linear-gradient(180deg, var(--acc-1), var(--acc-2));
            }

            /* ---------- 客户端按钮网格 ---------- */
            .client-grid {
                display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 12px; margin-bottom: 20px;
            }
            .client-btn {
                padding: 14px 10px; border-radius: var(--radius-sm);
                background: linear-gradient(135deg, rgba(99,102,241,0.16), rgba(34,211,238,0.10));
                border: 1px solid var(--border);
                color: var(--text); font-size: 0.95rem; font-weight: 600;
                letter-spacing: 0.04em; cursor: pointer;
                transition: all .2s ease; position: relative; overflow: hidden;
            }
            .client-btn:hover {
                border-color: var(--acc-2);
                background: linear-gradient(135deg, rgba(99,102,241,0.30), rgba(34,211,238,0.20));
                transform: translateY(-2px);
                box-shadow: 0 10px 24px rgba(34,211,238,0.18);
            }
            .client-btn:active { transform: translateY(0); }
            .subscription-url {
                margin-top: 18px; padding: 16px 18px; border-radius: var(--radius-sm);
                background: rgba(6,10,26,0.6);
                border: 1px dashed var(--border-strong);
                font-family: "JetBrains Mono", "Fira Code", Consolas, monospace;
                font-size: 0.85rem; color: var(--text);
                word-break: break-all; white-space: pre-wrap;
            }

            /* ---------- 表单控件 ---------- */
            input[type="text"], input[type="number"], input[type="password"], textarea, select {
                background: rgba(6,10,26,0.7) !important;
                color: var(--text) !important;
                border: 1px solid var(--border) !important;
                border-radius: var(--radius-sm) !important;
                padding: 10px 14px !important;
                font-size: 0.92rem !important;
                font-family: inherit !important;
                outline: none !important;
                transition: border-color .2s ease, box-shadow .2s ease;
            }
            input[type="text"]:focus, input[type="number"]:focus, textarea:focus, select:focus {
                border-color: var(--acc-2) !important;
                box-shadow: 0 0 0 3px rgba(34,211,238,0.18);
            }
            select { cursor: pointer; }
            label { color: var(--text) !important; font-weight: 600 !important; }
            small { color: var(--text-dim) !important; font-size: 0.82rem !important; }
            input[type="checkbox"] {
                accent-color: var(--acc-1); width: 17px; height: 17px; cursor: pointer;
            }

            /* ---------- 系统状态 / KV 状态面板（覆盖内联样式） ---------- */
            #systemStatus, #kvStatus {
                margin: 20px 0 !important; padding: 18px !important;
                background: var(--surface-2) !important;
                border: 1px solid var(--border) !important;
                border-radius: var(--radius-sm) !important;
                font-family: inherit !important;
            }
            #regionStatus, #backupStatus, #currentIP, #echStatus, #regionMatch,
            #pathTypeStatus, #pathTypeInfo, #currentConfig, #selectionLogic, #geoInfo,
            #cpActionStatus, #statusMessage {
                color: var(--text) !important;
                font-family: inherit !important;
                text-shadow: none !important;
            }
            #regionStatus, #backupStatus, #currentIP, #echStatus, #regionMatch, #pathTypeStatus {
                font-weight: 600;
            }
            #selectionLogic, #geoInfo { color: var(--text-dim) !important; }
            [style*="color: #00f0ff"] { color: var(--text) !important; }
            [style*="color:#00f0ff"] { color: var(--text) !important; }
            [style*="color: #7aa9c4"] { color: var(--text-dim) !important; }
            [style*="color:#7aa9c4"] { color: var(--text-dim) !important; }
            [style*="text-shadow: 0 0 5px #00f0ff"] { text-shadow: none !important; }
            [style*="text-shadow:0 0 5px #00f0ff"] { text-shadow: none !important; }
            [style*="text-shadow: 0 0 3px #00f0ff"] { text-shadow: none !important; }
            [style*="background: rgba(8, 4, 28, 0.8)"] { background: var(--surface-2) !important; }
            [style*="background: rgba(15, 3, 40, 0.6)"] { background: var(--surface-2) !important; }
            [style*="background: rgba(0, 0, 0, 0.8)"] { background: rgba(6,10,26,0.7) !important; }
            [style*="border: 2px solid #00f0ff"] { border: 1px solid var(--border) !important; }
            [style*="border:2px solid #00f0ff"] { border: 1px solid var(--border) !important; }
            [style*="border: 1px solid #00f0ff"] { border: 1px solid var(--border) !important; }
            [style*="border:1px solid #00f0ff"] { border: 1px solid var(--border) !important; }
            [style*="border-radius: 5px"] { border-radius: var(--radius-sm) !important; }
            [style*="font-family: 'Courier New', monospace"] { font-family: inherit !important; }
            [style*="font-weight: bold"] { font-weight: 700 !important; }

            /* ---------- 悬浮操作栏 / FAB ---------- */
            .cp-action-bar {
                position: fixed; right: 26px; bottom: 26px; z-index: 40;
                display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
            }
            .cp-action-btn, .cp-fab-save {
                display: inline-flex; align-items: center; gap: 8px;
                background: linear-gradient(135deg, var(--acc-1), var(--acc-2));
                color: #fff !important; border: none; border-radius: 24px;
                padding: 12px 22px; font-size: 0.92rem; font-weight: 700;
                cursor: pointer; box-shadow: 0 12px 30px rgba(99,102,241,0.35);
                transition: transform .2s ease, box-shadow .2s ease;
            }
            .cp-action-btn:hover, .cp-fab-save:hover { transform: translateY(-2px); box-shadow: 0 16px 36px rgba(99,102,241,0.45); }
            .cp-action-btn-danger { background: linear-gradient(135deg, var(--danger), #f59e0b) !important; }
            .cp-fab-dot { width: 8px; height: 8px; border-radius: 50%; background: #fff; }
            .cp-fab-icon { font-size: 1.1rem; }
            .cp-btn-label { font-size: 0.85rem; }
            .cp-action-status {
                display: none;
                position: fixed; top: 78px; right: 24px; z-index: 9999;
                background: var(--surface-2); border: 1px solid var(--border);
                padding: 6px 12px; border-radius: 12px; font-size: 0.8rem; color: var(--text-dim);
            }
            .cp-action-status.cp-show { display: block; }
            .cp-action-status.cp-err { color: #ff6b6b; border-color: #ff6b6b; }
            .cp-toast-stack {
                position: fixed; top: 78px; right: 24px; z-index: 60;
                display: flex; flex-direction: column; gap: 10px;
            }
            .cp-toast {
                background: var(--surface-2) !important;
                border: 1px solid var(--border-strong) !important;
                border-radius: 12px !important;
                color: var(--text) !important;
                padding: 12px 18px !important; font-size: 0.88rem !important;
                box-shadow: var(--shadow);
                backdrop-filter: blur(10px);
                animation: toast-in .25s ease;
            }
            @keyframes toast-in { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: none; } }

            /* ---------- 结果列表 ---------- */
            #latencyTestResults, #latencyResultsList {
                border: 1px solid var(--border) !important;
                border-radius: var(--radius-sm) !important;
                background: var(--surface-2) !important;
            }
            #latencyTestStatus { color: var(--text-dim); }

            /* ---------- 响应式 ---------- */
            @media (max-width: 720px) {
                .container { padding: 84px 16px 40px; }
                .cp-hud { padding: 12px 16px; gap: 10px; flex-wrap: wrap; }
                .cp-hud-line:nth-child(3) { display: none; }
                .client-grid { grid-template-columns: repeat(2, 1fr); }
                .card { padding: 20px; }
            }
        </style>
    </head>
    <body>
        <div class="matrix-bg"></div>
        <div class="matrix-code-rain" id="matrixCodeRain"></div>
            <div class="cp-hud">
                <span class="cp-hud-line">${((LangCode236 === "fa") ? "آدرس IP فعلی شما" : ((LangCode236 === "en") ? "Your current IP address" : "您当前IP地址"))}：${VisitorIp}<span id="currentIPRegion" style="color: #ffb400;"></span></span>
                <div class="cp-lang-wrapper">
                    <button type="button" id="cpModeToggle" class="cp-mode-toggle" onclick="SwitchMode()" title="${I18n["modeSwitchHint"]}">
                        <span class="cp-mode-icon" id="cpModeIcon">◆</span>
                        <span id="cpModeLabel">${I18n["modeStandard"]}</span>
                    </button>
                    <select id="languageSelector" onchange="SwitchLang(this.value)">
                        <option value="zh" ${((LangCode236 === "zh") ? "selected" : "")}>🇨🇳 中文</option>
                        <option value="fa" ${((LangCode236 === "fa") ? "selected" : "")}>🇮🇷 فارسی</option>
                        <option value="en" ${((LangCode236 === "en") ? "selected" : "")}>🇺🇸 English</option>
                    </select>
                </div>
            </div>
        <script>
            // 当前IP地区检测 (ping0.cc JSONP, script 加载不受 CORS 限制)
            window.cfboxRegionCallback = function (ip, loc, asn, org, cc) {
                var el = document.getElementById('currentIPRegion');
                if (el && loc) el.textContent = ' · ' + loc;
            };
            (function () {
                try {
                    var s = document.createElement('script');
                    s.src = 'https://ipv4.ping0.cc/geo/jsonp/cfboxRegionCallback';
                    s.async = true;
                    (document.head || document.documentElement).appendChild(s);
                } catch (e) {}
            })();
        </script>
        <div class="container">
            <div class="header">
                    <h1 class="title cp-glitch" data-text="${I18n["title"]}">${I18n["title"]}</h1>
                    <p class="subtitle">${I18n["subtitle"]}</p>
            </div>
            <div class="left-column">
<div class="card panel-right-card">
                    <h2 class="card-title">${I18n["systemStatus"]}</h2>
                <div id="systemStatus" style="margin: 20px 0; padding: 15px; background: rgba(8, 4, 28, 0.8); border: 2px solid #00f0ff; box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.1); position: relative; overflow: hidden;">
                        <div style="color: #00f0ff; margin-bottom: 15px; font-weight: bold; text-shadow: 0 0 5px #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem;">${I18n["checking"]}</div>
                        <div id="regionStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${I18n["workerRegion"]}${I18n["checking"]}</div>
                        <div id="geoInfo" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${I18n["detectionMethod"]}${I18n["checking"]}</div>
                        <div id="backupStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${I18n["proxyIPStatus"]}${I18n["checking"]}</div>
                        <div id="currentIP" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${I18n["currentIP"]}${I18n["checking"]}</div>
                        <div id="echStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">ECH状态: ${I18n["checking"]}</div>
                        <div id="regionMatch" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${I18n["regionMatch"]}${I18n["checking"]}</div>
                        <div id="selectionLogic" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${I18n["selectionLogic"]}${I18n["selectionLogicText"]}</div>
                </div>
                </div>
<div class="card" id="configCard" style="display: none;">
                    <h2 class="card-title">${I18n["configManagement"]}</h2>
                <div id="kvStatus" style="margin-bottom: 20px; padding: 10px; background: rgba(8, 4, 28, 0.8); border: 1px solid #00f0ff; color: #00f0ff;">
                    ${I18n["kvStatusChecking"]}
                </div>
                <div id="configContent" style="display: none;">
                    <form id="regionForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["specifyRegion"]}</label>
                            <select id="wkRegion" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${I18n["autoDetect"]}</option>
                                    <option value="HK">${I18n["regionNames"]["HK"]}</option>
                                    <option value="US">${I18n["regionNames"]["US"]}</option>
                                    <option value="SG">${I18n["regionNames"]["SG"]}</option>
                                    <option value="JP">${I18n["regionNames"]["JP"]}</option>
                                    <option value="KR">${I18n["regionNames"]["KR"]}</option>
                                    <option value="DE">${I18n["regionNames"]["DE"]}</option>
                                    <option value="SE">${I18n["regionNames"]["SE"]}</option>
                                    <option value="NL">${I18n["regionNames"]["NL"]}</option>
                                    <option value="FI">${I18n["regionNames"]["FI"]}</option>
                                    <option value="GB">${I18n["regionNames"]["GB"]}</option>
                            </select>
                                <small id="wkRegionHint" style="color: #7aa9c4; font-size: 0.85rem; display: none;">⚠️ ${I18n["customIPDisabledHint"]}</small>
                        </div>
                    </form>
                    <form id="otherConfigForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["protocolSelection"]}</label>
                            <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="ev" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${I18n["enableProtoV"]}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="et" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${I18n["enableProtoT"]}</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="ex" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${I18n["enableXhttp"]}</span>
                                    </label>
                                </div>
                                <div class="advanced-item" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 240, 255, 0.3);">
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ech" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                                <span style="font-size: 1.1rem;">${I18n["enableECH"]}</span>
                                        </label>
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px; margin-left: 26px;">${I18n["enableECHHint"]}</small>
                                    </div>
                                    <div style="margin-top: 15px; margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${I18n["customDNS"]}</label>
                                        <input type="text" id="customDNS" placeholder="${I18n["customDNSPlaceholder"]}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${I18n["customDNSHint"]}</small>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${I18n["customECHDomain"]}</label>
                                        <input type="text" id="customECHDomain" placeholder="${I18n["customECHDomainPlaceholder"]}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${I18n["customECHDomainHint"]}</small>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${I18n["alpn"]}</label>
                                        <select id="alpn" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                            <option value="">${I18n["alpnDefault"]}</option>
                                            <option value="h3">h3</option>
                                            <option value="h2">h2</option>
                                            <option value="http/1.1">http/1.1</option>
                                            <option value="h3,h2">h3,h2</option>
                                            <option value="h2,http/1.1">h2,http/1.1</option>
                                            <option value="h3,h2,http/1.1">h3,h2,http/1.1</option>
                                        </select>
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${I18n["alpnHint"]}</small>
                                    </div>
                                </div>
                                <div class="advanced-item" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 240, 255, 0.3);">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${I18n["altPassword"]}</label>
                                        <input type="text" id="tp" placeholder="${I18n["altPasswordPlaceholder"]}" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${I18n["altPasswordHint"]}</small>
                                </div>
                                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">${I18n["protocolHint"]}</small>
                            </div>
                        </div>
                        </form>


                    <div id="currentConfig" style="display:none; background: rgba(0, 0, 0, 0.9); border: 1px solid #00f0ff; padding: 15px; margin: 10px 0; font-family: 'Courier New', monospace; color: #00f0ff;">
                            ${I18n["loading"]}
                    </div>
                </div>
                <div id="statusMessage" style="display: none; padding: 10px; margin: 10px 0; border: 1px solid #00f0ff; background: rgba(8, 4, 28, 0.8); color: #00f0ff; text-shadow: 0 0 5px #00f0ff;"></div>
            </div>
<div class="card panel-right-card" id="preferredSubCard">
                <h2 class="card-title" style="margin:0;">${I18n["preferredSubGen"]}</h2>
                <div style="margin-top:14px;border-top:1px solid rgba(0,240,255,.15);padding-top:12px;">
                    <div style="margin-bottom:12px;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["subMode"]}</label>
                        <select id="subMode" onchange="UpdateSubModeUi()" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;cursor:pointer;">
                            <option value="">${I18n["subModeOff"]}</option>
                            <option value="generator">${I18n["subModeGenerator"]}</option>
                            <option value="random">${I18n["subModeRandom"]}</option>
                            <option value="custom" selected>${I18n["subModeCustom"]}</option>
                        </select>
                        <small style="color:#7aa9c4;font-size:0.8rem;display:block;margin-top:5px;">${I18n["subModeHint"]}</small>
                    </div>
                    <div id="subRandomSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["subRandomCount"]}</label>
                        <input type="number" id="subRandomCount" value="16" min="1" max="99" oninput="if(this.value>99){this.value=99;}" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                    </div>
                    <div id="subPortSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["subPort"]}</label>
                        <select id="subPort" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;cursor:pointer;">
                            <option value="-1">${I18n["subPortRandom"]}</option>
                            <option value="443">443</option>
                            <option value="2053">2053</option>
                            <option value="2083">2083</option>
                            <option value="2087">2087</option>
                            <option value="2096">2096</option>
                            <option value="8443">8443</option>
                        </select>
                    </div>
                    <div id="subCustomSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["subCustomIPs"]}</label>
                        <textarea id="subCustomIPs" rows="4" placeholder="${I18n["subCustomIPsPlaceholder"]}" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;resize:vertical;">
https://bestcf.pages.dev/random-region/HK/100.txt
https://bestcf.pages.dev/random-region/TW/100.txt
https://bestcf.pages.dev/random-region/JP/100.txt
https://bestcf.pages.dev/random-region/SG/100.txt
https://bestcf.pages.dev/random-region/US/100.txt
bestcf.030101.xyz#Mingyu维护
cdn.2020111.xyz
cdns.doon.eu.org
cf.0sm.com
cf.877771.xyz
cf.877774.xyz#秋名山维护
cf.900501.xyz
cfip.1323123.xyz
cfip.cfcdn.vip
cfip.xxxxxxxx.tk#OTC维护
cloudflare.182682.xyz#WeTest.Vip维护
cloudflare-dl.byoip.top
cloudflare-ip.mofashi.ltd
fn.130519.xyz
freeyx.cloudflare88.eu.org
nrt.xxxxxxxx.nyc.mn
nrtcfdns.zone.id
saas.sin.fan
tencentapp.cn#ktff维护
xn--b6gac.eu.org
777.ai7777777.xyz
</textarea>
                        <small style="color:#7aa9c4;font-size:0.8rem;display:block;margin-top:5px;">${I18n["subCustomIPsHint"]}</small>
                    </div>
                    <div id="subGeneratorSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["subGenerator"]}</label>
                        <input type="text" id="subGenerator" placeholder="sub.cmliussss.net" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["subName"]}</label>
                        <input type="text" id="subName" placeholder="CFBox" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["subUpdateTime"]}</label>
                        <input type="number" id="subUpdateTime" value="3" min="1" max="168" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                        <small style="color:#7aa9c4;font-size:0.8rem;display:block;margin-top:5px;">${I18n["subUpdateTimeHint"]}</small>
                    </div>
                </div>
            </div>
<div class="card advanced-module" id="customSettingsCard" style="display:none;">
  <h2 class="card-title">${I18n["customSettings"]}</h2>
  <div style="margin-bottom:15px;">
    <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["customHomepage"]}</label>
    <input type="text" id="customHomepage" placeholder="${I18n["customHomepagePlaceholder"]}" style="width:100%;padding:12px;background:rgba(0,0,0,.8);border:2px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:14px;box-sizing:border-box;">
    <small style="color:#7aa9c4;font-size:0.85rem;display:block;margin-top:4px;">${I18n["customHomepageHint"]}</small>
  </div>
  <div style="margin-bottom:15px;">
    <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["customPath"]}</label>
    <input type="text" id="customPath" placeholder="${((LangCode236 === "fa") ? "مثال: /mypath یا خالی بگذارید تا از UUID استفاده شود" : ((LangCode236 === "en") ? "e.g. /mypath or leave empty to use UUID" : "例如: /mypath 或留空使用 UUID"))}" style="width:100%;padding:12px;background:rgba(0,0,0,.8);border:2px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:14px;box-sizing:border-box;">
    <small style="color:#7aa9c4;font-size:0.85rem;display:block;margin-top:4px;">${((LangCode236 === "fa") ? "مسیر اشتراک سفارشی. اگر خالی بگذارید از UUID به عنوان مسیر استفاده می‌شود." : ((LangCode236 === "en") ? "Custom subscription path. Leave empty to use UUID as the path." : "自定义订阅路径。留空则使用 UUID 作为路径。"))}</small>
  </div>
  <div>
    <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${I18n["customIP"]}</label>
    <input type="text" id="customIP" placeholder="${((LangCode236 === "fa") ? "مثال: 1.2.3.4:443" : ((LangCode236 === "en") ? "e.g. 1.2.3.4:443" : "例如: 1.2.3.4:443"))}" style="width:100%;padding:12px;background:rgba(0,0,0,.8);border:2px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:14px;box-sizing:border-box;">
    <small style="color:#7aa9c4;font-size:0.85rem;display:block;margin-top:4px;">${((LangCode236 === "fa") ? "آدرس و پورت ProxyIP سفارشی" : ((LangCode236 === "en") ? "Custom ProxyIP address and port" : "自定义ProxyIP地址和端口"))}</small>
  </div>
</div>
</div>
<div class="right-column">
<div class="card panel-right-card">
                    <h2 class="card-title">${I18n["selectClient"]}</h2>
                <div class="client-grid">
                    <button class="client-btn" onclick="BuildClientLink('clash', 'CLASH')">CLASH</button>
                    <button class="client-btn" onclick="BuildClientLink('clash', 'STASH')">STASH</button>
                    <button class="client-btn" onclick="BuildClientLink('surge', 'SURGE')">SURGE</button>
                    <button class="client-btn" onclick="BuildClientLink('singbox', 'SING-BOX')">SING-BOX</button>
                    <button class="client-btn" onclick="BuildClientLink('loon', 'LOON')">LOON</button>
                    <button class="client-btn" onclick="BuildClientLink('quanx', 'QUANTUMULT X')">QUANTUMULT X</button>
                    <button class="client-btn" onclick="BuildClientLink('v2ray', 'V2RAY')">V2RAY</button>
                    <button class="client-btn" onclick="BuildClientLink('v2ray', 'V2RAYNG')">V2RAYNG</button>
                    <button class="client-btn" onclick="BuildClientLink('v2ray', 'NEKORAY')">NEKORAY</button>
                    <button class="client-btn" onclick="BuildClientLink('v2ray', 'Shadowrocket')">Shadowrocket</button>
                </div>
                <div class="subscription-url" id="clientSubscriptionUrl"></div>
            </div>
<div class="card-row">
<div class="card panel-right-card" id="builtinPreferredCard" style="display:none;">
                <h2 class="card-title">${I18n["builtinPreferred"]}</h2>
                <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="ena" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${I18n["enableNativeAddress"]}</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="epd" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${I18n["enablePreferredDomain"]}</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="epi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${I18n["enablePreferredIP"]}</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="egi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${I18n["enableGitHubPreferred"]}</span>
                        </label>
                    </div>
                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">${I18n["builtinPreferredHint"]}</small>
                </div>
            </div>
<div class="card panel-right-card" id="preferredFilterCard" style="display:none;">
                <h2 class="card-title">优选IP筛选设置</h2>
                <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                    <div style="margin-bottom: 15px;">
                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">IP版本选择</label>
                        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                            <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                <input type="checkbox" id="ipv4Enabled" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 1rem;">IPv4</span>
                            </label>
                            <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                <input type="checkbox" id="ipv6Enabled" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 1rem;">IPv6</span>
                            </label>
                        </div>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">运营商选择</label>
                        <div style="display: flex; gap: 20px; flex-wrap: wrap;">
                            <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                <input type="checkbox" id="ispMobile" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 1rem;">移动</span>
                            </label>
                            <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                <input type="checkbox" id="ispUnicom" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 1rem;">联通</span>
                            </label>
                            <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                <input type="checkbox" id="ispTelecom" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 1rem;">电信</span>
                            </label>
                        </div>
                    </div>
                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">选择要使用的IP版本和运营商，未选中的将被过滤</small>
                </div>
            </div>
</div>
<div class="card advanced-module" id="advancedControlCard" style="display:none;">

                    <h2 class="card-title">${I18n["advancedControl"]}</h2>
                    <form id="advancedConfigForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["subscriptionConverter"]}</label>
                                <input type="text" id="scu" placeholder="${I18n["subscriptionConverterPlaceholder"]}" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${I18n["subscriptionConverterHint"]}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["allowAPIManagement"]}</label>
                            <select id="apiEnabled" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${I18n["apiEnabledDefault"]}</option>
                                    <option value="yes">${I18n["apiEnabledYes"]}</option>
                            </select>
                                <small style="color: #ffb400; font-size: 0.85rem;">${I18n["apiEnabledHint"]}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["regionMatching"]}</label>
                            <select id="regionMatching" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${I18n["regionMatchingDefault"]}</option>
                                    <option value="no">${I18n["regionMatchingNo"]}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${I18n["regionMatchingHint"]}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["downgradeControl"]}</label>
                            <select id="downgradeControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${I18n["downgradeControlDefault"]}</option>
                                    <option value="no">${I18n["downgradeControlNo"]}</option>
                                    <option value="only">${I18n["downgradeControlOnly"]}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${I18n["downgradeControlHint"]}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["tlsControl"]}</label>
                            <select id="portControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${I18n["tlsControlDefault"]}</option>
                                    <option value="yes">${I18n["tlsControlYes"]}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${I18n["tlsControlHint"]}</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${I18n["preferredControl"]}</label>
                            <select id="preferredControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${I18n["preferredControlDefault"]}</option>
                                    <option value="yes">${I18n["preferredControlYes"]}</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${I18n["preferredControlHint"]}</small>
                        </div>
                    </form>
                    </div>
<div class="card panel-right-card">
                <h2 class="card-title" style="margin:0;">${I18n["networkTest"]}</h2>
                <div id="netTestResults" style="display:none;margin-top:12px;font-family:'Courier New',monospace;font-size:0.86rem;">
                    <div style="color:#7aa9c4;text-align:center;padding:8px 0;">${I18n["netTestHint"]}</div>
                </div>
                <div style="margin-top:14px;border-top:1px solid rgba(0,240,255,.15);padding-top:12px;">
                    <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                        <button type="button" id="netTestBtn" onclick="RunNetTest()" style="background:linear-gradient(90deg,#00f0ff,#a347ff);color:#000;border:none;border-radius:8px;padding:7px 16px;font-weight:bold;cursor:pointer;font-size:0.84rem;">${I18n["runNetworkTest"]}</button>
                        <button type="button" id="nodeSpeedBtn" onclick="SpeedtestNode()" style="background:linear-gradient(90deg,#00f0ff,#a347ff);color:#000;border:none;border-radius:8px;padding:7px 16px;font-weight:bold;cursor:pointer;font-size:0.84rem;">${I18n["nodeSpeedTest"]}</button>
                    </div>
                    <div id="nodeSpeedResult" style="margin-top:10px;font-family:'Courier New',monospace;font-size:0.86rem;text-align:center;"></div>
                </div>

            </div><div class="card panel-right-card">
                <h2 class="card-title">${I18n["currentConfig"]}</h2>
                <div id="pathTypeInfo" style="background: transparent; border: 1px solid #00f0ff; padding: 15px; font-family: 'Courier New', monospace; color: #00f0ff;">
                    <div id="pathTypeStatus">${I18n["checking"]}</div>
                </div>
            </div>
<div class="card panel-right-card">
                    <h2 class="card-title">${I18n["relatedLinks"]}</h2>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://www.youtube.com/@PAI_CN" target="_blank" rel="noopener noreferrer" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">YouTube @PAI_CN</a>
                    <a href="https://t.me/SZ_PAI" target="_blank" rel="noopener noreferrer" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">Telegram @SZ_PAI</a>
                </div>
            </div>
</div>


        </div>
        <div id="cpToastStack" class="cp-toast-stack" aria-live="polite" aria-atomic="false"></div>
        <div id="cpActionStatus" class="cp-action-status" role="status" aria-live="polite"></div>
        <div id="cpActionBar" class="cp-action-bar" role="toolbar" aria-label="${I18n["configManagement"]}">
            <button type="button" id="cpBtnSaveAll" class="cp-fab-save" title="${((LangCode236 === "fa") ? "ذخیره همه تنظیمات" : ((LangCode236 === "en") ? "Save all settings (Ctrl+S)" : "保存所有配置 (Ctrl+S)"))}">
                <span class="cp-fab-icon">▣</span>
                <span>${((LangCode236 === "fa") ? "ذخیره همه" : ((LangCode236 === "en") ? "Save All" : "保 存 全 部"))}</span>
                <span class="cp-fab-dot" aria-hidden="true"></span>
            </button>
            <button type="button" id="cpBtnRefresh" class="cp-action-btn" data-tip="${I18n["refreshConfig"]}" aria-label="${I18n["refreshConfig"]}">
                <span aria-hidden="true">↻</span>
                <span class="cp-btn-label">${I18n["refreshConfig"]}</span>
            </button>
            <button type="button" id="cpBtnReset" class="cp-action-btn cp-action-btn-danger" data-tip="${I18n["resetConfig"]}" aria-label="${I18n["resetConfig"]}">
                <span aria-hidden="true">⌫</span>
                <span class="cp-btn-label">${I18n["resetConfig"]}</span>
            </button>
        </div>
        <script>
// 地址从服务器配置注入


// 翻译对象
const Local20215 = {
  zh: {
    subscriptionCopied: '订阅链接已复制',
    autoSubscriptionCopied: '自动识别订阅链接已复制，客户端访问时会根据User-Agent自动识别并返回对应格式'
  },
  fa: {
    subscriptionCopied: 'لینک اشتراک کپی شد',
    autoSubscriptionCopied: 'لینک اشتراک تشخیص خودکار کپی شد، کلاینت هنگام دسترسی بر اساس User-Agent به طور خودکار تشخیص داده و قالب مربوطه را برمی‌گرداند'
  },
  en: {
    subscriptionCopied: "Subscription link copied",
    autoSubscriptionCopied: "Auto-detected subscription link copied. The client will auto-detect and return the corresponding format based on User-Agent"
  }
};
function GetCookie20214(Name20213) {
  const Val20212 = '; ' + document.cookie;
  const Parts20211 = Val20212.split('; ' + Name20213 + '=');
  if (Parts20211.length === 2) return Parts20211.pop().split(';').shift();
  return null;
}
const BrowserLang20210 = navigator.language || navigator.userLanguage || '';
const SavedLang20209 = localStorage.getItem('preferredLanguage') || GetCookie20214('preferredLanguage');
let LangCode20208 = 'zh';
if (SavedLang20209 === 'fa' || SavedLang20209 === 'fa-IR') {
  LangCode20208 = 'fa';
} else if (SavedLang20209 === 'en' || SavedLang20209 === 'en-US' || SavedLang20209 === 'en-GB') {
  LangCode20208 = 'en';
} else if (SavedLang20209 === 'zh' || SavedLang20209 === 'zh-CN') {
  LangCode20208 = 'zh';
} else {
  if (BrowserLang20210.includes('fa') || BrowserLang20210.includes('fa-IR')) {
    LangCode20208 = 'fa';
  } else if (BrowserLang20210.includes('en')) {
    LangCode20208 = 'en';
  } else {
    LangCode20208 = 'zh';
  }
}
const I18n20207 = Local20215[LangCode20208] || Local20215['zh'];
function SwitchLang(Lang) {
  localStorage.setItem('preferredLanguage', Lang);
  // 设置Cookie（有效期1年）
  const Expiry20206 = new Date();
  Expiry20206.setFullYear(Expiry20206.getFullYear() + 1);
  document.cookie = 'preferredLanguage=' + Lang + '; path=/; expires=' + Expiry20206.toUTCString() + '; SameSite=Lax';
  // 刷新页面，不使用URL参数
  window.location.reload();
}

// ===== 标准 / 进阶模式切换 =====
function SwitchMode() {
  document.body.classList.toggle('mode-advanced');
  localStorage.setItem('cfboxMode', document.body.classList.contains('mode-advanced') ? 'advanced' : 'standard');
  UpdateModeBtn();
}
function UpdateModeBtn() {
  const label = document.getElementById('cpModeLabel');
  const icon = document.getElementById('cpModeIcon');
  const XXX3 = document.body.classList.contains('mode-advanced');
  if (label) label.textContent = XXX3 ? '${I18n["modeAdvanced"]}' : '${I18n["modeStandard"]}';
  if (icon) icon.textContent = XXX3 ? '✦' : '◆';
}
(function InitMode() {
  try {
    if (localStorage.getItem('cfboxMode') === 'advanced') document.body.classList.add('mode-advanced');
  } catch (e) {}
  UpdateModeBtn();
})();


function ClosePrefWay() {
  const Overlay = document.getElementById('optimizeToolOverlay');
  if (Overlay) Overlay.style.display = 'none';
}
function OpenOnline() {
  ClosePrefWay();
  const Overlay = document.getElementById('onlineOptimizeOverlay');
  if (Overlay) Overlay.style.display = 'block';
  const XXX4 = document.getElementById('onlineOptimizeFrame');
  if (XXX4 && !XXX4.dataset.loaded) XXX4.dataset.loaded = 'true';
}
function CloseOnline() {
  const Overlay = document.getElementById('onlineOptimizeOverlay');
  if (Overlay) Overlay.style.display = 'none';
}
function OpenLocal() {
  ClosePrefWay();
  const Overlay = document.getElementById('localOptimizeOverlay');
  if (!Overlay) return;
  Overlay.style.display = 'flex';
  const Items = document.getElementById('localOptimizeToolList');
  if (!Items) return;
  if (Items.dataset.loaded === 'true') return;
  Items.textContent = '${I18n["loadingTools"]}';
  fetch('https://raw.githubusercontent.com/cmliu/best-cf-tools/main/best-cf-tools.json')
    .then(Resp => Resp.json())
    .then(Data => {
      Items.dataset.loaded = 'true';
      const ItemX = (Data && (Data.projects || Data.tools || [])) || [];
      if (!ItemX.length) { Items.textContent = '❌ ' + '未获取到工具目录'; return; }
      Items.innerHTML = '';
      for (const ItemX14 of ItemX) {
        const Name = ItemX14.name || ItemX14.title || '工具';
        const Link = ItemX14.url || ItemX14.link || ItemX14.html_url || '';
        const XXX2 = ItemX14.description || ItemX14.desc || '';
        const Card = document.createElement('a');
        Card.href = Link || 'javascript:void(0)';
        Card.target = '_blank';
        Card.rel = 'noopener';
        Card.style.cssText = 'display:block;background:rgba(0,240,255,.06);border:1px solid rgba(0,240,255,.4);border-radius:10px;padding:12px;text-decoration:none;color:#00f0ff;';
        Card.innerHTML = '<div style="font-weight:bold;font-size:0.95rem;">' + Name + '</div><div style="color:#7aa9c4;font-size:0.78rem;margin-top:4px;">' + XXX2 + '</div>';
        Items.appendChild(Card);
      }
    })
    .catch(Err => { Items.textContent = '❌ ' + (Err && Err.message ? Err.message : '拉取失败'); });
}
function CloseLocal() {
  const Overlay = document.getElementById('localOptimizeOverlay');
  if (Overlay) Overlay.style.display = 'none';
}
function OpenApi() {
  ClosePrefWay();
  const Overlay = document.getElementById('apiOptimizeOverlay');
  if (Overlay) Overlay.style.display = 'flex';
}
function CloseApi() {
  const Overlay = document.getElementById('apiOptimizeOverlay');
  if (Overlay) Overlay.style.display = 'none';
}
async function VerifyPrefApi() {
  const Input = document.getElementById('apiOptimizeURL');
  const PortX = document.getElementById('apiOptimizePort');
  const ReadResult = document.getElementById('apiOptimizeResults');
  const Btn = document.getElementById('btnVerifyAPI');
  const AppendBtn = document.getElementById('btnAppendAPI');
  if (!Input || !Input.value.trim()) { ShowToast('请输入API URL', 'error'); return; }
  const Addr = Input.value.trim();
  const Port = (PortX && PortX.value) || '443';
  if (Btn) { Btn.disabled = true; Btn.textContent = '验证中…'; }
  try {
    const Resp = await fetch('/api/optimize-tools/verify-api?url=' + encodeURIComponent(Addr) + '&port=' + encodeURIComponent(Port));
    const Data = await Resp.json();
    if (Data && Data.success && Data.data && Data.data.length) {
      ReadResult.value = Data.data.join('\\n');
      ReadResult.style.color = '#00ffc4';
      if (AppendBtn) AppendBtn.disabled = false;
      ShowToast('API 接口验证成功（' + Data.data.length + ' 条）', 'success');
    } else {
      ReadResult.value = '❌ 接口不可用，请检查URL和端口';
      ReadResult.style.color = '#ff5f7a';
      if (AppendBtn) AppendBtn.disabled = true;
      ShowToast('API 接口验证失败', 'error');
    }
  } catch (Err) {
    ReadResult.value = '❌ ' + (Err && Err.message ? Err.message : '请求失败');
    ReadResult.style.color = '#ff5f7a';
  } finally {
    if (Btn) { Btn.disabled = false; Btn.textContent = '${I18n["verifyApi"]}'; }
  }
}
function AppendPrefResult() {
  const ReadResult = document.getElementById('apiOptimizeResults');
  const Input = document.getElementById('subCustomIPs');
  if (!ReadResult || !ReadResult.value.trim()) { ShowToast('暂无验证结果', 'error'); return; }
  const Lines = ReadResult.value.split(/\\r?\\n/).map(Row => Row.trim()).filter(Row => Row);
  if (!Lines.length) return;
  if (Input) {
    const Existing = Input.value.trim();
    Input.value = Existing ? (Existing + '\\n' + Lines.join('\\n')) : Lines.join('\\n');
    Input.style.borderColor = '#00ffc4';
  }
  ShowToast('已追加 ' + Lines.length + ' 条优选IP，请点击保存全部生效', 'success');
  CloseApi();
}
function OpenChain() {
  ClosePrefWay();
  const Overlay = document.getElementById('chainProxyOverlay');
  if (Overlay) Overlay.style.display = 'flex';
  const Input = document.getElementById('chainProxyInput');
  const Existing = document.getElementById('subChainProxy');
  if (Input && Existing && Existing.value) Input.value = Existing.value;
}
function CloseChain() {
  const Overlay = document.getElementById('chainProxyOverlay');
  if (Overlay) Overlay.style.display = 'none';
}
async function VerifyChainProxy() {
  const Input = document.getElementById('chainProxyInput');
  const Status = document.getElementById('chainProxyStatus');
  const ReadResult = document.getElementById('chainProxyResult');
  const Btn = document.getElementById('btnVerifyChain');
  const ApplyBtn = document.getElementById('btnApplyChain');
  if (!Input || !Input.value.trim()) { ShowToast('请输入链式代理地址', 'error'); return; }
  const Proxy = Input.value.trim();
  if (Btn) { Btn.disabled = true; Btn.textContent = '验证中…'; }
  if (Status) Status.textContent = '${I18n["loadingTools"]}';
  if (ReadResult) ReadResult.textContent = '';
  try {
    const Resp = await fetch('/api/optimize-tools/verify-chain?proxy=' + encodeURIComponent(Proxy));
    const Data = await Resp.json();
    if (Data && Data.success) {
      if (Status) { Status.textContent = '✓ 验证成功（' + (Data.responseTime || 0) + 'ms）'; Status.style.color = '#00ffc4'; }
      if (ReadResult) ReadResult.textContent = 'Proto: ' + (Data.protocol || '') + ' | 主机: ' + (Data.ip || '') + ' | 端口: ' + (Data.port || '') + (Data.hasAuth ? ' | 已启用认证' : '');
      if (ApplyBtn) ApplyBtn.style.display = 'inline-block';
      ShowToast('链式代理验证成功', 'success');
    } else {
      if (Status) { Status.textContent = '✕ 验证失败'; Status.style.color = '#ff5f7a'; }
      if (ReadResult) ReadResult.textContent = (Data && Data.error) ? '原因: ' + Data.error : '连通性测试失败';
      if (ApplyBtn) ApplyBtn.style.display = 'none';
      ShowToast('链式代理验证失败', 'error');
    }
  } catch (Err) {
    if (Status) { Status.textContent = '✕ 请求失败'; Status.style.color = '#ff5f7a'; }
    if (ReadResult) ReadResult.textContent = 'XXX2: ' + (Err && Err.message ? Err.message : '请求失败');
  } finally {
    if (Btn) { Btn.disabled = false; Btn.textContent = '${I18n["verifyChain"]}'; }
  }
}
function ApplyChainProxy() {
  const Input = document.getElementById('chainProxyInput');
  const Target = document.getElementById('subChainProxy');
  if (!Input || !Input.value.trim()) return;
  if (Target) {
    Target.value = Input.value.trim();
    Target.style.borderColor = '#00ffc4';
  }
  ShowToast('已应用链式代理，请点击保存全部生效', 'success');
  CloseChain();
}

// ===== 开始优选：生成并测速优选IP，结果自动填入自定义优选 =====
// ===== 开始优选：生成并测速优选IP，结果自动填入自定义优选 =====
async function StartPref() {
  const btn = document.getElementById('startPreferredBtn');
  const status = document.getElementById('startPreferredStatus');
  if (!btn || btn.disabled) return;
  btn.disabled = true;
  const XText = btn.textContent;
  btn.textContent = '${I18n["checking"]}…';
  if (status) status.textContent = '${I18n["startPreferredRunning"]}';
  try {
    const PortInput = document.getElementById('subPort');
    const Port = PortInput && PortInput.value ? PortInput.value : '443';
    const CountInput = document.getElementById('subRandomCount');
    const Count = CountInput && CountInput.value ? CountInput.value : '12';
    const Resp = await fetch('/api/preferred-ips/generate?count=' + encodeURIComponent(Count) + '&port=' + encodeURIComponent(Port));
    const Data = await Resp.json();
    if (Data && Data.ips && Data.ips.length) {
      const Input = document.getElementById('subCustomIPs');
      if (Input) {
        Input.value = Data.ips.join('\\n');
        Input.style.borderColor = '#00ffc4';
      }
      if (status) status.textContent = '${I18n["startPreferredDone"]}（' + Data.ips.length + '）';
    } else {
      if (status) status.textContent = '${I18n["startPreferredFail"]}';
    }
  } catch (e) {
    if (status) status.textContent = '${I18n["startPreferredFail"]}';
  } finally {
    btn.disabled = false;
    btn.textContent = XText;
  }
}

// 页面加载时检查 localStorage 和 Cookie，并清理URL参数
window.addEventListener('DOMContentLoaded', function () {
  const SavedLang20205 = localStorage.getItem('preferredLanguage') || GetCookie20214('preferredLanguage');
  const UrlParams = new URLSearchParams(window.location.search);
  const UrlLang = UrlParams.get('lang');

  // 如果URL中有语言参数，移除它并设置Cookie
  if (UrlLang) {
    const CurUrl20204 = new URL(window.location.href);
    CurUrl20204.searchParams.delete('lang');
    const NewUrl = CurUrl20204.toString();

    // 设置Cookie
    const Expiry20203 = new Date();
    Expiry20203.setFullYear(Expiry20203.getFullYear() + 1);
    document.cookie = 'preferredLanguage=' + UrlLang + '; path=/; expires=' + Expiry20203.toUTCString() + '; SameSite=Lax';
    localStorage.setItem('preferredLanguage', UrlLang);

    // 使用history API移除URL参数，不刷新页面
    window.history.replaceState({}, '', NewUrl);
  } else if (SavedLang20205) {
    // 如果localStorage中有但Cookie中没有，同步到Cookie
    const Expiry = new Date();
    Expiry.setFullYear(Expiry.getFullYear() + 1);
    document.cookie = 'preferredLanguage=' + SavedLang20205 + '; path=/; expires=' + Expiry.toUTCString() + '; SameSite=Lax';
  }
});

// 赛博朋克风 toast 通知 (替代 alert)
window.ShowToast = function (Msg20202, Type20201, Local20200) {
  Local20200 = Local20200 || {};
  var XXX3 = document.getElementById('cpToastStack');
  if (!XXX3) return;
  var TypeMap = {
    success: '✓',
    info: '⌬',
    warn: '⚠',
    error: '✕'
  };
  var TitleMap = {
    success: 'SUCCESS',
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR'
  };
  Type20201 = TypeMap[Type20201] ? Type20201 : 'success';
  var XXXXX3 = Local20200.duration || 3200;
  var Toast = document.createElement('div');
  Toast.className = 'cp-toast cp-toast-' + Type20201;
  Toast.style.setProperty('--cp-toast-dur', XXXXX3 + 'ms');
  if (!Local20200.hideIcon) {
    var Icon = document.createElement('span');
    Icon.className = 'cp-toast-icon';
    Icon.textContent = Local20200.icon || TypeMap[Type20201];
    Toast.appendChild(Icon);
  }
  var Body = document.createElement('div');
  Body.className = 'cp-toast-body';
  var Title = document.createElement('div');
  Title.className = 'cp-toast-title';
  Title.textContent = Local20200.title || TitleMap[Type20201];
  var Msg20199 = document.createElement('div');
  Msg20199.className = 'cp-toast-msg';
  Msg20199.textContent = String(Msg20202 == null ? '' : Msg20202);
  Body.appendChild(Title);
  Body.appendChild(Msg20199);
  Toast.appendChild(Body);
  if (!Local20200.noClose) {
    var Close = document.createElement('button');
    Close.type = 'button';
    Close.className = 'cp-toast-close';
    Close.setAttribute('aria-label', 'close');
    Close.textContent = '✕';
    Toast.appendChild(Close);
  }
  XXX3.appendChild(Toast);
  requestAnimationFrame(function () {
    Toast.classList.add('cp-show');
  });
  var Local20198 = false;
  function CloseToast() {
    if (Local20198) return;
    Local20198 = true;
    Toast.classList.remove('cp-show');
    Toast.classList.add('cp-hide');
    setTimeout(function () {
      if (Toast.parentNode) Toast.parentNode.removeChild(Toast);
    }, 400);
  }
  Close.addEventListener('click', CloseToast);
  var Timer = setTimeout(CloseToast, XXXXX3);
  Toast.addEventListener('mouseenter', function () {
    clearTimeout(Timer);
  });
  Toast.addEventListener('mouseleave', function () {
    Timer = setTimeout(CloseToast, 1200);
  });
  return {
    dismiss: CloseToast,
    element: Toast
  };
};
function TryOpenApp(SchemeUrl20197, FallbackXX, Timeout20196) {
  Timeout20196 = Timeout20196 || 2500;
  var ApplyXOpen = false;
  var XXXXRow = false;
  var StartVal = Date.now();
  var Val220195 = function () {
    var XX20194 = Date.now() - StartVal;
    if (XX20194 < 3000 && !XXXXRow) {
      ApplyXOpen = true;
    }
  };
  window.addEventListener('blur', Val220195);
  var Val220193 = function () {
    var XXX2 = Date.now() - StartVal;
    if (XXX2 < 3000 && !XXXXRow) {
      ApplyXOpen = true;
    }
  };
  document.addEventListener('visibilitychange', Val220193);
  var XXXX = document.createElement('iframe');
  XXXX.style.display = 'none';
  XXXX.style.width = '1px';
  XXXX.style.height = '1px';
  XXXX.src = SchemeUrl20197;
  document.body.appendChild(XXXX);
  setTimeout(function () {
    XXXX.parentNode && XXXX.parentNode.removeChild(XXXX);
    window.removeEventListener('blur', Val220195);
    document.removeEventListener('visibilitychange', Val220193);
    if (!XXXXRow) {
      XXXXRow = true;
      if (!ApplyXOpen && FallbackXX) {
        FallbackXX();
      }
    }
  }, Timeout20196);
}
function BuildClientLink(ClientType, ClientName) {
  var CurUrl20192 = window.location.href;
  var SubUrl20191 = CurUrl20192 + "/sub";
  var SubNameInput20200 = document.getElementById("subName");
  var SubNameVal20200 = SubNameInput20200 ? SubNameInput20200.value.trim() : "";
  // 附加订阅名称参数，客户端导入订阅时显示对应名称
  SubUrl20191 += (SubUrl20191.includes("?") ? "&" : "?") + "name=" + encodeURIComponent(SubNameVal20200 || "CFBox");
  var SchemeUrl = '';
  var ShowName = ClientName || '';
  var FinalUrl = SubUrl20191;
  if (ClientType === "v2ray") {
    FinalUrl = SubUrl20191;
    var UrlVal20190 = document.getElementById("clientSubscriptionUrl");
    UrlVal20190.textContent = FinalUrl;
    UrlVal20190.style.display = "block";
    UrlVal20190.style.overflowWrap = "break-word";
    UrlVal20190.style.wordBreak = "break-all";
    UrlVal20190.style.overflowX = "auto";
    UrlVal20190.style.maxWidth = "100%";
    UrlVal20190.style.boxSizing = "border-box";
    if (ClientName === 'V2RAY') {
      navigator.clipboard.writeText(FinalUrl).then(function () {
        ShowToast(ShowName + " " + I18n20207.subscriptionCopied, 'success', { title: '🥳复制成功', hideIcon: true, noClose: true });
      });
    } else if (ClientName === 'Shadowrocket') {
      SchemeUrl = 'shadowrocket://add/' + encodeURIComponent(FinalUrl);
      TryOpenApp(SchemeUrl, function () {
        navigator.clipboard.writeText(FinalUrl).then(function () {
          ShowToast(ShowName + " " + I18n20207.subscriptionCopied, 'success', { title: '🥳复制成功', hideIcon: true, noClose: true });
        });
      });
    } else if (ClientName === 'V2RAYNG') {
      SchemeUrl = 'v2rayng://install?url=' + encodeURIComponent(FinalUrl);
      TryOpenApp(SchemeUrl, function () {
        navigator.clipboard.writeText(FinalUrl).then(function () {
          ShowToast(ShowName + " " + I18n20207.subscriptionCopied, 'success', { title: '🥳复制成功', hideIcon: true, noClose: true });
        });
      });
    } else if (ClientName === 'NEKORAY') {
      SchemeUrl = 'nekoray://install-config?url=' + encodeURIComponent(FinalUrl);
      TryOpenApp(SchemeUrl, function () {
        navigator.clipboard.writeText(FinalUrl).then(function () {
          ShowToast(ShowName + " " + I18n20207.subscriptionCopied, 'success', { title: '🥳复制成功', hideIcon: true, noClose: true });
        });
      });
    }
  } else {
    // 统一走内部格式转换
    FinalUrl = SubUrl20191 + (SubUrl20191.includes('?') ? '&' : '?') + "target=" + ClientType;
    var UrlVal20190 = document.getElementById("clientSubscriptionUrl");
    UrlVal20190.textContent = FinalUrl;
    UrlVal20190.style.display = "block";
    UrlVal20190.style.overflowWrap = "break-word";
    UrlVal20190.style.wordBreak = "break-all";
    UrlVal20190.style.overflowX = "auto";
    UrlVal20190.style.maxWidth = "100%";
    UrlVal20190.style.boxSizing = "border-box";
    if (ClientType === "clash") {
      if (ClientName === 'STASH') {
        SchemeUrl = 'stash://install?url=' + encodeURIComponent(FinalUrl);
        ShowName = 'STASH';
      } else {
        SchemeUrl = 'clash://install-config?url=' + encodeURIComponent(FinalUrl);
        ShowName = 'CLASH';
      }
    } else if (ClientType === "surge") {
      SchemeUrl = 'surge:///install-config?url=' + encodeURIComponent(FinalUrl);
      ShowName = 'SURGE';
    } else if (ClientType === "singbox") {
      SchemeUrl = 'sing-box://install-config?url=' + encodeURIComponent(FinalUrl);
      ShowName = 'SING-BOX';
    } else if (ClientType === "loon") {
      SchemeUrl = 'loon://install?url=' + encodeURIComponent(FinalUrl);
      ShowName = 'LOON';
    } else if (ClientType === "quanx") {
      SchemeUrl = 'quantumult-x://install-config?url=' + encodeURIComponent(FinalUrl);
      ShowName = 'QUANTUMULT X';
    }
    if (SchemeUrl) {
      TryOpenApp(SchemeUrl, function () {
        navigator.clipboard.writeText(FinalUrl).then(function () {
          ShowToast(ShowName + " " + I18n20207.subscriptionCopied, 'success', { title: '🥳复制成功', hideIcon: true, noClose: true });
        });
      });
    } else {
      navigator.clipboard.writeText(FinalUrl).then(function () {
        ShowToast(ShowName + " " + I18n20207.subscriptionCopied, 'success', { title: '🥳复制成功', hideIcon: true, noClose: true });
      });
    }
  }
}

// 页面特效图形化开关 (localStorage 持久化)
window.ApplyPageXX = function () {
  var Local20189 = localStorage.getItem('cp-fx-off') === '1';
  document.body.classList.toggle('fx-off', Local20189);
  var Local20188 = document.getElementById('cpFxLabel');
  if (Local20188) Local20188.textContent = Local20189 ? 'FX: OFF' : 'FX: ON';
  if (Local20189) {
    var Local20187 = document.getElementById('matrixCodeRain');
    if (Local20187) Local20187.innerHTML = '';
  } else if (typeof CreateMatrixRain === 'function') {
    var ReadResultVal = document.getElementById('matrixCodeRain');
    if (ReadResultVal && !ReadResultVal.firstChild) CreateMatrixRain();
  }
};
window.SwitchPageXX = function () {
  var Local20186 = localStorage.getItem('cp-fx-off') === '1';
  localStorage.setItem('cp-fx-off', Local20186 ? '0' : '1');
  window.ApplyPageXX();
};
(function () {
  if (localStorage.getItem('cp-fx-off') === '1') {
    document.addEventListener('DOMContentLoaded', function () {
      document.body.classList.add('fx-off');
      var Local20185 = document.getElementById('cpFxLabel');
      if (Local20185) Local20185.textContent = 'FX: OFF';
    });
  }
})();
function CreateMatrixRain() {
  if (document.body && document.body.classList.contains('fx-off')) return;
  const MatrixEl = document.getElementById('matrixCodeRain');
  if (!MatrixEl) return;
  const MatrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ$%#@!?<>+=ABCDEF';
  const Palette = ['#00f0ff', '#ff2bd6', '#a347ff', '#00ff9d'];
  const ColCount = Math.floor(window.innerWidth / 20);
  for (let IdxVal20184 = 0; IdxVal20184 < ColCount; IdxVal20184++) {
    const Col20183 = document.createElement('div');
    Col20183.className = 'matrix-column';
    Col20183.style.left = IdxVal20184 * 20 + 'px';
    Col20183.style.animationDelay = -Math.random() * 15 + 's';
    Col20183.style.animationDuration = Math.random() * 14 + 8 + 's';
    Col20183.style.fontSize = Math.random() * 4 + 12 + 'px';
    Col20183.style.opacity = (Math.random() * 0.7 + 0.3).toFixed(2);
    let Text20182 = '';
    const CharCount = Math.floor(Math.random() * 30 + 18);
    for (let Idx2 = 0; Idx2 < CharCount; Idx2++) {
      const Char = MatrixChars[Math.floor(Math.random() * MatrixChars.length)];
      const Highlight = Math.random() > 0.85;
      const Color = Highlight ? Palette[Math.floor(Math.random() * Palette.length)] : '';
      Text20182 += Color ? '<span style="color:' + Color + ';text-shadow:0 0 8px ' + Color + ';">' + Char + '</span><br>' : '<span>' + Char + '</span><br>';
    }
    Col20183.innerHTML = Text20182;
    MatrixEl.appendChild(Col20183);
  }
  setInterval(function () {
    const Columns = MatrixEl.querySelectorAll('.matrix-column');
    Columns.forEach(function (Col) {
      if (Math.random() > 0.94) {
        const Chars = Col.querySelectorAll('span');
        if (Chars.length > 0) {
          const Target20181 = Chars[Math.floor(Math.random() * Chars.length)];
          const Local20180 = Target20181.style.color;
          Target20181.style.color = '#ffffff';
          Target20181.style.textShadow = '0 0 10px #ffffff, 0 0 18px #00f0ff';
          setTimeout(function () {
            Target20181.style.color = Local20180;
            Target20181.style.textShadow = '';
          }, 200);
        }
      }
    });
  }, 110);
}
async function CheckSystemStatus() {
  try {
    const CfStatus = document.getElementById('cfStatus');
    const RegionStatus = document.getElementById('regionStatus');
    const Val220179 = document.getElementById('geoInfo');
    const BackupStatus = document.getElementById('backupStatus');
    const CurrentAddr = document.getElementById('currentIP');
    const RegionVal = document.getElementById('regionMatch');

    // 获取当前语言设置（优先从Cookie/localStorage读取）
    function GetCookie20178(Name20177) {
      const Val20176 = '; ' + document.cookie;
      const Parts20175 = Val20176.split('; ' + Name20177 + '=');
      if (Parts20175.length === 2) return Parts20175.pop().split(';').shift();
      return null;
    }
    const BrowserLang20174 = navigator.language || navigator.userLanguage || '';
    const SavedLang20173 = localStorage.getItem('preferredLanguage') || GetCookie20178('preferredLanguage');
    let LangCode20172 = 'zh';
    if (SavedLang20173 === 'fa' || SavedLang20173 === 'fa-IR') {
      LangCode20172 = 'fa';
    } else if (SavedLang20173 === 'en' || SavedLang20173 === 'en-US' || SavedLang20173 === 'en-GB') {
      LangCode20172 = 'en';
    } else if (SavedLang20173 === 'zh' || SavedLang20173 === 'zh-CN') {
      LangCode20172 = 'zh';
    } else {
      if (BrowserLang20174.includes('fa') || BrowserLang20174.includes('fa-IR')) {
        LangCode20172 = 'fa';
      } else if (BrowserLang20174.includes('en')) {
        LangCode20172 = 'en';
      } else {
        LangCode20172 = 'zh';
      }
    }
    const IsRtl20172 = LangCode20172 === 'fa';
    const Local20171 = {
      zh: {
        workerRegion: 'Worker地区: ',
        detectionMethod: '检测方式: ',
        proxyIPStatus: 'ProxyIP状态: ',
        currentIP: '当前使用IP: ',
        regionMatch: '地区匹配: ',
        regionNames: {
          'CF': '🌐 官方直连',
          'HK': '🇭🇰 香港',
          'US': '🇺🇸 美国',
          'SG': '🇸🇬 新加坡',
          'JP': '🇯🇵 日本',
          'KR': '🇰🇷 韩国',
          'DE': '🇩🇪 德国',
          'SE': '🇸🇪 瑞典',
          'NL': '🇳🇱 荷兰',
          'FI': '🇫🇮 芬兰',
          'GB': '🇬🇧 英国'
        },
        customIPMode: '自定义ProxyIP模式 (p变量启用)',
        customIPModeDesc: '自定义IP模式 (已禁用地区匹配)',
        usingCustomProxyIP: '使用自定义ProxyIP: ',
        customIPConfig: ' (p变量配置)',
        customIPModeDisabled: '自定义IP模式，地区选择已禁用',
        manualRegion: '手动指定地区',
        manualRegionDesc: ' (手动指定)',
        proxyIPAvailable: '10/10 可用 (ProxyIP域名预设可用)',
        smartSelection: '智能就近选择中',
        sameRegionIP: '同地区IP可用 (1个)',
        cloudflareDetection: '官方直连',
        detectionFailed: '检测失败',
        unknown: '未知'
      },
      fa: {
        workerRegion: 'منطقه Worker: ',
        detectionMethod: 'روش تشخیص: ',
        proxyIPStatus: 'وضعیت ProxyIP: ',
        currentIP: 'IP فعلی: ',
        regionMatch: 'تطبیق منطقه: ',
        regionNames: {
          'CF': '🌐 مستقیم رسمی',
          'HK': '🇭🇰 هنگ کنگ',
          'US': '🇺🇸 آمریکا',
          'SG': '🇸🇬 سنگاپور',
          'JP': '🇯🇵 ژاپن',
          'KR': '🇰🇷 کره جنوبی',
          'DE': '🇩🇪 آلمان',
          'SE': '🇸🇪 سوئد',
          'NL': '🇳🇱 هلند',
          'FI': '🇫🇮 فنلاند',
          'GB': '🇬🇧 بریتانیا'
        },
        customIPMode: 'حالت ProxyIP سفارشی (متغیر p فعال است)',
        customIPModeDesc: 'حالت IP سفارشی (تطبیق منطقه غیرفعال است)',
        usingCustomProxyIP: 'استفاده از ProxyIP سفارشی: ',
        customIPConfig: ' (پیکربندی متغیر p)',
        customIPModeDisabled: 'حالت IP سفارشی، انتخاب منطقه غیرفعال است',
        manualRegion: 'تعیین منطقه دستی',
        manualRegionDesc: ' (تعیین دستی)',
        proxyIPAvailable: '10/10 در دسترس (دامنه پیش‌فرض ProxyIP در دسترس است)',
        smartSelection: 'انتخاب هوشمند نزدیک در حال انجام است',
        sameRegionIP: 'IP هم‌منطقه در دسترس است (1)',
        cloudflareDetection: 'اتصال مستقیم رسمی',
        detectionFailed: 'تشخیص ناموفق',
        unknown: 'ناشناخته'
      },
      en: {
        workerRegion: 'Worker Region: ',
        detectionMethod: 'Detection Method: ',
        proxyIPStatus: "ProxyIP Status: ",
        currentIP: 'Current IP: ',
        regionMatch: 'Region Match: ',
        regionNames: {
          'CF': "🌐 Official Direct",
          'HK': '🇭🇰 Hong Kong',
          'US': '🇺🇸 United States',
          'SG': '🇸🇬 Singapore',
          'JP': '🇯🇵 Japan',
          'KR': '🇰🇷 South Korea',
          'DE': '🇩🇪 Germany',
          'SE': '🇸🇪 Sweden',
          'NL': '🇳🇱 Netherlands',
          'FI': '🇫🇮 Finland',
          'GB': '🇬🇧 United Kingdom'
        },
        customIPMode: 'Custom ProxyIP mode (p variable enabled)',
        customIPModeDesc: 'Custom IP mode (region matching disabled)',
        usingCustomProxyIP: "Using custom ProxyIP: ",
        customIPConfig: ' (p variable config)',
        customIPModeDisabled: 'Custom IP mode, region selection disabled',
        manualRegion: 'Manual region',
        manualRegionDesc: ' (manual)',
        proxyIPAvailable: "10/10 available (ProxyIP domain presets available)",
        smartSelection: 'Smart nearest selection in progress',
        sameRegionIP: 'Same-region IP available (1)',
        cloudflareDetection: "Official Direct",
        detectionFailed: 'Detection failed',
        unknown: 'Unknown'
      }
    };
    const I18n20170 = Local20171[LangCode20172] || Local20171['zh'];
    let ValRegion20169 = 'US'; // 默认值
    let IsCustomAddrVal = false;
    let IsManualRegionVal = false;
    try {
      const Resp20168 = await fetch(window.location.pathname + '/region');
      const Data20167 = await Resp20168.json();
      if (Data20167.region === 'CUSTOM') {
        IsCustomAddrVal = true;
        ValRegion20169 = 'CUSTOM';

        // 获取自定义IP的详细信息
        const CustomAddrVal = Data20167.ci || I18n20170.unknown;
        Val220179.innerHTML = I18n20170.detectionMethod + '<span style="color: #ffb400;">⚙️ ' + I18n20170.customIPMode + '</span>';
        RegionStatus.innerHTML = I18n20170.workerRegion + '<span style="color: #ffb400;">🔧 ' + I18n20170.customIPModeDesc + '</span>';

        // 显示自定义IP配置状态，包含具体IP
        if (BackupStatus) BackupStatus.innerHTML = I18n20170.proxyIPStatus + '<span style="color: #ffb400;">🔧 ' + I18n20170.usingCustomProxyIP + CustomAddrVal + '</span>';
        if (CurrentAddr) CurrentAddr.innerHTML = I18n20170.currentIP + '<span style="color: #ffb400;">✅ ' + CustomAddrVal + I18n20170.customIPConfig + '</span>';
        if (RegionVal) RegionVal.innerHTML = I18n20170.regionMatch + '<span style="color: #ffb400;">⚠️ ' + I18n20170.customIPModeDisabled + '</span>';
        return; // 提前返回，不执行后续的地区匹配逻辑
      } else if (Data20167.detectionMethod === '手动指定地区' || Data20167.detectionMethod === 'تعیین منطقه دستی') {
        IsManualRegionVal = true;
        ValRegion20169 = Data20167.region;
        Val220179.innerHTML = I18n20170.detectionMethod + '<span style="color: #00b380;">' + I18n20170.manualRegion + '</span>';
        RegionStatus.innerHTML = I18n20170.workerRegion + '<span style="color: #00ff9d;">🎯 ' + I18n20170.regionNames[ValRegion20169] + I18n20170.manualRegionDesc + '</span>';

        // 显示配置状态而不是检测状态
        if (BackupStatus) BackupStatus.innerHTML = I18n20170.proxyIPStatus + '<span style="color: #00ff9d;">✅ ' + I18n20170.proxyIPAvailable + '</span>';
        if (CurrentAddr) CurrentAddr.innerHTML = I18n20170.currentIP + '<span style="color: #00ff9d;">✅ ' + I18n20170.smartSelection + '</span>';
        if (RegionVal) RegionVal.innerHTML = I18n20170.regionMatch + '<span style="color: #00ff9d;">✅ ' + I18n20170.sameRegionIP + '</span>';
        return; // 提前返回，不执行后续的地区匹配逻辑
      } else if (Data20167.region && I18n20170.regionNames[Data20167.region]) {
        ValRegion20169 = Data20167.region;
      }
      Val220179.innerHTML = I18n20170.detectionMethod + '<span style="color: #00ff9d;">' + I18n20170.cloudflareDetection + '</span>';
    } catch (EventVal20166) {
      Val220179.innerHTML = I18n20170.detectionMethod + '<span style="color: #ff3860;">' + I18n20170.detectionFailed + '</span>';
    }
    RegionStatus.innerHTML = I18n20170.workerRegion + '<span style="color: #00ff9d;">✅ ' + I18n20170.regionNames[ValRegion20169] + '</span>';

    // 直接显示配置状态，不再进行检测
    if (BackupStatus) {
      BackupStatus.innerHTML = I18n20170.proxyIPStatus + '<span style="color: #00ff9d;">✅ ' + I18n20170.proxyIPAvailable + '</span>';
    }
    if (CurrentAddr) {
      CurrentAddr.innerHTML = I18n20170.currentIP + '<span style="color: #00ff9d;">✅ ' + I18n20170.smartSelection + '</span>';
    }
    if (RegionVal) {
      RegionVal.innerHTML = I18n20170.regionMatch + '<span style="color: #00ff9d;">✅ ' + I18n20170.sameRegionIP + '</span>';
    }
  } catch (Err20165) {
    function GetCookie20164(Name20163) {
      const Val20162 = '; ' + document.cookie;
      const Parts20161 = Val20162.split('; ' + Name20163 + '=');
      if (Parts20161.length === 2) return Parts20161.pop().split(';').shift();
      return null;
    }
    const BrowserLang20160 = navigator.language || navigator.userLanguage || '';
    const SavedLang20159 = localStorage.getItem('preferredLanguage') || GetCookie20164('preferredLanguage');
    let LangCode20158 = 'zh';
    if (SavedLang20159 === 'fa' || SavedLang20159 === 'fa-IR') {
      LangCode20158 = 'fa';
    } else if (SavedLang20159 === 'en' || SavedLang20159 === 'en-US' || SavedLang20159 === 'en-GB') {
      LangCode20158 = 'en';
    } else if (SavedLang20159 === 'zh' || SavedLang20159 === 'zh-CN') {
      LangCode20158 = 'zh';
    } else {
      if (BrowserLang20160.includes('fa') || BrowserLang20160.includes('fa-IR')) {
        LangCode20158 = 'fa';
      } else if (BrowserLang20160.includes('en')) {
        LangCode20158 = 'en';
      } else {
        LangCode20158 = 'zh';
      }
    }
    const IsRtl20158 = LangCode20158 === 'fa';
    const Local20157 = {
      zh: {
        workerRegion: 'Worker地区: ',
        detectionMethod: '检测方式: ',
        proxyIPStatus: 'ProxyIP状态: ',
        currentIP: '当前使用IP: ',
        regionMatch: '地区匹配: ',
        detectionFailed: '检测失败'
      },
      fa: {
        workerRegion: 'منطقه Worker: ',
        detectionMethod: 'روش تشخیص: ',
        proxyIPStatus: 'وضعیت ProxyIP: ',
        currentIP: 'IP فعلی: ',
        regionMatch: 'تطبیق منطقه: ',
        detectionFailed: 'تشخیص ناموفق'
      },
      en: {
        workerRegion: 'Worker Region: ',
        detectionMethod: 'Detection Method: ',
        proxyIPStatus: "ProxyIP Status: ",
        currentIP: 'Current IP: ',
        regionMatch: 'Region Match: ',
        detectionFailed: 'Detection failed'
      }
    };
    const I18n20156 = Local20157[LangCode20158] || Local20157['zh'];
    document.getElementById('regionStatus').innerHTML = I18n20156.workerRegion + '<span style="color: #ff3860;">❌ ' + I18n20156.detectionFailed + '</span>';
    document.getElementById('geoInfo').innerHTML = I18n20156.detectionMethod + '<span style="color: #ff3860;">❌ ' + I18n20156.detectionFailed + '</span>';
    document.getElementById('backupStatus').innerHTML = I18n20156.proxyIPStatus + '<span style="color: #ff3860;">❌ ' + I18n20156.detectionFailed + '</span>';
    document.getElementById('currentIP').innerHTML = I18n20156.currentIP + '<span style="color: #ff3860;">❌ ' + I18n20156.detectionFailed + '</span>';
    document.getElementById('regionMatch').innerHTML = I18n20156.regionMatch + '<span style="color: #ff3860;">❌ ' + I18n20156.detectionFailed + '</span>';
  }
}

// 网络测试相关函数
async function RunNetTest() {
  const TestBox = document.getElementById('netTestResults');
  const TestBtn = document.getElementById('netTestBtn');
  if (!TestBox) return;
  TestBox.style.display = 'block';
  let LangCode = 'zh';
  try {
    const SavedLang = localStorage.getItem('preferredLanguage') || '';
    const BrowserLang = navigator.language || '';
    if (SavedLang.indexOf('fa') === 0 || BrowserLang.indexOf('fa') === 0) {
      LangCode = 'fa';
    } else if (SavedLang.indexOf('en') === 0 || BrowserLang.indexOf('en') === 0) {
      LangCode = 'en';
    } else {
      LangCode = 'zh';
    }
  } catch (Err) {}
  const TestI18n = LangCode === 'fa' ? {
    testing: 'در حال تست...',
    reachable: 'در دسترس',
    fail: 'غیرقابل دسترسی',
    timeout: 'زمان تمام شد',
    connError: 'خطای اتصال',
    failReq: 'تست ناموفق',
    reqError: 'خطا در درخواست تست'
  } : LangCode === 'en' ? {
    testing: 'Testing...',
    reachable: 'Reachable',
    fail: 'Unreachable',
    timeout: 'Timeout',
    connError: 'Connection failed',
    failReq: 'Test failed',
    reqError: 'Test request failed'
  } : {
    testing: '测试中...',
    reachable: '可访问',
    fail: '不可访问',
    timeout: '超时',
    connError: '连接失败',
    failReq: '测试失败',
    reqError: '测试请求失败'
  };
  const ServiceItems = ['Google', 'Netflix', 'Disney+', 'HBO', 'HBOMax', 'Peacock', 'GitHub', 'GPT', 'Gemini'];
  TestBox.innerHTML = ServiceItems.map(ServiceX =>
    '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(0,240,255,.15);"><span style="color:#00f0ff;font-weight:bold;">' + ServiceX + '</span><span style="color:#ffb400;">' + TestI18n.testing + '</span></div>'
  ).join('');
  if (TestBtn) TestBtn.disabled = true;
  try {
    const Resp = await fetch(window.location.pathname + '/api/network-test');
    if (!Resp.ok) throw new Error('HTTP ' + Resp.status);
    const Data = await Resp.json();
    if (Data && Data.success && Array.isArray(Data.ReadResult)) {
      TestBox.innerHTML = Data.ReadResult.map(Item => {
        let StatusMark = '';
        if (Item.XXXX3) {
          StatusMark = '<span style="color:#00ff9d;">✅ 可正常访问 (' + Item.StatusX10 + ') · ' + Item.Delay + 'ms</span>';
        } else {
          StatusMark = '<span style="color:#ff3860;">❌ 不可访问</span>';
        }
        return '<div style="display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(0,240,255,.15);"><span style="color:#00f0ff;font-weight:bold;">' + Item.Name + '</span>' + StatusMark + '</div>';
      }).join('');
    } else {
      TestBox.innerHTML = '<div style="color:#ff3860;text-align:center;padding:8px 0;">' + TestI18n.failReq + '</div>';
    }
  } catch (Err) {
    TestBox.innerHTML = '<div style="color:#ff3860;text-align:center;padding:8px 0;">' + TestI18n.reqError + ': ' + Err.message + '</div>';
  } finally {
    if (TestBtn) TestBtn.disabled = false;
  }
}

// 节点测速相关函数
async function SpeedtestNode() {
  const SpeedBox = document.getElementById('nodeSpeedResult');
  const SpeedtestBtn = document.getElementById('nodeSpeedBtn');
  if (!SpeedBox) return;
  let LangCode = 'zh';
  try {
    const SavedLang = localStorage.getItem('preferredLanguage') || '';
    const BrowserLang = navigator.language || '';
    if (SavedLang.indexOf('fa') === 0 || BrowserLang.indexOf('fa') === 0) {
      LangCode = 'fa';
    } else if (SavedLang.indexOf('en') === 0 || BrowserLang.indexOf('en') === 0) {
      LangCode = 'en';
    } else {
      LangCode = 'zh';
    }
  } catch (Err) {}
  const SpeedI18n = LangCode === 'fa' ? {
    testing: 'در حال تست سرعت...',
    latency: 'تاخیر',
    download: 'دانلود',
    timeout: 'زمان تمام شد',
    fail: 'تست ناموفق',
    reqError: 'خطا در درخواست تست سرعت'
  } : LangCode === 'en' ? {
    testing: 'Speed testing...',
    latency: 'Latency',
    download: 'Download',
    timeout: 'Timeout',
    fail: 'Test failed',
    reqError: 'Speed test request failed'
  } : {
    testing: '测速中...',
    latency: '延迟',
    download: '下载',
    timeout: '超时',
    fail: '测速失败',
    reqError: '测速请求失败'
  };
  SpeedBox.innerHTML = '<div style="color:#ffb400;">' + SpeedI18n.testing + '</div>';
  if (SpeedtestBtn) SpeedtestBtn.disabled = true;
  try {
    const Resp = await fetch(window.location.pathname + '/api/node-speedtest');
    if (!Resp.ok) throw new Error('HTTP ' + Resp.status);
    const Data = await Resp.json();
    if (Data && Data.success) {
      if (Data.Err === 'timeout') {
        SpeedBox.innerHTML = '<div style="color:#ff3860;">❌ ' + SpeedI18n.timeout + '</div>';
      } else if (Data.Err === 'error' || (Data.StatusX10 === 0 && Data.Delay >= 10000)) {
        SpeedBox.innerHTML = '<div style="color:#ff3860;">❌ ' + SpeedI18n.fail + '</div>';
      } else {
        let XXText = '—';
        if (Data.XXX6 > 0) {
          XXText = Data.XXX6 >= 1048576 ? (Data.XXX6 / 1048576).toFixed(2) + ' MB/s' : (Data.XXX6 / 1024).toFixed(1) + ' KB/s';
        }
        SpeedBox.innerHTML = '<div style="line-height:1.9;">' +
          '<div><span style="color:#7aa9c4;">' + SpeedI18n.latency + ':</span> <span style="color:#00ff9d;font-weight:bold;">' + Data.Delay + 'ms</span></div>' +
          '<div><span style="color:#7aa9c4;">' + SpeedI18n.download + ':</span> <span style="color:#00f0ff;font-weight:bold;">' + XXText + '</span> <span style="color:#666;font-size:0.78rem;">(' + Math.round(Data.XByte / 1024) + ' KB · HTTP ' + Data.StatusX10 + ')</span></div>' +
          '</div>';
      }
    } else {
      SpeedBox.innerHTML = '<div style="color:#ff3860;">' + SpeedI18n.fail + '</div>';
    }
  } catch (Err) {
    SpeedBox.innerHTML = '<div style="color:#ff3860;">' + SpeedI18n.reqError + ': ' + Err.message + '</div>';
  } finally {
    if (SpeedtestBtn) SpeedtestBtn.disabled = false;
  }
}

// 配置管理相关函数
async function CheckKvStatus() {
  const ApiUrl20134 = window.location.pathname + '/api/config';
  try {
    const Resp20133 = await fetch(ApiUrl20134);
    function GetCookie20132(Name20131) {
      const Val20130 = '; ' + document.cookie;
      const Parts20129 = Val20130.split('; ' + Name20131 + '=');
      if (Parts20129.length === 2) return Parts20129.pop().split(';').shift();
      return null;
    }
    const BrowserLang20128 = navigator.language || navigator.userLanguage || '';
    const SavedLang20127 = localStorage.getItem('preferredLanguage') || GetCookie20132('preferredLanguage');
    let LangCode20126 = 'zh';
    if (SavedLang20127 === 'fa' || SavedLang20127 === 'fa-IR') {
      LangCode20126 = 'fa';
    } else if (SavedLang20127 === 'en' || SavedLang20127 === 'en-US' || SavedLang20127 === 'en-GB') {
      LangCode20126 = 'en';
    } else if (SavedLang20127 === 'zh' || SavedLang20127 === 'zh-CN') {
      LangCode20126 = 'zh';
    } else {
      if (BrowserLang20128.includes('fa') || BrowserLang20128.includes('fa-IR')) {
        LangCode20126 = 'fa';
      } else if (BrowserLang20128.includes('en')) {
        LangCode20126 = 'en';
      } else {
        LangCode20126 = 'zh';
      }
    }
    const IsRtl20126 = LangCode20126 === 'fa';
    const Local20125 = {
      zh: {
        kvDisabled: '💡 未检测到 KV 存储（只读模式）：展示环境变量配置，绑定 KV 后可保存',
        kvNotConfigured: 'KV存储未绑定，无法保存配置。\\n\\n请在Cloudflare Workers中:\\n1. 创建KV命名空间\\n2. 绑定环境变量 K\\n3. 重新部署代码',
        kvNotEnabled: 'KV存储未绑定：当前为只读模式，仅展示环境变量配置',
        kvEnabled: '✅ KV存储已启用，可以使用配置管理功能',
        kvCheckFailed: '⚠️ KV存储检测失败',
        kvCheckFailedFormat: 'KV存储检测失败: 响应格式错误',
        kvCheckFailedStatus: 'KV存储检测失败 - 状态码: ',
        kvCheckFailedError: 'KV存储检测失败 - 错误: '
      },
      fa: {
        kvDisabled: '💡 ذخیره‌سازی KV یافت نشد (حالت فقط‌خواندنی): نمایش پیکربندی متغیرهای محیطی، پس از اتصال KV می‌توانید ذخیره کنید',
        kvNotConfigured: 'ذخیره‌سازی KV پیوند نشده است، امکان ذخیره پیکربندی وجود ندارد.\\n\\nلطفا در Cloudflare Workers:\\n1. فضای نام KV ایجاد کنید\\n2. متغیر محیطی K را پیوند دهید\\n3. کد را دوباره مستقر کنید',
        kvNotEnabled: 'ذخیره‌سازی KV پیوند نشده: حالت فقط‌خواندنی، فقط نمایش پیکربندی متغیرهای محیطی',
        kvEnabled: '✅ ذخیره‌سازی KV فعال است، می‌توانید از مدیریت تنظیمات استفاده کنید',
        kvCheckFailed: '⚠️ بررسی ذخیره‌سازی KV ناموفق',
        kvCheckFailedFormat: 'بررسی ذخیره‌سازی KV ناموفق: خطای فرمت پاسخ',
        kvCheckFailedStatus: 'بررسی ذخیره‌سازی KV ناموفق - کد وضعیت: ',
        kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
      },
      en: {
        kvDisabled: '💡 KV storage not detected (read-only mode): showing environment variable config. After binding KV you can save settings',
        kvNotConfigured: 'KV storage not bound, unable to save config.\\n\\nIn Cloudflare Workers:\\n1. Create a KV namespace\\n2. Bind environment variable K\\n3. Redeploy the code',
        kvNotEnabled: 'KV storage not bound: read-only mode, only showing environment variable config',
        kvEnabled: '✅ KV storage enabled, config management is available',
        kvCheckFailed: '⚠️ KV storage detection failed',
        kvCheckFailedFormat: 'KV storage detection failed: invalid response format',
        kvCheckFailedStatus: 'KV storage detection failed - status code: ',
        kvCheckFailedError: 'KV storage detection failed - error: '
      }
    };
    const I18n20124 = Local20125[LangCode20126] || Local20125['zh'];
    if (Resp20133.status === 503) {
      // KV未配置
      document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + I18n20124.kvDisabled + '</span>';
      document.getElementById('configCard').style.display = 'block';
      document.getElementById('currentConfig').textContent = I18n20124.kvNotConfigured;
    } else if (Resp20133.ok) {
      try {
        const Data20123 = await Resp20133.json();

        // 检查响应是否包含KV配置信息
        if (Data20123 && Data20123.kvEnabled === true) {
          document.getElementById('kvStatus').innerHTML = '<span style="color: #00ff9d;">' + I18n20124.kvEnabled + '</span>';
          document.getElementById('configContent').style.display = 'block';
          document.getElementById('configCard').style.display = 'block';
          const DelayTestXChunk = document.getElementById('latencyTestSection');
          if (DelayTestXChunk) DelayTestXChunk.style.display = 'block';
          const PrefTypeCard = document.getElementById('builtinPreferredCard');
          if (PrefTypeCard) PrefTypeCard.style.display = 'block';
          const PrefFilterCard = document.getElementById('preferredFilterCard');
          if (PrefFilterCard) PrefFilterCard.style.display = 'block';
          await LoadCurrentConfig();
        } else {
          // KV 未绑定：只读模式，展示环境变量配置并给出友好提示
          document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + I18n20124.kvDisabled + '</span>';
          document.getElementById('configCard').style.display = 'block';
          // 只读模式也显示优选类型/优选筛选卡
          const PrefTypeCard2 = document.getElementById('builtinPreferredCard');
          if (PrefTypeCard2) PrefTypeCard2.style.display = 'block';
          const PrefFilterCard2 = document.getElementById('preferredFilterCard');
          if (PrefFilterCard2) PrefFilterCard2.style.display = 'block';
          await LoadCurrentConfig();
        }
      } catch (DataObjErr) {
        document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + I18n20124.kvCheckFailed + '</span>';
        document.getElementById('configCard').style.display = 'block';
        document.getElementById('currentConfig').textContent = I18n20124.kvCheckFailedFormat;
      }
    } else {
      document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + I18n20124.kvDisabled + '</span>';
      document.getElementById('configCard').style.display = 'block';
      document.getElementById('currentConfig').textContent = I18n20124.kvCheckFailedStatus + Resp20133.status;
    }
  } catch (Err20122) {
    function GetCookie(Name) {
      const Val20121 = '; ' + document.cookie;
      const Parts20120 = Val20121.split('; ' + Name + '=');
      if (Parts20120.length === 2) return Parts20120.pop().split(';').shift();
      return null;
    }
    const BrowserLang = navigator.language || navigator.userLanguage || '';
    const SavedLang = localStorage.getItem('preferredLanguage') || GetCookie('preferredLanguage');
    let LangCode = 'zh';
    if (SavedLang === 'fa' || SavedLang === 'fa-IR') {
      LangCode = 'fa';
    } else if (SavedLang === 'en' || SavedLang === 'en-US' || SavedLang === 'en-GB') {
      LangCode = 'en';
    } else if (SavedLang === 'zh' || SavedLang === 'zh-CN') {
      LangCode = 'zh';
    } else {
      if (BrowserLang.includes('fa') || BrowserLang.includes('fa-IR')) {
        LangCode = 'fa';
      } else if (BrowserLang.includes('en')) {
        LangCode = 'en';
      } else {
        LangCode = 'zh';
      }
    }
    const IsRtl = LangCode === 'fa';
    const Local20119 = {
      zh: {
        kvDisabled: '💡 未检测到 KV 存储（只读模式）',
        kvCheckFailedError: 'KV存储检测失败 - 错误: '
      },
      fa: {
        kvDisabled: '💡 ذخیره‌سازی KV یافت نشد (حالت فقط‌خواندنی)',
        kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
      },
      en: {
        kvDisabled: '💡 KV storage not detected (read-only mode)',
        kvCheckFailedError: 'KV storage detection failed - error: '
      }
    };
    const I18n20118 = Local20119[LangCode] || Local20119['zh'];
    document.getElementById('kvStatus').innerHTML = '<span style="color: #ffb400;">' + I18n20118.kvDisabled + '</span>';
    document.getElementById('configCard').style.display = 'block';
    document.getElementById('currentConfig').textContent = I18n20118.kvCheckFailedError + Err20122.message;
    // 兜底分支也显示优选类型/优选筛选卡
    const PrefTypeCard3 = document.getElementById('builtinPreferredCard');
    if (PrefTypeCard3) PrefTypeCard3.style.display = 'block';
    const PrefFilterCard3 = document.getElementById('preferredFilterCard');
    if (PrefFilterCard3) PrefFilterCard3.style.display = 'block';
  }
}
function ReadFieldVal(Id) {
  const El = document.getElementById(Id);
  return El ? El.value : '';
}

function WriteFieldVal(Id, Val = '') {
  const El = document.getElementById(Id);
  if (El) El.value = Val || '';
}

function IsSwitchOn(Val, DefaultOn = false) {
  if (Val === undefined || Val === null || Val === '') return DefaultOn;
  if (Val === true || Val === false) return Val;
  const Text = String(Val).trim().toLowerCase();
  if (Text === 'yes' || Text === 'true' || Text === '1' || Text === 'on') return true;
  if (Text === 'no' || Text === 'false' || Text === '0' || Text === 'off') return false;
  return DefaultOn;
}

function WriteSwitch(Id, Val, DefaultOn = false) {
  const El = document.getElementById(Id);
  if (El) El.checked = IsSwitchOn(Val, DefaultOn);
}

function ReadSwitch(Id, DefaultOn = false) {
  const El = document.getElementById(Id);
  if (!El) return DefaultOn ? 'yes' : 'no';
  return El.checked ? 'yes' : 'no';
}

function SyncProtoUi() {
  const PlainToggle = document.getElementById('ev');
  const TrojanToggle = document.getElementById('et');
  const XhttpToggle = document.getElementById('ex');
  if (PlainToggle && TrojanToggle && XhttpToggle && !PlainToggle.checked && !TrojanToggle.checked && !XhttpToggle.checked) {
    PlainToggle.checked = true;
  }
}

function SyncLinkedUi() {
  SyncProtoUi();
  const EchCheckbox = document.getElementById('ech');
  const PortCtrl = document.getElementById('portControl');
  if (EchCheckbox && PortCtrl && EchCheckbox.checked) {
    PortCtrl.value = 'yes';
  }
  UpdatePathType(ReadFieldVal('customPath'));
  UpdateRegionStatus();
}

// ⚡️ 优选订阅生成模块：根据模式显示/隐藏对应配置区
function UpdateSubModeUi() {
  const Mode = (document.getElementById('subMode') && document.getElementById('subMode').value) || '';
  const Map = {
    'random': ['subRandomSection', 'subPortSection'],
    'custom': ['subCustomSection'],
    'generator': ['subGeneratorSection']
  };
  ['subRandomSection', 'subPortSection', 'subCustomSection', 'subGeneratorSection'].forEach(Id => {
    const El = document.getElementById(Id);
    if (El) El.style.display = (Map[Mode] || []).includes(Id) ? 'block' : 'none';
  });
}

window.UpdateSubModeUi = UpdateSubModeUi;

function ApplyConfigToUi(Config) {
  WriteFieldVal('wkRegion', Config.wk);
  WriteSwitch('ev', Config.ev, true);
  WriteSwitch('et', Config.et, false);
  WriteSwitch('ex', Config.ex, false);
  WriteSwitch('ech', Config.ech, false);
  WriteFieldVal('tp', Config.tp);
  WriteFieldVal('customDNS', Config.customDNS);
  WriteFieldVal('customECHDomain', Config.customECHDomain);
  WriteFieldVal('alpn', Config.alpn);
  WriteFieldVal('scu', Config.scu);
  WriteFieldVal('subConverterUrl', Config.scu);
  WriteSwitch('ena', Config.ena, false);
  WriteSwitch('epd', Config.epd, true);
  WriteSwitch('epi', Config.epi, true);
  WriteSwitch('egi', Config.egi, true);
  WriteSwitch('ipv4Enabled', Config.ipv4, true);
  WriteSwitch('ipv6Enabled', Config.ipv6, true);
  WriteSwitch('ispMobile', Config.ispMobile, true);
  WriteSwitch('ispUnicom', Config.ispUnicom, true);
  WriteSwitch('ispTelecom', Config.ispTelecom, true);
  WriteFieldVal('customPath', Config.d);
  WriteFieldVal('customIP', Config.p);
  WriteFieldVal('yx', Config.yx);
  WriteFieldVal('yxURL', Config.yxURL);
  WriteFieldVal('socksConfig', Config.s);
  WriteFieldVal('subChainProxy', Config.s);
  WriteFieldVal('customHomepage', Config.homepage);
  WriteFieldVal('apiEnabled', Config.ae);
  WriteFieldVal('regionMatching', Config.rm);
  WriteFieldVal('downgradeControl', Config.qj);
  WriteFieldVal('portControl', Config.dkby);
  WriteFieldVal('preferredControl', Config.yxby);
  WriteFieldVal('subMode', Config.subMode);
  WriteFieldVal('subRandomCount', Config.subRandomCount);
  WriteFieldVal('subPort', Config.subPort);
  WriteFieldVal('subCustomIPs', Config.subCustomIPs);
  WriteFieldVal('subGenerator', Config.subGenerator);
  WriteFieldVal('subName', Config.subName);
  WriteFieldVal('subUpdateTime', Config.subUpdateTime);
  SyncLinkedUi();
  UpdateSubModeUi();
}

function CollectUiConfig() {
  const Config = {
    wk: ReadFieldVal('wkRegion'),
    ev: ReadSwitch('ev', true),
    et: ReadSwitch('et', false),
    ex: ReadSwitch('ex', false),
    ech: ReadSwitch('ech', false),
    tp: ReadFieldVal('tp'),
    customDNS: ReadFieldVal('customDNS'),
    customECHDomain: ReadFieldVal('customECHDomain'),
    alpn: ReadFieldVal('alpn'),
    d: ReadFieldVal('customPath'),
    p: ReadFieldVal('customIP'),
    yx: ReadFieldVal('yx'),
    yxURL: ReadFieldVal('yxURL'),
    s: ReadFieldVal('socksConfig'),
    homepage: ReadFieldVal('customHomepage'),
    scu: ReadFieldVal('scu'),
    ena: ReadSwitch('ena', false),
    epd: ReadSwitch('epd', true),
    epi: ReadSwitch('epi', true),
    egi: ReadSwitch('egi', true),
    ae: ReadFieldVal('apiEnabled'),
    rm: ReadFieldVal('regionMatching'),
    qj: ReadFieldVal('downgradeControl'),
    dkby: ReadFieldVal('portControl'),
    yxby: ReadFieldVal('preferredControl'),
    ipv4: ReadSwitch('ipv4Enabled', true),
    ipv6: ReadSwitch('ipv6Enabled', true),
    ispMobile: ReadSwitch('ispMobile', true),
    ispUnicom: ReadSwitch('ispUnicom', true),
    ispTelecom: ReadSwitch('ispTelecom', true),
    subMode: ReadFieldVal('subMode'),
    subRandomCount: ReadFieldVal('subRandomCount'),
    subPort: ReadFieldVal('subPort'),
    subCustomIPs: ReadFieldVal('subCustomIPs'),
    subGenerator: ReadFieldVal('subGenerator'),
    subName: ReadFieldVal('subName'),
    subUpdateTime: ReadFieldVal('subUpdateTime')
  };
  if (Config.ev === 'no' && Config.et === 'no' && Config.ex === 'no') {
    Config.ev = 'yes';
    WriteSwitch('ev', 'yes', true);
  }
  if (Config.ech === 'yes') {
    Config.dkby = 'yes';
    WriteFieldVal('portControl', 'yes');
  }
  // ⚡️ 优选订阅生成模块：按模式清空不相关字段（随右侧保存全部统一保存）
  const PrefSubMode = Config.subMode;
  if (PrefSubMode === 'random') {
    Config.subCustomIPs = '';
    Config.subGenerator = '';
  } else if (PrefSubMode === 'custom') {
    Config.subRandomCount = '';
    Config.subPort = '';
    Config.subGenerator = '';
  } else if (PrefSubMode === 'generator') {
    Config.subCustomIPs = '';
  } else {
    Config.subRandomCount = '';
    Config.subPort = '';
    Config.subCustomIPs = '';
    Config.subGenerator = '';
  }
  // ⚡ 优选工具：订阅接口 / 链式代理 与配置管理同步（随保存全部统一保存）
  const UtilSubApi = ReadFieldVal('subConverterUrl');
  const UtilXXProxy = ReadFieldVal('subChainProxy');
  if (UtilSubApi) { Config.scu = UtilSubApi; WriteFieldVal('scu', UtilSubApi); }
  if (UtilXXProxy) { Config.s = UtilXXProxy; WriteFieldVal('socksConfig', UtilXXProxy); }
  return Config;
}

async function LoadCurrentConfig() {
  const ApiUrl20117 = window.location.pathname + '/api/config';
  try {
    const Resp20116 = await fetch(ApiUrl20117);
    if (Resp20116.status === 503) {
      document.getElementById('currentConfig').textContent = 'KV存储未配置，无法加载配置';
      return;
    }
    if (!Resp20116.ok) {
      const ErrText20115 = await Resp20116.text();
      document.getElementById('currentConfig').textContent = '加载配置失败: ' + ErrText20115;
      return;
    }
    const Config = await Resp20116.json();

    // 过滤掉内部字段 kvEnabled
    const DisplayConfig = {};
    for (const [Key20114, Val20113] of Object.entries(Config)) {
      if (Key20114 !== 'kvEnabled') {
        DisplayConfig[Key20114] = Val20113;
      }
    }
    let ConfigText = '当前配置:\\n';
    if (Object.keys(DisplayConfig).length === 0) {
      ConfigText += '(暂无配置)';
    } else {
      for (const [Key, Val20112] of Object.entries(DisplayConfig)) {
        ConfigText += Key + ': ' + (Val20112 || '(未设置)') + '\\n';
      }
    }
    document.getElementById('currentConfig').textContent = ConfigText;

    ApplyConfigToUi(Config);
  } catch (Err20111) {
    document.getElementById('currentConfig').textContent = '加载配置失败: ' + Err20111.message;
  }
}

// 更新路径类型显示
function UpdatePathType(CustomPath) {
  const PathTypeStatus = document.getElementById('pathTypeStatus');
  const CurUrl20110 = window.location.href;
  const PathParts = window.location.pathname.split('/').filter(ParamVal20109 => ParamVal20109);
  const CurrentPath = PathParts.length > 0 ? PathParts[0] : '';
  if (CustomPath && CustomPath.trim()) {
    // 使用自定义路径
    PathTypeStatus.innerHTML = '<div style="color: #00ff9d;">使用类型: <strong>自定义路径</strong></div>' + '<div style="margin-top: 5px; color: #00f0ff;">当前路径: <span style="color: #ffb400;">' + CustomPath + '</span></div>' + '<div style="margin-top: 5px; font-size: 0.9rem; color: #7aa9c4;">访问地址: ' + (CurUrl20110.split('/')[0] + '//' + CurUrl20110.split('/')[2]) + CustomPath + '/sub</div>';
  } else {
    // 使用 UUID 路径
    PathTypeStatus.innerHTML = '<div style="color: #00ff9d;">使用类型: <strong>UUID 路径</strong></div>' + '<div style="margin-top: 5px; color: #00f0ff;">当前路径: <span style="color: #ffb400;">' + (CurrentPath || '(UUID)') + '</span></div>' + '<div style="margin-top: 5px; font-size: 0.9rem; color: #7aa9c4;">访问地址: ' + CurUrl20110.split('/sub')[0] + '/sub</div>';
  }
}

// 更新wk地区选择的启用/禁用状态
function UpdateRegionStatus() {
  const CustomAddrInput20108 = document.getElementById('customIP');
  const ValRegion = document.getElementById('wkRegion');
  const RegionValX6 = document.getElementById('wkRegionHint');
  if (CustomAddrInput20108 && ValRegion) {
    const IsXCustomAddr = CustomAddrInput20108.value.trim() !== '';
    ValRegion.disabled = IsXCustomAddr;

    // 添加视觉反馈
    if (IsXCustomAddr) {
      ValRegion.style.opacity = '0.5';
      ValRegion.style.cursor = 'not-allowed';
      ValRegion.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
      // 显示提示信息
      if (RegionValX6) {
        RegionValX6.style.display = 'block';
        RegionValX6.style.color = '#ffb400';
      }
    } else {
      ValRegion.style.opacity = '1';
      ValRegion.style.cursor = 'pointer';
      ValRegion.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      // 隐藏提示信息
      if (RegionValX6) {
        RegionValX6.style.display = 'none';
      }
    }
  }
}
async function SaveConfig(CfgData20107) {
  const ApiUrl = window.location.pathname + '/api/config';
  try {
    const Resp20106 = await fetch(ApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(CfgData20107)
    });
    if (Resp20106.status === 503) {
      ShowStatus('KV存储未配置，无法保存配置。请先在Cloudflare Workers中配置KV存储。', 'error');
      return;
    }
    if (!Resp20106.ok) {
      const ErrText20105 = await Resp20106.text();

      // 尝试解析 JSON 错误信息
      try {
        const ErrData20104 = JSON.parse(ErrText20105);
        ShowStatus(ErrData20104.message || '保存失败', 'error');
      } catch (ParseErr20103) {
        // 如果不是 JSON，直接显示文本
        ShowStatus('保存失败: ' + ErrText20105, 'error');
      }
      return;
    }
    const ReadResult20102 = await Resp20106.json();
    ShowStatus(ReadResult20102.message, ReadResult20102.success ? 'success' : 'error');
    if (ReadResult20102.success) {
      await LoadCurrentConfig();
      // 更新wk地区选择状态
      UpdateRegionStatus();
      // 保存成功后刷新页面以更新系统状态
      setTimeout(function () {
        window.location.reload();
      }, 1500);
    } else {}
  } catch (Err20101) {
    ShowStatus('保存失败: ' + Err20101.message, 'error');
  }
}
function ShowStatus(Msg20100, Type20099) {
  const StatusVal = document.getElementById('statusMessage');
  if (StatusVal) {
    StatusVal.textContent = Msg20100;
    StatusVal.style.display = 'block';
    StatusVal.style.color = Type20099 === 'success' ? '#00f0ff' : '#ff3860';
    StatusVal.style.borderColor = Type20099 === 'success' ? '#00f0ff' : '#ff3860';
    setTimeout(function () {
      StatusVal.style.display = 'none';
    }, 3000);
  }
  // 同步在底部操作条上方弹出霓虹反馈
  if (typeof window.ShowOpStatus === 'function') {
    window.ShowOpStatus(Msg20100, Type20099 === 'success' ? 'ok' : 'err');
  }
}
async function ResetAllConfig() {
  if (confirm('确定要重置所有配置吗？这将清空所有KV配置，恢复为环境变量设置。')) {
    try {
      const Resp20098 = await fetch(window.location.pathname + '/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          wk: '',
          d: '',
          p: '',
          yx: '',
          yxURL: '',
          s: '',
          ae: '',
          rm: '',
          qj: '',
          dkby: '',
          yxby: '',
          ev: '',
          et: '',
          ex: '',
          ech: '',
          tp: '',
          customDNS: '',
          customECHDomain: '',
          scu: '',
          epd: '',
          epi: '',
          egi: '',
          ipv4: '',
          ipv6: '',
          ispMobile: '',
          ispUnicom: '',
          ispTelecom: '',
          homepage: '',
          alpn: ''
        })
      });
      if (Resp20098.status === 503) {
        ShowStatus('KV存储未配置，无法重置配置。', 'error');
        return;
      }
      if (!Resp20098.ok) {
        const ErrText = await Resp20098.text();

        // 尝试解析 JSON 错误信息
        try {
          const ErrData = JSON.parse(ErrText);
          ShowStatus(ErrData.message || '重置失败', 'error');
        } catch (ParseErr) {
          // 如果不是 JSON，直接显示文本
          ShowStatus('重置失败: ' + ErrText, 'error');
        }
        return;
      }
      const ReadResult20097 = await Resp20098.json();
      ShowStatus(ReadResult20097.message || '配置已重置', ReadResult20097.success ? 'success' : 'error');
      if (ReadResult20097.success) {
        await LoadCurrentConfig();
        // 更新wk地区选择状态
        UpdateRegionStatus();
        // 刷新页面以更新系统状态
        setTimeout(function () {
          window.location.reload();
        }, 1500);
      }
    } catch (Err20096) {
      ShowStatus('重置失败: ' + Err20096.message, 'error');
    }
  }
}
async function CheckEchStatus() {
  const EchStatusVal = document.getElementById('echStatus');
  if (!EchStatusVal) return;
  try {
    const CurUrl = window.location.href;
    const SubUrl = CurUrl + '/sub';
    EchStatusVal.innerHTML = 'ECH状态: <span style="color: #ffb400;">检测中...</span>';
    const Resp20095 = await fetch(SubUrl, {
      method: 'GET',
      headers: {
        'Accept': 'text/plain'
      }
    });
    const EchStatusHeader = Resp20095.headers.get('X-ECH-Status');
    const EchConfigLength = Resp20095.headers.get('X-ECH-Config-Length');
    if (EchStatusHeader === 'ENABLED') {
      EchStatusVal.innerHTML = 'ECH状态: <span style="color: #00ff9d;">✅ 已启用' + (EchConfigLength ? ' (配置长度: ' + EchConfigLength + ')' : '') + '</span>';
    } else {
      EchStatusVal.innerHTML = 'ECH状态: <span style="color: #ffb400;">⚠️ 未启用</span>';
    }
  } catch (Err20094) {
    EchStatusVal.innerHTML = 'ECH状态: <span style="color: #ff3860;">❌ 检测失败: ' + Err20094.message + '</span>';
  }
}
document.addEventListener('DOMContentLoaded', function () {
  CreateMatrixRain();
  CheckSystemStatus();
  CheckKvStatus();
  CheckEchStatus();
  UpdateSubModeUi();

  // ECH 开启时自动联动开启仅TLS
  const EchCheckbox = document.getElementById('ech');
  const PortCtrl = document.getElementById('portControl');
  if (EchCheckbox && PortCtrl) {
    EchCheckbox.addEventListener('change', function () {
      if (this.checked) {
        // ECH 开启时，自动设置仅TLS为 yes
        PortCtrl.value = 'yes';
      }
      SyncLinkedUi();
    });

    // 页面加载时，如果 ECH 已勾选，也自动设置仅TLS
    if (EchCheckbox.checked) {
      PortCtrl.value = 'yes';
    }
  }

  // 监听customIP输入框变化，实时更新wk地区选择状态
  const CustomAddrInput = document.getElementById('customIP');
  if (CustomAddrInput) {
    CustomAddrInput.addEventListener('input', function () {
      SyncLinkedUi();
    });
  }


  const CustomPathInput = document.getElementById('customPath');
  if (CustomPathInput) {
    CustomPathInput.addEventListener('input', function () {
      SyncLinkedUi();
    });
  }

  ['ev', 'et', 'ex'].forEach(function (ProtoId) {
    const ProtoToggle = document.getElementById(ProtoId);
    if (ProtoToggle) {
      ProtoToggle.addEventListener('change', function () {
        SyncLinkedUi();
      });
    }
  });

  // 阻止表单默认提交（保存按钮已统一到底部操作条）
  ['regionForm', 'otherConfigForm', 'advancedConfigForm'].forEach(function (Local20093) {
    const FormVal = document.getElementById(Local20093);
    if (FormVal) FormVal.addEventListener('submit', function (EventVal20092) {
      EventVal20092.preventDefault();
    });
  });

  // 在任意输入框按下回车，触发统一保存
  document.querySelectorAll('#configContent input[type="text"], #configContent input[type="number"]').forEach(function (Local20091) {
    Local20091.addEventListener('keydown', function (EventVal20090) {
      if (EventVal20090.key === 'Enter') {
        EventVal20090.preventDefault();
        SaveAllConfig();
      }
    });
  });

  // 统一保存：一次性收齐所有字段
  function CollectAllConfig() {
    return CollectUiConfig();
  }
  async function SaveAllConfig() {
    // 至少启用一个通道
    const Val220085 = document.getElementById('ev'),
      Val220084 = document.getElementById('et'),
      Val220083 = document.getElementById('ex');
    if (Val220085 && Val220084 && Val220083 && !Val220085.checked && !Val220084.checked && !Val220083.checked) {
      ShowOpStatus('${((LangCode236 === "fa") ? "حداقل یک پروتکل را فعال کنید!" : ((LangCode236 === "en") ? "Please enable at least one protocol!" : "至少需要启用一个协议！"))}', 'err');
      ShowToast('${((LangCode236 === "fa") ? "حداقل یک پروتکل را فعال کنید!" : ((LangCode236 === "en") ? "Please enable at least one protocol!" : "至少需要启用一个协议！"))}', 'warn');
      return;
    }
    const Local20082 = document.getElementById('cpBtnSaveAll');
    if (Local20082) {
      Local20082.classList.add('cp-action-btn-saving');
      Local20082.disabled = true;
    }
    try {
      await SaveConfig(CollectAllConfig());
    } finally {
      if (Local20082) {
        Local20082.classList.remove('cp-action-btn-saving');
        Local20082.disabled = false;
      }
    }
  }
  window.SaveAllConfig = SaveAllConfig;
  function ShowOpStatus(Msg, Type) {
    const Local20081 = document.getElementById('cpActionStatus');
    if (!Local20081) return;
    Local20081.textContent = Msg;
    Local20081.classList.toggle('cp-err', Type === 'err');
    Local20081.classList.add('cp-show');
    clearTimeout(ShowOpStatus._t);
    ShowOpStatus._t = setTimeout(function () {
      Local20081.classList.remove('cp-show');
    }, 2400);
  }
  window.ShowOpStatus = ShowOpStatus;

  // 绑定底部统一操作条
  const OpVal = document.getElementById('cpActionBar');
  const ValToSave = document.getElementById('cpBtnSaveAll');
  if (ValToSave) ValToSave.addEventListener('click', async function () {
    ValToSave.classList.add('cp-action-btn-saving');
    try {
      await SaveAllConfig();
      if (OpVal) OpVal.classList.remove('cp-dirty');
    } finally {
      ValToSave.classList.remove('cp-action-btn-saving');
    }
  });
  const Val2Val20080 = document.getElementById('cpBtnRefresh');
  if (Val2Val20080) Val2Val20080.addEventListener('click', async function () {
    Val2Val20080.classList.add('cp-action-btn-saving');
    try {
      await LoadCurrentConfig();
      if (OpVal) OpVal.classList.remove('cp-dirty');
      ShowOpStatus('${((LangCode236 === "fa") ? "تنظیمات تازه‌سازی شد" : ((LangCode236 === "en") ? "Settings refreshed" : "配置已刷新"))}');
    } catch (FlushErr) {
      ShowOpStatus('${((LangCode236 === "fa") ? "بازخوانی ناموفق بود" : ((LangCode236 === "en") ? "Refresh failed" : "配置刷新失败"))}' + (FlushErr && FlushErr.message ? ': ' + FlushErr.message : ''), 'err');
    } finally {
      Val2Val20080.classList.remove('cp-action-btn-saving');
    }
  });
  const ValReset = document.getElementById('cpBtnReset');
  if (ValReset) ValReset.addEventListener('click', ResetAllConfig);

  // 修改字段时把 FAB 标记为 "未保存"
  function MarkDirty() {
    if (OpVal) OpVal.classList.add('cp-dirty');
  }
  const DirtyXX = document.getElementById('configContent') || document;
  ['input', 'change'].forEach(function (Local20079) {
    DirtyXX.addEventListener(Local20079, function (EventVal20078) {
      const Local20077 = EventVal20078.target;
      if (!Local20077 || !Local20077.tagName) return;
      const Local20076 = Local20077.tagName.toLowerCase();
      if (Local20076 === 'input' || Local20076 === 'select' || Local20076 === 'textarea') {
        // 跳过延迟测试相关输入，避免误触
        if (Local20077.id && /^(latencyTestInput|fetchURLInput|latencyTestPort|randomIPCount|testThreads|ipSourceSelect)$/.test(Local20077.id)) return;
        MarkDirty();
      }
    });
  });

  // Ctrl+S / Cmd+S 触发保存
  window.addEventListener('keydown', function (EventVal20075) {
    if ((EventVal20075.ctrlKey || EventVal20075.metaKey) && (EventVal20075.key === 's' || EventVal20075.key === 'S')) {
      EventVal20075.preventDefault();
      if (ValToSave && !ValToSave.classList.contains('cp-action-btn-saving')) {
        ValToSave.click();
      }
    }
  });
  let TestCtrl = null;
  let TestResults = [];
  const StartTest = document.getElementById('startLatencyTest');
  const TestVal = document.getElementById('stopLatencyTest');
  const TestStatus = document.getElementById('latencyTestStatus');
  const TestResultsVal = document.getElementById('latencyTestResults');
  const ResultLists = document.getElementById('latencyResultsList');
  const OverwriteSelected = document.getElementById('overwriteSelectedToYx');
  const AppendSelected = document.getElementById('appendSelectedToYx');
  const SelectVal2 = document.getElementById('selectAllResults');
  const Val2Val = document.getElementById('deselectAllResults');
  const AddrSourceSel = document.getElementById('ipSourceSelect');
  const ManualInputVal = document.getElementById('manualInputDiv');
  const UrlGetVal = document.getElementById('urlFetchDiv');
  const DelayTestInput = document.getElementById('latencyTestInput');
  const GetUrlInput = document.getElementById('fetchURLInput');
  const DelayTestPort = document.getElementById('latencyTestPort');
  const RandAddrCount = document.getElementById('randomIPCount');
  const CfRand = document.getElementById('cfRandomDiv');
  const RandomCountVal = document.getElementById('randomCountDiv');
  const BuildCfAddrVal = document.getElementById('generateCFIPBtn');
  const GetAddrVal = document.getElementById('fetchIPBtn');
  if (DelayTestInput) {
    const XSaveTestInput = localStorage.getItem('latencyTestInput');
    if (XSaveTestInput) DelayTestInput.value = XSaveTestInput;
    DelayTestInput.addEventListener('input', function () {
      localStorage.setItem('latencyTestInput', this.value);
    });
  }
  if (GetUrlInput) {
    const XSaveGetUrl = localStorage.getItem('fetchURLInput');
    if (XSaveGetUrl) GetUrlInput.value = XSaveGetUrl;
    GetUrlInput.addEventListener('input', function () {
      localStorage.setItem('fetchURLInput', this.value);
    });
  }
  if (DelayTestPort) {
    const XSavePort = localStorage.getItem('latencyTestPort');
    if (XSavePort) DelayTestPort.value = XSavePort;
    DelayTestPort.addEventListener('input', function () {
      localStorage.setItem('latencyTestPort', this.value);
    });
  }
  if (RandAddrCount) {
    const XSaveCount = localStorage.getItem('randomIPCount');
    if (XSaveCount) RandAddrCount.value = XSaveCount;
    RandAddrCount.addEventListener('input', function () {
      localStorage.setItem('randomIPCount', this.value);
    });
    // 初始化时，如果默认是隐藏的，则禁用输入框
    if (RandomCountVal && RandomCountVal.style.display === 'none') {
      RandAddrCount.disabled = true;
    }
  }
  const TestXXXInput = document.getElementById('testThreads');
  if (TestXXXInput) {
    const XSaveXXX = localStorage.getItem('testThreads');
    if (XSaveXXX) TestXXXInput.value = XSaveXXX;
    TestXXXInput.addEventListener('input', function () {
      localStorage.setItem('testThreads', this.value);
    });
  }
  if (AddrSourceSel) {
    const XSaveX = localStorage.getItem('ipSourceSelect');
    const CurrentSource = XSaveX || AddrSourceSel.value || 'manual';
    if (XSaveX) {
      AddrSourceSel.value = XSaveX;
    }
    ManualInputVal.style.display = CurrentSource === 'manual' ? 'block' : 'none';
    UrlGetVal.style.display = CurrentSource === 'urlFetch' ? 'block' : 'none';
    CfRand.style.display = CurrentSource === 'cfRandom' ? 'block' : 'none';
    RandomCountVal.style.display = CurrentSource === 'cfRandom' ? 'block' : 'none';
    // 当隐藏时禁用输入框，避免表单验证错误
    if (RandAddrCount) {
      RandAddrCount.disabled = CurrentSource !== 'cfRandom';
    }
  }
  const CfCidrs = ['173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22', '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20', '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13', '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22'];
  function RandIpFromCidr(Cidr20074) {
    const [BaseAddr, PrefixLen] = Cidr20074.split('/');
    const Prefix = parseInt(PrefixLen);
    const HostVal = 32 - Prefix;
    const AddrPartItems = BaseAddr.split('.').map(ParamVal20073 => parseInt(ParamVal20073));
    const AddrVal = AddrPartItems[0] << 24 | AddrPartItems[1] << 16 | AddrPartItems[2] << 8 | AddrPartItems[3];
    const RandomOffset = Math.floor(Math.random() * Math.pow(2, HostVal));
    const Mask = 0xFFFFFFFF << HostVal >>> 0;
    const RandomAddr = ((AddrVal & Mask) >>> 0) + RandomOffset >>> 0;
    return [RandomAddr >>> 24 & 0xFF, RandomAddr >>> 16 & 0xFF, RandomAddr >>> 8 & 0xFF, RandomAddr & 0xFF].join('.');
  }
  function GenRandCfIp(Count20072, Port20071) {
    const Addrs20070 = [];
    for (let IdxVal20069 = 0; IdxVal20069 < Count20072; IdxVal20069++) {
      const Cidr = CfCidrs[Math.floor(Math.random() * CfCidrs.length)];
      const Addr20068 = RandIpFromCidr(Cidr);
      Addrs20070.push(Addr20068 + ':' + Port20071);
    }
    return Addrs20070;
  }
  if (AddrSourceSel) {
    AddrSourceSel.addEventListener('change', function () {
      const Val = this.value;
      localStorage.setItem('ipSourceSelect', Val);
      ManualInputVal.style.display = Val === 'manual' ? 'block' : 'none';
      UrlGetVal.style.display = Val === 'urlFetch' ? 'block' : 'none';
      CfRand.style.display = Val === 'cfRandom' ? 'block' : 'none';
      RandomCountVal.style.display = Val === 'cfRandom' ? 'block' : 'none';
      // 当隐藏时禁用输入框，避免表单验证错误
      if (RandAddrCount) {
        RandAddrCount.disabled = Val !== 'cfRandom';
      }
    });
  }
  if (BuildCfAddrVal) {
    BuildCfAddrVal.addEventListener('click', function () {
      const Count = parseInt(document.getElementById('randomIPCount').value) || 20;
      const Port20067 = document.getElementById('latencyTestPort').value || '443';
      const AddrsX2 = GenRandCfIp(Count, Port20067);
      document.getElementById('latencyTestInput').value = AddrsX2.join(',');
      ManualInputVal.style.display = 'block';
      ShowStatus('${((LangCode236 === "fa") ? "تولید شد" : ((LangCode236 === "en") ? "Generated" : "已生成"))} ' + Count + ' ${((LangCode236 === "fa") ? "IP تصادفی CF" : ((LangCode236 === "en") ? "CF random IP(s)" : "个CF随机IP"))}', 'success');
    });
  }
  if (GetAddrVal) {
    GetAddrVal.addEventListener('click', async function () {
      const UrlInput = document.getElementById('fetchURLInput');
      const GetUrl = UrlInput.value.trim();
      if (!GetUrl) {
        ShowToast('${((LangCode236 === "fa") ? "لطفا URL را وارد کنید" : ((LangCode236 === "en") ? "Please enter URL" : "请输入URL"))}', 'warn');
        return;
      }
      GetAddrVal.disabled = true;
      GetAddrVal.textContent = '${((LangCode236 === "fa") ? "در حال دریافت..." : ((LangCode236 === "en") ? "Fetching..." : "获取中..."))}';
      try {
        // 支持多个 URL（逗号分隔）以及返回内容中逗号分隔的多个 IP/节点
        const UrlItems = Array.from(new Set(GetUrl.split(',').map(UrlVal20066 => UrlVal20066.trim()).filter(UrlVal20065 => UrlVal20065)));
        const ValItems = [];
        for (const UrlVal of UrlItems) {
          const Resp = await fetch(UrlVal);
          if (!Resp.ok) {
            throw new Error('HTTP ' + Resp.status + ' @ ' + UrlVal);
          }
          const Text20064 = await Resp.text();

          // 先按行分割，再在每行内按逗号分割，兼容“多行 + 逗号分隔”两种格式
          const ValUrlItems = Text20064.split(/\\r?\\n/).map(LineVal20063 => LineVal20063.trim()).filter(LineVal20062 => LineVal20062 && !LineVal20062.startsWith('#')).flatMap(LineVal => LineVal.split(',').map(ParamVal20061 => ParamVal20061.trim()).filter(ParamVal => ParamVal));
          ValItems.push(...ValUrlItems);
        }
        if (ValItems.length > 0) {
          document.getElementById('latencyTestInput').value = ValItems.join(',');
          ManualInputVal.style.display = 'block';
          ShowStatus('${((LangCode236 === "fa") ? "دریافت شد" : ((LangCode236 === "en") ? "Fetched" : "已获取"))} ' + ValItems.length + ' ${((LangCode236 === "fa") ? "IP" : ((LangCode236 === "en") ? "IP(s)" : "个IP"))}', 'success');
        } else {
          ShowStatus('${((LangCode236 === "fa") ? "داده‌ای یافت نشد" : ((LangCode236 === "en") ? "No data found" : "未获取到数据"))}', 'error');
        }
      } catch (Err20060) {
        ShowStatus('${((LangCode236 === "fa") ? "خطا در دریافت" : ((LangCode236 === "en") ? "Fetch failed" : "获取失败"))}: ' + Err20060.message, 'error');
      } finally {
        GetAddrVal.disabled = false;
        GetAddrVal.textContent = '⬇ ${((LangCode236 === "fa") ? "دریافت IP" : ((LangCode236 === "en") ? "Fetch IP" : "获取IP"))}';
      }
    });
  }
  if (StartTest) {
    StartTest.addEventListener('click', async function () {
      const InputVal20059 = document.getElementById('latencyTestInput');
      const PortVal = document.getElementById('latencyTestPort');
      const XXNum = document.getElementById('testThreads');
      const InputVal = InputVal20059.value.trim();
      const DefaultPort = PortVal.value || '443';
      const XXX = parseInt(XXNum.value) || 5;
      if (!InputVal) {
        ShowStatus('${((LangCode236 === "fa") ? "لطفا IP یا دامنه وارد کنید" : ((LangCode236 === "en") ? "Please enter IP or domain" : "请输入IP或域名"))}', 'error');
        return;
      }
      const Local20058 = InputVal.split(',').map(I18n20057 => I18n20057.trim()).filter(I18n20056 => I18n20056);
      if (Local20058.length === 0) return;
      StartTest.style.display = 'none';
      TestVal.style.display = 'inline-block';
      TestStatus.style.display = 'block';
      TestResultsVal.style.display = 'block';
      ResultLists.innerHTML = '';
      TestResults = [];
      if (CityFilterVal) {
        CityFilterVal.style.display = 'none';
      }
      TestCtrl = new AbortController();
      let Local20055 = 0;
      const Local20054 = Local20058.length;
      function ParseTarget(Target20053) {
        let Host20052 = Target20053;
        let Port20051 = DefaultPort;
        let NodeName20050 = '';
        if (Target20053.includes('#')) {
          const Parts20049 = Target20053.split('#');
          NodeName20050 = Parts20049[1] || '';
          Host20052 = Parts20049[0];
        }
        if (Host20052.includes(':') && !Host20052.startsWith('[')) {
          const Val220048 = Host20052.lastIndexOf(':');
          const ValPort = Host20052.substring(Val220048 + 1);
          if (/^[0-9]+$/.test(ValPort)) {
            Port20051 = ValPort;
            Host20052 = Host20052.substring(0, Val220048);
          }
        } else if (Host20052.includes(']:')) {
          const Parts20047 = Host20052.split(']:');
          Host20052 = Parts20047[0] + ']';
          Port20051 = Parts20047[1];
        }
        return {
          host: Host20052,
          port: Port20051,
          nodeName: NodeName20050
        };
      }
      function RenderResult(ReadResult20046, Idx20045, Val220044 = true) {
        // 展示全部测速结果：成功项正常显示，失败/超时项以灰色显示原因（保证始终有反馈）
        if (!ReadResult20046.success) {
          const FailItem = document.createElement('div');
          FailItem.style.cssText = 'display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #331111; gap: 10px; opacity: 0.7;';
          FailItem.dataset.index = Idx20045;
          FailItem.dataset.colo = ReadResult20046.colo || '';
          if (!Val220044) FailItem.style.display = 'none';
          const FailCheckbox = document.createElement('input');
          FailCheckbox.type = 'checkbox';
          FailCheckbox.checked = false;
          FailCheckbox.disabled = true;
          FailCheckbox.dataset.index = Idx20045;
          FailCheckbox.style.cssText = 'width: 18px; height: 18px; cursor: not-allowed; opacity: 0.4;';
          const FailXX = document.createElement('div');
          FailXX.style.cssText = 'flex: 1; font-family: monospace; font-size: 13px;';
          const ErrXX = (ReadResult20046.error && ReadResult20046.error !== '测试失败') ? ReadResult20046.error : '连接失败/超时';
          FailXX.innerHTML = '<span style="color:#8a8a8a;">' + ReadResult20046.host + ':' + ReadResult20046.port + '</span> <span style="color:#ff6666;">✗ ' + ErrXX + '</span>';
          FailItem.appendChild(FailCheckbox);
          FailItem.appendChild(FailXX);
          ResultLists.appendChild(FailItem);
          return null;
        }
        const ResultItem = document.createElement('div');
        ResultItem.style.cssText = 'display: flex; align-items: center; padding: 8px; border-bottom: 1px solid #003300; gap: 10px;';
        ResultItem.dataset.index = Idx20045;
        ResultItem.dataset.colo = ReadResult20046.colo || '';
        if (!Val220044) {
          ResultItem.style.display = 'none';
        }
        const Checkbox20043 = document.createElement('input');
        Checkbox20043.type = 'checkbox';
        Checkbox20043.checked = true;
        Checkbox20043.disabled = false;
        Checkbox20043.dataset.index = Idx20045;
        Checkbox20043.style.cssText = 'width: 18px; height: 18px; cursor: pointer;';
        const Local20042 = document.createElement('div');
        Local20042.style.cssText = 'flex: 1; font-family: monospace; font-size: 13px;';
        const ColoName20041 = ReadResult20046.colo ? GetColoName(ReadResult20046.colo) : '';
        const ColoShow = ColoName20041 ? ' <span style="color: #00aaff;">[' + ColoName20041 + ']</span>' : '';
        Local20042.innerHTML = '<span style="color: #00f0ff;">' + ReadResult20046.host + ':' + ReadResult20046.port + '</span>' + ColoShow + ' <span style="color: #ffff00;">' + ReadResult20046.latency + 'ms</span>';
        ResultItem.appendChild(Checkbox20043);
        ResultItem.appendChild(Local20042);
        ResultLists.appendChild(ResultItem);
        return ResultItem;
      }
      async function TestOne(Target) {
        if (TestCtrl.signal.aborted) return null;
        const {
          host: Host20040,
          port: Port20039,
          nodeName: NodeName
        } = ParseTarget(Target);
        const ReadResult20038 = await TestLatency(Host20040, Port20039, TestCtrl.signal);
        ReadResult20038.host = Host20040;
        ReadResult20038.port = Port20039;
        ReadResult20038.nodeName = ReadResult20038.success && ReadResult20038.colo ? NodeName || 'CF-' + ReadResult20038.colo : NodeName || Host20040;
        return ReadResult20038;
      }
      for (let IdxVal20037 = 0; IdxVal20037 < Local20054; IdxVal20037 += XXX) {
        if (TestCtrl.signal.aborted) break;
        const Local20036 = Local20058.slice(IdxVal20037, Math.min(IdxVal20037 + XXX, Local20054));
        TestStatus.textContent = '${((LangCode236 === "fa") ? "در حال تست" : ((LangCode236 === "en") ? "Testing" : "测试中"))}: ' + (IdxVal20037 + 1) + '-' + Math.min(IdxVal20037 + XXX, Local20054) + '/' + Local20054 + ' (${((LangCode236 === "fa") ? "رشته‌ها" : ((LangCode236 === "en") ? "Threads" : "线程"))}: ' + XXX + ')';
        const Results = await Promise.all(Local20036.map(I18n => TestOne(I18n)));
        for (const ReadResult20035 of Results) {
          if (ReadResult20035) {
            const Idx20034 = TestResults.length;
            TestResults.push(ReadResult20035);
            RenderResult(ReadResult20035, Idx20034);
            Local20055++;
          }
        }
      }
      const SuccessCnt20001 = TestResults.filter(LocalReadResult20001 => LocalReadResult20001.success).length;
      const FailCnt20002 = TestResults.length - SuccessCnt20001;
      TestStatus.textContent = '${((LangCode236 === "fa") ? "تست کامل شد" : ((LangCode236 === "en") ? "Test complete" : "测试完成"))}: ' + SuccessCnt20001 + '/' + Local20054 + (FailCnt20002 > 0 ? ' (' + FailCnt20002 + ' ${((LangCode236 === "fa") ? "ناموفق" : ((LangCode236 === "en") ? "failed" : "失败"))})' : '');
      StartTest.style.display = 'inline-block';
      TestVal.style.display = 'none';

      // 更新城市选择器
      UpdateCityFilter();
    });
  }
  if (TestVal) {
    TestVal.addEventListener('click', function () {
      if (TestCtrl) {
        TestCtrl.abort();
      }
      StartTest.style.display = 'inline-block';
      TestVal.style.display = 'none';
      TestStatus.textContent = '${((LangCode236 === "fa") ? "تست متوقف شد" : ((LangCode236 === "en") ? "Test stopped" : "测试已停止"))}';
    });
  }
  if (SelectVal2) {
    SelectVal2.addEventListener('click', function () {
      const Local20033 = ResultLists.querySelectorAll('input[type="checkbox"]:not(:disabled)');
      Local20033.forEach(Local20032 => Local20032.checked = true);
    });
  }
  if (Val2Val) {
    Val2Val.addEventListener('click', function () {
      const Local20031 = ResultLists.querySelectorAll('input[type="checkbox"]');
      Local20031.forEach(Local20030 => Local20030.checked = false);
    });
  }

  // 获取选中项的通用函数
  function GetSelected() {
    const Local20029 = ResultLists.querySelectorAll('input[type="checkbox"]:checked');
    if (Local20029.length === 0) {
      if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${((LangCode236 === "fa") ? "لطفا حداقل یک مورد انتخاب کنید" : ((LangCode236 === "en") ? "Please select at least one item" : "请至少选择一项"))}'; TestStatus.style.color = '#ffcc00'; }
      return null;
    }
    const SelectedItemItems20028 = [];
    Local20029.forEach(Local20027 => {
      const Idx20026 = parseInt(Local20027.dataset.index);
      const ReadResult20025 = TestResults[Idx20026];
      if (ReadResult20025 && ReadResult20025.success) {
        const ColoName = ReadResult20025.colo ? GetColoName(ReadResult20025.colo) : ReadResult20025.nodeName;
        const ItemStr = ReadResult20025.host + ':' + ReadResult20025.port + '#' + ColoName;
        SelectedItemItems20028.push(ItemStr);
      }
    });
    return SelectedItemItems20028;
  }

  // 覆盖添加
  if (OverwriteSelected) {
    OverwriteSelected.addEventListener('click', async function () {
      const SelectedItemItems20024 = GetSelected();
      if (!SelectedItemItems20024 || SelectedItemItems20024.length === 0) return;
      const ValInput20023 = document.getElementById('yx');
      const NewVal20022 = SelectedItemItems20024.join(',');
      ValInput20023.value = NewVal20022;
      OverwriteSelected.disabled = true;
      AppendSelected.disabled = true;
      OverwriteSelected.textContent = '${((LangCode236 === "fa") ? "در حال ذخیره..." : ((LangCode236 === "en") ? "Saving..." : "保存中..."))}';
      try {
        const CfgData20021 = {
          customIP: document.getElementById('customIP').value,
          yx: NewVal20022,
          yxURL: document.getElementById('yxURL').value,
          s: document.getElementById('socksConfig').value
        };
        await SaveConfig(CfgData20021);
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${((LangCode236 === "fa") ? "موفقیت‌آمیز بود" : ((LangCode236 === "en") ? "Overwritten" : "已覆盖"))} ' + SelectedItemItems20024.length + ' ${((LangCode236 === "fa") ? "مورد و ذخیره شد" : ((LangCode236 === "en") ? " items saved" : "项并已保存"))}'; TestStatus.style.color = '#00ff9d'; }
      } catch (Err20020) {
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${((LangCode236 === "fa") ? "خطا در ذخیره" : ((LangCode236 === "en") ? "Save failed" : "保存失败"))}: ' + Err20020.message; TestStatus.style.color = '#ff6666'; }
      } finally {
        OverwriteSelected.disabled = false;
        AppendSelected.disabled = false;
        OverwriteSelected.textContent = '${((LangCode236 === "fa") ? "覆盖添加" : ((LangCode236 === "en") ? "Overwrite add" : "覆盖添加"))}';
      }
    });
  }

  // 追加添加
  if (AppendSelected) {
    AppendSelected.addEventListener('click', async function () {
      const SelectedItemItems = GetSelected();
      if (!SelectedItemItems || SelectedItemItems.length === 0) return;
      const ValInput = document.getElementById('yx');
      const Cur = ValInput.value.trim();
      const NewItemItems = SelectedItemItems.join(',');
      const NewVal = Cur ? Cur + ',' + NewItemItems : NewItemItems;
      ValInput.value = NewVal;
      OverwriteSelected.disabled = true;
      AppendSelected.disabled = true;
      AppendSelected.textContent = '${((LangCode236 === "fa") ? "در حال ذخیره..." : ((LangCode236 === "en") ? "Saving..." : "保存中..."))}';
      try {
        const CfgData = {
          customIP: document.getElementById('customIP').value,
          yx: NewVal,
          yxURL: document.getElementById('yxURL').value,
          s: document.getElementById('socksConfig').value
        };
        await SaveConfig(CfgData);
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${((LangCode236 === "fa") ? "موفقیت‌آمیز بود" : ((LangCode236 === "en") ? "Appended" : "已追加"))} ' + SelectedItemItems.length + ' ${((LangCode236 === "fa") ? "مورد و ذخیره شد" : ((LangCode236 === "en") ? " items saved" : "项并已保存"))}'; TestStatus.style.color = '#00ff9d'; }
      } catch (Err20019) {
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${((LangCode236 === "fa") ? "خطا در ذخیره" : ((LangCode236 === "en") ? "Save failed" : "保存失败"))}: ' + Err20019.message; TestStatus.style.color = '#ff6666'; }
      } finally {
        OverwriteSelected.disabled = false;
        AppendSelected.disabled = false;
        AppendSelected.textContent = '${((LangCode236 === "fa") ? "追加添加" : ((LangCode236 === "en") ? "Append add" : "追加添加"))}';
      }
    });
  }
  function AddrToHex(Addr) {
    const Parts = Addr.split('.');
    if (Parts.length !== 4) return null;
    let Hex = '';
    for (let IdxVal = 0; IdxVal < 4; IdxVal++) {
      const Num = parseInt(Parts[IdxVal]);
      if (isNaN(Num) || Num < 0 || Num > 255) return null;
      Hex += Num.toString(16).padStart(2, '0');
    }
    return Hex;
  }
  const ColoMap = {
    'SJC': '🇺🇸 圣何塞',
    'LAX': '🇺🇸 洛杉矶',
    'SEA': '🇺🇸 西雅图',
    'SFO': '🇺🇸 旧金山',
    'DFW': '🇺🇸 达拉斯',
    'ORD': '🇺🇸 芝加哥',
    'IAD': '🇺🇸 华盛顿',
    'ATL': '🇺🇸 亚特兰大',
    'MIA': '🇺🇸 迈阿密',
    'DEN': '🇺🇸 丹佛',
    'PHX': '🇺🇸 凤凰城',
    'BOS': '🇺🇸 波士顿',
    'EWR': '🇺🇸 纽瓦克',
    'JFK': '🇺🇸 纽约',
    'LAS': '🇺🇸 拉斯维加斯',
    'MSP': '🇺🇸 明尼阿波利斯',
    'DTW': '🇺🇸 底特律',
    'PHL': '🇺🇸 费城',
    'CLT': '🇺🇸 夏洛特',
    'SLC': '🇺🇸 盐湖城',
    'PDX': '🇺🇸 波特兰',
    'SAN': '🇺🇸 圣地亚哥',
    'TPA': '🇺🇸 坦帕',
    'IAH': '🇺🇸 休斯顿',
    'MCO': '🇺🇸 奥兰多',
    'AUS': '🇺🇸 奥斯汀',
    'BNA': '🇺🇸 纳什维尔',
    'RDU': '🇺🇸 罗利',
    'IND': '🇺🇸 印第安纳波利斯',
    'CMH': '🇺🇸 哥伦布',
    'MCI': '🇺🇸 堪萨斯城',
    'OMA': '🇺🇸 奥马哈',
    'ABQ': '🇺🇸 阿尔伯克基',
    'OKC': '🇺🇸 俄克拉荷马城',
    'MEM': '🇺🇸 孟菲斯',
    'JAX': '🇺🇸 杰克逊维尔',
    'RIC': '🇺🇸 里士满',
    'BUF': '🇺🇸 布法罗',
    'PIT': '🇺🇸 匹兹堡',
    'CLE': '🇺🇸 克利夫兰',
    'CVG': '🇺🇸 辛辛那提',
    'MKE': '🇺🇸 密尔沃基',
    'STL': '🇺🇸 圣路易斯',
    'SAT': '🇺🇸 圣安东尼奥',
    'HNL': '🇺🇸 檀香山',
    'ANC': '🇺🇸 安克雷奇',
    'SMF': '🇺🇸 萨克拉门托',
    'ONT': '🇺🇸 安大略',
    'OAK': '🇺🇸 奥克兰',
    'HKG': '🇭🇰 香港',
    'TPE': '🇹🇼 台北',
    'TSA': '🇹🇼 台北松山',
    'KHH': '🇹🇼 高雄',
    'NRT': '🇯🇵 东京成田',
    'HND': '🇯🇵 东京羽田',
    'KIX': '🇯🇵 大阪关西',
    'ITM': '🇯🇵 大阪伊丹',
    'NGO': '🇯🇵 名古屋',
    'FUK': '🇯🇵 福冈',
    'CTS': '🇯🇵 札幌',
    'OKA': '🇯🇵 冲绳',
    'ICN': '🇰🇷 首尔仁川',
    'GMP': '🇰🇷 首尔金浦',
    'PUS': '🇰🇷 釜山',
    'SIN': '🇸🇬 新加坡',
    'BKK': '🇹🇭 曼谷',
    'DMK': '🇹🇭 曼谷廊曼',
    'KUL': '🇲🇾 吉隆坡',
    'CGK': '🇮🇩 雅加达',
    'MNL': '🇵🇭 马尼拉',
    'CEB': '🇵🇭 宿务',
    'HAN': '🇻🇳 河内',
    'SGN': '🇻🇳 胡志明',
    'DAD': '🇻🇳 岘港',
    'RGN': '🇲🇲 仰光',
    'PNH': '🇰🇭 金边',
    'REP': '🇰🇭 暹粒',
    'VTE': '🇱🇦 万象',
    'BOM': '🇮🇳 孟买',
    'DEL': '🇮🇳 新德里',
    'MAA': '🇮🇳 金奈',
    'BLR': '🇮🇳 班加罗尔',
    'CCU': '🇮🇳 加尔各答',
    'HYD': '🇮🇳 海得拉巴',
    'AMD': '🇮🇳 艾哈迈达巴德',
    'COK': '🇮🇳 科钦',
    'PNQ': '🇮🇳 浦那',
    'GOI': '🇮🇳 果阿',
    'CMB': '🇱🇰 科伦坡',
    'DAC': '🇧🇩 达卡',
    'KTM': '🇳🇵 加德满都',
    'ISB': '🇵🇰 伊斯兰堡',
    'KHI': '🇵🇰 卡拉奇',
    'LHE': '🇵🇰 拉合尔',
    'LHR': '🇬🇧 伦敦希思罗',
    'LGW': '🇬🇧 伦敦盖特威克',
    'STN': '🇬🇧 伦敦斯坦斯特德',
    'LTN': '🇬🇧 伦敦卢顿',
    'MAN': '🇬🇧 曼彻斯特',
    'EDI': '🇬🇧 爱丁堡',
    'BHX': '🇬🇧 伯明翰',
    'CDG': '🇫🇷 巴黎戴高乐',
    'ORY': '🇫🇷 巴黎奥利',
    'MRS': '🇫🇷 马赛',
    'LYS': '🇫🇷 里昂',
    'NCE': '🇫🇷 尼斯',
    'FRA': '🇩🇪 法兰克福',
    'MUC': '🇩🇪 慕尼黑',
    'TXL': '🇩🇪 柏林',
    'BER': '🇩🇪 柏林勃兰登堡',
    'HAM': '🇩🇪 汉堡',
    'DUS': '🇩🇪 杜塞尔多夫',
    'CGN': '🇩🇪 科隆',
    'STR': '🇩🇪 斯图加特',
    'AMS': '🇳🇱 阿姆斯特丹',
    'BRU': '🇧🇪 布鲁塞尔',
    'LUX': '🇱🇺 卢森堡',
    'ZRH': '🇨🇭 苏黎世',
    'GVA': '🇨🇭 日内瓦',
    'BSL': '🇨🇭 巴塞尔',
    'VIE': '🇦🇹 维也纳',
    'PRG': '🇨🇿 布拉格',
    'BUD': '🇭🇺 布达佩斯',
    'WAW': '🇵🇱 华沙',
    'KRK': '🇵🇱 克拉科夫',
    'MXP': '🇮🇹 米兰马尔彭萨',
    'LIN': '🇮🇹 米兰利纳特',
    'FCO': '🇮🇹 罗马',
    'VCE': '🇮🇹 威尼斯',
    'NAP': '🇮🇹 那不勒斯',
    'FLR': '🇮🇹 佛罗伦萨',
    'BGY': '🇮🇹 贝加莫',
    'MAD': '🇪🇸 马德里',
    'BCN': '🇪🇸 巴塞罗那',
    'PMI': '🇪🇸 帕尔马',
    'AGP': '🇪🇸 马拉加',
    'VLC': '🇪🇸 瓦伦西亚',
    'SVQ': '🇪🇸 塞维利亚',
    'BIO': '🇪🇸 毕尔巴鄂',
    'LIS': '🇵🇹 里斯本',
    'OPO': '🇵🇹 波尔图',
    'FAO': '🇵🇹 法鲁',
    'DUB': '🇮🇪 都柏林',
    'CPH': '🇩🇰 哥本哈根',
    'ARN': '🇸🇪 斯德哥尔摩',
    'GOT': '🇸🇪 哥德堡',
    'OSL': '🇳🇴 奥斯陆',
    'BGO': '🇳🇴 卑尔根',
    'HEL': '🇫🇮 赫尔辛基',
    'RIX': '🇱🇻 里加',
    'TLL': '🇪🇪 塔林',
    'VNO': '🇱🇹 维尔纽斯',
    'ATH': '🇬🇷 雅典',
    'SKG': '🇬🇷 塞萨洛尼基',
    'SOF': '🇧🇬 索非亚',
    'OTP': '🇷🇴 布加勒斯特',
    'BEG': '🇷🇸 贝尔格莱德',
    'ZAG': '🇭🇷 萨格勒布',
    'LJU': '🇸🇮 卢布尔雅那',
    'KBP': '🇺🇦 基辅',
    'IEV': '🇺🇦 基辅茹良尼',
    'ODS': '🇺🇦 敖德萨',
    'SVO': '🇷🇺 莫斯科谢列梅捷沃',
    'DME': '🇷🇺 莫斯科多莫杰多沃',
    'VKO': '🇷🇺 莫斯科伏努科沃',
    'LED': '🇷🇺 圣彼得堡',
    'IST': '🇹🇷 伊斯坦布尔',
    'SAW': '🇹🇷 伊斯坦布尔萨比哈',
    'ESB': '🇹🇷 安卡拉',
    'AYT': '🇹🇷 安塔利亚',
    'ADB': '🇹🇷 伊兹密尔',
    'TLV': '🇮🇱 特拉维夫',
    'AMM': '🇯🇴 安曼',
    'BEY': '🇱🇧 贝鲁特',
    'BAH': '🇧🇭 巴林',
    'KWI': '🇰🇼 科威特',
    'DXB': '🇦🇪 迪拜',
    'AUH': '🇦🇪 阿布扎比',
    'SHJ': '🇦🇪 沙迦',
    'DOH': '🇶🇦 多哈',
    'MCT': '🇴🇲 马斯喀特',
    'RUH': '🇸🇦 利雅得',
    'JED': '🇸🇦 吉达',
    'DMM': '🇸🇦 达曼',
    'CAI': '🇪🇬 开罗',
    'HBE': '🇪🇬 亚历山大',
    'SSH': '🇪🇬 沙姆沙伊赫',
    'CMN': '🇲🇦 卡萨布兰卡',
    'RAK': '🇲🇦 马拉喀什',
    'TUN': '🇹🇳 突尼斯',
    'ALG': '🇩🇿 阿尔及尔',
    'LOS': '🇳🇬 拉各斯',
    'ABV': '🇳🇬 阿布贾',
    'ACC': '🇬🇭 阿克拉',
    'NBO': '🇰🇪 内罗毕',
    'MBA': '🇰🇪 蒙巴萨',
    'ADD': '🇪🇹 亚的斯亚贝巴',
    'DAR': '🇹🇿 达累斯萨拉姆',
    'JNB': '🇿🇦 约翰内斯堡',
    'CPT': '🇿🇦 开普敦',
    'DUR': '🇿🇦 德班',
    'HRE': '🇿🇼 哈拉雷',
    'LUN': '🇿🇲 卢萨卡',
    'MRU': '🇲🇺 毛里求斯',
    'SEZ': '🇸🇨 塞舌尔',
    'SYD': '🇦🇺 悉尼',
    'MEL': '🇦🇺 墨尔本',
    'BNE': '🇦🇺 布里斯班',
    'PER': '🇦🇺 珀斯',
    'ADL': '🇦🇺 阿德莱德',
    'CBR': '🇦🇺 堪培拉',
    'OOL': '🇦🇺 黄金海岸',
    'CNS': '🇦🇺 凯恩斯',
    'AKL': '🇳🇿 奥克兰',
    'WLG': '🇳🇿 惠灵顿',
    'CHC': '🇳🇿 基督城',
    'ZQN': '🇳🇿 皇后镇',
    'NAN': '🇫🇯 楠迪',
    'PPT': '🇵🇫 帕皮提',
    'GUM': '🇬🇺 关岛',
    'GRU': '🇧🇷 圣保罗瓜鲁柳斯',
    'CGH': '🇧🇷 圣保罗孔戈尼亚斯',
    'GIG': '🇧🇷 里约热内卢',
    'BSB': '🇧🇷 巴西利亚',
    'CNF': '🇧🇷 贝洛奥里藏特',
    'POA': '🇧🇷 阿雷格里港',
    'CWB': '🇧🇷 库里蒂巴',
    'FOR': '🇧🇷 福塔莱萨',
    'REC': '🇧🇷 累西腓',
    'SSA': '🇧🇷 萨尔瓦多',
    'EZE': '🇦🇷 布宜诺斯艾利斯',
    'AEP': '🇦🇷 布宜诺斯艾利斯城',
    'COR': '🇦🇷 科尔多瓦',
    'MDZ': '🇦🇷 门多萨',
    'SCL': '🇨🇱 圣地亚哥',
    'LIM': '🇵🇪 利马',
    'BOG': '🇨🇴 波哥大',
    'MDE': '🇨🇴 麦德林',
    'CLO': '🇨🇴 卡利',
    'UIO': '🇪🇨 基多',
    'GYE': '🇪🇨 瓜亚基尔',
    'CCS': '🇻🇪 加拉加斯',
    'MVD': '🇺🇾 蒙得维的亚',
    'ASU': '🇵🇾 亚松森',
    'PTY': '🇵🇦 巴拿马城',
    'SJO': '🇨🇷 圣何塞',
    'GUA': '🇬🇹 危地马拉城',
    'SAL': '🇸🇻 圣萨尔瓦多',
    'TGU': '🇭🇳 特古西加尔巴',
    'MGA': '🇳🇮 马那瓜',
    'BZE': '🇧🇿 伯利兹城',
    'MEX': '🇲🇽 墨西哥城',
    'GDL': '🇲🇽 瓜达拉哈拉',
    'MTY': '🇲🇽 蒙特雷',
    'CUN': '🇲🇽 坎昆',
    'TIJ': '🇲🇽 蒂华纳',
    'SJD': '🇲🇽 圣何塞德尔卡沃',
    'YYZ': '🇨🇦 多伦多',
    'YVR': '🇨🇦 温哥华',
    'YUL': '🇨🇦 蒙特利尔',
    'YYC': '🇨🇦 卡尔加里',
    'YEG': '🇨🇦 埃德蒙顿',
    'YOW': '🇨🇦 渥太华',
    'YWG': '🇨🇦 温尼伯',
    'YHZ': '🇨🇦 哈利法克斯',
    'HAV': '🇨🇺 哈瓦那',
    'SJU': '🇵🇷 圣胡安',
    'SDQ': '🇩🇴 圣多明各',
    'PAP': '🇭🇹 太子港',
    'KIN': '🇯🇲 金斯顿',
    'NAS': '🇧🇸 拿骚',
    'MBJ': '🇯🇲 蒙特哥贝'
  };
  function GetColoName(Colo20018) {
    return ColoMap[Colo20018] || Colo20018;
  }

  // 城市筛选相关函数
  const CityFilterVal = document.getElementById('cityFilterContainer');
  const CityMap2 = document.getElementById('cityCheckboxesContainer');
  function UpdateCityFilter() {
    if (!CityFilterVal || !CityMap2) return;

    // 从测试结果中提取所有可用的城市
    const CityMap = new Map();
    TestResults.forEach((ReadResult20017, Idx20016) => {
      if (ReadResult20017.success && ReadResult20017.colo) {
        const Colo20015 = ReadResult20017.colo;
        if (!CityMap.has(Colo20015)) {
          CityMap.set(Colo20015, {
            colo: Colo20015,
            name: GetColoName(Colo20015),
            count: 0
          });
        }
        CityMap.get(Colo20015).count++;
      }
    });
    if (CityMap.size === 0) {
      CityFilterVal.style.display = 'none';
      return;
    }
    CityFilterVal.style.display = 'block';
    CityMap2.innerHTML = '';

    // 按城市名称排序
    const CityItems = Array.from(CityMap.values()).sort((AVal20014, BVal20013) => AVal20014.name.localeCompare(BVal20013.name));
    CityItems.forEach(City => {
      const XXX5 = document.createElement('label');
      XXX5.style.cssText = 'display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff; font-size: 0.85rem; padding: 4px 8px; background: rgba(20, 5, 50, 0.4); border: 1px solid #7aa9c4; border-radius: 4px;';
      const Checkbox20012 = document.createElement('input');
      Checkbox20012.type = 'checkbox';
      Checkbox20012.value = City.colo;
      Checkbox20012.checked = true;
      Checkbox20012.dataset.colo = City.colo;
      Checkbox20012.style.cssText = 'margin-right: 6px; width: 16px; height: 16px; cursor: pointer;';
      const Local20011 = document.createElement('span');
      Local20011.textContent = City.name + ' (' + City.count + ')';
      XXX5.appendChild(Checkbox20012);
      XXX5.appendChild(Local20011);
      CityMap2.appendChild(XXX5);
      Checkbox20012.addEventListener('change', FilterByCity);
    });

    // 监听筛选模式变化
    const FilterVal2 = document.querySelectorAll('input[name="cityFilterMode"]');
    FilterVal2.forEach(XXXX2 => {
      XXXX2.addEventListener('change', function () {
        if (this.value === 'all') {
          // 切换到"全部城市"模式时，自动选中所有城市复选框
          const CityVal20010 = CityMap2.querySelectorAll('input[type="checkbox"]');
          CityVal20010.forEach(Local20009 => {
            Local20009.checked = true;
            Local20009.disabled = false;
          });
        }
        FilterByCity();
      });
    });
  }
  function FilterByCity() {
    if (!ResultLists || !CityMap2) return;
    const FilterVal = document.querySelector('input[name="cityFilterMode"]:checked')?.value || 'all';
    const ResultItemItems = ResultLists.querySelectorAll('[data-index]');
    const CityVal = CityMap2.querySelectorAll('input[type="checkbox"]');
    if (FilterVal === 'fastest10') {
      // 只选择最快的10个
      const ValResults = TestResults.map((ReadResult, Idx20008) => ({
        result: ReadResult,
        index: Idx20008
      })).filter(Item20007 => Item20007.result.success).sort((AVal, BVal) => AVal.result.latency - BVal.result.latency).slice(0, 10);
      const XXIdxXX = new Set(ValResults.map(Item20006 => Item20006.index));
      ResultItemItems.forEach(Item20005 => {
        const Idx = parseInt(Item20005.dataset.index);
        const Checkbox20004 = Item20005.querySelector('input[type="checkbox"]');
        if (XXIdxXX.has(Idx)) {
          Item20005.style.display = 'flex';
          if (Checkbox20004) Checkbox20004.checked = true;
        } else {
          Item20005.style.display = 'none';
          if (Checkbox20004) Checkbox20004.checked = false;
        }
      });

      // 禁用城市复选框
      CityVal.forEach(Local20003 => Local20003.disabled = true);
    } else {
      // 根据选中的城市筛选
      const SelectedCities = new Set();
      CityVal.forEach(Local20002 => {
        if (Local20002.checked) {
          SelectedCities.add(Local20002.value);
        }
      });

      // 如果所有城市都被选中（或没有选中任何城市），显示所有结果
      const Val220001 = CityVal.length > 0 && SelectedCities.size === CityVal.length;
      const Val2 = SelectedCities.size === 0;
      ResultItemItems.forEach(ItemX14 => {
        const Colo20000 = ItemX14.dataset.colo || '';
        const Checkbox = ItemX14.querySelector('input[type="checkbox"]');
        if (Val220001 || Val2 || SelectedCities.has(Colo20000)) {
          ItemX14.style.display = 'flex';
          // 同步更新结果项复选框的选中状态
          if (Checkbox) {
            if (Val220001) {
              // 所有城市都选中时，所有结果项复选框都选中
              Checkbox.checked = true;
            } else if (Val2) {
              // 没有选中任何城市时，所有结果项复选框都取消选中
              Checkbox.checked = false;
            } else {
              // 根据城市选择状态同步复选框
              Checkbox.checked = SelectedCities.has(Colo20000);
            }
          }
        } else {
          ItemX14.style.display = 'none';
          // 取消选中隐藏的结果项复选框
          if (Checkbox) {
            Checkbox.checked = false;
          }
        }
      });

      // 启用城市复选框
      CityVal.forEach(Local => Local.disabled = false);
    }
  }
    async function TestLatency(Host, Port, XXX3) {
    // 延迟测速改为调用服务端 /api/latency-test（cloudflare:sockets TCP 连接测真实延迟）
    const Ctrl = new AbortController();
    const TimeoutTimer9 = setTimeout(function () { Ctrl.abort(); }, 10000);
    try {
      if (XXX3) {
        XXX3.addEventListener('abort', () => Ctrl.abort());
      }
      const Target = Host + ':' + Port;
      const Resp = await fetch(window.location.pathname + '/api/latency-test?targets=' + encodeURIComponent(Target), {
        signal: Ctrl.signal
      });
      if (!Resp.ok) {
        return {
          success: false,
          latency: -1,
          error: 'HTTP ' + Resp.status,
          colo: '',
          testUrl: ''
        };
      }
      const Data = await Resp.json();
      const ReadResult = Data && Data.results && Data.results[0];
      if (ReadResult && ReadResult.success) {
        clearTimeout(TimeoutTimer9);
        return {
          success: true,
          latency: ReadResult.latency || 0,
          colo: '',
          testUrl: ''
        };
      }
      clearTimeout(TimeoutTimer9);
      return {
        success: false,
        latency: -1,
        error: (ReadResult && ReadResult.error) || '测试失败',
        colo: '',
        testUrl: ''
      };
    } catch (Err) {
      clearTimeout(TimeoutTimer9);
      const ErrMsg = Err.name === 'AbortError' ? '${((LangCode236 === "fa") ? "زمان تمام شد" : ((LangCode236 === "en") ? "Timeout" : "超时"))}' : Err.message;
      return {
        success: false,
        latency: -1,
        error: ErrMsg,
        colo: '',
        testUrl: ''
      };
    }
  }});
</script>
    
    <!-- ⚡ 优选工具：优选方式选择弹窗 -->
    <div id="optimizeToolOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9998;background:rgba(0,0,0,.88);align-items:center;justify-content:center;">
      <div style="background:#0a1420;border:1px solid #00f0ff;border-radius:14px;padding:24px;width:min(720px,92vw);max-height:90vh;overflow:auto;box-shadow:0 0 30px rgba(0,240,255,.25);position:relative;">
        <button type="button" onclick="ClosePrefWay()" style="position:absolute;right:12px;top:10px;background:none;border:none;color:#00f0ff;font-size:26px;cursor:pointer;line-height:1;">×</button>
        <h2 style="color:#00f0ff;margin:0 0 6px 0;font-size:1.3rem;letter-spacing:.04em;">🚀 ${I18n["preferredTools"]}</h2>
        <p style="color:#7aa9c4;margin:0 0 18px 0;font-size:0.9rem;">${I18n["chooseOptimizeWay"]}</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button type="button" onclick="OpenOnline()" style="background:rgba(0,240,255,.07);border:1px solid #00f0ff;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">🌐 ${I18n["onlineOptimize"]}<span style="margin-left:8px;background:#00ffc4;color:#000;font-size:0.7rem;padding:2px 7px;border-radius:8px;vertical-align:middle;">推荐</span></div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${I18n["onlineOptimizeDesc"]}</div>
          </button>
          <button type="button" onclick="OpenLocal()" style="background:rgba(163,71,255,.08);border:1px solid #a347ff;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">💻 ${I18n["localOptimize"]}</div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${I18n["localOptimizeDesc"]}</div>
          </button>
          <button type="button" onclick="OpenApi()" style="background:rgba(0,255,196,.07);border:1px solid #00ffc4;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">🔄 ${I18n["apiOptimize"]}</div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${I18n["apiOptimizeDesc"]}</div>
          </button>
          <button type="button" onclick="OpenChain()" style="background:rgba(255,95,122,.07);border:1px solid #ff5f7a;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">⛓ ${I18n["chainProxy"]}</div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${I18n["chainProxyHint"]}</div>
          </button>
        </div>
      </div>
    </div>
    <!-- 在线优选 iframe 弹窗 -->
    <div id="onlineOptimizeOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#050b12;">
      <div style="position:absolute;top:10px;right:14px;z-index:2;">
        <button type="button" onclick="CloseOnline()" style="background:rgba(0,240,255,.15);border:1px solid #00f0ff;color:#00f0ff;border-radius:8px;padding:6px 14px;cursor:pointer;font-weight:bold;">✕ ${I18n["closeBtn"]}</button>
      </div>
      <iframe id="onlineOptimizeFrame" style="width:100%;height:100%;border:none;" srcdoc='<!doctype html><html><head><meta charset="utf-8"><title>Online Optimize</title><style>body{background:#0a1420;color:#00f0ff;font-family:monospace;margin:0;padding:20px}h2{color:#00f0ff;font-size:18px;margin:0 0 12px;letter-spacing:.04em}label{color:#7aa9c4;font-size:13px}input,button{background:#081018;border:1px solid #00f0ff;color:#00f0ff;font-family:monospace;padding:8px;border-radius:6px;font-size:13px;box-sizing:border-box}button{cursor:pointer;margin:4px 4px 4px 0;font-weight:bold}button:hover{background:rgba(0,240,255,.15)}.bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}#list{margin-top:10px;max-height:62vh;overflow:auto;font-size:12px;line-height:1.7}.row{padding:4px 6px;border-bottom:1px dashed rgba(0,240,255,.2)}.ok{color:#00ffc4}.fail{color:#ff5f7a}</style></head><body><h2>&#x1F680; &#x5728;&#x7EBF;&#x4F18;&#x9009;&#x5DE5;&#x5177;</h2><div class="bar"><label>&#x6570;&#x91CF;:</label><input id="cnt" type="number" value="12" min="1" max="50" style="width:70px"><label>&#x7AEF;&#x53E3;:</label><input id="port" type="text" value="443" style="width:80px"><button onclick="gen()">&#x5F00;&#x59CB;&#x751F;&#x6210;</button><button onclick="copy()">&#x590D;&#x5236;&#x5168;&#x90E8;</button><button onclick="apply()">&#x5E94;&#x7528;&#x7ED3;&#x679C;</button></div><div id="list"></div><script>var ips=[];async function gen(){  var c=document.getElementById("cnt").value||12;  var p=document.getElementById("port").value||443;  var d=document.getElementById("list");  d.innerHTML="&#x23F3; &#x6B63;&#x5728;&#x751F;&#x6210;&#x5E76;&#x6D4B;&#x901F;...";  try{    var r=await fetch("/api/preferred-ips/generate?count="+encodeURIComponent(c)+"&port="+encodeURIComponent(p));    var j=await r.json();    ips=(j&&j.ips)?j.ips:[];    if(ips.length){d.innerHTML=ips.map(function(x){return '<div class="row">'+x+'</div>';}).join("");}    else{d.innerHTML="&#x274C; &#x672A;&#x83B7;&#x53D6;&#x5230;&#x7ED3;&#x679C;";}  }catch(e){d.innerHTML="&#x274C; "+e.message;}}function copy(){  if(!ips.length){alert("&#x6682;&#x65E0;&#x6570;&#x636E;");return;}  var t=ips.join("\\n");  if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){alert("&#x5DF2;&#x590D;&#x5236; "+ips.length+" &#x6761;");},function(){alert(t);});}  else{alert(t);}}function apply(){  if(!ips.length){alert("&#x6682;&#x65E0;&#x6570;&#x636E;");return;}  try{    var p=window.parent;    var input=p.document.getElementById("subCustomIPs");    if(input){input.value=ips.join("\\n");input.style.borderColor="#00ffc4";}    var st=p.document.getElementById("startPreferredStatus");    if(st){st.textContent="&#x5DF2;&#x5E94;&#x7528; "+ips.length+" &#x6761;&#x4F18;&#x9009;IP";}    alert("&#x5DF2;&#x5E94;&#x7528;&#x5230;&#x81EA;&#x5B9A;&#x4E49;&#x4F18;&#x9009;&#xFF0C;&#x8BF7;&#x70B9;&#x51FB;&#x4FDD;&#x5B58;&#x5168;&#x90E8;&#x751F;&#x6548;");  }catch(e){alert("&#x5E94;&#x7528;&#x5931;&#x8D25;: "+e.message);}}</script></body></html>'></iframe>
    </div>
    <!-- 本地优选工具目录弹窗 -->
    <div id="localOptimizeOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.88);align-items:center;justify-content:center;">
      <div style="background:#0a1420;border:1px solid #00f0ff;border-radius:14px;padding:24px;width:min(780px,92vw);max-height:88vh;overflow:auto;position:relative;">
        <button type="button" onclick="CloseLocal()" style="position:absolute;right:12px;top:10px;background:none;border:none;color:#00f0ff;font-size:26px;cursor:pointer;">×</button>
        <h2 style="color:#00f0ff;margin:0 0 6px 0;">💻 ${I18n["localOptimize"]}</h2>
        <p style="color:#7aa9c4;font-size:0.85rem;margin:0 0 14px 0;">${I18n["localOptimizeDesc"]}</p>
        <div id="localOptimizeToolList" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;color:#7aa9c4;font-size:0.9rem;">${I18n["loadingTools"]}</div>
      </div>
    </div>
    <!-- API 优选弹窗 -->
    <div id="apiOptimizeOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.88);align-items:center;justify-content:center;">
      <div style="background:#0a1420;border:1px solid #00f0ff;border-radius:14px;padding:24px;width:min(640px,92vw);max-height:88vh;overflow:auto;position:relative;">
        <button type="button" onclick="CloseApi()" style="position:absolute;right:12px;top:10px;background:none;border:none;color:#00f0ff;font-size:26px;cursor:pointer;">×</button>
        <h2 style="color:#00f0ff;margin:0 0 14px 0;">🔄 ${I18n["apiOptimize"]}</h2>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <input type="text" id="apiOptimizeURL" placeholder="https://url.v1.mk/sub" style="flex:1;padding:9px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
          <input type="text" id="apiOptimizePort" placeholder="443" value="443" style="width:80px;padding:9px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
        </div>
        <button type="button" id="btnVerifyAPI" onclick="VerifyPrefApi()" style="background:linear-gradient(90deg,#00f0ff,#00ffc4);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;">${I18n["verifyApi"]}</button>
        <textarea id="apiOptimizeResults" rows="8" readonly placeholder="..." style="width:100%;margin-top:10px;padding:9px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:12px;box-sizing:border-box;"></textarea>
        <div style="margin-top:10px;display:flex;gap:8px;">
          <button type="button" id="btnAppendAPI" onclick="AppendPrefResult()" style="background:linear-gradient(90deg,#a347ff,#00f0ff);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;">${I18n["appendToCustom"]}</button>
        </div>
      </div>
    </div>
    <!-- 链式代理弹窗 -->
    <div id="chainProxyOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.88);align-items:center;justify-content:center;">
      <div style="background:#0a1420;border:1px solid #ff5f7a;border-radius:14px;padding:24px;width:min(620px,92vw);max-height:88vh;overflow:auto;position:relative;">
        <button type="button" onclick="CloseChain()" style="position:absolute;right:12px;top:10px;background:none;border:none;color:#ff5f7a;font-size:26px;cursor:pointer;">×</button>
        <h2 style="color:#00f0ff;margin:0 0 14px 0;">⛓ ${I18n["chainProxy"]}</h2>
        <label style="display:block;color:#00f0ff;font-size:0.9rem;margin-bottom:6px;">${I18n["chainProxyAddress"]}</label>
        <input type="text" id="chainProxyInput" placeholder="socks5://user:pass@host:port" style="width:100%;padding:9px;background:rgba(0,0,0,.8);border:1px solid #ff5f7a;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;box-sizing:border-box;">
        <small style="color:#7aa9c4;font-size:0.78rem;display:block;margin-top:4px;">${I18n["chainProxyHint"]}</small>
        <div style="margin-top:10px;display:flex;gap:8px;align-items:center;">
          <button type="button" id="btnVerifyChain" onclick="VerifyChainProxy()" style="background:linear-gradient(90deg,#ff5f7a,#a347ff);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;">${I18n["verifyChain"]}</button>
          <button type="button" id="btnApplyChain" onclick="ApplyChainProxy()" style="background:linear-gradient(90deg,#a347ff,#00f0ff);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;display:none;">${I18n["applyChainProxy"]}</button>
          <span id="chainProxyStatus" style="color:#7aa9c4;font-size:0.82rem;"></span>
        </div>
        <div id="chainProxyResult" style="margin-top:10px;color:#7aa9c4;font-size:0.85rem;"></div>
      </div>
    </div>
</body>
    </html>`;;;;;;;;;;;;;;
  return new Response(PageHtml, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}
async function ParseTrojanHeader(Buf234, Local233) {
  const Byte = ToU8(Buf234);
  const PasswordValXX = TransferPath || Local233;
  const ValXXXPassword = await ParseHashData(PasswordValXX);
  if (Byte.byteLength < 56) {
    return {
      hasError: true,
      message: "invalid " + "trojan" + " data - too short"
    };
  }
  let Val2Idx = 56;
  if (Byte[56] !== 0x0d || Byte[57] !== 0x0a) {
    return {
      hasError: true,
      message: "invalid " + "trojan" + " header format (missing CR LF)"
    };
  }
  const Password232 = SharedDecoder.decode(Byte.subarray(0, Val2Idx));
  if (Password232 !== ValXXXPassword) {
    return {
      hasError: true,
      message: "invalid " + "trojan" + " password"
    };
  }
  const Socks5Buf = Byte.subarray(Val2Idx + 2);
  if (Socks5Buf.byteLength < 6) {
    return {
      hasError: true,
      message: "invalid SOCKS5 request data"
    };
  }
  const View231 = new DataView(Socks5Buf.buffer, Socks5Buf.byteOffset, Socks5Buf.byteLength);
  const Cmd230 = View231.getUint8(0);
  if (Cmd230 !== 1) {
    return {
      hasError: true,
      message: "unsupported command, only TCP (CONNECT) is allowed"
    };
  }
  const Local229 = View231.getUint8(1);
  let AddrLength = 0;
  let AddrIdx228 = 2;
  let Addr227 = "";
  switch (Local229) {
    case 1:
      AddrLength = 4;
      Addr227 = Socks5Buf.subarray(AddrIdx228, AddrIdx228 + AddrLength).join(".");
      break;
    case 3:
      AddrLength = Socks5Buf[AddrIdx228];
      AddrIdx228 += 1;
      Addr227 = SharedDecoder.decode(Socks5Buf.subarray(AddrIdx228, AddrIdx228 + AddrLength));
      break;
    case 4:
      AddrLength = 16;
      const DataView = new DataView(Socks5Buf.buffer, Socks5Buf.byteOffset + AddrIdx228, AddrLength);
      const Val6 = [];
      for (let IdxVal226 = 0; IdxVal226 < 8; IdxVal226++) {
        Val6.push(DataView.getUint16(IdxVal226 * 2).toString(16));
      }
      Addr227 = Val6.join(":");
      break;
    default:
      return {
        hasError: true,
        message: `invalid addressType is ${Local229}`
      };
  }
  if (!Addr227) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${Local229}`
    };
  }
  const PortIdx225 = AddrIdx228 + AddrLength;
  const PortRemote = new DataView(Socks5Buf.buffer, Socks5Buf.byteOffset + PortIdx225, 2).getUint16(0);
  return {
    hasError: false,
    addressRemote: Addr227,
    addressType: Local229,
    port: PortRemote,
    hostname: Addr227,
    rawClientData: Socks5Buf.subarray(PortIdx225 + 4)
  };
}
async function ParseHashData(Text224) {
  const Encoder = new TextEncoder();
  const Data223 = Encoder.encode(Text224);
  const Local222 = [0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da, 0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070, 0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2];
  let HeaderCursor = [0xc1059ed8, 0x367cd507, 0x3070dd17, 0xf70e5939, 0xffc00b31, 0x68581511, 0x64f98fa7, 0xbefa4fa4];
  const MsgLength = Data223.length;
  const ValLen221 = MsgLength * 8;
  const ValLen220 = Math.ceil((MsgLength + 9) / 64) * 64;
  const Local219 = new Uint8Array(ValLen220);
  Local219.set(Data223);
  Local219[MsgLength] = 0x80;
  const View = new DataView(Local219.buffer);
  View.setUint32(ValLen220 - 4, ValLen221, false);
  for (let Chunk218 = 0; Chunk218 < ValLen220; Chunk218 += 64) {
    const WriterWrap = new Uint32Array(64);
    for (let IdxVal217 = 0; IdxVal217 < 16; IdxVal217++) {
      WriterWrap[IdxVal217] = View.getUint32(Chunk218 + IdxVal217 * 4, false);
    }
    for (let IdxVal216 = 16; IdxVal216 < 64; IdxVal216++) {
      const Val0215 = HandleXhttpRemote200(WriterWrap[IdxVal216 - 15], 7) ^ HandleXhttpRemote200(WriterWrap[IdxVal216 - 15], 18) ^ WriterWrap[IdxVal216 - 15] >>> 3;
      const Val1214 = HandleXhttpRemote200(WriterWrap[IdxVal216 - 2], 17) ^ HandleXhttpRemote200(WriterWrap[IdxVal216 - 2], 19) ^ WriterWrap[IdxVal216 - 2] >>> 10;
      WriterWrap[IdxVal216] = WriterWrap[IdxVal216 - 16] + Val0215 + WriterWrap[IdxVal216 - 7] + Val1214 >>> 0;
    }
    let [AVal213, BVal, CVal212, DVal211, EventVal210, FormVal, Local209, HeaderVal208] = HeaderCursor;
    for (let IdxVal207 = 0; IdxVal207 < 64; IdxVal207++) {
      const Val1206 = HandleXhttpRemote200(EventVal210, 6) ^ HandleXhttpRemote200(EventVal210, 11) ^ HandleXhttpRemote200(EventVal210, 25);
      const Local205 = EventVal210 & FormVal ^ ~EventVal210 & Local209;
      const Val1 = HeaderVal208 + Val1206 + Local205 + Local222[IdxVal207] + WriterWrap[IdxVal207] >>> 0;
      const Val0 = HandleXhttpRemote200(AVal213, 2) ^ HandleXhttpRemote200(AVal213, 13) ^ HandleXhttpRemote200(AVal213, 22);
      const Local204 = AVal213 & BVal ^ AVal213 & CVal212 ^ BVal & CVal212;
      const Val2203 = Val0 + Local204 >>> 0;
      HeaderVal208 = Local209;
      Local209 = FormVal;
      FormVal = EventVal210;
      EventVal210 = DVal211 + Val1 >>> 0;
      DVal211 = CVal212;
      CVal212 = BVal;
      BVal = AVal213;
      AVal213 = Val1 + Val2203 >>> 0;
    }
    HeaderCursor[0] = HeaderCursor[0] + AVal213 >>> 0;
    HeaderCursor[1] = HeaderCursor[1] + BVal >>> 0;
    HeaderCursor[2] = HeaderCursor[2] + CVal212 >>> 0;
    HeaderCursor[3] = HeaderCursor[3] + DVal211 >>> 0;
    HeaderCursor[4] = HeaderCursor[4] + EventVal210 >>> 0;
    HeaderCursor[5] = HeaderCursor[5] + FormVal >>> 0;
    HeaderCursor[6] = HeaderCursor[6] + Local209 >>> 0;
    HeaderCursor[7] = HeaderCursor[7] + HeaderVal208 >>> 0;
  }
  const ReadResult202 = [];
  for (let IdxVal201 = 0; IdxVal201 < 7; IdxVal201++) {
    ReadResult202.push((HeaderCursor[IdxVal201] >>> 24 & 0xff).toString(16).padStart(2, '0'), (HeaderCursor[IdxVal201] >>> 16 & 0xff).toString(16).padStart(2, '0'), (HeaderCursor[IdxVal201] >>> 8 & 0xff).toString(16).padStart(2, '0'), (HeaderCursor[IdxVal201] & 0xff).toString(16).padStart(2, '0'));
  }
  return ReadResult202.join('');
}
function HandleXhttpRemote200(Val199, Local198) {
  return Val199 >>> Local198 | Val199 << 32 - Local198;
}
let Val2197 = 0;
const ValHttpBufSize = 128 * 1024;
const ConnectTimeoutVal = 5000;
const ValTimeoutVal = 45000;
const LimitVal196 = 2;
const LimitVal = 32;
function HandleXhttp195(Local194) {
  return new Promise(ReadResultVal193 => setTimeout(ReadResultVal193, Local194));
}
function VerifyXhttpUuid(Id192, UuidId191) {
  for (let Idx190 = 0; Idx190 < 16; Idx190++) {
    if (Id192[Idx190] !== UuidId191[Idx190]) {
      return false;
    }
  }
  return true;
}
class XhttpCntX {
  #total;
  constructor() {
    this.#total = 0;
  }
  get() {
    return this.#total;
  }
  add(Size189) {
    this.#total += Size189;
  }
}
function HandleXhttpRemoteVal(XXX5, ...Local188) {
  let Length = XXX5.length;
  for (let AVal187 of Local188) {
    Length += AVal187.length;
  }
  const ReadResultVal186 = new XXX5.constructor(Length);
  ReadResultVal186.set(XXX5, 0);
  Length = XXX5.length;
  for (let AVal185 of Local188) {
    ReadResultVal186.set(AVal185, Length);
    Length += AVal185.length;
  }
  return ReadResultVal186;
}
function ParseXhttpUuid(UuidId184) {
  UuidId184 = UuidId184.replaceAll('-', '');
  const ReadResultVal183 = [];
  for (let Idx182 = 0; Idx182 < 16; Idx182++) {
    const XVal181 = parseInt(UuidId184.substr(Idx182 * 2, 2), 16);
    ReadResultVal183.push(XVal181);
  }
  return ReadResultVal183;
}
function GetXhttpBuffer(Size) {
  return new Uint8Array(new ArrayBuffer(Size || ValHttpBufSize));
}
async function ReadXhttpHeader(Local180, UuidIdStr) {
  const Reader179 = Local180.getReader({
    mode: 'byob'
  });
  try {
    let ReadResultVal178 = await Reader179.readAtLeast(1 + 16 + 1, GetXhttpBuffer());
    let Local177 = 0;
    let Idx = 0;
    let Cache = ReadResultVal178.value;
    Local177 += ReadResultVal178.value.length;
    const Local176 = Cache[0];
    const Id175 = Cache.slice(1, 1 + 16);
    const UuidId174 = ParseXhttpUuid(UuidIdStr);
    if (!VerifyXhttpUuid(Id175, UuidId174)) {
      return `invalid UUID`;
    }
    const ValLen173 = Cache[1 + 16];
    const AddrVal1 = 1 + 16 + 1 + ValLen173 + 1 + 2 + 1;
    if (AddrVal1 + 1 > Local177) {
      if (ReadResultVal178.done) {
        return `header too short`;
      }
      Idx = AddrVal1 + 1 - Local177;
      ReadResultVal178 = await Reader179.readAtLeast(Idx, GetXhttpBuffer());
      Local177 += ReadResultVal178.value.length;
      Cache = HandleXhttpRemoteVal(Cache, ReadResultVal178.value);
    }
    const Cmd = Cache[1 + 16 + 1 + ValLen173];
    if (Cmd !== 1) {
      return `unsupported command: ${Cmd}`;
    }
    const Port172 = (Cache[AddrVal1 - 1 - 2] << 8) + Cache[AddrVal1 - 1 - 1];
    const Local171 = Cache[AddrVal1 - 1];
    let HeaderLength = -1;
    if (Local171 === AT_IPV4) {
      HeaderLength = AddrVal1 + 4;
    } else if (Local171 === AT_IPV6) {
      HeaderLength = AddrVal1 + 16;
    } else if (Local171 === AT_DOMAIN) {
      HeaderLength = AddrVal1 + 1 + Cache[AddrVal1];
    }
    if (HeaderLength < 0) {
      return 'read address type failed';
    }
    Idx = HeaderLength - Local177;
    if (Idx > 0) {
      if (ReadResultVal178.done) {
        return `read address failed`;
      }
      ReadResultVal178 = await Reader179.readAtLeast(Idx, GetXhttpBuffer());
      Local177 += ReadResultVal178.value.length;
      Cache = HandleXhttpRemoteVal(Cache, ReadResultVal178.value);
    }
    let Hostname170 = '';
    Idx = AddrVal1;
    switch (Local171) {
      case AT_IPV4:
        Hostname170 = Cache.slice(Idx, Idx + 4).join('.');
        break;
      case AT_DOMAIN:
        Hostname170 = new TextDecoder().decode(Cache.slice(Idx + 1, Idx + 1 + Cache[Idx]));
        break;
      case AT_IPV6:
        Hostname170 = Cache.slice(Idx, Idx + 16).reduce((TextX3, Val2169, Val2X3, AVal) => Val2X3 % 2 ? TextX3.concat(((AVal[Val2X3 - 1] << 8) + Val2169).toString(16)) : TextX3, []).join(':');
        break;
    }
    if (Hostname170.length < 1) {
      return 'failed to parse hostname';
    }
    const Data = Cache.slice(HeaderLength);
    return {
      hostname: Hostname170,
      port: Port172,
      data: Data,
      resp: new Uint8Array([Local176, 0]),
      reader: Reader179,
      done: ReadResultVal178.done
    };
  } catch (Err168) {
    try {
      Reader179.releaseLock();
    } catch (Ignore167) {}
    throw Err168;
  }
}
async function ProxyXhttpRemote(CntX166, Writer165, Local164) {
  async function HandleXhttpRemote(DVal) {
    if (!DVal || DVal.length === 0) {
      return;
    }
    CntX166.add(DVal.length);
    try {
      await Writer165.write(DVal);
    } catch (Err163) {
      throw Err163;
    }
  }
  try {
    await HandleXhttpRemote(Local164.data);
    let ChunkCount162 = 0;
    while (!Local164.done) {
      const ReadResultVal161 = await Local164.reader.read(GetXhttpBuffer());
      if (ReadResultVal161.done) break;
      await HandleXhttpRemote(ReadResultVal161.value);
      Local164.done = ReadResultVal161.done;
      ChunkCount162++;
      if (ChunkCount162 % 10 === 0) {
        await HandleXhttp195(0);
      }
      if (!ReadResultVal161.value || ReadResultVal161.value.length === 0) {
        await HandleXhttp195(2);
      }
    }
  } catch (Err160) {
    throw Err160;
  }
}
function MakeXhttpConn159(Local158, Local157) {
  const CntX156 = new XhttpCntX();
  const Writer155 = Local157.getWriter();
  const Local154 = (async () => {
    try {
      await ProxyXhttpRemote(CntX156, Writer155, Local158);
    } catch (Err153) {
      throw Err153;
    } finally {
      try {
        await Writer155.close();
      } catch (Err152) {}
    }
  })();
  return {
    counter: CntX156,
    done: Local154,
    abort: () => {
      try {
        Writer155.abort();
      } catch (Ignore151) {}
    }
  };
}
function MakeXhttpConn(Local150, RemoteX2) {
  const CntX = new XhttpCntX();
  let Stream;
  const Local149 = new Promise((Local148, Local147) => {
    Stream = new TransformStream({
      start(Ctrl146) {
        CntX.add(Local150.length);
        Ctrl146.enqueue(Local150);
      },
      transform(ChunkX7, Ctrl145) {
        CntX.add(ChunkX7.length);
        Ctrl145.enqueue(ChunkX7);
      },
      cancel(Local144) {
        Local147(`download cancelled: ${Local144}`);
      }
    }, null, new ByteLengthQueuingStrategy({
      highWaterMark: ValHttpBufSize
    }));
    let Val2143 = Date.now();
    const ValTimer = setInterval(() => {
      if (Date.now() - Val2143 > ValTimeoutVal) {
        try {
          Stream.writable.abort?.('idle timeout');
        } catch (Ignore142) {}
        clearInterval(ValTimer);
        Local147('idle timeout');
      }
    }, 5000);
    const Reader = RemoteX2.getReader();
    const Writer = Stream.writable.getWriter();
    ;
    (async () => {
      try {
        let ChunkCount = 0;
        while (true) {
          const ReadResultVal141 = await Reader.read();
          if (ReadResultVal141.done) {
            break;
          }
          Val2143 = Date.now();
          await Writer.write(ReadResultVal141.value);
          ChunkCount++;
          if (ChunkCount % 5 === 0) {
            await HandleXhttp195(0);
          }
        }
        await Writer.close();
        Local148();
      } catch (Err140) {
        Local147(Err140);
      } finally {
        try {
          Reader.releaseLock();
        } catch (Ignore139) {}
        try {
          Writer.releaseLock();
        } catch (Ignore138) {}
        clearInterval(ValTimer);
      }
    })();
  });
  return {
    readable: Stream.readable,
    counter: CntX,
    done: Local149,
    abort: () => {
      try {
        Stream.readable.cancel();
      } catch (Ignore137) {}
      try {
        Stream.writable.abort();
      } catch (Ignore136) {}
    }
  };
}
async function PipeRemoteXhttp(Local135, ...Local134) {
  let Local133 = 0;
  let ValErr;
  const ConnectItems = [Local135.hostname, ...Local134.filter(ReadResultVal => ReadResultVal && ReadResultVal !== Local135.hostname)];
  for (const Hostname of ConnectItems) {
    if (!Hostname) continue;
    Local133 = 0;
    while (Local133 < LimitVal196) {
      Local133++;
      try {
        const Remote = Connect({
          hostname: Hostname,
          port: Local135.port
        });
        const TimeoutXX = HandleXhttp195(ConnectTimeoutVal).then(() => {
          throw new Error("connect timeout");
        });
        await Promise.race([Remote.opened, TimeoutXX]);
        const Local132 = MakeXhttpConn159(Local135, Remote.writable);
        const Local131 = MakeXhttpConn(Local135.resp, Remote.readable);
        return {
          downloader: Local131,
          uploader: Local132,
          close: () => {
            try {
              Remote.close();
            } catch (Ignore130) {}
          }
        };
      } catch (Err129) {
        ValErr = Err129;
        if (Local133 < LimitVal196) {
          await HandleXhttp195(500 * Local133);
        }
      }
    }
  }
  return null;
}
async function HandleXhttpClient(Body128, UuidId) {
  if (Val2197 >= LimitVal) {
    return new Response('Too many connections', {
      status: 429
    });
  }
  Val2197++;
  let Local127 = false;
  const Local126 = () => {
    if (!Local127) {
      Val2197 = Math.max(0, Val2197 - 1);
      Local127 = true;
    }
  };
  try {
    const Local125 = await ReadXhttpHeader(Body128, UuidId);
    if (typeof Local125 !== 'object' || !Local125) {
      return null;
    }
    const RemoteConnect = await PipeRemoteXhttp(Local125, FallbackAddr, '13.230.34.30');
    if (RemoteConnect === null) {
      return null;
    }
    const ConnectVal = Promise.race([(async () => {
      try {
        await RemoteConnect.downloader.done;
      } catch (Err124) {}
    })(), (async () => {
      try {
        await RemoteConnect.uploader.done;
      } catch (Err123) {}
    })(), HandleXhttp195(ValTimeoutVal).then(() => {})]).finally(() => {
      try {
        RemoteConnect.close();
      } catch (Ignore122) {}
      try {
        RemoteConnect.downloader.abort();
      } catch (Ignore121) {}
      try {
        RemoteConnect.uploader.abort();
      } catch (Ignore) {}
      Local126();
    });
    return {
      readable: RemoteConnect.downloader.readable,
      closed: ConnectVal
    };
  } catch (Err120) {
    Local126();
    return null;
  }
}
async function HandleXhttp(Request119) {
  try {
    return await HandleXhttpClient(Request119.body, AuthToken);
  } catch (Err118) {
    return null;
  }
}
function DecodeEarlyData(ValXXStr) {
  if (!ValXXStr) return {
    error: null
  };
  try {
    ValXXStr = ValXXStr.replace(/-/g, '+').replace(/_/g, '/');
    return {
      earlyData: Uint8Array.from(atob(ValXXStr), CVal117 => CVal117.charCodeAt(0)).buffer,
      error: null
    };
  } catch (Err116) {
    return {
      error: Err116
    };
  }
}
function SafeClose(Sock) {
  try {
    if (Sock.readyState === 1 || Sock.readyState === 2) Sock.close();
  } catch (Err115) {}
}
const HexVal = Array.from({
  length: 256
}, (XVal, IdxVal) => (IdxVal + 256).toString(16).slice(1));
async function FetchNewAddrs() {
  let Url113 = PrefAddrSource;
  // 【修复】when no preferred-IP source URL (yxURL) is set, use the built-in default source so direct/official modes ship plenty of nodes (aligning with cfnew)
  if (!Url113 || !Url113.trim()) {
    Url113 = 'https://bestcf.pages.dev/random-region/HK/100.txt,https://bestcf.pages.dev/random-region/JP/100.txt,https://bestcf.pages.dev/random-region/SG/100.txt,https://bestcf.pages.dev/random-region/US/100.txt,https://bestcf.pages.dev/random-region/TW/100.txt';
  }
  try {
    const UrlItems112 = Url113.includes(',') ? Url113.split(',').map(UrlVal111 => UrlVal111.trim()).filter(UrlVal => UrlVal) : [Url113];
    const ApiResults = await GetPrefApis(UrlItems112, '443', 5000);
    if (ApiResults.length > 0) {
      const Results110 = [];
      const Regex = /^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/;
      for (const Item109 of ApiResults) {
        const Local108 = Item109.match(Regex);
        if (Local108) {
          Results110.push({
            ip: Local108[1],
            port: parseInt(Local108[2] || '443', 10),
            name: Local108[3]?.trim() || Local108[1]
          });
        }
      }
      // 【修复】when built-in preferred sources run below 800, randomly generate from official Cloudflare CIDRs to match cfnew capacity
      if (Results110.length < 800) {
        try {
          const XXItems = await GenRandomPrefIp(null, 800 - Results110.length, -1);
          if (XXItems && XXItems.length > 0) {
            for (const XXItem of XXItems) {
              Results110.push({
                ip: XXItem.ip,
                port: XXItem.port || 443,
                name: XXItem.isp || 'CF官方优选'
              });
            }
          }
        } catch (XXErrX1) {}
      }
      return Results110;
    }
    const Resp107 = await fetch(Url113);
    if (!Resp107.ok) return [];
    const Text106 = await Resp107.text();
    const Results105 = [];
    const Lines104 = Text106.trim().replace(/\r/g, "").split('\n');
    const RowRegex = /^([^:]+):(\d+)#(.*)$/;
    for (const Row103 of Lines104) {
      const ValRow = Row103.trim();
      if (!ValRow) continue;
      const Local102 = ValRow.match(RowRegex);
      if (Local102) {
        Results105.push({
          ip: Local102[1],
          port: parseInt(Local102[2], 10),
          name: Local102[3].trim() || Local102[1]
        });
      }
    }
    return Results105;
  } catch (Err101) {
    return [];
  }
}
function BuildNewVlessLinks(Items100, Uuid99, WorkerDomain98, EchConfig97 = null, SkipNo96 = false, Namer95 = null) {
  const CfHttpPorts94 = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const CfHttpsPorts93 = [443, 2053, 2083, 2087, 2096, 8443];
  const Links92 = [];
  const WsPath91 = '/?ed=2048';
  const Proto = "vless";
  const MakeName90 = Namer95 || MakeNamer(SkipNo96);
  for (const Item89 of Items100) {
    const Port88 = Item89.port;
    const SafeAddr87 = Item89.ip.includes(':') ? `[${Item89.ip}]` : Item89.ip;
    if (CfHttpsPorts93.includes(Port88)) {
      const WsNodeName86 = MakeName90(Item89);
      let Link85 = `${Proto}://${Uuid99}@${SafeAddr87}:${Port88}?encryption=none&security=tls&sni=${WorkerDomain98}&fp=chrome&type=ws&host=${WorkerDomain98}&path=${encodeURIComponent(WsPath91)}`;
      if (CustomAlpn) Link85 += `&alpn=${encodeURIComponent(CustomAlpn)}`;

      // if ECH enabled, add the ech param (ECH requires Chrome UA disguise)
      if (EnableEch) {
        const DnsVal84 = CustomDns || 'https://223.5.5.5/dns-query';
        const EchDomain83 = CustomEchDomain || 'cloudflare-ech.com';
        Link85 += `&ech=${encodeURIComponent(`${EchDomain83}+${DnsVal84}`)}`;
      }
      Link85 += `#${encodeURIComponent(WsNodeName86)}`;
      Links92.push(Link85);
    } else if (CfHttpPorts94.includes(Port88)) {
      if (!DisablePlain) {
        const WsNodeName82 = MakeName90(Item89);
        const Link81 = `${Proto}://${Uuid99}@${SafeAddr87}:${Port88}?encryption=none&security=none&type=ws&host=${WorkerDomain98}&path=${encodeURIComponent(WsPath91)}#${encodeURIComponent(WsNodeName82)}`;
        Links92.push(Link81);
      }
    } else {
      const WsNodeName80 = MakeName90(Item89);
      let Link79 = `${Proto}://${Uuid99}@${SafeAddr87}:${Port88}?encryption=none&security=tls&sni=${WorkerDomain98}&fp=chrome&type=ws&host=${WorkerDomain98}&path=${encodeURIComponent(WsPath91)}`;
      if (CustomAlpn) Link79 += `&alpn=${encodeURIComponent(CustomAlpn)}`;

      // if ECH enabled, add the ech param (ECH requires Chrome UA disguise)
      if (EnableEch) {
        const DnsVal78 = CustomDns || 'https://223.5.5.5/dns-query';
        const EchDomain77 = CustomEchDomain || 'cloudflare-ech.com';
        Link79 += `&ech=${encodeURIComponent(`${EchDomain77}+${DnsVal78}`)}`;
      }
      Link79 += `#${encodeURIComponent(WsNodeName80)}`;
      Links92.push(Link79);
    }
  }
  return Links92;
}
function BuildXhttpLinks(Items76, Uuid75, WorkerDomain74, EchConfig73 = null, SkipNo72 = false, Namer71 = null) {
  const Links70 = [];
  const NodePath = Uuid75.substring(0, 8);
  const MakeName69 = Namer71 || MakeNamer(SkipNo72);
  for (const Item68 of Items76) {
    const SafeAddr67 = Item68.ip.includes(':') ? `[${Item68.ip}]` : Item68.ip;
    const Port66 = Item68.port || 443;
    const WsNodeName65 = MakeName69(Item68);
    const Args = new URLSearchParams({
      encryption: 'none',
      security: 'tls',
      sni: WorkerDomain74,
      fp: 'chrome',
      type: 'xhttp',
      host: WorkerDomain74,
      path: `/${NodePath}`,
      mode: 'stream-one'
    });
    ApplyAlpnParam(Args);
    if (EnableEch) {
      const DnsVal64 = CustomDns || 'https://223.5.5.5/dns-query';
      const EchDomain63 = CustomEchDomain || 'cloudflare-ech.com';
      Args.set('ech', `${EchDomain63}+${DnsVal64}`);
    }
    Links70.push(`${"vless://"}${Uuid75}@${SafeAddr67}:${Port66}?${Args.toString()}#${encodeURIComponent(WsNodeName65)}`);
  }
  return Links70;
}
async function BuildNewTrojanLinks(Items, Uuid, WorkerDomain, EchConfig = null, SkipNo = false, Namer = null) {
  const CfHttpPorts = [80, 8080, 8880, 2052, 2082, 2086, 2095];
  const CfHttpsPorts = [443, 2053, 2083, 2087, 2096, 8443];
  const Links = [];
  const WsPath = '/?ed=2048';
  const Password = TransferPath || Uuid;
  const MakeName = Namer || MakeNamer(SkipNo);
  for (const Item62 of Items) {
    const Port61 = Item62.port;
    const SafeAddr = Item62.ip.includes(':') ? `[${Item62.ip}]` : Item62.ip;
    if (CfHttpsPorts.includes(Port61)) {
      const WsNodeName60 = MakeName(Item62);
      let Link59 = `${"trojan://"}${Password}@${SafeAddr}:${Port61}?security=tls&sni=${WorkerDomain}&fp=chrome&type=ws&host=${WorkerDomain}&path=${encodeURIComponent(WsPath)}`;
      if (CustomAlpn) Link59 += `&alpn=${encodeURIComponent(CustomAlpn)}`;

      // if ECH enabled, add the ech param (ECH requires Chrome UA disguise)
      if (EnableEch) {
        const DnsVal58 = CustomDns || 'https://223.5.5.5/dns-query';
        const EchDomain57 = CustomEchDomain || 'cloudflare-ech.com';
        Link59 += `&ech=${encodeURIComponent(`${EchDomain57}+${DnsVal58}`)}`;
      }
      Link59 += `#${encodeURIComponent(WsNodeName60)}`;
      Links.push(Link59);
    } else if (CfHttpPorts.includes(Port61)) {
      if (!DisablePlain) {
        const WsNodeName56 = MakeName(Item62);
        const Link55 = `${"trojan://"}${Password}@${SafeAddr}:${Port61}?security=none&type=ws&host=${WorkerDomain}&path=${encodeURIComponent(WsPath)}#${encodeURIComponent(WsNodeName56)}`;
        Links.push(Link55);
      }
    } else {
      const WsNodeName = MakeName(Item62);
      let Link = `${"trojan://"}${Password}@${SafeAddr}:${Port61}?security=tls&sni=${WorkerDomain}&fp=chrome&type=ws&host=${WorkerDomain}&path=${encodeURIComponent(WsPath)}`;
      if (CustomAlpn) Link += `&alpn=${encodeURIComponent(CustomAlpn)}`;

      // if ECH enabled, add the ech param (ECH requires Chrome UA disguise)
      if (EnableEch) {
        const DnsVal = CustomDns || 'https://223.5.5.5/dns-query';
        const EchDomain = CustomEchDomain || 'cloudflare-ech.com';
        Link += `&ech=${encodeURIComponent(`${EchDomain}+${DnsVal}`)}`;
      }
      Link += `#${encodeURIComponent(WsNodeName)}`;
      Links.push(Link);
    }
  }
  return Links;
}
async function HandleConfigApi(Request54, EnvVal = {}) {
  if (Request54.method === 'GET') {
    if (!KVStore) {
      // KV unbound: degrade to read-only, still returning env config for the panel
      return new Response(JSON.stringify({
        error: 'KV存储未配置，当前为只读模式',
        kvEnabled: false,
        ...EffectiveSnapshot(EnvVal)
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    return new Response(JSON.stringify({
      ...EffectiveSnapshot(EnvVal),
      kvEnabled: true
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else if (Request54.method === 'POST') {
    if (!KVStore) {
      return new Response(JSON.stringify({
        success: false,
        message: 'KV存储未配置，无法保存配置'
      }), {
        status: 503,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    try {
      const NewConfig = await Request54.json();
      for (const [Key, Val] of Object.entries(NewConfig)) {
        if (Val === '' || Val === null || Val === undefined) {
          delete KVConfig[Key];
        } else {
          KVConfig[Key] = Val;
        }
      }
      await SaveKVConfig();
      UpdateConfigVal();
      if (NewConfig.yx !== undefined) {
        UpdatePrefSource();
      }
      return new Response(JSON.stringify({
        success: true,
        message: '配置已保存',
        config: EffectiveSnapshot(EnvVal)
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } catch (Err53) {
      return new Response(JSON.stringify({
        success: false,
        message: '保存配置失败: ' + Err53.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
  return new Response(JSON.stringify({
    error: 'Method not allowed'
  }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
async function HandleNetTestApi() {
    const TestTargetItems = [
    { Name: 'Google', Url: 'https://www.google.com' },
    { Name: 'Netflix', Url: 'https://www.netflix.com/' },
    { Name: 'Disney+', Url: 'https://www.disneyplus.com/' },
    { Name: 'HBO', Url: 'https://www.hbo.com/' },
    { Name: 'HBOMax', Url: 'https://www.max.com/' },
    { Name: 'Peacock', Url: 'https://www.peacocktv.com/' },
    { Name: 'GitHub', Url: 'https://github.com/' },
    { Name: 'GPT', Url: 'https://chat.openai.com/auth/login' },
    { Name: 'Gemini', Url: 'https://gemini.google.com/app' }
  ];
  const TestXXService = async (Target) => {
    const StartXX = Date.now();
    const XXCtrl = new AbortController();
    const TimeoutTimer = setTimeout(() => XXCtrl.abort(), 6000);
    try {
      const Resp = await fetch(Target.Url, {
        method: 'GET',
        redirect: 'follow',
        signal: XXCtrl.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*'
        }
      });
      clearTimeout(TimeoutTimer);
      return {
        Name: Target.Name,
        XXXX3: Resp.status >= 200 && Resp.status < 500,
        StatusX10: Resp.status,
        Delay: Date.now() - StartXX,
        Err: ''
      };
    } catch (Err) {
      clearTimeout(TimeoutTimer);
      const IsTimeout = Err && Err.name === 'AbortError';
      return {
        Name: Target.Name,
        XXXX3: false,
        StatusX10: 0,
        Delay: Date.now() - StartXX,
        Err: IsTimeout ? 'timeout' : 'error'
      };
    }
  };
  const Results = await Promise.all(TestTargetItems.map(TestXXService));
  return new Response(JSON.stringify({
    success: true,
    ReadResult: Results
  }), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

async function HandleSpeedApi() {
  const SpeedtestAddr = 'https://fiber.google.com/speedtest/';
  const XXStart = Date.now();
  const XXCtrl = new AbortController();
  const TimeoutTimer = setTimeout(() => XXCtrl.abort(), 10000);
  try {
    const Resp = await fetch(SpeedtestAddr, {
      method: 'GET',
      redirect: 'follow',
      signal: XXCtrl.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });
    const FirstByteDelay = Date.now() - XXStart;
    let XByte = 0;
    let DownXX = 0;
    try {
      if (Resp.body) {
        const Reader = Resp.body.getReader();
        const DownStart = Date.now();
        for (;;) {
          const ChunkX7 = await Reader.read();
          if (ChunkX7.done) break;
          XByte += ChunkX7.value ? ChunkX7.value.length : 0;
          if (Date.now() - DownStart > 6000) break;
        }
        const XXX2 = (Date.now() - DownStart) || 1;
        DownXX = Math.round((XByte / XXX2) * 1000);
      }
    } catch (ReadErr) {}
    clearTimeout(TimeoutTimer);
    return new Response(JSON.stringify({
      success: true,
      Addr: SpeedtestAddr,
      StatusX10: Resp.status,
      Delay: FirstByteDelay,
      XByte,
      XXX6: DownXX,
      Err: ''
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (Err) {
    clearTimeout(TimeoutTimer);
    const IsTimeout = Err && Err.name === 'AbortError';
    return new Response(JSON.stringify({
      success: true,
      Addr: SpeedtestAddr,
      StatusX10: 0,
      Delay: Date.now() - XXStart,
      XByte: 0,
      XXX6: 0,
      Err: IsTimeout ? 'timeout' : 'error'
    }), {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}

async function HandleLatencyApi(Request) {
  // server-side latency test: open a TCP connection via cloudflare:sockets and measure connect time (real latency)
  // params: targets=host1[:port1],host2[:port2]... port=default port (optional, 443)
  const SpeedtestUrlObj9 = new URL(Request.url);
  const SpeedtestArgs9 = SpeedtestUrlObj9.searchParams;
  const SpeedtestTargetStr9 = (SpeedtestArgs9.get('targets') || '').trim();
  const SpeedtestDefaultPort9 = SpeedtestArgs9.get('port') || '443';
  const SpeedtestXXItems9 = SpeedtestTargetStr9.split(',').map(ParamVal9 => ParamVal9.trim()).filter(ParamVal9 => ParamVal9);
  if (SpeedtestXXItems9.length === 0 || SpeedtestXXItems9.length > 100) {
    return new Response(JSON.stringify({ success: false, error: '目标数量无效' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const SpeedtestTargetItems9 = SpeedtestXXItems9.map(XX9X2 => {
    let Host9 = XX9X2;
    let Port9 = SpeedtestDefaultPort9;
    if (Host9.includes('#')) Host9 = Host9.split('#')[0];
    if (Host9.startsWith('[')) {
      const XX9 = Host9.indexOf(']');
      if (XX9 > 0) {
        const Tail9 = Host9.slice(XX9 + 1);
        if (Tail9.startsWith(':')) Port9 = Tail9.slice(1);
        Host9 = Host9.slice(0, XX9 + 1);
      }
    } else if (Host9.includes(':')) {
      const XNextColon9 = Host9.lastIndexOf(':');
      const PortTail9 = Host9.slice(XNextColon9 + 1);
      if (/^[0-9]+$/.test(PortTail9)) {
        Port9 = PortTail9;
        Host9 = Host9.slice(0, XNextColon9);
      }
    }
    return { Host9: Host9.replace(/^\[|\]$/g, ''), Port9: parseInt(Port9) || 443 };
  });
  const TestXX9 = (Item9) => new Promise((Parse9) => {
    const Start9 = Date.now();
    let Done9 = false;
    const Finish9 = (ReadResult9) => { if (Done9) return; Done9 = true; Parse9(ReadResult9); };
    let Sock9 = null;
    try {
      Sock9 = Connect({ hostname: Item9.Host9, port: Item9.Port9 });
      Sock9.opened.then(() => {
        const Delay9 = Date.now() - Start9;
        try { Sock9.close(); } catch (Err9) {}
        Finish9({ success: true, host: Item9.Host9, port: Item9.Port9, latency: Delay9, error: '' });
      }).catch((Err9) => {
        Finish9({ success: false, host: Item9.Host9, port: Item9.Port9, latency: -1, error: String((Err9 && Err9.code) || 'connection_failed') });
      });
      setTimeout(() => {
        try { if (Sock9) Sock9.close(); } catch (Err9) {}
        Finish9({ success: false, host: Item9.Host9, port: Item9.Port9, latency: -1, error: 'timeout' });
      }, 8000);
    } catch (Err9) {
      Finish9({ success: false, host: Item9.Host9, port: Item9.Port9, latency: -1, error: 'error' });
    }
  });
  const SpeedtestReadResult9 = await Promise.all(SpeedtestTargetItems9.map(TestXX9));
  return new Response(JSON.stringify({ success: true, results: SpeedtestReadResult9 }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

async function TestSingleAddr(Host, Port) {
  return new Promise((Parse) => {
    const StartXX = Date.now();
    let Done = false;
    const Finish = (ReadResult) => { if (Done) return; Done = true; Parse(ReadResult); };
    let Sock = null;
    try {
      Sock = Connect({ hostname: Host, port: Port });
      Sock.opened.then(() => {
        const Delay = Date.now() - StartXX;
        try { Sock.close(); } catch (e) {}
        Finish({ success: true, latency: Delay });
      }).catch(() => Finish({ success: false, latency: -1 }));
      setTimeout(() => {
        try { if (Sock) Sock.close(); } catch (e) {}
        Finish({ success: false, latency: -1 });
      }, 8000);
    } catch (e) { Finish({ success: false, latency: -1 }); }
  });
}

async function HandlePrefGenApi(Request) {
  try {
    const Url = new URL(Request.url);
    const Count = Math.min(parseInt(Url.searchParams.get('count') || '16') || 16, 60);
    const PortArgs = Url.searchParams.get('port');
    const FixedPort = PortArgs ? parseInt(PortArgs) || -1 : -1;
    const BuildItems = await GenRandomPrefIp(Request, Count, FixedPort);
    const AvailableItems = [];
    for (const Item of BuildItems) {
      const DelayReadResult = await TestSingleAddr(Item.ip, Item.port);
      if (DelayReadResult.success) {
        AvailableItems.push({ ip: Item.ip, port: Item.port, latency: DelayReadResult.latency, isp: Item.isp });
      }
      if (AvailableItems.length >= Math.min(Count, 24)) break;
    }
    const FinalItems = AvailableItems.length >= 1 ? AvailableItems : BuildItems.map(Item => ({ ip: Item.ip, port: Item.port, latency: -1, isp: Item.isp }));
    FinalItems.sort((a, b) => (a.latency < 0 ? 1e9 : a.latency) - (b.latency < 0 ? 1e9 : b.latency));
    return new Response(JSON.stringify({
      success: true,
      count: FinalItems.length,
      ips: FinalItems.map(Item => Item.ip + ':' + Item.port),
      data: FinalItems
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (Err) {
    return new Response(JSON.stringify({ success: false, error: String(Err && Err.message || Err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function HandleVerifyPrefApi(Request) {
  // verify the preferred API (original edgetunnel logic): call the API and return the IP list
  try {
    const VerifyUrl = new URL(Request.url);
    const XVerifyXXX = VerifyUrl.searchParams.get('url');
    const VerifyPort = VerifyUrl.searchParams.get('port') || '443';
    if (!XVerifyXXX) {
      return new Response(JSON.stringify({ success: false, data: [], error: '缺少 url 参数' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    new URL(XVerifyXXX); // format validation
    const QueryPrefApisContent = await QueryPrefApis([XVerifyXXX], VerifyPort);
    let PrefApiXXX = QueryPrefApisContent.length > 0 ? QueryPrefApisContent : [];
    PrefApiXXX = PrefApiXXX.map(item => item.replace(/#(.+)$/, (_, Remark) => '#' + decodeURIComponent(Remark)));
    return new Response(JSON.stringify({ success: true, data: PrefApiXXX }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (VerifyErr) {
    return new Response(JSON.stringify({ success: false, data: [], error: String(VerifyErr && VerifyErr.message || VerifyErr) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function HandleVerifyProxyApi(Request) {
  // verify the chain proxy: parse the address + TCP connectivity test
  try {
    const XXUrl = new URL(Request.url);
    const ProxyAddr = XXUrl.searchParams.get('proxy');
    if (!ProxyAddr) {
      return new Response(JSON.stringify({ success: false, error: '缺少 proxy 参数' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // parse the proxy address (s5://, socks5://, http://, https://, or bare = s5)
    let Proto = 's5';
    let Auth = '';
    let HostPortX9 = ProxyAddr.trim();
    const ProtoMatch = HostPortX9.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/(.*)$/);
    if (ProtoMatch) {
      Proto = ProtoMatch[1].toLowerCase();
      HostPortX9 = ProtoMatch[2];
      if (Proto === 'socks5' || Proto === 's5') Proto = 's5';
      else if (Proto === 'socks4') Proto = 's4';
    }
    const AuthMatch = HostPortX9.match(/^([^@]+)@(.*)$/);
    if (AuthMatch) {
      Auth = AuthMatch[1];
      HostPortX9 = AuthMatch[2];
    }
    let Host = HostPortX9;
    let Port = 443;
    if (HostPortX9.startsWith('[')) {
      const XXMatch = HostPortX9.match(/^\[([^\]]+)\](?::(\d+))?$/);
      if (XXMatch) {
        Host = XXMatch[1];
        if (XXMatch[2]) Port = parseInt(XXMatch[2]);
      }
    } else {
      const ColonMatch = HostPortX9.match(/^(.*):(\d+)$/);
      if (ColonMatch) {
        Host = ColonMatch[1];
        Port = parseInt(ColonMatch[2]);
      }
    }
    if (!Host) {
      return new Response(JSON.stringify({ success: false, error: '代理地址格式无效' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    // TCP connectivity test (CF Workers connect API)
    const StartXX = Date.now();
    try {
      const TestSock = Connect({ hostname: Host, port: Port });
      if (TestSock?.opened) await TestSock.opened;
      if (TestSock && typeof TestSock.close === 'function') { try { TestSock.close(); } catch (e) {} }
    } catch (ConnectErr) {
      return new Response(JSON.stringify({ success: false, error: 'TCP 连接失败，请检查代理地址与端口' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const RespXX = Date.now() - StartXX;
    return new Response(JSON.stringify({
      success: true,
      responseTime: RespXX,
      protocol: Proto,
      ip: Host,
      port: Port,
      hasAuth: !!Auth
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (XXErr) {
    return new Response(JSON.stringify({ success: false, error: String(XXErr && XXErr.message || XXErr) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function HandlePrefAddrsApi(Request) {
  // ⚡️ start preferred: generate random preferred IPs and speed-test (panel feature, no KV or API switch needed)
  if (Request.method === 'GET' && new URL(Request.url).pathname.includes('/api/preferred-ips/generate')) {
    return await HandlePrefGenApi(Request);
  }
  // ⚡️ preferred tools: verify the preferred API (original edgetunnel logic)
  if (Request.method === 'GET' && new URL(Request.url).pathname.includes('/api/optimize-tools/verify-api')) {
    return await HandleVerifyPrefApi(Request);
  }
  // ⚡️ preferred tools: verify the chain proxy (parse address + TCP test)
  if (Request.method === 'GET' && new URL(Request.url).pathname.includes('/api/optimize-tools/verify-chain')) {
    return await HandleVerifyProxyApi(Request);
  }
  if (!KVStore) {
    return new Response(JSON.stringify({
      success: false,
      error: 'KV存储未配置',
      message: '需要配置KV存储才能使用此功能'
    }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const Local52 = GetConfigVal('ae', '') === 'yes';
  if (!Local52) {
    return new Response(JSON.stringify({
      success: false,
      error: 'API功能未启用',
      message: '出于安全考虑，优选IP API功能默认关闭。请在配置管理页面开启"允许API管理"选项后使用。'
    }), {
      status: 403,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  try {
    if (Request.method === 'GET') {
      const Val251 = GetConfigVal('yx', '');
      const Local50 = ParseBytesToInts(Val251);
      return new Response(JSON.stringify({
        success: true,
        count: Local50.length,
        data: Local50
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else if (Request.method === 'POST') {
      const Body49 = await Request.json();
      const AddrsValAdd = Array.isArray(Body49) ? Body49 : [Body49];
      if (AddrsValAdd.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: '请求数据为空',
          message: '请提供IP数据'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      const Val248 = GetConfigVal('yx', '');
      let Local47 = ParseBytesToInts(Val248);
      const Addrs46 = [];
      const Addrs45 = [];
      const ErrItems = [];
      for (const Item44 of AddrsValAdd) {
        if (!Item44.ip) {
          ErrItems.push({
            ip: '未知',
            reason: 'IP地址是必需的'
          });
          continue;
        }
        const Port43 = Item44.port || 443;
        const Name = Item44.name || `API优选-${Item44.ip}:${Port43}`;
        if (!IsValidAddr(Item44.ip) && !IsValidDomain(Item44.ip)) {
          ErrItems.push({
            ip: Item44.ip,
            reason: '无效的IP或域名格式'
          });
          continue;
        }
        const Local42 = Local47.some(ValItem => ValItem.ip === Item44.ip && ValItem.port === Port43);
        if (Local42) {
          Addrs45.push({
            ip: Item44.ip,
            port: Port43,
            reason: '已存在'
          });
          continue;
        }
        const NewAddr = {
          ip: Item44.ip,
          port: Port43,
          name: Name,
          addedAt: new Date().toISOString()
        };
        Local47.push(NewAddr);
        Addrs46.push(NewAddr);
      }
      if (Addrs46.length > 0) {
        const NewValVal41 = ParseArrayData(Local47);
        await SetConfigVal('yx', NewValVal41);
        UpdatePrefSource();
      }
      return new Response(JSON.stringify({
        success: Addrs46.length > 0,
        message: `成功添加 ${Addrs46.length} 个IP`,
        added: Addrs46.length,
        skipped: Addrs45.length,
        errors: ErrItems.length,
        data: {
          addedIPs: Addrs46,
          skippedIPs: Addrs45.length > 0 ? Addrs45 : undefined,
          errors: ErrItems.length > 0 ? ErrItems : undefined
        }
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else if (Request.method === 'DELETE') {
      const Body = await Request.json();
      if (Body.all === true) {
        const Val240 = GetConfigVal('yx', '');
        const Local39 = ParseBytesToInts(Val240);
        const ValCount = Local39.length;
        await SetConfigVal('yx', '');
        UpdatePrefSource();
        return new Response(JSON.stringify({
          success: true,
          message: `已清空所有优选IP，共删除 ${ValCount} 个`,
          deletedCount: ValCount
        }), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      if (!Body.ip) {
        return new Response(JSON.stringify({
          success: false,
          error: 'IP地址是必需的',
          message: '请提供要删除的ip字段，或使用 {"all": true} 清空所有'
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      const Port38 = Body.port || 443;
      const Val237 = GetConfigVal('yx', '');
      let Local36 = ParseBytesToInts(Val237);
      const ValLen = Local36.length;
      const Addrs = Local36.filter(Item35 => !(Item35.ip === Body.ip && Item35.port === Port38));
      if (Addrs.length === ValLen) {
        return new Response(JSON.stringify({
          success: false,
          error: '优选IP不存在',
          message: `${Body.ip}:${Port38} 未找到`
        }), {
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      const NewValVal = ParseArrayData(Addrs);
      await SetConfigVal('yx', NewValVal);
      UpdatePrefSource();
      return new Response(JSON.stringify({
        success: true,
        message: '优选IP已删除',
        deleted: {
          ip: Body.ip,
          port: Port38
        }
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: '不支持的请求方法',
        message: '支持的方法: GET, POST, DELETE'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  } catch (Err34) {
    return new Response(JSON.stringify({
      success: false,
      error: '处理请求失败',
      message: Err34.message
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}
function UpdateConfigVal() {
  const EffectiveCfg = EffectiveSnapshot();
  const ManualRegionX4 = EffectiveCfg.wk;
  if (ManualRegionX4 && ManualRegionX4.trim()) {
    ManualRegion = ManualRegionX4.trim().toUpperCase();
    CurRegion = ManualRegion;
  } else {
    const Local = EffectiveCfg.p;
    if (Local && Local.trim()) {
      CurRegion = 'CUSTOM';
    } else {
      ManualRegion = '';
      CurRegion = '';
    }
  }
  EnableRegionMatch = !(EffectiveCfg.rm && EffectiveCfg.rm.toLowerCase() === 'no');
  EnablePlain = EffectiveCfg.ev === 'yes';
  EnableTrojan = EffectiveCfg.et === 'yes';
  EnableXhttp = EffectiveCfg.ex === 'yes';
  TransferPath = EffectiveCfg.tp || '';
  SubConverter = EffectiveCfg.scu || Defaults.scu;
  EnablePrefDomain = EffectiveCfg.epd === 'yes';
  EnablePrefIp = EffectiveCfg.epi === 'yes';
  EnableRepoPref = EffectiveCfg.egi === 'yes';
  EnableNative = EffectiveCfg.ena === 'yes';
  EnableEch = EffectiveCfg.ech === 'yes';
  CustomDns = EffectiveCfg.customDNS || Defaults.customDNS;
  CustomEchDomain = EffectiveCfg.customECHDomain || Defaults.customECHDomain;
  CustomAlpn = NormalizeAlpn(EffectiveCfg.alpn || '');
  DisablePlain = EffectiveCfg.dkby === 'yes' || EnableEch;
  const DegradeXXVal = (EffectiveCfg.qj || '').toLowerCase();
  EnableDegrade = DegradeXXVal === 'no';
  ProxyOnly = DegradeXXVal === 'only';
  CustomPath = EffectiveCfg.d || '';
  PrefAddrSource = EffectiveCfg.yxURL || '';
  FallbackAddr = EffectiveCfg.p ? EffectiveCfg.p.trim() : '';
  Socks5Cfg = EffectiveCfg.s || '';
  if (Socks5Cfg) {
    try {
      ParsedSocks5 = ParseProxyConfig(Socks5Cfg);
      ProxyEnabled = true;
    } catch (Err31) {
      ProxyEnabled = false;
    }
  } else {
    ParsedSocks5 = {};
    ProxyEnabled = false;
  }
  DisablePref = !!(EffectiveCfg.yxby && EffectiveCfg.yxby.toLowerCase() === 'yes');
}
function UpdatePrefSource() {
  const Val230 = GetConfigVal('yx', '');
  if (Val230) {
    try {
      const PrefItems = Val230.split(',').map(Item29 => Item29.trim()).filter(Item28 => Item28);
      CustomPrefAddrs = [];
      CustomPrefDomains = [];
      PrefItems.forEach(Item27 => {
        let NodeName26 = '';
        let AddrPart25 = Item27;
        if (Item27.includes('#')) {
          const Parts24 = Item27.split('#');
          AddrPart25 = Parts24[0].trim();
          NodeName26 = Parts24[1].trim();
        }
        const {
          address: Addr23,
          port: Port22
        } = ParseAddrPort(AddrPart25);
        if (!NodeName26) {
          NodeName26 = '自定义优选-' + Addr23 + (Port22 ? ':' + Port22 : '');
        }
        if (IsValidAddr(Addr23)) {
          CustomPrefAddrs.push({
            ip: Addr23,
            port: Port22,
            isp: NodeName26
          });
        } else {
          CustomPrefDomains.push({
            domain: Addr23,
            port: Port22,
            name: NodeName26
          });
        }
      });
    } catch (Err) {
      CustomPrefAddrs = [];
      CustomPrefDomains = [];
    }
  } else {
    CustomPrefAddrs = [];
    CustomPrefDomains = [];
  }
}
function ParseBytesToInts(Val2) {
  if (!Val2 || !Val2.trim()) return [];
  const ItemItems = Val2.split(',').map(Item21 => Item21.trim()).filter(Item20 => Item20);
  const ReadResult = [];
  for (const Item19 of ItemItems) {
    let NodeName = '';
    let AddrPart = Item19;
    if (Item19.includes('#')) {
      const Parts = Item19.split('#');
      AddrPart = Parts[0].trim();
      NodeName = Parts[1].trim();
    }
    const {
      address: Addr,
      port: Port18
    } = ParseAddrPort(AddrPart);
    if (!NodeName) {
      NodeName = Addr + (Port18 ? ':' + Port18 : '');
    }
    ReadResult.push({
      ip: Addr,
      port: Port18 || 443,
      name: NodeName,
      addedAt: new Date().toISOString()
    });
  }
  return ReadResult;
}
function ParseArrayData(Array) {
  if (!Array || Array.length === 0) return '';
  return Array.map(ItemX14 => {
    const Port17 = ItemX14.port || 443;
    return `${ItemX14.ip}:${Port17}#${ItemX14.name}`;
  }).join(',');
}
function IsValidDomain(Domain) {
  const DomainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return DomainRegex.test(Domain);
}
async function GetPrefApis(UrlItems, DefaultPort = '443', Timeout = 3000) {
  if (!UrlItems?.length) return [];
  const Results = new Set();
  await Promise.allSettled(UrlItems.map(async Url => {
    try {
      const Ctrl = new AbortController();
      const TimeoutId = setTimeout(() => Ctrl.abort(), Timeout);
      const Resp = await fetch(Url, {
        signal: Ctrl.signal
      });
      clearTimeout(TimeoutId);
      let Text = '';
      try {
        const Buf = await Resp.arrayBuffer();
        const ContentType = (Resp.headers.get('content-type') || '').toLowerCase();
        const CharSet = ContentType.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || '';
        let DecodeXItems = ['utf-8', 'gb2312'];
        if (CharSet.includes('gb') || CharSet.includes('gbk') || CharSet.includes('gb2312')) {
          DecodeXItems = ['gb2312', 'utf-8'];
        }
        let DecodeSuccess = false;
        for (const Decoder of DecodeXItems) {
          try {
            const Decoded = new TextDecoder(Decoder).decode(Buf);
            if (Decoded && Decoded.length > 0 && !Decoded.includes('\ufffd')) {
              Text = Decoded;
              DecodeSuccess = true;
              break;
            } else if (Decoded && Decoded.length > 0) {
              continue;
            }
          } catch (EventVal16) {
            continue;
          }
        }
        if (!DecodeSuccess) {
          Text = await Resp.text();
        }
        if (!Text || Text.trim().length === 0) {
          return;
        }
      } catch (EventVal15) {
        return;
      }
      const Lines = Text.trim().split('\n').map(LineVal14 => LineVal14.trim()).filter(LineVal => LineVal);
      const IsRtl = Lines.length > 1 && Lines[0].includes(',');
      const XXAddrMode = /^[^\[\]]*:[^\[\]]*:[^\[\]]/;
      if (!IsRtl) {
        Lines.forEach(Row13 => {
          const XXIdx = Row13.indexOf('#');
          const [HostPart, Remark] = XXIdx > -1 ? [Row13.substring(0, XXIdx), Row13.substring(XXIdx)] : [Row13, ''];
          let HasPort = false;
          if (HostPart.startsWith('[')) {
            HasPort = /\]:(\d+)$/.test(HostPart);
          } else {
            const ValIndex = HostPart.lastIndexOf(':');
            HasPort = ValIndex > -1 && /^\d+$/.test(HostPart.substring(ValIndex + 1));
          }
          const Port12 = new URL(Url).searchParams.get('port') || DefaultPort;
          Results.add(HasPort ? Row13 : `${HostPart}:${Port12}${Remark}`);
        });
      } else {
        const HeaderItems = Lines[0].split(',').map(HeaderVal11 => HeaderVal11.trim());
        const DataLines = Lines.slice(1);
        if (HeaderItems.includes('IP地址') && HeaderItems.includes('端口') && HeaderItems.includes('数据中心')) {
          const AddrIdx10 = HeaderItems.indexOf('IP地址'),
            PortIdx = HeaderItems.indexOf('端口');
          const RemarkIdx = HeaderItems.indexOf('国家') > -1 ? HeaderItems.indexOf('国家') : HeaderItems.indexOf('城市') > -1 ? HeaderItems.indexOf('城市') : HeaderItems.indexOf('数据中心');
          const TlsIdx = HeaderItems.indexOf('TLS');
          DataLines.forEach(Row9 => {
            const Columns8 = Row9.split(',').map(CVal7 => CVal7.trim());
            if (TlsIdx !== -1 && Columns8[TlsIdx]?.toLowerCase() !== 'true') return;
            const PacketXAddr6 = XXAddrMode.test(Columns8[AddrIdx10]) ? `[${Columns8[AddrIdx10]}]` : Columns8[AddrIdx10];
            Results.add(`${PacketXAddr6}:${Columns8[PortIdx]}#${Columns8[RemarkIdx]}`);
          });
        } else if (HeaderItems.some(HeaderVal5 => HeaderVal5.includes('IP')) && HeaderItems.some(HeaderVal4 => HeaderVal4.includes('延迟')) && HeaderItems.some(HeaderVal3 => HeaderVal3.includes('下载速度'))) {
          const AddrIdx = HeaderItems.findIndex(HeaderVal2 => HeaderVal2.includes('IP'));
          const DelayIdx = HeaderItems.findIndex(HeaderVal1 => HeaderVal1.includes('延迟'));
          const XXIdxX1 = HeaderItems.findIndex(HeaderVal => HeaderVal.includes('下载速度'));
          const Port = new URL(Url).searchParams.get('port') || DefaultPort;
          DataLines.forEach(Row => {
            const Columns = Row.split(',').map(CVal => CVal.trim());
            const PacketXAddr = XXAddrMode.test(Columns[AddrIdx]) ? `[${Columns[AddrIdx]}]` : Columns[AddrIdx];
            Results.add(`${PacketXAddr}:${Port}#CF优选 ${Columns[DelayIdx]}ms ${Columns[XXIdxX1]}MB/s`);
          });
        }
      }
    } catch (EventVal) {}
  }));
  return Array.from(Results);
}