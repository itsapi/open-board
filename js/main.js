function submitPost() {
    if ("" != $("#newPost").val() && 142 > $("#newPost").val().length) {
        var a = $("#newPost").val().replace(/\n+/g, "<br>") + "\n";
        $.ajax({
            url: "savePost.php",
            type: "post",
            data: {
                postContent: a
            }
        }).done(function() {
            loadNew(), $("#newPost").val("").focus()
        })
    } else {
        var b = "";
        "" == $("#newPost").val() && (b += "Your post cannot be blank.\n"), $("#newPost").val().length >= 142 && (b += "Your post must not be more than 142 characters.\n"), alert(b)
    }
}
function loadNew(a) {
    0 == $(window).scrollTop() && $.ajax({
        url: "noPosts.php"
    }).done(function(b) {
        if (noPosts >= b || 1 == a) var c = 1 > b - defaultLoad ? 1 : b - defaultLoad;
        else var c = b - (b - noPosts);
        var d = b;
        $.getJSON("getPosts.php", {
            from: c,
            to: d
        }).done(function(c) {
            if (b > noPosts) $.each(c, function(b, c) {
                $("#board ul").prepend("<li>" + displayPost(c) + "</li>"), $("#board li:first-child").emoticonize(), noLoaded++, 1 != a && ($("#board li:last-child").remove(), noLoaded--)
            });
            else {
                for (var d = noLoaded - defaultLoad, e = 0; d >= e; e++) $("#board li:last-child").remove(), noLoaded--;
                $.each($("#board li").get().reverse(), function(a) {
                    $(this).children("time").html(timeDifference(c[a + 1][0]))
                })
            }
            noPosts = b
        })
    })
}
function timeDifference(a) {
    var b = 6e4,
        c = 60 * b,
        d = 24 * c,
        e = 30 * d,
        f = 365 * d,
        g = Date.now(),
        h = g - 1e3 * a,
        i = "s";
    return b > h ? (1 == Math.round(h / 1e3) && (i = ""), Math.round(h / 1e3) + " Second" + i + " ago") : c > h ? (1 == Math.round(h / b) && (i = ""), Math.round(h / b) + " Minute" + i + " ago") : d > h ? (1 == Math.round(h / c) && (i = ""), Math.round(h / c) + " Hour" + i + " ago") : e > h ? (1 == Math.round(h / d) && (i = ""), Math.round(h / d) + " Day" + i + " ago") : f > h ? (1 == Math.round(h / e) && (i = ""), Math.round(h / e) + " Month" + i + " ago") : (1 == Math.round(h / f) && (i = ""), Math.round(h / f) + " Year" + i + " ago")
}
function displayPost(a) {
    var b = new Date(1e3 * a[0]).format("Y-m-d H:i");
    return '<time datetime="' + b + '">' + timeDifference(a[0]) + "</time> " + a[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(exp, '<a target="_blank" class="no-emoticons" href=\'$1\'>$1</a>')
}
function resizeElm() {
    $("#newPost").css("width", $("h1").width() - 23)
}
$(window).scroll(function() {
    $(window).scrollTop() == $(document).height() - $(window).height() && ($("#board ul").addClass("loading"), $.ajax({
        url: "noPosts.php"
    }).done(function(a) {
        totalLines = a, a > noLoaded ? (a = defaultLoad > totalLines - noLoaded ? totalLines - noLoaded : defaultLoad, $.getJSON("getPosts.php", {
            from: 1 > totalLines - noLoaded - a - 1 ? 1 : totalLines - noLoaded - a - 1,
            to: totalLines - noLoaded - 1
        }).done(function(a) {
            $.each(a.reverse(), function(a, b) {
                $("#board ul").append("<li>" + displayPost(b) + "</li>"), $("#board li:last-child").emoticonize(), noLoaded++
            }), $("#board li").emoticonize()
        }), $("#board ul").removeClass("loading")) : $("#board ul").addClass("empty")
    })), $(window).scrollTop() > $(window).height() ? $("#top").css("bottom", 0) : $("#top").css("bottom", -50), $(window).scrollTop() > $("h1").height() + 25 ? ($("#post").css({
        position: "fixed",
        top: -($("h1").height() + 25)
    }), $("#board").css({
        "margin-top": $("#post").height() + 25
    })) : ($("#post").css({
        position: "relative",
        top: 0
    }), $("#board").css({
        "margin-top": 0
    }))
});
var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
    defaultLoad = parseInt($(window).height() / 50),
    noLoaded = 0,
    noPosts = 0;
$(document).ready(function() {
    $("#post h1").fitText(), resizeElm(), $(window).resize(resizeElm), $("body").append('<div id="top"></div>'), $("div#top").click(function() {
        return $("html, body").animate({
            scrollTop: 0
        }, "slow"), !1
    }), loadNew(1), setInterval(loadNew, 5e3)
});