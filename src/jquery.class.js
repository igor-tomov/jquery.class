/**
 * jQuery.Class - simulate simple class inheritance in JavaScript
 * Inspired by Dean Edwards, John Resig
 *
 * @author Igor Tomov
 *
 * Syntax:
 * $.Class( props [,staticProps] )
 */
;(function( $ ){

    if ( ! $ ) {
        throw new Error( "jQuery is not found" );
    }

    // utility functions
    var util = {
        fnTest: /\b_super\b/,

        /**
         * Prototype inheritance
         * @param {Object} object
         */
        inherit: Object.create || function( object ){
            var f = function(){};
            f.prototype = object;
            return new f();
        },

        wrapSuperMethod: function( fn, superFn ){
            return function() {
                var tmp = this._super,
                    ret;

                this._super = superFn;
                ret = fn.apply( this, arguments );
                this._super = tmp;

                return ret;
            };
        },

        /**
         * Copy all properties from <src> to <dest>
         *
         * @param {Object} dest
         * @param {Object} src
         * @param {Object} [prototype]
         */
        copyProps: function( dest, src, prototype ){
            prototype = prototype || {};

            var name, prop;

            for ( name in src ){
                if ( src.hasOwnProperty( name ) ){
                    prop = src[name];

                    dest[name] = $.isFunction( prop ) &&
                                 $.isFunction( prototype[name] ) &&
                                 prop.toString().search( this.fnTest ) !== -1 ?

                                 // override method with access to parent method via "this._super"
                                 this.wrapSuperMethod( prop, prototype[name] ) :

                                 // just copy the property
                                 prop;
                }
            }
        }
    };

    // Base class
    function Class(){}

    /**
     * Extend current class by supplied properties
     *
     * @param {Object} props
     * @param {Object} [staticProps]
     *
     * @return {Function} Constructor
     */
    Class.extend = function( props, staticProps ){

        if ( ! $.isPlainObject( props ) ){
            throw new Error( "jQuery.Class.extend: 'props' argument is must be object" );
        }

        // output class
        function Class(){
            if ( typeof this.init === "function" ){
                this.init.apply( this, arguments );
            }
        }

        // inherit the current prototype
        Class.prototype = util.inherit( this.prototype );

        // fix constructor reference
        Class.prototype.constructor = Class;

        //Make this class extendable
        Class.extend = this.extend;

        // extend current prototype by supplied properties
        if ( ! $.isEmptyObject( props ) ){
            util.copyProps( Class.prototype, props, this.prototype );
        }

        // extend current constructor by supplied properties
        $.extend( Class, staticProps );

        return Class;
    };

    // define reference to Base class within jQuery
    $.Class = Class;

})( window.jQuery );