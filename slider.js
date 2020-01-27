var slider = (function() {
    /* Setup some defaults */
    var windowTransitionSize = 1028;
    var winSize = windowSize();
    var manualInit = false;

    /* Setup a global variable determining whether auto-advancing sliders should
    preceed. The only time they won't, is on hover. */
    var shouldAdvance = true;

    // Setup default class names
    var itemClass = ".carousel-item";

    /* Options that can only be set when the src call is made via 'data-'
     * options. */
    var dataOnlyOptions = {
        'manualInit': 'data-manualInit',
    };
    var validOptions = {
        'numActiveItems': 'data-activeItems',
        'indicatorLinks': 'data-indicatorLinks',
        'itemInFocus': 'data-itemInFocus',
        'interval': 'data-interval',
    };
    var options = {
        'default': {
            'indicatorLinks': true,
            'itemInFocus': 1,
            'numActiveItems':  3,
            'interval': 3000
        },
    };

    /* Parse the script params and set the defaults. */
    getScriptParams();

    /* Initialize each slider on the page once the page finishes loading. */
    $(document).ready(function() {
        if(! manualInit) {
            var list = $(".slider");
            if($(list).length > 1) {
                $(list).each(function(){
                    initializeSlider($(this).attr('id'));
                });
            } else {
                initializeSlider($($('.slider')[0]).attr('id'));
            }
        }
    });

    /* Get the item currently in focus for a specific sliderID. */
    function focusedItemIndex(sliderID) {
        return options[sliderID].indexOfFocusedItem;
    }

    /* Initialize a slider by setting up default values, displaying the slider,
     * and adding click listeners for each control method. */
    function initializeSlider(id,opts) {
        /* An ID must be provided. Return here if it isn't. */
        if(! id) {
            console.log("The slider class and an id must be set for the slider!");
            return;
        }

        /* Set options for this slider. If no options or invalid options are
         * provided, use the defaults. */
        setOptions(id,opts);

        /* Hide the controls if the total number of items is less than the
         * number of items to be displayed. */
        if(options[id].numActiveItems >= $(`#${id} ${itemClass}`).length && windowSize()) {
            $(`#${id} .carousel-control-prev`).hide();
            $(`#${id} .carousel-control-next`).hide();
        }

        /* Set the index if one of the items has the sliderFocus CSS class */
        var idx = $('#'+id+' .sliderFocus').index();
        if(idx < 0) {
            idx = 0;
        }

        /* Setup the slider */
        changeSlider(idx,id);

        /* Create click listeners for the slider controls, each item in the
         * slider and optionally for the indicators. */
        controlsListeners(id);
        itemListener(id);
        if(options[id].indicatorLinks) {
            addIndicatorListeners(id);
        }
        
        /* If the slider has the class of "slide", the user wants the slider to
        automatically increment every interval. */
        if($("#"+id).hasClass("slide")) {
            setupAutoSlide(id); 
        }
    }
    /* Change the number of visible items in the slider on
     * window resize if necessary */
    window.onresize = function() {
        var newWinSize = windowSize();
        if(newWinSize != winSize) {
            var list = $(".slider");
            if($(list).length > 1) {
                $(list).each(function(){
                    changeSlider(0,$(this).attr('id'));
                });
            } else {
                changeSlider(0);
            }
            winSize = ! winSize;
        }
    };

    /* Setup a slider to automatically advance. */
    function setupAutoSlide(sliderID) {
        /* Pause auto advance if the user hovers over the slider. */
        $(`#${sliderID}`).hover(() => { shouldAdvance = false},() => { shouldAdvance = true; });

        /* Setup an interval to automatically advance except on hover. */
        setInterval(() => {
           if(shouldAdvance) { 
            changeSlider('+',sliderID);
           }
        },options[sliderID].interval);
    }

    /* Parse input and override defaults if the caller specifies values */
    function getScriptParams() {
        var scriptOpts = {};
        var scripts = document.getElementsByTagName('script');
        var scriptName  = scripts[scripts.length-1];

        /* Override any defaults for values that can only be set globally via
         * the 'data-' calls and not on a per slider basis. */
        for(opt in dataOnlyOptions) {
            var attr = $(scriptName).attr(dataOnlyOptions[opt]);
            if (typeof attr !== typeof undefined && attr !== false) {
                    if(attr === 'true') {
                        eval(opt+'='+true);
                    } else {
                        eval(opt+'='+false);
                    }
            }
        }

        /* Define each option that can be called via the 'data-' calls or at
         * slider initialization in order to setup the default values. */
        for(opt in validOptions) {
            scriptOpts[opt] = $(scriptName).attr(validOptions[opt]);
        }
        setOptions('default',scriptOpts);
    }

    function setOptions(id,opts) {
        if(! id) return;
        var myOpts = opts || {};

        /* Initialize the options object entry for this id if it isn't already
         * defined. */
        if(! options[id]) {
            options[id] = {};
        }

        /* Cycle through each valid option and see if it has been overridden by
         * a user specified value */
        for(opt in validOptions) {
            var attr = myOpts[opt];
            if (typeof attr !== typeof undefined && attr !== false) {
                if(attr === 'false') {
                    options[id][opt] = false;
                } else {
                    if(opt == 'numActiveItems') {
                        if(! Number.isInteger(parseInt(attr))) {
                            attr = 3;
                        } else {
                            attr = parseInt(attr);
                        }
                    } else if(opt == 'itemInFocus') {
                        if(! Number.isInteger(parseInt(attr)) || attr > options[id].numActiveItems || attr < 1) {
                            attr = 1;
                        } else {
                            attr = parseInt(attr);
                        }
                    }
                    options[id][opt]= attr;
                }
            } else {
                /* Use the default if another value isn't specified. */
                options[id][opt] = options['default'][opt];
            }
        }
    }

    /* Setup a click listener for slider controls.*/
    function controlsListeners(sliderID) {
        $('#'+sliderID+' .carousel-control-prev').click(function(event) {
            /* Stop the click from doing the default action. */
            event.preventDefault();
            event.stopPropagation();
            changeSlider('-',sliderID);
        });

        $('#'+sliderID+' .carousel-control-next').click(function(event) {
            /* Stop the click from doing the default action. */
            event.preventDefault();
            event.stopPropagation();
            changeSlider('+',sliderID);
        });
    }

    /* Setup a click listener for each item so if a user clicks on it, it 
     * becomes the item in focus. */
    function itemListener(sliderID) {
        $('#'+sliderID+' .carousel-inner').on('click',itemClass,function(event) {
            /* Stop the click from doing the default action. */
            event.preventDefault();
            event.stopPropagation();

            var openLinkDelay = 600;
            var openNewWindow = false;

            /* Determine where in the list of items we are */
            var index = $(this).index();

            /* Determine the number of items and the number of items that are
             * permanent. These may be different because temporary items are
             * added to the list so the slider will appear continuous. */
            var len = $(`#${sliderID} .carousel-inner ${itemClass}`).length;
            var absLen = $(`#${sliderID} .carousel-inner ${itemClass}`).not('.start-temp').not('.end-temp').length;

            /* If the absolute length is different than the current length (i.e.
             * if there are temporary items right now) */
            if(absLen < len) {
                /* Get the number of items that were temporarily added to the end. We
                 * need this to adjust the index. */
                var numEndTemp = len - $(`#${sliderID} .carousel-inner ${itemClass}`).not('.start-temp').length;

                /* Adjust the index location if there were extra items added to 
                 * the end.*/
                index = index - (numEndTemp);

                /* Update the index to reflect the actual location of the item if a
                 * temporary item was clicked on. */
                if($(this).hasClass('start-temp')) {
                    index = len - numEndTemp  + index;
                }
                else if($(this).hasClass('end-temp')) {
                    index = index - absLen;
                }
            }

            /* If the item has a link defined, set the url variable so it can be followed */
            if($(this).attr('data-href') !== null) {
                var url = $(this).attr('data-href');
                if($(this).hasClass('focused')) {
                    openLinkDelay = 0;
                }
                if($(this).attr("target") === "_blank") {
                    openNewWindow = true;
                }
            }

            /* Update the item in focus */
            changeSlider(index,sliderID);

            /* If the item has a link attached to it, follow it. If the item wasn't
             * previously in focus, follow the link after a short delay to allow
             * the item to come into focus. */
            if(url) {
                setTimeout(function(){
                    /* If the user set target="_blank", open the link in a new window. */
                    if(openNewWindow) {
                        window.open(url);
                    } else {
                        window.location.href = url
                    }
                },openLinkDelay);
            }
        });
    }

    /* Add a click listener for indicators */
    function addIndicatorListeners(id) {
        if(id) {
            var sliderID = id;
        } else {
            var sliderID = $($('.slider')[0]).attr('id');
        }
        $('#'+sliderID+' .carousel-indicators li').click(function(event) {
            /* Stop the click from doing the default action. */
            event.preventDefault();
            event.stopPropagation();

            /* Get the slider ID to use to change the item in focus */
            changeSlider($(this).index(),sliderID);
        });
    }
    /* Return 1 if the window size is larger than the transition size, 
     * 0 otherwise. */
    function windowSize() {
        return $(window).width() > windowTransitionSize ? 1: 0;
    }

    /* Slider javascript */ 
    function changeSlider(num,sliderID) {
        /* Only change the slider if the number and slider are defined. */
        if(num == null || sliderID == null) return;

        var sliderItem = `#${sliderID} ${itemClass}`;
        var controls   = ['#'+sliderID+' .carousel-control-prev','#'+sliderID+' .carousel-control-next'];
        var indicators = '#'+sliderID+' .carousel-indicators';
        var inner      = '#'+sliderID+' .carousel-inner';

        /* Define the focused item for future use */
        var activeItem = sliderItem+'.active.focused';

        /* Get the number of items. */
        var len = $(sliderItem).not('.start-temp').not('.end-temp').length;

        /* Define the offset */
        var offset = function() {
            if(len < options[sliderID].numActiveItems) {
                return 0;
            } else {
                return 1 - options[sliderID].itemInFocus;
            }
        };

        /* Save the current scroll position to restore it later. */
        var y = window.pageYOffset;

        /* Remove temporary items from the slider */
        $(sliderItem).remove('.start-temp');
        $(sliderItem).remove('.end-temp');

        /* Set the active slide number if only told to increment/decrement. Have to
         * do this here before the focused class is removed from the previously
         * selected element. */
        if(num == '-') {
            num = $(activeItem).index() -1;
        } else if(num == '+') {
            num = $(activeItem).index() +1;
        }

        /* Reset the style for the previous slider item */
        $(activeItem).removeClass('focused');

        /* Set the current item to wrap around if necessary */
        if(num < 0) {
            num = len + num;
        } else if(num >= len) {
            num = num - len;
        }

        /* Hide the controls if there is only one item. */
        if(len == 1) {
            controls.forEach(control => $(control).hide());
        }

        /* Set the correct indicator to active */
        $(indicators).find('li').removeClass('active');
        $(indicators).find('li').eq(num).addClass('active');

        /* Deactivate all items */
        $(sliderItem).removeClass('active');

        /* If the window size is greater than or equal to windowTransitionSize, activate the correct number of items */
        if($( window ).width() >= windowTransitionSize) {
            var prepend = [];
            for(var i = offset(); i < options[sliderID].numActiveItems + offset() ; i++) {
                var imgNum = (num + i);
                if(i >= len) {
                    break;
                }
                if(imgNum < 0) {
                    prepend.push($(sliderItem).not('.start-temp').eq(imgNum + len).clone().addClass('start-temp active'));
                } else if(imgNum < len ) {
                    $(sliderItem).not('.start-temp').eq(imgNum).addClass('active');
                    if(prepend.length > 0) {
                        prepend.reverse();
                        $(prepend).each(function(index) {
                            $(prepend[index]).prependTo(inner);
                        });
                        prepend = [];
                    }
                } else if(imgNum == len) {
                    if(len > options[sliderID].numActiveItems -1) {
                        $(sliderItem).eq(imgNum % len).clone().appendTo(inner);
                        $(sliderItem).eq($(sliderItem).length - 1).addClass('end-temp active');
                    } else {
                        $(sliderItem).not('.start-temp').eq(imgNum % len).addClass('active');
                    }
                } else {
                    /* if imgNum > len */
                    $(sliderItem).eq(imgNum % len).clone().appendTo(inner);
                    $(sliderItem).eq($(sliderItem).length - 1).addClass('active end-temp');
                }
            }
            /* If the window size is less than windowTransitionSize, activate 1 item */
        } else {
            $(sliderItem).eq(num).addClass('active');
        }

        /* Add the focused class to the current item. */
        $(sliderItem).not('.start-temp').eq(num).addClass('focused');

        /* Save off the item index currently in focus */
        options[sliderID].indexOfFocusedItem = num;

        /* Trigger the changeSlider custom event. */
        $('#'+sliderID).trigger("changeSlider");

        /* Scroll to the initial Y position */
        window.scrollTo(0, y);
    }
    /* Make the initialize function and current item index function publicly
     * available via the module.init call. */
    return {
        init: initializeSlider,
        focusedItemIndex: focusedItemIndex,
    };
})();
