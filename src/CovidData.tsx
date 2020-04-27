import * as React from 'react';
import { Spinner, Pane, InlineAlert } from 'evergreen-ui';

import { isPresent } from './Utils';

const Timeline = ({ status }: { status: any[] }): React.ReactElement => {
  const startDates = status.map(entry => entry.StartDateStruct.StartDate);
  const startDateType = status.map(
    entry => entry.StartDateStruct.StartDateType,
  );
  console.log(startDates, startDateType);
  return <></>;
};

const LoadingTrialData = (): React.ReactElement => {
  return (
    <>
      <InlineAlert intent="warning" marginBottom={16}>
        Loading Data on Trials...
      </InlineAlert>
      <Spinner></Spinner>
    </>
  );
};

export const CovidData = ({
  timeStamp,
  dataPromises,
}: {
  timeStamp: Date;
  dataPromises: Promise<Response[]>;
}): React.ReactElement => {
  const [data, setData] = React.useState<any[]>([]);
  React.useEffect(() => {
    const fetchData = async (): Promise<any[]> => {
      const resps = await dataPromises;
      const respsJson = await Promise.all(resps.map(res => res.json()));
      const covidTrialData = respsJson.reduce((total, curr) => {
        return total.concat(...curr.FullStudiesResponse.FullStudies);
      }, []);
      setData(covidTrialData);
      return respsJson;
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeStamp.getTime()]);
  console.log(data);
  return (
    <Pane elevation={1} padding={24} marginBottom={8} background="#FFFFFF">
      {data.length < 1 && <LoadingTrialData />}
      {data.length > 0 && (
        <>
          <Timeline
            status={data
              .map(entry => entry.Study?.ProtocolSection?.StatusModule)
              .filter(isPresent)}
          ></Timeline>
        </>
      )}
    </Pane>
  );
};
