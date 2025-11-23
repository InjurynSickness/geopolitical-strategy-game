# WorldPolitik Map Rendering Implementation Analysis

## Project Overview
- **Map Dimensions**: 5632 x 2048 (HOI4 standard)
- **Engine Type**: Canvas-based 2D renderer with camera/zoom system
- **Current Branch**: claude/integrate-figma-ui-011CV2tQvZe4dd5G9SB47neJ
- **Latest Commit**: "Fix political map rendering: remove fog effect and use proper color tinting"

---

## 1. MAIN MAP RENDERING FILES

### Core Rendering Pipeline (in `/src/rendering/`)

| File | Lines | Purpose |
|------|-------|---------|
| **MapRenderer.ts** | 120 | Main render loop orchestrator - draws all layers to visible canvas |
| **CanvasManager.ts** | 92 | Manages 8+ canvas contexts for rendering layers |
| **TerrainAtlasRenderer.ts** | 194 | HOI4-style terrain atlas sampling from heightmap |
| **EnhancedTerrainRenderer.ts** | 171 | Generates normal maps and applies lighting to terrain |
| **PoliticalMapBuilder.ts** | 190 | Builds political color overlay from province data |
| **BorderGenerator.ts** | 149 | Generates country and province borders |
| **BorderRenderer.ts** | 53 | Renders borders to canvas |
| **TerrainLighting.ts** | 191 | Applies directional lighting to terrain |
| **NormalMapGenerator.ts** | 107 | Generates normal maps from heightmap |

### Coordinators
- **ProvinceMap.ts** (31KB) - Main coordinator that initializes all systems
- **CameraController.ts** (137 lines) - Handles zoom, pan, and viewport management
- **MapInteractionHandler.ts** - Handles mouse/keyboard input for panning, zooming, clicking

---

## 2. ZOOM-BASED RENDERING LOGIC (NEEDS REMOVAL)

### Location: `/src/rendering/MapRenderer.ts` (Lines 15-43)

**Method: `calculatePoliticalOpacity()`**
```typescript
private calculatePoliticalOpacity(): number {
    const camera = this.cameraController.camera;
    const zoom = camera.zoom;
    const minZoom = camera.minZoom;
    const maxZoom = camera.maxZoom;

    // Define zoom thresholds
    const zoomFadeStart = minZoom * 3;      // Start fading in political colors
    const zoomFadeEnd = minZoom * 1.2;      // Fully visible political colors

    if (zoom >= zoomFadeStart) {
        return 0.0;  // Zoomed in: no political colors
    } else if (zoom <= zoomFadeEnd) {
        return 1.0;  // Zoomed out: full political color tint
    } else {
        // Interpolate between
        const t = (zoom - zoomFadeEnd) / (zoomFadeStart - zoomFadeEnd);
        return 1.0 * (1 - t);
    }
}
```

**Usage in render() method (Lines 92-102):**
```typescript
const politicalOpacity = this.calculatePoliticalOpacity();
if (politicalOpacity > 0) {
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = politicalOpacity;
    ctx.drawImage(this.canvasManager.politicalCanvas, 0, 0);
    ctx.globalAlpha = 1.0;
}
```

### Rationale
- Current: Opacity fades from 0% (zoomed in) to 100% (zoomed out)
- This was intended to show terrain detail when zoomed in, political colors when zoomed out
- **Issue**: Creates visual discontinuity and complicates rendering logic
- **Goal**: Make political colors always visible at consistent opacity

### All Zoom References
- `/src/camera/CameraController.ts` - Contains zoom limits and calculations
- `/src/interaction/MapInteractionHandler.ts` - Handles zoom input (lines 87-103 in wheel handler)
- `/src/provinceMap.ts` - May have zoom-related callbacks

---

## 3. TERRAIN TEXTURE ASSETS & USAGE

### Asset Locations

