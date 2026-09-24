export default function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md">
      <div className="flex flex-col gap-space-xs max-w-3xl">
        {eyebrow && (
          <span className="inline-flex w-fit items-center gap-space-xxs px-space-xs py-space-xxs rounded bg-secondary-container text-on-secondary-container font-label-sm text-label-sm uppercase tracking-wider">
            {eyebrow}
          </span>
        )}
        <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-xl md:text-headline-xl text-on-surface">
          {title}
        </h1>
        {description && <p className="font-body-lg text-body-lg text-on-surface-variant">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-space-sm">{actions}</div>}
    </div>
  );
}
