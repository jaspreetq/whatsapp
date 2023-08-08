import { collection, onSnapshot, query } from "firebase/firestore";
import React from "react";
import { db } from "../../firebase";

function Users() {
  useEffect(() => {
    const q = query(collection(db, "users"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let users = [];

      QuerySnapshot.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
      });
      setUsers(users);
    });
    return () => unsubscribe();
  }, []);

  return <div>Users</div>;
}

export default Users;
