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
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwcmVjYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kZXByZWNhdGVkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE1BQU0sQ0FBQyxNQUFNLFVBQVUsR0FBRztJQUN0QjtRQUNJLFVBQVUsRUFBRTtZQUNSLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLE1BQU0sRUFBRSxZQUFZO1NBQ3ZCO1FBQ0QsVUFBVSxFQUFFO1lBQ1IsUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsUUFBUTtTQUNuQjtLQUNKO0lBQ0Q7UUFDSSxVQUFVLEVBQUU7WUFDUixRQUFRLEVBQUUsSUFBSTtZQUNkLE1BQU0sRUFBRSxlQUFlO1NBQzFCO1FBQ0QsVUFBVSxFQUFFO1lBQ1IsUUFBUSxFQUFFLElBQUk7WUFDZCxNQUFNLEVBQUUsUUFBUTtTQUNuQjtLQUNKO0lBQ0Q7UUFDSSxVQUFVLEVBQUU7WUFDUixRQUFRLEVBQUUsU0FBUztZQUNuQixNQUFNLEVBQUUsTUFBTTtTQUNqQjtRQUNELFVBQVUsRUFBRTtZQUNSLFFBQVEsRUFBRSxTQUFTO1lBQ25CLE1BQU0sRUFBRSxNQUFNO1lBQ2QsU0FBUyxFQUFFO2dCQUNQLFFBQVEsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2FBQ3ZDO1NBQ0o7S0FDSjtJQUNEO1FBQ0ksVUFBVSxFQUFFO1lBQ1IsUUFBUSxFQUFFLE1BQU07WUFDaEIsTUFBTSxFQUFFLFlBQVk7U0FDdkI7UUFDRCxVQUFVLEVBQUU7WUFDUixRQUFRLEVBQUUsWUFBWTtZQUN0QixNQUFNLEVBQUUsUUFBUTtZQUNoQixRQUFRLEVBQUU7Z0JBQ04sTUFBTSxFQUFFLE1BQU07YUFDakI7U0FDSjtLQUNKO0lBQ0Q7UUFDSSxVQUFVLEVBQUU7WUFDUixRQUFRLEVBQUUsUUFBUTtZQUNsQixNQUFNLEVBQUUsa0JBQWtCO1NBQzdCO1FBQ0QsVUFBVSxFQUFFO1lBQ1IsUUFBUSxFQUFFLFVBQVU7WUFDcEIs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