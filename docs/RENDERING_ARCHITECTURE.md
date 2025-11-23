# Map Rendering Architecture Diagram

## High-Level Rendering Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GAME INITIALIZATION                          │
│                       (src/gameInit.ts)                             │
└────────────────────────┬────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    PROVINCE MAP COORDINATOR                         │
│                     (src/provinceMap.ts)                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Responsibilities:                                           │   │
│  │ • Load all image assets (5 files, ~35 MB)                  │   │
│  │ • Initialize all rendering subsystems                      │   │
│  │ • Coordinate map building (political, borders)            │   │
│  │ • Handle user interactions                                 │   │
│  │ • Manage game loop and rendering                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
└────────┬──────────┬──────────┬──────────┬──────────┬────────────────┘
         │          │          │          │          │
         ▼          ▼          ▼          ▼          ▼
    ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌──────────────┐
    │Canvas  │ │Camera  │ │Political│ │Border │ │Interaction  │
    │Manager │ │Control │ │Map      │ │Gen    │ │Handler      │
    │        │ │        │ │Builder  │ │       │ │             │
    └────────┘ └────────┘ └────────┘ └────────┘ └──────────────┘
         │          │          │          │          │
         ▼          ▼          ▼          ▼          ▼
    Creates 8+  Pan/Zoom   Creates      Generates  Mouse/Keyboard
    Canvas      Camera      Political    Borders    Input
    Contexts    State       Layer        Canvas     Events


┌─────────────────────────────────────────────────────────────────────┐
│                    ASSET LOADING SYSTEM                             │
│                     (src/provinceMap.ts)                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Asset 1: terrain_atlas0.png (10.7 MB)                             │
│  ├─ Loaded to: this.terrainImage                                   │
│  ├─ Used by: TerrainAtlasRenderer                                  │
│  └─ Fallback: createPattern for tiling                             │
│                                                                     │
│  Asset 2: provinces.png (1.6 MB)                                   │
│  ├─ Loaded to: this.provinceImage                                  │
│  ├─ Used by: Hidden canvas for color-picking                       │
│  └─ Purpose: Province ID identification by RGB pixel               │
│                                                                     │
│  Asset 3: rivers.png (404 KB)                                      │
│  ├─ Loaded to: this.riversImage                                    │
│  ├─ Recolored to: #283a4a (blue)                                   │
│  └─ Rendered at: 60% opacity                                       │
│                                                                     │
│  Asset 4: colormap_water_0.png (2.5 MB)                            │
│  ├─ Loaded to: this.waterTextureImage                              │
│  ├─ Used by: Water texture canvas                                  │
│  └─ Rendered at: 100% opacity (LAYER 1)                            │
│                                                                     │
│  Asset 5: heightmap.png (2.7 MB)                                   │
│  ├─ Loaded by: TerrainAtlasRenderer.load()                         │
│  ├─ Purpose: Determine terrain type (color → tile)                 │
│  └─ Resolution: 5632 x 2048 (same as map)                          │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Canvas Layer Architecture

