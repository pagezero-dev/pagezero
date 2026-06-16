export const Logo = ({ className }: { className?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 400 400"
      className={className}
    >
      <title>PageZERO logo</title>
      <rect width="400" height="400" fill="#fff" rx="100" />
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="30"
        d="m95.833 95.833 208.334 208.334M161.979 103.021a104.168 104.168 0 0 1 134.896 135"
      />
      <path
        stroke="#000"
        strokeLinecap="square"
        strokeLinejoin="round"
        strokeWidth="30"
        d="M273.75 273.75A104.292 104.292 0 0 1 200 304.298a104.304 104.304 0 0 1-73.75-30.548A104.292 104.292 0 0 1 95.702 200a104.295 104.295 0 0 1 30.548-73.75"
      />
    </svg>
  )
}
