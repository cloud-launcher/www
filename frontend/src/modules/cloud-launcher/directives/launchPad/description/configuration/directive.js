const _ = require('lodash'),
      hjson = require('hjson');

module.exports = () => {
  return {
    restrict: 'E',
    template: require('./template.html'),
    link: ($scope, element, attributes) => {
      const status = element[0].children[0],
            editor = status.children[1];

      editor.addEventListener('keydown', event => {
        if (event.keyCode === 9) {
          event.preventDefault();
          insertTextAtCursor('  ');
        }
      });

      $scope.configurationKeyUp = $event => {
        const {keyCode} = $event;

        // Ignore pgup, pgdown, end, home, left, up, right, down
        if (33 <= keyCode && keyCode <= 40) return;

        debouncedParse();
      };

      const debouncedParse = _.debounce(() => $scope.$apply(parse), 500);

      function insertTextAtCursor(text) {
        if (window.getSelection) {
          const selection = window.getSelection();
          if (selection.getRangeAt && selection.rangeCount) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(text));
          }
        }
        else if (document.selection && document.selection.createRange) {
          document.selection.createRange().text = text;
        }
      }

      function parse() {
        const {textContent} = editor;

        try {
          const configuration = hjson.parse(textContent);
          if (validateConfiguration(configuration)) {
            $scope.configuration = configuration;
            $scope.configurationOK = true;
            $scope.$broadcast('configurationModified', $scope.configuration);
          }
        }
        catch (e) {
          console.log('parse error', e);
          $scope.configurationOK = false;
        }
      }

      // This function is duplicated in the controller
      function validateConfiguration(configuration) {
        return true;
      }
    },
    controller: ['$scope', '$sce', ($scope, $sce) => {
      $scope.configurationOK = true;

      $scope.$on('containerModified', ($event, name, selected) => {
        console.log('containerModified', $event, name, selected);
        const parts = name.split('/'),
              {configuration} = $scope;

        let [repo, container] = parts;

        if (container === undefined) container = repo;

        if (selected) {
          if (parts.length > 1) {
            configuration.configuration[container] = 1;
            configuration.containers[container] = {
              container: name
            };
          }
          else {
            configuration.configuration[name] = 1;
          }
        }
        else {
          if (parts.length > 1) {
            delete configuration.configuration[container];
            delete configuration.containers[container];
          }
          else {
            delete configuration.configuration[name];
          }
        }

        configurationChanged();
      });

      $scope.$on('locationModified', ($event, provider, location, selected) => {
        const {configuration} = $scope;

        configuration.locations = configuration.locations || {};

        if (selected) {
          let locations = configuration.locations[provider] = configuration.locations[provider] || [];

          if (locations.indexOf(location) === -1) locations.push(location);
        }
        else {
          let locations = configuration.locations[provider];
          if (locations) {
            const index = locations.indexOf(location);
            if (index !== -1) {
              locations.splice(index, 1);

              if (locations.length === 0) delete configuration.locations[provider];
            }
          }
        }

        configurationChanged();
      });

      configurationChanged();

      $scope.setConfiguration = configuration => {
        if (validateConfiguration(configuration)) {
          $scope.configuration = configuration;
          $scope.configurationOK = true;
          configurationChanged();
        }
      };

      function configurationChanged() {
        const {configuration} = $scope;

        setText(configuration);

        $scope.$broadcast('configurationModified', configuration);
      }

      function validateConfiguration(configuration) {
        return true;
      }

      function setText(configuration) {
        $scope.configurationHtml = $sce.trustAsHtml(stringify(configuration));
      }

      function stringify(obj) {
        return `${open()}${renderKeys(obj, '', ['locations', 'configuration', 'roles', 'containers', 'authorizations'])}${close()}`;
      }

      function open() { return '<div class="open">{</div>'; }
      function close() { return '<div class="close">}</div>'; }

      function renderKeys(obj, indent, keyOrder) {
        const keys = keyOrder ? _.intersection(keyOrder, _.keys(obj)) : _.keys(obj),
              {length} = keys,
              last = keys[length - 1];

        indent = indent || '';
        indent += '  ';

        return _.map(keys, key => `<div class="key key-${key}">${indent}${key}: ${renderValue(obj[key], indent)}${key === last ? '' : ','}</div>`).join('');
      }

      function renderValue(value, indent) {
        let type = typeof value;

        if (Array.isArray(value)) type = 'array';

        switch(type) {
          case 'string': return `<span class="value">"${value}"</span>`;
          case 'number': return `<span class="number">${value}</span>`;
          case 'object': return `<span>{</span>${renderKeys(value, indent)}<span>${indent}}</span>`;
          case 'array':  return `<span>[</span> ${renderArray(value)} <span>]</span>`;
          case 'boolean':return `<span class="boolean">${value}</span>`;
        }
        return `wut is this: ${type}`;
      }

      function renderArray(array) {
        return _.map(array, item => `${renderValue(item)}`).join(', ');
      }
    }]
  };
};