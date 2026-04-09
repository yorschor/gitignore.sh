import { AppCard } from '../layout/AppCard';
import { TemplateCategorySection } from './TemplateCategorySection';
import type { TemplateCategoryViewModel } from '../../view-models/template-groups';

interface TemplateGroupsPanelProps {
    groupedTemplates: TemplateCategoryViewModel[];
    selectedIds: string[];
    onToggle: (id: string) => void;
}

export function TemplateGroupsPanel({
    groupedTemplates,
    selectedIds,
    onToggle,
}: TemplateGroupsPanelProps) {
    return (
        <AppCard>
            <div className="template-groups-panel">
                {groupedTemplates.map((group) => (
                    <TemplateCategorySection
                        key={group.category}
                        category={group.category}
                        label={group.label}
                        icon={group.icon}
                        templates={group.templates}
                        selectedIds={selectedIds}
                        onToggle={onToggle}
                    />
                ))}
            </div>
        </AppCard>
    );
}