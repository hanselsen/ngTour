(function (app) {

	var injects = ['$rootScope', '$timeout', '$compile','$document'];
	injects.push(function ($rootScope, $timeout, $compile, $document) {

		var baseWidth = 7800;
		var baseHeight = 7800;
		var baseLeft = 3900;
		var baseTop = 3900;

		var canvas = $('<div class="tourCanvas"><div class="layover" /></div>');

		var elements = [];

		return {
			restrict: 'A',
			scope: true,
			link: function (scope, elm, attrs) {
				scope.padding = 10;
				var recalculate = function (i) {
					var currentElement = $('[ng-tour] [tour-step='+scope.tourStep+']:visible');
					if(currentElement.offset() == undefined) return;
					$('[uib-popover-template-popup]').fadeOut(200);
					$document.scrollToElementAnimated(currentElement[0], 100, 200);
					$timeout(function () {
						var t = $(window).scrollTop();
						$('.tourCanvas .layover')
							.css('left', ((baseLeft - currentElement.offset().left)*-1) -scope.padding/2)
							.css('top', ((baseTop - currentElement.offset().top+t)*-1) -scope.padding/2)
							.css('width', (baseWidth + currentElement[0].offsetWidth) + scope.padding)
							.css('height', (baseHeight + currentElement[0].offsetHeight) + scope.padding);
						$('.tourCanvas .layover .area, [uib-popover-template-popup]').remove();
						var placement = 'bottom';
						if(currentElement.attr('tour-placement') != undefined) {
							placement = currentElement.attr('tour-placement');
						}
						$('<div class="area" />')
							.attr('uib-popover-template', "'tour"+i+".html'")
							.attr('popover-popup-delay', '500')
							.attr('popover-placement', placement)
							.attr('popover-trigger', 'manual')
							.attr('popover-is-open', true)
							.appendTo('.tourCanvas .layover');
						$compile(angular.element('.tourCanvas').contents())(scope);

						$timeout(function () {
							$compile(angular.element('.popover-content').contents())(scope);
						}, 550);
					}, 200);
				};
				$( window ).resize(function() { recalculate(scope.tourStep); });
				scope.$watch('tourStep', function (val) {
					if(val == undefined) return;
					$timeout(function () {
						recalculate(scope.tourStep);
					},50);
				});
				elements = $(elm).find('[tour-step]').sort(function (a, b) {
					var stepA = parseInt($(a).attr('step'));
					var stepB = parseInt($(b).attr('step'));
					return stepB - stepA;
				});

				scope.startTour = function () {
					$(elm).prepend(canvas.clone());
					$compile(angular.element('.tourCanvas').contents())(scope);
					scope.tourStep = 1;
					$rootScope.$broadcast('tourStarted');
				};
				scope.stopTour = function () {
					$('[uib-popover-template-popup]').remove();
					$('.tourCanvas .layover').attr('style', '');
					$('.tourCanvas').remove();
					delete scope.tourStep;
					$rootScope.$broadcast('tourStopped');
				};
			}
		};
	});

	app.directive('ngTour', injects);

})(angular.module('ngTour',['duScroll']));
