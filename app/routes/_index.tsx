import { db } from "../../src/drizzle";
import { todo } from "../../src/todo.sql";

import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  let result = await db.select().from(todo).execute();
  return json({ result });
};

export default function Index() {
  const { result } = useLoaderData<typeof loader>();

  return (
    <div className="xl:pl-72">
      {result ? (
        <ul>
          {result.map((item: any) => (
            <li className="text-white" key={item.id}>{item.id}</li>
          ))}
        </ul>
      ) : (
        <p>loading...</p>
      )}
    </div>
  );
}
