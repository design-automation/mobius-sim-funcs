export declare const deprecated: ({
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        replace?: undefined;
        values?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        replace: {
            method: string[][];
            ray?: undefined;
            color?: undefined;
            select_vert_colors?: undefined;
            sensors?: undefined;
            radius?: undefined;
            num_rays?: undefined;
        };
        values?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        values: {
            name: string;
            vector?: undefined;
            method?: undefined;
            tolerance?: undefined;
        };
        replace?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        values: {
            vector: string;
            name?: undefined;
            method?: undefined;
            tolerance?: undefined;
        };
        replace?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        replace: {
            ray: string;
            method?: undefined;
            color?: undefined;
            select_vert_colors?: undefined;
            sensors?: undefined;
            radius?: undefined;
            num_rays?: undefined;
        };
        values?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        values: {
            method: string;
            name?: undefined;
            vector?: undefined;
            tolerance?: undefined;
        };
        replace?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        replace: {
            color: string;
            select_vert_colors: string;
            method?: undefined;
            ray?: undefined;
            sensors?: undefined;
            radius?: undefined;
            num_rays?: undefined;
        };
        values?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        values: {
            tolerance: string;
            name?: undefined;
            vector?: undefined;
            method?: undefined;
        };
        replace?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        replace: {
            sensors: string;
            radius: string;
            num_rays: string;
            method?: undefined;
            ray?: undefined;
            color?: undefined;
            select_vert_colors?: undefined;
        };
        values?: undefined;
    };
} | {
    old_func: {
        module: string;
        name: string;
    };
    new_func: {
        module: string;
        name: string;
        replace: {
            sensors: string;
            radius: string;
            method?: undefined;
            ray?: undefined;
            color?: undefined;
            select_vert_colors?: undefined;
            num_rays?: undefined;
        };
        values?: undefined;
    };
})[];
