export default function LiveLayout({ children }: { children: React.ReactNode }) {
    return <div className="w-full flex items-center justify-center mt-[12px] p-2">
        <div
            className="flex flex-col items-center justify-center w-full p-2 h-max rounded-[8px] shadow-2xl md:w-[80%] md:p-4 md:shadow-xl"
        >
            {children}
        </div>
    </div>
}