const PARAM_NAME = 'templates';

function normalizeId(value: string): string {
    return value.trim().toLowerCase();
}

export function parseTemplateSelection(search: string): string[] {
    const params = new URLSearchParams(search);
    const raw = params.get(PARAM_NAME);

    if (!raw) {
        return [];
    }

    const seen = new Set<string>();
    const result: string[] = [];

    for (const value of raw.split(',')) {
        const id = normalizeId(value);

        if (!id || seen.has(id)) {
            continue;
        }

        seen.add(id);
        result.push(id);
    }

    return result;
}

export function serializeTemplateSelection(
    search: string,
    templateIds: string[],
): string {
    const params = new URLSearchParams(search);

    const seen = new Set<string>();
    const result: string[] = [];

    for (const id of templateIds) {
        const normalized = normalizeId(id);

        if (!normalized || seen.has(normalized)) {
            continue;
        }

        seen.add(normalized);
        result.push(normalized);
    }

    if (result.length > 0) {
        params.set(PARAM_NAME, result.join(','));
    } else {
        params.delete(PARAM_NAME);
    }

    const query = params.toString();
    return query ? `?${query}` : '';
}