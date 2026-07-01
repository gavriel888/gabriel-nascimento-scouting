const STORAGE_KEY = "central-scouting-v3";
const LEGACY_STORAGE_KEYS = ["central-scouting-v2", "central-scouting-v1"];
const RECOVERY_STORAGE_KEY = "central-scouting-recovery-2026-06-30-2";
const CLOUD_TABLE = "scouting_databases";
const CLOUD_DB_NAME = "main";
const CLOUD_PENDING_KEY = "central-scouting-cloud-pending";
const CLOUD_META_KEY = "central-scouting-cloud-meta";
const DEFAULT_SUPABASE_CONFIG = {
  url: "https://mbegwggqwqlgjdmdzdec.supabase.co",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iZWd3Z2dxd3FsZ2pkbWR6ZGVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NTE1OTQsImV4cCI6MjA5ODQyNzU5NH0.zhyxcg9Fi0f3dsjY4LTYJE9efPE-R7UUaUCVioI9Icg"
};

const COMMON_ATTRS = [
  { key: "tecnica", label: "Técnica" },
  { key: "velocidade", label: "Velocidade" },
  { key: "estatura", label: "Estatura" },
  { key: "competitividade", label: "Competitividade" }
];

const ATTR_DEFINITIONS = {
  zagueiro: {
    label: "Zagueiro",
    positions: ["ZAG"],
    specific: [
      { key: "um_x_um_defensivo", label: "1x1 defensivo" },
      { key: "duelo_aereo", label: "Duelo aéreo" },
      { key: "sentimento_urgencia", label: "Sentimento de urgência" }
    ]
  },
  lateral: {
    label: "Lateral",
    positions: ["LD", "LE"],
    specific: [
      { key: "um_x_um_ofensivo", label: "1x1 ofensivo" },
      { key: "um_x_um_defensivo", label: "1x1 defensivo" },
      { key: "terco_final", label: "Terço final" }
    ]
  },
  meio: {
    label: "Meia/Volante",
    positions: ["VOL", "MC", "MEI"],
    specific: [
      { key: "um_x_um_ofensivo", label: "1x1 ofensivo" },
      { key: "relacao_bola", label: "Relação com bola" },
      { key: "relacao_gol", label: "Relação com gol" }
    ]
  },
  atacante: {
    label: "Atacante/Ponta",
    positions: ["PD", "PE", "ATA"],
    specific: [
      { key: "um_x_um_ofensivo", label: "1x1 ofensivo" },
      { key: "relacao_bola", label: "Relação com bola" },
      { key: "relacao_gol", label: "Relação com gol" }
    ]
  },
  goleiro: {
    label: "Goleiro",
    positions: ["GOL"],
    specific: [
      { key: "defesa_meta", label: "Defesa de meta" },
      { key: "defesa_espaco", label: "Defesa de espaço" },
      { key: "jogo_ofensivo", label: "Jogo ofensivo" }
    ]
  }
};

function attrsForDefinition(def) {
  return [...COMMON_ATTRS, ...def.specific];
}

const ATTRIBUTE_LABELS = (() => {
  const all = [...COMMON_ATTRS, ...Object.values(ATTR_DEFINITIONS).flatMap(def => def.specific)];
  return Object.fromEntries(all.map(attr => [attr.key, attr.label]));
})();

const samplePlayers = [
  {
    id: crypto.randomUUID(),
    nome_completo: "João Silva",
    apelido: "Joãozinho",
    ano_nasc: 2010,
    data_nasc: "2010-05-02",
    clube: "Nova Iguaçu",
    categoria: "Sub-15",
    posicao: "PD",
    pe: "Dir.",
    altura: "174 cm",
    nacionalidade: "Brasil",
    foto_url: "",
    observacao_geral: "Ponta agressivo, forte para atacar profundidade.",
    observations: [
      {
        id: crypto.randomUUID(), data: "2026-06-30", jogo: "Vasco x Nova Iguaçu", adversario: "Vasco", categoria: "Sub-15",
        atributos: { tecnica: 8.0, velocidade: 8.4, estatura: 7.0, competitividade: 7.3, um_x_um_ofensivo: 8.2, relacao_bola: 8.0, relacao_gol: 7.4 },
        nota_geral: 7.8, nivel: "A", projecao: "Alta", status: "Monitorar",
        relatorio: "Muito forte no 1x1, acelera bem e cria vantagem no último terço.", proxima_acao: "Ver novamente"
      },
      {
        id: crypto.randomUUID(), data: "2026-06-20", jogo: "Nova Iguaçu x Flamengo", adversario: "Flamengo", categoria: "Sub-15",
        atributos: { tecnica: 8.2, velocidade: 8.6, estatura: 7.1, competitividade: 7.8, um_x_um_ofensivo: 8.4, relacao_bola: 8.2, relacao_gol: 7.7 },
        nota_geral: 8.0, nivel: "A", projecao: "Alta", status: "Relatório pronto",
        relatorio: "Confirmou repertório no corredor, bom controle orientado e tomada de decisão melhor que no primeiro jogo.", proxima_acao: "Monitorar"
      }
    ]
  },
  {
    id: crypto.randomUUID(),
    nome_completo: "Pedro Lima",
    apelido: "Pedrinho",
    ano_nasc: 2009,
    data_nasc: "2009-02-13",
    clube: "Madureira",
    categoria: "Sub-17",
    posicao: "VOL",
    pe: "Esq.",
    altura: "178 cm",
    nacionalidade: "Brasil",
    foto_url: "",
    observacao_geral: "Volante com boa leitura e passe vertical.",
    observations: [
      {
        id: crypto.randomUUID(), data: "2026-06-25", jogo: "Vasco x Madureira", adversario: "Vasco", categoria: "Sub-17",
        atributos: { tecnica: 8.1, velocidade: 6.9, estatura: 7.4, competitividade: 8.0, um_x_um_ofensivo: 7.2, relacao_bola: 8.3, relacao_gol: 6.8 },
        nota_geral: 7.5, nivel: "B", projecao: "Média", status: "Observando",
        relatorio: "Bom passe vertical, orienta o corpo antes de receber e joga com personalidade sob pressão.", proxima_acao: "Ver contra equipe forte"
      }
    ]
  }
];

let state = loadState();
let selectedId = state.players[0]?.id || null;
let activeTab = "Tudo";
let cloudClient = null;
let cloudUser = null;
let cloudSaveTimer = null;
let cloudSaveInFlight = false;
let applyingCloudState = false;

const $ = (id) => document.getElementById(id);

function loadState() {
  const keys = [STORAGE_KEY, ...LEGACY_STORAGE_KEYS];
  for (const key of keys) {
    const saved = localStorage.getItem(key);
    if (!saved) continue;
    try {
      const parsed = JSON.parse(saved);
      const migrated = mergeRecoveredState(migrateState(parsed));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
      return migrated;
    } catch { /* tenta a próxima chave */ }
  }
  const initialState = mergeRecoveredState({ version: 3, players: samplePlayers });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
  return initialState;
}

