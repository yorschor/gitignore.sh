import { useEffect, useMemo, useState } from 'preact/hooks';
import type { TemplateMeta } from '../lib/template-types';
import { TemplateService } from '../services/template-service';
import {
    readSelectedTemplateTokensFromLocation,
    writeSelectedTemplateIdsToLocation,
} from '../adapters/browser-url-state';

export function useTemplateApp(service: TemplateService) {
    const [initialized, setInitialized] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [templates, setTemplates] = useState<TemplateMeta[]>([]);
    const [merged, setMerged] = useState('');

    // init
    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                await service.initialize();

                const rawIds = readSelectedTemplateTokensFromLocation();

                const normalizedIds = service.normalizeUrlSelection(
                    rawIds,
                    writeSelectedTemplateIdsToLocation,
                );

                if (cancelled) return;

                setSelectedIds(normalizedIds);
                setTemplates(service.getTemplates());
                setInitialized(true);
            } catch (err) {
                console.error('Initialization failed:', err);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, []);

    // keep URL in sync
    useEffect(() => {
        if (!initialized) return;
        writeSelectedTemplateIdsToLocation(selectedIds);
    }, [selectedIds, initialized]);

    const searchResults = useMemo(() => {
        if (!initialized) return [];
        return service.search(query);
    }, [query, initialized]);

    const selectedTemplates = useMemo(() => {
        if (!initialized) return [];
        return service.resolveSelection(selectedIds);
    }, [selectedIds, initialized]);

    // merge output
    useEffect(() => {
        if (!initialized) return;

        let cancelled = false;

        (async () => {
            const result = await service.mergeSelection(selectedTemplates, {
                sourceUrl: window.location.href,
            });

            if (!cancelled) {
                setMerged(result);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [selectedTemplates, initialized]);

    function toggleTemplate(id: string) {
        setSelectedIds((prev) => {
            if (prev.includes(id)) {
                return prev.filter((x) => x !== id);
            }
            return [...prev, id]; // preserve order
        });
    }

    function removeTemplate(id: string) {
        setSelectedIds((prev) => prev.filter((x) => x !== id));
    }

    function clearAll() {
        setSelectedIds([]);
    }

    return {
        initialized,
        query,
        setQuery,
        templates,
        searchResults,
        selectedIds,
        selectedTemplates,
        toggleTemplate,
        removeTemplate,
        clearAll,
        merged,
    };
}