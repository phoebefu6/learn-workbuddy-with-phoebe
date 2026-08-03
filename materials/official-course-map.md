# learn workbuddy with phoebe - official source coverage map

Built 2026-08-02, direct from verified public sources (course-taking loop paused).
**WorkBuddy is fast-moving: China launch Mar 2026, global launch May 2026 (SuperAI Singapore).
Re-verify the changelog at workbuddy.ai/docs before every delivery - UI names, pricing, and
connector lists WILL drift.**

## Sources (verified 2026-08-02)

| ID | Source | What it anchors |
|----|--------|-----------------|
| S1 | Tencent Cloud techpedia 144683 - "AI Agent for Business Automation: What WorkBuddy Can Do" | Task types, 4-stage loop (Understand-Plan-Act-Deliver), integrations, Team plan ($40/seat/mo, 1,000 pooled Credits), Admin Console, Memory, Skills Marketplace security scanning |
| S2 | Tencent Cloud techpedia 144100 - "Download, Install & Use Guide (Overseas)" | System reqs (Win 10/11, macOS 10.15+, ~150-180 MB), install steps, folder authorization, sandboxed execution, first-task pattern, remote control via Slack/Telegram/Discord |
| S3 | workbuddy.ai/docs official documentation | Feature map: Task Bar, Assistant, Expert Center, Skill Marketplace, Connectors, Explore, Automation, Model Configuration, Permission Modes, Memory, Data Management; Practice Cases (File Recognition, Document Generation, Data Analysis, Social Media, Daily Briefing, Slack/Google, Local Apps, Custom Skills); Platform Integration (Slack, Telegram, Discord, WeChat Work, Feishu, DingTalk, QQ) |
| S4 | Eigent "WorkBuddy AI Review (2026)" (independent) | Multi-agent orchestration detail, pricing tiers (Free $0 / Pro ~$9.95 / Team ~$40 seat; CN: 58/198/316 RMB), strengths + honest limitations (verify outputs, intl support lag, setup complexity) |
| S5 | PR Newswire - Tencent Cloud unveils WorkBuddy + Miora (SuperAI 2026) | Global positioning, SEA rollout, "execution-driven" framing |
| S6 | TechNode 2026-03-09 + 2026-05-29 | China-first launch, OpenClaw-like positioning, global availability, multi-model support (Hunyuan, DeepSeek, GLM, Kimi, MiniMax) |
| S7 | Tencent Cloud official X announcement | "100+ built-in Experts across industries", "Not just answers. Finished work." |

## Verified product facts (safe to teach)

