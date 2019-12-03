import * as ts from "typescript";

const fullyInitializedObjExprs = new Map<ts.Expression, boolean>();

export default function transformer(
  program: ts.Program
): ts.TransformerFactory<ts.SourceFile> {
  const checker = program.getTypeChecker();

  return context => {
    const visit: ts.Visitor = node => {
      if (
        ts.isSpreadAssignment(node) &&
        ts.isObjectLiteralExpression(node.parent)
      ) {
        const type = checker.getTypeAtLocation(node.expression);
        const properties = checker.getPropertiesOfType(type);

        if (
          isSeenObject(node.expression) ||
          isFullyDefinedObject(type, properties)
        ) {
          objectFullyDefined(node.parent);

          return properties.map(prop =>
            propertyAssignmentFromSpreadProperty(
              prop,
              node.expression.getText()
            )
          );
        }

        objectNotFullyDefined(node.parent);

        return node;
      }
      return ts.visitEachChild(node, child => visit(child), context);
    };

    return node => ts.visitNode(node, visit);
  };
}

function isSeenObject(identifier: ts.Expression): boolean {
  if (ts.isIdentifier(identifier)) {
    // flowNode here is an internal API https://github.com/microsoft/TypeScript/blob/7c14aff09383f3814d7aae1406b5b2707b72b479/src/compiler/types.ts#L649
    const node =
      // @ts-ignore
      identifier.flowNode &&
      // @ts-ignore
      identifier.flowNode.node &&
      // @ts-ignore
      (identifier.flowNode.node.initializer as ts.Expression);

    if (node) {
      return !!fullyInitializedObjExprs.get(node);
    }
  }
  return false;
}

function objectFullyDefined(expr: ts.ObjectLiteralExpression): void {
  if (!fullyInitializedObjExprs.has(expr)) {
    fullyInitializedObjExprs.set(expr, true);
  }
}

function objectNotFullyDefined(expr: ts.ObjectLiteralExpression): void {
  fullyInitializedObjExprs.set(expr, false);
}

function isFullyDefinedObject(type: ts.Type, properties: ts.Symbol[]) {
  const members = type.getSymbol() && type.getSymbol()!.members;

  return (
    type.getFlags() === ts.TypeFlags.Object &&
    members &&
    members.size == properties.length
  );
}

function propertyAssignmentFromSpreadProperty(
  property: ts.Symbol,
  sourceObjectName: string
): ts.PropertyAssignment {
  return ts.createPropertyAssignment(
    property.name,
    ts.createPropertyAccess(
      ts.createIdentifier(sourceObjectName),
      ts.createIdentifier(property.name)
    )
  );
}
