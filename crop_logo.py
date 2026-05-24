from PIL import Image
import sys

img = Image.open('public/logo.png')
print("Original size:", img.size)

# The broken icon is usually in the top left.
# We can just crop out the center where the circle is, assuming it's centered.
width, height = img.size
# Find the bounding box of non-transparent pixels, or just crop a square from the center.
# A safe way is to just erase the top-left 50x50 pixels.
pixels = img.load()
for x in range(min(50, width)):
    for y in range(min(50, height)):
        # If the image has an alpha channel, make it transparent
        if img.mode == 'RGBA':
            pixels[x, y] = (0, 0, 0, 0)
        else:
            # If it's RGB, make it white (or whatever background)
            pixels[x, y] = (255, 255, 255)

img.save('public/logo_fixed.png')
print("Saved to public/logo_fixed.png")
