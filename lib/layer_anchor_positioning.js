/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import * as $ from 'jquery';
import { DISTANCE_TO_WINDOW, applyPositionClass } from './layer_utils';

function LayerAnchorPositioning( layer, $layer ) {
   this.layer = layer;
   this.$layer = $layer;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

LayerAnchorPositioning.prototype = {

   calculate( domData ) {
      const space = calculateAvailableSpace( domData );

      const allowedPos = this.layer.configuration_.allowedPositions;
      const isAllowed = function( pos ) { return allowedPos.indexOf( pos ) !== -1; };
      const canUse = {
         top: isAllowed( 'top' ) && space.above >= domData.layerSize.heightWithArrow,
         bottom: isAllowed( 'bottom' ) && space.below >= domData.layerSize.heightWithArrow,
         left: isAllowed( 'left' ) && space.left >= domData.layerSize.widthWithArrow,
         right: isAllowed( 'right' ) && space.right >= domData.layerSize.widthWithArrow
      };

      if( canUse.top ) {
         if( canUse.bottom && space.below > space.above ) {
            return offsetBottom( this, domData );
         }

         return offsetTop( this, domData );
      }
      if( canUse.bottom ) {
         return offsetBottom( this, domData );
      }

      if( canUse.right ) {
         if( canUse.left && space.left > space.right ) {
            return offsetLeft( this, domData );
         }

         return offsetRight( this, domData );
      }
      if( canUse.left ) {
         return offsetLeft( this, domData );
      }

      // no perfect match is found. Thus we take a position where at least the horizontal space should be
      // sufficient.
      return space.below > space.above ? offsetBottom( this, domData ) : offsetTop( this, domData );
   }

};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateAvailableSpace( data ) {
   const space = {
      above: data.anchorOffset.top - data.windowScrolling.top - DISTANCE_TO_WINDOW,
      left: data.anchorOffset.left - data.windowScrolling.left - DISTANCE_TO_WINDOW
   };
   space.below = data.windowSize.height - ( space.above + data.anchorSize.height );
   space.right = data.windowSize.width - ( space.left + data.anchorSize.width );
   return space;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function offsetLeft( self, domData ) {
   applyPositionClass( self.$layer, 'left' );

   const result = calculateVerticalPosition( self, domData );
   const offsets = $.extend( result.offsets, {
      left: domData.anchorOffset.left - domData.layerSize.outerWidth
   } );
   return {
      offsets,
      styles: result.styles,
      arrowOffsets: $.extend( result.arrowOffsets, {
         left: offsets.left + domData.layerSize.outerWidth + margin( self, 'left' ) - border( self, 'right' )
      } )
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function offsetRight( self, domData ) {
   applyPositionClass( self.$layer, 'right' );

   const result = calculateVerticalPosition( self, domData );
   const offsets = $.extend( result.offsets, {
      left: domData.anchorOffset.left + domData.anchorSize.width
   } );
   return {
      offsets,
      styles: result.styles,
      arrowOffsets: $.extend( result.arrowOffsets, {
         left: offsets.left + borderAndMargin( self, 'left' )
      } )
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function offsetBottom( self, domData ) {
   applyPositionClass( self.$layer, 'bottom' );

   const offsets = {
      top: domData.anchorOffset.top + domData.anchorSize.height
   };
   const result = calculateHorizontalPosition( self, domData, offsets );
   return {
      offsets: result.offsets,
      styles: result.styles,
      arrowOffsets: $.extend( result.arrowOffsets, {
         top: result.offsets.top + borderAndMargin( self, 'top' )
      } )
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function offsetTop( self, domData ) {
   applyPositionClass( self.$layer, 'top' );

   const offsets = {
      top: domData.anchorOffset.top - domData.layerSize.outerHeight
   };
   const result = calculateHorizontalPosition( self, domData, offsets );
   result.offsets.top = domData.anchorOffset.top - result.offsets.height;
   return {
      offsets: result.offsets,
      styles: result.styles,
      arrowOffsets: $.extend( result.arrowOffsets, {
         top: domData.anchorOffset.top + margin( self, 'top' ) - border( self, 'bottom' )
      } )
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateHorizontalPosition( self, domData, offsets ) {
   // In contrast tu calculateVerticalPosition we already need the top position in order to determine if
   // the height of the layer needs adjustment.
   const anchorCenter = domData.anchorOffset.left + ( domData.anchorSize.width * 0.5 );
   let left = anchorCenter - ( domData.layerSize.outerWidth * 0.5 );
   const minimumLeft = domData.windowScrolling.left + DISTANCE_TO_WINDOW;

   if( left < minimumLeft ) {
      left = minimumLeft;
   }
   else {
      const right = left + domData.layerSize.outerWidth;
      const rightBorder = domData.windowScrolling.left + domData.windowSize.width - DISTANCE_TO_WINDOW;
      if( right > rightBorder ) {
         left = Math.max( minimumLeft, rightBorder - domData.layerSize.outerWidth );
      }
   }

   const top = offsets.top;
   let maximumBottom;
   if( top < domData.anchorOffset.top ) {
      maximumBottom = domData.anchorOffset.top;
   }
   else {
      maximumBottom = domData.windowScrolling.top + domData.windowSize.height - DISTANCE_TO_WINDOW;
   }
   let overflowY = 'hidden';
   let height = domData.contentWrapperSize.height;
   if( domData.layerSize.isBorderBox ) {
      height += domData.layerSize.framingHeight;
   }

   if( top + height > maximumBottom ) {
      overflowY = 'auto';
   }

   return {
      offsets: $.extend( offsets, {
         left,
         height
      } ),
      styles: {
         overflowX: 'hidden',
         overflowY
      },
      arrowOffsets: {
         left: anchorCenter
      }
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function calculateVerticalPosition( self, domData ) {
   const anchorCenter = domData.anchorOffset.top + ( domData.anchorSize.height * 0.5 );
   const minimumTop = domData.windowScrolling.top + DISTANCE_TO_WINDOW;
   const outerLayerHeight = domData.contentWrapperSize.height + domData.layerSize.framingHeight;
   let top = anchorCenter - ( outerLayerHeight * 0.5 );
   if( top < minimumTop ) {
      top = minimumTop;
   }

   const bottom = top + outerLayerHeight;
   const maximumBottom = domData.windowScrolling.top + domData.windowSize.height - DISTANCE_TO_WINDOW;

   let height = domData.contentWrapperSize.height;
   if( domData.layerSize.isBorderBox ) {
      height += domData.layerSize.framingHeight;
   }

   let overflowY = 'hidden';
   if( bottom > maximumBottom ) {
      if( maximumBottom - minimumTop >= outerLayerHeight ) {
         top -= bottom - maximumBottom;
      }
      else {
         top = minimumTop;
         height = maximumBottom - top;
         if( !domData.layerSize.isBorderBox ) {
            height -= domData.layerSize.framingHeight;
         }

         overflowY = 'scroll';
      }
   }

   return {
      offsets: {
         top,
         height
      },
      styles: {
         overflowX: 'hidden',
         overflowY
      },
      arrowOffsets: {
         top: anchorCenter
      }
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function border( self, side ) {
   return parseInt( self.$layer.css( `border-${side}-width` ), 10 );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function margin( self, side ) {
   return parseInt( self.$layer.css( `margin-${side}` ), 10 );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

function borderAndMargin( self, side ) {
   return margin( self, side ) + border( self, side );
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function create( layer, $layer ) {
   return new LayerAnchorPositioning( layer, $layer );
}
