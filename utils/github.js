/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
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
        define("@angular/dev-infra-private/utils/github", ["require", "exports", "tslib", "@octokit/graphql", "typed-graphqlify"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getPendingPrs = exports.getPr = void 0;
    var tslib_1 = require("tslib");
    var graphql_1 = require("@octokit/graphql");
    var typed_graphqlify_1 = require("typed-graphqlify");
    /**
     * Authenticated instance of Github GraphQl API service, relies on a
     * personal access token being available in the TOKEN environment variable.
     */
    var graphql = graphql_1.graphql.defaults({
        headers: {
            // TODO(josephperrott): Remove reference to TOKEN environment variable as part of larger
            // effort to migrate to expecting tokens via GITHUB_ACCESS_TOKEN environment variables.
            authorization: "token " + (process.env.TOKEN || process.env.GITHUB_ACCESS_TOKEN),
        }
    });
    /** Get a PR from github  */
    function getPr(prSchema, number, _a) {
        var owner = _a.owner, name = _a.name;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var PR_QUERY, result;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        PR_QUERY = typed_graphqlify_1.params({
                            $number: 'Int!',
                            $owner: 'String!',
                            $name: 'String!',
                        }, {
                            repository: typed_graphqlify_1.params({ owner: '$owner', name: '$name' }, {
                                pullRequest: typed_graphqlify_1.params({ number: '$number' }, prSchema),
                            })
                        });
                        return [4 /*yield*/, graphql(typed_graphqlify_1.query(PR_QUERY), { number: number, owner: owner, name: name })];
                    case 1:
                        result = _b.sent();
                        return [2 /*return*/, result.repository.pullRequest];
                }
            });
        });
    }
    exports.getPr = getPr;
    /** Get all pending PRs from github  */
    function getPendingPrs(prSchema, _a) {
        var owner = _a.owner, name = _a.name;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var PRS_QUERY, query, queryBuilder, cursor, hasNextPage, prs, _b, query_1, params_1, results;
            return tslib_1.__generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        PRS_QUERY = typed_graphqlify_1.params({
                            $first: 'Int',
                            $after: 'String',
                            $owner: 'String!',
                            $name: 'String!',
                        }, {
                            repository: typed_graphqlify_1.params({ owner: '$owner', name: '$name' }, {
                                pullRequests: typed_graphqlify_1.params({
                                    first: '$first',
                                    after: '$after',
                                    states: "OPEN",
                                }, {
                                    nodes: [prSchema],
                                    pageInfo: {
                                        hasNextPage: typed_graphqlify_1.types.boolean,
                                        endCursor: typed_graphqlify_1.types.string,
                                    },
                                }),
                            })
                        });
                        query = typed_graphqlify_1.query('members', PRS_QUERY);
                        queryBuilder = function (count, cursor) {
                            return {
                                query: query,
                                params: {
                                    after: cursor || null,
                                    first: count,
                                    owner: owner,
                                    name: name,
                                },
                            };
                        };
                        hasNextPage = true;
                        prs = [];
                        _c.label = 1;
                    case 1:
                        if (!hasNextPage) return [3 /*break*/, 3];
                        _b = queryBuilder(100, cursor), query_1 = _b.query, params_1 = _b.params;
                        return [4 /*yield*/, graphql(query_1, params_1)];
                    case 2:
                        results = _c.sent();
                        prs.push.apply(prs, tslib_1.__spread(results.repository.pullRequests.nodes));
                        hasNextPage = results.repository.pullRequests.pageInfo.hasNextPage;
                        cursor = results.repository.pullRequests.pageInfo.endCursor;
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, prs];
                }
            });
        });
    }
    exports.getPendingPrs = getPendingPrs;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2l0aHViLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vZGV2LWluZnJhL3V0aWxzL2dpdGh1Yi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7Ozs7Ozs7Ozs7Ozs7O0lBRUgsNENBQW1FO0lBRW5FLHFEQUFzRTtJQU10RTs7O09BR0c7SUFDSCxJQUFNLE9BQU8sR0FBRyxpQkFBc0IsQ0FBQyxRQUFRLENBQUM7UUFDOUMsT0FBTyxFQUFFO1lBQ1Asd0ZBQXdGO1lBQ3hGLHVGQUF1RjtZQUN2RixhQUFhLEVBQUUsWUFBUyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFFO1NBQy9FO0tBQ0YsQ0FBQyxDQUFDO0lBRUgsNEJBQTRCO0lBQzVCLFNBQXNCLEtBQUssQ0FDdkIsUUFBa0IsRUFBRSxNQUFjLEVBQUUsRUFBMkI7WUFBMUIsS0FBSyxXQUFBLEVBQUUsSUFBSSxVQUFBOzs7Ozs7d0JBQzVDLFFBQVEsR0FBRyx5QkFBTSxDQUNuQjs0QkFDRSxPQUFPLEVBQUUsTUFBTTs0QkFDZixNQUFNLEVBQUUsU0FBUzs0QkFDakIsS0FBSyxFQUFFLFNBQVM7eUJBQ2pCLEVBQ0Q7NEJBQ0UsVUFBVSxFQUFFLHlCQUFNLENBQUMsRUFBQyxLQUFLLEVBQUUsUUFBUSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUMsRUFBRTtnQ0FDbkQsV0FBVyxFQUFFLHlCQUFNLENBQUMsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLEVBQUUsUUFBUSxDQUFDOzZCQUNuRCxDQUFDO3lCQUNILENBQUMsQ0FBQzt3QkFFUSxxQkFBTSxPQUFPLENBQUMsd0JBQVksQ0FBQyxRQUFRLENBQUMsRUFBRSxFQUFDLE1BQU0sUUFBQSxFQUFFLEtBQUssT0FBQSxFQUFFLElBQUksTUFBQSxFQUFDLENBQUMsRUFBQTs7d0JBQXJFLE1BQU0sR0FBRyxTQUErRTt3QkFDOUYsc0JBQU8sTUFBTSxDQUFDLFVBQVUsQ0FBQyxXQUFXLEVBQUM7Ozs7S0FDdEM7SUFoQkQsc0JBZ0JDO0lBRUQsdUNBQXVDO0lBQ3ZDLFNBQXNCLGFBQWEsQ0FBVyxRQUFrQixFQUFFLEVBQTJCO1lBQTFCLEtBQUssV0FBQSxFQUFFLElBQUksVUFBQTs7Ozs7O3dCQUV0RSxTQUFTLEdBQUcseUJBQU0sQ0FDcEI7NEJBQ0UsTUFBTSxFQUFFLEtBQUs7NEJBQ2IsTUFBTSxFQUFFLFFBQVE7NEJBQ2hCLE1BQU0sRUFBRSxTQUFTOzRCQUNqQixLQUFLLEVBQUUsU0FBUzt5QkFDakIsRUFDRDs0QkFDRSxVQUFVLEVBQUUseUJBQU0sQ0FBQyxFQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBQyxFQUFFO2dDQUNuRCxZQUFZLEVBQUUseUJBQU0sQ0FDaEI7b0NBQ0UsS0FBSyxFQUFFLFFBQVE7b0NBQ2YsS0FBSyxFQUFFLFFBQVE7b0NBQ2YsTUFBTSxFQUFFLE1BQU07aUNBQ2YsRUFDRDtvQ0FDRSxLQUFLLEVBQUUsQ0FBQyxRQUFRLENBQUM7b0NBQ2pCLFFBQVEsRUFBRTt3Q0FDUixXQUFXLEVBQUUsd0JBQUssQ0FBQyxPQUFPO3dDQUMxQixTQUFTLEVBQUUsd0JBQUssQ0FBQyxNQUFNO3FDQUN4QjtpQ0FDRixDQUFDOzZCQUNQLENBQUM7eUJBQ0gsQ0FBQyxDQUFDO3dCQUNELEtBQUssR0FBRyx3QkFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQzt3QkFLM0MsWUFBWSxHQUFHLFVBQUMsS0FBYSxFQUFFLE1BQWU7NEJBQ2xELE9BQU87Z0NBQ0wsS0FBSyxPQUFBO2dDQUNMLE1BQU0sRUFBRTtvQ0FDTixLQUFLLEVBQUUsTUFBTSxJQUFJLElBQUk7b0NBQ3JCLEtBQUssRUFBRSxLQUFLO29DQUNaLEtBQUssT0FBQTtvQ0FDTCxJQUFJLE1BQUE7aUNBQ0w7NkJBQ0YsQ0FBQzt3QkFDSixDQUFDLENBQUM7d0JBS0UsV0FBVyxHQUFHLElBQUksQ0FBQzt3QkFFakIsR0FBRyxHQUFvQixFQUFFLENBQUM7Ozs2QkFJekIsV0FBVzt3QkFDVixLQUFrQixZQUFZLENBQUMsR0FBRyxFQUFFLE1BQU0sQ0FBQyxFQUExQyxrQkFBSyxFQUFFLG9CQUFNLENBQThCO3dCQUNsQyxxQkFBTSxPQUFPLENBQUMsT0FBSyxFQUFFLFFBQU0sQ0FBQyxFQUFBOzt3QkFBdEMsT0FBTyxHQUFHLFNBQWdEO3dCQUVoRSxHQUFHLENBQUMsSUFBSSxPQUFSLEdBQUcsbUJBQVMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFFO3dCQUNuRCxXQUFXLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQzt3QkFDbkUsTUFBTSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7OzRCQUU5RCxzQkFBTyxHQUFHLEVBQUM7Ozs7S0FDWjtJQTdERCxzQ0E2REMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Z3JhcGhxbCBhcyB1bmF1dGhlbnRpY2F0ZWRHcmFwaHFsfSBmcm9tICdAb2N0b2tpdC9ncmFwaHFsJztcblxuaW1wb3J0IHtwYXJhbXMsIHF1ZXJ5IGFzIGdyYXBocWxRdWVyeSwgdHlwZXN9IGZyb20gJ3R5cGVkLWdyYXBocWxpZnknO1xuaW1wb3J0IHtOZ0RldkNvbmZpZ30gZnJvbSAnLi9jb25maWcnO1xuXG4vKiogVGhlIGNvbmZpZ3VyYXRpb24gcmVxdWlyZWQgZm9yIGdpdGh1YiBpbnRlcmFjdGlvbnMuICovXG50eXBlIEdpdGh1YkNvbmZpZyA9IE5nRGV2Q29uZmlnWydnaXRodWInXTtcblxuLyoqXG4gKiBBdXRoZW50aWNhdGVkIGluc3RhbmNlIG9mIEdpdGh1YiBHcmFwaFFsIEFQSSBzZXJ2aWNlLCByZWxpZXMgb24gYVxuICogcGVyc29uYWwgYWNjZXNzIHRva2VuIGJlaW5nIGF2YWlsYWJsZSBpbiB0aGUgVE9LRU4gZW52aXJvbm1lbnQgdmFyaWFibGUuXG4gKi9cbmNvbnN0IGdyYXBocWwgPSB1bmF1dGhlbnRpY2F0ZWRHcmFwaHFsLmRlZmF1bHRzKHtcbiAgaGVhZGVyczoge1xuICAgIC8vIFRPRE8oam9zZXBocGVycm90dCk6IFJlbW92ZSByZWZlcmVuY2UgdG8gVE9LRU4gZW52aXJvbm1lbnQgdmFyaWFibGUgYXMgcGFydCBvZiBsYXJnZXJcbiAgICAvLyBlZmZvcnQgdG8gbWlncmF0ZSB0byBleHBlY3RpbmcgdG9rZW5zIHZpYSBHSVRIVUJfQUNDRVNTX1RPS0VOIGVudmlyb25tZW50IHZhcmlhYmxlcy5cbiAgICBhdXRob3JpemF0aW9uOiBgdG9rZW4gJHtwcm9jZXNzLmVudi5UT0tFTiB8fCBwcm9jZXNzLmVudi5HSVRIVUJfQUNDRVNTX1RPS0VOfWAsXG4gIH1cbn0pO1xuXG4vKiogR2V0IGEgUFIgZnJvbSBnaXRodWIgICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UHI8UHJTY2hlbWE+KFxuICAgIHByU2NoZW1hOiBQclNjaGVtYSwgbnVtYmVyOiBudW1iZXIsIHtvd25lciwgbmFtZX06IEdpdGh1YkNvbmZpZykge1xuICBjb25zdCBQUl9RVUVSWSA9IHBhcmFtcyhcbiAgICAgIHtcbiAgICAgICAgJG51bWJlcjogJ0ludCEnLCAgICAvLyBUaGUgUFIgbnVtYmVyXG4gICAgICAgICRvd25lcjogJ1N0cmluZyEnLCAgLy8gVGhlIG9yZ2FuaXphdGlvbiB0byBxdWVyeSBmb3JcbiAgICAgICAgJG5hbWU6ICdTdHJpbmchJywgICAvLyBUaGUgb3JnYW5pemF0aW9uIHRvIHF1ZXJ5IGZvclxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVwb3NpdG9yeTogcGFyYW1zKHtvd25lcjogJyRvd25lcicsIG5hbWU6ICckbmFtZSd9LCB7XG4gICAgICAgICAgcHVsbFJlcXVlc3Q6IHBhcmFtcyh7bnVtYmVyOiAnJG51bWJlcid9LCBwclNjaGVtYSksXG4gICAgICAgIH0pXG4gICAgICB9KTtcblxuICBjb25zdCByZXN1bHQgPSBhd2FpdCBncmFwaHFsKGdyYXBocWxRdWVyeShQUl9RVUVSWSksIHtudW1iZXIsIG93bmVyLCBuYW1lfSkgYXMgdHlwZW9mIFBSX1FVRVJZO1xuICByZXR1cm4gcmVzdWx0LnJlcG9zaXRvcnkucHVsbFJlcXVlc3Q7XG59XG5cbi8qKiBHZXQgYWxsIHBlbmRpbmcgUFJzIGZyb20gZ2l0aHViICAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFBlbmRpbmdQcnM8UHJTY2hlbWE+KHByU2NoZW1hOiBQclNjaGVtYSwge293bmVyLCBuYW1lfTogR2l0aHViQ29uZmlnKSB7XG4gIC8vIFRoZSBHcmFwaFFMIHF1ZXJ5IG9iamVjdCB0byBnZXQgYSBwYWdlIG9mIHBlbmRpbmcgUFJzXG4gIGNvbnN0IFBSU19RVUVSWSA9IHBhcmFtcyhcbiAgICAgIHtcbiAgICAgICAgJGZpcnN0OiAnSW50JywgICAgICAvLyBIb3cgbWFueSBlbnRyaWVzIHRvIGdldCB3aXRoIGVhY2ggcmVxdWVzdFxuICAgICAgICAkYWZ0ZXI6ICdTdHJpbmcnLCAgIC8vIFRoZSBjdXJzb3IgdG8gc3RhcnQgdGhlIHBhZ2UgYXRcbiAgICAgICAgJG93bmVyOiAnU3RyaW5nIScsICAvLyBUaGUgb3JnYW5pemF0aW9uIHRvIHF1ZXJ5IGZvclxuICAgICAgICAkbmFtZTogJ1N0cmluZyEnLCAgIC8vIFRoZSByZXBvc2l0b3J5IHRvIHF1ZXJ5IGZvclxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgcmVwb3NpdG9yeTogcGFyYW1zKHtvd25lcjogJyRvd25lcicsIG5hbWU6ICckbmFtZSd9LCB7XG4gICAgICAgICAgcHVsbFJlcXVlc3RzOiBwYXJhbXMoXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBmaXJzdDogJyRmaXJzdCcsXG4gICAgICAgICAgICAgICAgYWZ0ZXI6ICckYWZ0ZXInLFxuICAgICAgICAgICAgICAgIHN0YXRlczogYE9QRU5gLFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbm9kZXM6IFtwclNjaGVtYV0sXG4gICAgICAgICAgICAgICAgcGFnZUluZm86IHtcbiAgICAgICAgICAgICAgICAgIGhhc05leHRQYWdlOiB0eXBlcy5ib29sZWFuLFxuICAgICAgICAgICAgICAgICAgZW5kQ3Vyc29yOiB0eXBlcy5zdHJpbmcsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgfSksXG4gICAgICAgIH0pXG4gICAgICB9KTtcbiAgY29uc3QgcXVlcnkgPSBncmFwaHFsUXVlcnkoJ21lbWJlcnMnLCBQUlNfUVVFUlkpO1xuXG4gIC8qKlxuICAgKiBHZXRzIHRoZSBxdWVyeSBhbmQgcXVlcnlQYXJhbXMgZm9yIGEgc3BlY2lmaWMgcGFnZSBvZiBlbnRyaWVzLlxuICAgKi9cbiAgY29uc3QgcXVlcnlCdWlsZGVyID0gKGNvdW50OiBudW1iZXIsIGN1cnNvcj86IHN0cmluZykgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBxdWVyeSxcbiAgICAgIHBhcmFtczoge1xuICAgICAgICBhZnRlcjogY3Vyc29yIHx8IG51bGwsXG4gICAgICAgIGZpcnN0OiBjb3VudCxcbiAgICAgICAgb3duZXIsXG4gICAgICAgIG5hbWUsXG4gICAgICB9LFxuICAgIH07XG4gIH07XG5cbiAgLy8gVGhlIGN1cnJlbnQgY3Vyc29yXG4gIGxldCBjdXJzb3I6IHN0cmluZ3x1bmRlZmluZWQ7XG4gIC8vIElmIGFuIGFkZGl0aW9uYWwgcGFnZSBvZiBtZW1iZXJzIGlzIGV4cGVjdGVkXG4gIGxldCBoYXNOZXh0UGFnZSA9IHRydWU7XG4gIC8vIEFycmF5IG9mIHBlbmRpbmcgUFJzXG4gIGNvbnN0IHByczogQXJyYXk8UHJTY2hlbWE+ID0gW107XG5cbiAgLy8gRm9yIGVhY2ggcGFnZSBvZiB0aGUgcmVzcG9uc2UsIGdldCB0aGUgcGFnZSBhbmQgYWRkIGl0IHRvIHRoZVxuICAvLyBsaXN0IG9mIFBSc1xuICB3aGlsZSAoaGFzTmV4dFBhZ2UpIHtcbiAgICBjb25zdCB7cXVlcnksIHBhcmFtc30gPSBxdWVyeUJ1aWxkZXIoMTAwLCBjdXJzb3IpO1xuICAgIGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBncmFwaHFsKHF1ZXJ5LCBwYXJhbXMpIGFzIHR5cGVvZiBQUlNfUVVFUlk7XG5cbiAgICBwcnMucHVzaCguLi5yZXN1bHRzLnJlcG9zaXRvcnkucHVsbFJlcXVlc3RzLm5vZGVzKTtcbiAgICBoYXNOZXh0UGFnZSA9IHJlc3VsdHMucmVwb3NpdG9yeS5wdWxsUmVxdWVzdHMucGFnZUluZm8uaGFzTmV4dFBhZ2U7XG4gICAgY3Vyc29yID0gcmVzdWx0cy5yZXBvc2l0b3J5LnB1bGxSZXF1ZXN0cy5wYWdlSW5mby5lbmRDdXJzb3I7XG4gIH1cbiAgcmV0dXJuIHBycztcbn1cbiJdfQ==