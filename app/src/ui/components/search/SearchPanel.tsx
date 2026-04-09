import { AppCard } from '../layout/AppCard';

interface SearchPanelProps {
    query: string;
    onInput: (value: string) => void;
}

export function SearchPanel({ query, onInput }: SearchPanelProps) {
    return (
        <AppCard>
            <div className="search-panel">
                <input
                    className="search-panel__input"
                    type="text"
                    placeholder="Search templates (e.g., Node, Python, React...)"
                    value={query}
                    onInput={(event) => onInput((event.target as HTMLInputElement).value)}
                />
            </div>
        </AppCard>
    );
}