```
┌───────────────────────────────────────────────────────────────────────┐
│                         CANVAS MANAGER                                │
│                    (8+ Canvas Contexts)                               │
├───────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  1. visibleCanvas (ON SCREEN)                                         │
│     └─ Main rendering target, displayed to user                       │
│     └─ Size: window.innerWidth x window.innerHeight (viewport)        │
│     └─ Context: visibleCtx (2D, standard)                             │
│                                                                       │
│  2-8. Offscreen Canvases (5632 x 2048)                                │
│     │                                                                 │
│     ├─ politicalCanvas                                                │
│     │  └─ Built by: PoliticalMapBuilder                               │
│     │  └─ LAYER 3 in render: Country color overlay                    │
│     │  └─ Opacity: 0.4 (40%) [ZOOM-DEPENDENT - TARGET FOR REMOVAL]   │
│     │                                                                 │
│     ├─ borderCanvas                                                   │
│     │  └─ Built by: BorderGenerator / BorderRenderer                  │
│     │  └─ LAYER 4 in render: Country and province borders             │
│     │  └─ Opacity: 1.0 (100%)                                         │
│     │                                                                 │
│     ├─ processedTerrainCanvas                                         │
│     │  └─ Built by: TerrainAtlasRenderer (or fallback)                │
│     │  └─ LAYER 2 in render: TERRAIN (PRIMARY VISUAL)                 │
│     │  └─ Opacity: 1.0 (100%)                                         │
│     │                                                                 │
│     ├─ waterTextureCanvas                                             │
│     │  └─ Source: colormap_water_0.png                                │
│     │  └─ LAYER 1 in render: Water color texture                      │
│     │  └─ Opacity: 1.0 (100%)                                         │
│     │                                                                 │
│     ├─ recoloredRiversCanvas                                          │
│     │  └─ Source: rivers.png (recolored to #283a4a)                   │
│     │  └─ LAYER 5 in render: River system                             │
│     │  └─ Opacity: 0.6 (60%)                                          │
│     │                                                                 │
│     ├─ overlayCanvas                                                  │
│     │  └─ Built by: Selection/hover highlighting                      │
│     │  └─ LAYER 6 in render: Selection pulse animation                │
│     │  └─ Opacity: varies (0.7 default)                               │
│     │                                                                 │
│     ├─ hiddenCanvas                                                   │
│     │  └─ Purpose: Color-picking for province identification          │
│     │  └─ Source: provinces.png                                       │
│     │  └─ Not rendered to screen                                      │
│     │  └─ Only used for getImageData() lookups                        │
│     │                                                                 │
│     └─ waterMaskCanvas (temporary, in TerrainAtlasRenderer)           │
│        └─ Used to identify water provinces                             │
│        └─ Makes those areas transparent on terrain                    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Main Render Loop (MapRenderer.render())

```
render() {
    │
    ├─ Clear visible canvas to black
    │
    ├─ Apply camera transform to context
    │  ├─ ctx.translate(camera.x, camera.y)  // Pan
    │  └─ ctx.scale(camera.zoom, camera.zoom) // Zoom
    │
    ├─ LAYER 1: Draw water texture
    │  ├─ ctx.globalAlpha = 1.0
    │  ├─ ctx.drawImage(waterTextureCanvas, 0, 0)
    │  └─ Provides realistic ocean color
    │
    ├─ LAYER 2: Draw terrain (PRIMARY)
    │  ├─ ctx.globalAlpha = 1.0
    │  ├─ ctx.drawImage(processedTerrainCanvas, 0, 0)
    │  └─ Shows mountains, forests, plains, etc.
    │
    ├─ LAYER 3: Draw political colors [ZOOM-DEPENDENT ← TO CHANGE]
    │  ├─ const politicalOpacity = calculatePoliticalOpacity()
    │  │  ├─ if (zoom >= minZoom * 3): return 0.0   // Zoomed in
    │  │  ├─ if (zoom <= minZoom * 1.2): return 1.0 // Zoomed out
    │  │  └─ else: interpolate between
    │  │
    │  ├─ if (politicalOpacity > 0)
    │  ├─ ctx.globalAlpha = politicalOpacity
    │  ├─ ctx.drawImage(politicalCanvas, 0, 0)
    │  └─ Shows country colors at variable opacity
    │
    ├─ LAYER 4: Draw country borders
    │  ├─ ctx.globalAlpha = 1.0
    │  ├─ ctx.drawImage(borderCanvas, 0, 0)
    │  └─ Shows black borders between countries
    │
    ├─ LAYER 5: Draw rivers
    │  ├─ ctx.globalAlpha = 0.6
    │  ├─ ctx.drawImage(recoloredRiversCanvas, 0, 0)
    │  └─ Shows blue river system
    │
    └─ LAYER 6: Draw overlays
       ├─ ctx.drawImage(overlayCanvas, 0, 0)
       └─ Shows selection highlights, pulses, labels
}
```

---

## Zoom-Based Opacity Logic (TO BE REMOVED)

```
Current Implementation:
┌────────────────────────────────────────────────────────────────┐
│           calculatePoliticalOpacity()                          │
│                   (28 lines)                                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  Input: camera.zoom (current zoom level)                       │
│                                                                │
│  Parameters:                                                   │
│  • minZoom = ~0.43 (calculated to fit entire map)              │
│  • maxZoom = 15                                                │
│  • zoomFadeStart = minZoom * 3 = ~1.29                         │
│  • zoomFadeEnd = minZoom * 1.2 = ~0.52                         │
│                                                                │
│  Logic:                                                        │
│  IF zoom >= 1.29 (zoomed in)                                   │
│     RETURN 0.0  ← Political colors hidden                      │
│  ELSE IF zoom <= 0.52 (zoomed out)                             │
│     RETURN 1.0  ← Political colors fully visible               │
│  ELSE (between thresholds)                                     │
│     RETURN interpolated value between 0.0 and 1.0              │
│                                                                │
│  Output: opacity value (0.0 to 1.0)                            │
│                                                                │
└────────────────────────────────────────────────────────────────┘

