<script>
  document.addEventListener("DOMContentLoaded", function () {
    var LOGOS = [
      "assets/quarzitelogo3.gif",
      "assets/quarzitelogo4.gif"
    ];
    var img = document.getElementById("logo-img");
    if (img) {
      var i = Math.floor(Math.random() * LOGOS.length);
      img.src = LOGOS[i];
    }
  });
</script>
