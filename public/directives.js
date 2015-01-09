'use strict';

angular.module('noDJ').
directive('searchSongAutocomplete', ['$rootScope', 'MusicQueue', 'SearchSong',
	function($rootScope, MusicQueue, SearchSong) {
		return {
			restrict: 'A',
			link: function(scope, elem, attr) {
				$(elem).autocomplete({
	        		minLength: 3,
			        source: function(req, res) {
			        	SearchSong(req.term, function(err, data) {
			        		if (!err) res(data);
			        	});
			        },
			        focus: function(event, ui) {
						$(elem).val(ui.item.title);

						return false;
			        },
	        		select: function(event, ui) {
	        			$(elem).val('');

	        			MusicQueue.addTrack(ui.item);

						return false;
					}
				})
	    		.autocomplete('instance')._renderItem = function(ul, item) {
	    			var data = 
	    			   ['<img class="dropthumbnail" src="' + item.thumbnail_small + '"/>',
	    				'<a>',
	    				'  <span class="dropname">' + item.title + '</span>',
	    				'</a>'].join('\n');
	        		return $('<li>')
	          			.append(data)
	          			.appendTo(ul);
	      		};
	      		// fix width bug
	      		jQuery.ui.autocomplete.prototype._resizeMenu = function () {
				  var ul = this.menu.element;
				  ul.outerWidth(this.element.outerWidth());
				}
	      		// search enter
	      		$(elem).keypress(function(e) {
	        		if(e.keyCode == 13) {
	          			e.preventDefault();
	          			// sendSelected(this.value);
	          			$(this).autocomplete('close');
	        		}
	      		});   
			}
		};
	}
]);
