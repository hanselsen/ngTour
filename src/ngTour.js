(function (app) {

	var injects = ['$rootScope', '$timeout', '$compile','$document'];
	injects.push(function ($rootScope, $timeout, $compile, $document) {

		var baseWidth = 7800;
		var baseHeight = 7800;
		var baseLeft = 3900;
		var baseTop = 3900;

		var canvas = $('<div class="tourCanvas"><div class="layover" /></div>');

		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elm, attrs) {
				scope.padding = 10;
				var recalculate = function (i) {
					if($(elements[i]).offset() == undefined) return;
					$('.tourCanvas .layover')
						.css('left', ((baseLeft - $(elements[i]).offset().left)*-1) -scope.padding/2)
						.css('top', ((baseTop - $(elements[i]).offset().top)*-1) -scope.padding/2)
						.css('width', (baseWidth + elements[i].offsetWidth) + scope.padding)
						.css('height', (baseHeight + elements[i].offsetHeight) + scope.padding);
					$('.tourCanvas .layover .area, [uib-popover-template-popup]').remove();
					$('<div class="area" />')
						.attr('uib-popover-template', "'tour"+(i+1)+".html'")
						.attr('popover-popup-delay', '500')
						.attr('popover-placement', 'bottom')
						.attr('popover-is-open', true)
						.appendTo('.tourCanvas .layover');
					$compile(angular.element('.tourCanvas').contents())(scope);

					$document.scrollToElementAnimated(elements[i], 100);
					$timeout(function () {
						$compile(angular.element('.popover-content').contents())(scope);
					}, 550);
				};
				$( window ).resize(function() { recalculate(scope.tourStep); });
				scope.$watch('tourStep', function (val) {
					if(val == undefined) return;
					recalculate(scope.tourStep);
				});
				var elements = $(elm).find('[tour-step]').sort(function (a, b) {
					var stepA = parseInt($(a).attr('step'));
					var stepB = parseInt($(b).attr('step'));
					return stepB - stepA;
				});
				scope.startTour = function () {
					$(elm).prepend(canvas.clone());
					$compile(angular.element('.tourCanvas').contents())(scope);
					scope.tourStep = 0;
				};
				scope.stopTour = function () {
					$('[uib-popover-template-popup]').remove();
					$('.tourCanvas .layover').attr('style', '');
					$('.tourCanvas').remove();
					delete scope.tourStep;
				};
			}
		};
	});

	app.directive('ngTour', injects);

})(angular.module('ngTour',['duScroll']));