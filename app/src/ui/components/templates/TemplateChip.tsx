interface TemplateChipProps {
    label: string;
    selected: boolean;
    onClick: () => void;
}

export function TemplateChip({ label, selected, onClick }: TemplateChipProps) {
    return (
        <button
            type="button"
            className={`template-chip${selected ? ' template-chip--selected' : ''}`}
            onClick={onClick}
        >
            {label}
        </button>
    );
}