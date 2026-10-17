/* ============ EDIT THIS PART ============ */
// 10 memories = 10 full sections. Put pictures in: images/1.jpg ... images/10.jpg
// Click a date or text on the page to change it (saved in your browser).
const MEMORIES = [
    { date: "2023-06-14", text: "Graduation Day, and first kiss 😍😍" },
    { date: "2023-10-18", text: "Tambay sa kubo nung wala pa nakatira na mga onggads😘😘" },
    { date: "2023-12-3", text: "Mini date sa MC first kain namin ni baby sa mcdo together😋😋" },
    { date: "2025-09-9", text: "Mini date sa phase 1 lakad lakad painggit ka pa mais hays😤😤" },
    { date: "2025-10-31", text: "Tambay date sa park ng MC after tambay eat sa jollibee with my baby😇😇" },
    { date: "2024-7-16", text: "Museum date with my baby hehe🤩🤩" },
    { date: "2025-02-14", text: "BABY KONG BADTRIP HAJAJAJAJAJA🤣🤣" },
    { date: "2025-05-4", text: "First time ma try, sakit sa likod imbis umokay pakiramdam lumala pa😓😓" },
    { date: "2025-08-16", text: "Tamang simba ang mga makasalanan😍😇" },
    { date: "2025-05-12", text: "My birthday date sa SMGC with my baby cutie na pretty🥰🥰" }
];
const EXT = "jpg";
const PROJECTS = [
    { name: "Project One", desc: "Valendate.", url: "https://valen-three-eta.vercel.app" /* , thumb: "thumb1.jpg" */ },
    {
        name: "Project Two",
        desc: "Birthday ni baby nung 2025.",
        url: "https://song-drab.vercel.app" /* , thumb: "thumb2.jpg" */
    }
];
/* ========================================= */

const $ = s => document.querySelector(s);
const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d } catch (e) { return d } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true } catch (e) { return false } }
};

/* ---- Gate: password ---- */
const PASSWORD = "cheuve1216";

function unlock() {
    $("#gate").classList.add("hide");
    document.body.classList.remove("locked");
    store.set("unlocked", true);
}

function check() {
    if ($("#pw").value.trim() === PASSWORD) unlock();
    else $("#msg").textContent = "Wrong password";
}
$("#go").onclick = check;
$("#pw").addEventListener("keydown", e => e.key === "Enter" && check());

if (store.get("unlocked") === true) { // already unlocked before
    $("#gate").style.display = "none";
    document.body.classList.remove("locked");
}

/* ---- Memories: one picture per full section ---- */
const dates = store.get("dates", {}),
    uploads = store.get("uploads", {}),
    texts = store.get("texts", {});
const fmt = d => new Date(d).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

MEMORIES.forEach((m, i) => {
    const n = i + 1,
        key = "m" + n;
    const sec = document.createElement("section");
    sec.className = "chap";
    sec.innerHTML = `<div class="photo"><div class="img"><div class="ph">Photo ${n}<br><small>images/${n}.${EXT}</small></div></div></div>
  <div class="story"><div class="num">MEMORY ${n} / ${MEMORIES.length}</div>
  <div class="date" title="">${dates[key]||fmt(m.date)}</div>
  <div class="text" title="">${texts[key]||m.text}</div><div class="edit"></div></div>`;
    const box = sec.querySelector(".img"),
        ph = sec.querySelector(".ph");
    const img = new Image();
    img.onload = () => {
        ph.remove();
        box.appendChild(img)
    };
    img.src = uploads[key] || `images/${n}.${EXT}`;
    const edit = (el, obj, name, msg) => el.onclick = () => {
        const v = prompt(msg, el.textContent);
        if (v) {
            el.textContent = v;
            obj[key] = v;
            store.set(name, obj)
        }
    };
    edit(sec.querySelector(".date"), dates, "dates", "Date for this picture:");
    edit(sec.querySelector(".text"), texts, "texts", "Text for this picture:");
    $("#chapters").appendChild(sec);
});

/* ---- Reveal on scroll ---- */
function observe() {
    const io = new IntersectionObserver(es => es.forEach(e => {
        e.target.classList.toggle("show", e.isIntersecting)
    }), { threshold: .2 });
    document.querySelectorAll(".chap").forEach(p => io.observe(p));
}
observe();

