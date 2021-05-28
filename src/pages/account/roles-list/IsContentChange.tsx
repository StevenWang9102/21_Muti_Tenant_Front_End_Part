export const IsContentChangedOrNot = (initialValue: string | undefined, currentValue: string | undefined ) => {
    if(currentValue === undefined ) return false;
    else if(currentValue === initialValue ) return false;
    else return true;
}

