export enum _ECentralityMethod {
    UNDIRECTED = "undirected",
    DIRECTED = "directed",
}
export enum _ECentralityType {
    BETWEENNESS = "betweenness",
    CLOSENESS = "closeness",
    HARMONIC = "harmonic",
}
export enum _EShortestPathMethod {
    UNDIRECTED = "undirected",
    DIRECTED = "directed",
}
export enum _EShortestPathResult {
    DISTS = "distances",
    COUNTS = "counts",
    PATHS = "paths",
    ALL = "all",
}
export enum _ERaytraceMethod {
    STATS = "stats",
    DISTANCES = "distances",
    HIT_PGONS = "hit_pgons",
    INTERSECTIONS = "intersections",
    ALL = "all",
}
export enum _ESkyMethod {
    WEIGHTED = "weighted",
    UNWEIGHTED = "unweighted",
    ALL = "all",
}
export enum _ESunPathMethod {
    DIRECT = "direct",
    INDIRECT = "indirect",
    SKY = "sky",
}
export enum _ESolarMethod {
    DIRECT_WEIGHTED = "direct_weighted",
    DIRECT_UNWEIGHTED = "direct_unweighted",
    INDIRECT_WEIGHTED = "indirect_weighted",
    INDIRECT_UNWEIGHTED = "indirect_unweighted",
}
