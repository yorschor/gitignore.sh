import type { ComponentChildren } from 'preact';

interface AppCardProps {
    children: ComponentChildren;
    className?: string;
}

export function AppCard({ children, className }: AppCardProps) {
    return <section className={`app-card${className ? ` ${className}` : ''}`}>{children}</section>;
}