function mergeRecoveredState(current) {
  const recovered = window.RECOVERED_SCOUTING_DATA;
  if (!recovered?.players?.length || localStorage.getItem(RECOVERY_STORAGE_KEY) === "done") return current;

  const recoveredState = migrateState(JSON.parse(JSON.stringify(recovered)));
  const merged = { version: 3, players: [...(current.players || [])] };

  recoveredState.players.forEach(recoveredPlayer => {
    const existingIndex = merged.players.findIndex(player => samePlayer(player, recoveredPlayer));
    if (existingIndex === -1) {
      merged.players.push(recoveredPlayer);
    } else {
      merged.players[existingIndex] = mergePlayer(merged.players[existingIndex], recoveredPlayer);
    }
  });

  localStorage.setItem(RECOVERY_STORAGE_KEY, "done");
  return merged;
}

function mergePlayer(current, recovered) {
  const merged = { ...recovered, ...current };
  Object.keys(recovered).forEach(key => {
    if (key !== "observations" && !hasValue(current[key]) && hasValue(recovered[key])) merged[key] = recovered[key];
  });
  merged.observations = mergeObservations(current.observations || [], recovered.observations || []);
  return merged;
}

function mergeObservations(currentObservations, recoveredObservations) {
  const merged = [...currentObservations];
  recoveredObservations.forEach(recoveredObservation => {
    const existingIndex = merged.findIndex(observation => sameObservation(observation, recoveredObservation));
    if (existingIndex === -1) {
      merged.push(recoveredObservation);
    } else {
      merged[existingIndex] = mergeObservation(merged[existingIndex], recoveredObservation);
    }
  });
  return merged;
}

function mergeObservation(current, recovered) {
  const merged = { ...recovered, ...current };
  Object.keys(recovered).forEach(key => {
    if (key !== "atributos" && !hasValue(current[key]) && hasValue(recovered[key])) merged[key] = recovered[key];
  });
  merged.atributos = { ...(recovered.atributos || {}), ...(current.atributos || {}) };
  return merged;
}

function samePlayer(a, b) {
  if (a.id && b.id && a.id === b.id) return true;
  const aKey = playerNaturalKey(a);
  return Boolean(aKey && aKey === playerNaturalKey(b));
}

function sameObservation(a, b) {
  if (a.id && b.id && a.id === b.id) return true;
  const aKey = observationNaturalKey(a);
  return Boolean(aKey && aKey === observationNaturalKey(b));
}

function playerNaturalKey(player) {
  return [
    textKey(player.nome_completo || player.apelido),
    player.data_nasc || player.ano_nasc || "",
    String(player.posicao || "").toUpperCase()
  ].join("|");
}

function observationNaturalKey(observation) {
  return [
    observation.data || "",
    textKey(observation.jogo),
    textKey(observation.adversario),
    textKey(observation.relatorio)
  ].join("|");
}

