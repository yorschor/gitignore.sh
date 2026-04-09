export interface TemplateMeta {
    id: string;
    name: string;
    aliases: string[];
    category: string;
    tags: string[];
    path: string;
    description?: string;
}

export interface TemplateIndex {
    version: 1;
    generatedAt: string;
    templates: TemplateMeta[];
}

export interface LoadedTemplate {
    id: string;
    name: string;
    content: string;
}

export interface MergeTemplateInput {
    id: string;
    name: string;
    content: string;
}