import { useState } from 'preact/hooks';
import { TemplateService } from '../services/template-service';
import { createHttpTemplateRepository } from '../adapters/http-template-repository';
import { useTemplateApp } from './state';
import { AppShell } from './components/layout/AppShell';
import { AppHeader } from './components/layout/AppHeader';
import { AppFooter } from './components/layout/AppFooter';
import { SearchPanel } from './components/search/SearchPanel';
import { TemplateGroupsPanel } from './components/templates/TemplateGroupsPanel';
import { PreviewPanel } from './components/preview/PreviewPanel';
import { groupTemplatesByCategory } from './view-models/template-groups';
import { copyTextToClipboard, downloadTextFile, getShareUrl } from './utils/browser';

const repository = createHttpTemplateRepository(import.meta.env.BASE_URL);
const service = new TemplateService(repository);

function useTemporaryLabel(initialValue: string, temporaryValue: string, durationMs = 1600) {
    const [label, setLabel] = useState(initialValue);
    const [timeoutId, setTimeoutId] = useState<number | null>(null);

    async function trigger(action: () => Promise<void> | void) {
        await action();
        setLabel(temporaryValue);

        if (timeoutId !== null) {
            window.clearTimeout(timeoutId);
        }

        const nextTimeoutId = window.setTimeout(() => {
            setLabel(initialValue);
            setTimeoutId(null);
        }, durationMs);

        setTimeoutId(nextTimeoutId);
    }

    return { label, trigger };
}

export function App() {
    const state = useTemplateApp(service);
    const copyContent = useTemporaryLabel('Copy', 'Copied');
    const copyShare = useTemporaryLabel('Share link', 'Link copied');

    if (!state.initialized) {
        return <div className="app-loading">Loading…</div>;
    }

    const groupedTemplates = groupTemplatesByCategory(state.searchResults);

    async function handleCopyContent() {
        try {
            await copyContent.trigger(() => copyTextToClipboard(state.merged));
        } catch (error) {
            console.error('Failed to copy merged content:', error);
        }
    }

    async function handleCopyShareLink() {
        try {
            await copyShare.trigger(() => copyTextToClipboard(getShareUrl()));
        } catch (error) {
            console.error('Failed to copy share link:', error);
        }
    }

    function handleDownload() {
        downloadTextFile(state.merged, '.gitignore');
    }

    return (
        <AppShell>
            <AppHeader selectedCount={state.selectedTemplates.length} />

            <main className="app-layout">
                <div className="app-layout__main">
                    <SearchPanel query={state.query} onInput={state.setQuery} />

                    <TemplateGroupsPanel
                        groupedTemplates={groupedTemplates}
                        selectedIds={state.selectedIds}
                        onToggle={state.toggleTemplate}
                    />
                </div>

                <aside className="app-layout__sidebar">
                    <PreviewPanel
                        templates={state.selectedTemplates}
                        content={state.merged}
                        onRemove={state.removeTemplate}
                        onDownload={handleDownload}
                        onCopyContent={handleCopyContent}
                        onCopyShareLink={handleCopyShareLink}
                        copyContentLabel={copyContent.label}
                        copyShareLabel={copyShare.label}
                    />
                </aside>
            </main>

            <AppFooter />
        </AppShell>
    );
}