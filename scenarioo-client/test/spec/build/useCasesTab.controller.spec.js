/* scenarioo-client
 * Copyright (C) 2014, scenarioo.org Development Team
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

describe('FeaturesTabController', function () {

    var $location, $scope;
    var featuresTabController;

    beforeEach(module('scenarioo.controllers'));

    beforeEach(inject(function ($controller, $rootScope, _$location_) {
            $location = _$location_;

        $scope = $rootScope.$new();
        featuresTabController = $controller('FeaturesTabController', {$scope: $scope});
        }
    ));

    it('has no features and builds set in the beginning', function () {
        expect(featuresTabController.features.length).toBe(0);
        expect(featuresTabController.branchesAndBuilds.length).toBe(0);
    });

    it('navigates to feature when link is clicked', function () {
        expect($location.path()).toBe('');

        var dummyFeature = { name: 'DisplayWeather', diffInfo: {isRemoved: false} };
        featuresTabController.gotoFeature(dummyFeature);

        expect($location.path()).toBe('/feature/DisplayWeather');
    });

});
