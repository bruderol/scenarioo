/* scenarioo-server
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

package org.scenarioo.rest.diffViewer;

import java.io.File;
import java.text.NumberFormat;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;

import org.apache.log4j.Logger;
import org.scenarioo.business.builds.ScenarioDocuBuildsManager;
import org.scenarioo.dao.diffViewer.DiffReader;
import org.scenarioo.dao.diffViewer.impl.DiffReaderXmlImpl;
import org.scenarioo.rest.base.BuildIdentifier;
import org.scenarioo.utils.NumberFormatCreator;

@Path("/rest/diffViewer/baseBranchName/{baseBranchName}/baseBuildName/{baseBuildName}/comparisonName/{comparisonName}/featureName/{featureName}/scenarioName/{scenarioName}/stepIndex/{stepIndex}")
public class StepDiffScreenshotResource {

	private static final Logger LOGGER = Logger.getLogger(StepDiffScreenshotResource.class);

	private static final NumberFormat THREE_DIGIT_NUM_FORMAT = NumberFormatCreator
			.createNumberFormatWithMinimumIntegerDigits(3);

	private static final String SCREENSHOT_FILE_EXTENSION = ".png";

	private DiffReader diffReader = new DiffReaderXmlImpl();

	@GET
	@Produces("image/png")
	@Path("/stepDiffScreenshot")
	public File getDiffScreenshot(
			@PathParam("baseBranchName") final String baseBranchName,
			@PathParam("baseBuildName") final String baseBuildName,
			@PathParam("comparisonName") final String comparisonName,
			@PathParam("featureName") final String featureName,
			@PathParam("scenarioName") final String scenarioName,
			@PathParam("stepIndex") final int stepIndex) {
		LOGGER.info("REQUEST: getDiffScreenshot(" + baseBranchName + ", " + baseBranchName + ", " + comparisonName
				+ ", " + featureName + ", " + scenarioName + ", " + stepIndex + ")");

		final BuildIdentifier buildIdentifier = ScenarioDocuBuildsManager.INSTANCE.resolveBranchAndBuildAliases(
				baseBranchName,
				baseBuildName);

		final String imageFileName = THREE_DIGIT_NUM_FORMAT.format(stepIndex) + SCREENSHOT_FILE_EXTENSION;

		return diffReader.getScreenshotFile(buildIdentifier.getBranchName(), buildIdentifier.getBuildName(),
				comparisonName, featureName, scenarioName, imageFileName);
	}
}
