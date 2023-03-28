/*
  Copyright 2023 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

      https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import {recursiveFilter} from '../util.mjs';

const SHARED_PACKAGE_UIDS = [/:interface$/];
const NORMAL_PACKAGE_UIDS = SHARED_PACKAGE_UIDS.concat([
  /!protos\.google\./,
  /^@google-cloud\/common!/,
  /^google-auth-library!/,
]);

const globPatterns = ['**/toc.yml'];

// Removes unwanted items from the TOC.
function process({metadata, obj}) {
  let uidsToRemove;

  if (metadata.isSharedPackage) {
    uidsToRemove = SHARED_PACKAGE_UIDS;
  } else {
    uidsToRemove = NORMAL_PACKAGE_UIDS;
  }
  recursiveFilter(obj, 'items', 'uid', uidsToRemove);

  return Promise.resolve(obj);
}

export default {globPatterns, process};