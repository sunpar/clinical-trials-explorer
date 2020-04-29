import * as React from 'react';
import { rollups } from 'd3-array';
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';

const MARGINS = { top: 20, right: 20, bottom: 30, left: 40 };

const HEIGHT = 500;

export const ReBarChart = ({
  data,
}: {
  data: string[];
}): React.ReactElement => {
  const groupedData = rollups(
    data,
    d => d.length,
    d => d,
  );
  console.log(groupedData);
  return (
    <BarChart
      height={250}
      data={data}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
    >
      <CartesianGrid strokeDasharray="1 1" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Bar dataKey="pv" fill="#8884d8" />
      <Bar dataKey="uv" fill="#82ca9d" />
    </BarChart>
  );
};
