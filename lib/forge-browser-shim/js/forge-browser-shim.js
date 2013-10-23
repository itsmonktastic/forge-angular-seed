(function (window) {'use strict';

// stubs for testing forge app in the browser
if (typeof window.forge === "undefined") {
	window.forge = {
		logging: {
			log: function () {
				console.log.apply(console, arguments);
			}
		},

		file: {
			getImage: function (options, success, error) {
				if (!error) {
					error = success;
					success = options;
				}

				if (success) {
					setTimeout(function () {
						success({uri: 'fakeimage.jpg'});
					}, 0);
				}
			},

			URL: function (file, success) {
				if (success) {
					setTimeout(function () {
						success(file.uri);
					}, 0);
				}
			}
		},

		contact: {
			select: function (success, error) {
				if (success) {				
					setTimeout(function () {
						success({displayName: 'James Brady'});
					}, 0);
				}
			}
		},

		tabbar: {
			show: function () {},
			hide: function () {},
			removeButtons: function () {
				tabbarDiv.innerHTML = "";
			},
			addButton: function (options, success, error) {
				if (success) {
					setTimeout(function () {
						var buttonDiv = document.createElement('div');
						buttonDivs.push(buttonDiv);
						buttonDiv.className = "forge-browser-shim-tabbar-button";
						buttonDiv.innerHTML = '' + options.text;

						tabbarDiv.appendChild(buttonDiv);
						success({
							remove: function () {},
							onPressed: {
								addListener: function (listener) {
									console.log("Add tabbar button listener for ", options);
									buttonDiv.addEventListener('mousedown', listener);
								}
							},
							setActive: function () {
								console.log("Set button active: ", JSON.stringify(options));
								buttonDivs.forEach(function (b) {
									b.className = "forge-browser-shim-tabbar-button";
								});
								buttonDiv.className = "forge-browser-shim-tabbar-button active";
							}
						});
					}, 0);
				}
			}
		}
	};

	var buttonDivs = [];
	var tabbarDiv = document.createElement('div');
	tabbarDiv.className = "forge-browser-shim-tabbar";
	window.addEventListener('load', function () {
		console.log("Adding fake tab bar");
		document.body.appendChild(tabbarDiv);
	});
}

})(window);