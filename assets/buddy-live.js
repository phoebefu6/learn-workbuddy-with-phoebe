/* buddy-live.js - the Meridian instruction-quality inspector + scorecard.
   Usage:
     <div class="agentbox" data-mode="trace" data-scenario="briefing" data-levers="goal"></div>
     <div class="agentbox" data-mode="score" data-levers="goal,context"></div>
   data-levers = which levers start ON (comma list of: goal,context,format,expert,verify).
   Honesty rail: WorkBuddy's words here are a scripted teaching simulation - not the real
   product. Every figure in a result card is computed for real, in your browser, from the
   embedded Meridian data.
*/
(function () {
  "use strict";

  /* ---------- embedded Meridian data (SG specialty-tea brand entering MY) ---------- */

  var PRODUCTS = {
    1: { name: "Jade Oolong", price: 24.0 },
    2: { name: "Pandan Green", price: 18.0 },
    3: { name: "Lychee Black", price: 20.0 },
    4: { name: "Rose Silver Needle", price: 32.0 },
    5: { name: "Iron Buddha", price: 26.0 },
    6: { name: "Golden Chrysanthemum", price: 16.0 }
  };

  /* Singapore sales - [month, product_id, units] (from sg-sales-2026.xlsx) */
  var SG_SALES = [
    ["2026-01", 1, 120], ["2026-01", 2, 150], ["2026-01", 3, 90], ["2026-01", 4, 40], ["2026-01", 5, 60], ["2026-01", 6, 110],
    ["2026-02", 1, 115], ["2026-02", 2, 160], ["2026-02", 3, 95], ["2026-02", 4, 38], ["2026-02", 5, 58], ["2026-02", 6, 100],
    ["2026-03", 1, 140], ["2026-03", 2, 175], ["2026-03", 3, 110], ["2026-03", 4, 45], ["2026-03", 5, 66], ["2026-03", 6, 120],
    ["2026-04", 1, 150], ["2026-04", 2, 180], ["2026-04", 3, 118], ["2026-04", 4, 50], ["2026-04", 5, 70], ["2026-04", 6, 126],
    ["2026-05", 1, 158], ["2026-05", 2, 190], ["2026-05", 3, 122], ["2026-05", 4, 52], ["2026-05", 5, 75], ["2026-05", 6, 130],
    ["2026-06", 1, 165], ["2026-06", 2, 205], ["2026-06", 3, 131], ["2026-06", 4, 55], ["2026-06", 5, 80], ["2026-06", 6, 140]
  ];

  /* Malaysia pilot - [product_id, units, unit_price_RM] (my-pilot-mar-apr.xlsx, prices in MYR!) */
  var MY_PILOT = [[2, 210, 42], [1, 95, 55], [6, 130, 38]];
  var RM_PER_SGD = 3.30; /* fixed teaching rate, stated on the page */

  /* ---------- real computation engine (genuine numbers, in-browser) ---------- */

  function sgd(n) { return "S$" + n.toLocaleString("en-SG", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function rm(n) { return "RM " + n.toLocaleString("en-MY", { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }

  function monthRevenue(month) {
    var rev = 0;
    SG_SALES.forEach(function (r) { if (r[0] === month) rev += r[2] * PRODUCTS[r[1]].price; });
    return rev;
  }
  function rangeRevenue(months) {
    return months.reduce(function (a, m) { return a + monthRevenue(m); }, 0);
  }
  function topSku() {
    var q = {};
    SG_SALES.forEach(function (r) { q[r[1]] = (q[r[1]] || 0) + r[2]; });
    var best = null;
    Object.keys(q).forEach(function (pid) { if (!best || q[pid] > q[best]) best = pid; });
    return { name: PRODUCTS[best].name, units: q[best] };
  }
  function myPilotRM() {
    return MY_PILOT.reduce(function (a, r) { return a + r[1] * r[2]; }, 0);
  }

  var q1 = rangeRevenue(["2026-01", "2026-02", "2026-03"]);
  var q2 = rangeRevenue(["2026-04", "2026-05", "2026-06"]);
  var growth = Math.round((q2 / q1 - 1) * 1000) / 10;
  var top = topSku();
  var pilotRM = myPilotRM();
  var pilotSGD = Math.round((pilotRM / RM_PER_SGD) * 100) / 100;
  var wrongPack = q1 + q2 + pilotRM;   /* the silent MYR-as-SGD mistake */
  var rightPack = q1 + q2 + pilotSGD;

  /* ---------- lever model ---------- */

  var LEVERS = [
    { key: "goal", label: "Clear goal", hint: "outcome, audience and scope stated in the instruction" },
    { key: "context", label: "Context + files", hint: "folders authorized, source files named" },
    { key: "format", label: "Output format", hint: "deliverable type, length and structure specified" },
    { key: "expert", label: "Right Expert", hint: "matching built-in Expert picked for the job" },
    { key: "verify", label: "Verify ask", hint: "told it to check its own output + attach the audit trail" }
  ];
  var LEVER_ORDER = ["goal", "context", "format", "expert", "verify"];

  /* ---------- golden set (10 office tasks) ---------- */

  var TASKS = [
    { id: 1, q: "Rename the 38 receipts in /Receipts to YYYY-MM-vendor.pdf.",
      needs: [],
      pass: "Batch file operation: 38 files renamed to the pattern, preview shown first. Mechanical tasks survive a bare instruction.",
      fails: {} },
    { id: 2, q: "Convert board-update.docx to PDF.",
      needs: [],
      pass: "One-step conversion, done. No ambiguity to resolve.",
      fails: {} },
    { id: 3, q: "\"Do something with the sales data.\"",
      needs: ["goal"],
      pass: "Restated as: monthly revenue trend + top-SKU table for the leadership sync. Delivers exactly that.",
      fails: { goal: "It guesses. You get a pie chart of units by channel - technically 'something', useful to no one." } },
    { id: 4, q: "\"Make the town-hall deck better.\"",
      needs: ["goal"],
      pass: "Goal stated (tighten to 8 slides for a non-technical audience) - it restructures the narrative, not just the fonts.",
      fails: { goal: "It swaps fonts and recolors headers. The rambling 23-slide structure survives untouched." } },
    { id: 5, q: "Q1 revenue analysis across all three sales files.",
      needs: ["goal", "context"],
      pass: "Reads the three authorized Excel files, computes Q1 " + sgd(q1) + ", charts the trend.",
      fails: { goal: "No stated outcome - it summarizes one file it can see and stops.",
               context: "The folder was never authorized. It builds a beautiful report skeleton with [Q1 REVENUE TBD] placeholders." } },
    { id: 6, q: "Compare the Malaysia pilot to the Singapore baseline.",
      needs: ["goal", "context"],
      pass: "Reads both sg-sales-2026.xlsx and my-pilot-mar-apr.xlsx: SG Q1 " + sgd(q1) + " vs MY pilot " + rm(pilotRM) + " (" + sgd(pilotSGD) + " at 3.30).",
      fails: { goal: "\"Compare\" on what dimension? It compares product name lengths. Really.",
               context: "Only the SG folder is authorized - the 'comparison' is SG numbers next to adjectives about Malaysia." } },
    { id: 7, q: "Weekly sales briefing for Monday 9am.",
      needs: ["goal", "context", "format"],
      pass: "One page: headline number, top SKU (" + top.name + ", " + top.units + " units H1), 3 bullets, 1 risk. Readable in 90 seconds.",
      fails: { goal: "A briefing about... the tea industry at large. Zero Meridian numbers.",
               context: "Files unreachable - the briefing is eloquent placeholder soup.",
               format: "Six pages of prose. The number leadership needed is in paragraph 14." } },
    { id: 8, q: "Competitor matrix for the Malaysia entry.",
      needs: ["goal", "context", "format"],
      pass: "A real matrix: 4 competitors x price band / channels / positioning / share estimate, sources footnoted.",
      fails: { goal: "Unclear market - it profiles Singapore competitors for a Malaysia entry.",
               context: "Research notes folder not shared - matrix cells filled with 'data unavailable'.",
               format: "Four essays, one per competitor. Nothing side-by-side; the whole point of a matrix lost." } },
    { id: 9, q: "Turn the market report into a launch deck.",
      needs: ["goal", "context", "format", "expert"],
      pass: "Slide-design Expert applies slide grammar: 10 slides, one message each, data as charts not tables.",
      fails: { goal: "Deck for whom? Investor pitch and ops review need different decks - it makes neither.",
               context: "Report file not named - it decks a generic tea market overview.",
               format: "No length or structure given: 26 slides, some blank, some triple-stacked.",
               expert: "Generic conversion: report paragraphs pasted onto slides as walls of text." } },
    { id: 10, q: "Assemble the market-entry pack for the leadership review.",
      needs: ["goal", "context", "verify"],
      pass: "Pack assembled AND cross-checked: it catches that the MY pilot file is in MYR, converts at 3.30, totals " + sgd(rightPack) + ", audit trail attached.",
      fails: { goal: "Which documents form 'the pack'? It zips a folder alphabetically, including two drafts.",
               context: "Half the artifacts unreachable - the pack ships with three broken links.",
               verify: "It sums the MY pilot's RM column straight into the SGD totals: " + sgd(wrongPack) + ". Looks perfect. The MY line is wrong by 3.3x - and nobody asked it to check." } }
  ];

  function taskResult(task, on) {
    for (var i = 0; i < LEVER_ORDER.length; i++) {
      var k = LEVER_ORDER[i];
      if (task.needs.indexOf(k) !== -1 && !on[k]) {
        return { ok: false, lever: k, text: task.fails[k] };
      }
    }
    return { ok: true, text: task.pass };
  }

  /* ---------- trace scenarios ---------- */
  /* Step kinds map to WorkBuddy's loop: user / plan (Understand+Plan) / call (Act) /
     result (artifact) / guard (verify + clarify) / answer (Deliver). */

  function s(kind, label, body) { return { kind: kind, label: label, body: body }; }

  var SCENARIOS = {

    briefing: {
      title: "Task: \"Weekly sales briefing for Monday 9am.\"",
      build: function (on) {
        if (!on.goal) {
          return { verdict: { ok: false, note: "A vague instruction is a lottery ticket. The agent executed perfectly - toward a goal it had to invent." },
            steps: [
              s("user", "INSTRUCTION", "\"Give me a briefing about sales.\""),
              s("plan", "UNDERSTAND (guessing)", "No audience, no scope, no timeframe. I will brief on... the global tea market, probably?"),
              s("answer", "DELIVER ✗", "A polished 3-page overview of worldwide tea trends. Not one Meridian number in it.\n\nThe agent did its job. The instruction didn't do yours.")
            ] };
        }
        if (!on.context) {
          return { verdict: { ok: false, note: "WorkBuddy can only touch folders you authorize and files you name. Unreachable data = placeholder deliverables." },
            steps: [
              s("user", "INSTRUCTION", "\"One-page sales briefing for Monday's 9am leadership sync - last week's numbers, top product, risks.\""),
              s("plan", "PLAN (confirmed)", "1) Read sales files  2) compute headline + top SKU  3) draft one-pager."),
              s("call", "ACT - read files", "open ~/Documents/Meridian/sg-sales-2026.xlsx"),
              s("result", "RESULT", "PERMISSION DENIED - folder not authorized in Settings > Folder Access."),
              s("answer", "DELIVER ✗", "A beautifully formatted one-pager reading:\n\"Revenue: [DATA UNAVAILABLE] · Top product: [TBD]\"\n\nStructure without substance.")
            ] };
        }
        if (!on.format) {
          return { verdict: { ok: false, note: "Right goal, real data, unusable shape. Format is part of the instruction, not a nice-to-have." },
            steps: [
              s("user", "INSTRUCTION", "\"Sales briefing for Monday's 9am leadership sync from the Meridian folder.\""),
              s("plan", "PLAN (confirmed)", "Read files, analyze fully, write it all up."),
              s("call", "ACT - read + compute", "sg-sales-2026.xlsx -> H1 revenue " + sgd(q1 + q2) + ", Q2 " + sgd(q2) + " (+" + growth + "% vs Q1), top SKU " + top.name + "."),
              s("result", "RESULT (computed live)", "All figures computed from the real sheet - and then buried."),
              s("answer", "DELIVER ✗", "Six pages of thorough prose. The +23% headline leadership needed is in paragraph 14.\n\nNobody reads page 4 at 9am on a Monday.")
            ] };
        }
        return { verdict: { ok: true, note: "Goal + reachable files + a specified shape. Same agent, same data - now it lands." },
          steps: [
            s("user", "INSTRUCTION", "\"One-page briefing for Monday's 9am leadership sync from ~/Documents/Meridian: headline number, top product, 3 bullets, 1 risk. Bullets max 15 words.\""),
            s("plan", "PLAN (confirmed)", "1) Read sg-sales-2026.xlsx  2) compute Q2 vs Q1 + top SKU  3) draft to the exact template."),
            s("call", "ACT - read + compute", "Q1 " + sgd(q1) + " · Q2 " + sgd(q2) + " · growth +" + growth + "% · top SKU " + top.name + " (" + top.units + " units H1)"),
            s("result", "RESULT (computed live)", "Every number above computed in your browser from the embedded sheet."),
            s("answer", "DELIVER ✓", "MERIDIAN WEEKLY - one page:\nHeadline: Q2 " + sgd(q2) + ", +" + growth + "% vs Q1.\nTop product: " + top.name + ".\n• Online channel driving growth\n• Rose Silver Needle stable at premium price\n• MY pilot data in - review Wednesday\nRisk: single-origin oolong supply tightening.")
          ] };
      }
    },

    deck: {
      title: "Task: \"Turn the market report into a launch deck.\"",
      build: function (on) {
        if (!on.format) {
          return { verdict: { ok: false, note: "No shape given - the agent optimized for completeness, the enemy of a good deck." },
            steps: [
              s("user", "INSTRUCTION", "\"Turn my-market-report.docx into a launch deck.\""),
              s("plan", "PLAN (confirmed)", "Convert every report section into slides. All of them."),
              s("call", "ACT - generate slides", "26 slides generated from 26 report subsections."),
              s("answer", "DELIVER ✗", "A 26-slide deck: some slides blank, some triple-stacked with charts, section 4 appears twice.\n\nComplete is not the same as usable.")
            ] };
        }
        if (!on.expert) {
          return { verdict: { ok: false, note: "Without the right Expert you get format conversion, not slide craft. Paragraphs on slides are a report wearing a costume." },
            steps: [
              s("user", "INSTRUCTION", "\"Turn my-market-report.docx into a 10-slide launch deck for the leadership review.\""),
              s("plan", "PLAN (confirmed)", "Split the report into 10 chunks, one per slide."),
              s("call", "ACT - generic conversion", "10 slides created. Average 210 words per slide."),
              s("answer", "DELIVER ✗", "Ten slides of dense pasted paragraphs. Slide 6 is a full table with 40 rows.\n\nIt met the letter of the format. Slide grammar - one message per slide, data as charts - needed the slide-design Expert.")
            ] };
        }
        return { verdict: { ok: true, note: "Format pins the shape; the Expert brings the craft. This pairing is the deck pattern to reuse." },
          steps: [
            s("user", "INSTRUCTION", "\"Use the slide-design Expert: turn my-market-report.docx into a 10-slide launch deck for the leadership review - one message per slide, data as charts.\""),
            s("plan", "PLAN (confirmed)", "Slide-design Expert engaged. Extract the argument, not the sections: situation -> opportunity -> plan -> ask."),
            s("call", "ACT - expert build", "10 slides: 1 title · 2 SG momentum (+" + growth + "% Q2) · 3 MY market size · 4 competitor map · 5 pilot result " + rm(pilotRM) + " · 6 positioning · 7 channel plan · 8 pricing · 9 risks · 10 the ask."),
            s("result", "RESULT (computed live)", "Slides 2 and 5 carry real computed figures from the embedded data."),
            s("answer", "DELIVER ✓", "launch-deck-v1.pptx - 10 slides, headline sentences as titles, every table converted to a chart. Ready for your edit pass, not your rebuild pass.")
          ] };
      }
    },

    pack: {
      title: "Task: \"Assemble the market-entry pack.\" (one file is a trap)",
      build: function (on) {
        if (!on.verify) {
          return { verdict: { ok: false, note: "The MY pilot file is in MYR. Nothing failed loudly - the pack simply shipped wrong by 3.3x on the MY line. Agent output needs a verify ask BEFORE it leaves the building." },
            steps: [
              s("user", "INSTRUCTION", "\"Assemble the market-entry pack: H1 sales summary + MY pilot + competitor matrix, one combined financial summary.\""),
              s("plan", "PLAN (confirmed)", "Read all three artifacts, merge the financials, bind the pack."),
              s("call", "ACT - merge financials", "sg-sales-2026.xlsx: " + sgd(q1 + q2) + " + my-pilot-mar-apr.xlsx: " + pilotRM.toLocaleString("en-MY", { minimumFractionDigits: 2 }) + " (column read as S$)"),
              s("result", "RESULT (computed live)", "Combined total: " + sgd(wrongPack) + " - the RM column summed straight into SGD."),
              s("answer", "DELIVER ✗", "market-entry-pack.pdf, clean and confident. Total " + sgd(wrongPack) + ".\n\nThe real combined figure is " + sgd(rightPack) + ". No error was thrown. That is exactly why this is dangerous.")
            ] };
        }
        return { verdict: { ok: true, note: "The verify ask made the agent cross-foot its own totals - the currency mismatch surfaced BEFORE leadership saw it. Deliver includes the audit trail." },
          steps: [
            s("user", "INSTRUCTION", "\"Assemble the market-entry pack: H1 sales + MY pilot + competitor matrix, one combined financial summary. Before delivering: cross-check every total against its source file and attach the audit trail.\""),
            s("plan", "PLAN (confirmed)", "Assemble, then run the requested self-check on every figure."),
            s("call", "ACT - merge + cross-foot", "Recomputing each total from source..."),
            s("guard", "VERIFY - check caught it", "Mismatch: my-pilot-mar-apr.xlsx column header is 'RM', not 'S$'. Naive sum " + sgd(wrongPack) + " is wrong. Converting " + rm(pilotRM) + " at 3.30 -> " + sgd(pilotSGD) + "."),
            s("result", "RESULT (computed live)", "Corrected combined total: " + sgd(rightPack) + "."),
            s("answer", "DELIVER ✓", "market-entry-pack.pdf - combined total " + sgd(rightPack) + ", MY figures converted and footnoted, audit trail (source file, formula, rate) attached. Verified work, not just finished work.")
          ] };
      }
    }
  };

  /* ---------- rendering ---------- */

  function esc(str) {
    return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  var KIND_META = {
    user: { cls: "ag-user", icon: "🗣" },
    plan: { cls: "ag-plan", icon: "🧠" },
    call: { cls: "ag-call", icon: "⚙️" },
    result: { cls: "ag-result", icon: "📦" },
    guard: { cls: "ag-guard", icon: "🛡" },
    answer: { cls: "ag-answer", icon: "📄" }
  };

  function stepCard(step, idx) {
    var meta = KIND_META[step.kind] || KIND_META.plan;
    var card = document.createElement("div");
    card.className = "ag-step " + meta.cls;
    card.innerHTML =
      '<div class="ag-step-head"><span class="mcp-step-n">' + (idx + 1) + "</span>" +
      '<span class="ag-icon">' + meta.icon + '</span>' +
      '<span class="ag-label">' + esc(step.label) + "</span></div>" +
      '<pre class="ag-body">' + esc(step.body) + "</pre>";
    return card;
  }

  function leverBar(on, onChange) {
    var bar = document.createElement("div");
    bar.className = "ag-levers";
    LEVERS.forEach(function (lv) {
      var chip = document.createElement("button");
      chip.type = "button";
      chip.className = "ag-lever" + (on[lv.key] ? " ag-on" : "");
      chip.title = lv.hint;
      chip.textContent = lv.label;
      chip.addEventListener("click", function () {
        on[lv.key] = !on[lv.key];
        chip.classList.toggle("ag-on", on[lv.key]);
        onChange();
      });
      bar.appendChild(chip);
    });
    return bar;
  }

  function parseLevers(block) {
    var attr = block.getAttribute("data-levers");
    var start = attr === null ? "goal,context,format,expert,verify" : attr;
    var on = { goal: false, context: false, format: false, expert: false, verify: false };
    start.split(",").forEach(function (k) {
      k = k.trim(); if (on.hasOwnProperty(k)) on[k] = true;
    });
    return on;
  }

  function honestyRail() {
    var p = document.createElement("p");
    p.className = "ag-rail";
    p.textContent = "WorkBuddy's words here are a scripted teaching simulation - not the real product. Every figure in a result card is computed for real, in your browser, from the embedded Meridian data (MYR converted at a fixed teaching rate of 3.30).";
    return p;
  }

  /* ---- trace mode ---- */

  function wireTrace(block) {
    var key = block.getAttribute("data-scenario");
    var sc = SCENARIOS[key];
    if (!sc) { block.innerHTML = '<p class="sql-err">Unknown scenario: ' + esc(key) + "</p>"; return; }
    var on = parseLevers(block);
    block.classList.add("agentbox-ready");

    var bar = document.createElement("div");
    bar.className = "sql-bar";
    bar.innerHTML = '<span class="sql-dot"></span>';
    var title = document.createElement("span"); title.className = "sql-title";
    title.textContent = sc.title; bar.appendChild(title);
    var spacer = document.createElement("span"); spacer.className = "sql-spacer"; bar.appendChild(spacer);
    var counter = document.createElement("span"); counter.className = "mcp-counter"; bar.appendChild(counter);
    var backBtn = document.createElement("button");
    backBtn.type = "button"; backBtn.className = "sql-btn"; backBtn.textContent = "◀ Back"; bar.appendChild(backBtn);
    var nextBtn = document.createElement("button");
    nextBtn.type = "button"; nextBtn.className = "sql-btn sql-run"; nextBtn.textContent = "Next ▶"; bar.appendChild(nextBtn);
    var allBtn = document.createElement("button");
    allBtn.type = "button"; allBtn.className = "sql-btn"; allBtn.textContent = "Show all"; bar.appendChild(allBtn);
    block.appendChild(bar);

    var feed = document.createElement("div"); feed.className = "ag-feed";
    var verdict = document.createElement("div");
    var shown = 1, current = sc.build(on);

    block.appendChild(leverBar(on, function () {
      current = sc.build(on); shown = current.steps.length; render();
    }));
    block.appendChild(feed);
    block.appendChild(verdict);
    block.appendChild(honestyRail());

    function render() {
      feed.innerHTML = "";
      current.steps.slice(0, shown).forEach(function (st, i) { feed.appendChild(stepCard(st, i)); });
      counter.textContent = shown + " / " + current.steps.length;
      backBtn.disabled = shown <= 1;
      nextBtn.disabled = shown >= current.steps.length;
      if (shown >= current.steps.length) {
        verdict.className = "ag-verdict " + (current.verdict.ok ? "ag-pass" : "ag-fail");
        verdict.textContent = (current.verdict.ok ? "PASS - " : "FAIL - ") + current.verdict.note;
      } else { verdict.className = "ag-verdict ag-quiet"; verdict.textContent = ""; }
    }
    nextBtn.addEventListener("click", function () { if (shown < current.steps.length) { shown++; render(); } });
    backBtn.addEventListener("click", function () { if (shown > 1) { shown--; render(); } });
    allBtn.addEventListener("click", function () { shown = current.steps.length; render(); });
    render();
  }

  /* ---- scorecard mode ---- */

  function wireScore(block) {
    var on = parseLevers(block);
    block.classList.add("agentbox-ready");

    var bar = document.createElement("div");
    bar.className = "sql-bar";
    bar.innerHTML = '<span class="sql-dot"></span><span class="sql-title">Meridian instruction quality - 10-task golden set</span>';
    block.appendChild(bar);

    var big = document.createElement("div"); big.className = "ag-score-big";
    block.appendChild(leverBar(on, render));
    block.appendChild(big);
    var table = document.createElement("div"); table.className = "ag-score-table";
    block.appendChild(table);
    block.appendChild(honestyRail());

    function render() {
      var passN = 0;
      table.innerHTML = "";
      TASKS.forEach(function (t) {
        var r = taskResult(t, on);
        if (r.ok) passN++;
        var row = document.createElement("div");
        row.className = "ag-score-row " + (r.ok ? "ag-row-pass" : "ag-row-fail");
        var leverTag = r.ok ? "" : '<span class="ag-why">missing: ' + r.lever + "</span>";
        row.innerHTML =
          '<span class="ag-mark">' + (r.ok ? "✓" : "✗") + "</span>" +
          '<span class="ag-q">' + esc(t.q) + leverTag + "</span>" +
          '<span class="ag-out">' + esc(r.text) + "</span>";
        table.appendChild(row);
      });
      big.textContent = passN + " / " + TASKS.length + " tasks land usable";
      big.className = "ag-score-big " + (passN === TASKS.length ? "ag-pass" : passN >= 6 ? "ag-mid" : "ag-fail");
    }
    render();
  }

  /* ---------- boot ---------- */

  function boot() {
    var blocks = document.querySelectorAll(".agentbox");
    Array.prototype.forEach.call(blocks, function (block) {
      if (block.classList.contains("agentbox-ready")) return;
      var mode = block.getAttribute("data-mode") || "trace";
      if (mode === "score") wireScore(block); else wireTrace(block);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else { boot(); }
})();
