async function getComponentOrInstanceProperties() {
  const node = figma.currentPage.selection[0];

  if (!node) {
    figma.closePlugin();
    return { error: "No node selected." };
  }

  const result = {
    nodeType: node.type,
    name: node.name,
    properties: {}
  };

  if (node.type === "INSTANCE") {
    const main = await node.getMainComponentAsync();
    result.mainComponent = main ? main.name : "Unknown component";

    const props = node.componentProperties;
    if (props) {
      // Sort property names alphabetically
      Object.keys(props)
        .sort()
        .forEach((propName) => {
          const propInfo = props[propName];
          result.properties[propName] = {
            type: propInfo.type,
            value: propInfo.value,
            bound: propInfo.boundVariable ? propInfo.boundVariable.id : null
          };
        });
    }
  } else if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
    const defs = node.componentPropertyDefinitions;
    if (defs) {
      // Sort property names alphabetically
      Object.keys(defs)
        .sort()
        .forEach((propName) => {
          result.properties[propName] = {
            type: defs[propName].type
          };
        });
    }
  } else {
    result.error = "Selected node is not a component, component set, or instance.";
  }

  figma.closePlugin();
  return result;
}

// Run and store the result
getComponentOrInstanceProperties().then((res) => {
  console.log(res); // JSON object
});
