/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/dev-infra-private/pr/merge/cli" />
import { Arguments, Argv } from 'yargs';
/** Builds the options for the merge command. */
export declare function buildMergeCommand(yargs: Argv): Argv;
/** Handles the merge command. i.e. performs the merge of a specified pull request. */
export declare function handleMergeCommand(args: Arguments): Promise<void>;