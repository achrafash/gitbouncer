import type { FC } from "react"

function range(number: number) {
    return Array.from(new Array(number), (x, i) => i)
}

interface SkeletonProps {
    count?: number
    className?: string
}

const Skeleton: FC<SkeletonProps> = ({ className = "", count = 1 }) => {
    const baseClass =
        "bg-gradient-to-r from-slate-900 to-slate-700 rounded animate-pulse mb-2"
    return (
        <div>
            {range(count).map((el) => (
                <div key={el} className={[baseClass, className].join(" ")} />
            ))}
        </div>
    )
}

export default Skeleton
