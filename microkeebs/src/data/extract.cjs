try { require("dotenv").config(); } catch (e) { /* dotenv optional in CI */ }
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// =============================================================================
// --- CONFIGURATION ---
// =============================================================================
const BUILDS_OUTPUT_PATH = path.join(__dirname);
const IMAGES_BASE_DIR = path.join(__dirname, "../../public/images");
const FORCE_REFRESH_ALL = false;
// =============================================================================

const {
  YOUTUBE_API_KEY,
  YOUTUBE_MX_PLAYLIST_ID,
  YOUTUBE_EC_PLAYLIST_ID,
} = process.env;

const BUILDS_FILE_PATH = path.join(BUILDS_OUTPUT_PATH, "builds.json");

const youtube = google.youtube({
  version: "v3",
  auth: YOUTUBE_API_KEY,
});

const keyMap = {
  Teclado: "Keyboard",
  Keyboard: "Keyboard",
  Keycaps: "Keycaps",
  Switches: "Switches",
  Lube: "Lube",
  Films: "Films",
  Muelles: "Springs",
  Springs: "Springs",
  Placa: "Plate",
  Plate: "Plate",
  Mount: "Mount",
  Estabilizadores: "Stabilizers",
  Stabilizers: "Stabilizers",
  Domes: "Domes",
  Sliders: "Sliders",
  Dampening: "Dampening",
  PCB: "PCB",
  Artisan: "Artisan",
  Otros: "Others",
  Others: "Others",
};

function cleanTitle(originalTitle, category) {
  let newTitle = originalTitle;
  if (category === "MX") {
    const withIndex = originalTitle.indexOf(" with ");
    if (withIndex !== -1) newTitle = originalTitle.substring(0, withIndex);
  } else if (category === "EC") {
    let tempTitle = originalTitle;
    if (tempTitle.startsWith("Lubed and Silenced "))
      tempTitle = tempTitle.replace("Lubed and Silenced ", "");
    else if (tempTitle.startsWith("Lubed "))
      tempTitle = tempTitle.replace("Lubed ", "");
    else if (tempTitle.startsWith("Stock "))
      tempTitle = tempTitle.replace("Stock ", "");
    const withIndex = tempTitle.indexOf(" with ");
    newTitle = withIndex !== -1 ? tempTitle.substring(0, withIndex) : tempTitle;
  }
  return newTitle.trim();
}

async function downloadThumbnail(videoId) {
  const maxResUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const highQualityUrl = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

  const imageDir = path.join(IMAGES_BASE_DIR, videoId);
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
  }

  const imagePath = path.join(imageDir, "thumbnail.jpg");
  // The webPath should be relative to your public folder for your website
  // Adjust this if your public path is different
  const webPath = `./images/${videoId}/thumbnail.jpg`;

  let imageUrlToFetch = maxResUrl;
  let response = await fetch(imageUrlToFetch);

  if (!response.ok) {
    console.log(
      `  - Max resolution not found for ${videoId}. Falling back to high quality.`
    );
    imageUrlToFetch = highQualityUrl;
    response = await fetch(imageUrlToFetch);
  }

  try {
    if (!response.ok)
      throw new Error(`Failed to fetch any thumbnail for ${videoId}`);
    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(imagePath, buffer);
    console.log(`  ✓ Downloaded thumbnail for ${videoId}`);
    return webPath;
  } catch (error) {
    console.error(`  ✗ CRITICAL: Could not download any thumbnail.`, error);
    return `/images/placeholder.jpg`;
  }
}

async function getPlaylistVideoIds(playlistId) {
  let videoIds = [];
  let nextPageToken = null;
  do {
    const response = await youtube.playlistItems.list({
      playlistId: playlistId,
      part: ["contentDetails"],
      maxResults: 50,
      pageToken: nextPageToken,
    });
    videoIds.push(
      ...response.data.items.map((item) => item.contentDetails.videoId)
    );
    nextPageToken = response.data.nextPageToken;
  } while (nextPageToken);
  return videoIds;
}

