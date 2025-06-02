export default function ProductSection({children}){
    return (
        <div className="mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 justify-items-center bg-indigo-950">
                {children}
            </div>
        </div>
    )
}