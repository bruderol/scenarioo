package org.scenarioo.rest.step;

import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.scenarioo.api.ScenarioDocuReader;
import org.scenarioo.dao.aggregates.AggregatedDataReader;
import org.scenarioo.model.docu.aggregates.steps.StepNavigation;
import org.scenarioo.model.docu.aggregates.steps.StepStatistics;
import org.scenarioo.model.docu.entities.Scenario;
import org.scenarioo.model.docu.entities.Step;
import org.scenarioo.model.docu.entities.UseCase;
import org.scenarioo.rest.dto.StepDetails;
import org.scenarioo.rest.request.BuildIdentifier;
import org.scenarioo.rest.request.StepIdentifier;

public class StepResponseFactory {
	
	private final AggregatedDataReader aggregatedDataReader;
	
	private final ScenarioDocuReader scenarioDocuReader;
	
	public StepResponseFactory(final AggregatedDataReader aggregatedDataReader,
			final ScenarioDocuReader scenarioDocuReader) {
		this.aggregatedDataReader = aggregatedDataReader;
		this.scenarioDocuReader = scenarioDocuReader;
	}
	
	public Response createResponse(final StepLoaderResult stepLoaderResult, final StepIdentifier stepIdentifier,
			final BuildIdentifier buildIdentifierBeforeAliasResolution) {
		if (stepLoaderResult.isRequestedStepFound()) {
			return foundStepResponse(stepLoaderResult, stepIdentifier);
		} else if (stepLoaderResult.isRedirect()) {
			return redirectResponse(stepLoaderResult, buildIdentifierBeforeAliasResolution);
		} else {
			return notFoundResponse();
		}
	}
	
	private Response foundStepResponse(final StepLoaderResult stepLoaderResult, final StepIdentifier stepIdentifier) {
		StepDetails stepDetails = getStepDetails(stepLoaderResult, stepIdentifier);
		return Response.ok(stepDetails).build();
	}
	
	private StepDetails getStepDetails(final StepLoaderResult stepLoaderResult, final StepIdentifier stepIdentifier) {
		Step step = scenarioDocuReader.loadStep(stepIdentifier.getBranchName(), stepIdentifier.getBuildName(),
				stepIdentifier.getUsecaseName(), stepIdentifier.getScenarioName(), stepLoaderResult.getStepIndex());
		
		StepNavigation navigation = aggregatedDataReader.loadStepNavigation(stepIdentifier.getScenarioIdentifier(),
				stepLoaderResult.getStepIndex());
		StepStatistics statistics = stepLoaderResult.getStepStatistics();
		
		Scenario scenario = scenarioDocuReader.loadScenario(stepIdentifier.getBranchName(),
				stepIdentifier.getBuildName(), stepIdentifier.getUsecaseName(), stepIdentifier.getScenarioName());
		UseCase usecase = scenarioDocuReader.loadUsecase(stepIdentifier.getBranchName(), stepIdentifier.getBuildName(),
				stepIdentifier.getUsecaseName());
		
		return new StepDetails(step, navigation, statistics, usecase.getLabels(), scenario.getLabels());
	}
	
	private Response redirectResponse(final StepLoaderResult stepImage,
			final BuildIdentifier buildIdentifierBeforeAliasResolution) {
		StepIdentifier stepIdentifier = stepImage.getStepIdentifier();
		StepIdentifier stepIdentifierWithPotentialAlias = stepIdentifier
				.withDifferentBuildIdentifier(buildIdentifierBeforeAliasResolution);
		return Response.temporaryRedirect(stepIdentifierWithPotentialAlias.getStepUriForRedirect()).build();
	}
	
	private Response notFoundResponse() {
		return Response.status(Status.NOT_FOUND).build();
	}
	
}
