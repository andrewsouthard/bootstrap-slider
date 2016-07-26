(function() {
    /* Setup some defaults */
    var windowTransitionSize = 1028;
    var indicatorLinks = true;
    var itemInFocus = 1;
    var numActiveItems = 3;
    var winSize = windowSize();

    /* Set any user defined values. */
    getScriptParams();

    /* Initialize each slider on the page once the page finishes loading. */
    $(document).ready(function() {
        var list = $(".slider");
        if($(list).length > 1) {
            $(list).each(function(){
                changeSlider(0,$(this).attr('id'));
            });
        } else {
            changeSlider(0);
        }
    });

    /* Change the number of visible items in the slider on 
     * window resize if  necessary */
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

    /* Parse input and override defaults if the caller specifies values */
    function getScriptParams() {
        var scripts = document.getElementsByTagName('script');
        var scriptName  = scripts[scripts.length-1];
        var validOptions = {
            'data-activeItems': 'numActiveItems',
            'data-indicatorLinks': 'indicatorLinks',
            'data-itemInFocus': 'itemInFocus',
        };
        for(option in validOptions) {
            var attr = $(scriptName).attr(option);
            if (typeof attr !== typeof undefined && attr !== false) {
                if(attr === 'false') {
                    eval(validOptions[option]+'='+ false);
                } else {
                    if(validOptions[option] == 'numActiveItems') {
                        if(! Number.isInteger(parseInt(attr))) {
                            attr = 3;
                        }
                    } else if(validOptions[option] == 'itemInFocus') {
                        if(! Number.isInteger(parseInt(attr)) || attr > numActiveItems || attr < 1) {
                            attr = 1;
                        }
                    }
                    eval(validOptions[option]+'='+ attr);
                }
            }
        }
    }

    /* Setup a click listener for slider controls.*/
    $('.carousel-control').click(function(event) {
        /* Get the slider ID to use to change the item in focus */
        var sliderID = $($(this).parents('.slider')[0]).attr('id');

        /* Nothing will happen unless the control has a left or right class. It 
         * should based on the default bootstrap carousel layout. */
        if($(this).hasClass('left')) {
            changeSlider('-',sliderID); 
        } else if($(this).hasClass('right')) {
            changeSlider('+',sliderID); 
        }
    });
    /* Setup a click listener for each item so if a user clicks on it, it 
     * becomes the item in focus. */
    $('.carousel-inner').on('click','.item',function(event) { 
        var openLinkDelay = 600; 

        /* Get the slider ID to use to change the item in focus */
        var sliderID = $($(this).parents('.slider')[0]).attr('id');

        /* Determine where in the list of items we are */
        var index = $(this).index();

        /* Determine the number of items and the number of items that are 
         * permanent. These may be different because temporary items are 
         * added to the list so the slider will appear continuous. */
        var len = $('#'+sliderID+' .carousel-inner .item').length;
        var absLen = $('#'+sliderID+' .carousel-inner .item').not('.start-temp').not('.end-temp').length;

        /* If the absolute length is different than the current length (i.e. 
         * if there are temporary items right now) */
        if(absLen < len) {
            /* Get the number of items that were temporarily added to the end. We 
             * need this to adjust the index. */
            var numEndTemp = len - $('#'+sliderID+' .carousel-inner .item').not('.start-temp').length;

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
        if($(this).attr('data-href') != null) {
            var url = $(this).attr('data-href');
            if($(this).hasClass('focused')) {
               openLinkDelay = 0;
            }
        }

        /* Update the item in focus */
        changeSlider(index,sliderID);

        /* If the item has a link attached to it, follow it. If the item wasn't
         * previously in focus, follow the link after a short delay to allow 
         * the item to come into focus. */
        if(url) {
            setTimeout(function(){
            window.open(url,'_target=blank');
            },openLinkDelay);
        }

    });

    /* Add a click listener for indicators */
    $('.carousel-indicators li').click(function(event) { 
        if(indicatorLinks) {
            /* Get the slider ID to use to change the item in focus */
            var sliderID = $($(this).parents('.slider')[0]).attr('id');
            changeSlider( $(this).index(),sliderID); 
        }
    });
    /* Return 1 if the window size is larger than the transition size, 
     * 0 otherwise. */
    function windowSize() {
        return $(window).width() > windowTransitionSize ? 1: 0;
    }

    /* Slider javascript */ 
    function changeSlider(num,sliderID) {
        var inner      = '.carousel-inner';
        var sliderItem = inner+' .item';
        var indicators = '.carousel-indicators';
        var controls   = '.carousel-control';
        var overlay       = '.grey-img-overlay';

        /* Prepend the slider ID. This is used if there is more than one slider
         * per page. Otherwise the variable will be null. */
        if(sliderID != null) {
            sliderItem    = '#'+sliderID+' '+sliderItem;
            controls      = '#'+sliderID+' '+controls;
            indicators    = '#'+sliderID+' '+indicators;
            inner         = '#'+sliderID+' '+inner;
        }

        /* Define the focused item for future use */
        var activeItem = sliderItem+'.active.focused';

        /* Get the number of items. */
        var len = $(sliderItem).not('.start-temp').not('.end-temp').length;

        // Define the offset
        var offset = function() { 
            if(len < numActiveItems) {
                return 0;
            } else {
                return 1 - itemInFocus; 
            }
        };

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

        /* Reset the onclick link for the previous slider item  */
        var activeHref = $(activeItem).children('a').attr('activehref');
        if(activeHref != null) {
            $(activeItem).children('a').attr('activehref',$(activeItem).children('a').attr('href'));
            $(activeItem).children('a').attr('onclick',activeHref);
            $(activeItem).children('a').attr('href','javascript:void(0)');
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
            $(controls).hide(); 
        }

        if(len < numActiveItems) {
            $(inner).addClass("carousel-left");
        }

        /* Set the correct indicator to active */
        $(indicators).find('li').removeClass('active');
        $(indicators).find('li').eq(num).addClass('active');

        /* Deactivate all items */
        $(sliderItem).removeClass('active');

        /* If the window size is greater than or equal to windowTransitionSize, activate the correct number of items */
        if($( window ).width() >= windowTransitionSize) {
            var prepend = [];
            for(var i = offset(); i < numActiveItems + offset() ; i++) {
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
                    if(len > numActiveItems -1) {
                        $(sliderItem).eq(imgNum % len).clone().appendTo(inner);
                        $(sliderItem).eq($(sliderItem).length - 1).addClass('end-temp active item');
                    } else {
                        $(sliderItem).not('.start-temp').eq(imgNum % len).addClass('active');
                    }
                } else {
                    /* if imgNum > len */
                    $(sliderItem).eq(imgNum % len).clone().appendTo(inner);
                    $(sliderItem).eq($(sliderItem).length - 1).addClass('end-temp active');
                }

            }
            /* If the window size is less than windowTransitionSize, activate 1 item */
        } else {
            $(sliderItem).eq(num).addClass('active');
        }
        /* Add the focused class to the current item. */
        $(sliderItem).not('.start-temp').eq(num).addClass('focused');

        /* If the activehref key is used, use it to change out the link on the 
         * focused item from making the item focused, to another page. */
        var activeHref = $(sliderItem).eq(num).children('a').attr('activehref');
        if(activeHref != null) {
            $(sliderItem).eq(num).children('a').attr('activehref',$(sliderItem).eq(num).children('a').attr('onclick'));
            $(sliderItem).eq(num).children('a').attr('href',activeHref);
            $(sliderItem).eq(num).children('a').attr('onclick','');
        }
    }
})();