**Public Directory** (`/public/`):
- `terrain_atlas0.png` (10.7 MB) - Main terrain texture atlas
- `terrain_atlas1.png` (2.7 MB) - Mid-resolution atlas
- `terrain_atlas2.png` (670 KB) - Low-resolution atlas
- `colormap_water_0.png` (2.5 MB) - Water color texture
- `colormap_water_1.png` (981 KB) - Mid-resolution water
- `colormap_water_2.png` (262 KB) - Low-resolution water
- `border_country_0.png`, `border_province_0.png`, `border_sea_0.png` - Border patterns

**Root Directory** (High-res source maps):
- `terrain.png` (2.1 MB) - Recolored/processed terrain
- `provinces.png` (1.6 MB) - Province color map
- `rivers.png` (404 KB) - River system
- `heightmap.png` (2.7 MB) - Height-based terrain type selector
- `heightmap.bmp` (11.5 MB) - Original heightmap
- `world_normal.bmp` (8.6 MB) - Normal map
- `background.png` (11 MB) - Menu background

**DDS Terrain Folder** (`/terrain/`):
- `atlas0.dds`, `atlas1.dds`, `atlas2.dds` - DDS-format terrain atlases (currently unused)
- `atlas_normal0.dds`, `atlas_normal1.dds`, `atlas_normal2.dds` - Normal maps
- Various river, border, and effect textures

### How Terrain is Currently Used

**Loading Pipeline** (in `ProvinceMap.ts` lines 124-263):
1. **terrain_atlas0.png** loaded to `this.terrainImage` (line 197)
2. **heightmap.png** loaded by `TerrainAtlasRenderer` (line 41 of TerrainAtlasRenderer)
3. **provinces.png** loaded for province color-picking (line 205)
4. **rivers.png** loaded and recolored to blue (line 226)
5. **colormap_water_0.png** loaded for water texture (line 243)

**Processing** (in `ProvinceMap.ts` lines 265-321):
```typescript
if (this.terrainAtlasRenderer && this.terrainAtlasRenderer.isReady()) {
    // Use HOI4 terrain atlas textures
    ctx.drawImage(this.terrainAtlasRenderer.getTerrainCanvas(), 0, 0);
} else {
    // Fallback to tiled pattern
    const pattern = ctx.createPattern(this.terrainImage, 'repeat');
    // Apply water mask to make water transparent
}
```

**Rendering Layer Order** (in `MapRenderer.ts` lines 45-120):
1. Clear to black
2. LAYER 1: Water texture (`waterTextureCanvas`)
3. LAYER 2: Terrain texture (`processedTerrainCanvas`) - PRIMARY VISUAL
4. LAYER 3: Political colors (zoom-based opacity) - TARGET FOR REMOVAL
5. LAYER 4: Country borders
6. LAYER 5: Rivers (60% opacity)
7. Overlays (selections, labels)

---

## 4. CURRENT FILE ORGANIZATION

