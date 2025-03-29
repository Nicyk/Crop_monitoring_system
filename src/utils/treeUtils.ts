import { TreeDataNode } from "antd";

// utils/treeUtils.ts
export const generateData = (
  levels: number,
  prefix: string = "0",
  nodes: TreeDataNode[] = []
): TreeDataNode[] => {
  if (levels < 0) return nodes;

  for (let i = 0; i < 3; i++) {
    const key = `${prefix}-${i}`;
    const node: TreeDataNode = { title: key, key };
    nodes.push(node);

    if (i < 2 && levels > 0) {
      node.children = [];
      generateData(levels - 1, key, node.children);
    }
  }
  return nodes;
};

export const generateFlatList = (
  nodes: TreeDataNode[]
): { key: string; title: string }[] => {
  return nodes.reduce((acc, node) => {
    acc.push({ key: node.key as string, title: node.key as string });
    if (node.children) acc.push(...generateFlatList(node.children));
    return acc;
  }, [] as { key: string; title: string }[]);
};

export const findNodeByKey = (
  key: React.Key,
  nodes: TreeDataNode[]
): TreeDataNode | null => {
  for (const node of nodes) {
    if (node.key === key) return node;
    if (node.children) {
      const found = findNodeByKey(key, node.children);
      if (found) return found;
    }
  }
  return null;
};
