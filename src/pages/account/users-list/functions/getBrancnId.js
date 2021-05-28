export const getBrancnId = (allBranchInformation, shortName) => {
  const newBranchNameList = {}
  allBranchInformation.forEach(element => {
    newBranchNameList[element.shortName] = element.id
  });
  return newBranchNameList[shortName]
}
