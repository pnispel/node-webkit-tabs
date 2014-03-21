var gui = require('nw.gui');

var Tab = function ( el, index, width, parent ) {
  this.width = width;
  this.half = width / 2;
  this.index = index;
  this.pos = (index * (width - 10));
  this.el = el;
  this.tabs = parent.tabs;

  this.next = function () {
    return this.tabs[ this.index + 1 ];
  };

  this.previous = function () {
    return this.tabs[ this.index - 1 ];
  };

  this.swap = function ( other ) {
    var buffer = this.tabs[ other.index ];
    this.tabs[ other.index ] = this.tabs[ this.index ];
    this.tabs[ this.index ] = buffer;

    buffer = other.index;
    other.index = this.index;
    this.index = buffer;

    buffer = other.pos;
    other.pos = this.pos;
    this.pos = buffer;

    other.el.style.left = other.pos + 'px';
  };

  this.setPosition = function () {
    this.el.style.position = 'absolute';
    this.el.style.left = this.pos + 'px';
  };

  this.moveIntoNewWindow = function ( e ) {
    var win = gui.Window.get();

    var x = e.clientX;
    var y = e.clientY;

    var new_window = gui.Window.open('index.html', {
      x: win.x,
      y: win.y + y - 15,
      width: win.width,
      height: win.height,
      title: "node-webkit demo",
      toolbar: false,
      frame: false
    });

    console.log( new_window );

    new_window.show();

    // $(document).mousedown(function (e) {
    //   console.log( e.clientX, e.clientY );
    // });

    document.body.onmousemove = document.body.onmouseup = null;

    new_window.on('loaded', function () {
      $(new_window.window.document).css('opacity', '.4');
    });

    $(document).mouseup(function (e) {
      new_window.focus();
      $(document).off('mousemove');
      $(new_window.window.document).css('opacity', '1');
    });

    $(document).mousemove(function (evt) {
      new_window.moveTo( win.x + evt.clientX - x, win.y + evt.clientY - 15 );
    });

    // document.body.onmousemove = document.body.onmouseup = null;
  };

  var onmousemove = function ( e ) {
    var x, y;
    x = e.pageX

    this.el.style.left = x - this.half + 'px';

    if ( Math.abs( this.el.offsetTop - e.pageY ) > 50 ) {
      this.moveIntoNewWindow( e );

      // document.body.onmousemove = document.body.onmouseup = null;
      return;
    }

    if ( this.next() && 
         Math.abs( x - this.pos - this.half ) > Math.abs( x - this.next().pos - this.next().half ) ) {
      this.swap( this.next() );
    }

    if ( this.previous() && 
         Math.abs( x - this.pos - this.half ) > Math.abs( x - this.previous().pos - this.previous().half ) ) {
      this.swap( this.previous() );
    }
  };

  var onmousedown = function ( e ) {
    $('.tab').removeClass('selected');

    $(this.el).addClass('selected');

    document.body.onmousemove = onmousemove.bind( this );
    document.body.onmouseup = onmouseup.bind( this );
  };

  var onmouseup = function ( e ) {
    this.el.style.left = this.pos + 'px';
    document.body.onmousemove = document.body.onmouseup = null;
  };

  el.onmousedown = onmousedown.bind( this );
  this.setPosition();
};

var Tabs = function ( el ) {
  this.max_tabs = 6;
  this.tab_width = 180;
  this.width = el.offsetWidth;
  this.children = el.children;
  this.tabs = [];
  this.el = el;

  this.calculateTabWidth = function () {
    var width = this.width / this.tabs.length;

    return (width < 180) ? width : 180;
  };

  this.buildCurrentTabs = function () {
    var width = this.calculateTabWidth();

    for ( var i = 0; l = this.children.length, i < l; i++ ) {
      this.tabs.push( new Tab( this.children[i], i, width, this ) );
    }
  };

  this.buildCurrentTabs();
};
