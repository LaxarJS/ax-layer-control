
/**
 * Copyright 2015-2017 aixigo AG
 * Released under the MIT license.
 * http://laxarjs.org/license
 */
import * as ng from 'angular';
import 'angular-mocks';
import { name } from '../laxar-layer-control';

describe( 'The laxar-layer-control', () => {

   beforeEach( ng.mock.module( name ) );

   let scope;
   beforeEach( ng.mock.inject( ( $compile, $rootScope ) => {
      scope = $rootScope.$new();
      const htmlTemplate = `
         <div ax-layer>
            <div>Layer content</div>
         </div>
      `;
      $compile( htmlTemplate )( scope );
   } ) );

   ///////////////////////////////////////////////////////////////////////////////////////////////////////////

   it( 'survives a smoke test', () => {
      expect( true ).toBe( true );
   } );

} );
