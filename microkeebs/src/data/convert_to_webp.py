import json
import os
from PIL import Image

def convert_and_update_json(
  input_json_path, output_json_path
):
  """
  Reads a JSON file, converts listed images to lossless WebP,
  and saves an updated JSON file with the new image paths.
  """
  try:
    with open(input_json_path, "r", encoding="utf-8") as f:
      data = json.load(f)
  except FileNotFoundError:
    print(f"Error: Input file not found at '{input_json_path}'")
    return
  except json.JSONDecodeError:
    print(f"Error: Could not decode JSON from '{input_json_path}'.")
    return

  # --- CHANGE ---
  # Define the path from the script's location (src/data) to the
  # directory containing the 'images' folder (public).
  # os.path.dirname(__file__) gets the directory of the script.
  # We go up two levels ('..', '..') to the project root, then into 'public'.
  script_dir = os.path.dirname(os.path.realpath(__file__))
  base_path_for_images = os.path.abspath(
    os.path.join(script_dir, "..", "..", "public")
  )
  print(f"Searching for images in: {base_path_for_images}\n")
  # --- END CHANGE ---

  total_images = 0
  converted_images = 0

  for item in data:
    if "images" in item and isinstance(item["images"], list):
      updated_image_paths = []
      for relative_image_path in item["images"]:
        total_images += 1

        # --- CHANGE ---
        # Create the full, absolute path to the original image file
        # by joining the base path with the relative path from the JSON.
        # .lstrip('./') cleans up paths that start with './'
        original_path_abs = os.path.join(
          base_path_for_images, relative_image_path.lstrip("./")
        )
        # --- END CHANGE ---

        # Get the new relative path for the .webp file
        base_rel, _ = os.path.splitext(relative_image_path)
        webp_path_rel = f"{base_rel}.webp"

        # Get the new absolute path for the .webp file
        base_abs, _ = os.path.splitext(original_path_abs)
        webp_path_abs = f"{base_abs}.webp"

        if os.path.exists(original_path_abs):
          try:
            with Image.open(original_path_abs) as img:
              if img.mode in ("RGBA", "P"):
                img = img.convert("RGB")
              img.save(webp_path_abs, "webp", lossless=True, quality=100)
            print(f"Converted: {original_path_abs} -> {webp_path_abs}")
            # Add the updated *relative* path to the list
            updated_image_paths.append(webp_path_rel)
            converted_images += 1
          except Exception as e:
            print(f"Could not convert {original_path_abs}: {e}")
            updated_image_paths.append(relative_image_path)
        else:
          print(f"Warning: File not found, skipping: {original_path_abs}")
          updated_image_paths.append(relative_image_path)

      item["images"] = updated_image_paths

  with open(output_json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

  print(f"\nProcess complete.")
  print(f"Converted {converted_images}/{total_images} images.")
  print(f"Updated JSON data saved to '{output_json_path}'.")


if __name__ == "__main__":
  convert_and_update_json(
    input_json_path="builds.json", output_json_path="updated_builds.json"
  )