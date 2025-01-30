import {IconType} from './icon';
import {AcuElement} from './acu-element';

export enum ButtonStyle {
    Primary = 'Primary',
    Secondary = 'Secondary',
    Tertiary = 'Tertiary',
    Special = 'Special',
}

export interface QPButton extends AcuElement {
    Style: ButtonStyle;
    Enabled: boolean;
    Text: string | null;
    Icon: IconType | null;
}