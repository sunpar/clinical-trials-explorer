import * as React from 'react';
import * as moment from 'moment';
import { Spinner, Pane, InlineAlert, Text, Alert } from 'evergreen-ui';

import { isPresent } from './Utils';
import { ReBarChart } from './Data Viz/barChart';

const maxStudyStartDate = new Date('12/20/2019').getTime();

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
    .filter(
      entry =>
        isPresent(entry.formattedDate) &&
        entry.formattedDate.getTime() >= maxStudyStartDate,
    )
    .sort((a, b) => a.formattedDate.getTime() - b.formattedDate.getTime());

  return (
    <>
      <Pane display="flex" flexDirection="row">
        <Pane
          float="left"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text>{startDates.length.toLocaleString()}</Text>
          <Text size={300}>Trials with Valid Start Dates</Text>
        </Pane>
        <Pane
          float="left"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Text size={300}>Trials per Start Date</Text>
          <ReBarChart
            data={startDates.map(entry =>
              moment(entry.formattedDate)
                .startOf('week')
                .format('MMM Do YYYY')
                .toString(),
            )}
          ></ReBarChart>
        </Pane>
      </Pane>
    </>
  );
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
  const [apiDate, setAPIDate] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const fetchData = async (): Promise<any[]> => {
      const resps = await dataPromises;
      const respsJson = await Promise.all(resps.map(res => res.json()));
      const dateArray = respsJson[0].FullStudiesResponse.DataVrs.split(' ');
      dateArray[0] = dateArray[0].replace(/:/g, '-');
      const dateString = `${dateArray.join('T')}Z`;
      setAPIDate(new Date(dateString));
      const covidTrialData = respsJson.reduce((total, curr) => {
        return total.concat(...curr.FullStudiesResponse.FullStudies);
      }, []);
      setData(covidTrialData);
      return respsJson;
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeStamp.getTime()]);

  return (
    <>
      <Alert
        intent="none"
        title={`Data Updated ${apiDate?.toLocaleString()}`}
        marginBottom={8}
      />
      <Pane elevation={1} padding={24} marginBottom={8} background="#FFFFFF">
        {data.length < 1 && <LoadingTrialData />}
        {data.length > 0 && (
          <Timeline status={data.filter(isPresent)}></Timeline>
        )}
      </Pane>
    </>
  );
};
