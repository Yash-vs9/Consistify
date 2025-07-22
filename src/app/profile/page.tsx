// app/page.tsx (or any route)
import React from 'react'

async function getUsers() {
  const res = await fetch('http://localhost:8080/users', {
    cache: 'no-store',
  });
  return res.json();
}

const Page = async () => {
  const users = await getUsers();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      {users.map((user: any) => (
        <div key={user} className="p-2 border-b">
          {user}
        </div>
      ))}
    </div>
  )
}

export default Page