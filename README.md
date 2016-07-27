# bootstrap-slider
Multi-item bootstrap slider based on the bootstrap carousel written using jQuery. Take the bootstrap carousel example code from the [bootstrap website](http://getbootstrap.com/javascript/#carousel) and add the 
slider CSS class and include slider.css and slider.js. The slider.js module will find all sliders on the page and initialize them for you. When including the script, you can use the following options in the script tag to override the defaults by prepending '_data-_':

* __activeItems__: A number specifying how many items should be displayed. The default is three.
* __indicatorLinks__: True or false. This defines whether to make the indicators links that change the slider to the item associated with that indicator.
* __itemInFocus__: A number specifying which item of the active items should be in focus. The default is the first item.
* __manualInit*__: True or false. Have all slider on the page automatically initialized or tell the module it will be done manually. This is usually used to specify different settings for different sliders. The default is false.

When the manualInit option is used, each slider on the page must be manually initialized. This is done in a second tag by calling _slider.init(sliderID,options)_. The _sliderID_ is the id of the div that has the slider class. The options  value is an object with names set to any of the options in the list above except those with an asterisk. 

For example:
```html
<div id="myslider1" class="slider ...">
...
</div>
<div id="myslider2" class="slider ...">
...
</div>
<script type="text/javascript" src="slider.js" data-manualInit="true"></script>
<script type="text/javascript">
    slider.init('myslider1',{'activeItems': 2});
    slider.init('myslider2');
</script>
```

Within the slider, each item can also be a link to another page. To specify where each item should link to when clicked, add a _data-href_ tag to the item. For example:
```html
<div class="item" data-href="http://example.com">
...
</div>
```

There are two example html files included in the repo to see the slider in action. 
