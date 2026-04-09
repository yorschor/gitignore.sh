import type { ComponentChildren } from 'preact';

interface AppShellProps {
    children: ComponentChildren;
}

export function AppShell({ children }: AppShellProps) {
    return <div className="app-shell">{children}</div>;
}