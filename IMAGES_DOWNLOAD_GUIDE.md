# 🖼️ Background Images Setup Guide

## ⚠️ Current Issue
The top 3 sections need background images but external downloads are failing. Here's how to fix it:

## 📥 How to Download & Add Images

### Option 1: Download Manually (Easiest)

Copy these URLs into your browser and save the images to `/public/assets/`:

#### 1. **peanut-hero.jpg** (Hero Section)
**Best for**: Main landing image - golden oil bottle with peanuts
- **Direct Download**: https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=1080&fit=crop
- **Alternative**: https://pixabay.com/photos/oil-bottle-olive-oil-kitchen-2248599/
- **Save to**: `public/assets/peanut-hero.jpg`

#### 2. **peanut-farm.jpg** (Farm/Stats Section)
**Best for**: "Trusted by Thousands" - agricultural field
- **Direct Download**: https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop
- **Alternative**: https://pixabay.com/photos/field-agriculture-farming-green-675901/
- **Save to**: `public/assets/peanut-farm.jpg`

#### 3. **peanut-oil-bottle.jpg** (Products Section) 
**Best for**: Premium oil bottle product shot
- **Direct Download**: https://images.unsplash.com/photo-1585518419759-8b14f4668436?w=1920&h=1080&fit=crop
- **Alternative**: https://pixabay.com/photos/olive-oil-bottle-kitchen-organic-4283048/
- **Save to**: `public/assets/peanut-oil-bottle.jpg`

---

### Option 2: Use Linux Command (Advanced)

Run these commands in your terminal:

```bash
cd /workspaces/website/public/assets

# Download Hero Image
curl -L -o peanut-hero.jpg "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=1080&fit=crop&ixlib=rb-4.0.3"

# Download Farm Image
curl -L -o peanut-farm.jpg "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop&ixlib=rb-4.0.3"

# Download Oil Bottle Image
curl -L -o peanut-oil-bottle.jpg "https://images.unsplash.com/photo-1585518419759-8b14f4668436?w=1920&h=1080&fit=crop&ixlib=rb-4.0.3"
```

---

### Option 3: Recommended Free Stock Photo Sites

Visit these sites and download images (1920×1080px recommended):

| Site | Hero Image | Farm Image | Bottle Image |
|------|-----------|-----------|-------------|
| **Unsplash** | Search "golden oil bottle" | Search "farm field golden hour" | Search "oil bottle product" |
| **Pexels** | Search "oil bottle cooking" | Search "agriculture field" | Search "premium oil bottle" |
| **Pixabay** | Search "olive oil bottle" | Search "farming landscape" | Search "cooking oil product" |

---

## ✅ Verification

Once you've added the images, verify they're in the right place:

```bash
ls -lh public/assets/peanut-*.jpg
```

You should see:
- `peanut-hero.jpg` (50KB - 500KB)
- `peanut-farm.jpg` (50KB - 500KB)
- `peanut-oil-bottle.jpg` (50KB - 500KB)
- `peanut-kitchen.jpg` (✅ Already exists - 214KB)
- `peanut-process.jpg` (✅ Already exists - 286KB)

---

## 🎨 Image Requirements

| Section | Ideal Size | Best Colors | Theme |
|---------|-----------|-----------|-------|
| Hero | 1920×1080px | Golden, Browns, Warm | Premium oil bottle with peanuts |
| Farm | 1920×1080px | Greens, Golds, Natural | Agricultural fields or farms |
| Bottle | 1920×1080px | Creams, Golds, Whites | Product photography / premium bottles |
| Kitchen | ✅ 1920×1080px | Warm, Browns, Oranges | ✅ Already downloaded |
| Process | ✅ 1920×1080px | Industrial, Dark | ✅ Already downloaded |

---

## 🚀 Quick Setup Script

If you're on Linux/Mac, paste this in your terminal:

```bash
# Navigate to assets folder
cd /workspaces/website/public/assets

# Download all missing images using wget (if available)
wget -O peanut-hero.jpg "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop" 2>/dev/null || echo "Wget failed - use direct download links above"

wget -O peanut-farm.jpg "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop" 2>/dev/null || echo "Wget failed"

wget -O peanut-oil-bottle.jpg "https://images.unsplash.com/photo-1585518419759-8b14f4668436?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop" 2>/dev/null || echo "Wget failed"
```

---

## ❓ Troubleshooting

**Problem**: Images not showing on website after adding them
- **Solution**: Make sure filenames match exactly:
  - `peanut-hero.jpg` (not `peanut-hero.JPG` or `peanut_hero.jpg`)
  - Clear browser cache: `Ctrl+Shift+Delete` → Clear all

**Problem**: Images are too small or pixelated
- **Solution**: Ensure images are at least 1920×1080px
- Download larger versions from Unsplash (use `?w=1920&h=1080` in URL)

**Problem**: Slow loading
- **Solution**: Compress images using:
  - [TinyPNG](https://tinypng.com/) - Online compressor
  - `imagemagick`: `convert input.jpg -quality 85 output.jpg`

---

## 📝 Note
The website code references these exact filenames in `/public/assets/`:
- Hero: `peanut-hero.jpg`
- Farm: `peanut-farm.jpg`  
- Bottle: `peanut-oil-bottle.jpg`
- Kitchen: `peanut-kitchen.jpg` ✅
- Process: `peanut-process.jpg` ✅

**Don't rename** these files or the website won't display them!
