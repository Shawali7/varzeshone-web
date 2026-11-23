import { translate } from "../i18n";
import type { AppLanguage } from "../i18n";

type NotFoundPageProps = {
  language: AppLanguage;
  path: string;
  onHome: () => void;
};

export default function NotFoundPage({ language, path, onHome }: NotFoundPageProps) {
  return (
    <main className="not-found-page" aria-labelledby="not-found-title">
      <span className="not-found-code">404</span>
      <h1 id="not-found-title">{translate(language, "pageNotFound")}</h1>
      <p>
        {translate(language, "pageNotFoundNote")} <code>{path}</code>
      </p>
      <button type="button" className="primary-button" onClick={onHome}>
        {translate(language, "goToHome")}
      </button>
    </main>
  );
}
