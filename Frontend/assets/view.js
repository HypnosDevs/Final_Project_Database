document.querySelectorAll(".selection").forEach(function(selectStatus) {
    selectStatus.addEventListener("change", function() {
        switch(selectStatus.value) {
            case "Pending":
                selectStatus.style.backgroundColor = "#eafffa";
                break;
            case "Shipping":
                selectStatus.style.backgroundColor = "#fcefff";
                break;
            case "Delivered":
                selectStatus.style.backgroundColor = "#dcffe0";
                break;
            default:
                selectStatus.style.backgroundColor = "eafffa"; // Reset background color if none of the cases match
        }
    });
});

