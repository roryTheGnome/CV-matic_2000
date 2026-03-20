import Link from "next/link";

export default function Dashboard(){
    return(
        <div className="h-screen flex flex-col justify-between">
            <div className="flex flex-col ">
                <Link href="../users">Employees</Link>
                <Link href="../skills">Skills</Link>
                <Link href="../languages">Languages</Link>
                <Link href="../cvs">CVs</Link>
            </div>
            <div className="flex flex-col justify-between">
                <h1>Employee HERE</h1>
            </div>

        </div>
    )
}