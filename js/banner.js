/* banner script utilising modern JS (without external libraries) and CSS3 transitions. Should work on ALL modern browsers
 * 
 * v1.2 - clone elements regardless of what they are to allow for li, hrefs, img etc... 
 * v1.3 - replaced element.dataset with element.getAttribute/setAttribute for IE compatibility 
 *    
 */


var Banner = function (el,anim,style) {

    this.target = el || '#banner';
    this.anim = anim || 3000;
    this.style = style || 'active';
    
  

    this.banner = document.querySelector(this.target); /* check the banner actually exists before we do anything */

    var me = this;
    this.load = function () {
        
        if (this.banner) {
            
            this.childCount = this.CountChildren();
            this.delay = this.banner.getAttribute('data-delay');
                  
            if (this.childCount === 1) {
                this.cloneChildren();
                this.childCount = this.CountChildren();
            }
            this.addButtons();
            this.stackChildren();
            setTimeout(this.run, this.delay);
        }
    };

    
    /* insert the little round "button" icons over the banner to show the number of and currently displayed element
     * 
     * TO DO: Make these clickable for navigation 
     *   */
    this.addButtons = function () {

        _btnCount = this.childCount;
        _btnUl = document.querySelector('#bannercontrol');
        for (var c = 0; c < _btnCount; c++) {
               _btn = document.createElement('li');
               _btn.setAttribute('data-id',c);
               _btnUl.appendChild(_btn);
        }
        
    };
    
    /**
     * Count the number of child elements
     * 
     * @returns {Element.children.length} int
     */
    this.CountChildren = function () {
        return document.querySelector(this.target).children.length;
    };
    
    
    /* if there's only one element present then we have to clone it to ensure that the animation runs, even if it's just rotating the same thing */
    
    this.cloneChildren = function () {
        _source = this.banner.firstElementChild;
        _node = _source.nodeName.toLowerCase();
        _cloneTo = 2;/* this is the number of elements we want to appear so that a loop can be achieved. This is the total number, including the orignal. */
        for (_s = 1; _s < _cloneTo; _s++) {
            _i = _source.cloneNode(true);
      this.banner.appendChild(_i);
        }

    };
    
    
    /* restack the child elements - this moves the completed element to the back of the list and brings the next one to the top
     * Utilises the zIndex property for proper yet simple stacking
     *   
     */
    
    this.stackChildren = function () {
        for (i = 0; i < this.childCount; i++) {
            this.banner.children[i].style.zIndex = this.childCount - i;
            if (!this.banner.children[i].getAttribute('data-id')) {
                this.banner.children[i].setAttribute('data-id',i);
                
            }
        }
        _thisId =  this.banner.firstElementChild.getAttribute('data-id');
        me.doButton(_thisId);

    };
    
    /* run the animations */
    this.run = function () {
         _current = this.banner.firstElementChild;
         /* TO DO: put a browser check in here for IE9 - in which case we'll animate it using javascript */
             if (/MSIE 9/i.test(navigator.userAgent)) {
             _current = this.banner.children[0];
             _next = this.banner.children[1];
             var _frame = me.anim/100;
             var left = 0;
             var anim = setInterval(function() {
                 left--;
                 _current.style.left = left+'%';
                 _next.style.left = left+'%';
                 if (left === -100) {clearInterval(anim);setTimeout(me.reorderElems, me.anim);}
                 
             },_frame);
                        
             } else {

        /* otherwise call the CSS3 stuff */
        _thisId = _current.getAttribute('data-id');
        /* set the state of the button */
        _current.classList.add(me.style);
               
       setTimeout(me.reorderElems, me.anim);
    }

    };
    
    /* highlight the button responding to the currently displayed element */
    
    this.doButton = function(_id) {
       
        _id = _id || 0;
         _btnUl = document.querySelector('#bannercontrol');
         
         for (u = 0;u<_btnUl.children.length;u++) {
            if (_btnUl.children[u].getAttribute('data-id') === _id) {
                _btnUl.children[u].classList.add('active');
             } else {
                _btnUl.children[u].classList.remove('active');
            }
        }
    };
    
    /* clone the top level element after it has completed the animation then insert it at the bottom of the stack before removing the original from the DOM 
     * 
     * Calling stackChildren after adjusting the DOM arranges the elements by zIndex
     * 
     * */
    
    this.reorderElems = function () {
       console.log("LOADED");
        _liveEl = this.banner.firstElementChild;
        _i = _liveEl.cloneNode(true);
        _i.classList.remove(me.style);
        this.banner.appendChild(_i);
        this.banner.removeChild(_liveEl);
        me.CountChildren();
        me.stackChildren();
        setTimeout(me.run, me.delay);
    };
};



window.addEventListener('load', function () {
    b = new Banner('#banner',2000,'active');
    b.load();
});