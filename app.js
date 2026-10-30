/* ==========================================================================
   حُجرية بريس (Hujariya Press) — hujariyapress.rawi-ye.com
   المحرك البرمجي الكلاسيكي النظيف للموقع العام (BBC Clean Engine)
   الجزء الأول: طقس المدن اليمنية، الهوية والشعار، القائمة الجانبية المتداخلة،
   شريط العاجل التلفزيوني المتحرك، وهندسة البطاقات الإخبارية
   ========================================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  increment
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ==================== 1. إعدادات الاتصال بقاعدة بيانات Firebase ====================
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAd4Df_Fpp2GlGkRPyvmKuFW68LbL_a4yU",
  authDomain: "rawi-01.firebaseapp.com",
  databaseURL: "https://rawi-01-default-rtdb.firebaseio.com",
  projectId: "rawi-01",
  storageBucket: "rawi-01.firebasestorage.app",
  messagingSenderId: "91203142966",
  appId: "1:91203142966:web:a44f7c06c98529a57a9f97",
  measurementId: "G-2VNWNSZLBJ"
};

const app = initializeApp(FIREBASE_CONFIG);
const db = getFirestore(app);

const SITE_CANONICAL_URL = "https://hujariyapress.rawi-ye.com";
const VIEWED_POSTS_STORAGE_KEY = "hujariya_unique_views_v2";

// ==================== 2. الأقسام الأساسية والنصوص المؤسسية لـ «حُجرية بريس» ====================
const DEFAULT_COMPASSES = [
  {
    id: "yemen-politics",
    name: "بوصلة السياسة اليمنية",
    shortName: "السياسة اليمنية",
    slug: "yemen-politics",
    subcategories: ["الشرعية ومؤسسات الدولة", "التحليلات الاستراتيجية", "الشأن المحلي والمحافظات", "كشف زيف الميليشيات"],
    visible: true,
    order: 1
  },
  {
    id: "saudi-politics",
    name: "بوصلة السياسة السعودية",
    shortName: "السياسة السعودية",
    slug: "saudi-politics",
    subcategories: ["الأمن القومي اليمني السعودي", "الدبلوماسية الإقليمية", "رؤية المملكة 2030", "المشاريع التنموية"],
    visible: true,
    order: 2
  },
  {
    id: "regional-international",
    name: "البوصلة الإقليمية والدولية",
    shortName: "إقليمي ودولي",
    slug: "regional-international",
    subcategories: ["الشرق الأوسط", "السياسة الدولية", "أمن البحر الأحمر والممرات"],
    visible: true,
    order: 3
  },
  {
    id: "economy-dev",
    name: "بوصلة الاقتصاد والتنمية",
    shortName: "اقتصاد وتنمية",
    slug: "economy-dev",
    subcategories: ["أسواق وعملات", "طاقة ونفط", "إعمار وتنمية"],
    visible: true,
    order: 4
  },
  {
    id: "culture-thought",
    name: "بوصلة الثقافة والفكر",
    shortName: "ثقافة وفكر",
    slug: "culture-thought",
    subcategories: ["أدب وفكر", "تاريخ وهوية", "قراءات وكتب", "مقالات الرأي"],
    visible: true,
    order: 5
  },
  {
    id: "tech-future",
    name: "بوصلة التقنية والمستقبل",
    shortName: "تقنية ومستقبل",
    slug: "tech-future",
    subcategories: ["الذكاء الاصطناعي", "الأمن السيبراني", "تطبيقات ومنصات", "ابتكارات"],
    visible: true,
    order: 6
  },
  {
    id: "art-media",
    name: "بوصلة الفن والإعلام",
    shortName: "فن وإعلام",
    slug: "art-media",
    subcategories: ["فن ودراما", "إعلام رقمي", "تراث وفنون"],
    visible: true,
    order: 7
  }
];

const DEFAULT_ABOUT_HTML = `<p><strong>منصة إخبارية وتحليلية شاملة، تنبض بروح الوطن، وتؤمن بأن الكلمة أمانة والموقف مبدأ.</strong></p>
<p>تندرج <strong>حُجرية بريس (Hujariya Press)</strong> تحت مظلة <strong>مؤسسة RAWI-YE.COM الإعلامية الرقمية</strong>، وهي مؤسسة إعلامية مهنية رائدة تضم عدة منصات نوعية متكاملة في رؤيتها ومستقلة في خطوطها التحريرية. ننطلق من رسالة إعلامية راسخة لتكون منصتنا مساحة رحبة وموضوعية لكل الأقلام الحرة والمبدعة في مختلف المجالات؛ السياسية، الثقافية، الفنية، التقنية، والتحليلات المعمقة، التزاماً منا بإثراء وعي القارئ العربي ومواكبة الحقيقة بمهنية ومصداقية عالية.</p>
<h3>التوجيه التحريري والثوابت الوطنية</h3>
<p>تتبنى <strong>حُجرية بريس</strong> معايير الصحافة الرصينة في التحقق من الحقائق وتقديم محتوى تحليلي موضوعي بعيداً عن التهويل، مع التزام وطني ثابت لا يقبل المساومة:</p>
<blockquote>
<p>• <strong>الانحياز للدولة والاستقرار:</strong> دعم مؤسسات الدولة الشرعية، وتعزيز مسار الأمن والاستقرار، ورفض كافة المشاريع الكيانية المتمردة أو الميليشيات التي تسعى لتقويض النسيج الاجتماعي.</p>
<p>• <strong>الأمن القومي المشترك:</strong> أمن الجمهورية اليمنية وأمن المملكة العربية السعودية يمثلان عمقاً استراتيجياً وأمناً قومياً مشتركاً لا يتجزأ.</p>
</blockquote>`;

const DEFAULT_CHARTER_HTML = `<p>يمثل هذا الميثاق الدستور المهني والأخلاقي والوطني لكافة المحررين والكتّاب في <strong>حُجرية بريس (Hujariya Press — RAWI-YE.COM)</strong>:</p>
<h3>أولاً: الثوابت الوطنية والسياسية</h3>
<p>1. الالتزام التام بدعم الدولة والشرعية والاصطفاف مع المصلحة الوطنية العليا، وعدم الترويج لأي خطاب يخدم الميليشيات أو المشاريع التخريبية المعادية.</p>
<p>2. احترام عمق الأمن القومي المشترك بين اليمن والمملكة العربية السعودية باعتباره ركيزة استقرار المنطقة.</p>
<h3>ثانياً: المعايير المهنية والتحريرية</h3>
<p>1. تحري الدقة والمصداقية والاعتماد على المصادر الموثوقة قبل نشر أي خبر أو تحليل.</p>
<p>2. الكتابة باللغة العربية الفصحى الرصينة، والابتعاد عن الألفاظ النابية أو التجريح الشخصي.</p>`;

const DEFAULT_PRIVACY_HTML = `<p>تحترم <strong>حُجرية بريس</strong> خصوصية كافة زوارها وقرّائها، وتلتزم بحماية البيانات وفق أعلى المعايير التقنية:</p>
<p>• لا نقوم بجمع أي بيانات شخصية عن الزوار أثناء تصفح الأخبار والمقالات.</p>
<p>• تُستخدم الإحصائيات العامة لقياس جودة المحتوى وتطوير تجربة القارئ دون المساس بخصوصيته.</p>`;

// ==================== 3. حالة النظام للموقع العام (State) ====================
const state = {
  settings: {
    siteName: "حُجرية بريس",
    networkName: "RAWI-YE.COM",
    siteDescription: "حُجرية بريس — منصة إخبارية وتحليلية شاملة تندرج تحت مظلة مؤسسة RAWI-YE.COM الإعلامية الرقمية.",
    logoUrl: "",
    hideSiteName: false,
    faviconUrl: "",
    appIconUrl: "",
    coverImageUrl: "",
    defaultPostImageUrl: "",
    accentColor: "#ef3327",
    aboutHtml: DEFAULT_ABOUT_HTML,
    charterHtml: DEFAULT_CHARTER_HTML,
    privacyHtml: DEFAULT_PRIVACY_HTML,
    socials: {}
  },
  compasses: [...DEFAULT_COMPASSES],
  posts: [],
  staff: [],
  ads: [],
  activeView: "home", // home | article | author | static
  activeCompass: "all",
  activeSubcategory: "all",
  activeTag: "",
  searchQuery: "",
  visiblePostsLimit: 12,
  currentArticleId: null,
  currentAuthorKey: null
};

// ==================== 4. الدوال المساعدة وتنسيق الأوقات والصور ====================
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function stripHtmlToPlain(html = "") {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").replace(/\s+/g, " ").trim();
}

function showPubToast(msg) {
  const toast = document.getElementById("pub-toast");
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.remove("hidden");
  clearTimeout(window.__pubToastTimer);
  window.__pubToastTimer = setTimeout(() => toast.classList.add("hidden"), 3000);
}

// تنظيف اسم القسم من كلمة "بوصلة" للعرض الرشيق في الأشرطة والبطاقات
function getCleanCategoryLabel(name = "") {
  return String(name)
    .replace(/^بوصلة\s+/i, "")
    .replace(/^البوصلة\s+/i, "")
    .trim() || name;
}

function getPostTimestampMs(item) {
  if (!item) return 0;
  const t = item.createdAt || item.updatedAt;
  if (!t) return 0;
  if (typeof t.toMillis === "function") return t.toMillis();
  if (typeof t.seconds === "number") return t.seconds * 1000;
  const parsed = new Date(t).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

function formatArabicDate(timestamp) {
  const ms = typeof timestamp === "number" ? timestamp : getPostTimestampMs({ createdAt: timestamp });
  if (!ms) return "حديثاً";
  const d = new Date(ms);
  return d.toLocaleDateString("ar-YE", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatRelativeTime(timestamp) {
  const ms = typeof timestamp === "number" ? timestamp : getPostTimestampMs({ createdAt: timestamp });
  if (!ms) return "الآن";
  const diffMinutes = Math.max(1, Math.floor((Date.now() - ms) / 60000));
  if (diffMinutes < 60) return `منذ ${diffMinutes} د`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `منذ ${diffHours} س`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `منذ ${diffDays} يوم`;
  return formatArabicDate(ms);
}

// جلب صورة المقال أو الصورة الافتراضية المحددة من الإعدادات
function getPostEffectiveImageUrl(post) {
  if (post && post.imageUrl && String(post.imageUrl).trim() !== "") {
    return String(post.imageUrl).trim();
  }
  const s = state.settings;
  if (s.defaultPostImageUrl && s.defaultPostImageUrl.trim() !== "") {
    return s.defaultPostImageUrl.trim();
  }
  if (s.coverImageUrl && s.coverImageUrl.trim() !== "") {
    return s.coverImageUrl.trim();
  }
  return "";
}

// بناء صورة البطاقة الإخبارية بنظافة تامة
function buildPostThumbnailHtml(post, altText = "") {
  const imgUrl = getPostEffectiveImageUrl(post);
  const s = state.settings;
  const fallbackLogo = (s.logoUrl || s.faviconUrl || s.appIconUrl || "").trim();
  const siteName =
    s.siteName && s.siteName !== "شبكة البوصلة" && s.siteName !== "نبض اليمن"
      ? s.siteName
      : "حُجرية بريس";

  if (imgUrl) {
    return `<img src="${escapeHtml(imgUrl)}" alt="${escapeHtml(
      altText || post?.title || siteName
    )}" loading="lazy" onerror="this.parentElement.innerHTML='<div class=\\'brand-fallback-thumb\\'><strong class=\\'brand-fallback-name\\'>${escapeHtml(
      siteName
    )}</strong></div>'">`;
  }

  return `
    <div class="brand-fallback-thumb">
      ${
        fallbackLogo
          ? `<img src="${escapeHtml(fallbackLogo)}" alt="${escapeHtml(siteName)}">`
          : `<strong class="brand-fallback-name">${escapeHtml(siteName)}</strong>`
      }
    </div>
  `;
}

// مطابقة الكاتب مع سجل الكادر
function resolvePostAuthorInfo(post) {
  const rawName = post?.author || "حُجرية بريس";
  const rawEmail = String(post?.authorEmail || post?.authorUsername || "").toLowerCase();
  const rawId = String(post?.authorId || "").toLowerCase();

  const matchedStaff = state.staff.find((s) => {
    if (rawId && String(s.id || "").toLowerCase() === rawId) return true;
    if (
      rawEmail &&
      (String(s.email || "").toLowerCase() === rawEmail ||
        String(s.username || "").toLowerCase() === rawEmail)
    ) {
      return true;
    }
    if (s.name && s.name.trim() === rawName.trim()) return true;
    return false;
  });

  const name = matchedStaff?.name || rawName;
  const avatar =
    matchedStaff?.avatar ||
    post?.authorAvatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=ef3327&color=fff`;
  const verified = matchedStaff
    ? Boolean(matchedStaff.verified || matchedStaff.role === "admin" || matchedStaff.isMasterAdmin)
    : Boolean(post?.authorVerified);
  const authorKey = matchedStaff?.id || rawEmail || name;

  return { name, avatar, verified, authorKey, staffMember: matchedStaff };
}

function getPostCompasses(post) {
  const list = [];
  if (Array.isArray(post?.categories)) list.push(...post.categories);
  if (post?.category && !list.includes(post.category)) list.push(post.category);
  return list.length ? list : ["بوصلة السياسة اليمنية"];
}

function postMatchesCompass(post, targetCompass) {
  if (!targetCompass || targetCompass === "all") return true;
  const targetClean = getCleanCategoryLabel(targetCompass);
  return getPostCompasses(post).some(
    (c) => c === targetCompass || getCleanCategoryLabel(c) === targetClean
  );
}

function isBreakingStillActive(post) {
  if (!post || !post.isBreaking) return false;
  const now = Date.now();
  if (post.breakingExpiresAt) {
    const exp =
      typeof post.breakingExpiresAt === "number"
        ? post.breakingExpiresAt
        : new Date(post.breakingExpiresAt).getTime();
    if (exp && !isNaN(exp) && now > exp) return false;
  } else if (post.breakingDurationHours) {
    const createdMs = getPostTimestampMs(post);
    const durationMs = Number(post.breakingDurationHours) * 3600 * 1000;
    if (createdMs && durationMs > 0 && now > createdMs + durationMs) return false;
  }
  return true;
}

// ==================== 5. شريط طقس المدن اليمنية المباشر (Open-Meteo Live Weather) ====================
async function initYemenWeatherStrip() {
  const track = document.getElementById("yemen-weather-track");
  if (!track) return;

  const yemenCities = [
    { name: "صنعاء", lat: 15.3694, lon: 44.191 },
    { name: "عدن", lat: 12.7855, lon: 45.0187 },
    { name: "تعز", lat: 13.5795, lon: 44.0209 },
    { name: "المكلا", lat: 14.5425, lon: 49.1242 },
    { name: "مأرب", lat: 15.4591, lon: 45.3253 },
    { name: "الحديدة", lat: 14.7978, lon: 42.9545 },
    { name: "سقطرى", lat: 12.6488, lon: 53.9963 }
  ];

  try {
    const lats = yemenCities.map((c) => c.lat).join(",");
    const lons = yemenCities.map((c) => c.lon).join(",");
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true`;

    const res = await fetch(url);
    if (!res.ok) return;
    const data = await res.json();
    const results = Array.isArray(data) ? data : [data];

    const itemsHtml = yemenCities
      .map((city, idx) => {
        const temp = results[idx]?.current_weather?.temperature;
        const tempRounded = typeof temp === "number" ? Math.round(temp) : 27;
        return `<span>${escapeHtml(city.name)} ${tempRounded}°C</span>`;
      })
      .join(`<span class="w-sep">•</span>`);

    if (itemsHtml) {
      track.innerHTML = itemsHtml;
    }
  } catch (_) {
    // في حال ضعف الإنترنت تبقى القيم الافتراضية النظيفة ظاهرة بدون أي خطأ
  }
}

// ==================== 6. تطبيق الهوية البصرية، الشعار المفرغ، وأيقونة التطبيق ====================
function applyDynamicSiteIdentity() {
  const s = state.settings;
  const siteName =
    s.siteName && s.siteName !== "شبكة البوصلة" && s.siteName !== "نبض اليمن"
      ? s.siteName
      : "حُجرية بريس";
  const siteDesc =
    s.siteDescription ||
    "حُجرية بريس — منصة إخبارية وتحليلية شاملة تندرج تحت مظلة مؤسسة RAWI-YE.COM الإعلامية الرقمية.";
  const brandColor = s.accentColor || "#ef3327";

  document.documentElement.style.setProperty("--brand-red", brandColor);

  const themeMeta = document.getElementById("page-theme-color");
  if (themeMeta) themeMeta.setAttribute("content", brandColor);

  // تحديث الاسم في الهيدر، القائمة الجانبية، والتذييل
  const textBrand = document.getElementById("site-text-brand");
  if (textBrand) textBrand.textContent = siteName;

  const sidebarTitle = document.getElementById("sidebar-brand-title");
  if (sidebarTitle) sidebarTitle.textContent = siteName;

  const footerName = document.getElementById("footer-site-name");
  if (footerName) footerName.textContent = siteName;

  const copyName = document.getElementById("copyright-site-name");
  if (copyName) copyName.textContent = siteName;

  const footerDesc = document.getElementById("footer-site-desc");
  if (footerDesc) footerDesc.textContent = siteDesc;

  // التحكم بالشعار المفرغ وإخفاء الاسم النصي بضغطة زر من الإعدادات
  const logoImg = document.getElementById("site-logo-img");
  const footerLogo = document.getElementById("footer-logo-img");
  const hasLogo = Boolean(s.logoUrl && s.logoUrl.trim() !== "");

  if (logoImg) {
    if (hasLogo) {
      logoImg.src = s.logoUrl.trim();
      logoImg.classList.remove("hidden");
    } else {
      logoImg.classList.add("hidden");
    }
  }

  if (footerLogo) {
    if (hasLogo) {
      footerLogo.src = s.logoUrl.trim();
      footerLogo.classList.remove("hidden");
    } else {
      footerLogo.classList.add("hidden");
    }
  }

  // عند تفعيل خيار إخفاء الاسم النصي (أو إظهار الشعار وحده) يختفي النص تماماً
  if (textBrand) {
    const hideText = hasLogo && Boolean(s.hideSiteName);
    textBrand.classList.toggle("hidden", hideText);
  }

  // تحديث أيقونة محركات البحث وتثبيت تطبيق الويب (Favicon & PWA)
  const appIcon = (s.faviconUrl || s.appIconUrl || s.logoUrl || "").trim();
  if (appIcon) {
    const favEl = document.getElementById("dynamic-favicon");
    if (favEl) favEl.href = appIcon;

    const appleEl = document.getElementById("dynamic-apple-icon");
    if (appleEl) appleEl.href = appIcon;

    updateDynamicWebAppManifest(siteName, siteDesc, appIcon, brandColor);
  }

  // تحديث صورة المشاركة الافتراضية لواتساب ومنصات التواصل
  const shareImage = (s.coverImageUrl || s.defaultPostImageUrl || s.logoUrl || "").trim();
  if (state.activeView === "home") {
    updateMetaAndOgTags(
      `${siteName} | Hujariya Press`,
      siteDesc,
      shareImage,
      SITE_CANONICAL_URL
    );
  }

  renderMasterSidebarContents();
}

function updateMetaAndOgTags(title, description, imageUrl, url) {
  document.title = title;
  const setAttr = (id, attr, val) => {
    const el = document.getElementById(id);
    if (el && val !== undefined) el.setAttribute(attr, val);
  };
  setAttr("page-meta-desc", "content", description);
  setAttr("og-meta-title", "content", title);
  setAttr("og-meta-desc", "content", description);
  if (imageUrl) setAttr("og-meta-image", "content", imageUrl);
  if (url) setAttr("og-meta-url", "content", url);
}

function updateDynamicWebAppManifest(name, description, iconUrl, themeColor) {
  try {
    const manifestObj = {
      name: `${name} | Hujariya Press`,
      short_name: name,
      description,
      start_url: SITE_CANONICAL_URL,
      display: "standalone",
      background_color: "#f6f5f2",
      theme_color: themeColor || "#ef3327",
      dir: "rtl",
      lang: "ar",
      icons: [
        { src: iconUrl, sizes: "192x192", type: "image/png" },
        { src: iconUrl, sizes: "512x512", type: "image/png" }
      ]
    };
    const blob = new Blob([JSON.stringify(manifestObj)], { type: "application/json" });
    const manifestUrl = URL.createObjectURL(blob);
    let linkEl = document.querySelector('link[rel="manifest"]');
    if (!linkEl) {
      linkEl = document.createElement("link");
      linkEl.rel = "manifest";
      document.head.appendChild(linkEl);
    }
    linkEl.href = manifestUrl;
  } catch (_) {}
}

// ==================== 7. شريط الأقسام الكلاسيكي والقائمة الجانبية المتداخلة ====================
function getVisibleCompasses() {
  return [...state.compasses]
    .filter((c) => c.visible !== false)
    .sort((a, b) => (a.order || 99) - (b.order || 99));
}

function renderCompassesNavigation() {
  const navEl = document.getElementById("public-compasses-nav");
  const compasses = getVisibleCompasses();

  if (navEl) {
    navEl.innerHTML = [
      `<button type="button" class="cat-tab-btn ${
        state.activeCompass === "all" ? "active" : ""
      }" data-compass-filter="all">الرئيسية</button>`,
      ...compasses.map((c) => {
        const isActive = state.activeCompass === c.name || state.activeCompass === c.id;
        const cleanTitle = c.shortName || getCleanCategoryLabel(c.name);
        return `<button type="button" class="cat-tab-btn ${
          isActive ? "active" : ""
        }" data-compass-filter="${escapeHtml(c.name)}">${escapeHtml(cleanTitle)}</button>`;
      })
    ].join("");

    navEl.querySelectorAll("[data-compass-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        selectCompassCategory(btn.getAttribute("data-compass-filter") || "all");
      });
    });
  }

  renderSubcategoriesBar();
  renderMasterSidebarContents();
}

function renderSubcategoriesBar() {
  const wrap = document.getElementById("subcategories-bar-wrap");
  const listEl = document.getElementById("public-subcategories-list");
  if (!wrap || !listEl) return;

  if (state.activeCompass === "all") {
    wrap.classList.add("hidden");
    return;
  }

  const comp = state.compasses.find(
    (c) => c.name === state.activeCompass || c.id === state.activeCompass
  );
  const subs = Array.isArray(comp?.subcategories) ? comp.subcategories.filter(Boolean) : [];

  if (!subs.length) {
    wrap.classList.add("hidden");
    return;
  }

  wrap.classList.remove("hidden");
  listEl.innerHTML = [
    `<button type="button" class="subcat-chip ${
      state.activeSubcategory === "all" ? "active" : ""
    }" data-subcat-item="all">الكل</button>`,
    ...subs.map(
      (sub) =>
        `<button type="button" class="subcat-chip ${
          state.activeSubcategory === sub ? "active" : ""
        }" data-subcat-item="${escapeHtml(sub)}">${escapeHtml(sub)}</button>`
    )
  ].join("");

  listEl.querySelectorAll("[data-subcat-item]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeSubcategory = btn.getAttribute("data-subcat-item") || "all";
      renderSubcategoriesBar();
      renderAllHomeSections();
    });
  });
}

// بناء محتويات القائمة الجانبية الشاملة (شيء داخل شيء)
function renderMasterSidebarContents() {
  const treeEl = document.getElementById("sidebar-categories-tree");
  const pulseEl = document.getElementById("sidebar-pulse-list");
  const writersEl = document.getElementById("sidebar-writers-list");
  const socWrap = document.getElementById("sidebar-socials-wrap");
  const socGrid = document.getElementById("sidebar-social-links");

  const compasses = getVisibleCompasses();

  // 1. شجرة الأقسام وبداخلها التفرعات
  if (treeEl) {
    treeEl.innerHTML = compasses
      .map((c, idx) => {
        const subs = Array.isArray(c.subcategories) ? c.subcategories.filter(Boolean) : [];
        const cleanTitle = getCleanCategoryLabel(c.name);
        const subId = `sub-tree-${idx}`;
        return `
          <div class="sidebar-cat-node">
            <div class="sidebar-cat-row">
              <button type="button" class="sidebar-cat-main-btn" data-side-compass="${escapeHtml(
                c.name
              )}">${escapeHtml(cleanTitle)}</button>
              ${
                subs.length
                  ? `<button type="button" class="sidebar-sub-toggle" data-toggle-subtree="${subId}">${subs.length} فرع ▾</button>`
                  : ""
              }
            </div>
            ${
              subs.length
                ? `<div id="${subId}" class="sidebar-subcats-nested hidden">
                    ${subs
                      .map(
                        (sub) =>
                          `<button type="button" class="sidebar-sub-btn" data-side-compass="${escapeHtml(
                            c.name
                          )}" data-side-sub="${escapeHtml(sub)}">• ${escapeHtml(sub)}</button>`
                      )
                      .join("")}
                  </div>`
                : ""
            }
          </div>
        `;
      })
      .join("");

    treeEl.querySelectorAll("[data-toggle-subtree]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const targetId = btn.getAttribute("data-toggle-subtree");
        const box = document.getElementById(targetId);
        if (box) box.classList.toggle("hidden");
      });
    });

    treeEl.querySelectorAll("[data-side-compass]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const compName = btn.getAttribute("data-side-compass");
        const subName = btn.getAttribute("data-side-sub") || "all";
        closeMasterSidebar();
        state.activeCompass = compName;
        state.activeSubcategory = subName;
        state.activeTag = "";
        switchPublicView("home");
        renderCompassesNavigation();
        renderAllHomeSections();
      });
    });
  }

  // 2. النبض السريع داخل القائمة الجانبية
  if (pulseEl) {
    const published = getPublishedPosts();
    const pulseItems = published
      .filter((p) => p.isQuickNews || isBreakingStillActive(p))
      .slice(0, 8);
    const list = pulseItems.length ? pulseItems : published.slice(0, 6);

    pulseEl.innerHTML = list.length
      ? list
          .map(
            (p) => `
          <div class="brief-item" data-side-post="${escapeHtml(p.id)}">
            <span class="brief-item-time">${formatRelativeTime(p.createdAt)}</span>
            <div class="brief-item-title">${escapeHtml(p.title)}</div>
          </div>
        `
          )
          .join("")
      : `<div style="font-size:0.8rem;color:var(--text-muted);padding:6px;">لا توجد أخبار سريعة حالياً.</div>`;

    pulseEl.querySelectorAll("[data-side-post]").forEach((item) => {
      item.addEventListener("click", () => {
        closeMasterSidebar();
        openArticleReader(item.getAttribute("data-side-post"));
      });
    });
  }

  // 3. الكتّاب داخل القائمة الجانبية
  if (writersEl) {
    const writers = state.staff.filter((s) => !s.suspended && s.name);
    writersEl.innerHTML = writers.length
      ? writers
          .map(
            (w) =>
              `<button type="button" class="sidebar-sub-btn" style="width:100%;display:block;" data-side-writer="${escapeHtml(
                w.id
              )}">✒️ ${escapeHtml(w.name)} — <span style="font-size:0.72rem;">${escapeHtml(
                w.jobTitle || "كاتب"
              )}</span></button>`
          )
          .join("")
      : `<div style="font-size:0.8rem;color:var(--text-muted);padding:6px;">لا يوجد كتّاب مسجلون حالياً.</div>`;

    writersEl.querySelectorAll("[data-side-writer]").forEach((btn) => {
      btn.addEventListener("click", () => {
        closeMasterSidebar();
        openAuthorProfile(btn.getAttribute("data-side-writer"));
      });
    });
  }

  // 4. روابط التواصل الاجتماعي داخل القائمة الجانبية فقط
  if (socWrap && socGrid) {
    const soc = state.settings.socials || {};
    const items = [
      { label: "واتساب", url: soc.whatsapp },
      { label: "تليجرام", url: soc.telegram },
      { label: "منصة X", url: soc.x || soc.twitter },
      { label: "فيسبوك", url: soc.facebook },
      { label: "يوتيوب", url: soc.youtube }
    ].filter((i) => i.url && String(i.url).trim() !== "");

    if (items.length) {
      socWrap.classList.remove("hidden");
      socGrid.innerHTML = items
        .map(
          (i) =>
            `<a href="${escapeHtml(i.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(
              i.label
            )}</a>`
        )
        .join("");
    } else {
      socWrap.classList.add("hidden");
    }
  }
}

function openMasterSidebar() {
  document.getElementById("master-sidebar-backdrop")?.classList.remove("hidden");
  document.getElementById("master-sidebar-drawer")?.classList.remove("hidden");
}

function closeMasterSidebar() {
  document.getElementById("master-sidebar-backdrop")?.classList.add("hidden");
  document.getElementById("master-sidebar-drawer")?.classList.add("hidden");
}

function selectCompassCategory(compassName) {
  state.activeCompass = compassName;
  state.activeSubcategory = "all";
  state.activeTag = "";
  state.visiblePostsLimit = 12;
  switchPublicView("home");
  renderCompassesNavigation();
  renderAllHomeSections();
}

// ==================== 8. شريط الأخبار العاجلة التلفزيوني المتحرك (TV News Ticker) ====================
function getPublishedPosts() {
  return state.posts.filter((p) => !p.status || p.status === "published");
}

function renderBreakingNewsBar() {
  const bar = document.getElementById("breaking-news-bar");
  const track = document.getElementById("breaking-ticker-items");
  if (!bar || !track) return;

  const breakingPosts = getPublishedPosts().filter((p) => isBreakingStillActive(p));

  if (!breakingPosts.length) {
    bar.classList.add("hidden");
    return;
  }

  bar.classList.remove("hidden");

  // تكرار العناصر داخل الشريط التلفزيوني لضمان مرور مستمر وسلس بلا فراغات
  const singlePass = breakingPosts
    .map(
      (p) => `
      <button type="button" class="tv-ticker-item" data-open-post="${escapeHtml(p.id)}">
        <span>${escapeHtml(p.title)}</span>
      </button>
      <span class="tv-ticker-sep">◆</span>
    `
    )
    .join("");

  track.innerHTML = singlePass + singlePass;

  // ضبط سرعة الشريط التلفزيوني تلقائياً حسب عدد الأخبار العاجلة
  const durationSeconds = Math.max(18, breakingPosts.length * 11);
  track.style.animationDuration = `${durationSeconds}s`;

  track.querySelectorAll("[data-open-post]").forEach((btn) => {
    btn.addEventListener("click", () => openArticleReader(btn.getAttribute("data-open-post")));
  });
}

function renderPublicAds() {
  const topSlot = document.getElementById("ad-slot-top");
  const midSlot = document.getElementById("ad-slot-middle");
  const activeAds = state.ads.filter((a) => a.active !== false);

  if (!activeAds.length) {
    topSlot?.classList.add("hidden");
    midSlot?.classList.add("hidden");
    return;
  }

  const buildAdHtml = (ad) => `
    <a href="${escapeHtml(ad.targetUrl || "#")}" target="_blank" rel="noopener noreferrer" class="ad-banner-card" data-ad-click="${escapeHtml(ad.id)}">
      <div>
        <span class="card-cat-tag">إعلان — ${escapeHtml(ad.sponsorName || "حُجرية بريس")}</span>
        <strong style="display:block;font-size:0.95rem;">${escapeHtml(ad.title)}</strong>
      </div>
      ${ad.imageUrl ? `<img src="${escapeHtml(ad.imageUrl)}" alt="${escapeHtml(ad.title)}" loading="lazy">` : ""}
    </a>
  `;

  if (topSlot && activeAds[0]) {
    topSlot.innerHTML = buildAdHtml(activeAds[0]);
    topSlot.classList.remove("hidden");
  }

  if (midSlot && activeAds[1]) {
    midSlot.innerHTML = buildAdHtml(activeAds[1]);
    midSlot.classList.remove("hidden");
  } else if (midSlot) {
    midSlot.classList.add("hidden");
  }

  document.querySelectorAll("[data-ad-click]").forEach((link) => {
    link.addEventListener("click", () => {
      const adId = link.getAttribute("data-ad-click");
      if (adId) {
        updateDoc(doc(db, "ads", adId), { clicks: increment(1) }).catch(() => {});
      }
    });
  });
}

// ==================== 9. الخبر الرئيسي، الموجز السريع، وشبكة البطاقات المرتبة ====================
function renderHeroAndPulseSection() {
  const heroSection = document.getElementById("hero-and-pulse-section");
  const heroBox = document.getElementById("hero-featured-box");
  const pulseFeed = document.getElementById("quick-pulse-feed");
  if (!heroSection || !heroBox || !pulseFeed) return;

  const hasSpecialFilter = Boolean(
    state.searchQuery || state.activeTag || state.activeSubcategory !== "all"
  );
  if (hasSpecialFilter) {
    heroSection.classList.add("hidden");
    return;
  }

  heroSection.classList.remove("hidden");
  const published = getPublishedPosts();
  const scoped = published.filter((p) => postMatchesCompass(p, state.activeCompass));
  const heroPost = scoped.find((p) => p.isFeatured) || scoped[0];

  if (!heroPost) {
    heroBox.innerHTML = `<div class="skeleton-box">لا توجد أخبار منشورة في هذا القسم حالياً.</div>`;
  } else {
    const authorInfo = resolvePostAuthorInfo(heroPost);
    const catLabel = getCleanCategoryLabel(getPostCompasses(heroPost)[0]);
    const summaryText =
      heroPost.summary || stripHtmlToPlain(heroPost.content).slice(0, 170) + "...";

    heroBox.innerHTML = `
      <article class="lead-story-card" data-open-post="${escapeHtml(heroPost.id)}">
        <div class="lead-story-media">
          ${buildPostThumbnailHtml(heroPost, heroPost.title)}
        </div>
        <div class="lead-story-body">
          <span class="card-cat-tag">${escapeHtml(catLabel)}</span>
          <h2 class="lead-story-title">${escapeHtml(heroPost.title)}</h2>
          <p class="lead-story-summary">${escapeHtml(summaryText)}</p>
          <div class="card-clean-meta">
            <span class="card-author-name" data-open-author="${escapeHtml(authorInfo.authorKey)}">
              <span>${escapeHtml(authorInfo.name)}</span>
              ${
                authorInfo.verified
                  ? `<span class="material-symbols-rounded verified-icon" translate="no">verified</span>`
                  : ""
              }
            </span>
            <span>${formatRelativeTime(heroPost.createdAt)}</span>
          </div>
        </div>
      </article>
    `;

    heroBox.querySelector("[data-open-post]")?.addEventListener("click", (e) => {
      const authorEl = e.target.closest("[data-open-author]");
      if (authorEl) {
        e.stopPropagation();
        openAuthorProfile(authorEl.getAttribute("data-open-author"));
        return;
      }
      openArticleReader(heroPost.id);
    });
  }

  // الموجز الإخباري السريع
  const pulsePosts = published
    .filter((p) => p.isQuickNews || isBreakingStillActive(p))
    .slice(0, 8);
  const pulseList = pulsePosts.length ? pulsePosts : published.slice(0, 7);

  if (!pulseList.length) {
    pulseFeed.innerHTML = `<div style="padding:16px;color:var(--text-muted);font-size:0.84rem;">لا توجد أخبار سريعة حالياً.</div>`;
  } else {
    pulseFeed.innerHTML = pulseList
      .map(
        (p) => `
        <div class="brief-item" data-open-post="${escapeHtml(p.id)}">
          <span class="brief-item-time">${formatRelativeTime(p.createdAt)} • ${escapeHtml(
          getCleanCategoryLabel(getPostCompasses(p)[0])
        )}</span>
          <h3 class="brief-item-title">${escapeHtml(p.title)}</h3>
        </div>
      `
      )
      .join("");

    pulseFeed.querySelectorAll("[data-open-post]").forEach((item) => {
      item.addEventListener("click", () => openArticleReader(item.getAttribute("data-open-post")));
    });
  }
}

function buildNewsCardHtml(post) {
  const authorInfo = resolvePostAuthorInfo(post);
  const catLabel = getCleanCategoryLabel(getPostCompasses(post)[0]);
  const excerpt = post.summary || stripHtmlToPlain(post.content).slice(0, 120) + "...";

  return `
    <article class="bbc-news-card" data-open-post="${escapeHtml(post.id)}">
      <div class="bbc-card-thumb">
        ${buildPostThumbnailHtml(post, post.title)}
      </div>
      <div class="bbc-card-content">
        <div>
          <span class="card-cat-tag">${escapeHtml(catLabel)}${
            post.subcategory ? ` • ${escapeHtml(post.subcategory)}` : ""
          }</span>
          <h3 class="bbc-card-title">${escapeHtml(post.title)}</h3>
          <p class="bbc-card-excerpt">${escapeHtml(excerpt)}</p>
        </div>
        <div class="card-clean-meta">
          <span class="card-author-name" data-open-author="${escapeHtml(authorInfo.authorKey)}">
            <span>${escapeHtml(authorInfo.name)}</span>
            ${
              authorInfo.verified
                ? `<span class="material-symbols-rounded verified-icon" translate="no">verified</span>`
                : ""
            }
          </span>
          <span>${formatRelativeTime(post.createdAt)}</span>
        </div>
      </div>
    </article>
  `;
}

function bindPostCardsEvents(container) {
  if (!container) return;
  container.querySelectorAll("[data-open-post]").forEach((card) => {
    card.addEventListener("click", (e) => {
      const authorEl = e.target.closest("[data-open-author]");
      if (authorEl) {
        e.stopPropagation();
        openAuthorProfile(authorEl.getAttribute("data-open-author"));
        return;
      }
      openArticleReader(card.getAttribute("data-open-post"));
    });
  });
}

function renderPublicPostsFeed() {
  const grid = document.getElementById("public-posts-grid");
  const heading = document.getElementById("feed-section-heading");
  const counterEl = document.getElementById("feed-posts-counter");
  const filterBanner = document.getElementById("active-filter-banner");
  const filterTitle = document.getElementById("active-filter-title");
  const loadMoreWrap = document.getElementById("load-more-wrap");

  if (!grid) return;

  let list = getPublishedPosts().filter((p) => postMatchesCompass(p, state.activeCompass));

  if (state.activeSubcategory !== "all") {
    list = list.filter((p) => p.subcategory === state.activeSubcategory);
  }

  if (state.activeTag) {
    const tagClean = state.activeTag.toLowerCase();
    list = list.filter(
      (p) =>
        Array.isArray(p.tags) &&
        p.tags.some((t) => String(t).toLowerCase() === tagClean)
    );
  }

  if (state.searchQuery) {
    const q = state.searchQuery.toLowerCase();
    list = list.filter((p) => {
      const hay = `${p.title || ""} ${p.summary || ""} ${p.author || ""} ${(
        p.tags || []
      ).join(" ")}`.toLowerCase();
      return hay.includes(q);
    });
  }

  if (state.searchQuery || state.activeTag || state.activeCompass !== "all") {
    filterBanner?.classList.remove("hidden");
    if (filterTitle) {
      if (state.searchQuery) filterTitle.textContent = `نتائج البحث: "${state.searchQuery}"`;
      else if (state.activeTag) filterTitle.textContent = `الوسم: #${state.activeTag}`;
      else if (state.activeSubcategory !== "all")
        filterTitle.textContent = `${getCleanCategoryLabel(state.activeCompass)} — ${
          state.activeSubcategory
        }`;
      else filterTitle.textContent = `قسم: ${getCleanCategoryLabel(state.activeCompass)}`;
    }
  } else {
    filterBanner?.classList.add("hidden");
  }

  if (heading) {
    heading.textContent =
      state.activeCompass === "all"
        ? "أحدث الأخبار والتقارير"
        : getCleanCategoryLabel(state.activeCompass);
  }

  if (counterEl) {
    counterEl.textContent = `${list.length.toLocaleString("ar-YE")} خبر`;
  }

  if (!list.length) {
    grid.innerHTML = `<div class="skeleton-box" style="grid-column:1/-1;height:140px;">لا توجد أخبار تطابق خيارات العرض الحالية.</div>`;
    loadMoreWrap?.classList.add("hidden");
    return;
  }

  const visibleSlice = list.slice(0, state.visiblePostsLimit);
  grid.innerHTML = visibleSlice.map((p) => buildNewsCardHtml(p)).join("");
  bindPostCardsEvents(grid);

  if (loadMoreWrap) {
    loadMoreWrap.classList.toggle("hidden", list.length <= state.visiblePostsLimit);
  }
}

function renderWritersStrip() {
  const section = document.getElementById("writers-strip-section");
  const listEl = document.getElementById("writers-horizontal-list");
  if (!section || !listEl) return;

  const activeWriters = state.staff.filter((s) => !s.suspended && s.name);

  if (!activeWriters.length || state.activeCompass !== "all" || state.searchQuery || state.activeTag) {
    section.classList.add("hidden");
    return;
  }

  section.classList.remove("hidden");
  listEl.innerHTML = activeWriters
    .map((w) => {
      const avatar =
        w.avatar ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          w.name
        )}&background=ef3327&color=fff`;
      const isVer = Boolean(w.verified || w.role === "admin" || w.isMasterAdmin);
      return `
        <button type="button" class="writer-clean-card" data-open-author="${escapeHtml(w.id)}">
          <img src="${escapeHtml(avatar)}" alt="${escapeHtml(w.name)}" loading="lazy">
          <div>
            <div class="writer-clean-name">
              <span>${escapeHtml(w.name)}</span>
              ${
                isVer
                  ? `<span class="material-symbols-rounded verified-icon" translate="no">verified</span>`
                  : ""
              }
            </div>
            <span class="writer-clean-role">${escapeHtml(w.jobTitle || "كاتب وصحفي")}</span>
          </div>
        </button>
      `;
    })
    .join("");

  listEl.querySelectorAll("[data-open-author]").forEach((btn) => {
    btn.addEventListener("click", () => openAuthorProfile(btn.getAttribute("data-open-author")));
  });
}

function renderAllHomeSections() {
  renderBreakingNewsBar();
  renderPublicAds();
  renderHeroAndPulseSection();
  renderPublicPostsFeed();
  renderWritersStrip();
}

// ------------------- نهاية الجزء الأول من محرك الموقع العام النظيف (حُجرية بريس) -------------------
