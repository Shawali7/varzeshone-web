import type { MouseEvent } from "react";
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";

type LegalNoticeKind = "terms" | "privacy";

type LegalNoticePageProps = {
  kind: LegalNoticeKind;
  language: AppLanguage;
  onNavigate: (path: string) => void;
};

function navigateLink(
  event: MouseEvent<HTMLAnchorElement>,
  path: string,
  onNavigate: (path: string) => void,
): void {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return;
  }

  event.preventDefault();
  onNavigate(path);
}

export default function LegalNoticePage({
  kind,
  language,
  onNavigate,
}: LegalNoticePageProps) {
  const isTerms = kind === "terms";
  const titleKey: TranslationKey = isTerms
    ? "legalTermsTitle"
    : "legalPrivacyTitle";
  const noticeKey: TranslationKey = isTerms
    ? "legalTermsNotice"
    : "legalPrivacyNotice";

  return (
    <main
      className="legal-notice-page"
      dir={language === "en" ? "ltr" : "rtl"}
      aria-labelledby="legal-notice-title"
    >
      <div className="legal-notice-shell">
        <a
          className="legal-notice-home"
          href="/"
          onClick={(event) => navigateLink(event, "/", onNavigate)}
        >
          {translate(language, "legalNoticeHome")}
        </a>

        <article className="legal-notice-content">
          <span className="legal-notice-label">
            {translate(language, "legalNoticeNotPublished")}
          </span>
          <h1 id="legal-notice-title">{translate(language, titleKey)}</h1>
          <p>{translate(language, noticeKey)}</p>
          <a
            className="auth-inline-link"
            href="/sign-in"
            onClick={(event) => navigateLink(event, "/sign-in", onNavigate)}
          >
            {translate(language, "legalNoticeBackToSignIn")}
          </a>
        </article>
      </div>
    </main>
  );
}
