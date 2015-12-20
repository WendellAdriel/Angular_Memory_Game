(function() {
  'use strict';

  angular
    .module('memoryGameAngular')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
  }

})();
