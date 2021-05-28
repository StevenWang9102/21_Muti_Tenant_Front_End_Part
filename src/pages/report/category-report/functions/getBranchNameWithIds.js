export const getBranchNameWithIds = (source) => {
  let branchNameWithIds = {};

  source && source.forEach((each, index) => {
    branchNameWithIds[each.shortName] = each.id;
  });
  return branchNameWithIds;
};


export const getItemNameWithIds = (source) => {
  let itemNameWithIds = [];

  source && source.forEach((each, index) => {
    itemNameWithIds.push({
      itemId: each.id,
      itemName: each.name
    })
  });
  return itemNameWithIds;
};

export const searchItemNameWithIds = (source) => {
  let itemNameWithIds = {};

  source && source.forEach((each)=>{
    itemNameWithIds[each.name] = each.id
  })
 
  return itemNameWithIds;
};