function textKey(value) {
  return repairText(String(value || ""))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

function repairText(value) {
  const text = String(value ?? "");
  if (!/[ÃÂâðï]/.test(text) || typeof TextDecoder === "undefined") return text;
  const bytes = new Uint8Array([...text].map(char => char.charCodeAt(0) & 0xff));
  const decoded = new TextDecoder("utf-8").decode(bytes);
  return decoded.includes("�") ? text : decoded;
}

function repairStateText(state) {
  state.players.forEach(player => {
    ["nome_completo", "apelido", "clube", "categoria", "posicao", "pe", "altura", "nacionalidade", "observacao_geral"].forEach(key => {
      if (typeof player[key] === "string") player[key] = repairText(player[key]);
    });
    player.observations.forEach(obs => {
      ["data", "jogo", "adversario", "categoria", "nivel", "projecao", "status", "relatorio", "proxima_acao"].forEach(key => {
        if (typeof obs[key] === "string") obs[key] = repairText(obs[key]);
      });
    });
  });
  return state;
}

function dedupePlayers(players) {
  return players.reduce((merged, player) => {
    const existingIndex = merged.findIndex(existing => samePlayer(existing, player));
    if (existingIndex === -1) merged.push(player);
    else merged[existingIndex] = mergePlayer(merged[existingIndex], player);
    return merged;
  }, []);
}

function migrateState(input) {
  const migrated = { version: 3, players: Array.isArray(input.players) ? input.players : [] };
  migrated.players.forEach(player => {
    player.observations ||= [];
    player.observations.forEach(obs => {
      obs.atributos = migrateAttributesFor(player.posicao, obs.atributos, obs);
      Object.keys(obs.atributos).forEach(key => { obs.atributos[key] = normalizeScore(obs.atributos[key]); });
      obs.nota_geral = normalizeScore(obs.nota_geral || avg(Object.values(obs.atributos), v => v));
    });
  });
  repairStateText(migrated);
  migrated.players = dedupePlayers(migrated.players);
  return migrated;
}

function migrateAttributesFor(pos, existing = {}, obs = {}) {
  const role = roleKeyForPosition(pos);
  const g = (key, fallback = 5) => normalizeScore(existing[key] ?? obs[key] ?? fallback);
  const avgKeys = (keys, fallback = 5) => normalizeScore(avg(keys, key => existing[key] ?? obs[key] ?? fallback));

  const common = {
    tecnica: g("tecnica", avgKeys(["criatividade", "controle_orientado", "saida_bola", "jogo_pes", "passe", "um_x_um_ofensivo"], 5)),
    velocidade: g("velocidade", avgKeys(["ataque_profundidade", "velocidade_recuperacao", "apoio_profundidade", "fisico"], 5)),
    estatura: g("estatura", avgKeys(["jogo_aereo", "defesa_area", "altura", "fisico"], 5)),
    competitividade: g("competitividade", avgKeys(["pressao_pos_perda", "pressao_defesa", "intensidade", "mentalidade", "tomada_decisao"], 5))
  };

  if (role === "zagueiro") {
    return {
      ...common,
      um_x_um_defensivo: g("um_x_um_defensivo", g("duelo_defensivo", g("defesa", 5))),
      duelo_aereo: g("duelo_aereo", g("jogo_aereo", avgKeys(["fisico", "defesa"], 5))),
      sentimento_urgencia: g("sentimento_urgencia", avgKeys(["antecipacao", "cobertura", "mentalidade"], 5))
    };
  }
  if (role === "lateral") {
    return {
      ...common,
      um_x_um_ofensivo: g("um_x_um_ofensivo", avgKeys(["apoio_profundidade", "cruzamento", "tecnica"], 5)),
      um_x_um_defensivo: g("um_x_um_defensivo", g("defesa", 5)),
      terco_final: g("terco_final", avgKeys(["cruzamento", "tomada_decisao", "passe"], 5))
    };
  }
  if (role === "goleiro") {
    return {
      ...common,
      defesa_meta: g("defesa_meta", avgKeys(["reflexo", "defesa"], 5)),
      defesa_espaco: g("defesa_espaco", avgKeys(["saida_gol", "defesa_area"], 5)),
      jogo_ofensivo: g("jogo_ofensivo", avgKeys(["jogo_pes", "reposicao", "passe"], 5))
    };
  }
  return {
    ...common,
    um_x_um_ofensivo: g("um_x_um_ofensivo", avgKeys(["criacao_vantagem", "criatividade", "tecnica"], 5)),
    relacao_bola: g("relacao_bola", avgKeys(["controle_orientado", "passe_progressivo", "visao_jogo", "tecnica", "passe"], 5)),
    relacao_gol: g("relacao_gol", avgKeys(["finalizacao", "relacao_gol"], 5))
  };
}

function normalizeScore(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  const converted = n > 10 ? n / 10 : n;
  return Math.max(0, Math.min(10, Number(converted.toFixed(1))));
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (!applyingCloudState) localStorage.setItem(CLOUD_PENDING_KEY, "true");
  queueCloudSave();
}

function roleKeyForPosition(pos) {
  const clean = String(pos || "").toUpperCase();
  return Object.entries(ATTR_DEFINITIONS).find(([, def]) => def.positions.includes(clean))?.[0] || "meio";
}

function attrDefinitionForPosition(pos) {
  const base = ATTR_DEFINITIONS[roleKeyForPosition(pos)];
  return { ...base, attrs: attrsForDefinition(base) };
}

function idade(player) {
  if (player.data_nasc) {
    const birth = new Date(player.data_nasc + "T00:00:00");
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return Number.isFinite(age) ? age : "-";
  }
  if (player.ano_nasc) return new Date().getFullYear() - Number(player.ano_nasc);
  return "-";
}

function avg(items, getter) {
  const nums = items.map(getter).map(Number).filter(n => Number.isFinite(n));
  if (!nums.length) return 0;
  return Number((nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(1));
}

function avgAttr(observations, key) {
  return avg(observations, o => o.atributos?.[key]);
}

function latestObservation(player) {
  if (!player.observations?.length) return null;
  return [...player.observations].sort((a, b) => new Date(b.data) - new Date(a.data))[0];
}

function consolidated(player) {
  const obs = player.observations || [];
  const latest = latestObservation(player) || {};
  const def = attrDefinitionForPosition(player.posicao);
  const attributeAverages = Object.fromEntries(def.attrs.map(attr => [attr.key, avgAttr(obs, attr.key)]));
  return {
    ...player,
    role_label: def.label,
    attribute_definition: def,
    attribute_averages: attributeAverages,
    radar: radarValues(def, attributeAverages),
    quadrant: quadrantValues(def, attributeAverages, obs),
    idade: idade(player),
    vezes_observado: obs.length,
    adversarios_observados: [...new Set(obs.map(o => o.adversario).filter(Boolean))].join(", ") || "Sem observações",
    media_geral: avg(obs, o => o.nota_geral),
    ultima_observacao: latest.data || "-",
    nivel_atual: latest.nivel || "Sem nível",
    projecao_atual: latest.projecao || "Sem definição",
    status_atual: latest.status || "A observar",
    relatorio_mais_recente: latest.relatorio || player.observacao_geral || "Sem relatório ainda.",
    proxima_acao: latest.proxima_acao || "Adicionar observação"
  };
}

function radarValues(def, averages) {
  const value = (...keys) => avg(keys, key => averages[key]);
  const roleSpecific = avg(def.specific.map(attr => attr.key), key => averages[key]);
  const offense = value("um_x_um_ofensivo", "relacao_bola", "relacao_gol", "terco_final", "jogo_ofensivo") || averages.tecnica || 0;
  const defense = value("um_x_um_defensivo", "duelo_aereo", "defesa_meta", "defesa_espaco", "sentimento_urgencia") || averages.competitividade || 0;
  return [
    { key: "ent", label: "ENT", fullLabel: "Competitividade", value: averages.competitividade || 0 },
    { key: "def", label: "DEF", fullLabel: "Defesa", value: defense },
    { key: "tec", label: "TEC", fullLabel: "Técnica", value: averages.tecnica || 0 },
    { key: "vel", label: "VEL", fullLabel: "Velocidade", value: averages.velocidade || 0 },
    { key: "ofe", label: "OFE", fullLabel: "Ofensivo", value: offense || roleSpecific || 0 }
  ];
}

function quadrantValues(def, averages, observations) {
  const roleSpecific = avg(def.specific.map(attr => attr.key), key => averages[key]);
  const bola = avg([
    averages.tecnica,
    roleSpecific,
    averages.um_x_um_ofensivo,
    averages.relacao_bola,
    averages.terco_final,
    averages.jogo_ofensivo
  ], v => v);
  const impacto = avg([
    avg(observations, o => o.nota_geral),
    averages.competitividade,
    averages.velocidade,
    averages.estatura
  ], v => v);
  return {
    x: normalizeScore(bola),
    y: normalizeScore(impacto),
    label: quadrantLabel(bola, impacto)
  };
}

function quadrantLabel(bola, impacto) {
  if (bola >= 7 && impacto >= 7) return "Contratação forte";
  if (bola >= 7 && impacto < 7) return "Potencial técnico";
  if (bola < 7 && impacto >= 7) return "Perfil competitivo";
  return "Monitorar evolução";
}

function posGroup(pos) {
  if (["ATA", "PD", "PE"].includes(pos)) return "ATA";
  if (["VOL", "MC", "MEI"].includes(pos)) return "MEI";
  if (["LD", "LE", "ZAG"].includes(pos)) return "DEF";
  if (["GOL"].includes(pos)) return "GOL";
  return "Tudo";
}

function statusDot(status) {
  if (["Indicado", "Contratado Vasco", "Relatório pronto"].includes(status)) return "green";
  if (["Descartado", "Perdido para outro clube"].includes(status)) return "red";
  return "";
}

function flagFor(country) {
  const c = (country || "").toLowerCase();
  if (c.includes("brasil")) return "🇧🇷";
  if (c.includes("argentina")) return "🇦🇷";
  if (c.includes("uruguai")) return "🇺🇾";
  if (c.includes("alemanha")) return "🇩🇪";
  if (c.includes("portugal")) return "🇵🇹";
  if (c.includes("espanha")) return "🇪🇸";
  return "🌐";
}

function filteredPlayers() {
  const q = $("searchInput").value.trim().toLowerCase();
  const st = $("statusFilter").value;
  return state.players.map(consolidated).filter(p => {
    const matchesSearch = !q || [p.nome_completo, p.apelido, p.clube, p.posicao].join(" ").toLowerCase().includes(q);
    const matchesStatus = !st || p.status_atual === st;
    const matchesTab = activeTab === "Tudo" || (activeTab === "Indicados" ? p.status_atual === "Indicado" : posGroup(p.posicao) === activeTab);
    return matchesSearch && matchesStatus && matchesTab;
  }).sort((a, b) => b.media_geral - a.media_geral || a.nome_completo.localeCompare(b.nome_completo));
}

function render() {
  $("totalPlayers").textContent = state.players.length;
  renderList();
  renderDetail();
}

function renderList() {
  const list = $("playerList");
  const players = filteredPlayers();
  if (!players.length) {
    list.innerHTML = `<div class="empty-list">Nenhum jogador encontrado.</div>`;
    return;
  }
  if (!players.some(p => p.id === selectedId)) selectedId = players[0].id;
  list.innerHTML = players.map(p => `
    <article class="player-card ${p.id === selectedId ? "selected" : ""}" data-id="${p.id}">
      ${p.foto_url ? `<img class="player-photo" src="${p.foto_url}" alt="${escapeHtml(p.nome_completo)}" />` : `<div class="player-photo placeholder">${initials(p.nome_completo)}</div>`}
      <div class="player-main">
        <h3>${escapeHtml(displayName(p))}</h3>
        <div class="player-meta"><span>IDADE: ${p.idade}</span><span class="dot ${statusDot(p.status_atual)}"></span><span>${escapeHtml(p.posicao || "-")}</span></div>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".player-card").forEach(card => {
    card.addEventListener("click", () => {
      selectedId = card.dataset.id;
      render();
    });
  });
}

function renderDetail() {
  const panel = $("detailPanel");
  const player = state.players.find(p => p.id === selectedId);
  if (!player) {
    panel.innerHTML = `<div class="empty-state"><h2>Nenhum jogador selecionado</h2><p>Adicione um jogador ou selecione um card na lista.</p></div>`;
    return;
  }
  const p = consolidated(player);
  panel.innerHTML = `
    <div class="detail-top">
      ${p.foto_url ? `<img class="detail-photo" src="${p.foto_url}" alt="${escapeHtml(p.nome_completo)}" />` : `<div class="detail-photo player-photo placeholder">${initials(p.nome_completo)}</div>`}
      <div class="detail-title">
        <h2>${escapeHtml(displayName(p))}</h2>
        <div class="club">${escapeHtml(p.clube || "Clube não informado")}</div>
      </div>
      <div class="country"><div class="flag">${flagFor(p.nacionalidade)}</div><br>${escapeHtml(p.nacionalidade || "-")}</div>
    </div>

    <div class="player-facts">
      <div class="fact"><small>Idade</small><strong>${p.idade}</strong></div>
      <div class="fact"><small>Posição</small><strong>${escapeHtml(p.posicao || "-")}</strong></div>
      <div class="fact"><small>Altura</small><strong>${escapeHtml(p.altura || "-")}</strong></div>
      <div class="fact"><small>Perna boa</small><strong>${escapeHtml(p.pe || "-")}</strong></div>
    </div>

    <div class="status-line">
      <h3>⏱ ${escapeHtml(p.status_atual)}</h3>
      <div class="progress-line"><span style="width:${Math.max(10, p.media_geral * 10)}%"></span></div>
      <p>${escapeHtml(p.relatorio_mais_recente)}</p>
    </div>

    <div class="summary-grid">
      <section class="mini-report">
        <h3>Resumo</h3>
        <div class="pill-row">
          <span class="pill">Nível: ${escapeHtml(p.nivel_atual)}</span>
          <span class="pill">Projeção: ${escapeHtml(p.projecao_atual)}</span>
          <span class="pill">Visto ${p.vezes_observado}x</span>
          <span class="pill">Última obs: ${formatDate(p.ultima_observacao)}</span>
          <span class="pill">Perfil: ${escapeHtml(p.role_label)}</span>
        </div>
        <p><strong>Adversários:</strong> ${escapeHtml(p.adversarios_observados)}</p>
        <p><strong>Próxima ação:</strong> ${escapeHtml(p.proxima_acao)}</p>
        <p><strong>Média geral:</strong> ${formatScore(p.media_geral)}/10</p>
      </section>
      <section class="attributes">
        <h3>Atributos médios</h3>
        ${attributeRows(p)}
      </section>
    </div>

    <section class="radar-section">
      <h3>Gráfico de perfil</h3>
      ${radarChart(p)}
    </section>

    <section class="quadrant-section">
      <h3>Quadrante de scouting</h3>
      ${quadrantChart(p)}
    </section>

    <div class="detail-actions">
      <button class="primary-btn" id="addObsBtn">+ Observação</button>
      <button class="ghost-btn" id="openProfileBtn">Ver perfil</button>
      <button class="ghost-btn" id="editPlayerBtn">Editar jogador</button>
      <button class="danger-btn" id="deletePlayerBtn">Excluir</button>
    </div>
  `;

  $("addObsBtn").addEventListener("click", () => openObservationModal(p.id));
  $("editPlayerBtn").addEventListener("click", () => openPlayerModal(p.id));
  $("openProfileBtn").addEventListener("click", () => openProfileModal(p.id));
  $("deletePlayerBtn").addEventListener("click", () => deletePlayer(p.id));
}

function attributeRows(p) {
  return p.attribute_definition.attrs.map(attr => attrRow(attr.label, p.attribute_averages[attr.key])).join("");
}

function attrRow(label, value) {
  const v = normalizeScore(value);
  return `<div class="attr-row"><span>${escapeHtml(label)}</span><div class="attr-bar"><span style="width:${v * 10}%"></span></div><strong class="attr-value">${formatScore(v)}</strong></div>`;
}

function radarChart(p, options = {}) {
  const values = p.radar || radarValues(p.attribute_definition, p.attribute_averages);
  const size = options.size || 260;
  const cx = 50, cy = 50, radius = 34;
  const axes = values.map((item, i) => {
    const angle = -Math.PI / 2 + i * (2 * Math.PI / values.length);
    return { ...item, angle, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius };
  });
  const polygon = axes.map(a => {
    const r = (normalizeScore(a.value) / 10) * radius;
    return `${cx + Math.cos(a.angle) * r},${cy + Math.sin(a.angle) * r}`;
  }).join(" ");
  const grids = [2,4,6,8,10].map(level => {
    const r = (level / 10) * radius;
    return axes.map(a => `${cx + Math.cos(a.angle) * r},${cy + Math.sin(a.angle) * r}`).join(" ");
  });
  return `
    <div class="radar-wrap">
      <svg class="radar-svg" viewBox="0 0 100 100" width="${size}" height="${size}" role="img" aria-label="Gráfico de perfil do jogador">
        ${grids.map(points => `<polygon class="radar-grid" points="${points}" />`).join("")}
        ${axes.map(a => `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${a.x}" y2="${a.y}" />`).join("")}
        <polygon class="radar-shape" points="${polygon}" />
        ${axes.map(a => `<circle class="radar-point" cx="${cx + Math.cos(a.angle) * (normalizeScore(a.value) / 10) * radius}" cy="${cy + Math.sin(a.angle) * (normalizeScore(a.value) / 10) * radius}" r="1.8" />`).join("")}
        ${axes.map(a => `<text class="radar-label" x="${cx + Math.cos(a.angle) * (radius + 8)}" y="${cy + Math.sin(a.angle) * (radius + 8)}" text-anchor="middle" dominant-baseline="middle">${a.label}</text>`).join("")}
      </svg>
      <div class="radar-info">
        ${values.map(v => `<div><strong>${escapeHtml(v.label)}</strong><span>${escapeHtml(v.fullLabel)}</span><b>${formatScore(v.value)}</b></div>`).join("")}
      </div>
    </div>`;
}

function quadrantChart(p) {
  const q = p.quadrant || { x: 0, y: 0, label: "Sem dados" };
  const x = 12 + normalizeScore(q.x) * 7.6;
  const y = 88 - normalizeScore(q.y) * 7.6;
  return `
    <div class="quadrant-wrap">
      <svg class="quadrant-svg" viewBox="0 0 100 100" role="img" aria-label="Quadrante de scouting">
        <rect x="8" y="8" width="84" height="84" />
        <line x1="50" y1="8" x2="50" y2="92" />
        <line x1="8" y1="50" x2="92" y2="50" />
        <text x="28" y="15" text-anchor="middle">Monitorar</text>
        <text x="72" y="15" text-anchor="middle">Contratar</text>
        <text x="28" y="88" text-anchor="middle">Evoluir</text>
        <text x="72" y="88" text-anchor="middle">Potencial</text>
        <text x="50" y="98" text-anchor="middle">Bola / técnica</text>
        <text x="3" y="50" text-anchor="middle" transform="rotate(-90 3 50)">Impacto</text>
        <circle cx="${x}" cy="${y}" r="4.2" />
      </svg>
      <div class="quadrant-info">
        <strong>${formatScore(q.x)}</strong><span>Bola e atributos específicos</span>
        <strong>${formatScore(q.y)}</strong><span>Impacto competitivo</span>
        <strong>Q</strong><span>${escapeHtml(q.label)}</span>
      </div>
    </div>`;
}

function compareRadarChart(pa, pb) {
  const valuesA = pa.radar;
  const valuesB = pb.radar;
  const cx = 50, cy = 50, radius = 34;
  const axes = valuesA.map((item, i) => {
    const angle = -Math.PI / 2 + i * (2 * Math.PI / valuesA.length);
    return { ...item, angle, x: cx + Math.cos(angle) * radius, y: cy + Math.sin(angle) * radius, b: valuesB[i]?.value || 0 };
  });
  const poly = (values) => axes.map((a, i) => {
    const r = (normalizeScore(values[i]?.value || 0) / 10) * radius;
    return `${cx + Math.cos(a.angle) * r},${cy + Math.sin(a.angle) * r}`;
  }).join(" ");
  const grids = [2,4,6,8,10].map(level => {
    const r = (level / 10) * radius;
    return axes.map(a => `${cx + Math.cos(a.angle) * r},${cy + Math.sin(a.angle) * r}`).join(" ");
  });
  return `
    <div class="compare-radar-wrap">
      <svg class="radar-svg compare-radar" viewBox="0 0 100 100" role="img" aria-label="Comparação de perfil">
        ${grids.map(points => `<polygon class="radar-grid" points="${points}" />`).join("")}
        ${axes.map(a => `<line class="radar-axis" x1="${cx}" y1="${cy}" x2="${a.x}" y2="${a.y}" />`).join("")}
        <polygon class="radar-shape radar-a" points="${poly(valuesA)}" />
        <polygon class="radar-shape radar-b" points="${poly(valuesB)}" />
        ${axes.map(a => `<text class="radar-label" x="${cx + Math.cos(a.angle) * (radius + 8)}" y="${cy + Math.sin(a.angle) * (radius + 8)}" text-anchor="middle" dominant-baseline="middle">${a.label}</text>`).join("")}
      </svg>
      <div class="compare-legend"><span class="legend-a"></span>${escapeHtml(displayName(pa))}<span class="legend-b"></span>${escapeHtml(displayName(pb))}</div>
    </div>`;
}

function initials(name) {
  return (name || "?").split(/\s+/).slice(0,2).map(p => p[0]).join("").toUpperCase();
}

function displayName(p) {
  return p.apelido || p.nome_completo || "Sem nome";
}

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>'"]/g, tag => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[tag]));
}

function formatDate(date) {
  if (!date || date === "-") return "-";
  const d = new Date(date + "T00:00:00");
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString("pt-BR");
}

function formatScore(value) {
  const n = normalizeScore(value);
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function openPlayerModal(id = null) {
  const player = id ? state.players.find(p => p.id === id) : null;
  $("playerModalTitle").textContent = player ? "Editar jogador" : "Adicionar jogador";
  $("playerId").value = player?.id || "";
  $("nome").value = player?.nome_completo || "";
  $("apelido").value = player?.apelido || "";
  $("ano_nasc").value = player?.ano_nasc || "";
  $("data_nasc").value = player?.data_nasc || "";
  $("clube").value = player?.clube || "";
  $("categoria").value = player?.categoria || "Sub-15";
  $("posicao").value = player?.posicao || "PD";
  $("pe").value = player?.pe || "Dir.";
  $("altura").value = player?.altura || "";
  $("nacionalidade").value = player?.nacionalidade || "Brasil";
  $("observacao_geral").value = player?.observacao_geral || "";
  $("foto").value = "";
  showModal("playerModal");
}

async function handlePlayerSubmit(e) {
  e.preventDefault();
  const id = $("playerId").value || crypto.randomUUID();
  const existing = state.players.find(p => p.id === id);
  const fotoFile = $("foto").files[0];
  let foto_url = existing?.foto_url || "";
  if (fotoFile) foto_url = await fileToDataUrl(fotoFile);
  const data = {
    id,
    nome_completo: $("nome").value.trim(),
    apelido: $("apelido").value.trim(),
    ano_nasc: $("ano_nasc").value ? Number($("ano_nasc").value) : "",
    data_nasc: $("data_nasc").value,
    clube: $("clube").value.trim(),
    categoria: $("categoria").value,
    posicao: $("posicao").value,
    pe: $("pe").value,
    altura: $("altura").value.trim(),
    nacionalidade: $("nacionalidade").value.trim(),
    foto_url,
    observacao_geral: $("observacao_geral").value.trim(),
    observations: existing?.observations || []
  };
  if (existing) Object.assign(existing, data);
  else state.players.push(data);
  selectedId = id;
  saveState();
  hideModal("playerModal");
  render();
}

function openObservationModal(playerId) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;
  $("observationModalTitle").textContent = `Adicionar observação — ${displayName(player)}`;
  $("obsPlayerId").value = playerId;
  $("obsData").valueAsDate = new Date();
  $("obsJogo").value = "";
  $("obsAdversario").value = "";
  $("obsCategoria").value = player.categoria || "Sub-15";
  renderAttributeInputs(player.posicao);
  $("nota_geral").value = 5;
  $("nivel").value = "B";
  $("projecao").value = "Média";
  $("status").value = "Observando";
  $("relatorio").value = "";
  $("proxima_acao").value = "Ver novamente";
  showModal("observationModal");
}

function renderAttributeInputs(position, values = {}) {
  const def = attrDefinitionForPosition(position);
  $("attributeFields").innerHTML = `
    <div class="attribute-form-title full">Atributos de ${def.label} <small>0 a 10</small></div>
    ${def.attrs.map(attr => `
      <label>${escapeHtml(attr.label)}
        <input class="attr-input" data-attr-key="${attr.key}" type="number" min="0" max="10" step="0.1" value="${values[attr.key] ?? 5}" />
      </label>
    `).join("")}
  `;
  document.querySelectorAll(".attr-input").forEach(input => {
    input.addEventListener("input", updateNotaFromAttributes);
  });
  updateNotaFromAttributes();
}

function updateNotaFromAttributes() {
  const inputs = [...document.querySelectorAll(".attr-input")];
  if (!inputs.length) return;
  const score = avg(inputs, input => input.value);
  $("nota_geral").value = formatScore(score);
}

function collectAttributeInputs() {
  const attrs = {};
  document.querySelectorAll(".attr-input").forEach(input => {
    attrs[input.dataset.attrKey] = normalizeScore(input.value);
  });
  return attrs;
}

function handleObservationSubmit(e) {
  e.preventDefault();
  const player = state.players.find(p => p.id === $("obsPlayerId").value);
  if (!player) return;
  player.observations ||= [];
  player.observations.push({
    id: crypto.randomUUID(),
    data: $("obsData").value,
    jogo: $("obsJogo").value.trim(),
    adversario: $("obsAdversario").value.trim(),
    categoria: $("obsCategoria").value,
    atributos: collectAttributeInputs(),
    nota_geral: normalizeScore($("nota_geral").value),
    nivel: $("nivel").value,
    projecao: $("projecao").value,
    status: $("status").value,
    relatorio: $("relatorio").value.trim(),
    proxima_acao: $("proxima_acao").value.trim()
  });
  saveState();
  hideModal("observationModal");
  render();
}

function openProfileModal(playerId) {
  const player = state.players.find(p => p.id === playerId);
  if (!player) return;
  const p = consolidated(player);
  $("profileTitle").textContent = `Perfil completo — ${displayName(p)}`;
  const sorted = [...(player.observations || [])].sort((a,b) => new Date(b.data) - new Date(a.data));
  $("profileContent").innerHTML = `
    <div class="profile-head">
      ${p.foto_url ? `<img src="${p.foto_url}" alt="${escapeHtml(p.nome_completo)}" />` : `<div class="placeholder">${initials(p.nome_completo)}</div>`}
      <div>
        <h2>${escapeHtml(displayName(p))}</h2>
        <div class="pill-row">
          <span class="pill">${escapeHtml(p.clube || "-")}</span>
          <span class="pill">${escapeHtml(p.posicao || "-")}</span>
          <span class="pill">Perfil: ${escapeHtml(p.role_label)}</span>
          <span class="pill">Idade: ${p.idade}</span>
          <span class="pill">Pé: ${escapeHtml(p.pe || "-")}</span>
          <span class="pill">Média: ${formatScore(p.media_geral)}/10</span>
          <span class="pill">Observado ${p.vezes_observado}x</span>
        </div>
        <p>${escapeHtml(p.relatorio_mais_recente)}</p>
      </div>
    </div>
    <section class="profile-section">
      <h3>Evolução da nota geral</h3>
      <div class="chart">${lineChart(player.observations || [])}</div>
    </section>
    <section class="profile-section profile-two-cols">
      <div class="attributes">
        <h3>Atributos médios</h3>
        ${attributeRows(p)}
      </div>
      <div class="radar-section compact">
        <h3>Gráfico de perfil</h3>
        ${radarChart(p)}
      </div>
      <div class="quadrant-section compact">
        <h3>Quadrante</h3>
        ${quadrantChart(p)}
      </div>
    </section>
    <section class="profile-section">
      <h3>Histórico de observações</h3>
      <table class="history-table">
        <thead><tr><th>Data</th><th>Jogo</th><th>Adversário</th><th>Nota</th><th>Nível</th><th>Status</th><th>Relatório</th></tr></thead>
        <tbody>
          ${sorted.map(o => `<tr><td>${formatDate(o.data)}</td><td>${escapeHtml(o.jogo)}</td><td>${escapeHtml(o.adversario)}</td><td>${formatScore(o.nota_geral)}</td><td>${escapeHtml(o.nivel)}</td><td>${escapeHtml(o.status)}</td><td>${escapeHtml(o.relatorio)}</td></tr>`).join("") || `<tr><td colspan="7">Sem observações.</td></tr>`}
        </tbody>
      </table>
    </section>
  `;
  showModal("profileModal");
}

function lineChart(observations) {
  const sorted = [...observations].sort((a,b) => new Date(a.data) - new Date(b.data));
  if (!sorted.length) return `<p>Sem dados para gráfico.</p>`;
  if (sorted.length === 1) return `<p>Apenas uma observação registrada: nota ${formatScore(sorted[0].nota_geral)}.</p>`;
  const w = 850, h = 130, pad = 18;
  const points = sorted.map((o, i) => {
    const x = pad + i * ((w - pad*2) / (sorted.length - 1));
    const y = h - pad - (normalizeScore(o.nota_geral) / 10) * (h - pad*2);
    return { x, y, value: formatScore(o.nota_geral), label: formatDate(o.data) };
  });
  const line = points.map(p => `${p.x},${p.y}`).join(" ");
  return `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <polyline points="${line}" fill="none" stroke="#f7c948" stroke-width="4" />
    ${points.map(p => `<circle cx="${p.x}" cy="${p.y}" r="5" fill="#da2d70" /><text x="${p.x}" y="${p.y - 10}" text-anchor="middle">${p.value}</text>`).join("")}
  </svg>`;
}

function deletePlayer(id) {
  const p = state.players.find(player => player.id === id);
  if (!p) return;
  if (!confirm(`Excluir ${displayName(p)} e todas as observações?`)) return;
  state.players = state.players.filter(player => player.id !== id);
  selectedId = state.players[0]?.id || null;
  saveState();
  render();
}

function showModal(id) { $(id).classList.remove("hidden"); }
function hideModal(id) { $(id).classList.add("hidden"); }
function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `central-scouting-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = migrateState(JSON.parse(reader.result));
      if (!imported.players || !Array.isArray(imported.players)) throw new Error("Formato inválido");
      state = imported;
      selectedId = state.players[0]?.id || null;
      saveState();
      render();
      alert("Dados importados com sucesso.");
    } catch (err) {
      alert("Não consegui importar esse arquivo JSON.");
    }
  };
  reader.readAsText(file);
}


function openCompareModal() {
  if (state.players.length < 2) {
    alert("Cadastre pelo menos dois jogadores para comparar.");
    return;
  }
  const options = state.players.map(player => `<option value="${player.id}">${escapeHtml(displayName(player))} — ${escapeHtml(player.posicao || "-")}</option>`).join("");
  $("compareA").innerHTML = options;
  $("compareB").innerHTML = options;
  $("compareA").value = selectedId || state.players[0].id;
  const firstOther = state.players.find(p => p.id !== $("compareA").value)?.id || state.players[1].id;
  $("compareB").value = firstOther;
  renderCompare();
  showModal("compareModal");
}

function renderCompare() {
  const a = state.players.find(p => p.id === $("compareA").value);
  const b = state.players.find(p => p.id === $("compareB").value);
  if (!a || !b) return;
  if (a.id === b.id) {
    $("compareContent").innerHTML = `<div class="compare-empty">Escolha dois atletas diferentes.</div>`;
    return;
  }
  const pa = consolidated(a);
  const pb = consolidated(b);
  const attrKeys = uniqueKeys([
    ...COMMON_ATTRS.map(attr => attr.key),
    ...pa.attribute_definition.specific.map(attr => attr.key),
    ...pb.attribute_definition.specific.map(attr => attr.key)
  ]);

  $("compareContent").innerHTML = `
    <div class="compare-head">
      ${comparePlayerCard(pa, "Atleta 1")}
      ${compareRadarChart(pa, pb)}
      ${comparePlayerCard(pb, "Atleta 2")}
    </div>
    <section class="compare-section">
      <h3>Comparação de atributos</h3>
      <div class="compare-attributes">
        ${attrKeys.map(key => compareAttributeRow(key, pa.attribute_averages[key], pb.attribute_averages[key])).join("")}
      </div>
    </section>
    <section class="compare-section">
      <h3>Resumo</h3>
      <div class="compare-summary-grid">
        ${compareSummaryRow("Média geral", `${formatScore(pa.media_geral)}/10`, `${formatScore(pb.media_geral)}/10`)}
        ${compareSummaryRow("Nível", pa.nivel_atual, pb.nivel_atual)}
        ${compareSummaryRow("Projeção", pa.projecao_atual, pb.projecao_atual)}
        ${compareSummaryRow("Status", pa.status_atual, pb.status_atual)}
        ${compareSummaryRow("Vezes observado", `${pa.vezes_observado}x`, `${pb.vezes_observado}x`)}
        ${compareSummaryRow("Última obs.", formatDate(pa.ultima_observacao), formatDate(pb.ultima_observacao))}
        ${compareSummaryRow("Adversários", pa.adversarios_observados, pb.adversarios_observados)}
      </div>
    </section>
  `;
}

function comparePlayerCard(p, label) {
  return `
    <article class="compare-player-card">
      <small>${label}</small>
      ${p.foto_url ? `<img src="${p.foto_url}" alt="${escapeHtml(p.nome_completo)}" />` : `<div class="placeholder">${initials(p.nome_completo)}</div>`}
      <h3>${escapeHtml(displayName(p))}</h3>
      <p>${escapeHtml(p.clube || "-")} · ${escapeHtml(p.posicao || "-")} · ${p.idade} anos</p>
      <strong>${formatScore(p.media_geral)}</strong>
      <span>Média geral</span>
    </article>
  `;
}

function compareAttributeRow(key, av, bv) {
  const a = Number.isFinite(Number(av)) && Number(av) > 0 ? normalizeScore(av) : null;
  const b = Number.isFinite(Number(bv)) && Number(bv) > 0 ? normalizeScore(bv) : null;
  return `
    <div class="compare-attr-row">
      <div class="compare-attr-label">${escapeHtml(ATTRIBUTE_LABELS[key] || key)}</div>
      <div class="compare-bar left"><span style="width:${a === null ? 0 : a * 10}%"></span><b>${a === null ? "-" : formatScore(a)}</b></div>
      <div class="compare-bar right"><span style="width:${b === null ? 0 : b * 10}%"></span><b>${b === null ? "-" : formatScore(b)}</b></div>
    </div>
  `;
}

function compareSummaryRow(label, a, b) {
  return `<div class="compare-summary-row"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(a)}</span><span>${escapeHtml(b)}</span></div>`;
}

function uniqueKeys(keys) {
  return [...new Set(keys.filter(Boolean))];
}

function cloudConfig() {
  return window.SCOUTING_SUPABASE_CONFIG || DEFAULT_SUPABASE_CONFIG;
}

function isCloudConfigured() {
  const config = cloudConfig();
  return Boolean(config.url && config.anonKey);
}

function createCloudClient() {
  if (cloudClient) return cloudClient;
  if (!isCloudConfigured() || !window.supabase?.createClient) return null;
  const config = cloudConfig();
  cloudClient = window.supabase.createClient(config.url, config.anonKey, {
    auth: { persistSession: true, autoRefreshToken: true }
  });
  return cloudClient;
}

function loadSupabaseLibrary() {
  if (window.supabase?.createClient) return Promise.resolve(true);
  return new Promise(resolve => {
    const existing = document.querySelector('script[data-supabase-loader="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(Boolean(window.supabase?.createClient)), { once: true });
      existing.addEventListener("error", () => resolve(false), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.dataset.supabaseLoader = "true";
    script.onload = () => resolve(Boolean(window.supabase?.createClient));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

function setCloudStatus(text, mode = "") {
  const status = $("cloudStatus");
  if (!status) return;
  status.textContent = text;
  status.className = `cloud-chip ${mode}`.trim();
}

function setCloudMessage(text) {
  const message = $("cloudMessage");
  if (message) message.textContent = text;
}

function updateCloudButtons() {
  const login = $("cloudLoginBtn");
  const sync = $("cloudSyncBtn");
  const logout = $("cloudLogoutBtn");
  if (!login || !sync || !logout) return;
  login.classList.toggle("hidden", Boolean(cloudUser));
  sync.classList.toggle("hidden", !cloudUser);
  logout.classList.toggle("hidden", !cloudUser);
}

function loadCloudMeta() {
  try {
    return JSON.parse(localStorage.getItem(CLOUD_META_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveCloudMeta(updatedAt) {
  localStorage.setItem(CLOUD_META_KEY, JSON.stringify({ updatedAt }));
}

function cloneStateData(input = state) {
  return migrateState(JSON.parse(JSON.stringify(input)));
}

function mergeStateObjects(base, incoming) {
  const baseState = cloneStateData(base);
  const incomingState = cloneStateData(incoming);
  return {
    version: 3,
    players: dedupePlayers([...(baseState.players || []), ...(incomingState.players || [])])
  };
}

function applyCloudState(nextState, updatedAt = null) {
  applyingCloudState = true;
  state = cloneStateData(nextState);
  selectedId = state.players.some(player => player.id === selectedId) ? selectedId : state.players[0]?.id || null;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  if (updatedAt) saveCloudMeta(updatedAt);
  applyingCloudState = false;
  render();
}

function queueCloudSave() {
  if (!cloudClient || !cloudUser) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(() => persistCloudState(), 700);
}

async function persistCloudState() {
  if (!cloudClient || !cloudUser || cloudSaveInFlight) return;
  cloudSaveInFlight = true;
  setCloudStatus("Salvando", "syncing");
  try {
    const payload = {
      user_id: cloudUser.id,
      name: CLOUD_DB_NAME,
      data: cloneStateData()
    };
    const { data, error } = await cloudClient
      .from(CLOUD_TABLE)
      .upsert(payload, { onConflict: "user_id,name" })
      .select("updated_at")
      .single();
    if (error) throw error;
    localStorage.removeItem(CLOUD_PENDING_KEY);
    saveCloudMeta(data?.updated_at || new Date().toISOString());
    setCloudStatus("Nuvem OK", "online");
  } catch (error) {
    console.error(error);
    setCloudStatus("Erro sync", "error");
    setCloudMessage(error.message || "Nao foi possivel salvar na nuvem.");
  } finally {
    cloudSaveInFlight = false;
  }
}

async function syncFromCloud(options = {}) {
  if (!cloudClient || !cloudUser) return;
  setCloudStatus("Sync", "syncing");
  try {
    const { data, error } = await cloudClient
      .from(CLOUD_TABLE)
      .select("data, updated_at")
      .eq("name", CLOUD_DB_NAME)
      .maybeSingle();
    if (error) throw error;

    if (!data) {
      await persistCloudState();
      return;
    }

    const remoteState = cloneStateData(data.data || { version: 3, players: [] });
    const meta = loadCloudMeta();
    const hasPendingLocalChanges = localStorage.getItem(CLOUD_PENDING_KEY) === "true";
    const isFirstSyncHere = !meta.updatedAt;

    if (options.forceMerge || hasPendingLocalChanges || isFirstSyncHere) {
      const merged = mergeStateObjects(remoteState, state);
      applyCloudState(merged, data.updated_at);
      localStorage.setItem(CLOUD_PENDING_KEY, "true");
      await persistCloudState();
    } else if (data.updated_at && data.updated_at !== meta.updatedAt) {
      applyCloudState(remoteState, data.updated_at);
      localStorage.removeItem(CLOUD_PENDING_KEY);
      setCloudStatus("Nuvem OK", "online");
    } else {
      setCloudStatus("Nuvem OK", "online");
    }
  } catch (error) {
    console.error(error);
    setCloudStatus("Configurar", "error");
    setCloudMessage(error.message || "Confira se a tabela ja foi criada no Supabase.");
  }
}

async function initCloud() {
  if (!isCloudConfigured()) {
    setCloudStatus("Local");
    return;
  }
  await loadSupabaseLibrary();
  const client = createCloudClient();
  if (!client) {
    setCloudStatus("Sem nuvem", "error");
    return;
  }
  try {
    const { data } = await client.auth.getSession();
    cloudUser = data.session?.user || null;
    updateCloudButtons();
    if (cloudUser) await syncFromCloud();
    else setCloudStatus("Local");
    client.auth.onAuthStateChange((_event, session) => {
      cloudUser = session?.user || null;
      updateCloudButtons();
      if (cloudUser) syncFromCloud();
      else setCloudStatus("Local");
    });
  } catch (error) {
    console.error(error);
    setCloudStatus("Erro login", "error");
  }
}

async function handleCloudLogin(e) {
  e.preventDefault();
  await loadSupabaseLibrary();
  const client = createCloudClient();
  if (!client) {
    setCloudMessage("Biblioteca do Supabase nao carregou. Confira a internet.");
    return;
  }
  setCloudMessage("Entrando...");
  const email = $("cloudEmail").value.trim();
  const password = $("cloudPassword").value;
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) {
    setCloudMessage(error.message);
    setCloudStatus("Erro login", "error");
    return;
  }
  cloudUser = data.user;
  updateCloudButtons();
  hideModal("cloudModal");
  await syncFromCloud({ forceMerge: true });
}

async function handleCloudSignup() {
  await loadSupabaseLibrary();
  const client = createCloudClient();
  if (!client) {
    setCloudMessage("Biblioteca do Supabase nao carregou. Confira a internet.");
    return;
  }
  const email = $("cloudEmail").value.trim();
  const password = $("cloudPassword").value;
  if (!email || !password) {
    setCloudMessage("Preencha email e senha para criar o acesso.");
    return;
  }
  setCloudMessage("Criando acesso...");
  const { data, error } = await client.auth.signUp({ email, password });
  if (error) {
    setCloudMessage(error.message);
    return;
  }
  if (data.session) {
    cloudUser = data.user;
    updateCloudButtons();
    hideModal("cloudModal");
    await syncFromCloud({ forceMerge: true });
  } else {
    setCloudMessage("Acesso criado. Se o Supabase pedir confirmacao, confirme o email antes de entrar.");
  }
}

async function handleCloudLogout() {
  if (cloudClient) await cloudClient.auth.signOut();
  cloudUser = null;
  updateCloudButtons();
  setCloudStatus("Local");
}

function setupEvents() {
  $("addPlayerBtn").addEventListener("click", () => openPlayerModal());
  $("playerForm").addEventListener("submit", handlePlayerSubmit);
  $("observationForm").addEventListener("submit", handleObservationSubmit);
  $("searchInput").addEventListener("input", render);
  $("statusFilter").addEventListener("change", render);
  $("exportBtn").addEventListener("click", exportData);
  $("compareBtn").addEventListener("click", openCompareModal);
  $("cloudLoginBtn").addEventListener("click", () => showModal("cloudModal"));
  $("cloudSyncBtn").addEventListener("click", () => syncFromCloud({ forceMerge: true }));
  $("cloudLogoutBtn").addEventListener("click", handleCloudLogout);
  $("cloudForm").addEventListener("submit", handleCloudLogin);
  $("cloudSignupBtn").addEventListener("click", handleCloudSignup);
  $("importBtn").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", (e) => {
    if (e.target.files[0]) importData(e.target.files[0]);
    e.target.value = "";
  });
  $("compareA").addEventListener("change", renderCompare);
  $("compareB").addEventListener("change", renderCompare);
  document.querySelectorAll(".close-modal").forEach(btn => btn.addEventListener("click", () => hideModal(btn.dataset.close)));
  document.querySelectorAll(".modal-backdrop").forEach(backdrop => {
    backdrop.addEventListener("click", (e) => { if (e.target === backdrop) backdrop.classList.add("hidden"); });
  });
  document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      activeTab = tab.dataset.tab;
      render();
    });
  });
}

setupEvents();
render();
initCloud();
async function initLoginGate() {
  const loginScreen = document.getElementById("loginScreen");
  const loginForm = document.getElementById("loginGateForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const loginMessage = document.getElementById("loginGateMessage");
  const loginCommandLine = document.getElementById("loginCommandLine");

  if (!loginScreen || !loginForm) return;

  const writeCommand = (text) => {
    if (loginCommandLine) loginCommandLine.textContent = text;
  };

  const writeMessage = (text) => {
    if (loginMessage) loginMessage.textContent = text;
  };

  const hideLogin = () => {
    loginScreen.classList.add("hidden");
  };

  const showLogin = () => {
    loginScreen.classList.remove("hidden");
    setTimeout(() => {
      if (loginEmail) loginEmail.focus();
    }, 100);
  };

  let client = null;

  try {
    writeCommand("supabase.client --loading");

    await loadSupabaseLibrary();
    client = createCloudClient();

    if (!client || !client.auth) {
      writeCommand("supabase.client --not-found");
      writeMessage("Erro: cliente Supabase não encontrado.");
      return;
    }

    window.scoutingSupabase = client;
    window.supabaseClient = client;

    writeCommand("supabase.client --ready");
  } catch (error) {
    console.error(error);
    writeCommand("supabase.client --error");
    writeMessage("Erro ao carregar Supabase.");
    return;
  }

  const { data } = await client.auth.getSession();

  if (data && data.session) {
    cloudUser = data.session.user;
    updateCloudButtons();
    hideLogin();
  } else {
    showLogin();
  }

  loginEmail.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loginPassword.focus();
      writeCommand("email recebido...");
    }
  });

  loginPassword.addEventListener("keydown", async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      await runTerminalLogin();
    }
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await runTerminalLogin();
  });

  async function runTerminalLogin() {
    const email = loginEmail.value.trim();
    const password = loginPassword.value;

    if (!email || !password) {
      writeCommand("auth.signInWithPassword() --failed");
      writeMessage("Preencha email e senha.");
      return;
    }

    writeMessage("");
    writeCommand("auth.signInWithPassword()");

    const { data, error } = await client.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      writeCommand("auth.signInWithPassword() --denied");
      writeMessage("Acesso negado. Email ou senha incorretos.");
      return;
    }

    cloudUser = data.user;
    updateCloudButtons();

    writeCommand("auth.signInWithPassword() --success");
    writeMessage("");

    setTimeout(async () => {
      hideLogin();

      if (typeof syncFromCloud === "function") {
        await syncFromCloud({ forceMerge: true });
      }
    }, 600);
  }

  client.auth.onAuthStateChange((_event, session) => {
    cloudUser = session?.user || null;
    updateCloudButtons();

    if (cloudUser) {
      hideLogin();
      syncFromCloud({ forceMerge: true });
    } else {
      showLogin();
    }
  });
}

document.addEventListener("DOMContentLoaded", initLoginGate);
