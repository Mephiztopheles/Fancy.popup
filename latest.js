(function ( window, $ ) {

    Fancy.require( {
        jQuery: false,
        Fancy : "1.0.1"
    } );
    var NAME      = 'FancyPopup',
        VERSION   = "1.0.1",
        id        = 0,
        logged    = false;

    function display() {
        this.html.wrapper.append( this.html.inner.append( this.html.close ).append( this.html.title ).append( this.html.text ).append( this.html.buttons ) );
        $( 'body' ).append( this.html.wrapper );
        $( document ).on( 'keydown.FancyPopup', function ( e ) {
            var keyCode = e.keyCode || e.which;
            if ( keyCode == 27 ) {
                close();
            }
        } );

        this.html.close.click( function () {
            close();
        } );
    }

    function close() {
        this.html.inner.addClass( 'hide' ).removeClass( 'show' );
        this.html.wrapper.fadeOut( 300 );
    }

    function resize( animate ) {
        var top   = ( $( window ).height() - this.html.inner.height() ) / 2,
            left  = ( $( window ).width() - this.html.inner.outerWidth() - 2 ) / 2,
            style = animate ? 'animate' : 'css';

        this.html.inner[ style ]( {
            left: left,
            top : top
        } );
    }

    function FancyPopup( settings ) {
        var SELF      = this;
        SELF.id       = id;
        id++;
        SELF.name     = NAME;
        SELF.version  = VERSION;
        SELF.settings = $.extend( {}, Fancy.settings[ NAME ], settings );

        SELF.html = {
            wrapper: $( '<div/>', {
                id: NAME
            } ),
            inner  : $( '<div/>', {
                id: NAME + '-inner'
            } ),
            close  : $( '<div/>', {
                id  : NAME + '-close',
                html: 'x'
            } ),
            title  : $( '<div/>', {
                id: NAME + '-title'
            } ),
            text   : $( '<div/>', {
                id: NAME + '-content'
            } ),
            buttons: $( '<div/>', {
                id: NAME + '-buttons'
            } )
        };

        SELF.close = close;

        SELF.resize = resize;

        if ( !logged ) {
            logged = true;
            Fancy.version( SELF );
            display();
        }

        SELF.update();
        SELF.show();
        return SELF;
    }


    FancyPopup.api = FancyPopup.prototype = {};
    FancyPopup.api.version = VERSION;
    FancyPopup.api.name    = NAME;
    FancyPopup.api.update  = function ( settings ) {
        var SELF = this;
        if ( settings )
            SELF.settings = $.extend( {}, FancyPopup.settings, settings );
        SELF.html.text.html( SELF.settings.text || '' );
        SELF.html.title.html( SELF.settings.title || '' );
        SELF.html.buttons.html( '' );
        function applyClick( button, b, i ) {
            button.on( 'click', function () {
                if ( b.click )
                    b.click.call( SELF, button );
                else
                    close();
            } ).attr( 'unselectable', 'on' ).css( 'user-select', 'none' ).on( 'selectstart', false );
            if ( i == 'ok' ) {
                $( document ).on( 'keydown.FancyPopup', function ( e ) {
                    var keyCode = e.keyCode || e.which;
                    if ( keyCode == 13 ) {
                        if ( b.click )
                            b.click.call( SELF, button );
                        else
                            close();
                    }
                } );
            }
        }

        for ( var i in SELF.settings.buttons ) {
            if ( SELF.settings.buttons.hasOwnProperty( i ) ) {
                var b      = SELF.settings.buttons [ i ],
                    button = $( '<div/>', {
                        id   : SELF.name + '-button-' + i,
                        class: SELF.name + '-button button',
                        html : b.title
                    } );

                applyClick( button, b, i );
                SELF.html.buttons.append( button );
            }
        }
        SELF.html.wrapper.removeAttr( 'class' ).addClass( NAME + '-theme-' + this.settings.theme );

        if ( !this.settings.closeable )
            SELF.html.close.hide();
        else
            SELF.html.close.show();
        SELF.resize();
    };
    FancyPopup.api.show    = function () {
        var SELF = this;
        SELF.html.wrapper.hide().fadeIn( 200 );
        SELF.html.inner.hide();

        setTimeout( function () {
            SELF.html.inner.show().addClass( 'show' ).removeClass( 'hide' );
        }, 200 );

        SELF.html.inner.css( SELF.settings );
        resize();

    };

    FancyPopup.api.close = close;

    FancyPopup.api.resize = resize;

    Fancy.settings[ NAME ] = {
        theme    : 'blunt',
        title    : false,
        text     : false,
        width    : 250,
        closeable: true
    };


    Fancy.popup = function ( settings ) {
        return new FancyPopup( settings );
    };

})( window, jQuery );