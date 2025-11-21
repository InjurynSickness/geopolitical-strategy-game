# HOI4 State Files Integration Guide

## Overview

Your game currently shows only 22% of provinces with political colors because `provinceAssignments.ts` only has ownership data for ~200 provinces from the old map. The full HOI4 map has **13,382 provinces** that need to be assigned to countries.

## What You Need

From your Hearts of Iron IV installation, you need the state files that define which provinces belong to which countries:

**Location:** `/Hearts of Iron IV/history/states/*.txt`

These files contain province ownership data in this format:

```
state={
    id=1
    name="STATE_CORSICA"

    provinces={
        3838 9851 11804
    }

    history={
        owner = FRA
        ...
    }
}
```

## How to Add State Files

### Option 1: Copy State Files

1. Copy all `.txt` files from `/Hearts of Iron IV/history/states/`
2. Create a directory in your project: `mkdir states`
3. Paste the files into `./states/`

### Option 2: Use Symlink (Linux/Mac)

```bash
ln -s "/path/to/Hearts of Iron IV/history/states" ./states
```

## Generate Province Assignments

Once you have the state files, run the parser script:

```bash
node scripts/parse-hoi4-states.js ./states
```

This will:
- Parse all state `.txt` files
- Extract province ownership for each state
- Generate a complete `src/provinceAssignments.ts` with all 13,382 provinces
- Show statistics about province distribution

### Example Output

```
HOI4 State Parser
=================

Found 823 state files

Parsing states...

  ✓ State 1 (FRA): 3 provinces
  ✓ State 2 (ITA): 5 provinces
  ...

Files processed: 823
States parsed: 823
Total provinces assigned: 13,382

✅ Successfully generated src/provinceAssignments.ts
```

## For 2000s Era Game

Since you mentioned this is a **2000s-era game** (not 1936), you have two options:

### Option A: Use HOI4 Data as Base
- Run the parser with HOI4 state files
- You'll get historically-accurate 1936 borders
- Manually update `provinceAssignments.ts` for modern borders where needed
- Main changes: Soviet Union → Russia + Former USSR states, Yugoslavia split, etc.

### Option B: Modern State Files
- If you have or can create modern state files in HOI4 format
- Place them in `./states-modern/`
- Run: `node scripts/parse-hoi4-states.js ./states-modern`

## After Generating Province Assignments

1. Rebuild the project: `npm run build`
2. Start the dev server: `npm start`
3. All 13,382 provinces should now have political colors
4. Clicking provinces should properly select their owning countries

## Current Status

**Current province coverage:** ~200 / 13,382 (22%)
**After parsing:** 13,382 / 13,382 (100%)

## Troubleshooting

**"Directory not found"**
- Make sure you created the `./states` directory
- Check that `.txt` files are inside it

**"No owner found for state X"**
- Some states might be unclaimed/uncolonized in 1936
- The parser will skip these and report them

**Wrong era borders**
- You're using 1936 HOI4 data but want 2000s
- See "Option A" above to manually update modern borders

## Need Help?

The parser script (`scripts/parse-hoi4-states.js`) is fully commented and can be modified if needed.
