function getChatDbId(recieverDetails, activeUser) {
  const dbId =
    recieverDetails?.uid > activeUser?.uid
      ? recieverDetails?.uid + activeUser?.uid
      : activeUser?.uid + recieverDetails?.uid;
  return dbId;
}

export default getChatDbId;
