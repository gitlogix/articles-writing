$(document).ready(() => {
    $(".delete_article").on("click", (e) => {
        const $target = $(e.target);
        $(this).parent().css("color", "red");
        const id = $(this).attr("data-id");
        // $.ajax({
        //     type: "Delete",
        //     url: "/article/" + id,
        //     success: function(response) {
        //         window.location.href = "/articles"
        //     },
        //     error: function(error) {
        //         alert("Can not delete it now!");
        //     }
        // })
    });
})