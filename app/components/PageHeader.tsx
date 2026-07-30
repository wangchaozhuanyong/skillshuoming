import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  meta?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  meta,
}: PageHeaderProps) {
  return (
    <header className="compact-page-header">
      <div className="container compact-page-header-layout">
        <div className="compact-page-header-copy">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
        {meta ? (
          <div className="compact-page-header-meta" aria-label="页面信息">
            {meta}
          </div>
        ) : null}
      </div>
    </header>
  );
}
