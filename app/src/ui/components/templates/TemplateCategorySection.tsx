import { useState } from "react";
import type { TemplateMeta } from "../../../lib/template-types";
import { TemplateChip } from "./TemplateChip";

interface TemplateCategorySectionProps {
    category: string;
    label: string;
    icon: string;
    templates: TemplateMeta[];
    selectedIds: string[];
    onToggle: (id: string) => void;
    defaultCollapsed?: boolean;
}

export function TemplateCategorySection({
    category,
    label,
    icon,
    templates,
    selectedIds,
    onToggle,
    defaultCollapsed = true,
}: TemplateCategorySectionProps) {
    const [collapsed, setCollapsed] = useState(defaultCollapsed);

    const selectedCount = templates.filter((template) =>
        selectedIds.includes(template.id),
    ).length;

    const gridId = `template-category-${category}-grid`;

    return (
        <section className={`template-category template-category--${category}`}>
            <button
                type="button"
                className="template-category__header template-category__header-button"
                onClick={() => setCollapsed((value) => !value)}
                aria-expanded={!collapsed}
                aria-controls={gridId}
            >
                <div className="template-category__title-row">
                    <div className="template-category__icon" aria-hidden="true">
                        {icon}
                    </div>

                    <h2 className="template-category__title">{label}</h2>
                </div>

                <span className="template-category__count">
                    {selectedCount > 0
                        ? `${selectedCount}/${templates.length} selected`
                        : `${templates.length} templates`}
                </span>

                <span className="template-category__chevron" aria-hidden="true">
                    {collapsed ? "▸" : "▾"}
                </span>
            </button>

            {!collapsed && (
                <div id={gridId} className="template-category__grid">
                    {templates.map((template) => (
                        <TemplateChip
                            key={template.id}
                            label={template.name}
                            selected={selectedIds.includes(template.id)}
                            onClick={() => onToggle(template.id)}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
