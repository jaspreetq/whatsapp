function stringTrimmer(str) {
  return str.length > 17 ? `${str.slice(0, 15)}...` : str;
}

export default stringTrimmer;
