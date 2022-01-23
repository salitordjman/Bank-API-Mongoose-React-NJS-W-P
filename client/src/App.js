import { useState } from "react";
import myApi from "./api/Api";

function App() {
  const [allUsers, setAllUsers] = useState(false);

  console.log(process.env.NODE_ENV);

  const getReq = async () => {
    const { data } = await myApi.get("/users");
    console.log(data);
    // setAllUsers(data);
  };
  return (
    <div>
      <h1>Bank-API</h1>

      <button onClick={getReq}>get all users</button>
      {/* {allUsers} */}
    </div>
  );
}

export default App;
