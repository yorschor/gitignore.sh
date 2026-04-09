#!/usr/bin/env bun

import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const APP_ROOT = path.resolve(import.meta.dir, '..');
const REPO_ROOT = path.resolve(APP_ROOT, '..');

const TEMPLATES_DIR = path.join(REPO_ROOT, 'templates');
const DIST_DIR = path.join(APP_ROOT, 'dist');
const DIST_TEMPLATES_DIR = path.join(DIST_DIR, 'templates');
const OUTPUT_INDEX = path.join(DIST_DIR, 'index.json');

function normalizeId(value: string): string {
    return value.trim().toLowerCase();
}

async function walk(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });

    const files = await Promise.all(
        entries.map((entry) => {
            const full = path.join(dir, entry.name);
            return entry.isDirectory() ? walk(full) : full;
        }),
    );

    return files.flat();
}

async function assertFileExists(file: string) {
    try {
        await Bun.file(file).exists();
    } catch {
        throw new Error(`Missing file: ${file}`);
    }
}

function validateMeta(meta: any, file: string) {
    if (!meta || typeof meta !== 'object') {
        throw new Error(`Invalid meta.json at ${file}`);
    }

    const { id, name, aliases, category, tags, description } = meta;

    if (typeof id !== 'string' || !id.trim()) {
        throw new Error(`Missing id in ${file}`);
    }

    if (typeof name !== 'string' || !name.trim()) {
        throw new Error(`Missing name in ${file}`);
    }

    if (!Array.isArray(aliases)) {
        throw new Error(`Invalid aliases in ${file}`);
    }

    if (typeof category !== 'string') {
        throw new Error(`Invalid category in ${file}`);
    }

    if (!Array.isArray(tags)) {
        throw new Error(`Invalid tags in ${file}`);
    }

    return {
        id: normalizeId(id),
        name: name.trim(),
        aliases: aliases.map((a: string) => normalizeId(a)).filter(Boolean),
        category: category.trim(),
        tags: tags.map((t: string) => t.trim()).filter(Boolean),
        description: typeof description === 'string' ? description.trim() : undefined,
    };
}

async function copyTemplate(src: string, dest: string) {
    await mkdir(path.dirname(dest), { recursive: true });
    await copyFile(src, dest);
}

async function build() {
    console.log('Building template index...');

    const files = await walk(TEMPLATES_DIR);
    const metaFiles = files.filter((f) => f.endsWith('meta.json'));

    const templates: any[] = [];
    const seenIds = new Set<string>();

    for (const metaFile of metaFiles) {
        const raw = await readFile(metaFile, 'utf-8');
        const parsed = JSON.parse(raw);

        const meta = validateMeta(parsed, metaFile);

        if (seenIds.has(meta.id)) {
            throw new Error(`Duplicate template id: ${meta.id}`);
        }
        seenIds.add(meta.id);

        const dir = path.dirname(metaFile);
        const templateFile = path.join(dir, 'template.gitignore');

        await assertFileExists(templateFile);

        // compute relative path inside templates/
        const relative = path.relative(TEMPLATES_DIR, templateFile);
        const distTarget = path.join(DIST_TEMPLATES_DIR, relative);

        await copyTemplate(templateFile, distTarget);

        templates.push({
            ...meta,
            path: `templates/${relative.replace(/\\/g, '/')}`,
        });
    }

    await mkdir(DIST_DIR, { recursive: true });

    const index = {
        version: 1,
        generatedAt: new Date().toISOString(),
        templates,
    };

    await writeFile(OUTPUT_INDEX, JSON.stringify(index, null, 2));

    console.log(`✔ ${templates.length} templates processed`);
    console.log(`✔ index.json written to dist/`);
}

build().catch((err) => {
    console.error(err);
    process.exit(1);
});