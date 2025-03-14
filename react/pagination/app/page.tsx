"use client";
import {useEffect, useState, useMemo} from "react";

interface Log {
  id: number;
  title: string;
}

export default function Home() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("")
  const [limit, setLimit] = useState(10)
  const [loading, setLoading] = useState(false)

  // useMemo to only perform math when limit changes
  let numPages = useMemo(() => Math.ceil(100 / limit), [limit])
  console.log("numPages: ", numPages)
  
  useEffect(() => {
    async function fetchLogs() {
      setLoading(true);
      try {
        console.log("Fetching log data...")
        const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}`);
      
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json()
        console.log(data);

        setLogs(data) // update state with fetched variable
      } catch(error) {
        console.error("An error occurred: ", error)
      }
      setLoading(false);
    };

    fetchLogs()
  }, [page, limit]); // Dependency array, effect runs when 'page' variable changes

  const filteredLogsLogs = useMemo(() => {
    return logs.filter((log) =>
      log.title.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [logs, searchInput])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black">
      <div className="text-2xl font-bold">Pagination logs</div>
      <div className="px-2">
        {/* Search bar */}
        <input
          type="text"
          className="px-4 py-2 border mb-2 mt-4"
          placeholder="Search logs..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {/* Limit selection dropdown */}
        <select
          className="px-4 py-2 border bg-gray-700"
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
        >
          {[...Array(11).keys()].map((_limit) => (
            <option key={_limit} value={_limit + 5}>
              {_limit + 5} per page
            </option>
          ))}
        </select>
      </div>
      {/* Logs filtered based on user search input */}
      <ul className="px-1 py-1">
        {filteredLogsLogs.map((log) => (
          <li key={log.id} className="px-2 py-2">
            {log.title}
          </li>
        ))}
      </ul>
      <div className="flex gap-4">
        {/* Previous button */}
        <button
          className="px-4 py-2 border bg-red-700 disabled:bg-gray-700"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        {/* Next button */}
        <button
          className="px-4 py-2 border bg-green-700 disabled:bg-gray-700"
          disabled={page > numPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
      
    </div>
  )
}

/*
1

  pagination logs
  | search | |setLimit|
  - sur       
  - su

  -dfgsdf-
  -sdf-
  -
  -

  prev  next


*/