- Core contract: single natural-language instruction -> planned, decomposed, executed multi-step work -> finished verifiable deliverable (report, deck, spreadsheet). (S1, S7)
- Four-stage execution loop: Understand -> Plan -> Act -> Deliver, with audit trail of changes. (S1)
- Plan confirmation before execution; runs in a sandboxed environment. (S2)
- Task types: documents/reports, presentations, data analysis (CSV/Excel -> trends, charts, dashboards), multi-source research + competitive matrices, batch file operations, scheduled automation (hourly/daily/weekly/one-time) with push to Slack/Telegram/Discord/WeChat Work/Feishu/DingTalk/QQ. (S1, S3)
- 100+ built-in Experts (market research, financial analysis, slide design, legal drafting). (S7)
- Skill packages: 20+ reusable skill sets, composable into repeatable workflows; Skills Marketplace with automatic security scanning. (S1, S4, S6)
- Connectors: GitHub, Jira, Confluence, Google Drive, Gmail, Notion, Slack + web search + local file system; MCP-pattern pluggable tools. (S1, S4)
- Desktop app (local file access, no mandatory cloud upload) + remote bot trigger from phone via chat platforms. (S2, S4)
- Multi-model switching: Hunyuan, DeepSeek, GLM, Kimi, MiniMax. (S6)
- Governance surface: Permission Modes, folder-level authorization, Memory (private, editable defaults), Data Management, Admin Console with centralized governance + shared Credits pool. (S1, S2, S3)
- Pricing (re-verify before delivery): Free $0; Pro ~$9.95/mo; Team ~$40/seat/mo with 1,000 pooled Credits. (S1, S4)
- Honest limits (teach, don't hide): outputs need verification before external use; international support lags domestic; advanced setup has real complexity; region focus favors CN market. (S4)

## Leader track coverage (6 x 45 min)

| Session | Teaches | Sources | Coverage |
|---------|---------|---------|----------|
| a1 From chatbots to agents | assistive vs execution AI, "you say, it does", where WorkBuddy sits in the agent landscape | S5, S6, S7 | ✓ |
| a2 What WorkBuddy actually does | 4-stage loop, deliverables-not-answers, task-type portfolio, demo narrative | S1, S2, S7 | ✓ |
| a3 Where it fits your team | delegate-vs-DIY triage, use-case portfolio, what agents are bad at | S1, S4 | ✓ |
| a4 Risk + governance | Permission Modes, folder auth, sandbox, audit trail, verify-before-external-use, Data Management | S1, S2, S3, S4 | ✓ |
| a5 Rollout playbook | pilot design, Team plan + Credits economics, Admin Console, champions, Marketplace vetting | S1, S4 | ✓ |
| a6 Measuring value + roadmap | adoption metrics, credit economics, scale decision, honest limits | S4, S5 | ✓ |

## Operator track coverage (10 x 45 min) - Meridian running project

Running project: **Meridian**, a Singapore specialty-tea brand entering Malaysia. Sessions b3-b10
each add one real artifact to a market-entry pack (sales analysis -> research report -> launch
deck -> scheduled weekly briefing -> assembled pack).

| Session | Teaches | Sources | Coverage |
|---------|---------|---------|----------|
| b1 Install + first task | install, folder authorization, Permission Modes, plan confirmation, first deliverable | S2, S3 | ✓ |
| b2 Instruction craft | the instruction contract; buddy-live.js lever simulator | S1, S2 (patterns) | ✓ |
| b3 Data analysis | Excel/CSV merge -> charts -> analysis report (Meridian sales) | S1, S3 (Data Analysis case) | ✓ |
| b4 Research + reports | multi-source research, competitive matrix, market report | S1, S3 (Document Generation case) | ✓ |
| b5 Expert Center | 100+ Experts, picking/routing, slide-design Expert -> launch deck | S3, S7 | ◐ (Expert catalog drifts; re-verify) |
| b6 Skill Marketplace + custom skills | skill packages, composing workflows, Custom Skills case, security scanning | S1, S3, S4 | ◐ (marketplace inventory drifts) |
| b7 Connectors | Drive/Gmail/Notion/Slack/GitHub/Jira wiring, MCP pattern | S1, S3, S4 | ✓ |
| b8 Automation | scheduled tasks, Daily Briefing case -> Meridian weekly brief to Slack | S1, S3 (Automation, Daily Briefing) | ✓ |
| b9 Remote bot + memory | phone trigger via Slack/Telegram/Discord, Task Management, Memory defaults | S1, S2, S3 | ✓ |
| b10 Verify, govern, ship | audit trail, output verification, Credits, Data Management, capstone pack assembly | S1, S4 | ✓ |

## Not covered by design (say so honestly on pages)

- CN-mainland product line specifics (ima/Yuanbao integration, CN pricing mechanics) - global edition only.
- Tencent Design Miora (sibling product, own course if ever needed).
- CodeBuddy (Tencent's separate AI code editor sharing the workbuddy.ai domain docs) - out of scope; this course is office work, not coding.
- Building agents from scratch (that is learn-ai-agents-with-phoebe's job); here we USE one.
- Official Tencent certification/training - none claimed.

## Simulator honesty rail

buddy-live.js is a **teaching simulation** of how instruction quality changes agent outcomes -
deterministic, offline, no real model calls. The lever ladder numbers on b2 are the simulator's
own golden-set scores, not measured WorkBuddy benchmarks. Say this on the page.
