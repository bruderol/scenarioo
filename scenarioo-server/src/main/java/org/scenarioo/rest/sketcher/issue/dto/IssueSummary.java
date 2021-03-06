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

package org.scenarioo.rest.sketcher.issue.dto;

import java.util.Date;

import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlRootElement;

import org.scenarioo.model.sketcher.Issue;
import org.scenarioo.rest.base.StepIdentifier;

/**
 * Used for the listing of all issues (currently equal to sketches) related to
 * a branch, a feature, a scenario or a step.
 */
@XmlRootElement
@XmlAccessorType(XmlAccessType.FIELD)
public class IssueSummary {

	private String id;
	private String name;
	private String description;
	private String author;
	private String relatedFeatureName;
	private String relatedScenarioName;
	private StepIdentifier relatedStep;
	private Date dateCreated;
	private Date dateModified;

	public static IssueSummary createFromIssue(final Issue issue) {
		final IssueSummary summary = new IssueSummary();
		summary.setName(issue.getName());
		summary.setId(issue.getIssueId());
		summary.setDescription(issue.getDescription());
		summary.setAuthor(issue.getAuthor());
		summary.setRelatedStep(issue.getRelatedStep());
		summary.setDateCreated(issue.getDateCreated());
		summary.setDateModified(issue.getDateModified());
		return summary;
	}

	public String getId() {
		return id;
	}

	public void setId(final String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(final String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(final String description) {
		this.description = description;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(final String author) {
		this.author = author;
	}

	public String getRelatedFeatureName() {
		return relatedFeatureName;
	}

	public void setRelatedFeatureName(final String relatedFeatureName) {
		this.relatedFeatureName = relatedFeatureName;
	}

	public String getRelatedScenarioName() {
		return relatedScenarioName;
	}

	public void setRelatedScenarioName(final String relatedScenarioName) {
		this.relatedScenarioName = relatedScenarioName;
	}

	public StepIdentifier getRelatedStep() {
		return relatedStep;
	}

	public void setRelatedStep(final StepIdentifier relatedStep) {
		this.relatedStep = relatedStep;
	}

	public Date getDateCreated() {
		return dateCreated;
	}

	public void setDateCreated(final Date dateCreated) {
		this.dateCreated = dateCreated;
	}

	public Date getDateModified() {
		return dateModified;
	}

	public void setDateModified(final Date dateModified) {
		this.dateModified = dateModified;
	}

}
