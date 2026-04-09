interface AppHeaderProps {
    selectedCount: number;
}

export function AppHeader({ selectedCount }: AppHeaderProps) {
    return (
        <header className="app-header">
            <div className="app-header__brand">
                <div className="app-header__icon">.i</div>

                <div>
                    <h1 className="app-header__title">gitingore.sh</h1>
                    <p className="app-header__subtitle">Easy gitignores for everyone</p>
                </div>
            </div>

            <div className="app-header__selection">{selectedCount} selected</div>
        </header>
    );
}