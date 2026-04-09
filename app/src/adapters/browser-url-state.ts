import {
    parseTemplateSelection,
    serializeTemplateSelection,
} from '../lib/template-query';

export function readSelectedTemplateTokensFromLocation(): string[] {
    return parseTemplateSelection(window.location.search);
}

export function writeSelectedTemplateIdsToLocation(templateIds: string[]): void {
    const nextSearch = serializeTemplateSelection(
        window.location.search,
        templateIds,
    );

    const nextUrl = `${window.location.pathname}${nextSearch}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
}