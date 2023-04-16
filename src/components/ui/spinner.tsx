export default function Spinner({ className }: { className?: string }) {
    return (
        <div
            style={{ borderTopColor: "#9CA3AF" }}
            className={
                "animate-spin ease-linear border-2 border-gray-200 h-5 w-5 rounded-full " +
                (className || "")
            }
        ></div>
    )
}
