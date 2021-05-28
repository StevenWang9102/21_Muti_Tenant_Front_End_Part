export const getUserFullName = (value) =>{
    let userFullName = value.firstName;
      if (value.middleName) userFullName += ' ' + value.middleName;
      if (value.lastName) userFullName += ' ' + value.lastName;
      return userFullName
  }