/**
 * Dnyanesh Rane — Portfolio  v2.0
 * Supply Chain & Procurement Professional
 *
 * Quick customization guide:
 *   • Resume PDF  → place file at  public/Dnyanesh_Rane_Resume.pdf
 *   • Google Analytics → uncomment the GA block in index.html and replace G-XXXXXXXXXX
 *   • GitHub username  → update GITHUB constant below
 *   • Any personal detail → update the CONSTANTS block below
 */

import { useState, useEffect, useRef } from "react";
import HEADSHOT from "./headshot.js";

// ── CONSTANTS ─────────────────────────────────────────────────────────────────
const NAME     = "Dnyanesh Rane";
const TITLE    = "Supply Chain & Procurement Professional";
const EMAIL    = "dnyanesh.rane19@gmail.com";
const PHONE    = "(667) 320-1364";
const LOCATION = "New Jersey, USA";
const LINKEDIN = "https://www.linkedin.com/in/dnyaneshrane191281/";
const GITHUB   = "https://github.com/dnyaneshrane191281";  // update to real username
const RESUME   = "/resume.pdf";              // place PDF in /public
const YEAR     = new Date().getFullYear();

// ── HOOKS ─────────────────────────────────────────────────────────────────────

function useCounter(target, duration = 1800, started = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!started) return;
    const num = parseFloat(String(target).replace(/[^0-9.]/g, ""));
    if (isNaN(num)) return;
    let startTime = null;
    const raf = (ts) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(ease * num * 10) / 10);
      if (p < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [started, target, duration]);
  return val;
}

function useVisible(threshold = 0.1) {
  const ref = useRef(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVis(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, vis];
}

// ── ANIMATED KPI ──────────────────────────────────────────────────────────────
function AnimatedKPI({ prefix = "", value, suffix = "", label, color, started }) {
  const n = useCounter(value, 1800, started);
  const display = String(value).includes(".") ? n.toFixed(1) : Math.round(n);
  return (
    <div style={{ textAlign: "center", padding: "1.3rem 0.6rem" }}>
      <div style={{
        fontSize: "clamp(1.4rem, 2.8vw, 2.2rem)", fontWeight: 800,
        letterSpacing: "-0.04em", lineHeight: 1,
        background: `linear-gradient(135deg, ${color} 0%, #fff 180%)`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      }}>{prefix}{display}{suffix}</div>
      <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.38)", marginTop: "0.4rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, lineHeight: 1.4 }}>
        {label}
      </div>
    </div>
  );
}

// ── SUPPLY CHAIN CANVAS ───────────────────────────────────────────────────────
function SupplyChainViz() {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);
  const tick      = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);

    const NODES = [
      { fx: 0.08, fy: 0.50, label: "Supplier",     icon: "S",  color: "#38BDF8" },
      { fx: 0.25, fy: 0.22, label: "Procurement",  icon: "P",  color: "#818CF8" },
      { fx: 0.25, fy: 0.78, label: "Logistics",    icon: "L",  color: "#34D399" },
      { fx: 0.50, fy: 0.50, label: "Planning",     icon: "SP", color: "#F472B6", size: 33 },
      { fx: 0.75, fy: 0.22, label: "Inventory",    icon: "I",  color: "#FBBF24" },
      { fx: 0.75, fy: 0.78, label: "Distribution", icon: "D",  color: "#F87171" },
      { fx: 0.92, fy: 0.50, label: "Delivery",     icon: "✓", color: "#38BDF8" },
    ];
    const EDGES = [[0,1],[0,2],[1,3],[2,3],[3,4],[3,5],[4,6],[5,6]];

    EDGES.forEach((_, i) => setTimeout(() => {
      particles.current.push({ edge: i, t: 0, speed: 0.005 });
    }, i * 240));
    const spawnInterval = setInterval(() => {
      particles.current.push({ edge: Math.floor(Math.random() * EDGES.length), t: 0, speed: 0.004 + Math.random() * 0.003 });
    }, 480);

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      tick.current += 0.008;
      const nx = (n) => n.fx * w;
      const ny = (n) => n.fy * h;

      EDGES.forEach(([a, b]) => {
        const na = NODES[a], nb = NODES[b];
        const g = ctx.createLinearGradient(nx(na), ny(na), nx(nb), ny(nb));
        g.addColorStop(0, na.color + "44"); g.addColorStop(1, nb.color + "44");
        ctx.beginPath(); ctx.moveTo(nx(na), ny(na));
        ctx.quadraticCurveTo((nx(na)+nx(nb))/2, (ny(na)+ny(nb))/2-18, nx(nb), ny(nb));
        ctx.strokeStyle = g; ctx.lineWidth = 1.5; ctx.stroke();
      });

      particles.current = particles.current.filter(p => p.t <= 1);
      particles.current.forEach(p => {
        p.t += p.speed; if (p.t > 1) return;
        const [a, b] = EDGES[p.edge];
        const na = NODES[a], nb = NODES[b], u = p.t;
        const mx = (nx(na)+nx(nb))/2, my = (ny(na)+ny(nb))/2-18;
        const px = (1-u)*(1-u)*nx(na)+2*(1-u)*u*mx+u*u*nx(nb);
        const py = (1-u)*(1-u)*ny(na)+2*(1-u)*u*my+u*u*ny(nb);
        const gr = ctx.createRadialGradient(px,py,0,px,py,6);
        gr.addColorStop(0, na.color+"ff"); gr.addColorStop(1, na.color+"00");
        ctx.beginPath(); ctx.arc(px,py,6,0,Math.PI*2); ctx.fillStyle=gr; ctx.fill();
      });

      NODES.forEach((n, i) => {
        const x = nx(n), y = ny(n), r = (n.size||26)+Math.sin(tick.current+i)*1.5;
        const glow = ctx.createRadialGradient(x,y,r*0.5,x,y,r*2.5);
        glow.addColorStop(0,n.color+"28"); glow.addColorStop(1,n.color+"00");
        ctx.beginPath(); ctx.arc(x,y,r*2.5,0,Math.PI*2); ctx.fillStyle=glow; ctx.fill();
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2);
        ctx.fillStyle="rgba(255,255,255,0.05)"; ctx.fill();
        ctx.strokeStyle=n.color+"88"; ctx.lineWidth=1.5; ctx.stroke();
        ctx.fillStyle=n.color; ctx.font=`700 ${n.icon.length>1?9:12}px Inter,sans-serif`;
        ctx.textAlign="center"; ctx.textBaseline="middle"; ctx.fillText(n.icon,x,y);
        ctx.fillStyle="rgba(255,255,255,0.5)"; ctx.font="500 9px Inter,sans-serif";
        ctx.textBaseline="top"; ctx.fillText(n.label,x,y+r+5);
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { clearInterval(spawnInterval); cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize); };
  }, []);

  return <canvas ref={canvasRef} style={{ width:"100%", height:"100%", display:"block" }} />;
}

