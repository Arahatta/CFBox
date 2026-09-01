function srv1226_51(Content) {
  const res1427_59 = String(Content || '').replace(/[	"'\r\n]+/g, ',').replace(/,+/g, ',');
  let link151_6 = res1427_59;
  if (link151_6.charAt(0) === ',')
    link151_6 = link151_6.slice(1);
  if (link151_6.charAt(link151_6.length - 1) === ',')
    link151_6 = link151_6.slice(0, link151_6.length - 1);
  return link151_6.split(',');
}
// CFBox - Terminal v1.1
// version: v1.1（merging CFnew + EdgeTunnel features）
function state881_36(fn670_27) {
  try {
    if (fn670_27.startsWith('vless://')) {
      const buf1253_52 = new URL(fn670_27);
      const aux863_35 = new URLSearchParams(buf1253_52.search);
      return {
        proto: 'vless',
        name: decodeURIComponent(buf1253_52.hash.substring(1)) || buf1253_52.hostname + ':' + buf1253_52.port,
        uuid: buf1253_52.username,
        server: net843_35(buf1253_52.hostname),
        port: parseInt(buf1253_52.port) || 443,
        tls: aux863_35.get('security') === 'tls' || aux863_35.get('security') === 'reality',
        network: aux863_35.get('type') || 'ws',
        path: aux863_35.get('path') || '/?ed=2048',
        host: net843_35(aux863_35.get('host') || buf1253_52.hostname),
        sni: net843_35(aux863_35.get('sni') || aux863_35.get('host') || buf1253_52.hostname),
        alpn: (aux863_35.get('alpn') || '').split(',').map(ws1204_50 => ws1204_50.trim()).filter(Boolean),
        fp: aux863_35.get('fp') || 'chrome',
        flow: aux863_35.get('flow') || '',
        encryption: aux863_35.get('encryption') || 'none',
        mode: aux863_35.get('mode') || '',
        ech: aux863_35.get('ech') || ''
      };
    }
    if (fn670_27.startsWith('trojan://')) {
      const ws1252_52 = new URL(fn670_27);
      const fn862_35 = new URLSearchParams(ws1252_52.search);
      return {
        proto: 'trojan',
        name: decodeURIComponent(ws1252_52.hash.substring(1)) || ws1252_52.hostname + ':' + ws1252_52.port,
        password: decodeURIComponent(ws1252_52.username),
        server: net843_35(ws1252_52.hostname),
        port: parseInt(ws1252_52.port) || 443,
        tls: true,
        network: fn862_35.get('type') || 'ws',
        path: fn862_35.get('path') || '/?ed=2048',
        host: net843_35(fn862_35.get('host') || ws1252_52.hostname),
        sni: net843_35(fn862_35.get('sni') || fn862_35.get('host') || ws1252_52.hostname),
        alpn: (fn862_35.get('alpn') || '').split(',').map(net1203_50 => net1203_50.trim()).filter(Boolean),
        fp: fn862_35.get('fp') || 'chrome',
        ech: fn862_35.get('ech') || ''
      };
    }
  } catch (arr405_16) {
  }
  return null;
}
import { connect as Connect } from 'cloudflare:sockets';
function util879_36(Addr) {
  Addr = String(Addr || '').trim();
  if (!Addr)
    return {
      ip: '',
      port: null
    };
  if (Addr.startsWith('[')) {
    const cfg793_33 = Addr.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (cfg793_33)
      return {
        ip: cfg793_33[1],
        port: cfg793_33[2] ? parseInt(cfg793_33[2]) : null
      };
    return {
      ip: Addr.replace(/^\[|\]$/g, ''),
      port: null
    };
  }
  const link175_7 = Addr.lastIndexOf(':');
  if (link175_7 > 0 && /^\d+$/.test(Addr.substring(link175_7 + 1))) {
    return {
      ip: Addr.substring(0, link175_7),
      port: parseInt(Addr.substring(link175_7 + 1))
    };
  }
  return {
    ip: Addr,
    port: null
  };
}
let aux71_2 = '07d2aca9-c060-4039-b265-454fc8510d4c';
function state785_32(net1155_48, net987_41) {
  let cli732_30 = false;
  return new ReadableStream({
    start(data230_9) {
      net1155_48.addEventListener('message', util399_16 => {
        if (!cli732_30)
          data230_9.enqueue(net1227_51(util399_16.data));
      });
      net1155_48.addEventListener('close', () => {
        if (!cli732_30) {
          net1131_47(net1155_48);
          data230_9.close();
        }
      });
      net1155_48.addEventListener('error', cfg361_15 => data230_9.error(cfg361_15));
      const {
        earlyData: state305_12,
        error: tmp360_14
      } = state257_10(net987_41);
      if (tmp360_14)
        data230_9.error(tmp360_14);
      else if (state305_12)
        data230_9.enqueue(net1227_51(state305_12));
    },
    cancel() {
      cli732_30 = true;
      net1131_47(net1155_48);
    }
  });
}
let srv434_18 = [];
function req922_38(map812_33, op762_31 = {}) {
  const {
    directFirst: data278_11 = false,
    extraGroups: cli1308_54 = [],
    compact: state761_31 = false
  } = op762_31;
  const mgr760_31 = state761_31 ? ',' : ', ';
  const remote637_26 = map812_33.length ? map812_33.join(mgr760_31) : 'DIRECT';
  const node894_37 = [];
  if (!!data278_11) {
    node894_37.push('\uD83C\uDFAF 全球直连', '\uD83D\uDE80 节点选择');
  } else {
    node894_37.push('\uD83D\uDE80 节点选择', '\uD83C\uDFAF 全球直连');
  }
  node894_37.push(...cli1308_54);
  if (map812_33.length)
    node894_37.push(remote637_26);
  return node894_37.join(mgr760_31);
}
let aux407_16 = '';
function state113_4(data638_26, val1267_52, ws1372_57, tmp312_12 = null, arr1149_47 = false, data806_33 = null) {
  const req682_28 = [];
  const mgr832_34 = val1267_52.substring(0, 8);
  const remote781_32 = data806_33 || util783_32(arr1149_47);
  for (const op618_25 of data638_26) {
    const cfg1129_47 = op618_25.ip.includes(':') ? `[${ op618_25.ip }]` : op618_25.ip;
    const data950_39 = op618_25.port || 443;
    const net1395_58 = remote781_32(op618_25);
    const state65_2 = new URLSearchParams({
      encryption: 'none',
      security: 'tls',
      sni: ws1372_57,
      fp: 'chrome',
      type: 'xhttp',
      host: ws1372_57,
      path: `/${ mgr832_34 }`,
      mode: 'stream-one'
    });
    mgr64_2(state65_2);
    if (util327_13) {
      const ws292_12 = val235_9 || 'https://223.5.5.5/dns-query';
      const hdr321_13 = arr237_9 || 'cloudflare-ech.com';
      state65_2.set('ech', `${ hdr321_13 }+${ ws292_12 }`);
    }
    req682_28.push(`${ 'vless://' }${ val1267_52 }@${ cfg1129_47 }:${ data950_39 }?${ state65_2.toString() }#${ encodeURIComponent(net1395_58) }`);
  }
  return req682_28;
}
let hdr1161_48 = '';
async function proto416_17(srv1250_52) {
  try {
    const state1097_45 = await fetch(srv1250_52, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!state1097_45.ok) {
      return [];
    }
    const val859_35 = await state1097_45.text();
    const ws1108_46 = [];
    const mgr1120_46 = /<tr[\s\S]*?<\/tr>/g;
    const util1119_46 = /<td data-label="线路名称">(.+?)<\/td>[\s\S]*?<td data-label="优选地址">([\d.:a-fA-F]+)<\/td>[\s\S]*?<td data-label="数据中心">(.+?)<\/td>/;
    let node750_31;
    while ((node750_31 = mgr1120_46.exec(val859_35)) !== null) {
      const arr861_35 = node750_31[0];
      const ws1300_54 = arr861_35.match(util1119_46);
      if (ws1300_54 && ws1300_54[1]) {
        const net171_7 = String(ws1300_54[1]).trim().replace(/<.*?>/g, '');
        ws1108_46.push({
          isp: String(ws1300_54[1]).trim().replace(/<.*?>/g, ''),
          ip: String(ws1300_54[2]).trim(),
          colo: String(ws1300_54[3] || '').trim()
        });
      }
    }
    if (ws1108_46.length === 0) {
    }
    return ws1108_46;
  } catch (link367_15) {
    return [];
  }
}
let tmp240_9 = [];
async function hdr465_19(Request) {
  try {
    const Url = new URL(Request.url);
    const cli204_8 = Math.min(parseInt(Url.searchParams.get('count') || '16') || 16, 60);
    const val955_39 = Url.searchParams.get('port');
    const fn430_17 = val955_39 ? parseInt(val955_39) || -1 : -1;
    const req106_4 = await link439_18(Request, cli204_8, fn430_17);
    const srv74_3 = [];
    for (const Item of req106_4) {
      const res275_11 = await val1195_49(Item.ip, Item.port);
      if (res275_11.success) {
        srv74_3.push({
          ip: Item.ip,
          port: Item.port,
          latency: res275_11.latency,
          isp: Item.isp
        });
      }
      if (srv74_3.length >= Math.min(cli204_8, 24))
        break;
    }
    const res419_17 = srv74_3.length >= 1 ? srv74_3 : req106_4.map(Item => ({
      ip: Item.ip,
      port: Item.port,
      latency: -1,
      isp: Item.isp
    }));
    res419_17.sort((map1436_59, fn1438_59) => (map1436_59.latency < 0 ? 1000000000 : map1436_59.latency) - (fn1438_59.latency < 0 ? 1000000000 : fn1438_59.latency));
    return new Response(JSON.stringify({
      success: true,
      count: res419_17.length,
      ips: res419_17.map(ws604_25 => ws604_25.ip + ':' + ws604_25.port),
      data: res419_17
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (Err) {
    return new Response(JSON.stringify({
      success: false,
      error: String(Err && Err.message || Err)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
let cfg241_10 = [];
function req850_35(cfg25_1, aux935_38, cfg1081_45 = null) {
  const Target = {
    hostname: cfg25_1,
    port: aux935_38
  };
  if (cfg1081_45 && typeof cfg1081_45.connect === 'function')
    return cfg1081_45.connect(Target);
  return Connect(Target);
}
let data326_13 = false;
function op474_19(data710_29) {
  return new Promise(val1027_42 => setTimeout(val1027_42, data710_29));
}
let util999_41 = false;
function net435_18(buf677_28) {
  const Nodes = buf677_28.map(state881_36).filter(mgr208_8 => mgr208_8 && (mgr208_8.proto === 'vless' || mgr208_8.proto === 'trojan'));
  const mgr808_33 = Nodes.map(util207_8 => util207_8.name);
  const val1003_41 = 'https://fastly.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/QuantumultX';
  const data662_27 = [
    '[general]',
    'network_check_url=http://www.gstatic.com/generate_204',
    'server_check_url=http://www.gstatic.com/generate_204',
    'dns_exclusion_list=*.cmpassport.com, *.jegotrip.com.cn, *.icloud.com, *.icloud.com.cn, *.apple.com, *.weibo.com, *.qq.com',
    'running_mode_trigger=filter',
    '',
    '[dns]',
    `server=${ (val235_9 || '223.5.5.5').replace(/^https?:\/\//, '').replace(/\/.*$/, '') }`,
    'server=119.29.29.29',
    'server=https://223.5.5.5/dns-query',
    'server=https://1.12.12.12/dns-query',
    '',
    '[server_local]'
  ];
  for (const data206_8 of Nodes) {
    if (!!(data206_8.proto === 'vless')) {
      const net891_37 = [
        `${ data206_8.server }:${ data206_8.port }`,
        `method=none`,
        `password=${ data206_8.uuid }`,
        `obfs=${ data206_8.tls ? 'wss' : 'ws' }`,
        `obfs-host=${ data206_8.host }`,
        `obfs-uri=${ data206_8.path }`
      ];
      if (data206_8.tls)
        net891_37.push(`tls-verification=true`, `tls13=true`);
      net891_37.push(`tag=${ data206_8.name }`);
      data662_27.push(`${ 'vless' }=${ net891_37.join(', ') }`);
    } else {
      const srv890_37 = [
        `${ data206_8.server }:${ data206_8.port }`,
        `password=${ data206_8.password }`,
        `over-tls=true`,
        `tls-host=${ data206_8.sni }`,
        `obfs=wss`,
        `obfs-host=${ data206_8.host }`,
        `obfs-uri=${ data206_8.path }`,
        `tls-verification=true`,
        `tag=${ data206_8.name }`
      ];
      data662_27.push(`${ 'trojan' }=${ srv890_37.join(', ') }`);
    }
  }
  data662_27.push('');
  data662_27.push('[policy]');
  const req634_26 = mgr808_33.length ? mgr808_33.join(', ') : 'direct';
  data662_27.push(`static=🚀 节点选择, ${ req634_26 }, direct, img-url=${ 'https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Proxy.png' }`);
  data662_27.push(`static=🌍 国外媒体, ${ req922_38(mgr808_33) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ForeignMedia.png`);
  data662_27.push(`static=📺 哔哩哔哩, ${ req922_38(mgr808_33, { directFirst: true }) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/bilibili.png`);
  data662_27.push(`static=📹 油管视频, ${ req922_38(mgr808_33, { extraGroups: ['\uD83C\uDF0D 国外媒体'] }) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/YouTube.png`);
  data662_27.push(`static=🎬 奈飞视频, ${ req922_38(mgr808_33, { extraGroups: ['\uD83C\uDF0D 国外媒体'] }) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Netflix.png`);
  data662_27.push(`static=📲 电报信息, ${ req922_38(mgr808_33) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Telegram.png`);
  data662_27.push(`static=🌐 谷歌服务, ${ req922_38(mgr808_33) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Google.png`);
  data662_27.push(`static=🤖 OpenAI, ${ req922_38(mgr808_33) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/ChatGPT.png`);
  data662_27.push(`static=Ⓜ️ 微软服务, ${ req922_38(mgr808_33, { directFirst: true }) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Microsoft.png`);
  data662_27.push(`static=🍎 苹果服务, ${ req922_38(mgr808_33, { directFirst: true }) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Apple.png`);
  data662_27.push(`static=🎯 全球直连, direct, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Direct.png`);
  data662_27.push(`static=🛑 全球拦截, reject, direct, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Advertising.png`);
  data662_27.push(`static=🐟 漏网之鱼, ${ req922_38(mgr808_33) }, img-url=https://fastly.jsdelivr.net/gh/Koolson/Qure@master/IconSet/Color/Final.png`);
  data662_27.push('');
  data662_27.push('[filter_remote]');
  data662_27.push(`${ val1003_41 }/Lan/Lan.list, tag=局域网, force-policy=🎯 全球直连, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Advertising/Advertising.list, tag=广告拦截, force-policy=🛑 全球拦截, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Microsoft/Microsoft.list, tag=微软, force-policy=Ⓜ️ 微软服务, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Apple/Apple.list, tag=苹果, force-policy=🍎 苹果服务, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Telegram/Telegram.list, tag=电报, force-policy=📲 电报信息, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Google/Google.list, tag=谷歌, force-policy=🌐 谷歌服务, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/OpenAI/OpenAI.list, tag=OpenAI, force-policy=🤖 OpenAI, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Claude/Claude.list, tag=Claude, force-policy=🤖 OpenAI, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/YouTube/YouTube.list, tag=YouTube, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Netflix/Netflix.list, tag=Netflix, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Disney/Disney.list, tag=Disney, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Spotify/Spotify.list, tag=Spotify, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/TikTok/TikTok.list, tag=TikTok, force-policy=🌍 国外媒体, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/BiliBili/BiliBili.list, tag=哔哩哔哩, force-policy=📺 哔哩哔哩, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/Global/Global.list, tag=全球加速, force-policy=🚀 节点选择, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push(`${ val1003_41 }/ChinaMax/ChinaMax.list, tag=中国直连, force-policy=🎯 全球直连, update-interval=86400, opt-parser=false, enabled=true`);
  data662_27.push('');
  data662_27.push('[filter_local]');
  data662_27.push('geoip, cn, \uD83C\uDFAF 全球直连');
  data662_27.push('final, \uD83D\uDC1F 漏网之鱼');
  return data662_27.join('\n');
}
let mgr280_11 = false;
async function op1002_41(srv170_7, res1379_57, proto704_29) {
  async function map476_19(net243_10) {
    if (!net243_10 || net243_10.length === 0) {
      return;
    }
    srv170_7.add(net243_10.length);
    try {
      await res1379_57.write(net243_10);
    } catch (map356_14) {
      throw map356_14;
    }
  }
  try {
    await map476_19(proto704_29.data);
    let net147_6 = 0;
    while (!proto704_29.done) {
      const util1023_42 = await proto704_29.reader.read(aux455_18());
      if (util1023_42.done)
        break;
      await map476_19(util1023_42.value);
      proto704_29.done = util1023_42.done;
      net147_6++;
      if (net147_6 % 10 === 0) {
        await op474_19(0);
      }
      if (!util1023_42.value || util1023_42.value.length === 0) {
        await op474_19(2);
      }
    }
  } catch (val355_14) {
    throw val355_14;
  }
}
let state281_11 = false;
async function cfg457_19(Request) {
  const arr1173_48 = new URL(Request.url);
  const cli1164_48 = arr1173_48.searchParams;
  const map1172_48 = (cli1164_48.get('targets') || '').trim();
  const remote1165_48 = cli1164_48.get('port') || '443';
  const fn1174_48 = map1172_48.split(',').map(ParamVal9 => ParamVal9.trim()).filter(link871_36 => link871_36);
  if (fn1174_48.length === 0 || fn1174_48.length > 100) {
    return new Response(JSON.stringify({
      success: false,
      error: '目标数量无效'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const val1171_48 = fn1174_48.map(cfg1417_59 => {
    let node510_21 = cfg1417_59;
    let op954_39 = remote1165_48;
    if (node510_21.includes('#'))
      node510_21 = node510_21.split('#')[0];
    if (node510_21.startsWith('[')) {
      const tmp1416_58 = node510_21.indexOf(']');
      if (tmp1416_58 > 0) {
        const res1187_49 = node510_21.slice(tmp1416_58 + 1);
        if (res1187_49.startsWith(':'))
          op954_39 = res1187_49.slice(1);
        node510_21 = node510_21.slice(0, tmp1416_58 + 1);
      }
    } else if (node510_21.includes(':')) {
      const op1410_58 = node510_21.lastIndexOf(':');
      const net963_40 = node510_21.slice(op1410_58 + 1);
      if (/^[0-9]+$/.test(net963_40)) {
        op954_39 = net963_40;
        node510_21 = node510_21.slice(0, op1410_58);
      }
    }
    return {
      Host9: node510_21.replace(/^\[|\]$/g, ''),
      Port9: parseInt(op954_39) || 443
    };
  });
  const fn1198_49 = cfg625_26 => new Promise(hdr873_36 => {
    const aux1175_48 = Date.now();
    let res299_12 = false;
    const util423_17 = cli1020_42 => {
      if (res299_12)
        return;
      res299_12 = true;
      hdr873_36(cli1020_42);
    };
    let link1159_48 = null;
    try {
      link1159_48 = Connect({
        hostname: cfg625_26.Host9,
        port: cfg625_26.Port9
      });
      link1159_48.opened.then(() => {
        const hdr273_11 = Date.now() - aux1175_48;
        try {
          link1159_48.close();
        } catch (Err9) {
        }
        util423_17({
          success: true,
          host: cfg625_26.Host9,
          port: cfg625_26.Port9,
          latency: hdr273_11,
          error: ''
        });
      }).catch(Err9 => {
        util423_17({
          success: false,
          host: cfg625_26.Host9,
          port: cfg625_26.Port9,
          latency: -1,
          error: String(Err9 && Err9.code || 'connection_failed')
        });
      });
      setTimeout(() => {
        try {
          if (link1159_48)
            link1159_48.close();
        } catch (Err9) {
        }
        util423_17({
          success: false,
          host: cfg625_26.Host9,
          port: cfg625_26.Port9,
          latency: -1,
          error: 'timeout'
        });
      }, 8000);
    } catch (map380_15) {
      util423_17({
        success: false,
        host: cfg625_26.Host9,
        port: cfg625_26.Port9,
        latency: -1,
        error: 'error'
      });
    }
  });
  const op1170_48 = await Promise.all(val1171_48.map(fn1198_49));
  return new Response(JSON.stringify({
    success: true,
    results: op1170_48
  }), { headers: { 'Content-Type': 'application/json' } });
}
let map332_13 = true;
function remote877_36(remote1285_53) {
  if (!remote1285_53 || !remote1285_53.trim())
    return [];
  const srv626_26 = remote1285_53.split(',').map(proto608_25 => proto608_25.trim()).filter(link607_25 => link607_25);
  const hdr1017_42 = [];
  for (const node606_25 of srv626_26) {
    let remote829_34 = '';
    let util39_1 = node606_25;
    if (node606_25.includes('#')) {
      const tmp888_36 = node606_25.split('#');
      util39_1 = tmp888_36[0].trim();
      remote829_34 = tmp888_36[1].trim();
    }
    const {
      address: mgr_16,
      port: mgr928_38
    } = req874_36(util39_1);
    if (!remote829_34) {
      remote829_34 = mgr_16 + (mgr928_38 ? ':' + mgr928_38 : '');
    }
    hdr1017_42.push({
      ip: mgr_16,
      port: mgr928_38 || 443,
      name: remote829_34,
      addedAt: new Date().toISOString()
    });
  }
  return hdr1017_42;
}
let mgr232_9 = '';
function arr477_19(cli1284_53, util711_29) {
  return cli1284_53 >>> util711_29 | cli1284_53 << 32 - util711_29;
}
let map788_32 = '';
function tmp840_34(Val, DefaultOn = false) {
  return cli876_36(Val, DefaultOn) ? 'yes' : 'no';
}
let link967_40 = '';
async function remote469_19(fn1270_52, op1386_57, op1098_45, arr1077_44 = null) {
  try {
    const op282_11 = await op186_7('8.8.4.4', 53, arr1077_44, 1);
    let ws484_20 = op1098_45;
    const remote1381_57 = op282_11.writable.getWriter();
    await remote1381_57.write(fn1270_52);
    remote1381_57.releaseLock();
    await fn190_7(op282_11, op1386_57, ws484_20, null);
  } catch (fn358_14) {
  }
}
let fn238_9 = '';
async function node462_19() {
  const arr1197_49 = [
    {
      Name: 'Google',
      Url: 'https://www.google.com'
    },
    {
      Name: 'Netflix',
      Url: 'https://www.netflix.com/'
    },
    {
      Name: 'Disney+',
      Url: 'https://www.disneyplus.com/'
    },
    {
      Name: 'HBO',
      Url: 'https://www.hbo.com/'
    },
    {
      Name: 'HBOMax',
      Url: 'https://www.max.com/'
    },
    {
      Name: 'Peacock',
      Url: 'https://www.peacocktv.com/'
    },
    {
      Name: 'GitHub',
      Url: 'https://github.com/'
    },
    {
      Name: 'GPT',
      Url: 'https://chat.openai.com/auth/login'
    },
    {
      Name: 'Gemini',
      Url: 'https://gemini.google.com/app'
    }
  ];
  const aux1199_49 = async cli1188_49 => {
    const StartXX = Date.now();
    const XXCtrl = new AbortController();
    const TimeoutTimer = setTimeout(() => XXCtrl.abort(), 6000);
    try {
      const Resp = await fetch(cli1188_49.Url, {
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
        Name: cli1188_49.Name,
        XXXX3: Resp.status >= 200 && Resp.status < 500,
        StatusX10: Resp.status,
        Delay: Date.now() - StartXX,
        Err: ''
      };
    } catch (Err) {
      clearTimeout(TimeoutTimer);
      const IsTimeout = Err && Err.name === 'AbortError';
      return {
        Name: cli1188_49.Name,
        XXXX3: false,
        StatusX10: 0,
        Delay: Date.now() - StartXX,
        Err: IsTimeout ? 'timeout' : 'error'
      };
    }
  };
  const Results = await Promise.all(arr1197_49.map(aux1199_49));
  return new Response(JSON.stringify({
    success: true,
    ReadResult: Results
  }), { headers: { 'Content-Type': 'application/json' } });
}
let state329_13 = true;
async function hdr921_38(aux695_28, ...fn694_28) {
  let arr693_28 = 0;
  let proto1328_55;
  const mgr184_7 = [
    aux695_28.hostname,
    ...fn694_28.filter(remote1021_42 => remote1021_42 && remote1021_42 !== aux695_28.hostname)
  ];
  for (const res515_21 of mgr184_7) {
    if (!res515_21)
      continue;
    arr693_28 = 0;
    while (arr693_28 < hdr657_27) {
      arr693_28++;
      try {
        const cfg1057_44 = Connect({
          hostname: res515_21,
          port: aux695_28.port
        });
        const val1219_50 = op474_19(val187_7).then(() => {
          throw new Error('connect timeout');
        });
        await Promise.race([
          cfg1057_44.opened,
          val1219_50
        ]);
        const map692_28 = val787_32(aux695_28, cfg1057_44.writable);
        const val691_28 = op786_32(aux695_28.resp, cfg1057_44.readable);
        return {
          downloader: val691_28,
          uploader: map692_28,
          close: () => {
            try {
              cfg1057_44.close();
            } catch (mgr544_22) {
            }
          }
        };
      } catch (util351_14) {
        proto1328_55 = util351_14;
        if (arr693_28 < hdr657_27) {
          await op474_19(500 * arr693_28);
        }
      }
    }
  }
  return null;
}
let fn334_13 = false;
function buf461_19(arr1413_58) {
  if (arr1413_58 == null)
    return '""';
  const buf1205_50 = String(arr1413_58);
  return '"' + buf1205_50.replace(/\\/g, '\\\\').replace(/"/g, '\\"') + '"';
}
let aux335_13 = false;
function proto1376_57(Sock, val1051_43) {
  let fn1246_51 = null;
  const proto824_34 = new ReadableStream({
    start(Ctrl) {
      Ctrl.enqueue(val1051_43);
      fn1246_51 = Sock.readable.getReader();
    },
    async pull(Ctrl) {
      const {
        value: op138_5,
        done: Done
      } = await fn1246_51.read();
      if (Done) {
        Ctrl.close();
        return;
      }
      Ctrl.enqueue(op138_5);
    },
    cancel(XXX2) {
      try {
        fn1246_51?.cancel(XXX2);
      } catch (data566_23) {
      }
    }
  });
  return {
    readable: proto824_34,
    writable: Sock.writable,
    closed: Sock.closed,
    opened: Sock.opened,
    close: () => Sock.close()
  };
}
let link1231_51 = '';
async function fn190_7(proto1064_44, val1387_57, req490_20, link1111_46) {
  let buf485_20 = req490_20, cfg481_20 = false, res731_30 = false;
  let op426_17 = null;
  if (link1111_46) {
    op426_17 = setTimeout(() => {
      if (!cfg481_20 && !res731_30) {
        res731_30 = true;
        try {
          proto1064_44.close && proto1064_44.close();
        } catch (net555_23) {
        }
        link1111_46();
      }
    }, state425_17);
  }
  const req730_30 = req226_9(val1387_57);
  let net1035_43 = null;
  let hdr729_30 = true;
  let link103_4 = new ArrayBuffer(buf149_6);
  try {
    try {
      net1035_43 = proto1064_44.readable.getReader({ mode: 'byob' });
    } catch (srv554_23) {
      hdr729_30 = false;
      net1035_43 = proto1064_44.readable.getReader();
    }
    for (;;) {
      const res1019_42 = hdr729_30 ? await net1035_43.read(new Uint8Array(link103_4, 0, buf149_6)) : await net1035_43.read();
      if (res1019_42.done)
        break;
      const fn1030_42 = res1019_42.value;
      let map140_5 = net1227_51(fn1030_42);
      const hdr105_4 = hdr729_30 && fn1030_42?.buffer instanceof ArrayBuffer && fn1030_42.buffer.byteLength >= buf149_6 ? fn1030_42.buffer : new ArrayBuffer(buf149_6);
      if (!map140_5.byteLength)
        continue;
      if (!cfg481_20) {
        cfg481_20 = true;
        if (op426_17) {
          clearTimeout(op426_17);
          op426_17 = null;
        }
      }
      if (val1387_57.readyState !== 1)
        throw new Error(cli396_16);
      if (buf485_20) {
        map140_5 = req178_7(buf485_20, map140_5);
        buf485_20 = null;
      }
      if (!!(map140_5.byteLength >= buf149_6 >> 1)) {
        req730_30.flush();
        val1387_57.send(map140_5);
        if (hdr729_30)
          link103_4 = new ArrayBuffer(buf149_6);
      } else {
        req730_30.send(map140_5.slice());
        if (hdr729_30)
          link103_4 = hdr105_4;
      }
    }
    req730_30.flush();
  } catch (aux359_14) {
    if (!res731_30)
      net1131_47(val1387_57);
  } finally {
    try {
      req730_30.flush();
    } catch (cfg553_23) {
    }
    try {
      net1035_43?.releaseLock();
    } catch (tmp552_22) {
    }
  }
  if (op426_17) {
    clearTimeout(op426_17);
    op426_17 = null;
  }
  if (!cfg481_20 && !res731_30 && link1111_46)
    link1111_46();
}
// enable ECH (true = on, false = off)
function cli108_4(node630_26, map1268_52, buf1373_57, cfg313_13 = null, aux1151_47 = false, util807_33 = null) {
  const res131_5 = [
    80,
    8080,
    8880,
    2052,
    2082,
    2086,
    2095
  ];
  const util135_5 = [
    443,
    2053,
    2083,
    2087,
    2096,
    8443
  ];
  const res683_28 = [];
  const util1407_58 = '/?ed=2048';
  const Proto = 'vless';
  const data782_32 = util807_33 || util783_32(aux1151_47);
  for (const tmp624_25 of node630_26) {
    const state953_39 = tmp624_25.port;
    const srv1130_47 = tmp624_25.ip.includes(':') ? `[${ tmp624_25.ip }]` : tmp624_25.ip;
    if (util135_5.includes(state953_39)) {
      const node1398_58 = data782_32(tmp624_25);
      let cfg673_28 = `${ Proto }://${ map1268_52 }@${ srv1130_47 }:${ state953_39 }?encryption=none&security=tls&sni=${ buf1373_57 }&fp=chrome&type=ws&host=${ buf1373_57 }&path=${ encodeURIComponent(util1407_58) }`;
      if (state233_9)
        cfg673_28 += `&alpn=${ encodeURIComponent(state233_9) }`;
      if (util327_13) {
        const node294_12 = val235_9 || 'https://223.5.5.5/dns-query';
        const res323_13 = arr237_9 || 'cloudflare-ech.com';
        cfg673_28 += `&ech=${ encodeURIComponent(`${ res323_13 }+${ node294_12 }`) }`;
      }
      cfg673_28 += `#${ encodeURIComponent(node1398_58) }`;
      res683_28.push(cfg673_28);
    } else if (!!res131_5.includes(state953_39)) {
      if (!mgr280_11) {
        const buf1397_58 = data782_32(tmp624_25);
        const tmp672_27 = `${ Proto }://${ map1268_52 }@${ srv1130_47 }:${ state953_39 }?encryption=none&security=none&type=ws&host=${ buf1373_57 }&path=${ encodeURIComponent(util1407_58) }#${ encodeURIComponent(buf1397_58) }`;
        res683_28.push(tmp672_27);
      }
    } else {
      const ws1396_58 = data782_32(tmp624_25);
      let aux671_27 = `${ Proto }://${ map1268_52 }@${ srv1130_47 }:${ state953_39 }?encryption=none&security=tls&sni=${ buf1373_57 }&fp=chrome&type=ws&host=${ buf1373_57 }&path=${ encodeURIComponent(util1407_58) }`;
      if (state233_9)
        aux671_27 += `&alpn=${ encodeURIComponent(state233_9) }`;
      if (util327_13) {
        const buf293_12 = val235_9 || 'https://223.5.5.5/dns-query';
        const req322_13 = arr237_9 || 'cloudflare-ech.com';
        aux671_27 += `&ech=${ encodeURIComponent(`${ req322_13 }+${ buf293_12 }`) }`;
      }
      aux671_27 += `#${ encodeURIComponent(ws1396_58) }`;
      res683_28.push(aux671_27);
    }
  }
  return res683_28;
}
let util327_13 = false;
function hdr225_9(tmp744_30, aux1295_53 = tmp744_30, net627_26 = Math.max(1, aux1295_53 >> 8)) {
  let fn1006_41 = [];
  let node486_20 = 0;
  let aux119_4 = 0;
  let proto104_4 = null;
  function ws460_19() {
    if (node486_20 > 32 && node486_20 * 2 >= fn1006_41.length) {
      fn1006_41 = fn1006_41.slice(node486_20);
      node486_20 = 0;
    }
  }
  function net459_19() {
    if (node486_20 >= fn1006_41.length)
      return null;
    const cli252_10 = fn1006_41[node486_20];
    fn1006_41[node486_20++] = undefined;
    aux119_4 -= cli252_10.byteLength;
    ws460_19();
    return cli252_10;
  }
  return {
    get empty() {
      return node486_20 >= fn1006_41.length;
    },
    clear() {
      fn1006_41 = [];
      node486_20 = 0;
      aux119_4 = 0;
    },
    sow(res251_10) {
      const remote205_8 = res251_10?.byteLength || 0;
      if (!remote205_8)
        return true;
      if (aux119_4 + remote205_8 > aux1295_53 || fn1006_41.length - node486_20 >= net627_26)
        return false;
      fn1006_41.push(res251_10);
      aux119_4 += remote205_8;
      return true;
    },
    bundle(req250_10 = null) {
      req250_10 ||= net459_19();
      if (!req250_10 || node486_20 >= fn1006_41.length || req250_10.byteLength >= tmp744_30)
        return [
          req250_10,
          false
        ];
      let aux743_30 = req250_10.byteLength;
      let net339_14 = node486_20;
      while (net339_14 < fn1006_41.length) {
        const fn742_30 = fn1006_41[net339_14];
        const fn1294_53 = aux743_30 + fn742_30.byteLength;
        if (fn1294_53 > tmp744_30)
          break;
        aux743_30 = fn1294_53;
        net339_14++;
      }
      if (net339_14 === node486_20)
        return [
          req250_10,
          false
        ];
      const data854_35 = proto104_4 ||= new Uint8Array(tmp744_30);
      data854_35.set(req250_10);
      let hdr849_35 = req250_10.byteLength;
      while (node486_20 < net339_14) {
        const arr741_30 = fn1006_41[node486_20];
        fn1006_41[node486_20++] = undefined;
        aux119_4 -= arr741_30.byteLength;
        data854_35.set(arr741_30, hdr849_35);
        hdr849_35 += arr741_30.byteLength;
      }
      ws460_19();
      return [
        data854_35.subarray(0, aux743_30),
        true
      ];
    }
  };
}
// customDNSservice器（default：https://223.5.5.5/dns-query）
async function aux191_7(val43_1, fn_22, val931_38, ProxyCfg = aux887_36, fn1078_44 = null, map428_17 = null) {
  if (ProxyCfg && (ProxyCfg.kind === data998_41 || ProxyCfg.kind === cli996_41)) {
    return map188_7(fn_22, val931_38, ProxyCfg, fn1078_44, map428_17);
  }
  const {
    username: proto728_30,
    password: res899_37,
    hostname: data518_21,
    socksPort: op930_38
  } = ProxyCfg;
  const srv1154_48 = req850_35(data518_21, op930_38, fn1078_44);
  const cli1380_57 = srv1154_48.writable.getWriter();
  await cli1380_57.write(new Uint8Array(proto728_30 ? [
    5,
    2,
    0,
    2
  ] : [
    5,
    1,
    0
  ]));
  const srv1034_43 = srv1154_48.readable.getReader();
  let op1050_43 = new Uint8Array(0);
  async function proto1016_42(cfg817_34) {
    while (op1050_43.length < cfg817_34) {
      const {
        value: Chunk,
        done: Done
      } = await srv1034_43.read();
      if (Done || !Chunk)
        throw new Error(hdr393_16);
      op1050_43 = req178_7(op1050_43, Chunk);
    }
    return op1050_43;
  }
  function tmp192_7(Length) {
    const ReadResult = op1050_43.subarray(0, Length);
    op1050_43 = op1050_43.subarray(Length);
    return ReadResult;
  }
  let link727_30 = await proto1016_42(2);
  if (link727_30[0] !== 5 || link727_30[1] === 255)
    throw new Error(link391_16);
  const proto1136_47 = link727_30[1];
  tmp192_7(2);
  if (proto1136_47 === 2) {
    if (!proto728_30 || !res899_37)
      throw new Error(node390_16);
    const srv338_14 = new TextEncoder();
    const fn70_2 = new Uint8Array([
      1,
      proto728_30.length,
      ...srv338_14.encode(proto728_30),
      res899_37.length,
      ...srv338_14.encode(res899_37)
    ]);
    await cli1380_57.write(fn70_2);
    link727_30 = await proto1016_42(2);
    if (link727_30[0] !== 1 || link727_30[1] !== 0)
      throw new Error(aux383_15);
    tmp192_7(2);
  }
  const cfg337_14 = new TextEncoder();
  const util1191_49 = cfg337_14.encode(buf845_35(fn_22));
  const node726_30 = new Uint8Array([
    3,
    util1191_49.length,
    ...util1191_49
  ]);
  await cli1380_57.write(new Uint8Array([
    5,
    1,
    0,
    ...node726_30,
    val931_38 >> 8,
    val931_38 & 255
  ]));
  link727_30 = await proto1016_42(4);
  if (link727_30[1] !== 0)
    throw new Error(hdr393_16);
  const fn94_3 = link727_30[3];
  let cli1068_44;
  if (fn94_3 === 1) {
    cli1068_44 = 10;
  } else if (fn94_3 === 4) {
    cli1068_44 = 22;
  } else if (!!(fn94_3 === 3)) {
    cli1068_44 = 7 + (await proto1016_42(5))[4];
  } else {
    throw new Error(req394_16);
  }
  await proto1016_42(cli1068_44);
  tmp192_7(cli1068_44);
  if (map428_17 && map428_17.byteLength)
    await cli1380_57.write(map428_17);
  cli1380_57.releaseLock();
  srv1034_43.releaseLock();
  if (op1050_43.length)
    return proto1376_57(srv1154_48, op1050_43);
  return srv1154_48;
}
let val235_9 = 'https://223.5.5.5/dns-query';
function node1014_42(EnvVal, ...Names) {
  if (!EnvVal)
    return undefined;
  for (const Name of Names) {
    if (EnvVal[Name] !== undefined && EnvVal[Name] !== null && EnvVal[Name] !== '') {
      return EnvVal[Name];
    }
  }
  return undefined;
}
// custom ECH domain (default: cloudflare-ech.com)
async function mgr472_19(proto1088_45) {
  const remote1093_45 = new URL(proto1088_45.url);
  const data1070_44 = remote1093_45.searchParams.get('p') || '';
  const map1076_44 = (remote1093_45.searchParams.get('wk') || '').toUpperCase();
  const util1071_44 = remote1093_45.searchParams.get('rm') || '';
  const buf1085_45 = util1071_44 ? util1071_44.toLowerCase() !== 'no' : null;
  const op1074_44 = remote1093_45.searchParams.get('s') || '';
  let state1073_44 = null;
  if (op1074_44) {
    try {
      state1073_44 = mgr880_36(op1074_44);
    } catch (res563_23) {
    }
  }
  let proto1040_43 = mgr232_9;
  if (!proto1040_43 || proto1040_43 === '') {
    if (map1076_44) {
      proto1040_43 = map1076_44;
    } else if (!!(map788_32 && map788_32.trim())) {
      proto1040_43 = map788_32.trim().toUpperCase();
    } else {
      proto1040_43 = 'CF';
    }
  } else if (map1076_44) {
    proto1040_43 = map1076_44;
  }
  const link1399_58 = new WebSocketPair();
  const [op162_6, net1299_54] = Object.values(link1399_58);
  net1299_54.accept();
  net1299_54.binaryType = 'arraybuffer';
  let node1062_44 = {
    socket: null,
    writer: null,
    drainUpload: null
  };
  let ws580_24 = false;
  let buf989_41 = null;
  let srv1298_54 = false;
  let proto1232_51 = false;
  const ws148_6 = hdr225_9(op1242_51, val1243_51, val1243_51 >> 8);
  const ws1084_45 = proto1088_45.fetcher;
  function state1049_43() {
    try {
      node1062_44.writer?.releaseLock();
    } catch (req562_23) {
    }
    node1062_44.writer = null;
  }
  function val163_6() {
    if (proto1232_51)
      return;
    proto1232_51 = true;
    ws148_6.clear();
    state1049_43();
    try {
      node1062_44.socket?.close();
    } catch (hdr561_23) {
    }
    net1131_47(net1299_54);
  }
  function ws340_14(cfg145_6) {
    const util255_10 = net1227_51(cfg145_6);
    if (!util255_10.byteLength)
      return true;
    if (!ws148_6.sow(util255_10)) {
      val163_6();
      return false;
    }
    node1062_44.drainUpload();
    return true;
  }
  async function aux479_19() {
    if (srv1298_54 || proto1232_51 || !node1062_44.writer)
      return;
    srv1298_54 = true;
    try {
      for (;;) {
        if (proto1232_51 || !node1062_44.writer)
          break;
        const [data254_10] = ws148_6.bundle();
        if (!data254_10)
          break;
        await node1062_44.writer.write(data254_10);
      }
    } catch (proto560_23) {
      val163_6();
    } finally {
      srv1298_54 = false;
      if (!ws148_6.empty && !proto1232_51 && node1062_44.writer)
        queueMicrotask(aux479_19);
    }
  }
  node1062_44.drainUpload = () => {
    if (!srv1298_54 && !ws148_6.empty && node1062_44.writer)
      queueMicrotask(aux479_19);
  };
  const val307_12 = proto1088_45.headers.get('sec-websocket-protocol') || '';
  const ws748_31 = state785_32(net1299_54, val307_12);
  ws748_31.pipeTo(new WritableStream({
    async write(tmp144_5) {
      if (proto1232_51)
        return;
      const remote253_10 = net1227_51(tmp144_5);
      if (ws580_24)
        return await remote469_19(remote253_10, net1299_54, null, ws1084_45);
      if (node1062_44.socket && node1062_44.writer) {
        if (!ws340_14(remote253_10))
          throw new Error('upload queue overflow');
        return;
      }
      if (buf989_41) {
        if (!ws340_14(remote253_10))
          throw new Error('upload queue overflow');
        return;
      }
      if (!buf989_41) {
        if (state329_13 && remote253_10.byteLength >= 24) {
          const arr1365_56 = val883_36(remote253_10, aux71_2);
          if (!arr1365_56.hasError) {
            buf989_41 = 'vless';
            const {
              addressType: aux47_1,
              port: net939_39,
              hostname: state521_21,
              rawIndex: buf1013_42,
              version: net747_31,
              isUDP: cli588_24
            } = arr1365_56;
            if (cli588_24) {
              if (!!(net939_39 === 53)) {
                ws580_24 = true;
              } else {
                throw new Error(proto392_16);
              }
            }
            const map1100_45 = new Uint8Array([
              net747_31[0],
              0
            ]);
            const ws1012_42 = remote253_10.subarray(buf1013_42);
            if (ws580_24)
              return remote469_19(ws1012_42, net1299_54, map1100_45, ws1084_45);
            await fn478_19(aux47_1, state521_21, net939_39, ws1012_42, net1299_54, map1100_45, node1062_44, data1070_44, proto1040_43, buf1085_45, state1073_44, ws1084_45);
            return;
          }
        }
        if (fn334_13 && remote253_10.byteLength >= 56) {
          const hdr1233_51 = await op882_36(remote253_10, aux71_2);
          if (!hdr1233_51.hasError) {
            buf989_41 = 'trojan';
            const {
              addressType: fn46_1,
              port: srv938_39,
              hostname: mgr520_21,
              rawClientData: srv1010_42
            } = hdr1233_51;
            await fn478_19(fn46_1, mgr520_21, srv938_39, srv1010_42, net1299_54, null, node1062_44, data1070_44, proto1040_43, buf1085_45, state1073_44, ws1084_45);
            return;
          }
        }
        throw new Error('Invalid protocol or authentication failed');
      }
    }
  })).catch(node366_15 => {
    val163_6();
  });
  return new Response(null, {
    status: 101,
    webSocket: op162_6
  });
}
let arr237_9 = 'cloudflare-ech.com';
async function fn478_19(arr45_1, Host, aux959_39, net1011_42, arr1389_57, val1099_45, buf1061_44, remote1069_44 = '', val1075_44 = '', net1083_45 = null, mgr1072_44 = null, srv1082_45 = null) {
  const ws1036_43 = remote1069_44 || aux407_16;
  const link1039_43 = val1075_44 || mgr232_9;
  const hdr1041_43 = net1083_45 !== null ? net1083_45 : map332_13;
  const buf1037_43 = mgr1072_44 || aux887_36;
  const node1038_43 = mgr1072_44 ? true : hdr993_41;
  const aux1367_56 = Host ? srv434_18.some(state1121_46 => {
    const Target = String(Host).toLowerCase();
    return Target === state1121_46 || Target.endsWith('.' + state1121_46);
  }) : false;
  const op306_12 = net1227_51(net1011_42);
  async function state185_7(srv26_1, tmp936_38, map1340_55 = false) {
    const ws1060_44 = map1340_55 ? await aux191_7(arr45_1, srv26_1, tmp936_38, buf1037_43, srv1082_45, op306_12) : await op186_7(srv26_1, tmp936_38, srv1082_45, data182_7);
    const mgr1384_57 = ws1060_44.writable.getWriter();
    if (!map1340_55 && op306_12.byteLength)
      await mgr1384_57.write(op306_12);
    return {
      remoteSock: ws1060_44,
      writer: mgr1384_57
    };
  }
  function state161_6(net1059_44, util1383_57) {
    if (buf1061_44.socket !== net1059_44)
      return;
    try {
      util1383_57?.releaseLock();
    } catch (link559_23) {
    }
    buf1061_44.socket = null;
    buf1061_44.writer = null;
  }
  function val67_2(srv1058_44, data1382_57, proto1112_46) {
    try {
      if (buf1061_44.writer && buf1061_44.writer !== data1382_57) {
        buf1061_44.writer.releaseLock();
      }
    } catch (node558_23) {
    }
    buf1061_44.socket = srv1058_44;
    buf1061_44.writer = data1382_57;
    buf1061_44.drainUpload?.();
    srv1058_44.closed.catch(() => {
    }).finally(() => {
      if (buf1061_44.socket === srv1058_44)
        net1131_47(arr1389_57);
    });
    fn190_7(srv1058_44, arr1389_57, val1099_45, proto1112_46).finally(() => {
      if (buf1061_44.socket === srv1058_44) {
        try {
          data1382_57.releaseLock();
        } catch (buf557_23) {
        }
        buf1061_44.writer = null;
      }
    });
  }
  async function node1110_46() {
    if (util999_41 && node1038_43) {
      net1131_47(arr1389_57);
      return;
    }
    if (!(data326_13 && node1038_43)) {
      let req82_3, mgr88_3;
      if (!(ws1036_43 && ws1036_43.trim())) {
        const buf77_3 = await data446_18(link1039_43, hdr1041_43);
        req82_3 = buf77_3 ? buf77_3.domain : Host;
        mgr88_3 = buf77_3 ? buf77_3.port : aux959_39;
      } else {
        const arr885_36 = req874_36(ws1036_43);
        req82_3 = arr885_36.address;
        mgr88_3 = arr885_36.port || aux959_39;
      }
      try {
        const {
          remoteSock: srv410_17,
          writer: buf413_17
        } = await state185_7(req82_3, mgr88_3, node1038_43);
        val67_2(srv410_17, buf413_17, null);
      } catch (tmp408_16) {
        net1131_47(arr1389_57);
      }
    } else {
      try {
        const {
          remoteSock: mgr1000_41,
          writer: state1001_41
        } = await state185_7(Host, aux959_39, true);
        val67_2(mgr1000_41, state1001_41, null);
        return;
      } catch (req994_41) {
        let res83_3, state89_3;
        if (!(ws1036_43 && ws1036_43.trim())) {
          const node78_3 = await data446_18(link1039_43, hdr1041_43);
          res83_3 = node78_3 ? node78_3.domain : Host;
          state89_3 = node78_3 ? node78_3.port : aux959_39;
        } else {
          const fn886_36 = req874_36(ws1036_43);
          res83_3 = fn886_36.address;
          state89_3 = fn886_36.port || aux959_39;
        }
        try {
          const {
            remoteSock: net411_17,
            writer: node414_17
          } = await state185_7(res83_3, state89_3, false);
          val67_2(net411_17, node414_17, null);
        } catch (cfg409_17) {
          net1131_47(arr1389_57);
        }
      }
    }
  }
  try {
    const val427_17 = aux1367_56 ? node1038_43 : util999_41 && node1038_43 ? true : data326_13 ? false : node1038_43;
    const {
      remoteSock: val283_11,
      writer: hdr1065_44
    } = await state185_7(Host, aux959_39, val427_17);
    val67_2(val283_11, hdr1065_44, () => {
      state161_6(val283_11, hdr1065_44);
      node1110_46();
    });
  } catch (buf365_15) {
    await node1110_46();
  }
}
let state233_9 = '';
async function data470_19(Request) {
  try {
    const mgr1360_56 = new URL(Request.url);
    const fn1414_58 = mgr1360_56.searchParams.get('url');
    const util1359_56 = mgr1360_56.searchParams.get('port') || '443';
    if (!fn1414_58) {
      return new Response(JSON.stringify({
        success: false,
        data: [],
        error: '缺少 url 参数'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    new URL(fn1414_58);
    const arr1005_41 = await map1004_41([fn1414_58], util1359_56);
    let hdr969_40 = arr1005_41.length > 0 ? arr1005_41 : [];
    hdr969_40 = hdr969_40.map(ws1444_60 => ws1444_60.replace(/#(.+)$/, (val1435_59, Remark) => '#' + decodeURIComponent(Remark)));
    return new Response(JSON.stringify({
      success: true,
      data: hdr969_40
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (data1358_56) {
    return new Response(JSON.stringify({
      success: false,
      data: [],
      error: String(data1358_56 && data1358_56.message || data1358_56)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
let buf1181_49 = "https://url.v1.mk/sub";
function mgr64_2(op66_2) {
  const hdr57_2 = aux839_34(state233_9);
  if (hdr57_2)
    op66_2.set('alpn', hdr57_2);
}

async function res851_35(tmp_24, fn934_38, tmp1080_44 = null) {
  try {
    const node1158_48 = req850_35(tmp_24, fn934_38, tmp1080_44);
    if (node1158_48?.opened)
      await node1158_48.opened;
    return node1158_48;
  } catch (net363_15) {
    if (!tmp1080_44)
      throw net363_15;
    const buf1157_48 = Connect({
      hostname: tmp_24,
      port: fn934_38
    });
    if (buf1157_48?.opened)
      await buf1157_48.opened;
    return buf1157_48;
  }
}
let op330_13 = true; // preferred domain enabled (default on)
function remote421_17(Config) {
  const Snap = {
    ...node270_11,
    ...Config
  };
  [
    'ev',
    'et',
    'ex',
    'ech',
    'ena',
    'epd',
    'epi',
    'egi',
    'ipv4',
    'ipv6',
    'ispMobile',
    'ispUnicom',
    'ispTelecom'
  ].forEach(Key => {
    Snap[Key] = tmp840_34(Snap[Key], cli876_36(node270_11[Key]));
  });
  if (Snap.ev === 'no' && Snap.et === 'no' && Snap.ex === 'no') {
    Snap.ev = 'yes';
  }
  if (Snap.ech === 'yes') {
    Snap.dkby = 'yes';
  }
  return Snap;
}
let val331_13 = true;
async function cli684_28(buf773_32 = false) {
  if (!val643_26) {
    return;
  }
  if (!buf773_32 && state641_26 > 0 && Date.now() - state641_26 < util639_26) {
    return;
  }
  try {
    let ws772_32 = '';
    try {
      ws772_32 = await val643_26.get('c_ver') || '';
    } catch (remote565_23) {
    }
    if (!buf773_32 && ws772_32 && ws772_32 === op642_26 && mgr640_26 && Object.keys(mgr640_26).length > 0) {
      state641_26 = Date.now();
      return;
    }
    const mgr136_5 = await val643_26.get('c');
    if (mgr136_5) {
      mgr640_26 = JSON.parse(mgr136_5);
    }
    op642_26 = ws772_32;
    state641_26 = Date.now();
  } catch (op378_15) {
    if (!mgr640_26)
      mgr640_26 = {};
  }
}
let arr333_13 = true;
function mgr448_18(Key, DefaultVal = '', ws412_17 = undefined) {
  const Val = state449_18(Key, ws412_17 !== undefined ? ws412_17 : DefaultVal);
  return Val === undefined || Val === null ? DefaultVal : String(Val);
}
let mgr328_13 = false; // native addresses off by default
function map1244_51() {
  const cli324_13 = remote325_13();
  const aux791_32 = cli324_13.wk;
  if (!(aux791_32 && aux791_32.trim())) {
    const remote685_28 = cli324_13.p;
    if (!(remote685_28 && remote685_28.trim())) {
      map788_32 = '';
      mgr232_9 = '';
    } else {
      mgr232_9 = 'CUSTOM';
    }
  } else {
    map788_32 = aux791_32.trim().toUpperCase();
    mgr232_9 = map788_32;
  }
  map332_13 = !(cli324_13.rm && cli324_13.rm.toLowerCase() === 'no');
  state329_13 = cli324_13.ev === 'yes';
  fn334_13 = cli324_13.et === 'yes';
  aux335_13 = cli324_13.ex === 'yes';
  link1231_51 = cli324_13.tp || '';
  buf1181_49 = cli324_13.scu || node270_11.scu;
  op330_13 = cli324_13.epd === 'yes';
  val331_13 = cli324_13.epi === 'yes';
  arr333_13 = cli324_13.egi === 'yes';
  mgr328_13 = cli324_13.ena === 'yes';
  util327_13 = cli324_13.ech === 'yes';
  val235_9 = cli324_13.customDNS || node270_11.customDNS;
  arr237_9 = cli324_13.customECHDomain || node270_11.customECHDomain;
  state233_9 = aux839_34(cli324_13.alpn || '');
  mgr280_11 = cli324_13.dkby === 'yes' || util327_13;
  const link271_11 = (cli324_13.qj || '').toLowerCase();
  data326_13 = link271_11 === 'no';
  util999_41 = link271_11 === 'only';
  fn238_9 = cli324_13.d || '';
  link967_40 = cli324_13.yxURL || '';
  aux407_16 = cli324_13.p ? cli324_13.p.trim() : '';
  hdr1161_48 = cli324_13.s || '';
  if (!!hdr1161_48) {
    try {
      aux887_36 = mgr880_36(hdr1161_48);
      hdr993_41 = true;
    } catch (srv362_15) {
      hdr993_41 = false;
    }
  } else {
    aux887_36 = {};
    hdr993_41 = false;
  }
  state281_11 = !!(cli324_13.yxby && cli324_13.yxby.toLowerCase() === 'yes');
}

function req874_36(val571_23) {
  if (val571_23.includes('[') && val571_23.includes(']')) {
    const net771_32 = val571_23.match(/^\[([^\]]+)\](?::(\d+))?$/);
    if (net771_32) {
      return {
        address: net771_32[1],
        port: net771_32[2] ? parseInt(net771_32[2], 10) : null
      };
    }
  }
  const fn1318_54 = val571_23.lastIndexOf(':');
  if (fn1318_54 > 0) {
    const ws28_1 = val571_23.substring(0, fn1318_54);
    const srv962_40 = val571_23.substring(fn1318_54 + 1);
    const mgr952_39 = parseInt(srv962_40, 10);
    if (!ws28_1.includes(':') && !isNaN(mgr952_39) && mgr952_39 > 0 && mgr952_39 <= 65535) {
      return {
        address: ws28_1,
        port: mgr952_39
      };
    }
  }
  return {
    address: val571_23,
    port: null
  };
}
let val643_26 = null;
function res827_34(aux623_25) {
  const ws508_21 = srv842_35(aux623_25?.ip || aux623_25?.domain || '');
  if (ws508_21 && ws508_21.includes(':') && /^[0-9a-fA-F:.]+$/.test(ws508_21))
    return 'IPv6优选';
  if (ws508_21 && !val595_24(ws508_21))
    return '优选域名';
  const proto776_32 = mgr784_32(aux623_25?.isp || aux623_25?.name || '', 'IPv4优选');
  const ws172_7 = mgr784_32(aux623_25?.colo || '', '');
  return ws172_7 ? `${ proto776_32 }-${ ws172_7 }` : proto776_32;
}
let mgr640_26 = {};
function srv842_35(buf509_21) {
  return String(buf509_21 || '').trim().replace(/^\[([^\]]+)\]$/, '$1');
}
let state641_26 = 0;
function fn454_18(cli1044_43) {
  const op1314_54 = arr453_18(cli1044_43);
  const state1313_54 = [
    'US',
    'SG',
    'JP',
    'KR',
    'DE',
    'SE',
    'NL',
    'FI',
    'GB'
  ];
  return [
    cli1044_43,
    ...op1314_54,
    ...state1313_54.filter(arr1029_42 => arr1029_42 !== cli1044_43 && !op1314_54.includes(arr1029_42))
  ];
}
const util639_26 = 30 * 1000; // 30second cache (skip version check within a short window)
function req178_7(link487_20, cfg97_4) {
  const map500_20 = net1227_51(link487_20);
  const ws76_3 = net1227_51(cfg97_4);
  const util855_35 = new Uint8Array(map500_20.byteLength + ws76_3.byteLength);
  util855_35.set(map500_20);
  util855_35.set(ws76_3, map500_20.byteLength);
  return util855_35;
}
let op642_26 = '';
async function op882_36(node102_4, fn718_29) {
  const op114_4 = net1227_51(node102_4);
  const remote901_37 = link1231_51 || fn718_29;
  const res1355_56 = await data878_36(remote901_37);
  if (op114_4.byteLength < 56) {
    return {
      hasError: true,
      message: 'invalid ' + 'trojan' + ' data - too short'
    };
  }
  let arr1317_54 = 56;
  if (op114_4[56] !== 13 || op114_4[57] !== 10) {
    return {
      hasError: true,
      message: 'invalid ' + 'trojan' + ' header format (missing CR LF)'
    };
  }
  const hdr897_37 = remote1141_47.decode(op114_4.subarray(0, arr1317_54));
  if (hdr897_37 !== res1355_56) {
    return {
      hasError: true,
      message: 'invalid ' + 'trojan' + ' password'
    };
  }
  const proto1160_48 = op114_4.subarray(arr1317_54 + 2);
  if (proto1160_48.byteLength < 6) {
    return {
      hasError: true,
      message: 'invalid SOCKS5 request data'
    };
  }
  const val1363_56 = new DataView(proto1160_48.buffer, proto1160_48.byteOffset, proto1160_48.byteLength);
  const arr165_6 = val1363_56.getUint8(0);
  if (arr165_6 !== 1) {
    return {
      hasError: true,
      message: 'unsupported command, only TCP (CONNECT) is allowed'
    };
  }
  const arr717_29 = val1363_56.getUint8(1);
  let cli36_1 = 0;
  let req34_1 = 2;
  let state_17 = '';
  switch (arr717_29) {
  case 1:
    cli36_1 = 4;
    state_17 = proto1160_48.subarray(req34_1, req34_1 + cli36_1).join('.');
    break;
  case 3:
    cli36_1 = proto1160_48[req34_1];
    req34_1 += 1;
    state_17 = remote1141_47.decode(proto1160_48.subarray(req34_1, req34_1 + cli36_1));
    break;
  case 4:
    cli36_1 = 16;
    const DataView = new DataView(proto1160_48.buffer, proto1160_48.byteOffset + req34_1, cli36_1);
    const cfg1321_55 = [];
    for (let req538_22 = 0; req538_22 < 8; req538_22++) {
      cfg1321_55.push(DataView.getUint16(req538_22 * 2).toString(16));
    }
    state_17 = cfg1321_55.join(':');
    break;
  default:
    return {
      hasError: true,
      message: `invalid addressType is ${ arr717_29 }`
    };
  }
  if (!state_17) {
    return {
      hasError: true,
      message: `address is empty, addressType is ${ arr717_29 }`
    };
  }
  const arr957_39 = req34_1 + cli36_1;
  const cfg961_40 = new DataView(proto1160_48.buffer, proto1160_48.byteOffset + arr957_39, 2).getUint16(0);
  return {
    hasError: false,
    addressRemote: state_17,
    addressType: arr717_29,
    port: cfg961_40,
    hostname: state_17,
    rawClientData: proto1160_48.subarray(arr957_39 + 4)
  };
}
const node270_11 = {
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
  subCustomIPs: 'https://bestcf.pages.dev/random-region/HK/100.txt\nhttps://bestcf.pages.dev/random-region/TW/100.txt\nhttps://bestcf.pages.dev/random-region/JP/100.txt\nhttps://bestcf.pages.dev/random-region/SG/100.txt\nhttps://bestcf.pages.dev/random-region/US/100.txt\nhttps://bestcf.pages.dev/random-region/KR/100.txt\nhttps://bestcf.pages.dev/random-region/DE/100.txt\nhttps://bestcf.pages.dev/random-region/SE/100.txt\nhttps://bestcf.pages.dev/random-region/NL/100.txt\nhttps://bestcf.pages.dev/random-region/FI/100.txt\nhttps://bestcf.pages.dev/random-region/GB/100.txt\nbestcf.030101.xyz#Mingyu维护\ncdn.2020111.xyz\ncdns.doon.eu.org\ncf.0sm.com\ncf.877771.xyz\ncf.877774.xyz#秋名山维护\ncf.900501.xyz\ncfip.1323123.xyz\ncfip.cfcdn.vip\ncfip.xxxxxxxx.tk#OTC维护\ncloudflare.182682.xyz#WeTest.Vip维护\ncloudflare-dl.byoip.top\ncloudflare-ip.mofashi.ltd\nfn.130519.xyz\nfreeyx.cloudflare88.eu.org\nnrt.xxxxxxxx.nyc.mn\nnrtcfdns.zone.id\nsaas.sin.fan\ntencentapp.cn#ktff维护\nxn--b6gac.eu.org\n777.ai7777777.xyz',     // custompreferred（每行一个，support domain/IPv4/IPv6/sub://preferredAPI）
  subGenerator: '',     // preferred-sub generator domain
  subName: 'CFBox',     // subscription name
  subUpdateTime: 3      // subscription update interval (hours)
};
function state257_10(req1354_56) {
  if (!req1354_56)
    return { error: null };
  try {
    req1354_56 = req1354_56.replace(/-/g, '+').replace(/_/g, '/');
    return {
      earlyData: Uint8Array.from(atob(req1354_56), srv122_5 => srv122_5.charCodeAt(0)).buffer,
      error: null
    };
  } catch (req346_14) {
    return { error: req346_14 };
  }
}

async function data446_18(link1375_57 = '', fn1342_55 = map332_13) {
  if (!link1375_57 || link1375_57 === 'CF') {
    return op450_18();
  }
  if (cli84_3.length === 0) {
    return op450_18();
  }
  const cfg73_3 = cli84_3.map(node30_1 => ({
    ...node30_1,
    available: true
  }));
  if (fn1342_55 && link1375_57) {
    const link55_2 = map452_18(link1375_57, cfg73_3, fn1342_55);
    if (link55_2.length > 0) {
      const link1135_47 = link55_2[0];
      return link1135_47;
    }
  }
  const node1134_47 = cfg73_3[0];
  return node1134_47;
}

function res875_36(Array) {
  if (!Array || Array.length === 0)
    return '';
  return Array.map(ws628_26 => {
    const data926_38 = ws628_26.port || 443;
    return `${ ws628_26.ip }:${ data926_38 }#${ ws628_26.name }`;
  }).join(',');
}

async function ws1132_47() {
  if (!val643_26) {
    return;
  }
  try {
    const cli180_7 = JSON.stringify(mgr640_26);
    await val643_26.put('c', cli180_7);
    const buf821_34 = String(Date.now());
    op642_26 = buf821_34;
    try {
      await val643_26.put('c_ver', buf821_34);
    } catch (cli564_23) {
    }
    state641_26 = Date.now();
  } catch (state377_15) {
    throw state377_15;
  }
}

async function tmp456_18(req1090_45, node342_14 = {}) {
  if (req1090_45.method === 'GET') {
    if (!val643_26) {
      return new Response(JSON.stringify({
        error: 'KV存储未配置\uFF0C当前为只读模式',
        kvEnabled: false,
        ...remote325_13(node342_14)
      }), { headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({
      ...remote325_13(node342_14),
      kvEnabled: true
    }), { headers: { 'Content-Type': 'application/json' } });
  } else if (req1090_45.method === 'POST') {
    if (!val643_26) {
      return new Response(JSON.stringify({
        success: false,
        message: 'KV存储未配置\uFF0C无法保存配置'
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    try {
      const ws820_34 = await req1090_45.json();
      for (const [arr645_26, node1278_53] of Object.entries(ws820_34)) {
        if (!!(node1278_53 === '' || node1278_53 === null || node1278_53 === undefined)) {
          delete mgr640_26[arr645_26];
        } else {
          mgr640_26[arr645_26] = node1278_53;
        }
      }
      await ws1132_47();
      map1244_51();
      if (ws820_34.yx !== undefined) {
        arr1245_51();
      }
      return new Response(JSON.stringify({
        success: true,
        message: '配置已保存',
        config: remote325_13(node342_14)
      }), { headers: { 'Content-Type': 'application/json' } });
    } catch (res371_15) {
      return new Response(JSON.stringify({
        success: false,
        message: '保存配置失败: ' + res371_15.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}

async function data110_4(Request, ws796_33) {
  const state833_34 = [];
  if (ws796_33 === 'random') {
    const Count = parseInt(mgr448_18('subRandomCount', 16)) || 16;
    const FixedPort = parseInt(mgr448_18('subPort', -1));
    return await link439_18(Request, Math.min(Math.max(Count, 1), 99), Number.isFinite(FixedPort) ? FixedPort : -1);
  }
  if (ws796_33 === 'custom') {
    const op234_9 = mgr448_18('subCustomIPs', '');
    const Lines = String(op234_9 || '').split(/\r?\n/).map(Row => Row.trim()).filter(Row => Row);
    const proto968_40 = Lines.filter(Row => {
      const XX = Row.toLowerCase();
      return XX.startsWith('sub://') || XX.startsWith('https://');
    });
    const cfg_1 = proto968_40.length > 0 ? await map1004_41(proto968_40, '443') : [];
    for (const ItemX14 of cfg_1) {
      const XXX6 = ItemX14.split('#');
      const Addr = XXX6[0];
      const Remark = XXX6.slice(1).join('#') || '优选API';
      const PortParse = util879_36(Addr);
      if (!PortParse.ip)
        continue;
      state833_34.push({
        ip: PortParse.ip,
        port: PortParse.port,
        isp: Remark
      });
    }
    for (const Row of Lines) {
      const aux1415_58 = Row.toLowerCase();
      if (aux1415_58.startsWith('sub://') || aux1415_58.startsWith('https://') || aux1415_58.includes('://'))
        continue;
      let hdr513_21 = Row;
      if (hdr513_21.includes('*'))
        hdr513_21 = res1067_44(hdr513_21);
      const tmp1056_43 = hdr513_21.indexOf('#');
      const Addr = tmp1056_43 > -1 ? hdr513_21.slice(0, tmp1056_43) : hdr513_21;
      const Remark = tmp1056_43 > -1 ? hdr513_21.slice(tmp1056_43 + 1) : '';
      const PortParse = util879_36(Addr);
      if (!PortParse.ip)
        continue;
      state833_34.push({
        ip: PortParse.ip,
        port: PortParse.port,
        isp: Remark || PortParse.ip
      });
    }
    return state833_34;
  }
  if (ws796_33 === 'generator') {
    const req442_18 = mgr448_18('subGenerator', '').trim();
    if (!req442_18)
      return [];
    const res971_40 = await hdr417_17(req442_18);
    for (const ItemX14 of res971_40) {
      const state1433_59 = ItemX14.split('#');
      const Addr = state1433_59[0];
      const Remark = state1433_59.slice(1).join('#') || '优选订阅生成器';
      const tmp960_39 = util879_36(Addr);
      if (!tmp960_39.ip)
        continue;
      state833_34.push({
        ip: tmp960_39.ip,
        port: tmp960_39.port,
        isp: Remark
      });
    }
    return state833_34;
  }
  return state833_34;
}

function buf437_18(link679_28) {
  const val835_34 = link679_28.map(state881_36).filter(fn214_8 => fn214_8 && fn214_8.proto === 'trojan');
  const tmp288_11 = val235_9 || '223.5.5.5';
  const op810_33 = val835_34.map(arr213_8 => arr213_8.name);
  const mgr664_27 = [
    '[General]',
    'loglevel = notify',
    'internet-test-url = http://www.apple.com/library/test/success.html',
    'proxy-test-url = http://www.gstatic.com/generate_204',
    'test-timeout = 3',
    `dns-server = ${ tmp288_11.replace(/^https?:\/\//, '').replace(/\/.*$/, '') }, 119.29.29.29, system`,
    'encrypted-dns-server = https://223.5.5.5/dns-query, https://1.12.12.12/dns-query',
    'ipv6 = true',
    'allow-wifi-access = false',
    'wifi-access-http-port = 6152',
    'wifi-access-socks5-port = 6153',
    'skip-proxy = 127.0.0.1, 192.168.0.0/16, 10.0.0.0/8, 172.16.0.0/12, localhost, *.local, captive.apple.com',
    'exclude-simple-hostnames = true',
    'show-error-page-for-reject = true',
    '',
    '[Proxy]'
  ];
  for (const map212_8 of val835_34) {
    const req1138_47 = map212_8.sni;
    mgr664_27.push(`${ map212_8.name } = ${ 'trojan' }, ${ map212_8.server }, ${ map212_8.port }, password=${ map212_8.password }, sni=${ req1138_47 }, ws=true, ws-path=${ map212_8.path }, ws-headers=Host:${ map212_8.host }, skip-cert-verify=false, tfo=true`);
  }
  if (!val835_34.length) {
    mgr664_27.push('Direct = direct');
  }
  mgr664_27.push('');
  mgr664_27.push('[Proxy Group]');
  const cli636_26 = op810_33.length ? op810_33.join(', ') : 'DIRECT';
  mgr664_27.push(`🚀 节点选择 = select, 🎯 全球直连, ${ cli636_26 }`);
  mgr664_27.push(`🌍 国外媒体 = select, ${ req922_38(op810_33) }`);
  mgr664_27.push(`📺 哔哩哔哩 = select, ${ req922_38(op810_33, { directFirst: true }) }`);
  mgr664_27.push(`📹 油管视频 = select, ${ req922_38(op810_33, { extraGroups: ['\uD83C\uDF0D 国外媒体'] }) }`);
  mgr664_27.push(`🎬 奈飞视频 = select, ${ req922_38(op810_33, { extraGroups: ['\uD83C\uDF0D 国外媒体'] }) }`);
  mgr664_27.push(`📲 电报信息 = select, ${ req922_38(op810_33) }`);
  mgr664_27.push(`🌐 谷歌服务 = select, ${ req922_38(op810_33) }`);
  mgr664_27.push(`🤖 OpenAI = select, ${ req922_38(op810_33) }`);
  mgr664_27.push(`Ⓜ️ 微软服务 = select, ${ req922_38(op810_33, { directFirst: true }) }`);
  mgr664_27.push(`🍎 苹果服务 = select, ${ req922_38(op810_33, { directFirst: true }) }`);
  mgr664_27.push(`🎯 全球直连 = select, DIRECT`);
  mgr664_27.push(`🛑 全球拦截 = select, REJECT, DIRECT`);
  mgr664_27.push(`🐟 漏网之鱼 = select, ${ req922_38(op810_33) }`);
  mgr664_27.push('');
  mgr664_27.push('[Rule]');
  mgr664_27.push(`RULE-SET,${ map1124_46('LocalAreaNetwork') },🎯 全球直连`);
  mgr664_27.push(`RULE-SET,${ map1124_46('UnBan') },🎯 全球直连`);
  mgr664_27.push(`RULE-SET,${ map1124_46('BanAD') },🛑 全球拦截`);
  mgr664_27.push(`RULE-SET,${ map1124_46('BanProgramAD') },🛑 全球拦截`);
  mgr664_27.push(`RULE-SET,${ map1124_46('GoogleFCM') },🌐 谷歌服务`);
  mgr664_27.push(`RULE-SET,${ map1124_46('GoogleCN') },🎯 全球直连`);
  mgr664_27.push(`RULE-SET,${ map1124_46('SteamCN') },🎯 全球直连`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Microsoft') },Ⓜ️ 微软服务`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Apple') },🍎 苹果服务`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Telegram') },📲 电报信息`);
  mgr664_27.push(`RULE-SET,${ map1124_46('OpenAi') },🤖 OpenAI`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Claude') },🤖 OpenAI`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Copilot') },🤖 OpenAI`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Netflix') },🌍 国外媒体`);
  mgr664_27.push(`RULE-SET,${ map1124_46('YouTube') },🌍 国外媒体`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Disney') },🌍 国外媒体`);
  mgr664_27.push(`RULE-SET,${ map1124_46('Spotify') },🌍 国外媒体`);
  mgr664_27.push(`RULE-SET,${ map1124_46('TikTok') },🌍 国外媒体`);
  mgr664_27.push(`RULE-SET,${ map1124_46('BiliBili') },📺 哔哩哔哩`);
  mgr664_27.push(`RULE-SET,${ map1124_46('ProxyMedia') },🌍 国外媒体`);
  mgr664_27.push(`RULE-SET,${ map1124_46('ProxyGFWlist') },🚀 节点选择`);
  mgr664_27.push(`RULE-SET,${ map1124_46('ChinaDomain') },🎯 全球直连`);
  mgr664_27.push(`RULE-SET,${ map1124_46('ChinaCompanyIp') },🎯 全球直连`);
  mgr664_27.push(`RULE-SET,${ map1124_46('ChinaIp') },🎯 全球直连`);
  mgr664_27.push('GEOIP,CN,\uD83C\uDFAF 全球直连');
  mgr664_27.push('FINAL,\uD83D\uDC1F 漏网之鱼,dns-failed');
  return mgr664_27.join('\n');
}

function map596_24(link295_12) {
  const hdr297_12 = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;
  return hdr297_12.test(link295_12);
}

function srv794_33(map116_4, link847_35, buf1229_51) {
  const cfg529_22 = buf1277_53(buf1229_51);
  return !!cfg529_22 && map116_4[link847_35] === cfg529_22[0] && map116_4[link847_35 + 1] === cfg529_22[1] && map116_4[link847_35 + 2] === cfg529_22[2] && map116_4[link847_35 + 3] === cfg529_22[3] && map116_4[link847_35 + 4] === cfg529_22[4] && map116_4[link847_35 + 5] === cfg529_22[5] && map116_4[link847_35 + 6] === cfg529_22[6] && map116_4[link847_35 + 7] === cfg529_22[7] && map116_4[link847_35 + 8] === cfg529_22[8] && map116_4[link847_35 + 9] === cfg529_22[9] && map116_4[link847_35 + 10] === cfg529_22[10] && map116_4[link847_35 + 11] === cfg529_22[11] && map116_4[link847_35 + 12] === cfg529_22[12] && map116_4[link847_35 + 13] === cfg529_22[13] && map116_4[link847_35 + 14] === cfg529_22[14] && map116_4[link847_35 + 15] === cfg529_22[15];
}
// official direct address pool: built-in verified addresses, no third-party dependency
// CF uses anycast; the same address lands on different PoPs by location, so no region split
async function data878_36(srv1202_50) {
  const tmp336_13 = new TextEncoder();
  const proto248_10 = tmp336_13.encode(srv1202_50);
  const map716_29 = [
    1116352408,
    1899447441,
    3049323471,
    3921009573,
    961987163,
    1508970993,
    2453635748,
    2870763221,
    3624381080,
    310598401,
    607225278,
    1426881987,
    1925078388,
    2162078206,
    2614888103,
    3248222580,
    3835390401,
    4022224774,
    264347078,
    604807628,
    770255983,
    1249150122,
    1555081692,
    1996064986,
    2554220882,
    2821834349,
    2952996808,
    3210313671,
    3336571891,
    3584528711,
    113926993,
    338241895,
    666307205,
    773529912,
    1294757372,
    1396182291,
    1695183700,
    1986661051,
    2177026350,
    2456956037,
    2730485921,
    2820302411,
    3259730800,
    3345764771,
    3516065817,
    3600352804,
    4094571909,
    275423344,
    430227734,
    506948616,
    659060556,
    883997877,
    958139571,
    1322822218,
    1537002063,
    1747873779,
    1955562222,
    2024104815,
    2227730452,
    2361852424,
    2428436474,
    2756734187,
    3204031479,
    3329325298
  ];
  let hdr489_20 = [
    3238371032,
    914150663,
    812702999,
    4144912697,
    4290775857,
    1750603025,
    1694076839,
    3204075428
  ];
  const node798_33 = proto248_10.length;
  const mgr1336_55 = node798_33 * 8;
  const util1335_55 = Math.ceil((node798_33 + 9) / 64) * 64;
  const val715_29 = new Uint8Array(util1335_55);
  val715_29.set(proto248_10);
  val715_29[node798_33] = 128;
  const op1362_56 = new DataView(val715_29.buffer);
  op1362_56.setUint32(util1335_55 - 4, mgr1336_55, false);
  for (let val139_5 = 0; val139_5 < util1335_55; val139_5 += 64) {
    const state1385_57 = new Uint32Array(64);
    for (let hdr537_22 = 0; hdr537_22 < 16; hdr537_22++) {
      state1385_57[hdr537_22] = op1362_56.getUint32(val139_5 + hdr537_22 * 4, false);
    }
    for (let proto536_22 = 16; proto536_22 < 64; proto536_22++) {
      const proto1280_53 = arr477_19(state1385_57[proto536_22 - 15], 7) ^ arr477_19(state1385_57[proto536_22 - 15], 18) ^ state1385_57[proto536_22 - 15] >>> 3;
      const res1283_53 = arr477_19(state1385_57[proto536_22 - 2], 17) ^ arr477_19(state1385_57[proto536_22 - 2], 19) ^ state1385_57[proto536_22 - 2] >>> 10;
      state1385_57[proto536_22] = state1385_57[proto536_22 - 16] + proto1280_53 + state1385_57[proto536_22 - 7] + res1283_53 >>> 0;
    }
    let [req_10, net75_3, net123_5, ws244_10, val403_16, tmp432_17, op714_29, op498_20] = hdr489_20;
    for (let link535_22 = 0; link535_22 < 64; link535_22++) {
      const req1282_53 = arr477_19(val403_16, 6) ^ arr477_19(val403_16, 11) ^ arr477_19(val403_16, 25);
      const state713_29 = val403_16 & tmp432_17 ^ ~val403_16 & op714_29;
      const hdr1281_53 = op498_20 + req1282_53 + state713_29 + map716_29[link535_22] + state1385_57[link535_22] >>> 0;
      const link1279_53 = arr477_19(req_10, 2) ^ arr477_19(req_10, 13) ^ arr477_19(req_10, 22);
      const mgr712_29 = req_10 & net75_3 ^ req_10 & net123_5 ^ net75_3 & net123_5;
      const state1289_53 = link1279_53 + mgr712_29 >>> 0;
      op498_20 = op714_29;
      op714_29 = tmp432_17;
      tmp432_17 = val403_16;
      val403_16 = ws244_10 + hdr1281_53 >>> 0;
      ws244_10 = net123_5;
      net123_5 = net75_3;
      net75_3 = req_10;
      req_10 = hdr1281_53 + state1289_53 >>> 0;
    }
    hdr489_20[0] = hdr489_20[0] + req_10 >>> 0;
    hdr489_20[1] = hdr489_20[1] + net75_3 >>> 0;
    hdr489_20[2] = hdr489_20[2] + net123_5 >>> 0;
    hdr489_20[3] = hdr489_20[3] + ws244_10 >>> 0;
    hdr489_20[4] = hdr489_20[4] + val403_16 >>> 0;
    hdr489_20[5] = hdr489_20[5] + tmp432_17 >>> 0;
    hdr489_20[6] = hdr489_20[6] + op714_29 >>> 0;
    hdr489_20[7] = hdr489_20[7] + op498_20 >>> 0;
  }
  const req1018_42 = [];
  for (let node534_22 = 0; node534_22 < 7; node534_22++) {
    req1018_42.push((hdr489_20[node534_22] >>> 24 & 255).toString(16).padStart(2, '0'), (hdr489_20[node534_22] >>> 16 & 255).toString(16).padStart(2, '0'), (hdr489_20[node534_22] >>> 8 & 255).toString(16).padStart(2, '0'), (hdr489_20[node534_22] & 255).toString(16).padStart(2, '0'));
  }
  return req1018_42.join('');
}
const node846_35 = "172.71.218.190,162.158.228.87,162.158.189.134,162.158.26.63,162.158.25.86,162.158.29.216,162.158.218.160,162.158.227.214,172.69.118.198,172.69.119.150".split(',');
function req226_9(map1388_57) {
  const map740_30 = remote301_12;
  const req1186_49 = util303_12;
  const arr1293_53 = Math.max(4096, req1186_49 << 3);
  let val739_30 = new Uint8Array(map740_30);
  let fn118_4 = 0;
  let arr1221_50 = 0;
  let map1292_53 = false;
  let op738_30 = 0;
  let tmp648_26 = 0;
  let val1291_53 = 0;
  function aux431_17() {
    if (arr1221_50)
      clearTimeout(arr1221_50);
    arr1221_50 = 0;
    map1292_53 = false;
    if (!fn118_4)
      return;
    if (map1388_57.readyState === 1)
      map1388_57.send(val739_30.subarray(0, fn118_4).slice());
    val739_30 = new Uint8Array(map740_30);
    fn118_4 = 0;
    val1291_53 = 0;
  }
  function srv458_19() {
    if (arr1221_50 || map1292_53)
      return;
    map1292_53 = true;
    tmp648_26 = op738_30;
    queueMicrotask(() => {
      map1292_53 = false;
      if (!fn118_4 || arr1221_50)
        return;
      if (map740_30 - fn118_4 < req1186_49)
        return aux431_17();
      arr1221_50 = setTimeout(() => {
        arr1221_50 = 0;
        if (!fn118_4)
          return;
        if (map740_30 - fn118_4 < req1186_49)
          return aux431_17();
        if (val1291_53 < 2 && (op738_30 !== tmp648_26 || fn118_4 < arr1293_53)) {
          val1291_53++;
          tmp648_26 = op738_30;
          return srv458_19();
        }
        aux431_17();
      }, Math.max(cli300_12, 1));
    });
  }
  return {
    send(fn142_5) {
      const hdr249_10 = net1227_51(fn142_5);
      let proto848_35 = 0;
      const state737_30 = hdr249_10.byteLength;
      if (!state737_30)
        return;
      while (proto848_35 < state737_30) {
        if (!fn118_4 && state737_30 - proto848_35 >= map740_30) {
          const state1145_47 = Math.min(map740_30, state737_30 - proto848_35);
          if (map1388_57.readyState === 1)
            map1388_57.send(proto848_35 || state1145_47 !== state737_30 ? hdr249_10.subarray(proto848_35, proto848_35 + state1145_47) : hdr249_10);
          proto848_35 += state1145_47;
          continue;
        }
        const mgr1144_47 = Math.min(map740_30 - fn118_4, state737_30 - proto848_35);
        val739_30.set(hdr249_10.subarray(proto848_35, proto848_35 + mgr1144_47), fn118_4);
        fn118_4 += mgr1144_47;
        proto848_35 += mgr1144_47;
        op738_30++;
        if (!!(fn118_4 === map740_30 || map740_30 - fn118_4 < req1186_49)) {
          aux431_17();
        } else {
          srv458_19();
        }
      }
    },
    flush: aux431_17
  };
}
let cli84_3 = [{
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
async function req466_19() {
  const req1162_48 = 'https://fiber.google.com/speedtest/';
  const cli1428_59 = Date.now();
  const net1419_59 = new AbortController();
  const op1218_50 = setTimeout(() => net1419_59.abort(), 10000);
  try {
    const Resp = await fetch(req1162_48, {
      method: 'GET',
      redirect: 'follow',
      signal: net1419_59.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': '*/*'
      }
    });
    const mgr424_17 = Date.now() - cli1428_59;
    let mgr1408_58 = 0;
    let mgr304_12 = 0;
    try {
      if (Resp.body) {
        const tmp1032_42 = Resp.body.getReader();
        const data302_12 = Date.now();
        for (;;) {
          const node150_6 = await tmp1032_42.read();
          if (node150_6.done)
            break;
          mgr1408_58 += node150_6.value ? node150_6.value.length : 0;
          if (Date.now() - data302_12 > 6000)
            break;
        }
        const util1431_59 = Date.now() - data302_12 || 1;
        mgr304_12 = Math.round(mgr1408_58 / util1431_59 * 1000);
      }
    } catch (link1015_42) {
    }
    clearTimeout(op1218_50);
    return new Response(JSON.stringify({
      success: true,
      Addr: req1162_48,
      StatusX10: Resp.status,
      Delay: mgr424_17,
      mgr1408_58,
      XXX6: mgr304_12,
      Err: ''
    }), { headers: { 'Content-Type': 'application/json' } });
  } catch (Err) {
    clearTimeout(op1218_50);
    const req586_24 = Err && Err.name === 'AbortError';
    return new Response(JSON.stringify({
      success: true,
      Addr: req1162_48,
      StatusX10: 0,
      Delay: Date.now() - cli1428_59,
      XByte: 0,
      XXX6: 0,
      Err: req586_24 ? 'timeout' : 'error'
    }), { headers: { 'Content-Type': 'application/json' } });
  }
}
const remote277_11 = [{
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
async function aux1031_42(cli708_29, net1275_53) {
  const cfg1033_43 = cli708_29.getReader({ mode: 'byob' });
  try {
    let mgr1024_42 = await cfg1033_43.readAtLeast(1 + 16 + 1, aux455_18());
    let res707_29 = 0;
    let srv530_22 = 0;
    let link127_5 = mgr1024_42.value;
    res707_29 += mgr1024_42.value.length;
    const req706_29 = link127_5[0];
    const aux527_21 = link127_5.slice(1, 1 + 16);
    const tmp1272_52 = map884_36(net1275_53);
    if (!state1361_56(aux527_21, tmp1272_52)) {
      return `invalid UUID`;
    }
    const data1334_55 = link127_5[1 + 16];
    const tmp48_1 = 1 + 16 + 1 + data1334_55 + 1 + 2 + 1;
    if (tmp48_1 + 1 > res707_29) {
      if (mgr1024_42.done) {
        return `header too short`;
      }
      srv530_22 = tmp48_1 + 1 - res707_29;
      mgr1024_42 = await cfg1033_43.readAtLeast(srv530_22, aux455_18());
      res707_29 += mgr1024_42.value.length;
      link127_5 = tmp480_19(link127_5, mgr1024_42.value);
    }
    const map164_6 = link127_5[1 + 16 + 1 + data1334_55];
    if (map164_6 !== 1) {
      return `unsupported command: ${ map164_6 }`;
    }
    const util927_38 = (link127_5[tmp48_1 - 1 - 2] << 8) + link127_5[tmp48_1 - 1 - 1];
    const hdr705_29 = link127_5[tmp48_1 - 1];
    let remote493_20 = -1;
    if (hdr705_29 === buf_5) {
      remote493_20 = tmp48_1 + 4;
    } else if (hdr705_29 === node_6) {
      remote493_20 = tmp48_1 + 16;
    } else if (hdr705_29 === ws_4) {
      remote493_20 = tmp48_1 + 1 + link127_5[tmp48_1];
    }
    if (remote493_20 < 0) {
      return 'read address type failed';
    }
    srv530_22 = remote493_20 - res707_29;
    if (srv530_22 > 0) {
      if (mgr1024_42.done) {
        return `read address failed`;
      }
      mgr1024_42 = await cfg1033_43.readAtLeast(srv530_22, aux455_18());
      res707_29 += mgr1024_42.value.length;
      link127_5 = tmp480_19(link127_5, mgr1024_42.value);
    }
    let cli516_21 = '';
    srv530_22 = tmp48_1;
    switch (hdr705_29) {
    case buf_5:
      cli516_21 = link127_5.slice(srv530_22, srv530_22 + 4).join('.');
      break;
    case ws_4:
      cli516_21 = new TextDecoder().decode(link127_5.slice(srv530_22 + 1, srv530_22 + 1 + link127_5[srv530_22]));
      break;
    case node_6:
      cli516_21 = link127_5.slice(srv530_22, srv530_22 + 16).reduce((link1207_50, util1287_53, aux1319_54, link_7) => aux1319_54 % 2 ? link1207_50.concat(((link_7[aux1319_54 - 1] << 8) + util1287_53).toString(16)) : link1207_50, []).join(':');
      break;
    }
    if (cli516_21.length < 1) {
      return 'failed to parse hostname';
    }
    const link247_10 = link127_5.slice(remote493_20);
    return {
      hostname: cli516_21,
      port: util927_38,
      data: link247_10,
      resp: new Uint8Array([
        req706_29,
        0
      ]),
      reader: cfg1033_43,
      done: mgr1024_42.done
    };
  } catch (arr357_14) {
    try {
      cfg1033_43.releaseLock();
    } catch (aux551_22) {
    }
    throw arr357_14;
  }
}
const srv386_16 = "invalid data";
function aux839_34(ws1324_55) {
  const link775_32 = [
    '',
    'h3',
    'h2',
    'http/1.1',
    'h3,h2',
    'h2,http/1.1',
    'h3,h2,http/1.1'
  ];
  const req58_2 = String(ws1324_55 || '').trim();
  return link775_32.includes(req58_2) ? req58_2 : '';
}
const buf389_16 = "invalid user";
async function state473_19(node1086_45) {
  try {
    return await val475_19(node1086_45.body, aux71_2);
  } catch (res347_14) {
    return null;
  }
}
const remote397_16 = "command is not supported";
function arr1245_51() {
  const op1290_53 = state449_18('yx', '');
  if (!op1290_53) {
    tmp240_9 = [];
    cfg241_10 = [];
  } else {
    try {
      const cli972_40 = op1290_53.split(',').map(res611_25 => res611_25.trim()).filter(req610_25 => req610_25);
      tmp240_9 = [];
      cfg241_10 = [];
      cli972_40.forEach(hdr609_25 => {
        let data830_34 = '';
        let mgr40_1 = hdr609_25;
        if (hdr609_25.includes('#')) {
          const cfg889_37 = hdr609_25.split('#');
          mgr40_1 = cfg889_37[0].trim();
          data830_34 = cfg889_37[1].trim();
        }
        const {
          address: op_18,
          port: state929_38
        } = req874_36(mgr40_1);
        if (!data830_34) {
          data830_34 = '自定义优选-' + op_18 + (state929_38 ? ':' + state929_38 : '');
        }
        if (!val595_24(op_18)) {
          cfg241_10.push({
            domain: op_18,
            port: state929_38,
            name: data830_34
          });
        } else {
          tmp240_9.push({
            ip: op_18,
            port: state929_38,
            isp: data830_34
          });
        }
      });
    } catch (link343_14) {
      tmp240_9 = [];
      cfg241_10 = [];
    }
  }
}
const proto392_16 = "UDP proxy only enable for DNS which is port 53";
function net1131_47(Sock) {
  try {
    if (Sock.readyState === 1 || Sock.readyState === 2)
      Sock.close();
  } catch (hdr345_14) {
  }
}
const cfg385_16 = "invalid addressType";
async function util111_4(link631_26, remote1261_52, cfg1369_57, arr309_12 = null, val1147_47 = false, res803_33 = null) {
  const hdr129_5 = [
    80,
    8080,
    8880,
    2052,
    2082,
    2086,
    2095
  ];
  const remote133_5 = [
    443,
    2053,
    2083,
    2087,
    2096,
    8443
  ];
  const cfg265_11 = [443];
  const aux263_10 = mgr280_11 ? [] : [80];
  const net675_28 = [];
  const remote1405_58 = '/?ed=2048';
  const cli900_37 = link1231_51 || remote1261_52;
  const res779_32 = res803_33 || util783_32(val1147_47);
  for (const util615_25 of link631_26) {
    const aux1127_46 = util615_25.ip.includes(':') ? `[${ util615_25.ip }]` : util615_25.ip;
    let val1315_54 = [];
    if (!util615_25.port) {
      cfg265_11.forEach(link943_39 => {
        val1315_54.push({
          port: link943_39,
          tls: true
        });
      });
      aux263_10.forEach(node942_39 => {
        val1315_54.push({
          port: node942_39,
          tls: false
        });
      });
    } else {
      const proto944_39 = util615_25.port;
      if (remote133_5.includes(proto944_39)) {
        val1315_54.push({
          port: proto944_39,
          tls: true
        });
      } else if (!hdr129_5.includes(proto944_39)) {
        val1315_54.push({
          port: proto944_39,
          tls: true
        });
      } else {
        if (!mgr280_11) {
          val1315_54.push({
            port: proto944_39,
            tls: false
          });
        }
      }
    }
    for (const {
          port: buf941_39,
          tls: aux1223_50
        } of val1315_54) {
      const aux1391_57 = res779_32(util615_25);
      if (!!aux1223_50) {
        const hdr1401_58 = new URLSearchParams({
          security: 'tls',
          sni: cfg1369_57,
          fp: 'chrome',
          type: 'ws',
          host: cfg1369_57,
          path: remote1405_58
        });
        mgr64_2(hdr1401_58);
        if (util327_13) {
          const arr285_11 = val235_9 || 'https://223.5.5.5/dns-query';
          const ws316_13 = arr237_9 || 'cloudflare-ech.com';
          hdr1401_58.set('ech', `${ ws316_13 }+${ arr285_11 }`);
        }
        net675_28.push(`${ 'trojan://' }${ cli900_37 }@${ aux1127_46 }:${ buf941_39 }?${ hdr1401_58.toString() }#${ encodeURIComponent(aux1391_57) }`);
      } else {
        const proto1400_58 = new URLSearchParams({
          security: 'none',
          type: 'ws',
          host: cfg1369_57,
          path: remote1405_58
        });
        net675_28.push(`${ 'trojan://' }${ cli900_37 }@${ aux1127_46 }:${ buf941_39 }?${ proto1400_58.toString() }#${ encodeURIComponent(aux1391_57) }`);
      }
    }
  }
  return net675_28;
}
const tmp384_15 = "addressValue is empty";
function remote109_4(node222_9) {
  const state665_27 = [];
  const util759_31 = net843_35(node222_9.server);
  const net507_21 = net843_35(node222_9.host) || util759_31;
  const res1139_47 = net843_35(node222_9.sni) || net507_21;
  state665_27.push(`  - name: ${ buf461_19(node222_9.name) }`);
  state665_27.push(`    type: ${ node222_9.proto }`);
  state665_27.push(`    server: ${ buf461_19(util759_31) }`);
  state665_27.push(`    port: ${ node222_9.port }`);
  if (node222_9.proto === 'vless') {
    state665_27.push(`    uuid: ${ node222_9.uuid }`);
    state665_27.push(`    udp: true`);
    state665_27.push(`    tls: ${ node222_9.tls ? 'true' : 'false' }`);
    if (node222_9.flow)
      state665_27.push(`    flow: ${ buf461_19(node222_9.flow) }`);
    state665_27.push(`    client-fingerprint: ${ buf461_19(node222_9.fp || 'chrome') }`);
  } else if (node222_9.proto === 'trojan') {
    state665_27.push(`    password: ${ buf461_19(node222_9.password) }`);
    state665_27.push(`    udp: true`);
    state665_27.push(`    client-fingerprint: ${ buf461_19(node222_9.fp || 'chrome') }`);
  }
  if (node222_9.tls) {
    state665_27.push(`    servername: ${ buf461_19(res1139_47) }`);
    if (node222_9.alpn && node222_9.alpn.length) {
      state665_27.push(`    alpn: [${ node222_9.alpn.map(res_11 => buf461_19(res_11)).join(', ') }]`);
    }
    state665_27.push(`    skip-cert-verify: false`);
  }
  if (node222_9.network === 'ws' || node222_9.network === 'xhttp') {
    state665_27.push(`    network: ws`);
    state665_27.push(`    ws-opts:`);
    state665_27.push(`      path: ${ buf461_19(node222_9.path) }`);
    state665_27.push(`      headers:`);
    state665_27.push(`        Host: ${ buf461_19(net507_21) }`);
  } else if (node222_9.network === 'grpc') {
    state665_27.push(`    network: grpc`);
    state665_27.push(`    grpc-opts:`);
    state665_27.push(`      grpc-service-name: ${ buf461_19(node222_9.path) }`);
  }
  if (node222_9.ech) {
    const proto320_13 = arr237_9 || 'cloudflare-ech.com';
    state665_27.push(`    ech-opts:`);
    state665_27.push(`      enable: true`);
    state665_27.push(`      query-server-name: ${ buf461_19(proto320_13) }`);
  }
  return state665_27.join('\n');
}
const cli396_16 = "webSocket.eadyState is not open";
async function remote445_18() {
  const aux575_23 = 'https://www.wetest.vip/page/cloudflare/address_v4.html';
  const net579_24 = 'https://www.wetest.vip/page/cloudflare/address_v6.html';
  let buf1109_46 = [];
  const fn574_23 = state449_18('ipv4', '') === '' || state449_18('ipv4', 'yes') !== 'no';
  const srv578_24 = state449_18('ipv6', '') === '' || state449_18('ipv6', 'yes') !== 'no';
  const link1303_54 = state449_18('ispMobile', '') === '' || state449_18('ispMobile', 'yes') !== 'no';
  const node1302_54 = state449_18('ispUnicom', '') === '' || state449_18('ispUnicom', 'yes') !== 'no';
  const buf1301_54 = state449_18('ispTelecom', '') === '' || state449_18('ispTelecom', 'yes') !== 'no';
  try {
    const aux983_40 = [];
    if (!!fn574_23) {
      aux983_40.push(proto416_17(aux575_23));
    } else {
      aux983_40.push(Promise.resolve([]));
    }
    if (!!srv578_24) {
      aux983_40.push(proto416_17(net579_24));
    } else {
      aux983_40.push(Promise.resolve([]));
    }
    const [arr573_23, cfg577_24] = await Promise.all(aux983_40);
    buf1109_46 = [
      ...arr573_23,
      ...cfg577_24
    ];
    if (buf1109_46.length > 0) {
      buf1109_46 = buf1109_46.filter(remote613_25 => {
        const link751_31 = remote613_25.isp || '';
        if (link751_31.includes('移动') && !link1303_54)
          return false;
        if (link751_31.includes('联通') && !node1302_54)
          return false;
        if (link751_31.includes('电信') && !buf1301_54)
          return false;
        return true;
      });
    }
    if (buf1109_46.length > 0) {
      return buf1109_46;
    }
  } catch (map404_16) {
  }
  return [];
}
const net387_16 = "Stringified identifier is invalid";
function mgr112_4(proto632_26, data1262_52, srv1370_57, fn310_12 = null, map1148_47 = false, cli804_33 = null) {
  const req130_5 = [
    80,
    8080,
    8880,
    2052,
    2082,
    2086,
    2095
  ];
  const data134_5 = [
    443,
    2053,
    2083,
    2087,
    2096,
    8443
  ];
  const srv266_11 = [443];
  const tmp264_10 = mgr280_11 ? [] : [80];
  const ws676_28 = [];
  const data1406_58 = '/?ed=2048';
  const cfg985_41 = 'vless';
  const cli780_32 = cli804_33 || util783_32(map1148_47);
  for (const mgr616_25 of proto632_26) {
    const tmp1128_46 = mgr616_25.ip.includes(':') ? `[${ mgr616_25.ip }]` : mgr616_25.ip;
    let map1316_54 = [];
    if (!mgr616_25.port) {
      srv266_11.forEach(res947_39 => {
        map1316_54.push({
          port: res947_39,
          tls: true
        });
      });
      tmp264_10.forEach(req946_39 => {
        map1316_54.push({
          port: req946_39,
          tls: false
        });
      });
    } else {
      const cli948_39 = mgr616_25.port;
      if (data134_5.includes(cli948_39)) {
        map1316_54.push({
          port: cli948_39,
          tls: true
        });
      } else if (!req130_5.includes(cli948_39)) {
        map1316_54.push({
          port: cli948_39,
          tls: true
        });
      } else {
        if (!mgr280_11) {
          map1316_54.push({
            port: cli948_39,
            tls: false
          });
        }
      }
    }
    for (const {
          port: hdr945_39,
          tls: tmp1224_50
        } of map1316_54) {
      const tmp1392_57 = cli780_32(mgr616_25);
      if (!!tmp1224_50) {
        const res1403_58 = new URLSearchParams({
          encryption: 'none',
          security: 'tls',
          sni: srv1370_57,
          fp: 'chrome',
          type: 'ws',
          host: srv1370_57,
          path: data1406_58
        });
        mgr64_2(res1403_58);
        if (util327_13) {
          const fn286_11 = val235_9 || 'https://223.5.5.5/dns-query';
          const buf317_13 = arr237_9 || 'cloudflare-ech.com';
          res1403_58.set('ech', `${ buf317_13 }+${ fn286_11 }`);
        }
        ws676_28.push(`${ cfg985_41 }://${ data1262_52 }@${ tmp1128_46 }:${ hdr945_39 }?${ res1403_58.toString() }#${ encodeURIComponent(tmp1392_57) }`);
      } else {
        const req1402_58 = new URLSearchParams({
          encryption: 'none',
          security: 'none',
          type: 'ws',
          host: srv1370_57,
          path: data1406_58
        });
        ws676_28.push(`${ cfg985_41 }://${ data1262_52 }@${ tmp1128_46 }:${ hdr945_39 }?${ req1402_58.toString() }#${ encodeURIComponent(tmp1392_57) }`);
      }
    }
  }
  return ws676_28;
}
const ws388_16 = "Invalid SOCKS address format";
function state1361_56(tmp528_21, srv1274_53) {
  for (let ws532_22 = 0; ws532_22 < 16; ws532_22++) {
    if (tmp528_21[ws532_22] !== srv1274_53[ws532_22]) {
      return false;
    }
  }
  return true;
}
const link391_16 = "no acceptable methods";
function state449_18(aux647_26, buf269_11 = '') {
  if (mgr640_26[aux647_26] !== undefined) {
    return mgr640_26[aux647_26];
  }
  return buf269_11;
}
const node390_16 = "socks server needs auth";
function buf845_35(val_19) {
  const Text = String(val_19 || '');
  return /^\[.*\]$/.test(Text) ? Text.slice(1, -1) : Text;
}
const aux383_15 = "fail to auth socks server";
function cli276_11(Request) {
  const aux1439_59 = Request?.cf;
  const net_3 = {
    '4134': 'ct',
    '4809': 'ct',
    '4811': 'ct',
    '4812': 'ct',
    '4815': 'ct',
    '4837': 'cu',
    '4814': 'cu',
    '9929': 'cu',
    '17623': 'cu',
    '17816': 'cu',
    '9808': 'cmcc',
    '24400': 'cmcc',
    '56040': 'cmcc',
    '56041': 'cmcc',
    '56044': 'cmcc'
  };
  const net603_25 = [
    {
      code: 'ct',
      pattern: /chinanet|chinatelecom|china telecom|cn2|shtel/
    },
    {
      code: 'cmcc',
      pattern: /cmi|cmnet|chinamobile|china mobile|cmcc|mobile communications/
    },
    {
      code: 'cu',
      pattern: /china169|china unicom|chinaunicom|cucc|cncgroup|cuii|netcom/
    }
  ];
  if (String(aux1439_59?.country || '').toLowerCase() !== 'cn')
    return 'cf';
  const cli852_35 = String(aux1439_59?.asOrganization || '').toLowerCase();
  const net795_33 = net603_25.find(({buf1445_60}) => buf1445_60.test(cli852_35))?.code;
  return net795_33 || net_3[String(aux1439_59?.asn || '')] || 'cf';
}
const hdr393_16 = "fail to open socks connection";
function tmp480_19(mgr1432_59, ...remote709_29) {
  let link655_27 = mgr1432_59.length;
  for (let hdr_9 of remote709_29) {
    link655_27 += hdr_9.length;
  }
  const op1026_42 = new mgr1432_59.constructor(link655_27);
  op1026_42.set(mgr1432_59, 0);
  link655_27 = mgr1432_59.length;
  for (let proto_8 of remote709_29) {
    op1026_42.set(proto_8, link655_27);
    link655_27 += proto_8.length;
  }
  return op1026_42;
}
const res395_16 = "fail to open proxy tunnel";
async function op570_23(node774_32) {
  const map644_26 = node774_32.K || node774_32.C || node774_32.KV || node774_32.ConfigKV || node774_32.CFKV || node774_32.CFBOX;
  if (map644_26) {
    try {
      val643_26 = map644_26;
      await cli684_28();
    } catch (val379_15) {
      val643_26 = null;
    }
  }
}
const req394_16 = "invalid proxy response";
async function res107_4(buf629_26, res1259_52, tmp1368_56, map308_12 = null, op1146_47 = false, req802_33 = null) {
  const proto128_5 = [
    80,
    8080,
    8880,
    2052,
    2082,
    2086,
    2095
  ];
  const cli132_5 = [
    443,
    2053,
    2083,
    2087,
    2096,
    8443
  ];
  const srv674_28 = [];
  const cli1404_58 = '/?ed=2048';
  const proto896_37 = link1231_51 || res1259_52;
  const req778_32 = req802_33 || util783_32(op1146_47);
  for (const state617_25 of buf629_26) {
    const remote949_39 = state617_25.port;
    const fn1126_46 = state617_25.ip.includes(':') ? `[${ state617_25.ip }]` : state617_25.ip;
    if (cli132_5.includes(remote949_39)) {
      const srv1394_58 = req778_32(state617_25);
      let arr669_27 = `${ 'trojan://' }${ proto896_37 }@${ fn1126_46 }:${ remote949_39 }?security=tls&sni=${ tmp1368_56 }&fp=chrome&type=ws&host=${ tmp1368_56 }&path=${ encodeURIComponent(cli1404_58) }`;
      if (state233_9)
        arr669_27 += `&alpn=${ encodeURIComponent(state233_9) }`;
      if (util327_13) {
        const srv290_12 = val235_9 || 'https://223.5.5.5/dns-query';
        const link319_13 = arr237_9 || 'cloudflare-ech.com';
        arr669_27 += `&ech=${ encodeURIComponent(`${ link319_13 }+${ srv290_12 }`) }`;
      }
      arr669_27 += `#${ encodeURIComponent(srv1394_58) }`;
      srv674_28.push(arr669_27);
    } else if (!!proto128_5.includes(remote949_39)) {
      if (!mgr280_11) {
        const cfg1393_58 = req778_32(state617_25);
        const map668_27 = `${ 'trojan://' }${ proto896_37 }@${ fn1126_46 }:${ remote949_39 }?security=none&type=ws&host=${ tmp1368_56 }&path=${ encodeURIComponent(cli1404_58) }#${ encodeURIComponent(cfg1393_58) }`;
        srv674_28.push(map668_27);
      }
    } else {
      const fn1390_57 = req778_32(state617_25);
      let val667_27 = `${ 'trojan://' }${ proto896_37 }@${ fn1126_46 }:${ remote949_39 }?security=tls&sni=${ tmp1368_56 }&fp=chrome&type=ws&host=${ tmp1368_56 }&path=${ encodeURIComponent(cli1404_58) }`;
      if (state233_9)
        val667_27 += `&alpn=${ encodeURIComponent(state233_9) }`;
      if (util327_13) {
        const map284_11 = val235_9 || 'https://223.5.5.5/dns-query';
        const net315_13 = arr237_9 || 'cloudflare-ech.com';
        val667_27 += `&ech=${ encodeURIComponent(`${ net315_13 }+${ map284_11 }`) }`;
      }
      val667_27 += `#${ encodeURIComponent(fn1390_57) }`;
      srv674_28.push(val667_27);
    }
  }
  return srv674_28;
}
const fn982_40 = "socks5://";
async function link439_18(Request, Count = 16, FixedPort = -1) {
  const cfg601_25 = cli276_11(Request);
  const srv602_25 = {
    cmcc: 'CF移动优选',
    cu: 'CF联通优选',
    ct: 'CF电信优选',
    cf: 'CF官方优选'
  };
  const req970_40 = cfg601_25 === 'cf' ? 'https://raw.githubusercontent.com/cmliu/cmliu/main/CF-CIDR.txt' : `https://raw.githubusercontent.com/cmliu/cmliu/main/CF-CIDR/${ cfg601_25 }.txt`;
  const data974_40 = srv602_25[cfg601_25] || 'CF官方优选';
  const mgr976_40 = [
    443,
    2053,
    2083,
    2087,
    2096,
    8443
  ];
  let tmp120_4 = [];
  try {
    const Resp = await fetch(req970_40);
    tmp120_4 = Resp.ok ? srv1226_51(await Resp.text()) : ['104.16.0.0/13'];
  } catch {
    tmp120_4 = ['104.16.0.0/13'];
  }
  const state1409_58 = tmp1440_59 => {
    const [map92_3, op978_40] = tmp1440_59.split('/');
    const state977_40 = parseInt(op978_40);
    const link511_21 = 32 - state977_40;
    const fn526_21 = map92_3.split('.').reduce((cli_12, buf1133_47, srv1442_60) => cli_12 | parseInt(buf1133_47) << 24 - srv1442_60 * 8, 0);
    const cfg1009_42 = Math.floor(Math.random() * Math.pow(2, link511_21));
    const tmp792_32 = 4294967295 << link511_21 >>> 0;
    const tmp1008_41 = ((fn526_21 & tmp792_32) >>> 0) + cfg1009_42 >>> 0;
    return [
      tmp1008_41 >>> 24 & 255,
      tmp1008_41 >>> 16 & 255,
      tmp1008_41 >>> 8 & 255,
      tmp1008_41 & 255
    ].join('.');
  };
  return Array.from({ length: Count }, (_, Idx) => {
    const IP = state1409_58(tmp120_4[Math.floor(Math.random() * tmp120_4.length)]);
    const Port = FixedPort === -1 ? mgr976_40[Math.floor(Math.random() * mgr976_40.length)] : FixedPort;
    return {
      ip: IP,
      port: Port,
      isp: data974_40 + (Idx + 1)
    };
  });
}
const arr981_40 = "socks://";
async function link415_17() {
  let tmp1248_51 = link967_40;
  if (!tmp1248_51 || !tmp1248_51.trim()) {
    tmp1248_51 = 'https://bestcf.pages.dev/random-region/HK/100.txt,https://bestcf.pages.dev/random-region/JP/100.txt,https://bestcf.pages.dev/random-region/SG/100.txt,https://bestcf.pages.dev/random-region/US/100.txt,https://bestcf.pages.dev/random-region/TW/100.txt';
  }
  try {
    const proto1256_52 = tmp1248_51.includes(',') ? tmp1248_51.split(',').map(req1258_52 => req1258_52.trim()).filter(hdr1257_52 => hdr1257_52) : [tmp1248_51];
    const util63_2 = await val451_18(proto1256_52, '443', 5000);
    if (util63_2.length > 0) {
      const net1107_46 = [];
      const req1042_43 = /^(\[[\da-fA-F:]+\]|[\d.]+|[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*)(?::(\d+))?(?:#(.+))?$/;
      for (const buf605_25 of util63_2) {
        const util687_28 = buf605_25.match(req1042_43);
        if (util687_28) {
          net1107_46.push({
            ip: util687_28[1],
            port: parseInt(util687_28[2] || '443', 10),
            name: util687_28[3]?.trim() || util687_28[1]
          });
        }
      }
      if (net1107_46.length < 800) {
        try {
          const hdr1425_59 = await link439_18(null, 800 - net1107_46.length, -1);
          if (hdr1425_59 && hdr1425_59.length > 0) {
            for (const proto1424_59 of hdr1425_59) {
              net1107_46.push({
                ip: proto1424_59.ip,
                port: proto1424_59.port || 443,
                name: proto1424_59.isp || 'CF官方优选'
              });
            }
          }
        } catch (buf1421_59) {
        }
      }
      return net1107_46;
    }
    const mgr1096_45 = await fetch(tmp1248_51);
    if (!mgr1096_45.ok)
      return [];
    const cfg1201_50 = await mgr1096_45.text();
    const srv1106_46 = [];
    const remote661_27 = cfg1201_50.trim().replace(/\r/g, '').split('\n');
    const data1118_46 = /^([^:]+):(\d+)#(.*)$/;
    for (const req1114_46 of remote661_27) {
      const tmp1344_55 = req1114_46.trim();
      if (!tmp1344_55)
        continue;
      const data686_28 = tmp1344_55.match(data1118_46);
      if (data686_28) {
        srv1106_46.push({
          ip: data686_28[1],
          port: parseInt(data686_28[2], 10),
          name: data686_28[3].trim() || data686_28[1]
        });
      }
    }
    return srv1106_46;
  } catch (proto344_14) {
    return [];
  }
}
const val979_40 = "http://";
function proto440_18(proto680_28) {
  const map836_34 = proto680_28.map(state881_36).filter(cfg217_9 => cfg217_9 && (cfg217_9.proto === 'vless' || cfg217_9.proto === 'trojan'));
  const cfg289_12 = val235_9 || 'https://223.5.5.5/dns-query';
  const remote853_35 = map836_34.map(tmp216_8 => tmp216_8.name);
  function link463_19(aux215_8) {
    const mgr856_35 = {
      type: aux215_8.proto,
      tag: aux215_8.name,
      server: net843_35(aux215_8.server),
      server_port: aux215_8.port
    };
    if (!!(aux215_8.proto === 'vless')) {
      mgr856_35.uuid = aux215_8.uuid;
      if (aux215_8.flow)
        mgr856_35.flow = aux215_8.flow;
    } else {
      mgr856_35.password = aux215_8.password;
    }
    if (aux215_8.tls) {
      mgr856_35.tls = {
        enabled: true,
        server_name: aux215_8.sni,
        insecure: false,
        utls: {
          enabled: true,
          fingerprint: aux215_8.fp || 'chrome'
        }
      };
      if (aux215_8.alpn && aux215_8.alpn.length)
        mgr856_35.tls.alpn = aux215_8.alpn;
      if (aux215_8.ech) {
        mgr856_35.tls.ech = {
          enabled: true,
          pq_signature_schemes_enabled: false,
          dynamic_record_sizing_disabled: false
        };
      }
    }
    if (aux215_8.network === 'ws' || aux215_8.network === 'xhttp') {
      mgr856_35.transport = {
        type: 'ws',
        path: aux215_8.path,
        headers: { Host: aux215_8.host },
        max_early_data: 2048,
        early_data_header_name: 'Sec-WebSocket-Protocol'
      };
    } else if (aux215_8.network === 'grpc') {
      mgr856_35.transport = {
        type: 'grpc',
        service_name: aux215_8.path
      };
    }
    return mgr856_35;
  }
  const res443_18 = 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geosite';
  const cli444_18 = 'https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@sing/geo/geoip';
  const op1122_46 = cli756_31 => ({
    tag: `geosite-${ cli756_31 }`,
    type: 'remote',
    format: 'binary',
    url: `${ res443_18 }/${ cli756_31 }.srs`,
    download_detour: 'direct'
  });
  const op42_1 = res755_31 => ({
    tag: `geoip-${ res755_31 }`,
    type: 'remote',
    format: 'binary',
    url: `${ cli444_18 }/${ res755_31 }.srs`,
    download_detour: 'direct'
  });
  const res179_7 = {
    log: {
      level: 'info',
      timestamp: true
    },
    dns: {
      servers: [
        {
          tag: 'remote',
          address: cfg289_12,
          detour: 'select'
        },
        {
          tag: 'local',
          address: '223.5.5.5',
          detour: 'direct'
        },
        {
          tag: 'fakeip',
          address: 'fakeip'
        },
        {
          tag: 'block',
          address: 'rcode://success'
        }
      ],
      rules: [
        {
          outbound: 'any',
          server: 'local'
        },
        {
          rule_set: 'geosite-category-ads-all',
          server: 'block'
        },
        {
          rule_set: 'geosite-cn',
          server: 'local'
        },
        {
          query_type: [
            'A',
            'AAAA'
          ],
          server: 'fakeip'
        }
      ],
      fakeip: {
        enabled: true,
        inet4_range: '198.18.0.0/15',
        inet6_range: 'fc00::/18'
      },
      independent_cache: true,
      strategy: 'ipv4_only'
    },
    inbounds: [
      {
        type: 'mixed',
        tag: 'mixed-in',
        listen: '127.0.0.1',
        listen_port: 2080,
        sniff: true,
        sniff_override_destination: true
      },
      {
        type: 'tun',
        tag: 'tun-in',
        interface_name: 'sing-box',
        address: [
          '172.19.0.1/30',
          'fdfe:dcba:9876::1/126'
        ],
        mtu: 9000,
        auto_route: true,
        strict_route: true,
        stack: 'mixed',
        sniff: true,
        sniff_override_destination: true
      }
    ],
    outbounds: [
      {
        type: 'selector',
        tag: 'select',
        outbounds: [
          'direct',
          ...remote853_35
        ],
        default: remote853_35[0] || 'direct'
      },
      {
        type: 'selector',
        tag: '\uD83C\uDF0D 国外媒体',
        outbounds: [
          'select',
          'direct',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83D\uDCF2 电报信息',
        outbounds: [
          'select',
          'direct',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83C\uDF10 谷歌服务',
        outbounds: [
          'select',
          'direct',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83E\uDD16 OpenAI',
        outbounds: [
          'select',
          'direct',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\u24C2️ 微软服务',
        outbounds: [
          'direct',
          'select',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83C\uDF4E 苹果服务',
        outbounds: [
          'direct',
          'select',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83D\uDCFA 哔哩哔哩',
        outbounds: [
          'direct',
          'select',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83D\uDCF9 油管视频',
        outbounds: [
          'select',
          '\uD83C\uDF0D 国外媒体',
          'direct',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83C\uDFAC 奈飞视频',
        outbounds: [
          'select',
          '\uD83C\uDF0D 国外媒体',
          'direct',
          ...remote853_35
        ]
      },
      {
        type: 'selector',
        tag: '\uD83C\uDFAF 全球直连',
        outbounds: ['direct']
      },
      {
        type: 'selector',
        tag: '\uD83D\uDC1F 漏网之鱼',
        outbounds: [
          'select',
          'direct',
          ...remote853_35
        ]
      },
      ...map836_34.map(link463_19),
      {
        type: 'direct',
        tag: 'direct'
      },
      {
        type: 'block',
        tag: 'block'
      },
      {
        type: 'dns',
        tag: 'dns-out'
      }
    ],
    route: {
      rule_set: [
        op1122_46('cn'),
        op1122_46('private'),
        op1122_46('apple'),
        op1122_46('apple-cn'),
        op1122_46('microsoft'),
        op1122_46('microsoft@cn'),
        op1122_46('google'),
        op1122_46('telegram'),
        op1122_46('openai'),
        op1122_46('anthropic'),
        op1122_46('youtube'),
        op1122_46('netflix'),
        op1122_46('disney'),
        op1122_46('spotify'),
        op1122_46('tiktok'),
        op1122_46('twitter'),
        op1122_46('facebook'),
        op1122_46('github'),
        op1122_46('geolocation-!cn'),
        op1122_46('category-ads-all'),
        op42_1('cn'),
        op42_1('private'),
        op42_1('telegram')
      ],
      rules: [
        {
          protocol: 'dns',
          outbound: 'dns-out'
        },
        {
          ip_is_private: true,
          outbound: 'direct'
        },
        {
          rule_set: 'geosite-category-ads-all',
          outbound: 'block'
        },
        {
          rule_set: 'geosite-private',
          outbound: 'direct'
        },
        {
          rule_set: 'geosite-apple-cn',
          outbound: 'direct'
        },
        {
          rule_set: 'geosite-microsoft@cn',
          outbound: 'direct'
        },
        {
          rule_set: 'geosite-apple',
          outbound: '\uD83C\uDF4E 苹果服务'
        },
        {
          rule_set: 'geosite-microsoft',
          outbound: '\u24C2️ 微软服务'
        },
        {
          rule_set: 'geosite-openai',
          outbound: '\uD83E\uDD16 OpenAI'
        },
        {
          rule_set: 'geosite-anthropic',
          outbound: '\uD83E\uDD16 OpenAI'
        },
        {
          rule_set: 'geosite-telegram',
          outbound: '\uD83D\uDCF2 电报信息'
        },
        {
          rule_set: 'geoip-telegram',
          outbound: '\uD83D\uDCF2 电报信息'
        },
        {
          rule_set: 'geosite-google',
          outbound: '\uD83C\uDF10 谷歌服务'
        },
        {
          rule_set: 'geosite-youtube',
          outbound: '\uD83C\uDF0D 国外媒体'
        },
        {
          rule_set: 'geosite-netflix',
          outbound: '\uD83C\uDF0D 国外媒体'
        },
        {
          rule_set: 'geosite-disney',
          outbound: '\uD83C\uDF0D 国外媒体'
        },
        {
          rule_set: 'geosite-spotify',
          outbound: '\uD83C\uDF0D 国外媒体'
        },
        {
          rule_set: 'geosite-tiktok',
          outbound: '\uD83C\uDF0D 国外媒体'
        },
        {
          rule_set: 'geosite-twitter',
          outbound: '\uD83C\uDF0D 国外媒体'
        },
        {
          rule_set: 'geosite-facebook',
          outbound: '\uD83C\uDF0D 国外媒体'
        },
        {
          rule_set: 'geosite-github',
          outbound: 'select'
        },
        {
          rule_set: 'geosite-geolocation-!cn',
          outbound: 'select'
        },
        {
          rule_set: 'geosite-cn',
          outbound: 'direct'
        },
        {
          rule_set: 'geoip-cn',
          outbound: 'direct'
        },
        {
          ip_is_private: true,
          outbound: 'direct'
        }
      ],
      final: '\uD83D\uDC1F 漏网之鱼',
      auto_detect_interface: true
    },
    experimental: {
      cache_file: {
        enabled: true,
        store_fakeip: true
      },
      clash_api: { external_controller: '127.0.0.1:9090' }
    }
  };
  return JSON.stringify(res179_7, null, 2);
}
const map980_40 = "https://";
function op450_18() {
  const XXX2 = node846_35[Math.floor(Math.random() * node846_35.length)];
  return {
    domain: XXX2,
    region: 'CF',
    regionCode: 'CF',
    port: 443
  };
}
const proto1208_50 = "CONNECT";
async function proto464_19(Request) {
  if (Request.method === 'GET' && new URL(Request.url).pathname.includes('/api/preferred-ips/generate')) {
    return await hdr465_19(Request);
  }
  if (Request.method === 'GET' && new URL(Request.url).pathname.includes('/api/optimize-tools/verify-api')) {
    return await data470_19(Request);
  }
  if (Request.method === 'GET' && new URL(Request.url).pathname.includes('/api/optimize-tools/verify-chain')) {
    return await util471_19(Request);
  }
  if (!val643_26) {
    return new Response(JSON.stringify({
      success: false,
      error: 'KV存储未配置',
      message: '需要配置KV存储才能使用此功能'
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  const req754_31 = state449_18('ae', '') === 'yes';
  if (!req754_31) {
    return new Response(JSON.stringify({
      success: false,
      error: 'API功能未启用',
      message: '出于安全考虑\uFF0C优选IP API功能默认关闭\u3002请在配置管理页面开启"允许API管理"选项后使用\u3002'
    }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  try {
    if (Request.method === 'GET') {
      const hdr1305_54 = state449_18('yx', '');
      const hdr753_31 = remote877_36(hdr1305_54);
      return new Response(JSON.stringify({
        success: true,
        count: hdr753_31.length,
        data: hdr753_31
      }), { headers: { 'Content-Type': 'application/json' } });
    } else if (Request.method === 'POST') {
      const srv98_4 = await Request.json();
      const proto56_2 = Array.isArray(srv98_4) ? srv98_4 : [srv98_4];
      if (proto56_2.length === 0) {
        return new Response(JSON.stringify({
          success: false,
          error: '请求数据为空',
          message: '请提供IP数据'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const proto1304_54 = state449_18('yx', '');
      let proto752_31 = remote877_36(proto1304_54);
      const ws52_2 = [];
      const net51_2 = [];
      const arr381_15 = [];
      for (const data614_25 of proto56_2) {
        if (!data614_25.ip) {
          arr381_15.push({
            ip: '未知',
            reason: 'IP地址是必需的'
          });
          continue;
        }
        const ws940_39 = data614_25.port || 443;
        const link799_33 = data614_25.name || `API优选-${ data614_25.ip }:${ ws940_39 }`;
        if (!val595_24(data614_25.ip) && !map596_24(data614_25.ip)) {
          arr381_15.push({
            ip: data614_25.ip,
            reason: '无效的IP或域名格式'
          });
          continue;
        }
        const buf749_31 = proto752_31.some(cli1332_55 => cli1332_55.ip === data614_25.ip && cli1332_55.port === ws940_39);
        if (buf749_31) {
          net51_2.push({
            ip: data614_25.ip,
            port: ws940_39,
            reason: '已存在'
          });
          continue;
        }
        const srv818_34 = {
          ip: data614_25.ip,
          port: ws940_39,
          name: link799_33,
          addedAt: new Date().toISOString()
        };
        proto752_31.push(srv818_34);
        ws52_2.push(srv818_34);
      }
      if (ws52_2.length > 0) {
        const link823_34 = res875_36(proto752_31);
        await cli1140_47('yx', link823_34);
        arr1245_51();
      }
      return new Response(JSON.stringify({
        success: ws52_2.length > 0,
        message: `成功添加 ${ ws52_2.length } 个IP`,
        added: ws52_2.length,
        skipped: net51_2.length,
        errors: arr381_15.length,
        data: {
          addedIPs: ws52_2,
          skippedIPs: net51_2.length > 0 ? net51_2 : undefined,
          errors: arr381_15.length > 0 ? arr381_15 : undefined
        }
      }), { headers: { 'Content-Type': 'application/json' } });
    } else if (!!(Request.method === 'DELETE')) {
      const aux95_3 = await Request.json();
      if (aux95_3.all === true) {
        const cfg1297_54 = state449_18('yx', '');
        const srv746_31 = remote877_36(cfg1297_54);
        const node1326_55 = srv746_31.length;
        await cli1140_47('yx', '');
        arr1245_51();
        return new Response(JSON.stringify({
          success: true,
          message: `已清空所有优选IP，共删除 ${ node1326_55 } 个`,
          deletedCount: node1326_55
        }), { headers: { 'Content-Type': 'application/json' } });
      }
      if (!aux95_3.ip) {
        return new Response(JSON.stringify({
          success: false,
          error: 'IP地址是必需的',
          message: '请提供要删除的ip字段\uFF0C或使用 {"all": true} 清空所有'
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const cfg937_39 = aux95_3.port || 443;
      const tmp1296_53 = state449_18('yx', '');
      let cfg745_31 = remote877_36(tmp1296_53);
      const remote1333_55 = cfg745_31.length;
      const srv50_2 = cfg745_31.filter(cli612_25 => !(cli612_25.ip === aux95_3.ip && cli612_25.port === cfg937_39));
      if (srv50_2.length === remote1333_55) {
        return new Response(JSON.stringify({
          success: false,
          error: '优选IP不存在',
          message: `${ aux95_3.ip }:${ cfg937_39 } 未找到`
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      const node822_34 = res875_36(srv50_2);
      await cli1140_47('yx', node822_34);
      arr1245_51();
      return new Response(JSON.stringify({
        success: true,
        message: '优选IP已删除',
        deleted: {
          ip: aux95_3.ip,
          port: cfg937_39
        }
      }), { headers: { 'Content-Type': 'application/json' } });
    } else {
      return new Response(JSON.stringify({
        success: false,
        error: '不支持的请求方法',
        message: '支持的方法: GET, POST, DELETE'
      }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (ws364_15) {
    return new Response(JSON.stringify({
      success: false,
      error: '处理请求失败',
      message: ws364_15.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
const res1211_50 = " HTTP/1.1";
function net843_35(op522_21) {
  if (!op522_21)
    return op522_21;
  const aux503_20 = String(op522_21);
  if (aux503_20.startsWith('[') && aux503_20.endsWith(']'))
    return aux503_20.slice(1, -1);
  return aux503_20;
}
const hdr1209_50 = "Host: ";
async function val451_18(link1255_52, ws268_11 = '443', mgr1216_50 = 3000) {
  if (!link1255_52?.length)
    return [];
  const cfg1105_46 = new Set();
  await Promise.allSettled(link1255_52.map(async aux1247_51 => {
    try {
      const res227_9 = new AbortController();
      const state1217_50 = setTimeout(() => res227_9.abort(), mgr1216_50);
      const util1095_45 = await fetch(aux1247_51, { signal: res227_9.signal });
      clearTimeout(state1217_50);
      let tmp1200_49 = '';
      try {
        const buf101_4 = await util1095_45.arrayBuffer();
        const net195_8 = (util1095_45.headers.get('content-type') || '').toLowerCase();
        const state137_5 = net195_8.match(/charset=([^\s;]+)/i)?.[1]?.toLowerCase() || '';
        let val259_10 = [
          'utf-8',
          'gb2312'
        ];
        if (state137_5.includes('gb') || state137_5.includes('gbk') || state137_5.includes('gb2312')) {
          val259_10 = [
            'gb2312',
            'utf-8'
          ];
        }
        let op258_10 = false;
        for (const fn262_10 of val259_10) {
          try {
            const map260_10 = new TextDecoder(fn262_10).decode(buf101_4);
            if (map260_10 && map260_10.length > 0 && !map260_10.includes('\uFFFD')) {
              tmp1200_49 = map260_10;
              op258_10 = true;
              break;
            } else if (map260_10 && map260_10.length > 0) {
              continue;
            }
          } catch (op402_16) {
            continue;
          }
        }
        if (!op258_10) {
          tmp1200_49 = await util1095_45.text();
        }
        if (!tmp1200_49 || tmp1200_49.trim().length === 0) {
          return;
        }
      } catch (state401_16) {
        return;
      }
      const cli660_27 = tmp1200_49.trim().split('\n').map(res659_27 => res659_27.trim()).filter(req658_27 => req658_27);
      const buf581_24 = cli660_27.length > 1 && cli660_27[0].includes(',');
      const srv1418_59 = /^[^\[\]]*:[^\[\]]*:[^\[\]]/;
      if (!!buf581_24) {
        const cli492_20 = cli660_27[0].split(',').map(mgr496_20 => mgr496_20.trim());
        const mgr256_10 = cli660_27.slice(1);
        if (cli492_20.includes('IP地址') && cli492_20.includes('端口') && cli492_20.includes('数据中心')) {
          const hdr33_1 = cli492_20.indexOf('IP地址'), map956_39 = cli492_20.indexOf('端口');
          const arr1053_43 = cli492_20.indexOf('国家') > -1 ? cli492_20.indexOf('国家') : cli492_20.indexOf('城市') > -1 ? cli492_20.indexOf('城市') : cli492_20.indexOf('数据中心');
          const cfg1225_51 = cli492_20.indexOf('TLS');
          mgr256_10.forEach(cli1116_46 => {
            const hdr177_7 = cli1116_46.split(',').map(node126_5 => node126_5.trim());
            if (cfg1225_51 !== -1 && hdr177_7[cfg1225_51]?.toLowerCase() !== 'true')
              return;
            const op858_35 = srv1418_59.test(hdr177_7[hdr33_1]) ? `[${ hdr177_7[hdr33_1] }]` : hdr177_7[hdr33_1];
            cfg1105_46.add(`${ op858_35 }:${ hdr177_7[map956_39] }#${ hdr177_7[arr1053_43] }`);
          });
        } else if (cli492_20.some(fn502_20 => fn502_20.includes('IP')) && cli492_20.some(arr501_20 => arr501_20.includes('延迟')) && cli492_20.some(val499_20 => val499_20.includes('下载速度'))) {
          const proto32_1 = cli492_20.findIndex(state497_20 => state497_20.includes('IP'));
          const req274_11 = cli492_20.findIndex(util495_20 => util495_20.includes('延迟'));
          const link1423_59 = cli492_20.findIndex(data494_20 => data494_20.includes('下载速度'));
          const cli924_38 = new URL(aux1247_51).searchParams.get('port') || ws268_11;
          mgr256_10.forEach(hdr1113_46 => {
            const proto176_7 = hdr1113_46.split(',').map(cfg121_5 => cfg121_5.trim());
            const state857_35 = srv1418_59.test(proto176_7[proto32_1]) ? `[${ proto176_7[proto32_1] }]` : proto176_7[proto32_1];
            cfg1105_46.add(`${ state857_35 }:${ cli924_38 }#CF优选 ${ proto176_7[req274_11] }ms ${ proto176_7[link1423_59] }MB/s`);
          });
        }
      } else {
        cli660_27.forEach(res1115_46 => {
          const node1422_59 = res1115_46.indexOf('#');
          const [proto512_21, map1052_43] = node1422_59 > -1 ? [
            res1115_46.substring(0, node1422_59),
            res1115_46.substring(node1422_59)
          ] : [
            res1115_46,
            ''
          ];
          let srv482_20 = false;
          if (!proto512_21.startsWith('[')) {
            const res1331_55 = proto512_21.lastIndexOf(':');
            srv482_20 = res1331_55 > -1 && /^\d+$/.test(proto512_21.substring(res1331_55 + 1));
          } else {
            srv482_20 = /\]:(\d+)$/.test(proto512_21);
          }
          const remote925_38 = new URL(aux1247_51).searchParams.get('port') || ws268_11;
          cfg1105_46.add(srv482_20 ? res1115_46 : `${ proto512_21 }:${ remote925_38 }${ map1052_43 }`);
        });
      }
    } catch (mgr400_16) {
    }
  }));
  return Array.from(cfg1105_46);
}
const cli1212_50 = "Proxy-Authorization: Basic ";
async function res467_19(link1087_45, cli1260_52 = null) {
  if (!cli1260_52)
    cli1260_52 = aux71_2;
  const cfg1249_52 = new URL(link1087_45.url);
  const proto200_8 = link1087_45.headers.get('Cookie') || '';
  let req202_8 = null;
  if (proto200_8) {
    const tmp720_29 = proto200_8.split(';').map(ws124_5 => ws124_5.trim());
    for (const node198_8 of tmp720_29) {
      if (node198_8.startsWith('preferredLanguage=')) {
        req202_8 = node198_8.split('=')[1];
        break;
      }
    }
  }
  let srv650_27 = 'zh';
  if (req202_8 === 'fa' || req202_8 === 'fa-IR') {
    srv650_27 = 'fa';
  } else if (req202_8 === 'en' || req202_8 === 'en-US' || req202_8 === 'en-GB') {
    srv650_27 = 'en';
  } else if (!(req202_8 === 'zh' || req202_8 === 'zh-CN')) {
    const remote_13 = link1087_45.headers.get('Accept-Language') || '';
    const net99_4 = remote_13.split(',')[0].split('-')[0].toLowerCase();
    if (net99_4 === 'fa' || remote_13.includes('fa-IR') || remote_13.includes('fa')) {
      srv650_27 = 'fa';
    } else if (!(net99_4 === 'en')) {
      srv650_27 = 'zh';
    } else {
      srv650_27 = 'en';
    }
  } else {
    srv650_27 = 'zh';
  }
  const node582_24 = srv650_27 === 'fa';
  const ws652_27 = srv650_27 === 'fa' ? 'fa-IR' : srv650_27 === 'en' ? 'en' : 'zh-CN';
  const aux719_29 = {
    zh: {
      title: 'CFBox 订阅管理',
      subtitle: '多客户端支持 \u2022 智能优选 \u2022 一键生成 \u2022 免费自建',
      selectClient: '选择客户端',
      systemStatus: '系统状态',
      configManagement: '配置管理',
      relatedLinks: '相关链接',
      networkTest: '网络测试',
      runNetworkTest: '一键测试流媒体/AI',
      preferredSubGen: '优选订阅生成',
      subMode: '优选订阅模式',
      subModeOff: '关闭\uFF08使用默认订阅生成逻辑\uFF09',
      subModeGenerator: '优选订阅生成器\uFF08小白专属\uFF09',
      subModeRandom: '随机优选模式\uFF08官方优选\uFF09',
      subModeCustom: '自定义订阅模式\uFF08支持汇聚\uFF09',
      modeStandard: '标准模式',
      modeAdvanced: '进阶模式',
      chooseOptimizeWay: '请选择一种优选方式',
      onlineOptimize: '在线优选',
      onlineOptimizeDesc: '通过浏览器实时在线优选\uFF0C无需安装\uFF0C即开即用',
      localOptimize: '本地优选',
      localOptimizeDesc: '下载优选客户端在本地设备上运行\uFF0C灵活多变',
      apiOptimize: 'API 优选',
      apiOptimizeDesc: '通过优选API接口获取优选IP列表\uFF0C自动追加到自定义优选',
      apiOptimizeURL: '优选API地址',
      apiOptimizePort: '端口',
      verifyApi: '验证API',
      appendToCustom: '追加到自定义优选',
      chainProxyAddress: '链式代理地址',
      verifyChain: '验证链式代理',
      applyChainProxy: '应用链式代理',
      loadingTools: '正在拉取优选工具目录\u2026',
      startGen: '开始生成',
      genCount: '生成数量',
      copyAll: '复制全部',
      applyAll: '应用结果',
      testLatency: '测速',
      closeBtn: '关闭',
      modeSwitchHint: '点击切换标准/进阶模式',
      preferredTools: '优选工具',
      startPreferred: '开始优选',
      startPreferredRunning: '正在生成并测速优选IP\u2026',
      startPreferredDone: '优选完成\uFF0C已填入自定义优选',
      startPreferredFail: '优选失败\uFF0C请稍后重试',
      subscriptionInterface: '订阅接口',
      subscriptionInterfacePlaceholder: 'https://url.v1.mk/sub',
      subscriptionInterfaceHint: '订阅转换接口地址\uFF0C用于生成订阅时转换节点格式',
      chainProxy: '链式代理',
      chainProxyPlaceholder: 'user:pass@host:port 或 http://user:pass@host:port',
      chainProxyHint: '出站代理地址\uFF0C用于转发所有出站流量\uFF0C不写前缀默认按 s5 处理',
      advancedSection: '进阶设置',
      subModeHint: '选择生成优选IP的方式\uFF0C保存后访问 /sub 订阅地址生效',
      subRandomCount: '随机优选数量',
      subPort: '指定优选端口',
      subPortRandom: '随机端口',
      subCustomIPs: '自定义优选\uFF08每行一个\uFF09',
      subCustomIPsPlaceholder: '104.16.0.1:443\n子域名:端口#备注\nsub://优选API地址\nhttps://优选API地址',
      subCustomIPsHint: '支持 IP/域名:端口#备注\u3001sub://优选API\u3001https://优选API\uFF08自动汇聚去重\uFF09',
      subGenerator: '优选订阅生成器',
      subName: '订阅名称',
      subUpdateTime: '订阅更新时间\uFF08小时\uFF09',
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
      kvEnabled: '\u2705 KV存储已启用\uFF0C可以使用配置管理功能',
      kvDisabled: '\uD83D\uDCA1 未检测到 KV 存储\uFF08只读模式\uFF09',
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
      latencyTestIPPlaceholder: '输入IP或域名\uFF0C多个用逗号分隔',
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
      customHomepageHint: '设置自定义URL作为首页伪装\u3002访问根路径 / 时将显示该URL的内容\u3002留空则显示默认终端页面\u3002',
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
      autoSubscriptionCopied: '自动识别订阅链接已复制\uFF0C客户端访问时会根据User-Agent自动识别并返回对应格式',
      altPasswordPlaceholder: '留空则自动使用 UUID',
      altPasswordHint: '设置自定义 Trojan 密码\u3002留空则使用 UUID\u3002客户端会自动对密码进行 SHA224 哈希\u3002',
      protocolHint: '可以同时启用多个协议\u3002订阅将生成选中协议的节点\u3002<br>\u2022 VLESS WS: 基于 WebSocket 的标准协议<br>\u2022 Trojan: 使用 SHA224 密码认证<br>\u2022 xhttp: 基于 HTTP POST 的伪装协议\uFF08需要绑定自定义域名并开启 gRPC\uFF09',
      enableECH: '启用 ECH (Encrypted Client Hello)',
      enableECHHint: '启用后\uFF0C每次刷新订阅时会自动从 DoH 获取最新的 ECH 配置并添加到链接中',
      customDNS: '自定义 DNS 服务器',
      customDNSPlaceholder: '例如: https://223.5.5.5/dns-query',
      customDNSHint: '用于ECH配置查询的DNS服务器地址\uFF08DoH格式\uFF09',
      customECHDomain: '自定义 ECH 域名',
      customECHDomainPlaceholder: '例如: cloudflare-ech.com',
      customECHDomainHint: 'ECH配置中使用的域名\uFF0C留空则使用默认值',
      alpn: 'TLS ALPN',
      alpnDefault: '默认\uFF08留空\uFF0C由客户端协商\uFF09',
      alpnHint: '仅添加到 TLS 节点链接参数\uFF1B留空则不写 alpn\u3002',
      saveProtocol: '保存协议配置',
      subscriptionConverterPlaceholder: '默认: https://url.v1.mk/sub',
      subscriptionConverterHint: '订阅转换已内部实现\uFF0C无需外部 API\u3002此项仅作兼容保留\uFF0C可留空\u3002',
      builtinPreferredHint: '控制订阅中包含哪些内置优选节点\u3002默认全部启用\u3002',
      apiEnabledDefault: '默认\uFF08关闭API\uFF09',
      apiEnabledYes: '开启API管理',
      apiEnabledHint: '\u26A0️ 安全提醒\uFF1A开启后允许通过API动态添加优选IP\u3002建议仅在需要时开启\u3002',
      regionMatchingDefault: '默认\uFF08启用地区匹配\uFF09',
      regionMatchingNo: '关闭地区匹配',
      regionMatchingHint: '设置为"关闭"时不进行地区智能匹配',
      downgradeControlDefault: '优先走代理\uFF08默认\uFF09',
      downgradeControlNo: '优先直连\uFF0C失败再走代理',
      downgradeControlOnly: '只走代理\uFF0C不回落',
      downgradeControlHint: '没填代理时三个选项都一样\uFF0C都是直连\u3002只走代理时连不上就断开\uFF0C出口 IP 不会漏',
      tlsControlDefault: '默认\uFF08保留所有节点\uFF09',
      tlsControlYes: '仅TLS节点',
      tlsControlHint: '设置为"仅TLS节点"时只生成带TLS的节点\uFF0C不生成非TLS节点\uFF08如80端口\uFF09',
      preferredControlDefault: '默认\uFF08启用优选\uFF09',
      preferredControlYes: '关闭优选',
      preferredControlHint: '设置为"关闭优选"时只使用原生地址\uFF0C不生成优选IP和域名节点',
      regionNames: {
        CF: '\uD83C\uDF10 官方直连',
        HK: '\uD83C\uDDED\uD83C\uDDF0 香港',
        US: '\uD83C\uDDFA\uD83C\uDDF8 美国',
        SG: '\uD83C\uDDF8\uD83C\uDDEC 新加坡',
        JP: '\uD83C\uDDEF\uD83C\uDDF5 日本',
        KR: '\uD83C\uDDF0\uD83C\uDDF7 韩国',
        DE: '\uD83C\uDDE9\uD83C\uDDEA 德国',
        SE: '\uD83C\uDDF8\uD83C\uDDEA 瑞典',
        NL: '\uD83C\uDDF3\uD83C\uDDF1 荷兰',
        FI: '\uD83C\uDDEB\uD83C\uDDEE 芬兰',
        GB: '\uD83C\uDDEC\uD83C\uDDE7 英国'
      },
      terminal: 'CFBox 终端 v1.1',
      githubProject: 'GitHub 项目',
      PrefUtil: '优选工具',
      autoDetectClient: '自动识别',
      selectionLogicText: '同地区 \u2192 邻近地区 \u2192 其他地区',
      customIPDisabledHint: '使用自定义ProxyIP时\uFF0C地区选择已禁用',
      customIPMode: '自定义ProxyIP模式 (p变量启用)',
      customIPModeDesc: '自定义IP模式 (已禁用地区匹配)',
      usingCustomProxyIP: '使用自定义ProxyIP: ',
      customIPConfig: ' (p变量配置)',
      customIPModeDisabled: '自定义IP模式\uFF0C地区选择已禁用',
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
      kvNotConfigured: 'KV存储未配置\uFF0C无法使用配置管理功能\u3002\\n\\n请在Cloudflare Workers中:\\n1. 创建KV命名空间\\n2. 绑定环境变量 C\\n3. 重新部署代码',
      kvNotEnabled: 'KV存储未配置',
      kvCheckFailed: 'KV存储检测失败: 响应格式错误',
      kvCheckFailedStatus: 'KV存储检测失败 - 状态码: ',
      kvCheckFailedError: 'KV存储检测失败 - 错误: '
    },
    fa: {
      title: 'مدیریت اشتراک CFBox',
      subtitle: 'پشتیبانی چند کلاینت \u2022 انتخاب هوشمند \u2022 تولید یک کلیکی',
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
      onlineOptimizeDesc: 'بهینه‌سازی بلادرنگ از طریق مرورگر\u060C بدون نیاز به نصب',
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
      loadingTools: 'در حال دریافت فهرست ابزارها\u2026',
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
      startPreferredDone: 'انتخاب کامل شد\u060C در لیست سفارشی قرار گرفت',
      startPreferredFail: 'انتخاب ناموفق بود\u060C دوباره تلاش کنید',
      subscriptionInterface: 'رابط اشتراک',
      subscriptionInterfacePlaceholder: 'https://url.v1.mk/sub',
      subscriptionInterfaceHint: 'آدرس رابط تبدیل اشتراک برای تبدیل فرمت گره‌ها',
      chainProxy: 'پروکسی زنجیره‌ای',
      chainProxyPlaceholder: 'user:pass@host:port یا http://user:pass@host:port',
      chainProxyHint: 'آدرس پروکسی خروجی برای ارسال تمام ترافیک خروجی',
      advancedSection: 'تنظیمات پیشرفته',
      subModeHint: 'روش تولید IP برتر را انتخاب کنید\u061B پس از ذخیره\u060C در آدرس /sub اعمال می‌شود',
      subRandomCount: 'تعداد انتخاب تصادفی',
      subPort: 'پورت برتر مشخص',
      subPortRandom: 'پورت تصادفی',
      subCustomIPs: 'برتر سفارشی (هر خط یک مورد)',
      subCustomIPsPlaceholder: '104.16.0.1:443\nزیردامنه:پورت#یادداشت\nsub://آدرس API برتر\nhttps://آدرس API برتر',
      subCustomIPsHint: 'پشتیبانی از IP/دامنه:پورت#یادداشت\u060C sub://API برتر\u060C https://API برتر (تجمیع و حذف تکراری)',
      subGenerator: 'تولیدکننده اشتراک برتر',
      subName: 'نام اشتراک',
      subUpdateTime: 'زمان به‌روزرسانی اشتراک (ساعت)',
      subUpdateTimeHint: 'فاصله به‌روزرسانی خودکار اشتراک در کلاینت',
      netTestHint: 'برای بررسی اتصال سرویس‌ها روی \xABتست یکباره رسانه/هوش مصنوعی\xBB کلیک کنید',
      nodeSpeedTest: 'تست سرعت گره فعلی',
      checking: 'در حال بررسی...',
      workerRegion: 'منطقه Worker: ',
      detectionMethod: 'روش تشخیص: ',
      proxyIPStatus: 'وضعیت ProxyIP: ',
      currentIP: 'IP فعلی: ',
      regionMatch: 'تطبیق منطقه: ',
      selectionLogic: 'منطق انتخاب: ',
      kvStatusChecking: 'در حال بررسی وضعیت KV...',
      kvEnabled: '\u2705 ذخیره‌سازی KV فعال است\u060C می‌توانید از مدیریت تنظیمات استفاده کنید',
      kvDisabled: '\uD83D\uDCA1 ذخیره‌سازی KV یافت نشد (حالت فقط‌خواندنی)',
      specifyRegion: 'تعیین منطقه',
      autoDetect: 'اتصال مستقیم رسمی',
      saveRegion: 'ذخیره تنظیمات منطقه',
      protocolSelection: 'انتخاب پروتکل:',
      enableProtoV: 'فعال‌سازی پروتکل VLESS',
      enableProtoT: 'فعال‌سازی پروتکل Trojan',
      enableXhttp: 'فعال‌سازی پروتکل xhttp',
      enableECH: 'فعال‌سازی ECH (Encrypted Client Hello)',
      enableECHHint: 'پس از فعال‌سازی\u060C در هر بار تازه‌سازی اشتراک\u060C پیکربندی ECH به‌روز به‌طور خودکار از DoH دریافت شده و به لینک‌ها اضافه می‌شود',
      customDNS: 'سرور DNS سفارشی',
      customDNSPlaceholder: 'مثال: https://223.5.5.5/dns-query',
      customDNSHint: 'آدرس سرور DNS برای جستجوی پیکربندی ECH (فرمت DoH)',
      customECHDomain: 'دامنه ECH سفارشی',
      customECHDomainPlaceholder: 'مثال: cloudflare-ech.com',
      customECHDomainHint: 'دامنه استفاده شده در پیکربندی ECH\u060C خالی بگذارید تا از مقدار پیش‌فرض استفاده شود',
      altPassword: 'رمز عبور Trojan',
      customPath: 'مسیر سفارشی',
      customIP: 'ProxyIP سفارشی',
      preferredIPs: 'لیست IP ترجیحی',
      preferredIPsURL: 'URL منبع IP ترجیحی',
      latencyTest: 'تست تاخیر',
      latencyTestIP: 'IP/دامنه تست:',
      latencyTestIPPlaceholder: 'IP یا دامنه وارد کنید\u060C چند مورد با کاما جدا شوند',
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
      autoSubscriptionCopied: 'لینک اشتراک تشخیص خودکار کپی شد\u060C کلاینت هنگام دسترسی بر اساس User-Agent به طور خودکار تشخیص داده و قالب مربوطه را برمی‌گرداند',
      altPasswordPlaceholder: 'خالی بگذارید تا از UUID استفاده شود',
      altPasswordHint: 'رمز عبور Trojan سفارشی را تنظیم کنید. اگر خالی بگذارید از UUID استفاده می‌شود. کلاینت به طور خودکار رمز عبور را با SHA224 هش می‌کند.',
      protocolHint: 'می‌توانید چندین پروتکل را همزمان فعال کنید. اشتراک گره‌های پروتکل‌های انتخاب شده را تولید می‌کند.<br>\u2022 VLESS WS: پروتکل استاندارد مبتنی بر WebSocket<br>\u2022 Trojan: احراز هویت با رمز عبور SHA224<br>\u2022 xhttp: پروتکل استتار مبتنی بر HTTP POST (نیاز به اتصال دامنه سفارشی و فعال‌سازی gRPC دارد)',
      alpn: 'TLS ALPN',
      alpnDefault: 'پیش‌فرض (خالی\u060C مذاکره توسط کلاینت)',
      alpnHint: 'فقط به لینک‌های TLS اضافه می‌شود\u061B اگر خالی باشد alpn نوشته نمی‌شود.',
      saveProtocol: 'ذخیره تنظیمات پروتکل',
      subscriptionConverterPlaceholder: 'پیش‌فرض: https://url.v1.mk/sub',
      subscriptionConverterHint: 'تبدیل اشتراک به صورت داخلی پیاده‌سازی شده است و نیازی به API خارجی ندارد. این فیلد فقط برای سازگاری حفظ شده و می‌توان آن را خالی گذاشت.',
      builtinPreferredHint: 'کنترل اینکه کدام گره‌های ترجیحی داخلی در اشتراک گنجانده شوند. به طور پیش‌فرض همه فعال هستند.',
      apiEnabledDefault: 'پیش‌فرض (بستن API)',
      apiEnabledYes: 'فعال‌سازی مدیریت API',
      apiEnabledHint: '\u26A0️ هشدار امنیتی: فعال‌سازی این گزینه اجازه می‌دهد IP های ترجیحی از طریق API به طور پویا اضافه شوند. توصیه می‌شود فقط در صورت نیاز فعال کنید.',
      regionMatchingDefault: 'پیش‌فرض (فعال‌سازی تطبیق منطقه)',
      regionMatchingNo: 'بستن تطبیق منطقه',
      regionMatchingHint: 'وقتی "بستن" تنظیم شود\u060C تطبیق هوشمند منطقه انجام نمی‌شود',
      downgradeControlDefault: 'اولویت با پروکسی (پیش‌فرض)',
      downgradeControlNo: 'اولویت با اتصال مستقیم\u060C در صورت خطا پروکسی',
      downgradeControlOnly: 'فقط پروکسی\u060C بدون بازگشت',
      downgradeControlHint: 'اگر پروکسی تنظیم نشده باشد هر سه گزینه یکسان و مستقیم هستند. در حالت فقط پروکسی\u060C اتصال ناموفق قطع می‌شود و IP خروجی فاش نمی‌شود',
      tlsControlDefault: 'پیش‌فرض (حفظ همه گره‌ها)',
      tlsControlYes: 'فقط گره‌های TLS',
      tlsControlHint: 'وقتی "فقط گره‌های TLS" تنظیم شود\u060C فقط گره‌های با TLS تولید می‌شوند\u060C گره‌های غیر TLS (مانند پورت 80) تولید نمی‌شوند',
      preferredControlDefault: 'پیش‌فرض (فعال‌سازی ترجیح)',
      preferredControlYes: 'بستن ترجیح',
      preferredControlHint: 'وقتی "بستن ترجیح" تنظیم شود\u060C فقط از آدرس اصلی استفاده می‌شود\u060C گره‌های IP و دامنه ترجیحی تولید نمی‌شوند',
      regionNames: {
        CF: '\uD83C\uDF10 مستقیم رسمی',
        HK: '\uD83C\uDDED\uD83C\uDDF0 هنگ کنگ',
        US: '\uD83C\uDDFA\uD83C\uDDF8 آمریکا',
        SG: '\uD83C\uDDF8\uD83C\uDDEC سنگاپور',
        JP: '\uD83C\uDDEF\uD83C\uDDF5 ژاپن',
        KR: '\uD83C\uDDF0\uD83C\uDDF7 کره جنوبی',
        DE: '\uD83C\uDDE9\uD83C\uDDEA آلمان',
        SE: '\uD83C\uDDF8\uD83C\uDDEA سوئد',
        NL: '\uD83C\uDDF3\uD83C\uDDF1 هلند',
        FI: '\uD83C\uDDEB\uD83C\uDDEE فنلاند',
        GB: '\uD83C\uDDEC\uD83C\uDDE7 بریتانیا'
      },
      terminal: 'ترمینال v1.1',
      githubProject: 'پروژه GitHub',
      PrefUtil: 'ابزار ترجیح IP',
      autoDetectClient: 'تشخیص خودکار',
      selectionLogicText: 'هم‌منطقه \u2192 منطقه مجاور \u2192 سایر مناطق',
      customIPDisabledHint: 'هنگام استفاده از ProxyIP سفارشی\u060C انتخاب منطقه غیرفعال است',
      customIPMode: 'حالت ProxyIP سفارشی (متغیر p فعال است)',
      customIPModeDesc: 'حالت IP سفارشی (تطبیق منطقه غیرفعال است)',
      usingCustomProxyIP: 'استفاده از ProxyIP سفارشی: ',
      customIPConfig: ' (پیکربندی متغیر p)',
      customIPModeDisabled: 'حالت IP سفارشی\u060C انتخاب منطقه غیرفعال است',
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
      kvNotConfigured: 'ذخیره‌سازی KV پیکربندی نشده است\u060C نمی‌توانید از عملکرد مدیریت تنظیمات استفاده کنید.\\n\\nلطفا در Cloudflare Workers:\\n1. فضای نام KV ایجاد کنید\\n2. متغیر محیطی C را پیوند دهید\\n3. کد را دوباره مستقر کنید',
      kvNotEnabled: 'ذخیره‌سازی KV پیکربندی نشده است',
      kvCheckFailed: 'بررسی ذخیره‌سازی KV ناموفق: خطای فرمت پاسخ',
      kvCheckFailedStatus: 'بررسی ذخیره‌سازی KV ناموفق - کد وضعیت: ',
      kvCheckFailedError: 'بررسی ذخیره‌سازی KV ناموفق - خطا: '
    },
    en: {
      title: 'CFBox Subscription Manager',
      subtitle: 'Multi-client support \u2022 Smart IP selection \u2022 One-click generation \u2022 Free self-hosted',
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
      kvEnabled: '\u2705 KV storage enabled, config management is available',
      kvDisabled: '\uD83D\uDCA1 KV storage not detected (read-only mode)',
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
      protocolHint: 'Multiple protocols can be enabled at the same time. The subscription will generate nodes for selected protocols.<br>\u2022 VLESS WS: Standard WebSocket-based protocol<br>\u2022 Trojan: SHA224 password authentication<br>\u2022 xhttp: HTTP POST disguise protocol (requires custom domain with gRPC enabled)',
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
      apiEnabledHint: '\u26A0️ Security: enables dynamically adding preferred IPs via API. Recommended only when needed.',
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
        CF: '\uD83C\uDF10 Official Direct',
        HK: '\uD83C\uDDED\uD83C\uDDF0 Hong Kong',
        US: '\uD83C\uDDFA\uD83C\uDDF8 United States',
        SG: '\uD83C\uDDF8\uD83C\uDDEC Singapore',
        JP: '\uD83C\uDDEF\uD83C\uDDF5 Japan',
        KR: '\uD83C\uDDF0\uD83C\uDDF7 South Korea',
        DE: '\uD83C\uDDE9\uD83C\uDDEA Germany',
        SE: '\uD83C\uDDF8\uD83C\uDDEA Sweden',
        NL: '\uD83C\uDDF3\uD83C\uDDF1 Netherlands',
        FI: '\uD83C\uDDEB\uD83C\uDDEE Finland',
        GB: '\uD83C\uDDEC\uD83C\uDDE7 United Kingdom'
      },
      terminal: 'CFBox Terminal v1.1',
      githubProject: 'GitHub Project',
      PrefUtil: 'Preferred Tools',
      autoDetectClient: 'Auto Detect',
      selectionLogicText: 'Same region \u2192 Neighboring region \u2192 Other regions',
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
    }
  };
  ;
  const val523_21 = aux719_29[srv650_27] || aux719_29['zh'];
  const map1364_56 = link1087_45.headers.get('CF-Connecting-IP') || link1087_45.headers.get('True-Client-IP') || (link1087_45.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '未知';
  const map860_35 = `<!DOCTYPE html>
    <html lang="${ ws652_27 }" dir="${ node582_24 ? 'rtl' : 'ltr' }">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${ val523_21['title'] }</title>
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
            .cp-toast-success {
                background: linear-gradient(135deg, #00c853, #00b894) !important;
                border: 1px solid #00ff9d !important;
                color: #fff !important;
                text-shadow: 0 0 6px rgba(255,255,255,.45) !important;
                box-shadow: 0 10px 30px rgba(0,255,157,.35) !important;
            }
            .cp-toast-error {
                background: linear-gradient(135deg, #ff3860, #d63031) !important;
                border: 1px solid #ff7a94 !important;
                color: #fff !important;
                text-shadow: 0 0 6px rgba(255,255,255,.4) !important;
                box-shadow: 0 10px 30px rgba(255,56,96,.35) !important;
            }
            .cp-toast-warn {
                background: linear-gradient(135deg, #ffb400, #f39c12) !important;
                border: 1px solid #ffe08a !important;
                color: #1a1200 !important;
                box-shadow: 0 10px 30px rgba(255,180,0,.35) !important;
            }
            .cp-toast-info {
                background: linear-gradient(135deg, #00f0ff, #0091ff) !important;
                border: 1px solid #aef6ff !important;
                color: #00222b !important;
                box-shadow: 0 10px 30px rgba(0,240,255,.35) !important;
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
                <span class="cp-hud-line">${ srv650_27 === 'fa' ? 'آدرس IP فعلی شما' : srv650_27 === 'en' ? 'Your current IP address' : '您当前IP地址' }：${ map1364_56 }<span id="currentIPRegion" style="color: #ffb400;"></span></span>
                <div class="cp-lang-wrapper">
                    <button type="button" id="cpModeToggle" class="cp-mode-toggle" onclick="SwitchMode()" title="${ val523_21['modeSwitchHint'] }">
                        <span class="cp-mode-icon" id="cpModeIcon">◆</span>
                        <span id="cpModeLabel">${ val523_21['modeStandard'] }</span>
                    </button>
                    <select id="languageSelector" onchange="SwitchLang(this.value)">
                        <option value="zh" ${ srv650_27 === 'zh' ? 'selected' : '' }>🇨🇳 中文</option>
                        <option value="fa" ${ srv650_27 === 'fa' ? 'selected' : '' }>🇮🇷 فارسی</option>
                        <option value="en" ${ srv650_27 === 'en' ? 'selected' : '' }>🇺🇸 English</option>
                    </select>
                </div>
            </div>
        <script>
            // 当前IP地区检测 (多源 JSONP: ping0.cc 主源 + ipinfo.io 备用, script 加载不受 CORS 限制)
            window.cfboxRegionCallback = function (a, b, c, d, e) {
                var el = document.getElementById('currentIPRegion');
                if (!el || window.__cfRegionDone) return;
                var loc = null;
                if (b) {
                    loc = b;
                } else if (a && typeof a === 'object') {
                    loc = [a.country, a.region, a.city].filter(function (x) { return x; }).join(' ');
                }
                if (loc) {
                    el.textContent = ' · ' + loc;
                    window.__cfRegionDone = true;
                }
            };
            (function () {
                window.__cfRegionDone = false;
                var sources = [
                    'https://ipv4.ping0.cc/geo/jsonp/cfboxRegionCallback',
                    'https://ipinfo.io/?callback=cfboxRegionCallback'
                ];
                var idx = 0;
                function loadNext() {
                    if (window.__cfRegionDone || idx >= sources.length) return;
                    var src = sources[idx++];
                    try {
                        var s = document.createElement('script');
                        s.src = src;
                        s.async = true;
                        s.onerror = function () { loadNext(); };
                        (document.head || document.documentElement).appendChild(s);
                    } catch (e) {}
                }
                loadNext();
                setTimeout(function () {
                    if (!window.__cfRegionDone && idx < sources.length) loadNext();
                }, 4000);
            })();
        </script>
        <div class="container">
            <div class="header">
                    <h1 class="title cp-glitch" data-text="${ val523_21['title'] }">${ val523_21['title'] }</h1>
                    <p class="subtitle">${ val523_21['subtitle'] }</p>
            </div>
            <div class="left-column">
<div class="card panel-right-card">
                    <h2 class="card-title">${ val523_21['systemStatus'] }</h2>
                <div id="systemStatus" style="margin: 20px 0; padding: 15px; background: rgba(8, 4, 28, 0.8); border: 2px solid #00f0ff; box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 15px rgba(0, 240, 255, 0.1); position: relative; overflow: hidden;">
                        <div style="color: #00f0ff; margin-bottom: 15px; font-weight: bold; text-shadow: 0 0 5px #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem;">${ val523_21['checking'] }</div>
                        <div id="regionStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${ val523_21['workerRegion'] }${ val523_21['checking'] }</div>
                        <div id="geoInfo" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${ val523_21['detectionMethod'] }${ val523_21['checking'] }</div>
                        <div id="backupStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${ val523_21['proxyIPStatus'] }${ val523_21['checking'] }</div>
                        <div id="currentIP" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${ val523_21['currentIP'] }${ val523_21['checking'] }</div>
                        <div id="echStatus" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">ECH状态: ${ val523_21['checking'] }</div>
                        <div id="regionMatch" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${ val523_21['regionMatch'] }${ val523_21['checking'] }</div>
                        <div id="selectionLogic" style="margin: 8px 0; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 0.9rem; text-shadow: 0 0 3px #00f0ff;">${ val523_21['selectionLogic'] }${ val523_21['selectionLogicText'] }</div>
                </div>
                </div>
<div class="card" id="configCard" style="display: none;">
                    <h2 class="card-title">${ val523_21['configManagement'] }</h2>
                <div id="kvStatus" style="margin-bottom: 20px; padding: 10px; background: rgba(8, 4, 28, 0.8); border: 1px solid #00f0ff; color: #00f0ff;">
                    ${ val523_21['kvStatusChecking'] }
                </div>
                <div id="configContent" style="display: none;">
                    <form id="regionForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['specifyRegion'] }</label>
                            <select id="wkRegion" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${ val523_21['autoDetect'] }</option>
                                    <option value="HK">${ val523_21['regionNames']['HK'] }</option>
                                    <option value="US">${ val523_21['regionNames']['US'] }</option>
                                    <option value="SG">${ val523_21['regionNames']['SG'] }</option>
                                    <option value="JP">${ val523_21['regionNames']['JP'] }</option>
                                    <option value="KR">${ val523_21['regionNames']['KR'] }</option>
                                    <option value="DE">${ val523_21['regionNames']['DE'] }</option>
                                    <option value="SE">${ val523_21['regionNames']['SE'] }</option>
                                    <option value="NL">${ val523_21['regionNames']['NL'] }</option>
                                    <option value="FI">${ val523_21['regionNames']['FI'] }</option>
                                    <option value="GB">${ val523_21['regionNames']['GB'] }</option>
                            </select>
                                <small id="wkRegionHint" style="color: #7aa9c4; font-size: 0.85rem; display: none;">⚠️ ${ val523_21['customIPDisabledHint'] }</small>
                        </div>
                    </form>
                    <form id="otherConfigForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['protocolSelection'] }</label>
                            <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="ev" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${ val523_21['enableProtoV'] }</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="et" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${ val523_21['enableProtoT'] }</span>
                                    </label>
                                </div>
                                <div style="margin-bottom: 10px;">
                                    <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                        <input type="checkbox" id="ex" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                            <span style="font-size: 1.1rem;">${ val523_21['enableXhttp'] }</span>
                                    </label>
                                </div>
                                <div class="advanced-item" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 240, 255, 0.3);">
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                                            <input type="checkbox" id="ech" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                                                <span style="font-size: 1.1rem;">${ val523_21['enableECH'] }</span>
                                        </label>
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px; margin-left: 26px;">${ val523_21['enableECHHint'] }</small>
                                    </div>
                                    <div style="margin-top: 15px; margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${ val523_21['customDNS'] }</label>
                                        <input type="text" id="customDNS" placeholder="${ val523_21['customDNSPlaceholder'] }" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${ val523_21['customDNSHint'] }</small>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${ val523_21['customECHDomain'] }</label>
                                        <input type="text" id="customECHDomain" placeholder="${ val523_21['customECHDomainPlaceholder'] }" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${ val523_21['customECHDomainHint'] }</small>
                                    </div>
                                    <div style="margin-bottom: 10px;">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${ val523_21['alpn'] }</label>
                                        <select id="alpn" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                            <option value="">${ val523_21['alpnDefault'] }</option>
                                            <option value="h3">h3</option>
                                            <option value="h2">h2</option>
                                            <option value="http/1.1">http/1.1</option>
                                            <option value="h3,h2">h3,h2</option>
                                            <option value="h2,http/1.1">h2,http/1.1</option>
                                            <option value="h3,h2,http/1.1">h3,h2,http/1.1</option>
                                        </select>
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${ val523_21['alpnHint'] }</small>
                                    </div>
                                </div>
                                <div class="advanced-item" style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(0, 240, 255, 0.3);">
                                        <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-size: 0.95rem;">${ val523_21['altPassword'] }</label>
                                        <input type="text" id="tp" placeholder="${ val523_21['altPasswordPlaceholder'] }" style="width: 100%; padding: 10px; background: rgba(0, 0, 0, 0.8); border: 1px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 13px;">
                                        <small style="color: #7aa9c4; font-size: 0.8rem; display: block; margin-top: 5px;">${ val523_21['altPasswordHint'] }</small>
                                </div>
                                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">${ val523_21['protocolHint'] }</small>
                            </div>
                        </div>
                        </form>


                    <div id="currentConfig" style="display:none; background: rgba(0, 0, 0, 0.9); border: 1px solid #00f0ff; padding: 15px; margin: 10px 0; font-family: 'Courier New', monospace; color: #00f0ff;">
                            ${ val523_21['loading'] }
                    </div>
                </div>
                <div id="statusMessage" style="display: none; padding: 10px; margin: 10px 0; border: 1px solid #00f0ff; background: rgba(8, 4, 28, 0.8); color: #00f0ff; text-shadow: 0 0 5px #00f0ff;"></div>
            </div>
<div class="card panel-right-card" id="preferredSubCard">
                <h2 class="card-title" style="margin:0;">${ val523_21['preferredSubGen'] }</h2>
                <div style="margin-top:14px;border-top:1px solid rgba(0,240,255,.15);padding-top:12px;">
                    <div style="margin-bottom:12px;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['subMode'] }</label>
                        <select id="subMode" onchange="UpdateSubModeUi()" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;cursor:pointer;">
                            <option value="">${ val523_21['subModeOff'] }</option>
                            <option value="generator">${ val523_21['subModeGenerator'] }</option>
                            <option value="random">${ val523_21['subModeRandom'] }</option>
                            <option value="custom" selected>${ val523_21['subModeCustom'] }</option>
                        </select>
                        <small style="color:#7aa9c4;font-size:0.8rem;display:block;margin-top:5px;">${ val523_21['subModeHint'] }</small>
                    </div>
                    <div id="subRandomSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['subRandomCount'] }</label>
                        <input type="number" id="subRandomCount" value="16" min="1" max="99" oninput="if(this.value>99){this.value=99;}" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                    </div>
                    <div id="subPortSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['subPort'] }</label>
                        <select id="subPort" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;cursor:pointer;">
                            <option value="-1">${ val523_21['subPortRandom'] }</option>
                            <option value="443">443</option>
                            <option value="2053">2053</option>
                            <option value="2083">2083</option>
                            <option value="2087">2087</option>
                            <option value="2096">2096</option>
                            <option value="8443">8443</option>
                        </select>
                    </div>
                    <div id="subCustomSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['subCustomIPs'] }</label>
                        <textarea id="subCustomIPs" rows="4" placeholder="${ val523_21['subCustomIPsPlaceholder'] }" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;resize:vertical;">
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
                        <small style="color:#7aa9c4;font-size:0.8rem;display:block;margin-top:5px;">${ val523_21['subCustomIPsHint'] }</small>
                    </div>
                    <div id="subGeneratorSection" style="margin-bottom:12px;display:none;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['subGenerator'] }</label>
                        <input type="text" id="subGenerator" placeholder="sub.cmliussss.net" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['subName'] }</label>
                        <input type="text" id="subName" placeholder="CFBox" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                    </div>
                    <div style="margin-bottom:12px;">
                        <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['subUpdateTime'] }</label>
                        <input type="number" id="subUpdateTime" value="3" min="1" max="168" style="width:100%;padding:10px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
                        <small style="color:#7aa9c4;font-size:0.8rem;display:block;margin-top:5px;">${ val523_21['subUpdateTimeHint'] }</small>
                    </div>
                </div>
            </div>
<div class="card advanced-module" id="customSettingsCard" style="display:none;">
  <h2 class="card-title">${ val523_21['customSettings'] }</h2>
  <div style="margin-bottom:15px;">
    <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['customHomepage'] }</label>
    <input type="text" id="customHomepage" placeholder="${ val523_21['customHomepagePlaceholder'] }" style="width:100%;padding:12px;background:rgba(0,0,0,.8);border:2px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:14px;box-sizing:border-box;">
    <small style="color:#7aa9c4;font-size:0.85rem;display:block;margin-top:4px;">${ val523_21['customHomepageHint'] }</small>
  </div>
  <div style="margin-bottom:15px;">
    <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['customPath'] }</label>
    <input type="text" id="customPath" placeholder="${ srv650_27 === 'fa' ? 'مثال: /mypath یا خالی بگذارید تا از UUID استفاده شود' : srv650_27 === 'en' ? 'e.g. /mypath or leave empty to use UUID' : '例如: /mypath 或留空使用 UUID' }" style="width:100%;padding:12px;background:rgba(0,0,0,.8);border:2px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:14px;box-sizing:border-box;">
    <small style="color:#7aa9c4;font-size:0.85rem;display:block;margin-top:4px;">${ srv650_27 === 'fa' ? 'مسیر اشتراک سفارشی. اگر خالی بگذارید از UUID به عنوان مسیر استفاده می‌شود.' : srv650_27 === 'en' ? 'Custom subscription path. Leave empty to use UUID as the path.' : '自定义订阅路径\u3002留空则使用 UUID 作为路径\u3002' }</small>
  </div>
  <div>
    <label style="display:block;margin-bottom:6px;color:#00f0ff;font-size:0.9rem;">${ val523_21['customIP'] }</label>
    <input type="text" id="customIP" placeholder="${ srv650_27 === 'fa' ? 'مثال: 1.2.3.4:443' : srv650_27 === 'en' ? 'e.g. 1.2.3.4:443' : '例如: 1.2.3.4:443' }" style="width:100%;padding:12px;background:rgba(0,0,0,.8);border:2px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:14px;box-sizing:border-box;">
    <small style="color:#7aa9c4;font-size:0.85rem;display:block;margin-top:4px;">${ srv650_27 === 'fa' ? 'آدرس و پورت ProxyIP سفارشی' : srv650_27 === 'en' ? 'Custom ProxyIP address and port' : '自定义ProxyIP地址和端口' }</small>
  </div>
</div>
</div>
<div class="right-column">
<div class="card panel-right-card">
                    <h2 class="card-title">${ val523_21['selectClient'] }</h2>
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
                <h2 class="card-title">${ val523_21['builtinPreferred'] }</h2>
                <div style="padding: 15px; background: rgba(15, 3, 40, 0.6); border: 1px solid #00f0ff; border-radius: 5px;">
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="ena" style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${ val523_21['enableNativeAddress'] }</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="epd" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${ val523_21['enablePreferredDomain'] }</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="epi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${ val523_21['enablePreferredIP'] }</span>
                        </label>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <label style="display: inline-flex; align-items: center; cursor: pointer; color: #00f0ff;">
                            <input type="checkbox" id="egi" checked style="margin-right: 8px; width: 18px; height: 18px; cursor: pointer;">
                            <span style="font-size: 1.1rem;">${ val523_21['enableGitHubPreferred'] }</span>
                        </label>
                    </div>
                    <small style="color: #7aa9c4; font-size: 0.85rem; display: block; margin-top: 10px;">${ val523_21['builtinPreferredHint'] }</small>
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

                    <h2 class="card-title">${ val523_21['advancedControl'] }</h2>
                    <form id="advancedConfigForm" style="margin-bottom: 20px;">
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['subscriptionConverter'] }</label>
                                <input type="text" id="scu" placeholder="${ val523_21['subscriptionConverterPlaceholder'] }" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${ val523_21['subscriptionConverterHint'] }</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['allowAPIManagement'] }</label>
                            <select id="apiEnabled" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${ val523_21['apiEnabledDefault'] }</option>
                                    <option value="yes">${ val523_21['apiEnabledYes'] }</option>
                            </select>
                                <small style="color: #ffb400; font-size: 0.85rem;">${ val523_21['apiEnabledHint'] }</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['regionMatching'] }</label>
                            <select id="regionMatching" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${ val523_21['regionMatchingDefault'] }</option>
                                    <option value="no">${ val523_21['regionMatchingNo'] }</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${ val523_21['regionMatchingHint'] }</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['downgradeControl'] }</label>
                            <select id="downgradeControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${ val523_21['downgradeControlDefault'] }</option>
                                    <option value="no">${ val523_21['downgradeControlNo'] }</option>
                                    <option value="only">${ val523_21['downgradeControlOnly'] }</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${ val523_21['downgradeControlHint'] }</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['tlsControl'] }</label>
                            <select id="portControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${ val523_21['tlsControlDefault'] }</option>
                                    <option value="yes">${ val523_21['tlsControlYes'] }</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${ val523_21['tlsControlHint'] }</small>
                        </div>
                        <div style="margin-bottom: 15px;">
                                <label style="display: block; margin-bottom: 8px; color: #00f0ff; font-weight: bold; text-shadow: 0 0 3px #00f0ff;">${ val523_21['preferredControl'] }</label>
                            <select id="preferredControl" style="width: 100%; padding: 12px; background: rgba(0, 0, 0, 0.8); border: 2px solid #00f0ff; color: #00f0ff; font-family: 'Courier New', monospace; font-size: 14px;">
                                    <option value="">${ val523_21['preferredControlDefault'] }</option>
                                    <option value="yes">${ val523_21['preferredControlYes'] }</option>
                            </select>
                                <small style="color: #7aa9c4; font-size: 0.85rem;">${ val523_21['preferredControlHint'] }</small>
                        </div>
                    </form>
                    </div>
<div class="card panel-right-card">
                <h2 class="card-title" style="margin:0;">${ val523_21['networkTest'] }</h2>
                <div id="netTestResults" style="display:none;margin-top:12px;font-family:'Courier New',monospace;font-size:0.86rem;">
                    <div style="color:#7aa9c4;text-align:center;padding:8px 0;">${ val523_21['netTestHint'] }</div>
                </div>
                <div style="margin-top:14px;border-top:1px solid rgba(0,240,255,.15);padding-top:12px;">
                    <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;">
                        <button type="button" id="netTestBtn" onclick="RunNetTest()" style="background:linear-gradient(90deg,#00f0ff,#a347ff);color:#000;border:none;border-radius:8px;padding:7px 16px;font-weight:bold;cursor:pointer;font-size:0.84rem;">${ val523_21['runNetworkTest'] }</button>
                        <button type="button" id="nodeSpeedBtn" onclick="SpeedtestNode()" style="background:linear-gradient(90deg,#00f0ff,#a347ff);color:#000;border:none;border-radius:8px;padding:7px 16px;font-weight:bold;cursor:pointer;font-size:0.84rem;">${ val523_21['nodeSpeedTest'] }</button>
                    </div>
                    <div id="nodeSpeedResult" style="margin-top:10px;font-family:'Courier New',monospace;font-size:0.86rem;text-align:center;"></div>
                </div>

            </div><div class="card panel-right-card">
                <h2 class="card-title">${ val523_21['currentConfig'] }</h2>
                <div id="pathTypeInfo" style="background: transparent; border: 1px solid #00f0ff; padding: 15px; font-family: 'Courier New', monospace; color: #00f0ff;">
                    <div id="pathTypeStatus">${ val523_21['checking'] }</div>
                </div>
            </div>
<div class="card panel-right-card">
                    <h2 class="card-title">${ val523_21['relatedLinks'] }</h2>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="https://www.youtube.com/@PAI_CN" target="_blank" rel="noopener noreferrer" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">YouTube @PAI_CN</a>
                    <a href="https://t.me/SZ_PAI" target="_blank" rel="noopener noreferrer" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">Telegram @SZ_PAI</a>
                    <a href="https://github.com/PAICNI/CFBox" target="_blank" rel="noopener noreferrer" style="color: #00f0ff; text-decoration: none; margin: 0 20px; font-size: 1.2rem; text-shadow: 0 0 5px #00f0ff;">GitHub@CFBox</a>
                </div>
            </div>
</div>


        </div>
        <div id="cpToastStack" class="cp-toast-stack" aria-live="polite" aria-atomic="false"></div>
        <div id="cpActionStatus" class="cp-action-status" role="status" aria-live="polite"></div>
        <div id="cpActionBar" class="cp-action-bar" role="toolbar" aria-label="${ val523_21['configManagement'] }">
            <button type="button" id="cpBtnSaveAll" class="cp-fab-save" title="${ srv650_27 === 'fa' ? 'ذخیره همه تنظیمات' : srv650_27 === 'en' ? 'Save all settings (Ctrl+S)' : '保存所有配置 (Ctrl+S)' }">
                <span class="cp-fab-icon">▣</span>
                <span>${ srv650_27 === 'fa' ? 'ذخیره همه' : srv650_27 === 'en' ? 'Save All' : '保 存 全 部' }</span>
                <span class="cp-fab-dot" aria-hidden="true"></span>
            </button>
            <button type="button" id="cpBtnRefresh" class="cp-action-btn" data-tip="${ val523_21['refreshConfig'] }" aria-label="${ val523_21['refreshConfig'] }">
                <span aria-hidden="true">↻</span>
                <span class="cp-btn-label">${ val523_21['refreshConfig'] }</span>
            </button>
            <button type="button" id="cpBtnReset" class="cp-action-btn cp-action-btn-danger" data-tip="${ val523_21['resetConfig'] }" aria-label="${ val523_21['resetConfig'] }">
                <span aria-hidden="true">⌫</span>
                <span class="cp-btn-label">${ val523_21['resetConfig'] }</span>
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
  if (label) label.textContent = XXX3 ? '${ val523_21['modeAdvanced'] }' : '${ val523_21['modeStandard'] }';
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
  Items.textContent = '${ val523_21['loadingTools'] }';
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
    if (Btn) { Btn.disabled = false; Btn.textContent = '${ val523_21['verifyApi'] }'; }
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
  if (Status) Status.textContent = '${ val523_21['loadingTools'] }';
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
    if (Btn) { Btn.disabled = false; Btn.textContent = '${ val523_21['verifyChain'] }'; }
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
  btn.textContent = '${ val523_21['checking'] }…';
  if (status) status.textContent = '${ val523_21['startPreferredRunning'] }';
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
      if (status) status.textContent = '${ val523_21['startPreferredDone'] }（' + Data.ips.length + '）';
    } else {
      if (status) status.textContent = '${ val523_21['startPreferredFail'] }';
    }
  } catch (e) {
    if (status) status.textContent = '${ val523_21['startPreferredFail'] }';
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
    Close.addEventListener('click', CloseToast);
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
  // 保存/操作结果提示统一改为右上角 toast（与复制成功提示一致），反差色
  const IsOk20098 = Type20099 === 'success';
  window.ShowToast(Msg20100, IsOk20098 ? 'success' : 'error', {
    title: IsOk20098 ? '✅ 操作成功' : '❌ 操作失败',
    hideIcon: true,
    noClose: true
  });
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
      ShowOpStatus('${ srv650_27 === 'fa' ? 'حداقل یک پروتکل را فعال کنید!' : srv650_27 === 'en' ? 'Please enable at least one protocol!' : '至少需要启用一个协议\uFF01' }', 'err');
      ShowToast('${ srv650_27 === 'fa' ? 'حداقل یک پروتکل را فعال کنید!' : srv650_27 === 'en' ? 'Please enable at least one protocol!' : '至少需要启用一个协议\uFF01' }', 'warn');
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
      ShowOpStatus('${ srv650_27 === 'fa' ? 'تنظیمات تازه‌سازی شد' : srv650_27 === 'en' ? 'Settings refreshed' : '配置已刷新' }');
    } catch (FlushErr) {
      ShowOpStatus('${ srv650_27 === 'fa' ? 'بازخوانی ناموفق بود' : srv650_27 === 'en' ? 'Refresh failed' : '配置刷新失败' }' + (FlushErr && FlushErr.message ? ': ' + FlushErr.message : ''), 'err');
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
      ShowStatus('${ srv650_27 === 'fa' ? 'تولید شد' : srv650_27 === 'en' ? 'Generated' : '已生成' } ' + Count + ' ${ srv650_27 === 'fa' ? 'IP تصادفی CF' : srv650_27 === 'en' ? 'CF random IP(s)' : '个CF随机IP' }', 'success');
    });
  }
  if (GetAddrVal) {
    GetAddrVal.addEventListener('click', async function () {
      const UrlInput = document.getElementById('fetchURLInput');
      const GetUrl = UrlInput.value.trim();
      if (!GetUrl) {
        ShowToast('${ srv650_27 === 'fa' ? 'لطفا URL را وارد کنید' : srv650_27 === 'en' ? 'Please enter URL' : '请输入URL' }', 'warn');
        return;
      }
      GetAddrVal.disabled = true;
      GetAddrVal.textContent = '${ srv650_27 === 'fa' ? 'در حال دریافت...' : srv650_27 === 'en' ? 'Fetching...' : '获取中...' }';
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
          ShowStatus('${ srv650_27 === 'fa' ? 'دریافت شد' : srv650_27 === 'en' ? 'Fetched' : '已获取' } ' + ValItems.length + ' ${ srv650_27 === 'fa' ? 'IP' : srv650_27 === 'en' ? 'IP(s)' : '个IP' }', 'success');
        } else {
          ShowStatus('${ srv650_27 === 'fa' ? 'داده‌ای یافت نشد' : srv650_27 === 'en' ? 'No data found' : '未获取到数据' }', 'error');
        }
      } catch (Err20060) {
        ShowStatus('${ srv650_27 === 'fa' ? 'خطا در دریافت' : srv650_27 === 'en' ? 'Fetch failed' : '获取失败' }: ' + Err20060.message, 'error');
      } finally {
        GetAddrVal.disabled = false;
        GetAddrVal.textContent = '⬇ ${ srv650_27 === 'fa' ? 'دریافت IP' : srv650_27 === 'en' ? 'Fetch IP' : '获取IP' }';
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
        ShowStatus('${ srv650_27 === 'fa' ? 'لطفا IP یا دامنه وارد کنید' : srv650_27 === 'en' ? 'Please enter IP or domain' : '请输入IP或域名' }', 'error');
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
        TestStatus.textContent = '${ srv650_27 === 'fa' ? 'در حال تست' : srv650_27 === 'en' ? 'Testing' : '测试中' }: ' + (IdxVal20037 + 1) + '-' + Math.min(IdxVal20037 + XXX, Local20054) + '/' + Local20054 + ' (${ srv650_27 === 'fa' ? 'رشته‌ها' : srv650_27 === 'en' ? 'Threads' : '线程' }: ' + XXX + ')';
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
      TestStatus.textContent = '${ srv650_27 === 'fa' ? 'تست کامل شد' : srv650_27 === 'en' ? 'Test complete' : '测试完成' }: ' + SuccessCnt20001 + '/' + Local20054 + (FailCnt20002 > 0 ? ' (' + FailCnt20002 + ' ${ srv650_27 === 'fa' ? 'ناموفق' : srv650_27 === 'en' ? 'failed' : '失败' })' : '');
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
      TestStatus.textContent = '${ srv650_27 === 'fa' ? 'تست متوقف شد' : srv650_27 === 'en' ? 'Test stopped' : '测试已停止' }';
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
      if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${ srv650_27 === 'fa' ? 'لطفا حداقل یک مورد انتخاب کنید' : srv650_27 === 'en' ? 'Please select at least one item' : '请至少选择一项' }'; TestStatus.style.color = '#ffcc00'; }
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
      OverwriteSelected.textContent = '${ srv650_27 === 'fa' ? 'در حال ذخیره...' : srv650_27 === 'en' ? 'Saving...' : '保存中...' }';
      try {
        const CfgData20021 = {
          customIP: document.getElementById('customIP').value,
          yx: NewVal20022,
          yxURL: document.getElementById('yxURL').value,
          s: document.getElementById('socksConfig').value
        };
        await SaveConfig(CfgData20021);
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${ srv650_27 === 'fa' ? 'موفقیت‌آمیز بود' : srv650_27 === 'en' ? 'Overwritten' : '已覆盖' } ' + SelectedItemItems20024.length + ' ${ srv650_27 === 'fa' ? 'مورد و ذخیره شد' : srv650_27 === 'en' ? ' items saved' : '项并已保存' }'; TestStatus.style.color = '#00ff9d'; }
      } catch (Err20020) {
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${ srv650_27 === 'fa' ? 'خطا در ذخیره' : srv650_27 === 'en' ? 'Save failed' : '保存失败' }: ' + Err20020.message; TestStatus.style.color = '#ff6666'; }
      } finally {
        OverwriteSelected.disabled = false;
        AppendSelected.disabled = false;
        OverwriteSelected.textContent = '${ srv650_27 === 'fa' ? '覆盖添加' : srv650_27 === 'en' ? 'Overwrite add' : '覆盖添加' }';
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
      AppendSelected.textContent = '${ srv650_27 === 'fa' ? 'در حال ذخیره...' : srv650_27 === 'en' ? 'Saving...' : '保存中...' }';
      try {
        const CfgData = {
          customIP: document.getElementById('customIP').value,
          yx: NewVal,
          yxURL: document.getElementById('yxURL').value,
          s: document.getElementById('socksConfig').value
        };
        await SaveConfig(CfgData);
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${ srv650_27 === 'fa' ? 'موفقیت‌آمیز بود' : srv650_27 === 'en' ? 'Appended' : '已追加' } ' + SelectedItemItems.length + ' ${ srv650_27 === 'fa' ? 'مورد و ذخیره شد' : srv650_27 === 'en' ? ' items saved' : '项并已保存' }'; TestStatus.style.color = '#00ff9d'; }
      } catch (Err20019) {
        if (TestStatus) { TestStatus.style.display = 'block'; TestStatus.textContent = '${ srv650_27 === 'fa' ? 'خطا در ذخیره' : srv650_27 === 'en' ? 'Save failed' : '保存失败' }: ' + Err20019.message; TestStatus.style.color = '#ff6666'; }
      } finally {
        OverwriteSelected.disabled = false;
        AppendSelected.disabled = false;
        AppendSelected.textContent = '${ srv650_27 === 'fa' ? '追加添加' : srv650_27 === 'en' ? 'Append add' : '追加添加' }';
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
      const ErrMsg = Err.name === 'AbortError' ? '${ srv650_27 === 'fa' ? 'زمان تمام شد' : srv650_27 === 'en' ? 'Timeout' : '超时' }' : Err.message;
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
        <h2 style="color:#00f0ff;margin:0 0 6px 0;font-size:1.3rem;letter-spacing:.04em;">🚀 ${ val523_21['preferredTools'] }</h2>
        <p style="color:#7aa9c4;margin:0 0 18px 0;font-size:0.9rem;">${ val523_21['chooseOptimizeWay'] }</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
          <button type="button" onclick="OpenOnline()" style="background:rgba(0,240,255,.07);border:1px solid #00f0ff;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">🌐 ${ val523_21['onlineOptimize'] }<span style="margin-left:8px;background:#00ffc4;color:#000;font-size:0.7rem;padding:2px 7px;border-radius:8px;vertical-align:middle;">推荐</span></div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${ val523_21['onlineOptimizeDesc'] }</div>
          </button>
          <button type="button" onclick="OpenLocal()" style="background:rgba(163,71,255,.08);border:1px solid #a347ff;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">💻 ${ val523_21['localOptimize'] }</div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${ val523_21['localOptimizeDesc'] }</div>
          </button>
          <button type="button" onclick="OpenApi()" style="background:rgba(0,255,196,.07);border:1px solid #00ffc4;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">🔄 ${ val523_21['apiOptimize'] }</div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${ val523_21['apiOptimizeDesc'] }</div>
          </button>
          <button type="button" onclick="OpenChain()" style="background:rgba(255,95,122,.07);border:1px solid #ff5f7a;border-radius:10px;padding:14px;text-align:left;cursor:pointer;color:#00f0ff;font-family:inherit;">
            <div style="font-size:1.05rem;font-weight:bold;">⛓ ${ val523_21['chainProxy'] }</div>
            <div style="color:#7aa9c4;font-size:0.8rem;margin-top:6px;">${ val523_21['chainProxyHint'] }</div>
          </button>
        </div>
      </div>
    </div>
    <!-- 在线优选 iframe 弹窗 -->
    <div id="onlineOptimizeOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:#050b12;">
      <div style="position:absolute;top:10px;right:14px;z-index:2;">
        <button type="button" onclick="CloseOnline()" style="background:rgba(0,240,255,.15);border:1px solid #00f0ff;color:#00f0ff;border-radius:8px;padding:6px 14px;cursor:pointer;font-weight:bold;">✕ ${ val523_21['closeBtn'] }</button>
      </div>
      <iframe id="onlineOptimizeFrame" style="width:100%;height:100%;border:none;" srcdoc='<!doctype html><html><head><meta charset="utf-8"><title>Online Optimize</title><style>body{background:#0a1420;color:#00f0ff;font-family:monospace;margin:0;padding:20px}h2{color:#00f0ff;font-size:18px;margin:0 0 12px;letter-spacing:.04em}label{color:#7aa9c4;font-size:13px}input,button{background:#081018;border:1px solid #00f0ff;color:#00f0ff;font-family:monospace;padding:8px;border-radius:6px;font-size:13px;box-sizing:border-box}button{cursor:pointer;margin:4px 4px 4px 0;font-weight:bold}button:hover{background:rgba(0,240,255,.15)}.bar{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px}#list{margin-top:10px;max-height:62vh;overflow:auto;font-size:12px;line-height:1.7}.row{padding:4px 6px;border-bottom:1px dashed rgba(0,240,255,.2)}.ok{color:#00ffc4}.fail{color:#ff5f7a}</style></head><body><h2>&#x1F680; &#x5728;&#x7EBF;&#x4F18;&#x9009;&#x5DE5;&#x5177;</h2><div class="bar"><label>&#x6570;&#x91CF;:</label><input id="cnt" type="number" value="12" min="1" max="50" style="width:70px"><label>&#x7AEF;&#x53E3;:</label><input id="port" type="text" value="443" style="width:80px"><button onclick="gen()">&#x5F00;&#x59CB;&#x751F;&#x6210;</button><button onclick="copy()">&#x590D;&#x5236;&#x5168;&#x90E8;</button><button onclick="apply()">&#x5E94;&#x7528;&#x7ED3;&#x679C;</button></div><div id="list"></div><script>var ips=[];async function gen(){  var c=document.getElementById("cnt").value||12;  var p=document.getElementById("port").value||443;  var d=document.getElementById("list");  d.innerHTML="&#x23F3; &#x6B63;&#x5728;&#x751F;&#x6210;&#x5E76;&#x6D4B;&#x901F;...";  try{    var r=await fetch("/api/preferred-ips/generate?count="+encodeURIComponent(c)+"&port="+encodeURIComponent(p));    var j=await r.json();    ips=(j&&j.ips)?j.ips:[];    if(ips.length){d.innerHTML=ips.map(function(x){return '<div class="row">'+x+'</div>';}).join("");}    else{d.innerHTML="&#x274C; &#x672A;&#x83B7;&#x53D6;&#x5230;&#x7ED3;&#x679C;";}  }catch(e){d.innerHTML="&#x274C; "+e.message;}}function copy(){  if(!ips.length){alert("&#x6682;&#x65E0;&#x6570;&#x636E;");return;}  var t=ips.join("\\n");  if(navigator.clipboard){navigator.clipboard.writeText(t).then(function(){alert("&#x5DF2;&#x590D;&#x5236; "+ips.length+" &#x6761;");},function(){alert(t);});}  else{alert(t);}}function apply(){  if(!ips.length){alert("&#x6682;&#x65E0;&#x6570;&#x636E;");return;}  try{    var p=window.parent;    var input=p.document.getElementById("subCustomIPs");    if(input){input.value=ips.join("\\n");input.style.borderColor="#00ffc4";}    var st=p.document.getElementById("startPreferredStatus");    if(st){st.textContent="&#x5DF2;&#x5E94;&#x7528; "+ips.length+" &#x6761;&#x4F18;&#x9009;IP";}    alert("&#x5DF2;&#x5E94;&#x7528;&#x5230;&#x81EA;&#x5B9A;&#x4E49;&#x4F18;&#x9009;&#xFF0C;&#x8BF7;&#x70B9;&#x51FB;&#x4FDD;&#x5B58;&#x5168;&#x90E8;&#x751F;&#x6548;");  }catch(e){alert("&#x5E94;&#x7528;&#x5931;&#x8D25;: "+e.message);}}</script></body></html>'></iframe>
    </div>
    <!-- 本地优选工具目录弹窗 -->
    <div id="localOptimizeOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.88);align-items:center;justify-content:center;">
      <div style="background:#0a1420;border:1px solid #00f0ff;border-radius:14px;padding:24px;width:min(780px,92vw);max-height:88vh;overflow:auto;position:relative;">
        <button type="button" onclick="CloseLocal()" style="position:absolute;right:12px;top:10px;background:none;border:none;color:#00f0ff;font-size:26px;cursor:pointer;">×</button>
        <h2 style="color:#00f0ff;margin:0 0 6px 0;">💻 ${ val523_21['localOptimize'] }</h2>
        <p style="color:#7aa9c4;font-size:0.85rem;margin:0 0 14px 0;">${ val523_21['localOptimizeDesc'] }</p>
        <div id="localOptimizeToolList" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;color:#7aa9c4;font-size:0.9rem;">${ val523_21['loadingTools'] }</div>
      </div>
    </div>
    <!-- API 优选弹窗 -->
    <div id="apiOptimizeOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.88);align-items:center;justify-content:center;">
      <div style="background:#0a1420;border:1px solid #00f0ff;border-radius:14px;padding:24px;width:min(640px,92vw);max-height:88vh;overflow:auto;position:relative;">
        <button type="button" onclick="CloseApi()" style="position:absolute;right:12px;top:10px;background:none;border:none;color:#00f0ff;font-size:26px;cursor:pointer;">×</button>
        <h2 style="color:#00f0ff;margin:0 0 14px 0;">🔄 ${ val523_21['apiOptimize'] }</h2>
        <div style="display:flex;gap:8px;margin-bottom:10px;">
          <input type="text" id="apiOptimizeURL" placeholder="https://url.v1.mk/sub" style="flex:1;padding:9px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
          <input type="text" id="apiOptimizePort" placeholder="443" value="443" style="width:80px;padding:9px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;">
        </div>
        <button type="button" id="btnVerifyAPI" onclick="VerifyPrefApi()" style="background:linear-gradient(90deg,#00f0ff,#00ffc4);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;">${ val523_21['verifyApi'] }</button>
        <textarea id="apiOptimizeResults" rows="8" readonly placeholder="..." style="width:100%;margin-top:10px;padding:9px;background:rgba(0,0,0,.8);border:1px solid #00f0ff;color:#00f0ff;font-family:'Courier New',monospace;font-size:12px;box-sizing:border-box;"></textarea>
        <div style="margin-top:10px;display:flex;gap:8px;">
          <button type="button" id="btnAppendAPI" onclick="AppendPrefResult()" style="background:linear-gradient(90deg,#a347ff,#00f0ff);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;">${ val523_21['appendToCustom'] }</button>
        </div>
      </div>
    </div>
    <!-- 链式代理弹窗 -->
    <div id="chainProxyOverlay" style="display:none;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999;background:rgba(0,0,0,.88);align-items:center;justify-content:center;">
      <div style="background:#0a1420;border:1px solid #ff5f7a;border-radius:14px;padding:24px;width:min(620px,92vw);max-height:88vh;overflow:auto;position:relative;">
        <button type="button" onclick="CloseChain()" style="position:absolute;right:12px;top:10px;background:none;border:none;color:#ff5f7a;font-size:26px;cursor:pointer;">×</button>
        <h2 style="color:#00f0ff;margin:0 0 14px 0;">⛓ ${ val523_21['chainProxy'] }</h2>
        <label style="display:block;color:#00f0ff;font-size:0.9rem;margin-bottom:6px;">${ val523_21['chainProxyAddress'] }</label>
        <input type="text" id="chainProxyInput" placeholder="socks5://user:pass@host:port" style="width:100%;padding:9px;background:rgba(0,0,0,.8);border:1px solid #ff5f7a;color:#00f0ff;font-family:'Courier New',monospace;font-size:13px;box-sizing:border-box;">
        <small style="color:#7aa9c4;font-size:0.78rem;display:block;margin-top:4px;">${ val523_21['chainProxyHint'] }</small>
        <div style="margin-top:10px;display:flex;gap:8px;align-items:center;">
          <button type="button" id="btnVerifyChain" onclick="VerifyChainProxy()" style="background:linear-gradient(90deg,#ff5f7a,#a347ff);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;">${ val523_21['verifyChain'] }</button>
          <button type="button" id="btnApplyChain" onclick="ApplyChainProxy()" style="background:linear-gradient(90deg,#a347ff,#00f0ff);color:#000;border:none;border-radius:8px;padding:8px 18px;font-weight:bold;cursor:pointer;display:none;">${ val523_21['applyChainProxy'] }</button>
          <span id="chainProxyStatus" style="color:#7aa9c4;font-size:0.82rem;"></span>
        </div>
        <div id="chainProxyResult" style="margin-top:10px;color:#7aa9c4;font-size:0.85rem;"></div>
      </div>
    </div>
</body>
    </html>`;
  ;
  ;
  ;
  ;
  ;
  ;
  ;
  ;
  ;
  ;
  ;
  ;
  ;
  return new Response(map860_35, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' }
  });
}
const remote1213_50 = "Proxy-Connection: Keep-Alive";
function mgr880_36(arr_21) {
  let aux1103_45 = String(arr_21 || '').trim();
  let res995_41 = remote997_41;
  const hdr777_32 = aux1103_45.toLowerCase();
  if (hdr777_32.startsWith(map980_40)) {
    res995_41 = cli996_41;
    aux1103_45 = aux1103_45.slice(map980_40.length);
  } else if (hdr777_32.startsWith(val979_40)) {
    res995_41 = data998_41;
    aux1103_45 = aux1103_45.slice(val979_40.length);
  } else if (hdr777_32.startsWith(fn982_40)) {
    aux1103_45 = aux1103_45.slice(fn982_40.length);
  } else if (hdr777_32.startsWith(arr981_40)) {
    aux1103_45 = aux1103_45.slice(arr981_40.length);
  }
  const arr909_37 = aux1103_45.indexOf('/');
  if (arr909_37 >= 0)
    aux1103_45 = aux1103_45.slice(0, arr909_37);
  if (!aux1103_45)
    throw new Error(ws388_16);
  let [buf725_30, ws724_30] = aux1103_45.split('@').reverse();
  let net723_30, req898_37, remote517_21, ws964_40;
  if (ws724_30) {
    const srv722_30 = ws724_30.split(':');
    if (srv722_30.length !== 2)
      throw new Error(ws388_16);
    [net723_30, req898_37] = srv722_30;
  }
  const cfg721_30 = buf725_30.split(':');
  const node654_27 = cfg721_30.pop();
  ws964_40 = Number(node654_27);
  if (isNaN(ws964_40)) {
    if (res995_41 === remote997_41)
      throw new Error(ws388_16);
    cfg721_30.push(node654_27);
    ws964_40 = res995_41 === cli996_41 ? 443 : 80;
  }
  remote517_21 = cfg721_30.join(':');
  if (!remote517_21)
    throw new Error(ws388_16);
  if (remote517_21.includes(':') && !/^\[.*\]$/.test(remote517_21))
    throw new Error(ws388_16);
  return {
    username: net723_30,
    password: req898_37,
    hostname: remote517_21,
    socksPort: ws964_40,
    kind: res995_41
  };
}
const util1215_50 = "User-Agent: Mozilla/5.0";
async function cli1140_47(fn646_26, net1323_55) {
  mgr640_26[fn646_26] = net1323_55;
  await ws1132_47();
}
const req1210_50 = "\r\n";
async function map188_7(map_20, buf965_40, proto992_41, req418_17 = null, arr429_17 = null) {
  const {
    username: util1239_51,
    password: data1238_51,
    hostname: res1235_51,
    socksPort: remote1237_51,
    kind: cli1236_51
  } = proto992_41;
  const remote181_7 = cli1236_51 === cli996_41 ? {
    secureTransport: 'on',
    allowHalfOpen: false
  } : undefined;
  const state1193_49 = {
    hostname: res1235_51,
    port: remote1237_51
  };
  const Sock = req418_17 && typeof req418_17.connect === 'function' ? remote181_7 === undefined ? req418_17.connect(state1193_49) : req418_17.connect(state1193_49, remote181_7) : Connect(state1193_49, remote181_7);
  if (Sock?.opened)
    await Sock.opened;
  const mgr1192_49 = map_20.includes(':') && !/^\[.*\]$/.test(map_20) ? `[${ map_20 }]` : map_20;
  const data1190_49 = `${ mgr1192_49 }:${ buf965_40 }`;
  let cli1092_45 = `${ proto1208_50 } ${ data1190_49 }${ res1211_50 }${ req1210_50 }` + `${ hdr1209_50 }${ data1190_49 }${ req1210_50 }` + `${ util1215_50 }${ req1210_50 }` + `${ remote1213_50 }${ req1210_50 }`;
  if (util1239_51) {
    cli1092_45 += `${ cli1212_50 }${ btoa(`${ util1239_51 }:${ data1238_51 || '' }`) }${ req1210_50 }`;
  }
  cli1092_45 += req1210_50;
  const Writer = Sock.writable.getWriter();
  const Reader = Sock.readable.getReader();
  try {
    await Writer.write(new TextEncoder().encode(cli1092_45));
    const hdr1137_47 = [
      13,
      10,
      13,
      10
    ];
    let Buf = new Uint8Array(0);
    let res491_20 = -1;
    while (res491_20 < 0) {
      const {
        value: Chunk,
        done: Done
      } = await Reader.read();
      if (Done || !Chunk)
        throw new Error(res395_16);
      Buf = req178_7(Buf, Chunk);
      for (let node966_40 = 0; node966_40 + 3 < Buf.length; node966_40++) {
        if (Buf[node966_40] === hdr1137_47[0] && Buf[node966_40 + 1] === hdr1137_47[1] && Buf[node966_40 + 2] === hdr1137_47[2] && Buf[node966_40 + 3] === hdr1137_47[3]) {
          res491_20 = node966_40 + 4;
          break;
        }
      }
      if (res491_20 < 0 && Buf.length > 8192)
        throw new Error(req394_16);
    }
    const cfg1177_49 = remote1141_47.decode(Buf.subarray(0, Math.min(res491_20, 128)));
    if (!cfg1177_49.startsWith(data1214_50))
      throw new Error(req394_16);
    const srv1178_49 = Number(cfg1177_49.split(' ')[1]);
    if (!(srv1178_49 >= 200 && srv1178_49 < 300))
      throw new Error(res395_16);
    const RemainderX5 = Buf.subarray(res491_20);
    if (arr429_17 && arr429_17.byteLength)
      await Writer.write(arr429_17);
    Writer.releaseLock();
    Reader.releaseLock();
    if (RemainderX5.byteLength)
      return proto1376_57(Sock, RemainderX5);
    return Sock;
  } catch (req1234_51) {
    try {
      Writer.releaseLock();
    } catch (util567_23) {
    }
    try {
      Reader.releaseLock();
    } catch (mgr568_23) {
    }
    try {
      Sock.close();
    } catch (state569_23) {
    }
    throw req1234_51;
  }
}
const data1214_50 = "HTTP/";
function mgr784_32(buf1325_55, fn406_16 = 'Node') {
  let node1206_50 = String(buf1325_55 || '').trim();
  if (!node1206_50 || /^自定义优选-/i.test(node1206_50))
    node1206_50 = fn406_16;
  node1206_50 = node1206_50.replace(/^\[([^\]]+)\]$/, '$1').replace(/^https?:\/\//i, '').replace(/[/?#].*$/, '').replace(/\s+/g, '_');
  return node1206_50 || fn406_16;
}
const remote997_41 = 'p5';
function map884_36(cfg1273_53) {
  cfg1273_53 = cfg1273_53.replaceAll('-', '');
  const state1025_42 = [];
  for (let net531_22 = 0; net531_22 < 16; net531_22++) {
    const map1412_58 = parseInt(cfg1273_53.substr(net531_22 * 2, 2), 16);
    state1025_42.push(map1412_58);
  }
  return state1025_42;
}
const data998_41 = 'pt';
function util447_18(Key, net267_11 = false, FallbackVal = undefined) {
  const DefaultVal = FallbackVal !== undefined ? FallbackVal : net267_11 ? 'yes' : 'no';
  return cli876_36(state449_18(Key, DefaultVal), net267_11);
}
const cli996_41 = 'pts';
function node438_18(hdr681_28, data758_31 = {}) {
  const arr837_34 = hdr681_28.map(state881_36).filter(buf221_9 => buf221_9 && (buf221_9.proto === 'vless' || buf221_9.proto === 'trojan'));
  const val811_33 = arr837_34.map(ws220_9 => ws220_9.name);
  const net291_12 = val235_9 || 'https://223.5.5.5/dns-query';
  const proto488_20 = [
    'mixed-port: 7890',
    'allow-lan: true',
    'mode: rule',
    'log-level: info',
    'ipv6: true',
    'external-controller: 127.0.0.1:9090',
    'unified-delay: true',
    'tcp-concurrent: true',
    'geodata-mode: true',
    'geo-auto-update: true',
    'geo-update-interval: 24',
    'geox-url:',
    '  geoip: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat"',
    '  geosite: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat"',
    '  mmdb: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb"',
    '  asn: "https://fastly.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/GeoLite2-ASN.mmdb"',
    'sniffer:',
    '  enable: true',
    '  force-dns-mapping: true',
    '  parse-pure-ip: true',
    '  sniff:',
    '    HTTP:',
    '      ports: [80, 8080-8880]',
    '      override-destination: true',
    '    TLS:',
    '      ports: [443, 8443]',
    '    QUIC:',
    '      ports: [443, 8443]',
    'dns:',
    '  enable: true',
    '  listen: 0.0.0.0:1053',
    '  ipv6: true',
    '  enhanced-mode: fake-ip',
    '  fake-ip-range: 198.18.0.1/16',
    '  fake-ip-filter:',
    '    - "*.lan"',
    '    - "+.local"',
    '    - "+.market.xiaomi.com"',
    '    - "+.msftconnecttest.com"',
    '    - "+.msftncsi.com"',
    '    - "localhost.ptlogin2.qq.com"',
    '    - "+.srv.nintendo.net"',
    '    - "+.stun.playstation.net"',
    '    - "+.xboxlive.com"',
    '  default-nameserver:',
    '    - 223.5.5.5',
    '    - 119.29.29.29',
    '  nameserver:',
    `    - ${ net291_12 }`,
    '    - https://119.29.29.29/dns-query',
    '  fallback:',
    '    - https://1.1.1.1/dns-query',
    '    - https://8.8.8.8/dns-query',
    '  fallback-filter:',
    '    geoip: true',
    '    geoip-code: CN',
    '    ipcidr:',
    '      - 240.0.0.0/4',
    ''
  ];
  const res1307_54 = ['proxies:'];
  for (const net219_9 of arr837_34)
    res1307_54.push(remote109_4(net219_9));
  const fn838_34 = val811_33.length ? val811_33.map(srv218_9 => `      - ${ buf461_19(srv218_9) }`).join('\n') : '      - DIRECT';
  const req1306_54 = [
    'proxy-groups:',
    '  - name: "\uD83D\uDE80 节点选择"',
    '    type: select',
    '    proxies:',
    '      - "\uD83C\uDFAF 全球直连"',
    fn838_34,
    '  - name: "\uD83C\uDF0D 国外媒体"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33),
    '  - name: "\uD83D\uDCFA 哔哩哔哩"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33, { directFirst: true }),
    '  - name: "\uD83D\uDCF9 油管视频"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33, { extraGroups: ['\uD83C\uDF0D 国外媒体'] }),
    '  - name: "\uD83C\uDFAC 奈飞视频"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33, { extraGroups: ['\uD83C\uDF0D 国外媒体'] }),
    '  - name: "\uD83D\uDCF2 电报信息"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33),
    '  - name: "\uD83C\uDF10 谷歌服务"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33),
    '  - name: "\uD83E\uDD16 OpenAI"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33),
    '  - name: "\u24C2️ 微软服务"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33, { directFirst: true }),
    '  - name: "\uD83C\uDF4E 苹果服务"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33, { directFirst: true }),
    '  - name: "\uD83C\uDFAF 全球直连"',
    '    type: select',
    '    proxies:',
    '      - DIRECT',
    '  - name: "\uD83D\uDED1 全球拦截"',
    '    type: select',
    '    proxies:',
    '      - REJECT',
    '      - DIRECT',
    '  - name: "\uD83C\uDF43 应用净化"',
    '    type: select',
    '    proxies:',
    '      - REJECT',
    '      - DIRECT',
    '  - name: "\uD83D\uDC1F 漏网之鱼"',
    '    type: select',
    '    proxies:',
    res923_38(val811_33),
    ''
  ];
  const val91_3 = 'https://fastly.jsdelivr.net/gh/Loyalsoldier/clash-rules@release';
  const node990_41 = (hdr801_33, remote757_31) => [
    `  ${ hdr801_33 }:`,
    `    type: http`,
    `    behavior: ${ remote757_31 }`,
    `    url: "${ val91_3 }/${ hdr801_33 }.txt"`,
    `    path: ./rulesets/loyalsoldier/${ hdr801_33 }.txt`,
    `    interval: 86400`
  ].join('\n');
  const val1123_46 = [
    'rule-providers:',
    node990_41('reject', 'domain'),
    node990_41('icloud', 'domain'),
    node990_41('apple', 'domain'),
    node990_41('google', 'domain'),
    node990_41('proxy', 'domain'),
    node990_41('direct', 'domain'),
    node990_41('private', 'domain'),
    node990_41('gfw', 'domain'),
    node990_41('greatfire', 'domain'),
    node990_41('tld-not-cn', 'domain'),
    node990_41('telegramcidr', 'ipcidr'),
    node990_41('cncidr', 'ipcidr'),
    node990_41('lancidr', 'ipcidr'),
    node990_41('applications', 'classical'),
    ''
  ];
  const arr1125_46 = [
    'rules:',
    '  - DOMAIN-SUFFIX,acl4.ssr,\uD83C\uDFAF 全球直连',
    '  - DOMAIN-SUFFIX,local,\uD83C\uDFAF 全球直连',
    '  - DOMAIN,clash.razord.top,\uD83C\uDFAF 全球直连',
    '  - DOMAIN,yacd.haishan.me,\uD83C\uDFAF 全球直连',
    '  - DOMAIN,yacd.metacubex.one,\uD83C\uDFAF 全球直连',
    '  - DOMAIN,d.metacubex.one,\uD83C\uDFAF 全球直连',
    '  - DOMAIN-SUFFIX,googleapis.cn,\uD83C\uDF10 谷歌服务',
    '  - DOMAIN-SUFFIX,gstatic.com,\uD83C\uDF10 谷歌服务',
    '  - DOMAIN-SUFFIX,xn--ngstr-lra8j.com,\uD83C\uDF10 谷歌服务',
    '  - DOMAIN-SUFFIX,googlevideo.com,\uD83D\uDCF9 油管视频',
    '  - DOMAIN-SUFFIX,googleusercontent.com,\uD83C\uDF10 谷歌服务',
    '  - DOMAIN-KEYWORD,youtube,\uD83D\uDCF9 油管视频',
    '  - DOMAIN-SUFFIX,youtube.com,\uD83D\uDCF9 油管视频',
    '  - DOMAIN-SUFFIX,youtu.be,\uD83D\uDCF9 油管视频',
    '  - DOMAIN-KEYWORD,netflix,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,nflxext.com,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,nflxso.net,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,nflxvideo.net,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,nflximg.com,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,nflximg.net,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,netflix.com,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,netflix.net,\uD83C\uDFAC 奈飞视频',
    '  - DOMAIN-SUFFIX,bilibili.com,\uD83D\uDCFA 哔哩哔哩',
    '  - DOMAIN-SUFFIX,bilivideo.com,\uD83D\uDCFA 哔哩哔哩',
    '  - DOMAIN-SUFFIX,hdslb.com,\uD83D\uDCFA 哔哩哔哩',
    '  - DOMAIN-KEYWORD,openai,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-KEYWORD,chatgpt,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,openai.com,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,chatgpt.com,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,oaistatic.com,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,oaiusercontent.com,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,anthropic.com,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,claude.ai,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,perplexity.ai,\uD83E\uDD16 OpenAI',
    '  - DOMAIN-SUFFIX,gemini.google.com,\uD83E\uDD16 OpenAI',
    '  - RULE-SET,applications,\uD83C\uDFAF 全球直连',
    '  - RULE-SET,private,\uD83C\uDFAF 全球直连',
    '  - RULE-SET,reject,\uD83D\uDED1 全球拦截',
    '  - RULE-SET,icloud,\uD83C\uDF4E 苹果服务',
    '  - RULE-SET,apple,\uD83C\uDF4E 苹果服务',
    '  - RULE-SET,google,\uD83C\uDF10 谷歌服务',
    '  - RULE-SET,proxy,\uD83D\uDE80 节点选择',
    '  - RULE-SET,gfw,\uD83D\uDE80 节点选择',
    '  - RULE-SET,greatfire,\uD83D\uDE80 节点选择',
    '  - RULE-SET,tld-not-cn,\uD83D\uDE80 节点选择',
    '  - RULE-SET,direct,\uD83C\uDFAF 全球直连',
    '  - RULE-SET,lancidr,\uD83C\uDFAF 全球直连,no-resolve',
    '  - RULE-SET,cncidr,\uD83C\uDFAF 全球直连,no-resolve',
    '  - RULE-SET,telegramcidr,\uD83D\uDCF2 电报信息,no-resolve',
    '  - GEOIP,LAN,\uD83C\uDFAF 全球直连,no-resolve',
    '  - GEOIP,CN,\uD83C\uDFAF 全球直连,no-resolve',
    '  - MATCH,\uD83D\uDC1F 漏网之鱼'
  ];
  return [
    proto488_20.join('\n'),
    res1307_54.join('\n'),
    '',
    req1306_54.join('\n'),
    val1123_46.join('\n'),
    arr1125_46.join('\n'),
    ''
  ].join('\n');
}
let aux887_36 = {};
function net1227_51(aux143_5) {
  if (aux143_5 instanceof Uint8Array)
    return aux143_5;
  if (aux143_5 instanceof ArrayBuffer)
    return new Uint8Array(aux143_5);
  if (ArrayBuffer.isView(aux143_5))
    return new Uint8Array(aux143_5.buffer, aux143_5.byteOffset, aux143_5.byteLength);
  return new Uint8Array(aux143_5);
}
let hdr993_41 = false;
function buf1277_53(node1230_51) {
  if (arr1269_52.has(node1230_51))
    return arr1269_52.get(node1230_51);
  const tmp504_20 = String(node1230_51 || '').replace(/-/g, '');
  if (tmp504_20.length !== 32)
    return null;
  const arr117_4 = new Uint8Array(16);
  for (let cli540_22 = 0; cli540_22 < 16; cli540_22++) {
    const tmp1320_54 = Number.parseInt(tmp504_20.slice(cli540_22 * 2, cli540_22 * 2 + 2), 16);
    if (Number.isNaN(tmp1320_54))
      return null;
    arr117_4[cli540_22] = tmp1320_54;
  }
  if (arr1269_52.size > 16)
    arr1269_52.clear();
  arr1269_52.set(node1230_51, arr117_4);
  return arr117_4;
}
const buf_5 = 1;
async function hdr417_17(Host) {
  let PrefIps = [];
  let cfg433_18 = String(Host || '').replace(/^sub:\/\//i, 'https://').split('#')[0].split('?')[0];
  if (!/^https?:\/\//i.test(cfg433_18))
    cfg433_18 = `https://${ cfg433_18 }`;
  try {
    const state1241_51 = new URL(cfg433_18);
    cfg433_18 = state1241_51.origin;
  } catch (Err) {
    return [];
  }
  const hdr441_18 = `${ cfg433_18 }/sub?host=example.com&uuid=00000000-0000-4000-8000-000000000000`;
  try {
    const Resp = await fetch(hdr441_18, { headers: { 'User-Agent': 'v2rayN/edgetunnel (https://github.com/cmliu/edgetunnel)' } });
    if (!Resp.ok)
      return [];
    const SubText = atob(await Resp.text());
    const Lines = SubText.includes('\r\n') ? SubText.split('\r\n') : SubText.split('\n');
    for (const Row of Lines) {
      if (!Row.trim())
        continue;
      if (Row.includes('00000000-0000-4000-8000-000000000000') && Row.includes('example.com')) {
        const AddrMatch = Row.match(/:\/\/[^@]+@([^?]+)/);
        if (AddrMatch) {
          let HostPort = AddrMatch[1];
          let Remark = '';
          const fn1054_43 = Row.match(/#(.+)$/);
          if (fn1054_43)
            Remark = '#' + decodeURIComponent(fn1054_43[1]);
          PrefIps.push(HostPort + Remark);
        }
      }
    }
  } catch (Err) {
    return [];
  }
  return PrefIps;
}
const ws_4 = 2;
function val595_24(link31_1) {
  const net1347_56 = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  if (net1347_56.test(link31_1))
    return true;
  const ws1348_56 = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  if (ws1348_56.test(link31_1))
    return true;
  const buf1349_56 = /^::1$|^::$|^(?:[0-9a-fA-F]{1,4}:)*::(?:[0-9a-fA-F]{1,4}:)*[0-9a-fA-F]{1,4}$/;
  if (buf1349_56.test(link31_1))
    return true;
  return false;
}
const node_6 = 3;
function arr597_24(net1179_49) {
  const ws1276_53 = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return ws1276_53.test(net1179_49);
}
const buf149_6 = 64 * 1024;
async function op186_7(aux_23, arr933_38, aux1079_44 = null, aux1007_41 = 1) {
  const Count = Math.max(1, aux1007_41 | 0);
  if (Count <= 1)
    return res851_35(aux_23, arr933_38, aux1079_44);
  const mgr736_30 = Array.from({ length: Count }, () => res851_35(aux_23, arr933_38, aux1079_44));
  const util735_30 = await Promise.any(mgr736_30);
  mgr736_30.forEach(data734_30 => {
    data734_30.then(ws1156_48 => {
      if (ws1156_48 !== util735_30) {
        try {
          ws1156_48.close();
        } catch (ws556_23) {
        }
      }
    }, () => {
    });
  });
  return util735_30;
}
const remote301_12 = 32 * 1024;
function arr453_18(remote1045_43) {
  const op1338_55 = {
    'US': [
      'SG',
      'JP',
      'KR'
    ],
    'SG': [
      'JP',
      'KR',
      'US'
    ],
    'JP': [
      'SG',
      'KR',
      'US'
    ],
    'KR': [
      'JP',
      'SG',
      'US'
    ],
    'DE': [
      'NL',
      'GB',
      'SE',
      'FI'
    ],
    'SE': [
      'DE',
      'NL',
      'FI',
      'GB'
    ],
    'NL': [
      'DE',
      'GB',
      'SE',
      'FI'
    ],
    'FI': [
      'SE',
      'DE',
      'NL',
      'GB'
    ],
    'GB': [
      'DE',
      'NL',
      'SE',
      'FI'
    ]
  };
  return op1338_55[remote1045_43] || [];
}
const util303_12 = 512;
function res923_38(arr813_33, map764_31 = {}) {
  const {
    directFirst: util279_11 = false,
    extraGroups: remote1309_54 = []
  } = map764_31;
  const cli828_34 = arr813_33.length ? arr813_33.map(link223_9 => `      - ${ buf461_19(link223_9) }`).join('\n') : '      - DIRECT';
  const op666_27 = [];
  if (!!util279_11) {
    op666_27.push('      - "\uD83C\uDFAF 全球直连"', '      - "\uD83D\uDE80 节点选择"');
  } else {
    op666_27.push('      - "\uD83D\uDE80 节点选择"', '      - "\uD83C\uDFAF 全球直连"');
  }
  for (const val763_31 of remote1309_54)
    op666_27.push(`      - ${ buf461_19(val763_31) }`);
  op666_27.push(cli828_34);
  return op666_27.join('\n');
}
const cli300_12 = 0;
function remote325_13(EnvVal = {}) {
  return remote421_17({
    ...buf341_14(EnvVal),
    ...mgr640_26
  });
}
const op1242_51 = 16 * 1024;
function map452_18(node1374_57, tmp72_2, arr1341_55 = map332_13) {
  if (!arr1341_55 || !node1374_57) {
    return tmp72_2;
  }
  const mgr1312_54 = fn454_18(node1374_57);
  const node54_2 = [];
  for (const res1043_43 of mgr1312_54) {
    const util1047_43 = tmp72_2.filter(buf29_1 => buf29_1.regionCode === res1043_43);
    node54_2.push(...util1047_43);
  }
  return node54_2;
}
const val1243_51 = 256 * 1024;
function op786_32(ws700_29, req1066_44) {
  const tmp168_6 = new XhttpCntX();
  let ws1180_49;
  const net699_29 = new Promise((srv698_29, cfg697_29) => {
    ws1180_49 = new TransformStream({
      start(remote229_9) {
        tmp168_6.add(ws700_29.length);
        remote229_9.enqueue(ws700_29);
      },
      transform(ChunkX7, cli228_9) {
        tmp168_6.add(ChunkX7.length);
        cli228_9.enqueue(ChunkX7);
      },
      cancel(tmp696_28) {
        cfg697_29(`download cancelled: ${ tmp696_28 }`);
      }
    }, null, new ByteLengthQueuingStrategy({ highWaterMark: req1330_55 }));
    let data1286_53 = Date.now();
    const srv1346_56 = setInterval(() => {
      if (Date.now() - data1286_53 > cfg1345_56) {
        try {
          ws1180_49.writable.abort?.('idle timeout');
        } catch (arr549_22) {
        }
        clearInterval(srv1346_56);
        cfg697_29('idle timeout');
      }
    }, 5000);
    const Reader = req1066_44.getReader();
    const hdr1377_57 = ws1180_49.writable.getWriter();
    ;
    (async () => {
      try {
        let srv146_6 = 0;
        while (true) {
          const data1022_42 = await Reader.read();
          if (data1022_42.done) {
            break;
          }
          data1286_53 = Date.now();
          await hdr1377_57.write(data1022_42.value);
          srv146_6++;
          if (srv146_6 % 5 === 0) {
            await op474_19(0);
          }
        }
        await hdr1377_57.close();
        srv698_29();
      } catch (mgr352_14) {
        cfg697_29(mgr352_14);
      } finally {
        try {
          Reader.releaseLock();
        } catch (map548_22) {
        }
        try {
          hdr1377_57.releaseLock();
        } catch (val547_22) {
        }
        clearInterval(srv1346_56);
      }
    })();
  });
  return {
    readable: ws1180_49.readable,
    counter: tmp168_6,
    done: net699_29,
    abort: () => {
      try {
        ws1180_49.readable.cancel();
      } catch (op546_22) {
      }
      try {
        ws1180_49.writable.abort();
      } catch (state545_22) {
      }
    }
  };
}
const data182_7 = 2;
function buf341_14(EnvVal = {}) {
  const Map = {
    wk: [
      'wk',
      'WK'
    ],
    ev: [
      'ev',
      'EV'
    ],
    et: [
      'et',
      'ET'
    ],
    ex: [
      'ex',
      'EX'
    ],
    ech: [
      'ech',
      'ECH'
    ],
    tp: [
      'tp',
      'TP'
    ],
    customDNS: [
      'customDNS',
      'CUSTOMDNS',
      'CUSTOM_DNS'
    ],
    customECHDomain: [
      'customECHDomain',
      'CUSTOMECHDOMAIN',
      'CUSTOM_ECH_DOMAIN'
    ],
    alpn: [
      'alpn',
      'ALPN'
    ],
    d: [
      'd',
      'D'
    ],
    p: [
      'p',
      'P'
    ],
    yx: [
      'yx',
      'YX'
    ],
    yxURL: [
      'yxURL',
      'YXURL',
      'YX_URL'
    ],
    s: [
      's',
      'S'
    ],
    homepage: [
      'homepage',
      'HOMEPAGE'
    ],
    scu: [
      'scu',
      'SCU'
    ],
    ena: [
      'ena',
      'ENA'
    ],
    epd: [
      'epd',
      'EPD'
    ],
    epi: [
      'epi',
      'EPI'
    ],
    egi: [
      'egi',
      'EGI'
    ],
    ae: [
      'ae',
      'AE'
    ],
    rm: [
      'rm',
      'RM'
    ],
    qj: [
      'qj',
      'QJ'
    ],
    dkby: [
      'dkby',
      'DKBY'
    ],
    yxby: [
      'yxby',
      'YXBY'
    ],
    ipv4: [
      'ipv4',
      'IPV4'
    ],
    ipv6: [
      'ipv6',
      'IPV6'
    ],
    ispMobile: [
      'ispMobile',
      'ISPMOBILE',
      'ISP_MOBILE'
    ],
    ispUnicom: [
      'ispUnicom',
      'ISPUNICOM',
      'ISP_UNICOM'
    ],
    ispTelecom: [
      'ispTelecom',
      'ISPTELECOM',
      'ISP_TELECOM'
    ],
    subMode: [
      'subMode',
      'SUBMODE',
      'SUB_MODE'
    ],
    subRandomCount: [
      'subRandomCount',
      'SUBRANDOMCOUNT',
      'SUB_RANDOM_COUNT'
    ],
    subPort: [
      'subPort',
      'SUBPORT',
      'SUB_PORT'
    ],
    subCustomIPs: [
      'subCustomIPs',
      'SUBCUSTOMIPS',
      'SUB_CUSTOM_IPS'
    ],
    subGenerator: [
      'subGenerator',
      'SUBGENERATOR',
      'SUB_GENERATOR'
    ],
    subName: [
      'subName',
      'SUBNAME',
      'SUB_NAME'
    ],
    subUpdateTime: [
      'subUpdateTime',
      'SUBUPDATETIME',
      'SUB_UPDATE_TIME'
    ]
  };
  const tmp1152_47 = {};
  for (const [Key, Names] of Object.entries(Map)) {
    const Val = node1014_42(EnvVal, ...Names);
    if (Val !== undefined)
      tmp1152_47[Key] = Val;
  }
  return tmp1152_47;
}
const state425_17 = 3500;
function ws436_18(node678_28) {
  const op834_34 = node678_28.map(state881_36).filter(val211_8 => val211_8 && (val211_8.proto === 'vless' || val211_8.proto === 'trojan'));
  const state809_33 = op834_34.map(op210_8 => op210_8.name);
  const util663_27 = [
    '[General]',
    'ip-mode = dual',
    `dns-server = ${ (val235_9 || '223.5.5.5').replace(/^https?:\/\//, '').replace(/\/.*$/, '') },119.29.29.29,system`,
    'doh-server = https://223.5.5.5/dns-query, https://1.12.12.12/dns-query',
    'allow-udp-proxy = true',
    'allow-wifi-access = false',
    'sni-sniffing = true',
    'skip-proxy = 127.0.0.1,192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,localhost,*.local,captive.apple.com',
    'bypass-tun = 10.0.0.0/8,100.64.0.0/10,127.0.0.0/8,169.254.0.0/16,172.16.0.0/12,192.0.0.0/24,192.0.2.0/24,192.88.99.0/24,192.168.0.0/16,198.51.100.0/24,203.0.113.0/24,224.0.0.0/4,255.255.255.255/32',
    '',
    '[Proxy]'
  ];
  for (const state209_8 of op834_34) {
    if (!!(state209_8.proto === 'vless')) {
      const buf893_37 = [
        `${ state209_8.server }`,
        `${ state209_8.port }`,
        `udp=true`,
        `username=${ state209_8.uuid }`,
        `transport=ws`,
        `path=${ state209_8.path }`,
        `host=${ state209_8.host }`,
        `over-tls=${ state209_8.tls ? 'true' : 'false' }`
      ];
      if (state209_8.tls) {
        buf893_37.push(`tls-name=${ state209_8.sni }`);
        if (state209_8.alpn && state209_8.alpn.length)
          buf893_37.push(`alpn=${ state209_8.alpn.join(':') }`);
        buf893_37.push(`skip-cert-verify=false`);
      }
      util663_27.push(`${ state209_8.name } = ${ 'vless' },${ buf893_37.join(',') }`);
    } else {
      const ws892_37 = [
        `${ state209_8.server }`,
        `${ state209_8.port }`,
        `password=${ state209_8.password }`,
        `transport=ws`,
        `path=${ state209_8.path }`,
        `host=${ state209_8.host }`,
        `over-tls=true`,
        `tls-name=${ state209_8.sni }`
      ];
      if (state209_8.alpn && state209_8.alpn.length)
        ws892_37.push(`alpn=${ state209_8.alpn.join(':') }`);
      ws892_37.push(`skip-cert-verify=false`);
      util663_27.push(`${ state209_8.name } = ${ 'trojan' },${ ws892_37.join(',') }`);
    }
  }
  util663_27.push('');
  util663_27.push('[Proxy Group]');
  const res635_26 = state809_33.length ? state809_33.join(',') : 'DIRECT';
  util663_27.push(`🚀 节点选择 = select,🎯 全球直连,${ res635_26 }`);
  util663_27.push(`🌍 国外媒体 = select,${ req922_38(state809_33, { compact: true }) }`);
  util663_27.push(`📺 哔哩哔哩 = select,${ req922_38(state809_33, {
    directFirst: true,
    compact: true
  }) }`);
  util663_27.push(`📹 油管视频 = select,${ req922_38(state809_33, {
    extraGroups: ['\uD83C\uDF0D 国外媒体'],
    compact: true
  }) }`);
  util663_27.push(`🎬 奈飞视频 = select,${ req922_38(state809_33, {
    extraGroups: ['\uD83C\uDF0D 国外媒体'],
    compact: true
  }) }`);
  util663_27.push(`📲 电报信息 = select,${ req922_38(state809_33, { compact: true }) }`);
  util663_27.push(`🌐 谷歌服务 = select,${ req922_38(state809_33, { compact: true }) }`);
  util663_27.push(`🤖 OpenAI = select,${ req922_38(state809_33, { compact: true }) }`);
  util663_27.push(`Ⓜ️ 微软服务 = select,${ req922_38(state809_33, {
    directFirst: true,
    compact: true
  }) }`);
  util663_27.push(`🍎 苹果服务 = select,${ req922_38(state809_33, {
    directFirst: true,
    compact: true
  }) }`);
  util663_27.push(`🎯 全球直连 = select,DIRECT`);
  util663_27.push(`🛑 全球拦截 = select,REJECT,DIRECT`);
  util663_27.push(`🐟 漏网之鱼 = select,${ req922_38(state809_33, { compact: true }) }`);
  util663_27.push('');
  util663_27.push('[Remote Rule]');
  util663_27.push(`${ map1124_46('LocalAreaNetwork') }, policy=🎯 全球直连, tag=局域网, enabled=true`);
  util663_27.push(`${ map1124_46('BanAD') }, policy=🛑 全球拦截, tag=广告拦截, enabled=true`);
  util663_27.push(`${ map1124_46('BanProgramAD') }, policy=🛑 全球拦截, tag=应用广告, enabled=true`);
  util663_27.push(`${ map1124_46('GoogleCN') }, policy=🎯 全球直连, tag=GoogleCN, enabled=true`);
  util663_27.push(`${ map1124_46('SteamCN') }, policy=🎯 全球直连, tag=SteamCN, enabled=true`);
  util663_27.push(`${ map1124_46('Microsoft') }, policy=Ⓜ️ 微软服务, tag=微软, enabled=true`);
  util663_27.push(`${ map1124_46('Apple') }, policy=🍎 苹果服务, tag=苹果, enabled=true`);
  util663_27.push(`${ map1124_46('Telegram') }, policy=📲 电报信息, tag=电报, enabled=true`);
  util663_27.push(`${ map1124_46('OpenAi') }, policy=🤖 OpenAI, tag=OpenAI, enabled=true`);
  util663_27.push(`${ map1124_46('Netflix') }, policy=🌍 国外媒体, tag=Netflix, enabled=true`);
  util663_27.push(`${ map1124_46('YouTube') }, policy=🌍 国外媒体, tag=YouTube, enabled=true`);
  util663_27.push(`${ map1124_46('Disney') }, policy=🌍 国外媒体, tag=Disney, enabled=true`);
  util663_27.push(`${ map1124_46('Spotify') }, policy=🌍 国外媒体, tag=Spotify, enabled=true`);
  util663_27.push(`${ map1124_46('TikTok') }, policy=🌍 国外媒体, tag=TikTok, enabled=true`);
  util663_27.push(`${ map1124_46('BiliBili') }, policy=📺 哔哩哔哩, tag=哔哩哔哩, enabled=true`);
  util663_27.push(`${ map1124_46('ProxyMedia') }, policy=🌍 国外媒体, tag=${ '代理媒体' }, enabled=true`);
  util663_27.push(`${ map1124_46('ProxyGFWlist') }, policy=🚀 节点选择, tag=${ '代理列表' }, enabled=true`);
  util663_27.push(`${ map1124_46('ChinaDomain') }, policy=🎯 全球直连, tag=中国域名, enabled=true`);
  util663_27.push(`${ map1124_46('ChinaIp') }, policy=🎯 全球直连, tag=中国IP, enabled=true`);
  util663_27.push('');
  util663_27.push('[Rule]');
  util663_27.push('GEOIP,CN,\uD83C\uDFAF 全球直连');
  util663_27.push('FINAL,\uD83D\uDC1F 漏网之鱼');
  return util663_27.join('\n');
}
const remote1141_47 = new TextDecoder();
async function cli468_19(hdr1089_45, util1263_52, net1251_52 = null) {
  if (!net1251_52)
    net1251_52 = new URL(hdr1089_45.url);
  const cli420_17 = [];
  const net1371_57 = net1251_52.hostname;
  const remote1189_49 = net1251_52.searchParams.get('target') || 'base64';
  const remote805_33 = util783_32(false);
  let aux311_12 = null;
  if (util327_13) {
    const aux287_11 = val235_9 || 'https://223.5.5.5/dns-query';
    const node318_13 = arr237_9 || 'cloudflare-ech.com';
    aux311_12 = `${ node318_13 }+${ aux287_11 }`;
  }
  const COL0_REGION_MAP = {
    'SJC':'US','LAX':'US','SEA':'US','SFO':'US','DFW':'US','ORD':'US','IAD':'US','ATL':'US',
    'MIA':'US','DEN':'US','PHX':'US','BOS':'US','EWR':'US','JFK':'US','LAS':'US','MSP':'US',
    'DTW':'US','PHL':'US','CLT':'US','SLC':'US','PDX':'US','SAN':'US','TPA':'US','IAH':'US',
    'MCO':'US','AUS':'US','BNA':'US','RDU':'US','IND':'US','CMH':'US','MCI':'US','OMA':'US',
    'ABQ':'US','OKC':'US','MEM':'US','JAX':'US','RIC':'US','BUF':'US','PIT':'US','CLE':'US',
    'CVG':'US','MKE':'US','STL':'US','SAT':'US','HNL':'US','ANC':'US','SMF':'US','ONT':'US',
    'OAK':'US','HKG':'HK','TPE':'TW','TSA':'TW','KHH':'TW',
    'NRT':'JP','HND':'JP','KIX':'JP','ITM':'JP','NGO':'JP','FUK':'JP','CTS':'JP','OKA':'JP',
    'ICN':'KR','GMP':'KR','PUS':'KR','SIN':'SG','BKK':'TH','DMK':'TH','KUL':'MY','CGK':'ID',
    'MNL':'PH','CEB':'PH','HAN':'VN','SGN':'VN','DAD':'VN','RGN':'MM','PNH':'KH','REP':'KH',
    'VTE':'LA','BOM':'IN','DEL':'IN','MAA':'IN','BLR':'IN','CCU':'IN','HYD':'IN','AMD':'IN',
    'COK':'IN','PNQ':'IN','GOI':'IN','CMB':'LK','DAC':'BD','KTM':'NP','ISB':'PK','KHI':'PK',
    'LHE':'PK','LHR':'GB','LGW':'GB','STN':'GB','LTN':'GB','MAN':'GB','EDI':'GB','BHX':'GB',
    'CDG':'FR','ORY':'FR','MRS':'FR','LYS':'FR','NCE':'FR','FRA':'DE','MUC':'DE','TXL':'DE',
    'BER':'DE','HAM':'DE','DUS':'DE','CGN':'DE','STR':'DE','AMS':'NL','BRU':'BE','LUX':'LU',
    'ZRH':'CH','GVA':'CH','BSL':'CH','VIE':'AT','PRG':'CZ','BUD':'HU','WAW':'PL','KRK':'PL',
    'MXP':'IT','LIN':'IT','FCO':'IT','VCE':'IT','NAP':'IT','FLR':'IT','BGY':'IT',
    'MAD':'ES','BCN':'ES','PMI':'ES','AGP':'ES','VLC':'ES','SVQ':'ES','BIO':'ES',
    'LIS':'PT','OPO':'PT','FAO':'PT','DUB':'IE','CPH':'DK','ARN':'SE','GOT':'SE','OSL':'NO',
    'BGO':'NO','HEL':'FI','RIX':'LV','TLL':'EE','VNO':'LT','ATH':'GR','SKG':'GR','SOF':'BG',
    'OTP':'RO','BEG':'RS','ZAG':'HR','LJU':'SI','KBP':'UA','IEV':'UA','ODS':'UA',
    'SVO':'RU','DME':'RU','VKO':'RU','LED':'RU','SYD':'AU','MEL':'AU','BNE':'AU','PER':'AU',
    'ADL':'AU','CBR':'AU','AKL':'NZ','WLG':'NZ','DXB':'AE','AUH':'AE','DOH':'QA','RUH':'SA',
    'JED':'SA','TLV':'IL','KWI':'KW','BAH':'BH','CPT':'ZA','JNB':'ZA','LOS':'NG','CAI':'EG',
    'NBO':'KE','MEX':'MX','GRU':'BR','GIG':'BR','EZE':'AR','SCL':'CL','LIM':'PE','BOG':'CO',
    'CCS':'VE','HAV':'CU','SJU':'PR','SDQ':'DO','PAP':'HT','KIN':'JM','NAS':'BS','MBJ':'JM',
    'YYZ':'CA','YVR':'CA','YYC':'CA','YUL':'CA','YOW':'CA'
  };
  // ===== Region name mapping (CN) -> code =====
  const CN_REGION_MAP = {
    '香港':'HK','台湾':'TW','日本':'JP','韩国':'KR','新加坡':'SG','美国':'US','德国':'DE',
    '瑞典':'SE','荷兰':'NL','芬兰':'FI','英国':'GB','法国':'FR','意大利':'IT','西班牙':'ES',
    '加拿大':'CA','澳大利亚':'AU','新西兰':'NZ','泰国':'TH','马来西亚':'MY','印度尼西亚':'ID',
    '菲律宾':'PH','越南':'VN','印度':'IN','阿联酋':'AE','以色列':'IL','南非':'ZA','巴西':'BR',
    '墨西哥':'MX','阿根廷':'AR','瑞士':'CH','奥地利':'AT','捷克':'CZ','波兰':'PL','匈牙利':'HU',
    '希腊':'GR','爱尔兰':'IE','丹麦':'DK','挪威':'NO','俄罗斯':'RU','乌克兰':'UA','比利时':'BE'
  };
  function ResolveIspRegion(isp) {
    if (!isp) return '';
    const txt = String(isp);
    let m = txt.match(/ProxyIP-([A-Za-z]{2})/i);
    if (m) return m[1].toUpperCase();
    for (const cn of Object.keys(CN_REGION_MAP)) {
      if (txt.includes(cn)) return CN_REGION_MAP[cn];
    }
    m = txt.match(/\b([A-Z]{3})\b/g);
    if (m) {
      for (const colo of m) {
        const r = COL0_REGION_MAP[colo];
        if (r) return r;
      }
    }
    m = txt.match(/\b(HK|US|SG|JP|KR|DE|SE|NL|FI|GB|TW|IN|TH|AU|CA|FR|MY|ID|PH|VN|RU|UA|CH|AT|BE|IE|DK|NO|PL|CZ|HU|ES|IT|PT)\b/i);
    if (m) return m[1].toUpperCase();
    return '';
  }
  async function util_15(hdr633_26) {
    const map572_23 = state449_18('ipv4', '') === '' || state449_18('ipv4', 'yes') !== 'no';
    const tmp576_23 = state449_18('ipv6', '') === '' || state449_18('ipv6', 'yes') !== 'no';
    if (hdr633_26 && hdr633_26.length > 0) {
      hdr633_26 = hdr633_26.filter(ItemX14 => {
        const net1443_60 = String(ItemX14 && ItemX14.ip || '').trim();
        if (!net1443_60)
          return true;
        const buf173_7 = (net1443_60.match(/:/g) || []).length;
        const tmp600_24 = net1443_60.startsWith('[') || buf173_7 > 1;
        if (tmp600_24)
          return tmp576_23;
        return map572_23;
      });
    }
    // ===== Region binding =====
    if (hdr633_26 && hdr633_26.length > 0) {
      const selRegion = String(mgr232_9 || '').toUpperCase();
      const isSpecificRegion = selRegion && selRegion !== 'CF' && selRegion !== 'CUSTOM';
      if (isSpecificRegion) {
        hdr633_26 = hdr633_26.filter(ItemX14 => {
          const r = String(ItemX14 && ItemX14.regionCode || '').toUpperCase();
          if (r) return r === selRegion;
          const c = String(ItemX14 && ItemX14.colo || '').toUpperCase();
          if (c) return (COL0_REGION_MAP[c] || '') === selRegion;
          const i = String(ItemX14 && ItemX14.isp || '');
          const ir = ResolveIspRegion(i);
          if (ir) return ir === selRegion;
          return false;
        });
      }
    }
    if (state329_13) {
      cli420_17.push(...mgr112_4(hdr633_26, util1263_52, net1371_57, aux311_12, false, remote805_33));
    }
    if (fn334_13) {
      cli420_17.push(...await util111_4(hdr633_26, util1263_52, net1371_57, aux311_12, false, remote805_33));
    }
    if (aux335_13) {
      cli420_17.push(...state113_4(hdr633_26, util1263_52, net1371_57, aux311_12, false, remote805_33));
    }
  }
  if (mgr328_13) {
    if (!(mgr232_9 === 'CUSTOM')) {
      try {
        const aux815_33 = [{
            ip: net1371_57,
            isp: '原生地址'
          }];
        await util_15(aux815_33);
      } catch (req370_15) {
        if (!mgr232_9) {
          mgr232_9 = 'CF';
        }
        const hdr81_3 = await data446_18(mgr232_9);
        if (!hdr81_3) {
          const fn814_33 = [{
              ip: net1371_57,
              isp: '原生地址'
            }];
          await util_15(fn814_33);
        } else {
          aux407_16 = hdr81_3.domain + ':' + hdr81_3.port;
          const util87_3 = [{
              ip: hdr81_3.domain,
              isp: 'ProxyIP-' + mgr232_9
            }];
          await util_15(util87_3);
        }
      }
    } else {
      const tmp816_33 = [{
          ip: net1371_57,
          isp: '原生地址'
        }];
      await util_15(tmp816_33);
    }
  }
  const aux599_24 = tmp240_9.length > 0 || cfg241_10.length > 0;
  if (state281_11) {
  } else if (!!aux599_24) {
    if (tmp240_9.length > 0 && val331_13) {
      await util_15(tmp240_9);
    }
    if (cfg241_10.length > 0 && op330_13) {
      const map236_9 = cfg241_10.map(node246_10 => ({
        ip: node246_10.domain,
        isp: node246_10.name || node246_10.domain
      }));
      await util_15(map236_9);
    }
  } else {
    if (op330_13) {
      const proto296_12 = remote277_11.map(buf245_10 => ({
        ip: buf245_10.domain,
        isp: buf245_10.name || buf245_10.domain
      }));
      await util_15(proto296_12);
    }
    if (val331_13) {
      if (!link967_40) {
        const hdr585_24 = mgr232_9 && mgr232_9 !== 'CF' && mgr232_9 !== 'CUSTOM';
        try {
          let util975_40 = null;
          if (hdr585_24) {
            const data1046_43 = await data446_18(mgr232_9);
            if (data1046_43 && data1046_43.domain) {
              aux407_16 = data1046_43.domain + ':' + (data1046_43.port || 443);
              util975_40 = [{
                  ip: data1046_43.domain,
                  isp: 'ProxyIP-' + mgr232_9
                }];
            }
          }
          if (!util975_40) {
            const buf53_2 = await remote445_18();
            if (buf53_2.length > 0) {
              util975_40 = buf53_2;
            }
          }
          if (util975_40 && util975_40.length > 0) {
            await util_15(util975_40);
          }
        } catch (hdr369_15) {
          if (!mgr232_9) {
            mgr232_9 = 'CF';
          }
          const proto80_3 = await data446_18(mgr232_9);
          if (proto80_3) {
            aux407_16 = proto80_3.domain + ':' + proto80_3.port;
            const data86_3 = [{
                ip: proto80_3.domain,
                isp: 'ProxyIP-' + mgr232_9
              }];
            await util_15(data86_3);
          }
        }
      }
    }
    if (arr333_13) {
      try {
        const net819_34 = await link415_17();
        if (net819_34.length > 0) {
          await util_15(net819_34);
        }
      } catch (proto368_15) {
        if (!mgr232_9) {
          mgr232_9 = 'CF';
        }
        const link79_3 = await data446_18(mgr232_9);
        if (link79_3) {
          aux407_16 = link79_3.domain + ':' + link79_3.port;
          const remote85_3 = [{
              ip: link79_3.domain,
              isp: 'ProxyIP-' + mgr232_9
            }];
          await util_15(remote85_3);
        }
      }
    }
  }
  const link1183_49 = String(mgr448_18('subMode', '')).trim().toLowerCase();
  if (link1183_49 === 'random' || link1183_49 === 'custom' || link1183_49 === 'generator') {
    try {
      const buf797_33 = await data110_4(hdr1089_45, link1183_49);
      if (buf797_33.length > 0) {
        await util_15(buf797_33);
      }
    } catch (node1182_49) {
      console.error('优选订阅生成模块出错:', node1182_49);
    }
  }
  if (cli420_17.length === 0) {
    const data398_16 = '所有节点获取失败';
    const srv986_41 = 'vless';
    const fn382_15 = `${ srv986_41 }://00000000-0000-0000-0000-000000000000@127.0.0.1:80?encryption=none&security=none&type=ws&host=error.com&path=%2F#${ encodeURIComponent(data398_16) }`;
    cli420_17.push(fn382_15);
  }
  let proto1184_49;
  let ws196_8 = 'text/plain; charset=utf-8';
  switch (remote1189_49.toLowerCase()) {
  case 'clash':
  case 'clashr':
  case 'stash':
  case 'meta':
  case 'clashmeta':
    proto1184_49 = node438_18(cli420_17);
    ws196_8 = 'text/yaml; charset=utf-8';
    break;
  case 'surge':
  case 'surge2':
  case 'surge3':
  case 'surge4':
    proto1184_49 = buf437_18(cli420_17);
    ws196_8 = 'text/plain; charset=utf-8';
    break;
  case 'quantumult':
  case 'quanx':
  case 'quanx':
    proto1184_49 = net435_18(cli420_17);
    ws196_8 = 'text/plain; charset=utf-8';
    break;
  case 'ss':
  case 'ssr':
    proto1184_49 = btoa(cli420_17.join('\n'));
    break;
  case 'v2ray':
    proto1184_49 = btoa(cli420_17.join('\n'));
    break;
  case 'loon':
    proto1184_49 = ws436_18(cli420_17);
    ws196_8 = 'text/plain; charset=utf-8';
    break;
  case 'singbox':
  case 'sing-box':
  case 'singbox':
    proto1184_49 = proto440_18(cli420_17);
    ws196_8 = 'application/json; charset=utf-8';
    break;
  default:
    proto1184_49 = btoa(cli420_17.join('\n'));
  }
  const arr1101_45 = {
    'Content-Type': ws196_8,
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
  };
  const hdr1185_49 = parseInt(mgr448_18('subUpdateTime', 3));
  if (hdr1185_49 > 0) {
    arr1101_45['Profile-Update-Interval'] = String(hdr1185_49);
  }
  if (util327_13) {
    arr1101_45['X-ECH-Status'] = 'ENABLED';
    if (aux311_12) {
      arr1101_45['X-ECH-Config-Length'] = String(aux311_12.length);
    }
  }
  return new Response(proto1184_49, { headers: arr1101_45 });
}
const arr1269_52 = new Map();
function aux455_18(data1142_47) {
  return new Uint8Array(new ArrayBuffer(data1142_47 || req1330_55));
}
export default {
  async fetch(res1091_45, srv770_32, cfg769_32) {
    try {
      const fn598_24 = res1091_45.headers.get('Upgrade') === "websocket";
      const proto584_24 = res1091_45.method === 'POST';
      const data1094_45 = new URL(res1091_45.url);
      const proto920_38 = data1094_45.pathname.split('/').filter(node870_36 => node870_36);
      // 兼容大小写的 U / UUID 环境变量读取 (u/U/uuid/UUID/Uuid 等任意写法均可)
      const envU_66 = (() => { const env_66 = srv770_32 || {}; for (const key_66 of Object.keys(env_66)) { const low_66 = key_66.toLowerCase(); if (low_66 === 'u' || low_66 === 'uuid') return env_66[key_66]; } return ''; })();
      if (!fn598_24 && !proto584_24 && data1094_45.pathname !== '/') {
        const util1311_54 = (envU_66 || '').toLowerCase();
        const data1310_54 = (srv770_32.d || srv770_32.D || '').toLowerCase();
        const data1430_59 = proto920_38[0] || '';
        const mgr160_6 = data1310_54.startsWith('/') ? data1310_54.substring(1) : data1310_54;
        if (data1430_59 !== util1311_54 && (mgr160_6 ? data1430_59 !== mgr160_6 : false)) {
          return new Response('Not Found', {
            status: 404
          });
        }
      }
      await op570_23(srv770_32);
       // read auth token: uppercase var U (UUID-compatible), trim and lowercase
      aux71_2 = String(envU_66 || aux71_2 || '').trim().toLowerCase();
      const val1339_55 = (srv770_32.d || srv770_32.D || aux71_2).toLowerCase();
      const tmp768_31 = state449_18('p', srv770_32.p || srv770_32.P);
      let link1327_55 = false;
      const fn790_32 = state449_18('wk', srv770_32.wk || srv770_32.WK);
      if (fn790_32 && fn790_32.trim()) {
        map788_32 = fn790_32.trim().toUpperCase();
        mgr232_9 = map788_32;
      } else if (tmp768_31 && tmp768_31.trim()) {
        link1327_55 = true;
        mgr232_9 = 'CUSTOM';
      } else {
        // wk empty = official direct: use built-in addresses, skip region detection for third-party domains
        mgr232_9 = 'CF';
      }
      const mgr1048_43 = mgr448_18('rm', node270_11.rm, srv770_32.rm || srv770_32.RM);
      map332_13 = !(mgr1048_43 && mgr1048_43.toLowerCase() === 'no');
      const hdr1329_55 = mgr448_18('p', node270_11.p, srv770_32.p || srv770_32.P);
      aux407_16 = hdr1329_55 ? hdr1329_55.trim() : '';
      hdr1161_48 = mgr448_18('s', node270_11.s, srv770_32.s || srv770_32.S);
      if (hdr1161_48) {
        try {
          aux887_36 = mgr880_36(hdr1161_48);
          hdr993_41 = true;
        } catch (mgr376_15) {
          hdr993_41 = false;
        }
      } else {
        aux887_36 = {};
        hdr993_41 = false;
      }
      // EdgeTunnel feature: GO2SOCKS5 domain whitelist — whitelisted targets are forced through the proxy from the s variable
      const fn1366_56 = srv770_32.GO2SOCKS5 || srv770_32.gO2SOCKS5 || state449_18('GO2SOCKS5', '');
      srv434_18 = String(fn1366_56).split(/[,，\s]+/).map(ItemX14 => String(ItemX14).trim().replace(/^\*\./, '').toLowerCase()).filter(ItemX14 => ItemX14);
      const aux239_9 = state449_18('yx', srv770_32.yx || srv770_32.YX);
      if (aux239_9) {
        try {
          const remote973_40 = aux239_9.split(',').map(arr621_25 => arr621_25.trim()).filter(map620_25 => map620_25);
          tmp240_9 = [];
          cfg241_10 = [];
          remote973_40.forEach(val619_25 => {
            let util831_34 = '';
            let state41_1 = val619_25;
            if (val619_25.includes('#')) {
              const link895_37 = val619_25.split('#');
              state41_1 = link895_37[0].trim();
              util831_34 = link895_37[1].trim();
            }
            const {
              address: net27_1,
              port: util951_39
            } = req874_36(state41_1);
            if (!util831_34) {
              util831_34 = '自定义优选-' + net27_1 + (util951_39 ? ':' + util951_39 : '');
            }
            if (val595_24(net27_1)) {
              tmp240_9.push({
                ip: net27_1,
                port: util951_39,
                isp: util831_34
              });
            } else {
              cfg241_10.push({
                domain: net27_1,
                port: util951_39,
                name: util831_34
              });
            }
          });
        } catch (util375_15) {
          tmp240_9 = [];
          cfg241_10 = [];
        }
      }
      const hdr1353_56 = mgr448_18('qj', node270_11.qj, srv770_32.qj || srv770_32.QJ);
      const cli1356_56 = (hdr1353_56 || '').toLowerCase();
      data326_13 = cli1356_56 === 'no';
      util999_41 = cli1356_56 === 'only';
      const proto1352_56 = mgr448_18('dkby', node270_11.dkby, srv770_32.dkby || srv770_32.DKBY);
      mgr280_11 = !!(proto1352_56 && proto1352_56.toLowerCase() === 'yes');
      const link1351_56 = mgr448_18('yxby', node270_11.yxby, srv770_32.yxby || srv770_32.YXBY);
      state281_11 = !!(link1351_56 && link1351_56.toLowerCase() === 'yes');
      state329_13 = util447_18('ev', true, srv770_32.ev);
      fn334_13 = util447_18('et', false, srv770_32.et);
      link1231_51 = mgr448_18('tp', node270_11.tp, srv770_32.tp);
      aux335_13 = util447_18('ex', false, srv770_32.ex);
      buf1181_49 = mgr448_18('scu', node270_11.scu, srv770_32.scu);
      op330_13 = util447_18('epd', true, srv770_32.epd || srv770_32.EPD);
      val331_13 = util447_18('epi', true, srv770_32.epi || srv770_32.EPI);
      arr333_13 = util447_18('egi', true, srv770_32.egi || srv770_32.EGI);
      mgr328_13 = util447_18('ena', false, srv770_32.ena || srv770_32.ENA);
      util327_13 = util447_18('ech', false, srv770_32.ech || srv770_32.ECH);

      // loadcustomDNS and ECHdomainconfig
      val235_9 = mgr448_18('customDNS', node270_11.customDNS).trim() || node270_11.customDNS;
      arr237_9 = mgr448_18('customECHDomain', node270_11.customECHDomain).trim() || node270_11.customECHDomain;
      state233_9 = aux839_34(mgr448_18('alpn', node270_11.alpn, srv770_32.alpn || srv770_32.ALPN));

      // if ECH is on, force TLS-only mode (avoid port-80 interference)
      // ECH needs TLS, so non-TLS nodes must be disabled
      if (util327_13) {
        mgr280_11 = true;
        // check whether KV has dkby: yes; write it if missing
        const util231_9 = state449_18('dkby', '');
        if (util231_9 !== 'yes') {
          await cli1140_47('dkby', 'yes');
        }
      }
      if (!state329_13 && !fn334_13 && !aux335_13) {
        state329_13 = true;
      }
      link967_40 = mgr448_18('yxURL', node270_11.yxURL, srv770_32.yxURL || srv770_32.YXURL);
      fn238_9 = mgr448_18('d', node270_11.d, srv770_32.d || srv770_32.D);
      const node1254_52 = new URL(res1091_45.url);
      if (node1254_52.pathname.includes('/api/config')) {
        const map908_37 = node1254_52.pathname.split('/').filter(buf869_36 => buf869_36);
        const data62_2 = map908_37.indexOf('api');
        if (data62_2 > 0) {
          const link919_38 = map908_37.slice(0, data62_2);
          const node918_38 = link919_38.join('/');
          let op594_24 = false;
          if (fn238_9 && fn238_9.trim()) {
            const data158_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim().substring(1) : fn238_9.trim();
            op594_24 = node918_38 === data158_6;
          } else {
            op594_24 = arr597_24(node918_38) && node918_38 === aux71_2;
          }
          if (op594_24) {
            return await tmp456_18(res1091_45, srv770_32);
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
      if (node1254_52.pathname.includes('/api/preferred-ips')) {
        const val907_37 = node1254_52.pathname.split('/').filter(ws868_36 => ws868_36);
        const res59_2 = val907_37.indexOf('api');
        if (res59_2 > 0) {
          const buf917_38 = val907_37.slice(0, res59_2);
          const ws916_38 = buf917_38.join('/');
          let state593_24 = false;
          if (fn238_9 && fn238_9.trim()) {
            const remote157_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim().substring(1) : fn238_9.trim();
            state593_24 = ws916_38 === remote157_6;
          } else {
            state593_24 = arr597_24(ws916_38) && ws916_38 === aux71_2;
          }
          if (state593_24) {
            return await proto464_19(res1091_45);
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
      if (node1254_52.pathname.includes('/api/network-test')) {
        const state905_37 = node1254_52.pathname.split('/').filter(srv866_36 => srv866_36);
        const remote61_2 = state905_37.indexOf('api');
        if (remote61_2 > 0) {
          const srv914_38 = state905_37.slice(0, remote61_2);
          const cfg913_38 = srv914_38.join('/');
          let util591_24 = false;
          if (fn238_9 && fn238_9.trim()) {
            const req154_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim().substring(1) : fn238_9.trim();
            util591_24 = cfg913_38 === req154_6;
          } else {
            util591_24 = arr597_24(cfg913_38) && cfg913_38 === aux71_2;
          }
          if (util591_24) {
            return await node462_19();
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
      if (node1254_52.pathname.includes('/api/node-speedtest')) {
        const util903_37 = node1254_52.pathname.split('/').filter(tmp864_35 => tmp864_35);
        const cli60_2 = util903_37.indexOf('api');
        if (cli60_2 > 0) {
          const tmp912_37 = util903_37.slice(0, cli60_2);
          const aux911_37 = tmp912_37.join('/');
          let data590_24 = false;
          if (fn238_9 && fn238_9.trim()) {
            const hdr153_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim().substring(1) : fn238_9.trim();
            data590_24 = aux911_37 === hdr153_6;
          } else {
            data590_24 = arr597_24(aux911_37) && aux911_37 === aux71_2;
          }
          if (data590_24) {
            return await req466_19();
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
      if (node1254_52.pathname.includes('/api/latency-test')) {
        const util1167_48 = node1254_52.pathname.split('/').filter(ParamVal9 => ParamVal9);
        const res1163_48 = util1167_48.indexOf('api');
        if (res1163_48 > 0) {
          const data1166_48 = util1167_48.slice(0, res1163_48);
          const mgr1168_48 = data1166_48.join('/');
          let state1169_48 = false;
          if (fn238_9 && fn238_9.trim()) {
            const util159_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim().substring(1) : fn238_9.trim();
            state1169_48 = mgr1168_48 === util159_6;
          } else {
            state1169_48 = arr597_24(mgr1168_48) && mgr1168_48 === aux71_2;
          }
          if (state1169_48) {
            return await cfg457_19(res1091_45);
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
      if (res1091_45.method === 'POST' && aux335_13) {
        const map1028_42 = await state473_19(res1091_45);
        if (map1028_42) {
          cfg769_32.waitUntil(map1028_42.closed);
          return new Response(map1028_42.readable, {
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
      if (res1091_45.headers.get('Upgrade') === "websocket") {
        return await mgr472_19(res1091_45);
      }
      if (res1091_45.method === 'GET') {
        // handle /{UUID}/region or /{custom-path}/region
        if (node1254_52.pathname.endsWith('/region')) {
          const op906_37 = node1254_52.pathname.split('/').filter(net867_36 => net867_36);
          if (op906_37.length === 2 && op906_37[1] === 'region') {
            const net915_38 = op906_37[0];
            let mgr592_24 = false;
            if (fn238_9 && fn238_9.trim()) {
              // using custom path
              const cli156_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim().substring(1) : fn238_9.trim();
              mgr592_24 = net915_38 === cli156_6;
            } else {
              // using UUID path
              mgr592_24 = arr597_24(net915_38) && net915_38 === aux71_2;
            }
            if (mgr592_24) {
              const aux767_31 = state449_18('p', srv770_32.p || srv770_32.P);
              const arr789_32 = state449_18('wk', srv770_32.wk || srv770_32.WK);
              if (arr789_32 && arr789_32.trim()) {
                return new Response(JSON.stringify({
                  region: arr789_32.trim().toUpperCase(),
                  detectionMethod: '手动指定地区',
                  manualRegion: arr789_32.trim().toUpperCase(),
                  timestamp: new Date().toISOString()
                }), {
                  headers: {
                    'Content-Type': 'application/json'
                  }
                });
              } else if (aux767_31 && aux767_31.trim()) {
                return new Response(JSON.stringify({
                  region: 'CUSTOM',
                  detectionMethod: "自定义ProxyIP模式",
                  ci: aux767_31,
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
        if (node1254_52.pathname.endsWith('/test-api')) {
          const mgr904_37 = node1254_52.pathname.split('/').filter(cfg865_36 => cfg865_36);
          if (mgr904_37.length === 2 && mgr904_37[1] === 'test-api') {
            const fn910_37 = mgr904_37[0];
            let remote589_24 = false;
            if (fn238_9 && fn238_9.trim()) {
              // using custom path
              const res155_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim().substring(1) : fn238_9.trim();
              remote589_24 = fn910_37 === res155_6;
            } else {
              // using UUID path
              remote589_24 = arr597_24(fn910_37) && fn910_37 === aux71_2;
            }
            if (remote589_24) {
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
              } catch (data374_15) {
                return new Response(JSON.stringify({
                  error: data374_15.message,
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
        if (node1254_52.pathname === '/') {
          // check for a custom homepage URL (prefer effective config snapshot; supports KV and env HOMEPAGE)
          const remote1357_56 = remote325_13(srv770_32);
          const srv242_10 = remote1357_56.homepage || state449_18('homepage', srv770_32.homepage || srv770_32.HOMEPAGE);
          if (srv242_10 && srv242_10.trim()) {
            try {
              // fetch content from the custom URL
              const aux1343_55 = await fetch(srv242_10.trim(), {
                method: 'GET',
                headers: {
                  'User-Agent': res1091_45.headers.get('User-Agent') || 'Mozilla/5.0',
                  'Accept': res1091_45.headers.get('Accept') || '*/*',
                  'Accept-Language': res1091_45.headers.get('Accept-Language') || 'en-US,en;q=0.9'
                },
                redirect: 'follow'
              });
              if (aux1343_55.ok) {
                // read response body
                const buf197_8 = aux1343_55.headers.get('Content-Type') || 'text/html; charset=utf-8';
                const srv194_8 = await aux1343_55.text();

                // return the custom homepage body
                return new Response(srv194_8, {
                  status: aux1343_55.status,
                  headers: {
                    'Content-Type': buf197_8,
                    'Cache-Control': 'no-cache, no-store, must-revalidate'
                  }
                });
              }
            } catch (remote373_15) {
              // if the fetch fails, fall back to the default terminal page
              console.error('获取自定义首页失败:', remote373_15);
            }
          }
          // check cookie for the language preference first
          const hdr201_8 = res1091_45.headers.get('Cookie') || '';
          let res203_8 = null;
          if (hdr201_8) {
            const fn766_31 = hdr201_8.split(';').map(buf125_5 => buf125_5.trim());
            for (const link199_8 of fn766_31) {
              if (link199_8.startsWith('preferredLanguage=')) {
                res203_8 = link199_8.split('=')[1];
                break;
              }
            }
          }
          let net651_27 = 'zh';
          if (res203_8 === 'fa' || res203_8 === 'fa-IR') {
            net651_27 = 'fa';
          } else if (res203_8 === 'en' || res203_8 === 'en-US' || res203_8 === 'en-GB') {
            net651_27 = 'en';
          } else if (res203_8 === 'zh' || res203_8 === 'zh-CN') {
            net651_27 = 'zh';
          } else {
            // if no cookie, fall back to browser-language detection
            const data_14 = res1091_45.headers.get('Accept-Language') || '';
            const ws100_4 = data_14.split(',')[0].split('-')[0].toLowerCase();
            if (ws100_4 === 'fa' || data_14.includes('fa-IR') || data_14.includes('fa')) {
              net651_27 = 'fa';
            } else if (ws100_4 === 'en') {
              net651_27 = 'en';
            } else {
              net651_27 = 'zh';
            }
          }
          const link583_24 = net651_27 === 'fa';
          const cfg649_27 = net651_27 === 'fa' ? 'fa' : net651_27 === 'en' ? 'en' : 'zh-CN';
          const buf653_27 = net651_27 === 'fa' ? 'fa-IR' : net651_27 === 'en' ? 'en' : 'zh-CN';
          const arr765_31 = {
            zh: {
              title: 'CFBox 终端 v1.1',
              terminal: 'CFBox 终端 v1.1',
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
              title: 'ترمینال v1.1',
              terminal: 'ترمینال v1.1',
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
              title: 'CFBox Terminal v1.1',
              terminal: 'CFBox Terminal v1.1',
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
          const map524_21 = arr765_31[net651_27] || arr765_31['zh'];
          const VisitorIp = res1091_45.headers.get('CF-Connecting-IP') || res1091_45.headers.get('True-Client-IP') || (res1091_45.headers.get('x-forwarded-for') || '').split(',')[0].trim() || '未知';
  const op1194_49 = `<!DOCTYPE html>
    <html lang="${buf653_27}" dir="${link583_24 ? 'rtl' : 'ltr'}">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${map524_21.title}</title>
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
                <span class="cp-hud-line">${net651_27 === 'fa' ? 'آدرس IP فعلی شما' : net651_27 === 'en' ? 'Your current IP address' : '您当前IP地址'}：${VisitorIp}<span id="currentIPRegion" style="color: #ffb400;"></span></span>
                <div class="cp-lang-wrapper">
                    <select id="languageSelector" onchange="SwitchLang(this.value)">
                        <option value="zh" ${net651_27 === 'zh' ? 'selected' : ''}>🇨🇳 中文</option>
                        <option value="fa" ${net651_27 === 'fa' ? 'selected' : ''}>🇮🇷 فارسی</option>
                        <option value="en" ${net651_27 === 'en' ? 'selected' : ''}>🇺🇸 English</option>
                    </select>
                </div>
            </div>
        <script>
            // 当前IP地区检测 (多源 JSONP: ping0.cc 主源 + ipinfo.io 备用, script 加载不受 CORS 限制)
            window.cfboxRegionCallback = function (a, b, c, d, e) {
                var el = document.getElementById('currentIPRegion');
                if (!el || window.__cfRegionDone) return;
                var loc = null;
                if (b) {
                    loc = b;
                } else if (a && typeof a === 'object') {
                    loc = [a.country, a.region, a.city].filter(function (x) { return x; }).join(' ');
                }
                if (loc) {
                    el.textContent = ' · ' + loc;
                    window.__cfRegionDone = true;
                }
            };
            (function () {
                window.__cfRegionDone = false;
                var sources = [
                    'https://ipv4.ping0.cc/geo/jsonp/cfboxRegionCallback',
                    'https://ipinfo.io/?callback=cfboxRegionCallback'
                ];
                var idx = 0;
                function loadNext() {
                    if (window.__cfRegionDone || idx >= sources.length) return;
                    var src = sources[idx++];
                    try {
                        var s = document.createElement('script');
                        s.src = src;
                        s.async = true;
                        s.onerror = function () { loadNext(); };
                        (document.head || document.documentElement).appendChild(s);
                    } catch (e) {}
                }
                loadNext();
                setTimeout(function () {
                    if (!window.__cfRegionDone && idx < sources.length) loadNext();
                }, 4000);
            })();
        </script>
        <div class="terminal">
            <div class="terminal-header">
                <div class="terminal-buttons">
                    <div class="terminal-button"></div>
                    <div class="terminal-button"></div>
                    <div class="terminal-button"></div>
                </div>
                    <div class="terminal-title cp-glitch">${map524_21.terminal}</div>
            </div>
            <div class="terminal-body" id="terminalBody">
                <div class="terminal-line">
                    <span class="terminal-output">${map524_21.congratulations}</span>
                </div>
                <div class="terminal-line">
                    <span class="terminal-output">${fn238_9 && fn238_9.trim() ? map524_21.enterD : map524_21.enterU}</span>
                </div>
                <div class="terminal-line">
                    <input type="text" class="terminal-input" id="uuidInput" placeholder="${fn238_9 && fn238_9.trim() ? map524_21.inputD : map524_21.inputU}" autofocus>
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
  const CustomPath = '${fn238_9}';
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
          return new Response(op1194_49, {
            status: 200,
            headers: {
              'Content-Type': 'text/html; charset=utf-8'
            }
          });
        }
        if (fn238_9 && fn238_9.trim()) {
          const proto152_6 = fn238_9.trim().startsWith('/') ? fn238_9.trim() : '/' + fn238_9.trim();
          const cfg841_35 = proto152_6.endsWith('/') && proto152_6.length > 1 ? proto152_6.slice(0, -1) : proto152_6;
          const ws844_35 = node1254_52.pathname.endsWith('/') && node1254_52.pathname.length > 1 ? node1254_52.pathname.slice(0, -1) : node1254_52.pathname;
          if (ws844_35 === cfg841_35) {
            return await res467_19(res1091_45, aux71_2);
          }
          if (ws844_35 === cfg841_35 + '/sub') {
            return await cli468_19(res1091_45, aux71_2, node1254_52);
          }
          if (node1254_52.pathname.length > 1 && node1254_52.pathname !== '/') {
            const op1266_52 = node1254_52.pathname.replace(/\/$/, '').replace('/sub', '').substring(1);
            if (arr597_24(op1266_52)) {
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
          if (node1254_52.pathname.length > 1 && node1254_52.pathname !== '/' && !node1254_52.pathname.includes('/sub')) {
            const state1265_52 = node1254_52.pathname.replace(/\/$/, '').substring(1);
            if (arr597_24(state1265_52)) {
              // UUID is case-insensitive: lowercase before comparing with the auth token
              if (state1265_52.toLowerCase() === aux71_2) {
                return await res467_19(res1091_45, state1265_52);
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
          if (node1254_52.pathname.includes('/sub')) {
            const data902_37 = node1254_52.pathname.split('/');
            if (data902_37.length === 2 && data902_37[1] === 'sub') {
              const mgr1264_52 = data902_37[0].substring(1);
              if (arr597_24(mgr1264_52)) {
                if (mgr1264_52.toLowerCase() === aux71_2) {
                  return await cli468_19(res1091_45, mgr1264_52, node1254_52);
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
        if (node1254_52.pathname.toLowerCase().includes(`/${val1339_55}`)) {
          return await cli468_19(res1091_45, aux71_2);
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
    } catch (cli372_15) {
      return new Response(cli372_15.toString(), {
        status: 500
      });
    }
  }
};
async function val475_19(tmp96_3, aux1271_52) {
  if (mgr1288_53 >= proto656_27) {
    return new Response('Too many connections', { status: 429 });
  }
  mgr1288_53++;
  let op690_28 = false;
  const state689_28 = () => {
    if (!op690_28) {
      mgr1288_53 = Math.max(0, mgr1288_53 - 1);
      op690_28 = true;
    }
  };
  try {
    const mgr688_28 = await aux1031_42(tmp96_3, aux1271_52);
    if (typeof mgr688_28 !== 'object' || !mgr688_28) {
      return null;
    }
    const link1063_44 = await hdr921_38(mgr688_28, aux407_16, '13.230.34.30');
    if (link1063_44 === null) {
      return null;
    }
    const arr189_7 = Promise.race([
      (async () => {
        try {
          await link1063_44.downloader.done;
        } catch (data350_14) {
        }
      })(),
      (async () => {
        try {
          await link1063_44.uploader.done;
        } catch (remote349_14) {
        }
      })(),
      op474_19(cfg1345_56).then(() => {
      })
    ]).finally(() => {
      try {
        link1063_44.close();
      } catch (util543_22) {
      }
      try {
        link1063_44.downloader.abort();
      } catch (data542_22) {
      }
      try {
        link1063_44.uploader.abort();
      } catch (remote541_22) {
      }
      state689_28();
    });
    return {
      readable: link1063_44.downloader.readable,
      closed: arr189_7
    };
  } catch (cli348_14) {
    state689_28();
    return null;
  }
}


// ============================================================
// internal format converter - no external service dependency
// ============================================================

// quote for YAML (avoid IPv6 brackets and commas being parsed as arrays)
async function val1195_49(Host, Port) {
  return new Promise(proto872_36 => {
    const StartXX = Date.now();
    let req298_12 = false;
    const data422_17 = ReadResult => {
      if (req298_12)
        return;
      req298_12 = true;
      proto872_36(ReadResult);
    };
    let cfg1153_48 = null;
    try {
      cfg1153_48 = Connect({
        hostname: Host,
        port: Port
      });
      cfg1153_48.opened.then(() => {
        const proto272_11 = Date.now() - StartXX;
        try {
          cfg1153_48.close();
        } catch (e) {
        }
        data422_17({
          success: true,
          latency: proto272_11
        });
      }).catch(() => data422_17({
        success: false,
        latency: -1
      }));
      setTimeout(() => {
        try {
          if (cfg1153_48)
            cfg1153_48.close();
        } catch (e) {
        }
        data422_17({
          success: false,
          latency: -1
        });
      }, 8000);
    } catch (e) {
      data422_17({
        success: false,
        latency: -1
      });
    }
  });
}

// URL.hostname keeps IPv6 brackets; writing them raw into YAML is treated as an array
function val787_32(link703_29, node702_29) {
  const cfg169_7 = new XhttpCntX();
  const req1378_57 = node702_29.getWriter();
  const buf701_29 = (async () => {
    try {
      await op1002_41(cfg169_7, req1378_57, link703_29);
    } catch (op354_14) {
      throw op354_14;
    } finally {
      try {
        await req1378_57.close();
      } catch (state353_14) {
      }
    }
  })();
  return {
    counter: cfg169_7,
    done: buf701_29,
    abort: () => {
      try {
        req1378_57.abort();
      } catch (fn550_22) {
      }
    }
  };
}

// policy group list: group + all nodes (avoid groups with only the selector and no concrete nodes)
function util783_32(fn1150_47 = false) {
  const proto224_9 = {};
  return fn622_25 => {
    const arr93_3 = res827_34(fn622_25);
    if (fn1150_47)
      return arr93_3;
    proto224_9[arr93_3] = (proto224_9[arr93_3] || 0) + 1;
    return `${ arr93_3 }-${ String(proto224_9[arr93_3]).padStart(2, '0') }`;
  };
}

// Quanx client policy groups: group + all nodes
function val883_36(arr141_5, ws1228_51) {
  const val115_4 = net1227_51(arr141_5);
  if (val115_4.byteLength < 24)
    return {
      hasError: true,
      message: srv386_16
    };
  const remote733_30 = val115_4.subarray(0, 1);
  if (!srv794_33(val115_4, 1, ws1228_51))
    return {
      hasError: true,
      message: buf389_16
    };
  const state1337_55 = val115_4[17];
  const aux167_6 = 18 + state1337_55;
  if (val115_4.byteLength < aux167_6 + 5)
    return {
      hasError: true,
      message: srv386_16
    };
  const fn166_6 = val115_4[aux167_6];
  let res587_24 = false;
  if (fn166_6 === 1) {
  } else if (!!(fn166_6 === 2)) {
    res587_24 = true;
  } else {
    return {
      hasError: true,
      message: remote397_16
    };
  }
  const fn958_39 = 19 + state1337_55;
  const map932_38 = val115_4[fn958_39] << 8 | val115_4[fn958_39 + 1];
  let res35_1 = fn958_39 + 2, remote37_1 = 0, cfg49_2 = res35_1 + 1, util519_21 = '';
  const map44_1 = val115_4[res35_1];
  switch (map44_1) {
  case buf_5:
    remote37_1 = 4;
    if (val115_4.byteLength < cfg49_2 + remote37_1)
      return {
        hasError: true,
        message: srv386_16
      };
    util519_21 = `${ val115_4[cfg49_2] }.${ val115_4[cfg49_2 + 1] }.${ val115_4[cfg49_2 + 2] }.${ val115_4[cfg49_2 + 3] }`;
    break;
  case ws_4:
    if (val115_4.byteLength < cfg49_2 + 1)
      return {
        hasError: true,
        message: srv386_16
      };
    remote37_1 = val115_4[cfg49_2++];
    if (val115_4.byteLength < cfg49_2 + remote37_1)
      return {
        hasError: true,
        message: srv386_16
      };
    util519_21 = remote1141_47.decode(val115_4.subarray(cfg49_2, cfg49_2 + remote37_1));
    break;
  case node_6:
    remote37_1 = 16;
    if (val115_4.byteLength < cfg49_2 + remote37_1)
      return {
        hasError: true,
        message: srv386_16
      };
    const srv1322_55 = [];
    const node1350_56 = new DataView(val115_4.buffer, val115_4.byteOffset + cfg49_2, remote37_1);
    for (let res539_22 = 0; res539_22 < 8; res539_22++)
      srv1322_55.push(node1350_56.getUint16(res539_22 * 2).toString(16));
    util519_21 = srv1322_55.join(':');
    break;
  default:
    return {
      hasError: true,
      message: `${ cfg385_16 }: ${ map44_1 }`
    };
  }
  if (!util519_21)
    return {
      hasError: true,
      message: `${ tmp384_15 }: ${ map44_1 }`
    };
  return {
    hasError: false,
    addressType: map44_1,
    port: map932_38,
    hostname: util519_21,
    isUDP: res587_24,
    rawIndex: cfg49_2 + remote37_1,
    version: remote733_30
  };
}

// parse an arbitrary share link into a generic node object
function cli876_36(Val, DefaultOn = false) {
  if (Val === undefined || Val === null || Val === '')
    return DefaultOn;
  if (Val === true || Val === false)
    return Val;
  const Text = String(Val).trim().toLowerCase();
  if (Text === 'yes' || Text === 'true' || Text === '1' || Text === 'on')
    return true;
  if (Text === 'no' || Text === 'false' || Text === '0' || Text === 'off')
    return false;
  return DefaultOn;
}

// single node to block-style YAML (avoid flow-style parse errors)
async function map1004_41(mgr1240_51, DefaultPort = '443', map1220_50 = 3000) {
  if (!mgr1240_51?.length)
    return [];
  const tmp1104_45 = new Set();
  await Promise.allSettled(mgr1240_51.map(async URL => {
    const net483_20 = URL.indexOf('#');
    const hdr825_34 = net483_20 > -1 ? URL.substring(0, net483_20) : URL;
    const srv_2 = net483_20 > -1 ? decodeURIComponent(URL.substring(net483_20 + 1)) : null;
    if (hdr825_34.toLowerCase().startsWith('sub://')) {
      const PrefIps = await hdr417_17(hdr825_34);
      for (const arr525_21 of PrefIps) {
        tmp1104_45.add(srv_2 ? arr525_21.includes('#') ? `${ arr525_21 } [${ srv_2 }]` : `${ arr525_21 }#[${ srv_2 }]` : arr525_21);
      }
      return;
    }
    try {
      const Ctrl = new AbortController();
      const fn1222_50 = setTimeout(() => Ctrl.abort(), map1220_50);
      const Resp = await fetch(hdr825_34, { signal: Ctrl.signal });
      clearTimeout(fn1222_50);
      const Text = await Resp.text();
      if (!Text || !Text.trim())
        return;
      const req826_34 = Text.replace(/\s/g, '');
      if (req826_34.length > 0 && req826_34.length % 4 === 0 && /^[A-Za-z0-9+/]+={0,2}$/.test(req826_34)) {
        try {
          const arr261_10 = atob(req826_34);
          if (arr261_10.includes('://')) {
            const Lines = arr261_10.split('\n');
            for (const Row of Lines) {
              if (!Row.trim())
                continue;
              if (Row.includes('00000000-0000-4000-8000-000000000000') && Row.includes('example.com')) {
                const data38_1 = Row.match(/:\/\/[^@]+@([^?]+)/);
                if (data38_1)
                  tmp1104_45.add(srv_2 ? data38_1[1] + `#[${ srv_2 }]` : data38_1[1]);
              }
            }
            return;
          }
        } catch {
        }
      }
      const Lines = Text.split('\n').map(Row => Row.trim()).filter(Row => Row);
      for (const Row of Lines) {
        const remote1117_46 = Row.indexOf('#');
        const [HostPart, aux1055_43] = remote1117_46 > -1 ? [
          Row.substring(0, remote1117_46),
          Row.substring(remote1117_46)
        ] : [
          Row,
          ''
        ];
        let HasPort = false;
        if (!!HostPart.startsWith('[')) {
          HasPort = /\]:(\d+)$/.test(HostPart);
        } else {
          const ColonPos = HostPart.lastIndexOf(':');
          HasPort = ColonPos > -1 && /^\d+$/.test(HostPart.substring(ColonPos + 1));
        }
        const ItemX14 = HasPort ? Row : `${ HostPart }:${ DefaultPort }${ aux1055_43 }`;
        tmp1104_45.add(srv_2 ? ItemX14.includes('#') ? `${ ItemX14 } [${ srv_2 }]` : `${ ItemX14 }#[${ srv_2 }]` : ItemX14);
      }
    } catch {
    }
  }));
  return Array.from(tmp1104_45);
}

// generate YAML internally (full rule set, remote rule-providers)
async function util471_19(Request) {
  try {
    const remote1429_59 = new URL(Request.url);
    const link991_41 = remote1429_59.searchParams.get('proxy');
    if (!link991_41) {
      return new Response(JSON.stringify({
        success: false,
        error: '缺少 proxy 参数'
      }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    let tmp984_40 = 's5';
    let map68_2 = '';
    let req514_21 = link991_41.trim();
    const ws988_41 = req514_21.match(/^([a-zA-Z][a-zA-Z0-9+.-]*):\/\/(.*)$/);
    if (ws988_41) {
      tmp984_40 = ws988_41[1].toLowerCase();
      req514_21 = ws988_41[2];
      if (tmp984_40 === 'socks5' || tmp984_40 === 's5')
        tmp984_40 = 's5';
      else if (tmp984_40 === 'socks4')
        tmp984_40 = 's4';
    }
    const arr69_2 = req514_21.match(/^([^@]+)@(.*)$/);
    if (arr69_2) {
      map68_2 = arr69_2[1];
      req514_21 = arr69_2[2];
    }
    let srv506_21 = req514_21;
    let Port = 443;
    if (!!req514_21.startsWith('[')) {
      const req1426_59 = req514_21.match(/^\[([^\]]+)\](?::(\d+))?$/);
      if (req1426_59) {
        srv506_21 = req1426_59[1];
        if (req1426_59[2])
          Port = parseInt(req1426_59[2]);
      }
    } else {
      const node174_7 = req514_21.match(/^(.*):(\d+)$/);
      if (node174_7) {
        srv506_21 = node174_7[1];
        Port = parseInt(node174_7[2]);
      }
    }
    if (!srv506_21) {
      return new Response(JSON.stringify({
        success: false,
        error: '代理地址格式无效'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const tmp1176_48 = Date.now();
    try {
      const map1196_49 = Connect({
        hostname: srv506_21,
        port: Port
      });
      if (map1196_49?.opened)
        await map1196_49.opened;
      if (map1196_49 && typeof map1196_49.close === 'function') {
        try {
          map1196_49.close();
        } catch (cfg1441_60) {
        }
      }
    } catch (util183_7) {
      return new Response(JSON.stringify({
        success: false,
        error: 'TCP 连接失败\uFF0C请检查代理地址与端口'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    const fn1102_45 = Date.now() - tmp1176_48;
    return new Response(JSON.stringify({
      success: true,
      responseTime: fn1102_45,
      protocol: tmp984_40,
      ip: srv506_21,
      port: Port,
      hasAuth: !!map68_2
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (ws1420_59) {
    return new Response(JSON.stringify({
      success: false,
      error: String(ws1420_59 && ws1420_59.message || ws1420_59)
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// generate JSON client config internally (full rule set: remote mirror)
function res1067_44(cfg193_8) {
  if (typeof cfg193_8 !== 'string' || !cfg193_8.includes('*'))
    return cfg193_8;
  const CharSet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return cfg193_8.replace(/\*/g, () => {
    let node1446_60 = '';
    for (let i = 0; i < Math.floor(Math.random() * 14) + 3; i++)
      node1446_60 += CharSet[Math.floor(Math.random() * CharSet.length)];
    return node1446_60;
  });
}

// rule source (CDN: jsDelivr GitHub mirror)
const op90_3 = "https://fastly.jsdelivr.net/gh/ACL4SSR/ACL4SSR@master/Clash";
const map1124_46 = proto800_33 => `${op90_3}/${proto800_33}.list`;

// generate ini client config internally (full rule set)

// generate another ini-style client config

// generate Quanx config internally (full remote filter resources)


// global variable to hold ECH debug info
let srv314_13 = '';
// ==================== ⚡️ preferred-sub generator module（移植自 edgetunnel preferredsubscriptiongenerate） ====================








// IPv6 addresses carry no brackets in domain-style addressing
// reattach piggybacked target data from the tunnel response to the readable-stream head
let mgr1288_53 = 0;
const req1330_55 = 128 * 1024;
const val187_7 = 5000;
const cfg1345_56 = 45000;
const hdr657_27 = 2;
const proto656_27 = 32;
class op1434_59 {
  #total;
  constructor() {
    this.#total = 0;
  }
  get() {
    return this.#total;
  }
  add(util1143_47) {
    this.#total += util1143_47;
  }
}
const cfg505_21 = Array.from({
  length: 256
}, (val1411_58, buf533_22) => (buf533_22 + 256).toString(16).slice(1));






