/**
 * CAADRIA 2026 Conference Dashboard
 * Host on GitHub, load via jsDelivr CDN in Webflow.
 */
(function () {
  "use strict";

  // CONFIG
  const CFG = {
    SHEET_ID:
      "2PACX-1vShBv97QhKprw_EPV9boz01ccflttzlHB02_pkFyvegavJwB9p99uLDE1VhdDvRf17po3VcunjE5JkL",
    TZ: "Asia/Taipei",
    REFRESH_NEWS_MS: 60000,
    REFRESH_CLOCK_MS: 60000,
    REFRESH_PAPERS_MS: 300000,
    STARTING_SOON_MIN: 15,
    DATE_START: "2026-04-25",
    DATE_END: "2026-05-03",
  };

  const RC = {
    A: { bg: "#FCEBEB", border: "#C0392B", text: "#791F1F", label: "#C0392B" },
    B: { bg: "#E6F1FB", border: "#2471A3", text: "#0C447C", label: "#2471A3" },
    C: { bg: "#E1F5EE", border: "#1E8449", text: "#085041", label: "#1E8449" },
    D: { bg: "#FEF5E7", border: "#D4AC0D", text: "#7D6608", label: "#B7950B" },
  };

  // CSS
  const CSS = `
#cdash{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Arial,sans-serif;max-width:960px;margin:0 auto;padding:0 1rem 2rem;color:#1a1a1a;line-height:1.5}
#cdash *{box-sizing:border-box;margin:0;padding:0}
.cd-ticker{background:#111;color:#fff;padding:10px 16px;font-size:13px;overflow:hidden;position:sticky;top:0;z-index:999;border-radius:0 0 8px 8px}
.cd-ticker-track{display:flex;width:max-content;animation:cd-scroll 30s linear infinite}
.cd-ticker-seg{white-space:nowrap;padding-right:2.5rem}
.cd-ticker-seg.urgent{color:#ff6b6b;font-weight:600}
.cd-ticker-dot{display:inline-block;width:7px;height:7px;border-radius:50%;background:#E24B4A;margin-right:10px;animation:cd-pulse 1.5s ease-in-out infinite;vertical-align:middle}
@keyframes cd-scroll{to{transform:translateX(-50%)}}
@keyframes cd-pulse{0%,100%{opacity:1}50%{opacity:.3}}
.cd-section{margin-top:1.5rem}
.cd-sec-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;flex-wrap:wrap;gap:8px}
.cd-sec-title{font-size:17px;font-weight:600;display:flex;align-items:center;gap:8px}
.cd-sec-meta{font-size:13px;color:#888}
.cd-live-dot{width:8px;height:8px;border-radius:50%;background:#E24B4A;animation:cd-pulse 1.5s ease-in-out infinite}
.cd-card{background:#fff;border:1px solid #e8e8e8;border-radius:10px;padding:16px 20px;position:relative;overflow:hidden}
.cd-card-accent{position:absolute;left:0;top:0;bottom:0;width:4px;border-radius:10px 0 0 10px}
.cd-view-more{position:absolute;top:10px;right:12px;font-size:11px;color:#2471A3;text-decoration:none;padding:3px 10px;border:1px solid #d8d8d8;border-radius:5px;background:#fff;transition:background .15s}
.cd-view-more:hover{background:#f4f4f4}
.cd-badge{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;padding:3px 10px;border-radius:6px;margin-bottom:8px}
.cd-badge-live{background:#FCEBEB;color:#A32D2D}
.cd-badge-soon{background:#FEF5E7;color:#B7950B}
.cd-progress{height:3px;background:#eee;border-radius:2px;margin-top:12px;overflow:hidden}
.cd-progress-fill{height:100%;border-radius:2px;transition:width 1s ease}
.cd-keynote-layout{display:flex;gap:16px;align-items:flex-start}
.cd-keynote-photo{width:68px;height:68px;border-radius:50%;object-fit:cover;background:#f0f0f0;flex-shrink:0;border:1px solid #e8e8e8}
.cd-keynote-photo-placeholder{width:68px;height:68px;border-radius:50%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:600;color:#bbb;flex-shrink:0;border:1px solid #e8e8e8}
.cd-keynote-type{font-size:12px;color:#999;margin-bottom:2px}
.cd-keynote-title{font-size:15px;font-weight:600;line-height:1.35;margin-bottom:4px}
.cd-keynote-speaker{font-size:13px;color:#555}
.cd-keynote-loc{font-size:12px;color:#999;margin-top:4px}
.cd-room-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px}
@media(max-width:700px){.cd-room-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:420px){.cd-room-grid{grid-template-columns:1fr}}
.cd-room-label{font-size:11px;font-weight:700;letter-spacing:.3px;text-transform:uppercase}
.cd-room-num{font-size:11px;color:#999}
.cd-room-session{font-size:12px;font-weight:600;margin:6px 0 2px;color:#333}
.cd-room-divider{border:none;border-top:1px solid #eee;margin:8px 0}
.cd-room-now-label{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#999;margin-bottom:4px}
.cd-room-paper{font-size:12px;font-weight:500;line-height:1.4;color:#222}
.cd-room-presenter{font-size:11px;color:#666;margin-top:2px}
.cd-room-time{font-size:11px;color:#999;margin-top:2px}
.cd-room-next{font-size:11px;color:#888;margin-top:8px;padding-top:6px;border-top:1px dashed #eee}
.cd-room-next b{font-weight:500;color:#555}
.cd-break{background:#f8f8f6;border:1px solid #e8e8e8;border-radius:10px;padding:20px;text-align:center}
.cd-break-title{font-size:15px;color:#555}
.cd-break-next{font-size:13px;color:#999;margin-top:6px}
.cd-main-title{font-size:16px;font-weight:600;margin-bottom:4px}
.cd-main-loc{font-size:13px;color:#888}
.cd-main-time{font-size:13px;color:#888;margin-top:2px}
.cd-today-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
@media(max-width:600px){.cd-today-grid{grid-template-columns:1fr}}
.cd-today-title{font-size:15px;font-weight:600;margin-bottom:14px}
.cd-tl{position:relative;padding-left:20px}
.cd-tl-item{display:flex;gap:10px;align-items:flex-start;margin-bottom:4px;min-height:26px;position:relative;font-size:12px}
.cd-tl-item::before{content:'';position:absolute;left:-20px;top:0;bottom:-4px;width:1px;background:#e0e0e0}
.cd-tl-item:last-child::before{display:none}
.cd-tl-dot{position:absolute;left:-23px;top:6px;width:7px;height:7px;border-radius:50%;background:#ccc}
.cd-tl-dot.now{background:#E24B4A;box-shadow:0 0 0 3px rgba(226,75,74,.2)}
.cd-tl-dot.keynote{background:#534AB7}
.cd-tl-time{font-size:11px;color:#999;min-width:36px;flex-shrink:0;padding-top:1px}
.cd-tl-text{font-size:12px;color:#222}
.cd-tl-text.past{opacity:.35}
.cd-tl-text.kn{font-weight:600}
.cd-tl-text.brk{font-style:italic;color:#999}
.cd-tl-tracks{display:inline-flex;gap:2px;margin-left:4px;vertical-align:middle}
.cd-tl-track{width:11px;height:11px;border-radius:3px;font-size:7px;display:inline-flex;align-items:center;justify-content:center;color:#fff;font-weight:700}
.cd-shuttle-item{display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-top:1px solid #f0f0f0;font-size:12px}
.cd-shuttle-item:first-child{border-top:none}
.cd-shuttle-icon{font-size:13px;flex-shrink:0;margin-top:1px;width:16px;text-align:center}
.cd-shuttle-time{font-weight:600;min-width:38px;flex-shrink:0}
.cd-shuttle-route{color:#666;flex:1;line-height:1.5}
.cd-shuttle-item.past{opacity:.35}
.cd-shuttle-item.next .cd-shuttle-time{color:#2471A3}
.cd-shuttle-countdown{font-size:11px;color:#2471A3;font-weight:500}
.cd-footer{display:grid;grid-template-columns:1fr 1fr;gap:16px;background:#f8f8f6;border-radius:10px;padding:20px 24px;font-size:12px;color:#666}
@media(max-width:500px){.cd-footer{grid-template-columns:1fr}}
.cd-footer-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.8px;color:#aaa;margin-bottom:3px}
.cd-footer-val{font-size:13px;color:#222}
.cd-footer a{color:#2471A3;text-decoration:none}
.cd-footer-copy{text-align:center;font-size:11px;color:#bbb;margin-top:12px}
.cd-hero-msg{text-align:center;padding:3rem 1rem}
.cd-hero-msg h2{font-size:22px;font-weight:600;margin-bottom:8px}
.cd-hero-msg p{font-size:14px;color:#888}
.cd-loading{text-align:center;padding:3rem;color:#aaa;font-size:14px}
.cd-spinner{display:inline-block;width:20px;height:20px;border:2px solid #e0e0e0;border-top-color:#333;border-radius:50%;animation:cd-spin .7s linear infinite;margin-bottom:10px}
@keyframes cd-spin{to{transform:rotate(360deg)}}
`;

  // GOOGLE SHEETS FETCHER + CSV PARSER
  async function fetchTab(tab) {
    var url =
      "https://docs.google.com/spreadsheets/d/e/" +
      CFG.SHEET_ID +
      "/pub?output=csv&sheet=" +
      encodeURIComponent(tab);
    const r = await fetch(url);
    if (!r.ok) throw new Error('Fetch "' + tab + '" failed: ' + r.status);
    return parseCSV(await r.text());
  }
  function parseCSV(csv) {
    const lines = csv.split("\n");
    if (lines.length < 2) return [];
    const hdr = parseLine(lines[0]).map(clean);
    const out = [];
    for (let i = 1; i < lines.length; i++) {
      const l = lines[i].trim();
      if (!l) continue;
      const v = parseLine(l);
      const row = {};
      hdr.forEach(function (h, j) {
        row[h] = clean(v[j] || "");
      });
      out.push(row);
    }
    return out;
  }
  function parseLine(l) {
    var o = [],
      c = "",
      q = false;
    for (var i = 0; i < l.length; i++) {
      var ch = l[i];
      if (ch === '"') {
        if (q && l[i + 1] === '"') {
          c += '"';
          i++;
        } else q = !q;
      } else if (ch === "," && !q) {
        o.push(c);
        c = "";
      } else c += ch;
    }
    o.push(c);
    return o;
  }
  function clean(s) {
    return (s || "").replace(/^"|"$/g, "").trim();
  }

  // TIME UTILITIES
  function getNow() {
    return new Date(new Date().toLocaleString("en-US", { timeZone: CFG.TZ }));
  }
  function todayStr(d) {
    return d.getFullYear() + "-" + S(d.getMonth() + 1) + "-" + S(d.getDate());
  }
  function S(n) {
    return String(n).padStart(2, "0");
  }
  function toMin(t) {
    if (!t) return 0;
    var p = t.split(":").map(Number);
    return p[0] * 60 + p[1];
  }
  function nowMin(d) {
    return d.getHours() * 60 + d.getMinutes();
  }
  function fmtCountdown(target, now) {
    var d = target - now;
    if (d <= 0) return "";
    if (d < 60) return d + " min";
    var h = Math.floor(d / 60),
      m = d % 60;
    return m > 0 ? h + "h " + m + "min" : h + "h";
  }
  function pct(start, end, now) {
    var s = toMin(start),
      e = toMin(end);
    if (now <= s) return 0;
    if (now >= e) return 100;
    return Math.round(((now - s) / (e - s)) * 100);
  }

  // DATA STORE
  var D = {
    news: [],
    schedule: [],
    sessions: [],
    papers: [],
    shuttle: [],
    keynotes: [],
  };
  var LK = { keynotes: {}, sessionsBySlot: {}, papersBySession: {} };

  function buildLookups() {
    LK.keynotes = {};
    D.keynotes.forEach(function (k) {
      LK.keynotes[k.keynote_id] = k;
    });
    LK.sessionsBySlot = {};
    D.sessions.forEach(function (s) {
      if (!LK.sessionsBySlot[s.session_slot])
        LK.sessionsBySlot[s.session_slot] = [];
      LK.sessionsBySlot[s.session_slot].push(s);
    });
    LK.papersBySession = {};
    D.papers.forEach(function (p) {
      if (!LK.papersBySession[p.session_id])
        LK.papersBySession[p.session_id] = [];
      LK.papersBySession[p.session_id].push(p);
    });
    Object.keys(LK.papersBySession).forEach(function (k) {
      LK.papersBySession[k].sort(function (a, b) {
        return (parseInt(a.paper_order) || 0) - (parseInt(b.paper_order) || 0);
      });
    });
  }

  // INIT
  var ROOT = document.getElementById("cdash");
  if (!ROOT) {
    console.error("[CAADRIA] #cdash not found");
    return;
  }
  var styleEl = document.createElement("style");
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  async function init() {
    ROOT.innerHTML =
      '<div class="cd-loading"><div class="cd-spinner"></div><div>Loading dashboard...</div></div>';
    try {
      var tabs = [
        "news",
        "schedule",
        "sessions",
        "papers",
        "shuttle",
        "keynotes",
      ];
      var results = await Promise.all(
        tabs.map(function (t) {
          return fetchTab(t);
        }),
      );
      tabs.forEach(function (t, i) {
        D[t] = results[i];
      });
      buildLookups();
      console.log(
        "[CAADRIA] Data loaded:",
        tabs
          .map(function (t, i) {
            return t + ":" + results[i].length;
          })
          .join(", "),
      );
      render();
      setInterval(refreshNews, CFG.REFRESH_NEWS_MS);
      setInterval(render, CFG.REFRESH_CLOCK_MS);
      setInterval(refreshPapers, CFG.REFRESH_PAPERS_MS);
    } catch (err) {
      console.error("[CAADRIA] Init failed:", err);
      ROOT.innerHTML =
        '<div class="cd-hero-msg"><h2>Dashboard loading error</h2><p>' +
        err.message +
        '</p><p style="margin-top:12px;font-size:12px;color:#aaa;">Retrying in 30s...</p></div>';
      setTimeout(init, 30000);
    }
  }
  async function refreshNews() {
    try {
      D.news = await fetchTab("news");
    } catch (e) {
      console.warn("[CAADRIA] News refresh fail");
    }
    render();
  }
  async function refreshPapers() {
    try {
      D.papers = await fetchTab("papers");
      buildLookups();
    } catch (e) {}
    render();
  }

  // RENDER
  function render() {
    var now = getNow(),
      today = todayStr(now),
      nm = nowMin(now);
    if (today < CFG.DATE_START) {
      ROOT.innerHTML =
        '<div class="cd-hero-msg"><h2>CAADRIA 2026</h2><p>The conference dashboard will be available starting April 25.</p></div>';
      return;
    }
    if (today >= CFG.DATE_END) {
      ROOT.innerHTML =
        '<div class="cd-hero-msg"><h2>Thank you for attending CAADRIA 2026!</h2><p>We hope to see you again next year.</p></div>';
      return;
    }
    var ts = D.schedule.filter(function (e) {
      return e.date === today;
    });
    var sh = D.shuttle.filter(function (s) {
      return s.date === today;
    });
    var dl = ts.length > 0 ? ts[0].day_label : "";
    ROOT.innerHTML =
      renderTicker() +
      '<div style="padding:0 .25rem">' +
      renderNow(ts, nm, now) +
      renderToday(ts, sh, nm, dl) +
      renderFooter() +
      "</div>";
  }

  // SECTION 1: TICKER
  function renderTicker() {
    var active = D.news
      .filter(function (r) {
        return r.active === "TRUE";
      })
      .sort(function (a, b) {
        return (parseInt(a.order) || 0) - (parseInt(b.order) || 0);
      });
    if (!active.length)
      return '<div class="cd-ticker"><span class="cd-ticker-dot"></span>Welcome to CAADRIA 2026 &mdash; Humanistic Computation &amp; Intelligence</div>';
    var segs = active
      .map(function (r) {
        var cls =
          r.priority === "urgent" ? "cd-ticker-seg urgent" : "cd-ticker-seg";
        return '<span class="' + cls + '">' + esc(r.message) + "</span>";
      })
      .join('<span style="color:#555;padding:0 .5rem">&middot;</span>');
    return (
      '<div class="cd-ticker"><div class="cd-ticker-track"><div><span class="cd-ticker-dot"></span>' +
      segs +
      '</div><div><span class="cd-ticker-dot"></span>' +
      segs +
      "</div></div></div>"
    );
  }

  // SECTION 2: HAPPENING NOW
  function renderNow(events, nm, now) {
    if (!events.length)
      return '<div class="cd-section"><div class="cd-break"><div class="cd-break-title">No events scheduled today</div></div></div>';
    var current = events.filter(function (e) {
      return nm >= toMin(e.time_start) && nm < toMin(e.time_end);
    });
    var future = events.filter(function (e) {
      return toMin(e.time_start) > nm;
    });
    var next = future.length > 0 ? future[0] : null;
    var soon = future.filter(function (e) {
      return toMin(e.time_start) - nm <= CFG.STARTING_SOON_MIN;
    });
    var timeStr = S(now.getHours()) + ":" + S(now.getMinutes());
    var nextStr = next
      ? "Next up in " + fmtCountdown(toMin(next.time_start), nm)
      : "";
    var body = "";
    if (!current.length && !future.length) {
      body =
        '<div class="cd-break"><div class="cd-break-title">Today\'s program has concluded</div><div class="cd-break-next">See you tomorrow!</div></div>';
    } else if (!current.length) {
      body = soon.length
        ? soon
            .map(function (e) {
              return renderActiveEvent(e, nm, "soon");
            })
            .join("")
        : '<div class="cd-break"><div class="cd-break-title">Coming up next</div><div class="cd-break-next">' +
          esc(future[0].title) +
          " at " +
          future[0].time_start +
          "</div></div>";
    } else {
      body = current
        .map(function (e) {
          return renderActiveEvent(e, nm, "live");
        })
        .join("");
      soon
        .filter(function (s) {
          return current.indexOf(s) === -1;
        })
        .forEach(function (e) {
          body += renderActiveEvent(e, nm, "soon");
        });
    }
    return (
      '<div class="cd-section"><div class="cd-sec-header"><div class="cd-sec-title"><div class="cd-live-dot"></div> Happening now</div><div class="cd-sec-meta">' +
      timeStr +
      " &nbsp; " +
      nextStr +
      "</div></div>" +
      body +
      "</div>"
    );
  }

  function renderActiveEvent(e, nm, state) {
    if (e.type === "session") return renderSessionCards(e, nm);
    if (e.type === "break") return renderBreak(e, nm);
    if (e.type === "keynote") return renderKeynoteCard(e, nm, state);
    return renderMainCard(e, nm, state);
  }

  function renderKeynoteCard(e, nm, state) {
    var kd = LK.keynotes[e.keynote_id] || {};
    var p = pct(e.time_start, e.time_end, nm);
    var badge =
      state === "live"
        ? '<div class="cd-badge cd-badge-live"><div class="cd-live-dot" style="width:6px;height:6px"></div> Live</div>'
        : '<div class="cd-badge cd-badge-soon">&#9203; Starting in ' +
          fmtCountdown(toMin(e.time_start), nm) +
          "</div>";
    var link = kd.link || e.link || "/keynotes";
    var photo = kd.photo_url
      ? '<img class="cd-keynote-photo" src="' +
        esc(kd.photo_url) +
        '" alt="' +
        esc(kd.speaker) +
        '" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\'"><div class="cd-keynote-photo-placeholder" style="display:none">' +
        ini(kd.speaker) +
        "</div>"
      : '<div class="cd-keynote-photo-placeholder">' +
        ini(kd.speaker) +
        "</div>";
    return (
      '<div class="cd-card" style="margin-bottom:10px"><div class="cd-card-accent" style="background:#534AB7"></div><a href="' +
      esc(link) +
      '" class="cd-view-more">View &#8594;</a>' +
      badge +
      '<div class="cd-keynote-layout"><div>' +
      photo +
      '</div><div><div class="cd-keynote-type">' +
      esc(e.title) +
      '</div><div class="cd-keynote-title">' +
      esc(kd.title || "") +
      '</div><div class="cd-keynote-speaker">' +
      esc(kd.speaker || "") +
      " &middot; " +
      esc(kd.affiliation || "") +
      '</div><div class="cd-keynote-loc">' +
      e.time_start +
      "&ndash;" +
      e.time_end +
      " &middot; " +
      esc(e.location) +
      "</div></div></div>" +
      (state === "live"
        ? '<div class="cd-progress"><div class="cd-progress-fill" style="width:' +
          p +
          '%;background:#534AB7"></div></div>'
        : "") +
      "</div>"
    );
  }

  function renderMainCard(e, nm, state) {
    var p = pct(e.time_start, e.time_end, nm);
    var badge =
      state === "live"
        ? '<div class="cd-badge cd-badge-live"><div class="cd-live-dot" style="width:6px;height:6px"></div> Live</div>'
        : '<div class="cd-badge cd-badge-soon">&#9203; Starting in ' +
          fmtCountdown(toMin(e.time_start), nm) +
          "</div>";
    var link = e.link || "/programs";
    return (
      '<div class="cd-card" style="margin-bottom:10px"><div class="cd-card-accent" style="background:#333"></div><a href="' +
      esc(link) +
      '" class="cd-view-more">View &#8594;</a>' +
      badge +
      '<div class="cd-main-title">' +
      esc(e.title) +
      '</div><div class="cd-main-loc">' +
      esc(e.location) +
      '</div><div class="cd-main-time">' +
      e.time_start +
      "&ndash;" +
      e.time_end +
      "</div>" +
      (state === "live"
        ? '<div class="cd-progress"><div class="cd-progress-fill" style="width:' +
          p +
          '%;background:#333"></div></div>'
        : "") +
      "</div>"
    );
  }

  function renderSessionCards(e, nm) {
    var slot = e.session_slot;
    var tracks = LK.sessionsBySlot[slot] || [];
    if (!tracks.length) return renderMainCard(e, nm, "live");
    var cards = tracks
      .map(function (t) {
        var rc = RC[t.room] || RC.A;
        var papers = LK.papersBySession[t.session_id] || [];
        var link = t.link || e.link || "/programs";
        var cur = null,
          nxt = null,
          pnum = 0,
          total = papers.filter(function (p) {
            return p.title && p.title !== "Discussion & Q&A";
          }).length;
        for (var i = 0; i < papers.length; i++) {
          if (
            nm >= toMin(papers[i].time_start) &&
            nm < toMin(papers[i].time_end)
          ) {
            cur = papers[i];
            pnum = parseInt(papers[i].paper_order) || i + 1;
            nxt = papers[i + 1] || null;
            break;
          }
        }
        if (!cur)
          for (var j = 0; j < papers.length; j++) {
            if (toMin(papers[j].time_start) > nm) {
              nxt = papers[j];
              break;
            }
          }
        var pp = pct(e.time_start, e.time_end, nm);
        var ph = "";
        if (cur && cur.title) {
          var isQA = cur.title === "Discussion & Q&A";
          ph =
            '<hr class="cd-room-divider"><div class="cd-room-now-label">' +
            (isQA ? "Now" : "Now presenting") +
            '</div><div class="cd-room-paper">' +
            esc(cur.title) +
            "</div>" +
            (cur.presenter
              ? '<div class="cd-room-presenter">' +
                esc(cur.authors || cur.presenter) +
                "</div>"
              : "") +
            '<div class="cd-room-time">' +
            cur.time_start +
            "&ndash;" +
            cur.time_end +
            (total > 0 && !isQA
              ? " (paper " + pnum + " of " + total + ")"
              : "") +
            "</div>";
          if (nxt && nxt.title)
            ph +=
              '<div class="cd-room-next">Next: <b>' +
              esc(nxt.title) +
              "</b>" +
              (nxt.presenter ? " &middot; " + esc(nxt.presenter) : "") +
              " &middot; " +
              nxt.time_start +
              "</div>";
        } else if (nxt) {
          ph =
            '<hr class="cd-room-divider"><div class="cd-room-now-label">Up next</div><div class="cd-room-paper">' +
            esc(nxt.title) +
            '</div><div class="cd-room-time">' +
            nxt.time_start +
            "</div>";
        }
        return (
          '<div class="cd-card" style="padding:14px 16px"><div class="cd-card-accent" style="background:' +
          rc.border +
          '"></div><a href="' +
          esc(link) +
          '" class="cd-view-more">View &#8594;</a><div class="cd-room-label" style="color:' +
          rc.label +
          '">Room ' +
          t.room +
          '</div><div class="cd-room-num">' +
          esc(t.room_number) +
          " &middot; Session " +
          esc(t.session_id) +
          '</div><div class="cd-room-session">' +
          esc(t.session_title) +
          "</div>" +
          ph +
          '<div class="cd-progress"><div class="cd-progress-fill" style="width:' +
          pp +
          "%;background:" +
          rc.border +
          '"></div></div></div>'
        );
      })
      .join("");
    return '<div class="cd-room-grid">' + cards + "</div>";
  }

  function renderBreak(e, nm) {
    var today = todayStr(getNow());
    var future = D.schedule.filter(function (ev) {
      return (
        ev.date === today && toMin(ev.time_start) > nm && ev.type !== "break"
      );
    });
    var next = future.length > 0 ? future[0] : null;
    var ns = next
      ? "Next: " +
        next.title +
        " starting in " +
        fmtCountdown(toMin(next.time_start), nm)
      : "";
    return (
      '<div class="cd-break"><div class="cd-break-title">' +
      esc(e.title) +
      " &middot; " +
      esc(e.location) +
      " &middot; until " +
      e.time_end +
      "</div>" +
      (ns ? '<div class="cd-break-next">' + ns + "</div>" : "") +
      "</div>"
    );
  }

  // SECTION 3: TODAY
  function renderToday(schedule, shuttle, nm, dayLabel) {
    return (
      '<div class="cd-section"><div class="cd-today-grid"><div><div class="cd-card" style="padding:16px 20px"><a href="/programs" class="cd-view-more">View &#8594;</a><div class="cd-today-title">Today\'s schedule' +
      (dayLabel ? " &mdash; " + esc(dayLabel) : "") +
      "</div>" +
      renderTimeline(schedule, nm) +
      '</div></div><div><div class="cd-card" style="padding:16px 20px"><a href="/transportation" class="cd-view-more">View &#8594;</a><div class="cd-today-title">Today\'s shuttle</div>' +
      renderShuttle(shuttle, nm) +
      "</div></div></div></div>"
    );
  }

  function renderTimeline(events, nm) {
    if (!events.length)
      return '<div style="font-size:13px;color:#999">No events today</div>';
    return (
      '<div class="cd-tl">' +
      events
        .map(function (e) {
          var s = toMin(e.time_start),
            ed = toMin(e.time_end);
          var isNow = nm >= s && nm < ed,
            isPast = nm >= ed,
            isK = e.type === "keynote",
            isB = e.type === "break",
            isS = e.type === "session";
          var dc = "cd-tl-dot" + (isNow ? " now" : isK ? " keynote" : "");
          var tc =
            "cd-tl-text" +
            (isPast ? " past" : "") +
            (isK ? " kn" : "") +
            (isB ? " brk" : "");
          var label = esc(e.title);
          if (isK && LK.keynotes[e.keynote_id])
            label =
              esc(e.title) + ": " + esc(LK.keynotes[e.keynote_id].speaker);
          var tr = "";
          if (isS) {
            tr = '<span class="cd-tl-tracks">';
            ["A", "B", "C", "D"].forEach(function (r) {
              tr +=
                '<span class="cd-tl-track" style="background:' +
                RC[r].border +
                '">' +
                r +
                "</span>";
            });
            tr += "</span>";
          }
          return (
            '<div class="cd-tl-item"><div class="' +
            dc +
            '"></div><div class="cd-tl-time"' +
            (isNow ? ' style="font-weight:600"' : "") +
            ">" +
            e.time_start +
            '</div><div class="' +
            tc +
            '">' +
            label +
            " " +
            tr +
            "</div></div>"
          );
        })
        .join("") +
      "</div>"
    );
  }

  function renderShuttle(runs, nm) {
    if (!runs.length)
      return '<div style="font-size:13px;color:#999">No shuttle runs today</div>';
    var ni = -1;
    for (var i = 0; i < runs.length; i++) {
      if (toMin(runs[i].time) > nm) {
        ni = i;
        break;
      }
    }
    return runs
      .map(function (r, i) {
        var past = toMin(r.time) <= nm,
          isNext = i === ni;
        var cls =
          "cd-shuttle-item" + (past ? " past" : "") + (isNext ? " next" : "");
        var icon = past ? "&#10003;" : isNext ? "&#9654;" : "&#9711;";
        var ex = "";
        if (r.eta)
          ex +=
            '<br><span style="font-size:11px;color:#999">ETA ' +
            r.eta +
            "</span>";
        if (isNext)
          ex +=
            '<br><span class="cd-shuttle-countdown">Departing in ' +
            fmtCountdown(toMin(r.time), nm) +
            "</span>";
        if (r.notes)
          ex +=
            '<br><span style="font-size:11px;color:#aaa">' +
            esc(r.notes) +
            "</span>";
        return (
          '<div class="' +
          cls +
          '"><div class="cd-shuttle-icon"' +
          (isNext ? ' style="color:#2471A3"' : "") +
          ">" +
          icon +
          '</div><div class="cd-shuttle-time">' +
          r.time +
          '</div><div class="cd-shuttle-route">' +
          esc(r.route) +
          ex +
          "</div></div>"
        );
      })
      .join("");
  }

  // SECTION 4: FOOTER
  function renderFooter() {
    return '<div class="cd-section"><div class="cd-footer"><div><div class="cd-footer-label">Conference inquiries</div><div class="cd-footer-val"><a href="mailto:caadria2026@arch.nycu.edu.tw">caadria2026@arch.nycu.edu.tw</a></div><div style="margin-top:12px"><div class="cd-footer-label">Wi-Fi</div><div class="cd-footer-val">SSID: NYCU-Guest</div></div></div><div><div class="cd-footer-label">Venue</div><div class="cd-footer-val">NYCU Guangfu Campus<br>No. 1001, Daxue Rd., East Dist., Hsinchu 300</div><div style="margin-top:4px"><a href="/venue">Campus map &#8594;</a></div><div style="margin-top:12px"><div class="cd-footer-label">Gala dinner</div><div class="cd-footer-val">May 1, 19:00 &middot; Lakeshore Hotel</div></div></div></div><div class="cd-footer-copy">&copy; 2026 CAADRIA &middot; Humanistic Computation &amp; Intelligence</div></div>';
  }

  // HELPERS
  function esc(s) {
    return s
      ? s
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
      : "";
  }
  function ini(n) {
    return n
      ? n
          .split(" ")
          .map(function (w) {
            return w[0];
          })
          .join("")
          .substring(0, 2)
          .toUpperCase()
      : "?";
  }

  // BOOT
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", init);
  else init();
})();
