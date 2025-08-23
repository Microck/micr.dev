<script>
  document.addEventListener("DOMContentLoaded", () => {
    const LOGOS = [
      "assets/quarzitelogo3.gif",
      "assets/quarzitelogo4.gif"
    ];
    const img = document.getElementById("logo-img");
    if (img) {
      const i = Math.floor(Math.random() * LOGOS.length);
      img.src = LOGOS[i];
    }
  });
</script>