import Link from "next/link";

//TODO make it pretty
export default function Nav(){
    return(
        <nav className="h-full flex flex-col justify-between p-4">
            <div className="flex flex-col ">
                <Link href="/users">Employees</Link>
                <Link href="/skills">Skills</Link>
                <Link href="/languages">Languages</Link>
                <Link href="/cvs">CVs</Link>
            </div>
            <div className="flex flex-col justify-between">
                <h1>Employee HERE</h1>
            </div>

        </nav>
    )
}