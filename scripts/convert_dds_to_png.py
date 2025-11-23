#!/usr/bin/env python3
"""
Convert HOI4 DDS texture files to PNG for browser use
Requires: pip install Pillow Pillow-DDS
"""

import sys
import os
from pathlib import Path

try:
    from PIL import Image
    print("✓ PIL/Pillow imported successfully")
except ImportError:
    print("✗ Pillow not installed. Installing...")
    os.system("pip3 install Pillow")
    from PIL import Image

# Try to import DDS support
try:
    from PIL import DdsImagePlugin
    print("✓ DDS support available")
except ImportError:
    print("Installing DDS support...")
    os.system("pip3 install Pillow-DDS")
    try:
        from PIL import DdsImagePlugin
        print("✓ DDS support installed")
    except ImportError:
        print("⚠ DDS support unavailable, trying alternative method...")

def convert_dds_to_png(dds_path, png_path):
    """Convert a DDS file to PNG"""
    try:
        print(f"Converting: {dds_path}")
        img = Image.open(dds_path)
        img.save(png_path, 'PNG')
        print(f"  ✓ Saved: {png_path} ({img.size[0]}x{img.size[1]})")
        return True
    except Exception as e:
        print(f"  ✗ Error: {e}")
        return False

def main():
    # Files to convert
    conversions = [
        ('terrain/atlas0.dds', 'public/atlas0.png'),
        ('terrain/atlas_normal0.dds', 'public/atlas_normal0.png'),
        ('terrain/colormap_rgb_cityemissivemask_a.dds', 'public/colormap_land.png'),
        ('terrain/colormap_water_0.dds', 'public/colormap_water.png'),
    ]

    base_dir = Path(__file__).parent.parent

    success_count = 0
    for dds_file, png_file in conversions:
        dds_path = base_dir / dds_file
        png_path = base_dir / png_file

        if not dds_path.exists():
            print(f"⚠ File not found: {dds_path}")
            continue

        # Create output directory if needed
        png_path.parent.mkdir(parents=True, exist_ok=True)

        if convert_dds_to_png(str(dds_path), str(png_path)):
            success_count += 1

    print(f"\n✓ Converted {success_count}/{len(conversions)} files successfully")

if __name__ == '__main__':
    main()
