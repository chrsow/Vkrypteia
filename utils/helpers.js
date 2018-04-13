export const truncateAddress = (address) => {
  if (!address) return address;
  
  return `${address.substring(0, 10)}...${address.substring(address.length-4)}`;
}


// Check validity of ethereum address
// https://github.com/ethereum/EIPs/issues/55#issuecomment-187765837


export const isAddress = (address) => {
  // function isAddress(address) {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
      // check if it has the basic requirements of an address
      return false;
  } else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
      // If it's all small caps or all all caps, return "true
      return true;
  } else {
      // Otherwise check each case
    // return isChecksumAddress(address);
    return true;
  }
}