### Root Directory Structure
```
/worldpolitik/
├── src/                          # Source code (main game logic)
│   ├── App.tsx                   # Menu entry point
│   ├── main.tsx                  # React app bootstrap
│   ├── gameInit.ts               # Game initialization coordinator
│   ├── provinceMap.ts            # Main map coordinator
│   ├── provinceData.ts           # Province color definitions
│   ├── provinceAssignments.ts    # Province -> Country mappings
│   ├── countryData.ts            # Country color & info
│   ├── waterProvinces.ts         # Water province IDs
│   ├── types.ts                  # TypeScript interfaces
│   │
│   ├── rendering/                # RENDERING SYSTEM
│   │   ├── MapRenderer.ts        # Main render orchestrator [CONTAINS ZOOM LOGIC]
│   │   ├── CanvasManager.ts      # Canvas layer management
│   │   ├── TerrainAtlasRenderer.ts
│   │   ├── EnhancedTerrainRenderer.ts
│   │   ├── TerrainLighting.ts
│   │   ├── NormalMapGenerator.ts
│   │   ├── BorderGenerator.ts
│   │   └── BorderRenderer.ts
│   │
│   ├── camera/                   # CAMERA & VIEWPORT
│   │   └── CameraController.ts   # Zoom & pan logic
│   │
│   ├── interaction/              # USER INPUT
│   │   └── MapInteractionHandler.ts
│   │
│   ├── political/                # POLITICAL OVERLAY
│   │   └── PoliticalMapBuilder.ts # Builds country colors layer
│   │
│   ├── borders/                  # BORDER SYSTEM
│   │   └── BorderMapBuilder.ts
│   │
│   ├── labels/                   # COUNTRY LABELS
│   │   ├── CountryLabelCalculator.ts
│   │   └── LabelRenderer.ts
│   │
│   ├── game/                     # GAME ENGINE
│   │   ├── GameEngine.ts
│   │   ├── GameStateInitializer.ts
│   │   └── SaveLoadManager.ts
│   │
│   ├── editor/                   # MAP EDITOR
│   │   ├── MapEditor.ts
│   │   ├── CountryEditor.ts
│   │   ├── ProvinceSelector.ts
│   │   └── EditorDataExporter.ts
│   │
│   ├── components/               # UI COMPONENTS
│   │   ├── EditorOverlay.tsx
│   │   ├── EditorPanel.tsx
│   │   ├── TimeControls.tsx
│   │   ├── CountryCard.tsx
│   │   └── ui/                   # shadcn/ui components
│   │
│   ├── menu-ui/                  # MENU SYSTEM
│   │   └── components/           # Menu screens
│   │       ├── MainMenu.tsx
│   │       ├── SinglePlayerMenu.tsx
│   │       ├── CountrySelection.tsx
│   │       ├── InteractiveCountrySelection.tsx
│   │       └── FigmaLoadingScreen.tsx
│   │
│   ├── core/                     # CORE SYSTEMS
│   │   ├── GameLoop.ts
│   │   ├── TimeSystem.ts
│   │   └── EventBus.ts
│   │
│   └── ui/                       # UI MANAGER
│       ├── UIManager.ts
│       └── SaveLoadUI.ts
│
├── public/                       # STATIC ASSETS (Web server)
│   ├── terrain_atlas0.png        # Terrain textures
│   ├── terrain_atlas1.png
│   ├── terrain_atlas2.png
│   ├── colormap_water_*.png      # Water textures
│   └── border_*.png              # Border patterns
│
├── terrain/                      # DDS TERRAIN ASSETS (currently unused)
│   ├── atlas0.dds, atlas1.dds...
│   └── [60+ DDS texture files]
│
├── build/                        # BUILD OUTPUT
├── dist/                         # DISTRIBUTION BUILD
│
└── [Root asset files]
    ├── provinces.png             # Province ID map
    ├── terrain.png               # Processed terrain
    ├── heightmap.png             # Height data
    ├── rivers.png                # River system
    ├── background.png            # Menu background
    └── [other HOI4 map data]
```

---

## 5. UI COMPONENTS FOR MAP CONTROLS

### Current Map Control System

**In-Game Controls** (handled by `MapInteractionHandler`):
- **Left Mouse Button**: Pan the map
- **Scroll Wheel**: Zoom in/out (lines 156-191 in MapInteractionHandler)
- **Right Click**: Reserved for editor
- **ESC Key**: Deselect province (line 55-58)
- **Edge Scrolling**: Auto-pan at screen edges (HOI4-style)

**Camera Limits** (in `CameraController.ts`):
```typescript
camera.minZoom = calculated based on viewport
camera.maxZoom = 15
zoom calculation: ensures entire map fits in viewport
```

**UI Components** (in `/src/components/` and `/src/menu-ui/`):
- **TimeControls.tsx** - Game speed controls (not map-related)
- **EditorPanel.tsx** - Map editor controls (when in editor mode)
- **FigmaLoadingScreen.tsx** - Loading screen with progress
- **InteractiveCountrySelection.tsx** - Country selection map (same rendering system)

**Menu System** (in `/src/menu-ui/components/`):
- `MainMenu.tsx` - Main entry screen
- `SinglePlayerMenu.tsx` - New/Load game options
- `CountrySelection.tsx` - 8-nation quick select
- `InteractiveCountrySelection.tsx` - Full 192-nation map
- `LoadGameMenu.tsx` - Game slots

