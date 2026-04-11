#!/bin/bash

# Download free background images for Mahadev Oil Mill website
# Images from Unsplash, Pexels, and similar free services

mkdir -p public/assets

echo "Downloading background images..."

# 1. Hero Background - Golden peanut oil with warm lighting
echo "Downloading peanut-hero.jpg..."
curl -L "https://images.unsplash.com/photo-1599599810694-e3ee73609c66?w=1920&h=1080&q=80" \
  -o public/assets/peanut-hero.jpg 2>/dev/null || \
echo "Failed - Try alternative: https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=1080&q=80"

# 2. Farm Background - Agricultural field with golden tones
echo "Downloading peanut-farm.jpg..."
curl -L "https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1920&h=1080&q=80" \
  -o public/assets/peanut-farm.jpg 2>/dev/null || \
echo "Failed - Try alternative: https://images.unsplash.com/photo-1625246333195-78d9c38ad576?w=1920&h=1080&q=80"

# 3. Oil Bottle - Product photography
echo "Downloading peanut-oil-bottle.jpg..."
curl -L "https://images.unsplash.com/photo-1587571556938-48e7a8f9ce97?w=1920&h=1080&q=80" \
  -o public/assets/peanut-oil-bottle.jpg 2>/dev/null || \
echo "Failed - Try alternative: https://images.unsplash.com/photo-1587571556938-48e7a8f9ce97?w=1920&h=1080&q=80"

# 4. Process/Factory - Industrial or traditional production
echo "Downloading peanut-process.jpg..."
curl -L "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&h=1080&q=80" \
  -o public/assets/peanut-process.jpg 2>/dev/null || \
echo "Failed - Try alternative: https://images.unsplash.com/photo-1560493676-04071c5f467b?w=1920&h=1080&q=80"

# 5. Kitchen - Cooking scene with warm tones
echo "Downloading peanut-kitchen.jpg..."
curl -L "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&q=80" \
  -o public/assets/peanut-kitchen.jpg 2>/dev/null || \
echo "Failed - Try alternative: https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920&h=1080&q=80"

echo "✅ Download complete! Check public/assets/ folder"
echo ""
echo "Manual download alternatives:"
echo "1. Hero: https://pixabay.com/photos/oil-bottle-olive-oil-kitchen-1467274/"
echo "2. Farm: https://pixabay.com/photos/field-agriculture-farming-crops-7502948/"
echo "3. Bottle: https://pixabay.com/photos/olive-oil-bottle-kitchen-food-1123540/"
echo "4. Process: https://pixabay.com/photos/factory-worker-production-industry-4482483/"
echo "5. Kitchen: https://pixabay.com/photos/restaurant-cooking-kitchen-chef-3556279/"
