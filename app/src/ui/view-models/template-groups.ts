import type { TemplateMeta } from '../../lib/template-types';

export interface TemplateCategoryViewModel {
    category: string;
    label: string;
    icon: string;
    templates: TemplateMeta[];
}

interface CategoryPresentation {
    label: string;
    icon: string;
}

const CATEGORY_PRESENTATION: Record<string, CategoryPresentation> = {
    language: {
        label: 'Languages',
        icon: '</>',
    },
    framework: {
        label: 'Frameworks',
        icon: '◈',
    },
    ide: {
        label: 'IDEs',
        icon: '▣',
    },
    os: {
        label: 'OS',
        icon: '◰',
    },
};

function getCategoryPresentation(category: string): CategoryPresentation {
    return (
        CATEGORY_PRESENTATION[category] ?? {
            label: category,
            icon: '•',
        }
    );
}

export function groupTemplatesByCategory(
    templates: TemplateMeta[],
): TemplateCategoryViewModel[] {
    const groups = new Map<string, TemplateMeta[]>();

    for (const template of templates) {
        const existing = groups.get(template.category) ?? [];
        existing.push(template);
        groups.set(template.category, existing);
    }

    return [...groups.entries()].map(([category, groupedTemplates]) => {
        const presentation = getCategoryPresentation(category);

        return {
            category,
            label: presentation.label,
            icon: presentation.icon,
            templates: [...groupedTemplates].sort((a, b) => a.name.localeCompare(b.name)),
        };
    });
}