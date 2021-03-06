export const deprecated = [
    {
        "old_func": {
            "module": "util",
            "name": "ImportData"
        },
        "new_func": {
            "module": "io",
            "name": "Import"
        }
    },
    {
        "old_func": {
            "module": "io",
            "name": "ImportToModel"
        },
        "new_func": {
            "module": "io",
            "name": "Import"
        }
    },
    {
        "old_func": {
            "module": "pattern",
            "name": "Grid"
        },
        "new_func": {
            "module": "pattern",
            "name": "Grid",
            "replace": {
                "method": [["'squares'", "'quads'"]]
            }
        }
    },
    {
        "old_func": {
            "module": "make",
            "name": "Collection"
        },
        "new_func": {
            "module": "Collection",
            "name": "create",
            "values": {
                "name": "\"\""
            }
        }
    },
    {
        "old_func": {
            "module": "render",
            "name": "StandardMaterial"
        },
        "new_func": {
            "module": "material",
            "name": "Standard"
        }
    },
    {
        "old_func": {
            "module": "make",
            "name": "copy"
        },
        "new_func": {
            "module": "make",
            "name": "copy",
            "values": {
                "vector": "[0,0,0]"
            }
        }
    },
    {
        "old_func": {
            "module": "modify",
            "name": "rotate"
        },
        "new_func": {
            "module": "modify",
            "name": "rotate",
            "replace": {
                "ray": "axis"
            }
        }
    },
    {
        "old_func": {
            "module": "virtual",
            "name": "GetPlane"
        },
        "new_func": {
            "module": "calc",
            "name": "Plane"
        }
    },
    {
        "old_func": {
            "module": "modify",
            "name": "Delete"
        },
        "new_func": {
            "module": "edit",
            "name": "Delete"
        }
    },
    {
        "old_func": {
            "module": "make",
            "name": "Unweld"
        },
        "new_func": {
            "module": "edit",
            "name": "Weld",
            "values": {
                "method": "'break_weld'"
            }
        }
    },
    {
        "old_func": {
            "module": "render",
            "name": "BasicMaterial"
        },
        "new_func": {
            "module": "material",
            "name": "MeshMat",
            "replace": {
                "color": "colour",
                "select_vert_colors": "select_vert_colours"
            }
        }
    },
    {
        "old_func": {
            "module": "render",
            "name": "PhongMaterial"
        },
        "new_func": {
            "module": "material",
            "name": "Phong"
        }
    },
    {
        "old_func": {
            "module": "render",
            "name": "GlassMaterial"
        },
        "new_func": {
            "module": "material",
            "name": "Glass"
        }
    },
    {
        "old_func": {
            "module": "render",
            "name": "PhysicalMaterial"
        },
        "new_func": {
            "module": "material",
            "name": "Physical"
        }
    },
    {
        "old_func": {
            "module": "render",
            "name": "LambertMaterial"
        },
        "new_func": {
            "module": "material",
            "name": "Lambert"
        }
    },
    {
        "old_func": {
            "module": "render",
            "name": "StandardMaterial"
        },
        "new_func": {
            "module": "material",
            "name": "Standard"
        }
    },
    {
        "old_func": {
            "module": "virtual",
            "name": "GetBBox"
        },
        "new_func": {
            "module": "calc",
            "name": "BBox"
        }
    },
    {
        "old_func": {
            "module": "calc",
            "name": "Centroid"
        },
        "new_func": {
            "module": "calc",
            "name": "Centroid",
            "values": {
                "method": "'ps_average'"
            }
        }
    },
    {
        "old_func": {
            "module": "material",
            "name": "Basic"
        },
        "new_func": {
            "module": "material",
            "name": "MeshMat"
        }
    },
    {
        "old_func": {
            "module": "make",
            "name": "Hole"
        },
        "new_func": {
            "module": "edit",
            "name": "Hole"
        }
    },
    {
        "old_func": {
            "module": "make",
            "name": "Divide"
        },
        "new_func": {
            "module": "edit",
            "name": "Divide"
        }
    },
    {
        "old_func": {
            "module": "modify",
            "name": "Reverse"
        },
        "new_func": {
            "module": "edit",
            "name": "Reverse"
        }
    },
    {
        "old_func": {
            "module": "modify",
            "name": "Shift"
        },
        "new_func": {
            "module": "edit",
            "name": "Shift"
        }
    },
    {
        "old_func": {
            "module": "modify",
            "name": "Ring"
        },
        "new_func": {
            "module": "edit",
            "name": "Ring"
        }
    },
    {
        "old_func": {
            "module": "modify",
            "name": "Weld"
        },
        "new_func": {
            "module": "edit",
            "name": "Weld"
        }
    },
    {
        "old_func": {
            "module": "modify",
            "name": "Fuse"
        },
        "new_func": {
            "module": "edit",
            "name": "Fuse"
        }
    },
    {
        "old_func": {
            "module": "poly2d",
            "name": "Stitch"
        },
        "new_func": {
            "module": "poly2d",
            "name": "Stitch",
            "values": {
                "tolerance": "0.1"
            }
        }
    },
    {
        "old_func": {
            "module": "analyze",
            "name": "Isovist"
        },
        "new_func": {
            "module": "analyze",
            "name": "Isovist",
            "replace": {
                "sensors": "origins",
                "radius": "dist",
                "num_rays": "detail",
            }
        }
    },
    {
        "old_func": {
            "module": "analyze",
            "name": "Sky"
        },
        "new_func": {
            "module": "analyze",
            "name": "Sky",
            "replace": {
                "sensors": "origins",
                "radius": "limits",
            }
        }
    },
    {
        "old_func": {
            "module": "analyze",
            "name": "Sun"
        },
        "new_func": {
            "module": "analyze",
            "name": "Sun",
            "replace": {
                "sensors": "origins",
                "radius": "limits",
            }
        }
    },
]
