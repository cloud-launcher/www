module.exports = () => {
  return {
    restrict: 'A',
    link: ($scope, element, attributes) => {
      let center = angular.element('<div class="center"></div>');
      element.replaceWith(center);

      center.append(element);
    }
  };
};