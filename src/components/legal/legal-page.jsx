"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import { legalContent } from "@/data/legal-content";

export default function LegalPage({ kind }) {
  const { i18n } = useTranslation("common");
  const language = (i18n.resolvedLanguage || i18n.language || "mn").split("-")[0];
  const content = (legalContent[language] || legalContent.mn)[kind];
  const relatedUrl = kind === "terms" ? "/privacy" : "/terms";

  return (
    <>
      <HeaderTwo />
      <main className="container py-5">
        <div className="row justify-content-center">
          <article className="col-lg-9 col-xl-8">
            <header className="mb-5">
              <h1 className="mb-3">{content.title}</h1>
              <p className="lead mb-0">{content.intro}</p>
            </header>

            {content.sections.map((section) => (
              <section key={section.title} className="mb-4 pb-3 border-bottom">
                <h2 className="h4 mb-3">{section.title}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="mb-3">{paragraph}</p>
                ))}
              </section>
            ))}

            <Link href={relatedUrl} className="tp-btn tp-btn-border">
              {content.related}
            </Link>
          </article>
        </div>
      </main>
      <Footer primary_style={true} />
    </>
  );
}
