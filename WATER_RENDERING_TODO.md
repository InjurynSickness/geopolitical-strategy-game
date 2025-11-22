# Water Rendering System - Implementation Guide

## Current Status
✅ Flat blue water color (#1e4d8b) rendering for all 3,259 water provinces
✅ Political color saturation boosted by 35%
❌ No depth/texture for water
❌ No ocean province clicking support

## Available Assets (terrain folder)

### Water Textures (DDS format - need conversion)
- `colormap_water_0.dds` - Main water color map (largest resolution)
- `colormap_water_1.dds` - Medium resolution water color map
- `colormap_water_2.dds` - Smallest resolution water color map

These files contain realistic water coloring with depth variations, shallow/deep water shading, and ocean details.

### Underwater Terrain
- `underwater_terrain_0.dds`
- `underwater_terrain_1.dds`
- `underwater_terrain_2.dds`

### Border Textures (for future use)
- `border_country_0/1/2.dds` - Professional country borders
- `border_province_0/1/2.dds` - Province borders
- `border_sea_0/1/2.dds` - Sea borders
- `border_sea_region_0/1/2.dds` - Sea region borders

### River Textures (for future use)
- `RiverSurface_diffuse_0/1/2.dds` - River diffuse textures
- `RiverSurface_normal_0/1/2.dds` - River normal maps

## Implementation Steps

### Step 1: Convert DDS to PNG
**Required**: Convert the colormap_water DDS files to PNG format.

**Options**:
1. **ImageMagick**: `magick convert colormap_water_0.dds colormap_water_0.png`
2. **GIMP**: Open DDS → Export as PNG
3. **Photoshop**: Open DDS with NVIDIA Texture Tools → Save as PNG
4. **Online converter**: Use DDS to PNG converter tools

**Place converted files in**:
```
public/
  ├── colormap_water_0.png
  ├── colormap_water_1.png
  └── colormap_water_2.png
```

### Step 2: Load Water Textures (Code Changes Needed)

**File**: `src/provinceMap.ts`

Add water texture loading:
```typescript
private waterTexture0 = new Image();
private waterTexture1 = new Image();
private waterTexture2 = new Image();

// In loadAssets():
this.waterTexture0.src = './colormap_water_0.png';
this.waterTexture1.src = './colormap_water_1.png';
this.waterTexture2.src = './colormap_water_2.png';
```

### Step 3: Modify PoliticalMapBuilder (Code Changes Needed)

**File**: `src/political/PoliticalMapBuilder.ts`

Instead of using flat WATER_COLOR, sample from the water texture based on pixel coordinates.

**Add constructor parameter**:
```typescript
constructor(
    private mapWidth: number,
    private mapHeight: number,
    private hiddenCtx: CanvasRenderingContext2D,
    private waterTextureCtx?: CanvasRenderingContext2D  // New!
) {}
```

**Modify water coloring logic**:
```typescript
if (waterProvinceIds.has(province.id)) {
    // Sample from water texture instead of flat color
    if (this.waterTextureCtx) {
        const waterData = this.waterTextureCtx.getImageData(x, y, 1, 1).data;
        countryRgb = [waterData[0], waterData[1], waterData[2]];
    } else {
        countryRgb = PoliticalMapBuilder.WATER_COLOR; // Fallback
    }
}
```

### Step 4: Enable Ocean Province Clicking

**File**: `src/provinceMap.ts`

Currently, clicking water provinces does nothing. Need to:

1. **Modify getProvinceAt()** to return water province data
2. **Add water province info** to selection UI
3. **Show sea zone names** (from state files or custom naming)

Example modifications:
```typescript
public getProvinceAt(x: number, y: number): Province | null {
    // ... existing code ...

    // Currently only returns land provinces
    // Change to also return water provinces:
    if (province && waterProvinceIds.has(province.id)) {
        return {
            ...province,
            isWater: true,
            type: 'sea' // or 'lake', 'ocean'
        };
    }

    return province;
}
```

## Future Enhancements

### Professional Borders (border_country DDS files)
Replace pixel-based border detection with HOI4's professional border textures.

**Benefits**:
- Cleaner, more professional appearance
- Less CPU intensive
- Match HOI4's visual style exactly

### River Rendering
Use RiverSurface DDS files to render rivers on top of the map.

**Implementation**:
- Load RiverSurface_diffuse textures
- Composite over political map
- Apply river normal maps for depth effect

### Multiple Water Texture Layers
Use all 3 colormap_water files (0/1/2) for LOD (Level of Detail):
- colormap_water_0: Full zoom
- colormap_water_1: Medium zoom
- colormap_water_2: Far zoom

## Performance Considerations

- Water textures are 5632×2048 pixels (same as map)
- Loading 3 textures = ~95MB total memory
- Consider loading only colormap_water_0 initially
- Use progressive loading or LOD system

## Testing Checklist

Once implemented:
- [ ] Water has visible depth/color variation
- [ ] Shallow water appears lighter than deep water
- [ ] Ocean province clicking works
- [ ] Water province info displays correctly
- [ ] Performance is acceptable (>30 FPS)
- [ ] Water textures align perfectly with map
- [ ] No visual artifacts at province boundaries

## Notes

The water colormap files contain the same color data HOI4 uses for its map rendering. This ensures visual consistency with the source game and provides realistic depth shading that makes oceans, seas, and lakes visually distinct and appealing.
