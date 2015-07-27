/*scenarioo-client
 Copyright (C) 2015, scenarioo.org Development Team

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


angular.module('scenarioo.services').factory('DrawTool', function ($rootScope, Tool, DrawShapeService, ZoomPanService) {

    return function () {

        var tool = Tool();


        tool.cursor = 'crosshair';
        tool.shape = null;
        tool.originalX = 0;
        tool.originalY = 0;
        tool.mousedown = false;


        tool.onmousedownTemplate = function (event) {
            tool.pauseEvent(event);
            tool.mousedown = true;

            var mousePoint = tool.getDrawingPad().getOffset(event);
            tool.originalX = tool.toZoomedPoint(mousePoint.x);
            tool.originalY = tool.toZoomedPoint(mousePoint.y);

            tool.shape = tool.getShape();

            ZoomPanService.disableZoomPan();
        };

        tool.onmouseupTemplate = function (event) {
            tool.pauseEvent(event);
            tool.mousedown = false;
            tool.originalX = 0;
            tool.originalY = 0;

            DrawShapeService.registerShapeEvents(tool.shape, tool.isShapeEditable());

            ZoomPanService.enableZoomPan();
            $rootScope.$broadcast(tool.DRAWING_ENDED_EVENT, tool.shape);
        };

        tool.onmousedragTemplate = function (event) {
            tool.pauseEvent(event);

            var mousePoint = tool.getDrawingPad().getOffset(event);
            tool.mouseX = tool.toZoomedPoint(mousePoint.x);
            tool.mouseY = tool.toZoomedPoint(mousePoint.y);

            tool.anchorX = Math.min(tool.originalX, tool.mouseX);
            tool.anchorY = Math.min(tool.originalY, tool.mouseY);

            tool.cornerX = Math.max(tool.originalX, tool.mouseX);
            tool.cornerY = Math.max(tool.originalY, tool.mouseY);
        };

        tool.pauseEvent = function (event) {
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            if (event.preventDefault) {
                event.preventDefault();
            }
            event.cancelBubble = true;
            event.returnValue = false;
            return false;
        };

        tool.toZoomedPoint = function (n) {
            return n / ZoomPanService.getZoomFactor();
        };

        tool.getShapeStartMode = function () {
            return 'VIEW';
        };

        tool.isShapeEditable = function () {
            return 'false';
        };

        tool.getShape = function () {
            return tool.shape;
        };

        return tool;
    };

});
