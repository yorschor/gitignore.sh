import type { TemplateIndex, TemplateMeta } from './template-types';

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function isStringArray(value: unknown): value is string[] {
    return Array.isArray(value) && value.every((entry) => typeof entry === 'string');
}

function normalizeToken(value: string): string {
    return value.trim().toLowerCase();
}

function assertSafeRelativePath(path: string, templateId: string): string {
    const normalized = path.trim().replace(/\\/g, '/');

    if (!normalized) {
        throw new Error(`Template "${templateId}" is missing a valid path.`);
    }

    if (normalized.startsWith('/')) {
        throw new Error(`Template "${templateId}" path must be relative.`);
    }

    if (normalized.split('/').some((segment) => segment === '..' || segment.trim() === '')) {
        throw new Error(`Template "${templateId}" path is invalid.`);
    }

    return normalized;
}

function assertTemplateMeta(value: unknown, position: number): TemplateMeta {
    if (!isRecord(value)) {
        throw new Error(`Template at index ${position} is not an object.`);
    }

    const { id, name, aliases, category, tags, path, description } = value;

    if (typeof id !== 'string' || !id.trim()) {
        throw new Error(`Template at index ${position} is missing a valid id.`);
    }

    if (typeof name !== 'string' || !name.trim()) {
        throw new Error(`Template "${id}" is missing a valid name.`);
    }

    if (!isStringArray(aliases)) {
        throw new Error(`Template "${id}" has invalid aliases.`);
    }

    if (typeof category !== 'string' || !category.trim()) {
        throw new Error(`Template "${id}" is missing a valid category.`);
    }

    if (!isStringArray(tags)) {
        throw new Error(`Template "${id}" has invalid tags.`);
    }

    if (description !== undefined && typeof description !== 'string') {
        throw new Error(`Template "${id}" has an invalid description.`);
    }

    return {
        id: normalizeToken(id),
        name: name.trim(),
        aliases: aliases.map(normalizeToken).filter(Boolean),
        category: category.trim(),
        tags: tags.map((tag) => tag.trim()).filter(Boolean),
        path: assertSafeRelativePath(String(path ?? ''), String(id)),
        description: description?.trim() || undefined,
    };
}

export function assertTemplateIndex(value: unknown): TemplateIndex {
    if (!isRecord(value)) {
        throw new Error('Template index is not an object.');
    }

    const { version, generatedAt, templates } = value;

    if (version !== 1) {
        throw new Error(`Unsupported template index version: ${String(version)}.`);
    }

    if (typeof generatedAt !== 'string' || Number.isNaN(Date.parse(generatedAt))) {
        throw new Error('Template index is missing a valid generatedAt timestamp.');
    }

    if (!Array.isArray(templates)) {
        throw new Error('Template index is missing a templates array.');
    }

    const normalizedTemplates = templates.map(assertTemplateMeta);

    const seenIds = new Set<string>();

    for (const template of normalizedTemplates) {
        if (seenIds.has(template.id)) {
            throw new Error(`Duplicate template id "${template.id}".`);
        }

        seenIds.add(template.id);
    }

    return {
        version: 1,
        generatedAt,
        templates: normalizedTemplates,
    };
}

export function sanitizeTemplateContent(content: string, templateId: string): string {
    if (typeof content !== 'string') {
        throw new Error(`Template "${templateId}" did not return text content.`);
    }

    return content.replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

