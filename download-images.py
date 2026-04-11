#!/usr/bin/env python3
import urllib.request
import os
import sys

# Create assets folder if it doesn't exist
os.makedirs('public/assets', exist_ok=True)

# Define images with working Unsplash URLs
images = {
    'peanut-hero.jpg': 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=1080&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D',
    'peanut-farm.jpg': 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&h=1080&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D',
    'peanut-oil-bottle.jpg': 'https://images.unsplash.com/photo-1585518419759-8b14f4668436?w=1920&h=1080&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8ZW58MHx8fHx8fA%3D%3D',
}

# User agent to avoid 403 errors
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}

for filename, url in images.items():
    filepath = f'public/assets/{filename}'
    
    try:
        print(f'📥 Downloading {filename}...', end=' ')
        
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=30) as response:
            with open(filepath, 'wb') as out_file:
                out_file.write(response.read())
        
        size = os.path.getsize(filepath)
        if size > 10000:  # More than 10KB
            print(f'✅ ({size:,} bytes)')
        else:
            print(f'⚠️ Small file ({size} bytes) - may have failed')
            
    except Exception as e:
        print(f'❌ Error: {str(e)}')

print('\n' + '='*50)
print('📊 Final image sizes:')
os.system('ls -lh public/assets/peanut-*.jpg 2>/dev/null | awk \'{print $9, "-", $5}\'')
