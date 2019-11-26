interface IInterfaceInput {
  a: string;
}

interface IInterfaceOutput {
  a: string;
  b: string;
}

function foo(input: IInterfaceInput): IInterfaceOutput {
  return {
    ...input,
    b: "b"
  };
}
