#!/bin/bash

# Download free background images for Mahadev Oil Mill website
# Using reliable Pixabay and Unsplash CDN links

mkdir -p public/assets

echo "🔄 Downloading high-quality background images for peanut oil website..."
echo ""

# Remove failed downloads
rm -f public/assets/peanut-hero.jpg public/assets/peanut-farm.jpg public/assets/peanut-oil-bottle.jpg

# 1. Hero Background - Golden oil bottle with peanuts
echo "1️⃣ Downloading peanut-hero.jpg (Golden oil bottle)..."
curl -L "https://cdn.pixabay.com/photo/2017/05/05/12/41/oil-2286922_1280.jpg" \
  -o public/assets/peanut-hero.jpg 2>/dev/null
if [ -s public/assets/peanut-hero.jpg ]; then
  echo "✅ peanut-hero.jpg downloaded ($(stat -c%s public/assets/peanut-hero.jpg) bytes)"
else
  echo "⚠️ Trying alternative source..."
  curl -L "https://cdn.pixabay.com/photo/2017/05/05/12/41/oil-2286922_1280.jpg" \
    -o public/assets/peanut-hero.jpg 2>/dev/null
fi

# 2. Farm Background - Agricultural field with golden tones
echo ""
echo "2️⃣ Downloading peanut-farm.jpg (Agricultural field)..."
curl -L "https://cdn.pixabay.com/photo/2019/06/11/18/56/farm-4267810_1280.jpg" \
  -o public/assets/peanut-farm.jpg 2>/dev/null
if [ -s public/assets/peanut-farm.jpg ]; then
  echo "✅ peanut-farm.jpg downloaded ($(stat -c%s public/assets/peanut-farm.jpg) bytes)"
else
  echo "⚠️ Trying alternative..."
  curl -L "https://cdn.pixabay.com/photo/2015/02/24/11/29/nature-647300_1280.jpg" \
    -o public/assets/peanut-farm.jpg 2>/dev/null
fi

# 3. Oil Bottle - Premium product photography
echo ""
echo "3️⃣ Downloading peanut-oil-bottle.jpg (Premium oil bottle)..."
curl -L "https://cdn.pixabay.com/photo/2017/12/07/06/07/oil-2998395_1280.jpg" \
  -o public/assets/peanut-oil-bottle.jpg 2>/dev/null
if [ -s public/assets/peanut-oil-bottle.jpg ]; then
  echo "✅ peanut-oil-bottle.jpg downloaded ($(stat -c%s public/assets/peanut-oil-bottle.jpg) bytes)"
else
  echo "⚠️ Trying alternative..."
  curl -L "https://cdn.pixabay.com/photo/2017/05/26/08/24/olive-oil-2344068_1280.jpg" \
    -o public/assets/peanut-oil-bottle.jpg 2>/dev/null
fi

echo ""
echo "✅ Download complete!"
echo ""
echo "📊 Image sizes:"
ls -lh public/assets/peanut-*.jpg 2>/dev/null | awk '{print "  " $9 " - " $5}'
