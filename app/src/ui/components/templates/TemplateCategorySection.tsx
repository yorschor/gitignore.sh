import type { TemplateMeta } from '../../../lib/template-types';
import { TemplateChip } from './TemplateChip';

interface TemplateCategorySectionProps {
    category: string;
    label: string;
    icon: string;
    templates: TemplateMeta[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export function TemplateCategorySection({
    category,
    label,
    icon,
    templates,
    selectedIds,
    onToggle,
}: TemplateCategorySectionProps) {
    return (
        <section className={`template-category template-category--${category}`}>
            <div className="template-category__header">
                <div className="template-category__title-row">
                    <div className="template-category__icon" aria-hidden="true">
                        {icon}
                    </div>

                    <h2 className="template-category__title">{label}</h2>
                </div>

                <span className="template-category__count">{templates.length} templates</span>
            </div>

            <div className="template-category__grid">
                {templates.map((template) => (
                    <TemplateChip
                        key={template.id}
                        label={template.name}
                        selected={selectedIds.includes(template.id)}
                        onClick={() => onToggle(template.id)}
                    />
                ))}
            </div>
        </section>
    );
}