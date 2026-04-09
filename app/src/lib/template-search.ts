import Fuse from 'fuse.js';
import type { TemplateMeta } from './template-types';

export function createTemplateSearch(templates: TemplateMeta[]): Fuse<TemplateMeta> {
    return new Fuse(templates, {
        includeScore: true,
        threshold: 0.34,
        ignoreLocation: true,
        minMatchCharLength: 2,
        keys: [
            { name: 'id', weight: 2.2 },
            { name: 'name', weight: 2.0 },
            { name: 'aliases', weight: 1.8 },
            { name: 'tags', weight: 1.2 },
            { name: 'category', weight: 0.8 },
            { name: 'description', weight: 0.7 },
        ],
    });
}

export function searchTemplates(
    query: string,
    templates: TemplateMeta[],
    fuse: Fuse<TemplateMeta>,
): TemplateMeta[] {
    const trimmed = query.trim();

    if (!trimmed) {
        return [...templates].sort((a, b) => a.name.localeCompare(b.name));
    }

    return fuse.search(trimmed).map((result) => result.item);
}