// ── SKILL BAR ─────────────────────────────────────────────────────────────────
function SkillBar({ name, pct, color, delay = 0, started }) {
  const [w, setW] = useState(0);
  useEffect(() => {
    if (!started) return;
    const t = setTimeout(() => setW(pct), delay);
    return () => clearTimeout(t);
  }, [started, pct, delay]);
  return (
    <div style={{ marginBottom: "0.95rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.32rem" }}>
        <span style={{ fontSize: "0.79rem", color: "rgba(255,255,255,0.72)", fontWeight: 600 }}>{name}</span>
        <span style={{ fontSize: "0.73rem", color, fontWeight: 700 }}>{pct}%</span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: "rgba(255,255,255,0.08)" }}>
        <div style={{ height:"100%", borderRadius:999, width:`${w}%`, background:`linear-gradient(90deg,${color},${color}99)`, transition:"width 1.2s cubic-bezier(0.16,1,0.3,1)", boxShadow:`0 0 8px ${color}55` }} />
      </div>
    </div>
  );
}

// ── GLASS CARD ────────────────────────────────────────────────────────────────
function GlassCard({ children, style = {}, hover = true, accent, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.04)",
        border: `1px solid ${hov ? "rgba(255,255,255,0.17)" : "rgba(255,255,255,0.08)"}`,
        borderTop: accent ? `2px solid ${accent}` : undefined,
        backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
        borderRadius: 18,
        transition: "all 0.28s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-3px)" : "none",
        cursor: onClick ? "pointer" : "default",
        ...style,
      }}>{children}</div>
  );
}