/* ---- Couple background: hugging in section 1, walking from section 2 to the bottom ---- */
const hug = $("#hug"),
    walk = $("#walk");
/* Life stages by scroll: student -> young -> grown-up -> old */
const ST = [0, .34, .67, 1];
const PAL = [
    { hb1: "#8a5230", hb2: "#2b150a", hg1: "#b8672f", hg2: "#4a2412", bt1: "#ffffff", bt2: "#d4d8ea", bp1: "#3d4d86", bp2: "#1d2750", gd1: "#5b6fb0", gd2: "#27326a", bsl: "#e6e9f5", gsl: "#34457a" },
    { hb1: "#8a5230", hb2: "#2b150a", hg1: "#b8672f", hg2: "#4a2412", bt1: "#f0a95a", bt2: "#9a5420", bp1: "#6a4129", bp2: "#341c10", gd1: "#ffd0dc", gd2: "#d86787", bsl: "#c47a2b", gsl: "#ffc0d0" },
    { hb1: "#6e5a4c", hb2: "#2f2620", hg1: "#9a7a60", hg2: "#4a3a30", bt1: "#8a7a6e", bt2: "#3b322c", bp1: "#55555e", bp2: "#25252b", gd1: "#b95f82", gd2: "#6b2a45", bsl: "#5a4d45", gsl: "#8a3a5c" },
    { hb1: "#f2f2f2", hb2: "#a9a9a9", hg1: "#fafafa", hg2: "#b8b8b8", bt1: "#b3a67f", bt2: "#6e6347", bp1: "#9a9a9a", bp2: "#5a5a5a", gd1: "#d6c6e0", gd2: "#8c7a9c", bsl: "#8f8362", gsl: "#b2a0c0" }
];
const hex = c => { const n = parseInt(c.slice(1), 16); return [n >> 16, n >> 8 & 255, n & 255] };
const mix = (a, b, t) => {
    const A = hex(a),
        B = hex(b);
    return "#" + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, "0")).join("")
};

function stage(p) {
    let i = 0;
    while (i < 2 && p > ST[i + 1]) i++;
    const t = (p - ST[i]) / (ST[i + 1] - ST[i]),
        r = document.documentElement.style;
    for (const k in PAL[0]) r.setProperty("--" + k, mix(PAL[i][k], PAL[i + 1][k], t));
    r.setProperty("--stu", Math.max(0, 1 - p / .3)); // school bags & ties fade out
    r.setProperty("--old", Math.min(1, Math.max(0, (p - .6) / .3))); // glasses, wrinkles, cane fade in
    r.setProperty("--spd", (.7 + .5 * p) + "s");
    r.setProperty("--bob", (.35 + .25 * p) + "s"); // they walk slower
}
let stopT;

function couples() {
    const chaps = document.querySelectorAll(".chap");
    const y = window.scrollY,
        vh = innerHeight;
    const start2 = chaps[1].offsetTop - vh * 0.6; // where section 2 begins
    const end = document.documentElement.scrollHeight - vh; // page bottom
    stage(end > 0 ? Math.min(1, Math.max(0, y / end)) : 0);
    hug.style.opacity = y < start2 ? 1 : 0;
    if (y >= start2) {
        const p = Math.min(1, Math.max(0, (y - start2) / Math.max(1, end - start2)));
        const w = walk.getBoundingClientRect().width || 120;
        walk.style.left = (p * (innerWidth - w - 20) + 10) + "px"; // walks left to right, reaching the end at the bottom
        walk.style.opacity = 1;
    } else walk.style.opacity = 0;
    walk.classList.add("walking");
    clearTimeout(stopT);
    stopT = setTimeout(() => walk.classList.remove("walking"), 160);
}
addEventListener("scroll", couples, { passive: true });
addEventListener("resize", couples);
couples();

/* ---- About us: reveal + editable text ---- */
(() => {
    const sec = $("#about"),
        el = sec.querySelector(".atext");
    const saved = store.get("about", null);
    if (saved) el.textContent = saved;
    el.onclick = () => {
        const v = prompt("About us text:", el.textContent);
        if (v) {
            el.textContent = v;
            store.set("about", v)
        }
    };
    new IntersectionObserver(es => es.forEach(e => sec.classList.toggle("show", e.isIntersecting)), { threshold: .2 }).observe(sec);
})();

