/**
 * Copyright 2015 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import { DISTANCE_TO_WINDOW, applyPositionClass } from './layer_utils';

function calculateOffsetForTop( layer, $layer, domData ) {
   applyPositionClass( $layer, 'top' );

   const innerHeight = domData.contentWrapperSize.height;
   const outerHeight = domData.contentWrapperSize.height + domData.layerSize.framingHeight;
   const appliedOuterHeight = domData.layerSize.isBorderBox ? innerHeight : outerHeight;

   return {
      offsets: {
         top: DISTANCE_TO_WINDOW,
         left: ( domData.windowSize.width * 0.5 ) - ( domData.layerSize.outerWidth * 0.5 ),
         height: appliedOuterHeight
      },
      styles: {},
      arrowOffsets: null
   };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function create( layer, $layer ) {
   return {
      calculate: domData => calculateOffsetForTop( layer, $layer, domData )
   };
}