Opacity Curve (Current):
┌─────────────────────────────────────────────────────────────────┐
│ Opacity                                                         │
│ 1.0 │                                     ╱─────────            │
│     │                                  ╱─────                   │
│ 0.5 │                          ╱──────                           │
│     │                    ╱─────                                  │
│ 0.0 │──────────────────╱────────────────────────               │
│     └───────────────────────────────────────────── Zoom Level   │
│     0.43    0.52      1.29         5          15                │
│   (min)     ↑         ↑            (far)      (max)             │
│             │         │                                         │
│      Full Opacity  Start Fade    No Opacity                     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

PROPOSED CHANGE:
Replace entire method with constant value:
    ctx.globalAlpha = 0.4;  // Always 40% opacity
```

---

## Terrain Asset Processing Pipeline

```
1. LOAD STAGE (ProvinceMap.loadAssets())
   │
   └─ terrain_atlas0.png → Image object (this.terrainImage)
      heightmap.png → Image object (TerrainAtlasRenderer)
      provinces.png → Image object (this.provinceImage)

2. ATLAS RENDERING STAGE (TerrainAtlasRenderer.generateTerrainFromAtlas())
   │
   ├─ Read heightmap pixel colors (R, G, B)
   ├─ Map color to terrain type (via getTerrainTileIndex)
   │  ├─ High values (200+, 200+, 200+) → Snow
   │  ├─ Red-heavy (200+, <100, <100) → Desert
   │  ├─ Green-heavy (<100, >100, <100) → Forest
   │  ├─ Brown-heavy (>100, <100, <100) → Hills
   │  ├─ Gray (<150, <150, <150) → Mountains
   │  └─ Default → Plains
   │
   ├─ Sample 64x64 tile from atlas for each terrain type
   └─ Output: terrain pixels to terrainCanvas

3. WATER MASK STAGE (TerrainAtlasRenderer.applyWaterMask())
   │
   ├─ Read water mask from provinces.png
   │  └─ Black pixels (0,0,0) = water
   │
   ├─ Make water pixels transparent (alpha = 0)
   └─ Keep land pixels opaque (alpha = 255)

4. RENDER STAGE (MapRenderer.render())
   │
   └─ ctx.drawImage(processedTerrainCanvas, 0, 0)
      ├─ Displays terrain at 100% opacity
      ├─ Water areas transparent (shows colormap_water underneath)
      └─ Zoom level doesn't affect terrain visibility
```

---

## File Dependency Graph

```
gameInit.ts
  └─ ProvinceMap.ts (MAIN COORDINATOR)
      ├─ CanvasManager.ts
      ├─ CameraController.ts
      │   └─ Used by: MapInteractionHandler
      ├─ MapRenderer.ts [TARGET FOR MODIFICATION]
      │   └─ Uses: CanvasManager, CameraController
      ├─ MapInteractionHandler.ts
      ├─ PoliticalMapBuilder.ts
      │   └─ Uses: provinceData, countryData, waterProvinces
      ├─ BorderMapBuilder.ts
      │   └─ Uses: BorderGenerator, BorderRenderer
      ├─ TerrainAtlasRenderer.ts [INDEPENDENT OF ZOOM]
      │   └─ Loads: terrain_atlas0.png, heightmap.png
      ├─ CountryLabelCalculator.ts
      └─ LabelRenderer.ts

MapRenderer.ts [MODIFICATION TARGET]
  ├─ imports: CanvasManager, CameraController
  ├─ calls: calculatePoliticalOpacity() [DELETE THIS]
  └─ renders: 7 visual layers

CameraController.ts
  └─ Maintains: zoom (0.43 to 15), pan (x, y)
```

---

## Key Takeaways for Modification

1. **Single Point of Change**: `MapRenderer.ts` lines 15-43, 92-102
2. **Minimal Side Effects**: Only affects political color visibility
3. **No Asset Changes**: All texture files remain unchanged
4. **No Logic Changes**: Zoom/pan functionality preserved
5. **Clean Removal**: 28-line method completely deleted
6. **Simpler Code**: From conditional opacity to constant opacity
7. **Consistent Visuals**: Political colors always visible

---

## Before/After Rendering Behavior

BEFORE (Current):
```
Zoom Out (0.43)       → Political opacity 100% → Clear country colors
Zoom Mid (0.86)       → Political opacity ~50% → Medium visibility
Zoom In (1.29)        → Political opacity 25%  → Subtle hint
Zoom Far In (15)      → Political opacity 0%   → Only terrain visible
```

AFTER (Proposed):
```
All Zoom Levels       → Political opacity 40%  → Consistent light overlay
```

Benefits:
- Constant visual experience regardless of zoom
- Users see country colors while panning/zooming
- Terrain details always visible (not hidden by colors)
- Simplified render logic (no conditional)
