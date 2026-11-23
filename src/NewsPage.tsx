import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Clock3,
  Flame,
  Search,
  TrendingUp,
} from "lucide-react";
import { translate } from "./i18n";
import type { AppLanguage, TranslationKey } from "./i18n";

type NewsArticle = {
  id: number;
  title: string;
  category: string;
  time: string;
  excerpt: string;
  featured?: boolean;
};

function getNewsArticles(t: (key: TranslationKey) => string): NewsArticle[] {
  return [
    { id: 1, title: t("newsArticle1Title"), category: t("newsArticle1Category"), time: t("newsTime2Hours"), excerpt: t("newsArticle1Excerpt"), featured: true },
    { id: 2, title: t("newsArticle2Title"), category: t("newsArticle2Category"), time: t("newsTime4Hours"), excerpt: t("newsArticle2Excerpt") },
    { id: 3, title: t("newsArticle3Title"), category: t("newsArticle3Category"), time: t("newsTime5Hours"), excerpt: t("newsArticle3Excerpt") },
    { id: 4, title: t("newsArticle4Title"), category: t("newsArticle4Category"), time: t("newsTime7Hours"), excerpt: t("newsArticle4Excerpt") },
    { id: 5, title: t("newsArticle5Title"), category: t("newsArticle5Category"), time: t("newsTime9Hours"), excerpt: t("newsArticle5Excerpt") },
    { id: 6, title: t("newsArticle6Title"), category: t("newsArticle6Category"), time: t("newsTime11Hours"), excerpt: t("newsArticle6Excerpt") },
    { id: 7, title: t("newsArticle7Title"), category: t("newsArticle7Category"), time: t("newsTime12Hours"), excerpt: t("newsArticle7Excerpt") },
  ];
}

type NewsPageProps = {
  language: AppLanguage;
};

function NewsPage({ language }: NewsPageProps) {
  const t = (key: TranslationKey) => translate(language, key);
  const articles = useMemo(
    () => getNewsArticles((key) => translate(language, key)),
    [language],
  );
  const trending = [t("newsArticle2Category"), t("newsArticle3Category"), t("newsArticle4Category"), t("newsArticle5Category"), t("newsArticle7Category")];
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
  }, [articles, searchQuery, selectedTopic]);

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
            <h1>{t("newsPageTitle")}</h1>
            <p>{t("newsPageSubtitle")}</p>
          </div>

          <div className="news-search">
            <Search size={17} />
            <input
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                setShowAll(false);
              }}
              placeholder={t("newsSearchPlaceholder")}
              aria-label={t("newsSearchPlaceholder")}
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
            {t("newsFeatured")}
          </button>

          <button
            className={activeTab === "latest" ? "active" : ""}
            aria-pressed={activeTab === "latest"}
            onClick={() => {
              setActiveTab("latest");
              setShowAll(false);
            }}
          >
            {t("newsLatest")}
          </button>
        </div>

        {selectedTopic && (
          <div className="news-section-title">
            <div>
              <h2>{selectedTopic}</h2>
              <span>خبرهای مرتبط با موضوع انتخاب‌شده</span>
            </div>
            <button onClick={resetFilters}>{t("clearFilters")}</button>
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
                <h2>{activeTab === "latest" ? t("newsLatest") : t("newsFeatured")}</h2>
                <span>{language === "en" ? "Latest news" : language === "ps-AF" ? "وروستي خبرونه" : "آخرین اخبار"}</span>
              </div>

              {listArticles.length > 4 && (
                <button onClick={() => setShowAll((current) => !current)}>
                  {showAll ? t("showLess") : t("showMore")}
                  <ArrowLeft size={15} />
                </button>
              )}
            </div>

            {filteredArticles.length === 0 ? (
              <div className="news-sidebar-card" role="status">
                <div className="news-card-content">
                  <h3>{t("newsNoResults")}</h3>
                  <p>{t("newsNoResultsNote")}</p>
                  <button
                    className="news-section-title"
                    onClick={resetFilters}
                  >
                    {t("clearNewsFilters")}
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
                <h2>{t("trending")}</h2>
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
                <h2>{t("popularNews")}</h2>
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