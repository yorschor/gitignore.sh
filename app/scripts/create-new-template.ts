#!/usr/bin/env bun

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const id = Bun.argv[2];
const subpath = Bun.argv[3];

if (!id) {
    console.error(
        "Usage: bun run create-new-template <template-id> [optional-subpath]",
    );
    process.exit(1);
}

if (!/^[a-z0-9][a-z0-9-_]*$/.test(id)) {
    console.error(
        "Invalid id. Use lowercase letters, numbers, dashes, or underscores.",
    );
    process.exit(1);
}

if (subpath && !/^[a-z0-9][a-z0-9-_/]*$/.test(subpath)) {
    console.error(
        "Invalid subpath. Use lowercase letters, numbers, dashes, underscores, or slashes.",
    );
    process.exit(1);
}

const templatesRoot = path.resolve("..", "templates");
const templateDir = subpath
    ? path.join(templatesRoot, subpath, id)
    : path.join(templatesRoot, id);

const displayPath = path.relative(process.cwd(), templateDir);

const meta = {
    id,
    name: id,
    aliases: [id],
    category: "",
    tags: [],
    description: "",
};

try {
    await mkdir(templateDir, { recursive: false });
} catch (error) {
    if (error instanceof Error && "code" in error && error.code === "EEXIST") {
        console.error(`Template already exists: ${displayPath}`);
        process.exit(1);
    }

    throw error;
}

await writeFile(
    path.join(templateDir, "meta.json"),
    `${JSON.stringify(meta, null, 4)}\n`,
);

await writeFile(
    path.join(templateDir, "template.gitignore"),
    `# ${id}

`,
);

console.log(`Created ${displayPath}`);
