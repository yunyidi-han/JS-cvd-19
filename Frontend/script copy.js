const symptomsTab = document.getElementById("symptoms");
const stopSpread = document.getElementById("stop-spread");
const coughimage = document.getElementById("cough-image");
const lightBreathImage = document.getElementById("light-breath-image");
const lightFeverImage = document.getElementById("light-fever-image");
const wearMaskImage = document.getElementById("wear-mask-image");

symptomsTab.addEventListener("click", () => {
  coughimage.style.display = "block";
  lightBreathImage.style.display = "block";
  lightFeverImage.style.display = "block";
  wearMaskImage.style.display = "none";
});

stopSpread.addEventListener("click", () => {
  wearMaskImage.style.display = "block";
  coughimage.style.display = "none";
  lightBreathImage.style.display = "none";
  lightFeverImage.style.display = "none";
});

/*This portion of code is for the US map */
$("path, circle").hover(function (e) {
  $("#info-box").css("display", "block");
  $("#info-box").html($(this).data("info"));
});

$("path, circle").mouseleave(function (e) {
  $("#info-box").css("display", "none");
});

$("path, circle").click((e) => {
  let state = e.target.id; //gets the 2 letter state ID when clicking on the map
});

$(document)
  .mousemove(function (e) {
    $("#info-box").css("top", e.pageY - $("#info-box").height() - 30);
    $("#info-box").css("left", e.pageX - $("#info-box").width() / 2);
  })
  .mouseover();

var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
if (ios) {
  $("a").on("click touchend", function () {
    var link = $(this).attr("href");
    window.open(link, "_blank");
    return false;
  });
}
