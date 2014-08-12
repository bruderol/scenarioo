package org.scenarioo.rest.step;

import org.scenarioo.model.docu.aggregates.scenarios.ScenarioPageSteps;
import org.scenarioo.model.docu.aggregates.steps.StepStatistics;
import org.scenarioo.rest.request.StepIdentifier;
import org.scenarioo.rest.util.LoadScenarioResult;
import org.scenarioo.rest.util.ScenarioLoader;

public class StepLoader {
	
	private final ScenarioLoader scenarioLoader;
	private final StepIndexResolver stepIndexResolver;
	
	public StepLoader(final ScenarioLoader scenarioLoader, final StepIndexResolver stepIndexResolver) {
		this.scenarioLoader = scenarioLoader;
		this.stepIndexResolver = stepIndexResolver;
	}
	
	public StepLoaderResult loadStep(final StepIdentifier stepIdentifier) {
		LoadScenarioResult loadScenarioResult = scenarioLoader.loadScenario(stepIdentifier);
		return getStepImageInfo(stepIdentifier, loadScenarioResult);
	}
	
	private StepLoaderResult getStepImageInfo(final StepIdentifier stepIdentifier,
			final LoadScenarioResult loadScenarioResult) {
		if (loadScenarioResult.isRequestedScenarioFound()) {
			return resolveStepIndex(stepIdentifier, loadScenarioResult.getPagesAndSteps());
		} else if (loadScenarioResult.containsValidRedirect()) {
			return StepLoaderResult.createRedirect(loadScenarioResult.getRedirect());
		} else {
			return StepLoaderResult.createNotFound();
		}
	}
	
	private StepLoaderResult resolveStepIndex(final StepIdentifier stepIdentifier, final ScenarioPageSteps pageSteps) {
		ResolveStepIndexResult resolveStepIndexResult = stepIndexResolver.resolveStepIndex(pageSteps, stepIdentifier);
		
		if (resolveStepIndexResult.isRequestedStepFound()) {
			StepStatistics stepStatistics = pageSteps.getStepStatistics(stepIdentifier.getPageName(),
					stepIdentifier.getPageOccurrence());
			return StepLoaderResult.createFoundRequestedStep(resolveStepIndexResult.getIndex(), stepIdentifier,
					stepStatistics);
		} else if (resolveStepIndexResult.containsValidRedirect()) {
			return StepLoaderResult.createRedirect(resolveStepIndexResult.getRedirect());
		} else {
			return findPageInAllUseCases(stepIdentifier);
		}
	}
	
	private StepLoaderResult findPageInAllUseCases(final StepIdentifier stepIdentifier) {
		LoadScenarioResult loadScenarioResult = scenarioLoader
				.findPageInRequestedUseCaseAndInAllUseCases(stepIdentifier);
		
		if (loadScenarioResult.containsValidRedirect()) {
			return StepLoaderResult.createRedirect(loadScenarioResult.getRedirect());
		} else {
			return StepLoaderResult.createNotFound();
		}
	}
	
}
