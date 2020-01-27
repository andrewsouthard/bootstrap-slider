# bootstrap-slider

Multi-item bootstrap slider based on the bootstrap carousel written using jQuery. Take the bootstrap carousel example code from the [bootstrap website](http://getbootstrap.com/javascript/#carousel) and add the
slider CSS class and include slider.css and slider.js. The slider.js module will find all sliders on the page and initialize them for you. When including the script, you can use the following options in the script tag to override the defaults by prepending '_data-_':

- **activeItems**: A number specifying how many items should be displayed. The default is three.
- **indicatorLinks**: True or false. This defines whether to make the indicators links that change the slider to the item associated with that indicator.
- **interval**: . The number of milliseconds to wait before automaticall advancing to the next item. Default is 3000ms or 3 seconds. _Note:_ This only applies to sliders that have the CSS class of "slide". All others will only advance when manually triggered.
- **itemInFocus**: A number specifying which item of the active items should be in focus. The default is the first item.
- **manualInit\***: True or false. Have all slider on the page automatically initialized or tell the module it will be done manually. This is usually used to specify different settings for different sliders. The default is false.

When the manualInit option is used, each slider on the page must be manually initialized. This is done in a second tag by calling _slider.init(sliderID,options)_. The _sliderID_ is the id of the div that has the slider class. The options value is an object with names set to any of the options in the list above except those with an asterisk.

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
  slider.init("myslider1", { activeItems: 2 });
  slider.init("myslider2");
</script>
```

Within the slider, each item can also be a link to another page. To specify where each item should link to when clicked, add a _data-href_ tag to the item. For example:

```html
<div class="item" data-href="http://example.com">
  ...
</div>
```

Additionally, adding _target="\_blank"_ will open the link in a new window.

## Working Examples

There are two example HTML files included in the repo that show the slider in action. To use them, clone the repo and then open one of the files in your browser.

## Module Classes

When the slider.js library is included, the _slider_ object is defined with two functions, _init_ and _focusedItemIndex_. The _init_ function is only used when _manualInit_ is set to true. The _focusedItemIndex_ function will return the index of the item currently in focus, with the first item being number 0. This is useful when combined with the _changeSlider_ event.

## changeSlider Event

When the slider item in focus changes, the module triggers a _changeSlider_ event. A jQuery event listener can be setup to run when this event is triggered, allowing other specific actions to occur. Combined with the _focusedItemIndex_ function, an alert can be triggered to inform the user of the item that is now active:

```
$('#myslider).on('changeSlider',function() {
    var idx = slider.focusedItemIndex();
    alert("Slider item "+idx+" is now in focus!");
});
```

## Setting then in focus on page load

By default, the item in focus will be the first item in the order listed on the page. However, if another item should be in focus by when the page loads, that item may be specified by adding the _sliderFocus_ CSS class to that item. So in the list of items below, for example, the third item will be in focus instead of the first item:

```html
<div class="item">
  ...
</div>
<div class="item">
  ...
</div>
<div class="item sliderFocus">
  ...
</div>
```
