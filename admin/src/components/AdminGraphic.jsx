import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { useGrafica } from '../hooks/useGrafica'

const chartConfig = {
  jugadores: {
    label: 'Jugadores',
    color: '#3A59D1'
  },
  porristas: {
    label: 'Porristas',
    color: '#3D90D7'
  }
}

export const AdminGraphic = () => {
  const { chartData } = useGrafica()

  return (
    <div className='lg:col-span-2 bg-white rounded-lg shadow p-4'>
      <ResponsiveContainer height={360}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis
            dataKey='month'
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey='jugadores'
            fill={chartConfig.jugadores.color}
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey='porristas'
            fill={chartConfig.porristas.color}
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
