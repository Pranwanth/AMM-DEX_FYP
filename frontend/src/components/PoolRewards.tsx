interface PoolRewardsProps {
  className?: string
}

const PoolRewards = ({ className }: PoolRewardsProps) => {
  return (
    <div className={`mx-auto rounded-md border border-gray-400 p-2 ${className ?? ""}`}>
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
          />
        </svg>
        <div className="font-bold">Pool Rewards</div>
      </div>
      <div className="text-gray-500">
        Liquidity providers earn a 0.3% fee on all trades proportional to
        their share of the pool. Fees are added to the pool, accrue in real time
        and can be claimed by withdrawing your liquidity
      </div>
    </div>
  )
}

export default PoolRewards