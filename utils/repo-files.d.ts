/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/// <amd-module name="@angular/dev-infra-private/utils/repo-files" />
/**
 * A list of all files currently in the repo which have been modified since the provided sha.
 *
 * git diff
 * Deleted files (--diff-filter=d) are not included as they are not longer present in the repo
 * and can not be checked anymore.
 *
 * git ls-files
 * Untracked files (--others), which are not matched by .gitignore (--exclude-standard)
 * as they are expected to become tracked files.
 */
export declare function allChangedFilesSince(sha?: string): string[];
/**
 * A list of all staged files which have been modified.
 *
 * Only added, created and modified files are listed as others (deleted, renamed, etc) aren't
 * changed or available as content to act upon.
 */
export declare function allStagedFiles(): string[];
export declare function allFiles(): string[];
