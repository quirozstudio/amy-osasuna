from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps, ImageStat

root = Path(__file__).resolve().parents[1]
exposure = {
    'heroamy.jpeg': 1.04,
    'catena.jpeg': .96,
    'ruben.garci.jpeg': .94,
    'mery.jpeg': .98,
}

def neutralize_white_balance(image):
    """Corrección gray-world contenida para neutralizar dominantes sin falsear pieles."""
    means = ImageStat.Stat(image.resize((64, 64))).mean
    target = sum(means) / 3
    factors = [max(.94, min(1.06, target / max(channel, 1))) for channel in means]
    channels = image.split()
    corrected = [channel.point(lambda value, f=factor: min(255, int(value * f))) for channel, factor in zip(channels, factors)]
    return Image.merge('RGB', corrected)

for path in (root / 'img').glob('*.jpeg'):
    image = Image.open(path)
    image = ImageOps.exif_transpose(image).convert('RGB')
    image = neutralize_white_balance(image)
    image = ImageOps.autocontrast(image, cutoff=(.35, .25), preserve_tone=True)
    image = ImageEnhance.Brightness(image).enhance(exposure.get(path.name, 1.0))
    image = ImageEnhance.Contrast(image).enhance(1.08 if path.name not in {'catena.jpeg', 'ruben.garci.jpeg'} else 1.14)
    image = ImageEnhance.Color(image).enhance(1.07)
    image = image.filter(ImageFilter.UnsharpMask(radius=1.35, percent=82, threshold=3))
    target = path.with_suffix('.webp')
    image.thumbnail((1800, 2400), Image.Resampling.LANCZOS)
    image.save(target, 'WEBP', quality=87, method=6)
    print(f'{path.name}: {image.width}x{image.height} -> {target.name}')
