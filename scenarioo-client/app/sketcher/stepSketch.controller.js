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

angular.module('scenarioo.controllers').controller('StepSketchController', StepSketchController);

function StepSketchController($scope, $routeParams, $location, HostnameAndPort, SelectedBranchAndBuildService,
                              SharePageService, IssueResource, SketcherLinkService) {

    var vm = this;
    vm.loading = true;
    vm.issueNotFound = false;
    vm.getSketchScreenshotUrl = getSketchScreenshotUrl;
    vm.getOriginalScreenshotUrl = getOriginalScreenshotUrl;
    vm.getFeatureUrl = getFeatureUrl;
    vm.getScenarioUrl = getScenarioUrl;
    vm.getStepUrl = getStepUrl;

    var issueId = $routeParams.issueId,
        scenarioSketchId = $routeParams.scenarioSketchId,
        stepSketchId = $routeParams.stepSketchId;

    activate();

    function activate() {
        SketcherLinkService.showCreateOrEditSketchLinkInBreadcrumbs('Edit Sketch', editSketch);
        SelectedBranchAndBuildService.callOnSelectionChange(loadIssueAndSketch);
    }

    $scope.$on('$destroy', function () {
        SharePageService.invalidateUrls();
        SketcherLinkService.hideCreateOrEditSketchLinkInBreadcrumbs();
    });

    function editSketch() {
        $location.path('/editor/' + issueId + '/' + scenarioSketchId + '/' + stepSketchId).search('mode', 'edit');
    };

    function loadIssueAndSketch() {
        IssueResource.get(
            {
                'branchName': $routeParams.branch,
                'issueId': issueId
            },
            function onSuccess(result) {
                vm.issue = result.issue;
                vm.scenarioSketch = result.scenarioSketch;
                vm.stepSketch = result.stepSketch;
                updateUrlsForSharing();
                vm.loading = false;
            }, function onFailure() {
                vm.issueNotFound = true;
                vm.loading = false;
            });

        function updateUrlsForSharing() {
            SharePageService.setPageUrl(getCurrentUrlForSharing());
            SharePageService.setImageUrl(getSketchScreenshotUrlForSharing());
        }
    }

    function getCurrentUrlForSharing() {
        return $location.absUrl();
    };

    function getSketchScreenshotUrlForSharing() {
        if (angular.isUndefined(vm.stepSketch)) {
            return undefined;
        }

        var imageName = vm.stepSketch.sketchFileName;

        if (angular.isUndefined(imageName)) {
            return undefined;
        }

        var selected = SelectedBranchAndBuildService.selected();

        return HostnameAndPort.forLinkAbsolute() + 'rest/branch/' + selected.branch + '/issue/' + issueId + '/scenariosketch/' + scenarioSketchId + '/stepsketch/' + stepSketchId + '/image/sketch.png';
    };

    function getSketchScreenshotUrl() {
        if (angular.isUndefined(vm.stepSketch)) {
            return undefined;
        }

        var selected = SelectedBranchAndBuildService.selected();
        return HostnameAndPort.forLink() + 'rest/branch/' + selected.branch + '/issue/' + issueId + '/scenariosketch/' + scenarioSketchId + '/stepsketch/' + stepSketchId + '/image/sketch.png';
    };

    function getOriginalScreenshotUrl() {
        if (angular.isUndefined(vm.stepSketch)) {
            return undefined;
        }

        var selected = SelectedBranchAndBuildService.selected();
        return HostnameAndPort.forLink() + 'rest/branch/' + selected.branch + '/issue/' + issueId + '/scenariosketch/' + scenarioSketchId + '/stepsketch/' + stepSketchId + '/image/original.png';
    };

    function getFeatureUrl() {
        if(vm.stepSketch == null) {
            return undefined;
        }
        return '#/feature/' + (vm.stepSketch.relatedStep.featureName);
    };

    function getScenarioUrl() {
        if(vm.stepSketch == null) {
            return undefined;
        }
        var step = vm.stepSketch.relatedStep;
        return '#/scenario/' + (step.featureName) + '/' + encodeURIComponent(step.scenarioName);
    };

    function getStepUrl(){
        if(vm.stepSketch == null) {
            return undefined;
        }
        var step = vm.stepSketch.relatedStep;
        return '#/step/' + (step.featureName) + '/' + encodeURIComponent(step.scenarioName) + '/' + encodeURIComponent(step.pageName) + '/' + step.pageOccurrence + '/' + step.stepInPageOccurrence;
    };
};
