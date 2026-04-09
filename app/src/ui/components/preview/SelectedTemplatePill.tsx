interface SelectedTemplatePillProps {
    label: string;
    onRemove: () => void;
}

export function SelectedTemplatePill({ label, onRemove }: SelectedTemplatePillProps) {
    return (
        <button type="button" className="selected-template-pill" onClick={onRemove}>
            <span>{label}</span>
            <span className="selected-template-pill__remove">×</span>
        </button>
    );
}