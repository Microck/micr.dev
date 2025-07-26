import json
import os

def delete_original_images(input_json_path="builds.json"):
  """
  Reads the original JSON file to find image paths and deletes the
  original files if a .webp version exists.
  """
  print("--- Starting Deletion Script ---")
  print("⚠️ WARNING: This will permanently delete original image files.")

  try:
    with open(input_json_path, "r", encoding="utf-8") as f:
      data = json.load(f)
  except FileNotFoundError:
    print(f"Error: Input file not found at '{input_json_path}'")
    print("Aborting.")
    return

  # Determine the base path for images, same as the conversion script
  script_dir = os.path.dirname(os.path.realpath(__file__))
  base_path_for_images = os.path.abspath(
    os.path.join(script_dir, "..", "..", "public")
  )
  print(f"Searching for images in: {base_path_for_images}\n")

  deleted_count = 0
  skipped_count = 0
  total_count = 0

  for item in data:
    if "images" in item and isinstance(item["images"], list):
      for relative_image_path in item["images"]:
        total_count += 1

        # Construct the absolute path to the original image
        original_path_abs = os.path.join(
          base_path_for_images, relative_image_path.lstrip("./")
        )

        # Construct the expected path for the .webp version
        base_abs, _ = os.path.splitext(original_path_abs)
        webp_path_abs = f"{base_abs}.webp"

        # Safety Check: Only delete if the .webp file actually exists
        if os.path.exists(webp_path_abs):
          # Also check if the original file exists before trying to delete
          if os.path.exists(original_path_abs):
            try:
              os.remove(original_path_abs)
              print(f"Deleted: {original_path_abs}")
              deleted_count += 1
            except OSError as e:
              print(f"Error deleting {original_path_abs}: {e}")
              skipped_count += 1
          else:
            # The original file is already gone
            skipped_count += 1
        else:
          print(f"Skipping (no .webp found): {original_path_abs}")
          skipped_count += 1

  print("\n--- Deletion process complete ---")
  print(f"Successfully deleted: {deleted_count}/{total_count} files.")
  if skipped_count > 0:
    print(f"Skipped or not found: {skipped_count} files.")


if __name__ == "__main__":
  # This script reads 'builds.json' to know which files to delete.
  delete_original_images()