### No Dedicated Map Controls UI
- The map uses pure mouse/keyboard interaction
- No on-screen zoom slider or pan buttons
- Edge scrolling simulates HOI4 behavior

---

## SUMMARY OF REQUIRED MODIFICATIONS

### Files to Modify

| File | Changes Required | Priority |
|------|-----------------|----------|
| **src/rendering/MapRenderer.ts** | Remove `calculatePoliticalOpacity()` method; change political color opacity to constant 0.4 (102/255); remove zoom condition check | HIGH |
| **src/political/PoliticalMapBuilder.ts** | Alpha value already set to 102 (40%) - verify it stays constant | MEDIUM |
| **src/camera/CameraController.ts** | May need review - zoom limits still valid, but no functional changes | LOW |
| **src/provinceMap.ts** | Review for any zoom-dependent logic; verify terrain atlas loading independent of zoom | MEDIUM |
| **src/interaction/MapInteractionHandler.ts** | Zoom input remains, just doesn't affect political opacity anymore | NO CHANGE |

### Files to Review (Read-Only)
- `src/rendering/TerrainAtlasRenderer.ts` - Verify terrain loads correctly without zoom logic
- `src/rendering/EnhancedTerrainRenderer.ts` - Verify terrain enhancement independent of zoom
- `src/menu-ui/components/InteractiveCountrySelection.tsx` - Uses same rendering system

### Asset Files (No Changes)
- Public PNG/DDS files remain unchanged
- Asset loading continues as-is

---

## RENDERING LAYER SPECIFICATION (Current)

```
MapRenderer.render() produces 7 visual layers:

Layer 1: Water Texture (100% opacity)
  └─ Source: waterTextureCanvas
  └─ Blend: source-over
  └─ Alpha: 1.0

Layer 2: Terrain (100% opacity) ← PRIMARY
  └─ Source: processedTerrainCanvas (from TerrainAtlasRenderer or fallback)
  └─ Blend: source-over
  └─ Alpha: 1.0

Layer 3: Political Colors [ZOOM-DEPENDENT - TARGET FOR REMOVAL]
  └─ Source: politicalCanvas
  └─ Blend: source-over
  └─ Alpha: 0.0-1.0 based on zoom ← TO BE CHANGED TO CONSTANT

Layer 4: Country Borders (100% opacity)
  └─ Source: borderCanvas
  └─ Blend: source-over
  └─ Alpha: 1.0

Layer 5: Rivers (60% opacity)
  └─ Source: recoloredRiversCanvas
  └─ Blend: source-over
  └─ Alpha: 0.6

Layer 6: Overlays (selection, labels)
  └─ Source: overlayCanvas
  └─ Blend: varies by overlay
  └─ Alpha: varies
```

After application of camera transform:
```
ctx.translate(camera.x, camera.y)
ctx.scale(camera.zoom, camera.zoom)
```

---

## RECENT COMMIT HISTORY (Zoom-Related)

1. **90f2daff** (Latest) - "Fix political map rendering: remove fog effect"
   - Changed blend mode from multiply to source-over
   - Changed political opacity: 100% → 40% (but still zoom-dependent)
   - This commit is PARTIAL - removed the fog effect but kept zoom logic

2. **37a66a93** - "Implement HOI4-style zoom-based map rendering with terrain priority"
   - Introduced zoom-based opacity calculation
   - Set minZoom * 3 and minZoom * 1.2 thresholds

3. **bd64018e** - "Use HOI4 terrain atlas textures, fix water rendering, and add border system"
   - Terrain atlas system implemented

---

## KEY METRICS

- **Total TS/TSX Files**: 130+
- **Rendering-related Files**: 8 main files
- **Canvas Contexts**: 8+ (visible, hidden, political, overlay, border, rivers, terrain, water)
- **Map Dimensions**: 5632 x 2048 (fixed)
- **Zoom Range**: minZoom (calculated) to 15x
- **Asset Size**: ~35 MB total loaded assets
