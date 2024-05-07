export default class LdrsBaseElement extends HTMLElement {
    _propsToUpgrade: object;
    shadow: ShadowRoot;
    template: HTMLTemplateElement;
    defaultProps: object;
    isAttached: boolean;
    constructor();
    storePropsToUpgrade(props: string[]): void;
    upgradeStoredProps(): void;
    reflect(props: string[]): void;
    applyDefaultProps(props: object): void;
}
//# sourceMappingURL=LdrsBaseElement.d.ts.map