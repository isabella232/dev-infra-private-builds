/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/dev-infra-private/pr/merge", ["require", "exports", "tslib", "@angular/dev-infra-private/utils/config", "@angular/dev-infra-private/utils/console", "@angular/dev-infra-private/utils/git/github", "@angular/dev-infra-private/utils/git/github-urls", "@angular/dev-infra-private/utils/git/index", "@angular/dev-infra-private/pr/merge/config", "@angular/dev-infra-private/pr/merge/task"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.mergePullRequest = void 0;
    var tslib_1 = require("tslib");
    var config_1 = require("@angular/dev-infra-private/utils/config");
    var console_1 = require("@angular/dev-infra-private/utils/console");
    var github_1 = require("@angular/dev-infra-private/utils/git/github");
    var github_urls_1 = require("@angular/dev-infra-private/utils/git/github-urls");
    var index_1 = require("@angular/dev-infra-private/utils/git/index");
    var config_2 = require("@angular/dev-infra-private/pr/merge/config");
    var task_1 = require("@angular/dev-infra-private/pr/merge/task");
    /**
     * Merges a given pull request based on labels configured in the given merge configuration.
     * Pull requests can be merged with different strategies such as the Github API merge
     * strategy, or the local autosquash strategy. Either strategy has benefits and downsides.
     * More information on these strategies can be found in their dedicated strategy classes.
     *
     * See {@link GithubApiMergeStrategy} and {@link AutosquashMergeStrategy}
     *
     * @param prNumber Number of the pull request that should be merged.
     * @param githubToken Github token used for merging (i.e. fetching and pushing)
     * @param projectRoot Path to the local Git project that is used for merging.
     * @param config Configuration for merging pull requests.
     */
    function mergePullRequest(prNumber, githubToken, flags) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            /** Performs the merge and returns whether it was successful or not. */
            function performMerge(ignoreFatalErrors) {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var result, e_1;
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                _a.trys.push([0, 3, , 4]);
                                return [4 /*yield*/, api.merge(prNumber, ignoreFatalErrors)];
                            case 1:
                                result = _a.sent();
                                return [4 /*yield*/, handleMergeResult(result, ignoreFatalErrors)];
                            case 2: return [2 /*return*/, _a.sent()];
                            case 3:
                                e_1 = _a.sent();
                                // Catch errors to the Github API for invalid requests. We want to
                                // exit the script with a better explanation of the error.
                                if (e_1 instanceof github_1.GithubApiRequestError && e_1.status === 401) {
                                    console_1.error(console_1.red('Github API request failed. ' + e_1.message));
                                    console_1.error(console_1.yellow('Please ensure that your provided token is valid.'));
                                    console_1.error(console_1.yellow("You can generate a token here: " + github_urls_1.GITHUB_TOKEN_GENERATE_URL));
                                    process.exit(1);
                                }
                                throw e_1;
                            case 4: return [2 /*return*/];
                        }
                    });
                });
            }
            /**
             * Prompts whether the specified pull request should be forcibly merged. If so, merges
             * the specified pull request forcibly (ignoring non-critical failures).
             * @returns Whether the specified pull request has been forcibly merged.
             */
            function promptAndPerformForceMerge() {
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    return tslib_1.__generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, console_1.promptConfirm('Do you want to forcibly proceed with merging?')];
                            case 1:
                                if (_a.sent()) {
                                    // Perform the merge in force mode. This means that non-fatal failures
                                    // are ignored and the merge continues.
                                    return [2 /*return*/, performMerge(true)];
                                }
                                return [2 /*return*/, false];
                        }
                    });
                });
            }
            /**
             * Handles the merge result by printing console messages, exiting the process
             * based on the result, or by restarting the merge if force mode has been enabled.
             * @returns Whether the merge completed without errors or not.
             */
            function handleMergeResult(result, disableForceMergePrompt) {
                if (disableForceMergePrompt === void 0) { disableForceMergePrompt = false; }
                return tslib_1.__awaiter(this, void 0, void 0, function () {
                    var failure, status, canForciblyMerge, _a;
                    return tslib_1.__generator(this, function (_b) {
                        switch (_b.label) {
                            case 0:
                                failure = result.failure, status = result.status;
                                canForciblyMerge = failure && failure.nonFatal;
                                _a = status;
                                switch (_a) {
                                    case 2 /* SUCCESS */: return [3 /*break*/, 1];
                                    case 1 /* DIRTY_WORKING_DIR */: return [3 /*break*/, 2];
                                    case 0 /* UNKNOWN_GIT_ERROR */: return [3 /*break*/, 3];
                                    case 5 /* GITHUB_ERROR */: return [3 /*break*/, 4];
                                    case 4 /* USER_ABORTED */: return [3 /*break*/, 5];
                                    case 3 /* FAILED */: return [3 /*break*/, 6];
                                }
                                return [3 /*break*/, 9];
                            case 1:
                                console_1.info(console_1.green("Successfully merged the pull request: #" + prNumber));
                                return [2 /*return*/, true];
                            case 2:
                                console_1.error(console_1.red("Local working repository not clean. Please make sure there are " +
                                    "no uncommitted changes."));
                                return [2 /*return*/, false];
                            case 3:
                                console_1.error(console_1.red('An unknown Git error has been thrown. Please check the output ' +
                                    'above for details.'));
                                return [2 /*return*/, false];
                            case 4:
                                console_1.error(console_1.red('An error related to interacting with Github has been discovered.'));
                                console_1.error(failure.message);
                                return [2 /*return*/, false];
                            case 5:
                                console_1.info("Merge of pull request has been aborted manually: #" + prNumber);
                                return [2 /*return*/, true];
                            case 6:
                                console_1.error(console_1.yellow("Could not merge the specified pull request."));
                                console_1.error(console_1.red(failure.message));
                                if (!(canForciblyMerge && !disableForceMergePrompt)) return [3 /*break*/, 8];
                                console_1.info();
                                console_1.info(console_1.yellow('The pull request above failed due to non-critical errors.'));
                                console_1.info(console_1.yellow("This error can be forcibly ignored if desired."));
                                return [4 /*yield*/, promptAndPerformForceMerge()];
                            case 7: return [2 /*return*/, _b.sent()];
                            case 8: return [2 /*return*/, false];
                            case 9: throw Error("Unexpected merge result: " + status);
                        }
                    });
                });
            }
            var api;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Set the environment variable to skip all git commit hooks triggered by husky. We are unable to
                        // rely on `--no-verify` as some hooks still run, notably the `prepare-commit-msg` hook.
                        process.env['HUSKY'] = '0';
                        return [4 /*yield*/, createPullRequestMergeTask(githubToken, flags)];
                    case 1:
                        api = _a.sent();
                        return [4 /*yield*/, performMerge(false)];
                    case 2:
                        // Perform the merge. Force mode can be activated through a command line flag.
                        // Alternatively, if the merge fails with non-fatal failures, the script
                        // will prompt whether it should rerun in force mode.
                        if (!(_a.sent())) {
                            process.exit(1);
                        }
                        return [2 /*return*/];
                }
            });
        });
    }
    exports.mergePullRequest = mergePullRequest;
    /**
     * Creates the pull request merge task from the given Github token, project root
     * and optional explicit configuration. An explicit configuration can be specified
     * when the merge script is used outside of a `ng-dev` configured repository.
     */
    function createPullRequestMergeTask(githubToken, flags) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var projectRoot, devInfraConfig, git, _a, config, errors;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        projectRoot = config_1.getRepoBaseDir();
                        devInfraConfig = config_1.getConfig();
                        git = new index_1.GitClient(githubToken, devInfraConfig, projectRoot);
                        return [4 /*yield*/, config_2.loadAndValidateConfig(devInfraConfig, git.github)];
                    case 1:
                        _a = _b.sent(), config = _a.config, errors = _a.errors;
                        if (errors) {
                            console_1.error(console_1.red('Invalid merge configuration:'));
                            errors.forEach(function (desc) { return console_1.error(console_1.yellow("  -  " + desc)); });
                            process.exit(1);
                        }
                        // Set the remote so that the merge tool has access to information about
                        // the remote it intends to merge to.
                        config.remote = devInfraConfig.github;
                        // We can cast this to a merge config with remote because we always set the
                        // remote above.
                        return [2 /*return*/, new task_1.PullRequestMergeTask(config, git, flags)];
                }
            });
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9kZXYtaW5mcmEvcHIvbWVyZ2UvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HOzs7Ozs7Ozs7Ozs7OztJQUdILGtFQUE2RDtJQUM3RCxvRUFBbUY7SUFDbkYsc0VBQTZEO0lBQzdELGdGQUFzRTtJQUN0RSxvRUFBZ0Q7SUFFaEQscUVBQXNFO0lBQ3RFLGlFQUFpRztJQUVqRzs7Ozs7Ozs7Ozs7O09BWUc7SUFDSCxTQUFzQixnQkFBZ0IsQ0FDbEMsUUFBZ0IsRUFBRSxXQUFtQixFQUFFLEtBQWdDOztZQWN6RSx1RUFBdUU7WUFDdkUsU0FBZSxZQUFZLENBQUMsaUJBQTBCOzs7Ozs7O2dDQUVuQyxxQkFBTSxHQUFHLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxpQkFBaUIsQ0FBQyxFQUFBOztnQ0FBckQsTUFBTSxHQUFHLFNBQTRDO2dDQUNwRCxxQkFBTSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsaUJBQWlCLENBQUMsRUFBQTtvQ0FBekQsc0JBQU8sU0FBa0QsRUFBQzs7O2dDQUUxRCxrRUFBa0U7Z0NBQ2xFLDBEQUEwRDtnQ0FDMUQsSUFBSSxHQUFDLFlBQVksOEJBQXFCLElBQUksR0FBQyxDQUFDLE1BQU0sS0FBSyxHQUFHLEVBQUU7b0NBQzFELGVBQUssQ0FBQyxhQUFHLENBQUMsNkJBQTZCLEdBQUcsR0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7b0NBQ3RELGVBQUssQ0FBQyxnQkFBTSxDQUFDLGtEQUFrRCxDQUFDLENBQUMsQ0FBQztvQ0FDbEUsZUFBSyxDQUFDLGdCQUFNLENBQUMsb0NBQWtDLHVDQUEyQixDQUFDLENBQUMsQ0FBQztvQ0FDN0UsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztpQ0FDakI7Z0NBQ0QsTUFBTSxHQUFDLENBQUM7Ozs7O2FBRVg7WUFFRDs7OztlQUlHO1lBQ0gsU0FB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QkFBYyxFQUFFLENBQUM7d0JBQy9CLGNBQWMsR0FBRyxrQkFBUyxFQUFFLENBQUM7d0JBQzdCLEdBQUcsR0FBRyxJQUFJLGlCQUFTLENBQUMsV0FBVyxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUMsQ0FBQzt3QkFDM0MscUJBQU0sOEJBQXFCLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBQTs7d0JBQTFFLEtBQW1CLFNBQXVELEVBQXpFLE1BQU0sWUFBQSxFQUFFLE1BQU0sWUFBQTt3QkFFckIsSUFBSSxNQUFNLEVBQUU7NEJBQ1YsZUFBSyxDQUFDLGFBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDLENBQUM7NEJBQzNDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxlQUFLLENBQUMsZ0JBQU0sQ0FBQyxVQUFRLElBQU0sQ0FBQyxDQUFDLEVBQTdCLENBQTZCLENBQUMsQ0FBQzs0QkFDdEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzt5QkFDakI7d0JBRUQsd0VBQXdFO3dCQUN4RSxxQ0FBcUM7d0JBQ3JDLE1BQU8sQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQzt3QkFDdkMsMkVBQTJFO3dCQUMzRSxnQkFBZ0I7d0JBQ2hCLHNCQUFPLElBQUksMkJBQW9CLENBQUMsTUFBZ0MsRUFBRSxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUM7Ozs7S0FDL0UiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuXG5pbXBvcnQge2dldENvbmZpZywgZ2V0UmVwb0Jhc2VEaXJ9IGZyb20gJy4uLy4uL3V0aWxzL2NvbmZpZyc7XG5pbXBvcnQge2Vycm9yLCBncmVlbiwgaW5mbywgcHJvbXB0Q29uZmlybSwgcmVkLCB5ZWxsb3d9IGZyb20gJy4uLy4uL3V0aWxzL2NvbnNvbGUnO1xuaW1wb3J0IHtHaXRodWJBcGlSZXF1ZXN0RXJyb3J9IGZyb20gJy4uLy4uL3V0aWxzL2dpdC9naXRodWInO1xuaW1wb3J0IHtHSVRIVUJfVE9LRU5fR0VORVJBVEVfVVJMfSBmcm9tICcuLi8uLi91dGlscy9naXQvZ2l0aHViLXVybHMnO1xuaW1wb3J0IHtHaXRDbGllbnR9IGZyb20gJy4uLy4uL3V0aWxzL2dpdC9pbmRleCc7XG5cbmltcG9ydCB7bG9hZEFuZFZhbGlkYXRlQ29uZmlnLCBNZXJnZUNvbmZpZ1dpdGhSZW1vdGV9IGZyb20gJy4vY29uZmlnJztcbmltcG9ydCB7TWVyZ2VSZXN1bHQsIE1lcmdlU3RhdHVzLCBQdWxsUmVxdWVzdE1lcmdlVGFzaywgUHVsbFJlcXVlc3RNZXJnZVRhc2tGbGFnc30gZnJvbSAnLi90YXNrJztcblxuLyoqXG4gKiBNZXJnZXMgYSBnaXZlbiBwdWxsIHJlcXVlc3QgYmFzZWQgb24gbGFiZWxzIGNvbmZpZ3VyZWQgaW4gdGhlIGdpdmVuIG1lcmdlIGNvbmZpZ3VyYXRpb24uXG4gKiBQdWxsIHJlcXVlc3RzIGNhbiBiZSBtZXJnZWQgd2l0aCBkaWZmZXJlbnQgc3RyYXRlZ2llcyBzdWNoIGFzIHRoZSBHaXRodWIgQVBJIG1lcmdlXG4gKiBzdHJhdGVneSwgb3IgdGhlIGxvY2FsIGF1dG9zcXVhc2ggc3RyYXRlZ3kuIEVpdGhlciBzdHJhdGVneSBoYXMgYmVuZWZpdHMgYW5kIGRvd25zaWRlcy5cbiAqIE1vcmUgaW5mb3JtYXRpb24gb24gdGhlc2Ugc3RyYXRlZ2llcyBjYW4gYmUgZm91bmQgaW4gdGhlaXIgZGVkaWNhdGVkIHN0cmF0ZWd5IGNsYXNzZXMuXG4gKlxuICogU2VlIHtAbGluayBHaXRodWJBcGlNZXJnZVN0cmF0ZWd5fSBhbmQge0BsaW5rIEF1dG9zcXVhc2hNZXJnZVN0cmF0ZWd5fVxuICpcbiAqIEBwYXJhbSBwck51bWJlciBOdW1iZXIgb2YgdGhlIHB1bGwgcmVxdWVzdCB0aGF0IHNob3VsZCBiZSBtZXJnZWQuXG4gKiBAcGFyYW0gZ2l0aHViVG9rZW4gR2l0aHViIHRva2VuIHVzZWQgZm9yIG1lcmdpbmcgKGkuZS4gZmV0Y2hpbmcgYW5kIHB1c2hpbmcpXG4gKiBAcGFyYW0gcHJvamVjdFJvb3QgUGF0aCB0byB0aGUgbG9jYWwgR2l0IHByb2plY3QgdGhhdCBpcyB1c2VkIGZvciBtZXJnaW5nLlxuICogQHBhcmFtIGNvbmZpZyBDb25maWd1cmF0aW9uIGZvciBtZXJnaW5nIHB1bGwgcmVxdWVzdHMuXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBtZXJnZVB1bGxSZXF1ZXN0KFxuICAgIHByTnVtYmVyOiBudW1iZXIsIGdpdGh1YlRva2VuOiBzdHJpbmcsIGZsYWdzOiBQdWxsUmVxdWVzdE1lcmdlVGFza0ZsYWdzKSB7XG4gIC8vIFNldCB0aGUgZW52aXJvbm1lbnQgdmFyaWFibGUgdG8gc2tpcCBhbGwgZ2l0IGNvbW1pdCBob29rcyB0cmlnZ2VyZWQgYnkgaHVza3kuIFdlIGFyZSB1bmFibGUgdG9cbiAgLy8gcmVseSBvbiBgLS1uby12ZXJpZnlgIGFzIHNvbWUgaG9va3Mgc3RpbGwgcnVuLCBub3RhYmx5IHRoZSBgcHJlcGFyZS1jb21taXQtbXNnYCBob29rLlxuICBwcm9jZXNzLmVudlsnSFVTS1knXSA9ICcwJztcblxuICBjb25zdCBhcGkgPSBhd2FpdCBjcmVhdGVQdWxsUmVxdWVzdE1lcmdlVGFzayhnaXRodWJUb2tlbiwgZmxhZ3MpO1xuXG4gIC8vIFBlcmZvcm0gdGhlIG1lcmdlLiBGb3JjZSBtb2RlIGNhbiBiZSBhY3RpdmF0ZWQgdGhyb3VnaCBhIGNvbW1hbmQgbGluZSBmbGFnLlxuICAvLyBBbHRlcm5hdGl2ZWx5LCBpZiB0aGUgbWVyZ2UgZmFpbHMgd2l0aCBub24tZmF0YWwgZmFpbHVyZXMsIHRoZSBzY3JpcHRcbiAgLy8gd2lsbCBwcm9tcHQgd2hldGhlciBpdCBzaG91bGQgcmVydW4gaW4gZm9yY2UgbW9kZS5cbiAgaWYgKCFhd2FpdCBwZXJmb3JtTWVyZ2UoZmFsc2UpKSB7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG5cbiAgLyoqIFBlcmZvcm1zIHRoZSBtZXJnZSBhbmQgcmV0dXJucyB3aGV0aGVyIGl0IHdhcyBzdWNjZXNzZnVsIG9yIG5vdC4gKi9cbiAgYXN5bmMgZnVuY3Rpb24gcGVyZm9ybU1lcmdlKGlnbm9yZUZhdGFsRXJyb3JzOiBib29sZWFuKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGFwaS5tZXJnZShwck51bWJlciwgaWdub3JlRmF0YWxFcnJvcnMpO1xuICAgICAgcmV0dXJuIGF3YWl0IGhhbmRsZU1lcmdlUmVzdWx0KHJlc3VsdCwgaWdub3JlRmF0YWxFcnJvcnMpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIC8vIENhdGNoIGVycm9ycyB0byB0aGUgR2l0aHViIEFQSSBmb3IgaW52YWxpZCByZXF1ZXN0cy4gV2Ugd2FudCB0b1xuICAgICAgLy8gZXhpdCB0aGUgc2NyaXB0IHdpdGggYSBiZXR0ZXIgZXhwbGFuYXRpb24gb2YgdGhlIGVycm9yLlxuICAgICAgaWYgKGUgaW5zdGFuY2VvZiBHaXRodWJBcGlSZXF1ZXN0RXJyb3IgJiYgZS5zdGF0dXMgPT09IDQwMSkge1xuICAgICAgICBlcnJvcihyZWQoJ0dpdGh1YiBBUEkgcmVxdWVzdCBmYWlsZWQuICcgKyBlLm1lc3NhZ2UpKTtcbiAgICAgICAgZXJyb3IoeWVsbG93KCdQbGVhc2UgZW5zdXJlIHRoYXQgeW91ciBwcm92aWRlZCB0b2tlbiBpcyB2YWxpZC4nKSk7XG4gICAgICAgIGVycm9yKHllbGxvdyhgWW91IGNhbiBnZW5lcmF0ZSBhIHRva2VuIGhlcmU6ICR7R0lUSFVCX1RPS0VOX0dFTkVSQVRFX1VSTH1gKSk7XG4gICAgICAgIHByb2Nlc3MuZXhpdCgxKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFByb21wdHMgd2hldGhlciB0aGUgc3BlY2lmaWVkIHB1bGwgcmVxdWVzdCBzaG91bGQgYmUgZm9yY2libHkgbWVyZ2VkLiBJZiBzbywgbWVyZ2VzXG4gICAqIHRoZSBzcGVjaWZpZWQgcHVsbCByZXF1ZXN0IGZvcmNpYmx5IChpZ25vcmluZyBub24tY3JpdGljYWwgZmFpbHVyZXMpLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBzcGVjaWZpZWQgcHVsbCByZXF1ZXN0IGhhcyBiZWVuIGZvcmNpYmx5IG1lcmdlZC5cbiAgICovXG4gIGFzeW5jIGZ1bmN0aW9uIHByb21wdEFuZFBlcmZvcm1Gb3JjZU1lcmdlKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIGlmIChhd2FpdCBwcm9tcHRDb25maXJtKCdEbyB5b3Ugd2FudCB0byBmb3JjaWJseSBwcm9jZWVkIHdpdGggbWVyZ2luZz8nKSkge1xuICAgICAgLy8gUGVyZm9ybSB0aGUgbWVyZ2UgaW4gZm9yY2UgbW9kZS4gVGhpcyBtZWFucyB0aGF0IG5vbi1mYXRhbCBmYWlsdXJlc1xuICAgICAgLy8gYXJlIGlnbm9yZWQgYW5kIHRoZSBtZXJnZSBjb250aW51ZXMuXG4gICAgICByZXR1cm4gcGVyZm9ybU1lcmdlKHRydWUpO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogSGFuZGxlcyB0aGUgbWVyZ2UgcmVzdWx0IGJ5IHByaW50aW5nIGNvbnNvbGUgbWVzc2FnZXMsIGV4aXRpbmcgdGhlIHByb2Nlc3NcbiAgICogYmFzZWQgb24gdGhlIHJlc3VsdCwgb3IgYnkgcmVzdGFydGluZyB0aGUgbWVyZ2UgaWYgZm9yY2UgbW9kZSBoYXMgYmVlbiBlbmFibGVkLlxuICAgKiBAcmV0dXJucyBXaGV0aGVyIHRoZSBtZXJnZSBjb21wbGV0ZWQgd2l0aG91dCBlcnJvcnMgb3Igbm90LlxuICAgKi9cbiAgYXN5bmMgZnVuY3Rpb24gaGFuZGxlTWVyZ2VSZXN1bHQocmVzdWx0OiBNZXJnZVJlc3VsdCwgZGlzYWJsZUZvcmNlTWVyZ2VQcm9tcHQgPSBmYWxzZSkge1xuICAgIGNvbnN0IHtmYWlsdXJlLCBzdGF0dXN9ID0gcmVzdWx0O1xuICAgIGNvbnN0IGNhbkZvcmNpYmx5TWVyZ2UgPSBmYWlsdXJlICYmIGZhaWx1cmUubm9uRmF0YWw7XG5cbiAgICBzd2l0Y2ggKHN0YXR1cykge1xuICAgICAgY2FzZSBNZXJnZVN0YXR1cy5TVUNDRVNTOlxuICAgICAgICBpbmZvKGdyZWVuKGBTdWNjZXNzZnVsbHkgbWVyZ2VkIHRoZSBwdWxsIHJlcXVlc3Q6ICMke3ByTnVtYmVyfWApKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlIE1lcmdlU3RhdHVzLkRJUlRZX1dPUktJTkdfRElSOlxuICAgICAgICBlcnJvcihcbiAgICAgICAgICAgIHJlZChgTG9jYWwgd29ya2luZyByZXBvc2l0b3J5IG5vdCBjbGVhbi4gUGxlYXNlIG1ha2Ugc3VyZSB0aGVyZSBhcmUgYCArXG4gICAgICAgICAgICAgICAgYG5vIHVuY29tbWl0dGVkIGNoYW5nZXMuYCkpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlIE1lcmdlU3RhdHVzLlVOS05PV05fR0lUX0VSUk9SOlxuICAgICAgICBlcnJvcihcbiAgICAgICAgICAgIHJlZCgnQW4gdW5rbm93biBHaXQgZXJyb3IgaGFzIGJlZW4gdGhyb3duLiBQbGVhc2UgY2hlY2sgdGhlIG91dHB1dCAnICtcbiAgICAgICAgICAgICAgICAnYWJvdmUgZm9yIGRldGFpbHMuJykpO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBjYXNlIE1lcmdlU3RhdHVzLkdJVEhVQl9FUlJPUjpcbiAgICAgICAgZXJyb3IocmVkKCdBbiBlcnJvciByZWxhdGVkIHRvIGludGVyYWN0aW5nIHdpdGggR2l0aHViIGhhcyBiZWVuIGRpc2NvdmVyZWQuJykpO1xuICAgICAgICBlcnJvcihmYWlsdXJlIS5tZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgY2FzZSBNZXJnZVN0YXR1cy5VU0VSX0FCT1JURUQ6XG4gICAgICAgIGluZm8oYE1lcmdlIG9mIHB1bGwgcmVxdWVzdCBoYXMgYmVlbiBhYm9ydGVkIG1hbnVhbGx5OiAjJHtwck51bWJlcn1gKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICBjYXNlIE1lcmdlU3RhdHVzLkZBSUxFRDpcbiAgICAgICAgZXJyb3IoeWVsbG93KGBDb3VsZCBub3QgbWVyZ2UgdGhlIHNwZWNpZmllZCBwdWxsIHJlcXVlc3QuYCkpO1xuICAgICAgICBlcnJvcihyZWQoZmFpbHVyZSEubWVzc2FnZSkpO1xuICAgICAgICBpZiAoY2FuRm9yY2libHlNZXJnZSAmJiAhZGlzYWJsZUZvcmNlTWVyZ2VQcm9tcHQpIHtcbiAgICAgICAgICBpbmZvKCk7XG4gICAgICAgICAgaW5mbyh5ZWxsb3coJ1RoZSBwdWxsIHJlcXVlc3QgYWJvdmUgZmFpbGVkIGR1ZSB0byBub24tY3JpdGljYWwgZXJyb3JzLicpKTtcbiAgICAgICAgICBpbmZvKHllbGxvdyhgVGhpcyBlcnJvciBjYW4gYmUgZm9yY2libHkgaWdub3JlZCBpZiBkZXNpcmVkLmApKTtcbiAgICAgICAgICByZXR1cm4gYXdhaXQgcHJvbXB0QW5kUGVyZm9ybUZvcmNlTWVyZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBFcnJvcihgVW5leHBlY3RlZCBtZXJnZSByZXN1bHQ6ICR7c3RhdHVzfWApO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIENyZWF0ZXMgdGhlIHB1bGwgcmVxdWVzdCBtZXJnZSB0YXNrIGZyb20gdGhlIGdpdmVuIEdpdGh1YiB0b2tlbiwgcHJvamVjdCByb290XG4gKiBhbmQgb3B0aW9uYWwgZXhwbGljaXQgY29uZmlndXJhdGlvbi4gQW4gZXhwbGljaXQgY29uZmlndXJhdGlvbiBjYW4gYmUgc3BlY2lmaWVkXG4gKiB3aGVuIHRoZSBtZXJnZSBzY3JpcHQgaXMgdXNlZCBvdXRzaWRlIG9mIGEgYG5nLWRldmAgY29uZmlndXJlZCByZXBvc2l0b3J5LlxuICovXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVQdWxsUmVxdWVzdE1lcmdlVGFzayhnaXRodWJUb2tlbjogc3RyaW5nLCBmbGFnczogUHVsbFJlcXVlc3RNZXJnZVRhc2tGbGFncykge1xuICBjb25zdCBwcm9qZWN0Um9vdCA9IGdldFJlcG9CYXNlRGlyKCk7XG4gIGNvbnN0IGRldkluZnJhQ29uZmlnID0gZ2V0Q29uZmlnKCk7XG4gIGNvbnN0IGdpdCA9IG5ldyBHaXRDbGllbnQoZ2l0aHViVG9rZW4sIGRldkluZnJhQ29uZmlnLCBwcm9qZWN0Um9vdCk7XG4gIGNvbnN0IHtjb25maWcsIGVycm9yc30gPSBhd2FpdCBsb2FkQW5kVmFsaWRhdGVDb25maWcoZGV2SW5mcmFDb25maWcsIGdpdC5naXRodWIpO1xuXG4gIGlmIChlcnJvcnMpIHtcbiAgICBlcnJvcihyZWQoJ0ludmFsaWQgbWVyZ2UgY29uZmlndXJhdGlvbjonKSk7XG4gICAgZXJyb3JzLmZvckVhY2goZGVzYyA9PiBlcnJvcih5ZWxsb3coYCAgLSAgJHtkZXNjfWApKSk7XG4gICAgcHJvY2Vzcy5leGl0KDEpO1xuICB9XG5cbiAgLy8gU2V0IHRoZSByZW1vdGUgc28gdGhhdCB0aGUgbWVyZ2UgdG9vbCBoYXMgYWNjZXNzIHRvIGluZm9ybWF0aW9uIGFib3V0XG4gIC8vIHRoZSByZW1vdGUgaXQgaW50ZW5kcyB0byBtZXJnZSB0by5cbiAgY29uZmlnIS5yZW1vdGUgPSBkZXZJbmZyYUNvbmZpZy5naXRodWI7XG4gIC8vIFdlIGNhbiBjYXN0IHRoaXMgdG8gYSBtZXJnZSBjb25maWcgd2l0aCByZW1vdGUgYmVjYXVzZSB3ZSBhbHdheXMgc2V0IHRoZVxuICAvLyByZW1vdGUgYWJvdmUuXG4gIHJldHVybiBuZXcgUHVsbFJlcXVlc3RNZXJnZVRhc2soY29uZmlnISBhcyBNZXJnZUNvbmZpZ1dpdGhSZW1vdGUsIGdpdCwgZmxhZ3MpO1xufVxuIl19