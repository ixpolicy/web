/**
 * Patch Pilot Mini JS
 * Version: 1.0
 * Author: Synamic Technologies
 */

(function ($) {
    'use strict';

    // Go to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.go-to-top').fadeIn('slow');
        } else {
            $('.go-to-top').fadeOut('slow');
        }
    });

    $('.go-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 500, 'swing', function () {
        });
        return false;
    });

    $("a.nav-link[href*='#'], a.report-link[href*='#']").click(function (e) {

        var anchor = $(this).prop('hash');
        if ($(anchor).length) {
            e.preventDefault();
            $('html,body').animate({scrollTop: $(anchor).offset().top}, 'slow');
        } else {
            $('html,body').animate({scrollTop: 0}, 'slow');
        }
    });

    //Feedback modal
    var modalEle = $('#modalPoll-1');
    //wait 5 seconds and activate feedback request
    setTimeout(function() {
        modalEle.attr('data-ready', true);
    }, 8000);

    function addEvent(obj, evt, fn) {
        if (obj.addEventListener) {
            obj.addEventListener(evt, fn, false);
        } else if (obj.attachEvent) {
            obj.attachEvent("on", +evt, fn);
        }
    }

    function isFeedbackModalReady(el) {
        if (el == null) {
            return
        }
        return (typeof el.attr('data-ready') !== 'undefined') && (el.attr('data-ready') == 'true' ||
            el.attr('data-ready') == 1 || el.attr('data-ready') == 'True' ||
            el.attr('data-ready') == '1');
    }

    function setFeedbackModalAsAlreadyShown(el) {
        if (el == null) {
            return
        }
        el.attr('data-already-shown', true);


    }

    function hasFeedbackModalAlreadyBeenShown(el) {
        return (typeof el.attr('data-already-shown') !== 'undefined') && (el.attr('data-already-shown') == 'true' ||
            el.attr('data-already-shown') == 1 || el.attr('data-already-shown') == 'True' ||
            el.attr('data-already-shown') == '1');
    }


    addEvent(document, "mouseout", function (e) {
        e = e ? e : window.event;
        var from = e.relatedTarget || e.toElement;
        if (!from || from.nodeName == "HTML") {
            if (isFeedbackModalReady(modalEle) && !hasFeedbackModalAlreadyBeenShown(modalEle)) {
                setTimeout(function () {
                    modalEle.modal("show");
                }, 200);
                setFeedbackModalAsAlreadyShown(modalEle);
            }
        }
    });

    var options = {
        max_value: 5,
        step_size: 1.0
    }
    $("#rate1").rate(options);
    $("#rate1").on("change", function (ev, data) {
        $("#form-feedback-rating").val(data.to);
        $("#rate1 > .rate-base-layer").css({color: ""});
    })

    $('.modal form').on('submit', function (event) {
        event.preventDefault()
        //check input fields
        if (["1", "2", "3", "4", "5"].includes($("#form-feedback-rating").val())) {
            $.ajax({
                url: "/feedback",
                method: 'post',
                data: $(this).serialize(),
                success: function (e) {
                    modalEle.modal("hide");
                },
            });
        } else {
            $("#rate1 > .rate-base-layer").css({color: "red"});
        }
    });


    $('#inputReportId').inputmask("A{1}9{2}-9{4}-A{1}9{3}");
    if ($('#particles-js').length) {
        particlesJS('particles-js',
            {
                "particles": {
                    "number": {
                        "value": Math.ceil(($(document).width() / 25)),
                        "density": {
                            "enable": false
                        }
                    },
                    "color": {
                        "value": "#ffffff"
                    },
                    "shape": {
                        "type": "circle",
                        "stroke": {
                            "width": 0,
                            "color": "#000000"
                        }
                    },
                    "opacity": {
                        "value": 0.4,
                        "random": false,
                        "anim": {
                            "enable": false
                        }
                    },
                    "size": {
                        "value": 3,
                        "random": true,
                        "anim": {
                            "enable": false
                        }
                    },
                    "line_linked": {
                        "enable": true,
                        "distance": 140,
                        "color": "#ffffff",
                        "opacity": 0.2,
                        "width": 1
                    },
                    "move": {
                        "enable": true,
                        "speed": 0.25,
                        "direction": "none",
                        "random": false,
                        "straight": false,
                        "out_mode": "out",
                        "bounce": false,
                        "attract": {
                            "enable": false
                        }
                    }
                },
                "interactivity": {
                    "detect_on": "canvas",
                    "events": {
                        "onhover": {
                            "enable": true,
                            "mode": "bubble"
                        },
                        "onclick": {
                            "enable": false
                        },
                        "resize": true
                    },
                    "modes": {
                        "bubble": {
                            "distance": 150,
                            "size": 3.05,
                            "duration": 2,
                            "opacity": 0.8,
                            "speed": 3
                        }
                    }
                },
                "retina_detect": true
            }
        );
    }
    /** show/hide explanations of recommendations */
    $("button.recommendation-details-toggle").click(function (e) {
        var i = $(this).closest("tr").find("i");
        i.toggleClass("fa-chevron-down");
        i.toggleClass("fa-chevron-right");
        $(this).closest("tr").next().toggle();
    });
    /** Filter recommendations by risk level */
    $("button.recommendation-filter").click(function(e) {
        e.preventDefault();

        $("button.recommendation-filter").removeClass("active");
        $(this).toggleClass("active");

        var filterValues = [];
        if ($(this).hasClass("recommendation-filter-all")) {
            filterValues = ['low', 'mid', 'high'];
        } else {
            $("button.recommendation-filter.active").map(function() {
                filterValues.push($(this).attr('data-filter-value'));
            });
        }
        var trs = $(".report-recommendations table tbody tr")
        var modifiedRows = trs.filter(function () {
                return $(this).find('td').length<=2 || $(this).find('td').length>2 && filterValues.indexOf($.trim($(this).attr('data-recommendation-risk-score')))<0
            }).hide().length;

        modifiedRows += trs.filter(function () {
                return $(this).find('td').length>2 && filterValues.indexOf($.trim($(this).attr('data-recommendation-risk-score')))>-1
            }).show().length;

        //collapse all explanations
        $("button.recommendation-details-toggle i").addClass("fa-chevron-right");
        $("button.recommendation-details-toggle i").removeClass("fa-chevron-down");
    });
})(jQuery);