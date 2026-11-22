import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Flame,
  Search,
  TrendingUp,
} from "lucide-react";

type NewsArticle = {
  id: number;
  title: string;
  category: string;
  time: string;
  excerpt: string;
  featured?: boolean;
};

const articles: NewsArticle[] = [
  {
    id: 1,
    title: "برنامه جدید مسابقات فوتبال افغانستان اعلام شد",
    category: "فوتبال افغانستان",
    time: "2 ساعت پیش",
    excerpt:
      "برنامه جدید رقابت‌های فوتبال افغانستان اعلام شد و تیم‌ها برای هفته پیش‌رو آماده می‌شوند.",
    featured: true,
  },
  {
    id: 2,
    title: "رقابت‌های لیگ برتر افغانستان با حضور تیم‌های جدید",
    category: "لیگ برتر افغانستان",
    time: "4 ساعت پیش",
    excerpt:
      "تیم‌های حاضر در رقابت‌های این فصل برای ادامه مسابقات آماده می‌شوند.",
  },
  {
    id: 3,
    title: "آمادگی تیم‌های هرات برای مسابقات پیش‌رو",
    category: "هرات",
    time: "5 ساعت پیش",
    excerpt:
      "تیم‌های هرات تمرینات خود را برای مسابقات آینده با جدیت دنبال می‌کنند.",
  },
  {
    id: 4,
    title: "برنامه مسابقات فوتسال افغانستان اعلام شد",
    category: "فوتسال",
    time: "7 ساعت پیش",
    excerpt:
      "برنامه جدید مسابقات فوتسال افغانستان منتشر شد.",
  },
  {
    id: 5,
    title: "تیم‌های کابل آماده هفته جدید رقابت‌ها",
    category: "کابل",
    time: "9 ساعت پیش",
    excerpt:
      "تیم‌های فوتبال کابل برای دیدارهای هفته جدید آماده می‌شوند.",
  },
  {
    id: 6,
    title: "رقابت‌های فوتسال هرات با دیدارهای جذاب ادامه پیدا می‌کند",
    category: "فوتسال هرات",
    time: "11 ساعت پیش",
    excerpt:
      "هفته جدید رقابت‌های فوتسال هرات با چند دیدار مهم دنبال خواهد شد.",
  },
  {
    id: 7,
    title: "تیم ملی افغانستان برای دیدارهای آینده آماده می‌شود",
    category: "تیم ملی افغانستان",
    time: "12 ساعت پیش",
    excerpt:
      "بازیکنان تیم ملی افغانستان تمرینات خود را برای حضور در رقابت‌ها و دیدارهای پیش‌رو دنبال می‌کنند.",
  },
];

const trending = [
  "لیگ برتر افغانستان",
  "فوتبال هرات",
  "فوتسال افغانستان",
  "لیگ کابل",
  "تیم ملی افغانستان",
];

function NewsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"for-you" | "latest">("for-you");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredArticles = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return articles.filter((article) => {
      const searchableText = [
        article.title,
        article.category,
        article.excerpt,
      ].join(" ").toLocaleLowerCase();

      const matchesSearch = !query || searchableText.includes(query);

      const topicTerms: Record<string, string[]> = {
        "فوتبال هرات": ["هرات"],
        "فوتسال افغانستان": ["فوتسال"],
        "لیگ کابل": ["کابل"],
        "تیم ملی افغانستان": ["تیم ملی افغانستان"],
      };

      const terms = topicTerms[selectedTopic] ?? [selectedTopic];
      const matchesTopic =
        !selectedTopic ||
        terms.some((term) => searchableText.includes(term));

      return matchesSearch && matchesTopic;
    });
  }, [searchQuery, selectedTopic]);

  const featuredArticle =
    activeTab === "for-you"
      ? filteredArticles.find((article) => article.featured)
      : undefined;

  const listArticles =
    activeTab === "for-you"
      ? filteredArticles.filter((article) => !article.featured)
      : filteredArticles;

  const visibleArticles = showAll
    ? listArticles
    : listArticles.slice(0, 4);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedTopic("");
    setShowAll(false);
  };

  return (
    <main className="news-page">
      <div className="news-page-inner">
        <div className="news-page-header">
          <div>
            <span className="news-eyebrow">VARZESHONE NEWS</span>
            <h1>اخبار فوتبال افغانستان</h1>
            <p>
              آخرین اخبار، گزارش‌ها و رویدادهای فوتبال و فوتسال افغانستان
            </p>
          </div>

          <div className="news-search">
            <Search size={17} />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowAll(false);
              }}
              placeholder="جستجوی اخبار..."
              aria-label="جستجوی اخبار"
            />
          </div>
        </div>

        <div className="news-tabs">
          <button
            className={activeTab === "for-you" ? "active" : ""}
            aria-pressed={activeTab === "for-you"}
            onClick={() => {
              setActiveTab("for-you");
              setShowAll(false);
            }}
          >
            Featured
          </button>

          <button
            className={activeTab === "latest" ? "active" : ""}
            aria-pressed={activeTab === "latest"}
            onClick={() => {
              setActiveTab("latest");
              setShowAll(false);
            }}
          >
            Latest
          </button>
        </div>

        {selectedTopic && (
          <div className="news-section-title">
            <div>
              <h2>{selectedTopic}</h2>
              <span>خبرهای مرتبط با موضوع انتخاب‌شده</span>
            </div>
            <button onClick={resetFilters}>پاک‌کردن فیلتر</button>
          </div>
        )}

        <div className="news-layout">
          <section className="news-main-column">
            {featuredArticle && (
              <article className="news-feature-card">
                <div className="news-feature-image">
                  <div className="news-image-overlay">
                    <span>{featuredArticle.category}</span>
                  </div>
                </div>

                <div className="news-feature-content">
                  <span className="news-category">
                    {featuredArticle.category}
                  </span>

                  <h2>{featuredArticle.title}</h2>
                  <p>{featuredArticle.excerpt}</p>

                  <div className="news-meta">
                    <Clock3 size={14} />
                    <span>{featuredArticle.time}</span>
                    <span className="news-dot">•</span>
                    <span>ورزش وان</span>
                  </div>
                </div>
              </article>
            )}

            <div className="news-section-title">
              <div>
                <h2>
                  {activeTab === "latest" ? "Latest News" : "Featured News"}
                </h2>
                <span>آخرین اخبار</span>
              </div>

              {listArticles.length > 4 && (
                <button onClick={() => setShowAll((current) => !current)}>
                  {showAll ? "نمایش کمتر" : "نمایش همه"}
                  <ArrowLeft size={15} />
                </button>
              )}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="news-sidebar-card" role="status">
                <div className="news-card-content">
                  <h3>خبری پیدا نشد</h3>
                  <p>
                    برای جستجو یا موضوع انتخاب‌شده خبری موجود نیست.
                  </p>
                  <button
                    className="news-section-title"
                    onClick={resetFilters}
                  >
                    پاک‌کردن جستجو و فیلترها
                  </button>
                </div>
              </div>
            ) : (
              <div className="news-grid">
                {visibleArticles.map((article) => (
                  <article className="news-card-large" key={article.id}>
                    <div className="news-card-image">
                      <span>{article.category}</span>
                    </div>

                    <div className="news-card-content">
                      <span className="news-category">
                        {article.category}
                      </span>

                      <h3>{article.title}</h3>
                      <p>{article.excerpt}</p>

                      <div className="news-meta">
                        <Clock3 size={13} />
                        <span>{article.time}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="news-sidebar">
            <section className="news-sidebar-card">
              <div className="news-sidebar-title">
                <Flame size={17} />
                <h2>Trending</h2>
              </div>

              <div className="trending-list">
                {trending.map((item, index) => (
                  <button
                    className={`trending-item ${
                      selectedTopic === item ? "active" : ""
                    }`}
                    key={item}
                    aria-pressed={selectedTopic === item}
                    onClick={() => {
                      setSelectedTopic((current) =>
                        current === item ? "" : item
                      );
                      setShowAll(false);
                    }}
                  >
                    <span className="trending-number">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="news-sidebar-card">
              <div className="news-sidebar-title">
                <TrendingUp size={17} />
                <h2>محبوب‌ترین اخبار</h2>
              </div>

              <div className="popular-news">
                {articles.slice(1, 4).map((article, index) => (
                  <article className="popular-news-item" key={article.id}>
                    <span>{index + 1}</span>
                    <div>
                      <h3>{article.title}</h3>
                      <small>{article.time}</small>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default NewsPage;