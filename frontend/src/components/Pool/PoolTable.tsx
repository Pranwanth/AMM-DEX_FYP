import React from 'react'
import AddLiquidityButton from './AddLiquidityButton'
import { PoolTableRow } from '../GlobalTypes'

interface PoolTableProps {
  tableRows: PoolTableRow[]
}

const PoolTable: React.FC<PoolTableProps> = (props: PoolTableProps) => {
  const { tableRows } = props

  return (
    <div className="overflow-x-auto relative mt-10">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase text-secondaryText">
          <tr>
            <th scope="col" className="py-3 px-6">
              Name
            </th>
            <th scope="col" className="py-3 px-6">
              Liquidity
            </th>
            <th scope="col" className="py-3 px-6 text-right">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="text-primaryText">
          {tableRows.map((row) => (
            <tr className="border-b hover:bg-gray-100" key={`pool_table_row-${row.token0 < row.token1 ? row.token0.concat(row.token1) : row.token1.concat(row.token0)}`}>
              <td className="py-4 px-6">
                {row.name}
              </td>
              <td className="py-4 px-6">
                {row.liquidity.toString(10)}
              </td>
              <td className="py-4 px-6 text-right">
                <AddLiquidityButton className="max-w-40" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default PoolTable