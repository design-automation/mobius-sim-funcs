/**
 * The `visualize` module has functions for defining various settings for the 3D viewer.
 * Color is saved as vertex attributes.
 * @module
 */
import { GIModel, TId } from '@design-automation/mobius-sim';
/**
 * Generates a colour range based on a numeric attribute.
 * Sets the color by creating a vertex attribute called 'rgb' and setting the value.
 * \n
 * @param entities The entities for which to set the color.
 * @param attrib The numeric attribute to be used to create the gradient.
 * You can spacify an attribute with an index. For example, ['xyz', 2] will create a gradient based on height.
 * @param range The range of the attribute, [minimum, maximum].
 * If only one number, it defaults to [0, maximum]. If null, then the range will be auto-calculated.
 * @param method Enum, the colour gradient to use.
 * @returns void
 */
export declare function Gradient(__model__: GIModel, entities: TId | TId[], attrib: string | [string, number] | [string, string], range: number | [number, number], method: _EColorRampMethod): void;
export declare enum _EColorRampMethod {
    FALSE_COLOR = "false_color",
    BLACK_BODY = "black_body",
    WHITE_RED = "white_red",
    WHITE_GREEN = "white_green",
    WHITE_BLUE = "white_blue",
    BLUE_RED = "blue_red",
    GREEN_RED = "green_red",
    BLUE_GREEN = "blue_green",
    GREY_SCALE = "grey_scale",
    ORRD = "OrRd",
    PUBU = "PuBu",
    BUPU = "BuPu",
    ORANGES = "Oranges",
    BUGN = "BuGn",
    YLORBR = "YlOrBr",
    YLGN = "YlGn",
    REDS = "Reds",
    RDPU = "RdPu",
    GREENS = "Greens",
    YLGNBU = "YlGnBu",
    PURPLES = "Purples",
    GNBU = "GnBu",
    GREYS = "Greys",
    YLORRD = "YlOrRd",
    PURD = "PuRd",
    BLUES = "Blues",
    PUBUGN = "PuBuGn",
    VIRIDIS = "Viridis",
    SPECTRAL = "Spectral",
    RDYLGN = "RdYlGn",
    RDBU = "RdBu",
    PIYG = "PiYG",
    PRGN = "PRGn",
    RDYLBU = "RdYlBu",
    BRBG = "BrBG",
    RDGY = "RdGy",
    PUOR = "PuOr",
    SET2 = "Set2",
    ACCENT = "Accent",
    SET1 = "Set1",
    SET3 = "Set3",
    DARK2 = "Dark2",
    PAIRED = "Paired",
    PASTEL2 = "Pastel2",
    PASTEL1 = "Pastel1"
}
