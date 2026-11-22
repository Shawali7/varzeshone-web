import {
  ArrowUpRight,
  BrainCircuit,
  Eye,
  Globe2,
  Handshake,
  ShieldCheck,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import "./AboutPage.css";

type AppLanguage = "fa-AF" | "ps-AF" | "en";

type AboutPageProps = {
  language: AppLanguage;
};

const content = {
  "fa-AF": {
    eyebrow: "دربارهٔ ورزش وان",
    title: "ورزش افغانستان،",
    titleAccent: "یک تجربهٔ دیجیتال",
    description:
      "ورزش وان بستری دیجیتال برای دنبال‌کردن مسابقات، لیگ‌ها، تیم‌ها و بازیکنان فوتبال و فوتسال افغانستان است.",
    missionTitle: "مأموریت ما",
    mission:
      "فراهم‌کردن دسترسی آسان، منظم و قابل اعتماد به اطلاعات ورزش افغانستان و نزدیک‌تر ساختن هواداران به تیم‌ها و مسابقات.",
    visionTitle: "چشم‌انداز ما",
    vision:
      "ساخت یک پلتفرم جامع ورزشی که به رشد، دیده‌شدن و توسعهٔ ورزش افغانستان کمک کند.",
    servicesTitle: "در ورزش وان چه پیدا می‌کنید؟",
    servicesSubtitle:
      "ابزارهای مورد نیاز برای دنبال‌کردن دنیای فوتبال و فوتسال در یک پلتفرم.",
    services: [
      ["مسابقات و نتایج", "برنامهٔ بازی‌ها، نتایج و وضعیت مسابقات"],
      ["لیگ‌ها و جدول‌ها", "اطلاعات رقابت‌ها و جایگاه تیم‌ها"],
      ["تیم‌ها و بازیکنان", "پروفایل و اطلاعات تیم‌ها و بازیکنان"],
      ["اخبار ورزشی", "پیگیری تازه‌ترین رویدادهای فوتبال و فوتسال"],
      ["آمار و تحلیل", "دسترسی به آمار و تحلیل‌های ورزشی"],
      ["قابلیت‌های هوشمند", "زمینه‌سازی برای تحلیل و گزارش‌دهی هوشمند"],
    ],
    focusTitle: "تمرکز ما",
    focusDescription:
      "شروع کار ورزش وان با فوتبال و فوتسال هرات است؛ با برنامهٔ توسعهٔ تدریجی به دیگر رقابت‌ها و مناطق افغانستان.",
    valuesTitle: "اصول ما",
    values: [
      ["دقت و اعتماد", "ارائهٔ اطلاعات روشن و قابل اتکا"],
      ["دسترسی آسان", "تجربه‌ای ساده در موبایل و وب"],
      ["رشد ورزش", "حمایت از دیده‌شدن تیم‌ها و بازیکنان"],
    ],
    futureTitle: "مسیر توسعه",
    futureDescription:
      "ورزش وان با رویکرد مرحله‌ای توسعه می‌یابد؛ از پوشش مسابقات و اطلاعات پایه تا تحلیل، گزارش‌دهی و ابزارهای هوشمند ورزشی.",
    contactTitle: "همکاری با ورزش وان",
    contactDescription:
      "باشگاه‌ها، فدراسیون‌ها، رسانه‌ها و علاقه‌مندان ورزش می‌توانند برای توسعهٔ این پلتفرم با ما همکاری کنند.",
    footer: "ورزش وان؛ همراه دنیای فوتبال و فوتسال افغانستان.",
  },
  "ps-AF": {
    eyebrow: "د ورزش وان په اړه",
    title: "د افغانستان ورزش،",
    titleAccent: "یوه ډیجیټلي تجربه",
    description:
      "ورزش وان یو ډیجیټلي پلېټفارم دی چې د افغانستان د فوټبال او فوټسال سیالۍ، لیګونه، لوبډلې او لوبغاړي پکې تعقیبولای شئ.",
    missionTitle: "زموږ ماموریت",
    mission:
      "د افغانستان د ورزش معلوماتو ته اسانه او باوري لاسرسی برابرول او مینه‌وال له لوبډلو او سیالیو سره نږدې کول.",
    visionTitle: "زموږ لیدلوری",
    vision:
      "د یوه جامع ورزشي پلېټفارم جوړول چې د افغانستان د ورزش له ودې او پېژندنې سره مرسته وکړي.",
    servicesTitle: "په ورزش وان کې څه موندلای شئ؟",
    servicesSubtitle: "د فوټبال او فوټسال د نړۍ د تعقیب لپاره اړین امکانات.",
    services: [
      ["سیالۍ او پایلې", "د لوبو مهالوېش، پایلې او حالت"],
      ["لیګونه او جدولونه", "د سیالیو معلومات او د لوبډلو مقامونه"],
      ["لوبډلې او لوبغاړي", "د لوبډلو او لوبغاړو پېژندپاڼې"],
      ["ورزشي خبرونه", "د فوټبال او فوټسال تازه خبرونه"],
      ["احصایې او شننه", "ورزشي شمېرې او شننې"],
      ["هوښیار امکانات", "د هوښیارې شننې او راپورونو لپاره زمینه"],
    ],
    focusTitle: "زموږ تمرکز",
    focusDescription:
      "د ورزش وان پیل د هرات له فوټبال او فوټسال څخه دی، او موخه یې د افغانستان نورو سیمو او سیالیو ته پراختیا ده.",
    valuesTitle: "زموږ اصول",
    values: [
      ["دقت او باور", "روښانه او باوري معلومات"],
      ["اسانه لاسرسی", "په موبایل او وېب کې ساده تجربه"],
      ["د ورزش وده", "د لوبډلو او لوبغاړو پېژندنه"],
    ],
    futureTitle: "د پراختیا لاره",
    futureDescription:
      "ورزش وان په پړاوونو کې پراختیا مومي؛ له سیالیو او بنسټیزو معلوماتو څخه تر شننې او هوښیارو ورزشي وسایلو پورې.",
    contactTitle: "له ورزش وان سره همکاري",
    contactDescription:
      "کلبونه، فدراسیونونه، رسنۍ او د ورزش مینه‌وال زموږ د پلېټفارم په پراختیا کې همکاري کولای شي.",
    footer: "ورزش وان؛ د افغانستان د فوټبال او فوټسال ملګری.",
  },
  en: {
    eyebrow: "ABOUT VARZESHONE",
    title: "Afghan sports,",
    titleAccent: "a digital experience",
    description:
      "VarzeshOne is a digital platform for following football and futsal competitions, leagues, teams and players across Afghanistan.",
    missionTitle: "Our mission",
    mission:
      "To make Afghan sports information easier to access, more organized and more reliable, bringing fans closer to their teams and competitions.",
    visionTitle: "Our vision",
    vision:
      "To build a comprehensive sports platform that supports the growth, visibility and development of sports in Afghanistan.",
    servicesTitle: "What you can find on VarzeshOne",
    servicesSubtitle:
      "The tools you need to follow the world of football and futsal in one place.",
    services: [
      ["Matches & results", "Fixtures, scores and match status"],
      ["Leagues & tables", "Competition information and team standings"],
      ["Teams & players", "Team and player profiles"],
      ["Sports news", "Updates from football and futsal"],
      ["Stats & analysis", "Access to sports statistics and analysis"],
      ["Smart features", "A foundation for intelligent analysis and reporting"],
    ],
    focusTitle: "Our focus",
    focusDescription:
      "VarzeshOne starts with football and futsal in Herat, with a gradual expansion plan for other competitions and regions of Afghanistan.",
    valuesTitle: "Our principles",
    values: [
      ["Accuracy & trust", "Clear and dependable information"],
      ["Easy access", "A simple experience on mobile and web"],
      ["Sports development", "Supporting the visibility of teams and players"],
    ],
    futureTitle: "Our roadmap",
    futureDescription:
      "VarzeshOne is being developed in stages, from match coverage and core information to analysis, reporting and intelligent sports tools.",
    contactTitle: "Partner with VarzeshOne",
    contactDescription:
      "Clubs, federations, media organizations and sports enthusiasts can contribute to the development of this platform.",
    footer: "VarzeshOne; following Afghan football and futsal.",
  },
} as const;

const serviceIcons = [
  Trophy,
  Globe2,
  Users,
  ShieldCheck,
  Target,
  BrainCircuit,
];

export default function AboutPage({ language }: AboutPageProps) {
  const t = content[language];
  const isRTL = language !== "en";

  return (
    <main className="about-page" dir={isRTL ? "rtl" : "ltr"}>
      <section className="about-hero">
        <div className="about-hero-glow" />
        <div className="about-container about-hero-content">
          <span className="about-eyebrow">{t.eyebrow}</span>
          <h1>
            {t.title}
            <span>{t.titleAccent}</span>
          </h1>
          <p>{t.description}</p>
          <div className="about-hero-mark">
            <Trophy size={27} />
            <span>VARZESHONE</span>
          </div>
        </div>
      </section>

      <section className="about-container about-intro-grid">
        <article className="about-info-card">
          <div className="about-icon"><Target size={23} /></div>
          <h2>{t.missionTitle}</h2>
          <p>{t.mission}</p>
        </article>
        <article className="about-info-card">
          <div className="about-icon"><Eye size={23} /></div>
          <h2>{t.visionTitle}</h2>
          <p>{t.vision}</p>
        </article>
      </section>

      <section className="about-container about-services">
        <div className="about-section-heading">
          <span className="about-eyebrow">{t.eyebrow}</span>
          <h2>{t.servicesTitle}</h2>
          <p>{t.servicesSubtitle}</p>
        </div>
        <div className="about-service-grid">
          {t.services.map(([title, description], index) => {
            const Icon = serviceIcons[index];
            return (
              <article className="about-service-card" key={title}>
                <div className="about-icon"><Icon size={22} /></div>
                <h3>{title}</h3>
                <p>{description}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="about-focus">
        <div className="about-container about-focus-inner">
          <div className="about-focus-symbol"><Trophy size={34} /></div>
          <div>
            <span className="about-eyebrow">{t.eyebrow}</span>
            <h2>{t.focusTitle}</h2>
            <p>{t.focusDescription}</p>
          </div>
        </div>
      </section>

      <section className="about-container about-values">
        <div className="about-section-heading">
          <h2>{t.valuesTitle}</h2>
        </div>
        <div className="about-values-grid">
          {t.values.map(([title, description], index) => (
            <article className="about-value-item" key={title}>
              <span className="about-value-number">0{index + 1}</span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="about-container about-future">
        <div className="about-future-icon"><BrainCircuit size={28} /></div>
        <div>
          <h2>{t.futureTitle}</h2>
          <p>{t.futureDescription}</p>
        </div>
        <ArrowUpRight className="about-future-arrow" size={25} />
      </section>

      <section className="about-container about-contact">
        <div className="about-contact-icon"><Handshake size={27} /></div>
        <h2>{t.contactTitle}</h2>
        <p>{t.contactDescription}</p>
      </section>

      <footer className="about-footer">
        <div className="about-container">{t.footer}</div>
      </footer>
    </main>
  );
}