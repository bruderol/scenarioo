'use strict';

var BaseWebPage = require('./baseWebPage.js'),
    util = require('util'),
    e2eUtils = require('../util/util.js');

function HomePage(overridePath) {
    if (overridePath && overridePath.length > 0) {
        BaseWebPage.call(this, overridePath);
    } else {
        BaseWebPage.call(this, '/features');
    }

    this.featureSearchField = element(by.id('featuresSearchField'));
    this.aboutScenariooPopup = element(by.css('.modal.about-popup'));
    this.popupCloseButton = element(by.css('.modal-footer button.btn'));
    this.featureTable = element(by.css('table.feature-table'));
    this.showMetaDataButton = element(by.id('sc-showHideDetailsButton-show'));
    this.hideMetaDataButton = element(by.id('sc-showHideDetailsButton-hide'));
    this.metaDataPanel = element(by.id('sc-metadata-panel'));
    this.sketchesTab = element(by.id('sc-main-tab-sketches'));
    this.pagesTab = element(by.id('sc-main-tab-pages'));
}

util.inherits(HomePage, BaseWebPage);


HomePage.prototype.assertPageIsDisplayed = function () {
    // call assertPageIsDisplayed on BaseWebPage
    BaseWebPage.prototype.assertPageIsDisplayed.apply(this);
    expect(this.featureSearchField.isDisplayed()).toBe(true);
};

HomePage.prototype.assertScenariooInfoDialogShown = function () {
    expect(this.aboutScenariooPopup.isDisplayed()).toBe(true);
    expect(this.popupCloseButton.isDisplayed()).toBe(true);
};

HomePage.prototype.assertScenariooInfoDialogNotShown = function () {
    e2eUtils.assertElementNotPresentInDom(by.css('.modal-dialog.about-popup'));
};

HomePage.prototype.assertComparisonMenuNotShown = function () {
    e2eUtils.assertElementNotPresentInDom(by.id('#comparison-selection-dropdown'));
};

HomePage.prototype.closeScenariooInfoDialogIfOpen = function () {
    browser.isElementPresent(by.css('.modal-footer button.btn')).then(function(present){
        if(present) {
            element(by.css('.modal-footer button.btn')).click();
        }
    });
};

HomePage.prototype.filterFeatures = function (filterQuery) {
    this.featureSearchField.clear();
    this.featureSearchField.sendKeys(filterQuery);
};

HomePage.prototype.assertFeaturesShown = function (count) {
    this.featureTable.all(by.css('tbody tr')).then(function (elements) {
        expect(elements.length).toBe(count);
    });
};

HomePage.prototype.selectFeature = function(featureIndex) {
    this.featureTable.all(by.css('tbody tr')).then(function(elements) {
        elements[featureIndex].click();
    });
};

HomePage.prototype.showMetaData = function() {
    this.showMetaDataButton.click();
};

HomePage.prototype.assertMetaDataShown = function() {
    expect(this.metaDataPanel.isDisplayed()).toBe(true);
};

HomePage.prototype.assertMetaDataHidden = function() {
    expect(this.metaDataPanel.isDisplayed()).toBe(false);
};

HomePage.prototype.hideMetaData = function() {
    this.hideMetaDataButton.click();
};

HomePage.prototype.sortByChanges = function(){
    this.featureTable.element(by.css('th.sort-diff-info')).click();
};

HomePage.prototype.assertNumberOfDiffInfos = function(count){
    this.featureTable.all(by.css('.diff-info-wrapper')).then(function (elements) {
        expect(elements.length).toBe(count);
    });
};

HomePage.prototype.assertLastFeature = function(lastName) {
    e2eUtils.assertTextPresentInElement(this.featureTable.element(by.css('tr:last-of-type td:nth-of-type(2)')), lastName);
};

HomePage.prototype.assertFirstFeature = function(firstName) {
    e2eUtils.assertTextPresentInElement(this.featureTable.element(by.css('tr:first-of-type td:nth-of-type(2)')), firstName);
};

HomePage.prototype.selectSketchesTab = function() {
    this.sketchesTab.click();
};

HomePage.prototype.assertSketchesListContainsEntryWithSketchName = function(sketchName) {
    e2eUtils.assertTextPresentInElement(element(by.id('sc-sketches-list')), sketchName);
};

HomePage.prototype.selectPagesTab = function() {
    this.pagesTab.click();
};

HomePage.prototype.assertPagesTabContainsPage = function(pageName) {
    e2eUtils.assertTextPresentInElement(element(by.id('treeviewtable')), pageName);
};

HomePage.prototype.filterPages = function (filterQuery) {
    var pagesSearchField = element(by.id('pagesSearchField'));
    pagesSearchField.clear();
    pagesSearchField.sendKeys(filterQuery);
};

HomePage.prototype.assertCustomTabEntriesShown = function (count) {
    element(by.id('treeviewtable')).all(by.css('tbody tr')).filter(function(e) {
        return e.isDisplayed();
    }).then(function (elements) {
        // Not a great workaround, at the moment the filterable table header column is also a normal tr
        expect(elements.length).toBe(count);
    });
};

HomePage.prototype.assertNoDiffInfoDisplayed = function () {
    expect(element(by.css('.sort-diff-info')).isPresent()).toBeFalsy();
};

module.exports = HomePage;
