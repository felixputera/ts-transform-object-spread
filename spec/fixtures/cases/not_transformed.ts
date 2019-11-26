interface INotTransformedStringKey {
  a: string;
  [key: string]: string;
}

interface INotTransformedFoo {
  b: string;
}

function bar(first: INotTransformedStringKey, second: INotTransformedFoo) {
  const temp = {
    ...first,
    ...second
  };

  return {
    ...temp
  };
}

function anyInput(input: any) {
  return { ...input };
}
