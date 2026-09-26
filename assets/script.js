document.addEventListener("DOMContentLoaded", function () {
  var form = document.getElementById("expertForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var success = document.getElementById("formSuccess");
    form.classList.add("hidden");
    if (success) success.classList.add("show");
    if (window.dataLayer) {
      window.dataLayer.push({ event: "book_an_expert_submit" });
    }
  });
});