function Label({ children }) {
  return (
    <div style={{ display:"inline-flex", alignItems:"center", gap:"0.45rem", fontSize:"0.66rem", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:"#38BDF8", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.22)", borderRadius:999, padding:"0.28rem 0.85rem", marginBottom:"0.9rem" }}>
      <span style={{ width:5, height:5, borderRadius:"50%", background:"#38BDF8", display:"inline-block", flexShrink:0 }} />
      {children}
    </div>
  );
}

// ── ICONS ─────────────────────────────────────────────────────────────────────
const LinkedInIcon = ({ size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);
const GitHubIcon = ({ size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
  </svg>
);
const MailIcon = ({ size=18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7"/>
  </svg>
);
const DownloadIcon = ({ size=16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const ExternalIcon = ({ size=14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

// ── DATA (verified against resume) ────────────────────────────────────────────
const EXPERIENCES = [
  {
    co: "ANGARAI International Inc.", role: "Supply Chain Planner & Procurement Analyst",
    period: "Jun 2025 – Present", loc: "College Park, MD", color: "#38BDF8",
    kpis: [{ v:"38%", l:"Forecast accuracy" },{ v:"28%", l:"Manual effort cut" },{ v:"35%", l:"Process efficiency" },{ v:"22%", l:"OTD improvement" }],
    points: [
      "Managed end-to-end supply chain operations across procurement, inventory planning, and supplier coordination",
      "Monitored supplier KPIs including lead times and delivery reliability, driving 22% on-time performance gain",
      "Analyzed inventory levels and demand trends in Zoho Analytics, improving forecast accuracy 38% and reducing excess and obsolete stock",
      "Standardized SAP contract and invoice workflows cutting manual effort 28%, improving supply chain process efficiency and reporting 35%",
      "Led cross-functional S&OP communications across planning, finance, and logistics, aligning supply commitments to all business needs",
    ],
  },
  {
    co: "Panda Restaurant Group", role: "Inventory & Supply Planning Associate",
    period: "Sep 2024 – Sep 2025", loc: "College Park, MD", color: "#818CF8",
    kpis: [{ v:"98%", l:"Inventory accuracy" },{ v:"22%", l:"Material waste ↓" },{ v:"18%", l:"Working capital ↑" },{ v:"15%", l:"Delivery reliability" }],
    points: [
      "Executed demand forecasting and inventory replenishment planning, maintaining optimal stock levels and days-of-supply targets across all SKUs",
      "Applied FIFO and reorder point strategies to reduce material waste 22%, improving inventory health and supply chain planning efficiency",
      "Maintained 98% inventory accuracy through standardized tracking systems, ensuring data integrity across supply chain reporting and operations",
      "Coordinated with suppliers and logistics partners to resolve inbound discrepancies, improving material flow and delivery reliability by 15%",
      "Streamlined replenishment workflows and reorder planning, boosting working capital efficiency 18% while reducing overstock and supply risk",
    ],
  },
  {
    co: "TATA Consultancy Services · Boeing", role: "Supply Chain & Sourcing Analyst",
    period: "Sep 2023 – Jul 2024", loc: "Mumbai, India", color: "#34D399",
    kpis: [{ v:"12K+", l:"POs/year" },{ v:"99.8%", l:"PO accuracy" },{ v:"21%", l:"Bottleneck reduced" },{ v:"35%", l:"Supply gaps closed" }],
    points: [
      "Supported end-to-end supply chain execution for Boeing programs spanning sourcing, procurement, logistics coordination, and supplier management",
      "Processed 12,000+ purchase orders annually at 99.8% accuracy via SAP Ariba and Oracle ERP, maintaining data integrity across supply functions",
      "Led supplier negotiations and contract lifecycle management, reducing procurement bottlenecks 21% and improving supply continuity across operations",
      "Partnered cross-functionally to resolve supply backlogs and material shortages, reducing open supply gaps 35% and improving on-time delivery",
      "Conducted supplier risk and capacity analyses, enabling proactive supply chain mitigation across program transitions and engineering changes",
    ],
  },
  {
    co: "CampusConnect Technologies · LogIQids", role: "Product & Operations Analyst",
    period: "Jun 2022 – Jun 2023", loc: "Mumbai, India", color: "#FBBF24",
    kpis: [{ v:"16%", l:"Cost reduction" },{ v:"25%", l:"Cycle time ↑" },{ v:"100+", l:"Deployments" },{ v:"7%", l:"Service level ↑" }],
    points: [
      "Managed full supply chain cycle from procurement and supplier coordination to logistics and last-mile delivery across 100+ school deployments",
      "Negotiated supplier contracts securing 16% cost reductions; implemented scorecards improving supplier visibility and performance accountability 27%",
      "Optimized production scheduling and inbound logistics, improving cycle time 25% and reducing shortages during high-demand seasonal ramp periods",
      "Analyzed 5-year demand trends across 250 SKUs in 6 countries, improving monthly service levels 7% through data-driven inventory replenishment",
      "Identified supply chain process gaps and standardized reorder workflows, improving end-to-end procurement and logistics cycle efficiency by 21%",
    ],
  },
  {
    co: "Uniworld Express Pvt. Ltd.", role: "Logistics & Supply Chain Intern",
    period: "Mar 2022 – May 2022", loc: "Mumbai, India", color: "#F472B6",
    kpis: [{ v:"97%", l:"OTD rate" },{ v:"12%", l:"Freight savings" },{ v:"19%", l:"Throughput ↑" },{ v:"14%", l:"Delivery delay ↓" }],
    points: [
      "Coordinated inbound and outbound logistics achieving 97% on-time delivery through proactive carrier and supplier scheduling and coordination",
      "Negotiated freight contracts improving logistics cost efficiency 12%; optimized warehouse utilization to increase operational throughput by 19%",
      "Built vendor scorecards tracking delivery and performance metrics, improving supplier performance visibility 18% to support corrective actions",
      "Conducted supply constraint and route analyses across freight lanes, enabling proactive rerouting that reduced average delivery delays by 14%",
    ],
  },
];

const PROJECTS = [
  {
    title: "Fastenal RFID Inventory Control", tag: "Experiential Learning", color: "#38BDF8",
    desc: "Implemented RFID-enabled inventory control and smart vending solutions to automate procurement workflows, enhance supplier visibility, and reduce manual intervention by 87.5%, achieving $102K (27%) annual cost savings while consolidating 80 suppliers to 10.",
    metrics: [{ v:"$102K", l:"Annual savings" },{ v:"87.5%", l:"Manual effort cut" },{ v:"80→10", l:"Supplier consolidation" },{ v:"27%", l:"Cost reduction" }],
    tools: ["RFID", "Procurement Automation", "Supplier Consolidation", "Cost Analysis"],
  },
  {
    title: "Consumer Purchasing Behavior Analysis", tag: "Data-Driven Decision Making", color: "#818CF8",
    desc: "Analyzed online purchasing patterns across 250 SKUs in 6 countries, identifying key demographic and discount-driven behaviors that could increase profit margins by 12%.",
    metrics: [{ v:"+12%", l:"Margin potential" },{ v:"250", l:"SKUs analyzed" },{ v:"6", l:"Countries" },{ v:"5yr", l:"Trend horizon" }],
    tools: ["Demand Analytics", "Statistical Modeling", "Excel", "Pricing Strategy"],
  },
  {
    title: "NikoTech Supply Chain Optimization", tag: "Strategic Consulting", color: "#34D399",
    desc: "Recommended Just-in-Time (JIT) strategy and supplier contract renegotiations, reducing excess inventory by 15% and improving ROI by 0.7%. Findings presented to C-suite leadership.",
    metrics: [{ v:"15%", l:"Inventory reduction" },{ v:"+0.7%", l:"ROI improvement" },{ v:"JIT", l:"Strategy deployed" },{ v:"C-suite", l:"Presented to" }],
    tools: ["JIT Strategy", "Contract Renegotiation", "Financial Modeling", "Executive Presentation"],
  },
];

const SKILLS = [
  { name: "Demand Forecasting & S&OP",        pct: 95, color: "#38BDF8" },
  { name: "Procurement & Strategic Sourcing",  pct: 92, color: "#818CF8" },
  { name: "Inventory Optimization",            pct: 93, color: "#34D399" },
  { name: "SAP S/4HANA & SAP Ariba",           pct: 88, color: "#FBBF24" },
  { name: "Logistics & Transportation",         pct: 91, color: "#F472B6" },
  { name: "Oracle ERP",                         pct: 84, color: "#38BDF8" },
  { name: "Tableau · Power BI · SQL",           pct: 87, color: "#818CF8" },
  { name: "Project Management & Process Impr.", pct: 90, color: "#34D399" },
];

const COMPETENCIES = [
  { cat: "Supply Chain & Planning",  color: "#38BDF8", tags: ["S&OP", "Demand Forecasting", "MRP", "Inventory Optimization", "Supply Planning", "Replenishment Strategy"] },
  { cat: "Procurement & Sourcing",   color: "#818CF8", tags: ["Strategic Sourcing", "Supplier Negotiation", "Contract Management", "Spend Analysis", "Supplier Risk Mgmt", "SAP Ariba"] },
  { cat: "Logistics & Operations",   color: "#34D399", tags: ["Inbound / Outbound", "Freight Negotiation", "Warehouse Optimization", "Last-Mile Delivery", "Carrier Management", "Route Analysis"] },
  { cat: "Analytics & ERP Tools",    color: "#FBBF24", tags: ["SAP S/4HANA", "Oracle ERP", "Tableau", "Power BI", "Zoho Analytics", "SQL", "Advanced Excel", "RStudio"] },
  { cat: "Project Management",       color: "#F472B6", tags: ["Cross-Functional Collaboration", "Lean Six Sigma", "KPI Reporting", "Stakeholder Management", "Process Improvement"] },
];

const CERTS = [
  { icon:"🎓", title:"MS Supply Chain Management",      sub:"University of Maryland · Robert H. Smith School of Business", detail:"GPA 3.75 · Terrapin Scholar · Dec 2025",             color:"#38BDF8", active:true  },
  { icon:"🎓", title:"B.Com Accounting & Finance",      sub:"K.J. Somaiya College · University of Mumbai",                 detail:"GPA 3.78 · April 2022",                             color:"#818CF8", active:true  },
  { icon:"🥋", title:"Lean Six Sigma Green Belt",       sub:"Process Improvement Certification",                           detail:"Awarded during MS Program at UMD",                  color:"#34D399", active:true  },
  { icon:"🏆", title:"1st Place — Case Competition",    sub:"E-livestock Global · UMD Orientation",                        detail:"Supply chain strategy presentation",                color:"#FBBF24", active:true  },
  { icon:"📋", title:"APICS / ASCM — CSCP or CPIM",    sub:"ASCM Certified Supply Chain Professional",                    detail:"Planned — In Progress",                            color:"#F472B6", active:false },
  { icon:"📋", title:"PMP — Project Mgmt Professional", sub:"Project Management Institute",                                detail:"Planned — Upcoming",                               color:"#38BDF8", active:false },
];

// ── EXPERIENCE CARD ───────────────────────────────────────────────────────────
function ExpCard({ exp, idx }) {
  const [open, setOpen] = useState(idx === 0);
  const [ref, vis] = useVisible(0.05);
  return (
    <div ref={ref} style={{ display:"flex", gap:"1.1rem", opacity:vis?1:0, transform:vis?"none":"translateX(-18px)", transition:`opacity 0.5s ease ${idx*0.07}s, transform 0.5s ease ${idx*0.07}s` }}>
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", paddingTop:"1.35rem", flexShrink:0 }}>
        <div style={{ width:11, height:11, borderRadius:"50%", background:exp.color, boxShadow:`0 0 14px ${exp.color}`, flexShrink:0 }} />
        <div style={{ width:1, flex:1, background:`linear-gradient(to bottom,${exp.color}55,transparent)`, marginTop:5, minHeight:24 }} />
      </div>
      <GlassCard style={{ flex:1, padding:"1.2rem", marginBottom:"1rem" }} onClick={() => setOpen(!open)}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:"0.6rem" }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:"0.63rem", fontWeight:700, color:exp.color, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:3 }}>{exp.period}</div>
            <div style={{ fontWeight:700, fontSize:"0.93rem", color:"#fff", marginBottom:2, lineHeight:1.3 }}>{exp.role}</div>
            <div style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.38)" }}>{exp.co} · {exp.loc}</div>
          </div>
          <span style={{ fontSize:15, color:"rgba(255,255,255,0.28)", transform:open?"rotate(180deg)":"none", transition:"transform 0.22s", flexShrink:0, marginTop:2 }}>▾</span>
        </div>
        {open && (
          <div style={{ marginTop:"1rem" }}>
            <div className="exp-kpis" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"0.45rem", marginBottom:"1rem" }}>
              {exp.kpis.map(k => (
                <div key={k.l} style={{ background:`${exp.color}11`, border:`1px solid ${exp.color}30`, borderRadius:9, padding:"0.55rem 0.3rem", textAlign:"center" }}>
                  <div style={{ fontWeight:800, fontSize:"0.95rem", color:exp.color, letterSpacing:"-0.02em" }}>{k.v}</div>
                  <div style={{ fontSize:"0.57rem", color:"rgba(255,255,255,0.38)", marginTop:2, lineHeight:1.3 }}>{k.l}</div>
                </div>
              ))}
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.48rem" }}>
              {exp.points.map((p, i) => (
                <div key={i} style={{ display:"flex", gap:"0.55rem", fontSize:"0.79rem", color:"rgba(255,255,255,0.62)", lineHeight:1.65 }}>
                  <span style={{ color:exp.color, flexShrink:0, marginTop:"0.15em", fontWeight:700 }}>→</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

// ── PROJECT CARD ──────────────────────────────────────────────────────────────
function ProjectCard({ proj, idx }) {
  const [ref, vis] = useVisible(0.05);
  return (
    <div ref={ref} style={{ opacity:vis?1:0, transform:vis?"none":"translateY(22px)", transition:`opacity 0.5s ease ${idx*0.1}s, transform 0.5s ease ${idx*0.1}s` }}>
      <GlassCard accent={proj.color} style={{ padding:"1.7rem", height:"100%", display:"flex", flexDirection:"column" }}>
        <div style={{ fontSize:"0.62rem", fontWeight:700, color:proj.color, letterSpacing:"0.15em", textTransform:"uppercase", marginBottom:"0.55rem" }}>{proj.tag}</div>
        <div style={{ fontWeight:800, fontSize:"1.02rem", color:"#fff", marginBottom:"0.65rem", lineHeight:1.3 }}>{proj.title}</div>
        <p style={{ fontSize:"0.8rem", color:"rgba(255,255,255,0.48)", lineHeight:1.72, marginBottom:"1rem", flex:1 }}>{proj.desc}</p>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.45rem", marginBottom:"1rem" }}>
          {proj.metrics.map(m => (
            <div key={m.l} style={{ background:"rgba(255,255,255,0.04)", borderRadius:9, padding:"0.6rem 0.65rem" }}>
              <div style={{ fontWeight:800, fontSize:"1rem", color:proj.color }}>{m.v}</div>
              <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.32)", marginTop:1 }}>{m.l}</div>
            </div>
          ))}
        </div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:"0.32rem" }}>
          {proj.tools.map(t => (
            <span key={t} style={{ fontSize:"0.65rem", fontWeight:600, padding:"0.18rem 0.52rem", borderRadius:999, background:`${proj.color}16`, color:proj.color, border:`1px solid ${proj.color}30` }}>{t}</span>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

// ── GITHUB SECTION ────────────────────────────────────────────────────────────
function GitHubSection() {
  const [ref, vis] = useVisible(0.1);
  const repos = [
    { name:"supply-chain-analytics",    desc:"Demand forecasting & inventory optimization models using Python and Excel", lang:"Python",   color:"#38BDF8" },
    { name:"procurement-dashboard",      desc:"Power BI procurement spend analysis and supplier KPI reporting templates",  lang:"Power BI", color:"#818CF8" },
    { name:"inventory-eoq-calculator",   desc:"EOQ, safety stock, and reorder point calculator with sensitivity analysis",  lang:"Excel",    color:"#34D399" },
  ];
  return (
    <section id="github" ref={ref} style={{ background:"rgba(255,255,255,0.014)", borderTop:"1px solid rgba(255,255,255,0.05)", padding:"6rem 0" }}>
      <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem", opacity:vis?1:0, transform:vis?"none":"translateY(20px)", transition:"all 0.5s ease" }}>
          <Label>GitHub</Label>
          <h2 style={{ fontSize:"clamp(1.65rem,3vw,2.2rem)", fontWeight:800, letterSpacing:"-0.04em", marginBottom:"0.55rem" }}>Open Source & Analytics Projects</h2>
          <p style={{ color:"rgba(255,255,255,0.33)", fontSize:"0.83rem", maxWidth:520, margin:"0 auto" }}>
            Supply chain analytics tools, dashboards, and case study materials shared on GitHub.
          </p>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.1rem", marginBottom:"2rem" }}>
          {repos.map((r, i) => (
            <a key={r.name} href={`${GITHUB}/${r.name}`} target="_blank" rel="noreferrer"
              style={{ textDecoration:"none", opacity:vis?1:0, transform:vis?"none":"translateY(16px)", transition:`all 0.5s ease ${0.1+i*0.08}s`, display:"block" }}>
              <GlassCard style={{ padding:"1.3rem", height:"100%" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.6rem" }}>
                  <span style={{ color:r.color }}><GitHubIcon size={18} /></span>
                  <ExternalIcon size={13} />
                </div>
                <div style={{ fontWeight:700, fontSize:"0.86rem", color:"#fff", marginBottom:"0.38rem", fontFamily:"monospace" }}>{r.name}</div>
                <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.4)", lineHeight:1.62, marginBottom:"0.85rem" }}>{r.desc}</div>
                <div style={{ display:"flex", alignItems:"center", gap:"0.38rem" }}>
                  <span style={{ width:8, height:8, borderRadius:"50%", background:r.color, display:"inline-block" }} />
                  <span style={{ fontSize:"0.67rem", color:"rgba(255,255,255,0.36)", fontWeight:600 }}>{r.lang}</span>
                </div>
              </GlassCard>
            </a>
          ))}
        </div>
        <div style={{ textAlign:"center", opacity:vis?1:0, transition:"opacity 0.5s ease 0.4s" }}>
          <a href={GITHUB} target="_blank" rel="noreferrer"
            style={{ display:"inline-flex", alignItems:"center", gap:"0.6rem", background:"rgba(255,255,255,0.055)", border:"1px solid rgba(255,255,255,0.13)", color:"rgba(255,255,255,0.72)", fontWeight:700, fontSize:"0.83rem", padding:"0.73rem 1.55rem", borderRadius:999, transition:"all 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background="rgba(255,255,255,0.09)"; e.currentTarget.style.color="#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background="rgba(255,255,255,0.055)"; e.currentTarget.style.color="rgba(255,255,255,0.72)"; }}
          >
            <GitHubIcon size={16} /> View All Repositories on GitHub
          </a>
        </div>
      </div>
    </section>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [navSolid, setNavSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [kpiRef,   kpiVis]      = useVisible(0.2);
  const [skillRef, skillVis]    = useVisible(0.1);

  useEffect(() => {
    const onScroll = () => setNavSolid(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 900) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const scrollTo = (id) => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMenuOpen(false); };

  const NAV = [
    { id:"about",      label:"About"      },
    { id:"experience", label:"Experience" },
    { id:"skills",     label:"Skills"     },
    { id:"projects",   label:"Projects"   },
    { id:"github",     label:"GitHub"     },
    { id:"contact",    label:"Contact"    },
  ];

  const btnBase = { display:"inline-flex", alignItems:"center", justifyContent:"center", gap:"0.6rem", fontWeight:700, padding:"1rem 1.8rem", borderRadius:12, fontSize:"0.88rem", transition:"all 0.18s", textDecoration:"none" };

  return (
    <div style={{ fontFamily:"'Inter',system-ui,sans-serif", background:"#050B18", color:"#fff", minHeight:"100vh", overflowX:"hidden" }}>
      <style>{`
        @keyframes fadeUp    { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:none} }
        @keyframes pulseRing { 0%{opacity:.7;transform:scale(1)} 100%{opacity:0;transform:scale(2.4)} }
        .fade-in   { animation: fadeUp .75s ease forwards; }
        .fade-in-d { animation: fadeUp .75s ease .18s forwards; opacity:0; }
        section { scroll-margin-top: 66px; }
        a { text-decoration:none; color:inherit; }
        .nav-links { display:flex; }
        .mob-btn   { display:none !important; }

        @media (max-width:900px){
          .hero-grid,.about-grid,.skills-grid { grid-template-columns:1fr !important; }
          .nav-links { display:none !important; }
          .mob-btn   { display:flex !important; }
          .exp-kpis  { grid-template-columns:repeat(2,1fr) !important; }
        }
        @media (max-width:600px){
          .kpi-grid      { grid-template-columns:repeat(3,1fr) !important; }
          .kpi-hide-sm   { display:none !important; }
          .hero-btns     { flex-direction:column !important; }
          .hero-btns > * { width:100% !important; }
        }
        @media (max-width:420px){
          .kpi-grid    { grid-template-columns:repeat(2,1fr) !important; }
          .kpi-hide-xs { display:none !important; }
        }
        a:focus-visible,button:focus-visible { outline:2px solid #38BDF8; outline-offset:3px; border-radius:4px; }
      `}</style>

      {/* AMBIENT */}
      <div aria-hidden="true" style={{ position:"fixed", inset:0, pointerEvents:"none", zIndex:0, overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"-20%", left:"-10%", width:"60vw", height:"60vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(56,189,248,0.055) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", bottom:"-20%", right:"-10%", width:"50vw", height:"50vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(129,140,248,0.055) 0%,transparent 70%)" }} />
        <div style={{ position:"absolute", top:"44%", left:"34%", width:"40vw", height:"40vw", borderRadius:"50%", background:"radial-gradient(circle,rgba(52,211,153,0.035) 0%,transparent 70%)" }} />
      </div>

      {/* NAV */}
      <nav role="navigation" aria-label="Main navigation" style={{ position:"fixed", top:0, left:0, right:0, zIndex:1000, padding:"0 2rem", height:66, display:"flex", alignItems:"center", justifyContent:"space-between", background:navSolid?"rgba(5,11,24,0.92)":"transparent", backdropFilter:navSolid?"blur(24px)":"none", WebkitBackdropFilter:navSolid?"blur(24px)":"none", borderBottom:navSolid?"1px solid rgba(255,255,255,0.06)":"1px solid transparent", transition:"all 0.35s" }}>
        <button onClick={() => scrollTo("hero")} aria-label="Back to top" style={{ background:"none", border:"none", cursor:"pointer", fontWeight:900, fontSize:"1.08rem", letterSpacing:"-0.04em", padding:0, fontFamily:"inherit" }}>
          <span style={{ color:"#38BDF8" }}>D</span><span style={{ color:"rgba(255,255,255,0.9)" }}>R</span>
          <span style={{ color:"rgba(255,255,255,0.2)", marginLeft:6, fontSize:"0.63rem", fontWeight:400, letterSpacing:"0.1em" }}>SUPPLY CHAIN</span>
        </button>
        <div className="nav-links" style={{ gap:"0.15rem", alignItems:"center" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.76rem", fontWeight:600, color:"rgba(255,255,255,0.42)", padding:"0.38rem 0.85rem", borderRadius:999, transition:"color 0.18s,background 0.18s", letterSpacing:"0.02em", fontFamily:"inherit" }}
              onMouseEnter={e => { e.currentTarget.style.color="#fff"; e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
              onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,0.42)"; e.currentTarget.style.background="none"; }}
            >{n.label}</button>
          ))}
          <a href={`mailto:${EMAIL}`} style={{ marginLeft:"0.4rem", background:"linear-gradient(135deg,#38BDF8,#818CF8)", color:"#050B18", fontWeight:700, fontSize:"0.76rem", padding:"0.42rem 1rem", borderRadius:999, display:"inline-block", transition:"opacity 0.18s" }}
            onMouseEnter={e => e.currentTarget.style.opacity="0.85"}
            onMouseLeave={e => e.currentTarget.style.opacity="1"}
          >Hire Me</a>
        </div>
        <button className="mob-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen?"Close menu":"Open menu"} aria-expanded={menuOpen} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.11)", borderRadius:8, padding:"0.48rem 0.75rem", cursor:"pointer", color:"#fff", fontSize:"1.05rem", alignItems:"center", lineHeight:1, fontFamily:"inherit" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div role="menu" style={{ position:"fixed", top:66, left:0, right:0, zIndex:999, background:"rgba(5,11,24,0.97)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"0.8rem 1.5rem 1.2rem", display:"flex", flexDirection:"column", gap:"0.2rem" }}>
          {NAV.map(n => (
            <button key={n.id} role="menuitem" onClick={() => scrollTo(n.id)} style={{ background:"none", border:"none", borderBottom:"1px solid rgba(255,255,255,0.055)", cursor:"pointer", textAlign:"left", fontSize:"0.93rem", fontWeight:600, color:"rgba(255,255,255,0.72)", padding:"0.65rem 0", fontFamily:"inherit" }}>{n.label}</button>
          ))}
          <div style={{ display:"flex", gap:"0.6rem", marginTop:"0.6rem" }}>
            <a href={`mailto:${EMAIL}`} style={{ flex:1, display:"block", textAlign:"center", background:"linear-gradient(135deg,#38BDF8,#818CF8)", color:"#050B18", fontWeight:700, fontSize:"0.86rem", padding:"0.75rem", borderRadius:10 }}>Contact Me</a>
            <a href={RESUME} download style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:"0.4rem", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.25)", color:"#38BDF8", fontWeight:700, fontSize:"0.86rem", padding:"0.75rem 1rem", borderRadius:10 }}>
              <DownloadIcon size={14} /> Resume
            </a>
          </div>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="hero" style={{ minHeight:"100vh", display:"flex", alignItems:"center", position:"relative", padding:"0 2rem", overflow:"hidden" }}>
        <div className="hero-grid" style={{ maxWidth:1100, margin:"0 auto", width:"100%", display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:"3rem", alignItems:"center", paddingTop:66 }}>

          {/* Left text */}
          <div className="fade-in">
            <div style={{ display:"inline-flex", alignItems:"center", gap:"0.48rem", fontSize:"0.66rem", fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", color:"#38BDF8", background:"rgba(56,189,248,0.1)", border:"1px solid rgba(56,189,248,0.22)", borderRadius:999, padding:"0.3rem 0.85rem", marginBottom:"1.35rem" }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:"#38BDF8", display:"inline-block", animation:"pulseRing 1.6s ease-out infinite" }} />
              Available for New Opportunities
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:"1.1rem", marginBottom:"1.35rem" }}>
              <img src={HEADSHOT} alt={`${NAME} — professional headshot`} width={72} height={72} style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover", objectPosition:"center top", border:"2px solid rgba(56,189,248,0.48)", flexShrink:0 }} />
              <div>
                <div style={{ fontWeight:800, fontSize:"1.08rem", color:"#fff", lineHeight:1.2 }}>{NAME}</div>
                <div style={{ fontSize:"0.76rem", color:"rgba(255,255,255,0.38)", marginTop:2 }}>{TITLE}</div>
              </div>
            </div>

            <h1 style={{ fontSize:"clamp(1.9rem,4.5vw,3.5rem)", fontWeight:900, lineHeight:1.06, letterSpacing:"-0.04em", marginBottom:"1.15rem" }}>
              <span style={{ color:"#fff" }}>Optimizing</span><br />
              <span style={{ background:"linear-gradient(135deg,#38BDF8 0%,#818CF8 50%,#34D399 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Supply Chains</span><br />
              <span style={{ color:"rgba(255,255,255,0.83)" }}>Through Data &</span><br />
              <span style={{ color:"rgba(255,255,255,0.83)" }}>Strategy</span>
            </h1>

            <p style={{ fontSize:"0.92rem", color:"rgba(255,255,255,0.48)", lineHeight:1.82, marginBottom:"1.8rem", maxWidth:480 }}>
              Supply chain professional with 3+ years of end-to-end experience in procurement, demand planning, inventory management, and logistics across the US and India. MS Supply Chain Management, University of Maryland (GPA&nbsp;3.75).
            </p>

            <div className="hero-btns" style={{ display:"flex", gap:"0.7rem", flexWrap:"wrap", marginBottom:"1.35rem" }}>
              <a href={`mailto:${EMAIL}`} style={{ ...btnBase, background:"linear-gradient(135deg,#38BDF8,#818CF8)", color:"#050B18", fontWeight:800, padding:"0.78rem 1.55rem", borderRadius:999, boxShadow:"0 4px 22px rgba(56,189,248,0.28)" }}
                onMouseEnter={e => { e.currentTarget.style.transform="scale(1.03)"; e.currentTarget.style.boxShadow="0 8px 30px rgba(56,189,248,0.44)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform="none"; e.currentTarget.style.boxShadow="0 4px 22px rgba(56,189,248,0.28)"; }}
              ><MailIcon size={15} /> Contact Me</a>
              <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ ...btnBase, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.13)", color:"rgba(255,255,255,0.83)", padding:"0.78rem 1.25rem", borderRadius:999 }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}
              ><LinkedInIcon size={15} /> LinkedIn</a>
              <a href={GITHUB} target="_blank" rel="noreferrer" style={{ ...btnBase, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.13)", color:"rgba(255,255,255,0.83)", padding:"0.78rem 1.25rem", borderRadius:999 }}
                onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.06)"}
              ><GitHubIcon size={15} /> GitHub</a>
            </div>

            <a href={RESUME} download="Dnyanesh_Rane_Resume.pdf" style={{ display:"inline-flex", alignItems:"center", gap:"0.45rem", fontSize:"0.76rem", fontWeight:700, color:"#38BDF8", background:"rgba(56,189,248,0.08)", border:"1px solid rgba(56,189,248,0.22)", padding:"0.48rem 0.95rem", borderRadius:999, marginBottom:"1.35rem", transition:"background 0.18s" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(56,189,248,0.14)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(56,189,248,0.08)"}
            ><DownloadIcon size={13} /> Download Resume (PDF)</a>

            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.45rem" }}>
              {["SAP S/4HANA","Oracle ERP","SAP Ariba","Tableau","Power BI","SQL","RStudio"].map(t => (
                <span key={t} style={{ fontSize:"0.67rem", fontWeight:600, color:"rgba(255,255,255,0.3)", padding:"0.19rem 0.58rem", background:"rgba(255,255,255,0.04)", borderRadius:999, border:"1px solid rgba(255,255,255,0.07)" }}>{t}</span>
              ))}
            </div>
          </div>

          {/* Right — visualization */}
          <div className="fade-in-d">
            <GlassCard style={{ padding:"1.3rem", overflow:"hidden" }} hover={false}>
              <div style={{ fontSize:"0.63rem", fontWeight:700, color:"rgba(255,255,255,0.26)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"0.65rem" }}>
                Supply Chain Network — Live Animation
              </div>
              <div style={{ height:255, position:"relative" }}><SupplyChainViz /></div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:"0.85rem", paddingTop:"0.85rem", borderTop:"1px solid rgba(255,255,255,0.055)" }}>
                {[{ v:"3+", l:"Years" },{ v:"2", l:"Countries" },{ v:"5", l:"Industries" },{ v:"12K+", l:"POs / yr" }].map(m => (
                  <div key={m.l} style={{ textAlign:"center" }}>
                    <div style={{ fontWeight:800, fontSize:"0.98rem", color:"#38BDF8" }}>{m.v}</div>
                    <div style={{ fontSize:"0.58rem", color:"rgba(255,255,255,0.27)", marginTop:2 }}>{m.l}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        
      </section>

      {/* ── KPI STRIP ── */}
      <div ref={kpiRef} role="region" aria-label="Key career metrics" style={{ background:"rgba(255,255,255,0.025)", borderTop:"1px solid rgba(255,255,255,0.055)", borderBottom:"1px solid rgba(255,255,255,0.055)", backdropFilter:"blur(20px)" }}>
        <div className="kpi-grid" style={{ maxWidth:1100, margin:"0 auto", padding:"0 2rem", display:"grid", gridTemplateColumns:"repeat(5,1fr)", borderLeft:"1px solid rgba(255,255,255,0.035)" }}>
          {[
            { prefix:"",  value:"38",    suffix:"%", label:"Forecast accuracy gain",  color:"#38BDF8", hide:"" },
            { prefix:"",  value:"99.8",  suffix:"%", label:"Purchase order accuracy", color:"#818CF8", hide:"" },
            { prefix:"$", value:"102",   suffix:"K", label:"Annual cost savings",     color:"#34D399", hide:"" },
            { prefix:"",  value:"12000", suffix:"+", label:"POs processed per year",  color:"#FBBF24", hide:"kpi-hide-sm" },
            { prefix:"",  value:"98",    suffix:"%", label:"Inventory accuracy",      color:"#F472B6", hide:"kpi-hide-xs" },
          ].map((k, i) => (
            <div key={i} className={k.hide} style={{ borderRight:"1px solid rgba(255,255,255,0.035)" }}>
              <AnimatedKPI {...k} started={kpiVis} />
            </div>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section id="about" style={{ maxWidth:1100, margin:"0 auto", padding:"6rem 2rem" }}>
        <div className="about-grid" style={{ display:"grid", gridTemplateColumns:"1fr 1.4fr", gap:"4rem", alignItems:"center" }}>
          <div>
            <Label>About Me</Label>
            <h2 style={{ fontSize:"clamp(1.65rem,3vw,2.15rem)", fontWeight:800, letterSpacing:"-0.04em", lineHeight:1.1, marginBottom:"1.25rem" }}>
              Where Operational <span style={{ color:"#38BDF8" }}>Precision</span> Meets Strategic Vision
            </h2>
            <p style={{ color:"rgba(255,255,255,0.48)", fontSize:"0.87rem", lineHeight:1.88, marginBottom:"0.85rem" }}>
              I'm {NAME} — a supply chain professional with a Master of Science in Supply Chain Management from the University of Maryland's Robert H. Smith School of Business (GPA&nbsp;3.75). Recognized as a Terrapin Scholar and certified Lean Six Sigma Green Belt.
            </p>
            <p style={{ color:"rgba(255,255,255,0.48)", fontSize:"0.87rem", lineHeight:1.88, marginBottom:"1.7rem" }}>
              My career spans two continents — supporting Boeing's global supply chain programs at TATA Consultancy Services in Mumbai, to driving inventory planning and procurement operations across the United States. I thrive at the intersection of data-driven forecasting, cross-functional S&OP execution, and continuous process improvement.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"0.62rem" }}>
              {[
                ["🎓", "MS Supply Chain Management · University of Maryland (GPA 3.75)"],
                ["📍", `${LOCATION} · Open to relocation nationwide`],
                ["🏆", "Lean Six Sigma Green Belt · Terrapin Scholar · 1st Place Case Competition"],
                ["🌎", "3+ years experience across USA & India"],
                ["📞", `${PHONE} · ${EMAIL}`],
              ].map(([icon, text]) => (
                <div key={text} style={{ display:"flex", gap:"0.7rem", alignItems:"flex-start", fontSize:"0.81rem", color:"rgba(255,255,255,0.52)" }}>
                  <span style={{ flexShrink:0, lineHeight:1.5 }}>{icon}</span><span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"0.85rem" }}>
            <div style={{ gridColumn:"1 / -1" }}>
              <GlassCard style={{ padding:"1.15rem", display:"flex", alignItems:"center", gap:"1.1rem" }} hover={false}>
                <img src={HEADSHOT} alt={NAME} width={78} height={78} style={{ width:78, height:78, borderRadius:"50%", objectFit:"cover", objectPosition:"center top", border:"2px solid rgba(56,189,248,0.38)", flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:800, fontSize:"0.98rem", color:"#fff" }}>{NAME}</div>
                  <div style={{ fontSize:"0.74rem", color:"rgba(255,255,255,0.38)", marginTop:2, marginBottom:8 }}>{TITLE} · {LOCATION}</div>
                  <div style={{ display:"flex", gap:"0.42rem", flexWrap:"wrap" }}>
                    {[
                      { href:`mailto:${EMAIL}`, label:"Email", color:"#38BDF8", icon:<MailIcon size={11}/> },
                      { href:LINKEDIN, label:"LinkedIn", color:"#818CF8", icon:<LinkedInIcon size={11}/> },
                      { href:GITHUB, label:"GitHub", color:"rgba(255,255,255,0.52)", icon:<GitHubIcon size={11}/> },
                      { href:RESUME, label:"Resume", color:"#34D399", icon:<DownloadIcon size={11}/>, download:true },
                    ].map(b => (
                      <a key={b.label} href={b.href} {...(b.href.startsWith("http")&&{target:"_blank",rel:"noreferrer"})} {...(b.download&&{download:"Dnyanesh_Rane_Resume.pdf"})}
                        style={{ display:"inline-flex", alignItems:"center", gap:"0.3rem", fontSize:"0.67rem", fontWeight:700, color:b.color, background:`${b.color}18`, border:`1px solid ${b.color}30`, padding:"0.22rem 0.55rem", borderRadius:999 }}>
                        {b.icon} {b.label}
                      </a>
                    ))}
                  </div>
                </div>
              </GlassCard>
            </div>
            {[
              { icon:"📦", title:"Inventory & Planning",  desc:"EOQ, safety stock, FIFO, reorder point — 98%+ accuracy" },
              { icon:"💰", title:"Procurement",           desc:"SAP Ariba, strategic sourcing, 16–22% cost reductions"  },
              { icon:"🚚", title:"Logistics",             desc:"Inbound/outbound, freight negotiation, 97% OTD"         },
              { icon:"📊", title:"Analytics & ERP",       desc:"SAP S/4HANA, Oracle, Tableau, Power BI, SQL, RStudio"  },
              { icon:"🔄", title:"S&OP Execution",        desc:"Cross-functional alignment across finance, supply & ops" },
              { icon:"⚙️", title:"Process Improvement",   desc:"Lean Six Sigma — 28% manual effort reduction"          },
            ].map(({ icon, title, desc }) => (
              <GlassCard key={title} style={{ padding:"1.05rem" }}>
                <div style={{ fontSize:"1.25rem", marginBottom:"0.45rem" }}>{icon}</div>
                <div style={{ fontWeight:700, fontSize:"0.81rem", color:"#fff", marginBottom:"0.28rem" }}>{title}</div>
                <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.37)", lineHeight:1.62 }}>{desc}</div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ background:"rgba(255,255,255,0.014)", borderTop:"1px solid rgba(255,255,255,0.05)", borderBottom:"1px solid rgba(255,255,255,0.05)", padding:"6rem 0" }}>
        <div style={{ maxWidth:900, margin:"0 auto", padding:"0 2rem" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <Label>Professional Journey</Label>
            <h2 style={{ fontSize:"clamp(1.65rem,3vw,2.2rem)", fontWeight:800, letterSpacing:"-0.04em" }}>5 Roles · 2 Countries · 1 Mission</h2>
            <p style={{ color:"rgba(255,255,255,0.32)", marginTop:"0.55rem", fontSize:"0.81rem" }}>Click any role to expand KPIs and key achievements</p>
          </div>
          {EXPERIENCES.map((exp, i) => <ExpCard key={exp.co} exp={exp} idx={i} />)}
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ maxWidth:1100, margin:"0 auto", padding:"6rem 2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <Label>Expertise</Label>
          <h2 style={{ fontSize:"clamp(1.65rem,3vw,2.2rem)", fontWeight:800, letterSpacing:"-0.04em" }}>Skills & Toolset</h2>
        </div>
        <div className="skills-grid" ref={skillRef} style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"3rem", alignItems:"start" }}>
          <div>
            <div style={{ fontSize:"0.68rem", fontWeight:700, color:"rgba(255,255,255,0.26)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1.25rem" }}>Proficiency Levels</div>
            {SKILLS.map((s, i) => <SkillBar key={s.name} {...s} delay={i*75} started={skillVis} />)}
          </div>
          <div>
            <div style={{ fontSize:"0.68rem", fontWeight:700, color:"rgba(255,255,255,0.26)", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1.25rem" }}>Core Competencies</div>
            {COMPETENCIES.map(({ cat, tags, color }) => (
              <div key={cat} style={{ marginBottom:"1.15rem" }}>
                <div style={{ fontSize:"0.74rem", fontWeight:700, color, marginBottom:"0.45rem" }}>{cat}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.32rem" }}>
                  {tags.map(t => (
                    <span key={t} style={{ fontSize:"0.66rem", fontWeight:600, padding:"0.2rem 0.55rem", borderRadius:999, background:`${color}13`, color, border:`1px solid ${color}28` }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" style={{ background:"rgba(255,255,255,0.014)", borderTop:"1px solid rgba(255,255,255,0.05)", padding:"6rem 0" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding:"0 2rem" }}>
          <div style={{ textAlign:"center", marginBottom:"3rem" }}>
            <Label>Featured Work</Label>
            <h2 style={{ fontSize:"clamp(1.65rem,3vw,2.2rem)", fontWeight:800, letterSpacing:"-0.04em" }}>Projects & Case Studies</h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:"1.25rem" }}>
            {PROJECTS.map((p, i) => <ProjectCard key={p.title} proj={p} idx={i} />)}
          </div>
        </div>
      </section>

      {/* ── GITHUB ── */}
      <GitHubSection />

      {/* ── CERTIFICATIONS ── */}
      <section id="credentials" style={{ maxWidth:1100, margin:"0 auto", padding:"6rem 2rem" }}>
        <div style={{ textAlign:"center", marginBottom:"3rem" }}>
          <Label>Credentials</Label>
          <h2 style={{ fontSize:"clamp(1.65rem,3vw,2.2rem)", fontWeight:800, letterSpacing:"-0.04em" }}>Education & Certifications</h2>
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(235px,1fr))", gap:"0.95rem" }}>
          {CERTS.map(c => (
            <GlassCard key={c.title} style={{ padding:"1.35rem", opacity:c.active?1:0.48, borderTop:`2px solid ${c.active?c.color:"rgba(255,255,255,0.055)"}` }}>
              <div style={{ fontSize:"1.45rem", marginBottom:"0.65rem" }}>{c.icon}</div>
              <div style={{ fontWeight:700, fontSize:"0.86rem", color:"#fff", marginBottom:"0.28rem", lineHeight:1.3 }}>{c.title}</div>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.37)", marginBottom:"0.48rem", lineHeight:1.5 }}>{c.sub}</div>
              <div style={{ fontSize:"0.67rem", fontWeight:700, color:c.color }}>{c.detail}</div>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background:"linear-gradient(to bottom,rgba(56,189,248,0.035),rgba(129,140,248,0.035))", borderTop:"1px solid rgba(255,255,255,0.055)", padding:"7rem 2rem" }}>
        <div style={{ maxWidth:620, margin:"0 auto", textAlign:"center" }}>
          <Label>Let's Connect</Label>
          <h2 style={{ fontSize:"clamp(1.85rem,4vw,2.75rem)", fontWeight:900, letterSpacing:"-0.05em", lineHeight:1.08, marginBottom:"0.95rem" }}>
            Ready to Optimize<br />
            <span style={{ background:"linear-gradient(135deg,#38BDF8,#818CF8,#34D399)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Your Supply Chain?</span>
          </h2>
          <p style={{ color:"rgba(255,255,255,0.38)", fontSize:"0.88rem", lineHeight:1.82, marginBottom:"2.4rem" }}>
            I'm actively seeking roles in supply chain management, procurement, inventory management, and operations at companies such as Amazon, Tesla, Boeing, Microsoft, Lockheed Martin, and leading consulting firms.
          </p>
          <div style={{ display:"flex", flexDirection:"column", gap:"0.8rem", maxWidth:420, margin:"0 auto 1.6rem" }}>
            <a href={`mailto:${EMAIL}`} style={{ ...btnBase, background:"linear-gradient(135deg,#38BDF8,#818CF8)", color:"#050B18", fontWeight:800, boxShadow:"0 4px 28px rgba(56,189,248,0.22)" }}
              onMouseEnter={e => e.currentTarget.style.boxShadow="0 8px 36px rgba(56,189,248,0.42)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow="0 4px 28px rgba(56,189,248,0.22)"}
            ><MailIcon size={16} /> {EMAIL}</a>
            <a href={LINKEDIN} target="_blank" rel="noreferrer" style={{ ...btnBase, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.11)", color:"rgba(255,255,255,0.77)" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
            ><LinkedInIcon size={16} /> linkedin.com/in/dnyaneshrane191281</a>
            <a href={GITHUB} target="_blank" rel="noreferrer" style={{ ...btnBase, background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.11)", color:"rgba(255,255,255,0.77)" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.08)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.04)"}
            ><GitHubIcon size={16} /> github.com/dnyaneshrane191281</a>
            <a href={RESUME} download="Dnyanesh_Rane_Resume.pdf" style={{ ...btnBase, background:"rgba(56,189,248,0.07)", border:"1px solid rgba(56,189,248,0.22)", color:"#38BDF8" }}
              onMouseEnter={e => e.currentTarget.style.background="rgba(56,189,248,0.13)"}
              onMouseLeave={e => e.currentTarget.style.background="rgba(56,189,248,0.07)"}
            ><DownloadIcon size={16} /> Download Resume (PDF)</a>
          </div>
          <div style={{ fontSize:"0.76rem", color:"rgba(255,255,255,0.2)", lineHeight:1.7 }}>
            📍 {LOCATION} &nbsp;·&nbsp; {PHONE} &nbsp;·&nbsp; Open to relocation
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:"1px solid rgba(255,255,255,0.055)", padding:"1.5rem 2rem", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:"0.6rem" }}>
        <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.18)" }}>
          © {YEAR} {NAME} &nbsp;·&nbsp; Supply Chain &amp; Operations Professional
        </div>
        <div style={{ display:"flex", gap:"0.8rem", alignItems:"center", flexWrap:"wrap" }}>
          {NAV.map(n => (
            <button key={n.id} onClick={() => scrollTo(n.id)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:"0.69rem", color:"rgba(255,255,255,0.2)", transition:"color 0.18s", fontFamily:"inherit" }}
              onMouseEnter={e => e.currentTarget.style.color="rgba(255,255,255,0.65)"}
              onMouseLeave={e => e.currentTarget.style.color="rgba(255,255,255,0.2)"}
            >{n.label}</button>
          ))}
          <a href={`mailto:${EMAIL}`} style={{ color:"#38BDF8", fontSize:"0.69rem", fontWeight:600 }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
