angular.module('mainModule', [])
    .directive('contentTable', function () {
        return {
            restrict: 'A',
            scope: {
                'selector': '@contentTable'
            },
            template: '<li ng-repeat="content in contents"><a href="#{{content.href}}" ng-bind="content.title"></a></li>',
            link: function (scope, el) {
                scope.contents = [];

                angular.element(scope.selector).each(function () {
                    var content = angular.element(this);

                    scope.contents.push({
                        'href': content.attr('id'),
                        'title': content.find('.panel-heading').text()
                    });
                })
            }
        }
    });