/* eslint-env node */
const pkg = require( './package.json' );
const webpackConfig = require( './webpack.config' )[ 0 ];
const laxarInfrastructure = require( 'laxar-infrastructure' );

module.exports = config => {
   config.set(
      laxarInfrastructure.karma( [ `./spec/${pkg.name}.spec.js` ], {
         context: __dirname,
         externals: webpackConfig.externals,
         rules: webpackConfig.module.rules
      } )
   );
};
