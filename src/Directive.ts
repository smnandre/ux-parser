export interface Directive {
    action: Action;
    modifiers: Modifier[];
}

export interface Action {
    name: string;
    args: Argument[];
}

export interface Modifier {
    name: string;
    args: Argument[];
}

export interface Argument {
    value: string|null;
    name?: string;
    type?: string;
}
