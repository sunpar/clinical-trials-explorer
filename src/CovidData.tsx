import * as React from 'react';
import { Spinner, Pane, InlineAlert } from 'evergreen-ui';

import { isPresent, onlyUnique } from './Utils';

const Timeline = ({ status }: { status: any[] }): React.ReactElement => {
  const startDates = status
    .map(entry => {
      const startDate =
        entry.Study?.ProtocolSection?.StatusModule?.StartDateStruct?.StartDate;
      let formattedDate = startDate;
      // eslint-disable-next-line no-restricted-globals
      if (startDate && isNaN(new Date(startDate).getTime())) {
        const midMonth = startDate.split(' ');
        const newDate = `${midMonth[0]} 15, ${midMonth[1]}`;
        formattedDate = new Date(newDate);
      }
      if (startDate) formattedDate = new Date(startDate);
      return {
        ...entry,
        formattedDate,
      };
    })
    .filter(entry => isPresent(entry.formattedDate))
    .sort((a, b) => a.formattedDate.getTime() - b.formattedDate.getTime());
  console.log(startDates, status);
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
  // console.log(data);
  return (
    <Pane elevation={1} padding={24} marginBottom={8} background="#FFFFFF">
      {data.length < 1 && <LoadingTrialData />}
      {data.length > 0 && (
        <>
          <Timeline
            status={data.map(entry => entry).filter(isPresent)}
          ></Timeline>
        </>
      )}
    </Pane>
  );
};
