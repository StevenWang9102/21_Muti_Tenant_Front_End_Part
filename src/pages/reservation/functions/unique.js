export const unique = (arr) =>{

  console.log('unique48', arr);
  
const temp = []

arr.forEach(each=>{
  const names = temp.map(each=>each.name)
  console.log('unique48,names', names);

  if(names.includes(each.name)){
    // temp.push({
    //   name: each.name,
    //   id: [...[each.id, ...[]]]
    // })

  } else {
    temp.push({
      name: each.name,
      id: [each.id]
    })
  } 
})
 
}
  