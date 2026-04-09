import Fuse from 'fuse.js';
import type { LoadedTemplate, TemplateMeta } from '../lib/template-types';
import {
    createTemplateCatalog,
    resolveTemplateIds,
    type TemplateCatalog,
} from '../lib/template-catalog';
import { createTemplateSearch, searchTemplates } from '../lib/template-search';
import {
    mergeLoadedTemplates,
    type MergeTemplatesOptions,
} from '../lib/template-merge';
import type { TemplateRepository } from '../adapters/http-template-repository';

function areArraysEqual(a: string[], b: string[]): boolean {
    if (a.length !== b.length) return false;

    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }

    return true;
}

export class TemplateService {
    private catalog: TemplateCatalog | null = null;
    private fuse: Fuse<TemplateMeta> | null = null;
    private readonly contentCache = new Map<string, Promise<LoadedTemplate>>();

    private readonly repository: TemplateRepository;

    constructor(repository: TemplateRepository) {
        this.repository = repository;
    }

    async initialize(signal?: AbortSignal): Promise<void> {
        const index = await this.repository.fetchIndex(signal);
        this.catalog = createTemplateCatalog(index.templates);
        this.fuse = createTemplateSearch(index.templates);
    }

    getTemplates(): TemplateMeta[] {
        this.ensureInitialized();
        return [...this.catalog!.templates];
    }

    search(query: string): TemplateMeta[] {
        this.ensureInitialized();
        return searchTemplates(query, this.catalog!.templates, this.fuse!);
    }

    resolveSelection(ids: string[]): TemplateMeta[] {
        this.ensureInitialized();
        return resolveTemplateIds(this.catalog!, ids);
    }

    normalizeSelectionIds(inputIds: string[]): string[] {
        this.ensureInitialized();

        const result: string[] = [];

        for (const id of inputIds) {
            if (this.catalog!.byId.has(id)) {
                result.push(id);
            }
        }

        return result;
    }

    normalizeUrlSelection(
        rawIds: string[],
        writeUrl: (ids: string[]) => void,
    ): string[] {
        const normalized = this.normalizeSelectionIds(rawIds);

        if (!areArraysEqual(rawIds, normalized)) {
            writeUrl(normalized);
        }

        return normalized;
    }

    async loadTemplates(
        templates: TemplateMeta[],
        signal?: AbortSignal,
    ): Promise<LoadedTemplate[]> {
        const loaded = await Promise.all(
            templates.map((template) => this.loadTemplate(template, signal)),
        );

        return loaded;
    }

    async mergeSelection(
        templates: TemplateMeta[],
        options?: MergeTemplatesOptions,
        signal?: AbortSignal,
    ): Promise<string> {
        const loaded = await this.loadTemplates(templates, signal);
        return mergeLoadedTemplates(loaded, options);
    }

    private loadTemplate(
        template: TemplateMeta,
        signal?: AbortSignal,
    ): Promise<LoadedTemplate> {
        const existing = this.contentCache.get(template.id);
        if (existing) {
            return existing;
        }

        const promise = this.repository.fetchTemplateContent(template, signal);
        this.contentCache.set(template.id, promise);
        return promise;
    }

    private ensureInitialized(): void {
        if (!this.catalog || !this.fuse) {
            throw new Error('TemplateService has not been initialized.');
        }
    }
}