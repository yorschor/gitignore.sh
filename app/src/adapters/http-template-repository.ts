import type { LoadedTemplate, TemplateIndex, TemplateMeta } from '../lib/template-types';
import { assertTemplateIndex, sanitizeTemplateContent } from '../lib/template-validation';

export interface TemplateRepository {
    fetchIndex(signal?: AbortSignal): Promise<TemplateIndex>;
    fetchTemplateContent(template: TemplateMeta, signal?: AbortSignal): Promise<LoadedTemplate>;
}

function buildUrl(baseUrl: string, path: string): string {
    return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}

export function createHttpTemplateRepository(baseUrl: string): TemplateRepository {
    return {
        async fetchIndex(signal?: AbortSignal): Promise<TemplateIndex> {
            const response = await fetch(buildUrl(baseUrl, 'index.json'), { signal });

            if (!response.ok) {
                throw new Error(`Failed to load template index (${response.status}).`);
            }

            return assertTemplateIndex(await response.json());
        },

        async fetchTemplateContent(
            template: TemplateMeta,
            signal?: AbortSignal,
        ): Promise<LoadedTemplate> {
            const response = await fetch(buildUrl(baseUrl, template.path), { signal });

            if (!response.ok) {
                throw new Error(`Failed to load template "${template.id}" (${response.status}).`);
            }

            return {
                id: template.id,
                name: template.name,
                content: sanitizeTemplateContent(await response.text(), template.id),
            };
        },
    };
}