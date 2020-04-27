import * as React from 'react';
import { Spinner } from 'evergreen-ui';
import 'whatwg-fetch'; // fetch polyfill
import 'mobx-react-lite/batchingForReactDom';

import { FindCovidTrials } from './FindCovidTrials';

export default (): React.ReactElement => {
  return (
    <div className="h-full flex flex-col bg-gray-100 container mx-auto py-4">
      <React.Suspense fallback={<Spinner />}>
        <FindCovidTrials></FindCovidTrials>
      </React.Suspense>
    </div>
  );
};
