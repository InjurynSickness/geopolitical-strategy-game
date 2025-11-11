export declare class LoadingScreen {
    private container;
    private loadingElement;
    private progressBar;
    private statusText;
    private tipText;
    private tips;
    constructor(container: HTMLElement);
    show(): void;
    updateProgress(progress: number, status: string): void;
    hide(): void;
    private getRandomTip;
    rotateTip(): void;
}
