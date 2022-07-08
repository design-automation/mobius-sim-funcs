import { GIModel, TId, TPlane, Txyz } from '@design-automation/mobius-sim';
/**
 * Creates text
 * \n
 * Options can be null or can a dictionary that specifies text options. For example:
 * {
 *   'size': 60, // size of text
 *   'font': 'besley', // any of these 3 strings: "roboto", "besley", "opensans"
 *   'font_style': 'italic_bold', // accept any string containing any combination of these strings: "light"/"bold" & "italic"
 *   'color': [0.2, 1, 0] // array of 3 values from 0 to 1
 * }
 * @param __model__
 * @param text The text to create.
 * @origin
 * @options
 * @returns The ID of the text entity.
 * (The text is attached to a hidden polygon so the ID is a polygon ID.)
 */
export declare function Text(__model__: GIModel, text: string, origin: Txyz | TPlane, options: object): TId;
