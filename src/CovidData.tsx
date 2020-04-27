import * as React from 'react';
import { Spinner, Pane, InlineAlert } from 'evergreen-ui';

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
  console.log(data, timeStamp.getTime());
  React.useEffect(() => {
    const fetchData = async (): Promise<any[]> => {
      const resps = await dataPromises;
      const respsJson = await Promise.all(resps.map(res => res.json()));
      const covidTrialData = respsJson.reduce((total, curr) => {
        console.log(curr);
        return total.concat(...curr.FullStudiesResponse.FullStudies);
      }, []);
      setData(covidTrialData);
      return respsJson;
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeStamp.getTime()]);
  return (
    <Pane elevation={1} padding={24} marginBottom={8} background="#FFFFFF">
      {data.length < 1 && <LoadingTrialData />}
    </Pane>
  );
};
