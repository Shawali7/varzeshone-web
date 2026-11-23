import { useState } from "react";
import type { FormEvent, MouseEvent } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { translate } from "../i18n";
import type { AppLanguage, TranslationKey } from "../i18n";

export type AuthMode = "sign-in" | "register" | "forgot-password";

type AuthPageProps = {
  mode: AuthMode;
  language: AppLanguage;
  onNavigate: (path: string) => void;
};

type AuthField = "fullName" | "identifier" | "password" | "confirmPassword";
type AuthErrors = Partial<Record<AuthField, string>>;

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

function normalizeDigits(value: string): string {
  return value
    .replace(/[۰-۹]/g, (digit) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit)))
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)));
}

function isValidIdentifier(value: string): boolean {
  const normalized = normalizeDigits(value.trim());
  const email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);
  const phone = /^\+?[\d\s()-]{7,20}$/.test(normalized) &&
    normalized.replace(/\D/g, "").length >= 7 &&
    normalized.replace(/\D/g, "").length <= 15;
  return email || phone;
}

export default function AuthPage({ mode, language, onNavigate }: AuthPageProps) {
  const [fullName, setFullName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<AuthErrors>({});
  const [feedback, setFeedback] = useState("");

  const t = (key: TranslationKey) => translate(language, key);
  const isRegister = mode === "register";
  const isForgotPassword = mode === "forgot-password";
  const titleKey: TranslationKey = isRegister
    ? "authRegisterTitle"
    : isForgotPassword
      ? "authForgotTitle"
      : "authSignInTitle";
  const descriptionKey: TranslationKey = isRegister
    ? "authRegisterDescription"
    : isForgotPassword
      ? "authForgotDescription"
      : "authSignInDescription";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFeedback("");

    const nextErrors: AuthErrors = {};
    if (isRegister && !fullName.trim()) {
      nextErrors.fullName = t("authNameRequired");
    }

    if (!identifier.trim()) {
      nextErrors.identifier = t("authIdentifierRequired");
    } else if (!isValidIdentifier(identifier)) {
      nextErrors.identifier = t("authIdentifierInvalid");
    }

    if (!isForgotPassword) {
      if (!password) {
        nextErrors.password = t("authPasswordRequired");
      } else if (isRegister && password.length < 8) {
        nextErrors.password = t("authPasswordTooShort");
      }
    }

    if (isRegister) {
      if (!confirmPassword) {
        nextErrors.confirmPassword = t("authConfirmRequired");
      } else if (password !== confirmPassword) {
        nextErrors.confirmPassword = t("authPasswordMismatch");
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const feedbackKey: TranslationKey = isRegister
      ? "authDemoRegisterSuccess"
      : isForgotPassword
        ? "authDemoForgotSuccess"
        : "authSignInSubmitNotice";
    setFeedback(t(feedbackKey));
  };

  const renderError = (field: AuthField) => errors[field] ? (
    <span className="auth-field-error" id={`auth-${field}-error`} role="alert">
      {errors[field]}
    </span>
  ) : null;

  const passwordInput = (
    field: "password" | "confirmPassword",
    value: string,
    setValue: (value: string) => void,
    visible: boolean,
    setVisible: (visible: boolean) => void,
    labelKey: TranslationKey,
    placeholderKey: TranslationKey,
  ) => {
    const error = errors[field];
    return (
      <label className="auth-field" htmlFor={`auth-${field}`}>
        <span className="auth-field-label">{t(labelKey)}</span>
        <span className={`auth-input-wrap auth-password-wrap ${error ? "has-error" : ""}`}>
          <LockKeyhole size={18} aria-hidden="true" />
          <input
            id={`auth-${field}`}
            name={field}
            type={visible ? "text" : "password"}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={t(placeholderKey)}
            autoComplete={isRegister ? "new-password" : "current-password"}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `auth-${field}-error` : undefined}
          />
          <button
            className="auth-password-toggle"
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={t(visible ? "authHidePassword" : "authShowPassword")}
            aria-pressed={visible}
          >
            {visible ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        </span>
        {renderError(field)}
      </label>
    );
  };

  const identifierError = errors.identifier;

  return (
    <main
      className={`auth-page ${mode === "sign-in" ? "auth-page-sign-in" : ""}`}
      dir={language === "en" ? "ltr" : "rtl"}
    >
      <div className={`auth-shell ${mode === "sign-in" ? "auth-shell-sign-in" : ""}`}>
        <button
          type="button"
          className="auth-brand"
          onClick={() => onNavigate("/")}
          aria-label={t("legalNoticeHome")}
        >
          <span className="auth-brand-mark">V</span>
          <span className="auth-brand-copy">
            <strong>ورزش وان</strong>
            <small>VARZESHONE</small>
          </span>
        </button>

        <section
          className={`auth-card ${mode === "sign-in" ? "auth-card-sign-in" : ""}`}
          aria-labelledby="auth-title"
        >
          {mode !== "sign-in" && (
            <>
              <div className="auth-emblem" aria-hidden="true">
                {isRegister ? <UserRound size={23} /> : <ShieldCheck size={23} />}
              </div>
              <p className="auth-eyebrow">{t("authDemoNotice")}</p>
            </>
          )}
          <h1 id="auth-title">{t(titleKey)}</h1>
          <p className="auth-description">{t(descriptionKey)}</p>

          {mode === "sign-in" && (
            <p className="auth-sign-in-notice" role="note">
              {t("authSignInUnavailable")}
            </p>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            {isRegister && (
              <label className="auth-field" htmlFor="auth-full-name">
                <span className="auth-field-label">{t("authFullName")}</span>
                <span className={`auth-input-wrap ${errors.fullName ? "has-error" : ""}`}>
                  <UserRound size={18} aria-hidden="true" />
                  <input
                    id="auth-full-name"
                    name="name"
                    type="text"
                    value={fullName}
                    onChange={(event) => setFullName(event.target.value)}
                    placeholder={t("authNamePlaceholder")}
                    autoComplete="name"
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={errors.fullName ? "auth-fullName-error" : undefined}
                  />
                </span>
                {renderError("fullName")}
              </label>
            )}

            <label className="auth-field" htmlFor="auth-identifier">
              <span className="auth-field-label">{t("authEmailOrPhone")}</span>
              <span className={`auth-input-wrap ${identifierError ? "has-error" : ""}`}>
                <UserRound size={18} aria-hidden="true" />
                <input
                  id="auth-identifier"
                  name="identifier"
                  type="text"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  placeholder={t("authIdentifierPlaceholder")}
                  autoComplete="username"
                  aria-invalid={Boolean(identifierError)}
                  aria-describedby={identifierError ? "auth-identifier-error" : undefined}
                />
              </span>
              {renderError("identifier")}
            </label>

            {!isForgotPassword && passwordInput(
              "password",
              password,
              setPassword,
              showPassword,
              setShowPassword,
              "authPassword",
              "authPasswordPlaceholder",
            )}

            {isRegister && passwordInput(
              "confirmPassword",
              confirmPassword,
              setConfirmPassword,
              showConfirmPassword,
              setShowConfirmPassword,
              "authConfirmPassword",
              "authConfirmPlaceholder",
            )}

            {!isRegister && !isForgotPassword && (
              <a
                href="/forgot-password"
                className="auth-inline-link auth-forgot-link"
                onClick={(event) => navigateLink(event, "/forgot-password", onNavigate)}
              >
                {t("authForgotPassword")}
              </a>
            )}

            {feedback && <p className="auth-feedback" role="status">{feedback}</p>}

            <button type="submit" className="auth-submit">
              {t(isRegister ? "authRegisterAction" : isForgotPassword ? "authForgotAction" : "authSignInAction")}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </form>

          <div className="auth-footer">
            {isForgotPassword ? (
              <a
                className="auth-inline-link"
                href="/sign-in"
                onClick={(event) => navigateLink(event, "/sign-in", onNavigate)}
              >
                {t("authBackToSignIn")}
              </a>
            ) : isRegister ? (
              <>
                <span>{t("authAlreadyHaveAccount")}</span>
                <a
                  className="auth-inline-link"
                  href="/sign-in"
                  onClick={(event) => navigateLink(event, "/sign-in", onNavigate)}
                >
                  {t("authSignIn")}
                </a>
              </>
            ) : (
              <>
                <span>{t("authNeedAccount")}</span>
                <a
                  className="auth-inline-link"
                  href="/register"
                  onClick={(event) => navigateLink(event, "/register", onNavigate)}
                >
                  {t("authCreateAccount")}
                </a>
              </>
            )}
          </div>

          {mode === "sign-in" && (
            <nav className="auth-policy-links" aria-label={t("authLegalLinks")}>
              <a
                href="/terms"
                onClick={(event) => navigateLink(event, "/terms", onNavigate)}
              >
                {t("authTermsOfUse")}
              </a>
              <span aria-hidden="true">·</span>
              <a
                href="/privacy"
                onClick={(event) => navigateLink(event, "/privacy", onNavigate)}
              >
                {t("authPrivacyPolicy")}
              </a>
            </nav>
          )}
        </section>

        {mode !== "sign-in" && (
          <p className="auth-page-footnote">VARZESHONE · FOOTBALL & FUTSAL</p>
        )}
      </div>
    </main>
  );
}
