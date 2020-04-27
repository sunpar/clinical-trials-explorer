import * as React from 'react';
import useFetch from 'fetch-suspense';
import { Pane, Alert, Text } from 'evergreen-ui';

import { CovidData } from './CovidData';

const covidTrials =
  'https://ClinicalTrials.gov/api/query/full_studies?expr=covid&fmt=JSON';

export const FindCovidTrials = (): React.ReactElement => {
  const response = useFetch(covidTrials);
  const { FullStudiesResponse: studyData } = JSON.parse(response as string);
  const {
    NStudiesAvail: totalStudies,
    NStudiesFound: covidStudies,
  } = studyData;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const timeStamp = React.useMemo(() => new Date(), [covidStudies]);
  const dataRetrieval = Array.from(
    Array(Math.ceil(covidStudies / 100)).keys(),
  ).map(entry => {
    return fetch(
      `https://ClinicalTrials.gov/api/query/full_studies?expr=covid&fmt=JSON&min_rnk=${entry *
        100 +
        1}&max_rnk=${entry * 100 + 100}`,
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );
  });

  return (
    <>
      <Alert
        intent="none"
        title={`Data Retrieved ${timeStamp.toLocaleString()}`}
        marginBottom={8}
      />
      <Pane elevation={1} padding={24} marginBottom={8} background="#FFFFFF">
        <Pane display="flex" flexDirection="row" justifyContent="space-around">
          <Pane
            float="left"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Text>{totalStudies.toLocaleString()}</Text>
            <Text size={300}>Total Clinical Trials in Dataset</Text>
          </Pane>
          <Pane
            float="left"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Text>{studyData.NStudiesFound.toLocaleString()}</Text>
            <Text size={300}>Trials Related to COVID-19</Text>
          </Pane>
        </Pane>
      </Pane>
      <CovidData
        dataPromises={Promise.all(dataRetrieval)}
        timeStamp={timeStamp}
      ></CovidData>
    </>
  );
};