/* ---- Falling flowers: only 10, mixed daisies, blossoms and tulips ---- */
(() => {
    const colors = ["#f08aa0", "#e0556f", "#ffffff", "#f4a259", "#c64fa0", "#f4c542", "#ff7f7f", "#d9608a", "#fbd0dc", "#e8718d"];
    const shapes = ["fDaisy", "fBlossom", "fTulip"];
    const box = $("#flowers");
    colors.forEach((c, i) => {
        const shape = shapes[i % 3],
            tall = shape === "fTulip";
        const f = document.createElement("div");
        f.className = "flower";
        f.style.left = (4 + i * 9.6 + Math.random() * 4) + "%";
        f.style.setProperty("--tc", c);
        f.style.setProperty("--d", (12 + Math.random() * 8) + "s");
        f.style.setProperty("--delay", (-Math.random() * 16) + "s");
        f.style.setProperty("--s", (2.4 + Math.random() * 2) + "s");
        f.style.setProperty("--r0", (-30 + Math.random() * 20) + "deg");
        f.style.setProperty("--r1", (20 + Math.random() * 40) + "deg");
        const sc = .8 + Math.random() * .6;
        f.style.width = (tall ? 34 : 38) * sc + "px";
        f.style.height = (tall ? 52 : 38) * sc + "px";
        f.innerHTML = `<svg viewBox="0 0 40 ${tall?62:40}"><use href="#${shape}"/></svg>`;
        box.appendChild(f);
    });
})();

/* ---- Music: music.mp3 plays in the background (starts when Enter is clicked) ---- */
(() => {
    const aud = $("#aud"),
        btn = $("#mbtn"),
        panel = $("#mpanel"),
        play = $("#mplay");
    aud.volume = .6;
    const sync = () => {
        const p = !aud.paused;
        btn.classList.toggle("playing", p);
        play.textContent = p ? "Pause" : "Play"
    };
    aud.onplay = aud.onpause = sync;
    const start = () => aud.play().catch(() => {});
    btn.onclick = () => panel.classList.toggle("open");
    play.onclick = () => { aud.paused ? start() : aud.pause() };
    $("#mvol").oninput = e => aud.volume = e.target.value;
    start(); // try autoplay right away (works if the browser allows it)
    // browsers block sound until the visitor interacts: start on the first click/tap/key (the Enter button)
    const first = e => {
        if (e.target.closest && e.target.closest("#music")) return; // don't fight the player's own buttons
        start();
        ["click", "touchstart", "keydown"].forEach(t => removeEventListener(t, first))
    };
    ["click", "touchstart", "keydown"].forEach(t => addEventListener(t, first));
})();

/* ---- Projects ---- */
// Always make the link absolute (https://...) so it never resolves as a local file.
const fullUrl = u => /^https?:\/\//i.test(u) ? u : "https://" + u.replace(/^\/+/, "");
PROJECTS.forEach(p => {
    const url = fullUrl(p.url);
    const a = document.createElement("a");
    a.className = "proj";
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    // Thumbnail: your own image if "thumb" is set, otherwise a live mini-preview of the site.
    const th = document.createElement("div");
    th.className = "thumb";
    th.innerHTML = `<span class="ph">${p.name}</span>`;
    if (p.thumb) {
        const img = document.createElement("img");
        img.src = p.thumb;
        img.alt = p.name + " preview";
        img.loading = "lazy";
        img.onerror = () => img.remove();
        th.appendChild(img);
    } else {
        const fr = document.createElement("iframe");
        fr.src = url;
        fr.loading = "lazy";
        fr.tabIndex = -1;
        fr.setAttribute("scrolling", "no");
        fr.setAttribute("aria-hidden", "true");
        fr.setAttribute("sandbox", "allow-scripts allow-same-origin");
        fr.title = p.name + " preview";
        th.appendChild(fr);
    }
    a.appendChild(th);
    const fit = () => { const f = th.querySelector("iframe"); if (f) f.style.setProperty("--s", th.clientWidth / 1280) };
    new ResizeObserver(fit).observe(th);
    const body = document.createElement("div");
    body.className = "pbody";
    body.innerHTML = `<h3>${p.name}</h3><p>${p.desc}</p><span>Open project →</span>`;
    a.appendChild(body);
    $("#pgrid").appendChild(a);
});

$("#reset").onclick = () => {
    if (confirm("Delete saved photos, dates and unlock state?")) {
        localStorage.clear();
        location.reload()
    }
};