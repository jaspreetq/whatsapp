import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";

function SideBar() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    //?
    // const qq = query()
    // console.log("docRef ",auth.currentUser.uid)
    const q = query(
      collection(db, "users"),
      orderBy("createdAt"),
      // limit(50),
      // auth?.currentUser?.uid && where("uid","==",onSnapshot?.currentUser?.uid),
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let users = [];
      console.log("<>snapshot<>", QuerySnapshot);

      QuerySnapshot.forEach((doc) => {
        console.log("<>snapshot foreach<>", doc, doc.id, typeof doc);
        users.push({ ...doc.data(), id: doc.id });
        console.log("messages<>: ", users)
      });
      setUsers(users);
    });
    return () => unsubscribe;
  }, []);

  // const docRef = doc(db, "users");
  // const docSnap = (async () => await getDoc(docRef))();

  // if (docSnap.exists()) {
  //   console.log("Document data:", docSnap.data());
  // } else {
  //   // doc.data() will be undefined in this case
  //   console.log("No such document!");
  // }
  // console.log(users[], typeof users)
  return <>
    {users?.map((user) => {
      return (
        <li>
          {user?.email}
          <button onClick={() => console.log("sfad")}>chat</button>
        </li>
      );
    })}
  </>
}

export default SideBar;
