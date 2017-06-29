/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import * as $ from 'jquery';

export const DISTANCE_TO_WINDOW = 20;
const POSITION_CLASSES = [ 'center', 'top', 'right', 'bottom', 'left' ];

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function calculateDomData( layer, $layer ) {
   applyPositionClass( $layer, null );

   const $window = $( window );
   const $anchor = $( layer.configuration_.anchorElementSelector );
   const $contentWrapper = $layer.children( '[ng-transclude]' );

   const data = {
      contentWrapperSize: {
         height: $contentWrapper.outerHeight(),
         width: $contentWrapper.outerWidth()
      },
      anchorOffset: $anchor.offset(),
      anchorSize: {
         height: $anchor.outerHeight(),
         width: $anchor.outerWidth()
      },
      windowSize: {
         height: $window.height(),
         width: $window.width()
      },
      windowScrolling: {
         top: $window.scrollTop(),
         left: $window.scrollLeft()
      }
   };
   data.layerSize = calculateLayerSize( layer, $layer, data );
   return data;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateLayerSize( layer, $layer, data ) {
   const outerWidth = $layer.outerWidth();
   const outerHeight = $layer.outerHeight();
   const contentWidth = $layer.width();
   const contentHeight = $layer.height();

   const res = {
      isBorderBox: $layer.css( 'box-sizing' ) === 'border-box',

      // size of border and padding of top and bottom or left and right respectively
      framingWidth: outerWidth - contentWidth,
      framingHeight: outerHeight - contentHeight,

      // actually the outer size (content + padding + border)
      outerWidth,
      outerHeight
   };

   // the outer size + the size of an optional arrow
   res.widthWithArrow =
      data.contentWrapperSize.width + res.framingWidth + layer.configuration_.arrowWidth;
   res.heightWithArrow =
      data.contentWrapperSize.height + res.framingHeight + layer.configuration_.arrowHeight;
   return res;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function applyPositionClass( $layer, cssClass ) {
   POSITION_CLASSES.forEach( positionClass => {
      $layer.toggleClass( positionClass, positionClass === cssClass );
   } );
}