async function main() {
  console.log("Starting build extraction process...");
  console.log(`builds.json path: ${path.resolve(BUILDS_FILE_PATH)}`);
  console.log(`images path: ${path.resolve(IMAGES_BASE_DIR)}`);

  try {
    if (!fs.existsSync(BUILDS_OUTPUT_PATH)) {
      fs.mkdirSync(BUILDS_OUTPUT_PATH, { recursive: true });
    }
    if (!fs.existsSync(IMAGES_BASE_DIR)) {
      fs.mkdirSync(IMAGES_BASE_DIR, { recursive: true });
    }

    let existingBuilds = [];
    const existingIds = new Set();
    if (fs.existsSync(BUILDS_FILE_PATH) && !FORCE_REFRESH_ALL) {
      const rawData = fs.readFileSync(BUILDS_FILE_PATH, "utf-8");
      existingBuilds = JSON.parse(rawData);
      existingBuilds.forEach((build) => existingIds.add(build.id));
      console.log(
        `Found ${existingBuilds.length} existing builds. Verifying files...`
      );

      // --- IMAGE INTEGRITY CHECK ---
      console.log("Checking for missing thumbnails...");
      const missingImages = [];
      for (const build of existingBuilds) {
        const expectedImagePath = path.join(
          IMAGES_BASE_DIR,
          build.id,
          "thumbnail.jpg"
        );
        if (!fs.existsSync(expectedImagePath)) {
          missingImages.push(build.id);
        }
      }

      if (missingImages.length > 0) {
        console.log(
          `Found ${missingImages.length} missing thumbnails. Re-downloading...`
        );
        for (const videoId of missingImages) {
          await downloadThumbnail(videoId);
        }
        console.log("Finished re-downloading missing thumbnails.");
      } else {
        console.log("All thumbnails are present.");
      }
    } else {
      if (FORCE_REFRESH_ALL) {
        console.log(
          "FORCE_REFRESH_ALL is true. Performing a full refresh of all data."
        );
      } else {
        console.log("No existing builds.json found. Performing a full run.");
      }
    }

    const mxVideoIds = await getPlaylistVideoIds(YOUTUBE_MX_PLAYLIST_ID);
    const ecVideoIds = await getPlaylistVideoIds(YOUTUBE_EC_PLAYLIST_ID);

    const videoMap = new Map();
    mxVideoIds.forEach((id) => videoMap.set(id, { category: "MX" }));
    ecVideoIds.forEach((id) => videoMap.set(id, { category: "EC" }));

    const allYoutubeIds = Array.from(videoMap.keys());
    const videosToProcessIds = FORCE_REFRESH_ALL
      ? allYoutubeIds
      : allYoutubeIds.filter((id) => !existingIds.has(id));

    if (videosToProcessIds.length === 0) {
      console.log("✅ No new videos found. Your builds.json is up to date!");
      return;
    }

    console.log(`Found ${videosToProcessIds.length} videos to process.`);

    const newBuilds = [];
    for (let i = 0; i < videosToProcessIds.length; i += 50) {
      const batchIds = videosToProcessIds.slice(i, i + 50);
      const videoDetailsResponse = await youtube.videos.list({
        id: batchIds,
        part: ["snippet", "status"],
      });

      for (const video of videoDetailsResponse.data.items) {
        if (video.status.privacyStatus !== "public") {
          console.log(`  - Skipping non-public video: ${video.snippet.title}`);
          continue;
        }

        const { category } = videoMap.get(video.id);
        const specs = {};
        const lines = video.snippet.description.split("\n");

        for (const line of lines) {
          if (line.includes(":")) {
            const parts = line.split(":");
            const rawKey = parts[0].trim();
            const value = parts.slice(1).join(":").trim();
            const standardKey = keyMap[rawKey];
            if (standardKey) specs[standardKey] = value;
          }
        }

        if (Object.keys(specs).length > 0) {
          const imagePath = await downloadThumbnail(video.id);
          newBuilds.push({
            id: video.id,
            title: cleanTitle(video.snippet.title, category),
            youtubeTitle: video.snippet.title,
            category: category,
            timestamp: video.snippet.publishedAt,
            images: [imagePath],
            youtubeUrl: `https://youtu.be/${video.id}`,
            specs: specs,
          });
        }
      }
    }

    const finalBuilds = FORCE_REFRESH_ALL
      ? newBuilds
      : [...existingBuilds, ...newBuilds];
    finalBuilds.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    fs.writeFileSync(
      BUILDS_FILE_PATH,
      JSON.stringify(finalBuilds, null, 2),
      "utf-8"
    );

    console.log(
      `\n✅ Success! Processed ${newBuilds.length} videos. Total builds: ${finalBuilds.length}.`
    );
    console.log(
      `Your builds.json is at: ${path.resolve(BUILDS_FILE_PATH)}`
    );
    console.log(
      `Your images are at: ${path.resolve(IMAGES_BASE_DIR)}`
    );
  } catch (error) {
    console.error("\n❌ An error occurred:", error.message);
  }
}

main();