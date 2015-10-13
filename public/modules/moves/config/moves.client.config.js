'use strict';

// Configuring the Articles module
angular.module('moves').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Moves', 'moves', 'dropdown', '/moves(/create)?');
		Menus.addSubMenuItem('topbar', 'moves', 'List Moves', 'moves');
	}
]);
