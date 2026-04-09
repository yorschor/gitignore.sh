import type { TemplateMeta } from '../../../lib/template-types';
import { AppCard } from '../layout/AppCard';
import { SelectedTemplatePill } from './SelectedTemplatePill';

interface PreviewPanelProps {
    templates: TemplateMeta[];
    content: string;
    onRemove: (id: string) => void;
    onDownload: () => void;
    onCopyContent: () => void;
    onCopyShareLink: () => void;
    copyContentLabel: string;
    copyShareLabel: string;
}

export function PreviewPanel({
    templates,
    content,
    onRemove,
    onDownload,
    onCopyContent,
    onCopyShareLink,
    copyContentLabel,
    copyShareLabel,
}: PreviewPanelProps) {
    const hasTemplates = templates.length > 0;

    return (
        <AppCard className="preview-panel-card">
            <div className="preview-panel">
                <div className="preview-panel__header">
                    <div>
                        <h2 className="preview-panel__title">Preview</h2>
                        <p className="preview-panel__meta">
                            {templates.length} template{templates.length === 1 ? '' : 's'} combined
                        </p>
                    </div>
                </div>

                <div className="preview-panel__actions">
                    <button
                        type="button"
                        className="preview-panel__action"
                        onClick={onDownload}
                        disabled={!hasTemplates}
                    >
                        Download
                    </button>

                    <button
                        type="button"
                        className="preview-panel__action preview-panel__action--secondary"
                        onClick={onCopyContent}
                        disabled={!hasTemplates}
                    >
                        {copyContentLabel}
                    </button>

                    <button
                        type="button"
                        className="preview-panel__action preview-panel__action--secondary"
                        onClick={onCopyShareLink}
                    >
                        {copyShareLabel}
                    </button>
                </div>

                {hasTemplates ? (
                    <>
                        <div className="preview-panel__selected">
                            {templates.map((template) => (
                                <SelectedTemplatePill
                                    key={template.id}
                                    label={template.name}
                                    onRemove={() => onRemove(template.id)}
                                />
                            ))}
                        </div>

                        <pre className="preview-panel__content">{content}</pre>
                    </>
                ) : (
                    <div className="preview-panel__empty">
                        Select one or more templates to preview the merged <code>.gitignore</code>.
                    </div>
                )}
            </div>
        </AppCard>
    );
}