import type { TemplateMeta } from './template-types';

export interface TemplateCatalog {
    templates: TemplateMeta[];
    byId: Map<string, TemplateMeta>;
}

export function createTemplateCatalog(templates: TemplateMeta[]): TemplateCatalog {
    const byId = new Map<string, TemplateMeta>();

    for (const template of templates) {
        byId.set(template.id, template);
    }

    return {
        templates: [...templates],
        byId,
    };
}

export function resolveTemplateIds(
    catalog: TemplateCatalog,
    ids: string[],
): TemplateMeta[] {
    const result: TemplateMeta[] = [];

    for (const id of ids) {
        const template = catalog.byId.get(id);
        if (!template) {
            continue; // silently ignore unknown ids
        }

        result.push(template);
    }

    return result;
}