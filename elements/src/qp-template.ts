import {AcuContainer} from './acu-container';
import {AcuElementType} from './acu-element';

export interface Template extends AcuContainer {
    Type: AcuElementType.Template;
    Name: string | null;
}