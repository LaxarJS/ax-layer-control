/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { DISTANCE_TO_WINDOW, applyPositionClass, calculateDomData } from './layer_utils';

function calculateOffsetForMiddle( layer, $layer, domData ) {
   applyPositionClass( $layer, 'center' );

   const innerHeight = domData.contentWrapperSize.height;
   const outerHeight = domData.contentWrapperSize.height + domData.layerSize.framingHeight;
   const availableHeight = domData.windowSize.height - ( 2 * DISTANCE_TO_WINDOW );

   let overflowY = 'hidden';
   let height;
   // Finish all ongoing animations to prevent from wrong height calculations
   if( outerHeight <= availableHeight ) {
      height = domData.layerSize.isBorderBox ? outerHeight : innerHeight;
   }
   else if( outerHeight > availableHeight ) {
      height = availableHeight;
      if( !domData.layerSize.isBorderBox ) {
         height -= domData.layerSize.framingHeight;
      }
      overflowY = 'scroll';
   }

   const { layerSize, windowSize } = calculateDomData( layer, $layer );
   const appliedOuterHeight = height + ( layerSize.isBorderBox ? 0 : layerSize.framingHeight );

   return {
      offsets: {
         top: ( windowSize.height * 0.5 ) - ( appliedOuterHeight * 0.5 ),
         left: ( windowSize.width * 0.5 ) - ( layerSize.outerWidth * 0.5 ),
         height
      },
      styles: {
         overflowY
      },
      arrowOffsets: null
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function create( layer, $layer ) {
   return {
      calculate: domData => calculateOffsetForMiddle( layer, $layer, domData )
   };
}
