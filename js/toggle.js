document.querySelectorAll(".toggleButton").forEach(function(button) {
    button.addEventListener("click", function() {
        var toggleInfoDiv = button.closest(".toggle-info-div");
        var contentDiv = toggleInfoDiv.nextElementSibling;
        
        toggleInfoDiv.classList.add("hidden");
        contentDiv.classList.remove("hidden");
    });
});