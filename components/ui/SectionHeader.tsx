import Link from "next/link";

type SectionHeaderProps = {
  actionHref?: string;
  actionLabel?: string;
  title: string;
};

export function SectionHeader({ actionHref, actionLabel, title }: SectionHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-caption">Collections</p>
        <h2 className="text-heading mt-2">{title}</h2>
      </div>

      {actionLabel ? (
        actionHref ? (
          <Link
            className="text-textSecondary hover:text-textPrimary text-sm font-semibold transition"
            href={actionHref}
          >
            {actionLabel}
          </Link>
        ) : (
          <button
            className="text-textSecondary hover:text-textPrimary text-sm font-semibold transition"
            type="button"
          >
            {actionLabel}
          </button>
        )
      ) : null}
    </div>
  );
}
