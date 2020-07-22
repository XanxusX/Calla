﻿import { bgColor, columnGap, cssWidth, cssHeight, display, fgColor, col, gridColsDef, monospaceFamily, overflow, overflowY, styles, whiteSpace } from "../src/html/css.js";
import { onClick } from "../src/html/evts.js";
import { Button, clear, Div, Span } from "../src/html/tags.js";
import { TestOutput } from "./TestOutput.js";
import { TestOutputResultsEvent } from "./TestOutputResultsEvent.js";
import { TestStates } from "./TestStates.js";


/**
 * Creates a portion of a progress bar.
 * @param {string} color - a CSS color value
 * @param {string} width - a CSS size value
 */
function bar(color, width) {
    return styles(
        bgColor(color),
        fgColor(color),
        cssWidth(width));
}

/**
 * @callback onClickCallback
 * @param {MouseEvent} evt
 */

/**
 * 
 * @param {onClickCallback} thunk
 * @param {...any} rest
 */
function refresher(thunk, ...rest) {
    return Button(
        onClick(thunk),
        col(1),
        "\u{1F504}\u{FE0F}",
        ...rest);
}

function makeStatus(id) {
    const complete = id & TestStates.completed;

    if (id & TestStates.failed) {
        return complete ? "Failure" : "Failing";
    }
    else if (id & TestStates.succeeded) {
        return complete ? "Success" : "Succeeding";
    }
    else if (id & TestStates.started) {
        return complete ? "No test ran" : "Running";
    }
    else {
        return "Found";
    }
}

export class HtmlTestOutput extends TestOutput {
    constructor(...CaseClasses) {
        super(...CaseClasses);
        this.element = Div(overflowY("scroll"));
        /**
         * 
         * @param {TestOutputResultsEvent} evt
         */
        const draw = (evt) => {
            const s = Math.round(100 * evt.stats.totalSucceeded / evt.stats.totalFound),
                f = Math.round(100 * evt.stats.totalFailed / evt.stats.totalFound),
                t = Math.round(100 * (evt.stats.totalFound - evt.stats.totalSucceeded - evt.stats.totalFailed) / evt.stats.totalFound),
                basicStyle = styles(
                    display("inline-block"),
                    overflow("hidden"),
                    cssHeight("1em")),
                table = Div(
                    gridColsDef("auto", "auto", "auto", "1fr"),
                    monospaceFamily,
                    cssWidth("100%"),
                    columnGap("1em"),
                    refresher(() => this.run()),
                    Div(
                        col(2, 3),
                        cssHeight("2em"),
                        whiteSpace("nowrap"),
                        overflow("hidden"),
                        Span(basicStyle, bar("green", s + "%")),
                        Span(basicStyle, bar("red", f + "%")),
                        Span(basicStyle, bar("grey", t + "%"))),
                    Div(col(1), "Rerun"),
                    Div(col(2), "Name"),
                    Div(col(3), "Status"));
            for (let [testCaseName, testCase] of evt.results.entries()) {
                table.append(
                    Div(col(2, 3), testCaseName),
                    refresher(() => this.run(testCaseName)));
                for (let [testName, test] of testCase.entries()) {
                    table.append(
                        refresher(() => this.run(testCaseName, testName)),
                        Div(col(2), testName),
                        Div(col(3), makeStatus(test.state)),
                        Div(col(4), test.messages.join(", ")));
                }
            }
            clear(this.element);
            this.element.appendChild(table);
        };
        this.addEventListener("testoutputresults", draw);
    }
}
