from PIL import Image
import math

img = Image.open('public/logo.png').convert('RGBA')
width, height = img.size
center_x, center_y = width / 2, height / 2

# The logo is a circle. We'll find the actual radius of the circle.
# Let's be safe and use a radius that covers the circle but excludes the corners.
# The image is 2648x2650. Radius is around 1300.
radius = min(width, height) / 2 - 10

pixels = img.load()

for x in range(width):
    for y in range(height):
        # Calculate distance from center
        dist = math.hypot(x - center_x, y - center_y)
        if dist > radius:
            # Outside the circle, make it transparent
            pixels[x, y] = (0, 0, 0, 0)

img.save('public/logo.png')
print("Cleaned logo and saved to public/logo.png")
